import { SupabaseClient } from '@supabase/supabase-js';

export interface UserCVProfile {
  fullName?: string;
  currentTitle?: string;
  targetRole?: string;
  skills?: string[];
  summary?: string;
  atsScore?: number;
  experienceYears?: number;
  experiences?: Array<{ role: string; company: string; dates?: string; bullets?: string[] }>;
  projects?: Array<{ title: string; tech?: string[]; bullets?: string[] }>;
}

export interface RankedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  work_type?: string;
  is_remote?: boolean;
  required_skills: string[];
  matchingSkills: string[];
  missingSkills: string[];
  matchScore: number;
  apply_url?: string;
}

export interface CopilotContext {
  userName: string;
  targetRole: string;
  userSkills: string[];
  cvSummary: string;
  atsScore?: number;
  experiencesCount: number;
  projectsCount: number;
  topRankedJobs: RankedJob[];
  recentHistorySummary: string;
  currentPageContext?: string;
  hasCv: boolean;
}

export async function buildCopilotContext(
  supabase: SupabaseClient | null,
  userId: string,
  userName: string,
  rawBody: any
): Promise<CopilotContext> {
  let targetRole = rawBody.user?.targetRole || 'Data Analyst';
  let userSkills: string[] = [];
  let cvSummary = '';
  let atsScore: number | undefined;
  let experiencesCount = 0;
  let projectsCount = 0;
  let hasCv = false;

  // 1. Check active CV from client payload first
  if (rawBody.activeCv) {
    const acv = rawBody.activeCv;
    hasCv = true;
    targetRole = acv.currentTitle || acv.targetRole || targetRole;
    userSkills = Array.isArray(acv.skills) ? acv.skills : [];
    cvSummary = acv.summary || '';
    experiencesCount = Array.isArray(acv.experiences) ? acv.experiences.length : 0;
    projectsCount = Array.isArray(acv.projects) ? acv.projects.length : 0;
    if (acv.atsReport?.score) atsScore = acv.atsReport.score;
  } else if (supabase && userId && !userId.startsWith('guest')) {
    // 2. Fetch from DB
    try {
      const { data: cvDoc } = await supabase
        .from('cv_documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cvDoc) {
        hasCv = true;
        targetRole = cvDoc.target_role || targetRole;
        userSkills = Array.isArray(cvDoc.parsed_skills) ? cvDoc.parsed_skills : [];
        cvSummary = cvDoc.summary || '';
        atsScore = cvDoc.ats_score || undefined;
        experiencesCount = Array.isArray(cvDoc.experiences) ? cvDoc.experiences.length : 0;
        projectsCount = Array.isArray(cvDoc.projects) ? cvDoc.projects.length : 0;
      }
    } catch (e) {
      console.warn('Context builder CV fetch notice:', e);
    }
  }

  // 3. Deterministic Job Ranking against User Skills and Target Role
  const rankedJobs: RankedJob[] = [];
  if (supabase) {
    try {
      const { data: liveJobs } = await supabase
        .from('jobs')
        .select('id, title, company, location, work_type, is_remote, required_skills, apply_url')
        .order('posted_at', { ascending: false })
        .limit(100);

      if (liveJobs && liveJobs.length > 0) {
        const userSkillSet = new Set(userSkills.map((s) => s.toLowerCase().trim()));
        const targetLower = targetRole.toLowerCase();

        for (const j of liveJobs) {
          const titleLower = (j.title || '').toLowerCase();
          const reqSkills = Array.isArray(j.required_skills) ? j.required_skills : [];
          const matching: string[] = [];
          const missing: string[] = [];

          for (const s of reqSkills) {
            const sLower = s.toLowerCase().trim();
            if (userSkillSet.has(sLower) || Array.from(userSkillSet).some(us => us.includes(sLower) || sLower.includes(us))) {
              matching.push(s);
            } else {
              missing.push(s);
            }
          }

          // Role relevance check
          let roleMatch = false;
          if (
            (targetLower.includes('data') || targetLower.includes('bi') || targetLower.includes('analyst')) &&
            (titleLower.includes('data') || titleLower.includes('bi') || titleLower.includes('analyst') || titleLower.includes('analytics'))
          ) {
            roleMatch = true;
          } else if (
            (targetLower.includes('ml') || targetLower.includes('machine learning') || targetLower.includes('ai')) &&
            (titleLower.includes('ai') || titleLower.includes('machine learning') || titleLower.includes('data') || titleLower.includes('vision'))
          ) {
            roleMatch = true;
          } else if (
            (targetLower.includes('developer') || targetLower.includes('engineer') || targetLower.includes('software') || targetLower.includes('frontend') || targetLower.includes('backend')) &&
            (titleLower.includes('developer') || titleLower.includes('engineer') || titleLower.includes('software') || titleLower.includes('frontend') || titleLower.includes('backend'))
          ) {
            roleMatch = true;
          }

          // Calculate score
          let baseScore = reqSkills.length > 0
            ? Math.round((matching.length / reqSkills.length) * 70)
            : 30;

          if (roleMatch) baseScore += 25;
          if (matching.length > 2) baseScore += 10;
          const score = Math.min(98, Math.max(20, baseScore));

          // Only include if there is some relevance
          if (roleMatch || matching.length > 0) {
            rankedJobs.push({
              id: j.id,
              title: j.title,
              company: j.company,
              location: j.location || 'Cairo, Egypt',
              work_type: j.work_type,
              is_remote: j.is_remote,
              required_skills: reqSkills,
              matchingSkills: matching,
              missingSkills: missing,
              matchScore: score,
              apply_url: j.apply_url,
            });
          }
        }

        // Sort descending by match score
        rankedJobs.sort((a, b) => b.matchScore - a.matchScore);
      }
    } catch (e) {
      console.warn('Context builder jobs fetch notice:', e);
    }
  }

  // 4. Conversation History Summary (last 6 messages)
  let recentHistorySummary = '';
  if (Array.isArray(rawBody.recentMessages) && rawBody.recentMessages.length > 0) {
    const recent = rawBody.recentMessages.slice(-6);
    recentHistorySummary = recent
      .map((m: any) => `${m.role === 'user' ? 'User' : 'Copilot'}: ${(m.content || m.text || '').slice(0, 200)}`)
      .join('\n');
  }

  return {
    userName,
    targetRole,
    userSkills,
    cvSummary,
    atsScore,
    experiencesCount,
    projectsCount,
    topRankedJobs: rankedJobs.slice(0, 6),
    recentHistorySummary,
    currentPageContext: rawBody.currentPage || '/copilot',
    hasCv,
  };
}

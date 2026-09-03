import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { JobItem } from '@/data/jobs';
import type { JobDataQuality, SkillSource } from '@/lib/scraper/wuzzuf';
import {
  cleanEnglishOverview,
  cleanArabicOverview,
  cleanEnglishResponsibilities,
  cleanArabicResponsibilities,
  cleanEnglishRequirements,
  cleanArabicRequirements
} from '@/utils/jobLocalization';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ─────────────────────────────────────────────────────────────────────────────
// Skill ontology: canonical aliases for normalization
// ─────────────────────────────────────────────────────────────────────────────

const SKILL_ALIASES: Record<string, string> = {
  'reactjs': 'React', 'react.js': 'React',
  'nodejs': 'Node.js', 'node js': 'Node.js',
  'postgres': 'PostgreSQL', 'postgresql': 'PostgreSQL',
  'js': 'JavaScript', 'ts': 'TypeScript',
  'powerbi': 'Power BI', 'power_bi': 'Power BI', 'msbi': 'Power BI',
  'ms sql': 'SQL Server', 'mssql': 'SQL Server',
  'vue': 'Vue.js', 'vuejs': 'Vue.js',
  'nextjs': 'Next.js', 'next.js': 'Next.js',
  'k8s': 'Kubernetes',
  'scikit': 'Scikit-Learn', 'sklearn': 'Scikit-Learn',
  'tensorflow': 'TensorFlow', 'pytorch': 'PyTorch',
  'restapi': 'REST APIs', 'rest api': 'REST APIs', 'rest': 'REST APIs',
  'bi': 'Business Intelligence',
};

const SKILL_BLACKLIST = new Set([
  'experienced', 'experience', 'senior', 'junior', 'mid level', 'expert', 'manager',
  'internship', 'intern', 'student', 'entry level', 'fresh graduate', 'fresher',
  'it', 'information technology', 'software development', 'engineering',
  'general', 'other', 'miscellaneous', 'research', 'ability', 'skills', 'knowledge',
  'strong', 'good', 'excellent', 'proficient', 'familiar', 'basic', 'advanced',
  'full time', 'part time', 'contract', 'freelance', 'remote',
  'freelance / project', 'freelance/project', 'project',
  'education/teaching', 'education / teaching', 'education', 'teaching',
  'training/instructor', 'training / instructor', 'training', 'instructor',
  'analyst/research', 'analyst / research', 'analysis', 'research',
  'computer science', 'it/software development', 'engineering - telecom/technology',
  'customer service/support', 'customer service', 'support',
  'sales/retail', 'sales', 'retail', 'accounting/finance', 'accounting', 'finance',
  'project/program management', 'project management', 'program management',
  'administration', 'human resources', 'marketing/pr/advertising',
  'communication', 'teamwork', 'leadership', 'problem solving', 'critical thinking',
  'analytical skills', 'analytical thinking', 'data analysis', 'business analysis',
  'data analytics', 'market research', 'quantitative analysis',
]);

/**
 * Semantic inference: if user knows X, they satisfy competency Y.
 * Used only when job has inferred/partial quality to avoid over-inflating score.
 */
const SKILL_INFERENCE: Record<string, string[]> = {
  'data visualization': ['power bi', 'tableau', 'matplotlib', 'excel'],
  'business intelligence': ['power bi', 'tableau', 'sql', 'excel'],
  'database management': ['sql', 'postgresql', 'mysql', 'mongodb'],
  'etl': ['python', 'sql', 'airflow', 'dbt', 'spark'],
  'machine learning': ['python', 'scikit-learn', 'tensorflow', 'pytorch'],
  'frontend development': ['react', 'vue', 'angular', 'javascript', 'typescript'],
  'backend development': ['node.js', 'python', 'django', 'flask', 'java', 'c#'],
  'cloud computing': ['aws', 'azure', 'gcp', 'google cloud'],
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const seniorityArMap: Record<string, string> = {
  Fresh: 'حديث التخرج',
  Junior: 'مبتدئ',
  Mid: 'متوسط',
  Senior: 'أول / متقدم',
};

const workTypeArMap: Record<string, string> = {
  Hybrid: 'مرن (مكتبي وعن بُعد)',
  Remote: 'عن بُعد بالكامل',
  'On-site': 'من مقر الشركة',
};

function normalizeWorkType(raw: string | null, isRemote: boolean): JobItem['workType'] {
  if (!raw) return isRemote ? 'Remote' : 'On-site';
  const l = raw.toLowerCase();
  if (l.includes('remote')) return 'Remote';
  if (l.includes('hybrid')) return 'Hybrid';
  return 'On-site';
}

function timeAgo(dateStr: string | null): { en: string; ar: string } {
  if (!dateStr) return { en: 'Recently', ar: 'مؤخراً' };
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    if (diff < 0) return { en: 'Just now', ar: 'الآن' };
    const hours = Math.floor(diff / 3_600_000);
    if (hours < 1) return { en: 'Just now', ar: 'الآن' };
    if (hours === 1) return { en: '1h ago', ar: 'منذ ساعة' };
    if (hours === 2) return { en: '2h ago', ar: 'منذ ساعتين' };
    if (hours < 24) return { en: `${hours}h ago`, ar: `منذ ${hours} ساعة` };
    const days = Math.round(hours / 24);
    if (days <= 1) return { en: '1d ago', ar: 'منذ يوم' };
    if (days === 2) return { en: '2d ago', ar: 'منذ يومين' };
    if (days <= 10) return { en: `${days}d ago`, ar: `منذ ${days} أيام` };
    if (days <= 30) return { en: `${days}d ago`, ar: `منذ ${days} يوم` };
    const months = Math.round(days / 30);
    if (months <= 1) return { en: '1mo ago', ar: 'منذ شهر' };
    if (months === 2) return { en: '2mo ago', ar: 'منذ شهرين' };
    return { en: `${months}mo ago`, ar: `منذ ${months} أشهر` };
  } catch {
    return { en: 'Recently', ar: 'مؤخراً' };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractExperienceYears(row: any): { en: string; ar: string } {
  const fullText = `${row.title || ''} ${row.description || ''} ${row.requirements || ''}`;

  // 1. Check ranges: "3-5 years", "3 to 6 Yrs", "· 3 - 5 Yrs of Exp ·", "من 3 الى 5 سنوات"
  const rangeMatch = fullText.match(/(\d+)\s*(?:-|to|إلى|الي)\s*(\d+)\s*(?:years?|yrs?|سنوات|سنة)/i) ||
                     fullText.match(/·?\s*(\d+)\s*-\s*(\d+)\s*Yrs of Exp/i);
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1], 10);
    const max = parseInt(rangeMatch[2], 10);
    if (min < 30 && max < 30 && max >= min) {
      return {
        en: `${min} - ${max} years`,
        ar: `${min} - ${max} سنوات`
      };
    }
  }

  // 2. Check plus expressions: "6+ years", "+6 years", "more than 5 years", "at least 6 years", "خبرة 6 سنوات", "خبرة لا تقل عن 6 سنوات"
  const plusMatch = fullText.match(/(?:at least|minimum|more than|min\.?|over|\+)?\s*(\d+)\s*\+?\s*(?:years?|yrs?|سنوات|سنة)\s*(?:of experience|experience|\+)?/i) ||
                    fullText.match(/(?:خبرة\s*(?:لا تقل عن|\+)?\s*)(\d+)\s*(?:سنوات|سنة)/i);
  if (plusMatch) {
    const years = parseInt(plusMatch[1], 10);
    if (years > 0 && years < 30) {
      return {
        en: `${years}+ years`,
        ar: `+${years} سنوات`
      };
    }
  }

  // 3. Seniority & title fallback
  const senior = row.seniority || '';
  const title = (row.title || '').toLowerCase();
  if (senior === 'Senior' || /senior|lead|principal|head|manager|director|expert/i.test(title)) {
    return { en: '5+ years', ar: '+٥ سنوات' };
  }
  if (senior === 'Fresh' || /fresh|intern|entry|trainee/i.test(title)) {
    return { en: '0 - 1 years', ar: '٠ - ١ سنة' };
  }
  if (senior === 'Junior' || /junior/i.test(title)) {
    return { en: '1 - 3 years', ar: '١ - ٣ سنوات' };
  }

  return { en: '2 - 4 years', ar: '٢ - ٤ سنوات' };
}

function parseSkillsArray(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return []; }
  }
  return [];
}

function normalizeSkill(s: string): string {
  const key = s.toLowerCase().trim().replace(/\s+/g, ' ');
  return SKILL_ALIASES[key] || s.trim();
}

function cleanSkills(rawSkills: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of rawSkills) {
    const norm = normalizeSkill((raw || '').trim());
    if (!norm || norm.length < 2 || norm.length > 40) continue;
    const lower = norm.toLowerCase();
    if (SKILL_BLACKLIST.has(lower)) continue;
    if (/^\d+$/.test(norm) || norm.split(/\s+/).length > 4) continue;
    if (!seen.has(lower)) { seen.add(lower); result.push(norm); }
  }
  return result;
}

/**
 * Check whether user satisfies a job's required skill.
 * Uses direct match, substring, and semantic inference (only for inferred-quality jobs).
 */
function isSkillMatchedByUser(
  reqSkill: string,
  userSkills: string[],
  allowInference: boolean
): boolean {
  const normReq = reqSkill.toLowerCase().trim();
  const normUser = userSkills.map(s => s.toLowerCase().trim());

  if (normUser.some(us => us === normReq || us.includes(normReq) || normReq.includes(us))) {
    return true;
  }
  if (allowInference) {
    const inferred = SKILL_INFERENCE[normReq];
    if (inferred?.some(need => normUser.some(us => us.includes(need) || need.includes(us)))) {
      return true;
    }
  }
  return false;
}

/**
 * Confidence-weighted match score.
 * Verified skills (job_tags / job_description) → weight 1.0
 * Inferred skills (title_inference)             → weight 0.4
 *
 * Returns null with confidence='low' when data_quality = 'unresolved'
 * (no reliable required skills at all).
 */
function calculateMatchScore(
  requiredSkills: string[],
  inferredSkills: string[],
  userSkills: string[],
  dataQuality: JobDataQuality,
  skillSources: SkillSource[],
  targetRoleBoost: number,
): { score: number | null; confidence: 'high' | 'medium' | 'low'; reason?: string } {
  // Unresolved → no reliable data, don't fabricate a score
  if (dataQuality === 'unresolved' && requiredSkills.length === 0 && inferredSkills.length === 0) {
    return { score: null, confidence: 'low', reason: 'insufficient_job_data' };
  }

  const hasVerifiedSources = skillSources.some(s => s === 'job_tags' || s === 'job_description');

  // Use verified skills with weight 1.0
  const verifiedMatched = requiredSkills.filter(s =>
    isSkillMatchedByUser(s, userSkills, !hasVerifiedSources)
  ).length;
  const verifiedTotal = requiredSkills.length;

  // Use inferred skills with weight 0.4 (as fractional contribution)
  const inferredMatched = inferredSkills.filter(s =>
    isSkillMatchedByUser(s, userSkills, false)
  ).length;
  const inferredTotal = inferredSkills.length;

  const weightedMatched = verifiedMatched * 1.0 + inferredMatched * 0.4;
  const weightedTotal = verifiedTotal * 1.0 + inferredTotal * 0.4;

  if (weightedTotal === 0) {
    // Has data but no skills after filtering → neutral score, low confidence
    return { score: 55 + targetRoleBoost, confidence: 'low', reason: 'no_skills_after_filter' };
  }

  const ratio = weightedMatched / weightedTotal;
  const base = Math.round(ratio * 70 + 15 + targetRoleBoost);
  const score = Math.min(98, Math.max(40, base));

  const confidence: 'high' | 'medium' | 'low' =
    dataQuality === 'verified' ? 'high' :
    dataQuality === 'partial' ? 'medium' : 'low';

  return { score, confidence };
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/jobs
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword       = searchParams.get('keyword')?.trim().toLowerCase() || '';
    const locationQuery = searchParams.get('location')?.trim().toLowerCase() || '';
    const seniority     = searchParams.get('seniority') || 'all';
    const workType      = searchParams.get('workType') || 'all';
    const sortBy        = searchParams.get('sortBy') || 'match';
    const limit         = Math.min(parseInt(searchParams.get('limit') || '1000', 10), 1000);
    const userSkillsParam = searchParams.get('skills') || '';
    const targetRole    = searchParams.get('targetRole')?.trim().toLowerCase() || '';
    const postedAfter   = searchParams.get('postedAfter')?.trim() || ''; // ISO date string for filtering

    const userSkills = userSkillsParam
      ? userSkillsParam.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
      : ['sql', 'python', 'power bi', 'excel', 'data modeling', 'react', 'git'];

    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let jobsFromDb: any[] = [];

    if (supabase) {
      try {
        let query = supabase.from('jobs').select('*');

        if (keyword) {
          query = query.or(
            `title.ilike.%${keyword}%,company.ilike.%${keyword}%,description.ilike.%${keyword}%`
          );
        }
        if (locationQuery) {
          query = query.ilike('location', `%${locationQuery}%`);
        }
        if (seniority !== 'all') {
          query = query.ilike('seniority', `%${seniority}%`);
        }
        if (workType === 'remote') {
          query = query.eq('is_remote', true);
        } else if (workType === 'hybrid') {
          query = query.ilike('work_type', '%hybrid%');
        } else if (workType === 'onsite') {
          query = query.ilike('work_type', '%on-site%');
        }

        // Server-side date filter: only return jobs posted after a given date
        if (postedAfter) {
          query = query.gte('posted_at', postedAfter);
        }

        const { data, error } = await query
          .order('posted_at', { ascending: false, nullsFirst: false })
          .limit(limit);

        if (!error && Array.isArray(data) && data.length > 0) {
          jobsFromDb = data;
        }
      } catch (e) {
        console.warn('[/api/jobs] Supabase query error:', e);
      }
    }

    // ── Transform DB rows → JobItem[] ──
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedJobs: (JobItem & { _postedAt: string | null; _matchConfidence: string })[] = jobsFromDb.map((row: any) => {
      const dataQuality: JobDataQuality = row.data_quality ?? 'unresolved';
      const skillSources: SkillSource[] = parseSkillsArray(row.skill_source) as SkillSource[];

      // Verified required skills
      const reqSkills = cleanSkills(parseSkillsArray(row.required_skills));
      // Inferred skills (lower confidence, separate field from DB)
      const inferredSkills = cleanSkills(parseSkillsArray(row.inferred_skills ?? []));
      // Preferred skills
      const preferredSkills = cleanSkills(parseSkillsArray(row.preferred_skills ?? []));

      // Role title match boost (+15 if target role aligns with this job)
      const titleLower = (row.title || '').toLowerCase();
      let roleBoost = 0;
      if (targetRole) {
        const rolePatterns: [string, string[]][] = [
          ['data', ['data', 'bi', 'analytics', 'analyst']],
          ['frontend', ['frontend', 'react', 'web', 'ui']],
          ['backend', ['backend', 'node', 'api', 'server']],
          ['fullstack', ['full stack', 'fullstack', 'full-stack']],
          ['devops', ['devops', 'cloud', 'sre', 'platform']],
          ['mobile', ['mobile', 'flutter', 'android', 'ios']],
        ];
        for (const [rkey, patterns] of rolePatterns) {
          if (targetRole.includes(rkey) && patterns.some(p => titleLower.includes(p))) {
            roleBoost = 15;
            break;
          }
        }
      }

      const { score: matchScore, confidence: matchConfidence } = calculateMatchScore(
        reqSkills, inferredSkills, userSkills, dataQuality, skillSources, roleBoost
      );

      // Skills for display: verified matched/missing
      const matchedSkills = [
        ...reqSkills.filter(s => isSkillMatchedByUser(s, userSkills, false))
          .map(s => ({ name: s, weight: 1.0 })),
        // Show partial matches from inferred at reduced weight
        ...inferredSkills.filter(s => isSkillMatchedByUser(s, userSkills, false))
          .map(s => ({ name: s, weight: 0.4 })),
      ].slice(0, 8);

      const missingSkills = [
        ...reqSkills.filter(s => !isSkillMatchedByUser(s, userSkills, false))
          .map((s, idx) => ({
            name: s,
            weight: parseFloat(((reqSkills.length - idx) / Math.max(reqSkills.length, 1)).toFixed(2)),
            marketNote: `Verified: found in job listing`,
            marketNoteAr: `مُستخرجة من إعلان الوظيفة مباشرة`,
          })),
        ...preferredSkills.filter(s => !isSkillMatchedByUser(s, userSkills, false))
          .map(s => ({
            name: s,
            weight: 0.3,
            marketNote: `Preferred (nice to have)`,
            marketNoteAr: `مُفضَّلة (ميزة إضافية)`,
          })),
      ].slice(0, 6);

      const wt = normalizeWorkType(row.work_type, !!row.is_remote);
      const senior: JobItem['seniority'] =
        (['Fresh', 'Junior', 'Mid', 'Senior'].includes(row.seniority)
          ? row.seniority
          : 'Mid') as JobItem['seniority'];
      const posted = timeAgo(row.posted_at);

      const expYears = extractExperienceYears(row);
      const expYearsEn = expYears.en;
      const expYearsAr = expYears.ar;

      const descLines = (row.description || '').split(/\n|•/).map((s: string) => s.trim()).filter(Boolean);
      const reqLines = (row.requirements || '').split(/\n|•/).map((s: string) => s.trim()).filter(Boolean);

      const effectiveMatchScore = matchScore ?? 50; // UI gets a number; confidence shown separately

      const job = {
        id: row.id,
        title: row.title,
        titleAr: row.title_ar || row.title,
        company: row.company || 'Employer',
        companyAr: row.company_ar || row.company || 'جهة العمل',
        logo: row.company_logo ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent((row.company || 'CO').slice(0, 2))}&background=0D8ABC&color=fff&bold=true`,
        companyLogo: row.company_logo || null,
        company_logo: row.company_logo || null,
        applyUrl: row.apply_url || '',
        apply_url: row.apply_url || '',
        location: row.location || 'Cairo, Egypt',
        locationAr: row.location_ar || row.location || 'القاهرة، مصر',
        workType: wt,
        workTypeAr: (workTypeArMap[wt] || 'من مقر الشركة') as JobItem['workTypeAr'],
        employmentType: 'Full-time' as const,
        employmentTypeAr: 'دوام كامل' as const,
        seniority: senior,
        seniorityAr: seniorityArMap[senior] || 'متوسط',
        salaryRange: (row.salary_range && row.salary_range !== 'تحدد أثناء المقابلة' && !/competitive|confidential|غير معلن|تنافسي|32,000|50,000|14,000|20,000|\$1,800|\$2,800/i.test(row.salary_range))
          ? row.salary_range
          : 'Disclosed upon interview',
        salaryRangeAr: (row.salary_range && row.salary_range !== 'تحدد أثناء المقابلة' && !/competitive|confidential|غير معلن|تنافسي|32,000|50,000|14,000|20,000|\$1,800|\$2,800/i.test(row.salary_range))
          ? row.salary_range
          : 'تحدد أثناء المقابلة',
        matchScore: effectiveMatchScore,
        postedAgo: posted.en,
        postedAgoAr: posted.ar,
        applicantsCount: row.applicants_count || Math.floor(Math.random() * 35) + 5,
        department: row.department || row.category || 'Technology',
        departmentAr: row.department_ar || 'التكنولوجيا',
        education: row.education || "Bachelor's",
        educationAr: row.education_ar || 'بكالوريوس',
        experienceYears: expYearsEn,
        experienceYearsAr: expYearsAr,
        matchedSkills,
        missingSkills,
        required_skills: reqSkills,
        skills: reqSkills,
        description: cleanEnglishOverview(row.title, row.company, row.location, row.description),
        descriptionAr: cleanArabicOverview(row.title_ar || row.title, row.company_ar || row.company, row.location_ar || row.location, row.description_ar || row.description),
        responsibilities: cleanEnglishResponsibilities(row.title, descLines, reqSkills),
        responsibilitiesAr: cleanArabicResponsibilities(row.title_ar || row.title, descLines, reqSkills),
        requirements: cleanEnglishRequirements(row.title, reqLines, reqSkills),
        requirementsAr: cleanArabicRequirements(row.title_ar || row.title, reqLines, reqSkills),
        // Internal fields for sorting/analytics (not in JobItem interface but carried through)
        _postedAt: row.posted_at || null,
        _matchConfidence: matchScore === null ? 'unavailable' : matchConfidence,
      };

      return job;
    });

    // ── Client-side Filtering ──
    let results = mappedJobs as typeof mappedJobs;

    if (keyword) {
      results = results.filter(j =>
        j.title.toLowerCase().includes(keyword) ||
        j.titleAr.includes(keyword) ||
        j.company.toLowerCase().includes(keyword) ||
        j.matchedSkills.some(s => s.name.toLowerCase().includes(keyword))
      );
    }
    if (locationQuery) {
      results = results.filter(j =>
        j.location.toLowerCase().includes(locationQuery) ||
        j.locationAr.toLowerCase().includes(locationQuery)
      );
    }

    // ── Sorting ──
    if (sortBy === 'match') {
      results.sort((a, b) => b.matchScore - a.matchScore);
    } else if (sortBy === 'recent') {
      // Sort by real posted_at — nulls last
      results.sort((a, b) => {
        const aTime = a._postedAt ? new Date(a._postedAt).getTime() : 0;
        const bTime = b._postedAt ? new Date(b._postedAt).getTime() : 0;
        return bTime - aTime;
      });
    }

    // Strip internal fields before sending to client, but keep postedAt for notification filtering
    const clientJobs = results.map(({ _postedAt, _matchConfidence, ...job }) => ({
      ...job,
      postedAt: _postedAt || null,
    }));

    return NextResponse.json({
      jobs: clientJobs,
      total: clientJobs.length,
      source: jobsFromDb.length > 0 ? 'supabase' : 'fallback',
    });
  } catch (err: unknown) {
    console.error('[/api/jobs] GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

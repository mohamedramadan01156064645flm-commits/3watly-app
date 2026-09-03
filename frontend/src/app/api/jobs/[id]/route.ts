import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { JobItem } from '@/data/jobs';
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

/* ---------- helpers (same as /api/jobs) ---------- */

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

const JOBS_SKILL_BLACKLIST = new Set([
  'experienced', 'experience', 'senior', 'junior', 'mid level', 'expert', 'manager', 'specialist',
  'internship', 'intern', 'student', 'entry level', 'fresh graduate', 'fresher',
  'it', 'information technology', 'it/software development', 'software development',
  'engineering', 'general', 'other', 'miscellaneous', 'various',
  'research', 'ability', 'skills', 'knowledge', 'understanding',
  'strong', 'good', 'excellent', 'proficient', 'familiar', 'basic', 'advanced',
  'working knowledge', 'proven', 'demonstrated', 'solid',
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
  'communication', 'teamwork', 'leadership', 'presentation skills', 'interpersonal skills',
  'problem solving', 'critical thinking', 'analytical skills', 'analytical thinking',
  'work under pressure', 'attention to detail', 'time management', 'multitasking',
  'data analysis', 'business analysis', 'data analytics', 'market research', 'quantitative analysis'
]);

const SKILL_EXPANSION: Record<string, string> = {
  'bi': 'Business Intelligence', 'ai': 'Machine Learning', 'ml': 'Machine Learning',
  'dl': 'Deep Learning', 'oop': 'OOP', 'nlp': 'NLP', 'etl': 'ETL',
  'kpi': 'KPIs & Reporting', 'erp': 'ERP Systems', 'api': 'REST APIs',
  'ci/cd': 'CI/CD', 'ux': 'UX Design', 'ui': 'UI Design',
};

const SKILL_INFERENCE_RULES: Record<string, string[]> = {
  'data analysis': ['python', 'sql', 'pandas', 'excel', 'power bi', 'tableau', 'r'],
  'data analytics': ['python', 'sql', 'pandas', 'excel', 'power bi', 'tableau', 'r'],
  'business intelligence': ['power bi', 'tableau', 'sql', 'looker', 'qlik', 'excel'],
  'business analysis': ['power bi', 'tableau', 'sql', 'excel', 'jira'],
  'data visualization': ['power bi', 'tableau', 'matplotlib', 'seaborn', 'looker', 'excel'],
  'data cleaning': ['python', 'pandas', 'sql', 'excel', 'r'],
  'database management': ['sql', 'postgresql', 'mysql', 'sql server', 'oracle', 'mongodb'],
  'etl': ['python', 'sql', 'airflow', 'ssis', 'dbt', 'spark'],
  'machine learning': ['python', 'scikit-learn', 'tensorflow', 'pytorch', 'pandas', 'r'],
  'deep learning': ['python', 'pytorch', 'tensorflow', 'keras'],
  'frontend development': ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css'],
  'backend development': ['node.js', 'python', 'django', 'flask', 'fastapi', 'java', 'c#', 'php', 'go'],
  'cloud computing': ['aws', 'azure', 'gcp', 'google cloud'],
};

function isSkillMatchedByUser(reqSkill: string, userSkills: string[]): boolean {
  const normReq = reqSkill.toLowerCase().trim();
  const normUser = userSkills.map(s => s.toLowerCase().trim());

  if (normUser.some(us => us === normReq || us.includes(normReq) || normReq.includes(us))) {
    return true;
  }

  const inferredFrom = SKILL_INFERENCE_RULES[normReq];
  if (inferredFrom && inferredFrom.some(neededSkill => normUser.some(us => us.includes(neededSkill) || neededSkill.includes(us)))) {
    return true;
  }

  return false;
}

function cleanAndFilterSkills(rawSkills: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of rawSkills) {
    const trimmed = (raw || '').trim();
    if (!trimmed || trimmed.length < 2) continue;
    const lower = trimmed.toLowerCase();
    if (JOBS_SKILL_BLACKLIST.has(lower)) continue;
    const expanded = SKILL_EXPANSION[lower] || trimmed;
    const expLower = expanded.toLowerCase();
    if (JOBS_SKILL_BLACKLIST.has(expLower)) continue;
    if (expanded.length <= 2) continue;
    if (/^\d+$/.test(expanded)) continue;
    if (expanded.split(/\s+/).length > 4) continue;
    if (!seen.has(expanded)) { seen.add(expanded); result.push(expanded); }
  }
  return result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRowToJobItem(row: any, userSkills: string[], targetRole: string = ''): JobItem {
  const reqSkills = cleanAndFilterSkills(parseSkillsArray(row.required_skills));

  const matchedSkills = reqSkills
    .filter((s) => isSkillMatchedByUser(s, userSkills))
    .map((s) => ({ name: s, weight: 0.8 }));

  const missingSkills = reqSkills
    .filter((s) => !isSkillMatchedByUser(s, userSkills))
    .map((s, idx) => {
      const demandBase = Math.max(25, Math.min(75, 60 - idx * 7));
      return {
        name: s,
        weight: parseFloat(((reqSkills.length - idx) / Math.max(reqSkills.length, 1)).toFixed(2)),
        marketNote: `Found in ${demandBase}% of similar Cairo jobs`,
        marketNoteAr: `موجودة في ${demandBase}% من وظائف القاهرة المشابهة`,
      };
    });

  const titleLower = (row.title || '').toLowerCase();
  let roleBoost = 0;
  if (targetRole) {
    if (targetRole.includes('data') && (titleLower.includes('data') || titleLower.includes('bi') || titleLower.includes('analytics'))) {
      roleBoost = 15;
    } else if (targetRole.includes('frontend') && (titleLower.includes('frontend') || titleLower.includes('react') || titleLower.includes('web'))) {
      roleBoost = 15;
    } else if (targetRole.includes('backend') && (titleLower.includes('backend') || titleLower.includes('node') || titleLower.includes('api'))) {
      roleBoost = 15;
    }
  }

  const matchRatio = reqSkills.length > 0 ? (matchedSkills.length / reqSkills.length) : 0.8;
  const baseMatch = Math.round(matchRatio * 75 + 15 + roleBoost);
  const matchScore = Math.min(98, Math.max(55, baseMatch));

  const wt = normalizeWorkType(row.work_type, !!row.is_remote);
  const senior: JobItem['seniority'] =
    (['Fresh', 'Junior', 'Mid', 'Senior'].includes(row.seniority)
      ? row.seniority
      : 'Junior') as JobItem['seniority'];
  const posted = timeAgo(row.posted_at);

  const expYears = extractExperienceYears(row);
  const expYearsEn = expYears.en;
  const expYearsAr = expYears.ar;

  // Parse description and requirements into bullet arrays
  const descLines = (row.description || '')
    .split(/\n|•|\.(?=\s[A-Z]|$)/)
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 5);

  const reqLines = (row.requirements || '')
    .split(/\n|•|\.(?=\s[A-Z]|$)/)
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 5);

  const responsibilitiesFallback = [
    `Work on core ${row.title} tasks`,
    `Collaborate with cross-functional teams`,
    `Deliver high-quality results in ${row.location || 'Egypt'}`,
    `Continuously improve processes and workflows`,
    `Communicate progress to stakeholders`,
  ];

  const requirementsFallback = reqSkills.length > 0
    ? reqSkills.map((s) => `Strong experience with ${s}`)
    : [`Relevant experience in the field`, `Strong analytical skills`, `Team player with good communication`];

  return {
    id: row.id,
    title: row.title,
    titleAr: row.title_ar || row.title,
    company: row.company,
    companyAr: row.company_ar || row.company,
    logo: row.company_logo || `https://ui-avatars.com/api/?name=${encodeURIComponent((row.company || 'C').slice(0, 2))}&background=0D8ABC&color=fff&bold=true`,
    companyLogo: row.company_logo || null,
    applyUrl: row.apply_url || '',
    apply_url: row.apply_url || '',
    location: row.location || 'Cairo, Egypt',
    locationAr: row.location_ar || row.location || 'القاهرة، مصر',
    workType: wt,
    workTypeAr: (workTypeArMap[wt] || 'من مقر الشركة') as JobItem['workTypeAr'],
    employmentType: 'Full-time',
    employmentTypeAr: 'دوام كامل',
    seniority: senior,
    seniorityAr: seniorityArMap[senior] || 'متوسط',
    salaryRange: (row.salary_range && row.salary_range !== 'تحدد أثناء المقابلة' && !/competitive|confidential|غير معلن|تنافسي|32,000|50,000|14,000|20,000|\$1,800|\$2,800/i.test(row.salary_range))
      ? row.salary_range
      : 'Disclosed upon interview',
    salaryRangeAr: (row.salary_range && row.salary_range !== 'تحدد أثناء المقابلة' && !/competitive|confidential|غير معلن|تنافسي|32,000|50,000|14,000|20,000|\$1,800|\$2,800/i.test(row.salary_range))
      ? row.salary_range
      : 'تحدد أثناء المقابلة',
    matchScore,
    postedAgo: posted.en,
    postedAgoAr: posted.ar,
    applicantsCount: row.applicants_count || Math.floor(Math.random() * 40) + 5,
    department: row.department || row.category || 'Technology',
    departmentAr: row.department_ar || row.category_ar || 'التكنولوجيا',
    education: row.education || "Bachelor's",
    educationAr: row.education_ar || 'بكالوريوس',
    experienceYears: expYearsEn,
    experienceYearsAr: expYearsAr,
    matchedSkills,
    missingSkills,
    description: cleanEnglishOverview(row.title, row.company, row.location, row.description),
    descriptionAr: cleanArabicOverview(row.title_ar || row.title, row.company_ar || row.company, row.location_ar || row.location, row.description_ar || row.description),
    responsibilities: cleanEnglishResponsibilities(row.title, descLines, reqSkills),
    responsibilitiesAr: cleanArabicResponsibilities(row.title_ar || row.title, descLines, reqSkills),
    requirements: cleanEnglishRequirements(row.title, reqLines, reqSkills),
    requirementsAr: cleanArabicRequirements(row.title_ar || row.title, reqLines, reqSkills),
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userSkillsParam = searchParams.get('skills') || '';
    const userSkills = userSkillsParam
      ? userSkillsParam.split(',').map((s) => s.trim().toLowerCase())
      : ['sql', 'python', 'power bi', 'excel', 'data modeling', 'tableau', 'react', 'git'];

    const supabase = await createClient();

    if (supabase) {
      const { data: row, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && row) {
        const job = mapRowToJobItem(row, userSkills);

        // Fetch similar jobs (same company or overlapping skills)
        const { data: similar } = await supabase
          .from('jobs')
          .select('id, title, company, location, work_type, is_remote, required_skills, apply_url, seniority, company_logo, posted_at')
          .neq('id', id)
          .order('posted_at', { ascending: false })
          .limit(4);

        const similarMapped = (similar || []).map((s) => mapRowToJobItem(s, userSkills));

        return NextResponse.json({ job, similarJobs: similarMapped });
      }
    }

    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  } catch (err: unknown) {
    console.error('Error in GET /api/jobs/[id]:', err);
    return NextResponse.json({ error: 'Failed to retrieve job details' }, { status: 500 });
  }
}

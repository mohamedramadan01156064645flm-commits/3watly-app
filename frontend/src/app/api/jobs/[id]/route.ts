import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { JobItem } from '@/data/jobs';
import {
  cleanEnglishOverview,
  cleanArabicOverview,
  cleanEnglishResponsibilities,
  cleanArabicResponsibilities,
  cleanEnglishRequirements,
  cleanArabicRequirements,
  partitionResponsibilitiesAndRequirements
} from '@/utils/jobLocalization';
import { computeJobMatch } from '@/utils/jobMatching';

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
    const time = new Date(dateStr).getTime();
    if (isNaN(time)) return { en: 'Recently', ar: 'مؤخراً' };
    const diff = Math.max(0, Date.now() - time);
    const minutes = Math.floor(diff / 60_000);
    const hours = Math.floor(diff / 3_600_000);
    const days = Math.floor(diff / 86_400_000);

    if (minutes < 2) return { en: 'Just now', ar: 'الآن' };
    if (minutes < 60) return { en: `${minutes}m ago`, ar: `منذ ${minutes} دقيقة` };
    if (hours === 1) return { en: '1h ago', ar: 'منذ ساعة' };
    if (hours === 2) return { en: '2h ago', ar: 'منذ ساعتين' };
    if (hours >= 3 && hours <= 10) return { en: `${hours}h ago`, ar: `منذ ${hours} ساعات` };
    if (hours < 24) return { en: `${hours}h ago`, ar: `منذ ${hours} ساعة` };

    if (days === 1) return { en: '1d ago', ar: 'منذ يوم' };
    if (days === 2) return { en: '2d ago', ar: 'منذ يومين' };
    if (days >= 3 && days <= 10) return { en: `${days}d ago`, ar: `منذ ${days} أيام` };
    if (days < 30) return { en: `${days}d ago`, ar: `منذ ${days} يوماً` };

    const months = Math.floor(days / 30);
    if (months === 1) return { en: '1mo ago', ar: 'منذ شهر' };
    if (months === 2) return { en: '2mo ago', ar: 'منذ شهرين' };
    if (months >= 3 && months <= 10) return { en: `${months}mo ago`, ar: `منذ ${months} أشهر` };
    return { en: `${months}mo ago`, ar: `منذ ${months} شهراً` };
  } catch {
    return { en: 'Recently', ar: 'مؤخراً' };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractExperienceYears(row: any): { en: string; ar: string } {
  const fullText = `${row.title || ''} ${row.description || ''} ${row.requirements || ''}`;

  // 1. Check ranges: "1 to 5 years", "2–5 years", "3-5 years", "3 to 6 Yrs", "من 1 الى 5 سنوات"
  const rangeMatch = fullText.match(/(\d+)\s*(?:[-–—~]|to|إلى|الي|وحتى|حتى)\s*(\d+)\s*(?:years?|yrs?|سنوات|سنة|عام)/i) ||
                     fullText.match(/·?\s*(\d+)\s*[-–—~]\s*(\d+)\s*Yrs of Exp/i) ||
                     fullText.match(/(?:experience needed|خبرة مطلوبة|خبرة)\s*:\s*(\d+)\s*(?:[-–—~]|to|إلى|الي)\s*(\d+)/i);
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

  // 2. Check plus expressions: "6+ years", "+6 years", "more than 5 years", "at least 6 years"
  // Negative lookbehind ensures it is NOT the tail end of a range like "1-5 years" or "2–5 years"
  const plusMatch = fullText.match(/(?<!\d\s*[-–—~]\s*)(?:at least|minimum|more than|min\.?|over|\+)\s*(\d+)\s*(?:years?|yrs?|سنوات|سنة)/i) ||
                    fullText.match(/(?<!\d\s*[-–—~]\s*)(\d+)\s*\+\s*(?:years?|yrs?|سنوات|سنة)/i) ||
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

  // 3. Seniority & title fallback (strict non-manager check)
  const senior = row.seniority || '';
  const title = (row.title || '').toLowerCase();
  if (senior === 'Senior' || /(?<!non[- ])manager|senior|lead|principal|director|head of/i.test(title)) {
    return { en: '5+ years', ar: '+٥ سنوات' };
  }
  if (senior === 'Fresh' || /fresh|intern|entry|trainee/i.test(title)) {
    return { en: '0 - 1 years', ar: '٠ - ١ سنة' };
  }
  if (senior === 'Junior' || /junior/i.test(title)) {
    return { en: '1 - 3 years', ar: '١ - ٣ سنوات' };
  }

  return { en: '1 - 5 years', ar: '١ - ٥ سنوات' };
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
  'retail',
  'communication', 'teamwork', 'leadership', 'presentation skills', 'interpersonal skills',
  'problem solving', 'critical thinking',
  'work under pressure', 'attention to detail', 'time management', 'multitasking',
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
function mapRowToJobItem(row: any, userSkills: string[], targetRole: string = ''): JobItem & { rawDescription?: string; rawRequirements?: string } {
  const matchResult = computeJobMatch(row, userSkills, targetRole);
  const matchedSkills = matchResult.matchedSkills;
  const missingSkills = matchResult.missingSkills;
  const matchScore = matchResult.matchScore;

  const wt = normalizeWorkType(row.work_type, !!row.is_remote);
  const senior: JobItem['seniority'] =
    (['Fresh', 'Junior', 'Mid', 'Senior'].includes(row.seniority)
      ? row.seniority
      : 'Junior') as JobItem['seniority'];
  const posted = timeAgo(row.posted_at);

  const expYears = extractExperienceYears(row);
  const expYearsEn = expYears.en;
  const expYearsAr = expYears.ar;

  // Extract structured responsibilities and requirements (supporting both HTML lists and plain text)
  const partitioned = partitionResponsibilitiesAndRequirements(row.requirements, row.description);
  const descLines = partitioned.responsibilities.length > 0
    ? partitioned.responsibilities
    : (row.description || '')
        .split(/\n|•|\.(?=\s[A-Z]|$)/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 5);

  const reqLines = partitioned.requirements.length > 0
    ? partitioned.requirements
    : (row.requirements || '')
        .split(/\n|•|\.(?=\s[A-Z]|$)/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 5);

  const reqSkills = (row.required_skills && Array.isArray(row.required_skills)) ? row.required_skills : [];


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
    postedAt: row.posted_at || null,
    postedAgo: posted.en,
    postedAgoAr: posted.ar,
    applicantsCount: typeof row.applicants_count === 'number' ? row.applicants_count : null,
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
    rawDescription: row.description || '',
    rawRequirements: row.requirements || '',
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
    const targetRole = searchParams.get('targetRole') || '';
    const userSkills = userSkillsParam
      ? userSkillsParam.split(',').map((s) => s.trim())
      : [];

    const supabase = await createClient();

    if (supabase) {
      const { data: row, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && row) {
        const job = mapRowToJobItem(row, userSkills, targetRole);

        // Fetch similar jobs (same company or overlapping skills)
        const { data: similar } = await supabase
          .from('jobs')
          .select('id, title, company, location, work_type, is_remote, required_skills, apply_url, seniority, company_logo, posted_at')
          .neq('id', id)
          .order('posted_at', { ascending: false })
          .limit(4);

        const similarMapped = (similar || []).map((s) => mapRowToJobItem(s, userSkills, targetRole));

        return NextResponse.json({ job, similarJobs: similarMapped });
      }
    }

    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  } catch (err: unknown) {
    console.error('Error in GET /api/jobs/[id]:', err);
    return NextResponse.json({ error: 'Failed to retrieve job details' }, { status: 500 });
  }
}

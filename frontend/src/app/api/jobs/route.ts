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
  'retail',
  'communication', 'teamwork', 'leadership', 'problem solving', 'critical thinking',
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

  // 1. Check ranges: "3-5 years", "3 to 6 Yrs", "2–5 years", "· 3 - 5 Yrs of Exp ·", "من 3 الى 5 سنوات"
  const rangeMatch = fullText.match(/(\d+)\s*(?:[-–—~]|to|إلى|الي|وحتى|حتى)\s*(\d+)\s*(?:years?|yrs?|سنوات|سنة)/i) ||
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
  // Negative lookbehind ensures NOT tail-end of a range like "1-5 years" or "2–5 years"
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

// ─────────────────────────────────────────────────────────────────────────────
// Comprehensive tech-skill keyword dictionary for text-based extraction
// ─────────────────────────────────────────────────────────────────────────────
const KNOWN_TECH_SKILLS_LIST: string[] = [
  'Python','SQL','Power BI','Tableau','Excel','Pandas','NumPy','R','PostgreSQL',
  'MySQL','MongoDB','Redis','Oracle','SQL Server','Snowflake','BigQuery','dbt',
  'Airflow','Kafka','Docker','Kubernetes','AWS','Azure','GCP','Google Cloud',
  'Git','GitHub','CI/CD','Linux','React','Next.js','TypeScript','JavaScript',
  'Node.js','Express','FastAPI','Django','Flask','Java','Spring Boot','C#','.NET',
  'C++','Go','PHP','Laravel','Angular','Vue.js','Tailwind CSS','GraphQL',
  'REST APIs','Agile','Scrum','Jira','Data Modeling','ETL','Machine Learning',
  'Deep Learning','NLP','TensorFlow','PyTorch','Scikit-Learn','Statistics',
  'Selenium','Postman','Flutter','Dart','Firebase','DAX','Spark','Ansible',
  'Terraform','Prometheus','Grafana','Elasticsearch','LLMs','Generative AI',
  'React Native','Kotlin','Swift','iOS','Android','ASP.NET','Spring',
  'Microservices','gRPC','Celery','OpenCV','BERT','Transformers','.NET Core',
  'Power Automate','SharePoint','Azure DevOps','Jira','Confluence','Figma',
  'SAP','ERP','Odoo','Dynamics 365','SSRS','SSIS','SSAS','Crystal Reports',
  'Hadoop','Hive','HBase','Cassandra','DynamoDB','Neo4j','InfluxDB',
  'OpenAI','LangChain','Hugging Face','Stable Diffusion','YOLO','OpenCV',
  'Matplotlib','Seaborn','Plotly','Power Query','M Language',
  'Bash','Shell Scripting','PowerShell','Nginx','Apache','RabbitMQ',
  'Networking','TCP/IP','DNS','VPN','Firewalls','SIEM','Penetration Testing',
  'Manual Testing','Test Automation','Cypress','Playwright','JUnit','Jest',
  'UX Research','Wireframing','Prototyping','Adobe XD','Sketch','InVision',
  'Kotlin','Swift','Xcode','Android Studio',
];

/**
 * Extract skills from free-text by scanning for known tech skills.
 * Used as fallback when DB has no required_skills for a job.
 */
function extractSkillsFromText(text: string): string[] {
  if (!text) return [];
  const found: string[] = [];
  const seen = new Set<string>();
  for (const skill of KNOWN_TECH_SKILLS_LIST) {
    if (skill === 'R') {
      if (/(?:^|\s|\/|,)(?:r\s+programming|r\s+language|r\s+script|language\s+r|r-project|cran|rstudio|r\s*[\/,]\s*python|python\s*[\/,]\s*r)(?:$|\s|\/|,|\.)/i.test(text)) {
        if (!seen.has('r')) { seen.add('r'); found.push('R'); }
      }
      continue;
    }
    if (skill === 'C') {
      if (/(?:^|\s|\/|,)(?:c\s+programming|c\s+language|c\s*\/\s*c\+\+)(?:$|\s|\/|,|\.)/i.test(text)) {
        if (!seen.has('c')) { seen.add('c'); found.push('C'); }
      }
      continue;
    }
    if (skill === 'Go') {
      if (/(?:^|\s|\/|,)(?:golang|go\s+language|go\s+programming|go\s*\/\s*golang)(?:$|\s|\/|,|\.)/i.test(text)) {
        if (!seen.has('go')) { seen.add('go'); found.push('Go'); }
      }
      continue;
    }

    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<![a-zA-Z0-9])${escaped}(?![a-zA-Z0-9])`, 'i');
    if (regex.test(text) && !seen.has(skill.toLowerCase())) {
      seen.add(skill.toLowerCase());
      found.push(skill);
    }
  }
  return found;
}

// Role-based skill profiles used when no skills can be extracted from text
const ROLE_SKILL_PROFILES: Record<string, { core: string[]; common: string[] }> = {
  'data analyst':          { core: ['SQL','Excel','Power BI'], common: ['Python','Tableau','Statistics'] },
  'data engineer':         { core: ['Python','SQL','ETL'], common: ['Airflow','Docker','Spark','dbt'] },
  'data scientist':        { core: ['Python','Machine Learning','Statistics'], common: ['TensorFlow','PyTorch','Pandas'] },
  'machine learning':      { core: ['Python','Machine Learning','Statistics'], common: ['TensorFlow','PyTorch','Scikit-Learn'] },
  'business intelligence': { core: ['Power BI','SQL','Excel'], common: ['DAX','Tableau','Data Modeling'] },
  'power bi':              { core: ['Power BI','SQL','DAX'], common: ['Excel','Data Modeling'] },
  'frontend':              { core: ['JavaScript','HTML','CSS','React'], common: ['TypeScript','Next.js','Git'] },
  'react':                 { core: ['React','JavaScript','HTML'], common: ['TypeScript','Next.js','Git'] },
  'backend':               { core: ['REST APIs','SQL','Git'], common: ['Node.js','Python','Docker'] },
  'full stack':            { core: ['JavaScript','SQL','Git','REST APIs'], common: ['React','Node.js','Docker'] },
  'devops':                { core: ['Docker','CI/CD','Linux','Git'], common: ['Kubernetes','AWS','Ansible'] },
  'flutter':               { core: ['Flutter','Dart','REST APIs'], common: ['Firebase','Git'] },
  'product manager':       { core: ['Agile','Jira','Analytics'], common: ['Scrum','SQL'] },
  'business analyst':      { core: ['SQL','Excel','Requirements Analysis'], common: ['Power BI','Jira'] },
  'qa':                    { core: ['Manual Testing','Jira','Test Cases'], common: ['Selenium','Postman'] },
  'software engineer':     { core: ['Git','REST APIs','SQL'], common: ['Docker','Agile','CI/CD'] },
  'net developer':         { core: ['C#','.NET','SQL Server'], common: ['ASP.NET','Git','REST APIs'] },
  'java developer':        { core: ['Java','Spring Boot','SQL'], common: ['Docker','Git','REST APIs'] },
  'angular':               { core: ['Angular','TypeScript','JavaScript'], common: ['RxJS','Git','REST APIs'] },
  'cloud':                 { core: ['AWS','Azure','Docker'], common: ['Kubernetes','CI/CD','Linux'] },
  'cybersecurity':         { core: ['Linux','Networking','Security'], common: ['Firewalls','SIEM'] },
  'ai engineer':           { core: ['Python','Machine Learning','TensorFlow'], common: ['Generative AI','LLMs'] },
  'node':                  { core: ['Node.js','JavaScript','REST APIs'], common: ['Express','MongoDB','Git'] },
  'mobile':                { core: ['REST APIs','Git'], common: ['Flutter','React Native','Firebase'] },
  'technical support':     { core: ['Networking','Windows','Linux'], common: ['TCP/IP','Troubleshooting','Help Desk'] },
  'network':               { core: ['Networking','TCP/IP','Cisco'], common: ['Firewalls','VPN','DNS'] },
  'odoo':                  { core: ['Odoo','Python','SQL'], common: ['ERP','.NET','Linux'] },
  'erp':                   { core: ['ERP','SQL','Python'], common: ['SAP','Dynamics 365','Odoo'] },
};

function inferSkillsFromTitle(title: string): string[] {
  const t = title.toLowerCase();
  for (const [key, profile] of Object.entries(ROLE_SKILL_PROFILES)) {
    if (t.includes(key)) {
      return [...new Set([...profile.core, ...profile.common])].slice(0, 6);
    }
  }
  return [];
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
    return { score: Math.max(15, Math.min(60, 45 + targetRoleBoost)), confidence: 'low', reason: 'no_skills_after_filter' };
  }

  // Zero skills matched: unrelated job or complete skill mismatch
  if (weightedMatched === 0) {
    const zeroScore = targetRoleBoost > 0 ? 30 : Math.max(10, 15 + targetRoleBoost);
    return { score: zeroScore, confidence: 'high', reason: 'no_matching_skills' };
  }

  const ratio = weightedMatched / weightedTotal;
  // Multi-skill bonus (matching 3+ skills gives up to 20 bonus points)
  const countBonus = Math.min(weightedMatched * 5, 20);
  const base = Math.round(ratio * 45 + 20 + countBonus + targetRoleBoost);
  const score = Math.min(98, Math.max(20, base));

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
    const rawLimit = searchParams.get('limit');
    let limit = 1000;
    if (rawLimit !== null) {
      const parsed = parseInt(rawLimit, 10);
      if (isNaN(parsed) || parsed <= 0) {
        return NextResponse.json({ error: 'Invalid limit parameter' }, { status: 400 });
      }
      limit = Math.min(parsed, 1000);
    }
    const userSkillsParam = searchParams.get('skills') || '';
    const targetRole    = searchParams.get('targetRole')?.trim().toLowerCase() || '';
    const postedAfter   = searchParams.get('postedAfter')?.trim() || ''; // ISO date string for filtering

    const userSkills = userSkillsParam
      ? userSkillsParam.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
      : [];

    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let jobsFromDb: any[] = [];

    if (supabase) {
      try {
        let query = supabase.from('jobs').select('*').neq('source', 'seed');

        if (keyword) {
          const sanitizedKeyword = keyword.replace(/[,.():]/g, '').trim();
          if (sanitizedKeyword) {
            query = query.or(
              `title.ilike.%${sanitizedKeyword}%,company.ilike.%${sanitizedKeyword}%,description.ilike.%${sanitizedKeyword}%`
            );
          }
        }
        if (locationQuery) {
          query = query.ilike('location', `%${locationQuery}%`);
        }
        if (seniority !== 'all') {
          const s = seniority.toLowerCase();
          if (s === 'junior' || s === 'fresh') {
            query = query.in('seniority', ['Fresh', 'Junior']);
          } else if (s === 'mid') {
            query = query.eq('seniority', 'Mid');
          } else if (s === 'senior') {
            query = query.eq('seniority', 'Senior');
          } else {
            query = query.ilike('seniority', `%${seniority}%`);
          }
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

        const dbLimit = sortBy === 'match' ? 1000 : limit;
        const { data, error } = await query
          .order('posted_at', { ascending: false, nullsFirst: false })
          .limit(dbLimit);

        if (error) {
          console.error('[/api/jobs] Supabase query error:', error);
          return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
        }
        if (Array.isArray(data)) {
          jobsFromDb = data;
        }
      } catch (e) {
        console.warn('[/api/jobs] Supabase query error:', e);
        return NextResponse.json({ error: 'Failed to query database' }, { status: 500 });
      }
    }

    // ── Transform DB rows → JobItem[] ──
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedJobs: (JobItem & { _postedAt: string | null; _matchConfidence: string })[] = jobsFromDb.map((row: any) => {
      const dataQuality: JobDataQuality = row.data_quality ?? 'unresolved';
      const skillSources: SkillSource[] = parseSkillsArray(row.skill_source) as SkillSource[];

      // ── Tier 1: DB verified required skills ──
      let reqSkills = cleanSkills(parseSkillsArray(row.required_skills));

      // ── Tier 2: Extract from description+requirements text ──
      if (reqSkills.length < 2) {
        const fullText = `${row.description || ''} ${row.requirements || ''}`;
        const textExtracted = extractSkillsFromText(fullText);
        if (textExtracted.length > 0) {
          // Merge with existing (DB skills take precedence)
          const existing = new Set(reqSkills.map(s => s.toLowerCase()));
          for (const s of textExtracted) {
            if (!existing.has(s.toLowerCase())) reqSkills.push(s);
          }
        }
      }

      // ── Tier 3: Infer from job title if still nothing ──
      if (reqSkills.length < 2) {
        const titleInferred = inferSkillsFromTitle(row.title || '');
        const existing = new Set(reqSkills.map(s => s.toLowerCase()));
        for (const s of titleInferred) {
          if (!existing.has(s.toLowerCase())) reqSkills.push(s);
        }
      }

      // Inferred skills (lower confidence, separate field from DB)
      const inferredSkills = cleanSkills(parseSkillsArray(row.inferred_skills ?? []));
      // Preferred skills
      const preferredSkills = cleanSkills(parseSkillsArray(row.preferred_skills ?? []));


      // Role title match boost (+18 if target role aligns with this job)
      const titleLower = (row.title || '').toLowerCase();
      let roleBoost = 0;
      if (targetRole) {
        const rolePatterns: [string, string[]][] = [
          ['data', ['data', 'bi', 'analytics', 'analyst', 'business intelligence', 'machine learning']],
          ['frontend', ['frontend', 'front-end', 'react', 'web', 'ui', 'angular', 'vue']],
          ['backend', ['backend', 'back-end', 'node', 'api', 'server', 'python', 'java', 'php', '.net', 'c#']],
          ['fullstack', ['full stack', 'fullstack', 'full-stack', 'software developer', 'software engineer']],
          ['devops', ['devops', 'cloud', 'sre', 'platform', 'infrastructure', 'sysadmin']],
          ['mobile', ['mobile', 'flutter', 'android', 'ios', 'react native']],
          ['qa', ['qa', 'quality assurance', 'software test', 'automation test']],
          ['product', ['product owner', 'product manager', 'scrum master', 'project manager']],
        ];
        for (const [rkey, patterns] of rolePatterns) {
          if (targetRole.includes(rkey) && patterns.some(p => titleLower.includes(p))) {
            roleBoost = 18;
            break;
          }
        }
      }

      // Domain mismatch penalty: strongly demote non-tech manual/unrelated professions
      const NON_TECH_TITLE = /mechanical|civil|electrical|chemical|production engineer|sales|medical|pharmacist|factory|cashier|call center|telesales|real estate|nurse|doctor|veterin/i;
      if (NON_TECH_TITLE.test(titleLower)) {
        roleBoost -= 35;
      }

      const hasUserSkills = userSkills.length > 0;
      const { score: matchScore, confidence: matchConfidence } = hasUserSkills
        ? calculateMatchScore(reqSkills, inferredSkills, userSkills, dataQuality, skillSources, roleBoost)
        : { score: null as any, confidence: 'none' };

      // Skills for display: verified matched/missing
      const matchedSkills = hasUserSkills
        ? [
            ...reqSkills.filter(s => isSkillMatchedByUser(s, userSkills, false))
              .map(s => ({ name: s, weight: 1.0 })),
            // Show partial matches from inferred at reduced weight
            ...inferredSkills.filter(s => isSkillMatchedByUser(s, userSkills, false))
              .map(s => ({ name: s, weight: 0.4 })),
          ].slice(0, 8)
        : [];

      const missingSkills = hasUserSkills
        ? [
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
          ].slice(0, 6)
        : [];

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

      const effectiveMatchScore = hasUserSkills ? (matchScore ?? 50) : null;

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
        applicantsCount: typeof row.applicants_count === 'number' ? row.applicants_count : null,
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
      if (userSkills.length > 0) {
        results.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      } else {
        // Sort by recency when candidate has no skills / no CV yet
        results.sort((a, b) => {
          const aTime = a._postedAt ? new Date(a._postedAt).getTime() : 0;
          const bTime = b._postedAt ? new Date(b._postedAt).getTime() : 0;
          return bTime - aTime;
        });
      }
    } else if (sortBy === 'recent') {
      // Sort by real posted_at — nulls last
      results.sort((a, b) => {
        const aTime = a._postedAt ? new Date(a._postedAt).getTime() : 0;
        const bTime = b._postedAt ? new Date(b._postedAt).getTime() : 0;
        return bTime - aTime;
      });
    }

    // Limit results to requested limit after full sort
    const limited = results.slice(0, limit);

    // Strip internal fields before sending to client, but keep postedAt for notification filtering
    const clientJobs = limited.map(({ _postedAt, _matchConfidence, ...job }) => ({
      ...job,
      postedAt: _postedAt || null,
    }));

    return NextResponse.json({
      jobs: clientJobs,
      total: clientJobs.length,
      source: jobsFromDb.length > 0 ? 'supabase' : 'empty',
    });
  } catch (err: unknown) {
    console.error('[/api/jobs] GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

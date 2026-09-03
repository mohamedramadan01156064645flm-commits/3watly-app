import * as cheerio from 'cheerio';
import type { CheerioAPI } from 'cheerio';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

// ─────────────────────────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────────────────────────

export type SkillSource = 'job_tags' | 'job_description' | 'title_inference' | 'ontology';
export type JobDataQuality = 'verified' | 'partial' | 'inferred' | 'unresolved';

export interface ExtractedSkill {
  name: string;
  source: SkillSource;
  /** 0–1: how confident we are this skill is truly required */
  confidence: number;
}

export interface ScrapedJob {
  id: string;
  title: string;
  title_ar: string;
  company: string | null;
  company_ar: string | null;
  company_logo: string | null;
  location: string;
  location_ar: string;
  work_type: string;
  is_remote: boolean;
  seniority: 'Fresh' | 'Junior' | 'Mid' | 'Senior';
  salary_range: string;
  /** Verified skills only (extracted from tags or description) */
  required_skills: string[];
  /** Inferred from job title — lower confidence, separate field */
  inferred_skills: string[];
  preferred_skills: string[];
  skill_source: SkillSource[];
  data_quality: JobDataQuality;
  description: string;
  description_ar?: string;
  requirements: string;
  requirements_ar?: string;
  apply_url: string;
  source: string;
  /** null when we cannot determine the real date — never store new Date() as fake */
  posted_at: string | null;
  last_enriched_at: string | null;
}

export interface ScraperHealthReport {
  success: boolean;
  totalScraped: number;
  totalInsertedOrUpdated: number;
  expiredDeleted: number;
  jobsWithVerifiedSkills: number;
  jobsWithInferredSkills: number;
  jobsUnresolved: number;
  dateExtractionRate: number;
  companyExtractionRate: number;
  detailPagesFetched: number;
  errors: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const WUZZUF_BASE = 'https://wuzzuf.net';

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8',
  'Referer': 'https://www.google.com/',
  'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Windows"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'cross-site',
  'Cache-Control': 'no-cache',
};

const SEARCH_QUERIES = [
  'data analyst',
  'data engineer',
  'data scientist',
  'business intelligence',
  'machine learning',
  'python developer',
  'sql developer',
  'frontend developer',
  'react developer',
  'backend developer',
  'full stack developer',
  'devops engineer',
  'product manager',
  'business analyst',
  'power bi developer',
  'flutter developer',
  'mobile developer',
  'qa engineer',
];

const DETAIL_FETCH_LIMIT = 60;
const DETAIL_FETCH_CONCURRENCY = 3;

// ─────────────────────────────────────────────────────────────────────────────
// Skill Intelligence: Aliases + Blacklist + Role Profiles
// ─────────────────────────────────────────────────────────────────────────────

const SKILL_ALIASES: Record<string, string> = {
  'reactjs': 'React', 'react.js': 'React',
  'nodejs': 'Node.js', 'node js': 'Node.js', 'node': 'Node.js',
  'postgres': 'PostgreSQL', 'postgresql': 'PostgreSQL', 'pg': 'PostgreSQL',
  'js': 'JavaScript', 'javascript': 'JavaScript',
  'ts': 'TypeScript', 'typescript': 'TypeScript',
  'powerbi': 'Power BI', 'power bi': 'Power BI', 'power_bi': 'Power BI',
  'msbi': 'Power BI',
  'ms sql': 'SQL Server', 'mssql': 'SQL Server', 'sql server': 'SQL Server',
  'mysql': 'MySQL', 'mongo': 'MongoDB', 'mongodb': 'MongoDB',
  'vue': 'Vue.js', 'vuejs': 'Vue.js', 'vue.js': 'Vue.js',
  'angular': 'Angular', 'angularjs': 'Angular',
  'nextjs': 'Next.js', 'next.js': 'Next.js',
  'k8s': 'Kubernetes', 'kubernetes': 'Kubernetes',
  'aws': 'AWS', 'azure': 'Azure', 'gcp': 'GCP', 'google cloud': 'GCP',
  'scikit': 'Scikit-Learn', 'sklearn': 'Scikit-Learn',
  'tensorflow': 'TensorFlow', 'tf': 'TensorFlow',
  'pytorch': 'PyTorch', 'torch': 'PyTorch',
  'ci/cd': 'CI/CD', 'cicd': 'CI/CD',
  'oop': 'OOP', 'solid': 'SOLID Principles',
  'restapi': 'REST APIs', 'rest api': 'REST APIs', 'rest': 'REST APIs',
  'graphql': 'GraphQL',
  'nlp': 'NLP', 'ml': 'Machine Learning', 'dl': 'Deep Learning',
  'etl': 'ETL', 'dbt': 'dbt', 'airflow': 'Airflow',
};

const SKILL_BLACKLIST = new Set([
  'experienced', 'experience', 'senior', 'junior', 'mid level', 'expert', 'manager', 'specialist',
  'internship', 'intern', 'student', 'entry level', 'fresh graduate', 'fresher', 'graduate',
  'it', 'information technology', 'information technology (it)', 'it/software development', 'software development',
  'engineering', 'general', 'other', 'miscellaneous', 'various',
  'engineering - mechanical/electrical', 'manufacturing/production', 'operations/management',
  'creative/design/art', 'engineering - other', 'business administration', 'quality control',
  'research', 'ability', 'skills', 'knowledge', 'understanding',
  'strong', 'good', 'excellent', 'proficient', 'familiar', 'basic', 'advanced',
  'working knowledge', 'proven', 'demonstrated', 'solid',
  'full time', 'part time', 'contract', 'freelance', 'remote', 'on-site', 'hybrid',
  'freelance / project', 'freelance/project', 'project',
  'education/teaching', 'education / teaching', 'education', 'teaching',
  'training/instructor', 'training / instructor', 'training', 'instructor',
  'analyst/research', 'analyst / research', 'analysis',
  'computer science', 'it/software development', 'engineering - telecom/technology',
  'customer service/support', 'customer service', 'support',
  'sales/retail', 'sales', 'retail', 'accounting/finance', 'accounting', 'finance',
  'project/program management', 'project management', 'program management',
  'administration', 'human resources', 'marketing/pr/advertising',
  'communication', 'teamwork', 'leadership', 'presentation skills', 'interpersonal skills',
  'problem solving', 'critical thinking', 'analytical skills', 'analytical thinking',
  'work under pressure', 'attention to detail', 'time management', 'multitasking',
  'data analysis', 'business analysis', 'data analytics', 'market research',
  'shift based', 'males only', 'females only', 'unspecified',
  'it/software', 'software', 'technology', 'tech',
  'yrs', 'years', 'year', 'months', 'month',
]);

interface RoleSkillProfile {
  aliases: string[];
  /** Always required for this role — confidence 0.65 */
  core: string[];
  /** Commonly seen but not guaranteed — confidence 0.35 */
  common: string[];
}

const ROLE_SKILL_PROFILES: Record<string, RoleSkillProfile> = {
  'data-analyst': {
    aliases: ['data analyst', 'data analytics', 'محلل بيانات'],
    core: ['SQL', 'Excel', 'Power BI'],
    common: ['Python', 'Tableau', 'Statistics'],
  },
  'data-engineer': {
    aliases: ['data engineer', 'مهندس بيانات'],
    core: ['Python', 'SQL', 'ETL'],
    common: ['Airflow', 'Docker', 'Spark', 'dbt'],
  },
  'data-scientist': {
    aliases: ['data scientist', 'machine learning engineer', 'ml engineer', 'ai engineer'],
    core: ['Python', 'Machine Learning', 'Statistics'],
    common: ['TensorFlow', 'PyTorch', 'Pandas', 'Scikit-Learn'],
  },
  'bi-developer': {
    aliases: ['bi developer', 'business intelligence', 'power bi developer', 'مطور ذكاء أعمال'],
    core: ['Power BI', 'SQL', 'Excel'],
    common: ['DAX', 'Tableau', 'Data Modeling'],
  },
  'frontend': {
    aliases: ['frontend', 'front-end', 'front end', 'ui developer', 'react developer', 'مطور واجهات أمامية'],
    core: ['JavaScript', 'HTML', 'CSS', 'React'],
    common: ['TypeScript', 'Next.js', 'Git'],
  },
  'backend': {
    aliases: ['backend', 'back-end', 'back end', 'server-side', 'مطور واجهات خلفية'],
    core: ['REST APIs', 'SQL', 'Git'],
    common: ['Node.js', 'Python', 'Docker'],
  },
  'fullstack': {
    aliases: ['full stack', 'fullstack', 'full-stack', 'مطور برمجيات شامل'],
    core: ['JavaScript', 'SQL', 'Git', 'REST APIs'],
    common: ['React', 'Node.js', 'Docker'],
  },
  'devops': {
    aliases: ['devops', 'site reliability', 'sre', 'platform engineer', 'cloud engineer'],
    core: ['Docker', 'CI/CD', 'Linux', 'Git'],
    common: ['Kubernetes', 'AWS', 'Ansible', 'Terraform'],
  },
  'mobile': {
    aliases: ['mobile developer', 'flutter developer', 'ios developer', 'android developer', 'react native'],
    core: ['REST APIs', 'Git'],
    common: ['Flutter', 'React Native', 'Firebase'],
  },
  'product-manager': {
    aliases: ['product manager', 'product owner', 'مدير منتجات'],
    core: ['Agile', 'Jira', 'Analytics'],
    common: ['Scrum', 'Confluence', 'SQL'],
  },
  'business-analyst': {
    aliases: ['business analyst', 'محلل نظم', 'systems analyst'],
    core: ['SQL', 'Excel', 'Requirements Analysis'],
    common: ['Power BI', 'Jira', 'Tableau'],
  },
  'qa': {
    aliases: ['qa engineer', 'quality assurance', 'software tester', 'مهندس جودة'],
    core: ['Manual Testing', 'Jira', 'Test Cases'],
    common: ['Selenium', 'Postman', 'Automation Testing'],
  },
};

const KNOWN_TECH_SKILLS = [
  'Python', 'SQL', 'Power BI', 'Tableau', 'Excel', 'Pandas', 'NumPy', 'R',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server', 'Snowflake',
  'BigQuery', 'dbt', 'Airflow', 'Kafka', 'Docker', 'Kubernetes', 'AWS', 'Azure',
  'GCP', 'Google Cloud', 'Git', 'GitHub', 'CI/CD', 'Linux', 'React', 'Next.js',
  'TypeScript', 'JavaScript', 'Node.js', 'Express', 'FastAPI', 'Django', 'Flask',
  'Java', 'Spring Boot', 'C#', '.NET', 'C++', 'Go', 'PHP', 'Laravel', 'Angular',
  'Vue.js', 'Tailwind CSS', 'GraphQL', 'REST APIs', 'Agile', 'Scrum', 'Jira',
  'Data Modeling', 'ETL', 'Machine Learning', 'Deep Learning',
  'NLP', 'TensorFlow', 'PyTorch', 'Scikit-Learn', 'Statistics',
  'Selenium', 'Postman', 'Flutter', 'Dart', 'Firebase', 'DAX', 'Spark',
  'Ansible', 'Terraform', 'Prometheus', 'Grafana', 'Elasticsearch',
];

// ─────────────────────────────────────────────────────────────────────────────
// Utility Helpers
// ─────────────────────────────────────────────────────────────────────────────

function generateJobId(applyUrl: string): string {
  return `wuzzuf_${crypto.createHash('md5').update(applyUrl).digest('hex').slice(0, 16)}`;
}

function cleanText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\.css-[a-zA-Z0-9_-]+\s*\{[^}]*\}/g, '')
    .replace(/\{[^}]*\}/g, '')
    .replace(/^\.css-[a-zA-Z0-9_-]+/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeSkill(raw: string): string | null {
  const trimmed = (raw || '').trim();
  if (!trimmed || trimmed.length < 2) return null;
  const key = trimmed.toLowerCase().trim().replace(/\s+/g, ' ');
  return SKILL_ALIASES[key] || trimmed;
}

function deduplicateSkills(skills: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const s of skills) {
    const normalized = normalizeSkill(s);
    if (!normalized) continue;
    const lower = normalized.toLowerCase();
    if (SKILL_BLACKLIST.has(lower)) continue;
    if (normalized.length < 2 || normalized.length > 40) continue;
    if (/^\d+$/.test(normalized)) continue;
    if (normalized.split(/\s+/).length > 4) continue;
    if (!seen.has(lower)) {
      seen.add(lower);
      result.push(normalized);
    }
  }
  return result;
}

/** Infer skills from job title using Role Profiles — returns inferred_skills (NOT required) */
function inferSkillsFromTitle(title: string): ExtractedSkill[] {
  const t = title.toLowerCase();
  for (const [, profile] of Object.entries(ROLE_SKILL_PROFILES)) {
    if (profile.aliases.some(alias => t.includes(alias))) {
      const results: ExtractedSkill[] = [];
      for (const skill of profile.core) {
        results.push({ name: skill, source: 'title_inference', confidence: 0.65 });
      }
      for (const skill of profile.common) {
        results.push({ name: skill, source: 'title_inference', confidence: 0.35 });
      }
      return results;
    }
  }
  return [];
}

/** Extract verified skills from free text against known skill dictionary */
function extractSkillsFromText(text: string): string[] {
  const found = new Set<string>();
  const normalizedText = text.toLowerCase();
  for (const skill of KNOWN_TECH_SKILLS) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<![a-zA-Z])${escaped}(?![a-zA-Z])`, 'i');
    if (regex.test(normalizedText)) {
      found.add(skill);
    }
  }
  return Array.from(found);
}

function parseSeniority(text: string): 'Fresh' | 'Junior' | 'Mid' | 'Senior' {
  const t = text.toLowerCase();
  if (t.match(/entry|fresh|graduate|intern|0[-–]1|trainee/)) return 'Fresh';
  if (t.match(/junior|1[-–][23]|1[-–]3/)) return 'Junior';
  if (t.match(/senior|lead|principal|manager|5\+|7\+/)) return 'Senior';
  return 'Mid';
}

function parseWorkType(text: string): { workType: string; isRemote: boolean } {
  const t = text.toLowerCase();
  const isRemote = /remote|work from home|عن بعد/.test(t);
  if (/hybrid/.test(t)) return { workType: 'Hybrid', isRemote: false };
  if (isRemote) return { workType: 'Remote', isRemote: true };
  return { workType: 'On-site', isRemote: false };
}

function extractSalaryRange(text: string): string {
  if (!text) return 'تحدد أثناء المقابلة';
  const match = text.match(/(\d[\d,]*\s*(?:to|-|–)\s*\d[\d,]*\s*(?:EGP|USD|EUR|ج\.م|\$)[^\n•,]*)/i);
  if (match) {
    return match[1].trim();
  }
  return 'تحدد أثناء المقابلة';
}

/** Parse a relative date string. Returns null if unknown — NEVER returns new Date() as fake */
function parseRelativeDate(text: string): string | null {
  if (!text || !text.trim()) return null;
  const t = text.toLowerCase().trim();
  const now = new Date();

  const hoursMatch = t.match(/(\d+)\s*(?:hour|hours|hr|hrs|ساعة|ساعات)/);
  if (hoursMatch) {
    now.setHours(now.getHours() - parseInt(hoursMatch[1], 10));
    return now.toISOString();
  }
  const daysMatch = t.match(/(\d+)\s*(?:day|days|يوم|أيام)/);
  if (daysMatch) {
    now.setDate(now.getDate() - parseInt(daysMatch[1], 10));
    return now.toISOString();
  }
  const weeksMatch = t.match(/(\d+)\s*(?:week|weeks|أسبوع|أسابيع)/);
  if (weeksMatch) {
    now.setDate(now.getDate() - parseInt(weeksMatch[1], 10) * 7);
    return now.toISOString();
  }
  const monthsMatch = t.match(/(\d+)\s*(?:month|months|شهر|أشهر)/);
  if (monthsMatch) {
    now.setMonth(now.getMonth() - parseInt(monthsMatch[1], 10));
    return now.toISOString();
  }
  if (/just now|الآن|اليوم|today/.test(t)) {
    return now.toISOString();
  }
  // Cannot determine — return null, not a fake date
  return null;
}

function translateTitleToAr(title: string): string {
  const t = title.toLowerCase();
  let prefix = '';
  if (/senior|lead|principal/.test(t)) prefix = 'أول ';
  if (/junior|entry/.test(t)) prefix = 'مبتدئ ';
  if (/fresh/.test(t)) prefix = 'حديث التخرج ';
  if (/data analyst|data analytics/.test(t)) return `محلل بيانات ${prefix}`.trim();
  if (/business intelligence|bi developer/.test(t)) return `مطور ذكاء أعمال (BI) ${prefix}`.trim();
  if (/data engineer/.test(t)) return `مهندس بيانات ${prefix}`.trim();
  if (/data scientist/.test(t)) return `عالم بيانات ${prefix}`.trim();
  if (/machine learning|ai engineer|deep learning/.test(t)) return `مهندس ذكاء اصطناعي (ML/AI) ${prefix}`.trim();
  if (/frontend|front-end|react developer/.test(t)) return `مطور واجهات أمامية (Frontend) ${prefix}`.trim();
  if (/backend|back-end|node\.?js developer/.test(t)) return `مطور خلفية (Backend) ${prefix}`.trim();
  if (/full.?stack|fullstack/.test(t)) return `مطور برمجيات شامل (Full Stack) ${prefix}`.trim();
  if (/devops|cloud engineer|sre/.test(t)) return `مهندس DevOps وسحابيات ${prefix}`.trim();
  if (/product manager|product owner/.test(t)) return `مدير منتجات رقمية ${prefix}`.trim();
  if (/business analyst|systems analyst/.test(t)) return `محلل نظم وأعمال ${prefix}`.trim();
  if (/power bi/.test(t)) return `مطور تقارير Power BI ${prefix}`.trim();
  if (/flutter|mobile developer/.test(t)) return `مطور تطبيقات هواتف ${prefix}`.trim();
  if (/qa|quality assurance|software tester/.test(t)) return `مهندس جودة واختبار (QA) ${prefix}`.trim();
  if (/scrum master|project manager/.test(t)) return `مدير مشاريع تقنية ${prefix}`.trim();
  if (/ui.?ux|ux.?ui|product designer/.test(t)) return `مصمم UI/UX ${prefix}`.trim();
  return title;
}

function translateLocationToAr(location: string): string {
  const l = location.toLowerCase();
  if (/sheikh zayed|zayed/.test(l)) return 'الشيخ زايد، الجيزة';
  if (/6th of october|october city/.test(l)) return 'السادس من أكتوبر، الجيزة';
  if (/smart village/.test(l)) return 'القرية الذكية، الجيزة';
  if (/new cairo|tagamoa|5th settlement/.test(l)) return 'القاهرة الجديدة، القاهرة';
  if (/maadi/.test(l)) return 'المعادي، القاهرة';
  if (/nasr city/.test(l)) return 'مدينة نصر، القاهرة';
  if (/heliopolis|masr el gedida/.test(l)) return 'مصر الجديدة، القاهرة';
  if (/dokki/.test(l)) return 'الدقي، الجيزة';
  if (/mohandessin/.test(l)) return 'المهندسين، الجيزة';
  if (/giza/.test(l)) return 'الجيزة، مصر';
  if (/alexandria|alex/.test(l)) return 'الإسكندرية، مصر';
  if (/cairo/.test(l)) return 'القاهرة، مصر';
  if (/remote/.test(l)) return 'عن بُعد (مصر)';
  return location;
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-Field Extractors (semantic-first, hash-class as last fallback)
// ─────────────────────────────────────────────────────────────────────────────

function extractTitle($card: ReturnType<CheerioAPI>): string | null {
  // Priority: h2 > h3 > any heading > first anchor text
  const title =
    $card.find('h2').first().text().trim() ||
    $card.find('h3').first().text().trim() ||
    $card.find('[class*="title"] a, [class*="job-name"] a').first().text().trim() ||
    $card.find('a[href*="/job/"]').first().text().trim();
  return title && title.length >= 3 ? cleanText(title) : null;
}

function extractJobUrl($card: ReturnType<CheerioAPI>): string | null {
  // Direct individual job offer links: Priority h2/h3 heading link > direct /jobs/p/ or /job/ or /internship/ link
  const href =
    $card.find('h2 a[href*="/jobs/p/"]').first().attr('href') ||
    $card.find('h2 a[href*="/job/"]').first().attr('href') ||
    $card.find('h2 a[href*="/internship/"]').first().attr('href') ||
    $card.find('h3 a[href*="/jobs/p/"]').first().attr('href') ||
    $card.find('h3 a[href*="/job/"]').first().attr('href') ||
    $card.find('a[href*="/jobs/p/"]').first().attr('href') ||
    $card.find('a[href*="/job/"]').first().attr('href') ||
    $card.find('a[href*="/internship/"]').first().attr('href');

  if (!href) return null;

  // Explicitly reject company profiles, company careers pages, search queries, filter URLs
  if (/\/jobs\/careers\/|\/company\/|\/companies\/|\/careers\/|search\/|location=|city=|skills=|filters=/i.test(href)) {
    return null;
  }

  try {
    const fullUrl = new URL(href, WUZZUF_BASE).toString();
    // Validate that pathname actually looks like a direct job offer
    if (/\/jobs\/p\/|\/job\/|\/internship\//i.test(fullUrl)) {
      return fullUrl;
    }
    return fullUrl;
  } catch {
    const fallback = href.startsWith('http') ? href : `${WUZZUF_BASE}${href}`;
    return fallback;
  }
}

function extractCompany($: CheerioAPI, $card: ReturnType<CheerioAPI>): string | null {
  // 1. Company page link text
  let company = $card.find('a[href*="/jobs/careers/"]').first().text().trim();
  // 2. Image alt text
  if (!company || company.length < 2) {
    const alt = $card.find('img[alt*="Jobs and Careers"]').attr('alt') || '';
    if (alt) company = alt.replace(/^Jobs and Careers at /i, '').replace(/ Egypt$/i, '').trim();
  }
  // 3. Career URL slug
  if (!company || company.length < 2) {
    const careerHref = $card.find('a[href*="/jobs/careers/"]').attr('href') || '';
    const m = careerHref.match(/careers\/(.*?)(?:-Egypt)?-\d+/);
    if (m?.[1]) company = decodeURIComponent(m[1].replace(/-/g, ' '));
  }
  // 4. Only mark Confidential if page actually says so
  if (!company || company.length < 2) {
    const cardText = $card.text();
    if (/confidential/i.test(cardText)) return 'Confidential';
    return null; // Unknown, don't fake it
  }
  // Clean trailing location suffixes
  return company
    .replace(/\s*[-–—]\s*(?:New Cairo|Cairo|Giza|Alexandria|Smart Village|Maadi|Nasr City|6th of October|Dokki|Heliopolis|Egypt|مصر).*$/i, '')
    .replace(/[-–—]$/, '')
    .trim() || null;
}

function extractCompanyLogo($card: ReturnType<CheerioAPI>): string | null {
  const img = $card.find('img[src*="company_logo"], img[src*="wuzzuf-logo"], a[href*="/jobs/careers/"] img').first();
  const src = img.attr('src') || img.attr('data-src') || null;
  if (!src) return null;
  if (src.startsWith('data:') || /placeholder|default|avatar/i.test(src)) return null;
  return src.startsWith('http') ? src : `${WUZZUF_BASE}${src}`;
}

function extractLocation($card: ReturnType<CheerioAPI>): string {
  // semantic: look for location link or span
  const locText =
    $card.find('a[href*="location="], a[href*="city="]').first().text().trim() ||
    $card.find('[class*="location"], [class*="css-5wys0k"], [class*="css-16x61xq"]').first().text().trim();
  return cleanText(locText) || 'Cairo, Egypt';
}

function extractWorkTypeBadges($card: ReturnType<CheerioAPI>): string[] {
  const badges: string[] = [];
  // URL-based badges are stable across Wuzzuf HTML changes
  $card.find('a[href*="Full-Time"], a[href*="Part-Time"], a[href*="Remote"], a[href*="On-Site"], a[href*="Hybrid"], a[href*="job-type"]').each((_, el) => {
    const t = $card.find(el).text().trim();
    if (t) badges.push(t);
  });
  // Seniority / experience links
  $card.find('a[href*="experience="], a[href*="level="]').each((_, el) => {
    const t = $card.find(el).text().trim();
    if (t) badges.push(t);
  });
  return badges;
}

/** Priority 1: URL-pattern skill tags (most stable). Priority 2: legacy class fallback */
function extractSkillTags($card: ReturnType<CheerioAPI>): string[] {
  const tags: string[] = [];
  // Wuzzuf skill filter links are stable: href contains skill name in URL
  $card.find('a[href*="-Jobs-in-Egypt"], a[href*="skills="], a[href*="skill="]').each((_, el) => {
    const txt = $card.find(el).text().replace(/^[·\s]+/, '').trim();
    const lower = txt.toLowerCase();
    if (
      txt &&
      txt.length >= 2 &&
      txt.length <= 35 &&
      !lower.match(/full.?time|part.?time|on.?site|remote|hybrid|years|intern/i)
    ) {
      tags.push(txt);
    }
  });
  // Fallback: legacy hash-based classes (fragile — last resort)
  if (tags.length === 0) {
    $card.find('.css-5x9pm1, .css-5x9545, [class*="css-5x9"]').each((_, el) => {
      const txt = $card.find(el).text().replace(/^[·\s]+/, '').trim();
      if (txt && txt.length >= 2 && txt.length <= 35) tags.push(txt);
    });
  }
  return tags;
}

/** Multi-strategy date extraction — returns null if unknown (never fakes now) */
function extractPostedDate($card: ReturnType<CheerioAPI>): string | null {
  // 1. Standard <time datetime="..."> attribute (most reliable)
  const timeEl = $card.find('time').first();
  if (timeEl.length) {
    const dt = timeEl.attr('datetime');
    if (dt) {
      try { return new Date(dt).toISOString(); } catch { /* fall through */ }
    }
    const timeText = timeEl.text().trim();
    const parsed = parseRelativeDate(timeText);
    if (parsed) return parsed;
  }

  // 2. Scan all text nodes for relative date patterns
  const allTexts = $card.find('*').toArray()
    .map(el => $card.find(el).clone().children().remove().end().text().trim())
    .filter(Boolean);
  const relativeText = allTexts.find(t =>
    /(\d+\s*(minute|hour|day|week|month)s?\s*ago)|منذ\s*\d+/i.test(t)
  );
  if (relativeText) return parseRelativeDate(relativeText);

  // 3. Hash-class fallback (unreliable but better than nothing)
  const dateText = $card.find('[class*="date"], [class*="time"], [class*="posted"], [class*="css-1jldrig"], [class*="css-do2t5m"]').first().text().trim();
  if (dateText) return parseRelativeDate(dateText);

  // Unknown — store null, not new Date()
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Card Validation
// ─────────────────────────────────────────────────────────────────────────────

const UNRELATED_TITLE_PATTERNS = [
  /fabric/i, /yarn/i, /textile/i, /sales manager/i, /sales executive/i,
  /field sales/i, /telesales/i, /call center/i, /customer service agent/i,
  /real estate/i, /property consultant/i, /broker/i, /pharmacist/i, /pharma/i,
  /medical rep/i, /doctor/i, /nurse/i, /civil engineer/i, /architect(?!ure)/i,
  /site engineer/i, /interior design/i, /accountant(?!.*data)/i, /cashier/i,
  /receptionist/i, /driver/i, /chef/i, /waiter/i, /technician(?!.*(lab|network|it))/i,
  /maintenance/i, /procurement/i, /purchasing/i, /storekeeper/i, /warehouse/i,
];

function isValidJobCard($card: ReturnType<CheerioAPI>): boolean {
  const hasJobLink = $card.find('a[href*="/job/"], a[href*="/jobs/"]').length > 0;
  const title = extractTitle($card);
  if (!title || !hasJobLink) return false;
  // Reject explicitly unrelated non-tech titles
  if (UNRELATED_TITLE_PATTERNS.some(p => p.test(title))) return false;
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// Data Quality Classifier
// ─────────────────────────────────────────────────────────────────────────────

function classifyDataQuality(job: Partial<ScrapedJob>): JobDataQuality {
  const hasVerified = (job.required_skills?.length ?? 0) >= 2;
  const hasInferred = (job.inferred_skills?.length ?? 0) >= 1;
  const hasDate = !!job.posted_at;
  const hasCompany = !!job.company;

  if (hasVerified && hasDate && hasCompany) return 'verified';
  if (hasVerified || (hasInferred && hasDate)) return 'partial';
  if (hasInferred) return 'inferred';
  return 'unresolved';
}

// ─────────────────────────────────────────────────────────────────────────────
// Enrichment Priority Score (higher = more urgent to fetch detail page)
// ─────────────────────────────────────────────────────────────────────────────

function enrichmentPriority(job: ScrapedJob): number {
  let score = 0;
  if (job.required_skills.length === 0) score += 50;
  if (job.required_skills.length < 2) score += 20;
  if (!job.company) score += 20;
  if (!job.posted_at) score += 15;
  return score;
}

// ─────────────────────────────────────────────────────────────────────────────
// HTTP: Fetch with Retry + Exponential Backoff
// ─────────────────────────────────────────────────────────────────────────────

async function fetchWithRetry(url: string, maxRetries = 2): Promise<string | null> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: BROWSER_HEADERS,
        next: { revalidate: 0 },
        signal: AbortSignal.timeout(15_000),
      });
      if (response.status === 429) {
        const wait = 2500 * Math.pow(2, attempt) + Math.random() * 500;
        console.warn(`[WuzzufScraper] 429 rate-limit on ${url.slice(0, 60)} — backoff ${Math.round(wait)}ms`);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }
      if (!response.ok) {
        console.warn(`[WuzzufScraper] HTTP ${response.status} on ${url.slice(0, 60)}`);
        return null;
      }
      return await response.text();
    } catch (e: any) {
      if (attempt === maxRetries) {
        console.warn(`[WuzzufScraper] Network error (${e.message}) on ${url.slice(0, 60)}`);
        return null;
      }
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }
  }
  return null;
}

async function runConcurrent<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i]);
    }
  }
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, worker);
  await Promise.all(workers);
  return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// Detail Page Enrichment
// ─────────────────────────────────────────────────────────────────────────────

const DESCRIPTION_HEADINGS = [
  'job requirements', 'requirements', 'qualifications', 'what you will need',
  'what you\'ll need', 'skills required', 'skills & experience', 'responsibilities',
  'what you will do', 'job description', 'about the role', 'what we\'re looking for',
  'preferred qualifications', 'nice to have', 'preferred skills',
];

function extractDescriptionFromDetailPage($: CheerioAPI): { required: string; preferred: string; fullText: string } {
  let required = '';
  let preferred = '';
  let fullText = '';

  // 1. Try heading-based extraction for structured pages
  $('h1, h2, h3, h4, strong, b').each((_, el) => {
    const heading = $(el).text().trim().toLowerCase();
    const matchedHeading = DESCRIPTION_HEADINGS.find(h => heading.includes(h));
    if (matchedHeading) {
      const section = $(el).closest('section, div, article').text();
      const isPreferred = /preferred|nice.?to.?have|bonus/i.test(heading);
      if (isPreferred) {
        preferred += ' ' + section;
      } else {
        required += ' ' + section;
      }
    }
  });

  // 2. Fallback: main content area
  if (required.trim().length < 80) {
    fullText = $('main, article, [class*="details"], [class*="job-details"]').text();
    if (fullText.trim().length < 80) {
      fullText = $('body').text();
    }
  }

  return {
    required: cleanText(required),
    preferred: cleanText(preferred),
    fullText: cleanText(fullText || required),
  };
}

async function enrichJobWithDetails(job: ScrapedJob): Promise<ScrapedJob> {
  // Skip if already well-enriched
  if (job.required_skills.length >= 3 && job.posted_at && job.company) return job;

  const html = await fetchWithRetry(job.apply_url, 1);
  if (!html) return job;

  const $ = cheerio.load(html);
  const { required, preferred, fullText } = extractDescriptionFromDetailPage($);

  const textToSearch = [required, preferred, fullText].join(' ');

  // Extract skills from description
  const verifiedSkills = deduplicateSkills(extractSkillsFromText(textToSearch));
  const preferredSkills = preferred
    ? deduplicateSkills(extractSkillsFromText(preferred))
    : [];
  const requiredVerified = verifiedSkills.filter(s => !preferredSkills.includes(s));

  // Try to extract date from detail page if still missing
  let posted_at = job.posted_at;
  if (!posted_at) {
    const timeEl = $('time').first();
    const dt = timeEl.attr('datetime');
    if (dt) {
      try { posted_at = new Date(dt).toISOString(); } catch { /**/ }
    }
    if (!posted_at) {
      const relText = $('body').text().match(/(\d+\s*(?:hour|day|week|month)s?\s*ago)/i)?.[0];
      if (relText) posted_at = parseRelativeDate(relText);
    }
  }

  const enriched: ScrapedJob = {
    ...job,
    required_skills: requiredVerified.length > 0 ? requiredVerified : job.required_skills,
    preferred_skills: preferredSkills.length > 0 ? preferredSkills : job.preferred_skills,
    posted_at,
    description: required.slice(0, 800) || job.description,
    requirements: preferred.slice(0, 600) || job.requirements,
    last_enriched_at: new Date().toISOString(),
    skill_source: requiredVerified.length > 0
      ? [...new Set([...job.skill_source, 'job_description' as SkillSource])]
      : job.skill_source,
  };

  enriched.data_quality = classifyDataQuality(enriched);
  return enriched;
}

// ─────────────────────────────────────────────────────────────────────────────
// Listing Page Scraper
// ─────────────────────────────────────────────────────────────────────────────

async function scrapeWuzzufQuery(query: string, maxPages = 2): Promise<ScrapedJob[]> {
  const jobs: ScrapedJob[] = [];

  for (let page = 0; page < maxPages; page++) {
    const url = `${WUZZUF_BASE}/search/jobs/?q=${encodeURIComponent(query)}&a=hpb&start=${page}`;
    const html = await fetchWithRetry(url, 2);
    if (!html) continue;

    try {
      const $ = cheerio.load(html);

      // ── Card Detection via job link proximity (semantic, not class-hash-based) ──
      const jobLinks = $('a[href*="/job/"], a[href*="/jobs/p/"]');
      const seenUrls = new Set<string>();
      const cardElements: ReturnType<CheerioAPI>[] = [];

      jobLinks.each((_, link) => {
        const href = $(link).attr('href');
        if (!href) return;
        const fullUrl = href.startsWith('http') ? href : `${WUZZUF_BASE}${href}`;
        if (seenUrls.has(fullUrl)) return;
        // Find the closest meaningful container
        const container = $(link).closest('article, li, section, div.job-card-wuzzuf, [class*="css-1gatmva"], [class*="css-pkv5jc"]');
        if (container.length && container.find('h2, h3').length) {
          seenUrls.add(fullUrl);
          cardElements.push(container);
        }
      });

      for (const cardEl of cardElements) {
        try {
          const $card = $(cardEl);
          if (!isValidJobCard($card)) continue;

          const title = extractTitle($card);
          const applyUrl = extractJobUrl($card);
          if (!title || !applyUrl) continue;

          const company = extractCompany($, $card);
          const companyLogo = extractCompanyLogo($card);
          const location = extractLocation($card);
          const badges = extractWorkTypeBadges($card);
          const badgeStr = badges.join(' ');
          const { workType, isRemote } = parseWorkType(badgeStr + ' ' + location);
          const seniority = parseSeniority(badgeStr + ' ' + title);
          const rawSkillTags = extractSkillTags($card);
          const postedAt = extractPostedDate($card);

          // Skill pipeline: verified from tags first
          const verifiedFromTags = deduplicateSkills([
            ...rawSkillTags,
            ...extractSkillsFromText(title),
          ]);

          // Infer from title only when verified is weak — kept separate
          const inferred = inferSkillsFromTitle(title);
          const inferredSkillNames = deduplicateSkills(inferred.map(s => s.name));

          const skillSources: SkillSource[] = [];
          if (verifiedFromTags.length > 0) skillSources.push('job_tags');
          if (inferredSkillNames.length > 0) skillSources.push('title_inference');

          const partialJob: Partial<ScrapedJob> = {
            required_skills: verifiedFromTags,
            inferred_skills: inferredSkillNames,
            posted_at: postedAt,
            company,
          };

          const dataQuality = classifyDataQuality(partialJob);

          const job: ScrapedJob = {
            id: generateJobId(applyUrl),
            title,
            title_ar: translateTitleToAr(title),
            company,
            company_ar: company,
            company_logo: companyLogo,
            location,
            location_ar: translateLocationToAr(location),
            work_type: workType,
            is_remote: isRemote,
            seniority,
            salary_range: extractSalaryRange($card.text()),
            required_skills: verifiedFromTags,
            inferred_skills: inferredSkillNames,
            preferred_skills: [],
            skill_source: skillSources,
            data_quality: dataQuality,
            description: `Exciting opportunity for a ${title} position at ${company ?? 'a leading company'} in ${location}.`,
            description_ar: `فرصة عمل في ${company ?? 'شركة رائدة'} — ${translateTitleToAr(title)} (${translateLocationToAr(location)})`,
            requirements: verifiedFromTags.slice(0, 4).map(s => `• Experience with ${s}`).join('\n'),
            requirements_ar: verifiedFromTags.slice(0, 4).map(s => `• خبرة في ${s}`).join('\n'),
            apply_url: applyUrl,
            source: 'wuzzuf',
            posted_at: postedAt,
            last_enriched_at: null,
          };

          jobs.push(job);
        } catch { /* skip bad card, continue */ }
      }

      // Polite delay between pages
      await new Promise(r => setTimeout(r, 1200 + Math.random() * 600));
    } catch (e: any) {
      console.warn(`[WuzzufScraper] Error parsing query "${query}" page ${page}:`, e.message);
    }
  }

  return jobs;
}

// ─────────────────────────────────────────────────────────────────────────────
// Data Quality Score for Upsert Decision
// ─────────────────────────────────────────────────────────────────────────────

const QUALITY_RANK: Record<JobDataQuality, number> = {
  unresolved: 0, inferred: 1, partial: 2, verified: 3,
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Scraper Entry Point
// ─────────────────────────────────────────────────────────────────────────────

export async function runWuzzufScraper(): Promise<ScraperHealthReport> {
  const errors: string[] = [];
  const allScrapedMap = new Map<string, ScrapedJob>();

  console.log('[WuzzufScraper] Starting multi-category scraping run...');

  // ── Phase 1: Listing Pages ──
  for (const query of SEARCH_QUERIES) {
    try {
      const queryJobs = await scrapeWuzzufQuery(query, 2);
      for (const job of queryJobs) {
        const existing = allScrapedMap.get(job.id);
        // Accept new job or replace only if higher quality
        if (!existing || QUALITY_RANK[job.data_quality] >= QUALITY_RANK[existing.data_quality]) {
          allScrapedMap.set(job.id, job);
        }
      }
      console.log(`[WuzzufScraper] "${query}" → ${queryJobs.length} jobs (unique total: ${allScrapedMap.size})`);
      await new Promise(r => setTimeout(r, 800 + Math.random() * 400));
    } catch (e: any) {
      errors.push(`Query "${query}": ${e.message}`);
    }
  }

  let jobsList = Array.from(allScrapedMap.values());

  // ── Phase 2: Detail Page Enrichment (quality-based queue) ──
  const needsEnrichment = jobsList
    .filter(j => enrichmentPriority(j) > 0)
    .sort((a, b) => enrichmentPriority(b) - enrichmentPriority(a))
    .slice(0, DETAIL_FETCH_LIMIT);

  console.log(`[WuzzufScraper] Enriching ${needsEnrichment.length} jobs via detail pages...`);

  const enriched = await runConcurrent(needsEnrichment, DETAIL_FETCH_CONCURRENCY, enrichJobWithDetails);
  const enrichedMap = new Map(enriched.map(j => [j.id, j]));

  jobsList = jobsList.map(j => enrichedMap.get(j.id) ?? j);

  // ── Phase 3: Upsert to Supabase ──
  let upsertCount = 0;
  let deletedCount = 0;

  const supabase = createAdminClient();
  if (supabase && jobsList.length > 0) {
    try {
      const CHUNK_SIZE = 50;
      for (let i = 0; i < jobsList.length; i += CHUNK_SIZE) {
        const batch = jobsList.slice(i, i + CHUNK_SIZE);

        // Fetch existing quality for each job in batch — never downgrade verified → partial
        const batchIds = batch.map(j => j.id);
        const { data: existing } = await supabase
          .from('jobs')
          .select('id, data_quality')
          .in('id', batchIds);

        const existingQualityMap = new Map(
          (existing ?? []).map((r: { id: string; data_quality: JobDataQuality }) => [r.id, r.data_quality as JobDataQuality])
        );

        const batchToUpsert = batch.filter(job => {
          const existingQuality = existingQualityMap.get(job.id);
          if (!existingQuality) return true; // new job
          // Only upsert if new quality >= existing quality
          return QUALITY_RANK[job.data_quality] >= QUALITY_RANK[existingQuality];
        });

        if (batchToUpsert.length > 0) {
          const { error } = await supabase
            .from('jobs')
            .upsert(batchToUpsert, { onConflict: 'id', ignoreDuplicates: false });

          if (error) {
            console.error('[WuzzufScraper] Upsert error:', error);
            errors.push(`Upsert error: ${error.message}`);
          } else {
            upsertCount += batchToUpsert.length;
          }
        }
      }

      // Clean up jobs older than 30 days
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      const { data: deleted, error: delErr } = await supabase
        .from('jobs')
        .delete()
        .lt('posted_at', cutoff.toISOString())
        .not('posted_at', 'is', null)
        .select('id');
      if (!delErr && deleted) {
        deletedCount = deleted.length;
        console.log(`[WuzzufScraper] Cleaned up ${deletedCount} expired jobs`);
      }
    } catch (e: any) {
      errors.push(`DB error: ${e.message}`);
    }
  } else if (!supabase) {
    errors.push('Supabase Admin Client unavailable — check SUPABASE_SERVICE_ROLE_KEY');
  }

  // ── Health Report ──
  const verifiedJobs = jobsList.filter(j => j.data_quality === 'verified' || j.data_quality === 'partial').length;
  const inferredJobs = jobsList.filter(j => j.data_quality === 'inferred').length;
  const unresolvedJobs = jobsList.filter(j => j.data_quality === 'unresolved').length;
  const withDate = jobsList.filter(j => !!j.posted_at).length;
  const withCompany = jobsList.filter(j => !!j.company).length;

  const report: ScraperHealthReport = {
    success: errors.length === 0,
    totalScraped: jobsList.length,
    totalInsertedOrUpdated: upsertCount,
    expiredDeleted: deletedCount,
    jobsWithVerifiedSkills: verifiedJobs,
    jobsWithInferredSkills: inferredJobs,
    jobsUnresolved: unresolvedJobs,
    dateExtractionRate: jobsList.length > 0 ? parseFloat((withDate / jobsList.length).toFixed(2)) : 0,
    companyExtractionRate: jobsList.length > 0 ? parseFloat((withCompany / jobsList.length).toFixed(2)) : 0,
    detailPagesFetched: needsEnrichment.length,
    errors,
  };

  console.log('[WuzzufScraper] Run complete:', JSON.stringify(report, null, 2));

  // Alert if extraction quality drops below threshold
  if (report.dateExtractionRate < 0.6) {
    console.error('[WuzzufScraper] ⚠️ ALERT: date extraction rate below 60% — Wuzzuf may have changed HTML structure!');
  }
  if (verifiedJobs / Math.max(jobsList.length, 1) < 0.5) {
    console.error('[WuzzufScraper] ⚠️ ALERT: verified skill extraction rate below 50% — check skill tag selectors!');
  }

  return report;
}

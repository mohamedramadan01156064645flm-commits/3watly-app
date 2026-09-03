/**
 * 3watly — Wuzzuf Scraper v2 (Standalone Node.js Runner)
 * Mirrors the logic in src/lib/scraper/wuzzuf.ts exactly.
 * Run: node scripts/run-scraper-v2.mjs
 */

import * as cheerio from 'cheerio';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────
import fs from 'fs';
import path from 'path';

function getEnvVal(key) {
  if (process.env[key]) return process.env[key];
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const m = content.match(new RegExp(`^${key}=(.*)$`, 'm'));
      if (m) return m[1].trim().replace(/^['"]|['"]$/g, '');
    }
  } catch {}
  return '';
}

const SUPABASE_URL = getEnvVal('NEXT_PUBLIC_SUPABASE_URL');
const SERVICE_ROLE_KEY = getEnvVal('SUPABASE_SERVICE_ROLE_KEY') || getEnvVal('NEXT_PUBLIC_SUPABASE_ANON_KEY');

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const WUZZUF_BASE = 'https://wuzzuf.net';
const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8',
  'Referer': 'https://www.google.com/',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
};

const SEARCH_QUERIES = [
  'data analyst', 'data engineer', 'data scientist',
  'business intelligence', 'machine learning engineer',
  'python developer', 'sql developer',
  'frontend developer', 'react developer',
  'backend developer', 'full stack developer',
  'devops engineer', 'product manager',
  'business analyst', 'power bi developer',
  'flutter developer', 'mobile developer', 'qa engineer',
];

const DETAIL_FETCH_LIMIT = 50;
const DETAIL_FETCH_CONCURRENCY = 3;

// ─────────────────────────────────────────────────────────────────────────────
// Skill Intelligence
// ─────────────────────────────────────────────────────────────────────────────
const SKILL_ALIASES = {
  'reactjs': 'React', 'react.js': 'React',
  'nodejs': 'Node.js', 'node js': 'Node.js', 'node': 'Node.js',
  'postgres': 'PostgreSQL', 'pg': 'PostgreSQL',
  'js': 'JavaScript', 'ts': 'TypeScript',
  'powerbi': 'Power BI', 'power_bi': 'Power BI', 'msbi': 'Power BI',
  'ms sql': 'SQL Server', 'mssql': 'SQL Server',
  'vue': 'Vue.js', 'vuejs': 'Vue.js',
  'nextjs': 'Next.js', 'next.js': 'Next.js',
  'k8s': 'Kubernetes',
  'scikit': 'Scikit-Learn', 'sklearn': 'Scikit-Learn',
  'tensorflow': 'TensorFlow', 'pytorch': 'PyTorch',
  'restapi': 'REST APIs', 'rest api': 'REST APIs', 'rest': 'REST APIs',
  'ci/cd': 'CI/CD', 'cicd': 'CI/CD',
  'graphql': 'GraphQL', 'nlp': 'NLP', 'etl': 'ETL',
};

const SKILL_BLACKLIST = new Set([
  'experienced','experience','senior','junior','mid level','expert','manager','specialist',
  'internship','intern','student','entry level','fresh graduate','fresher','graduate',
  'it','information technology','information technology (it)','software development','engineering',
  'engineering - mechanical/electrical','manufacturing/production','operations/management',
  'creative/design/art','engineering - other','business administration','quality control',
  'general','other','miscellaneous','research','ability','skills','knowledge','understanding',
  'strong','good','excellent','proficient','familiar','basic','advanced',
  'full time','part time','contract','freelance','remote','on-site','hybrid',
  'communication','teamwork','leadership','problem solving','critical thinking',
  'analytical skills','work under pressure','attention to detail','time management',
  'data analysis','business analysis','data analytics','market research',
  'shift based','males only','females only','unspecified','education','training',
  'technology','tech','computer science','software','it/software',
]);

const ROLE_SKILL_PROFILES = {
  'data analyst':         { core: ['SQL','Excel','Power BI'], common: ['Python','Tableau','Statistics'] },
  'data analytics':       { core: ['SQL','Excel','Power BI'], common: ['Python','Tableau'] },
  'data engineer':        { core: ['Python','SQL','ETL'], common: ['Airflow','Docker','Spark','dbt'] },
  'data scientist':       { core: ['Python','Machine Learning','Statistics'], common: ['TensorFlow','PyTorch','Pandas'] },
  'machine learning':     { core: ['Python','Machine Learning','Statistics'], common: ['TensorFlow','PyTorch','Scikit-Learn'] },
  'business intelligence':{ core: ['Power BI','SQL','Excel'], common: ['DAX','Tableau','Data Modeling'] },
  'bi developer':         { core: ['Power BI','SQL','Excel'], common: ['DAX','Tableau'] },
  'power bi':             { core: ['Power BI','SQL','DAX'], common: ['Excel','Data Modeling'] },
  'frontend':             { core: ['JavaScript','HTML','CSS','React'], common: ['TypeScript','Next.js','Git'] },
  'react':                { core: ['React','JavaScript','HTML'], common: ['TypeScript','Next.js','Git'] },
  'backend':              { core: ['REST APIs','SQL','Git'], common: ['Node.js','Python','Docker'] },
  'full stack':           { core: ['JavaScript','SQL','Git','REST APIs'], common: ['React','Node.js','Docker'] },
  'fullstack':            { core: ['JavaScript','SQL','Git'], common: ['React','Node.js','Docker'] },
  'devops':               { core: ['Docker','CI/CD','Linux','Git'], common: ['Kubernetes','AWS','Ansible'] },
  'mobile':               { core: ['REST APIs','Git'], common: ['Flutter','React Native','Firebase'] },
  'flutter':              { core: ['Flutter','Dart','REST APIs'], common: ['Firebase','Git'] },
  'product manager':      { core: ['Agile','Jira','Analytics'], common: ['Scrum','SQL','Confluence'] },
  'product owner':        { core: ['Agile','Jira'], common: ['Scrum','Analytics'] },
  'business analyst':     { core: ['SQL','Excel','Requirements Analysis'], common: ['Power BI','Jira'] },
  'qa':                   { core: ['Manual Testing','Jira','Test Cases'], common: ['Selenium','Postman'] },
  'quality assurance':    { core: ['Manual Testing','Jira'], common: ['Selenium','Automation Testing'] },
};

const KNOWN_TECH_SKILLS = [
  'Python','SQL','Power BI','Tableau','Excel','Pandas','NumPy','R',
  'PostgreSQL','MySQL','MongoDB','Redis','Oracle','SQL Server','Snowflake',
  'BigQuery','dbt','Airflow','Kafka','Docker','Kubernetes','AWS','Azure',
  'GCP','Google Cloud','Git','GitHub','CI/CD','Linux','React','Next.js',
  'TypeScript','JavaScript','Node.js','Express','FastAPI','Django','Flask',
  'Java','Spring Boot','C#','.NET','C++','Go','PHP','Laravel','Angular',
  'Vue.js','Tailwind CSS','GraphQL','REST APIs','Agile','Scrum','Jira',
  'Data Modeling','ETL','Machine Learning','Deep Learning',
  'NLP','TensorFlow','PyTorch','Scikit-Learn','Statistics',
  'Selenium','Postman','Flutter','Dart','Firebase','DAX','Spark',
  'Ansible','Terraform','Prometheus','Grafana','Elasticsearch',
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function genId(url) {
  return 'wuzzuf_' + crypto.createHash('md5').update(url).digest('hex').slice(0, 16);
}
function cleanText(t) { return t.replace(/\s+/g, ' ').trim(); }
function normalizeSkill(raw) {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (trimmed.length < 2) return null;
  const key = trimmed.toLowerCase().replace(/\s+/g,' ');
  return SKILL_ALIASES[key] || trimmed;
}
function dedupeSkills(skills) {
  const seen = new Set();
  return skills
    .map(s => normalizeSkill(s))
    .filter(s => {
      if (!s) return false;
      const lo = s.toLowerCase();
      if (SKILL_BLACKLIST.has(lo)) return false;
      if (s.length < 2 || s.length > 40) return false;
      if (/^\d+$/.test(s)) return false;
      if (s.split(/\s+/).length > 4) return false;
      if (seen.has(lo)) return false;
      seen.add(lo);
      return true;
    });
}
function inferSkillsFromTitle(title) {
  const t = title.toLowerCase();
  for (const [key, profile] of Object.entries(ROLE_SKILL_PROFILES)) {
    if (t.includes(key)) {
      return dedupeSkills([...profile.core, ...profile.common]);
    }
  }
  return [];
}
function extractSkillsFromText(text) {
  const found = new Set();
  for (const skill of KNOWN_TECH_SKILLS) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`(?<![a-zA-Z])${escaped}(?![a-zA-Z])`, 'i').test(text)) {
      found.add(skill);
    }
  }
  return [...found];
}
function parseSeniority(text) {
  const t = text.toLowerCase();
  if (/entry|fresh|graduate|intern|0[-–]1|trainee/.test(t)) return 'Fresh';
  if (/junior|1[-–][23]/.test(t)) return 'Junior';
  if (/senior|lead|principal|manager|5\+|7\+/.test(t)) return 'Senior';
  return 'Mid';
}
function parseWorkType(text) {
  const t = text.toLowerCase();
  if (/hybrid/.test(t)) return { workType: 'Hybrid', isRemote: false };
  if (/remote|work from home|عن بعد/.test(t)) return { workType: 'Remote', isRemote: true };
  return { workType: 'On-site', isRemote: false };
}
function extractSalaryFromCardText(cardText) {
  if (!cardText) return 'تحدد أثناء المقابلة';
  const match = cardText.match(/(\d[\d,]*\s*(?:to|-|–)\s*\d[\d,]*\s*(?:EGP|USD|EUR|ج\.م|\$)[^\n•,]*)/i);
  if (match) return match[1].trim();
  return 'تحدد أثناء المقابلة';
}
function parseRelativeDate(text) {
  if (!text?.trim()) return null;
  const t = text.toLowerCase().trim();
  const now = new Date();
  const h = t.match(/(\d+)\s*(?:hour|hours|hr|ساعة|ساعات)/);
  if (h) { now.setHours(now.getHours() - +h[1]); return now.toISOString(); }
  const d = t.match(/(\d+)\s*(?:day|days|يوم|أيام)/);
  if (d) { now.setDate(now.getDate() - +d[1]); return now.toISOString(); }
  const w = t.match(/(\d+)\s*(?:week|weeks|أسبوع|أسابيع)/);
  if (w) { now.setDate(now.getDate() - +w[1] * 7); return now.toISOString(); }
  const m = t.match(/(\d+)\s*(?:month|months|شهر|أشهر)/);
  if (m) { now.setMonth(now.getMonth() - +m[1]); return now.toISOString(); }
  if (/just now|الآن|اليوم|today/.test(t)) return now.toISOString();
  return null; // NEVER fake a date
}
function translateTitle(title) {
  const t = title.toLowerCase();
  let pfx = /senior|lead|principal/.test(t) ? 'أول ' : /junior|entry/.test(t) ? 'مبتدئ ' : '';
  if (/data analyst/.test(t)) return `محلل بيانات ${pfx}`.trim();
  if (/data engineer/.test(t)) return `مهندس بيانات ${pfx}`.trim();
  if (/data scientist/.test(t)) return `عالم بيانات ${pfx}`.trim();
  if (/business intelligence|bi developer/.test(t)) return `مطور ذكاء أعمال (BI) ${pfx}`.trim();
  if (/machine learning|ai engineer/.test(t)) return `مهندس ذكاء اصطناعي ${pfx}`.trim();
  if (/frontend|front-end|react developer/.test(t)) return `مطور واجهات أمامية ${pfx}`.trim();
  if (/backend|back-end/.test(t)) return `مطور خلفية (Backend) ${pfx}`.trim();
  if (/full.?stack|fullstack/.test(t)) return `مطور برمجيات شامل ${pfx}`.trim();
  if (/devops|cloud engineer/.test(t)) return `مهندس DevOps ${pfx}`.trim();
  if (/product manager/.test(t)) return `مدير منتجات رقمية ${pfx}`.trim();
  if (/business analyst/.test(t)) return `محلل نظم وأعمال ${pfx}`.trim();
  if (/power bi/.test(t)) return `مطور تقارير Power BI ${pfx}`.trim();
  if (/flutter|mobile developer/.test(t)) return `مطور تطبيقات هواتف ${pfx}`.trim();
  if (/qa|quality assurance/.test(t)) return `مهندس جودة (QA) ${pfx}`.trim();
  return title;
}
function translateLocation(loc) {
  const l = loc.toLowerCase();
  if (/sheikh zayed|zayed/.test(l)) return 'الشيخ زايد، الجيزة';
  if (/6th of october|october/.test(l)) return 'السادس من أكتوبر، الجيزة';
  if (/smart village/.test(l)) return 'القرية الذكية، الجيزة';
  if (/new cairo|tagamoa/.test(l)) return 'القاهرة الجديدة، القاهرة';
  if (/maadi/.test(l)) return 'المعادي، القاهرة';
  if (/nasr city/.test(l)) return 'مدينة نصر، القاهرة';
  if (/heliopolis/.test(l)) return 'مصر الجديدة، القاهرة';
  if (/dokki/.test(l)) return 'الدقي، الجيزة';
  if (/mohandessin/.test(l)) return 'المهندسين، الجيزة';
  if (/giza/.test(l)) return 'الجيزة، مصر';
  if (/alexandria|alex/.test(l)) return 'الإسكندرية، مصر';
  if (/cairo/.test(l)) return 'القاهرة، مصر';
  if (/remote/.test(l)) return 'عن بُعد (مصر)';
  return loc;
}
function classifyQuality(job) {
  const hasVerified = (job.required_skills?.length ?? 0) >= 2;
  const hasInferred = (job.inferred_skills?.length ?? 0) >= 1;
  const hasDate = !!job.posted_at;
  const hasCompany = !!job.company;
  if (hasVerified && hasDate && hasCompany) return 'verified';
  if (hasVerified || (hasInferred && hasDate)) return 'partial';
  if (hasInferred) return 'inferred';
  return 'unresolved';
}
function enrichPriority(job) {
  let s = 0;
  if ((job.required_skills?.length ?? 0) === 0) s += 50;
  if ((job.required_skills?.length ?? 0) < 2) s += 20;
  if (!job.company) s += 20;
  if (!job.posted_at) s += 15;
  return s;
}

// ─────────────────────────────────────────────────────────────────────────────
// HTTP
// ─────────────────────────────────────────────────────────────────────────────
async function fetchWithRetry(url, maxRetries = 2) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: BROWSER_HEADERS,
        signal: AbortSignal.timeout(15000),
      });
      if (res.status === 429) {
        const wait = 2500 * Math.pow(2, attempt) + Math.random() * 500;
        console.warn(`  ⚠️  Rate limited — wait ${Math.round(wait)}ms`);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }
      if (!res.ok) { console.warn(`  ⚠️  HTTP ${res.status} — ${url.slice(0,70)}`); return null; }
      return await res.text();
    } catch(e) {
      if (attempt === maxRetries) { console.warn(`  ❌ Fetch failed: ${e.message}`); return null; }
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }
  }
  return null;
}

async function runConcurrent(items, concurrency, fn) {
  const results = new Array(items.length);
  let idx = 0;
  async function worker() {
    while (idx < items.length) { const i = idx++; results[i] = await fn(items[i]); }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// Card Extractors
// ─────────────────────────────────────────────────────────────────────────────
function extractTitle($card, $) {
  return cleanText(
    $card.find('h2').first().text() ||
    $card.find('h3').first().text() ||
    $card.find('a[href*="/job/"]').first().text()
  ) || null;
}
function extractJobUrl($card) {
  const href = $card.find('h2 a[href*="/jobs/p/"]').first().attr('href') ||
               $card.find('h2 a[href*="/job/"]').first().attr('href') ||
               $card.find('h2 a[href*="/internship/"]').first().attr('href') ||
               $card.find('h3 a[href*="/jobs/p/"]').first().attr('href') ||
               $card.find('h3 a[href*="/job/"]').first().attr('href') ||
               $card.find('a[href*="/jobs/p/"]').first().attr('href') ||
               $card.find('a[href*="/job/"]').first().attr('href') ||
               $card.find('a[href*="/internship/"]').first().attr('href');

  if (!href) return null;

  // Reject company profiles, directories, searches
  if (/\/jobs\/careers\/|\/company\/|\/companies\/|\/careers\/|search\/|location=|city=|skills=|filters=/i.test(href)) {
    return null;
  }

  try { return new URL(href, WUZZUF_BASE).toString(); } catch { return href.startsWith('http') ? href : `${WUZZUF_BASE}${href}`; }
}
function extractCompany($card) {
  let c = $card.find('a[href*="/jobs/careers/"]').first().text().trim();
  if (!c || c.length < 2) {
    const alt = $card.find('img[alt*="Jobs and Careers"]').attr('alt') || '';
    if (alt) c = alt.replace(/^Jobs and Careers at /i,'').replace(/ Egypt$/i,'').trim();
  }
  if (!c || c.length < 2) {
    const href = $card.find('a[href*="/jobs/careers/"]').attr('href') || '';
    const m = href.match(/careers\/(.*?)(?:-Egypt)?-\d+/);
    if (m?.[1]) c = decodeURIComponent(m[1].replace(/-/g,' '));
  }
  if (!c || c.length < 2) {
    return /confidential/i.test($card.text()) ? 'Confidential' : null;
  }
  return c.replace(/\s*[-–—]\s*(?:New Cairo|Cairo|Giza|Alexandria|Smart Village|Maadi|Egypt|مصر).*$/i,'').replace(/[-–—]$/,'').trim() || null;
}
function extractLogo($card) {
  const img = $card.find('img[src*="company_logo"], a[href*="/jobs/careers/"] img').first();
  const src = img.attr('src') || img.attr('data-src') || null;
  if (!src || src.startsWith('data:') || /placeholder|default/i.test(src)) return null;
  return src.startsWith('http') ? src : `${WUZZUF_BASE}${src}`;
}
function extractLocation($card) {
  return cleanText(
    $card.find('a[href*="location="], a[href*="city="]').first().text() ||
    $card.find('[class*="location"],[class*="css-5wys0k"],[class*="css-16x61xq"]').first().text()
  ) || 'Cairo, Egypt';
}
function extractBadges($card) {
  const tags = [];
  $card.find('a[href*="Full-Time"],a[href*="Part-Time"],a[href*="Remote"],a[href*="On-Site"],a[href*="Hybrid"],a[href*="experience="],a[href*="level="]').each((_,el) => {
    const t = $card.find(el).text().trim(); if (t) tags.push(t);
  });
  return tags;
}
function extractSkillTags($card) {
  const tags = [];
  // Priority 1: URL-pattern skill links (stable across Wuzzuf HTML changes)
  $card.find('a[href*="-Jobs-in-Egypt"],a[href*="skills="],a[href*="skill="]').each((_,el) => {
    const txt = $card.find(el).text().replace(/^[·\s]+/,'').trim();
    if (txt && txt.length >= 2 && txt.length <= 35 && !/full.?time|part.?time|on.?site|remote|hybrid|years/i.test(txt)) {
      tags.push(txt);
    }
  });
  // Priority 2: Legacy hash classes (fragile fallback)
  if (tags.length === 0) {
    $card.find('[class*="css-5x9"]').each((_,el) => {
      const txt = $card.find(el).text().replace(/^[·\s]+/,'').trim();
      if (txt && txt.length >= 2 && txt.length <= 35) tags.push(txt);
    });
  }
  return tags;
}
function extractDate($card) {
  // 1. time[datetime]
  const timeEl = $card.find('time').first();
  if (timeEl.length) {
    const dt = timeEl.attr('datetime');
    if (dt) { try { return new Date(dt).toISOString(); } catch {} }
    const parsed = parseRelativeDate(timeEl.text());
    if (parsed) return parsed;
  }
  // 2. Text scan for relative dates
  let found = null;
  $card.find('*').each((_, el) => {
    if (found) return;
    const t = $card.find(el).clone().children().remove().end().text().trim();
    if (/(\d+\s*(minute|hour|day|week|month)s?\s*ago)|منذ\s*\d+/i.test(t)) found = parseRelativeDate(t);
  });
  if (found) return found;
  // 3. Hash-class fallback
  const dateText = $card.find('[class*="date"],[class*="time"],[class*="posted"],[class*="css-1jldrig"],[class*="css-do2t5m"]').first().text().trim();
  return parseRelativeDate(dateText); // may be null — that's correct
}

// ─────────────────────────────────────────────────────────────────────────────
// Detail Page Enrichment
// ─────────────────────────────────────────────────────────────────────────────
const DETAIL_HEADINGS = [
  'job requirements','requirements','qualifications','what you will need',
  'skills required','skills & experience','responsibilities','job description',
  'about the role','what we\'re looking for','preferred qualifications','nice to have',
];
async function enrichJob(job) {
  if (job.required_skills.length >= 3 && job.posted_at && job.company) return job;
  const html = await fetchWithRetry(job.apply_url, 1);
  if (!html) return job;
  const $ = cheerio.load(html);

  let required = '', preferred = '';
  $('h1,h2,h3,h4,strong,b').each((_, el) => {
    const heading = $(el).text().trim().toLowerCase();
    if (DETAIL_HEADINGS.some(h => heading.includes(h))) {
      const section = $(el).closest('section,div,article').text();
      if (/preferred|nice.?to.?have|bonus/i.test(heading)) preferred += ' ' + section;
      else required += ' ' + section;
    }
  });
  if (required.trim().length < 80) required = $('main,article').text();
  const fullText = [required, preferred].join(' ');
  const verifiedSkills = dedupeSkills(extractSkillsFromText(fullText));
  const prefSkills = preferred ? dedupeSkills(extractSkillsFromText(preferred)) : [];
  const reqVerified = verifiedSkills.filter(s => !prefSkills.includes(s));

  let posted_at = job.posted_at;
  if (!posted_at) {
    let exactDateStr = $('span.css-154erwh, span[class*="css-154erwh"]').first().text().trim();
    if (!exactDateStr) {
      $('*').each((_, el) => {
        if (exactDateStr) return;
        const t = $(el).clone().children().remove().end().text().trim();
        if (/^posted\s+\d+\s+(?:hour|day|week|month)s?\s+ago/i.test(t)) {
          exactDateStr = t;
        }
      });
    }
    if (exactDateStr) {
      posted_at = parseRelativeDate(exactDateStr);
    }
    if (!posted_at) {
      const timeEl = $('time').first();
      const dt = timeEl.attr('datetime');
      if (dt) { try { posted_at = new Date(dt).toISOString(); } catch {} }
    }
    if (!posted_at) {
      const rel = $('body').text().match(/(?:posted\s+)?(\d+\s*(?:hour|day|week|month)s?\s*ago)/i)?.[0];
      if (rel) posted_at = parseRelativeDate(rel);
    }
  }

  const enriched = {
    ...job,
    required_skills: reqVerified.length > 0 ? reqVerified : job.required_skills,
    preferred_skills: prefSkills.length > 0 ? prefSkills : job.preferred_skills,
    posted_at,
    description: cleanText(required).slice(0, 800) || job.description,
    requirements: cleanText(preferred).slice(0, 600) || job.requirements,
    last_enriched_at: new Date().toISOString(),
    skill_source: reqVerified.length > 0
      ? [...new Set([...job.skill_source, 'job_description'])]
      : job.skill_source,
  };
  enriched.data_quality = classifyQuality(enriched);
  return enriched;
}

// ─────────────────────────────────────────────────────────────────────────────
// Listing Scraper
// ─────────────────────────────────────────────────────────────────────────────
async function scrapeQuery(query, maxPages = 2) {
  const jobs = [];
  for (let page = 0; page < maxPages; page++) {
    const url = `${WUZZUF_BASE}/search/jobs/?q=${encodeURIComponent(query)}&a=hpb&start=${page}`;
    const html = await fetchWithRetry(url, 2);
    if (!html) continue;
    try {
      const $ = cheerio.load(html);
      const seenUrls = new Set();
      $('a[href*="/job/"],a[href*="/jobs/p/"]').each((_, link) => {
        try {
          const href = $(link).attr('href');
          if (!href) return;
          const fullUrl = href.startsWith('http') ? href : `${WUZZUF_BASE}${href}`;
          if (seenUrls.has(fullUrl)) return;
          const $card = $(link).closest('article,li,[class*="css-1gatmva"],[class*="css-pkv5jc"],div.job-card-wuzzuf');
          if (!$card.length || !$card.find('h2,h3').length) return;
          seenUrls.add(fullUrl);

          const title = extractTitle($card, $);
          const applyUrl = extractJobUrl($card) || fullUrl;
          if (!title || !applyUrl) return;

          // Reject explicitly non-tech / unrelated roles
          const UNRELATED_TITLE_PATTERNS = [
            /fabric/i, /yarn/i, /textile/i, /sales manager/i, /sales executive/i,
            /field sales/i, /telesales/i, /call center/i, /customer service agent/i,
            /real estate/i, /property consultant/i, /broker/i, /pharmacist/i, /pharma/i,
            /medical rep/i, /doctor/i, /nurse/i, /civil engineer/i, /architect(?!ure)/i,
            /site engineer/i, /interior design/i, /accountant(?!.*data)/i, /cashier/i,
            /receptionist/i, /driver/i, /chef/i, /waiter/i, /technician(?!.*(lab|network|it))/i,
            /maintenance/i, /procurement/i, /purchasing/i, /storekeeper/i, /warehouse/i,
          ];
          if (UNRELATED_TITLE_PATTERNS.some(p => p.test(title))) return;

          const company = extractCompany($card);
          const logo = extractLogo($card);
          const location = extractLocation($card);
          const badges = extractBadges($card);
          const badgeStr = badges.join(' ');
          const { workType, isRemote } = parseWorkType(badgeStr + ' ' + location);
          const seniority = parseSeniority(badgeStr + ' ' + title);
          const rawTags = extractSkillTags($card);
          const postedAt = extractDate($card);

          const verifiedFromTags = dedupeSkills([...rawTags, ...extractSkillsFromText(title)]);
          const inferredSkills = inferSkillsFromTitle(title);
          const skillSources = [];
          if (verifiedFromTags.length > 0) skillSources.push('job_tags');
          if (inferredSkills.length > 0) skillSources.push('title_inference');

          const partial = { required_skills: verifiedFromTags, inferred_skills: inferredSkills, posted_at: postedAt, company };
          const dataQuality = classifyQuality(partial);

          jobs.push({
            id: genId(applyUrl),
            title, title_ar: translateTitle(title),
            company, company_ar: company,
            company_logo: logo,
            location, location_ar: translateLocation(location),
            work_type: workType, is_remote: isRemote,
            seniority, salary_range: extractSalaryFromCardText($card.text()),
            required_skills: verifiedFromTags,
            inferred_skills: inferredSkills,
            preferred_skills: [],
            skill_source: skillSources,
            data_quality: dataQuality,
            description: `Exciting opportunity for a ${title} position at ${company ?? 'a leading company'} in ${location}.`,
            description_ar: `فرصة عمل في ${company ?? 'شركة رائدة'} — ${translateTitle(title)} (${translateLocation(location)})`,
            requirements: verifiedFromTags.slice(0, 4).map(s => `• Experience with ${s}`).join('\n'),
            requirements_ar: verifiedFromTags.slice(0, 4).map(s => `• خبرة في ${s}`).join('\n'),
            apply_url: applyUrl, source: 'wuzzuf',
            posted_at: postedAt, last_enriched_at: null,
          });
        } catch {}
      });
      console.log(`    Page ${page+1}: found ${jobs.length} jobs so far`);
      await new Promise(r => setTimeout(r, 1200 + Math.random() * 600));
    } catch(e) { console.warn(`  ⚠️  Parse error: ${e.message}`); }
  }
  return jobs;
}

// ─────────────────────────────────────────────────────────────────────────────
// DB Migration (runs before scraping)
// ─────────────────────────────────────────────────────────────────────────────
const QUALITY_RANK = { unresolved: 0, inferred: 1, partial: 2, verified: 3 };

async function runMigration() {
  console.log('\n🗄️  Running DB schema migration...');

  // We use Supabase's direct PostgREST for reads/writes, but DDL needs psql.
  // Instead, we test if new columns exist by trying to select them.
  const { data, error } = await supabase
    .from('jobs')
    .select('id, data_quality, inferred_skills, preferred_skills, skill_source, last_enriched_at')
    .limit(1);

  if (!error) {
    console.log('  ✅ New columns already exist — migration not needed.');
    return true;
  }

  if (error.message?.includes('column') || error.message?.includes('does not exist')) {
    console.log('  ⚠️  New columns missing. Please run scripts/db-migration-scraper-v2.sql in your Supabase SQL Editor first.');
    console.log('  ℹ️  Continuing with scraping using existing schema...');
    return false; // signal: use old schema
  }

  console.log(`  ❌ DB check error: ${error.message}`);
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  console.log('═════════════════════════════════════════════════════════');
  console.log('  3watly Wuzzuf Scraper v2 — Full Run');
  console.log(`  Started: ${new Date().toLocaleString('ar-EG')}`);
  console.log('═════════════════════════════════════════════════════════\n');

  const hasNewSchema = await runMigration();

  const allMap = new Map();

  // Phase 1: Listing Pages
  console.log('\n📋  Phase 1: Listing Pages\n');
  for (const query of SEARCH_QUERIES) {
    console.log(`  🔍 Scraping: "${query}"`);
    try {
      const results = await scrapeQuery(query, 2);
      let added = 0;
      for (const job of results) {
        const existing = allMap.get(job.id);
        if (!existing || QUALITY_RANK[job.data_quality] >= QUALITY_RANK[existing.data_quality]) {
          allMap.set(job.id, job); added++;
        }
      }
      console.log(`  ✅ "${query}": ${results.length} found (${added} new/updated). Total unique: ${allMap.size}\n`);
    } catch(e) { console.log(`  ❌ "${query}" failed: ${e.message}\n`); }
    await new Promise(r => setTimeout(r, 800 + Math.random() * 400));
  }

  let jobsList = [...allMap.values()];
  console.log(`\n📊  Listing Phase Complete:`);
  console.log(`  Total unique jobs: ${jobsList.length}`);
  console.log(`  With skills: ${jobsList.filter(j => j.required_skills.length > 0).length}`);
  console.log(`  Without skills: ${jobsList.filter(j => j.required_skills.length === 0).length}`);
  console.log(`  With date: ${jobsList.filter(j => j.posted_at).length}`);
  console.log(`  With company: ${jobsList.filter(j => j.company).length}`);

  // Phase 2: Detail Enrichment
  const needEnrich = jobsList
    .filter(j => enrichPriority(j) > 0)
    .sort((a,b) => enrichPriority(b) - enrichPriority(a))
    .slice(0, DETAIL_FETCH_LIMIT);

  console.log(`\n🔬  Phase 2: Detail Enrichment (${needEnrich.length} jobs)\n`);
  let enriched = 0;
  const enrichedResults = await runConcurrent(needEnrich, DETAIL_FETCH_CONCURRENCY, async (job) => {
    const result = await enrichJob(job);
    if (result.required_skills.length > job.required_skills.length || result.posted_at !== job.posted_at) {
      process.stdout.write(`  ✓ Enriched: ${job.title.slice(0,40)}\n`);
      enriched++;
    }
    return result;
  });
  const enrichedMap = new Map(enrichedResults.map(j => [j.id, j]));
  jobsList = jobsList.map(j => enrichedMap.get(j.id) ?? j);

  console.log(`\n  Enrichment complete: ${enriched}/${needEnrich.length} jobs improved`);

  // Quality summary
  const byQuality = { verified: 0, partial: 0, inferred: 0, unresolved: 0 };
  jobsList.forEach(j => byQuality[j.data_quality]++);
  console.log('\n📈  Data Quality Distribution:');
  console.log(`  ✅ Verified:   ${byQuality.verified}`);
  console.log(`  🔶 Partial:    ${byQuality.partial}`);
  console.log(`  🔵 Inferred:   ${byQuality.inferred}`);
  console.log(`  ❌ Unresolved: ${byQuality.unresolved}`);

  // Phase 3: Upsert to Supabase
  console.log('\n💾  Phase 3: Saving to Supabase...\n');
  let upserted = 0, skipped = 0, errors = 0;
  const CHUNK = 50;

  for (let i = 0; i < jobsList.length; i += CHUNK) {
    const batch = jobsList.slice(i, i + CHUNK);

    // Build payload — only include new schema columns if available
    const payload = batch.map(job => {
      const base = {
        id: job.id,
        title: job.title,
        title_ar: job.title_ar,
        company: job.company,
        company_ar: job.company_ar,
        company_logo: job.company_logo,
        location: job.location,
        location_ar: job.location_ar,
        work_type: job.work_type,
        is_remote: job.is_remote,
        seniority: job.seniority,
        salary_range: job.salary_range,
        required_skills: job.required_skills,
        description: job.description,
        requirements: job.requirements,
        apply_url: job.apply_url,
        source: job.source,
        posted_at: job.posted_at,
      };
      if (hasNewSchema) {
        return {
          ...base,
          inferred_skills: job.inferred_skills,
          preferred_skills: job.preferred_skills,
          skill_source: job.skill_source,
          data_quality: job.data_quality,
          last_enriched_at: job.last_enriched_at,
        };
      }
      return base;
    });

    const { error } = await supabase
      .from('jobs')
      .upsert(payload, { onConflict: 'id', ignoreDuplicates: false });

    if (error) {
      console.error(`  ❌ Batch ${Math.floor(i/CHUNK)+1} error: ${error.message}`);
      errors++;
    } else {
      upserted += batch.length;
      process.stdout.write(`  ✅ Saved batch ${Math.floor(i/CHUNK)+1}/${Math.ceil(jobsList.length/CHUNK)} (${upserted} jobs)\r`);
    }
  }

  // Cleanup: delete jobs older than 30 days (only non-null posted_at)
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const { data: deleted } = await supabase
    .from('jobs').delete()
    .lt('posted_at', cutoff.toISOString())
    .not('posted_at', 'is', null)
    .select('id');

  const dateRate = jobsList.length > 0 ? (jobsList.filter(j => j.posted_at).length / jobsList.length * 100).toFixed(1) : 0;
  const companyRate = jobsList.length > 0 ? (jobsList.filter(j => j.company).length / jobsList.length * 100).toFixed(1) : 0;
  const skillRate = jobsList.length > 0 ? (jobsList.filter(j => j.required_skills.length > 0).length / jobsList.length * 100).toFixed(1) : 0;

  console.log('\n\n═════════════════════════════════════════════════════════');
  console.log('  ✅ SCRAPER RUN COMPLETE');
  console.log('═════════════════════════════════════════════════════════');
  console.log(`  Total scraped:       ${jobsList.length}`);
  console.log(`  Saved to DB:         ${upserted}`);
  console.log(`  Expired deleted:     ${deleted?.length ?? 0}`);
  console.log(`  Batch errors:        ${errors}`);
  console.log(`  Date extraction:     ${dateRate}%${+dateRate < 60 ? ' ⚠️  ALERT' : ' ✅'}`);
  console.log(`  Company extraction:  ${companyRate}%${+companyRate < 70 ? ' ⚠️' : ' ✅'}`);
  console.log(`  Skill extraction:    ${skillRate}%${+skillRate < 50 ? ' ⚠️  ALERT' : ' ✅'}`);
  console.log(`  Finished: ${new Date().toLocaleString('ar-EG')}`);
  console.log('═════════════════════════════════════════════════════════\n');

  if (+dateRate < 60) console.warn('  ⚠️  ALERT: Date extraction below 60% — Wuzzuf may have changed HTML!');
  if (+skillRate < 50) console.warn('  ⚠️  ALERT: Skill extraction below 50% — check selectors!');
}

main().catch(console.error);

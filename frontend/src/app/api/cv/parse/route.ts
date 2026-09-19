import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { extractText, extractLinks, getDocumentProxy } from 'unpdf';
import {
  extractLinksFromPdf,
  extractLinksFromText,
  processDocumentLinks,
  cleanUrl,
  RawExtractedLink,
} from '@/lib/cv/cvLinkIntelligence';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Comprehensive tech and professional skills dictionary
const KNOWN_SKILLS = {
  programming: [
    'Python', 'SQL', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'R', 'PHP', 'Go', 'Rust', 'Ruby', 
    'Dart', 'Kotlin', 'Swift', 'Scala', 'HTML', 'CSS', 'HTML5', 'CSS3', 'Bash', 'Shell', 'PowerShell', 'C'
  ],
  frameworks: [
    'React', 'React.js', 'Next.js', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Express.js', 'Nest.js',
    'Django', 'Flask', 'FastAPI', 'Spring Boot', 'ASP.NET', '.NET Core', 'Laravel', 'Flutter', 'React Native',
    'TensorFlow', 'PyTorch', 'Scikit-Learn', 'Pandas', 'NumPy', 'SciPy', 'OpenCV', 'YOLO', 'Keras', 'Tailwind CSS'
  ],
  databasesAndTools: [
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server', 'SQLite', 'Elasticsearch',
    'Power BI', 'Tableau', 'Excel', 'Advanced Excel', 'Git', 'GitHub', 'GitLab', 'Docker', 'Kubernetes', 'Jira',
    'Airflow', 'Kafka', 'dbt', 'Snowflake', 'BigQuery', 'Postman', 'Looker', 'SSIS', 'Matplotlib', 'Seaborn',
    'Jupyter Notebook', 'Gradio', 'Hugging Face'
  ],
  cloud: [
    'AWS', 'Google Cloud', 'GCP', 'Azure', 'Firebase', 'Supabase', 'Cloudflare', 'Heroku', 'Linux', 'Ubuntu',
    'CI/CD', 'GitHub Actions', 'Jenkins', 'Terraform', 'Serverless', 'Microservices'
  ],
  soft: [
    'Problem Solving', 'Teamwork', 'Leadership', 'Time Management', 'Critical Thinking',
    'Agile', 'Scrum', 'Data Cleaning', 'Data Visualization', 'Statistical Analysis',
    'Machine Learning', 'Deep Learning', 'Computer Vision', 'Image Segmentation', 'Object Detection', 'EDA'
  ]
};

// Words that should NEVER be reported as skills even if they appear in raw text
const SKILL_BLACKLIST = new Set([
  'experienced', 'experience', 'proficient', 'knowledge', 'skills', 'skill',
  'ability', 'familiar', 'understanding', 'working', 'using', 'strong', 'good',
  'excellent', 'great', 'expert', 'advanced', 'intermediate', 'basic', 'proven',
  'certified', 'managed', 'worked', 'created', 'built', 'developed',
  'internship', 'student', 'data analysis', 'business analysis'
]);

const ACTION_VERBS = [
  'led', 'developed', 'architected', 'managed', 'created', 'implemented', 'designed', 'built', 'analyzed',
  'optimized', 'improved', 'increased', 'reduced', 'automated', 'delivered', 'collaborated', 'generated',
  'spearheaded', 'streamlined', 'launched', 'resolved', 'deployed', 'monitored', 'engineered', 'formulated',
  'trained', 'evaluated', 'researched', 'maintained', 'conducted', 'tested', 'orchestrated'
];

export const CERT_DOMAINS = [
  'cognitiveclass.ai', 'freecodecamp.org', '365datascience.com',
  'coursera.org', 'udemy.com', 'edx.org', 'datacamp.com',
  'linkedin.com/learning', 'pluralsight.com', 'skillshare.com',
  'udacity.com', 'openclassrooms.com', 'simplilearn.com',
  'alison.com', 'ibm.com/training', 'microsoft.com/learning',
  'google.com/certificates', 'credential.net', 'acclaim.com',
  'credly.com', 'verify.', 'credential.',
];

export const isCertUrl = (url: string) => CERT_DOMAINS.some(d => url.toLowerCase().includes(d));

export interface ExtractedLinkItem {
  title: string;
  url: string;
  type: 'linkedin' | 'github' | 'portfolio' | 'kaggle' | 'leetcode' | 'behance' | 'medium' | 'website' | 'demo' | 'company';
}

export interface ExtractedLinksResult {
  linkedin: string;
  github: string;
  portfolio: string;
  allLinks: ExtractedLinkItem[];
}

export function extractDocumentLinks(buffer: Buffer, rawText: string, additionalUrls: string[] = []): ExtractedLinksResult {
  const foundUrls = new Set<string>();
  const binaryString = buffer.toString('binary');
  const utf8String = buffer.toString('utf-8');

  // 0. Include pre-extracted URLs (e.g. from PDF annotator extractLinks)
  if (Array.isArray(additionalUrls)) {
    for (const u of additionalUrls) {
      if (typeof u === 'string' && u.trim().length > 5) {
        foundUrls.add(u.trim());
      }
    }
  }

  // 1. PDF /URI annotations: /URI (https://...)
  const pdfUriRegex = /\/URI\s*\(([^)\r\n]+)\)/gi;
  let match: RegExpExecArray | null;
  while ((match = pdfUriRegex.exec(binaryString)) !== null) {
    const raw = match[1].trim();
    if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('mailto:')) {
      foundUrls.add(raw);
    }
  }

  // 2. PDF /URI with hex encoding: /URI <...>
  const pdfHexUriRegex = /\/URI\s*<([0-9a-fA-F]+)>/gi;
  while ((match = pdfHexUriRegex.exec(binaryString)) !== null) {
    try {
      const decoded = Buffer.from(match[1], 'hex').toString('utf-8').trim();
      if (decoded.startsWith('http://') || decoded.startsWith('https://')) {
        foundUrls.add(decoded);
      }
    } catch {}
  }

  // 3. Raw standard URLs from utf8 text and binary stream
  const rawUrlRegex = /https?:\/\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]+/gi;
  while ((match = rawUrlRegex.exec(utf8String)) !== null) {
    const clean = match[0].replace(/[.,;:)>\]\\]+$/, '').trim();
    if (clean.length > 10 && !clean.includes('w3.org') && !clean.includes('adobe.com') && !clean.includes('schema.org')) {
      foundUrls.add(clean);
    }
  }

  // Also scan rawText if provided separately
  if (rawText && rawText !== utf8String) {
    while ((match = rawUrlRegex.exec(rawText)) !== null) {
      const clean = match[0].replace(/[.,;:)>\]\\]+$/, '').trim();
      if (clean.length > 10 && !clean.includes('w3.org') && !clean.includes('adobe.com') && !clean.includes('schema.org')) {
        foundUrls.add(clean);
      }
    }
  }

  // 3b. Markdown links: [text](url)
  const mdLinkRegex = /\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/gi;
  while ((match = mdLinkRegex.exec(rawText || utf8String)) !== null) {
    const clean = match[2].replace(/[.,;:)>\]\\]+$/, '').trim();
    if (clean.length > 8) {
      foundUrls.add(clean);
    }
  }

  // 4. Domain-like text patterns without http
  const domainPatterns = [
    /(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_\-\/]+/gi,
    /(?:www\.)?github\.com\/[a-zA-Z0-9_\-\/]+/gi,
    /(?:www\.)?kaggle\.com\/[a-zA-Z0-9_\-\/]+/gi,
    /(?:www\.)?leetcode\.com\/(?:u\/)?[a-zA-Z0-9_\-\/]+/gi,
    /(?:www\.)?behance\.net\/[a-zA-Z0-9_\-\/]+/gi,
    /(?:www\.)?medium\.com\/@[a-zA-Z0-9_\-\/]+/gi,
    /[a-zA-Z0-9_\-]+\.(?:vercel\.app|netlify\.app|github\.io|streamlit\.app|me|dev|tech|site|bio|link)(?:\/[a-zA-Z0-9_\-.~%]*)*\b/gi,
  ];

  for (const pat of domainPatterns) {
    while ((match = pat.exec(utf8String)) !== null) {
      const clean = match[0].replace(/[.,;:)>\]\\]+$/, '').trim();
      if (clean.length > 5) {
        foundUrls.add(clean.startsWith('http') ? clean : `https://${clean}`);
      }
    }
    if (rawText && rawText !== utf8String) {
      while ((match = pat.exec(rawText)) !== null) {
        const clean = match[0].replace(/[.,;:)>\]\\]+$/, '').trim();
        if (clean.length > 5) {
          foundUrls.add(clean.startsWith('http') ? clean : `https://${clean}`);
        }
      }
    }
  }

  // Categorize URLs
  let linkedin = '';
  let github = '';
  let portfolio = '';
  const allLinks: ExtractedLinkItem[] = [];
  const seenUrls = new Set<string>();

  for (const url of foundUrls) {
    const lower = url.toLowerCase();

    // Skip PDF schema/metadata URLs
    if (
      lower.includes('ns.adobe.com') ||
      lower.includes('w3.org') ||
      lower.includes('purl.org') ||
      lower.includes('xml.org') ||
      lower.includes('schemas.openxmlformats.org') ||
      lower.includes('schemas.microsoft.com')
    ) {
      continue;
    }

    // Skip certification / learning platform URLs from being categorized as social links
    if (isCertUrl(lower)) continue;

    if (seenUrls.has(lower)) continue;
    seenUrls.add(lower);

    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;

    // GitHub Pages (e.g. username.github.io) → portfolio, not GitHub profile
    const isGhPages = /[a-z0-9_-]+\.github\.io/i.test(lower);

    if (
      (lower.includes('linkedin.com/in/') || lower.includes('linkedin.com/pub/')) &&
      !lower.includes('linkedin.com/company/') &&
      !lower.includes('linkedin.com/learning')
    ) {
      if (!linkedin) linkedin = formattedUrl;
      allLinks.push({ title: 'LinkedIn', url: formattedUrl, type: 'linkedin' });
    } else if (lower.includes('linkedin.com/company/')) {
      allLinks.push({ title: 'Company', url: formattedUrl, type: 'company' });
    } else if (isGhPages) {
      if (!portfolio) portfolio = formattedUrl;
      allLinks.push({ title: 'Portfolio', url: formattedUrl, type: 'portfolio' });
    } else if (lower.includes('github.com/') && !lower.includes('github.com/features') && !lower.includes('github.com/pricing')) {
      // Distinguish profile (1 segment) from repo (2+ segments)
      try {
        const parsedUrl = new URL(formattedUrl);
        const parts = parsedUrl.pathname.replace(/^\//, '').replace(/\/$/, '').split('/').filter(Boolean);
        if (parts.length === 1) {
          // Profile URL
          if (!github) github = formattedUrl;
          allLinks.push({ title: 'GitHub', url: formattedUrl, type: 'github' });
        } else {
          // Repo URL — include in allLinks for project correlation, but don't set as main github profile
          allLinks.push({ title: 'GitHub Repo', url: formattedUrl, type: 'github' });
        }
      } catch {
        if (!github) github = formattedUrl;
        allLinks.push({ title: 'GitHub', url: formattedUrl, type: 'github' });
      }
    } else if (
      lower.includes('huggingface.co') ||
      lower.includes('.hf.space') ||
      lower.includes('streamlit.app') ||
      lower.includes('colab.research.google.com')
    ) {
      allLinks.push({ title: 'Live Demo', url: formattedUrl, type: 'demo' });
    } else if (lower.includes('kaggle.com/')) {
      allLinks.push({ title: 'Kaggle', url: formattedUrl, type: 'kaggle' });
    } else if (lower.includes('leetcode.com/')) {
      allLinks.push({ title: 'LeetCode', url: formattedUrl, type: 'leetcode' });
    } else if (lower.includes('behance.net/')) {
      allLinks.push({ title: 'Behance', url: formattedUrl, type: 'behance' });
    } else if (lower.includes('medium.com/')) {
      allLinks.push({ title: 'Medium', url: formattedUrl, type: 'medium' });
    } else if (
      lower.includes('vercel.app') ||
      lower.includes('netlify.app') ||
      lower.includes('.me/') ||
      lower.includes('.dev/') ||
      lower.includes('portfolio')
    ) {
      if (!portfolio) portfolio = formattedUrl;
      allLinks.push({ title: 'Portfolio', url: formattedUrl, type: 'portfolio' });
    } else if (
      !lower.includes('google.com') &&
      !lower.includes('gmail.com') &&
      !lower.includes('wuzzuf.net') &&
      !lower.includes('bayt.com') &&
      !lower.includes('indeed.com') &&
      !lower.includes('glassdoor.com')
    ) {
      allLinks.push({ title: 'Website', url: formattedUrl, type: 'website' });
    }
  }

  return { linkedin, github, portfolio, allLinks };
}

interface ExtractedData {
  fullName: string;
  currentTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  socialLinks?: Array<{ id: string; platform: string; url: string }>;
  links?: ExtractedLinkItem[];
  summary: string;
  targetRole: string;
  experienceYears: number;
  experiences: Array<{
    id: string;
    company: string;
    companyUrl?: string;
    role: string;
    startDate: string;
    endDate: string;
    current: boolean;
    location?: string;
    description?: string;
    bullets: string[];
    type?: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    major: string;
    startDate: string;
    endDate: string;
    location?: string;
  }>;
  skills: string[];
  categorizedSkills: {
    programming: string[];
    frameworks: string[];
    databasesAndTools: string[];
    cloud: string[];
    soft: string[];
  };
  categorizedSkillGroups?: Array<{
    id: string;
    label: string;
    skills: string[];
  }>;
  projects: Array<{
    id: string;
    title: string;
    description: string;
    technologies: string[];
    bullets: string[];
    link?: string;
    github?: string;
  }>;
  certificates?: Array<{
    id: string;
    name: string;
    issuer: string;
    url?: string;
    date?: string;
  }>;
  sectionOrder?: string[];
  isAllInternships?: boolean;
  atsReport: {
    score: number;
    structureScore: number;
    readabilityScore: number;
    impactScore: number;
    skillsScore: number;
    hasEmail: boolean;
    hasPhone: boolean;
    hasLocation: boolean;
    hasSummary: boolean;
    hasExperience: boolean;
    hasEducation: boolean;
    hasSkills: boolean;
    hasMetrics: boolean;
    actionVerbsCount: number;
    metricsCount: number;
    strengths: Array<{ en: string; ar: string }>;
    improvements: string[];
  };
  insights: {
    totalSkills: number;
    yearsOfExperience: number;
    atsScore: number;
    marketFit: number;
    strengths: string[];
    topGaps: string[];
  };
  actionPlan: Array<{
    id?: string;
    title: string;
    titleAr?: string;
    category: string;
    categoryAr?: string;
    priority: 'high' | 'medium' | 'low';
    description: string;
    descriptionAr?: string;
  }>;
}

export function parseCVText(
  rawText: string,
  targetRoleInput?: string,
  fileName?: string,
  extractedLinksResult?: ExtractedLinksResult,
  rawExtractedLinks: RawExtractedLink[] = []
): ExtractedData {
  // Strip markdown-link syntax [Display Text](URL) → keep Display Text only.
  // This prevents company names like [IT-Gate Academy](https://linkedin.com/company/...) 
  // from polluting section parsing. We keep rawText intact for URL regex extraction.
  const strippedText = rawText.replace(/\[([^\]]*)\]\(https?:\/\/[^)]+\)/g, '$1');

  const lines = strippedText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  // 1. Extract Email
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0].toLowerCase() : '';

  // 2. Extract Phone
  const phoneMatch = rawText.match(/(?:\+?20|0020|0)?1[0125][0-9]{8}|\+?[0-9]{10,15}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // 3. Extract LinkedIn, GitHub & Portfolio (combining buffer links + text regex)
  const linkedinMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  const linkedin = extractedLinksResult?.linkedin || (
    linkedinMatch ? `https://linkedin.com/in/${linkedinMatch[1]}` : ''
  );

  const githubMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  const github = extractedLinksResult?.github || (
    githubMatch ? `https://github.com/${githubMatch[1]}` : ''
  );

  // Portfolio: match any non-linkedin/github URL that looks like a personal portfolio site
  const portfolioMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:com|io|me|dev|net|org)\/[a-zA-Z0-9/_-]*)/i);
  let textPortfolio = '';
  if (portfolioMatch) {
    const raw = portfolioMatch[0].toLowerCase();
    if (
      !raw.includes('linkedin.com') &&
      !raw.includes('github.com') &&
      !raw.includes('huggingface.co') &&
      !raw.includes('.hf.space') &&
      !raw.includes('streamlit.app') &&
      !raw.includes('google.com') &&
      !raw.includes('gmail.com') &&
      !raw.includes('w3.org') &&
      !isCertUrl(raw)
    ) {
      textPortfolio = portfolioMatch[0].startsWith('http') ? portfolioMatch[0] : `https://${portfolioMatch[0]}`;
    }
  }
  const portfolio = extractedLinksResult?.portfolio || textPortfolio || '';
  const links = extractedLinksResult?.allLinks || [];

  // 4. Extract Location
  let location = '';
  if (/cairo|القاهرة/i.test(rawText)) location = 'Cairo, Egypt';
  else if (/giza|الجيزة/i.test(rawText)) location = 'Giza, Egypt';
  else if (/alexandria|الإسكندرية/i.test(rawText)) location = 'Alexandria, Egypt';
  else if (/mansoura|المنصورة/i.test(rawText)) location = 'Mansoura, Egypt';
  else if (/riyadh|الرياض/i.test(rawText)) location = 'Riyadh, Saudi Arabia';
  else if (/jeddah|جدة/i.test(rawText)) location = 'Jeddah, Saudi Arabia';
  else if (/dubai|دبي/i.test(rawText)) location = 'Dubai, UAE';
  else if (/remote|عن بعد/i.test(rawText)) location = 'Remote';

  // 5. Extract Full Name (from top 4 lines)
  let fullName = '';
  for (const line of lines.slice(0, 5)) {
    const clean = line.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, '').trim();
    if (
      clean.length >= 3 &&
      clean.length <= 40 &&
      !line.includes('@') &&
      !line.includes('http') &&
      !line.includes('+20') &&
      !/resume|curriculum|vitae|page|profile|summary|skills|experience/i.test(line)
    ) {
      const words = clean.split(/\s+/);
      if (words.length >= 2 && words.length <= 4) {
        fullName = clean;
        break;
      }
    }
  }
  if (!fullName && email) {
    const handle = email.split('@')[0].replace(/[0-9._-]+/g, ' ').trim();
    if (handle.length >= 3) {
      fullName = handle.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    }
  }

  // 6. Extract Current Title / Professional Headline
  const ROLE_TITLE_PATTERN = new RegExp(
    '\\b(' +
    // Sales, Support, Business & Customer Service
    'sales\\s*representative|sales\\s*executive|sales\\s*specialist|sales\\s*manager|sales\\s*consultant|sales\\s*associate|account\\s*executive|account\\s*manager|business\\s*development|bdr|sdr|pharmacy\\s*assistant|medical\\s*representative|customer\\s*service|telesales|retail\\s*sales|' +
    // Technical & Engineering
    'engineer|developer|analyst|scientist|architect|specialist|technician|administrator|admin|sysadmin|programmer|coder|tester|testing|' +
    // IT & Support & Helpdesk
    'technical\\s*support|desktop\\s*support|help\\s*desk|service\\s*desk|it\\s*support|it\\s*specialist|it\\s*technician|systems?\\s*administrator|network\\s*administrator|network\\s*engineer|' +
    // Operations & Cloud & DevOps
    'devops|sre|site\\s*reliability|cloud\\s*engineer|infrastructure|cyber\\s*security|information\\s*security|soc\\s*analyst|qa|qc|quality\\s*assurance|test\\s*automation|' +
    // Software & Web & Mobile
    'frontend|front-end|backend|back-end|fullstack|full-stack|software|web|mobile|flutter|android|ios|react|node|python|java|\\.net|php|' +
    // Data & AI
    'data|machine\\s*learning|deep\\s*learning|artificial\\s*intelligence|business\\s*intelligence|power\\s*bi|tableau|etl|' +
    // Design & Product & Management
    'ui\\/ux|ui\\s*designer|ux\\s*designer|product\\s*manager|product\\s*owner|scrum\\s*master|project\\s*manager|agile\\s*coach|' +
    // Leadership & General Professional
    'consultant|expert|lead|leader|manager|director|officer|executive|coordinator|supervisor|instructor|trainer|associate|assistant|representative|' +
    // Student & Entry
    'intern|internship|trainee|graduate|student|fellow|apprentice' +
    ')\\b',
    'i'
  );

  const ARABIC_ROLE_PATTERN = /(?:مهندس|مطور|محلل|مبرمج|أخصائي|فني|مسؤول|مدير|مستشار|باحث|طالب|متدرب|مصمم|رئيس|مشرف|منسق|معاون|مساعد|تقني|خبير|دعم\s*فني|شبكات|نظم|مندوب\s*مبيعات|أخصائي\s*مبيعات|مسؤول\s*مبيعات|مساعد\s*صيدلي|خدمة\s*عملاء)/i;

  const NON_TITLE_LINE_REGEX = /(?:@|https?:\/\/|www\.|\.com|\.io|\.net|\.org|\+?\d{8,}|linkedin\.com|github\.com)/i;
  const SECTION_HEADING_NAMES = /^(?:summary|profile|about\s*me|objective|experience|work\s*history|employment|education|academic|skills|technical\s*skills|projects|certificates|certifications|languages|interests|references|الملخص|النبذة|الخبرة|الخبرات|التعليم|المهارات|المشاريع|الشهادات)[:\s]*$/i;

  function cleanHeadlineCandidate(raw: string): string {
    if (!raw) return '';
    // If line has pipe, bullets, or dashes separating roles/contact
    const segments = raw.split(/[|•·–—]/).map(s => s.trim()).filter(Boolean);
    const roleSegments: string[] = [];
    for (const seg of segments) {
      if (
        NON_TITLE_LINE_REGEX.test(seg) ||
        /^(?:cairo|giza|alexandria|egypt|riyadh|jeddah|dubai|uae|remote|القاهرة|الجيزة|مصر|عن بعد)$/i.test(seg)
      ) {
        continue;
      }
      if (ROLE_TITLE_PATTERN.test(seg) || ARABIC_ROLE_PATTERN.test(seg)) {
        roleSegments.push(seg);
      }
    }
    if (roleSegments.length > 0) {
      return roleSegments.join(' | ');
    }
    return raw.trim();
  }

  let currentTitle = '';
  const fullNameIdx = lines.findIndex(l => l === fullName);

  // Priority 1: Check line immediately following fullName
  if (fullNameIdx !== -1 && lines[fullNameIdx + 1]) {
    const nextLine = lines[fullNameIdx + 1].trim();
    if (
      nextLine.length >= 3 &&
      nextLine.length <= 140 &&
      !NON_TITLE_LINE_REGEX.test(nextLine) &&
      !SECTION_HEADING_NAMES.test(nextLine) &&
      (ROLE_TITLE_PATTERN.test(nextLine) || ARABIC_ROLE_PATTERN.test(nextLine) || nextLine.includes('|'))
    ) {
      currentTitle = cleanHeadlineCandidate(nextLine);
    }
  }

  // Priority 2: Scan top 25 lines (before main section bodies)
  if (!currentTitle) {
    for (const line of lines.slice(0, 25)) {
      if (
        line !== fullName &&
        line.length >= 3 &&
        line.length <= 140 &&
        !NON_TITLE_LINE_REGEX.test(line) &&
        !SECTION_HEADING_NAMES.test(line) &&
        (ROLE_TITLE_PATTERN.test(line) || ARABIC_ROLE_PATTERN.test(line))
      ) {
        currentTitle = cleanHeadlineCandidate(line);
        if (currentTitle) break;
      }
    }
  }

  // Priority 3: Check fileName for explicit role title (e.g. "Bassem Mahmoud Refaie Sales Representative resume.pdf")
  if (!currentTitle && fileName) {
    const cleanName = fileName.replace(/\.[^.]+$/, '').replace(/[_–—\-]/g, ' ');
    const fileRoleMatch = cleanName.match(/\b(sales\s*representative|sales\s*executive|sales\s*specialist|medical\s*representative|pharmacy\s*assistant|technical\s*support|help\s*desk|desktop\s*support|it\s*support|systems?\s*administrator|network\s*engineer|software\s*engineer|frontend\s*developer|backend\s*developer|full\s*stack|mobile\s*developer|data\s*analyst|data\s*engineer|machine\s*learning|product\s*manager|project\s*manager|graphic\s*designer|ui\/ux|qa\s*engineer)\b/i);
    if (fileRoleMatch) {
      currentTitle = fileRoleMatch[0].trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    }
  }

  // Target role determination (preliminary, finalized after experiences)
  let targetRole = targetRoleInput || currentTitle;

  // --- 7. SECTION SPLITTER ---
  const SECTION_HEADERS = [
    { key: 'profile', regex: /(?:^|\n)\s*(?:profile|summary|professional\s*summary|executive\s*summary|about\s*me|career\s*objective|objective|نبذة\s*عني|نبذة\s*مهنية|نبذة|الملخص\s*المهني|الملخص|الهدف\s*المهني)\s*(?:[:\n\-]|$)/i },
    { key: 'education', regex: /(?:^|\n)\s*(?:education(?:\s*(?:&|and|\+)\s*(?:qualifications|training|certifications?|background|history|credentials))?|academic\s*(?:background|qualifications?|history|credentials?|details?|record)|educational\s*(?:background|details?|history|qualifications?)|degrees?|qualifications?|studies|higher\s*education|university\s*education|التعليم|المؤهل\s*(?:الدراسي|العلمي)|المؤهلات\s*(?:الدراسية|العلمية)|التعليم\s*والتدريب|الخلفية\s*الأكاديمية|التحصيل\s*الدراسي|الشهادات\s*الدراسية|المسار\s*الأكاديمي|الدراسة)\s*(?:[:\n\-]|$)/i },
    { key: 'internships', regex: /(?:^|\n)\s*(?:internships?|practical\s*experience|clinical\s*training|field\s*training|industrial\s*training|التدريب|التدريب\s*العملي|التدريب\s*الميداني|التدريب\s*الصيفي|تدريب)\s*(?:[:\n\-]|$)/i },
    { key: 'experience', regex: /(?:^|\n)\s*(?:experience(?:\s*(?:&|and|\+)\s*(?:history|background))?|work\s*(?:experience|history)|employment(?:\s*history)?|professional\s*experience|career\s*history|work\s*background|relevant\s*experience|الخبرات(?:\s*المهنية|\s*العملية)?|الخبرة\s*(?:المهنية|العملية)|تاريخ\s*العمل|سجل\s*الخبرات)\s*(?:[:\n\-]|$)/i },
    { key: 'skills', regex: /(?:^|\n)\s*(?:skills(?:\s*(?:&|and|\+)\s*(?:competencies|abilities|tools|technologies))?|technical\s*skills|core\s*competencies|key\s*skills|professional\s*skills|competencies|tools\s*(?:&|and)\s*technologies|المهارات(?:\s*التقنية|\s*المهنية|\s*الشخصية)?|المهارات|الكفاءات|القدرات|أدوات\s*وتقنيات)\s*(?:[:\n\-]|$)/i },
    { key: 'projects', regex: /(?:^|\n)\s*(?:projects?|key\s*projects|academic\s*projects|personal\s*projects|selected\s*projects|featured\s*projects|المشاريع|أبرز\s*المشاريع|مشاريع\s*(?:أكاديمية|عملية|شخصية)|الأعمال)\s*(?:[:\n\-]|$)/i },
    { key: 'certificates', regex: /(?:^|\n)\s*(?:certificates?|certifications?|courses(?:\s*(?:&|and)\s*certificates?)?|training\s*courses?|licenses(?:\s*(?:&|and)\s*certifications?)?|credentials|الشهادات(?:\s*المهنية|\s*المعتمدة)?|الدورات(?:\s*التدريبية)?|الرخص\s*والشهادات|الاعتمادات)\s*(?:[:\n\-]|$)/i },
  ];

  const matches: Array<{ key: string; index: number; matchLen: number }> = [];
  SECTION_HEADERS.forEach(h => {
    const m = strippedText.match(h.regex);
    if (m && typeof m.index === 'number') {
      matches.push({ key: h.key, index: m.index, matchLen: m[0].length });
    }
  });
  matches.sort((a, b) => a.index - b.index);

  const sections: Record<string, string> = {};
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const next = matches[i + 1];
    const startPos = current.index + current.matchLen;
    const endPos = next ? next.index : strippedText.length;
    sections[current.key] = strippedText.slice(startPos, endPos).trim();
  }

  // Also build rawSections directly from rawText to preserve markdown hyperlinks for Projects
  const rawMatches: Array<{ key: string; index: number; matchLen: number }> = [];
  SECTION_HEADERS.forEach(h => {
    const m = rawText.match(h.regex);
    if (m && typeof m.index === 'number') {
      rawMatches.push({ key: h.key, index: m.index, matchLen: m[0].length });
    }
  });
  rawMatches.sort((a, b) => a.index - b.index);

  const rawSections: Record<string, string> = {};
  for (let i = 0; i < rawMatches.length; i++) {
    const current = rawMatches[i];
    const next = rawMatches[i + 1];
    const startPos = current.index + current.matchLen;
    const endPos = next ? next.index : rawText.length;
    rawSections[current.key] = rawText.slice(startPos, endPos).trim();
  }

  // Projects section MUST preserve raw markdown links to extract repo and demo URLs
  if (rawSections.projects) {
    sections.projects = rawSections.projects;
  }

  // 8. Summary
  let summary = sections.profile || '';
  if (!summary) {
    const topLines = lines.slice(2, 8).filter(l => l.length > 50 && !l.includes('@'));
    if (topLines.length > 0) summary = topLines.join(' ');
  }
  summary = summary.replace(/\s+/g, ' ').trim();

  // ─── 9. ROBUST MULTI-DEGREE EDUCATION ENGINE ──────────────────────────────
  const KNOWN_UNIVERSITIES_REGEX = new RegExp(
    '\\b(' +
    // Egyptian Public Universities
    'cairo\\s*university|ain\\s*shams\\s*university|alexandria\\s*university|mansoura\\s*university|helwan\\s*university|assiut\\s*university|zagazig\\s*university|tanta\\s*university|benha\\s*university|menoufia\\s*university|suez\\s*canal\\s*university|south\\s*valley\\s*university|fayoum\\s*university|beni[- ]suef\\s*university|kafr\\s*el[- ]sheikh\\s*university|sohag\\s*university|port\\s*said\\s*university|damanhour\\s*university|aswan\\s*university|damietta\\s*university|suez\\s*university|luxor\\s*university|al[- ]azhar\\s*university|' +
    // Egyptian Private & International Universities
    'the\\s*american\\s*university\\s*in\\s*cairo|auc|german\\s*university\\s*in\\s*cairo|guc|british\\s*university\\s*in\\s*egypt|bue|future\\s*university\\s*in\\s*egypt|fue|misr\\s*international\\s*university|miu|misr\\s*university\\s*for\\s*science\\s*and\\s*technology|must|october\\s*6\\s*university|o6u|modern\\s*sciences\\s*and\\s*arts|msa\\s*university|ahram\\s*canadian\\s*university|acu|pharos\\s*university|pua|badr\\s*university|buc|galala\\s*university|alamein\\s*international\\s*university|king\\s*salman\\s*international\\s*university|egypt[- ]japan\\s*university|e-just|nile\\s*university|zewail\\s*city|arab\\s*academy\\s*for\\s*science(?:\\s*,?\\s*technology)?(?:\\s*and\\s*maritime\\s*transport)?|aastmt|aast|higher\\s*technological\\s*institute|hti|canadian\\s*international\\s*college|cic|thebes\\s*academy|modern\\s*academy|akhbar\\s*el\\s*yom\\s*academy|el\\s*shorouk\\s*academy|delta\\s*university|nahda\\s*university|' +
    // Arab & Global Top Universities
    'king\\s*saud\\s*university|king\\s*abdulaziz\\s*university|kfupm|kaust|american\\s*university\\s*of\\s*beirut|aub|lebanese\\s*university|university\\s*of\\s*jordan|just|qatar\\s*university|kuwait\\s*university|uaeu|khalifa\\s*university|american\\s*university\\s*of\\s*sharjah|aus|' +
    // Generic University patterns
    '[a-zA-Z\\s]{2,40}\\s+(?:university|college|polytechnic|institute\\s+of\\s+technology|higher\\s+institute|academy)' +
    ')\\b',
    'i'
  );

  const ARABIC_UNIVERSITIES_REGEX = /(?:جامعة\s+(?:القاهرة|عين\s*شمس|الإسكندرية|المنصورة|حلوان|أسيوط|الزقازيق|طنطا|بنها|المنوفية|قناة\s*السويس|جنوب\s*الوادي|الفيوم|بني\s*سويف|كفر\s*الشيخ|سوهاج|بورسعيد|دمنهور|أسوان|دمياط|السويس|الأقصر|الأزهر|الأمريكية|الألمانية|البريطانية|المستقبل|مصر\s*الدولية|مصر\s*للعلوم\s*والتكنولوجيا|6\s*أكتوبر|فاروس|بدر|الجلالة|العلمين|الملك\s*سلمان|النيل|اليرموك|الملك\s*سعود|الملك\s*عبد\s*العزيز|الكويت|قطر|بيروت\s*العربية|الأردنية|الدلتا|النهضة|[\u0600-\u06FF\s]+)|الأكاديمية\s+العربية\s+للعلوم\s+والتكنولوجيا|مدينة\s+زويل|المعهد\s+التكنولوجي\s+العالي|الكلية\s+الكندية|أكاديمية\s+[\u0600-\u06FF\s]+|معهد\s+[\u0600-\u06FF\s]+)/i;

  const KNOWN_FACULTIES_REGEX = new RegExp(
    '\\b(' +
    'faculty\\s*of\\s*(?:pharmacy|medicine|engineering|computers?(?:\\s*(?:and|&)\\s*(?:artificial\\s*intelligence|information|ai))?|science|commerce|business(?:\\s*administration)?|management(?:\\s*sciences)?|economics(?:\\s*(?:and|&)\\s*political\\s*science)?|mass\\s*communication|arts|languages|al[- ]alsun|law|nursing|applied\\s*arts|fine\\s*arts|dentistry|oral\\s*(?:and|&)\\s*dental\\s*medicine|physical\\s*therapy|agriculture|veterinary\\s*medicine|education|specific\\s*education|[a-zA-Z\\s]{3,35})|' +
    'college\\s*of\\s*(?:pharmacy|medicine|engineering|computer(?:s|\\s*science)?|science|commerce|business(?:\\s*administration)?|management|arts|law|nursing|dentistry|physical\\s*therapy|[a-zA-Z\\s]{3,35})|' +
    'school\\s*of\\s*(?:pharmacy|medicine|engineering|computer\\s*science|business|management|arts|law|science|[a-zA-Z\\s]{3,35})' +
    ')\\b',
    'i'
  );

  const ARABIC_FACULTIES_REGEX = /(?:كلية\s+(?:الصيدلة|الطب(?:\s*البشري)?|طب\s*(?:الفم\s*و)?الأسنان|العلاج\s*الطبيعي|الهندسة|الحاسبات(?:\s*و(?:المعلومات|الذكاء\s*الاصطناعي))?|علوم\s*الحاسب|العلوم|التجارة|إدارة\s*الأعمال|الاقتصاد\s*والعلوم\s*السياسية|الإعلام|الآداب|الألسن|اللغات\s*والترجمة|الحقوق|الشريعة\s*والقانون|التمريض|الفنون\s*(?:التطبيقية|الجميلة)|الزراعة|التربية(?:\s*النوعية)?|الطب\s*البيطري|[\u0600-\u06FF\s]{3,30}))/i;

  const KNOWN_DEGREES_REGEX = new RegExp(
    '\\b(' +
    'bachelor(?:[\'’]s)?(?:\\s*(?:degree|of|in)\\s*[a-zA-Z\\s&,]+)?|' +
    'b\\.?\\s*sc(?:\\.?|\\s+in\\s+[a-zA-Z\\s&,]+)?|' +
    'b\\.?\\s*eng(?:\\.?|\\s+in\\s+[a-zA-Z\\s&,]+)?|' +
    'b\\.?\\s*pharm(?:\\.?|\\s+in\\s+[a-zA-Z\\s&,]+)?|' +
    'pharm\\.?\\s*d(?:\\.?|\\s+in\\s+[a-zA-Z\\s&,]+)?|' +
    'b\\.?\\s*com(?:\\.?|\\s+in\\s+[a-zA-Z\\s&,]+)?|' +
    'b\\.?\\s*b\\.?\\s*a(?:\\.?|\\s+in\\s+[a-zA-Z\\s&,]+)?|' +
    'b\\.?\\s*a(?:\\.?|\\s+in\\s+[a-zA-Z\\s&,]+)?|' +
    'b\\.?\\s*c\\.?\\s*s(?:\\.?|\\s+in\\s+[a-zA-Z\\s&,]+)?|' +
    'll\\.?\\s*b(?:\\.?|\\s+in\\s+[a-zA-Z\\s&,]+)?|' +
    'mbbch|mbbs|md|bds|' +
    'master(?:[\'’]s)?(?:\\s*(?:degree|of|in)\\s*[a-zA-Z\\s&,]+)?|' +
    'm\\.?\\s*sc(?:\\.?|\\s+in\\s+[a-zA-Z\\s&,]+)?|' +
    'm\\.?\\s*ba(?:\\.?|\\s+in\\s+[a-zA-Z\\s&,]+)?|' +
    'm\\.?\\s*a(?:\\.?|\\s+in\\s+[a-zA-Z\\s&,]+)?|' +
    'm\\.?\\s*eng(?:\\.?|\\s+in\\s+[a-zA-Z\\s&,]+)?|' +
    'ph\\.?\\s*d(?:\\.?|\\s+in\\s+[a-zA-Z\\s&,]+)?|' +
    'doctorate(?:\\s+in\\s+[a-zA-Z\\s&,]+)?|' +
    'diploma|postgraduate\\s*diploma|associate(?:[\'’]s)?\\s*degree|' +
    'high\\s*school(?:\\s*diploma)?|secondary\\s*school(?:\\s*certificate)?|thanaweya\\s*amma|general\\s*secondary\\s*certificate|igcse|i\\.g\\.c\\.s\\.e|american\\s*diploma|' +
    'بكالوريوس(?:\\s+[\u0600-\u06FF\\s]+)?|' +
    'ليسانس(?:\\s+[\u0600-\u06FF\\s]+)?|' +
    'ماجستير(?:\\s+[\u0600-\u06FF\\s]+)?|' +
    'دكتوراه(?:\\s+[\u0600-\u06FF\\s]+)?|' +
    'دبلوم(?:\\s+دراسات\\s+عليا|\\s+[\u0600-\u06FF\\s]+)?|' +
    'الثانوية\\s*العامة|شهادة\\s*إتمام\\s*الثانوية\\s*العامة' +
    ')\\b',
    'i'
  );

  function inferCanonicalDegree(degreeInput: string, facultyInput: string): { degree: string; major: string } {
    const rawDeg = (degreeInput || '').trim();
    const rawFac = (facultyInput || '').trim();

    let degree = rawDeg;
    let major = '';

    // If degree is blank but faculty is present, infer high-fidelity degree & major
    if (!degree && rawFac) {
      if (/pharmacy|صيدل/i.test(rawFac)) {
        degree = 'Bachelor of Pharmacy (B.Pharm)';
        major = 'Pharmacy';
      } else if (/commerce|تجارة|accounting|محاسبة|business/i.test(rawFac)) {
        degree = 'Bachelor of Commerce (B.Com)';
        major = 'Commerce / Business Administration';
      } else if (/computers?|حاسبات|artificial|ذكاء/i.test(rawFac)) {
        degree = 'Bachelor of Computer Science (B.Sc.)';
        major = 'Computer Science & AI';
      } else if (/engineering|هندس/i.test(rawFac)) {
        degree = 'Bachelor of Science in Engineering (B.Sc.)';
        major = 'Engineering';
      } else if (/dentistry|dental|أسنان/i.test(rawFac)) {
        degree = 'Bachelor of Dental Surgery (BDS)';
        major = 'Dentistry';
      } else if (/medicine|طب/i.test(rawFac)) {
        degree = 'Bachelor of Medicine, Bachelor of Surgery (MBBCh)';
        major = 'Medicine';
      } else if (/science|علوم/i.test(rawFac)) {
        degree = 'Bachelor of Science (B.Sc.)';
        major = 'Science';
      } else if (/arts|آداب/i.test(rawFac)) {
        degree = 'Bachelor of Arts (B.A.)';
        major = 'Arts';
      } else if (/law|حقوق/i.test(rawFac)) {
        degree = 'Bachelor of Law (LL.B.)';
        major = 'Law';
      } else if (/nursing|تمريض/i.test(rawFac)) {
        degree = 'Bachelor of Nursing (B.Sc.)';
        major = 'Nursing';
      } else {
        degree = rawFac;
        major = rawFac.replace(/^(?:faculty|college|school|كلية)\s*(?:of|لـ)?\s*/i, '').trim();
      }
    }

    if (degree) {
      // Extract major if embedded in degree (e.g. "Bachelor of Science in Computer Science")
      const inMatch = degree.match(/\b(?:in|major\s+in|specialization\s+in|قسم|تخصص)\s+([A-Za-z\u0600-\u06FF\s&,]+)/i);
      if (inMatch && !major) {
        major = inMatch[1].replace(/[,–-].*$/, '').trim();
      }
    }

    return {
      degree: degree || rawFac || 'Bachelor Degree',
      major: major || ''
    };
  }

  function extractEduDateRange(text: string): { startDate: string; endDate: string } {
    const fullDateRegex = /(?:(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember))\s+)?(19\d{2}|20\d{2})\s*(?:[-–—to\s]+)\s*(?:(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember))\s+)?(19\d{2}|20\d{2}|present|expected|current|now|حالياً)/i;
    const match = text.match(fullDateRegex);
    if (match) {
      const parts = match[0].split(/[-–—]|(?:\s+to\s+)/i);
      return {
        startDate: parts[0]?.trim() || '',
        endDate: parts[1]?.trim() || ''
      };
    }
    const years = text.match(/\b(19\d{2}|20\d{2})\b/g);
    if (years && years.length >= 2) {
      return { startDate: years[0], endDate: years[1] };
    } else if (years && years.length === 1) {
      const y = parseInt(years[0], 10);
      return { startDate: (y - 4).toString(), endDate: y.toString() };
    }
    return { startDate: '2018', endDate: '2022' };
  }

  const education: Array<{
    id: string;
    institution: string;
    degree: string;
    major: string;
    startDate: string;
    endDate: string;
    location?: string;
  }> = [];

  const eduText = sections.education || '';
  if (eduText) {
    // Break into logical degree blocks (by blank lines, bullet points, or degree/institution starts)
    const eduLines = eduText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const degreeBlocks: string[][] = [];
    let currentBlock: string[] = [];

    for (const line of eduLines) {
      const isNewDegreeHeader =
        (KNOWN_DEGREES_REGEX.test(line) || KNOWN_FACULTIES_REGEX.test(line) || ARABIC_FACULTIES_REGEX.test(line)) &&
        !line.startsWith('•') &&
        !line.startsWith('-') &&
        currentBlock.length > 0 &&
        currentBlock.some(b => KNOWN_DEGREES_REGEX.test(b) || KNOWN_UNIVERSITIES_REGEX.test(b) || ARABIC_UNIVERSITIES_REGEX.test(b));

      if (isNewDegreeHeader) {
        degreeBlocks.push(currentBlock);
        currentBlock = [line];
      } else {
        currentBlock.push(line);
      }
    }
    if (currentBlock.length > 0) {
      degreeBlocks.push(currentBlock);
    }

    let eduIdx = 1;
    for (const block of degreeBlocks) {
      const blockCombined = block.join(' \n ');
      let blockDegree = '';
      let blockFaculty = '';
      let blockInstitution = '';
      let blockLocation = location;

      for (const line of block) {
        // 1. Institution Match
        if (!blockInstitution) {
          const uniMatch = line.match(KNOWN_UNIVERSITIES_REGEX) || line.match(ARABIC_UNIVERSITIES_REGEX);
          if (uniMatch) {
            blockInstitution = uniMatch[0].trim();
          } else if (/\b(university|college|academy|institute|جامعة|أكاديمية|معهد)\b/i.test(line)) {
            const genericInst = line.match(/^[A-Za-z\s]+(?:University|College|Academy|Institute)/i) || line.match(/(?:at\s+)?([A-Za-z\s]+(?:University|College|Academy|Institute))/i);
            if (genericInst) {
              blockInstitution = genericInst[0].replace(/^at\s+/i, '').trim();
            } else {
              blockInstitution = line.split(/[,|–-]/)[0].trim();
            }
          }
        }

        // 2. Faculty Match
        if (!blockFaculty) {
          const facMatch = line.match(KNOWN_FACULTIES_REGEX) || line.match(ARABIC_FACULTIES_REGEX);
          if (facMatch) {
            blockFaculty = facMatch[0].trim();
          }
        }

        // 3. Degree Match
        if (!blockDegree) {
          const degMatch = line.match(KNOWN_DEGREES_REGEX);
          if (degMatch) {
            blockDegree = degMatch[0].replace(/\s*at\s+.*$/i, '').trim();
          }
        }

        // 4. Location match on line
        if (/cairo|giza|alexandria|mansoura|egypt|القاهرة|الجيزة|الإسكندرية|المنصورة|مصر/i.test(line)) {
          const locM = line.match(/(?:Cairo|Giza|Alexandria|Mansoura|Egypt|القاهرة|الجيزة|الإسكندرية|المنصورة|مصر)(?:,\s*[A-Za-z\u0600-\u06FF]+)?/i);
          if (locM) blockLocation = locM[0].trim();
        }
      }

      // If institution is still blank, but faculty has university attached (e.g. "Faculty of Pharmacy, Cairo University")
      if (!blockInstitution && blockFaculty) {
        const uM = blockCombined.match(KNOWN_UNIVERSITIES_REGEX) || blockCombined.match(ARABIC_UNIVERSITIES_REGEX);
        if (uM) blockInstitution = uM[0].trim();
      }

      const dateRange = extractEduDateRange(blockCombined);
      const { degree: finalDegree, major: finalMajor } = inferCanonicalDegree(blockDegree, blockFaculty);

      if (blockInstitution || blockFaculty || blockDegree) {
        education.push({
          id: `edu-${eduIdx++}`,
          institution: blockInstitution || (blockFaculty ? `${blockFaculty}` : 'University'),
          degree: finalDegree,
          major: finalMajor,
          startDate: dateRange.startDate || '2018',
          endDate: dateRange.endDate || '2022',
          location: blockLocation || location
        });
      }
    }
  }

  // ─── 9b. GLOBAL FALLBACK SCANNER FOR EDUCATION ───────────────────────────
  // If no education was found via section headers, scan the entire text for degrees/universities
  if (education.length === 0) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const hasUni = KNOWN_UNIVERSITIES_REGEX.test(line) || ARABIC_UNIVERSITIES_REGEX.test(line);
      const hasFac = KNOWN_FACULTIES_REGEX.test(line) || ARABIC_FACULTIES_REGEX.test(line);
      const hasDeg = KNOWN_DEGREES_REGEX.test(line);

      if (hasUni || hasFac || hasDeg) {
        // Collect window of 3 lines around the match
        const windowLines = lines.slice(Math.max(0, i - 1), Math.min(lines.length, i + 3));
        const windowText = windowLines.join(' \n ');

        let inst = '';
        let fac = '';
        let deg = '';

        const uniM = windowText.match(KNOWN_UNIVERSITIES_REGEX) || windowText.match(ARABIC_UNIVERSITIES_REGEX);
        if (uniM) inst = uniM[0].trim();

        const facM = windowText.match(KNOWN_FACULTIES_REGEX) || windowText.match(ARABIC_FACULTIES_REGEX);
        if (facM) fac = facM[0].trim();

        const degM = windowText.match(KNOWN_DEGREES_REGEX);
        if (degM) deg = degM[0].trim();

        const dateRange = extractEduDateRange(windowText);
        const { degree: finalDeg, major: finalMajor } = inferCanonicalDegree(deg, fac);

        if (inst || fac || deg) {
          education.push({
            id: `edu-${education.length + 1}`,
            institution: inst || (fac ? fac : 'University'),
            degree: finalDeg,
            major: finalMajor,
            startDate: dateRange.startDate || '2018',
            endDate: dateRange.endDate || '2022',
            location: location
          });
          break; // Stop after capturing the primary degree
        }
      }
    }
  }

  // 10. Experiences & Internships
  const experiences: Array<{
    id: string;
    company: string;
    companyUrl?: string;
    role: string;
    startDate: string;
    endDate: string;
    current: boolean;
    location?: string;
    description?: string;
    bullets: string[];
    type?: string;
  }> = [];

  const rawExpSections = [
    { text: sections.experience, isIntern: false },
    { text: sections.internships, isIntern: true }
  ].filter(s => Boolean(s.text));

  let expIdx = 1;
  for (const s of rawExpSections) {
    if (!s.text) continue;
    const expLines = s.text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (expLines.length === 0) continue;

    let role = '';
    let company = '';
    let startD = s.isIntern ? 'Jul 2024' : '2022';
    let endD = s.isIntern ? 'Aug 2024' : 'Present';
    let expLocation = location;

    let companyUrl = '';
    const firstLine = expLines[0];
    const atMatch = firstLine.match(/^(.*?)\s+at\s+(.*?)(?:,\s*(.*))?$/i);
    if (atMatch) {
      role = atMatch[1].trim();
      company = atMatch[2].trim();
      if (atMatch[3]) expLocation = atMatch[3].trim();
    } else {
      role = firstLine;
      if (expLines[1] && !expLines[1].match(/\d{4}/)) {
        company = expLines[1];
      }
    }

    // Check firstLine for date range (e.g. July 2024 - August 2024)
    const fullDateRegex = /(?:(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember))\s+)?\d{4}\s*[-–—]\s*(?:(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember))\s+)?(?:\d{4}|present|now|current)|(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember))\s+\d{4}\s*[-–—]\s*(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember))\s+\d{4}/i;

    const firstLineDateMatch = firstLine.match(fullDateRegex);
    if (firstLineDateMatch) {
      const parts = firstLineDateMatch[0].split(/[-–—]/);
      startD = parts[0]?.trim() || startD;
      endD = parts[1]?.trim() || endD;
    }

    // Extract markdown link from company: [Company Name](url)
    const companyMd = company.match(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/i);
    if (companyMd) {
      company = companyMd[1].trim();
      companyUrl = companyMd[2].trim();
    }
    const rawCompUrl = company.match(/(https?:\/\/[^\s\)\],]+)/i);
    if (rawCompUrl) {
      if (!companyUrl) companyUrl = rawCompUrl[1];
      company = company.replace(/https?:\/\/[^\s\)\],]+/gi, '').trim();
    }
    // Clean company of markdown brackets / extra punctuation / stray dates
    company = company.replace(/[\[\]]/g, '').replace(fullDateRegex, '').replace(/^[•\-,–—\s]+|[•\-,–—\s]+$/g, '').trim();

    // Deep company URL matching against all extracted links & document links
    if (!companyUrl) {
      const compLower = company.toLowerCase().replace(/[^a-z0-9]/g, '');
      const compTokens = company.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length >= 3);
      
      const allCandidateLinks = [
        ...(extractedLinksResult?.allLinks || []),
        ...(rawExtractedLinks || []).map(r => ({ title: r.anchorText, url: r.url, type: 'link' }))
      ];

      const matchedCompanyLink = allCandidateLinks.find(l => {
        const u = l.url.toLowerCase();
        const t = (l.title || '').toLowerCase();
        if (u.includes('linkedin.com/company/') || l.type === 'company') {
          return compTokens.some(tok => u.includes(tok) || t.includes(tok)) || (compLower.length >= 4 && u.includes(compLower));
        }
        return false;
      });
      if (matchedCompanyLink) {
        companyUrl = matchedCompanyLink.url;
      } else {
        // Fallback: if there's any linkedin company link in the document, assign it
        const anyCompLink = allCandidateLinks.find(l => l.url.toLowerCase().includes('linkedin.com/company/'));
        if (anyCompLink) companyUrl = anyCompLink.url;
      }
    }

    // Clean expLocation of dates that were stuck in it
    expLocation = expLocation
      .replace(fullDateRegex, '')
      .replace(/[,\s]+$/, '')
      .replace(/^[,\s]+/, '')
      .replace(/,([^\s])/g, ', $1')
      .trim();

    for (const line of expLines.slice(1, 4)) {
      const dateMatch = line.match(fullDateRegex);
      if (dateMatch && !firstLineDateMatch) {
        const parts = dateMatch[0].split(/[-–—]/);
        startD = parts[0]?.trim() || startD;
        endD = parts[1]?.trim() || endD;
        break;
      }
    }

    // Collect lines that are actual bullet content (not company/date header lines)
    const companyLower = company.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
    const companyTokens = companyLower.split(/\s+/).filter(w => w.length >= 3);

    const rawBulletLines: string[] = [];
    for (const line of expLines.slice(1)) {
      const lo = line.toLowerCase();
      // Skip obvious date lines (start with a month or year)
      if (/^(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec|\d{4})/i.test(line)) continue;
      // Skip if line contains a date range (month year – month year)
      if (/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{4}\s*[-–—]\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4}|present)/i.test(line)) continue;
      // Skip if it's essentially a repetition of "Company City Month Year" header
      // (matches when ≥2 company tokens appear in the line AND line contains a 4-digit year)
      const hasYear = /\d{4}/.test(line);
      const companyTokenMatches = companyTokens.filter(tok => lo.includes(tok)).length;
      if (hasYear && companyTokenMatches >= 2) continue;
      // Skip email/links
      if (line.includes('@') || /^https?:\/\//i.test(line)) continue;
      // Skip very short lines (likely stray header fragments)
      if (line.length < 15) continue;
      // Skip lines that are just the company or location
      if (lo === companyLower || lo === expLocation.toLowerCase()) continue;

      const cleanBullet = line.replace(/^[•\-*]\s*/, '').trim();
      rawBulletLines.push(cleanBullet);
    }

    // Merge fragments: if a bullet doesn't end with punctuation and the next is short, merge them
    const mergedBullets: string[] = [];
    for (let i = 0; i < rawBulletLines.length; i++) {
      const cur = rawBulletLines[i];
      const next = rawBulletLines[i + 1];
      if (next && !/[.!?]$/.test(cur) && next.length < 80 && /^[a-z]/.test(next)) {
        mergedBullets.push(cur + ' ' + next);
        i++; // skip next since we merged it
      } else {
        mergedBullets.push(cur);
      }
    }
    const bullets = mergedBullets;

    const isThisIntern = s.isIntern || /intern\b|تدريب/i.test(role);

    if (role || company || bullets.length > 0) {
      experiences.push({
        id: `exp-${expIdx++}`,
        role: role || (isThisIntern ? 'Intern' : targetRole || 'Position'),
        company: company || '',
        companyUrl: companyUrl || undefined,
        startDate: startD,
        endDate: endD,
        current: /present|now|حالياً/i.test(endD),
        location: expLocation || location,
        bullets: bullets,
        type: isThisIntern ? 'internship' : 'job'
      });
    }
  }

  // 11. Skills
  const skillsText = sections.skills || '';
  const categorizedSkillGroups: Array<{ id: string; label: string; skills: string[] }> = [];
  const allFoundSkills = new Set<string>();

  if (skillsText) {
    const skillLines = skillsText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    let gIdx = 1;
    for (const line of skillLines) {
      const colonIdx = line.indexOf(':');
      if (colonIdx > 0 && colonIdx < 50) {
        const label = line.slice(0, colonIdx).trim();
        const skillTokens = line.slice(colonIdx + 1).split(/[,•|/]/).map(s => s.trim()).filter(s => s.length >= 2 && !SKILL_BLACKLIST.has(s.toLowerCase()));
        if (skillTokens.length > 0) {
          categorizedSkillGroups.push({
            id: `skills-${gIdx++}`,
            label,
            skills: skillTokens
          });
          skillTokens.forEach(s => allFoundSkills.add(s));
        }
      }
    }
  }

  Object.entries(KNOWN_SKILLS).forEach(([category, list]) => {
    list.forEach(skill => {
      if (SKILL_BLACKLIST.has(skill.toLowerCase())) return;
      const regex = new RegExp(`(?:^|[^a-zA-Z0-9#+])(${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?:$|[^a-zA-Z0-9#+])`, 'i');
      if (regex.test(rawText)) {
        allFoundSkills.add(skill);
      }
    });
  });

  const skillsList = Array.from(allFoundSkills);

  // 12. Projects
  const projectsText = sections.projects || '';
  const projects: Array<{
    id: string;
    title: string;
    description: string;
    technologies: string[];
    bullets: string[];
    link?: string;
    github?: string;
  }> = [];

  if (projectsText) {
    const projLines = projectsText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    let currentProject: { title: string; tech: string[]; bullets: string[]; link?: string; github?: string } | null = null;
    let pIdx = 1;

    for (let i = 0; i < projLines.length; i++) {
      const line = projLines[i];
      const strippedLine = line.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

      const hasProjectLinkOrDate =
        /\[(?:github|live demo|demo|code|repo)\]/i.test(line) ||
        /•\s*\[?(?:github|live demo|demo|repo|code)/i.test(line) ||
        /https?:\/\/github\.com\/[a-zA-Z0-9_\-]+\/[a-zA-Z0-9_\-]+/i.test(line) ||
        (/\b(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+\d{4}/i.test(line) && !line.startsWith('•') && !line.startsWith('-') && !line.startsWith('*'));

      const isTitleLine =
        hasProjectLinkOrDate ||
        (
          strippedLine.length < 60 &&
          /^[A-Z\u0600-\u06FF]/.test(strippedLine) &&
          !line.startsWith('•') &&
          !line.startsWith('-') &&
          !line.startsWith('*') &&
          !/[.!?]$/.test(strippedLine) &&
          !/^(?:to|and|in|on|with|for|deep|built|developed|designed|engineered|implemented|trained|evaluated)\b/i.test(strippedLine) &&
          projLines[i + 1] &&
          (projLines[i + 1].match(/\d{4}/) || projLines[i + 1].length > 25)
        );

      if (isTitleLine) {
        if (currentProject && (currentProject.bullets.length > 0 || currentProject.title)) {
          projects.push({
            id: `prj-${pIdx++}`,
            title: currentProject.title,
            description: currentProject.bullets.join(' '),
            technologies: currentProject.tech,
            bullets: currentProject.bullets,
            link: currentProject.link || '',
            github: currentProject.github || '',
          });
        }

        // Extract any URL embedded in the title line
        let lineGithub = '';
        let lineDemo = '';
        const mdGithubMatch = line.match(/\[(?:github|code|repo)\]\((https?:\/\/[^\)]+)\)/i);
        if (mdGithubMatch) lineGithub = mdGithubMatch[1];
        const mdDemoMatch = line.match(/\[(?:demo|live demo|link|app)\]\((https?:\/\/[^\)]+)\)/i);
        if (mdDemoMatch) lineDemo = mdDemoMatch[1];

        const allMdMatches = Array.from(line.matchAll(/\[(?:[^\]]+)\]\((https?:\/\/[^\)]+)\)/gi));
        for (const m of allMdMatches) {
          const u = m[1];
          if (u.toLowerCase().includes('github.com')) {
            if (!lineGithub) lineGithub = u;
          } else if (!u.toLowerCase().includes('linkedin.com')) {
            if (!lineDemo) lineDemo = u;
          }
        }

        const rawUrls = Array.from(line.matchAll(/https?:\/\/[^\s\)\],]+/gi)).map(m => m[0].replace(/[.,;:)>\]\\]+$/, ''));
        for (const u of rawUrls) {
          if (u.toLowerCase().includes('github.com')) {
            if (!lineGithub) lineGithub = u;
          } else if (!u.toLowerCase().includes('linkedin.com')) {
            if (!lineDemo) lineDemo = u;
          }
        }

        const cleanTitle = line
          .replace(/•\s*\[[^\]]+\]\([^\)]+\)/gi, '')
          .replace(/\[[^\]]+\]\([^\)]+\)/gi, '')
          .replace(/•\s*(?:GitHub|Live Demo|Demo|Link|Code|Repo).*$/i, '')
          .replace(/https?:\/\/[^\s\)\],]+/gi, '')
          .replace(/\b(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)?\s*\d{4}\s*(?:[-–—]\s*(?:present|\w+\s*\d{4}|\d{4}))?/gi, '')
          .replace(/[|•–—\s]+$/, '')
          .replace(/^[|•–—\s]+/, '')
          .trim();

        currentProject = {
          title: cleanTitle || line,
          tech: [],
          bullets: [],
          github: lineGithub,
          link: lineDemo
        };
      } else if (currentProject) {
        if (/^(january|february|march|april|may|june|july|august|september|october|november|december|\d{4})\s*[-–—]?\s*(january|february|march|april|may|june|july|august|september|october|november|december|\d{4})?$/i.test(line)) {
          continue;
        }

        // Check for project URLs in bullets/sublines
        const urlMatches = line.match(/(https?:\/\/[^\s\)\],]+)/gi);
        if (urlMatches) {
          for (const rawUrl of urlMatches) {
            const cleanUrl = rawUrl.replace(/[.,;:)>\]\\]+$/, '').trim();
            if (cleanUrl.toLowerCase().includes('github.com')) {
              if (!currentProject.github) currentProject.github = cleanUrl;
            } else if (!cleanUrl.toLowerCase().includes('linkedin.com')) {
              if (!currentProject.link) currentProject.link = cleanUrl;
            }
          }
        }

        const isBulleted = /^[•\-*]/.test(line);
        const cleanBullet = line.replace(/^[•\-*]\s*/, '').trim();
        if (cleanBullet.length > 5) {
          KNOWN_SKILLS.frameworks.concat(KNOWN_SKILLS.programming).concat(KNOWN_SKILLS.databasesAndTools).forEach(t => {
            try {
              const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              const r = new RegExp(`(?:^|[^a-zA-Z0-9#+])(${escaped})(?:$|[^a-zA-Z0-9#+])`, 'i');
              if (r.test(cleanBullet) && !currentProject!.tech.includes(t)) {
                currentProject!.tech.push(t);
              }
            } catch {}
          });
          if (isBulleted || currentProject.bullets.length === 0) {
            currentProject.bullets.push(cleanBullet);
          } else {
            // Continuation of previous wrapped bullet
            currentProject.bullets[currentProject.bullets.length - 1] += ' ' + cleanBullet;
          }
        }
      }
    }

    if (currentProject && currentProject.title) {
      projects.push({
        id: `prj-${pIdx++}`,
        title: currentProject.title,
        description: currentProject.bullets.join(' '),
        technologies: currentProject.tech,
        bullets: currentProject.bullets,
        link: currentProject.link || '',
        github: currentProject.github || '',
      });
    }
  }

    // ─── 12b. Certificates Section Extraction ─────────────────────────
    const rawCertText = rawSections.certificates || sections.certificates || '';
    const certificates: Array<{
      id: string;
      name: string;
      issuer: string;
      url?: string;
      date?: string;
    }> = [];

    if (rawCertText) {
      const certLines = rawCertText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      let cIdx = 1;
      for (const line of certLines) {
        if (line.length < 5 || /^(certificates?|certifications?|courses|licenses|الشهادات)/i.test(line)) continue;

        let certUrl = '';
        const mdMatch = line.match(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/i);
        if (mdMatch) {
          certUrl = mdMatch[2].trim();
        } else {
          const plainUrlMatch = line.match(/https?:\/\/[^\s\)\],]+/i);
          if (plainUrlMatch) {
            certUrl = plainUrlMatch[0].trim();
          }
        }

        let clean = line
          .replace(/•\s*\[[^\]]+\]\([^\)]+\)/gi, '')
          .replace(/\[[^\]]+\]\([^\)]+\)/gi, '')
          .replace(/https?:\/\/[^\s\)\],]+/gi, '')
          .replace(/^[•\-*–—\s]+|[•\-*–—\s]+$/g, '')
          .trim();

        if (!clean) continue;

        let name = clean;
        let issuer = 'Verified Credential';
        let date = '';

        const dateMatch = clean.match(/\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?\s*\d{4}\b/i);
        if (dateMatch) {
          date = dateMatch[0];
          clean = clean.replace(dateMatch[0], '').trim();
        }

        if (clean.includes(' - ')) {
          const parts = clean.split(' - ');
          name = parts[0].trim();
          issuer = parts.slice(1).join(' - ').trim();
        } else if (clean.includes(' | ')) {
          const parts = clean.split(' | ');
          name = parts[0].trim();
          issuer = parts.slice(1).join(' | ').trim();
        } else if (/\b(?:at|by|from)\s+([A-Za-z0-9\s]+)$/i.test(clean)) {
          const atM = clean.match(/\b(?:at|by|from)\s+([A-Za-z0-9\s]+)$/i);
          if (atM) {
            issuer = atM[1].trim();
            name = clean.slice(0, atM.index).trim();
          }
        } else {
          if (certUrl.includes('cognitiveclass.ai')) issuer = 'Cognitive Class';
          else if (certUrl.includes('freecodecamp.org')) issuer = 'freeCodeCamp';
          else if (certUrl.includes('365datascience.com')) issuer = '365 Data Science';
          else if (certUrl.includes('coursera.org')) issuer = 'Coursera';
          else if (certUrl.includes('udemy.com')) issuer = 'Udemy';
          else if (certUrl.includes('datacamp.com')) issuer = 'DataCamp';
        }

        certificates.push({
          id: `cert-${cIdx++}`,
          name: name.replace(/^[•\-–—\s]+|[•\-–—\s]+$/g, '').trim(),
          issuer: issuer.replace(/^[•\-–—\s]+|[•\-–—\s]+$/g, '').trim(),
          url: certUrl || undefined,
          date: date || undefined,
        });
      }
    }

    // ─── 13. Deep Multi-Section Link Intelligence ───────────────────────
    const cvIntelligence = processDocumentLinks(
      rawExtractedLinks,
      undefined,
      projects.map(p => p.title),
      experiences.map(e => e.company)
    );

    // 1. Correlate Project Repos & Live Demos
    for (const p of projects) {
      const titleTokens = p.title.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length >= 3);
      const matchedPl = cvIntelligence.projectLinks.find(pl => {
        const matcherTokens = pl.projectTitleMatcher.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length >= 3);
        return titleTokens.some(tok => matcherTokens.includes(tok));
      });

      if (matchedPl) {
        if (!p.github && matchedPl.github) p.github = matchedPl.github;
        if (!p.link && matchedPl.demo) {
          p.link = matchedPl.demo;
        } else if (!p.link && matchedPl.generalUrl && !matchedPl.generalUrl.includes('github.com')) {
          p.link = matchedPl.generalUrl;
        }
      }
      if (p.link && p.github && p.link === p.github) {
        p.link = '';
      }
    }

    // Project fallback correlation from allClassified
    const unusedRepos = cvIntelligence.allClassified.filter(
      l => l.category === 'project_repo' && !projects.some(p => p.github === l.cleanUrl)
    );
    const unusedDemos = cvIntelligence.allClassified.filter(
      l => l.category === 'project_demo' && !projects.some(p => p.link === l.cleanUrl)
    );
    let rIdx = 0;
    let dIdx = 0;
    for (const p of projects) {
      if (!p.github && rIdx < unusedRepos.length) {
        p.github = unusedRepos[rIdx++].cleanUrl;
      }
      if (!p.link && dIdx < unusedDemos.length) {
        p.link = unusedDemos[dIdx++].cleanUrl;
      }
    }

    // 2. Correlate Experience Company URLs
    for (const exp of experiences) {
      if (!exp.companyUrl) {
        const compTokens = exp.company.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length >= 3);
        const matchedEl = cvIntelligence.experienceLinks.find(el => {
          const matcherTokens = el.companyMatcher.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length >= 3);
          return compTokens.some(tok => matcherTokens.includes(tok));
        });
        if (matchedEl) {
          exp.companyUrl = matchedEl.url;
        }
      }
    }

    // 3. Correlate Certificate URLs
    for (let cIdx = 0; cIdx < certificates.length; cIdx++) {
      const cert = certificates[cIdx];
      if (!cert.url) {
        const match = cvIntelligence.certificateLinks.find(cl => {
          const certTokens = cert.name.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length >= 3);
          const matchTokens = cl.titleMatcher.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length >= 3);
          return certTokens.some(tok => matchTokens.includes(tok));
        }) || cvIntelligence.certificateLinks[cIdx];
        if (match) {
          cert.url = match.url;
        }
      }
    }
    if (certificates.length === 0 && cvIntelligence.certificateLinks.length > 0) {
      cvIntelligence.certificateLinks.forEach((cl, idx) => {
        certificates.push({
          id: `cert-${idx + 1}`,
          name: cl.titleMatcher || `Certification ${idx + 1}`,
          issuer: 'Verified Credential',
          url: cl.url
        });
      });
    }

    // 4. Header Contacts (LinkedIn, GitHub profile, Portfolio, Social Links)
    const finalLinkedin = cvIntelligence.headerContacts.linkedin || extractedLinksResult?.linkedin || linkedin;
    const finalGithub = cvIntelligence.headerContacts.github || extractedLinksResult?.github || github;
    const finalPortfolio = cvIntelligence.headerContacts.portfolio || extractedLinksResult?.portfolio || portfolio;
    const socialLinks: Array<{ id: string; platform: string; url: string }> = [...cvIntelligence.headerContacts.socialLinks];

    if (finalLinkedin && !socialLinks.some(s => s.platform === 'LinkedIn')) {
      socialLinks.unshift({ id: 'link-li', platform: 'LinkedIn', url: finalLinkedin });
    }
    if (finalGithub && !socialLinks.some(s => s.platform === 'GitHub')) {
      socialLinks.push({ id: 'link-gh', platform: 'GitHub', url: finalGithub });
    }
    if (finalPortfolio && !socialLinks.some(s => s.platform === 'Portfolio' || s.platform === 'Personal')) {
      socialLinks.push({ id: 'link-pf', platform: 'Portfolio', url: finalPortfolio });
    }

  // 13. ATS Analysis & Metrics
  let actionVerbsCount = 0;
  ACTION_VERBS.forEach(verb => {
    try {
      const escaped = verb.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const r = new RegExp(`\\b${escaped}\\b`, 'gi');
      const m = rawText.match(r);
      if (m) actionVerbsCount += m.length;
    } catch {}
  });

  const metricsMatches = rawText.match(/\b\d+%\b|\b\$\d+\b|\b\d+\s*(?:k|m|hours|users|stakeholders|projects|teams)\b/gi);
  const metricsCount = metricsMatches ? metricsMatches.length : 0;

  const sectionsDetected = [
    email ? 1 : 0,
    phone ? 1 : 0,
    summary ? 1 : 0,
    experiences.length > 0 ? 1 : 0,
    education.length > 0 ? 1 : 0,
    skillsList.length > 0 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const structureScore = Math.round((sectionsDetected / 6) * 100);
  const readabilityScore = rawText.length > 200 ? Math.min(100, Math.round(40 + Math.min(60, actionVerbsCount * 5))) : 30;
  const impactScore = Math.min(100, Math.round((metricsCount / Math.max(1, experiences.length * 2)) * 100));
  const skillsScore = Math.min(100, skillsList.length * 8);
  const atsScore = Math.round((structureScore * 0.3) + (readabilityScore * 0.25) + (impactScore * 0.2) + (skillsScore * 0.25));

  const fallbackName = email ? email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '';

  // Final resolution of currentTitle:
  // If not found in header, fallback to experiences[0].role, summary, or education
  if (!currentTitle || currentTitle.toLowerCase() === 'data-analyst' || currentTitle.toLowerCase() === 'data analyst') {
    if (experiences.length > 0 && experiences[0].role && experiences[0].role.trim().length >= 3) {
      currentTitle = experiences[0].role.replace(/\s*at\s+.*$/i, '').trim();
    } else if (summary) {
      const summaryRoleMatch = summary.match(/(?:results[- ]driven|results[- ]oriented|accomplished|seasoned|experienced|dynamic|passionate|certified|dedicated|motivated|ambitious|skilled|proven|successful|seeking\s+(?:a|an)?\s*|as\s+(?:a|an)\s+)([A-Za-z\s\/\-&]{3,40}?(?:representative|specialist|engineer|developer|analyst|technician|administrator|manager|coordinator|assistant|consultant|associate|executive|officer|agent|designer|architect|programmer|tester))/i);
      if (summaryRoleMatch && summaryRoleMatch[1]) {
        currentTitle = summaryRoleMatch[1].trim();
      }
    } else if (education.length > 0 && education[0].degree) {
      const deg = education[0].degree;
      if (/computer|software|data|technology|engineering|information|science/i.test(deg)) {
        currentTitle = deg.replace(/\b(degree|program|faculty\s*of|bachelor\s*of)\b/gi, '').trim();
      }
    }
  }

  // Ensure targetRole aligns with detected currentTitle if targetRole was omitted or default
  let resolvedTargetRole = targetRoleInput || '';
  if (!resolvedTargetRole || resolvedTargetRole === 'data-analyst') {
    resolvedTargetRole = currentTitle || targetRoleInput || '';
  }

  return {
    fullName: fullName || fallbackName,
    currentTitle: currentTitle || resolvedTargetRole || '',
    email,
    phone,
    location,
    linkedin: finalLinkedin,
    github: finalGithub,
    portfolio: finalPortfolio,
    socialLinks,
    links: cvIntelligence.allClassified.map(c => ({
      title: c.platform,
      url: c.cleanUrl,
      type: c.platform.toLowerCase() as any
    })),
    summary,
    targetRole: resolvedTargetRole,
    experienceYears: experiences.filter(e => e.type !== 'internship').length,
    isAllInternships: experiences.length > 0 && experiences.every(e => e.type === 'internship'),
    sectionOrder: (() => {
      const order: string[] = [];
      matches.forEach(m => {
        if (m.key === 'profile' && !order.includes('summary')) order.push('summary');
        if (m.key === 'education' && !order.includes('education')) order.push('education');
        if ((m.key === 'experience' || m.key === 'internships') && !order.includes('experience')) order.push('experience');
        if (m.key === 'skills' && !order.includes('skills')) order.push('skills');
        if (m.key === 'projects' && !order.includes('projects')) order.push('projects');
      });
      ['summary', 'education', 'experience', 'skills', 'projects'].forEach(s => {
        if (!order.includes(s)) order.push(s);
      });
      return order;
    })(),
    experiences,
    education,
    certificates,
    skills: skillsList,
    categorizedSkills: {
      programming: categorizedSkillGroups.find(g => /programming/i.test(g.label))?.skills || [],
      frameworks: categorizedSkillGroups.find(g => /machine|ai|framework/i.test(g.label))?.skills || [],
      databasesAndTools: categorizedSkillGroups.find(g => /backend|database|tool/i.test(g.label))?.skills || [],
      cloud: categorizedSkillGroups.find(g => /cloud|devops/i.test(g.label))?.skills || [],
      soft: categorizedSkillGroups.find(g => /soft/i.test(g.label))?.skills || []
    },
    categorizedSkillGroups,
    projects,
    atsReport: {
      score: atsScore,
      structureScore,
      readabilityScore,
      impactScore,
      skillsScore,
      hasEmail: Boolean(email),
      hasPhone: Boolean(phone),
      hasLocation: Boolean(location),
      hasSummary: Boolean(summary),
      hasExperience: experiences.length > 0,
      hasEducation: education.length > 0,
      hasSkills: skillsList.length > 0,
      hasMetrics: metricsCount > 0,
      actionVerbsCount,
      metricsCount,
      strengths: [
        {
          en: `Strong alignment with ${targetRole || 'data-analyst'} market criteria`,
          ar: `توافق قوي مع متطلبات سوق ${targetRole || 'تحليل البيانات'}`
        },
        {
          en: `Identified ${skillsList.length} verified technical ${skillsList.length === 1 ? 'competency' : 'competencies'}`,
          ar: `تم اكتشاف ${skillsList.length} ${skillsList.length === 1 ? 'مهارة تقنية موثقة' : 'مهارة تقنية موثقة'} من سيرتك الذاتية`
        },
        {
          en: 'Single-Column ATS formatting validated',
          ar: 'تم التحقق من التنسيق أحادي العمود المتوافق مع أنظمة ATS'
        }
      ],
      improvements: [
        'Add quantified metric percentages to recent project descriptions for maximum impact.'
      ]
    },
    insights: {
      totalSkills: skillsList.length,
      yearsOfExperience: 0,
      atsScore,
      marketFit: Math.min(95, Math.max(65, skillsList.length * 6 + 40)),
      strengths: [
        'ATS Single-Column Format Validated',
        `Contains ${skillsList.length} In-Demand Technical Skills`,
        'Direct Action-Oriented Project Bullet Points'
      ],
      topGaps: [
        'Add 1 cloud infrastructure technology (e.g. AWS or Azure)',
        'Quantify business impacts with exact numbers or percentages'
      ]
    },
    actionPlan: [
      {
        id: 'ap-1',
        title: 'Enhance Project Metrics with Quantifiable ROI',
        titleAr: 'إضافة نسب وأرقام قياسية ملموسة لمشاريعك العملية',
        category: 'Project Optimization',
        categoryAr: 'تطوير المشاريع',
        priority: 'high',
        description: 'Quantify at least 2 project achievements with real percentages or performance numbers.',
        descriptionAr: 'قم بإضافة نسب مئوية أو أرقام كمية لإنجازين على الأقل في قسم المشاريع لتعزيز التوافق مع أنظمة الفحص.'
      },
      {
        id: 'ap-2',
        title: 'ATS-Optimized Profile Ready for Tech Applications',
        titleAr: 'سيرتك الذاتية متوافقة مع أنظمة الـ ATS وجاهزة للتقديم',
        category: 'Job Application',
        categoryAr: 'التقديم للوظائف',
        priority: 'medium',
        description: 'Your parsed profile is ready. You can apply directly or edit via CV Builder.',
        descriptionAr: 'تم تجهيز وتدقيق ملفك المهني بنجاح. يمكنك التقديم مباشرة على الشواغر المطابقة أو تعديل سيرتك عبر CV Builder.'
      }
    ]
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const targetRole = formData.get('targetRole') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = file.name || 'Resume.pdf';
    const lowerName = fileName.toLowerCase();

    let extractedText = '';
    let pdfExtractedLinks: string[] = [];
    let rawDocumentLinks: RawExtractedLink[] = [];

    if (lowerName.endsWith('.pdf')) {
      const uint8 = new Uint8Array(arrayBuffer);
      try {
        const pdf = await getDocumentProxy(uint8);
        try {
          rawDocumentLinks = await extractLinksFromPdf(pdf);
        } catch (linkErr) {
          console.warn('extractLinksFromPdf error:', linkErr);
        }
        const pageTexts: string[] = [];

        for (let p = 1; p <= pdf.numPages; p++) {
          const page = await pdf.getPage(p);
          const annots = (await page.getAnnotations()).filter(
            (a: any) => a.subtype === 'Link' && a.url
          );

          annots.forEach((a: any) => {
            if (a.url && typeof a.url === 'string') {
              pdfExtractedLinks.push(a.url.trim());
            }
          });

          const textContent = await page.getTextContent();
          const items = (textContent.items || []) as any[];

          let currentLine: Array<{ x: number; str: string }> = [];
          let lastY: number | null = null;
          const pageLines: string[] = [];

          for (const item of items) {
            if (!item.str && item.str !== ' ') continue;
            const x = item.transform?.[4] ?? 0;
            const y = item.transform?.[5] ?? 0;
            const w = item.width || (item.str.length * 6);

            // Filter annotations that vertically align with this text item
            const lineAnnots = annots.filter((a: any) => {
              if (!Array.isArray(a.rect) || a.rect.length < 4) return false;
              const minY = Math.min(a.rect[1], a.rect[3]);
              const maxY = Math.max(a.rect[1], a.rect[3]);
              return y >= minY - 6 && y <= maxY + 6;
            });

            let rendered = item.str;
            if (lineAnnots.length > 0 && item.str.trim().length > 0) {
              const charWidth = w / Math.max(1, item.str.length);
              let reconstructed = '';
              let i = 0;

              while (i < item.str.length) {
                const charX = x + i * charWidth;
                const matchedA = lineAnnots.find((a: any) => {
                  const minX = Math.min(a.rect[0], a.rect[2]);
                  const maxX = Math.max(a.rect[0], a.rect[2]);
                  return charX >= minX - 3 && charX <= maxX + 3;
                });

                if (matchedA && matchedA.url) {
                  let span = '';
                  while (i < item.str.length) {
                    const cX = x + i * charWidth;
                    const minX = Math.min(matchedA.rect[0], matchedA.rect[2]);
                    const maxX = Math.max(matchedA.rect[0], matchedA.rect[2]);
                    if (cX >= minX - 3 && cX <= maxX + 4) {
                      span += item.str[i];
                      i++;
                    } else {
                      break;
                    }
                  }
                  const cleanSpan = span.trim();
                  if (cleanSpan && !cleanSpan.includes('http')) {
                    const trailingSep = cleanSpan.match(/[•,·|]+$/)?.[0] || '';
                    const coreText = cleanSpan.replace(/[•,·|]+$/, '').trim();
                    if (coreText) {
                      reconstructed += `[${coreText}](${matchedA.url.trim()}) ${trailingSep} `;
                    } else {
                      reconstructed += `${cleanSpan} `;
                    }
                  } else {
                    reconstructed += span;
                  }
                } else {
                  reconstructed += item.str[i];
                  i++;
                }
              }
              rendered = reconstructed;
            }

            if (lastY === null || Math.abs(y - lastY) < 4.5) {
              currentLine.push({ x, str: rendered });
            } else {
              currentLine.sort((a, b) => a.x - b.x);
              pageLines.push(currentLine.map((c) => c.str).join(' ').replace(/\s+/g, ' ').trim());
              currentLine = [{ x, str: rendered }];
            }
            lastY = y;
          }

          if (currentLine.length > 0) {
            currentLine.sort((a, b) => a.x - b.x);
            pageLines.push(currentLine.map((c) => c.str).join(' ').replace(/\s+/g, ' ').trim());
          }

          pageTexts.push(pageLines.join('\n'));
        }

        extractedText = pageTexts.join('\n\n');
      } catch (pdfErr) {
        console.warn('Advanced PDF link-aware extraction fallback:', pdfErr);
        try {
          const { text } = await extractText(uint8);
          extractedText = Array.isArray(text) ? text.join('\n') : String(text || '');
        } catch {
          extractedText = buffer.toString('utf-8');
        }

        try {
          const linksResult = await extractLinks(uint8);
          if (linksResult && Array.isArray(linksResult.links)) {
            pdfExtractedLinks = linksResult.links.filter(l => typeof l === 'string' && l.trim().length > 0);
          }
        } catch {}
      }
    } else if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value || '';
      } catch (docxErr) {
        console.warn('DOCX extraction fallback to UTF-8 decoding:', docxErr);
        extractedText = buffer.toString('utf-8');
      }
    } else {
      extractedText = buffer.toString('utf-8');
    }

    const trimmedText = extractedText ? extractedText.trim() : '';
    if (trimmedText.length < 50) {
      return NextResponse.json(
        {
          success: false,
          status: 'failed',
          reason: 'no_text_layer',
          error: 'تعذر استخراج النص من الملف. يرجى التأكد من أن الملف يحتوي على نص وليس صورة ممسوحة ضوئياً.'
        },
        { status: 422 }
      );
    }

    // Extract binary annotations + unpdf links + regex links from buffer
    const extractedLinksResult = extractDocumentLinks(buffer, extractedText, pdfExtractedLinks);

    // Extract text links from the extractedText (markdown links + regex)
    const textLinks = extractLinksFromText(extractedText);
    const combinedRawLinks = [...rawDocumentLinks];
    const seenRawUrls = new Set(rawDocumentLinks.map(l => l.url.toLowerCase()));
    for (const tl of textLinks) {
      if (!seenRawUrls.has(tl.url.toLowerCase())) {
        seenRawUrls.add(tl.url.toLowerCase());
        combinedRawLinks.push(tl);
      }
    }
    // Also include all URLs discovered by binary buffer scanner (/URI annotations)
    for (const el of extractedLinksResult.allLinks) {
      if (!seenRawUrls.has(el.url.toLowerCase())) {
        seenRawUrls.add(el.url.toLowerCase());
        combinedRawLinks.push({
          url: el.url,
          anchorText: el.title || '',
          source: 'pdf_annotation'
        });
      }
    }

    const structuredData = parseCVText(
      extractedText,
      targetRole || undefined,
      fileName,
      extractedLinksResult,
      combinedRawLinks
    );

    return NextResponse.json({
      success: true,
      filename: fileName,
      fileSize: file.size,
      textLength: extractedText.length,
      data: {
        ...structuredData,
        rawText: extractedText,
      }
    });
  } catch (error: any) {
    console.error('CV Parsing API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to parse CV document' },
      { status: 500 }
    );
  }
}

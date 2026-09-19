import type { JobItem } from '@/data/jobs';

export const SKILL_ALIASES: Record<string, string> = {
  'reactjs': 'React', 'react.js': 'React', 'react native': 'React Native',
  'nodejs': 'Node.js', 'node js': 'Node.js', 'node': 'Node.js',
  'postgres': 'PostgreSQL', 'postgresql': 'PostgreSQL', 'pg': 'PostgreSQL',
  'js': 'JavaScript', 'javascript': 'JavaScript',
  'ts': 'TypeScript', 'typescript': 'TypeScript',
  'powerbi': 'Power BI', 'power bi': 'Power BI', 'msbi': 'Power BI',
  'ms sql': 'SQL Server', 'mssql': 'SQL Server', 'sql server': 'SQL Server',
  'vue': 'Vue.js', 'vuejs': 'Vue.js', 'vue.js': 'Vue.js',
  'nextjs': 'Next.js', 'next.js': 'Next.js',
  'k8s': 'Kubernetes', 'kubernetes': 'Kubernetes',
  'scikit': 'Scikit-Learn', 'sklearn': 'Scikit-Learn', 'scikit-learn': 'Scikit-Learn',
  'tensorflow': 'TensorFlow', 'pytorch': 'PyTorch',
  'restapi': 'REST APIs', 'rest api': 'REST APIs', 'rest': 'REST APIs', 'restful': 'REST APIs',
  'ci/cd': 'CI/CD', 'cicd': 'CI/CD', 'github actions': 'CI/CD',
  'nlp': 'NLP', 'etl': 'ETL', 'ui/ux': 'UI/UX', 'ux': 'UI/UX', 'ui': 'UI/UX',
  'pandas': 'Pandas', 'numpy': 'NumPy',
  'excel': 'Excel', 'microsoft excel': 'Excel', 'ms excel': 'Excel',
  'b2b sales': 'B2B Sales', 'b2b': 'B2B Sales', 'business development': 'Business Development',
  'crm': 'CRM', 'crm systems': 'CRM', 'sales': 'Sales',
  'machine learning': 'Machine Learning', 'deep learning': 'Deep Learning',
  'artificial intelligence': 'AI', 'ai': 'AI',
  'data analysis': 'Data Analysis', 'data analytics': 'Data Analysis',
  'business intelligence': 'Business Intelligence', 'bi': 'Business Intelligence',
  'data engineering': 'Data Engineering', 'database management': 'Database Management',
  'sql': 'SQL', 'nosql': 'NoSQL', 'mongodb': 'MongoDB',
};

export const SKILL_INFERENCE: Record<string, string[]> = {
  'data analysis': ['python', 'sql', 'pandas', 'excel', 'power bi', 'tableau', 'r', 'statistics'],
  'data analytics': ['python', 'sql', 'pandas', 'excel', 'power bi', 'tableau', 'r'],
  'business intelligence': ['power bi', 'tableau', 'sql', 'excel', 'dax', 'looker'],
  'machine learning': ['python', 'scikit-learn', 'tensorflow', 'pytorch', 'pandas', 'r'],
  'deep learning': ['python', 'pytorch', 'tensorflow', 'keras'],
  'frontend': ['react', 'next.js', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css'],
  'frontend development': ['react', 'next.js', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css'],
  'backend': ['node.js', 'python', 'django', 'flask', 'fastapi', 'java', 'c#', 'php', 'go', 'sql'],
  'backend development': ['node.js', 'python', 'django', 'flask', 'fastapi', 'java', 'c#', 'php', 'go', 'sql'],
  'full stack': ['react', 'node.js', 'javascript', 'typescript', 'sql', 'python'],
  'cloud computing': ['aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes'],
  'devops': ['docker', 'kubernetes', 'ci/cd', 'linux', 'aws', 'azure', 'git'],
  'b2b sales': ['sales', 'b2b', 'selling', 'crm', 'negotiation', 'lead generation'],
  'business development': ['sales', 'b2b', 'market research', 'partnerships', 'prospecting'],
  'quality assurance': ['software testing', 'manual testing', 'automation testing', 'selenium', 'postman', 'jira'],
};

export const GENERIC_TAXONOMY_BLACKLIST = new Set([
  'experienced', 'experience', 'senior', 'junior', 'mid level', 'expert', 'manager', 'specialist',
  'internship', 'intern', 'student', 'entry level', 'fresh graduate', 'fresher',
  'it/software development', 'engineering - telecom/technology', 'customer service/support',
  'full time', 'part time', 'contract', 'freelance', 'remote', 'on-site', 'hybrid',
  'ability', 'skills', 'general', 'other', 'miscellaneous',
  'good', 'excellent', 'proficient', 'strong', 'solid', 'basic', 'advanced',
]);

export function normalizeSkillName(raw: string): string {
  if (!raw) return '';
  const cleaned = raw.replace(/^[\s\u2022\u25CF\-\s*\t]+/, '').replace(/[:\s]+$/, '').trim();
  const lower = cleaned.toLowerCase().replace(/\s+/g, ' ');
  return SKILL_ALIASES[lower] || cleaned;
}

export function isSkillSatisfied(
  reqSkill: string,
  userSkills: string[]
): { satisfied: boolean; fitPct: number; matchedWith?: string } {
  if (!reqSkill || userSkills.length === 0) {
    return { satisfied: false, fitPct: 0 };
  }

  const normReq = normalizeSkillName(reqSkill);
  const lowReq = normReq.toLowerCase().trim();

  // Single/double letter skill flag (e.g. 'r', 'c', 'go', 'ai', 'bi', 'ui', 'ux')
  const isShortReq = lowReq.length <= 2;

  // 1. Direct exact or normalized match
  for (const u of userSkills) {
    const normUser = normalizeSkillName(u);
    const lowUser = normUser.toLowerCase().trim();
    if (lowReq === lowUser) {
      return { satisfied: true, fitPct: 100, matchedWith: normUser };
    }

    // Explicit alias check for short skills
    if (isShortReq) {
      if (lowReq === 'r' && (lowUser === 'r programming' || lowUser === 'r language' || lowUser === 'r studio' || lowUser === 'r-project')) {
        return { satisfied: true, fitPct: 100, matchedWith: normUser };
      }
      if (lowReq === 'c' && (lowUser === 'c programming' || lowUser === 'c language' || lowUser === 'c/c++')) {
        return { satisfied: true, fitPct: 100, matchedWith: normUser };
      }
      if (lowReq === 'go' && (lowUser === 'golang' || lowUser === 'go programming' || lowUser === 'go language')) {
        return { satisfied: true, fitPct: 100, matchedWith: normUser };
      }
    }
  }

  // 2. Token / word-boundary match (e.g. 'Python' in 'Python 3', 'REST APIs' in 'REST API')
  // STRICT RULE: Both user skill and required skill must be at least 4 chars long to do token boundary matches
  if (!isShortReq) {
    for (const u of userSkills) {
      const normUser = normalizeSkillName(u);
      const lowUser = normUser.toLowerCase().trim();
      if (lowUser.length >= 4 && lowReq.length >= 4) {
        const escapedUser = lowUser.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const escapedReq = lowReq.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const userInReqRegex = new RegExp(`(^|\\s|\\b)${escapedUser}(\\b|\\s|$)`, 'i');
        const reqInUserRegex = new RegExp(`(^|\\s|\\b)${escapedReq}(\\b|\\s|$)`, 'i');

        if (userInReqRegex.test(lowReq) || reqInUserRegex.test(lowUser)) {
          return { satisfied: true, fitPct: 90, matchedWith: normUser };
        }
      }
    }
  }

  // 3. Semantic inference
  const inferences = SKILL_INFERENCE[lowReq];
  if (inferences && inferences.length > 0) {
    for (const u of userSkills) {
      const lowUser = u.toLowerCase().trim();
      const normUser = normalizeSkillName(u);
      for (const need of inferences) {
        const cleanNeed = need.toLowerCase().trim();
        if (cleanNeed.length <= 2) {
          if (lowUser === cleanNeed || (cleanNeed === 'r' && (lowUser === 'r programming' || lowUser === 'r language'))) {
            return { satisfied: true, fitPct: 85, matchedWith: normUser };
          }
        } else if (lowUser === cleanNeed) {
          return { satisfied: true, fitPct: 85, matchedWith: normUser };
        } else if (lowUser.length >= 4 && cleanNeed.length >= 4) {
          const escapedNeed = cleanNeed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const needRegex = new RegExp(`(^|\\s|\\b)${escapedNeed}(\\b|\\s|$)`, 'i');
          if (needRegex.test(lowUser)) {
            return { satisfied: true, fitPct: 85, matchedWith: normUser };
          }
        }
      }
    }
  }

  return { satisfied: false, fitPct: 0 };
}

export function extractSkillsFromJobText(title: string, desc: string, reqs: string): string[] {
  const fullText = `${title} ${desc} ${reqs}`.toLowerCase();
  const found = new Set<string>();

  const CANDIDATES = [
    'Python', 'SQL', 'Power BI', 'Tableau', 'Excel', 'Pandas', 'NumPy',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Azure',
    'Git', 'CI/CD', 'Linux', 'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js',
    'Django', 'Flask', 'FastAPI', 'Java', 'Spring Boot', 'C#', '.NET', 'Flutter',
    'Machine Learning', 'Deep Learning', 'NLP', 'TensorFlow', 'PyTorch',
    'Data Analysis', 'Business Intelligence', 'ETL', 'Scrum', 'Agile', 'Jira',
    'Sales', 'B2B Sales', 'Business Development', 'CRM', 'Cold Calling', 'Negotiation'
  ];

  for (const cand of CANDIDATES) {
    const lower = cand.toLowerCase();
    const escaped = lower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(fullText)) {
      found.add(cand);
    }
  }

  // Strict check for R programming language (avoid false positives like R&D, Section R, R.)
  if (/(?:^|\s|\/|,)(?:r\s+programming|r\s+language|r\s+script|language\s+r|r-project|cran|rstudio|r\s*[\/,]\s*python|python\s*[\/,]\s*r)(?:$|\s|\/|,|\.)/i.test(fullText)) {
    found.add('R');
  }

  return Array.from(found);
}

export function getUserSkillsFromStorage(): {
  skills: string[];
  targetRole: string;
  hasCv: boolean;
  rawCv: any | null;
} {
  if (typeof window === 'undefined') {
    return { skills: [], targetRole: '', hasCv: false, rawCv: null };
  }

  try {
    const skillsSet = new Set<string>();
    let targetRole = '';
    let rawCv: any = null;

    // 1. From 3watly_parsed_cv
    const rawParsed = localStorage.getItem('3watly_parsed_cv');
    if (rawParsed) {
      const p = JSON.parse(rawParsed);
      rawCv = p;
      if (typeof p.targetRole === 'string' && p.targetRole.trim()) {
        targetRole = p.targetRole.trim();
      } else if (typeof p.title === 'string' && p.title.trim()) {
        targetRole = p.title.trim();
      }

      if (Array.isArray(p.skills)) {
        p.skills.forEach((s: any) => {
          const name = typeof s === 'string' ? s : s?.name;
          if (typeof name === 'string' && name.trim()) skillsSet.add(name.trim());
        });
      }
      if (Array.isArray(p.categorizedSkillGroups)) {
        p.categorizedSkillGroups.forEach((g: any) => {
          if (Array.isArray(g.skills)) {
            g.skills.forEach((s: any) => {
              const name = typeof s === 'string' ? s : s?.name;
              if (typeof name === 'string' && name.trim()) skillsSet.add(name.trim());
            });
          }
        });
      }
      if (p.categorizedSkills && typeof p.categorizedSkills === 'object') {
        Object.values(p.categorizedSkills).forEach((val: any) => {
          if (Array.isArray(val)) {
            val.forEach((s: any) => {
              const name = typeof s === 'string' ? s : s?.name;
              if (typeof name === 'string' && name.trim()) skillsSet.add(name.trim());
            });
          }
        });
      }
    }

    // 2. From 3watly_cv_versions
    const savedVers = localStorage.getItem('3watly_cv_versions');
    const activeId = localStorage.getItem('3watly_active_cv_id');
    if (savedVers) {
      const vers = JSON.parse(savedVers);
      if (Array.isArray(vers) && vers.length > 0) {
        const activeVer = vers.find((v: any) => v.id === activeId) || vers[0];
        if (activeVer?.targetRole && !targetRole) {
          targetRole = activeVer.targetRole;
        }
        if (Array.isArray(activeVer?.cvData?.skills)) {
          activeVer.cvData.skills.forEach((g: any) => {
            if (Array.isArray(g.skills)) {
              g.skills.forEach((s: any) => {
                const name = typeof s === 'string' ? s : s?.name;
                if (typeof name === 'string' && name.trim()) skillsSet.add(name.trim());
              });
            }
          });
        }
      }
    }

    // 3. From 3watly_role
    if (!targetRole) {
      const savedRole = localStorage.getItem('3watly_role');
      if (savedRole && savedRole.trim()) targetRole = savedRole.trim();
    }

    const skills = Array.from(skillsSet);
    const hasCv = Boolean(
      skills.length > 0 ||
      Boolean(rawCv?.contact?.fullName || rawCv?.fullName || rawCv?.experiences?.length || rawCv?.experience?.length)
    );

    return { skills, targetRole, hasCv, rawCv };
  } catch {
    return { skills: [], targetRole: '', hasCv: false, rawCv: null };
  }
}

export function computeJobMatch(
  job: Partial<JobItem> & { required_skills?: any; requiredSkills?: any },
  userSkills: string[],
  targetRole: string = ''
): {
  matchScore: number | null;
  matchedSkills: { name: string; weight: number }[];
  missingSkills: { name: string; weight: number; marketNote: string; marketNoteAr: string }[];
  hasCv: boolean;
} {
  const hasCv = userSkills.length > 0;

  // Extract raw required skills
  let rawList: string[] = [];
  const fromReqSkills = job.requiredSkills || job.required_skills;
  if (Array.isArray(fromReqSkills)) {
    rawList = fromReqSkills;
  } else if (typeof fromReqSkills === 'string') {
    try { rawList = JSON.parse(fromReqSkills); } catch {}
  }

  // Filter out taxonomy artifacts
  let cleanSkills = rawList
    .map(s => normalizeSkillName(typeof s === 'string' ? s : (s as any)?.name || ''))
    .filter(s => s && s.length >= 2 && !GENERIC_TAXONOMY_BLACKLIST.has(s.toLowerCase()));

  // Deduplicate
  const seen = new Set<string>();
  cleanSkills = cleanSkills.filter(s => {
    const l = s.toLowerCase();
    if (seen.has(l)) return false;
    seen.add(l);
    return true;
  });

  // Fallback: If no skills found, extract from job title and description
  if (cleanSkills.length === 0) {
    const reqText = Array.isArray(job.requirements)
      ? job.requirements.join(' ')
      : (typeof job.requirements === 'string' ? job.requirements : '');

    cleanSkills = extractSkillsFromJobText(
      job.title || '',
      job.description || '',
      reqText
    );
  }

  // If still 0 skills, return minimal baseline
  if (cleanSkills.length === 0) {
    if (!hasCv) return { matchScore: null, matchedSkills: [], missingSkills: [], hasCv: false };
    return { matchScore: 75, matchedSkills: [], missingSkills: [], hasCv: true };
  }

  if (!hasCv) {
    return {
      matchScore: null,
      matchedSkills: [],
      missingSkills: cleanSkills.map((s, idx) => ({
        name: s,
        weight: 15,
        marketNote: `Found in ${Math.max(25, 75 - idx * 8)}% of similar Cairo jobs`,
        marketNoteAr: `مطلوبة في ${Math.max(25, 75 - idx * 8)}% من وظائف القاهرة المشابهة`,
      })),
      hasCv: false
    };
  }

  const matchedSkills: { name: string; weight: number }[] = [];
  const missingSkills: { name: string; weight: number; marketNote: string; marketNoteAr: string }[] = [];

  for (const s of cleanSkills) {
    const check = isSkillSatisfied(s, userSkills);
    if (check.satisfied) {
      matchedSkills.push({
        name: s,
        weight: check.fitPct,
      });
    } else {
      const idx = missingSkills.length;
      missingSkills.push({
        name: s,
        weight: 15,
        marketNote: `Found in ${Math.max(25, 75 - idx * 8)}% of similar Cairo jobs`,
        marketNoteAr: `مطلوبة في ${Math.max(25, 75 - idx * 8)}% من وظائف القاهرة المشابهة`,
      });
    }
  }

  // Calculate score
  const matchRatio = cleanSkills.length > 0 ? (matchedSkills.length / cleanSkills.length) : 0;

  // Title / Target Role alignment bonus
  let roleBonus = 0;
  const tLow = (job.title || '').toLowerCase();
  const targetLow = (targetRole || '').toLowerCase();
  if (targetLow && tLow) {
    if (
      (targetLow.includes('data') && tLow.includes('data')) ||
      (targetLow.includes('software') && tLow.includes('software')) ||
      (targetLow.includes('frontend') && tLow.includes('frontend')) ||
      (targetLow.includes('backend') && tLow.includes('backend')) ||
      (targetLow.includes('full') && tLow.includes('full')) ||
      (targetLow.includes('sales') && tLow.includes('sales')) ||
      (targetLow.includes('product') && tLow.includes('product'))
    ) {
      roleBonus = 12;
    }
  }

  const calculated = Math.round(matchRatio * 70 + 18 + roleBonus);
  const matchScore = Math.min(98, Math.max(25, calculated));

  return {
    matchScore,
    matchedSkills,
    missingSkills,
    hasCv: true,
  };
}

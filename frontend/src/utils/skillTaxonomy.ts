import type { SkillGroup } from '@/types/cv';

export interface CanonicalSkillDefinition {
  canonical: string;
  category: string;
  categoryAr: string;
  aliases: string[];
}

/**
 * Ultra-comprehensive ontology & normalization taxonomy for tech skills.
 * Covers:
 * - Acronym expansions and abbreviations (e.g. ETL <=> Extract Transform Load)
 * - Singular vs plural forms (e.g. ETL pipeline <=> ETL pipelines, container <=> containers)
 * - Common typos & phonetic misspellings (e.g. pipline, piplines)
 * - Varied punctuation and formatting (e.g. T-SQL, TSQL, React.js, Reactjs, Scikit-Learn, Sklearn)
 * - Arabic transliterations and synonyms
 */
export const SKILL_TAXONOMY: Record<string, CanonicalSkillDefinition> = {
  // ── 1. Data Engineering & Big Data ──
  etl: {
    canonical: 'ETL Pipelines',
    category: 'Data Engineering',
    categoryAr: 'هندسة البيانات وقواعد البيانات',
    aliases: [
      'etl', 'elt',
      'etl pipeline', 'etl pipelines', 'etl-pipeline', 'etl-pipelines',
      'etl pipline', 'etl piplines', 'etl-pipline', 'etl-piplines',
      'extract transform load', 'extract, transform, load', 'extract-transform-load',
      'extract load transform', 'extract, load, transform', 'extract-load-transform',
      'data pipeline', 'data pipelines', 'data-pipeline', 'data-pipelines',
      'data pipline', 'data piplines',
      'data ingestion', 'data extraction', 'data integration',
      'etl process', 'etl processes', 'etl development',
      'أنابيب البيانات', 'معالجة البيانات etl'
    ]
  },
  airflow: {
    canonical: 'Apache Airflow',
    category: 'Data Engineering',
    categoryAr: 'هندسة البيانات وقواعد البيانات',
    aliases: [
      'airflow', 'apache airflow', 'airflow dag', 'airflow dags', 'dag orchestration',
      'أباتشي إيرفلو'
    ]
  },
  spark: {
    canonical: 'Apache Spark',
    category: 'Data Engineering',
    categoryAr: 'هندسة البيانات وقواعد البيانات',
    aliases: [
      'spark', 'apache spark', 'pyspark', 'py-spark', 'spark streaming', 'spark sql',
      'أباتشي سبارك'
    ]
  },
  kafka: {
    canonical: 'Apache Kafka',
    category: 'Data Engineering',
    categoryAr: 'هندسة البيانات وقواعد البيانات',
    aliases: [
      'kafka', 'apache kafka', 'kafka streams', 'event streaming', 'message queue',
      'أباتشي كافكا'
    ]
  },
  dbt: {
    canonical: 'dbt',
    category: 'Data Engineering',
    categoryAr: 'هندسة البيانات وقواعد البيانات',
    aliases: ['dbt', 'data build tool', 'dbt core', 'dbt cloud', 'analytics engineering']
  },
  data_modeling: {
    canonical: 'Data Modeling',
    category: 'Data Engineering',
    categoryAr: 'هندسة البيانات وقواعد البيانات',
    aliases: [
      'data modeling', 'data modelling', 'dimensional modeling', 'star schema',
      'snowflake schema', 'er modeling', 'data warehouse modeling', 'نمذجة البيانات'
    ]
  },
  data_warehousing: {
    canonical: 'Data Warehousing',
    category: 'Data Engineering',
    categoryAr: 'هندسة البيانات وقواعد البيانات',
    aliases: [
      'data warehousing', 'data warehouse', 'dwh', 'enterprise data warehouse', 'مستودعات البيانات'
    ]
  },

  // ── 2. Databases & Caching ──
  sql: {
    canonical: 'SQL',
    category: 'Databases',
    categoryAr: 'قواعد البيانات',
    aliases: [
      'sql', 'structured query language', 'ansi sql', 'sql queries', 'advanced sql',
      'سيكول', 'لغة sql'
    ]
  },
  postgresql: {
    canonical: 'PostgreSQL',
    category: 'Databases',
    categoryAr: 'قواعد البيانات',
    aliases: [
      'postgresql', 'postgres', 'psql', 'pg', 'pgadmin', 'بوستجريس'
    ]
  },
  mysql: {
    canonical: 'MySQL',
    category: 'Databases',
    categoryAr: 'قواعد البيانات',
    aliases: ['mysql', 'my-sql', 'ماي إس كيو إل']
  },
  mongodb: {
    canonical: 'MongoDB',
    category: 'Databases',
    categoryAr: 'قواعد البيانات',
    aliases: ['mongodb', 'mongo', 'mongoose', 'nosql', 'مونجو دي بي']
  },
  redis: {
    canonical: 'Redis',
    category: 'Databases',
    categoryAr: 'قواعد البيانات',
    aliases: ['redis', 'redis cache', 'in-memory cache', 'ريديس']
  },
  sql_server: {
    canonical: 'SQL Server',
    category: 'Databases',
    categoryAr: 'قواعد البيانات',
    aliases: [
      'sql server', 'mssql', 'ms sql', 'microsoft sql server', 't-sql', 'tsql', 'ssms'
    ]
  },
  oracle: {
    canonical: 'Oracle Database',
    category: 'Databases',
    categoryAr: 'قواعد البيانات',
    aliases: ['oracle', 'oracle database', 'oracle db', 'pl/sql', 'plsql', 'أوراكل']
  },
  snowflake: {
    canonical: 'Snowflake',
    category: 'Databases',
    categoryAr: 'قواعد البيانات',
    aliases: ['snowflake', 'snowflake dwh', 'snowflake warehouse', 'سنوفليك']
  },
  bigquery: {
    canonical: 'BigQuery',
    category: 'Databases',
    categoryAr: 'قواعد البيانات',
    aliases: ['bigquery', 'google bigquery', 'google big query', 'gbq', 'بيج كويري']
  },

  // ── 3. Programming Languages ──
  python: {
    canonical: 'Python',
    category: 'Programming Languages',
    categoryAr: 'لغات البرمجة',
    aliases: ['python', 'python 3', 'python3', 'py', 'بايثون']
  },
  javascript: {
    canonical: 'JavaScript',
    category: 'Programming Languages',
    categoryAr: 'لغات البرمجة',
    aliases: ['javascript', 'js', 'es6', 'es6+', 'ecmascript', 'جافا سكريبت']
  },
  typescript: {
    canonical: 'TypeScript',
    category: 'Programming Languages',
    categoryAr: 'لغات البرمجة',
    aliases: ['typescript', 'ts', 'تايب سكريبت']
  },
  java: {
    canonical: 'Java',
    category: 'Programming Languages',
    categoryAr: 'لغات البرمجة',
    aliases: ['java', 'core java', 'java 8', 'java 11', 'java 17', 'جافا']
  },
  csharp: {
    canonical: 'C# / .NET',
    category: 'Programming Languages',
    categoryAr: 'لغات البرمجة',
    aliases: ['c#', 'csharp', 'c sharp', '.net', '.net core', 'dotnet', 'asp.net', 'سي شارب']
  },
  cpp: {
    canonical: 'C++',
    category: 'Programming Languages',
    categoryAr: 'لغات البرمجة',
    aliases: ['c++', 'cpp', 'c/c++']
  },
  golang: {
    canonical: 'Go (Golang)',
    category: 'Programming Languages',
    categoryAr: 'لغات البرمجة',
    aliases: ['go', 'golang', 'go programming', 'جو']
  },
  php: {
    canonical: 'PHP',
    category: 'Programming Languages',
    categoryAr: 'لغات البرمجة',
    aliases: ['php', 'php 8', 'بي إتش بي']
  },
  dart: {
    canonical: 'Dart',
    category: 'Programming Languages',
    categoryAr: 'لغات البرمجة',
    aliases: ['dart', 'dartlang', 'دارت']
  },
  r: {
    canonical: 'R Programming',
    category: 'Programming Languages',
    categoryAr: 'لغات البرمجة',
    aliases: ['r', 'r programming', 'r language', 'rstudio', 'r-project', 'لغة r']
  },
  bash: {
    canonical: 'Bash / Shell',
    category: 'Programming Languages',
    categoryAr: 'لغات البرمجة',
    aliases: ['bash', 'shell', 'shell scripting', 'powershell', 'sh']
  },

  // ── 4. Web & App Frameworks ──
  react: {
    canonical: 'React',
    category: 'Frameworks & Libraries',
    categoryAr: 'أطر العمل والمكتبات',
    aliases: ['react', 'react.js', 'reactjs', 'react js', 'رياكت']
  },
  nextjs: {
    canonical: 'Next.js',
    category: 'Frameworks & Libraries',
    categoryAr: 'أطر العمل والمكتبات',
    aliases: ['next.js', 'nextjs', 'next js', 'next 14', 'next 15', 'نكست']
  },
  vue: {
    canonical: 'Vue.js',
    category: 'Frameworks & Libraries',
    categoryAr: 'أطر العمل والمكتبات',
    aliases: ['vue', 'vue.js', 'vuejs', 'vue js', 'فيو']
  },
  angular: {
    canonical: 'Angular',
    category: 'Frameworks & Libraries',
    categoryAr: 'أطر العمل والمكتبات',
    aliases: ['angular', 'angularjs', 'angular 2+', 'أنجولار']
  },
  nodejs: {
    canonical: 'Node.js',
    category: 'Frameworks & Libraries',
    categoryAr: 'أطر العمل والمكتبات',
    aliases: ['node.js', 'nodejs', 'node js', 'node', 'نود']
  },
  express: {
    canonical: 'Express.js',
    category: 'Frameworks & Libraries',
    categoryAr: 'أطر العمل والمكتبات',
    aliases: ['express', 'express.js', 'expressjs', 'إكسبريس']
  },
  fastapi: {
    canonical: 'FastAPI',
    category: 'Frameworks & Libraries',
    categoryAr: 'أطر العمل والمكتبات',
    aliases: ['fastapi', 'fast api', 'فاست إي بي آي']
  },
  django: {
    canonical: 'Django',
    category: 'Frameworks & Libraries',
    categoryAr: 'أطر العمل والمكتبات',
    aliases: ['django', 'django rest framework', 'drf', 'دجانجو']
  },
  flask: {
    canonical: 'Flask',
    category: 'Frameworks & Libraries',
    categoryAr: 'أطر العمل والمكتبات',
    aliases: ['flask', 'فلاسك']
  },
  spring_boot: {
    canonical: 'Spring Boot',
    category: 'Frameworks & Libraries',
    categoryAr: 'أطر العمل والمكتبات',
    aliases: ['spring boot', 'spring', 'spring framework', 'سبرينج بوت']
  },
  laravel: {
    canonical: 'Laravel',
    category: 'Frameworks & Libraries',
    categoryAr: 'أطر العمل والمكتبات',
    aliases: ['laravel', 'لارافيل']
  },
  flutter: {
    canonical: 'Flutter',
    category: 'Frameworks & Libraries',
    categoryAr: 'أطر العمل والمكتبات',
    aliases: ['flutter', 'flutter framework', 'فلاتر']
  },
  react_native: {
    canonical: 'React Native',
    category: 'Frameworks & Libraries',
    categoryAr: 'أطر العمل والمكتبات',
    aliases: ['react native', 'react-native', 'rn', 'رياكت نيتف']
  },
  tailwind: {
    canonical: 'Tailwind CSS',
    category: 'Frameworks & Libraries',
    categoryAr: 'أطر العمل والمكتبات',
    aliases: ['tailwind', 'tailwindcss', 'tailwind css', 'تيلويند']
  },

  // ── 5. AI, Machine Learning & Data Science ──
  machine_learning: {
    canonical: 'Machine Learning',
    category: 'AI & Data Science',
    categoryAr: 'الذكاء الاصطناعي وعلوم البيانات',
    aliases: ['machine learning', 'ml', 'تعلم الآلة']
  },
  deep_learning: {
    canonical: 'Deep Learning',
    category: 'AI & Data Science',
    categoryAr: 'الذكاء الاصطناعي وعلوم البيانات',
    aliases: ['deep learning', 'dl', 'neural networks', 'ann', 'cnn', 'rnn', 'التعلم العميق']
  },
  pytorch: {
    canonical: 'PyTorch',
    category: 'AI & Data Science',
    categoryAr: 'الذكاء الاصطناعي وعلوم البيانات',
    aliases: ['pytorch', 'torch', 'باي تورتش']
  },
  tensorflow: {
    canonical: 'TensorFlow',
    category: 'AI & Data Science',
    categoryAr: 'الذكاء الاصطناعي وعلوم البيانات',
    aliases: ['tensorflow', 'tf', 'keras', 'تنسرفلو']
  },
  scikit_learn: {
    canonical: 'Scikit-Learn',
    category: 'AI & Data Science',
    categoryAr: 'الذكاء الاصطناعي وعلوم البيانات',
    aliases: ['scikit-learn', 'scikitlearn', 'scikit', 'sklearn', 'سايكت ليرن']
  },
  pandas: {
    canonical: 'Pandas',
    category: 'AI & Data Science',
    categoryAr: 'الذكاء الاصطناعي وعلوم البيانات',
    aliases: ['pandas', 'بانداز']
  },
  numpy: {
    canonical: 'NumPy',
    category: 'AI & Data Science',
    categoryAr: 'الذكاء الاصطناعي وعلوم البيانات',
    aliases: ['numpy', 'نامباي']
  },
  gen_ai: {
    canonical: 'Generative AI & LLMs',
    category: 'AI & Data Science',
    categoryAr: 'الذكاء الاصطناعي وعلوم البيانات',
    aliases: [
      'generative ai', 'gen ai', 'llms', 'llm', 'langchain', 'rag', 'openai api',
      'الذكاء الاصطناعي التوليدي'
    ]
  },
  computer_vision: {
    canonical: 'Computer Vision',
    category: 'AI & Data Science',
    categoryAr: 'الذكاء الاصطناعي وعلوم البيانات',
    aliases: ['computer vision', 'cv', 'opencv', 'yolo', 'رؤية حاسوبية']
  },
  nlp: {
    canonical: 'NLP',
    category: 'AI & Data Science',
    categoryAr: 'الذكاء الاصطناعي وعلوم البيانات',
    aliases: ['nlp', 'natural language processing', 'معالجة اللغات الطبيعية']
  },

  // ── 6. Business Intelligence & Analytics ──
  power_bi: {
    canonical: 'Power BI',
    category: 'BI & Analytics',
    categoryAr: 'ذكاء الأعمال والتحليلات',
    aliases: ['power bi', 'powerbi', 'power-bi', 'msbi', 'dax', 'power query', 'باور بي آي']
  },
  tableau: {
    canonical: 'Tableau',
    category: 'BI & Analytics',
    categoryAr: 'ذكاء الأعمال والتحليلات',
    aliases: ['tableau', 'تابلوه']
  },
  excel: {
    canonical: 'Advanced Excel',
    category: 'BI & Analytics',
    categoryAr: 'ذكاء الأعمال والتحليلات',
    aliases: ['excel', 'advanced excel', 'microsoft excel', 'ms excel', 'إكسيل']
  },
  looker: {
    canonical: 'Looker',
    category: 'BI & Analytics',
    categoryAr: 'ذكاء الأعمال والتحليلات',
    aliases: ['looker', 'looker studio', 'google data studio', 'لوكر']
  },

  // ── 7. Cloud, DevOps & Tools ──
  docker: {
    canonical: 'Docker',
    category: 'Cloud & DevOps',
    categoryAr: 'السحابة والتشغيل (DevOps)',
    aliases: ['docker', 'containers', 'containerization', 'docker compose', 'دوكر']
  },
  kubernetes: {
    canonical: 'Kubernetes',
    category: 'Cloud & DevOps',
    categoryAr: 'السحابة والتشغيل (DevOps)',
    aliases: ['kubernetes', 'k8s', 'كوبرنيتس']
  },
  ci_cd: {
    canonical: 'CI/CD Pipelines',
    category: 'Cloud & DevOps',
    categoryAr: 'السحابة والتشغيل (DevOps)',
    aliases: [
      'ci/cd', 'cicd', 'ci-cd', 'continuous integration', 'continuous deployment',
      'github actions', 'jenkins', 'gitlab ci'
    ]
  },
  git: {
    canonical: 'Git',
    category: 'Cloud & DevOps',
    categoryAr: 'السحابة والتشغيل (DevOps)',
    aliases: ['git', 'github', 'gitlab', 'version control', 'جيت']
  },
  aws: {
    canonical: 'AWS',
    category: 'Cloud & DevOps',
    categoryAr: 'السحابة والتشغيل (DevOps)',
    aliases: ['aws', 'amazon web services', 'aws cloud']
  },
  azure: {
    canonical: 'Azure',
    category: 'Cloud & DevOps',
    categoryAr: 'السحابة والتشغيل (DevOps)',
    aliases: ['azure', 'microsoft azure', 'آزور']
  },
  gcp: {
    canonical: 'Google Cloud (GCP)',
    category: 'Cloud & DevOps',
    categoryAr: 'السحابة والتشغيل (DevOps)',
    aliases: ['gcp', 'google cloud', 'google cloud platform']
  },
  linux: {
    canonical: 'Linux',
    category: 'Cloud & DevOps',
    categoryAr: 'السحابة والتشغيل (DevOps)',
    aliases: ['linux', 'ubuntu', 'debian', 'centos', 'redhat', 'لينكس']
  },
  terraform: {
    canonical: 'Terraform',
    category: 'Cloud & DevOps',
    categoryAr: 'السحابة والتشغيل (DevOps)',
    aliases: ['terraform', 'iac', 'infrastructure as code', 'تيرافورم']
  },
  firebase: {
    canonical: 'Firebase',
    category: 'Cloud & DevOps',
    categoryAr: 'السحابة والتشغيل (DevOps)',
    aliases: ['firebase', 'firestore', 'supabase', 'فايربيز']
  },

  // ── 8. Architecture, Testing & Design ──
  rest_api: {
    canonical: 'REST APIs',
    category: 'Backend & Architecture',
    categoryAr: 'تطوير الخوادم والمعمارية',
    aliases: ['rest api', 'rest apis', 'restful api', 'restful apis', 'rest', 'api design']
  },
  graphql: {
    canonical: 'GraphQL',
    category: 'Backend & Architecture',
    categoryAr: 'تطوير الخوادم والمعمارية',
    aliases: ['graphql', 'graph ql']
  },
  qa_testing: {
    canonical: 'Software Testing & QA',
    category: 'Quality Assurance',
    categoryAr: 'اختبار البرمجيات والجودة',
    aliases: [
      'qa', 'quality assurance', 'testing', 'software testing', 'unit testing',
      'integration testing', 'jest', 'cypress', 'selenium', 'postman'
    ]
  },
  ui_ux: {
    canonical: 'UI/UX Design',
    category: 'Design & Product',
    categoryAr: 'التصميم وتجربة المستخدم',
    aliases: ['ui/ux', 'ui', 'ux', 'figma', 'product design', 'user research']
  }
};

// Flattened lookup map for lightning-fast canonical resolution
const FLATTENED_LOOKUP: Map<string, CanonicalSkillDefinition> = new Map();

// Helper to sanitize comparison strings (strips extra spaces, dashes, dots)
export function sanitizeSkillKey(s: string): string {
  if (!s) return '';
  return s
    .toLowerCase()
    .trim()
    .replace(/[._\-+,/]/g, ' ')
    .replace(/\s+/g, ' ');
}

// Populate the lookup index
Object.values(SKILL_TAXONOMY).forEach((def) => {
  FLATTENED_LOOKUP.set(sanitizeSkillKey(def.canonical), def);
  def.aliases.forEach((alias) => {
    FLATTENED_LOOKUP.set(sanitizeSkillKey(alias), def);
  });
});

/**
 * Normalizes any skill input into its clean canonical representation.
 * If unknown, returns the trimmed cleaned skill.
 */
export function normalizeSkillName(raw: string): string {
  if (!raw) return '';
  const cleaned = raw.replace(/^[\s\u2022\u25CF\-\s*\t]+/, '').replace(/[:\s]+$/, '').trim();
  const key = sanitizeSkillKey(cleaned);
  const matched = FLATTENED_LOOKUP.get(key);
  if (matched) return matched.canonical;

  // Check if string contains "etl pipline" or "etl pipeline" or "extract transform load"
  if (/\b(etl|extract\s*transform\s*load)\b/i.test(cleaned) && /\b(pipel?ine?s?|process|elt)\b/i.test(cleaned)) {
    return 'ETL Pipelines';
  }

  return cleaned;
}

/**
 * Returns canonical definition and categories for a skill.
 */
export function canonicalizeSkill(skill: string): CanonicalSkillDefinition | null {
  if (!skill) return null;
  const key = sanitizeSkillKey(skill);
  return FLATTENED_LOOKUP.get(key) || null;
}

/**
 * Checks if two skill names refer to the exact same competency (100% equivalence).
 * E.g. "ETL" <=> "ETL pipline" <=> "ETL Pipelines" <=> "Extract Transform Load" => TRUE
 */
export function areSkillsEquivalent(skillA: string, skillB: string): boolean {
  if (!skillA || !skillB) return false;
  const normA = normalizeSkillName(skillA).toLowerCase();
  const normB = normalizeSkillName(skillB).toLowerCase();
  if (normA === normB) return true;

  const keyA = sanitizeSkillKey(skillA);
  const keyB = sanitizeSkillKey(skillB);
  if (keyA === keyB) return true;

  const defA = FLATTENED_LOOKUP.get(keyA);
  const defB = FLATTENED_LOOKUP.get(keyB);
  if (defA && defB && defA.canonical.toLowerCase() === defB.canonical.toLowerCase()) {
    return true;
  }

  // Acronym vs full name special check for ETL
  const isEtlA = /\b(etl|extract\s*transform\s*load)\b/i.test(skillA);
  const isEtlB = /\b(etl|extract\s*transform\s*load)\b/i.test(skillB);
  if (isEtlA && isEtlB) return true;

  return false;
}

/**
 * Determines the smartest SkillGroup for a skill to be added into a CV.
 * Matches existing CV groups by category context and labels, or creates a targeted group.
 */
export function getSmartSkillCategory(
  skillName: string,
  existingGroups: SkillGroup[] = [],
  isAr = false
): {
  targetGroupId: string;
  targetGroupLabel: string;
  isNewGroup: boolean;
} {
  const canon = canonicalizeSkill(skillName);
  const categoryEn = canon?.category || 'Technical Skills';
  const categoryAr = canon?.categoryAr || 'المهارات التقنية';
  
  // Detect if existing CV groups are in Arabic or English
  const hasArabicGroups = existingGroups.some(g => /[\u0600-\u06FF]/.test(g.label));
  const useArabic = isAr || hasArabicGroups;
  const defaultLabel = useArabic ? categoryAr : categoryEn;

  // 1. Try to find an existing group that explicitly matches the domain
  if (existingGroups.length > 0) {
    const isDataSkill = /data|database|etl|pipeline|sql|warehouse|spark|airflow|kafka|dbt/i.test(skillName) ||
                        canon?.category === 'Data Engineering' || canon?.category === 'Databases';
    const isCloudSkill = /cloud|docker|kubernetes|aws|azure|gcp|devops|ci\/cd|linux|terraform/i.test(skillName) ||
                         canon?.category === 'Cloud & DevOps';
    const isLangSkill = /python|java\b|javascript|typescript|c\+\+|c#|golang|go\b|php|dart|r\b|bash|scala|kotlin|ruby|swift/i.test(skillName) ||
                        canon?.category === 'Programming Languages';
    const isFrameworkSkill = /react|vue|angular|node|django|flask|fastapi|spring|flutter|next\.?js/i.test(skillName) ||
                             canon?.category === 'Frameworks & Libraries';
    const isBiSkill = /power bi|tableau|excel|looker|analytics|dax|metabase/i.test(skillName) ||
                      canon?.category === 'BI & Analytics';

    for (const group of existingGroups) {
      const gLabel = group.label.toLowerCase();
      if (isDataSkill && /(database|data engineering|etl|pipeline|قواعد|بيانات|مستودع)/i.test(gLabel)) {
        return { targetGroupId: group.id, targetGroupLabel: group.label, isNewGroup: false };
      }
      if (isCloudSkill && /(cloud|devops|infrastructure|docker|tools|سحاب|تشغيل|أدوات)/i.test(gLabel)) {
        return { targetGroupId: group.id, targetGroupLabel: group.label, isNewGroup: false };
      }
      if (isLangSkill && /(language|programming|code|لغات|برمج)/i.test(gLabel)) {
        return { targetGroupId: group.id, targetGroupLabel: group.label, isNewGroup: false };
      }
      if (isFrameworkSkill && /(framework|library|web|frontend|أطر|مكتب)/i.test(gLabel)) {
        return { targetGroupId: group.id, targetGroupLabel: group.label, isNewGroup: false };
      }
      if (isBiSkill && /(bi|analytic|report|visualization|تحليل|ذكاء)/i.test(gLabel)) {
        return { targetGroupId: group.id, targetGroupLabel: group.label, isNewGroup: false };
      }
    }

    // 2. Check if an existing group contains closely related skills with domain protection
    for (const group of existingGroups) {
      const gLabel = group.label.toLowerCase();
      // Guard: never place infrastructure/cloud or BI tools into "Programming Languages"
      if (!isLangSkill && /(language|programming|لغات|برمج)/i.test(gLabel)) {
        continue;
      }
      // Guard: never place non-database tools into "Databases"
      if (!isDataSkill && /(database|قواعد\s*البيانات)/i.test(gLabel)) {
        continue;
      }
      // Guard: never place programming languages into "Cloud & DevOps" unless user chooses
      if (isLangSkill && !isCloudSkill && /(cloud|devops|سحاب|تشغيل)/i.test(gLabel)) {
        continue;
      }

      const hasRelated = group.skills.some((s) => {
        const sCanon = canonicalizeSkill(s);
        return sCanon && canon && sCanon.category === canon.category;
      });
      if (hasRelated) {
        return { targetGroupId: group.id, targetGroupLabel: group.label, isNewGroup: false };
      }
    }

    // 3. If there is only one general group (e.g. "Technical Skills"), use it
    if (existingGroups.length === 1 && /(technical|skills|general|المهارات التقنية|مهارات)/i.test(existingGroups[0].label)) {
      return { targetGroupId: existingGroups[0].id, targetGroupLabel: existingGroups[0].label, isNewGroup: false };
    }
  }

  // 4. Otherwise, propose creating a new specific, professional category
  const newId = `group-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  return {
    targetGroupId: newId,
    targetGroupLabel: defaultLabel,
    isNewGroup: true
  };
}

/**
 * Adds multiple skills smartly into the CV's SkillGroup array.
 * Places each skill into its appropriate category, avoiding duplicates.
 */
export function addSkillsSmartly(
  existingGroups: SkillGroup[] = [],
  skillsToAdd: string[],
  isAr = false
): SkillGroup[] {
  let result: SkillGroup[] = existingGroups.map((g) => ({
    ...g,
    skills: [...g.skills]
  }));

  if (result.length === 0) {
    result = [{
      id: `group-tech-${Date.now()}`,
      label: isAr ? 'المهارات التقنية' : 'Technical Skills',
      skills: []
    }];
  }

  for (const rawSkill of skillsToAdd) {
    const canonicalName = normalizeSkillName(rawSkill);
    if (!canonicalName) continue;

    // Check if skill already exists in any group (via equivalence)
    const alreadyExists = result.some((g) =>
      g.skills.some((s) => areSkillsEquivalent(s, canonicalName))
    );
    if (alreadyExists) continue;

    const { targetGroupId, targetGroupLabel, isNewGroup } = getSmartSkillCategory(canonicalName, result, isAr);

    if (isNewGroup) {
      result.push({
        id: targetGroupId,
        label: targetGroupLabel,
        skills: [canonicalName]
      });
    } else {
      const idx = result.findIndex((g) => g.id === targetGroupId);
      if (idx !== -1) {
        result[idx].skills.push(canonicalName);
      } else {
        result[0].skills.push(canonicalName);
      }
    }
  }

  return result;
}

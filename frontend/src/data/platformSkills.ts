export interface PlatformSkill {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
}

export const PLATFORM_SKILLS: PlatformSkill[] = [
  // ──────────────────────────────────────────────
  // 1. Web & Frontend Development
  // ──────────────────────────────────────────────
  { id: 'react', name: 'React.js', nameAr: 'رياكت (React.js)', category: 'Frontend', categoryAr: 'تطوير الواجهات' },
  { id: 'nextjs', name: 'Next.js', nameAr: 'نكست (Next.js)', category: 'Frontend', categoryAr: 'تطوير الواجهات' },
  { id: 'typescript', name: 'TypeScript', nameAr: 'تايب سكريبت', category: 'Frontend', categoryAr: 'تطوير الواجهات' },
  { id: 'javascript', name: 'JavaScript', nameAr: 'جافا سكريبت', category: 'Frontend', categoryAr: 'تطوير الواجهات' },
  { id: 'tailwind', name: 'Tailwind CSS', nameAr: 'تيلويند (Tailwind CSS)', category: 'Frontend', categoryAr: 'تطوير الواجهات' },
  { id: 'vue', name: 'Vue.js', nameAr: 'فيو جي إس (Vue.js)', category: 'Frontend', categoryAr: 'تطوير الواجهات' },
  { id: 'angular', name: 'Angular', nameAr: 'أنجولار (Angular)', category: 'Frontend', categoryAr: 'تطوير الواجهات' },
  { id: 'html-css', name: 'HTML5 & CSS3', nameAr: 'أساسيات الويب HTML & CSS', category: 'Frontend', categoryAr: 'تطوير الواجهات' },

  // ──────────────────────────────────────────────
  // 2. Backend & Programming
  // ──────────────────────────────────────────────
  { id: 'python', name: 'Python', nameAr: 'بايثون (Python)', category: 'Backend', categoryAr: 'تطوير الخوادم' },
  { id: 'nodejs', name: 'Node.js', nameAr: 'نود جي إس (Node.js)', category: 'Backend', categoryAr: 'تطوير الخوادم' },
  { id: 'fastapi', name: 'FastAPI', nameAr: 'فاست إي بي آي (FastAPI)', category: 'Backend', categoryAr: 'تطوير الخوادم' },
  { id: 'django', name: 'Django', nameAr: 'دجانجو (Django)', category: 'Backend', categoryAr: 'تطوير الخوادم' },
  { id: 'java', name: 'Java', nameAr: 'لغة جافا (Java)', category: 'Backend', categoryAr: 'تطوير الخوادم' },
  { id: 'spring-boot', name: 'Spring Boot', nameAr: 'سبرينج بوت (Spring Boot)', category: 'Backend', categoryAr: 'تطوير الخوادم' },
  { id: 'golang', name: 'Go (Golang)', nameAr: 'جو (Golang)', category: 'Backend', categoryAr: 'تطوير الخوادم' },
  { id: 'csharp-dotnet', name: 'C# / .NET', nameAr: 'سي شارب و .NET', category: 'Backend', categoryAr: 'تطوير الخوادم' },
  { id: 'php-laravel', name: 'PHP & Laravel', nameAr: 'بي إتش بي و لارافيل', category: 'Backend', categoryAr: 'تطوير الخوادم' },
  { id: 'rest-api', name: 'RESTful APIs', nameAr: 'تصميم واجهات البرمجة REST APIs', category: 'Backend', categoryAr: 'تطوير الخوادم' },
  { id: 'graphql', name: 'GraphQL', nameAr: 'جراف كيو إل (GraphQL)', category: 'Backend', categoryAr: 'تطوير الخوادم' },

  // ──────────────────────────────────────────────
  // 3. Databases & Caching
  // ──────────────────────────────────────────────
  { id: 'sql', name: 'SQL', nameAr: 'قواعد بيانات SQL', category: 'Database', categoryAr: 'قواعد البيانات' },
  { id: 'postgresql', name: 'PostgreSQL', nameAr: 'بوستجريس (PostgreSQL)', category: 'Database', categoryAr: 'قواعد البيانات' },
  { id: 'mysql', name: 'MySQL', nameAr: 'ماي إس كيو إل (MySQL)', category: 'Database', categoryAr: 'قواعد البيانات' },
  { id: 'mongodb', name: 'MongoDB', nameAr: 'مونجو دي بي (MongoDB)', category: 'Database', categoryAr: 'قواعد البيانات' },
  { id: 'redis', name: 'Redis', nameAr: 'ريديس (Redis Cache)', category: 'Database', categoryAr: 'قواعد البيانات' },

  // ──────────────────────────────────────────────
  // 4. Data Engineering & Big Data
  // ──────────────────────────────────────────────
  { id: 'etl', name: 'ETL Pipelines', nameAr: 'أنابيب معالجة البيانات ETL', category: 'Data Engineering', categoryAr: 'هندسة البيانات' },
  { id: 'airflow', name: 'Apache Airflow', nameAr: 'أباتشي إيرفلو (Airflow)', category: 'Data Engineering', categoryAr: 'هندسة البيانات' },
  { id: 'spark', name: 'Apache Spark', nameAr: 'أباتشي سبارك (Big Data)', category: 'Data Engineering', categoryAr: 'هندسة البيانات' },
  { id: 'kafka', name: 'Apache Kafka', nameAr: 'أباتشي كافكا (Kafka Streams)', category: 'Data Engineering', categoryAr: 'هندسة البيانات' },
  { id: 'data-modeling', name: 'Data Modeling', nameAr: 'نمذجة وتصميم مستودعات البيانات', category: 'Data Engineering', categoryAr: 'هندسة البيانات' },
  { id: 'dbt', name: 'dbt (Data Build Tool)', nameAr: 'أداة dbt للتحويلات', category: 'Data Engineering', categoryAr: 'هندسة البيانات' },
  { id: 'snowflake', name: 'Snowflake', nameAr: 'سنوفليك (Snowflake Warehouse)', category: 'Data Engineering', categoryAr: 'هندسة البيانات' },
  { id: 'bigquery', name: 'Google BigQuery', nameAr: 'بيج كويري (Google BigQuery)', category: 'Data Engineering', categoryAr: 'هندسة البيانات' },

  // ──────────────────────────────────────────────
  // 5. AI, Machine Learning & Data Science
  // ──────────────────────────────────────────────
  { id: 'pandas-numpy', name: 'Pandas & NumPy', nameAr: 'تحليل البيانات (Pandas & NumPy)', category: 'AI & Data Science', categoryAr: 'الذكاء الاصطناعي وعلوم البيانات' },
  { id: 'machine-learning', name: 'Machine Learning', nameAr: 'تعلم الآلة (Machine Learning)', category: 'AI & Data Science', categoryAr: 'الذكاء الاصطناعي وعلوم البيانات' },
  { id: 'deep-learning', name: 'Deep Learning', nameAr: 'التعلم العميق (PyTorch / TensorFlow)', category: 'AI & Data Science', categoryAr: 'الذكاء الاصطناعي وعلوم البيانات' },
  { id: 'gen-ai-llm', name: 'Generative AI & LLMs', nameAr: 'الذكاء الاصطناعي التوليدي و LLMs', category: 'AI & Data Science', categoryAr: 'الذكاء الاصطناعي وعلوم البيانات' },
  { id: 'r-programming', name: 'R Programming', nameAr: 'لغة R للإحصاء وتحليل البيانات', category: 'AI & Data Science', categoryAr: 'الذكاء الاصطناعي وعلوم البيانات' },
  { id: 'statistics', name: 'Statistics & Math', nameAr: 'الإحصاء والاحتمالات للمطورين', category: 'AI & Data Science', categoryAr: 'الذكاء الاصطناعي وعلوم البيانات' },

  // ──────────────────────────────────────────────
  // 6. Business Intelligence & Analytics
  // ──────────────────────────────────────────────
  { id: 'powerbi', name: 'Power BI', nameAr: 'باور بي آي (Power BI & DAX)', category: 'BI & Analytics', categoryAr: 'ذكاء الأعمال والتحليلات' },
  { id: 'tableau', name: 'Tableau', nameAr: 'تابلوه (Tableau)', category: 'BI & Analytics', categoryAr: 'ذكاء الأعمال والتحليلات' },
  { id: 'excel', name: 'Advanced Excel', nameAr: 'إكسيل متقدم للتحليل والماكرو', category: 'BI & Analytics', categoryAr: 'ذكاء الأعمال والتحليلات' },

  // ──────────────────────────────────────────────
  // 7. Cloud, DevOps & Infrastructure
  // ──────────────────────────────────────────────
  { id: 'docker', name: 'Docker', nameAr: 'حاويات دوكر (Docker)', category: 'Cloud & DevOps', categoryAr: 'السحابة والتشغيل' },
  { id: 'kubernetes', name: 'Kubernetes', nameAr: 'كوبرنيتس (K8s Orchestration)', category: 'Cloud & DevOps', categoryAr: 'السحابة والتشغيل' },
  { id: 'aws', name: 'AWS Cloud', nameAr: 'الحوسبة السحابية AWS', category: 'Cloud & DevOps', categoryAr: 'السحابة والتشغيل' },
  { id: 'azure', name: 'Microsoft Azure', nameAr: 'مايكروسوفت آزور (Azure)', category: 'Cloud & DevOps', categoryAr: 'السحابة والتشغيل' },
  { id: 'git', name: 'Git & GitHub', nameAr: 'إدارة الإصدارات Git & GitHub', category: 'Cloud & DevOps', categoryAr: 'السحابة والتشغيل' },
  { id: 'ci-cd', name: 'CI/CD Pipelines', nameAr: 'أتمتة النشر المستمر CI/CD', category: 'Cloud & DevOps', categoryAr: 'السحابة والتشغيل' },
  { id: 'linux', name: 'Linux & Bash', nameAr: 'أنظمة لينكس وبرمجة Bash', category: 'Cloud & DevOps', categoryAr: 'السحابة والتشغيل' },
  { id: 'terraform', name: 'Terraform', nameAr: 'تيرافورم (Infrastructure as Code)', category: 'Cloud & DevOps', categoryAr: 'السحابة والتشغيل' },

  // ──────────────────────────────────────────────
  // 8. Mobile App Development
  // ──────────────────────────────────────────────
  { id: 'flutter', name: 'Flutter & Dart', nameAr: 'فلاتر (Flutter & Dart)', category: 'Mobile', categoryAr: 'تطبيقات الموبايل' },
  { id: 'react-native', name: 'React Native', nameAr: 'رياكت نيتف (React Native)', category: 'Mobile', categoryAr: 'تطبيقات الموبايل' },
  { id: 'ios-swift', name: 'iOS & Swift', nameAr: 'تطوير تطبيقات iOS (Swift)', category: 'Mobile', categoryAr: 'تطبيقات الموبايل' },
  { id: 'android-kotlin', name: 'Android & Kotlin', nameAr: 'تطوير تطبيقات أندرويد (Kotlin)', category: 'Mobile', categoryAr: 'تطبيقات الموبايل' },

  // ──────────────────────────────────────────────
  // 9. Cybersecurity & Testing
  // ──────────────────────────────────────────────
  { id: 'cybersecurity', name: 'Cybersecurity Fundamentals', nameAr: 'أساسيات الأمن السيبراني والشبكات', category: 'Cybersecurity & QA', categoryAr: 'الأمن والجودة' },
  { id: 'qa-testing', name: 'Software Testing & QA', nameAr: 'فحص البرمجيات وضمان الجودة (QA)', category: 'Cybersecurity & QA', categoryAr: 'الأمن والجودة' },

  // ──────────────────────────────────────────────
  // 10. Design & Product Management
  // ──────────────────────────────────────────────
  { id: 'ui-ux-design', name: 'UI/UX Design (Figma)', nameAr: 'تصميم الواجهات وتجربة المستخدم (Figma)', category: 'Design & Product', categoryAr: 'التصميم وإدارة المنتج' },
  { id: 'agile-scrum', name: 'Agile & Scrum (Jira)', nameAr: 'إدارة المشاريع المرنة Agile & Scrum', category: 'Design & Product', categoryAr: 'التصميم وإدارة المنتج' },
];

export function getSkillName(skillKey: string, isAr: boolean = false): string {
  const cleanKey = (skillKey || '').toLowerCase().trim();
  const skill = PLATFORM_SKILLS.find((s) => s.id === cleanKey);
  if (skill) {
    return isAr ? skill.nameAr : skill.name;
  }
  // Fallback to formatted key
  return skillKey ? skillKey.toUpperCase() : 'General';
}

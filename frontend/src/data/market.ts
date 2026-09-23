export type SkillBar = {
  name: string;
  value: number; // Percentage of postings requiring it
  icon: string;
  category?: 'language' | 'framework' | 'cloud' | 'database' | 'tool' | 'concept';
  categoryLabel?: string;
  categoryLabelAr?: string;
  trend?: string; // e.g. '+24%'
  isHot?: boolean;
  jobCount?: number; // e.g. 1250
};

export type CareerTrack = {
  id: string;
  label: string;
  labelAr: string;
  description: string;
  descriptionAr: string;
  jobs: number;
  companies: number;
  remote: number;
  topSkill: { name: string; share: number };
  skills: SkillBar[];
  trendingHighlights: {
    primary: { name: string; badge: string; color: string };
    secondary: { name: string; badge: string; color: string };
    average: { name: string; badge: string; color: string };
  };
  insights: {
    ar: { roleGrowth: string; topCompanies: string; salaryTrend: string };
    en: { roleGrowth: string; topCompanies: string; salaryTrend: string };
  };
};

export const careerTracks: CareerTrack[] = [
  {
    id: 'all',
    label: 'All Tech Specializations',
    labelAr: 'كافة التخصصات التقنية',
    description: 'Overview across all software, data, cloud, and engineering roles in Egypt',
    descriptionAr: 'نظرة شاملة لكافة وظائف البرمجيات، البيانات، الحوسبة السحابية والهندسة التقنية',
    jobs: 14850,
    companies: 1420,
    remote: 41.5,
    topSkill: { name: 'SQL', share: 78 },
    skills: [
      { name: 'SQL', value: 78, icon: 'https://cdn.simpleicons.org/postgresql', category: 'database', categoryLabel: 'Database', categoryLabelAr: 'قواعد بيانات', trend: '+14%', isHot: false, jobCount: 3840 },
      { name: 'Python', value: 74, icon: 'https://cdn.simpleicons.org/python', category: 'language', categoryLabel: 'Language', categoryLabelAr: 'لغة برمجة', trend: '+28%', isHot: true, jobCount: 3560 },
      { name: 'JavaScript', value: 68, icon: 'https://cdn.simpleicons.org/javascript', category: 'language', categoryLabel: 'Language', categoryLabelAr: 'لغة برمجة', trend: '+11%', isHot: false, jobCount: 3290 },
      { name: 'React', value: 62, icon: 'https://cdn.simpleicons.org/react', category: 'framework', categoryLabel: 'Frontend', categoryLabelAr: 'إطار عمل', trend: '+22%', isHot: true, jobCount: 2980 },
      { name: 'TypeScript', value: 58, icon: 'https://cdn.simpleicons.org/typescript', category: 'language', categoryLabel: 'Language', categoryLabelAr: 'لغة برمجة', trend: '+35%', isHot: true, jobCount: 2740 },
      { name: 'Docker', value: 54, icon: 'https://cdn.simpleicons.org/docker', category: 'cloud', categoryLabel: 'DevOps', categoryLabelAr: 'أداة سحابية', trend: '+26%', isHot: true, jobCount: 2510 },
      { name: 'Git', value: 51, icon: 'https://cdn.simpleicons.org/git', category: 'tool', categoryLabel: 'Version Control', categoryLabelAr: 'أداة عمل', trend: '+9%', isHot: false, jobCount: 2420 },
      { name: 'AWS', value: 46, icon: 'https://cdn.simpleicons.org/amazonwebservices', category: 'cloud', categoryLabel: 'Cloud Platform', categoryLabelAr: 'سحابة', trend: '+19%', isHot: false, jobCount: 2190 },
      { name: 'Node.js', value: 42, icon: 'https://cdn.simpleicons.org/nodedotjs', category: 'framework', categoryLabel: 'Backend', categoryLabelAr: 'بيئة تشغيل', trend: '+17%', isHot: false, jobCount: 2010 },
      { name: 'Power BI', value: 39, icon: 'https://cdn.simpleicons.org/powerbi', category: 'tool', categoryLabel: 'BI & Analytics', categoryLabelAr: 'ذكاء أعمال', trend: '+21%', isHot: false, jobCount: 1850 },
    ],
    trendingHighlights: {
      primary: { name: 'Generative AI & LLMs', badge: '+48%', color: '#12B76A' },
      secondary: { name: 'TypeScript', badge: '+35%', color: '#1B57E0' },
      average: { name: 'Market Average', badge: '+12%', color: '#94A3B8' },
    },
    insights: {
      ar: {
        roleGrowth: 'شهد سوق التكنولوجيا المصري نمواً بنسبة 21% في إعلانات الوظائف هذا الربع',
        topCompanies: 'فودافون مصر، مايكروسوفت، فاليو وفوري هي الأكثر طلباً للمواهب التقنية',
        salaryTrend: 'متوسط رواتب الكوادر التقنية المرتبطة بالعمل الهجين والدولي ارتفعت بنسبة 26%',
      },
      en: {
        roleGrowth: 'Tech hiring in Egypt saw a 21% growth in job postings this quarter',
        topCompanies: 'Vodafone Egypt, Microsoft, valU and Fawry lead technical hiring volume',
        salaryTrend: 'Compensation for hybrid and remote international roles grew by 26%',
      },
    },
  },
  {
    id: 'frontend',
    label: 'Frontend Development',
    labelAr: 'تطوير الواجهات الأمامية',
    description: 'Web applications, SPAs, responsive design, and modern UI engineering',
    descriptionAr: 'تطبيقات الويب التفاعلية، التصميم المتجاوب، وبناء تجارب المستخدم الحديثة',
    jobs: 3820,
    companies: 480,
    remote: 52.0,
    topSkill: { name: 'React', share: 86 },
    skills: [
      { name: 'React', value: 86, icon: 'https://cdn.simpleicons.org/react', category: 'framework', categoryLabel: 'Core Library', categoryLabelAr: 'مكتبة أساسية', trend: '+24%', isHot: true, jobCount: 3280 },
      { name: 'TypeScript', value: 81, icon: 'https://cdn.simpleicons.org/typescript', category: 'language', categoryLabel: 'Typed JS', categoryLabelAr: 'لغة برمجة', trend: '+38%', isHot: true, jobCount: 3090 },
      { name: 'Next.js', value: 74, icon: 'https://cdn.simpleicons.org/nextdotjs', category: 'framework', categoryLabel: 'SSR / Fullstack', categoryLabelAr: 'إطار عمل', trend: '+42%', isHot: true, jobCount: 2820 },
      { name: 'Tailwind CSS', value: 69, icon: 'https://cdn.simpleicons.org/tailwindcss', category: 'tool', categoryLabel: 'Styling Engine', categoryLabelAr: 'مكتبة تنسيق', trend: '+31%', isHot: true, jobCount: 2630 },
      { name: 'JavaScript', value: 65, icon: 'https://cdn.simpleicons.org/javascript', category: 'language', categoryLabel: 'Core Language', categoryLabelAr: 'لغة أساسية', trend: '+8%', isHot: false, jobCount: 2480 },
      { name: 'Redux / Zustand', value: 52, icon: 'https://cdn.simpleicons.org/redux', category: 'tool', categoryLabel: 'State Management', categoryLabelAr: 'إدارة الحالة', trend: '+15%', isHot: false, jobCount: 1980 },
      { name: 'HTML5 & CSS3', value: 48, icon: 'https://cdn.simpleicons.org/html5', category: 'language', categoryLabel: 'Markup & Style', categoryLabelAr: 'بنية وتنسيق', trend: '+5%', isHot: false, jobCount: 1830 },
      { name: 'Git & GitHub', value: 44, icon: 'https://cdn.simpleicons.org/github', category: 'tool', categoryLabel: 'Version Control', categoryLabelAr: 'إدارة النسخ', trend: '+12%', isHot: false, jobCount: 1680 },
      { name: 'REST / GraphQL', value: 38, icon: 'https://cdn.simpleicons.org/graphql', category: 'concept', categoryLabel: 'API Integration', categoryLabelAr: 'ربط واجهات', trend: '+19%', isHot: false, jobCount: 1450 },
      { name: 'Figma', value: 34, icon: 'https://cdn.simpleicons.org/figma', category: 'tool', categoryLabel: 'Design Handoff', categoryLabelAr: 'تصميم UI/UX', trend: '+22%', isHot: false, jobCount: 1300 },
    ],
    trendingHighlights: {
      primary: { name: 'Next.js & App Router', badge: '+42%', color: '#12B76A' },
      secondary: { name: 'TypeScript', badge: '+38%', color: '#1B57E0' },
      average: { name: 'Frontend Average', badge: '+18%', color: '#94A3B8' },
    },
    insights: {
      ar: {
        roleGrowth: 'وظائف مطوري Next.js و React هي الأكثر استقطاباً لفرص العمل عن بُعد مع شركات الخليج',
        topCompanies: 'باي موب، إنستابج، تريلا، و روبستا توظف أعلى عدد من مطوري الواجهات',
        salaryTrend: 'إتقان TypeScript مع Next.js يرفع فرص الترشح والمقابلات بنسبة 35%',
      },
      en: {
        roleGrowth: 'Next.js & React engineers are the most sought-after for GCC remote roles',
        topCompanies: 'Paymob, Instabug, Trella, and Robusta lead frontend hiring in Cairo',
        salaryTrend: 'Mastering TypeScript with Next.js boosts interview callbacks by 35%',
      },
    },
  },
  {
    id: 'backend',
    label: 'Backend & APIs',
    labelAr: 'الواجهات الخلفية وقواعد البيانات',
    description: 'Server architecture, microservices, databases, and high-concurrency APIs',
    descriptionAr: 'معمارية السيرفرات، المايكروسيرفسز، قواعد البيانات، والواجهات البرمجية عالية الكفاءة',
    jobs: 4190,
    companies: 520,
    remote: 46.0,
    topSkill: { name: 'Node.js', share: 82 },
    skills: [
      { name: 'Node.js', value: 82, icon: 'https://cdn.simpleicons.org/nodedotjs', category: 'framework', categoryLabel: 'Runtime', categoryLabelAr: 'بيئة تشغيل', trend: '+22%', isHot: true, jobCount: 3430 },
      { name: 'PostgreSQL', value: 76, icon: 'https://cdn.simpleicons.org/postgresql', category: 'database', categoryLabel: 'Relational DB', categoryLabelAr: 'قواعد بيانات', trend: '+34%', isHot: true, jobCount: 3180 },
      { name: 'Python (FastAPI/Django)', value: 71, icon: 'https://cdn.simpleicons.org/python', category: 'language', categoryLabel: 'Backend Lang', categoryLabelAr: 'لغة برمجة', trend: '+29%', isHot: true, jobCount: 2970 },
      { name: 'Docker', value: 66, icon: 'https://cdn.simpleicons.org/docker', category: 'cloud', categoryLabel: 'Containers', categoryLabelAr: 'حاويات', trend: '+31%', isHot: true, jobCount: 2760 },
      { name: 'Redis', value: 58, icon: 'https://cdn.simpleicons.org/redis', category: 'database', categoryLabel: 'In-Memory Cache', categoryLabelAr: 'كاش وسرعة', trend: '+27%', isHot: false, jobCount: 2430 },
      { name: 'Java / Spring Boot', value: 53, icon: 'https://cdn.simpleicons.org/springboot', category: 'framework', categoryLabel: 'Enterprise', categoryLabelAr: 'إطار عمل مؤسسي', trend: '+14%', isHot: false, jobCount: 2220 },
      { name: 'REST APIs & GraphQL', value: 49, icon: 'https://cdn.simpleicons.org/graphql', category: 'concept', categoryLabel: 'API Protocols', categoryLabelAr: 'بروتوكولات ربط', trend: '+18%', isHot: false, jobCount: 2050 },
      { name: 'MongoDB', value: 43, icon: 'https://cdn.simpleicons.org/mongodb', category: 'database', categoryLabel: 'NoSQL', categoryLabelAr: 'قواعد بيانات NoSQL', trend: '+11%', isHot: false, jobCount: 1800 },
      { name: 'Go (Golang)', value: 36, icon: 'https://cdn.simpleicons.org/go', category: 'language', categoryLabel: 'High-Concurrency', categoryLabelAr: 'لغة أداء عالي', trend: '+45%', isHot: true, jobCount: 1510 },
      { name: 'Apache Kafka', value: 31, icon: 'https://cdn.simpleicons.org/apachekafka', category: 'tool', categoryLabel: 'Event Streaming', categoryLabelAr: 'معالجة تدفقات', trend: '+38%', isHot: true, jobCount: 1300 },
    ],
    trendingHighlights: {
      primary: { name: 'Go (Golang) Microservices', badge: '+45%', color: '#12B76A' },
      secondary: { name: 'PostgreSQL & pgvector', badge: '+34%', color: '#1B57E0' },
      average: { name: 'Backend Average', badge: '+16%', color: '#94A3B8' },
    },
    insights: {
      ar: {
        roleGrowth: 'لغة Go وقواعد بيانات PostgreSQL تشهد أسرع نمو في وظائف التكنولوجيا المالية (Fintech)',
        topCompanies: 'فوري، الأهلي ممكن، كريم وفودافون للحلول الذكية تتصدر طلب الواجهات الخلفية',
        salaryTrend: 'معرفة معمارية الـ Microservices و Kafka تضيف علاوة تتجاوز 30% على متوسط الراتب',
      },
      en: {
        roleGrowth: 'Go and PostgreSQL are growing fastest in Egyptian Fintech ecosystems',
        topCompanies: 'Fawry, MNT-Halan, Careem, and Vodafone Intelligent Solutions lead hiring',
        salaryTrend: 'Hands-on Microservices & Kafka experience commands a 30%+ compensation premium',
      },
    },
  },
  {
    id: 'data-ai',
    label: 'Data Science, BI & AI',
    labelAr: 'البيانات، ذكاء الأعمال والذكاء الاصطناعي',
    description: 'Data pipelines, business intelligence, analytics, machine learning and LLMs',
    descriptionAr: 'هندسة خطوط البيانات، التقارير الذكية، التحليلات المتقدمة ونماذج الذكاء الاصطناعي',
    jobs: 3240,
    companies: 390,
    remote: 44.0,
    topSkill: { name: 'Python', share: 88 },
    skills: [
      { name: 'Python', value: 88, icon: 'https://cdn.simpleicons.org/python', category: 'language', categoryLabel: 'Data Science Core', categoryLabelAr: 'لغة بيانات أساسية', trend: '+34%', isHot: true, jobCount: 2850 },
      { name: 'SQL', value: 85, icon: 'https://cdn.simpleicons.org/postgresql', category: 'database', categoryLabel: 'Querying & Warehousing', categoryLabelAr: 'استعلام وتخزين', trend: '+20%', isHot: true, jobCount: 2750 },
      { name: 'Power BI', value: 72, icon: 'https://cdn.simpleicons.org/powerbi', category: 'tool', categoryLabel: 'BI Dashboards', categoryLabelAr: 'ذكاء أعمال', trend: '+28%', isHot: true, jobCount: 2330 },
      { name: 'Pandas & NumPy', value: 67, icon: 'https://cdn.simpleicons.org/pandas', category: 'tool', categoryLabel: 'Data Manipulation', categoryLabelAr: 'معالجة بيانات', trend: '+19%', isHot: false, jobCount: 2170 },
      { name: 'Generative AI & LLMs', value: 61, icon: 'https://cdn.simpleicons.org/openai', category: 'concept', categoryLabel: 'GenAI & LangChain', categoryLabelAr: 'ذكاء اصطناعي توليدي', trend: '+54%', isHot: true, jobCount: 1980 },
      { name: 'Tableau', value: 48, icon: 'https://cdn.simpleicons.org/tableau', category: 'tool', categoryLabel: 'Visualization', categoryLabelAr: 'تصور البيانات', trend: '+12%', isHot: false, jobCount: 1550 },
      { name: 'Apache Spark / Databricks', value: 42, icon: 'https://cdn.simpleicons.org/apachespark', category: 'tool', categoryLabel: 'Big Data Processing', categoryLabelAr: 'معالجة بيانات ضخمة', trend: '+36%', isHot: true, jobCount: 1360 },
      { name: 'dbt & Airflow', value: 38, icon: 'https://cdn.simpleicons.org/apacheairflow', category: 'tool', categoryLabel: 'Data Orchestration', categoryLabelAr: 'تنظيم خطوط البيانات', trend: '+40%', isHot: true, jobCount: 1230 },
      { name: 'Machine Learning (Scikit)', value: 35, icon: 'https://cdn.simpleicons.org/scikitlearn', category: 'framework', categoryLabel: 'Predictive Models', categoryLabelAr: 'نماذج تنبؤية', trend: '+21%', isHot: false, jobCount: 1130 },
      { name: 'Snowflake / BigQuery', value: 31, icon: 'https://cdn.simpleicons.org/googlebigquery', category: 'cloud', categoryLabel: 'Cloud Data Warehouse', categoryLabelAr: 'مستودعات سحابية', trend: '+33%', isHot: false, jobCount: 1000 },
    ],
    trendingHighlights: {
      primary: { name: 'Generative AI & LLMs', badge: '+54%', color: '#12B76A' },
      secondary: { name: 'dbt & Modern Data Stack', badge: '+40%', color: '#1B57E0' },
      average: { name: 'Data Field Average', badge: '+22%', color: '#94A3B8' },
    },
    insights: {
      ar: {
        roleGrowth: 'الطلب على مهارات الذكاء الاصطناعي التوليدي و LangChain تضاعف خلال الـ 6 أشهر الماضية',
        topCompanies: 'إنستابيس، أمازون مصر، بنك مصر والبنك التجاري الدولي تقود التوظيف التحليلي',
        salaryTrend: 'وظائف مهندسي البيانات (Data Engineers) تسجل أعلى معدل نمو سنوي للرواتب في قطاع البيانات',
      },
      en: {
        roleGrowth: 'GenAI & LangChain demand doubled across Egyptian product companies in the past 6 months',
        topCompanies: 'Instabase, Amazon Egypt, Banque Misr and CIB lead data & analytics hiring',
        salaryTrend: 'Data Engineering roles record the fastest salary escalation in the analytics domain',
      },
    },
  },
  {
    id: 'devops',
    label: 'Cloud, DevOps & SRE',
    labelAr: 'الحوسبة السحابية والديف أوبس',
    description: 'Infrastructure as code, CI/CD pipelines, Kubernetes clusters, and cloud reliability',
    descriptionAr: 'البنية التحتية كأكواد، خطوط النشر المؤتمتة، إدارة الحاويات وموثوقية السيرفرات السحابية',
    jobs: 2150,
    companies: 310,
    remote: 58.0,
    topSkill: { name: 'Docker', share: 89 },
    skills: [
      { name: 'Docker', value: 89, icon: 'https://cdn.simpleicons.org/docker', category: 'cloud', categoryLabel: 'Containers', categoryLabelAr: 'حاويات برمجية', trend: '+32%', isHot: true, jobCount: 1910 },
      { name: 'Kubernetes', value: 81, icon: 'https://cdn.simpleicons.org/kubernetes', category: 'cloud', categoryLabel: 'Container Orchestration', categoryLabelAr: 'إدارة وتوسيع الحاويات', trend: '+41%', isHot: true, jobCount: 1740 },
      { name: 'AWS Cloud', value: 76, icon: 'https://cdn.simpleicons.org/amazonwebservices', category: 'cloud', categoryLabel: 'Cloud Platform', categoryLabelAr: 'منصة سحابية', trend: '+26%', isHot: true, jobCount: 1630 },
      { name: 'CI/CD (GitHub Actions/GitLab)', value: 72, icon: 'https://cdn.simpleicons.org/githubactions', category: 'tool', categoryLabel: 'Automation Pipelines', categoryLabelAr: 'نشر مؤتمت', trend: '+29%', isHot: true, jobCount: 1550 },
      { name: 'Linux / Shell Scripting', value: 68, icon: 'https://cdn.simpleicons.org/linux', category: 'tool', categoryLabel: 'OS & Scripting', categoryLabelAr: 'أنظمة وأوامر', trend: '+14%', isHot: false, jobCount: 1460 },
      { name: 'Terraform', value: 59, icon: 'https://cdn.simpleicons.org/terraform', category: 'cloud', categoryLabel: 'Infrastructure as Code', categoryLabelAr: 'بنية تحتية ككود', trend: '+37%', isHot: true, jobCount: 1270 },
      { name: 'Microsoft Azure', value: 48, icon: 'https://cdn.simpleicons.org/microsoftazure', category: 'cloud', categoryLabel: 'Enterprise Cloud', categoryLabelAr: 'سحابة مايكروسوفت', trend: '+20%', isHot: false, jobCount: 1030 },
      { name: 'Prometheus & Grafana', value: 43, icon: 'https://cdn.simpleicons.org/grafana', category: 'tool', categoryLabel: 'Monitoring & Metrics', categoryLabelAr: 'مراقبة ومقاييس', trend: '+28%', isHot: false, jobCount: 920 },
      { name: 'Git & GitOps (ArgoCD)', value: 37, icon: 'https://cdn.simpleicons.org/argocd', category: 'tool', categoryLabel: 'Declarative Ops', categoryLabelAr: 'عمليات تصريحية', trend: '+35%', isHot: false, jobCount: 800 },
      { name: 'Ansible', value: 29, icon: 'https://cdn.simpleicons.org/ansible', category: 'tool', categoryLabel: 'Configuration Mgmt', categoryLabelAr: 'إدارة التهيئات', trend: '+12%', isHot: false, jobCount: 620 },
    ],
    trendingHighlights: {
      primary: { name: 'Kubernetes & Helm', badge: '+41%', color: '#12B76A' },
      secondary: { name: 'Terraform (IaC)', badge: '+37%', color: '#1B57E0' },
      average: { name: 'DevOps Average', badge: '+25%', color: '#94A3B8' },
    },
    insights: {
      ar: {
        roleGrowth: 'وظائف الديف أوبس والحوسبة السحابية تسجل أعلى نسبة عمل عن بُعد بالكامل في مصر (58%)',
        topCompanies: 'سويفل، أورانج لخدمات الأعمال، إكسباند كارت ومايكروسوفت تقود طلب مهندسي السحابة',
        salaryTrend: 'شهادات AWS Solutions Architect و CKA لكوبيرنتس تزيد معدل التوظيف الفوري بنسبة 40%',
      },
      en: {
        roleGrowth: 'Cloud & DevOps roles record Egypt\'s highest fully-remote ratio at 58%',
        topCompanies: 'Swvl, Orange Business Services, ExpandCart, and Microsoft lead cloud hiring',
        salaryTrend: 'AWS Solutions Architect & CKA certifications accelerate hiring decisions by 40%',
      },
    },
  },
  {
    id: 'mobile',
    label: 'Mobile App Development',
    labelAr: 'تطبيقات الهاتف (Mobile)',
    description: 'Cross-platform mobile apps with Flutter & React Native, plus native iOS and Android',
    descriptionAr: 'تطوير تطبيقات الهواتف الذكية متعددة المنصات وفلاتر، وتطبيقات iOS وأندرويد الأصلية',
    jobs: 2640,
    companies: 340,
    remote: 49.0,
    topSkill: { name: 'Flutter', share: 84 },
    skills: [
      { name: 'Flutter', value: 84, icon: 'https://cdn.simpleicons.org/flutter', category: 'framework', categoryLabel: 'Cross-Platform', categoryLabelAr: 'إطار متعدد المنصات', trend: '+36%', isHot: true, jobCount: 2220 },
      { name: 'Dart', value: 80, icon: 'https://cdn.simpleicons.org/dart', category: 'language', categoryLabel: 'Core Language', categoryLabelAr: 'لغة برمجة أساسية', trend: '+34%', isHot: true, jobCount: 2110 },
      { name: 'React Native', value: 64, icon: 'https://cdn.simpleicons.org/react', category: 'framework', categoryLabel: 'JS Mobile', categoryLabelAr: 'تطوير بالموبايل JS', trend: '+21%', isHot: true, jobCount: 1690 },
      { name: 'RESTful APIs', value: 61, icon: 'https://cdn.simpleicons.org/postman', category: 'concept', categoryLabel: 'Networking', categoryLabelAr: 'ربط السيرفر والـ API', trend: '+15%', isHot: false, jobCount: 1610 },
      { name: 'Firebase', value: 57, icon: 'https://cdn.simpleicons.org/firebase', category: 'cloud', categoryLabel: 'BaaS & Push', categoryLabelAr: 'خدمات سحابية وإشعارات', trend: '+18%', isHot: false, jobCount: 1500 },
      { name: 'State Management (Bloc/Provider)', value: 52, icon: 'https://cdn.simpleicons.org/flutter', category: 'concept', categoryLabel: 'Architecture', categoryLabelAr: 'إدارة الحالة والمعمارية', trend: '+26%', isHot: true, jobCount: 1370 },
      { name: 'Kotlin (Native Android)', value: 45, icon: 'https://cdn.simpleicons.org/kotlin', category: 'language', categoryLabel: 'Android Native', categoryLabelAr: 'أندرويد أصلي', trend: '+16%', isHot: false, jobCount: 1190 },
      { name: 'Swift (Native iOS)', value: 41, icon: 'https://cdn.simpleicons.org/swift', category: 'language', categoryLabel: 'iOS Native', categoryLabelAr: 'آبل أصلي', trend: '+19%', isHot: false, jobCount: 1080 },
      { name: 'Git & App Store / Play Store', value: 36, icon: 'https://cdn.simpleicons.org/googleplay', category: 'tool', categoryLabel: 'Publishing CI/CD', categoryLabelAr: 'نشر المتاجر', trend: '+14%', isHot: false, jobCount: 950 },
      { name: 'SQLite / Hive / Room', value: 31, icon: 'https://cdn.simpleicons.org/sqlite', category: 'database', categoryLabel: 'Local Offline Cache', categoryLabelAr: 'تخزين محلي بدون إنترنت', trend: '+11%', isHot: false, jobCount: 820 },
    ],
    trendingHighlights: {
      primary: { name: 'Flutter & Dart', badge: '+36%', color: '#12B76A' },
      secondary: { name: 'React Native with Expo', badge: '+24%', color: '#1B57E0' },
      average: { name: 'Mobile Average', badge: '+19%', color: '#94A3B8' },
    },
    insights: {
      ar: {
        roleGrowth: 'مصر أصبحت مركزاً إقليمياً رئيسياً لتطوير تطبيقات Flutter لشركات السعودية والإمارات',
        topCompanies: 'حالا، تريلا، طلبات مصر وفوكس الرقمية تتصدر توظيف مطوري تطبيقات الهواتف',
        salaryTrend: 'مطور Flutter المتقن لمعمارية Bloc والتخزين المحلي بدون إنترنت يحظى بأسرع وقت توظيف',
      },
      en: {
        roleGrowth: 'Egypt is now a key regional hub for Flutter talent serving GCC digital ventures',
        topCompanies: 'Halan, Trella, Talabat Egypt, and Vox Digital lead mobile developer recruitment',
        salaryTrend: 'Flutter devs proficient in Bloc architecture & offline-first caching get hired fastest',
      },
    },
  },
  {
    id: 'qa',
    label: 'QA & Software Testing',
    labelAr: 'اختبار وجودة البرمجيات (QA)',
    description: 'Manual and automated testing, Cypress, Selenium, performance, and API quality',
    descriptionAr: 'اختبار البرمجيات اليدوي والمؤتمت، أدوات السيلينيوم وسايبرس، وجودة الواجهات البرمجية والأداء',
    jobs: 1720,
    companies: 260,
    remote: 45.0,
    topSkill: { name: 'Automation Testing', share: 83 },
    skills: [
      { name: 'Selenium / Cypress', value: 83, icon: 'https://cdn.simpleicons.org/cypress', category: 'framework', categoryLabel: 'E2E Automation', categoryLabelAr: 'أتمتة شاملة', trend: '+35%', isHot: true, jobCount: 1430 },
      { name: 'Postman & API Testing', value: 79, icon: 'https://cdn.simpleicons.org/postman', category: 'tool', categoryLabel: 'API Validation', categoryLabelAr: 'فحص واجهات REST', trend: '+25%', isHot: true, jobCount: 1360 },
      { name: 'Python / Java for QA', value: 68, icon: 'https://cdn.simpleicons.org/python', category: 'language', categoryLabel: 'Scripting', categoryLabelAr: 'برمجة السكربتات', trend: '+20%', isHot: false, jobCount: 1170 },
      { name: 'Playwright', value: 59, icon: 'https://cdn.simpleicons.org/playwright', category: 'tool', categoryLabel: 'Next-Gen Testing', categoryLabelAr: 'أتمتة حديثة سريعة', trend: '+52%', isHot: true, jobCount: 1010 },
      { name: 'Jira & Agile Workflows', value: 55, icon: 'https://cdn.simpleicons.org/jira', category: 'tool', categoryLabel: 'Bug Tracking', categoryLabelAr: 'إدارة المهام والأخطاء', trend: '+10%', isHot: false, jobCount: 950 },
      { name: 'SQL for DB Testing', value: 51, icon: 'https://cdn.simpleicons.org/postgresql', category: 'database', categoryLabel: 'Data Validation', categoryLabelAr: 'تحقق من قواعد البيانات', trend: '+14%', isHot: false, jobCount: 880 },
      { name: 'Performance (JMeter)', value: 42, icon: 'https://cdn.simpleicons.org/apachejmeter', category: 'tool', categoryLabel: 'Load Testing', categoryLabelAr: 'فحص الحمل والأداء', trend: '+22%', isHot: false, jobCount: 720 },
      { name: 'Git & CI/CD Testing Integration', value: 38, icon: 'https://cdn.simpleicons.org/git', category: 'tool', categoryLabel: 'Continuous Testing', categoryLabelAr: 'اختبار مستمر مع النشر', trend: '+28%', isHot: false, jobCount: 650 },
    ],
    trendingHighlights: {
      primary: { name: 'Playwright Automation', badge: '+52%', color: '#12B76A' },
      secondary: { name: 'Cypress E2E Testing', badge: '+35%', color: '#1B57E0' },
      average: { name: 'QA Average', badge: '+17%', color: '#94A3B8' },
    },
    insights: {
      ar: {
        roleGrowth: 'أداة Playwright سجلت قفزة قياسية بنسبة 52% في متطلبات مهندسي الأتمتة (SDET)',
        topCompanies: 'فودافون للحلول الذكية، ريفيول، وفاليو توظف أكبر فرق لاختبار البرمجيات',
        salaryTrend: 'الانتقال من الفحص اليدوي (Manual) إلى الأتمتة (Automation/SDET) يضاعف الراتب بنسبة 60%',
      },
      en: {
        roleGrowth: 'Playwright jumped 52% in Egyptian SDET and automation engineer job postings',
        topCompanies: '_VOIS, Revel Systems, and valU employ the largest QA automation teams',
        salaryTrend: 'Transitioning from Manual QA to Automation (SDET) yields up to a 60% compensation leap',
      },
    },
  },
  {
    id: 'cybersecurity',
    label: 'Cybersecurity & InfoSec',
    labelAr: 'الأمن السيبراني وأمن المعلومات',
    description: 'Penetration testing, SOC analysis, cloud security, SIEM, and incident response',
    descriptionAr: 'اختبار الاختراق، مراكز مراقبة الأمان SOC، أمان الحوسبة السحابية والاستجابة للحوادث',
    jobs: 1420,
    companies: 190,
    remote: 32.0,
    topSkill: { name: 'Network Security', share: 85 },
    skills: [
      { name: 'Network Security & Firewalls', value: 85, icon: 'https://cdn.simpleicons.org/cisco', category: 'concept', categoryLabel: 'Perimeter Defense', categoryLabelAr: 'أمن الشبكات والجدران', trend: '+19%', isHot: false, jobCount: 1210 },
      { name: 'SOC & SIEM (Splunk/QRadar)', value: 81, icon: 'https://cdn.simpleicons.org/splunk', category: 'tool', categoryLabel: 'Threat Monitoring', categoryLabelAr: 'مراقبة وتحليل التهديدات', trend: '+38%', isHot: true, jobCount: 1150 },
      { name: 'Penetration Testing / Ethical Hacking', value: 74, icon: 'https://cdn.simpleicons.org/kalilinux', category: 'tool', categoryLabel: 'Offensive Security', categoryLabelAr: 'اختبار الاختراق الأخلاقي', trend: '+28%', isHot: true, jobCount: 1050 },
      { name: 'Linux Administration', value: 68, icon: 'https://cdn.simpleicons.org/linux', category: 'tool', categoryLabel: 'OS Hardening', categoryLabelAr: 'تأمين أنظمة لينكس', trend: '+15%', isHot: false, jobCount: 970 },
      { name: 'Python & Bash Scripting', value: 62, icon: 'https://cdn.simpleicons.org/python', category: 'language', categoryLabel: 'Automation Scripting', categoryLabelAr: 'أتمتة المهام الأمنية', trend: '+24%', isHot: false, jobCount: 880 },
      { name: 'Cloud Security (AWS/Azure)', value: 55, icon: 'https://cdn.simpleicons.org/amazonwebservices', category: 'cloud', categoryLabel: 'Cloud Governance', categoryLabelAr: 'أمان السحابة', trend: '+46%', isHot: true, jobCount: 780 },
      { name: 'Vulnerability Assessment', value: 48, icon: 'https://cdn.simpleicons.org/wireshark', category: 'concept', categoryLabel: 'Risk & Audit', categoryLabelAr: 'تقييم الثغرات والمخاطر', trend: '+18%', isHot: false, jobCount: 680 },
      { name: 'OWASP Top 10 & AppSec', value: 42, icon: 'https://cdn.simpleicons.org/owasp', category: 'concept', categoryLabel: 'Application Security', categoryLabelAr: 'أمان تطبيقات الويب', trend: '+31%', isHot: false, jobCount: 600 },
    ],
    trendingHighlights: {
      primary: { name: 'Cloud Security (AWS/Azure)', badge: '+46%', color: '#12B76A' },
      secondary: { name: 'SIEM & SOC Engineering', badge: '+38%', color: '#1B57E0' },
      average: { name: 'Cybersecurity Average', badge: '+24%', color: '#94A3B8' },
    },
    insights: {
      ar: {
        roleGrowth: 'القطاع المالي والبنوك في مصر يضخ استثمارات قياسية في تعيين محللي مراكز الأمان SOC',
        topCompanies: 'البنك التجاري الدولي (CIB)، بنك مصر، اتصالات مصر وكاسبرسكي مصر تتصدر التوظيف',
        salaryTrend: 'شهادات OSCP و CEH تمنح أصحابها أولوية قصوى ومعدلات قبول تتجاوز 80% في المقابلات',
      },
      en: {
        roleGrowth: 'Egyptian banking & fintech institutions are investing heavily in SOC analyst talent',
        topCompanies: 'CIB, Banque Misr, e& Egypt, and cybersecurity consultancies lead hiring',
        salaryTrend: 'Certifications like OSCP and CEH provide an 80%+ interview advancement rate',
      },
    },
  },
];

export type WorkModel = {
  id: string;
  label: string;
  labelAr: string;
  description: string;
  descriptionAr: string;
  scale: number;
  remoteAdj: number;
};

export const workModels: WorkModel[] = [
  {
    id: 'all',
    label: 'All Locations & Models',
    labelAr: 'كافة الأنماط والمحافظات',
    description: 'All work environments in Egypt and cross-border roles',
    descriptionAr: 'جميع أنماط العمل داخل مصر والوظائف العابرة للحدود',
    scale: 1,
    remoteAdj: 0,
  },
  {
    id: 'remote',
    label: 'Fully Remote',
    labelAr: 'عن بُعد بالكامل 🌐',
    description: '100% remote positions with zero commute',
    descriptionAr: 'وظائف بنظام العمل الكامل من المنزل أو أي مكان',
    scale: 0.42,
    remoteAdj: 58.5,
  },
  {
    id: 'hybrid',
    label: 'Hybrid Work',
    labelAr: 'نمط عمل هجين 🏢',
    description: 'Split between office and remote days',
    descriptionAr: 'أيام عمل محددة في المقر مع أيام عمل من المنزل',
    scale: 0.38,
    remoteAdj: 24.0,
  },
  {
    id: 'cairo-giza',
    label: 'Cairo & Giza Hubs',
    labelAr: 'القاهرة الكبرى والجيزة 📍',
    description: 'Tech hubs in New Cairo, Smart Village, Maadi & Giza',
    descriptionAr: 'التجمع الخامس، القرية الذكية، المعادي والدقي',
    scale: 0.72,
    remoteAdj: -8.0,
  },
  {
    id: 'alex-regions',
    label: 'Alexandria & Coastal',
    labelAr: 'الإسكندرية وباقي المحافظات',
    description: 'Alexandria, Delta cities and regional tech centers',
    descriptionAr: 'الإسكندرية، مدن الدلتا والقناة والمراكز الإقليمية',
    scale: 0.18,
    remoteAdj: 14.5,
  },
  {
    id: 'gulf-global',
    label: 'Gulf & Global from Egypt',
    labelAr: 'شركات خليجية ودولية (من مصر) 🌍',
    description: 'Saudi, UAE and European tech firms hiring Egyptian talent',
    descriptionAr: 'شركات سعودية وإماراتية وأوروبية توظف مهارات مصرية',
    scale: 0.28,
    remoteAdj: 45.0,
  },
];

export type ExperienceLevel = {
  id: string;
  label: string;
  labelAr: string;
  description: string;
  descriptionAr: string;
  scale: number;
};

export const experienceLevels: ExperienceLevel[] = [
  {
    id: 'all',
    label: 'All Experience Levels',
    labelAr: 'كافة مستويات الخبرة',
    description: 'From entry-level up to principal and engineering leads',
    descriptionAr: 'من المبتدئين وحتى المستويات القيادية والاستشارية',
    scale: 1,
  },
  {
    id: 'entry',
    label: 'Fresh Grad / Entry (0-1 yr)',
    labelAr: 'خريجين جدد ومبتدئين (0-1 سنة)',
    description: 'Internships, traineeships, and junior roles',
    descriptionAr: 'فرص تدريب وخريجين بدون متطلبات خبرة طويلة',
    scale: 0.26,
  },
  {
    id: 'mid',
    label: 'Mid-Level (2-4 yrs)',
    labelAr: 'خبرة متوسطة (2-4 سنوات)',
    description: 'Independent contributors with production experience',
    descriptionAr: 'مطورون مستقلون يملكون خبرة مشاريع حية في السوق',
    scale: 0.48,
  },
  {
    id: 'senior',
    label: 'Senior & Lead (5+ yrs)',
    labelAr: 'متقدم وقيادي (+5 سنوات)',
    description: 'System architects, tech leads, and principal engineers',
    descriptionAr: 'مهندسو نظم، قادة فرق تقنية وخبراء استشاريون',
    scale: 0.26,
  },
];

export const metrics = [
  { id: 'growth', label: 'Growth %', description: 'Change in posting volume' },
  { id: 'postings', label: 'Job postings', description: 'Absolute number of postings' },
  { id: 'share', label: 'Market share %', description: 'Share of all postings' },
];

export type SearchEntry = { label: string; type: 'Skill' | 'Role' | 'Company'; meta: string };

export const searchIndex: SearchEntry[] = [
  { label: 'React', type: 'Skill', meta: 'In 86% of frontend roles' },
  { label: 'TypeScript', type: 'Skill', meta: 'Fastest growing, +38%' },
  { label: 'Python', type: 'Skill', meta: 'In 88% of data & AI roles' },
  { label: 'Node.js', type: 'Skill', meta: 'In 82% of backend roles' },
  { label: 'Flutter', type: 'Skill', meta: 'In 84% of mobile roles' },
  { label: 'Docker', type: 'Skill', meta: 'In 89% of DevOps roles' },
  { label: 'SQL', type: 'Skill', meta: 'Core requirement in 78% of roles' },
  { label: 'Frontend Developer', type: 'Role', meta: '3,820 open roles in Egypt' },
  { label: 'Backend Developer', type: 'Role', meta: '4,190 open roles in Egypt' },
  { label: 'Data Engineer', type: 'Role', meta: '1,840 open roles in Egypt' },
  { label: 'DevOps Engineer', type: 'Role', meta: '2,150 open roles in Egypt' },
  { label: 'Vodafone Egypt', type: 'Company', meta: '240 open tech roles' },
  { label: 'Microsoft Egypt', type: 'Company', meta: '95 open tech roles in Cairo' },
  { label: 'Fawry', type: 'Company', meta: '82 open tech roles in Smart Village' },
  { label: 'Paymob', type: 'Company', meta: '64 open tech roles in Maadi' },
];

export const sparkPaths = {
  jobs: 'M0,26 L10,20 L20,24 L30,14 L40,19 L50,10 L60,15 L70,7 L80,11 L90,3 L100,0',
  companies: 'M0,27 L12,22 L24,25 L36,16 L48,20 L60,12 L72,15 L84,7 L100,1',
  remote: 'M0,25 L12,27 L24,18 L36,22 L48,13 L60,17 L72,9 L84,12 L100,2',
};
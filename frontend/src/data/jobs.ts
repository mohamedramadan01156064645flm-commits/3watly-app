export interface JobItem {
  id: string;
  title: string;
  titleAr: string;
  company: string;
  companyAr: string;
  logo: string;
  companyLogo?: string | null;
  company_logo?: string | null;
  applyUrl?: string;
  apply_url?: string;
  location: string;
  locationAr: string;
  workType: 'Hybrid' | 'Remote' | 'On-site';
  workTypeAr: 'مرن (مكتبي وعن بُعد)' | 'عن بُعد بالكامل' | 'من مقر الشركة';
  employmentType: 'Full-time' | 'Part-time' | 'Contract';
  employmentTypeAr: 'دوام كامل' | 'دوام جزئي' | 'عقد';
  seniority: 'Fresh' | 'Junior' | 'Mid' | 'Senior';
  seniorityAr: string;
  salaryRange: string;
  salaryRangeAr: string;
  matchScore: number;
  postedAgo: string;
  postedAgoAr: string;
  applicantsCount: number;
  department: string;
  departmentAr: string;
  education: string;
  educationAr: string;
  experienceYears: string;
  experienceYearsAr: string;
  matchedSkills: { name: string; weight: number }[];
  missingSkills: { name: string; weight: number; marketNote: string; marketNoteAr: string }[];
  description: string;
  descriptionAr: string;
  responsibilities: string[];
  responsibilitiesAr: string[];
  requirements: string[];
  requirementsAr: string[];
}

export const mockJobsList: JobItem[] = [
  {
    id: 'vodafone-data-analyst',
    title: 'Junior Data Analyst',
    titleAr: 'محلل بيانات مبتدئ (Junior Data Analyst)',
    company: 'Vodafone Egypt',
    companyAr: 'فودافون مصر',
    logo: 'vodafone',
    location: 'Smart Village, Giza',
    locationAr: 'القرية الذكية، الجيزة',
    workType: 'Hybrid',
    workTypeAr: 'مرن (مكتبي وعن بُعد)',
    employmentType: 'Full-time',
    employmentTypeAr: 'دوام كامل',
    seniority: 'Junior',
    seniorityAr: 'مبتدئ',
    salaryRange: 'EGP 18,000 – 24,000 /mo',
    salaryRangeAr: '18,000 – 24,000 ج.م /شهرياً',
    matchScore: 84,
    postedAgo: '2 hours ago',
    postedAgoAr: 'منذ ساعتين',
    applicantsCount: 42,
    department: 'Data & Analytics',
    departmentAr: 'إدارة البيانات والتحليلات',
    education: "Bachelor's Degree in CS/Engineering/Business",
    educationAr: 'بكالوريوس هندسة / حاسبات / تجارة وإحصاء',
    experienceYears: '0 - 2 years',
    experienceYearsAr: '0 - 2 سنوات',
    matchedSkills: [
      { name: 'SQL', weight: 25 },
      { name: 'Python', weight: 20 },
      { name: 'Power BI', weight: 15 },
      { name: 'Excel', weight: 10 }
    ],
    missingSkills: [
      {
        name: 'Tableau',
        weight: 15,
        marketNote: 'Found in 31% of similar Cairo jobs',
        marketNoteAr: 'مطلوبة في 31% من وظائف محللي البيانات في القاهرة'
      }
    ],
    description: 'Vodafone Egypt is looking for a Junior Data Analyst to join our Data & Analytics team. You will collect, clean, and analyze data to support business decisions and build dashboards and reports.',
    descriptionAr: 'تبحث فودافون مصر عن محلل بيانات مبتدئ للانضمام لفريق تحليلات البيانات. ستعمل على تجميع وتنظيف وتحليل البيانات لدعم القرارات وبناء لوحات تحكم تفاعلية وتقارير أداء دورية.',
    responsibilities: [
      'Collect, clean, and validate data from multiple telecommunication sources.',
      'Analyze data to identify trends, performance drops, and customer insights.',
      'Build and automate operational dashboards using Power BI and Excel.',
      'Support ad-hoc analysis and reporting requests from senior management.',
      'Work with cross-functional teams to deliver actionable data-driven insights.'
    ],
    responsibilitiesAr: [
      'تجميع وتنظيف وتدقيق البيانات من مصادر وقواعد بيانات متعددة.',
      'تحليل البيانات لاكتشاف الاتجاهات ونقاط التحسين وتفضيلات العملاء.',
      'بناء وتطوير لوحات قياس الأداء التفاعلية باستخدام Power BI و Excel.',
      'إعداد التقارير والتحليلات الخاصة المطلوبة للإدارة العليا.',
      'التعاون مع الفرق المختلفة لتقديم رؤى عملية وقابلة للتطبيق مبنية على البيانات.'
    ],
    requirements: [
      '0–2 years of experience in data analysis or related field.',
      'Strong SQL querying skills and relational database understanding.',
      'Proficiency in Python (Pandas, NumPy) and Advanced Excel.',
      'Experience with Power BI or Tableau is a plus.',
      'Excellent analytical thinking and clear communication skills.'
    ],
    requirementsAr: [
      'خبرة من 0 إلى 2 سنة في تحليل البيانات أو مجالات مشابهة.',
      'إتقان قوي لكتابة استعلامات SQL والتعامل مع قواعد البيانات.',
      'إجادة بايثون لتحليل البيانات (Pandas, NumPy) و Excel المتقدم.',
      'خبرة عملية في Power BI أو أدوات الـ BI تعتبر ميزة إضافية.',
      'مهارات تحليلية ممتازة وقدرة على عرض وتبسيط نتائج البيانات.'
    ]
  },
  {
    id: 'valeo-bi-developer',
    title: 'Junior BI Developer',
    titleAr: 'مطور ذكاء أعمال مبتدئ (Junior BI Developer)',
    company: 'Valeo Egypt',
    companyAr: 'فاليو مصر',
    logo: 'valeo',
    location: 'Smart Village, Cairo',
    locationAr: 'القرية الذكية، القاهرة',
    workType: 'On-site',
    workTypeAr: 'من مقر الشركة',
    employmentType: 'Full-time',
    employmentTypeAr: 'دوام كامل',
    seniority: 'Junior',
    seniorityAr: 'مبتدئ',
    salaryRange: 'EGP 15,000 – 20,000 /mo',
    salaryRangeAr: '15,000 – 20,000 ج.م /شهرياً',
    matchScore: 79,
    postedAgo: '4 hours ago',
    postedAgoAr: 'منذ 4 ساعات',
    applicantsCount: 28,
    department: 'Automotive Software & BI',
    departmentAr: 'برمجيات السيارات وذكاء الأعمال',
    education: "Bachelor's Degree in Computer Science or related",
    educationAr: 'بكالوريوس حاسبات ومعلومات أو هندسة برمجيات',
    experienceYears: '1 - 2 years',
    experienceYearsAr: '1 - 2 سنوات',
    matchedSkills: [
      { name: 'SQL', weight: 30 },
      { name: 'Power BI', weight: 25 },
      { name: 'Excel', weight: 15 }
    ],
    missingSkills: [
      {
        name: 'Python ETL',
        weight: 15,
        marketNote: 'Preferred for automotive telemetry pipelines',
        marketNoteAr: 'مطلوبة لمعالجة بيانات حساسات وأنظمة السيارات'
      }
    ],
    description: 'Valeo Egypt is seeking a Junior BI Developer to design, model, and maintain data visualization pipelines across automotive embedded software projects.',
    descriptionAr: 'تبحث شركة فاليو مصر عن مطور ذكاء أعمال مبتدئ لتصميم ونمذجة لوحات البيانات لمشاريع برمجيات السيارات المدمجة.',
    responsibilities: [
      'Design ETL pipelines and maintain relational data warehouses.',
      'Develop interactive Power BI dashboards for engineering teams.',
      'Optimize complex SQL queries for faster report execution.'
    ],
    responsibilitiesAr: [
      'تصميم وبناء خطوط استخراج وتحويل البيانات (ETL).',
      'تطوير لوحات تحكم تفاعلية بـ Power BI للفرق الهندسية.',
      'تحسين كفاءة استعلامات SQL لتسريع عرض التقارير.'
    ],
    requirements: [
      'Strong knowledge of SQL, ETL concepts, and data modeling.',
      'Hands-on experience with Microsoft Power BI.',
      'Familiarity with Git and agile development methodologies.'
    ],
    requirementsAr: [
      'معرفة متقنة بـ SQL ومفاهيم نمذجة البيانات والـ ETL.',
      'خبرة عملية في إنشاء لوحات Power BI.',
      'إلمام بنظام Git وأساليب العمل المرن Agile.'
    ]
  },
  {
    id: 'siemens-data-analyst',
    title: 'Data Analyst — EDA Software',
    titleAr: 'محلل بيانات — برمجيات التصميم الإلكتروني',
    company: 'Siemens EDA',
    companyAr: 'سيمنز مصر للبرمجيات',
    logo: 'siemens',
    location: 'New Cairo, Cairo',
    locationAr: 'التجمع الخامس، القاهرة الجديدة',
    workType: 'Hybrid',
    workTypeAr: 'مرن (مكتبي وعن بُعد)',
    employmentType: 'Full-time',
    employmentTypeAr: 'دوام كامل',
    seniority: 'Junior',
    seniorityAr: 'مبتدئ',
    salaryRange: 'EGP 18,000 – 25,000 /mo',
    salaryRangeAr: '18,000 – 25,000 ج.م /شهرياً',
    matchScore: 74,
    postedAgo: '6 hours ago',
    postedAgoAr: 'منذ 6 ساعات',
    applicantsCount: 35,
    department: 'Software Performance & Data',
    departmentAr: 'أداء البرمجيات والبيانات',
    education: "Bachelor's Degree in Computer Science / Engineering",
    educationAr: 'بكالوريوس هندسة حاسبات أو علوم حاسب',
    experienceYears: '1 - 3 years',
    experienceYearsAr: '1 - 3 سنوات',
    matchedSkills: [
      { name: 'SQL', weight: 25 },
      { name: 'Excel', weight: 15 },
      { name: 'Python', weight: 20 }
    ],
    missingSkills: [
      {
        name: 'Docker / Linux',
        weight: 15,
        marketNote: 'Used for automated test report pipelines',
        marketNoteAr: 'مطلوبة لتشغيل بيئات الاختبار الآلية'
      }
    ],
    description: 'Join Siemens EDA in New Cairo to analyze semiconductor software performance metrics, build regression reports, and identify optimization vectors.',
    descriptionAr: 'انضم لشركة سيمنز EDA في القاهرة الجديدة لتحليل بيانات أداء برمجيات أشباه الموصلات، وبناء تقارير الجودة والاختبارات الدورية.',
    responsibilities: [
      'Analyze nightly regression test data and software execution metrics.',
      'Generate automated charts and statistical variance models in Python.',
      'Collaborate with international software architects across Europe and Egypt.'
    ],
    responsibilitiesAr: [
      'تحليل بيانات اختبارات الأداء اليومية للبرمجيات.',
      'إنشاء تقارير آلية ونماذج إحصائية باستخدام لغة بايثون.',
      'التعاون مع مهندسي البرمجيات في مصر وأوروبا لتحسين الأداء.'
    ],
    requirements: [
      'Bachelor’s in Engineering or Computer Science.',
      'Proficiency with Python scripting and SQL.',
      'Strong problem-solving and statistical reasoning.'
    ],
    requirementsAr: [
      'بكالوريوس هندسة أو علوم حاسب.',
      'إتقان البرمجة بلغة بايثون واستعلامات SQL.',
      'قدرة عالية على حل المشكلات والتفكير الإحصائي.'
    ]
  },
  {
    id: 'paymob-data-specialist',
    title: 'Fintech Data Operations Specialist',
    titleAr: 'أخصائي بيانات وعمليات الدفع الإلكتروني',
    company: 'Paymob',
    companyAr: 'باي موب مصر',
    logo: 'paymob',
    location: 'Maadi, Cairo',
    locationAr: 'المعادي، القاهرة',
    workType: 'Hybrid',
    workTypeAr: 'مرن (مكتبي وعن بُعد)',
    employmentType: 'Full-time',
    employmentTypeAr: 'دوام كامل',
    seniority: 'Mid',
    seniorityAr: 'متوسط الخبرة',
    salaryRange: 'EGP 22,000 – 30,000 /mo',
    salaryRangeAr: '22,000 – 30,000 ج.م /شهرياً',
    matchScore: 82,
    postedAgo: '1 day ago',
    postedAgoAr: 'منذ يوم',
    applicantsCount: 54,
    department: 'Merchant Intelligence & Risk',
    departmentAr: 'ذكاء التجار والمخاطر المالية',
    education: 'Degree in Business, Finance, or CS',
    educationAr: 'مؤهل في نظم المعلومات أو الاقتصاد أو الحاسبات',
    experienceYears: '2 - 4 years',
    experienceYearsAr: '2 - 4 سنوات',
    matchedSkills: [
      { name: 'SQL', weight: 30 },
      { name: 'Python', weight: 25 },
      { name: 'Power BI', weight: 20 }
    ],
    missingSkills: [
      {
        name: 'Financial Fraud Modeling',
        weight: 15,
        marketNote: 'Key skill for digital payment platforms',
        marketNoteAr: 'مهارة محورية لمنصات المدفوعات والشمول المالي'
      }
    ],
    description: 'Paymob is the leading payment gateway in Egypt. We are looking for a Data Operations Specialist to monitor merchant transactions, detect fraud anomalies, and optimize conversion rates.',
    descriptionAr: 'تعد باي موب منصة المدفوعات الرائدة في مصر. نبحث عن أخصائي بيانات لمتابعة حركات التجار واكتشاف الأنماط غير المعتادة وتحسين نسب إتمام العمليات.',
    responsibilities: [
      'Monitor real-time merchant transaction volumes and acceptance rates.',
      'Build anomaly detection triggers using SQL and Python.',
      'Deliver daily analytics to product and commercial leadership.'
    ],
    responsibilitiesAr: [
      'مراقبة معدلات قبول المعاملات المالية في الوقت الفعلي.',
      'بناء نماذج لاكتشاف التغيرات المفاجئة باستخدام SQL وبايثون.',
      'تقديم تقارير وتحليلات يومية للإدارة التجارية وإدارة المنتجات.'
    ],
    requirements: [
      '2+ years in Fintech, Banking, or E-commerce data analysis.',
      'Mastery of advanced SQL window functions and Python Pandas.',
      'Experience in transactional data pipelines.'
    ],
    requirementsAr: [
      'خبرة سنتين فأكثر في تحليل بيانات التكنولوجيا المالية أو التجارة الإلكترونية.',
      'إتقان دوال SQL المتقدمة ومكتبات بايثون Pandas.',
      'خبرة في التعامل مع بيانات المعاملات المالية الحية.'
    ]
  },
  {
    id: 'instabug-frontend-engineer',
    title: 'Junior Frontend Engineer',
    titleAr: 'مهندس واجهات أمامية مبتدئ (Junior Frontend)',
    company: 'Instabug',
    companyAr: 'إنستابَج مصر',
    logo: 'instabug',
    location: 'Dokki, Giza',
    locationAr: 'الدقي، الجيزة',
    workType: 'Hybrid',
    workTypeAr: 'مرن (مكتبي وعن بُعد)',
    employmentType: 'Full-time',
    employmentTypeAr: 'دوام كامل',
    seniority: 'Junior',
    seniorityAr: 'مبتدئ',
    salaryRange: 'EGP 20,000 – 28,000 /mo',
    salaryRangeAr: '20,000 – 28,000 ج.م /شهرياً',
    matchScore: 88,
    postedAgo: '5 hours ago',
    postedAgoAr: 'منذ 5 ساعات',
    applicantsCount: 36,
    department: 'Web SDK & Platform',
    departmentAr: 'منصات الويب والمكتبات البرمجية',
    education: "Bachelor's Degree in Computer Science or Engineering",
    educationAr: 'بكالوريوس حاسبات ومعلومات أو هندسة حاسبات',
    experienceYears: '0 - 2 years',
    experienceYearsAr: '0 - 2 سنوات',
    matchedSkills: [
      { name: 'React', weight: 30 },
      { name: 'TypeScript', weight: 25 },
      { name: 'JavaScript', weight: 20 },
      { name: 'Tailwind CSS', weight: 15 }
    ],
    missingSkills: [
      {
        name: 'Next.js',
        weight: 10,
        marketNote: 'In high demand for modern SSR web applications',
        marketNoteAr: 'مطلوبة بشدة لبناء تطبيقات الويب الحديثة'
      }
    ],
    description: 'Instabug is seeking a passionate Junior Frontend Engineer to build high-performance dashboard interfaces and client-side tooling used by top global applications.',
    descriptionAr: 'تبحث إنستابج عن مهندس واجهات أمامية مبتدئ للمشاركة في تطوير لوحات تحكم عالية الأداء وأدوات برمجية يستخدمها ملايين المطورين حول العالم.',
    responsibilities: [
      'Build responsive, pixel-perfect user interfaces using React and TypeScript.',
      'Collaborate with product designers to implement reusable UI components.',
      'Optimize web application performance and cross-browser compatibility.'
    ],
    responsibilitiesAr: [
      'بناء واجهات مستخدم متجاوبة ودقيقة باستخدام React و TypeScript.',
      'التعاون مع مصممي المنتجات لبناء مكتبة مكونات UI قابلة لإعادة الاستخدام.',
      'تحسين سرعة وأداء صفحات الويب وضمان توافقها عبر جميع المتصفحات.'
    ],
    requirements: [
      'Strong fundamentals in HTML5, CSS3, modern JavaScript (ES6+), and TypeScript.',
      'Hands-on experience building web apps with React.',
      'Familiarity with Git and RESTful API integration.'
    ],
    requirementsAr: [
      'أساسيات قوية في HTML5, CSS3, JavaScript الحديثة و TypeScript.',
      'خبرة عملية في بناء تطبيقات الويب باستخدام React.',
      'معرفة جيدة بنظام Git والتعامل مع REST APIs.'
    ]
  },
  {
    id: 'vodafone-data-engineer',
    title: 'Junior Data Engineer',
    titleAr: 'مهندس خطوط بيانات مبتدئ (Junior Data Engineer)',
    company: 'Vodafone Egypt',
    companyAr: 'فودافون مصر',
    logo: 'vodafone',
    location: 'Smart Village, Giza',
    locationAr: 'القرية الذكية، الجيزة',
    workType: 'Hybrid',
    workTypeAr: 'مرن (مكتبي وعن بُعد)',
    employmentType: 'Full-time',
    employmentTypeAr: 'دوام كامل',
    seniority: 'Junior',
    seniorityAr: 'مبتدئ',
    salaryRange: 'EGP 22,000 – 30,000 /mo',
    salaryRangeAr: '22,000 – 30,000 ج.م /شهرياً',
    matchScore: 86,
    postedAgo: '1 day ago',
    postedAgoAr: 'منذ يوم',
    applicantsCount: 29,
    department: 'Big Data & Cloud Pipelines',
    departmentAr: 'البيانات الضخمة والمنصات السحابية',
    education: "Bachelor's Degree in Computer Science, Data Science, or Engineering",
    educationAr: 'بكالوريوس علوم الحاسب أو هندسة الحاسبات أو علوم البيانات',
    experienceYears: '1 - 2 years',
    experienceYearsAr: '1 - 2 سنوات',
    matchedSkills: [
      { name: 'Python', weight: 30 },
      { name: 'SQL', weight: 25 },
      { name: 'Apache Spark', weight: 20 }
    ],
    missingSkills: [
      {
        name: 'Airflow',
        weight: 15,
        marketNote: 'Required for automated workflow orchestration',
        marketNoteAr: 'مطلوبة لإدارة وجدولة تدفقات البيانات الآلية'
      }
    ],
    description: 'Join Vodafone Big Data team to design and maintain scalable ETL/ELT data pipelines processing millions of daily telecommunication records.',
    descriptionAr: 'انضم لفريق البيانات الضخمة في فودافون مصر لبناء وصيانة خطوط معالجة البيانات ETL/ELT التي تتعامل مع ملايين السجلات اليومية.',
    responsibilities: [
      'Develop automated ETL data pipelines using Python and SQL.',
      'Maintain data warehouses and ensure high data quality and reliability.',
      'Monitor distributed data processing jobs on cloud infrastructure.'
    ],
    responsibilitiesAr: [
      'تطوير خطوط أنابيب استخراج وتحويل البيانات الآلية باستخدام بايثون و SQL.',
      'صيانة وتحديث مستودعات البيانات وضمان جودة وموثوقية البيانات.',
      'متابعة مهام معالجة البيانات الموزعة على البنية السحابية.'
    ],
    requirements: [
      'Proficiency in Python and advanced SQL database queries.',
      'Understanding of data modeling, warehousing, and ETL concepts.',
      'Exposure to Spark, Kafka, or workflow orchestration tools is a plus.'
    ],
    requirementsAr: [
      'إتقان لغة Python واستعلامات SQL المتقدمة.',
      'فهم عميق لمفاهيم نمذجة وتخزين البيانات وخطوط ETL.',
      'الاطلاع على Spark أو Kafka أو أدوات الأتمتة يعتبر ميزة إضافية.'
    ]
  },
  {
    id: 'valeo-ml-engineer',
    title: 'Junior Machine Learning Engineer',
    titleAr: 'مهندس تعلم آلي وذكاء اصطناعي مبتدئ',
    company: 'Valeo Egypt',
    companyAr: 'فاليو مصر',
    logo: 'valeo',
    location: 'Smart Village, Giza',
    locationAr: 'القرية الذكية، الجيزة',
    workType: 'On-site',
    workTypeAr: 'من مقر الشركة',
    employmentType: 'Full-time',
    employmentTypeAr: 'دوام كامل',
    seniority: 'Junior',
    seniorityAr: 'مبتدئ',
    salaryRange: 'EGP 24,000 – 32,000 /mo',
    salaryRangeAr: '24,000 – 32,000 ج.م /شهرياً',
    matchScore: 89,
    postedAgo: '3 hours ago',
    postedAgoAr: 'منذ 3 ساعات',
    applicantsCount: 22,
    department: 'Autonomous Driving & AI Research',
    departmentAr: 'القيادة الذاتية وأبحاث الذكاء الاصطناعي',
    education: "Bachelor's Degree in Computer Engineering or AI",
    educationAr: 'بكالوريوس هندسة الحاسبات أو الذكاء الاصطناعي',
    experienceYears: '0 - 2 years',
    experienceYearsAr: '0 - 2 سنوات',
    matchedSkills: [
      { name: 'Python', weight: 30 },
      { name: 'PyTorch', weight: 25 },
      { name: 'Computer Vision', weight: 20 },
      { name: 'Scikit-Learn', weight: 15 }
    ],
    missingSkills: [
      {
        name: 'MLOps',
        weight: 10,
        marketNote: 'Model deployment & tracking in production',
        marketNoteAr: 'نشر ومتابعة نماذج الذكاء الاصطناعي في بيئة الإنتاج'
      }
    ],
    description: 'Work on cutting-edge deep learning models for perception and obstacle detection in autonomous vehicles at Valeo Cairo tech center.',
    descriptionAr: 'شارك في تطوير وتدريب نماذج التعلم العميق للرؤية الحاسوبية واكتشاف الأجسام في أنظمة القيادة الذاتية داخل مركز فاليو القاهرة.',
    responsibilities: [
      'Train, evaluate, and fine-tune computer vision and deep learning models.',
      'Preprocess large image and sensor datasets for training pipelines.',
      'Optimize ML models for embedded deployment and edge computing.'
    ],
    responsibilitiesAr: [
      'تدريب وتقييم نماذج الرؤية الحاسوبية والتعلم العميق باستخدام PyTorch/TensorFlow.',
      'معالجة وتجهيز مجموعات البيانات الضخمة للصور والمستشعرات.',
      'تحسين كفاءة النماذج للعمل على الأنظمة المدمجة.'
    ],
    requirements: [
      'Solid foundations in linear algebra, calculus, and machine learning principles.',
      'Proficiency in Python, PyTorch/TensorFlow, and OpenCV.',
      'Strong problem-solving mindset and passion for AI technology.'
    ],
    requirementsAr: [
      'أساسيات قوية في الرياضيات ومبادئ التعلم الآلي والتعلم العميق.',
      'إتقان بايثون ومكتبات PyTorch أو TensorFlow و OpenCV.',
      'شغف بأبحاث وتطبيقات الذكاء الاصطناعي والتعلم الآلي.'
    ]
  },
  {
    id: 'trella-devops-engineer',
    title: 'Junior DevOps / Cloud Engineer',
    titleAr: 'مهندس سحابي وعمليات برمجية مبتدئ (DevOps)',
    company: 'Trella',
    companyAr: 'تريلا مصر',
    logo: 'trella',
    location: 'Maadi, Cairo',
    locationAr: 'المعادي، القاهرة',
    workType: 'Remote',
    workTypeAr: 'عن بُعد بالكامل',
    employmentType: 'Full-time',
    employmentTypeAr: 'دوام كامل',
    seniority: 'Junior',
    seniorityAr: 'مبتدئ',
    salaryRange: 'EGP 22,000 – 30,000 /mo',
    salaryRangeAr: '22,000 – 30,000 ج.م /شهرياً',
    matchScore: 85,
    postedAgo: '6 hours ago',
    postedAgoAr: 'منذ 6 ساعات',
    applicantsCount: 19,
    department: 'Cloud Infrastructure & SRE',
    departmentAr: 'البنية التحتية السحابية وموثوقية الأنظمة',
    education: "Bachelor's Degree in Computer Science or Communications Engineering",
    educationAr: 'بكالوريوس هندسة اتصالات أو حاسبات ومعلومات',
    experienceYears: '0 - 2 years',
    experienceYearsAr: '0 - 2 سنوات',
    matchedSkills: [
      { name: 'Docker', weight: 30 },
      { name: 'Linux', weight: 25 },
      { name: 'CI/CD', weight: 20 },
      { name: 'Git', weight: 15 }
    ],
    missingSkills: [
      {
        name: 'Kubernetes',
        weight: 10,
        marketNote: 'Container orchestration standard in cloud startups',
        marketNoteAr: 'المعيار الأساسي لإدارة الحاويات في الشركات الناشئة'
      }
    ],
    description: 'Trella is looking for a Junior DevOps Engineer to support our cloud infrastructure, automate deployment pipelines, and ensure 99.9% uptime for our digital freight platform.',
    descriptionAr: 'تبحث تريلا عن مهندس DevOps مبتدئ للمشاركة في إدارة البنية التحتية السحابية وأتمتة خطوط النشر CI/CD لضمان استقرار المنصة.',
    responsibilities: [
      'Maintain containerized application services using Docker and AWS.',
      'Configure and troubleshoot GitHub Actions and CI/CD deployment pipelines.',
      'Monitor system health, alerts, and server logs.'
    ],
    responsibilitiesAr: [
      'صيانة وتحديث خدمات التطبيقات المعبأة باستخدام Docker و AWS.',
      'إعداد ومتابعة خطوط التكامل والنشر المستمر CI/CD عبر GitHub Actions.',
      'مراقبة كفاءة الخوادم وسجلات النظام وحل المشكلات التشغيلية.'
    ],
    requirements: [
      'Strong command of Linux environments and command-line shell scripting.',
      'Hands-on knowledge of Docker containers and Git workflows.',
      'Familiarity with AWS/GCP cloud services and CI/CD pipelines.'
    ],
    requirementsAr: [
      'إلمام قوي ببيئة أنظمة Linux وكتابة سكربتات Shell.',
      'معرفة عملية بحاويات Docker وأنظمة التحكم في الإصدارات Git.',
      'اطلاع على الخدمات السحابية (AWS أو GCP) ومفاهيم CI/CD.'
    ]
  }
];

export const mockDashboardData = {
  stats: {
    totalJobs: { value: '12,842', delta: '+8% vs last 30 days', deltaAr: '+8% عن آخر 30 يوم' },
    hiringCompanies: { value: '1,246', delta: '+6.3% vs last 30 days', deltaAr: '+6.3% عن آخر 30 يوم' },
    remoteRatio: { value: '38.4%', delta: '+4.7% vs last 30 days', deltaAr: '+4.7% عن آخر 30 يوم' },
    topSkill: { name: 'SQL', sub: '81% of data roles', subAr: 'مطلوبة في 81% من الوظائف' }
  },
  careerAlignment: {
    score: 74,
    delta: '+6% from last week',
    deltaAr: '+6% عن الأسبوع الماضي',
    summary: "You're aligned with current market demand",
    summaryAr: 'ملفك متوافق بشكل قوي مع متطلبات السوق الحالية',
    whyMatters: 'Professionals with 70%+ alignment get 3.6x more interview callbacks.',
    whyMattersAr: 'المتخصصون الذين يحققون نسبة توافق 70%+ يحصلون على معدل مقابلات أعلى بـ 3.6 مرات.'
  },
  nextBestMove: {
    skills: ['Power BI', 'SQL'],
    description: 'These are the two highest-impact skills missing from your profile based on 1,240 current Egyptian job postings.',
    descriptionAr: 'هاتان المهارتان هما الأكثر تأثيراً في رفع نسبة توافق ملفك مع أكثر من 1,240 وظيفة نشطة في مصر.'
  },
  upcomingTasks: [
    {
      id: 'task-1',
      title: 'Complete Power BI Course Chapter 3',
      titleAr: 'إكمال الدرس الثالث في كورس Power BI المتقدم',
      time: 'Today 6:00 PM',
      timeAr: 'اليوم 6:00 م',
      status: 'In Progress',
      statusAr: 'قيد التنفيذ',
      icon: 'book'
    },
    {
      id: 'task-2',
      title: 'SQL Advanced Queries Practice',
      titleAr: 'حل تمارين استعلامات SQL المتقدمة',
      time: 'Tomorrow 10:00 AM',
      timeAr: 'غداً 10:00 ص',
      status: 'Upcoming',
      statusAr: 'قادم',
      icon: 'code'
    },
    {
      id: 'task-3',
      title: 'Chat with AI Copilot for CV Feedback',
      titleAr: 'استشارة المساعد الذكي لمراجعة السيرة الذاتية',
      time: 'May 28 2:00 PM',
      timeAr: '28 مايو 2:00 م',
      status: 'Get career advice',
      statusAr: 'طلب استشارة',
      icon: 'bot'
    }
  ],
  marketTip: {
    text: 'Tableau demand increased +12% in Egyptian MNCs over the last 90 days.',
    textAr: 'زاد الطلب على مهارة Tableau بنسبة +12% في الشركات متعددة الجنسيات بمصر خلال آخر 90 يوم.'
  },
  inDemandSkills: [
    { name: 'SQL', share: 92 },
    { name: 'Power BI', share: 88 },
    { name: 'Python', share: 76 },
    { name: 'Excel', share: 70 },
    { name: 'Tableau', share: 61 }
  ],
  marketOverview: {
    activeJobs: '1,240',
    activeJobsDelta: '+8% vs last month',
    avgSalary: 'EGP 15K',
    avgSalaryDelta: '+6% vs last month',
    competition: '2.4x',
    competitionLevel: 'High'
  }
};

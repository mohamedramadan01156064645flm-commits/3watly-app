import type { RoleDefinition, SkillDefinition } from '../types/skills';

export const SKILLS: Record<string, SkillDefinition> = {
  sql: {
    id: 'sql',
    name: 'SQL',
    aliases: ['SQL', 'T-SQL', 'PL/SQL'],
    tier: 'foundation',
    hours: 8,
    courses: 3,
    growth: 4,
    why: 'Every data role in the Egyptian market screens for SQL first — it is the shared language of every pipeline, dashboard and report.',
    actions: [
    'Practice joins, window functions and CTEs on a real dataset',
    'Rewrite one messy query into a readable, indexed version',
    'Publish a query notebook to your portfolio'],

    prerequisites: [],
    salaryUplift: 3,
    resources: [
      { title: 'SQL for Data Analysis (full playlist)', provider: 'YouTube', kind: 'video', hours: 6, free: true, url: 'https://www.youtube.com/watch?v=HXV3zeRR3h4' },
      { title: 'Modern SQL Deep Dive', provider: 'Coursera', kind: 'course', hours: 12, free: false, url: 'https://www.coursera.org/learn/sql-for-data-science' },
      { title: 'Window functions reference', provider: 'Official Docs', kind: 'docs', hours: 2, free: true, url: 'https://mode.com/sql-tutorial/sql-window-functions' }
    ]
  },
  python: {
    id: 'python',
    name: 'Python',
    aliases: ['Python', 'Pandas', 'NumPy'],
    tier: 'foundation',
    hours: 10,
    courses: 4,
    growth: 11,
    why: 'Python is how analysts move from one-off reports to repeatable automation, and it is the default language of every data platform team.',
    actions: [
      'Automate one recurring Excel report end to end',
      'Clean a public dataset with pandas and document the steps',
      'Ship the script with tests and a README'
    ],
    prerequisites: [],
    salaryUplift: 4,
    resources: [
      { title: 'Python for Data Engineering', provider: 'YouTube', kind: 'video', hours: 8, free: true, url: 'https://www.youtube.com/watch?v=mD_S-wO7W5c' },
      { title: 'Data Analysis with Python', provider: 'Coursera', kind: 'course', hours: 16, free: false, url: 'https://www.coursera.org/learn/data-analysis-with-python' },
      { title: 'Automate a weekly report', provider: 'Hands-on Project', kind: 'project', hours: 6, free: true, url: 'https://github.com/practical-tutorials/project-based-learning#python' }
    ]
  },
  git: {
    id: 'git',
    name: 'Git',
    aliases: ['Git', 'GitHub', 'GitLab', 'version control'],
    tier: 'foundation',
    hours: 4,
    courses: 2,
    growth: 3,
    why: 'Teams will not merge your work without it. Git is the entry ticket to collaborating on any production data codebase.',
    actions: [
      'Move one existing project into a clean repository',
      'Practice branching, rebasing and pull requests',
      'Add a README and commit history worth reading'
    ],
    prerequisites: [],
    salaryUplift: 1,
    resources: [
      { title: 'Git & GitHub crash course', provider: 'YouTube', kind: 'video', hours: 3, free: true, url: 'https://www.youtube.com/watch?v=RGOj5yH7evk' },
      { title: 'Version Control Fundamentals', provider: 'Coursera', kind: 'course', hours: 6, free: false, url: 'https://www.coursera.org/learn/version-control-with-git' },
      { title: 'Pro Git handbook', provider: 'Official Docs', kind: 'docs', hours: 4, free: true, url: 'https://git-scm.com/book/en/v2' }
    ]
  },
  etl: {
    id: 'etl',
    name: 'ETL Pipelines',
    aliases: ['ETL', 'ELT', 'data pipeline', 'data pipelines', 'data ingestion'],
    tier: 'core',
    hours: 14,
    courses: 4,
    growth: 9,
    why: 'Egyptian employers hire data engineers to move and reshape data reliably. Pipeline design is the single most requested competency in the market.',
    actions: [
      'Design an extract → transform → load flow for one real source',
      'Add validation, retries and logging to the flow',
      'Document the pipeline contract and failure handling'
    ],
    prerequisites: ['sql', 'python'],
    salaryUplift: 6,
    resources: [
      { title: 'Building your first data pipeline', provider: 'YouTube', kind: 'video', hours: 5, free: true, url: 'https://www.youtube.com/watch?v=PHsC_t0j1OU' },
      { title: 'Data Engineering Foundations', provider: 'Coursera', kind: 'course', hours: 18, free: false, url: 'https://www.coursera.org/specializations/data-engineering-foundations' },
      { title: 'Ingest an open API into a warehouse', provider: 'Hands-on Project', kind: 'project', hours: 8, free: true, url: 'https://github.com/datastacktv/data-engineer-roadmap' }
    ]
  },
  docker: {
    id: 'docker',
    name: 'Docker',
    aliases: ['Docker', 'containers', 'containerization'],
    tier: 'core',
    hours: 12.5,
    courses: 4,
    growth: 18,
    why: 'Docker is the containerization standard used across data engineering pipelines and cloud deployments — and it appears in half of Cairo tech postings.',
    actions: [
      'Learn images, layers, volumes and networking basics',
      'Containerize one of your existing Python projects',
      'Add the containerized project to your portfolio'
    ],
    prerequisites: ['python'],
    salaryUplift: 5,
    resources: [
      { title: 'Docker for data teams', provider: 'YouTube', kind: 'video', hours: 4, free: true, url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo' },
      { title: 'Containers & Orchestration', provider: 'Coursera', kind: 'course', hours: 14, free: false, url: 'https://www.coursera.org/learn/ibm-containers-docker-kubernetes-openshift' },
      { title: 'Docker getting started guide', provider: 'Official Docs', kind: 'docs', hours: 3, free: true, url: 'https://docs.docker.com/get-started/' }
    ]
  },
  airflow: {
    id: 'airflow',
    name: 'Apache Airflow',
    aliases: ['Airflow', 'DAG', 'orchestration'],
    tier: 'core',
    hours: 16.75,
    courses: 5,
    growth: 24,
    why: 'Airflow is the leading workflow orchestration tool for data pipelines and adoption across MENA is growing faster than any other scheduler.',
    actions: [
      'Learn DAGs, operators, sensors and scheduling',
      'Orchestrate a two-step pipeline you already built',
      'Add alerting and a backfill run to the DAG'
    ],
    prerequisites: ['python', 'etl'],
    salaryUplift: 6,
    resources: [
      { title: 'Airflow from zero to DAGs', provider: 'YouTube', kind: 'video', hours: 6, free: true, url: 'https://www.youtube.com/watch?v=K9AnJ9_ZAXE' },
      { title: 'Orchestrating Data Pipelines', provider: 'Coursera', kind: 'course', hours: 20, free: false, url: 'https://www.coursera.org/learn/data-engineering-pipelines' },
      { title: 'Airflow concepts documentation', provider: 'Official Docs', kind: 'docs', hours: 4, free: true, url: 'https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/index.html' }
    ]

  },
  'data-modeling': {
    id: 'data-modeling',
    name: 'Data Modeling',
    aliases: ['Data Modeling', 'Data Modelling', 'dimensional modeling', 'star schema'],
    tier: 'core',
    hours: 9,
    courses: 3,
    growth: 7,
    why: 'Modeling is what separates a report writer from an engineer — it is asked about in almost every technical interview loop.',
    actions: [
    'Model one business process as a star schema',
    'Define grain, facts, dimensions and slowly changing rules',
    'Review the model against three real questions it must answer'],

    prerequisites: ['sql'],
    salaryUplift: 4,
    resources: [
      { title: 'Dimensional modeling explained', provider: 'YouTube', kind: 'video', hours: 3, free: true, url: 'https://www.youtube.com/watch?v=f0U_Rz3Y4J0' },
      { title: 'Data Warehouse Design', provider: 'Coursera', kind: 'course', hours: 12, free: false, url: 'https://www.coursera.org/learn/data-warehouse-design' },
      { title: 'Model a retail sales mart', provider: 'Hands-on Project', kind: 'project', hours: 6, free: true, url: 'https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/' }
    ]
  },
  postgresql: {
    id: 'postgresql',
    name: 'PostgreSQL',
    aliases: ['PostgreSQL', 'Postgres'],
    tier: 'core',
    hours: 8.25,
    courses: 3,
    growth: 8,
    why: 'Postgres is the default operational database for Egyptian startups, so hands-on administration shows you can work close to production.',
    actions: [
      'Set up a local instance and load a real dataset',
      'Practice indexing, explain plans and query tuning',
      'Automate a backup and restore cycle'
    ],
    prerequisites: ['sql'],
    salaryUplift: 3,
    resources: [
      { title: 'PostgreSQL performance basics', provider: 'YouTube', kind: 'video', hours: 3, free: true, url: 'https://www.youtube.com/watch?v=qw--VYLpxG4' },
      { title: 'Relational Databases in Practice', provider: 'Coursera', kind: 'course', hours: 10, free: false, url: 'https://www.coursera.org/learn/relational-database-basics' },
      { title: 'PostgreSQL manual', provider: 'Official Docs', kind: 'docs', hours: 4, free: true, url: 'https://www.postgresql.org/docs/' }
    ]
  },
  spark: {
    id: 'spark',
    name: 'Apache Spark',
    aliases: ['Spark', 'PySpark'],
    tier: 'advanced',
    hours: 10.65,
    courses: 4,
    growth: 12,
    why: 'Spark shows up once companies outgrow single-machine processing — valuable, but usually after the core pipeline stack is in place.',
    actions: [
      'Learn RDDs, DataFrames and the execution model',
      'Reprocess a large dataset with PySpark',
      'Benchmark it against your pandas version'
    ],
    prerequisites: ['python', 'etl'],
    salaryUplift: 5,
    resources: [
      { title: 'PySpark in one evening', provider: 'YouTube', kind: 'video', hours: 4, free: true, url: 'https://www.youtube.com/watch?v=_C8kWso4dU4' },
      { title: 'Big Data Processing', provider: 'Coursera', kind: 'course', hours: 16, free: false, url: 'https://www.coursera.org/learn/big-data-processing-spark' },
      { title: 'Spark SQL guide', provider: 'Official Docs', kind: 'docs', hours: 3, free: true, url: 'https://spark.apache.org/docs/latest/sql-programming-guide.html' }
    ]
  },
  kafka: {
    id: 'kafka',
    name: 'Apache Kafka',
    aliases: ['Kafka', 'event streaming'],
    tier: 'advanced',
    hours: 14.3,
    courses: 6,
    growth: 9,
    why: 'Kafka is powerful for real-time streaming but is mostly required in senior or specialised backend roles, so it pays off later.',
    actions: [
      'Understand topics, partitions, producers and consumers',
      'Stream one live feed into a storage layer',
      'Add consumer-group monitoring to the setup'
    ],
    prerequisites: ['python', 'docker'],
    salaryUplift: 7,
    resources: [
      { title: 'Kafka fundamentals', provider: 'YouTube', kind: 'video', hours: 5, free: true, url: 'https://www.youtube.com/watch?v=Ch5VhJzaoaI' },
      { title: 'Streaming Systems', provider: 'Coursera', kind: 'course', hours: 22, free: false, url: 'https://www.coursera.org/learn/distributed-programming-in-java' },
      { title: 'Kafka documentation', provider: 'Official Docs', kind: 'docs', hours: 5, free: true, url: 'https://kafka.apache.org/documentation/' }
    ]
  },
  dbt: {
    id: 'dbt',
    name: 'dbt',
    aliases: ['dbt', 'analytics engineering'],
    tier: 'advanced',
    hours: 6,
    courses: 2,
    growth: 31,
    why: 'dbt is the fastest-growing tool in analytics engineering job posts and turns your SQL into tested, versioned transformations.',
    actions: [
      'Convert three ad-hoc queries into dbt models',
      'Add tests, docs and a lineage graph',
      'Run the project on a schedule'
    ],
    prerequisites: ['sql', 'data-modeling'],
    salaryUplift: 4,
    resources: [
      { title: 'dbt in 60 minutes', provider: 'YouTube', kind: 'video', hours: 2, free: true, url: 'https://www.youtube.com/watch?v=4eGJ4b0L724' },
      { title: 'Analytics Engineering with dbt', provider: 'Coursera', kind: 'course', hours: 10, free: false, url: 'https://courses.getdbt.com/courses/fundamentals' },
      { title: 'dbt developer hub', provider: 'Official Docs', kind: 'docs', hours: 3, free: true, url: 'https://docs.getdbt.com/' }
    ]
  },
  snowflake: {
    id: 'snowflake',
    name: 'Snowflake',
    aliases: ['Snowflake'],
    tier: 'advanced',
    hours: 7.5,
    courses: 3,
    growth: 21,
    why: 'Cloud warehouses are replacing on-prem stacks in the region, and Snowflake is the one most Egyptian scale-ups migrate to.',
    actions: [
      'Load a dataset and model it in a warehouse schema',
      'Practice warehouse sizing, roles and cost controls',
      'Connect a BI tool to your warehouse'
    ],
    prerequisites: ['sql', 'data-modeling'],
    salaryUplift: 5,
    resources: [
      { title: 'Snowflake architecture explained', provider: 'YouTube', kind: 'video', hours: 3, free: true, url: 'https://www.youtube.com/watch?v=vY3u3WvLg_k' },
      { title: 'Cloud Data Warehousing', provider: 'Coursera', kind: 'course', hours: 12, free: false, url: 'https://www.coursera.org/learn/data-warehouse-concepts' },
      { title: 'Snowflake quickstarts', provider: 'Official Docs', kind: 'docs', hours: 4, free: true, url: 'https://quickstarts.snowflake.com/' }
    ]
  },
  powerbi: {
    id: 'powerbi',
    name: 'Power BI',
    aliases: ['Power BI', 'PowerBI'],
    tier: 'core',
    hours: 9,
    courses: 3,
    growth: 6,
    why: 'Power BI is the reporting layer most Egyptian enterprises standardise on, so it is the fastest route to visible business impact.',
    actions: [
      'Rebuild one manual report as a refreshable dashboard',
      'Model the data behind it properly before visualising',
      'Share it with a stakeholder and iterate once'
    ],
    prerequisites: ['sql'],
    salaryUplift: 3,
    resources: [
      { title: 'Power BI end-to-end project', provider: 'YouTube', kind: 'video', hours: 4, free: true, url: 'https://www.youtube.com/watch?v=TmhQCQr_8CA' },
      { title: 'Business Intelligence with Power BI', provider: 'Coursera', kind: 'course', hours: 14, free: false, url: 'https://www.coursera.org/learn/microsoft-power-bi-data-analyst' },
      { title: 'Power BI learning path', provider: 'Official Docs', kind: 'docs', hours: 5, free: true, url: 'https://learn.microsoft.com/en-us/training/powerplatform/power-bi' }
    ]
  },
  dax: {
    id: 'dax',
    name: 'DAX',
    aliases: ['DAX'],
    tier: 'core',
    hours: 6.5,
    courses: 2,
    growth: 5,
    why: 'DAX is where Power BI reports either scale or fall apart, and interviewers use it to test real modelling understanding.',
    actions: [
      'Master filter context, CALCULATE and time intelligence',
      'Rewrite three measures to be filter-safe',
      'Document the measure logic for reviewers'
    ],
    prerequisites: ['powerbi'],
    salaryUplift: 2,
    resources: [
      { title: 'DAX filter context masterclass', provider: 'YouTube', kind: 'video', hours: 3, free: true, url: 'https://www.youtube.com/watch?v=482vW4-X72o' },
      { title: 'Advanced DAX Patterns', provider: 'Coursera', kind: 'course', hours: 9, free: false, url: 'https://www.daxpatterns.com/' },
      { title: 'DAX function reference', provider: 'Official Docs', kind: 'docs', hours: 3, free: true, url: 'https://learn.microsoft.com/en-us/dax/' }
    ]
  },
  excel: {
    id: 'excel',
    name: 'Advanced Excel',
    aliases: ['Excel', 'Power Query', 'Google Sheets'],
    tier: 'foundation',
    hours: 5,
    courses: 2,
    growth: 2,
    why: 'Excel is still the language business stakeholders speak, and Power Query skills carry directly into modern BI tooling.',
    actions: [
      'Rebuild a manual workbook with Power Query',
      'Replace nested formulas with structured references',
      'Turn the workbook into a reusable template'
    ],
    prerequisites: [],
    salaryUplift: 1,
    resources: [
      { title: 'Power Query for analysts', provider: 'YouTube', kind: 'video', hours: 3, free: true, url: 'https://www.youtube.com/watch?v=yYmCqY1H_6Q' },
      { title: 'Excel Skills for Business', provider: 'Coursera', kind: 'course', hours: 10, free: false, url: 'https://www.coursera.org/specializations/excel' },
      { title: 'Clean a messy workbook', provider: 'Hands-on Project', kind: 'project', hours: 4, free: true, url: 'https://support.microsoft.com/en-us/office/power-query-overview-and-learning' }
    ]
  },
  tableau: {
    id: 'tableau',
    name: 'Tableau',
    aliases: ['Tableau'],
    tier: 'core',
    hours: 7,
    courses: 3,
    growth: 4,
    why: 'Multinationals operating in Egypt often standardise on Tableau, so it widens the set of employers you can apply to.',
    actions: [
      'Recreate one Power BI dashboard in Tableau',
      'Learn LOD expressions and dashboard actions',
      'Publish the workbook to Tableau Public'
    ],
    prerequisites: ['data-viz'],
    salaryUplift: 2,
    resources: [
      { title: 'Tableau desktop essentials', provider: 'YouTube', kind: 'video', hours: 4, free: true, url: 'https://www.youtube.com/watch?v=f_sm7j3d5pY' },
      { title: 'Data Visualization with Tableau', provider: 'Coursera', kind: 'course', hours: 12, free: false, url: 'https://www.coursera.org/specializations/data-visualization' },
      { title: 'Tableau Public gallery', provider: 'Hands-on Project', kind: 'project', hours: 5, free: true, url: 'https://public.tableau.com/app/discover' }
    ]
  },
  statistics: {
    id: 'statistics',
    name: 'Statistical Analysis',
    aliases: ['Statistical Analysis', 'Statistics', 'A/B Testing', 'hypothesis testing'],
    tier: 'core',
    hours: 8,
    courses: 3,
    growth: 6,
    why: 'Statistics is what makes your insights defensible in a stakeholder review instead of just descriptive.',
    actions: [
      'Run a hypothesis test on a real business question',
      'Learn confidence intervals and effect size reporting',
      'Write up one experiment readout'
    ],
    prerequisites: [],
    salaryUplift: 3,
    resources: [
      { title: 'Practical statistics for analysts', provider: 'YouTube', kind: 'video', hours: 4, free: true, url: 'https://www.youtube.com/watch?v=xxpc-HPKN28' },
      { title: 'Inferential Statistics', provider: 'Coursera', kind: 'course', hours: 14, free: false, url: 'https://www.coursera.org/learn/inferential-statistics-intro' },
      { title: 'Design an A/B test readout', provider: 'Hands-on Project', kind: 'project', hours: 5, free: true, url: 'https://online.stat.psu.edu/stat500/' }
    ]
  },
  'data-viz': {
    id: 'data-viz',
    name: 'Data Visualization',
    aliases: ['Data Visualization', 'Data Visualisation', 'dashboards', 'dashboard'],
    tier: 'foundation',
    hours: 6,
    courses: 2,
    growth: 5,
    why: 'Clear visual communication is the skill hiring managers judge in every portfolio review, whatever the tool.',
    actions: [
      'Redesign one cluttered chart around a single message',
      'Build a dashboard with a clear visual hierarchy',
      'Get feedback from a non-technical reader'
    ],
    prerequisites: [],
    salaryUplift: 2,
    resources: [
      { title: 'Storytelling with data', provider: 'YouTube', kind: 'video', hours: 3, free: true, url: 'https://www.youtube.com/watch?v=8EMW7io4rSI' },
      { title: 'Data Visualization Principles', provider: 'Coursera', kind: 'course', hours: 8, free: false, url: 'https://www.coursera.org/learn/visual-analytics' },
      { title: 'Redesign a public dashboard', provider: 'Hands-on Project', kind: 'project', hours: 5, free: true, url: 'https://www.storytellingwithdata.com/' }
    ]
  }
};

export const ROLES: RoleDefinition[] = [
  {
    id: 'data-engineer',
    name: 'Data Engineer',
    nameAr: 'مهندس بيانات',
    city: 'Cairo',
    cityAr: 'القاهرة',
    blurb: 'Build and run the pipelines that every analytics team depends on.',
    blurbAr: 'بناء وتشغيل خطوط معالجة وتدفق البيانات التي تعتمد عليها كافة فرق التحليل والذكاء الاصطناعي.',
    openJobs: 1247,
    salaryEgpK: 28,
    yoyGrowth: 24,
    timeToHireDays: 32,
    coreSkills: [
      { skillId: 'sql', demand: 78 },
      { skillId: 'python', demand: 71 },
      { skillId: 'etl', demand: 63 },
      { skillId: 'docker', demand: 52 },
      { skillId: 'git', demand: 44 },
      { skillId: 'airflow', demand: 41 },
      { skillId: 'data-modeling', demand: 38 },
      { skillId: 'postgresql', demand: 34 },
      { skillId: 'spark', demand: 27 },
      { skillId: 'kafka', demand: 22 }
    ]
  },
  {
    id: 'analytics-engineer',
    name: 'Analytics Engineer',
    nameAr: 'مهندس تحليلات بيانات',
    city: 'Cairo',
    cityAr: 'القاهرة',
    blurb: 'Turn raw warehouse tables into trusted, tested data products.',
    blurbAr: 'تحويل جداول المستودعات الخام إلى منتجات بيانات موثوقة ومختبرة وجاهزة لصناع القرار.',
    openJobs: 486,
    salaryEgpK: 26,
    yoyGrowth: 31,
    timeToHireDays: 28,
    coreSkills: [
      { skillId: 'sql', demand: 82 },
      { skillId: 'python', demand: 55 },
      { skillId: 'data-modeling', demand: 51 },
      { skillId: 'dbt', demand: 47 },
      { skillId: 'git', demand: 46 },
      { skillId: 'powerbi', demand: 38 },
      { skillId: 'statistics', demand: 35 },
      { skillId: 'snowflake', demand: 33 },
      { skillId: 'excel', demand: 30 },
      { skillId: 'airflow', demand: 24 }
    ]
  },
  {
    id: 'bi-developer',
    name: 'BI Developer',
    nameAr: 'مطور ذكاء الأعمال (BI Developer)',
    city: 'Cairo',
    cityAr: 'القاهرة',
    blurb: 'Own the reporting layer the whole business makes decisions on.',
    blurbAr: 'تطوير لوحات التحكم والتقارير التفاعلية التي تتخذ الشركات قراراتها الاستراتيجية بناءً عليها.',
    openJobs: 934,
    salaryEgpK: 22,
    yoyGrowth: 12,
    timeToHireDays: 24,
    coreSkills: [
      { skillId: 'sql', demand: 79 },
      { skillId: 'powerbi', demand: 74 },
      { skillId: 'excel', demand: 58 },
      { skillId: 'dax', demand: 52 },
      { skillId: 'data-modeling', demand: 44 },
      { skillId: 'tableau', demand: 41 },
      { skillId: 'etl', demand: 36 },
      { skillId: 'statistics', demand: 33 },
      { skillId: 'python', demand: 31 },
      { skillId: 'git', demand: 29 }
    ]
  },
  {
    id: 'senior-data-analyst',
    name: 'Senior Data Analyst',
    nameAr: 'محلل بيانات أول (Senior Data Analyst)',
    city: 'Cairo',
    cityAr: 'القاهرة',
    blurb: 'Lead the analysis that shapes product and commercial decisions.',
    blurbAr: 'قيادة التحليلات الإحصائية والتجارية المتقدمة لتوجيه مسار المنتجات والنمو المالي.',
    openJobs: 1610,
    salaryEgpK: 20,
    yoyGrowth: 9,
    timeToHireDays: 21,
    coreSkills: [
      { skillId: 'sql', demand: 81 },
      { skillId: 'excel', demand: 69 },
      { skillId: 'powerbi', demand: 57 },
      { skillId: 'python', demand: 54 },
      { skillId: 'data-viz', demand: 52 },
      { skillId: 'statistics', demand: 48 },
      { skillId: 'tableau', demand: 39 },
      { skillId: 'dax', demand: 34 },
      { skillId: 'etl', demand: 29 },
      { skillId: 'git', demand: 28 }
    ]
  }
];


export const DEFAULT_ROLE_ID = 'data-engineer';

export const WEEKLY_HOUR_OPTIONS = [2, 4, 6, 10, 15];
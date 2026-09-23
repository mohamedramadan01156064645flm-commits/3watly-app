import type { RoleDefinition, SkillDefinition } from '../types/skills';

export const SKILLS: Record<string, SkillDefinition> = {
  sql: {
    id: 'sql',
    name: 'SQL',
    aliases: [
      'SQL', 'T-SQL', 'TSQL', 'PL/SQL', 'PLSQL', 'PostgreSQL', 'Postgres',
      'MySQL', 'MSSQL', 'MS SQL', 'SQL Server', 'SQLite', 'Oracle SQL', 'Structured Query Language'
    ],
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
      { title: "SQL Full Database Course for Beginners", provider: "freeCodeCamp", kind: "video", hours: 4, free: true, url: "https://www.youtube.com/watch?v=HXV3zeQKqGY" },
      { title: "SQL for Data Science", provider: "Coursera", kind: "course", hours: 14, free: false, url: "https://www.coursera.org/learn/sql-for-data-science" },
      { title: "SQL & Window Functions Interactive Reference", provider: "Mode Analytics", kind: "docs", hours: 3, free: true, url: "https://mode.com/sql-tutorial/sql-window-functions" },
      { title: "SQL Data Cleaning & Analysis Portfolio Project", provider: "GitHub", kind: "project", hours: 6, free: true, url: "https://github.com/AlexTheAnalyst/PortfolioProjects/blob/main/Data%20Cleaning%20Portfolio%20Project%20Queries.sql" }
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
      { title: "Python for Beginners — Full 14-Hour Course", provider: "freeCodeCamp", kind: "video", hours: 14, free: true, url: "https://www.youtube.com/watch?v=8DvywoWv6fI" },
      { title: "Python for Everybody Specialization", provider: "Coursera", kind: "course", hours: 24, free: false, url: "https://www.coursera.org/specializations/python" },
      { title: "Python 3 Official Tutorial & Documentation", provider: "Python Docs", kind: "docs", hours: 4, free: true, url: "https://docs.python.org/3/tutorial/" },
      { title: "Data Cleaning & Web Scraping Portfolio Project", provider: "GitHub", kind: "project", hours: 6, free: true, url: "https://github.com/AlexTheAnalyst/PortfolioProjects/blob/main/Amazon%20Web%20Scraper%20Project.ipynb" }
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
      { title: "Git & GitHub Crash Course for Beginners", provider: "freeCodeCamp", kind: "video", hours: 3, free: true, url: "https://www.youtube.com/watch?v=RGOj5yH7evk" },
      { title: "Version Control with Git", provider: "Coursera", kind: "course", hours: 8, free: false, url: "https://www.coursera.org/learn/version-control-with-git" },
      { title: "Pro Git Official Guide & Reference", provider: "Git-SCM", kind: "docs", hours: 4, free: true, url: "https://git-scm.com/book/en/v2" },
      { title: "Learn Git Branching (Interactive Visual Sandbox)", provider: "LearnGitBranching", kind: "project", hours: 3, free: true, url: "https://learngitbranching.js.org/" }
    ]
  },
  etl: {
    id: 'etl',
    name: 'ETL Pipelines',
    aliases: [
      'ETL', 'ELT',
      'ETL Pipeline', 'ETL Pipelines', 'ETL pipline', 'ETL piplines',
      'Extract Transform Load', 'Extract, Transform, Load', 'Extract-Transform-Load',
      'data pipeline', 'data pipelines', 'data pipline', 'data piplines',
      'data ingestion', 'data extraction', 'data integration',
      'pipeline', 'pipelines', 'pipline', 'piplines'
    ],
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
      { title: "Building an End-to-End Data Pipeline from Scratch", provider: "YouTube", kind: "video", hours: 5, free: true, url: "https://www.youtube.com/watch?v=qWru-b6m030" },
      { title: "Data Engineering Foundations Specialization", provider: "Coursera", kind: "course", hours: 20, free: false, url: "https://www.coursera.org/specializations/data-engineering-foundations" },
      { title: "Data Engineering Zoomcamp (Full Free Curriculum)", provider: "DataTalks.Club", kind: "docs", hours: 8, free: true, url: "https://github.com/DataTalksClub/data-engineering-zoomcamp" },
      { title: "End-to-End Data Engineering Tutorial Series & Code", provider: "GitHub", kind: "project", hours: 8, free: true, url: "https://github.com/darshilparmar/Data-Engineer-Tutorial-Series" }
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
      { title: "Docker Full Course for Beginners", provider: "freeCodeCamp", kind: "video", hours: 4, free: true, url: "https://www.youtube.com/watch?v=fqMOX6JJhGo" },
      { title: "Introduction to Containers with Docker & Kubernetes", provider: "Coursera", kind: "course", hours: 12, free: false, url: "https://www.coursera.org/learn/ibm-containers-docker-kubernetes-openshift" },
      { title: "Docker Getting Started Guide", provider: "Docker Docs", kind: "docs", hours: 3, free: true, url: "https://docs.docker.com/get-started/" },
      { title: "Docker Compose Containerized Data Pipeline", provider: "GitHub", kind: "project", hours: 6, free: true, url: "https://github.com/DataTalksClub/data-engineering-zoomcamp/tree/main/01-docker-terraform" }
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
      { title: "Apache Airflow Complete Course for Beginners", provider: "YouTube", kind: "video", hours: 5, free: true, url: "https://www.youtube.com/watch?v=K9AnJ9_ZAXE" },
      { title: "ETL and Data Pipelines with Shell, Airflow & Kafka", provider: "Coursera", kind: "course", hours: 14, free: false, url: "https://www.coursera.org/learn/etl-and-data-pipelines-shell-airflow-kafka" },
      { title: "Airflow Core Concepts & TaskFlow API Docs", provider: "Apache Airflow Docs", kind: "docs", hours: 4, free: true, url: "https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/index.html" },
      { title: "End-to-End Real-Time Data Pipeline with Airflow", provider: "GitHub", kind: "project", hours: 8, free: true, url: "https://github.com/airscholar/e2e-data-engineering" }
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
      { title: 'Dimensional modeling explained', provider: 'YouTube', kind: 'video', hours: 3, free: true, url: 'https://www.youtube.com/watch?v=aEGan35iBbE' },
      { title: 'Data Warehouse Design', provider: 'Coursera', kind: 'course', hours: 12, free: true, url: 'https://www.youtube.com/watch?v=GTvRjJlJ_b4' },
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
      { title: "PostgreSQL Full Course for Beginners", provider: "freeCodeCamp", kind: "video", hours: 4, free: true, url: "https://www.youtube.com/watch?v=qw--VYLpxG4" },
      { title: "PostgreSQL for Everybody Specialization", provider: "Coursera", kind: "course", hours: 16, free: false, url: "https://www.coursera.org/specializations/postgresql-for-everybody" },
      { title: "Official PostgreSQL Manual & Reference", provider: "PostgreSQL Docs", kind: "docs", hours: 4, free: true, url: "https://www.postgresql.org/docs/" },
      { title: "Northwind Database SQL Analytics & Schema", provider: "GitHub", kind: "project", hours: 5, free: true, url: "https://github.com/pthom/northwind_psql" }
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
      { title: "PySpark Tutorial — Full Course Zero to Pro", provider: "YouTube", kind: "video", hours: 6, free: true, url: "https://www.youtube.com/watch?v=y8L6m2e987c" },
      { title: "Big Data Specialization with Apache Spark", provider: "Coursera", kind: "course", hours: 24, free: false, url: "https://www.coursera.org/specializations/big-data" },
      { title: "PySpark SQL Programming Guide", provider: "Apache Spark Docs", kind: "docs", hours: 4, free: true, url: "https://spark.apache.org/docs/latest/sql-programming-guide.html" },
      { title: "Spark Batch Processing on Real-world Taxi Dataset", provider: "GitHub", kind: "project", hours: 6, free: true, url: "https://github.com/DataTalksClub/data-engineering-zoomcamp/tree/main/05-batch" }
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
      { title: "Apache Kafka Crash Course (KRaft Mode & Docker)", provider: "YouTube", kind: "video", hours: 4, free: true, url: "https://www.youtube.com/watch?v=R873BlNVUB4" },
      { title: "Confluent Kafka Developer Learning Path", provider: "Confluent Developer", kind: "course", hours: 12, free: true, url: "https://developer.confluent.io/courses/" },
      { title: "Apache Kafka Official Documentation", provider: "Apache Kafka Docs", kind: "docs", hours: 5, free: true, url: "https://kafka.apache.org/documentation/" },
      { title: "Real-Time Streaming Pipeline with Kafka & Docker", provider: "GitHub", kind: "project", hours: 8, free: true, url: "https://github.com/airscholar/e2e-data-engineering" }
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
      { title: "dbt (Data Build Tool) Complete Tutorial with CI/CD", provider: "YouTube", kind: "video", hours: 5, free: true, url: "https://www.youtube.com/watch?v=4eGJ4b0L724" },
      { title: "dbt Fundamentals (Official Free Certification)", provider: "dbt Labs", kind: "course", hours: 5, free: true, url: "https://courses.getdbt.com/courses/fundamentals" },
      { title: "dbt Official Developer Documentation", provider: "dbt Docs", kind: "docs", hours: 3, free: true, url: "https://docs.getdbt.com/" },
      { title: "Production dbt Transformations with Jaffle Shop", provider: "GitHub", kind: "project", hours: 6, free: true, url: "https://github.com/dbt-labs/jaffle_shop" }
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
      { title: "Snowflake Cloud Data Warehouse Full Course", provider: "YouTube", kind: "video", hours: 4, free: true, url: "https://www.youtube.com/watch?v=vY3u3WvLg_k" },
      { title: "Snowflake Hands-on Essentials & Badges", provider: "Snowflake Learn", kind: "course", hours: 10, free: true, url: "https://learn.snowflake.com/" },
      { title: "Snowflake Official Documentation", provider: "Snowflake Docs", kind: "docs", hours: 4, free: true, url: "https://docs.snowflake.com/" },
      { title: "Data Engineering Pipelines with Snowflake Quickstart", provider: "Snowflake Quickstarts", kind: "project", hours: 5, free: true, url: "https://quickstarts.snowflake.com/" }
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
      { title: "Power BI Full Course — Beginner to Advanced", provider: "YouTube", kind: "video", hours: 4, free: true, url: "https://www.youtube.com/watch?v=TmhQCQr_8CA" },
      { title: "Microsoft Power BI Data Analyst Professional Certificate", provider: "Coursera", kind: "course", hours: 24, free: false, url: "https://www.coursera.org/professional-certificates/microsoft-power-bi-data-analyst" },
      { title: "Microsoft Power BI Official Learning Path", provider: "Microsoft Learn", kind: "docs", hours: 6, free: true, url: "https://learn.microsoft.com/en-us/training/powerplatform/power-bi" },
      { title: "End-to-End Power BI Portfolio Dashboard Project", provider: "GitHub", kind: "project", hours: 6, free: true, url: "https://github.com/AlexTheAnalyst/PortfolioProjects/blob/main/Power%20BI%20Project.pbix" }
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
      { title: "DAX Filter Context Masterclass (SQLBI)", provider: "YouTube", kind: "video", hours: 3, free: true, url: "https://www.youtube.com/watch?v=482vW4-X72o" },
      { title: "Introducing DAX Video Course", provider: "SQLBI", kind: "course", hours: 6, free: true, url: "https://www.sqlbi.com/p/introducing-dax-video-course/" },
      { title: "DAX Functions Reference Guide", provider: "DAX Guide", kind: "docs", hours: 3, free: true, url: "https://dax.guide/" },
      { title: "DAX Calculation Patterns & Financial Models", provider: "DAX Patterns", kind: "project", hours: 5, free: true, url: "https://www.daxpatterns.com/" }
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
      { title: "Excel for Data Analysts — Full 5-Hour Course", provider: "freeCodeCamp", kind: "video", hours: 5, free: true, url: "https://www.youtube.com/watch?v=PSNXoAs2FtQ" },
      { title: "Excel Skills for Business Specialization", provider: "Coursera", kind: "course", hours: 18, free: false, url: "https://www.coursera.org/specializations/excel" },
      { title: "Excel Functions & Formulas Reference", provider: "ExcelJet", kind: "docs", hours: 2, free: true, url: "https://exceljet.net/formulas" },
      { title: "Excel Sales & Customer Dashboard Project Dataset", provider: "GitHub", kind: "project", hours: 5, free: true, url: "https://github.com/AlexTheAnalyst/PortfolioProjects/blob/main/Excel%20Project%20Dataset.xlsx" }
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
      { title: "Tableau Desktop Full Course for Beginners", provider: "freeCodeCamp", kind: "video", hours: 4, free: true, url: "https://www.youtube.com/watch?v=f_sm7j3d5pY" },
      { title: "Data Visualization with Tableau Specialization", provider: "Coursera", kind: "course", hours: 16, free: false, url: "https://www.coursera.org/specializations/data-visualization" },
      { title: "Tableau Official Video Training & Guides", provider: "Tableau", kind: "docs", hours: 6, free: true, url: "https://www.tableau.com/learn/training" },
      { title: "Tableau Public Interactive Portfolio Gallery", provider: "Tableau Public", kind: "project", hours: 5, free: true, url: "https://public.tableau.com/app/discover" }
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
      { title: "Statistics — Full University Course on Data Science", provider: "freeCodeCamp", kind: "video", hours: 8, free: true, url: "https://www.youtube.com/watch?v=Xn7KWR9EO40" },
      { title: "Basic Statistics (University of Amsterdam)", provider: "Coursera", kind: "course", hours: 14, free: false, url: "https://www.coursera.org/learn/basic-statistics" },
      { title: "Applied Statistics STAT 500 Online Handbook", provider: "Penn State Online", kind: "docs", hours: 8, free: true, url: "https://online.stat.psu.edu/stat500/" },
      { title: "Exploratory Data Analysis & Correlation Project in Python", provider: "GitHub", kind: "project", hours: 5, free: true, url: "https://github.com/AlexTheAnalyst/PortfolioProjects/blob/main/Movie%20Industry%20Correlation%20Project.ipynb" }
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
      { title: 'Storytelling with Data Masterclass', provider: 'YouTube', kind: 'video', hours: 3, free: true, url: 'https://www.youtube.com/watch?v=8EMW7io4rSI' },
      { title: 'Data Visualization Principles', provider: 'Coursera', kind: 'course', hours: 8, free: true, url: 'https://datavizcatalogue.com/' },
      { title: 'Redesign a Public Dashboard Project', provider: 'Hands-on Project', kind: 'project', hours: 5, free: true, url: 'https://www.storytellingwithdata.com/' }
    ]
  },
  react: {
    id: 'react',
    name: 'React.js',
    aliases: ['React', 'React.js', 'ReactJS'],
    tier: 'core',
    hours: 12,
    courses: 4,
    growth: 15,
    why: 'React is the undisputed market leader for building dynamic, high-performance web frontends and UI components.',
    actions: ['Build an interactive component with hooks and state', 'Implement responsive UI layouts with Tailwind', 'Deploy a production app on Vercel'],
    prerequisites: ['javascript'],
    salaryUplift: 5,
    resources: [
      { title: 'React 18 / 19 Full Course for Beginners', provider: 'freeCodeCamp', kind: 'video', hours: 12, free: true, url: 'https://www.youtube.com/watch?v=bMknfKXIFA8' },
      { title: 'Meta React Basics & Advanced Components', provider: 'Coursera', kind: 'course', hours: 20, free: false, url: 'https://www.coursera.org/learn/react-basics' },
      { title: 'Official React.dev Documentation & Interactive Sandbox', provider: 'React Docs', kind: 'docs', hours: 4, free: true, url: 'https://react.dev/' },
      { title: 'Fullstack React Dashboard Portfolio Project', provider: 'GitHub', kind: 'project', hours: 8, free: true, url: 'https://github.com/adrianhajdin/project_syncfusion_dashboard' }
    ]
  },
  nextjs: {
    id: 'nextjs',
    name: 'Next.js',
    aliases: ['Next.js', 'NextJS', 'Next 14', 'Next 15'],
    tier: 'advanced',
    hours: 10,
    courses: 4,
    growth: 28,
    why: 'Next.js provides SSR, SSG, Server Actions, and API routes for scalable modern production web applications.',
    actions: ['Build an app with Server Components and App Router', 'Integrate Auth and Supabase with Route Handlers', 'Optimize Core Web Vitals'],
    prerequisites: ['react', 'typescript'],
    salaryUplift: 6,
    resources: [
      { title: 'Next.js 14 / 15 Full Tutorial for Beginners', provider: 'freeCodeCamp', kind: 'video', hours: 6, free: true, url: 'https://www.youtube.com/watch?v=wm5gMKuwSYk' },
      { title: 'Vercel Official Next.js Interactive Curriculum', provider: 'Vercel Learn', kind: 'course', hours: 8, free: true, url: 'https://nextjs.org/learn' },
      { title: 'Next.js Official Documentation', provider: 'Next.js Docs', kind: 'docs', hours: 4, free: true, url: 'https://nextjs.org/docs' },
      { title: 'Fullstack Next.js & Tailwind SaaS Platform Repo', provider: 'GitHub', kind: 'project', hours: 10, free: true, url: 'https://github.com/shadcn/taxonomy' }
    ]
  },
  typescript: {
    id: 'typescript',
    name: 'TypeScript',
    aliases: ['TypeScript', 'TS'],
    tier: 'foundation',
    hours: 6,
    courses: 3,
    growth: 22,
    why: 'TypeScript brings type safety, developer velocity, and robust contracts to modern frontend and backend codebases.',
    actions: ['Type an untyped JavaScript codebase', 'Master Generics and Discriminated Unions', 'Configure strict tsconfig compiler options'],
    prerequisites: ['javascript'],
    salaryUplift: 4,
    resources: [
      { title: 'TypeScript Full Course for Beginners', provider: 'freeCodeCamp', kind: 'video', hours: 5, free: true, url: 'https://www.youtube.com/watch?v=gp5H0Vw39yw' },
      { title: 'TypeScript Handbook Official Guide', provider: 'TypeScript Docs', kind: 'docs', hours: 4, free: true, url: 'https://www.typescriptlang.org/docs/handbook/intro.html' },
      { title: 'Type-Safe Fullstack Architecture Pattern', provider: 'GitHub', kind: 'project', hours: 6, free: true, url: 'https://github.com/colinhacks/zod' }
    ]
  },
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    aliases: ['JavaScript', 'JS', 'ES6+'],
    tier: 'foundation',
    hours: 8,
    courses: 3,
    growth: 10,
    why: 'JavaScript is the fundamental core language powering all web browsers and modern runtime servers.',
    actions: ['Master Async/Await, Promises, and the Event Loop', 'Manipulate DOM and handle events cleanly', 'Build a real-time web app'],
    prerequisites: [],
    salaryUplift: 3,
    resources: [
      { title: 'JavaScript Full Course (Beginner to Advanced)', provider: 'freeCodeCamp', kind: 'video', hours: 8, free: true, url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg' },
      { title: 'MDN Web Docs JavaScript Guide', provider: 'Mozilla MDN', kind: 'docs', hours: 6, free: true, url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
      { title: 'JavaScript 30 Days Coding Challenges Project', provider: 'GitHub', kind: 'project', hours: 8, free: true, url: 'https://github.com/wesbos/JavaScript30' }
    ]
  },
  nodejs: {
    id: 'nodejs',
    name: 'Node.js',
    aliases: ['Node.js', 'Node', 'Express.js', 'Express'],
    tier: 'core',
    hours: 10,
    courses: 4,
    growth: 14,
    why: 'Node.js powers fast, event-driven REST and GraphQL backend services in thousands of tech companies.',
    actions: ['Build a RESTful API with Express & JWT Auth', 'Connect to PostgreSQL / MongoDB with Prisma or Mongoose', 'Deploy backend microservice to cloud'],
    prerequisites: ['javascript'],
    salaryUplift: 5,
    resources: [
      { title: 'Node.js and Express.js Full Course', provider: 'freeCodeCamp', kind: 'video', hours: 8, free: true, url: 'https://www.youtube.com/watch?v=Oe421EPjeBE' },
      { title: 'Server-side Development with NodeJS, Express and MongoDB', provider: 'Coursera', kind: 'course', hours: 18, free: false, url: 'https://www.coursera.org/learn/server-side-nodejs' },
      { title: 'Node.js Official Documentation & API Reference', provider: 'Node.js Docs', kind: 'docs', hours: 4, free: true, url: 'https://nodejs.org/docs/latest/api/' },
      { title: 'Production REST API Boilerplate with JWT & DB', provider: 'GitHub', kind: 'project', hours: 6, free: true, url: 'https://github.com/hagopj13/node-express-boilerplate' }
    ]
  },
  fastapi: {
    id: 'fastapi',
    name: 'FastAPI',
    aliases: ['FastAPI', 'Python API'],
    tier: 'core',
    hours: 8,
    courses: 3,
    growth: 26,
    why: 'FastAPI is the highest-performance Python framework for AI model serving, microservices, and modern APIs.',
    actions: ['Build an async REST API with Pydantic validation', 'Implement OAuth2 / JWT authentication', 'Deploy API with Docker and Uvicorn'],
    prerequisites: ['python'],
    salaryUplift: 5,
    resources: [
      { title: 'FastAPI Tutorial — Full Course for Beginners', provider: 'freeCodeCamp', kind: 'video', hours: 6, free: true, url: 'https://www.youtube.com/watch?v=0sOvCWFmrtA' },
      { title: 'FastAPI Official Documentation & Interactive OpenAPI', provider: 'FastAPI Docs', kind: 'docs', hours: 4, free: true, url: 'https://fastapi.tiangolo.com/' },
      { title: 'Fullstack FastAPI & PostgreSQL Project Template', provider: 'GitHub', kind: 'project', hours: 8, free: true, url: 'https://github.com/fastapi/full-stack-fastapi-template' }
    ]
  },
  'machine-learning': {
    id: 'machine-learning',
    name: 'Machine Learning',
    aliases: ['Machine Learning', 'ML', 'Scikit-Learn'],
    tier: 'advanced',
    hours: 18,
    courses: 4,
    growth: 20,
    why: 'Machine Learning algorithms enable predictive analytics, classification, and data-driven product automation.',
    actions: ['Train and evaluate regression and classification models', 'Implement feature engineering and cross-validation', 'Deploy an ML model via API'],
    prerequisites: ['python', 'statistics'],
    salaryUplift: 7,
    resources: [
      { title: 'Machine Learning Course for Beginners', provider: 'freeCodeCamp', kind: 'video', hours: 10, free: true, url: 'https://www.youtube.com/watch?v=NWONte5ncC5o' },
      { title: 'Machine Learning Specialization (Andrew Ng)', provider: 'Coursera', kind: 'course', hours: 30, free: false, url: 'https://www.coursera.org/specializations/machine-learning-introduction' },
      { title: 'Scikit-Learn Official User Guide', provider: 'Scikit-Learn Docs', kind: 'docs', hours: 6, free: true, url: 'https://scikit-learn.org/stable/user_guide.html' },
      { title: 'End-to-End Machine Learning Projects Repository', provider: 'GitHub', kind: 'project', hours: 10, free: true, url: 'https://github.com/ageron/handson-ml3' }
    ]
  },
  'gen-ai-llm': {
    id: 'gen-ai-llm',
    name: 'Generative AI & LLMs',
    aliases: ['Generative AI', 'LLMs', 'LangChain', 'OpenAI API', 'RAG'],
    tier: 'advanced',
    hours: 14,
    courses: 4,
    growth: 45,
    why: 'Generative AI is transforming career products with intelligent agents, RAG search, and LLM automation.',
    actions: ['Build a Retrieval-Augmented Generation (RAG) system', 'Create multi-agent workflows with LangChain/LangGraph', 'Deploy AI-driven chatbot with vector DB'],
    prerequisites: ['python', 'fastapi'],
    salaryUplift: 8,
    resources: [
      { title: 'Generative AI & LangChain Full Course', provider: 'freeCodeCamp', kind: 'video', hours: 8, free: true, url: 'https://www.youtube.com/watch?v=aywZrzNaKjs' },
      { title: 'Generative AI with Large Language Models', provider: 'Coursera', kind: 'course', hours: 16, free: false, url: 'https://www.coursera.org/learn/generative-ai-with-llms' },
      { title: 'LangChain & Vector Database Official Docs', provider: 'LangChain Docs', kind: 'docs', hours: 5, free: true, url: 'https://python.langchain.com/docs/introduction/' },
      { title: 'Production RAG Chatbot with Vector Search Repo', provider: 'GitHub', kind: 'project', hours: 8, free: true, url: 'https://github.com/run-llama/llama_index' }
    ]
  },
  'r-programming': {
    id: 'r-programming',
    name: 'R Programming',
    aliases: ['R Programming', 'R Language', 'RStudio', 'ggplot2'],
    tier: 'core',
    hours: 10,
    courses: 3,
    growth: 8,
    why: 'R is the standard language for statistical computing, clinical trials, academic research, and advanced bioinformatics.',
    actions: ['Perform exploratory statistical analysis in R', 'Build visualizations with ggplot2 and dplyr', 'Publish an interactive Shiny dashboard'],
    prerequisites: ['statistics'],
    salaryUplift: 4,
    resources: [
      { title: 'R Programming for Beginners — Full Course', provider: 'freeCodeCamp', kind: 'video', hours: 6, free: true, url: 'https://www.youtube.com/watch?v=_V8eKsto3Ug' },
      { title: 'R Programming (Johns Hopkins University)', provider: 'Coursera', kind: 'course', hours: 20, free: false, url: 'https://www.coursera.org/learn/r-programming' },
      { title: 'R for Data Science (Hadley Wickham Official Book)', provider: 'R4DS Book', kind: 'docs', hours: 6, free: true, url: 'https://r4ds.had.co.nz/' },
      { title: 'Interactive Data Science Projects with R Shiny', provider: 'GitHub', kind: 'project', hours: 6, free: true, url: 'https://github.com/rstudio/shiny-examples' }
    ]
  },
  aws: {
    id: 'aws',
    name: 'AWS Cloud',
    aliases: ['AWS', 'Amazon Web Services', 'Cloud Computing'],
    tier: 'core',
    hours: 14,
    courses: 4,
    growth: 19,
    why: 'AWS is the world-leading cloud provider powering scalable infrastructure, databases, and microservices.',
    actions: ['Deploy web application on S3, CloudFront and ECS', 'Configure IAM roles, VPC networks, and RDS databases', 'Build serverless APIs using AWS Lambda and API Gateway'],
    prerequisites: ['linux'],
    salaryUplift: 6,
    resources: [
      { title: 'AWS Certified Cloud Practitioner Full Course', provider: 'freeCodeCamp', kind: 'video', hours: 14, free: true, url: 'https://www.youtube.com/watch?v=SOTamWNgDKc' },
      { title: 'AWS Cloud Solutions Architect Specialization', provider: 'Coursera', kind: 'course', hours: 24, free: false, url: 'https://www.coursera.org/specializations/aws-cloud-solutions-architect' },
      { title: 'AWS Official Architecture Center & Docs', provider: 'AWS Docs', kind: 'docs', hours: 6, free: true, url: 'https://aws.amazon.com/architecture/' },
      { title: 'Terraform AWS Production Infrastructure Blueprint', provider: 'GitHub', kind: 'project', hours: 8, free: true, url: 'https://github.com/antonbabenko/terraform-aws-devops' }
    ]
  },
  flutter: {
    id: 'flutter',
    name: 'Flutter & Dart',
    aliases: ['Flutter', 'Dart', 'Cross-Platform Mobile'],
    tier: 'core',
    hours: 14,
    courses: 4,
    growth: 25,
    why: 'Flutter allows building beautiful, native cross-platform mobile apps for iOS and Android with a single codebase.',
    actions: ['Build a multi-screen mobile app with state management', 'Integrate REST API and Firebase Authentication', 'Publish application to App Store / Google Play'],
    prerequisites: [],
    salaryUplift: 5,
    resources: [
      { title: 'Flutter Course for Beginners — 37 Hours Bootcamp', provider: 'freeCodeCamp', kind: 'video', hours: 37, free: true, url: 'https://www.youtube.com/watch?v=VPvVD8t02U8' },
      { title: 'Flutter & Dart — The Complete Guide', provider: 'Udemy', kind: 'course', hours: 28, free: false, url: 'https://flutter.dev/learn' },
      { title: 'Flutter Official Documentation & Widget Catalog', provider: 'Flutter Docs', kind: 'docs', hours: 6, free: true, url: 'https://docs.flutter.dev/' },
      { title: 'Fullstack Flutter E-Commerce Application Portfolio', provider: 'GitHub', kind: 'project', hours: 10, free: true, url: 'https://github.com/abuanwar072/E-commerce-Complete-Flutter-UI' }
    ]
  },
  cybersecurity: {
    id: 'cybersecurity',
    name: 'Cybersecurity Fundamentals',
    aliases: ['Cybersecurity', 'Security', 'Network Security', 'SOC'],
    tier: 'core',
    hours: 12,
    courses: 3,
    growth: 21,
    why: 'Cybersecurity is critical for protecting corporate data, securing APIs, and ensuring regulatory compliance.',
    actions: ['Conduct vulnerability scans and security audits', 'Configure firewalls, VPNs, and access control policies', 'Analyze network traffic and intrusion detection logs'],
    prerequisites: ['linux'],
    salaryUplift: 6,
    resources: [
      { title: 'Cybersecurity Full Course for Beginners', provider: 'freeCodeCamp', kind: 'video', hours: 8, free: true, url: 'https://www.youtube.com/watch?v=U_P23dqepQ4' },
      { title: 'Google Cybersecurity Professional Certificate', provider: 'Coursera', kind: 'course', hours: 30, free: false, url: 'https://www.coursera.org/professional-certificates/google-cybersecurity' },
      { title: 'NIST Cybersecurity Framework Official Guide', provider: 'NIST Docs', kind: 'docs', hours: 5, free: true, url: 'https://www.nist.gov/cyberframework' }
    ]
  },
  'ui-ux-design': {
    id: 'ui-ux-design',
    name: 'UI/UX Design (Figma)',
    aliases: ['UI/UX', 'Figma', 'Product Design', 'User Research'],
    tier: 'core',
    hours: 10,
    courses: 3,
    growth: 14,
    why: 'Great design bridges user needs with technical execution and is essential for product adoption and customer satisfaction.',
    actions: ['Create wireframes and high-fidelity prototypes in Figma', 'Conduct user interviews and usability testing', 'Build a reusable Design System'],
    prerequisites: [],
    salaryUplift: 4,
    resources: [
      { title: 'Figma UI UX Design Essentials Full Course', provider: 'freeCodeCamp', kind: 'video', hours: 10, free: true, url: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU' },
      { title: 'Google UX Design Professional Certificate', provider: 'Coursera', kind: 'course', hours: 24, free: false, url: 'https://www.coursera.org/professional-certificates/google-ux-design' },
      { title: 'Figma Community Design Systems & Templates', provider: 'Figma Community', kind: 'project', hours: 6, free: true, url: 'https://www.figma.com/community' }
    ]
  },
  tailwind: {
    id: 'tailwind',
    name: 'Tailwind CSS',
    aliases: ['Tailwind', 'TailwindCSS', 'Tailwind CSS'],
    tier: 'core',
    hours: 8,
    courses: 3,
    growth: 25,
    why: 'Tailwind has become the industry standard utility-first CSS framework for rapid, responsive UI development.',
    actions: ['Build a responsive multi-device layout', 'Extract reusable components with Tailwind variants', 'Customize theme colors and dark mode in tailwind.config'],
    prerequisites: [],
    salaryUplift: 3,
    resources: [
      { title: 'Tailwind CSS Full Course for Beginners', provider: 'freeCodeCamp', kind: 'video', hours: 4, free: true, url: 'https://www.youtube.com/watch?v=ft30zcMlFao' },
      { title: 'Tailwind CSS Official Documentation & Component Patterns', provider: 'Tailwind Docs', kind: 'docs', hours: 3, free: true, url: 'https://tailwindcss.com/docs' },
      { title: 'Modern Landing Page with Tailwind CSS Portfolio Project', provider: 'GitHub', kind: 'project', hours: 6, free: true, url: 'https://github.com/tailwindlabs/tailwindcss' }
    ]
  },
  mongodb: {
    id: 'mongodb',
    name: 'MongoDB',
    aliases: ['MongoDB', 'Mongo', 'NoSQL', 'Mongoose'],
    tier: 'core',
    hours: 10,
    courses: 3,
    growth: 14,
    why: 'MongoDB is the most popular NoSQL document database in Egypt and the backbone of the Node.js/MERN stack.',
    actions: ['Design document schemas and handle relationships', 'Perform CRUD operations with aggregation pipelines', 'Index collections for query performance'],
    prerequisites: [],
    salaryUplift: 4,
    resources: [
      { title: 'MongoDB Full Tutorial for Beginners', provider: 'freeCodeCamp', kind: 'video', hours: 6, free: true, url: 'https://www.youtube.com/watch?v=ofme2o29ngU' },
      { title: 'MongoDB University: Intro to MongoDB', provider: 'MongoDB University', kind: 'course', hours: 8, free: true, url: 'https://learn.mongodb.com/' },
      { title: 'MERN Stack Authentication & REST API Project', provider: 'GitHub', kind: 'project', hours: 8, free: true, url: 'https://github.com/bradtraversy/mern-auth' }
    ]
  },
  pytorch: {
    id: 'pytorch',
    name: 'PyTorch & Deep Learning',
    aliases: ['PyTorch', 'Torch', 'Deep Learning', 'Neural Networks'],
    tier: 'advanced',
    hours: 22,
    courses: 4,
    growth: 35,
    why: 'PyTorch is the premier framework globally for training deep learning models, computer vision, and LLM fine-tuning.',
    actions: ['Build and train a convolutional neural network', 'Implement custom loss functions and optimizers', 'Fine-tune pre-trained vision/text models and export for inference'],
    prerequisites: ['python'],
    salaryUplift: 7,
    resources: [
      { title: 'PyTorch for Deep Learning Bootcamp (24 Hours)', provider: 'freeCodeCamp', kind: 'video', hours: 24, free: true, url: 'https://www.youtube.com/watch?v=V_xro1bcAuA' },
      { title: 'Deep Learning with PyTorch Specialization', provider: 'Coursera', kind: 'course', hours: 20, free: false, url: 'https://www.coursera.org/learn/deep-neural-networks-with-pytorch' },
      { title: 'PyTorch Official Tutorials & Recipes', provider: 'PyTorch Docs', kind: 'docs', hours: 6, free: true, url: 'https://pytorch.org/tutorials/' },
      { title: 'Computer Vision & Classification Portfolio Repo', provider: 'GitHub', kind: 'project', hours: 10, free: true, url: 'https://github.com/mrdbourke/pytorch-deep-learning' }
    ]
  },
  firebase: {
    id: 'firebase',
    name: 'Firebase',
    aliases: ['Firebase', 'Firestore', 'Firebase Auth', 'BaaS'],
    tier: 'core',
    hours: 8,
    courses: 3,
    growth: 16,
    why: 'Firebase provides the fastest serverless backend for mobile apps with authentication, Firestore, storage, and push notifications.',
    actions: ['Implement Firebase Authentication with social providers', 'Structure real-time collections and rules in Firestore', 'Deploy Cloud Functions for backend logic'],
    prerequisites: [],
    salaryUplift: 3,
    resources: [
      { title: 'Firebase Full Course for Mobile & Web', provider: 'freeCodeCamp', kind: 'video', hours: 5, free: true, url: 'https://www.youtube.com/watch?v=fgdpvwEWJ9M' },
      { title: 'Firebase Official Documentation & Code Labs', provider: 'Firebase Docs', kind: 'docs', hours: 4, free: true, url: 'https://firebase.google.com/docs' },
      { title: 'Flutter & Firebase Chat App with Real-time Sync', provider: 'GitHub', kind: 'project', hours: 8, free: true, url: 'https://github.com/flutter/samples' }
    ]
  }
};

// Aliases for compatibility
SKILLS.node = SKILLS.nodejs;
SKILLS.llm = SKILLS['gen-ai-llm'];
SKILLS.scikitlearn = SKILLS['machine-learning'];

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
  },
  {
    id: 'fullstack-developer',
    name: 'Full Stack Developer',
    nameAr: 'مطور برمجيات شامل',
    city: 'Cairo',
    cityAr: 'القاهرة',
    blurb: 'Build scalable web applications from responsive frontends to robust backends.',
    blurbAr: 'بناء تطبيقات ويب متكاملة وسريعة من الصفر بداية من واجهات المستخدم حتى الخوادم.',
    openJobs: 1950,
    salaryEgpK: 35,
    yoyGrowth: 27,
    timeToHireDays: 28,
    coreSkills: [
      { skillId: 'react', demand: 85 },
      { skillId: 'nodejs', demand: 75 },
      { skillId: 'typescript', demand: 70 },
      { skillId: 'sql', demand: 65 },
      { skillId: 'mongodb', demand: 55 },
      { skillId: 'docker', demand: 45 },
      { skillId: 'git', demand: 80 }
    ]
  },
  {
    id: 'frontend-developer',
    name: 'Frontend Developer',
    nameAr: 'مطور واجهات أمامية',
    city: 'Cairo',
    cityAr: 'القاهرة',
    blurb: 'Create highly interactive, fast, and responsive user interfaces.',
    blurbAr: 'تصميم وبناء واجهات مستخدم تفاعلية وعالية الاستجابة.',
    openJobs: 1840,
    salaryEgpK: 28,
    yoyGrowth: 22,
    timeToHireDays: 24,
    coreSkills: [
      { skillId: 'react', demand: 90 },
      { skillId: 'typescript', demand: 80 },
      { skillId: 'tailwind', demand: 75 },
      { skillId: 'git', demand: 70 },
      { skillId: 'javascript', demand: 65 }
    ]
  },
  {
    id: 'backend-developer',
    name: 'Backend Developer',
    nameAr: 'مطور خوادم وواجهات خلفية',
    city: 'Cairo',
    cityAr: 'القاهرة',
    blurb: 'Design and build secure RESTful APIs, microservices, and databases.',
    blurbAr: 'تصميم وبناء خوادم الويب وقواعد البيانات وواجهات البرمجة RESTful APIs.',
    openJobs: 1520,
    salaryEgpK: 37,
    yoyGrowth: 25,
    timeToHireDays: 30,
    coreSkills: [
      { skillId: 'nodejs', demand: 80 },
      { skillId: 'postgresql', demand: 70 },
      { skillId: 'sql', demand: 85 },
      { skillId: 'docker', demand: 60 },
      { skillId: 'python', demand: 50 },
      { skillId: 'mongodb', demand: 45 },
      { skillId: 'git', demand: 75 }
    ]
  },
  {
    id: 'ai-ml-engineer',
    name: 'AI & ML Engineer',
    nameAr: 'مهندس ذكاء اصطناعي وتعلم آلة',
    city: 'Cairo',
    cityAr: 'القاهرة',
    blurb: 'Develop and train machine learning models and build generative AI applications.',
    blurbAr: 'تطوير وتدريب نماذج تعلم الآلة وبناء تطبيقات الذكاء الاصطناعي التوليدي.',
    openJobs: 820,
    salaryEgpK: 50,
    yoyGrowth: 45,
    timeToHireDays: 35,
    coreSkills: [
      { skillId: 'python', demand: 95 },
      { skillId: 'pytorch', demand: 80 },
      { skillId: 'gen-ai-llm', demand: 75 },
      { skillId: 'machine-learning', demand: 70 },
      { skillId: 'sql', demand: 60 },
      { skillId: 'fastapi', demand: 55 },
      { skillId: 'docker', demand: 45 },
      { skillId: 'git', demand: 65 }
    ]
  },
  {
    id: 'flutter-developer',
    name: 'Flutter Developer',
    nameAr: 'مطور تطبيقات موبايل',
    city: 'Cairo',
    cityAr: 'القاهرة',
    blurb: 'Build high-performance, cross-platform mobile applications for iOS and Android.',
    blurbAr: 'تطوير تطبيقات هواتف ذكية بكود برمجي موحد وعالي الأداء.',
    openJobs: 910,
    salaryEgpK: 29,
    yoyGrowth: 20,
    timeToHireDays: 22,
    coreSkills: [
      { skillId: 'flutter', demand: 95 },
      { skillId: 'firebase', demand: 70 },
      { skillId: 'git', demand: 65 }
    ]
  }
];


export const DEFAULT_ROLE_ID = 'data-engineer';

export const WEEKLY_HOUR_OPTIONS = [2, 4, 6, 10, 15];
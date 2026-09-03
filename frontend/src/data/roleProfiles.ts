import type { ParsedCv, RoleId, RoleProfile } from '../types/onboarding';

export const roleProfiles: Record<RoleId, RoleProfile> = {
  'data-analyst': {
    headline: 'Junior Data Analyst',
    scores: { overall: 85, skills: 82, experience: 88, education: 90 },
    experienceYears: 3.2,
    relevance: { relevant: 87, related: 13, other: 0 },
    strengths: [
    'Strong technical foundation',
    'Data analysis & visualization skills',
    'Hands-on project experience'],

    topSkills: [
    { key: 'python', name: 'Python' },
    { key: 'sql', name: 'SQL' },
    { key: 'pandas', name: 'Pandas' },
    { key: 'powerbi', name: 'Power BI' },
    { key: 'excel', name: 'Excel' },
    { key: 'viz', name: 'Data Visualization' },
    { key: 'statistics', name: 'Statistics' }],

    extraSkillCount: 3,
    skillGaps: [
    { key: 'python', name: 'Python', level: 80, impact: 'High' },
    { key: 'sql', name: 'SQL', level: 65, impact: 'High' },
    { key: 'viz', name: 'Data Visualization', level: 60, impact: 'Medium' },
    { key: 'sklearn', name: 'Machine Learning', level: 40, impact: 'Medium' },
    { key: 'statistics', name: 'Statistics', level: 35, impact: 'Low' }],

    targetRoles: [
    { title: 'Junior Data Analyst', match: 85, label: 'Strong Match' },
    { title: 'Data Analyst', match: 75, label: 'Good Match' },
    { title: 'Business Intelligence Analyst', match: 70, label: 'Good Match' },
    { title: 'Data Scientist (Entry Level)', match: 55, label: 'Possible Match' }],

    actions: [
    { key: 'course', title: 'Take Advanced Python Course', meta: 'Coursera • 6 hours' },
    { key: 'project', title: 'Build 2 Data Projects', meta: 'Apply your skills to real datasets' },
    { key: 'certificate', title: 'Get SQL Certification', meta: 'Improve your SQL credibility' },
    { key: 'dashboard', title: 'Create Data Dashboard', meta: 'Use Power BI to showcase insights' }],

    priorities: [
    {
      key: 'python',
      title: 'Strengthen Python Skills',
      description: 'Advanced Python will boost your match for data roles.',
      impact: 'High'
    },
    {
      key: 'project',
      title: 'Add More Data Projects',
      description: 'Showcase hands-on projects with real results.',
      impact: 'High'
    },
    {
      key: 'certificate',
      title: 'Get SQL Certified',
      description: 'A SQL certification can increase your credibility.',
      impact: 'Medium'
    }]

  },

  'data-engineer': {
    headline: 'Data Engineer',
    scores: { overall: 78, skills: 76, experience: 80, education: 88 },
    experienceYears: 2.8,
    relevance: { relevant: 74, related: 22, other: 4 },
    strengths: [
    'Solid SQL and modelling background',
    'Comfortable with Python automation',
    'Exposure to production reporting'],

    topSkills: [
    { key: 'sql', name: 'SQL' },
    { key: 'python', name: 'Python' },
    { key: 'spark', name: 'Spark' },
    { key: 'airflow', name: 'Airflow' },
    { key: 'docker', name: 'Docker' },
    { key: 'cloud', name: 'Cloud Storage' }],

    extraSkillCount: 2,
    skillGaps: [
    { key: 'spark', name: 'Spark', level: 55, impact: 'High' },
    { key: 'airflow', name: 'Airflow', level: 45, impact: 'High' },
    { key: 'sql', name: 'Advanced SQL', level: 70, impact: 'Medium' },
    { key: 'docker', name: 'Docker', level: 40, impact: 'Medium' },
    { key: 'cloud', name: 'Cloud Warehousing', level: 30, impact: 'Low' }],

    targetRoles: [
    { title: 'Junior Data Engineer', match: 82, label: 'Strong Match' },
    { title: 'Analytics Engineer', match: 74, label: 'Good Match' },
    { title: 'ETL Developer', match: 71, label: 'Good Match' },
    { title: 'Platform Engineer', match: 52, label: 'Possible Match' }],

    actions: [
    { key: 'course', title: 'Learn Apache Spark', meta: 'DataCamp • 10 hours' },
    { key: 'project', title: 'Build an ETL Pipeline', meta: 'Airflow + Postgres end to end' },
    { key: 'certificate', title: 'Cloud Data Certification', meta: 'Prove your warehouse skills' },
    { key: 'dashboard', title: 'Ship a Data Quality Monitor', meta: 'Track freshness and nulls' }],

    priorities: [
    {
      key: 'spark',
      title: 'Deepen Spark Knowledge',
      description: 'Distributed processing is core to pipeline roles.',
      impact: 'High'
    },
    {
      key: 'project',
      title: 'Ship an Orchestrated Pipeline',
      description: 'Show scheduling, retries, and monitoring.',
      impact: 'High'
    },
    {
      key: 'certificate',
      title: 'Get Cloud Certified',
      description: 'Warehouse credentials unlock more openings.',
      impact: 'Medium'
    }]

  },

  'software-engineer': {
    headline: 'Software Engineer',
    scores: { overall: 81, skills: 79, experience: 76, education: 89 },
    experienceYears: 2.5,
    relevance: { relevant: 71, related: 24, other: 5 },
    strengths: [
    'Clean, typed frontend work',
    'Version control discipline',
    'Product-minded problem solving'],

    topSkills: [
    { key: 'typescript', name: 'TypeScript' },
    { key: 'react', name: 'React' },
    { key: 'node', name: 'Node.js' },
    { key: 'git', name: 'Git' },
    { key: 'api', name: 'REST APIs' },
    { key: 'sql', name: 'SQL' }],

    extraSkillCount: 4,
    skillGaps: [
    { key: 'typescript', name: 'TypeScript', level: 72, impact: 'High' },
    { key: 'api', name: 'System Design', level: 48, impact: 'High' },
    { key: 'node', name: 'Node.js', level: 60, impact: 'Medium' },
    { key: 'docker', name: 'Docker', level: 38, impact: 'Medium' },
    { key: 'sql', name: 'Databases', level: 42, impact: 'Low' }],

    targetRoles: [
    { title: 'Frontend Engineer', match: 86, label: 'Strong Match' },
    { title: 'Full-Stack Engineer', match: 74, label: 'Good Match' },
    { title: 'Product Engineer', match: 69, label: 'Good Match' },
    { title: 'Backend Engineer', match: 54, label: 'Possible Match' }],

    actions: [
    { key: 'course', title: 'Advanced TypeScript Course', meta: 'Frontend Masters • 8 hours' },
    { key: 'project', title: 'Ship 2 Full-Stack Apps', meta: 'Auth, data, and deployment' },
    { key: 'certificate', title: 'System Design Bootcamp', meta: 'Strengthen interview answers' },
    { key: 'dashboard', title: 'Publish a Portfolio Site', meta: 'Showcase your best work' }],

    priorities: [
    {
      key: 'typescript',
      title: 'Master Advanced TypeScript',
      description: 'Typed codebases dominate senior job posts.',
      impact: 'High'
    },
    {
      key: 'project',
      title: 'Add Two Shipped Projects',
      description: 'Live links convert far better than lists.',
      impact: 'High'
    },
    {
      key: 'api',
      title: 'Practice System Design',
      description: 'It is the top screening filter for mid-level roles.',
      impact: 'Medium'
    }]

  },

  'ml-engineer': {
    headline: 'Machine Learning Engineer',
    scores: { overall: 74, skills: 72, experience: 68, education: 92 },
    experienceYears: 2.1,
    relevance: { relevant: 66, related: 28, other: 6 },
    strengths: [
    'Strong statistics foundation',
    'Python and notebook fluency',
    'Model evaluation awareness'],

    topSkills: [
    { key: 'python', name: 'Python' },
    { key: 'sklearn', name: 'scikit-learn' },
    { key: 'pandas', name: 'Pandas' },
    { key: 'statistics', name: 'Statistics' },
    { key: 'pytorch', name: 'PyTorch' },
    { key: 'tensorflow', name: 'TensorFlow' }],

    extraSkillCount: 3,
    skillGaps: [
    { key: 'pytorch', name: 'Deep Learning', level: 50, impact: 'High' },
    { key: 'sklearn', name: 'Model Deployment', level: 42, impact: 'High' },
    { key: 'python', name: 'Python', level: 78, impact: 'Medium' },
    { key: 'docker', name: 'MLOps Tooling', level: 35, impact: 'Medium' },
    { key: 'statistics', name: 'Experiment Design', level: 46, impact: 'Low' }],

    targetRoles: [
    { title: 'ML Engineer (Entry Level)', match: 78, label: 'Strong Match' },
    { title: 'Data Scientist', match: 72, label: 'Good Match' },
    { title: 'Applied Scientist', match: 66, label: 'Good Match' },
    { title: 'Research Engineer', match: 51, label: 'Possible Match' }],

    actions: [
    { key: 'course', title: 'Deep Learning Specialization', meta: 'Coursera • 24 hours' },
    { key: 'project', title: 'Deploy a Model to Production', meta: 'FastAPI + Docker + monitoring' },
    { key: 'certificate', title: 'MLOps Certification', meta: 'Show you can ship, not just train' },
    { key: 'dashboard', title: 'Publish a Model Card', meta: 'Document metrics and tradeoffs' }],

    priorities: [
    {
      key: 'pytorch',
      title: 'Strengthen Deep Learning',
      description: 'Most ML openings expect a framework in depth.',
      impact: 'High'
    },
    {
      key: 'project',
      title: 'Deploy One Real Model',
      description: 'Serving experience separates you from students.',
      impact: 'High'
    },
    {
      key: 'certificate',
      title: 'Get MLOps Certified',
      description: 'Signals production readiness to hiring teams.',
      impact: 'Medium'
    }]

  },

  devops: {
    headline: 'DevOps Specialist',
    scores: { overall: 76, skills: 74, experience: 72, education: 84 },
    experienceYears: 2.6,
    relevance: { relevant: 69, related: 25, other: 6 },
    strengths: [
    'Scripting and automation habits',
    'Linux and networking basics',
    'Incident-minded problem solving'],

    topSkills: [
    { key: 'docker', name: 'Docker' },
    { key: 'kubernetes', name: 'Kubernetes' },
    { key: 'terminal', name: 'Linux' },
    { key: 'cloud', name: 'Cloud' },
    { key: 'git', name: 'Git' },
    { key: 'python', name: 'Python' }],

    extraSkillCount: 2,
    skillGaps: [
    { key: 'kubernetes', name: 'Kubernetes', level: 52, impact: 'High' },
    { key: 'cloud', name: 'Infrastructure as Code', level: 44, impact: 'High' },
    { key: 'docker', name: 'Docker', level: 68, impact: 'Medium' },
    { key: 'terminal', name: 'Observability', level: 38, impact: 'Medium' },
    { key: 'python', name: 'Automation Scripting', level: 40, impact: 'Low' }],

    targetRoles: [
    { title: 'Junior DevOps Engineer', match: 80, label: 'Strong Match' },
    { title: 'Site Reliability Engineer', match: 71, label: 'Good Match' },
    { title: 'Cloud Engineer', match: 68, label: 'Good Match' },
    { title: 'Platform Engineer', match: 53, label: 'Possible Match' }],

    actions: [
    { key: 'course', title: 'Kubernetes Deep Dive', meta: 'KodeKloud • 12 hours' },
    { key: 'project', title: 'Build a CI/CD Pipeline', meta: 'From commit to production' },
    { key: 'certificate', title: 'Cloud Associate Certification', meta: 'Most requested credential' },
    { key: 'dashboard', title: 'Set Up Monitoring Stack', meta: 'Dashboards, alerts, and SLOs' }],

    priorities: [
    {
      key: 'kubernetes',
      title: 'Go Deeper on Kubernetes',
      description: 'It appears in most DevOps job requirements.',
      impact: 'High'
    },
    {
      key: 'project',
      title: 'Automate One Full Pipeline',
      description: 'Prove you can deliver safely and repeatably.',
      impact: 'High'
    },
    {
      key: 'certificate',
      title: 'Get Cloud Certified',
      description: 'Fastest way to pass technical screening.',
      impact: 'Medium'
    }]

  }
};

export const parsedCvByRole: Record<RoleId, ParsedCv> = {
  'data-analyst': {
    fullName: 'AHMED AMR',
    currentTitle: 'Junior Data Analyst',
    email: 'ahmed.amr@email.com',
    phone: '+20 100 123 4567',
    location: 'Cairo, Egypt',
    summary:
    'Data Analyst with 1+ year of experience turning data into actionable insights. Proficient in SQL, Python, Excel, and Power BI. Passionate about data-driven decision making.',
    experience: {
      title: 'Junior Data Analyst',
      company: 'Data Insights Co.',
      location: 'Cairo, Egypt',
      period: 'May 2023 – Present',
      bullets: [
      'Analyzed sales data and created dashboards that improved reporting efficiency by 30%.',
      'Wrote SQL queries to extract and transform data from multiple sources.',
      'Built Power BI dashboards to visualize KPIs and track business performance.']

    },
    education: { degree: 'B.Sc. in Statistics', school: 'Cairo University', period: '2019 – 2023' },
    detectedSkills: [
    { key: 'python', name: 'Python' },
    { key: 'sql', name: 'SQL' },
    { key: 'pandas', name: 'Pandas' },
    { key: 'powerbi', name: 'Power BI' },
    { key: 'excel', name: 'Excel' },
    { key: 'viz', name: 'Data Visualization' },
    { key: 'statistics', name: 'Statistics' },
    { key: 'problem', name: 'Problem Solving' }]

  },
  'data-engineer': {
    fullName: 'AHMED AMR',
    currentTitle: 'Data Engineer',
    email: 'ahmed.amr@email.com',
    phone: '+20 100 123 4567',
    location: 'Cairo, Egypt',
    summary:
    'Data Engineer focused on reliable batch pipelines, dimensional modelling, and warehouse performance. Comfortable across SQL, Python, and orchestration tooling.',
    experience: {
      title: 'Data Engineer',
      company: 'Nile Data Systems',
      location: 'Cairo, Egypt',
      period: 'Feb 2023 – Present',
      bullets: [
      'Built and scheduled ETL jobs moving 40M+ rows daily into the warehouse.',
      'Reduced pipeline runtime by 45% through partitioning and query tuning.',
      'Added data quality checks that cut reporting incidents by half.']

    },
    education: {
      degree: 'B.Sc. in Computer Science',
      school: 'Cairo University',
      period: '2018 – 2022'
    },
    detectedSkills: [
    { key: 'sql', name: 'SQL' },
    { key: 'python', name: 'Python' },
    { key: 'spark', name: 'Spark' },
    { key: 'airflow', name: 'Airflow' },
    { key: 'docker', name: 'Docker' },
    { key: 'cloud', name: 'Cloud Storage' },
    { key: 'git', name: 'Git' },
    { key: 'problem', name: 'Problem Solving' }]

  },
  'software-engineer': {
    fullName: 'AHMED AMR',
    currentTitle: 'Software Engineer',
    email: 'ahmed.amr@email.com',
    phone: '+20 100 123 4567',
    location: 'Cairo, Egypt',
    summary:
    'Product-minded software engineer building typed React frontends and Node services. Focused on shipping clean, accessible, well-tested interfaces.',
    experience: {
      title: 'Software Engineer',
      company: 'Cairo Labs',
      location: 'Cairo, Egypt',
      period: 'Jan 2023 – Present',
      bullets: [
      'Delivered 12 customer-facing features in a React + TypeScript codebase.',
      'Cut bundle size 28% and improved Lighthouse performance to 96.',
      'Reviewed code and mentored two interns through their first releases.']

    },
    education: {
      degree: 'B.Sc. in Computer Engineering',
      school: 'Ain Shams University',
      period: '2018 – 2022'
    },
    detectedSkills: [
    { key: 'typescript', name: 'TypeScript' },
    { key: 'react', name: 'React' },
    { key: 'node', name: 'Node.js' },
    { key: 'api', name: 'REST APIs' },
    { key: 'sql', name: 'SQL' },
    { key: 'git', name: 'Git' },
    { key: 'docker', name: 'Docker' },
    { key: 'problem', name: 'Problem Solving' }]

  },
  'ml-engineer': {
    fullName: 'AHMED AMR',
    currentTitle: 'Machine Learning Engineer',
    email: 'ahmed.amr@email.com',
    phone: '+20 100 123 4567',
    location: 'Cairo, Egypt',
    summary:
    'ML practitioner with a statistics background, training and evaluating models on tabular and text data. Growing into deployment and monitoring.',
    experience: {
      title: 'ML Engineer (Junior)',
      company: 'Insight AI',
      location: 'Cairo, Egypt',
      period: 'Mar 2023 – Present',
      bullets: [
      'Trained churn models that lifted retention campaign precision by 18%.',
      'Built reproducible training pipelines with scikit-learn and MLflow.',
      'Ran offline evaluations and documented model tradeoffs for stakeholders.']

    },
    education: { degree: 'B.Sc. in Statistics', school: 'Cairo University', period: '2018 – 2022' },
    detectedSkills: [
    { key: 'python', name: 'Python' },
    { key: 'sklearn', name: 'scikit-learn' },
    { key: 'pandas', name: 'Pandas' },
    { key: 'pytorch', name: 'PyTorch' },
    { key: 'tensorflow', name: 'TensorFlow' },
    { key: 'statistics', name: 'Statistics' },
    { key: 'sql', name: 'SQL' },
    { key: 'problem', name: 'Problem Solving' }]

  },
  devops: {
    fullName: 'AHMED AMR',
    currentTitle: 'DevOps Specialist',
    email: 'ahmed.amr@email.com',
    phone: '+20 100 123 4567',
    location: 'Cairo, Egypt',
    summary:
    'Infrastructure-focused engineer automating builds, deployments, and monitoring. Comfortable with containers, Linux, and cloud fundamentals.',
    experience: {
      title: 'DevOps Engineer',
      company: 'CloudBridge',
      location: 'Cairo, Egypt',
      period: 'Apr 2023 – Present',
      bullets: [
      'Automated CI/CD for 9 services, cutting release time from hours to minutes.',
      'Containerized legacy workloads and moved them onto Kubernetes.',
      'Set up alerting that reduced mean time to detection by 60%.']

    },
    education: {
      degree: 'B.Sc. in Information Systems',
      school: 'Helwan University',
      period: '2018 – 2022'
    },
    detectedSkills: [
    { key: 'docker', name: 'Docker' },
    { key: 'kubernetes', name: 'Kubernetes' },
    { key: 'terminal', name: 'Linux' },
    { key: 'cloud', name: 'Cloud' },
    { key: 'git', name: 'Git' },
    { key: 'python', name: 'Python' },
    { key: 'api', name: 'Monitoring' },
    { key: 'problem', name: 'Problem Solving' }]

  }
};
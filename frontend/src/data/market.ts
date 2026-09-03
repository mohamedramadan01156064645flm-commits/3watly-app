export type SkillBar = {
  name: string;
  value: number;
  icon: string;
};

export const allSkills: SkillBar[] = [
{ name: 'SQL', value: 81, icon: 'https://cdn.simpleicons.org/postgresql/64748B' },
{ name: 'Python', value: 76, icon: 'https://cdn.simpleicons.org/python' },
{ name: 'Power BI', value: 58, icon: 'https://cdn.simpleicons.org/powerbi' },
{ name: 'Docker', value: 52, icon: 'https://cdn.simpleicons.org/docker' },
{ name: 'AWS', value: 47, icon: 'https://cdn.simpleicons.org/amazonwebservices/FF9900' },
{ name: 'React', value: 41, icon: 'https://cdn.simpleicons.org/react' },
{ name: 'Java', value: 36, icon: 'https://cdn.simpleicons.org/openjdk/C74634' },
{ name: 'Git', value: 34, icon: 'https://cdn.simpleicons.org/git' },
{ name: 'Excel', value: 33, icon: 'https://cdn.simpleicons.org/microsoftexcel' },
{ name: 'Tableau', value: 29, icon: 'https://cdn.simpleicons.org/tableau/1F6FEB' },
{ name: 'Kubernetes', value: 27, icon: 'https://cdn.simpleicons.org/kubernetes' },
{ name: 'Azure', value: 26, icon: 'https://cdn.simpleicons.org/microsoftazure/0078D4' },
{ name: 'Pandas', value: 25, icon: 'https://cdn.simpleicons.org/pandas/130654' },
{ name: 'TypeScript', value: 24, icon: 'https://cdn.simpleicons.org/typescript' },
{ name: 'Snowflake', value: 21, icon: 'https://cdn.simpleicons.org/snowflake' },
{ name: 'Apache Spark', value: 19, icon: 'https://cdn.simpleicons.org/apachespark' },
{ name: 'Airflow', value: 17, icon: 'https://cdn.simpleicons.org/apacheairflow' },
{ name: 'MongoDB', value: 16, icon: 'https://cdn.simpleicons.org/mongodb' },
{ name: 'Terraform', value: 14, icon: 'https://cdn.simpleicons.org/terraform' },
{ name: 'Figma', value: 12, icon: 'https://cdn.simpleicons.org/figma' }];


export type Industry = {
  id: string;
  label: string;
  description: string;
  jobs: number;
  companies: number;
  remote: number;
  topSkill: {name: string;share: number;};
  bias: Record<string, number>;
};

export const industries: Industry[] = [
{
  id: 'tech',
  label: 'Tech & Software',
  description: 'Product, data and platform engineering',
  jobs: 12842,
  companies: 1246,
  remote: 38.4,
  topSkill: { name: 'SQL', share: 81 },
  bias: { SQL: 1, Python: 1, Docker: 1, React: 1, TypeScript: 1.25 }
},
{
  id: 'finance',
  label: 'Finance & Banking',
  description: 'Banks, fintech and insurance',
  jobs: 7310,
  companies: 684,
  remote: 24.1,
  topSkill: { name: 'SQL', share: 88 },
  bias: { SQL: 1.08, Excel: 1.6, 'Power BI': 1.2, Python: 0.94, Docker: 0.7, React: 0.72, Tableau: 1.3 }
},
{
  id: 'healthcare',
  label: 'Healthcare & Pharma',
  description: 'Providers, pharma and health tech',
  jobs: 3985,
  companies: 412,
  remote: 18.6,
  topSkill: { name: 'Python', share: 69 },
  bias: { Python: 1.05, SQL: 0.86, Excel: 1.35, Docker: 0.62, React: 0.6, 'Power BI': 1.05, Java: 0.8 }
},
{
  id: 'ecommerce',
  label: 'Retail & E-commerce',
  description: 'Marketplaces, retail and logistics',
  jobs: 6120,
  companies: 903,
  remote: 31.2,
  topSkill: { name: 'SQL', share: 76 },
  bias: { React: 1.3, TypeScript: 1.4, 'Power BI': 1.1, Docker: 0.95, Java: 0.85, Figma: 1.5 }
},
{
  id: 'telecom',
  label: 'Telecom & Networking',
  description: 'Operators, ISPs and network vendors',
  jobs: 4470,
  companies: 268,
  remote: 21.7,
  topSkill: { name: 'SQL', share: 74 },
  bias: { Java: 1.5, Docker: 1.15, Kubernetes: 1.4, Python: 0.98, React: 0.7, Terraform: 1.5 }
}];


export type Region = {
  id: string;
  label: string;
  description: string;
  scale: number;
  remoteAdj: number;
};

export const regions: Region[] = [
{ id: 'cairo-alex', label: 'Greater Cairo & Alexandria', description: 'Cairo, Giza, Alexandria', scale: 1, remoteAdj: 0 },
{ id: 'cairo', label: 'Greater Cairo only', description: 'Cairo & Giza', scale: 0.74, remoteAdj: -1.8 },
{ id: 'delta', label: 'Delta & Canal Cities', description: 'Mansoura, Tanta, Port Said', scale: 0.28, remoteAdj: 6.4 },
{ id: 'upper', label: 'Upper Egypt', description: 'Assiut, Sohag, Luxor', scale: 0.16, remoteAdj: 9.1 },
{ id: 'all-egypt', label: 'All Egypt', description: 'Every governorate', scale: 1.36, remoteAdj: 2.2 }];


export type Timeframe = {
  id: string;
  label: string;
  description: string;
  scale: number;
  ticks: string[];
  peaks: {ai: number;docker: number;avg: number;};
};

export const timeframes: Timeframe[] = [
{
  id: '30',
  label: 'Last 30 Days',
  description: 'Rolling month',
  scale: 0.37,
  ticks: ['Jul 1', 'Jul 5', 'Jul 10', 'Jul 15', 'Jul 20', 'Jul 25', 'Jul 29'],
  peaks: { ai: 17, docker: 9, avg: 3 }
},
{
  id: '90',
  label: 'Last 90 Days',
  description: 'Rolling quarter',
  scale: 1,
  ticks: ['May 6', 'May 20', 'Jun 3', 'Jun 17', 'Jul 1', 'Jul 15', 'Jul 29'],
  peaks: { ai: 45, docker: 24, avg: 8 }
},
{
  id: '180',
  label: 'Last 6 Months',
  description: 'Half-year trend',
  scale: 1.92,
  ticks: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
  peaks: { ai: 63, docker: 33, avg: 11 }
},
{
  id: '365',
  label: 'Last 12 Months',
  description: 'Year over year',
  scale: 3.6,
  ticks: ['Sep', 'Oct', 'Dec', 'Feb', 'Apr', 'Jun', 'Jul'],
  peaks: { ai: 82, docker: 41, avg: 15 }
}];


export const metrics = [
{ id: 'growth', label: 'Growth %', description: 'Change in posting volume' },
{ id: 'postings', label: 'Job postings', description: 'Absolute number of postings' },
{ id: 'share', label: 'Market share %', description: 'Share of all postings' }];


export type SearchEntry = {label: string;type: 'Skill' | 'Role' | 'Company';meta: string;};

export const searchIndex: SearchEntry[] = [
{ label: 'SQL', type: 'Skill', meta: 'In 81% of data postings' },
{ label: 'Python', type: 'Skill', meta: 'In 76% of data postings' },
{ label: 'Power BI', type: 'Skill', meta: 'In 58% of data postings' },
{ label: 'Docker', type: 'Skill', meta: 'In 52% of data postings' },
{ label: 'Generative AI Tools', type: 'Skill', meta: 'Fastest growing, +45%' },
{ label: 'Data Engineer', type: 'Role', meta: '1,284 open roles' },
{ label: 'Data Analyst', type: 'Role', meta: '2,140 open roles' },
{ label: 'BI Analyst', type: 'Role', meta: '640 open roles' },
{ label: 'Machine Learning Engineer', type: 'Role', meta: '312 open roles' },
{ label: 'Microsoft', type: 'Company', meta: '96 open roles in Cairo' },
{ label: 'Vodafone', type: 'Company', meta: '74 open roles in Cairo' },
{ label: 'INSTABASE', type: 'Company', meta: '38 open roles in Cairo' },
{ label: 'Fawry', type: 'Company', meta: '31 open roles in Giza' }];


export type Notification = {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

export const initialNotifications: Notification[] = [
{
  id: 'n1',
  title: 'Generative AI Tools is up 45%',
  body: 'The fastest growing skill in your market over the last 90 days.',
  time: '12 min ago',
  unread: true
},
{
  id: 'n2',
  title: '3 new Data Engineer matches',
  body: 'Microsoft, Fawry and INSTABASE posted roles that fit your profile.',
  time: '2 hours ago',
  unread: true
},
{
  id: 'n3',
  title: 'Your Q3 salary report is ready',
  body: 'Data Engineer compensation rose 12% year over year.',
  time: 'Yesterday',
  unread: true
},
{
  id: 'n4',
  title: 'Weekly market digest',
  body: 'Tech & Software hiring grew 8% versus the previous 30 days.',
  time: '3 days ago',
  unread: false
}];


export const sparkPaths = {
  jobs: 'M0,26 L10,20 L20,24 L30,14 L40,19 L50,10 L60,15 L70,7 L80,11 L90,3 L100,0',
  companies: 'M0,27 L12,22 L24,25 L36,16 L48,20 L60,12 L72,15 L84,7 L100,1',
  remote: 'M0,25 L12,27 L24,18 L36,22 L48,13 L60,17 L72,9 L84,12 L100,2'
};
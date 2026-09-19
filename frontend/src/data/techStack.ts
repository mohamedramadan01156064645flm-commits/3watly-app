export type TechIconName =
  | 'sql'
  | 'python'
  | 'pandas'
  | 'powerbi'
  | 'ml'
  | 'cloud'
  | 'docker'
  | 'etl'
  | 'mongodb'
  | 'ai'
  | 'react'
  | 'nodejs'
  | 'typescript'
  | 'postgresql'
  | 'kubernetes'
  | 'git';

export interface TechItem {
  id: string;
  name: string;
  subtitleEn: string;
  subtitleAr: string;
  icon: TechIconName;
  /** Primary glow colour as "R G B" triple for alpha compositing. */
  accent: string;
  /** Secondary glow colour for dimensional two-tone edge lighting. */
  accentAlt: string;
  /** Hex color for the icon. */
  iconColor: string;
  /** Search query or link target. */
  query: string;
}

export const techStack: TechItem[] = [
  {
    id: 'sql',
    name: 'SQL',
    subtitleEn: 'Data Query & Analysis',
    subtitleAr: 'استعلام وتحليل البيانات',
    icon: 'sql',
    accent: '0 130 255',
    accentAlt: '0 210 255',
    iconColor: '#38BDF8',
    query: 'SQL'
  },
  {
    id: 'python',
    name: 'Python',
    subtitleEn: 'Data Processing',
    subtitleAr: 'معالجة وهندسة البيانات',
    icon: 'python',
    accent: '56 189 248',
    accentAlt: '250 204 21',
    iconColor: '#FACC15',
    query: 'Python'
  },
  {
    id: 'react',
    name: 'React',
    subtitleEn: 'Frontend Applications',
    subtitleAr: 'بناء واجهات الويب التفاعلية',
    icon: 'react',
    accent: '14 165 233',
    accentAlt: '56 189 248',
    iconColor: '#38BDF8',
    query: 'React'
  },
  {
    id: 'pandas',
    name: 'Pandas',
    subtitleEn: 'Data Manipulation',
    subtitleAr: 'هيكلة وتجهيز البيانات',
    icon: 'pandas',
    accent: '168 85 247',
    accentAlt: '129 140 248',
    iconColor: '#C084FC',
    query: 'Pandas'
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    subtitleEn: 'Backend & APIs',
    subtitleAr: 'تطوير الخوادم والواجهات البرمجية',
    icon: 'nodejs',
    accent: '34 197 94',
    accentAlt: '74 222 128',
    iconColor: '#22C55E',
    query: 'Node.js'
  },
  {
    id: 'powerbi',
    name: 'Power BI',
    subtitleEn: 'Data Visualization',
    subtitleAr: 'تصور ولوحات البيانات',
    icon: 'powerbi',
    accent: '245 158 11',
    accentAlt: '20 184 166',
    iconColor: '#FBBF24',
    query: 'Power BI'
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    subtitleEn: 'Type-Safe Architecture',
    subtitleAr: 'برمجة آمنة وقابلة للتوسع',
    icon: 'typescript',
    accent: '37 99 235',
    accentAlt: '96 165 250',
    iconColor: '#3B82F6',
    query: 'TypeScript'
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    subtitleEn: 'Build Intelligence',
    subtitleAr: 'بناء النماذج الذكية',
    icon: 'ml',
    accent: '129 140 248',
    accentAlt: '192 132 252',
    iconColor: '#A5B4FC',
    query: 'Machine Learning'
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    subtitleEn: 'Relational Database',
    subtitleAr: 'قواعد البيانات المتقدمة',
    icon: 'postgresql',
    accent: '51 103 145',
    accentAlt: '56 189 248',
    iconColor: '#38BDF8',
    query: 'PostgreSQL'
  },
  {
    id: 'cloud',
    name: 'Cloud',
    subtitleEn: 'Deploy & Scale',
    subtitleAr: 'البنية السحابية والنشر',
    icon: 'cloud',
    accent: '6 182 212',
    accentAlt: '56 189 248',
    iconColor: '#38BDF8',
    query: 'Cloud'
  },
  {
    id: 'docker',
    name: 'Docker',
    subtitleEn: 'Containerization',
    subtitleAr: 'الحاويات وإدارة التطبيقات',
    icon: 'docker',
    accent: '2 132 199',
    accentAlt: '56 189 248',
    iconColor: '#60A5FA',
    query: 'Docker'
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    subtitleEn: 'Cloud Orchestration',
    subtitleAr: 'إدارة ونشر البنى السحابية',
    icon: 'kubernetes',
    accent: '50 108 229',
    accentAlt: '99 102 241',
    iconColor: '#6366F1',
    query: 'Kubernetes'
  },
  {
    id: 'etl',
    name: 'ETL',
    subtitleEn: 'Data Pipeline',
    subtitleAr: 'خطوط نقل وتحويل البيانات',
    icon: 'etl',
    accent: '20 184 166',
    accentAlt: '52 211 153',
    iconColor: '#2DD4BF',
    query: 'ETL'
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    subtitleEn: 'NoSQL Database',
    subtitleAr: 'قواعد البيانات غير العلائقية',
    icon: 'mongodb',
    accent: '34 197 94',
    accentAlt: '74 222 128',
    iconColor: '#4ADE80',
    query: 'MongoDB'
  },
  {
    id: 'git',
    name: 'Git & GitHub',
    subtitleEn: 'Version Control & CI/CD',
    subtitleAr: 'إدارة الإصدارات والعمل الجماعي',
    icon: 'git',
    accent: '240 80 50',
    accentAlt: '251 146 60',
    iconColor: '#F97316',
    query: 'Git'
  },
  {
    id: 'ai',
    name: 'AI',
    subtitleEn: 'Smarter Solutions',
    subtitleAr: 'حلول الذكاء الاصطناعي',
    icon: 'ai',
    accent: '192 132 252',
    accentAlt: '244 63 94',
    iconColor: '#E879F9',
    query: 'AI'
  }
];

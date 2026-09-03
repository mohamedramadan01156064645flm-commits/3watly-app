import type { RoleId } from '../types/onboarding';

export interface RoleOption {
  id: RoleId;
  title: string;
  description: string;
  icon: 'analytics' | 'database' | 'code' | 'network' | 'cloud';
  tone: 'blue' | 'green' | 'violet';
}

export const roleOptions: RoleOption[] = [
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    description: 'Turn data into insights and drive business decisions.',
    icon: 'analytics',
    tone: 'blue'
  },
  {
    id: 'data-engineer',
    title: 'Data Engineer',
    description: 'Build and maintain data pipelines and systems.',
    icon: 'database',
    tone: 'green'
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    description: 'Design, build, and scale powerful software.',
    icon: 'code',
    tone: 'blue'
  },
  {
    id: 'ml-engineer',
    title: 'Machine Learning Engineer',
    description: 'Build intelligent models that learn and make predictions.',
    icon: 'network',
    tone: 'violet'
  },
  {
    id: 'devops',
    title: 'DevOps Specialist',
    description: 'Automate, deploy, and manage reliable infrastructure.',
    icon: 'cloud',
    tone: 'blue'
  }
];

export const experienceLevels = ['Fresh Graduate', '1-2 Years', '3-5 Years', '5+ Years'];

export interface LocationItem {
  id: string;
  en: string;
  ar: string;
}

export const LOCATION_OPTIONS: LocationItem[] = [
  { id: 'cairo', en: 'Cairo', ar: 'القاهرة' },
  { id: 'giza', en: 'Giza', ar: 'الجيزة' },
  { id: 'alexandria', en: 'Alexandria', ar: 'الإسكندرية' },
  { id: 'remote-egypt', en: 'Remote in Egypt', ar: 'عمل عن بُعد (مصر)' },
  { id: 'remote-global', en: 'Remote (Global)', ar: 'عمل عن بُعد (دولي)' },
  { id: 'hybrid-cairo', en: 'Hybrid — Cairo', ar: 'مرن (مكتبي وعن بُعد) — القاهرة' }
];

export const locationOptions = LOCATION_OPTIONS.map(l => l.en);

export const sidebarHighlights = [
  {
    icon: 'target' as const,
    tone: 'blue' as const,
    title: 'Personalized Recommendations',
    description: 'Get role suggestions that match your skills and goals.'
  },
  {
    icon: 'market' as const,
    tone: 'green' as const,
    title: 'Market Intelligence',
    description: 'Real-time insights on demand, salaries, and skill trends.'
  },
  {
    icon: 'growth' as const,
    tone: 'amber' as const,
    title: 'Career Growth',
    description: 'Identify skill gaps and grow faster with a clear plan.'
  }
];

export const onboardingSteps = [
  { id: 1, label: 'Career Path', path: '/onboarding/career-path' },
  { id: 2, label: 'CV Upload', path: '/onboarding/cv-upload' },
  { id: 3, label: 'Profile Insights', path: '/onboarding/profile-insights' },
  { id: 4, label: 'Recommendations', path: '/onboarding/recommendations' }
];

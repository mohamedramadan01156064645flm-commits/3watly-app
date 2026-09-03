import type {
  DemandSkill,
  Faq,
  FeatureCard,
  FooterColumn,
  HeroFeature,
  Industry,
  Metric,
  NavLink,
  ResourceLink,
  Step,
  Testimonial,
  TrustPoint
} from '../types/landing';

export const navLinks: NavLink[] = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Market Insights', href: '#insights' }
];

export const resourceLinks: ResourceLink[] = [
  { label: 'Learning Hub', description: 'Courses mapped to in-demand skills', icon: 'graduation' },
  { label: 'Salary Reports', description: 'Quarterly pay data across Egypt', icon: 'wallet' },
  { label: 'News & Trends', description: 'What is moving the local market', icon: 'trending' }
];

export const heroTrustPoints: TrustPoint[] = [
  { title: '100% Free', description: 'No credit card required', icon: 'check' },
  { title: 'Your Data is Safe', description: 'We never share your information', icon: 'lock' },
  {
    title: 'AI-Powered Matching',
    description: 'Smarter matches, better opportunities',
    icon: 'sparkles'
  }
];

export const heroFeatures: HeroFeature[] = [
  {
    title: 'AI-Powered Career Matching',
    description: 'Find jobs that truly fit you',
    icon: 'scan',
    tone: 'primary'
  },
  {
    title: 'Real-time Market Insights',
    description: 'Egyptian data you can trust',
    icon: 'bar',
    tone: 'success'
  },
  {
    title: 'Personalized Skill Gap Analysis',
    description: 'Know what to learn next',
    icon: 'flame',
    tone: 'accent'
  },
  {
    title: 'Smart ATS CV Builder',
    description: 'Create a CV that gets you noticed',
    icon: 'file',
    tone: 'navy'
  }
];

export const featureCards: FeatureCard[] = [
  {
    title: 'Live Skill Gap Analyzer',
    description: "Know exactly what skills you have, what's missing, and what to learn next.",
    icon: 'bar',
    tone: 'success',
    bullets: [
      'AI analyzes your current skills',
      'Compares with target role & market demand',
      'Personalized learning recommendations'
    ]
  },
  {
    title: 'ATS-Friendly CV Builder',
    description: 'Create a professional CV that passes ATS and gets you noticed.',
    icon: 'file',
    tone: 'primary',
    bullets: [
      'ATS score & optimization tips',
      'Industry-specific templates',
      'Keyword & content suggestions'
    ]
  },
  {
    title: 'AI Career Copilot',
    description: 'Your personal AI assistant for career advice, insights, and next steps.',
    icon: 'sparkles',
    tone: 'accent',
    bullets: ['Personalized career guidance', 'Egyptian market insights', '24/7 AI-powered support']
  }
];

export const companyLogos: string[] = [
  'vodafone',
  'cib',
  'orange',
  'etisalat',
  'ibm',
  'microsoft',
  'instabase'
];

export const steps: Step[] = [
  {
    number: '1',
    title: 'Upload Your CV',
    description: 'Upload your CV and tell us your target role and location.',
    progress: 34,
    tone: 'primary',
    icon: 'upload'
  },
  {
    number: '2',
    title: 'We Analyze Everything',
    description: 'Our AI analyzes your skills, experience, and the Egyptian job market.',
    progress: 34,
    tone: 'primary',
    icon: 'brain'
  },
  {
    number: '3',
    title: 'Get Your Career Plan',
    description:
      'Receive a personalized plan with job matches, skill recommendations, and next steps.',
    progress: 62,
    tone: 'success',
    icon: 'target'
  }
];

export const demandSkills: DemandSkill[] = [
  { name: 'SQL', volume: '72%', share: 72 },
  { name: 'Python', volume: '68%', share: 68 },
  { name: 'Power BI', volume: '56%', share: 56 },
  { name: 'Excel', volume: '48%', share: 48 },
  { name: 'Data Visualization', volume: '41%', share: 41 }
];

export const keyMetrics: Metric[] = [
  {
    label: 'Active Job Postings',
    value: '1,247',
    delta: '+14%',
    caption: 'vs last month',
    tone: 'primary'
  },
  {
    label: 'Salary Growth',
    value: '+18%',
    delta: 'vs last year',
    caption: 'median across tracked roles',
    tone: 'success'
  },
  {
    label: 'Active Talent',
    value: '1.2M',
    delta: '+5.7%',
    caption: 'professionals in the market',
    tone: 'accent'
  }
];

export const topIndustries: Industry[] = [
  { name: 'Technology', share: 45, volume: '18.5K' },
  { name: 'Financial Services', share: 22, volume: '14.2K' },
  { name: 'Telecom', share: 15, volume: '9.7K' },
  { name: 'E-Commerce', share: 18, volume: '11.8K' }
];

export const ctaHighlights: { title: string; icon: string; tone: 'primary' | 'success' | 'accent' }[] = [
  { title: 'Personalized career insights', icon: 'target', tone: 'success' },
  { title: 'Real Egyptian market data', icon: 'bar', tone: 'primary' },
  { title: 'AI-powered recommendations', icon: 'sparkles', tone: 'primary' },
  { title: 'Private & secure', icon: 'shield', tone: 'accent' }
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "3WATLY helped me discover skills I didn't know I was missing. I got my dream job in just 6 weeks.",
    name: 'Ahmed M.',
    role: 'Data Analyst',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'
  },
  {
    quote: 'The CV builder is genius. My ATS score jumped from 62% to 94% on the first pass.',
    name: 'Sara K.',
    role: 'Marketing Specialist',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80'
  },
  {
    quote: 'The salary insights are spot on. Finally, real data for the Egyptian market.',
    name: 'Omar T.',
    role: 'Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80'
  },
  {
    quote: 'The AI Copilot feels like having a career mentor available 24/7.',
    name: 'Maya R.',
    role: 'Business Analyst',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80'
  }
];

export const faqs: Faq[] = [
  {
    question: 'Is 3WATLY really free?',
    answer:
      'Yes. Career matching, market insights, skill gap analysis, and the CV builder are free for individuals, with no credit card required. We monetize through employer and research products.'
  },
  {
    question: 'Where does the market data come from?',
    answer:
      'We aggregate live job postings, salary submissions, and hiring signals from Egyptian employers and job boards, then normalize them into roles and skills. Data is refreshed continuously and reported at role and industry level.'
  },
  {
    question: 'How is the match score calculated?',
    answer:
      'Your skills, seniority, and stated goals are compared against the requirements of each role, weighted by current market demand and the hiring company profile. Every score comes with the reasons behind it, so you can see exactly what is helping or hurting the match.'
  },
  {
    question: 'What happens to my CV and personal data?',
    answer:
      'Your CV is used only to build your profile and generate your recommendations. We never sell or share your information with employers unless you explicitly apply or make your profile visible.'
  },
  {
    question: 'Does 3WATLY work outside Egypt?',
    answer:
      'The market intelligence layer is built specifically for the Egyptian market today. Gulf market coverage is in progress, and the CV builder and skill analysis already work anywhere.'
  }
];

export const footerColumns: FooterColumn[] = [
  {
    title: 'Product',
    links: ['Features', 'How It Works', 'Market Insights', 'CV Builder']
  },
  {
    title: 'Company',
    links: ['About Us', 'Careers', 'Contact Us', 'Blog']
  },
  {
    title: 'Support',
    links: ['Help Center', 'Privacy Policy', 'Terms of Service', 'Cookie Policy']
  }
];

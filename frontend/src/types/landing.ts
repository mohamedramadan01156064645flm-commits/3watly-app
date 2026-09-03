export interface NavLink {
  label: string;
  href: string;
}

export interface ResourceLink {
  label: string;
  description: string;
  icon: 'graduation' | 'wallet' | 'trending';
}

export interface TrustPoint {
  title: string;
  description: string;
  icon: 'check' | 'lock' | 'sparkles';
}

export interface HeroFeature {
  title: string;
  description: string;
  icon: 'scan' | 'bar' | 'flame' | 'file';
  tone: 'primary' | 'success' | 'accent' | 'navy';
}

export interface FeatureCard {
  title: string;
  description: string;
  icon: 'bar' | 'file' | 'sparkles';
  tone: 'success' | 'primary' | 'accent';
  bullets: string[];
}

export interface Step {
  number: string;
  title: string;
  description: string;
  progress: number;
  tone: 'primary' | 'success';
  icon: 'upload' | 'brain' | 'target';
}

export interface DemandSkill {
  name: string;
  volume: string;
  share: number;
}

export interface Metric {
  label: string;
  value: string;
  delta: string;
  caption: string;
  tone: 'primary' | 'success' | 'accent';
}

export interface Industry {
  name: string;
  share: number;
  volume: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface FooterColumn {
  title: string;
  links: string[];
}

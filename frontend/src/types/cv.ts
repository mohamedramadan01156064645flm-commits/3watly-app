export type SectionId =
  | 'contact'
  | 'summary'
  | 'experience'
  | 'education'
  | 'projects'
  | 'skills'
  | 'certifications';

export type SocialPlatform =
  | 'LinkedIn'
  | 'GitHub'
  | 'Twitter'
  | 'Portfolio'
  | 'Dribbble'
  | 'Medium'
  | 'Dev.to'
  | 'Personal'
  | 'Other';

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
  customLabel?: string;
}

export interface Contact {
  fullName: string;
  jobTitle: string;
  phone: string;
  email: string;
  location: string;
  linkedin: string;
  github?: string;
  portfolio?: string;
  socialLinks?: SocialLink[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  bullets: string[];
  type?: 'job' | 'internship';
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  location: string;
  major: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  technologies: string[];
  link?: string;
  github?: string;
  bullets: string[];
}

export interface SkillGroup {
  id: string;
  label: string;
  skills: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  url?: string;
  date?: string;
}

export interface CVData {
  contact: Contact;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skills: SkillGroup[];
  certifications: CertificationItem[];
  /** Order the sections appear in on the rendered CV. */
  sectionOrder: SectionId[];
  /** Sections excluded from the rendered CV (still editable). */
  hiddenSections: SectionId[];
  /** Optional one-line skills summary (added by the ATS "Skills Summary" fix). */
  skillsSummary: string | null;
}

export type TemplateId = 'ats-classic' | 'compact' | 'two-column' | 'simple' | 'modern-minimal';

export type SaveStatus = 'saved' | 'saving';

export type FixId =
  | 'keywords'
  | 'metrics'
  | 'skills-summary'
  | 'summary-missing'
  | 'summary-short'
  | 'linkedin-missing'
  | 'few-bullets'
  | 'few-skills';

export type ScoreBand = 'excellent' | 'good' | 'average' | 'poor';

export interface CVVersion {
  id: string;
  name: string;
  targetRole: string;
  cvData: CVData;
  templateId: TemplateId;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  atsScore?: number;
  analysis?: any;
}
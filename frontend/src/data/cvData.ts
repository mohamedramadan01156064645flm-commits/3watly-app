import type { CVData, SectionId, TemplateId } from '../types/cv';

export const emptyCV: CVData = {
  contact: {
    fullName: '',
    jobTitle: '',
    phone: '',
    email: '',
    linkedin: '',
    github: '',
    portfolio: '',
    location: ''
  },
  summary: '',
  experience: [],
  education: [],
  projects: [],
  skills: [],
  certifications: [],
  sectionOrder: [
    'contact',
    'summary',
    'experience',
    'education',
    'projects',
    'skills',
    'certifications'
  ],
  hiddenSections: [],
  skillsSummary: null
};

export const initialCV: CVData = emptyCV;

/**
 * Keywords the Egyptian tech market asks for in Data Analyst postings.
 * Missing keywords are surfaced in the order listed here.
 */
export const MARKET_KEYWORDS: string[] = [
'SQL',
'Python',
'Excel',
'Power BI',
'Tableau',
'DAX',
'Data Visualization',
'Data Cleaning',
'Dashboards',
'Git',
'Statistical Analysis',
'Docker',
'Airflow',
'Data Modeling',
'ETL',
'Pandas',
'Snowflake',
'dbt'];


/** Number of market keywords that counts as full keyword coverage. */
export const KEYWORD_BENCHMARK = 13;

export const TEMPLATES: {
  id: TemplateId;
  name: string;
  nameAr: string;
  columns: number;
  description: string;
}[] = [
  {
    id: 'ats-classic',
    name: 'ATS Friendly',
    nameAr: 'ATS Friendly (موصى به)',
    columns: 1,
    description: 'Single-column academic serif layout, gold standard for ATS parsing.'
  },
  {
    id: 'compact',
    name: 'Compact',
    nameAr: 'Compact (مدمج لصفحة واحدة)',
    columns: 1,
    description: 'High-density single page layout with highlighted section banners.'
  },
  {
    id: 'two-column',
    name: 'Two Column',
    nameAr: 'Two Column (تخطيط عمودين)',
    columns: 2,
    description: 'Structured sidebar layout with separate skills, education, and certifications.'
  },
  {
    id: 'simple',
    name: 'Simple',
    nameAr: 'Simple (أكاديمي كلاسيكي)',
    columns: 1,
    description: 'Traditional academic CV layout with clean horizontal rules.'
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    nameAr: 'Modern Minimal',
    columns: 1,
    description: 'Clean modern tech layout with sleek typography and badges.'
  }
];


export const SECTION_META: Record<
  SectionId,
  { label: string; labelAr: string; heading: string; headingAr: string }
> = {
  contact: { label: 'Header & Contact', labelAr: 'البيانات الشخصية والتواصل', heading: '', headingAr: '' },
  summary: { label: 'Professional Summary', labelAr: 'الملخص المهني', heading: 'Professional Summary', headingAr: 'الملخص المهني' },
  experience: { label: 'Experience', labelAr: 'الخبرات المهنية', heading: 'Experience', headingAr: 'الخبرات المهنية' },
  education: { label: 'Education', labelAr: 'المؤهل الدراسي', heading: 'Education', headingAr: 'المؤهلات الدراسية' },
  projects: { label: 'Projects', labelAr: 'المشاريع التطبيقية', heading: 'Projects', headingAr: 'المشاريع العملية' },
  skills: { label: 'Skills', labelAr: 'المهارات التقنية', heading: 'Skills', headingAr: 'المهارات' },
  certifications: { label: 'Certifications', labelAr: 'الشهادات الاحترافية', heading: 'Certifications', headingAr: 'الشهادات والدورات' }
};
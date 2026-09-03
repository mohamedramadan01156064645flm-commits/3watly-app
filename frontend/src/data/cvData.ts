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
  sectionOrder: [
    'contact',
    'summary',
    'experience',
    'education',
    'projects',
    'skills'
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
  columns: number;
  description: string;
}[] = [
  {
    id: 'ats-classic',
    name: 'ATS Friendly',
    columns: 1,
    description: 'Single-column template with blue accents, optimized for applicant tracking systems.'
  },
  {
    id: 'compact',
    name: 'Compact',
    columns: 1,
    description: 'Single column ATS friendly template with tight spacing.'
  },
  {
    id: 'two-column',
    name: 'Two Column',
    columns: 2,
    description: 'A two-column resume layout with sections side by side.'
  },
  {
    id: 'simple',
    name: 'Simple (Academic)',
    columns: 1,
    description: 'Traditional academic CV layout with labeled columns and horizontal rules.'
  }
];


export const SECTION_META: Record<
  SectionId,
  {label: string;heading: string;}> =
{
  contact: { label: 'Header & Contact', heading: '' },
  summary: { label: 'Professional Summary', heading: 'Professional Summary' },
  experience: { label: 'Experience', heading: 'Experience' },
  education: { label: 'Education', heading: 'Education' },
  projects: { label: 'Projects', heading: 'Projects' },
  skills: { label: 'Skills', heading: 'Skills' }
};
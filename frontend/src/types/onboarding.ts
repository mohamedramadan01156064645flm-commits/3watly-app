export type RoleId =
'data-analyst' |
'data-engineer' |
'software-engineer' |
'ml-engineer' |
'devops';

export type TechKey = string;

export type Impact = 'High' | 'Medium' | 'Low';

export interface SkillGap {
  key: TechKey;
  name: string;
  level: number;
  impact: Impact;
}

export interface TargetRole {
  title: string;
  match: number;
  label: 'Strong Match' | 'Good Match' | 'Possible Match';
}

export interface RecommendedAction {
  key: TechKey | 'course' | 'project' | 'certificate' | 'dashboard';
  title: string;
  meta: string;
}

export interface PriorityItem {
  key: TechKey | 'course' | 'project' | 'certificate' | 'dashboard';
  title: string;
  description: string;
  impact: Impact;
}

export interface RoleProfile {
  headline: string;
  scores: {
    overall: number;
    skills: number;
    experience: number;
    education: number;
  };
  experienceYears: number;
  relevance: {relevant: number;related: number;other: number;};
  strengths: string[];
  topSkills: {key: TechKey;name: string;}[];
  extraSkillCount: number;
  skillGaps: SkillGap[];
  targetRoles: TargetRole[];
  actions: RecommendedAction[];
  priorities: PriorityItem[];
}

export interface ParsedCv {
  fullName: string;
  currentTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  links?: Array<{ title: string; url: string; type: string }>;
  summary: string;
  filename?: string;
  targetRole?: string;
  experienceYears?: number;
  experiences?: Array<{
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    current: boolean;
    location?: string;
    description?: string;
    bullets: string[];
  }>;
  experience?: {
    title: string;
    company: string;
    location: string;
    period: string;
    bullets: string[];
  };
  educationHistory?: Array<{
    id: string;
    institution: string;
    degree: string;
    major: string;
    startDate: string;
    endDate: string;
    location?: string;
  }>;
  education?: { degree: string; school: string; period: string };
  skills?: string[];
  detectedSkills?: { key: TechKey; name: string }[];
  categorizedSkills?: {
    programming: string[];
    frameworks: string[];
    databasesAndTools: string[];
    cloud: string[];
    soft: string[];
  };
  projects?: Array<{
    id: string;
    title: string;
    description: string;
    technologies: string[];
    bullets?: string[];
  }>;
  categorizedSkillGroups?: Array<{
    id: string;
    label: string;
    skills: string[];
  }>;
  atsReport?: {
    score: number;
    structureScore: number;
    readabilityScore: number;
    impactScore: number;
    skillsScore: number;
    hasEmail: boolean;
    hasPhone: boolean;
    hasLocation: boolean;
    hasSummary: boolean;
    hasExperience: boolean;
    hasEducation: boolean;
    hasSkills: boolean;
    hasMetrics: boolean;
    actionVerbsCount: number;
    metricsCount: number;
    strengths: string[];
    improvements: string[];
  };
  actionPlan?: Array<{
    title: string;
    category: string;
    priority: 'high' | 'medium' | 'low';
    description: string;
  }>;
}

export type ParseStatus = 'idle' | 'uploading' | 'parsing' | 'complete' | 'error';

export interface UploadedFile {
  name: string;
  sizeLabel: string;
  file?: File;
  rawFile?: File;
  previewUrl?: string;
}
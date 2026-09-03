export type SkillTier = 'foundation' | 'core' | 'advanced';

export type SkillStatus = 'not-started' | 'in-progress' | 'saved' | 'completed';

export type PriorityBand = 'high' | 'medium' | 'later';

export type SortMode = 'impact' | 'quick-wins' | 'demand';

export type ResourceKind = 'video' | 'course' | 'docs' | 'project';

export interface SkillResource {
  title: string;
  provider: string;
  kind: ResourceKind;
  hours: number;
  free: boolean;
  url?: string;
}

export interface SkillDefinition {
  id: string;
  name: string;
  /** Extra spellings matched against the CV text. */
  aliases: string[];
  tier: SkillTier;
  /** Focused learning hours to reach job-ready level. */
  hours: number;
  courses: number;
  /** 90-day demand growth in the Egyptian market, in percent. */
  growth: number;
  why: string;
  actions: string[];
  prerequisites: string[];
  /** Typical monthly salary uplift in EGP thousands. */
  salaryUplift: number;
  resources: SkillResource[];
}

export interface RoleSkillRef {
  skillId: string;
  /** Share of postings for this role that ask for the skill, in percent. */
  demand: number;
}

export interface RoleDefinition {
  id: string;
  name: string;
  nameAr?: string;
  city: string;
  cityAr?: string;
  blurb: string;
  blurbAr?: string;
  openJobs: number;
  salaryEgpK: number;
  yoyGrowth: number;
  timeToHireDays: number;
  coreSkills: RoleSkillRef[];
}

export interface PlannedSkill {
  def: SkillDefinition;
  demand: number;
  score: number;
  band: PriorityBand;
  status: SkillStatus;
  covered: boolean;
  /** Extra postings that open up once this single skill is covered. */
  jobsUnlocked: number;
  checkedActions: number[];
  missingPrerequisites: SkillDefinition[];
  remainingHours: number;
}

export interface SkillPlan {
  role: RoleDefinition;
  covered: PlannedSkill[];
  priorities: PlannedSkill[];
  future: PlannedSkill[];
  totalSteps: number;
  coveredSteps: number;
  progressPct: number;
  readinessPct: number;
  eligibleJobs: number;
  potentialJobs: number;
  multiplier: number;
  remainingHours: number;
  weeksToFinish: number;
  finishDate: Date;
  completedCount: number;
  futureUnlocked: boolean;
  unlockThreshold: number;
  salaryUplift: number;
}
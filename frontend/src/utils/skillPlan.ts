import { addWeeks } from 'date-fns';
import { ROLES, SKILLS } from '../data/skillCatalog';
import type { CVData } from '../types/cv';
import type {
  PlannedSkill,
  PriorityBand,
  RoleDefinition,
  SkillDefinition,
  SkillPlan,
  SkillStatus,
  SortMode } from
'../types/skills';
import { containsKeyword, cvToText } from './cvHelpers';

export const PRIORITY_COUNT = 3;
export const UNLOCK_THRESHOLD = 2;

const TIER_BONUS = { foundation: 12, core: 6, advanced: 0 };

/**
 * Postings rarely ask for one missing skill in isolation, so the raw
 * independent probability is dampened with a square root before it is turned
 * into a posting count.
 */
const CO_OCCURRENCE_DAMPING = 0.5;

export function getRole(roleId: string): RoleDefinition {
  return ROLES.find((role) => role.id === roleId) ?? ROLES[0];
}

export function isSkillInCV(text: string, def: SkillDefinition): boolean {
  return [def.name, ...def.aliases].some((term) => containsKeyword(text, term));
}

function priorityScore(demand: number, def: SkillDefinition): number {
  return demand * 0.6 + def.growth * 0.25 + TIER_BONUS[def.tier];
}

function bandFor(score: number): PriorityBand {
  if (score >= 40) return 'high';
  if (score >= 24) return 'medium';
  return 'later';
}

function eligibleFactor(gaps: {demand: number;}[]): number {
  const raw = gaps.reduce((acc, gap) => acc * (1 - gap.demand / 100), 1);
  return Math.pow(raw, CO_OCCURRENCE_DAMPING);
}

interface ComputeArgs {
  cv: CVData;
  roleId: string;
  statuses: Record<string, SkillStatus>;
  actionProgress: Record<string, number[]>;
  sortMode: SortMode;
  weeklyHours: number;
}

export function computePlan({
  cv,
  roleId,
  statuses,
  actionProgress,
  sortMode,
  weeklyHours
}: ComputeArgs): SkillPlan {
  const role = getRole(roleId);
  const text = cvToText(cv);

  const all: PlannedSkill[] = role.coreSkills.map(({ skillId, demand }) => {
    const def = SKILLS[skillId];
    const covered = isSkillInCV(text, def);
    const status: SkillStatus = covered ?
    'completed' :
    statuses[skillId] ?? 'not-started';
    const checkedActions = actionProgress[skillId] ?? [];
    const score = priorityScore(demand, def);

    return {
      def,
      demand,
      score,
      band: bandFor(score),
      status,
      covered,
      jobsUnlocked: 0,
      checkedActions,
      missingPrerequisites: def.prerequisites.
      map((id) => SKILLS[id]).
      filter((pre) => pre && !isSkillInCV(text, pre)),
      remainingHours:
      def.hours * (
      1 - Math.min(1, checkedActions.length / def.actions.length))
    };
  });

  const covered = all.filter((item) => item.covered);
  const gaps = all.filter((item) => !item.covered);

  const baseFactor = eligibleFactor(gaps);
  const eligibleJobs = Math.round(role.openJobs * baseFactor);

  gaps.forEach((gap) => {
    const withSkill = eligibleFactor(gaps.filter((g) => g !== gap));
    gap.jobsUnlocked = Math.max(
      0,
      Math.round(role.openJobs * withSkill) - eligibleJobs
    );
  });

  const sorted = [...gaps].sort((a, b) => {
    if (sortMode === 'quick-wins') return a.def.hours - b.def.hours;
    if (sortMode === 'demand') return b.demand - a.demand;
    return b.score - a.score;
  });

  const active = sorted.filter((item) => item.status !== 'saved');
  const priorities = active.slice(0, PRIORITY_COUNT);
  const future = [
  ...active.slice(PRIORITY_COUNT),
  ...sorted.filter((item) => item.status === 'saved')];


  const totalDemand = all.reduce((sum, item) => sum + item.demand, 0);
  const coveredDemand = all.reduce((sum, item) => {
    if (item.covered) return sum + item.demand;
    if (item.status === 'in-progress') return sum + item.demand * 0.4;
    return sum;
  }, 0);

  const remainingGapsAfterPlan = gaps.filter(
    (gap) => !priorities.includes(gap)
  );
  const potentialJobs = Math.round(
    role.openJobs * eligibleFactor(remainingGapsAfterPlan)
  );

  const remainingHours = priorities.reduce(
    (sum, item) => sum + item.remainingHours,
    0
  );
  const weeksToFinish = Math.max(
    1,
    Math.ceil(remainingHours / Math.max(1, weeklyHours))
  );

  const upliftSum = priorities.reduce(
    (sum, item) => sum + item.def.salaryUplift,
    0
  );

  const completedCount = Object.values(statuses).filter(
    (status) => status === 'completed'
  ).length;

  return {
    role,
    covered,
    priorities,
    future,
    totalSteps: all.length,
    coveredSteps: covered.length,
    progressPct: Math.round(covered.length / all.length * 100),
    readinessPct: Math.round(coveredDemand / totalDemand * 100),
    eligibleJobs,
    potentialJobs,
    multiplier:
    eligibleJobs > 0 ?
    Math.round(potentialJobs / eligibleJobs * 10) / 10 :
    1,
    remainingHours: Math.round(remainingHours * 10) / 10,
    weeksToFinish,
    finishDate: addWeeks(new Date(), weeksToFinish),
    completedCount,
    futureUnlocked: completedCount >= UNLOCK_THRESHOLD,
    unlockThreshold: UNLOCK_THRESHOLD,
    salaryUplift: Math.round(
      Math.min(upliftSum * 0.55, role.salaryEgpK * 0.4)
    )
  };
}

export const BAND_META: Record<
  PriorityBand,
  {label: string;chip: string;dot: string;ring: string;accent: string;}> =
{
  high: {
    label: 'High impact',
    chip: 'bg-rose-50 text-rose-700',
    dot: 'bg-rose-500',
    ring: 'bg-rose-500',
    accent: 'text-rose-600'
  },
  medium: {
    label: 'Medium priority',
    chip: 'bg-amber-50 text-amber-700',
    dot: 'bg-amber-500',
    ring: 'bg-amber-500',
    accent: 'text-amber-600'
  },
  later: {
    label: 'Learn later',
    chip: 'bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500',
    ring: 'bg-emerald-500',
    accent: 'text-emerald-600'
  }
};

export const TIER_LABEL = {
  foundation: 'Foundation',
  core: 'Core',
  advanced: 'Advanced'
};

export const SORT_OPTIONS: {id: SortMode;label: string;hint: string;}[] = [
{
  id: 'impact',
  label: 'Career impact',
  hint: 'Market demand, growth and how much it unlocks'
},
{
  id: 'quick-wins',
  label: 'Quick wins',
  hint: 'Fewest learning hours first'
},
{
  id: 'demand',
  label: 'Market demand',
  hint: 'Most requested in postings first'
}];
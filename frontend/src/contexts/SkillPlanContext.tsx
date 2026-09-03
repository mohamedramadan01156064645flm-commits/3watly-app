"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState } from
'react';
import { toast } from 'sonner';
import { DEFAULT_ROLE_ID, SKILLS } from '../data/skillCatalog';
import type { SkillPlan, SkillStatus, SortMode } from '../types/skills';
import { computePlan, getRole } from '../utils/skillPlan';
import { useCV } from './CVContext';

interface SkillPlanContextValue {
  plan: SkillPlan;
  roleId: string;
  setRoleId: (roleId: string) => void;
  sortMode: SortMode;
  setSortMode: (mode: SortMode) => void;
  weeklyHours: number;
  setWeeklyHours: (hours: number) => void;
  startSkill: (skillId: string) => void;
  saveForLater: (skillId: string) => void;
  moveToPlan: (skillId: string) => void;
  resetSkill: (skillId: string) => void;
  toggleAction: (skillId: string, index: number) => void;
  completeSkill: (skillId: string) => void;
  readinessFor: (roleId: string) => number;
}

const SkillPlanContext = createContext<SkillPlanContextValue | null>(null);

export function SkillPlanProvider({
  children
}: { children: React.ReactNode }) {
  const { cv, update } = useCV();
  const [roleId, setRoleIdState] = useState(DEFAULT_ROLE_ID);
  const [statuses, setStatuses] = useState<Record<string, SkillStatus>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('3watly_skill_statuses');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return {};
  });
  const [actionProgress, setActionProgress] = useState<Record<string, number[]>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('3watly_skill_actions');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return {};
  });
  const [sortMode, setSortMode] = useState<SortMode>('impact');
  const [weeklyHours, setWeeklyHours] = useState(6);

  // Sync to localStorage on change
  React.useEffect(() => {
    try {
      localStorage.setItem('3watly_skill_statuses', JSON.stringify(statuses));
    } catch {}
  }, [statuses]);

  React.useEffect(() => {
    try {
      localStorage.setItem('3watly_skill_actions', JSON.stringify(actionProgress));
    } catch {}
  }, [actionProgress]);

  const plan = useMemo(
    () =>
    computePlan({
      cv,
      roleId,
      statuses,
      actionProgress,
      sortMode,
      weeklyHours
    }),
    [cv, roleId, statuses, actionProgress, sortMode, weeklyHours]
  );

  /** Writes a finished skill into the CV so ATS and readiness both react. */
  const addSkillToCV = useCallback(
    (skillName: string) => {
      update((prev) => {
        const groups = [...prev.skills];
        const index = Math.max(
          0,
          groups.findIndex((group) => /technical/i.test(group.label))
        );
        const target = groups[index];
        if (!target) return prev;
        if (
        target.skills.some(
          (skill) => skill.toLowerCase() === skillName.toLowerCase()
        ))

        return prev;
        groups[index] = { ...target, skills: [...target.skills, skillName] };
        return { ...prev, skills: groups };
      }, `skill-plan-${skillName}`);
    },
    [update]
  );

  const setStatus = useCallback((skillId: string, status: SkillStatus) => {
    setStatuses((prev) => ({ ...prev, [skillId]: status }));
  }, []);

  const completeSkill = useCallback(
    (skillId: string) => {
      const def = SKILLS[skillId];
      if (!def) return;
      setStatus(skillId, 'completed');
      setActionProgress((prev) => ({
        ...prev,
        [skillId]: def.actions.map((_, index) => index)
      }));
      addSkillToCV(def.name);
      toast.success(
        `${def.name} marked as learned — added to your CV skills and ATS keywords.`
      );
    },
    [addSkillToCV, setStatus]
  );

  const toggleAction = useCallback(
    (skillId: string, index: number) => {
      const def = SKILLS[skillId];
      if (!def) return;
      const current = actionProgress[skillId] ?? [];
      const next = current.includes(index) ?
      current.filter((item) => item !== index) :
      [...current, index];

      setActionProgress((prev) => ({ ...prev, [skillId]: next }));

      if (next.length === def.actions.length) {
        setStatus(skillId, 'completed');
        addSkillToCV(def.name);
        toast.success(
          `All steps done — ${def.name} added to your CV skills and ATS keywords.`
        );
        return;
      }

      if (next.length > 0 && statuses[skillId] !== 'in-progress') {
        setStatus(skillId, 'in-progress');
      }
    },
    [actionProgress, addSkillToCV, setStatus, statuses]
  );

  const startSkill = useCallback(
    (skillId: string) => {
      setStatus(skillId, 'in-progress');
      toast.success(
        `${SKILLS[skillId]?.name ?? 'Skill'} started — tick each step as you finish it.`
      );
    },
    [setStatus]
  );

  const saveForLater = useCallback(
    (skillId: string) => {
      setStatus(skillId, 'saved');
      toast(`${SKILLS[skillId]?.name ?? 'Skill'} moved to your later list.`);
    },
    [setStatus]
  );

  const moveToPlan = useCallback(
    (skillId: string) => {
      setStatus(skillId, 'not-started');
      toast.success(
        `${SKILLS[skillId]?.name ?? 'Skill'} is back in your active plan.`
      );
    },
    [setStatus]
  );

  const resetSkill = useCallback(
    (skillId: string) => {
      setStatuses((prev) => ({ ...prev, [skillId]: 'not-started' }));
      setActionProgress((prev) => ({ ...prev, [skillId]: [] }));
    },
    []
  );

  const setRoleId = useCallback(
    (nextRoleId: string) => {
      setRoleIdState(nextRoleId);
      toast.success(`Target role set to ${getRole(nextRoleId).name}.`);
    },
    []
  );

  const readinessFor = useCallback(
    (candidateRoleId: string) =>
    computePlan({
      cv,
      roleId: candidateRoleId,
      statuses,
      actionProgress,
      sortMode,
      weeklyHours
    }).readinessPct,
    [cv, statuses, actionProgress, sortMode, weeklyHours]
  );

  const value = useMemo<SkillPlanContextValue>(
    () => ({
      plan,
      roleId,
      setRoleId,
      sortMode,
      setSortMode,
      weeklyHours,
      setWeeklyHours,
      startSkill,
      saveForLater,
      moveToPlan,
      resetSkill,
      toggleAction,
      completeSkill,
      readinessFor
    }),
    [
    plan,
    roleId,
    setRoleId,
    sortMode,
    weeklyHours,
    startSkill,
    saveForLater,
    moveToPlan,
    resetSkill,
    toggleAction,
    completeSkill,
    readinessFor]

  );

  return (
    <SkillPlanContext.Provider value={value}>
      {children}
    </SkillPlanContext.Provider>);

}

export function useSkillPlan(): SkillPlanContextValue {
  const context = useContext(SkillPlanContext);
  if (!context)
  throw new Error('useSkillPlan must be used inside a SkillPlanProvider');
  return context;
}

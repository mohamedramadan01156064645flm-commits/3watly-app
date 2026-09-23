"use client";

import React, { useState } from 'react';
import { DownloadIcon, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useSkillPlan } from '@/contexts/SkillPlanContext';
import { TopMetricsBanner } from '@/components/skills/TopMetricsBanner';
import { PriorityGrid } from '@/components/skills/PriorityGrid';
import { SequencedActionPlan } from '@/components/skills/SequencedActionPlan';
import { BottomInsightsRow } from '@/components/skills/BottomInsightsRow';
import { TargetRoleModal } from '@/components/skills/TargetRoleModal';
import { ResourcesModal } from '@/components/skills/ResourcesModal';
import { SkillCompletionModal } from '@/components/skills/SkillCompletionModal';
import { PremiumSkillPlanModal } from '@/components/skills/PremiumSkillPlanModal';
import type { PlannedSkill } from '@/types/skills';
import { ActiveCVBadge } from '@/components/cv/CVVersionManager';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SkillGapPage() {
  const { plan } = useSkillPlan();
  const { isAr } = useLanguage();
  const [targetOpen, setTargetOpen] = useState(false);
  const [selectedSkillModal, setSelectedSkillModal] = useState<PlannedSkill | null>(null);
  const [completionSkill, setCompletionSkill] = useState<PlannedSkill | null>(null);
  const [roadmapOpen, setRoadmapOpen] = useState(false);

  return (
    <AppShell
      title={isAr ? "تحليل فجوة المهارات (Skill Gap Analysis)" : "Skill Gap Analysis"}
      subtitle={
        isAr
          ? "حدد المهارات التي تحتاجها لتطوير مسارك المهني والقبول في الوظائف المستهدفة بشكل أسرع."
          : "Identify the skills you need to grow and get hired faster."
      }
    >
      <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
        {/* Top Active CV Pill & Career Roadmap Trigger */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ActiveCVBadge pageName={isAr ? "فجوة المهارات" : "Skill Gap"} />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRoadmapOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1B57E0] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? "خارطة الطريق المهنية (Career Roadmap)" : "Career Skill Roadmap"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRoadmapOpen(true);
                setTimeout(() => window.print(), 350);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
            >
              <DownloadIcon className="w-3.5 h-3.5" />
              <span>{isAr ? "طباعة الخارطة PDF" : "Print Roadmap PDF"}</span>
            </button>
          </div>
        </div>

        {/* 1. Top 4-Metric Strip */}
        <TopMetricsBanner plan={plan} onChangeTarget={() => setTargetOpen(true)} />

        {/* 2. Main 2-Column Grid: Left Priority Cards + Right Sequenced Action Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-8">
            <PriorityGrid
              plan={plan}
              onSelectSkill={(s) => setSelectedSkillModal(s)}
              onCompleteSkill={(s) => setCompletionSkill(s)}
            />
          </div>
          <div className="lg:col-span-4">
            <SequencedActionPlan
              plan={plan}
              onSelectSkill={(s) => setSelectedSkillModal(s)}
              onCompleteSkill={(s) => setCompletionSkill(s)}
            />
          </div>
        </div>

        {/* 3. Bottom Row: Market Insights + CTA Banner */}
        <BottomInsightsRow onOpenTargetRole={() => setTargetOpen(true)} />
      </div>

      {/* Target Role Selector Modal */}
      <TargetRoleModal open={targetOpen} onClose={() => setTargetOpen(false)} />

      {/* Skill Resources & Mastery Modal */}
      {selectedSkillModal && (
        <ResourcesModal
          open
          initialKind="all"
          skills={[selectedSkillModal]}
          onClose={() => setSelectedSkillModal(null)}
        />
      )}

      {/* Smart Skill Completion & CV Integration Modal */}
      <SkillCompletionModal
        open={!!completionSkill}
        skill={completionSkill}
        onClose={() => setCompletionSkill(null)}
      />

      {/* Premium Career Skill Roadmap Modal */}
      <PremiumSkillPlanModal
        open={roadmapOpen}
        onClose={() => setRoadmapOpen(false)}
      />
    </AppShell>
  );
}

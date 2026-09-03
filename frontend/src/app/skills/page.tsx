"use client";

import React, { useState } from 'react';
import { DownloadIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useSkillPlan } from '@/contexts/SkillPlanContext';
import { TopMetricsBanner } from '@/components/skills/TopMetricsBanner';
import { PriorityGrid } from '@/components/skills/PriorityGrid';
import { SequencedActionPlan } from '@/components/skills/SequencedActionPlan';
import { BottomInsightsRow } from '@/components/skills/BottomInsightsRow';
import { TargetRoleModal } from '@/components/skills/TargetRoleModal';
import { ResourcesModal } from '@/components/skills/ResourcesModal';
import type { PlannedSkill } from '@/types/skills';
import { ActiveCVBadge } from '@/components/cv/CVVersionManager';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SkillGapPage() {
  const { plan } = useSkillPlan();
  const { isAr } = useLanguage();
  const [targetOpen, setTargetOpen] = useState(false);
  const [selectedSkillModal, setSelectedSkillModal] = useState<PlannedSkill | null>(null);

  const downloadPlan = () => {
    toast.success(
      isAr
        ? "جاري فتح نافذة الطباعة — احفظ التقرير كملف PDF."
        : "Opening print dialog — save plan as PDF."
    );
    window.setTimeout(() => window.print(), 350);
  };

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
        {/* Top Active CV Pill */}
        <div className="flex items-center justify-between">
          <ActiveCVBadge pageName={isAr ? "فجوة المهارات" : "Skill Gap"} />
        </div>

        {/* 1. Top 4-Metric Strip */}
        <TopMetricsBanner plan={plan} onChangeTarget={() => setTargetOpen(true)} />

        {/* 2. Main 2-Column Grid: Left Priority Cards + Right Sequenced Action Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-8">
            <PriorityGrid plan={plan} onSelectSkill={(s) => setSelectedSkillModal(s)} />
          </div>
          <div className="lg:col-span-4">
            <SequencedActionPlan plan={plan} />
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
    </AppShell>
  );
}

"use client";

import React from 'react';
import { ArrowUpRight, CheckCircle2, Sparkles } from 'lucide-react';
import { SkillIcon } from './SkillIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import type { SkillPlan, PlannedSkill } from '@/types/skills';

interface PriorityGridProps {
  plan: SkillPlan;
  onSelectSkill?: (skill: PlannedSkill) => void;
}

export function PriorityGrid({ plan, onSelectSkill }: PriorityGridProps) {
  const { isAr } = useLanguage();

  // Dynamically select the top priority skills from real calculated plan
  const displayedSkills = React.useMemo(() => {
    if (!plan) return [];
    if (plan.priorities.length >= 3) {
      return plan.priorities.slice(0, 3);
    }
    const combined = [...plan.priorities, ...plan.future];
    return combined.slice(0, 3);
  }, [plan]);

  if (displayedSkills.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 mb-3 shadow-xs">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {isAr ? "تهانينا! ملفك يغطي كافة المهارات الأساسية المطلوبة" : "Great Job! You cover all core skills for this role."}
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          {isAr
            ? `أنت تمتلك جميع المهارات الأساسية لمسمى ${plan.role.name}. يمكنك تغيير المسمى المستهدف لاستكشاف مسارات مهنية أعلى.`
            : `You have acquired all major skills for ${plan.role.name}. You can change target role to explore advanced tracks.`}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {isAr ? "فجوات المهارات حسب الأولوية والتأثير" : "Skill Gaps by Impact & Priority"}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {displayedSkills.map((item) => {
          const isHigh = item.band === 'high';
          const isMed = item.band === 'medium';

          const badgeLabel = isHigh
            ? (isAr ? '● تأثير مرتفع للغاية' : '● HIGH IMPACT')
            : isMed
            ? (isAr ? '● أولوية متوسطة' : '● MEDIUM PRIORITY')
            : (isAr ? '● مرحلة متقدمة' : '● FOUNDATION');

          const badgeClass = isHigh
            ? 'bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 border-rose-200/80 dark:border-rose-800/40'
            : isMed
            ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 border-amber-200/80 dark:border-amber-800/40'
            : 'bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border-blue-200/80 dark:border-blue-800/40';

          const demandBadgeClass = isHigh
            ? 'bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300'
            : isMed
            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
            : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300';

          const unlockedJobs = item.jobsUnlocked > 0 
            ? item.jobsUnlocked 
            : Math.max(14, Math.round(item.demand * 1.7));

          return (
            <div
              key={item.def.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-xs hover:border-blue-400/80 dark:hover:border-blue-500/40 transition-all min-h-[390px] duration-200"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${badgeClass}`}
                  >
                    {badgeLabel}
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-center">
                  <SkillIcon skillId={item.def.id} size="lg" className="rounded-2xl shadow-xs" />
                </div>

                <h3 className="mt-4 text-center text-lg font-bold text-slate-900 dark:text-white">
                  {item.def.name}
                </h3>

                <div className="mt-2 flex justify-center">
                  <span
                    className={`rounded-md px-2.5 py-0.5 text-xs font-bold ${demandBadgeClass}`}
                  >
                    {isAr
                      ? `مطلوبة في ${item.demand}% من وظائف السوق`
                      : `In ${item.demand}% of tech jobs`}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="h-4 w-4 shrink-0" />
                  <span>
                    {isAr
                      ? `تفتح +${unlockedJobs} فرصة عمل إضافية لملفك`
                      : `Unlocks +${unlockedJobs} new job openings`}
                  </span>
                </div>

                <div className="mt-4 border-t border-slate-100 dark:border-white/5 pt-3">
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    {isAr ? "لماذا هذه المهارة مهمة؟" : "Why this skill matters?"}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {item.def.why}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3">
                <button
                  type="button"
                  onClick={() => onSelectSkill && onSelectSkill(item)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 text-xs transition-colors cursor-pointer shadow-xs active:scale-98"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAr ? "خطة الإتقان والتطبيق" : "Mastery & Action Plan"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

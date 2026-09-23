"use client";

import React from 'react';
import Link from 'next/link';
import { Trophy, ArrowRight, CheckCircle2, Film } from 'lucide-react';
import { SkillIcon } from './SkillIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import type { PlannedSkill, SkillPlan } from '@/types/skills';

interface SequencedActionPlanProps {
  plan: SkillPlan;
  onSelectSkill?: (skill: PlannedSkill) => void;
  onCompleteSkill?: (skill: PlannedSkill) => void;
}

export function SequencedActionPlan({ plan, onSelectSkill, onCompleteSkill }: SequencedActionPlanProps) {
  const { isAr } = useLanguage();

  // Combine priorities and future gaps in logical sequential order
  const sequenceSteps = React.useMemo(() => {
    if (!plan) return [];
    const allGaps = [...plan.priorities, ...plan.future];
    if (allGaps.length === 0) return [];

    return allGaps.map((item, idx) => {
      const isHigh = item.band === 'high';
      const isMed = item.band === 'medium';

      const badgeLabel = isHigh
        ? (isAr ? 'تأثير مرتفع' : 'High Impact')
        : isMed
        ? (isAr ? 'أولوية متوسطة' : 'Medium Priority')
        : (isAr ? 'تأسيسي' : 'Foundation');

      const badgeClass = isHigh
        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
        : isMed
        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';

      const circleClass = isHigh
        ? 'bg-blue-600 text-white'
        : isMed
        ? 'bg-amber-500 text-white'
        : 'bg-slate-600 dark:bg-slate-700 text-white';

      const hours = Math.round(item.remainingHours || item.def.hours || 10);
      const modulesCount = item.def.actions?.length || 4;
      const modulesText = isAr
        ? `${modulesCount} وحدات تطبيقية · ${hours} ساعات`
        : `${modulesCount} Modules · ${hours} Hours`;

      return {
        step: idx + 1,
        skillId: item.def.id,
        name: item.def.name,
        badge: badgeLabel,
        badgeClass,
        circleClass,
        modules: modulesText,
        originalSkill: item,
      };
    });
  }, [plan, isAr]);

  const totalGapsCount = sequenceSteps.length;
  const totalHours = Math.round(plan.remainingHours || sequenceSteps.length * 12);
  const totalWeeks = Math.round(plan.weeksToFinish || Math.max(2, Math.ceil(totalHours / 8)));

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-xs h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {isAr ? "خارطة التدرج واكتساب المهارات" : "Skill Sequence & Roadmap"}
          </h2>
          <Link
            href="/jobs"
            className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>{isAr ? "استكشاف الوظائف" : "Explore Jobs"}</span>
            <ArrowRight className={`h-3.5 w-3.5 ${isAr ? 'rotate-180' : ''}`} />
          </Link>
        </div>

        {/* Empty State */}
        {sequenceSteps.length === 0 ? (
          <div className="mt-8 text-center p-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {isAr ? "أنت جاهز تماماً لسوق العمل!" : "Your profile covers all role skills!"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isAr ? "لا توجد فجوات مهارية متبقية لهذا المسمى." : "No remaining skill gaps for this target role."}
            </p>
          </div>
        ) : (
          /* Step Items Timeline */
          <div className="mt-5 space-y-4 relative max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 pe-1">
            {sequenceSteps.map((item, idx, arr) => (
              <div key={item.step} className="relative">
                {/* Connected Line */}
                {idx < arr.length - 1 && (
                  <div className="absolute left-[15px] rtl:left-auto rtl:right-[15px] top-[32px] bottom-[-16px] w-0.5 bg-slate-200 dark:bg-white/10 z-0" />
                )}

                {/* Row Container */}
                <div
                  className="relative z-10 w-full flex items-center justify-between group rounded-xl px-2 py-1.5 -mx-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left rtl:text-right"
                >
                  {/* Step Circle, Icon & Info Button */}
                  <button
                    type="button"
                    onClick={() => onSelectSkill && onSelectSkill(item.originalSkill)}
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer text-left rtl:text-right"
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black shadow-xs ${item.circleClass}`}
                    >
                      {item.step}
                    </span>

                    <SkillIcon skillId={item.skillId} size="sm" className="rounded-lg shadow-2xs shrink-0" />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {item.name}
                        </h4>
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${item.badgeClass}`}
                        >
                          {item.badge}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                        {item.modules}
                      </span>
                    </div>
                  </button>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 ltr:ml-2 rtl:mr-2">
                    {onSelectSkill && (
                      <button
                        type="button"
                        onClick={() => onSelectSkill(item.originalSkill)}
                        title={isAr ? "فيديوهات وكورسات المهارة" : "Videos & Courses"}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-[11px] font-bold transition-colors cursor-pointer border border-purple-200/60 dark:border-purple-800/40"
                      >
                        <Film className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                        <span className="hidden sm:inline">{isAr ? "كورسات" : "Courses"}</span>
                      </button>
                    )}
                    {onCompleteSkill && (
                      <button
                        type="button"
                        onClick={() => onCompleteSkill(item.originalSkill)}
                        title={isAr ? "إكمال وإضافة للـ CV" : "Mark completed & add to CV"}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onSelectSkill && onSelectSkill(item.originalSkill)}
                      className="p-1 text-slate-300 dark:text-white/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer"
                      aria-label={isAr ? "تفاصيل المهارة" : "Skill details"}
                    >
                      <ArrowRight className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Estimate */}
      {sequenceSteps.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500 shrink-0" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {isAr
                ? `المدة المتوقعة للإنجاز: ${totalWeeks} أسابيع (${totalGapsCount} مهارات · ${totalHours} ساعة)`
                : `Est. Completion: ${totalWeeks} weeks (${totalGapsCount} skills · ${totalHours}h)`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

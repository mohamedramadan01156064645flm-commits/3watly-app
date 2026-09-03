"use client";

import React from 'react';
import { Briefcase, Check, TrendingUp, MapPin } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { ROLES } from '../../data/skillCatalog';
import { useSkillPlan } from '../../contexts/SkillPlanContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface TargetRoleModalProps {
  open: boolean;
  onClose: () => void;
}

export function TargetRoleModal({ open, onClose }: TargetRoleModalProps) {
  const { roleId, setRoleId, readinessFor } = useSkillPlan();
  const { isAr } = useLanguage();

  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidth="max-w-2xl"
      title={isAr ? 'اختر المسمى الوظيفي المستهدف' : 'Change your target role'}
      description={
        isAr
          ? 'يتم إعادة حساب فجواتك وأولوياتك والوظائف المطابقة لك بناءً على المسمى الذي تختاره.'
          : 'Your gaps, priorities and matching jobs are recalculated from the role you pick.'
      }
    >
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ROLES.map((role) => {
          const readiness = readinessFor(role.id);
          const selected = role.id === roleId;
          const displayName = isAr ? (role.nameAr ?? role.name) : role.name;
          const displayBlurb = isAr ? (role.blurbAr ?? role.blurb) : role.blurb;
          const displayCity = isAr ? (role.cityAr ?? role.city) : role.city;

          return (
            <li key={role.id}>
              <button
                type="button"
                onClick={() => {
                  setRoleId(role.id);
                  onClose();
                }}
                aria-pressed={selected}
                className={`group relative flex h-full w-full flex-col gap-3 rounded-2xl border p-5 text-start transition-all duration-150 cursor-pointer ${
                  selected
                    ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/30 dark:border-blue-500/70 ring-2 ring-blue-500/20'
                    : 'border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] hover:border-blue-400/70 dark:hover:border-blue-500/40 hover:bg-blue-50/30 dark:hover:bg-blue-950/10'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[14px] font-bold text-slate-900 dark:text-white leading-tight">
                    {displayName}
                  </span>
                  {selected && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold text-white shrink-0">
                      <Check className="h-3 w-3" />
                      {isAr ? 'الحالي' : 'Current'}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-[12.5px] leading-relaxed text-slate-500 dark:text-slate-400">
                  {displayBlurb}
                </p>

                {/* Stats Row */}
                <div className="flex flex-wrap items-center gap-3 text-[12px]">
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <TrendingUp className="h-3.5 w-3.5" />
                    YoY +{role.yoyGrowth}%
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
                    <Briefcase className="h-3.5 w-3.5" />
                    {role.openJobs.toLocaleString('en-US')} {isAr ? 'وظيفة' : 'jobs'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
                    <MapPin className="h-3 w-3" />
                    {displayCity}
                  </span>
                </div>

                {/* Readiness Progress */}
                <div className="w-full">
                  <div className="flex items-center justify-between text-[11px] font-semibold mb-1.5">
                    <span className="text-slate-500 dark:text-slate-400">
                      {isAr ? 'جاهزيتك لهذا المسمى' : 'Your readiness'}
                    </span>
                    <span className={`tabular-nums font-black ${
                      readiness >= 70 ? 'text-emerald-600 dark:text-emerald-400' :
                      readiness >= 40 ? 'text-amber-600 dark:text-amber-400' :
                      'text-rose-600 dark:text-rose-400'
                    }`}>
                      {readiness}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                    <div
                      className={`h-full rounded-full transition-[width] duration-500 ${
                        readiness >= 70 ? 'bg-emerald-500' :
                        readiness >= 40 ? 'bg-amber-500' :
                        'bg-blue-600'
                      }`}
                      style={{ width: `${readiness}%` }}
                    />
                  </div>
                </div>

                {/* Salary + Time to hire footer */}
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  {isAr
                    ? `متوسط الراتب: ${role.salaryEgpK} ألف ج.م · متوسط التوظيف: ${role.timeToHireDays} يوماً`
                    : `EGP ${role.salaryEgpK}K avg · ${role.timeToHireDays} days to hire`}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}

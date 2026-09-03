"use client";

import React from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { useCV } from '../../../contexts/CVContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { TagInput } from '../../ui/TagInput';
import { uid } from '../../../utils/cvHelpers';

export function SkillsSection() {
  const { cv, update } = useCV();
  const { isAr } = useLanguage();

  return (
    <div className="space-y-4">
      {cv.skillsSummary && (
        <div className="rounded-2xl border border-blue-200/80 dark:border-blue-500/20 bg-blue-50/60 dark:bg-blue-950/30 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                {isAr ? "ملخص المهارات" : "Skills Summary"}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">
                {cv.skillsSummary}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                update((prev) => ({ ...prev, skillsSummary: null }))
              }
              aria-label="Remove skills summary"
              className="shrink-0 rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3.5">
        {cv.skills.map((group, index) => (
          <div
            key={group.id}
            className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-slate-50/50 dark:bg-[#0B1120] p-4 shadow-2xs transition-colors"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <input
                value={group.label}
                aria-label={`Skill group ${index + 1} name`}
                onChange={(event) =>
                  update(
                    (prev) => ({
                      ...prev,
                      skills: prev.skills.map((g) =>
                        g.id === group.id
                          ? { ...g, label: event.target.value }
                          : g
                      ),
                    }),
                    `skill-label-${group.id}`
                  )
                }
                placeholder={isAr ? "عنوان المجموعة (مثال: Programming Languages)" : "Category Title (e.g. Programming Languages)"}
                className="flex-1 h-8.5 px-2.5 rounded-xl border border-transparent bg-transparent text-[13.5px] font-bold text-slate-900 dark:text-white placeholder:text-slate-400 hover:border-slate-200 dark:hover:border-white/10 focus:border-blue-500 focus:bg-white dark:focus:bg-[#060913] focus:outline-none transition-all"
              />

              <button
                type="button"
                onClick={() =>
                  update((prev) => ({
                    ...prev,
                    skills: prev.skills.filter((g) => g.id !== group.id),
                  }))
                }
                disabled={cv.skills.length === 1}
                title={isAr ? "حذف هذه المجموعة" : "Delete group"}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <TagInput
              tags={group.skills}
              emptyHint={isAr ? "لم تتم إضافة مهارات لهذه المجموعة بعد." : "No skills in this group yet."}
              onChange={(skills) =>
                update((prev) => ({
                  ...prev,
                  skills: prev.skills.map((g) =>
                    g.id === group.id ? { ...g, skills } : g
                  ),
                }))
              }
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          update((prev) => ({
            ...prev,
            skills: [
              ...prev.skills,
              { id: uid('skill'), label: isAr ? 'مجموعة مهارات جديدة' : 'New Skill Group', skills: [] },
            ],
          }))
        }
        className="flex w-full items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-slate-300 dark:border-white/20 bg-slate-50/50 dark:bg-white/[0.01] text-[13px] font-bold text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-all cursor-pointer shadow-2xs"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        <span>{isAr ? "+ إضافة تصنيف مهارات جديد" : "+ Add Skill Category"}</span>
      </button>
    </div>
  );
}

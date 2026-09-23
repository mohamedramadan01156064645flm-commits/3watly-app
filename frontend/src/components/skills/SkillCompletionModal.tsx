"use client";

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  X,
  FolderPlus,
  ArrowUpRight,
  Loader2,
  Layers,
  Award,
  ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';
import type { PlannedSkill } from '@/types/skills';
import { useCV } from '@/contexts/CVContext';
import { useSkillPlan } from '@/contexts/SkillPlanContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getSmartSkillCategory, normalizeSkillName, areSkillsEquivalent, addSkillsSmartly } from '@/utils/skillTaxonomy';

interface SkillCompletionModalProps {
  open: boolean;
  skill: PlannedSkill | null;
  onClose: () => void;
  onCompleted?: (skillName: string, categoryLabel: string) => void;
}

export function SkillCompletionModal({
  open,
  skill,
  onClose,
  onCompleted
}: SkillCompletionModalProps) {
  const { isAr } = useLanguage();
  const cvContext = useCV();
  const { cv, update } = cvContext;
  const { completeSkill } = useSkillPlan();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  // Determine smart category on skill change
  useEffect(() => {
    if (skill && skill.def) {
      const canon = normalizeSkillName(skill.def.name);
      const meta = getSmartSkillCategory(canon, cv?.skills || [], isAr);
      setSelectedCategory(meta.targetGroupLabel);
      setIsCustomCategory(false);
      setCustomCategoryInput('');
    }
  }, [skill, cv?.skills, isAr]);

  if (!open || !skill) return null;

  const skillName = normalizeSkillName(skill.def.name);
  const existingGroups = (cv?.skills || []).map((g) => g.label).filter(Boolean);

  const handleConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const finalCategory = isCustomCategory
        ? (customCategoryInput.trim() || selectedCategory)
        : selectedCategory;

      let resolvedCategory = finalCategory;
      const addSkillFn = (cvContext as any)?.addSkillToActiveCv;

      if (typeof addSkillFn === 'function') {
        const result = await addSkillFn(skillName, finalCategory);
        resolvedCategory = result.categoryLabel || finalCategory;
      } else if (typeof update === 'function') {
        // Direct reliable update via update() context function
        update((prev) => {
          const skills = (prev.skills || []).map((g) => ({ ...g, skills: [...g.skills] }));

          if (finalCategory && finalCategory.trim()) {
            const trimmed = finalCategory.trim();
            const existingGroup = skills.find(
              (g) => g.label.trim().toLowerCase() === trimmed.toLowerCase()
            );
            if (existingGroup) {
              resolvedCategory = existingGroup.label;
              if (!existingGroup.skills.some((s) => areSkillsEquivalent(s, skillName))) {
                existingGroup.skills.push(skillName);
              }
              return { ...prev, skills };
            } else {
              resolvedCategory = trimmed;
              skills.push({
                id: `group-${Date.now().toString(36)}`,
                label: trimmed,
                skills: [skillName]
              });
              return { ...prev, skills };
            }
          }

          const meta = getSmartSkillCategory(skillName, skills, isAr);
          resolvedCategory = meta.targetGroupLabel;
          const updated = addSkillsSmartly(skills, [skillName], isAr);
          return { ...prev, skills: updated };
        }, 'add-skill-smart');
      }

      // Sync to localStorage immediately so active dashboard and parsers reflect it
      try {
        const rawParsed = localStorage.getItem('3watly_parsed_cv');
        if (rawParsed) {
          const p = JSON.parse(rawParsed);
          if (Array.isArray(p.skills)) {
            if (!p.skills.some((s: string) => areSkillsEquivalent(s, skillName))) {
              p.skills.push(skillName);
              localStorage.setItem('3watly_parsed_cv', JSON.stringify(p));
            }
          }
        }
        window.dispatchEvent(new Event('3watly_active_cv_changed'));
      } catch {}

      // Mark as completed in skill plan
      if (skill.def.id && typeof completeSkill === 'function') {
        completeSkill(skill.def.id);
      }

      toast.success(
        isAr
          ? `تهانينا! 🎉 تمت إضافة مهارة "${skillName}" بنجاح إلى قسم [${resolvedCategory}] في سيرتك الذاتية.`
          : `Awesome! 🎉 "${skillName}" has been added to [${resolvedCategory}] in your CV.`
      );

      if (onCompleted) {
        onCompleted(skillName, resolvedCategory);
      }
      onClose();
    } catch (err: any) {
      console.error('Skill completion error:', err);
      toast.error(
        err?.message ||
          (isAr ? 'حدث خطأ أثناء إضافة المهارة' : 'Failed to add skill')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-2xl overflow-hidden z-10"
        >
          {/* Subtle Top Decorative Glow */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4.5 ltr:right-4.5 rtl:left-4.5 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3.5 pt-1">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-200/60 dark:border-emerald-800/40">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[17px] font-bold text-slate-900 dark:text-white">
                  {isAr ? 'إتمام المهارة وإضافتها للـ CV' : 'Mark Completed & Add to CV'}
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-extrabold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50">
                  <Sparkles className="w-3 h-3" />
                  {isAr ? 'تأكيد الإتقان' : 'Mastered'}
                </span>
              </div>
              <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                {isAr
                  ? 'سيتم تسجيل المهارة كمكتملة وتضمينها باحترافية في سيرتك الذاتية النشطة.'
                  : 'This skill will be marked complete and cleanly placed into your active CV.'}
              </p>
            </div>
          </div>

          {/* Skill Highlight Card */}
          <div className="mt-5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/80 dark:bg-[#070C18] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-[16px] font-bold text-slate-900 dark:text-white">
                  {skillName}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-[#1B57E0] dark:text-[#60A5FA]">
                {isAr ? `مطلوبة بنسبة ${skill.demand}%` : `${skill.demand}% Demand`}
              </span>
            </div>

            {skill.jobsUnlocked > 0 && (
              <div className="flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="w-4 h-4 shrink-0" />
                <span>
                  {isAr
                    ? `تفتح سيرتك الذاتية أمام +${skill.jobsUnlocked} وظيفة شاغرة في السوق المصري`
                    : `Expands your fit for +${skill.jobsUnlocked} active roles in Egypt`}
                </span>
              </div>
            )}
          </div>

          {/* Smart Category Placement Box */}
          <div className="mt-4.5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-[13px] font-bold text-slate-800 dark:text-slate-200">
                <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{isAr ? 'القسم المخصص في سيرتك الذاتية:' : 'Target CV Category:'}</span>
              </label>
              <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-200/50 dark:border-purple-800/40">
                {isAr ? 'تصنيف ذكي تلقائي' : 'Smart Auto-Placed'}
              </span>
            </div>

            {/* Category Selector */}
            <div className="space-y-2">
              <div className="relative">
                <select
                  value={isCustomCategory ? '__custom__' : selectedCategory}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setIsCustomCategory(true);
                    } else {
                      setIsCustomCategory(false);
                      setSelectedCategory(e.target.value);
                    }
                  }}
                  className="w-full appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070C18] py-2.5 px-3.5 text-[13px] font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 transition-all cursor-pointer"
                >
                  {/* Smart suggested category */}
                  <option value={selectedCategory}>
                    {selectedCategory} {isAr ? '(الموصى به بذكاء)' : '(Smart Recommendation)'}
                  </option>

                  {/* Existing user categories */}
                  {existingGroups
                    .filter((g) => g.toLowerCase() !== selectedCategory.toLowerCase())
                    .map((grp) => (
                      <option key={grp} value={grp}>
                        {grp}
                      </option>
                    ))}

                  {/* Standard tech categories if different */}
                  {[
                    isAr ? 'السحابة والتشغيل (DevOps)' : 'Cloud & DevOps',
                    isAr ? 'قواعد البيانات والتخزين' : 'Databases & Storage',
                    isAr ? 'هندسة البيانات والمعالجة' : 'Data Engineering & Pipelines',
                    isAr ? 'لغات البرمجة' : 'Programming Languages',
                    isAr ? 'ذكاء الأعمال والتحليلات' : 'BI & Analytics',
                    isAr ? 'أطر العمل والمكتبات' : 'Frameworks & Libraries'
                  ]
                    .filter((cat) => 
                      cat.toLowerCase() !== selectedCategory.toLowerCase() && 
                      !existingGroups.some(g => g.toLowerCase() === cat.toLowerCase())
                    )
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}

                  {/* Create New Category Option */}
                  <option value="__custom__">
                    {isAr ? '+ إنشاء قسم مخصص جديد...' : '+ Create new custom category...'}
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 ltr:right-3 rtl:left-3 flex items-center text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {/* If custom category chosen */}
              {isCustomCategory && (
                <div className="pt-1">
                  <input
                    type="text"
                    placeholder={isAr ? "اكتب اسم القسم الجديد (مثال: أطر العمل السحابية)" : "Enter custom category name"}
                    value={customCategoryInput}
                    onChange={(e) => setCustomCategoryInput(e.target.value)}
                    className="w-full rounded-xl border border-blue-300 dark:border-blue-500/40 bg-white dark:bg-[#070C18] py-2.5 px-3.5 text-[13px] font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
                    autoFocus
                  />
                </div>
              )}
            </div>

            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed pt-0.5">
              {isAr
                ? 'يتم ترتيب المهارات داخل القسم المحدد بطريقة منظمة ومقروءة لمحركات الـ ATS ومسؤولي التوظيف.'
                : 'Skills will be cleanly organized and searchable by ATS parsers and technical recruiters.'}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 font-bold text-[13px] transition-colors cursor-pointer disabled:opacity-50"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B57E0] hover:bg-blue-700 text-white font-bold text-[13px] shadow-md shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>
                {isSubmitting
                  ? (isAr ? 'جاري الإضافة والتحديث...' : 'Adding...')
                  : (isAr ? 'تأكيد وإضافة إلى الـ CV 🚀' : 'Confirm & Add to CV 🚀')}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

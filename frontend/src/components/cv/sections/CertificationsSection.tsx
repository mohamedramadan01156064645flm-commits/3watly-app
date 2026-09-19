"use client";

import React from 'react';
import { PlusIcon, ExternalLink, Award, Trash2, Calendar, Building2 } from 'lucide-react';
import { useCV } from '../../../contexts/CVContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { uid } from '../../../utils/cvHelpers';
import type { CertificationItem } from '../../../types/cv';

export function CertificationsSection() {
  const { cv, update } = useCV();
  const { isAr } = useLanguage();
  const certs = cv.certifications || [];

  const add = () => {
    update(
      (prev) => ({
        ...prev,
        certifications: [
          ...(prev.certifications || []),
          { id: uid('cert'), name: '', issuer: '', url: '', date: '' },
        ],
      }),
      'cert-add'
    );
  };

  const remove = (id: string) => {
    update(
      (prev) => ({
        ...prev,
        certifications: (prev.certifications || []).filter((c) => c.id !== id),
      }),
      'cert-remove'
    );
  };

  const patch = (id: string, changes: Partial<CertificationItem>) => {
    update(
      (prev) => ({
        ...prev,
        certifications: (prev.certifications || []).map((c) =>
          c.id === id ? { ...c, ...changes } : c
        ),
      }),
      'cert-edit'
    );
  };

  return (
    <div className="space-y-4 px-4 pb-4">
      {certs.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-white/10 p-5 text-center bg-slate-50/50 dark:bg-white/[0.01]">
          <Award className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-500 mb-2 stroke-[1.5]" />
          <p className="text-[13px] font-medium text-slate-600 dark:text-slate-300">
            {isAr ? "لم تتم إضافة أي شهادات حتى الآن" : "No certifications added yet"}
          </p>
          <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-1">
            {isAr
              ? "أضف شهاداتك ودوراتك المهنية لتعزيز نقاط قوة ملفك في أنظمة الـ ATS."
              : "Add your certifications and professional courses to strengthen your ATS score."}
          </p>
        </div>
      )}

      {certs.map((cert, index) => {
        const titleDisplay = cert.name.trim() || (isAr ? `شهادة #${index + 1}` : `Certification #${index + 1}`);

        return (
          <div
            key={cert.id}
            className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-slate-50/60 dark:bg-[#070E20]/70 p-4 sm:p-5 space-y-4 shadow-2xs hover:border-slate-300 dark:hover:border-white/20 transition-colors"
          >
            {/* Card Header: Title + Delete button */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-white/5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/80 border border-blue-200/70 dark:border-blue-500/30 text-blue-600 dark:text-blue-400">
                  <Award className="w-4 h-4" />
                </span>
                <h4 className="text-[13px] font-bold text-slate-800 dark:text-slate-200 truncate">
                  {titleDisplay}
                </h4>
              </div>

              <button
                type="button"
                onClick={() => remove(cert.id)}
                title={isAr ? "حذف الشهادة" : "Delete certification"}
                aria-label={`Delete ${cert.name || 'certification'}`}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Field 1: Certificate Name */}
            <div>
              <label className="block text-[12.5px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {isAr ? "اسم الشهادة أو الدورة *" : "Certificate Name *"}
              </label>
              <input
                type="text"
                value={cert.name}
                onChange={(e) => patch(cert.id, { name: e.target.value })}
                placeholder={isAr ? "مثال: Google Data Analytics Professional Certificate" : "e.g. Google Data Analytics Professional Certificate"}
                className="w-full h-10 rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#050A16] px-3.5 text-[13px] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Field 2: Issuer / Platform */}
            <div>
              <label className="block text-[12.5px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {isAr ? "الجهة المصدرة / المنصة" : "Issuer / Platform"}
                </span>
              </label>
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) => patch(cert.id, { issuer: e.target.value })}
                placeholder={isAr ? "مثال: Coursera, Google, Cognitive Class, IBM" : "e.g. Coursera, Google, Cognitive Class, IBM"}
                className="w-full h-10 rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#050A16] px-3.5 text-[13px] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Row 3: Date & Verify URL — Balanced 4/8 grid with proper LTR URL formatting */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-0.5">
              {/* Date */}
              <div className="sm:col-span-5">
                <label className="block text-[12.5px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {isAr ? "تاريخ الحصول عليها" : "Date Acquired"}
                  </span>
                </label>
                <input
                  type="text"
                  value={cert.date || ''}
                  onChange={(e) => patch(cert.id, { date: e.target.value })}
                  placeholder={isAr ? "مثال: Nov 2025" : "e.g. Nov 2025"}
                  className="w-full h-10 rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#050A16] px-3.5 text-[13px] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* Verify URL */}
              <div className="sm:col-span-7">
                <label className="block text-[12.5px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span className="inline-flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    {isAr ? "رابط التحقق (URL)" : "Verification URL"}
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="url"
                    dir="ltr"
                    value={cert.url || ''}
                    onChange={(e) => patch(cert.id, { url: e.target.value })}
                    placeholder="https://credential.net/..."
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#050A16] text-[12.5px] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-sans text-left transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={add}
        className="w-full py-2.5 inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 dark:border-white/20 bg-slate-50/50 dark:bg-white/[0.02] text-[13px] font-bold text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all cursor-pointer"
      >
        <PlusIcon className="h-4 w-4" />
        <span>{isAr ? "إضافة شهادة جديدة" : "Add New Certification"}</span>
      </button>
    </div>
  );
}

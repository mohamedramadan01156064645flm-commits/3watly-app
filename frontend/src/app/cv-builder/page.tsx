"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2Icon,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  Redo2Icon,
  Undo2Icon
} from "lucide-react";
import { toast } from "sonner";
import { useCV } from "@/contexts/CVContext";
import { TEMPLATES } from "@/data/cvData";
import { EditorPanel } from "@/components/cv/EditorPanel";
import { CVPreview } from "@/components/cv/CVPreview";
import { CVVersionSelector } from "@/components/cv/CVVersionManager";
import type { TemplateId } from "@/types/cv";
import { AppShell } from "@/components/layout/AppShell";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dropdown } from "@/components/ui/Dropdown";
import { exportCvToPdf } from "@/utils/pdfExport";

export default function CVBuilderPage() {
  const {
    cv,
    saveStatus,
    template,
    setTemplate,
    undo,
    redo,
    canUndo,
    canRedo,
    analysis
  } = useCV();
  const { isAr } = useLanguage();
  const [previewMode, setPreviewMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey;
      if (!meta || event.key.toLowerCase() !== "z") return;
      event.preventDefault();
      if (event.shiftKey) redo();
      else undo();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  const downloadPdf = async () => {
    if (isExporting) return;
    setIsExporting(true);
    toast.loading(
      isAr
        ? "جاري تجهيز وتحميل ملف الـ PDF مباشرة..."
        : "Generating and downloading your PDF...",
      { id: "export-pdf" }
    );

    try {
      const fileName = cv.contact.fullName
        ? `${cv.contact.fullName.replace(/\s+/g, '_')}_Resume.pdf`
        : 'Resume.pdf';

      await exportCvToPdf('cv-paper-root', fileName, cv, template);

      toast.success(
        isAr
          ? "تم تحميل ملف السيرة الذاتية مباشرة بنجاح! 🎉"
          : "Resume PDF downloaded directly to your device! 🎉",
        { id: "export-pdf" }
      );
    } catch (err: any) {
      console.error('PDF export failed:', err);
      toast.error(
        isAr ? "حدث خطأ أثناء التصدير، يرجى المحاولة مرة أخرى" : "Export failed, please try again.",
        { id: "export-pdf" }
      );
    } finally {
      setIsExporting(false);
    }
  };

  const templateOptions = TEMPLATES.map((item) => ({
    id: item.id,
    label: isAr
      ? item.id === 'ats-classic'
        ? 'ATS Friendly (موصى به)'
        : item.id === 'compact'
        ? 'Compact (مدمج لصفحة واحدة)'
        : item.id === 'two-column'
        ? 'Two Column (تخطيط عمودين)'
        : item.id === 'simple'
        ? 'Simple (أكاديمي كلاسيكي)'
        : item.name
      : item.name
  }));

  return (
    <AppShell
      title={isAr ? "صانع السيرة الذاتية الذكي" : "Smart CV Builder"}
      subtitle={
        isAr
          ? "محرر سيرة ذاتية تفاعلي متوافق 100% مع أنظمة الـ ATS مع دعم الذكاء الاصطناعي."
          : "Interactive ATS-optimized resume builder with AI assistance."
      }
      showSearch={false}
    >
      <div className="space-y-6 max-w-[1500px] mx-auto pb-12">
        {/* Top Actions & Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-[22px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
          
          {/* Multi-CV Version Selector & Status badge */}
          <div className="flex flex-wrap items-center gap-3">
            <CVVersionSelector />

            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12.5px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/30"
              aria-live="polite"
            >
              {saveStatus === "saving" ? (
                <>
                  <Loader2Icon
                    className="h-3.5 w-3.5 animate-spin text-amber-500"
                    aria-hidden="true"
                  />
                  <span>{isAr ? "جاري الحفظ..." : "Saving…"}</span>
                </>
              ) : (
                <>
                  <CheckCircle2Icon
                    className="h-3.5 w-3.5 text-emerald-500"
                    aria-hidden="true"
                  />
                  <span>{isAr ? "تم الحفظ تلقائياً" : "Auto-saved"}</span>
                </>
              )}
            </span>
          </div>

          {/* Controls: Undo/Redo, Preview, Template Selector, Download */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Undo / Redo */}
            <div className="flex items-center rounded-xl border border-slate-200/90 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-1">
              <button
                type="button"
                onClick={undo}
                disabled={!canUndo}
                aria-label="Undo"
                title={isAr ? "تراجع (Ctrl+Z)" : "Undo (Ctrl+Z)"}
                className="rounded-lg p-1.5 text-slate-600 dark:text-slate-300 transition-all hover:bg-white dark:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer shadow-xs disabled:shadow-none"
              >
                <Undo2Icon className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={redo}
                disabled={!canRedo}
                aria-label="Redo"
                title={isAr ? "إعادة (Ctrl+Shift+Z)" : "Redo (Ctrl+Shift+Z)"}
                className="rounded-lg p-1.5 text-slate-600 dark:text-slate-300 transition-all hover:bg-white dark:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer shadow-xs disabled:shadow-none"
              >
                <Redo2Icon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Preview Mode Toggle */}
            <button
              type="button"
              onClick={() => setPreviewMode((v) => !v)}
              aria-pressed={previewMode}
              className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-[13px] font-semibold transition-all cursor-pointer shadow-xs ${
                previewMode
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-[#1B57E0] dark:text-[#60A5FA]'
                  : 'border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
            >
              {previewMode ? (
                <EyeOffIcon className="h-4 w-4 text-[#1B57E0] dark:text-[#60A5FA]" aria-hidden="true" />
              ) : (
                <EyeIcon className="h-4 w-4 text-slate-400" aria-hidden="true" />
              )}
              <span>
                {previewMode
                  ? isAr
                    ? "إلغاء المعاينة"
                    : "Exit Preview"
                  : isAr
                  ? "وضع المعاينة الكاملة"
                  : "Full Preview"}
              </span>
            </button>

            {/* Custom Theme-Aware Template Dropdown */}
            <Dropdown
              options={templateOptions}
              value={template}
              onChange={(id) => setTemplate(id as TemplateId)}
              label={isAr ? "القالب المختار:" : "Active Template:"}
              menuWidth="w-[240px]"
            />

            {/* Download PDF Button */}
            <button
              type="button"
              disabled={isExporting}
              onClick={downloadPdf}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1B57E0] hover:bg-blue-700 disabled:opacity-60 px-4 py-2 text-[13px] font-bold text-white transition-all cursor-pointer shadow-md shadow-blue-600/20"
            >
              {isExporting ? (
                <Loader2Icon className="h-4 w-4 animate-spin text-white" aria-hidden="true" />
              ) : (
                <DownloadIcon className="h-4 w-4" aria-hidden="true" />
              )}
              <span>{isExporting ? (isAr ? "جاري التحميل..." : "Exporting...") : (isAr ? "تحميل PDF" : "Download PDF")}</span>
            </button>
          </div>
        </div>

        {/* Empty CV / New User Onboarding Banner */}
        {(!cv.contact.fullName && cv.experience.length === 0 && cv.education.length === 0) && (
          <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-black shadow-md text-lg">
                ✨
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isAr ? "مرحباً بك في منشئ السيرة الذاتية الذكي!" : "Welcome to Smart CV Builder!"}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {isAr 
                    ? "قالبك فارغ وجاهز لبناء أول سيرة ذاتية لك. ابدأ بإدخال بياناتك من اللوحة، أو ارفع ملف سيرة ذاتية لاستخراجها تلقائياً."
                    : "Your canvas is clean and ready. Start adding your details, or upload a resume file to auto-fill."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/onboarding/cv-upload"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/15 text-xs font-bold text-[#1B57E0] dark:text-[#60A5FA] border border-slate-200/80 dark:border-white/10 transition-all shadow-xs"
              >
                <span>{isAr ? "📄 رفع سيرة ذاتية سابقة" : "📄 Upload Existing Resume"}</span>
              </Link>
            </div>
          </div>
        )}

        {/* Builder Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Editor Panel */}
          {!previewMode && (
            <div className="no-print lg:col-span-5 space-y-4">
              <EditorPanel />
              <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] text-xs text-slate-500 dark:text-slate-400 shadow-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {isAr ? "توافق الـ ATS الحالي:" : "Current ATS compatibility:"}{" "}
                </span>
                <span className="font-black text-emerald-600 dark:text-emerald-400">{analysis.score}/100</span> ·{" "}
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  {isAr ? analysis.bandLabelAr : analysis.bandLabel}
                </span> ·{" "}
                <Link
                  href="/ats-diagnostics"
                  className="font-bold text-[#1B57E0] dark:text-[#60A5FA] hover:underline"
                >
                  {isAr ? "فتح تقرير الـ ATS" : "Open diagnostics"}
                </Link>
              </div>
            </div>
          )}

          {/* Live Preview Paper */}
          <div className={`${previewMode ? 'lg:col-span-12' : 'lg:col-span-7'} rounded-2xl p-2 sm:p-4 transition-all`}>
            <CVPreview />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

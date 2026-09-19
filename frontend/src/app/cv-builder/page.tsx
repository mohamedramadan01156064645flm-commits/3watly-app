"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2Icon,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  Redo2Icon,
  Undo2Icon,
  UploadCloudIcon,
  PlusCircleIcon
} from "lucide-react";
import { toast } from "sonner";
import { useCV } from "@/contexts/CVContext";
import { TEMPLATES } from "@/data/cvData";
import { EditorPanel } from "@/components/cv/EditorPanel";
import { CVPreview } from "@/components/cv/CVPreview";
import { CVVersionSelector } from "@/components/cv/CVVersionManager";
import type { CVData, TemplateId } from "@/types/cv";
import { AppShell } from "@/components/layout/AppShell";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Dropdown } from "@/components/ui/Dropdown";
import { exportCvToPdf } from "@/utils/pdfExport";

export default function CVBuilderPage() {
  const { user } = useAuth();
  const {
    cv,
    saveStatus,
    template,
    setTemplate,
    undo,
    redo,
    canUndo,
    canRedo,
    analysis,
    createVersion
  } = useCV();
  const { isAr } = useLanguage();
  const [previewMode, setPreviewMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewScrollRef = useRef<HTMLDivElement>(null);

  // Guarantee calm, natural scrolling on CV Builder without runaway wheel acceleration
  useEffect(() => {
    const prevScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';

    return () => {
      document.documentElement.style.scrollBehavior = prevScrollBehavior;
    };
  }, []);



  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    toast.loading(
      isAr ? "جاري قراءة وتحليل بيانات السيرة الذاتية واستخراج الروابط..." : "Parsing resume & extracting links...",
      { id: "upload-direct-cv" }
    );

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/cv/parse", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to parse CV");
      }

      const json = await res.json();
      const data = json.data;

      // Build structured social links
      const parsedSocialLinks = Array.isArray(data.socialLinks) && data.socialLinks.length > 0
        ? data.socialLinks
        : [
            data.linkedin ? { id: "link-li", platform: "LinkedIn", url: data.linkedin } : null,
            data.github ? { id: "link-gh", platform: "GitHub", url: data.github } : null,
            data.portfolio ? { id: "link-pf", platform: "Portfolio", url: data.portfolio } : null,
          ].filter(Boolean);

      const resolvedJobTitle = data.currentTitle || data.targetRole || data.experiences?.[0]?.role || (data.education?.[0]?.degree ? `${data.education[0].degree} Graduate` : "") || (isAr ? "متخصص تقني" : "Tech Professional");

      const newCvData: CVData = {
        contact: {
          fullName: data.fullName || "User",
          jobTitle: resolvedJobTitle,
          phone: data.phone || "",
          email: data.email || "",
          location: data.location || "",
          linkedin: data.linkedin || "",
          github: data.github || "",
          portfolio: data.portfolio || "",
          socialLinks: parsedSocialLinks as any
        },
        summary: data.summary || "",
        skillsSummary: null,
        experience: Array.isArray(data.experiences) && data.experiences.length > 0
          ? data.experiences.map((exp: any, idx: number) => ({
              id: exp.id || `exp-${idx + 1}`,
              role: exp.role || resolvedJobTitle || "Professional",
              company: exp.company || "",
              companyUrl: exp.companyUrl || "",
              startDate: exp.startDate || "",
              endDate: exp.endDate || "Present",
              current: Boolean(exp.current),
              location: exp.location || data.location || "",
              bullets: Array.isArray(exp.bullets) ? exp.bullets : [],
              type: exp.type || (/intern\b|تدريب/i.test(exp.role) ? 'internship' : 'job')
            }))
          : [],
        education: Array.isArray(data.education) && data.education.length > 0 ? data.education : [],
        projects: Array.isArray(data.projects) && data.projects.length > 0 ? data.projects.map((p: any, idx: number) => ({
          id: p.id || `prj-${idx + 1}`,
          title: p.title || `Project ${idx + 1}`,
          technologies: Array.isArray(p.technologies) ? p.technologies : [],
          github: p.github || "",
          link: p.link || "",
          bullets: Array.isArray(p.bullets) && p.bullets.length > 0
            ? p.bullets
            : (p.description ? [p.description] : [])
        })) : [],
        skills: Array.isArray(data.categorizedSkillGroups) && data.categorizedSkillGroups.length > 0
          ? data.categorizedSkillGroups
          : (data.skills?.length ? [{ id: "tech-1", label: "Technical Skills", skills: data.skills }] : []),
        certifications: Array.isArray(data.certificates) ? data.certificates.map((c: any, idx: number) => ({
          id: c.id || `cert-${idx + 1}`,
          name: c.name || '',
          issuer: c.issuer || 'Verified Credential',
          url: c.url || undefined,
          date: c.date || undefined,
        })) : [],
        sectionOrder: (Array.isArray(data.sectionOrder) && data.sectionOrder.length > 0
          ? [...data.sectionOrder.filter((s: string) => s !== 'certifications'), 'certifications']
          : ["summary", "education", "experience", "skills", "projects", "certifications"]) as any,
        hiddenSections: []
      };

      const cleanFileName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").trim() || "سيرة ذاتية مرفوعة";
      const created = createVersion(cleanFileName, resolvedJobTitle, newCvData);

      try {
        localStorage.setItem('3watly_parsed_cv', JSON.stringify(data));
        if (user?.id) {
          localStorage.setItem(`3watly_parsed_cv_${user.id}`, JSON.stringify(data));
        }
        window.dispatchEvent(new CustomEvent('3watly_parsed_cv_updated', { detail: data }));
      } catch {}

      // Immediately sync to Supabase cloud so the CV stays saved forever across devices and signouts
      if (user?.id) {
        try {
          fetch('/api/cv/document', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              filename: cleanFileName,
              targetRole: resolvedJobTitle,
              cvData: newCvData,
              versions: [created],
              activeVersionId: created.id,
              parsedCv: data,
              rawText: data.rawText || '',
              atsScore: data.atsScore || 85,
            }),
          }).catch(() => null);
        } catch {}
      }

      toast.success(
        isAr ? "تم استخراج كافة البيانات والروابط وحفظ السيرة الذاتية بنجاح! 🚀" : "CV parsed, saved, and imported into the builder! 🚀",
        { id: "upload-direct-cv" }
      );
    } catch (err: any) {
      toast.error(err.message || (isAr ? "حدث خطأ أثناء قراءة السيرة الذاتية" : "Failed to parse CV"), { id: "upload-direct-cv" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

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
    label: isAr ? item.nameAr : item.name
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
      <div className="flex flex-col min-h-0">
        {/* Top Actions & Toolbar — Clean relative layout, never collides with sticky AppTopbar */}
        <div className="no-print relative z-10 flex flex-wrap items-center justify-between gap-4 p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] shadow-sm mb-5">
          
          {/* Multi-CV Version Selector & Status badge & Direct Upload */}
          <div className="flex flex-wrap items-center gap-3">
            <CVVersionSelector />

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleDirectUpload}
              accept=".pdf,.docx,.doc"
              className="hidden"
            />

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

          {/* Controls: Undo/Redo, Preview, Template Selector, Print, Download */}
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
          <div className="no-print shrink-0 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm mb-5">
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
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B57E0] hover:bg-blue-700 text-xs font-bold text-white transition-all shadow-md shadow-blue-600/20 cursor-pointer disabled:opacity-50"
              >
                <UploadCloudIcon className="h-3.5 w-3.5" />
                <span>{isAr ? "رفع ملف سيرة ذاتية (PDF)" : "Upload Resume (PDF)"}</span>
              </button>
            </div>
          </div>
        )}

        {/* ── Builder Main Grid: Natural 120fps scrolling on left, sticky preview on right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ── Left: Editor Panel (scrolls naturally with the page, ultra smooth) ── */}
          {!previewMode && (
            <div className="no-print lg:col-span-5 space-y-4 pb-20 min-w-0">
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

          {/* ── Right: CV Preview (Sticky on desktop, natural internal scroll if needed) ── */}
          <div className={`${previewMode ? 'lg:col-span-12' : 'lg:col-span-7'} lg:sticky lg:top-24 max-h-[calc(100vh-7.5rem)] flex flex-col min-w-0`}>
            <div ref={previewScrollRef} className="cv-preview-scroll flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent rounded-2xl overscroll-contain">
              <CVPreview />
            </div>
          </div>

        </div>
      </div>
    </AppShell>
  );
}

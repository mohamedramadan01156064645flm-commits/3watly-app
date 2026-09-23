"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Download, UploadCloud, ArrowRight, ArrowLeft, FileText, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useCV } from "@/contexts/CVContext";
import type { CVData } from "@/types/cv";
import { ScoreOverview } from "@/components/ats/ScoreOverview";
import { StructureCard } from "@/components/ats/StructureCard";
import { ParserCard } from "@/components/ats/ParserCard";
import { KeywordCard } from "@/components/ats/KeywordCard";
import { ActiveCVBadge } from "@/components/cv/CVVersionManager";
import { AppShell } from "@/components/layout/AppShell";
import { useLanguage } from "@/contexts/LanguageContext";
import { downloadAtsDiagnosticPdf } from "@/utils/atsReportGenerator";

export default function ATSDiagnosticsPage() {
  const { analysis, applyFix, cv, createVersion } = useCV();
  const { isAr } = useLanguage();
  const [downloading, setDownloading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [runKey, setRunKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previousScore = useRef(analysis.score);

  const isCvEmpty = !cv.contact.fullName && cv.experience.length === 0 && cv.skills.length === 0;

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    toast.loading(
      isAr ? "جاري قراءة وفحص ملف السيرة الذاتية..." : "Uploading & running ATS scan...",
      { id: "ats-upload" }
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
          location: data.location || "Cairo, Egypt",
          linkedin: data.linkedin || "",
          github: data.github || "",
          portfolio: data.portfolio || "",
          socialLinks: parsedSocialLinks as any
        },
        summary: data.summary || "",
        skillsSummary: null,
        experience: Array.isArray(data.experiences) && data.experiences.length > 0 ? data.experiences : [],
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
        sectionOrder: [
          ...(data.sectionOrder?.filter((s: string) => ['summary','experience','education','skills','projects'].includes(s)) || ['summary', 'experience', 'education', 'skills', 'projects']),
          'certifications'
        ],
        hiddenSections: []
      };

      const cleanFileName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").trim() || "سيرة ذاتية مرفوعة";
      createVersion(cleanFileName, resolvedJobTitle, newCvData);
      setRunKey(prev => prev + 1);

      toast.success(
        isAr ? "تم استيراد سيرتك الذاتية وإجراء فحص الـ ATS بنجاح! 🎯" : "Resume imported and ATS scanned successfully! 🎯",
        { id: "ats-upload" }
      );
    } catch (err: any) {
      toast.error(err.message || (isAr ? "فشل تحليل السيرة الذاتية" : "Failed to scan CV"), { id: "ats-upload" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    const before = previousScore.current;
    if (analysis.score === before) return;
    previousScore.current = analysis.score;
    const delta = analysis.score - before;
    if (delta > 0) {
      toast.success(
        isAr
          ? `ارتفعت درجة الـ ATS إلى ${analysis.score} (+${delta} نقطة).`
          : `ATS score improved to ${analysis.score} (+${delta} points).`
      );
    } else {
      toast.warning(
        isAr
          ? `انخفضت درجة الـ ATS إلى ${analysis.score} (${delta} نقطة).`
          : `ATS score dropped to ${analysis.score} (${delta} points).`
      );
    }
  }, [analysis.score, isAr]);

  const handleDownloadReport = async () => {
    try {
      setDownloading(true);
      toast.info(
        isAr
          ? "اختر 'حفظ بتنسيق PDF' (Save as PDF) لحفظ التقرير كصفحة واحدة بنصوص حقيقية 100% قابلة للتحديد والنسخ."
          : "Choose 'Save as PDF' to save your 1-page report with 100% real selectable text."
      );
      await downloadAtsDiagnosticPdf(analysis, cv, isAr);
    } catch (err) {
      console.error("Failed to download ATS report:", err);
      toast.error(isAr ? "فشل إنشاء تقرير الـ PDF" : "Failed to generate PDF report");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AppShell
      title={isAr ? "تحليلات وفحص الـ ATS" : "ATS Diagnostics"}
      subtitle={
        isAr
          ? "تحليل شامل ودقيق لتوافق سيرتك الذاتية مع أنظمة الفرز الآلي ومتطلبات سوق العمل المصري."
          : "Comprehensive diagnostics of your resume's ATS readiness and Egyptian market alignment."
      }
      showSearch={false}
    >
      <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
        {/* Top Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-[22px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-[17px] font-bold text-slate-900 dark:text-white">
                {isAr ? "فحص مطابقة الـ ATS" : "ATS Compatibility Scan"}
              </h2>
              <ActiveCVBadge pageName={isAr ? "فحص الـ ATS" : "ATS Diagnostics"} />
            </div>
            <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-1">
              {isAr
                ? `تم فحص سيرتك الذاتية لـ ${analysis.keywords.role} في مصر (آخر فحص منذ لحظات)`
                : `Evaluated for ${analysis.keywords.role} roles in Egypt (checked moments ago)`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleDirectUpload}
              accept=".pdf,.docx,.doc"
              className="hidden"
            />

            <button
              type="button"
              onClick={handleDownloadReport}
              disabled={downloading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B57E0] hover:bg-blue-700 text-white font-bold text-[13px] shadow-md shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-60"
            >
              <Download className="h-4 w-4" />
              <span>{isAr ? "تحميل التقرير PDF" : "Download Report PDF"}</span>
            </button>
          </div>
        </div>

        {/* Empty State Banner if user registered without a CV */}
        {isCvEmpty && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-50/80 dark:bg-amber-950/30 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-[14.5px] font-bold text-slate-900 dark:text-white">
                  {isAr ? "لا توجد سيرة ذاتية مفعلة للفحص حالياً" : "No active resume to analyze"}
                </h4>
                <p className="text-[12.5px] text-slate-600 dark:text-slate-300 mt-0.5">
                  {isAr
                    ? "التحليل المعروض أدناه يعتمد على قالب فارغ. قم برفع سيرتك الذاتية (PDF/DOCX) أو املأ بياناتك لبدء الفحص الحقيقي واستخراج النتائج بدقة."
                    : "The diagnostics below reflect an empty template. Upload your resume or fill your details in the builder to see genuine results."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1B57E0] hover:bg-blue-700 text-white font-bold text-xs shadow-sm cursor-pointer disabled:opacity-50"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{isUploading ? (isAr ? "جاري الرفع..." : "Uploading...") : (isAr ? "رفع سيرتك الذاتية (PDF)" : "Upload Resume (PDF)")}</span>
              </button>
              <Link
                href="/cv-builder"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 font-bold text-xs cursor-pointer"
              >
                <span>{isAr ? "فتح صانع الـ CV" : "Open CV Builder"}</span>
              </Link>
            </div>
          </div>
        )}

        {/* Score Overview */}
        <ScoreOverview analysis={analysis} runKey={runKey} />

        {/* 3 Diagnostic Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <StructureCard analysis={analysis} />
          <ParserCard analysis={analysis} />
          <KeywordCard analysis={analysis} />
        </div>
      </div>
    </AppShell>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import {
  FileText, Search, Download, Eye, Sparkles, CheckCircle2,
  AlertCircle, ChevronRight, User, Calendar, Award, Tag, RefreshCw,
  Printer, Briefcase, GraduationCap, FolderGit2, Check, ExternalLink,
  Layers, Users, Shield, ArrowUpRight, Filter, X
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { exportCandidateCvToPdf } from '@/utils/adminCvPdfExport';
import { toast } from 'sonner';
import type { AdminCvItem } from '@/components/admin/AdminCvsModal';

export default function AdminCvsPage() {
  const { isAr } = useLanguage();
  const [cvs, setCvs] = useState<AdminCvItem[]>([]);
  const [total, setTotal] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [profileCount, setProfileCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sourceTab, setSourceTab] = useState<'all' | 'uploaded' | 'profile'>('all');
  const [selectedCv, setSelectedCv] = useState<AdminCvItem | null>(null);

  const fetchCvs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/cvs?search=${encodeURIComponent(search)}&source=${sourceTab}&limit=100`);
      if (!res.ok) throw new Error('Failed to fetch CVs');
      const data = await res.json();
      setCvs(data.cvs || []);
      setTotal(data.total || 0);
      if (data.uploadedCount !== undefined) setUploadedCount(data.uploadedCount);
      if (data.profileCount !== undefined) setProfileCount(data.profileCount);
    } catch (e) {
      console.error(e);
      toast.error(isAr ? 'فشل تحميل السير الذاتية' : 'Failed to load CVs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCvs();
  }, [search, sourceTab]);

  const handleExportPdf = async (cv: AdminCvItem) => {
    toast.info(isAr ? `جاري تجهيز وثيقة الـ PDF لسيرة ${cv.userFullName}...` : `Preparing PDF for ${cv.userFullName}...`);
    try {
      await exportCandidateCvToPdf(cv, isAr);
    } catch (err) {
      console.error('PDF export error:', err);
      toast.error(isAr ? 'فشل تصدير ملف الـ PDF' : 'Failed to export PDF');
    }
  };

  const avgAtsScore = cvs.length > 0
    ? Math.round(cvs.reduce((acc, c) => acc + (c.atsScore || 80), 0) / cvs.length)
    : 82;

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-cyan-400">
              {isAr ? 'مركز وثائق وسير المستخدمين' : 'CV Documentation Studio'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {isAr ? 'سير المستخدمين المرفوعة وقاعدة البيانات' : 'Platform Users & Database CV Documents'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {isAr
              ? 'دليل شامل ومباشر لجميع السير الذاتية لمستخدمي منصة عواتلي، تشمل الملفات المرفوعة في قاعدة البيانات وسير بروفايلات المرشحين المسجلين مع فحص ATS.'
              : 'Live directory containing CV records for all registered candidates and database documents with ATS screening telemetry.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchCvs}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{isAr ? 'تحديث البيانات' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total CVs */}
        <div className="p-4 sm:p-5 rounded-2xl border border-blue-200/80 dark:border-blue-500/20 bg-gradient-to-br from-blue-50/80 via-white to-blue-100/40 dark:from-[#0B1E45]/80 dark:via-[#07132B] dark:to-[#040A18] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              {isAr ? 'إجمالي السير المسجلة' : 'Total CV Records'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-600/15 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-blue-700 dark:text-blue-400">{total}</span>
            <span className="text-xs font-bold text-slate-500">{isAr ? 'سيرة معتمدة' : 'CVs'}</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            {isAr ? 'تغطي جميع مستخدمي المنصة' : 'All active users covered'}
          </span>
        </div>

        {/* Uploaded Documents */}
        <div className="p-4 sm:p-5 rounded-2xl border border-emerald-200/80 dark:border-emerald-500/20 bg-gradient-to-br from-emerald-50/80 via-white to-emerald-100/40 dark:from-[#062419]/80 dark:via-[#07132B] dark:to-[#040A18] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              {isAr ? 'ملفات مرفوعة (قاعدة البيانات)' : 'Uploaded in Database'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-600/15 text-emerald-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400">{uploadedCount}</span>
            <span className="text-xs font-bold text-emerald-600">{isAr ? 'ملف أصلي' : 'Files'}</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            {isAr ? 'مستندات PDF مرفوعة ومحللة' : 'Direct user uploads'}
          </span>
        </div>

        {/* Platform Profile CVs */}
        <div className="p-4 sm:p-5 rounded-2xl border border-purple-200/80 dark:border-purple-500/20 bg-gradient-to-br from-purple-50/80 via-white to-purple-100/40 dark:from-[#1D0C30]/80 dark:via-[#07132B] dark:to-[#040A18] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              {isAr ? 'سير بروفايلات المنصة' : 'Platform Profile CVs'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-600/15 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-purple-700 dark:text-purple-400">{profileCount}</span>
            <span className="text-xs font-bold text-purple-600">{isAr ? 'مرشح موثق' : 'Profiles'}</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            {isAr ? 'سير منشأة من ملفات المستخدمين' : 'Generated from user accounts'}
          </span>
        </div>

        {/* Avg ATS Score */}
        <div className="p-4 sm:p-5 rounded-2xl border border-cyan-200/80 dark:border-cyan-500/20 bg-gradient-to-br from-cyan-50/80 via-white to-cyan-100/40 dark:from-[#06202A]/80 dark:via-[#07132B] dark:to-[#040A18] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              {isAr ? 'متوسط توافق الـ ATS' : 'Avg. ATS Compatibility'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-600/15 text-cyan-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-cyan-700 dark:text-cyan-400">{avgAtsScore}%</span>
            <span className="text-xs font-bold text-emerald-600">{isAr ? 'معدل ممتاز' : 'Optimized'}</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            {isAr ? 'معدل اجتياز أنظمة التوظيف' : 'Across all platform profiles'}
          </span>
        </div>

      </div>

      {/* Filter Tabs & Search Header */}
      <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#07132B] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Source Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setSourceTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                sourceTab === 'all'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              <span>{isAr ? 'كافة السير الذاتية' : 'All CVs'}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${sourceTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-white/10'}`}>
                {total}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSourceTab('uploaded')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                sourceTab === 'uploaded'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
                  : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              <span>{isAr ? '📄 ملفات مرفوعة في قاعدة البيانات' : '📄 Database Uploads'}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${sourceTab === 'uploaded' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-white/10'}`}>
                {uploadedCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSourceTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                sourceTab === 'profile'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                  : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              <span>{isAr ? '👤 سير بروفايلات المنصة' : '👤 Platform Profile CVs'}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${sourceTab === 'profile' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-white/10'}`}>
                {profileCount}
              </span>
            </button>
          </div>

          <span className="text-xs text-slate-500 font-semibold shrink-0">
            {isAr ? `المعروض: ${cvs.length} ملف` : `Showing ${cvs.length} records`}
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isAr ? 'بحث باسم المستخدم، الإيميل، التخصص المستهدف، المهارات أو اسم الملف...' : 'Search by candidate name, email, target role, skill or filename...'}
            className="w-full ps-10 pe-10 py-2.5 rounded-xl bg-slate-50 dark:bg-[#07132B] border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500 transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute end-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* CVs List */}
      <div className="space-y-3.5">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#07132B]/60 animate-pulse h-28" />
            ))}
          </div>
        ) : cvs.length === 0 ? (
          <div className="py-20 text-center space-y-3 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-[#07132B]/40">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
              <FileText className="w-8 h-8" />
            </div>
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">
              {isAr ? 'لم يتم العثور على أي سير ذاتية مطابقة' : 'No CV documents found'}
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {isAr ? 'حاول تعديل كلمات البحث أو تصفح كافة التبويبات' : 'Try searching with different keywords.'}
            </p>
          </div>
        ) : (
          cvs.map((cv) => {
            const isSelected = selectedCv?.id === cv.id;
            const formattedDate = new Date(cv.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            const isUploaded = cv.source === 'uploaded';
            const scoreColor = cv.atsScore >= 80 ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border-emerald-500/30' : cv.atsScore >= 65 ? 'text-blue-700 dark:text-blue-300 bg-blue-500/15 border-blue-500/30' : 'text-amber-700 dark:text-amber-300 bg-amber-500/15 border-amber-500/30';

            return (
              <div
                key={cv.id}
                className={`rounded-2xl border transition-all p-5 ${
                  isSelected
                    ? 'border-blue-500/50 bg-blue-50/20 dark:bg-blue-950/20 shadow-md ring-1 ring-blue-500/30'
                    : 'border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#07132B] hover:border-slate-300 dark:hover:border-cyan-500/30 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: User & File info */}
                  <div className="flex items-start gap-4 min-w-0">
                    {cv.userAvatar ? (
                      <img
                        src={cv.userAvatar}
                        alt={cv.userFullName}
                        className="w-13 h-13 rounded-2xl object-cover border border-slate-200 dark:border-white/10 shadow-xs shrink-0"
                      />
                    ) : (
                      <div className={`w-13 h-13 rounded-2xl font-black text-base flex items-center justify-center text-white shadow-xs shrink-0 ${
                        isUploaded ? 'bg-gradient-to-br from-emerald-500 to-teal-700' : 'bg-gradient-to-br from-purple-500 to-indigo-700'
                      }`}>
                        {cv.userFullName[0]?.toUpperCase() || 'CV'}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-base font-black text-slate-900 dark:text-white truncate">
                          {cv.userFullName}
                        </h3>

                        {/* Source Badge */}
                        <span className={`text-[10.5px] px-2.5 py-0.5 rounded-md font-extrabold border ${
                          isUploaded
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                            : 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30'
                        }`}>
                          {isUploaded ? (isAr ? '📄 ملف مرفوع' : '📄 Uploaded') : (isAr ? '👤 سيرة المنصة' : '👤 Profile CV')}
                        </span>

                        {/* Target Role */}
                        <span className="text-[10.5px] px-2.5 py-0.5 rounded-md font-bold bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                          {cv.targetRole}
                        </span>

                        {/* ATS Score */}
                        <span className={`text-[10.5px] px-2.5 py-0.5 rounded-md font-extrabold border ${scoreColor}`}>
                          ATS: {cv.atsScore}%
                        </span>
                      </div>

                      <div className="flex items-center gap-3.5 text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {cv.userEmail}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {formattedDate}
                        </span>
                        {cv.filename && (
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                            ({cv.filename})
                          </span>
                        )}
                      </div>

                      {/* Skills Preview */}
                      {cv.parsedSkills && cv.parsedSkills.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                          {cv.parsedSkills.slice(0, 6).map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-[10.5px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/8 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-white/10 font-semibold"
                            >
                              {skill}
                            </span>
                          ))}
                          {cv.parsedSkills.length > 6 && (
                            <span className="text-[10.5px] text-slate-400 font-bold">
                              +{cv.parsedSkills.length - 6}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleExportPdf(cv)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <Printer className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>{isAr ? 'طباعة PDF' : 'Export PDF'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedCv(isSelected ? null : cv)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                          : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/10'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isSelected ? (isAr ? 'إخفاء التفاصيل' : 'Hide Details') : (isAr ? 'معاينة السيرة' : 'Inspect CV')}</span>
                    </button>
                  </div>
                </div>

                {/* Expanded details section */}
                {isSelected && (
                  <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-white/10 space-y-4 animate-in fade-in duration-150">
                    {/* Summary */}
                    {cv.summary && (
                      <div className="p-4 rounded-xl bg-slate-50/90 dark:bg-white/4 border border-slate-200/80 dark:border-white/8 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        <p className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5 text-xs">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          {isAr ? 'الملخص المهني المستخرج:' : 'Extracted Professional Summary:'}
                        </p>
                        {cv.summary}
                      </div>
                    )}

                    {/* All Skills */}
                    {cv.parsedSkills && cv.parsedSkills.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-blue-500" />
                          {isAr ? `كافة المهارات المكتشفة (${cv.parsedSkills.length} مهارة):` : `Detected Skills (${cv.parsedSkills.length}):`}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {cv.parsedSkills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 dark:bg-white/8 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-white/10"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Experiences if available */}
                    {cv.experiences && cv.experiences.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                          {isAr ? 'الخبرات المهنية:' : 'Work Experience:'}
                        </p>
                        <div className="space-y-2">
                          {cv.experiences.map((exp, idx) => (
                            <div key={idx} className="p-3.5 rounded-xl bg-slate-50/60 dark:bg-white/3 border border-slate-200/70 dark:border-white/6 text-xs">
                              <div className="flex justify-between items-baseline font-bold text-slate-900 dark:text-white">
                                <span>{exp.role || 'Role'} • <span className="text-blue-600 dark:text-blue-400">{exp.company}</span></span>
                                <span className="text-[11px] text-slate-400">{exp.startDate} - {exp.endDate || 'Present'}</span>
                              </div>
                              {exp.bullets && exp.bullets.length > 0 && (
                                <ul className="mt-2 ps-4 list-disc space-y-1 text-slate-600 dark:text-slate-300 text-xs">
                                  {exp.bullets.map((b, bIdx) => (
                                    <li key={bIdx}>{b}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education if available */}
                    {cv.education && cv.education.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
                          {isAr ? 'المؤهلات الأكاديمية:' : 'Education:'}
                        </p>
                        <div className="space-y-2">
                          {cv.education.map((edu, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-slate-50/60 dark:bg-white/3 border border-slate-200/70 dark:border-white/6 text-xs flex justify-between items-center">
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white">{edu.degree}</span>
                                <span className="text-slate-500 dark:text-slate-400"> • {edu.institution} {edu.major ? `(${edu.major})` : ''}</span>
                              </div>
                              <span className="text-xs text-slate-400 font-medium">{edu.startDate} - {edu.endDate}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects if available */}
                    {cv.projects && cv.projects.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                          <FolderGit2 className="w-3.5 h-3.5 text-amber-500" />
                          {isAr ? 'المشاريع البارزة:' : 'Featured Projects:'}
                        </p>
                        <div className="space-y-2">
                          {cv.projects.map((proj, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-slate-50/60 dark:bg-white/3 border border-slate-200/70 dark:border-white/6 text-xs">
                              <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                                <span>{proj.title}</span>
                                {proj.github && (
                                  <a href={proj.github} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center gap-1 text-xs">
                                    <span>GitHub</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                              {proj.technologies && proj.technologies.length > 0 && (
                                <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1">
                                  {proj.technologies.join(' · ')}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

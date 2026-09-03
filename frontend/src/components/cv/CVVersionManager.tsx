"use client";

import React, { useState, useRef } from 'react';
import { 
  FileText, 
  ChevronDown, 
  Check, 
  Plus, 
  Copy, 
  Upload, 
  Edit2, 
  Trash2, 
  Loader2,
  SlidersHorizontal,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { useCV } from '@/contexts/CVContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useClickOutside } from '@/hooks/useClickOutside';
import type { CVData, CVVersion } from '@/types/cv';

export function CVVersionSelector() {
  const { 
    versions, 
    activeVersionId, 
    editingVersionId, 
    currentVersion, 
    activeVersion,
    setActiveVersion, 
    switchEditingVersion, 
    createVersion, 
    duplicateVersion,
    renameVersion,
    deleteVersion
  } = useCV();
  const { isAr } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [managerModalOpen, setManagerModalOpen] = useState(false);
  const [newVersionModalOpen, setNewVersionModalOpen] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState<CVVersion | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newTargetRole, setNewTargetRole] = useState('Data Analyst');
  const [editTitle, setEditTitle] = useState('');
  const [editRole, setEditRole] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useClickOutside<HTMLDivElement>(isOpen, () => setIsOpen(false));

  const isEditingActive = editingVersionId === activeVersionId;

  // Handle Direct CV Upload & Parse
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    toast.loading(isAr ? 'جاري رفع واستخراج بيانات السيرة الذاتية...' : 'Uploading and parsing CV...', { id: 'upload-cv' });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/cv/parse', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to parse CV');
      }

      const json = await res.json();
      const data = json.data;

      const newCvData: CVData = {
        contact: {
          fullName: data.fullName || 'User',
          jobTitle: data.currentTitle || data.targetRole || 'Data Analyst',
          phone: data.phone || '',
          email: data.email || '',
          location: data.location || 'Cairo, Egypt',
          linkedin: data.linkedin || ''
        },
        summary: data.summary || '',
        skillsSummary: null,
        experience: Array.isArray(data.experiences) && data.experiences.length > 0 ? data.experiences : [],
        education: Array.isArray(data.education) && data.education.length > 0 ? data.education : [],
        projects: Array.isArray(data.projects) && data.projects.length > 0 ? data.projects : [],
        skills: Array.isArray(data.categorizedSkillGroups) && data.categorizedSkillGroups.length > 0
          ? data.categorizedSkillGroups
          : (data.skills?.length ? [{ id: 'tech-1', label: 'Technical Skills', skills: data.skills }] : []),
        sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects'],
        hiddenSections: []
      };

      const cleanFileName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ').trim() || 'سيرة ذاتية مرفوعة';
      const newVer = createVersion(cleanFileName, data.targetRole || data.currentTitle || 'Data Analyst', newCvData);
      
      // Immediately set as active & switch editor
      setActiveVersion(newVer.id);
      switchEditingVersion(newVer.id);

      toast.success(
        isAr 
          ? `تم استخراج بيانات السيرة الذاتية بنجاح وتعيينها كنسخة أساسية!` 
          : `CV imported successfully and set as primary version!`,
        { id: 'upload-cv' }
      );
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err.message || (isAr ? 'حدث خطأ أثناء رفع السيرة الذاتية' : 'Failed to upload CV'), { id: 'upload-cv' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createVersion(newTitle, newTargetRole, currentVersion?.cvData);
    setNewTitle('');
    setNewVersionModalOpen(false);
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameModalOpen || !editTitle.trim()) return;
    renameVersion(renameModalOpen.id, editTitle, editRole);
    setRenameModalOpen(null);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Hidden File Input for Direct Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Clean Minimalist Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-2xs text-start cursor-pointer"
      >
        <div className="flex h-5 w-5 items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          <FileText className="w-4 h-4" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 max-w-[160px] sm:max-w-[210px] truncate">
            {currentVersion?.name || (isAr ? "النسخة الأساسية" : "Primary CV")}
          </span>

          {isEditingActive ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium border border-emerald-200/60 dark:border-emerald-800/40">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {isAr ? "الأساسية" : "Active"}
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-medium">
              {isAr ? "مسودة" : "Draft"}
            </span>
          )}
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Clean Dropdown Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 sm:right-0 mt-1.5 w-[330px] rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header */}
          <div className="px-2.5 py-2 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 mb-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {isAr ? "نسخ السيرة الذاتية" : "Your CV Profiles"}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setManagerModalOpen(true);
              }}
              className="text-[11.5px] font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <SlidersHorizontal className="w-3 h-3" />
              {isAr ? "إدارة النسخ" : "Manage"}
            </button>
          </div>

          {/* Versions List */}
          <div className="max-h-[240px] overflow-y-auto py-1 space-y-1">
            {versions.map((ver) => {
              const isSelected = ver.id === editingVersionId;
              const isActive = ver.id === activeVersionId;

              return (
                <div
                  key={ver.id}
                  onClick={() => {
                    switchEditingVersion(ver.id);
                    setIsOpen(false);
                  }}
                  className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-2 group ${
                    isSelected
                      ? 'bg-slate-100 dark:bg-slate-800/90'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {/* Left: name + meta */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[13px] font-medium truncate ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                        {ver.name}
                      </span>
                      {isActive && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-[9.5px] font-bold tracking-wide">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {isAr ? "الأساسية" : "Active"}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                      {ver.targetRole} · {ver.cvData.projects.length} {isAr ? "مشاريع" : "projects"}
                    </p>
                  </div>

                  {/* Right: actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isActive ? (
                      <span className="p-1 text-blue-600 dark:text-blue-400">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <button
                        type="button"
                        title={isAr ? "تعيين كنسخة أساسية للمنصة" : "Set as primary active"}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveVersion(ver.id);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/70 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 text-[10.5px] font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all cursor-pointer"
                      >
                        <Zap className="w-3 h-3" />
                        <span>{isAr ? "تفعيل" : "Activate"}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2 mt-1 space-y-1.5">
            {/* Direct Upload CV Option */}
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-[12px] font-semibold transition-colors cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{isAr ? "جاري معالجة الملف..." : "Parsing document..."}</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isAr ? "رفع واستيراد ملف CV جديد (PDF/Word)" : "Upload & Import CV File"}</span>
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  duplicateVersion(editingVersionId);
                  setIsOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11.5px] font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>{isAr ? "استنساخ الحالية" : "Duplicate"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setNewVersionModalOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11.5px] font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-slate-400" />
                <span>{isAr ? "نسخة جديدة" : "New CV"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Blank Version */}
      {newVersionModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isAr ? "إنشاء نسخة سيرة ذاتية جديدة" : "Create New CV Version"}
              </h3>
              <button onClick={() => setNewVersionModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">✕</button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr 
                ? "يمكنك إنشاء نسخة جديدة وتخصيص مهاراتها ومشاريعها لتناسب مجال عملك المستهدف."
                : "Create a tailored CV version for a specific role."}
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isAr ? "اسم النسخة" : "Version Name"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? "مثال: سيرة ذاتية - Machine Learning" : "e.g. Machine Learning CV"}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isAr ? "المسمى / الدور المستهدف" : "Target Role"}
                </label>
                <input
                  type="text"
                  placeholder={isAr ? "مثال: Machine Learning Engineer" : "e.g. Data Analyst"}
                  value={newTargetRole}
                  onChange={(e) => setNewTargetRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewVersionModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium cursor-pointer"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  {isAr ? "إنشاء النسخة" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Manage Versions */}
      {managerModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isAr ? "إدارة نسخ السير الذاتية" : "Manage CV Versions"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isAr ? "النسخة الأساسية هي المستخدمة لمطابقة الوظائف وفحص الـ ATS وفجوة المهارات." : "Active CV is used globally across the platform."}
                </p>
              </div>
              <button onClick={() => setManagerModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">✕</button>
            </div>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {versions.map((ver) => {
                const isActive = ver.id === activeVersionId;
                const isEditing = ver.id === editingVersionId;

                return (
                  <div
                    key={ver.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isActive 
                        ? 'border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[13.5px] font-semibold text-slate-900 dark:text-white">
                            {ver.name}
                          </span>
                          {isActive ? (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10.5px] font-medium border border-emerald-500/20">
                              {isAr ? "النسخة الأساسية للمنصة" : "Platform Active"}
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setActiveVersion(ver.id)}
                              className="px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 text-[10.5px] font-medium transition-colors cursor-pointer"
                            >
                              {isAr ? "تعيين كأساسية" : "Set Active"}
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                          <span className="font-medium text-slate-600 dark:text-slate-300">
                            {ver.targetRole}
                          </span>
                          <span>•</span>
                          <span>{ver.cvData.projects.length} مشاريع</span>
                          <span>•</span>
                          <span>{ver.cvData.skills.reduce((acc, g) => acc + g.skills.length, 0)} مهارات</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            switchEditingVersion(ver.id);
                            setManagerModalOpen(false);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            isEditing
                              ? 'bg-blue-600 text-white'
                              : 'border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          {isEditing ? (isAr ? "قيد التعديل" : "Editing") : (isAr ? "تعديل بالمحرر" : "Edit")}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditTitle(ver.name);
                            setEditRole(ver.targetRole);
                            setRenameModalOpen(ver);
                          }}
                          title={isAr ? "تعديل الاسم" : "Rename"}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => duplicateVersion(ver.id)}
                          title={isAr ? "استنساخ" : "Duplicate"}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {versions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => deleteVersion(ver.id)}
                            title={isAr ? "حذف" : "Delete"}
                            className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
              <button
                type="button"
                onClick={() => {
                  setManagerModalOpen(false);
                  fileInputRef.current?.click();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isAr ? "رفع ملف CV جديد" : "Upload CV File"}</span>
              </button>

              <button
                type="button"
                onClick={() => setManagerModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium cursor-pointer"
              >
                {isAr ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Rename */}
      {renameModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isAr ? "تعديل بيانات النسخة" : "Edit Version Details"}
            </h3>

            <form onSubmit={handleRenameSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isAr ? "اسم النسخة" : "Version Name"}
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isAr ? "المسمى / الدور المستهدف" : "Target Role"}
                </label>
                <input
                  type="text"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRenameModalOpen(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 text-xs font-medium cursor-pointer"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold cursor-pointer"
                >
                  {isAr ? "حفظ" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Clean Compact Banner Component for other pages (ATS, Jobs, Skills, Copilot)
export function ActiveCVBadge({ pageName = "المنصة" }: { pageName?: string }) {
  const { activeVersion, versions, setActiveVersion } = useCV();
  const { isAr } = useLanguage();
  const [openSelector, setOpenSelector] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(openSelector, () => setOpenSelector(false));

  if (!activeVersion) return null;

  return (
    <div className="relative inline-block" ref={ref}>
      <button 
        type="button"
        onClick={() => setOpenSelector(!openSelector)}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 text-xs font-medium hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <span>
          {isAr 
            ? `النسخة النشطة: ${activeVersion.name}` 
            : `Active CV: ${activeVersion.name}`}
        </span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${openSelector ? 'rotate-180' : ''}`} />
      </button>

      {openSelector && (
        <div className="absolute top-full left-0 sm:right-0 mt-1.5 w-[260px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-1.5 z-50 animate-in fade-in duration-150">
          <p className="text-[10.5px] font-medium text-slate-400 px-2 py-1 border-b border-slate-100 dark:border-slate-800 mb-1">
            {isAr ? "اختر النسخة النشطة للمنصة:" : "Select Active CV Profile:"}
          </p>
          <div className="space-y-0.5">
            {versions.map((ver) => (
              <button
                key={ver.id}
                type="button"
                onClick={() => {
                  setActiveVersion(ver.id);
                  setOpenSelector(false);
                }}
                className={`w-full text-start p-2 rounded-lg flex items-center justify-between text-xs font-medium transition-colors cursor-pointer ${
                  ver.id === activeVersion.id
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="truncate">
                  <span>{ver.name}</span>
                  <span className="block text-[10px] text-slate-400 font-normal">{ver.targetRole}</span>
                </div>
                {ver.id === activeVersion.id && <Check className="w-3.5 h-3.5 text-emerald-500" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

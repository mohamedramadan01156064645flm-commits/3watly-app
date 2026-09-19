"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen, Plus, Search, Edit2, Trash2, ToggleLeft, ToggleRight,
  RefreshCw, AlertTriangle, X, Check, PlayCircle, Code2, ExternalLink,
  GraduationCap, FileText, Sparkles, Clock, Globe, Award, Layers,
  ChevronRight, Tag, Zap
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CustomDropdown, DropdownOption } from '@/components/ui/CustomDropdown';
import { PLATFORM_SKILLS, getSkillName } from '@/data/platformSkills';

interface Resource {
  id: string;
  skill_key: string;
  title: string;
  title_ar: string | null;
  provider: string;
  provider_icon: string | null;
  kind: string;
  url: string;
  duration_hours: number | null;
  is_free: boolean;
  language: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

const PROVIDER_COLORS: Record<string, { bg: string; text: string; border: string; icon: React.ElementType }> = {
  youtube: { bg: 'bg-red-500/12', text: 'text-red-400', border: 'border-red-500/25', icon: PlayCircle },
  coursera: { bg: 'bg-blue-500/12', text: 'text-blue-400', border: 'border-blue-500/25', icon: GraduationCap },
  github: { bg: 'bg-purple-500/12', text: 'text-purple-400', border: 'border-purple-500/25', icon: Code2 },
  freecodecamp: { bg: 'bg-emerald-500/12', text: 'text-emerald-400', border: 'border-emerald-500/25', icon: Award },
  udemy: { bg: 'bg-amber-500/12', text: 'text-amber-400', border: 'border-amber-500/25', icon: GraduationCap },
};

function getProviderStyle(provider: string) {
  const p = (provider || '').toLowerCase().replace(/\s+/g, '');
  for (const [key, val] of Object.entries(PROVIDER_COLORS)) {
    if (p.includes(key)) return val;
  }
  return { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', icon: ExternalLink };
}

const KIND_NAMES: Record<string, { en: string; ar: string }> = {
  video: { en: 'Video Tutorial', ar: 'فيديو تعليمي' },
  course: { en: 'Full Course', ar: 'كورس تدريبي' },
  repo: { en: 'Project & Code', ar: 'مشروع وتطبيق' },
  article: { en: 'Documentation', ar: 'توثيق ومقال' },
  practice: { en: 'Hands-on Practice', ar: 'تمارين تفاعلية' },
  book: { en: 'E-Book / Guide', ar: 'كتاب ودليل' },
  other: { en: 'Resource', ar: 'مصدر إثرائي' },
};

const EMPTY_FORM = {
  skill_key: 'python',
  title: '',
  title_ar: '',
  provider: 'YouTube',
  provider_icon: '',
  kind: 'video',
  url: '',
  duration_hours: '4',
  is_free: true,
  language: 'en',
  display_order: 0,
  is_active: true,
};

type FormState = typeof EMPTY_FORM;

interface ResourceModalProps {
  initial?: Partial<Resource> | null;
  onClose: () => void;
  onSave: () => void;
  isAr: boolean;
}

function ResourceModal({ initial, onClose, onSave, isAr }: ResourceModalProps) {
  const [form, setForm] = useState<FormState>({
    ...EMPTY_FORM,
    ...(initial
      ? {
          skill_key: initial.skill_key ?? 'python',
          title: initial.title ?? '',
          title_ar: initial.title_ar ?? '',
          provider: initial.provider ?? 'YouTube',
          provider_icon: initial.provider_icon ?? '',
          kind: initial.kind ?? 'video',
          url: initial.url ?? '',
          is_free: initial.is_free ?? true,
          language: initial.language ?? 'en',
          display_order: initial.display_order ?? 0,
          is_active: initial.is_active ?? true,
        }
      : {}),
    duration_hours: initial?.duration_hours != null ? String(initial.duration_hours) : '4',
  });
  const [isCustomSkill, setIsCustomSkill] = useState(
    initial?.skill_key ? !PLATFORM_SKILLS.some((s) => s.id === initial.skill_key) : false
  );
  const [customSkillId, setCustomSkillId] = useState(
    initial?.skill_key && !PLATFORM_SKILLS.some((s) => s.id === initial.skill_key) ? initial.skill_key : ''
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!initial?.id;

  const set = (key: keyof FormState, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const skillOptions: DropdownOption[] = [
    ...PLATFORM_SKILLS.map((s) => ({
      value: s.id,
      label: `${isAr ? s.nameAr : s.name} (${s.id})`,
      badge: isAr ? s.categoryAr : s.category,
      badgeColor: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
    })),
    {
      value: '__custom__',
      label: isAr ? '✨ مهارة مخصصة جديدة...' : '✨ Custom Skill...',
      badge: 'New',
      badgeColor: 'bg-purple-500/20 text-purple-300',
    },
  ];

  const providerOptions: DropdownOption[] = [
    { value: 'YouTube', label: 'YouTube' },
    { value: 'Coursera', label: 'Coursera' },
    { value: 'GitHub', label: 'GitHub' },
    { value: 'freeCodeCamp', label: 'freeCodeCamp' },
    { value: 'Udemy', label: 'Udemy' },
    { value: 'Official Docs', label: isAr ? 'التوثيق الرسمي' : 'Official Docs' },
    { value: 'Other', label: isAr ? 'أخرى' : 'Other' },
  ];

  const kindOptions: DropdownOption[] = [
    { value: 'video', label: isAr ? '🎥 فيديو تعليمي (Video)' : '🎥 Video Tutorial' },
    { value: 'course', label: isAr ? '🎓 كورس تدريبي كامل (Course)' : '🎓 Full Course' },
    { value: 'repo', label: isAr ? '💻 مشروع وتطبيق عملي (Project/Repo)' : '💻 Project & Repo' },
    { value: 'article', label: isAr ? '📄 توثيق ومقال (Docs/Article)' : '📄 Documentation & Article' },
    { value: 'practice', label: isAr ? '⚡ تمارين تفاعلية (Practice)' : '⚡ Hands-on Practice' },
  ];

  const langOptions: DropdownOption[] = [
    { value: 'en', label: isAr ? '🇺🇸 الإنجليزية (English)' : '🇺🇸 English' },
    { value: 'ar', label: isAr ? '🇪🇬 العربية (Arabic)' : '🇪🇬 Arabic' },
    { value: 'both', label: isAr ? '🌐 كلاهما (Bilingual)' : '🌐 Bilingual' },
  ];

  const handleSkillSelect = (val: string) => {
    if (val === '__custom__') {
      setIsCustomSkill(true);
    } else {
      setIsCustomSkill(false);
      set('skill_key', val);
    }
  };

  const activeSkillKey = isCustomSkill ? customSkillId.toLowerCase().trim() : form.skill_key;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSkillKey) {
      setError(isAr ? 'يرجى اختيار أو كتابة مفتاح المهارة' : 'Please specify a skill');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...(isEdit ? { id: initial!.id } : {}),
        ...form,
        skill_key: activeSkillKey,
        duration_hours: form.duration_hours ? parseFloat(String(form.duration_hours)) : null,
      };
      const res = await fetch('/api/admin/resources', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed'); return; }
      onSave();
      onClose();
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#070C18] border border-slate-200 dark:border-white/12 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-200/80 dark:border-white/8 bg-slate-50/70 dark:bg-white/2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/25 text-purple-600 dark:text-purple-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">
                {isEdit
                  ? (isAr ? 'تعديل المصدر التعليمي' : 'Edit Learning Resource')
                  : (isAr ? 'إضافة كورس أو مصدر جديد' : 'Add New Course / Resource')}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isAr ? 'سيظهر هذا المصدر تلقائياً للطلاب في مسار المهارة' : 'Linked directly to platform Skill Gap matrix'}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/8 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Skill Selector */}
          <div className="space-y-1.5">
            <label className="block text-[11.5px] font-bold text-slate-700 dark:text-slate-300">
              {isAr ? '🎯 المهارة المرتبطة بها الكورس (Skill Selection) *' : '🎯 Linked Skill Target *'}
            </label>
            <CustomDropdown
              options={skillOptions}
              value={isCustomSkill ? '__custom__' : form.skill_key}
              onChange={handleSkillSelect}
              placeholder={isAr ? 'اختر مهارة من القائمة...' : 'Select skill...'}
            />
            {isCustomSkill && (
              <div className="pt-2">
                <input
                  required
                  placeholder={isAr ? 'اكتب معرف المهارة (مثلاً: flutter, kubernetes)' : 'Enter custom skill ID (e.g. flutter, rust)'}
                  value={customSkillId}
                  onChange={(e) => setCustomSkillId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B1120] border border-purple-500/40 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
              </div>
            )}
            <p className="text-[10.5px] text-slate-500">
              {isAr 
                ? `معرف المهارة المعتمد في السيستم: "${activeSkillKey || '—'}" (يضمن ظهور الكورس للطلاب اللي عندهم فجوة في المهارة دي).`
                : `Canonical Skill Key: "${activeSkillKey || '—'}"`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3.5 pt-1">
            {/* Title EN */}
            <div className="col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isAr ? 'عنوان الكورس أو المصدر (English) *' : 'Course Title (English) *'}
              </label>
              <input
                required
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. Python Full Course for Beginners"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Title AR */}
            <div className="col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isAr ? 'العنوان بالعربي (اختياري)' : 'Arabic Title (Optional)'}
              </label>
              <input
                value={form.title_ar}
                onChange={(e) => set('title_ar', e.target.value)}
                dir="rtl"
                placeholder="مثال: دورة بايثون الشاملة من الصفر للاحتراف"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Provider */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isAr ? 'المنصة / المزود *' : 'Provider *'}
              </label>
              <CustomDropdown
                options={providerOptions}
                value={form.provider}
                onChange={(val) => set('provider', val)}
              />
            </div>

            {/* Kind */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isAr ? 'نوع المحتوى *' : 'Content Kind *'}
              </label>
              <CustomDropdown
                options={kindOptions}
                value={form.kind}
                onChange={(val) => set('kind', val)}
              />
            </div>

            {/* URL */}
            <div className="col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isAr ? 'رابط الكورس المباشر *' : 'Direct URL *'}
              </label>
              <input
                required
                type="url"
                value={form.url}
                onChange={(e) => set('url', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isAr ? 'المدة التقديرية (ساعات)' : 'Estimated Duration (Hours)'}
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={form.duration_hours}
                onChange={(e) => set('duration_hours', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Language */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isAr ? 'لغة المحتوى' : 'Language'}
              </label>
              <CustomDropdown
                options={langOptions}
                value={form.language}
                onChange={(val) => set('language', val)}
              />
            </div>

            {/* Free Toggle */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/3 border border-slate-200 dark:border-white/8 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{isAr ? 'مجاني 100%' : 'Free Resource'}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{form.is_free ? (isAr ? 'بدون رسوم' : 'No cost') : (isAr ? 'كورس مدفوع' : 'Paid')}</p>
              </div>
              <button
                type="button"
                onClick={() => set('is_free', !form.is_free)}
                className={`p-1 rounded-lg transition-colors cursor-pointer ${form.is_free ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' : 'text-slate-400 bg-slate-100 dark:bg-white/5'}`}
              >
                {form.is_free ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              </button>
            </div>

            {/* Active Toggle */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/3 border border-slate-200 dark:border-white/8 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{isAr ? 'حالة النشر' : 'Published'}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{form.is_active ? (isAr ? 'متاح للطلاب' : 'Visible to users') : (isAr ? 'معطل مؤقتاً' : 'Hidden')}</p>
              </div>
              <button
                type="button"
                onClick={() => set('is_active', !form.is_active)}
                className={`p-1 rounded-lg transition-colors cursor-pointer ${form.is_active ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10' : 'text-slate-400 bg-slate-100 dark:bg-white/5'}`}
              >
                {form.is_active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t border-slate-200/80 dark:border-white/8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-colors"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50 cursor-pointer transition-opacity flex items-center justify-center gap-2 shadow-md shadow-cyan-600/20"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {isAr ? (isEdit ? 'حفظ التعديلات' : 'إضافة الكورس') : (isEdit ? 'Save Changes' : 'Add Course')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminResourcesPage() {
  const { isAr } = useLanguage();
  const [resources, setResources] = useState<Resource[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [kindFilter, setKindFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editResource, setEditResource] = useState<Resource | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        ...(search ? { search } : {}),
        ...(selectedSkill !== 'all' ? { skill_key: selectedSkill } : {}),
        ...(kindFilter !== 'all' ? { kind: kindFilter } : {}),
      });
      const res = await fetch(`/api/admin/resources?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResources(data.resources ?? []);
      setTotal(data.total ?? 0);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [search, selectedSkill, kindFilter]);

  useEffect(() => { fetchResources(); }, [fetchResources]);

  const handleSeedCatalog = async () => {
    if (!confirm(isAr ? 'هل تريد استيراد وتحديث كافة المصادر والكورسات المعتمدة لجميع المهارات وحفظها في قاعدة البيانات؟' : 'Import all skill courses from catalog?')) return;
    setSeeding(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/resources/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed');
      alert(isAr ? `✅ تم استيراد وتخزين ${data.count} مصدر وكورس بنجاح في قاعدة البيانات!` : `✅ Successfully imported ${data.count} resources!`);
      await fetchResources();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSeeding(false);
    }
  };

  const handleToggleActive = async (resource: Resource) => {
    try {
      await fetch('/api/admin/resources', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: resource.id, is_active: !resource.is_active }),
      });
      await fetchResources();
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذا المصدر نهائياً؟' : 'Permanently delete this resource?')) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/resources?id=${id}`, { method: 'DELETE' });
      await fetchResources();
    } catch {}
    setDeletingId(null);
  };

  // Group unique skills from resources
  const uniqueSkills = Array.from(new Set(resources.map((r) => r.skill_key))).filter(Boolean);

  const kindDropdownOptions: DropdownOption[] = [
    { value: 'all', label: isAr ? 'كل أنواع المحتوى' : 'All Kinds' },
    { value: 'video', label: isAr ? '🎥 فيديو' : '🎥 Video' },
    { value: 'course', label: isAr ? '🎓 كورس' : '🎓 Course' },
    { value: 'repo', label: isAr ? '💻 مشروع/كود' : '💻 Project' },
    { value: 'article', label: isAr ? '📄 مقال/توثيق' : '📄 Article' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-50/80 via-white/70 to-blue-100/60 dark:bg-gradient-to-r dark:from-[#0D2452]/60 dark:via-[#091738]/70 dark:to-[#061026]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-cyan-500/25 shadow-xl shadow-cyan-950/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              {isAr ? 'مكتبة المهارات والكورسات' : 'Skill Intelligence Library'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />
            {isAr ? 'إدارة المصادر والكورسات التعليمية' : 'Learning Resources & Course Manager'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            {isAr
              ? 'كل كورس هنا مربوط بمعرف المهارة (Skill Key) ويظهر تلقائياً للمستخدمين عند تحليل فجوة المهارات في الـ Skill Gap Matrix.'
              : 'Every course is bound to a skill key and auto-recommends to users with matching skill gaps.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={fetchResources}
            disabled={loading}
            title={isAr ? 'تحديث البيانات' : 'Refresh'}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-cyan-500/30 bg-white/70 dark:bg-[#0D2452]/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#12316B]/60 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            type="button"
            onClick={handleSeedCatalog}
            disabled={seeding}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs sm:text-sm font-bold hover:bg-purple-500/25 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
          >
            {seeding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-purple-500 dark:text-purple-400" />}
            {isAr ? 'مزامنة الكتالوج المعتمد' : 'Sync Skill Catalog'}
          </button>

          <button
            type="button"
            onClick={() => { setEditResource(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-xs sm:text-sm font-bold text-white hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-cyan-500/25"
          >
            <Plus className="w-4 h-4" />
            {isAr ? 'إضافة كورس جديد' : 'Add New Course'}
          </button>
        </div>
      </div>

      {/* Skill Filter Carousel Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedSkill('all')}
          className={`
            px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border
            ${selectedSkill === 'all'
              ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/40 shadow-sm'
              : 'bg-white/70 dark:bg-gradient-to-r dark:from-[#0B1E45]/60 dark:to-[#07132B]/70 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-cyan-500/20 hover:text-slate-900 dark:hover:text-white'
            }
          `}
        >
          {isAr ? '✨ كل المهارات' : '✨ All Skills'} ({total})
        </button>

        {uniqueSkills.map((sk) => {
          const count = resources.filter((r) => r.skill_key === sk).length;
          const isSelected = selectedSkill === sk;
          const label = getSkillName(sk, isAr);
          return (
            <button
              key={sk}
              type="button"
              onClick={() => setSelectedSkill(sk)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer border
                ${isSelected
                  ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/40 shadow-sm'
                  : 'bg-white/70 dark:bg-gradient-to-r dark:from-[#0B1E45]/60 dark:to-[#07132B]/70 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-cyan-500/20 hover:text-slate-900 dark:hover:text-white'
                }
              `}
            >
              <span>{label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${isSelected ? 'bg-purple-500/30 text-purple-700 dark:text-purple-200' : 'bg-slate-200/60 dark:bg-white/5 text-slate-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={isAr ? 'بحث في المصادر بالاسم أو الرابط...' : 'Search resources by title or URL...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-white/80 dark:bg-gradient-to-r dark:from-[#0B1E45]/60 dark:to-[#07132B]/70 border border-slate-200 dark:border-cyan-500/25 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/60 shadow-xs backdrop-blur-md"
          />
        </div>
        <div className="w-full sm:w-56">
          <CustomDropdown
            options={kindDropdownOptions}
            value={kindFilter}
            onChange={(val) => setKindFilter(val)}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />{error}
        </div>
      )}

      {/* Resources Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-44 rounded-2xl bg-white/40 dark:bg-white/5 animate-pulse border border-slate-200 dark:border-white/8" />
            ))
          : resources.length === 0
          ? (
            <div className="col-span-full py-16 px-6 text-center rounded-2xl bg-gradient-to-b from-blue-50/60 to-white/70 dark:bg-gradient-to-b dark:from-[#0B1E45]/60 dark:to-[#040C1E]/80 backdrop-blur-2xl border border-slate-200 dark:border-cyan-500/20 shadow-2xl flex flex-col items-center">
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-3 text-purple-500 dark:text-purple-400">
                <BookOpen className="w-8 h-8 opacity-80" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                {isAr ? 'لم يتم العثور على مصادر مطابقة' : 'No matching resources found'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mb-5">
                {isAr
                  ? 'اضغط على استيراد الكتالوج لمزامنة 70+ كورس ومصدر معتمد، أو أضف كورس جديد يدوياً.'
                  : 'Import the skill catalog to populate 70+ curated courses.'}
              </p>
              <button
                type="button"
                onClick={handleSeedCatalog}
                disabled={seeding}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-sm font-bold text-white hover:opacity-90 cursor-pointer shadow-lg shadow-purple-600/25"
              >
                {seeding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isAr ? '📥 استيراد الكتالوج الآن' : '📥 Import Catalog Now'}
              </button>
            </div>
          )
          : resources.map((r) => {
              const provStyle = getProviderStyle(r.provider);
              const ProvIcon = provStyle.icon;
              const kindLabel = KIND_NAMES[r.kind] ? (isAr ? KIND_NAMES[r.kind].ar : KIND_NAMES[r.kind].en) : r.kind;
              const skillDisplay = getSkillName(r.skill_key, isAr);

              return (
                <div
                  key={r.id}
                  className={`
                    group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200
                    hover:scale-[1.01] hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-950/20
                    ${r.is_active
                      ? 'bg-gradient-to-br from-white/90 via-blue-50/70 to-white/80 dark:bg-gradient-to-b dark:from-[#0B1E45]/60 dark:via-[#07132B]/75 dark:to-[#040C1E]/85 backdrop-blur-2xl border-slate-200/90 dark:border-cyan-500/20 shadow-lg'
                      : 'bg-white/40 dark:bg-[#060913]/60 border-slate-200/50 dark:border-white/5 opacity-55'
                    }
                  `}
                >
                  {/* Card Top Row: Skill Badge + Provider Badge + Free Pill */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      {/* Skill Badge */}
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-black bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 uppercase tracking-wide">
                        <Zap className="w-3 h-3 text-cyan-500 dark:text-cyan-400" />
                        {skillDisplay}
                      </span>

                      {/* Free / Paid Badge */}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        r.is_free
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
                      }`}>
                        {r.is_free ? (isAr ? 'مجاني' : 'Free') : (isAr ? 'مدفوع' : 'Paid')}
                      </span>
                    </div>

                    {/* Course Title */}
                    <div>
                      <h3 className="text-[14px] font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                        {r.title}
                      </h3>
                      {r.title_ar && (
                        <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1" dir="rtl">
                          {r.title_ar}
                        </p>
                      )}
                    </div>

                    {/* Meta details: Provider + Hours + Kind */}
                    <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      {/* Provider pill */}
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-semibold border ${provStyle.bg} ${provStyle.text} ${provStyle.border}`}>
                        <ProvIcon className="w-3 h-3" />
                        {r.provider}
                      </span>

                      {/* Kind pill */}
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300">
                        {kindLabel}
                      </span>

                      {/* Duration */}
                      {r.duration_hours && (
                        <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {r.duration_hours} {isAr ? 'ساعة' : 'hrs'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom: URL visit + Actions */}
                  <div className="flex items-center justify-between gap-2 pt-4 mt-3 border-t border-slate-100 dark:border-white/8">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{isAr ? 'زيارة الكورس' : 'Open Link'}</span>
                    </a>

                    <div className="flex items-center gap-1">
                      {/* Active Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleActive(r)}
                        title={r.is_active ? (isAr ? 'تعطيل' : 'Deactivate') : (isAr ? 'تفعيل' : 'Activate')}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          r.is_active ? 'text-cyan-500 dark:text-cyan-400 hover:bg-cyan-500/10' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        {r.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => { setEditResource(r); setModalOpen(true); }}
                        title={isAr ? 'تعديل' : 'Edit'}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/8 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        disabled={deletingId === r.id}
                        title={isAr ? 'حذف' : 'Delete'}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer disabled:opacity-40"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Modal */}
      {modalOpen && (
        <ResourceModal
          initial={editResource}
          onClose={() => { setModalOpen(false); setEditResource(null); }}
          onSave={fetchResources}
          isAr={isAr}
        />
      )}
    </div>
  );
}

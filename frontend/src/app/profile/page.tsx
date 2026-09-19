"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Camera,
  Upload,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  Phone,
  AlertTriangle,
  Trash2,
  Loader2,
  Link2,
  ArrowLeft,
  CheckCircle2,
  X,
  Shield,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

function LinkedInIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.44a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
    </svg>
  );
}

function GitHubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { isAr } = useLanguage();
  const { user, updateAvatar, removeAvatar, updateFullName, deleteAccount } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Bio char count
  const MAX_BIO = 400;

  // Avatar error fallback
  const [avatarError, setAvatarError] = useState(false);
  useEffect(() => {
    setAvatarError(false);
  }, [user?.avatarUrl]);

  // Load profile data from localStorage + auth context
  const getInitialProfile = () => {
    let cvData: any = null;
    let savedSettings: any = null;
    try {
      if (typeof window !== 'undefined') {
        const rawCv = localStorage.getItem('3watly_parsed_cv');
        if (rawCv) cvData = JSON.parse(rawCv);
        const rawSettings = localStorage.getItem('3watly_profile_settings');
        if (rawSettings) savedSettings = JSON.parse(rawSettings);
      }
    } catch {}

    const joinYear = user?.createdAt
      ? new Date(user.createdAt).getFullYear().toString()
      : new Date().getFullYear().toString();

    return {
      fullName: savedSettings?.fullName || user?.fullName || cvData?.fullName || (isAr ? 'المستخدم' : 'User'),
      jobTitle: savedSettings?.jobTitle || user?.targetRole || cvData?.targetRole || cvData?.currentTitle || '',
      email: user?.email || cvData?.email || '',
      phone: savedSettings?.phone || cvData?.phone || '',
      location: savedSettings?.location || cvData?.location || (isAr ? 'القاهرة، مصر' : 'Cairo, Egypt'),
      bio: savedSettings?.bio || cvData?.summary || '',
      dateJoined: joinYear,
      linkedin: savedSettings?.linkedin || cvData?.linkedin || '',
      github: savedSettings?.github || cvData?.github || '',
    };
  };

  const [profile, setProfile] = useState(getInitialProfile);

  // Sync when user changes
  useEffect(() => {
    setProfile(getInitialProfile());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const userInitials = (() => {
    const name = (profile.fullName || '').trim();
    if (!name) return 'U';
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  })();

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error(isAr ? 'حجم الصورة يجب ألا يتعدى 2 ميجابايت' : 'Image must be less than 2MB');
      return;
    }
    updateAvatar(file);
    toast.success(isAr ? 'تم تحديث الصورة الشخصية' : 'Profile photo updated');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.fullName.trim()) {
      toast.error(isAr ? 'يرجى إدخال الاسم الكامل' : 'Please enter your full name');
      return;
    }
    setIsSaving(true);
    try {
      localStorage.setItem('3watly_profile_settings', JSON.stringify(profile));
      updateFullName(profile.fullName);
      await new Promise(r => setTimeout(r, 400));
      toast.success(isAr ? 'تم حفظ التغييرات بنجاح!' : 'Changes saved successfully!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error(isAr ? 'يرجى كتابة DELETE للتأكيد' : 'Please type DELETE to confirm');
      return;
    }
    setIsDeletingAccount(true);
    try {
      await deleteAccount?.();
      toast.success(isAr ? 'تم حذف حسابك بنجاح' : 'Account deleted successfully');
      router.push('/');
    } catch {
      toast.error(isAr ? 'حدث خطأ أثناء حذف الحساب' : 'Error deleting account');
    } finally {
      setIsDeletingAccount(false);
      setDeleteModalOpen(false);
    }
  };

  return (
    <AppShell>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoSelect}
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
      />

      <div className="max-w-[860px] mx-auto pb-16 space-y-6">

        {/* Page Header */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
          </button>
          <div>
            <h1 className="text-[20px] sm:text-[22px] font-black text-[#0B132B] dark:text-white">
              {isAr ? 'الملف الشخصي' : 'Edit Profile'}
            </h1>
            <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-0.5">
              {isAr ? 'تحديث معلوماتك الشخصية.' : 'Update your personal information.'}
            </p>
          </div>
        </div>

        {/* Main Card */}
        <form onSubmit={handleSave} className="rounded-[20px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] shadow-sm">

          {/* ── Profile Photo Section ── */}
          <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Camera className="w-4.5 h-4.5" />
              </div>
              <h2 className="text-[15px] font-bold text-[#0B132B] dark:text-white">
                {isAr ? 'الصورة الشخصية' : 'Profile Photo'}
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar with camera button */}
              <div className="relative w-28 h-28 shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white font-black text-[32px] tracking-wider flex items-center justify-center ring-4 ring-blue-100 dark:ring-blue-950/60 shadow-lg shadow-blue-500/20 select-none">
                  {user?.avatarUrl && !avatarError ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={profile.fullName} 
                      className="w-full h-full object-cover"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    userInitials
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -end-1 w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 border-2 border-white dark:border-[#0B1120] flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer z-10"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Name + Buttons */}
              <div className="flex-1 space-y-3 min-w-0">
                <p className="text-[15px] font-bold text-[#0B132B] dark:text-white">{profile.fullName}</p>
                <p className="text-[12.5px] text-slate-400">JPG, PNG or GIF. Max size 2MB.</p>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 hover:border-blue-500 text-slate-700 dark:text-slate-200 text-[12.5px] font-bold transition-all hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    {user?.avatarUrl ? (isAr ? 'تغيير الصورة' : 'Replace Photo') : (isAr ? 'رفع صورة' : 'Upload Photo')}
                  </button>
                  {user?.avatarUrl && (
                    <button
                      type="button"
                      onClick={async () => {
                        await removeAvatar();
                        toast.success(isAr ? 'تمت إزالة الصورة الشخصية' : 'Profile photo removed');
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 text-[12.5px] font-bold hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      {isAr ? 'إزالة الصورة' : 'Remove Photo'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Personal Info Fields ── */}
          <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-white/10 space-y-5">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <User className="w-4.5 h-4.5" />
              </div>
              <h2 className="text-[15px] font-bold text-[#0B132B] dark:text-white">
                {isAr ? 'المعلومات الشخصية' : 'Personal Information'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-[12.5px] font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'الاسم الكامل' : 'Full Name'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={e => setProfile(p => ({ ...p, fullName: e.target.value }))}
                  placeholder={isAr ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.03] text-[13.5px] text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                />
              </div>

              {/* Job Title */}
              <div className="space-y-1.5">
                <label className="block text-[12.5px] font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" />{isAr ? 'المسمى الوظيفي' : 'Job Title'}</span>
                </label>
                <input
                  type="text"
                  value={profile.jobTitle}
                  onChange={e => setProfile(p => ({ ...p, jobTitle: e.target.value }))}
                  placeholder={isAr ? 'مثال: مهندس بيانات' : 'e.g. Data Engineer'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.03] text-[13.5px] text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Email (read-only) */}
              <div className="space-y-1.5">
                <label className="block text-[12.5px] font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{isAr ? 'البريد الإلكتروني' : 'Email Address'}</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={profile.email}
                    readOnly
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/60 dark:bg-white/[0.02] text-[13.5px] text-slate-500 dark:text-slate-400 cursor-not-allowed pe-28"
                  />
                  <span className="absolute inset-y-0 end-3 flex items-center gap-1 text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    {isAr ? 'موثق' : 'Verified'}
                  </span>
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="block text-[12.5px] font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{isAr ? 'رقم الهاتف' : 'Phone Number'}</span>
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+20 100 000 0000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.03] text-[13.5px] text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="block text-[12.5px] font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{isAr ? 'الموقع' : 'Location'}</span>
                </label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={e => setProfile(p => ({ ...p, location: e.target.value }))}
                  placeholder={isAr ? 'القاهرة، مصر' : 'Cairo, Egypt'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.03] text-[13.5px] text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Date Joined */}
              <div className="space-y-1.5">
                <label className="block text-[12.5px] font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{isAr ? 'تاريخ الانضمام' : 'Date Joined'}</span>
                </label>
                <input
                  type="text"
                  value={profile.dateJoined}
                  readOnly
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/60 dark:bg-white/[0.02] text-[13.5px] text-slate-500 dark:text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[12.5px] font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'نبذة شخصية (اختياري)' : 'Bio (Optional)'}
                </label>
                <span className={`text-[11px] font-bold ${profile.bio.length > MAX_BIO ? 'text-red-500' : 'text-slate-400'}`}>
                  {profile.bio.length}/{MAX_BIO}
                </span>
              </div>
              <textarea
                value={profile.bio}
                onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                rows={4}
                placeholder={isAr ? 'اكتب نبذة مختصرة عن خبرتك المهنية...' : 'Brief overview of your professional background...'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.03] text-[13.5px] text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all resize-none"
              />
            </div>
          </div>

          {/* ── Social Links ── */}
          <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-white/10 space-y-4">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <Link2 className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-[#0B132B] dark:text-white">
                  {isAr ? 'روابط التواصل المهني (اختياري)' : 'Social Links (Optional)'}
                </h2>
                <p className="text-[12px] text-slate-400 mt-0.5">
                  {isAr ? 'أضف روابطك المهنية لتظهر للمُوظِّفين.' : 'Add your professional links to let recruiters know more about you.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* LinkedIn */}
              <div className="space-y-1.5">
                <label className="block text-[12.5px] font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <LinkedInIcon className="w-3.5 h-3.5 text-[#0A66C2]" />
                    LinkedIn Profile URL
                  </span>
                </label>
                <input
                  type="url"
                  value={profile.linkedin}
                  onChange={e => setProfile(p => ({ ...p, linkedin: e.target.value }))}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.03] text-[13.5px] text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                />
              </div>

              {/* GitHub */}
              <div className="space-y-1.5">
                <label className="block text-[12.5px] font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <GitHubIcon className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                    GitHub Profile URL
                  </span>
                </label>
                <input
                  type="url"
                  value={profile.github}
                  onChange={e => setProfile(p => ({ ...p, github: e.target.value }))}
                  placeholder="https://github.com/yourusername"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.03] text-[13.5px] text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* ── Save / Cancel Actions ── */}
          <div className="p-6 sm:p-8 flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-[13.5px] font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSaving || profile.bio.length > MAX_BIO}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-[13.5px] font-bold shadow-md shadow-blue-600/25 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {isAr ? 'حفظ التغييرات' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* ── Danger Zone ── */}
        <div className="rounded-[20px] border border-red-200 dark:border-red-900/40 bg-white dark:bg-[#0B1120] shadow-sm overflow-hidden">
          <div className="px-6 sm:px-8 py-5 flex items-center gap-3 border-b border-red-100 dark:border-red-900/30">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-500 dark:text-red-400 flex items-center justify-center">
              <Shield className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-[#0B132B] dark:text-white">
                {isAr ? 'منطقة الخطر' : 'Danger Zone'}
              </h2>
              <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                {isAr
                  ? 'حذف حسابك يُزيل جميع بياناتك نهائياً. لا يمكن التراجع.'
                  : 'Delete your account and permanently remove your account data, CVs, and preferences. This action is permanent.'}
              </p>
            </div>
          </div>
          <div className="px-6 sm:px-8 py-5">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-[13.5px] font-bold hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              {isAr ? 'حذف الحساب' : 'Delete Account'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {deleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={e => { if (e.target === e.currentTarget) setDeleteModalOpen(false); }}
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-red-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#0B132B] dark:text-white">
                  {isAr ? 'تأكيد حذف الحساب' : 'Confirm Account Deletion'}
                </h3>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  {isAr ? 'هذا الإجراء لا يمكن التراجع عنه.' : 'This action cannot be undone.'}
                </p>
              </div>
            </div>

            <p className="text-[13.5px] text-slate-600 dark:text-slate-300 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 rounded-xl p-4 leading-relaxed">
              {isAr
                ? 'سيتم حذف سيرتك الذاتية، تفضيلاتك، ومؤشرات مسارك المهني بشكل دائم.'
                : 'Your CV, preferences, and career progress will be permanently deleted.'}
            </p>

            <div className="space-y-1.5">
              <label className="block text-[12.5px] font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'اكتب DELETE للتأكيد' : 'Type DELETE to confirm'}
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.03] text-[14px] font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => { setDeleteModalOpen(false); setDeleteConfirmText(''); }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold text-[13.5px] hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE' || isDeletingAccount}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold text-[13.5px] transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {isDeletingAccount ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {isAr ? 'حذف الحساب نهائياً' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

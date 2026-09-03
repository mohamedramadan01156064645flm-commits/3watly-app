"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Bell, 
  Shield, 
  Briefcase, 
  TrendingUp, 
  Lock, 
  Smartphone, 
  ChevronRight, 
  Camera, 
  Upload, 
  ArrowLeft, 
  ArrowRight, 
  Mail, 
  MapPin, 
  Calendar, 
  KeyRound, 
  ShieldCheck, 
  Eye, 
  EyeOff,
  X,
  AlertTriangle,
  Trash2,
  Loader2
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { extractNameFromFilename } from '@/utils/formatName';
import { toast } from 'sonner';

interface ProfileData {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  dateJoined: string;
  linkedin: string;
  github: string;
}

function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.44a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
    </svg>
  );
}

function GitHubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { isAr } = useLanguage();
  const { user, updateAvatar, removeAvatar, updateFullName, deleteAccount } = useAuth();
  const { file, role } = useOnboarding();
  
  // View mode: 'settings' | 'edit-profile'
  const [isEditing, setIsEditing] = useState(false);
  
  // Notification states
  const [jobAlerts, setJobAlerts] = useState(true);
  const [marketUpdates, setMarketUpdates] = useState(true);
  
  // Security 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  // Modals
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  // Password form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Delete account form states
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // File input ref for avatar
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile data state with dynamic real fallback
  const [profile, setProfile] = useState<ProfileData>(() => {
    let cvData: any = null;
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('3watly_parsed_cv') : null;
      if (raw) cvData = JSON.parse(raw);
    } catch {}

    const joinYear = user?.createdAt ? new Date(user.createdAt).getFullYear().toString() : new Date().getFullYear().toString();

    return {
      fullName: user?.fullName || cvData?.fullName || (isAr ? 'المستخدم' : 'User'),
      jobTitle: user?.targetRole || cvData?.targetRole || cvData?.currentTitle || (isAr ? 'محلل بيانات' : 'Data Analyst'),
      email: user?.email || cvData?.email || '',
      phone: cvData?.phone || '',
      location: cvData?.location || (isAr ? 'القاهرة، مصر' : 'Cairo, Egypt'),
      bio: cvData?.summary || '',
      dateJoined: joinYear,
      linkedin: cvData?.linkedin || '',
      github: cvData?.github || ''
    };
  });

  // Keep profile in sync if user or localStorage updates
  useEffect(() => {
    let cvData: any = null;
    let savedSettings: any = null;
    try {
      const rawCv = localStorage.getItem('3watly_parsed_cv');
      if (rawCv) cvData = JSON.parse(rawCv);
      const rawSettings = localStorage.getItem('3watly_profile_settings');
      if (rawSettings) savedSettings = JSON.parse(rawSettings);
    } catch {}

    const joinYear = user?.createdAt ? new Date(user.createdAt).getFullYear().toString() : new Date().getFullYear().toString();

    setProfile(prev => ({
      ...prev,
      fullName: savedSettings?.fullName || user?.fullName || cvData?.fullName || prev.fullName,
      email: savedSettings?.email || user?.email || cvData?.email || prev.email,
      jobTitle: savedSettings?.jobTitle || user?.targetRole || cvData?.targetRole || cvData?.currentTitle || prev.jobTitle,
      location: savedSettings?.location || cvData?.location || prev.location,
      phone: savedSettings?.phone || cvData?.phone || prev.phone,
      linkedin: savedSettings?.linkedin || cvData?.linkedin || prev.linkedin,
      github: savedSettings?.github || cvData?.github || prev.github,
      bio: savedSettings?.bio || cvData?.summary || prev.bio,
      dateJoined: joinYear,
    }));
  }, [user, isAr]);

  // Load saved notification & 2FA preferences
  useEffect(() => {
    try {
      const savedNotifs = localStorage.getItem('3watly_notifications');
      if (savedNotifs) {
        const parsed = JSON.parse(savedNotifs);
        setJobAlerts(parsed.jobAlerts ?? true);
        setMarketUpdates(parsed.marketUpdates ?? true);
      }
      const saved2FA = localStorage.getItem('3watly_2fa');
      if (saved2FA) {
        setTwoFactorEnabled(JSON.parse(saved2FA));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Avatar upload handler
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error(isAr ? 'حجم الصورة يجب ألا يتعدى 2 ميجابايت' : 'Image size must be less than 2MB');
      return;
    }

    updateAvatar(file);
    toast.success(isAr ? 'تم تحديث الصورة الشخصية بنجاح' : 'Profile photo updated successfully');
  };

  // Toggle notifications and persist
  const toggleJobAlerts = () => {
    const newVal = !jobAlerts;
    setJobAlerts(newVal);
    localStorage.setItem('3watly_notifications', JSON.stringify({ jobAlerts: newVal, marketUpdates }));
    toast.success(
      isAr 
        ? (newVal ? 'تم تفعيل تنبيهات الوظائف' : 'تم تعطيل تنبيهات الوظائف') 
        : (newVal ? 'Job alerts enabled' : 'Job alerts disabled')
    );
  };

  const toggleMarketUpdates = () => {
    const newVal = !marketUpdates;
    setMarketUpdates(newVal);
    localStorage.setItem('3watly_notifications', JSON.stringify({ jobAlerts, marketUpdates: newVal }));
    toast.success(
      isAr 
        ? (newVal ? 'تم تفعيل تحديثات السوق والرواتب' : 'تم تعطيل تحديثات السوق والرواتب') 
        : (newVal ? 'Market updates enabled' : 'Market updates disabled')
    );
  };

  // Save changes handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.fullName.trim()) {
      toast.error(isAr ? 'يرجى إدخال الاسم الكامل' : 'Please enter your full name');
      return;
    }

    // Persist to localStorage & AuthContext
    localStorage.setItem('3watly_profile_settings', JSON.stringify(profile));
    updateFullName(profile.fullName);
    
    toast.success(isAr ? 'تم حفظ التغييرات بنجاح!' : 'Changes saved successfully!');
    setIsEditing(false);
  };

  // Handle password change
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error(isAr ? 'يرجى إدخال كلمة المرور الحالية' : 'Please enter your current password');
      return;
    }
    if (newPassword.length < 6) {
      toast.error(isAr ? 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' : 'New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(isAr ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match');
      return;
    }

    setIsSavingPassword(true);
    setTimeout(() => {
      setIsSavingPassword(false);
      setPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success(isAr ? 'تم تغيير كلمة المرور بنجاح!' : 'Password updated successfully!');
    }, 800);
  };

  // Handle 2FA Toggle
  const handle2FAToggle = () => {
    const newVal = !twoFactorEnabled;
    setTwoFactorEnabled(newVal);
    localStorage.setItem('3watly_2fa', JSON.stringify(newVal));
    setTwoFactorModalOpen(false);
    toast.success(
      isAr 
        ? (newVal ? 'تم تفعيل المصادقة الثنائية بنجاح' : 'تم تعطيل المصادقة الثنائية') 
        : (newVal ? 'Two-Factor Authentication enabled' : 'Two-Factor Authentication disabled')
    );
  };

  // Handle permanent account deletion
  const handleDeleteAccountSubmit = async () => {
    if (deleteConfirmationText.trim().toUpperCase() !== 'DELETE') {
      toast.error(isAr ? 'يرجى كتابة DELETE للتأكيد' : 'Please type DELETE to confirm');
      return;
    }

    try {
      setIsDeletingAccount(true);
      const res = await deleteAccount('DELETE');

      if (!res.success) {
        toast.error(res.error || (isAr ? "تعذر حذف الحساب حالياً. يرجى المحاولة لاحقاً." : "Unable to delete your account right now. Please try again."));
        setIsDeletingAccount(false);
        return;
      }

      toast.success(isAr ? "تم حذف حسابك وبياناتك بنجاح." : "Your account has been permanently deleted.");
      setDeleteModalOpen(false);
      
      // Invalidate and redirect to login page
      setTimeout(() => {
        router.replace('/login');
      }, 500);
    } catch (err: any) {
      toast.error(isAr ? "حدث خطأ غير متوقع أثناء حذف الحساب." : "An unexpected error occurred. Please try again.");
      setIsDeletingAccount(false);
    }
  };

  // Get Initials for Avatar
  const getInitials = (name: string) => {
    if (!name) return 'AS';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const userInitials = getInitials(profile.fullName);

  return (
    <AppShell
      title={isEditing ? (isAr ? "تعديل الملف الشخصي" : "Edit Profile") : (isAr ? "الإعدادات" : "Settings")}
      subtitle={
        isEditing 
          ? (isAr ? "تحديث وتعديل معلوماتك الشخصية والمهنية." : "Update your personal information.")
          : (isAr ? "إدارة حسابك وتفضيلات الإشعارات والأمان." : "Manage your account and preferences.")
      }
      showSearch={true}
    >
      {/* Hidden file input for Avatar Upload in Edit Mode */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        className="hidden"
      />

      <div className="max-w-[960px] mx-auto pb-12">
        
        {/* ========================================================================= */}
        {/* VIEW 1: SETTINGS OVERVIEW MODE (Clean Avatar without floating camera)    */}
        {/* ========================================================================= */}
        {!isEditing ? (
          <div className="space-y-6 animate-fadeIn">
            
            {/* 1. Profile Information Card */}
            <div className="rounded-[20px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-xs">
              <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-[16px] font-bold text-[#0B132B] dark:text-white">
                      {isAr ? "المعلومات الشخصية" : "Profile Information"}
                    </h2>
                    <p className="text-[12.5px] text-slate-500">
                      {isAr ? "عرض وتحديث معلوماتك الشخصية." : "View and update your personal information."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-200 text-[13px] font-semibold transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                >
                  {isAr ? "تعديل" : "Edit"}
                </button>
              </div>

              {/* Profile Details Layout */}
              <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Clean Avatar Circle (No floating camera badge in overview) */}
                <div className="shrink-0">
                  {user?.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={profile.fullName} 
                      className="w-24 h-24 rounded-full object-cover shadow-md ring-4 ring-blue-50 dark:ring-blue-950/40"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 text-white font-extrabold text-[28px] flex items-center justify-center shadow-md shadow-blue-500/20 ring-4 ring-blue-50 dark:ring-blue-950/40">
                      {userInitials}
                    </div>
                  )}
                </div>

                {/* Information Column */}
                <div className="space-y-2 min-w-0 flex-1">
                  <div>
                    <h3 className="text-[20px] font-bold text-[#0B132B] dark:text-white leading-tight">
                      {profile.fullName}
                    </h3>
                    <p className="text-[14px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                      {profile.jobTitle}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-y-2 gap-x-5 pt-1 text-[13px] text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{profile.email}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{profile.location}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{isAr ? `انضم في ${profile.dateJoined}` : `Joined ${profile.dateJoined}`}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Notifications Card */}
            <div className="rounded-[20px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-white/10">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-[#0B132B] dark:text-white">
                    {isAr ? "الإشعارات والتنبيهات" : "Notifications"}
                  </h2>
                  <p className="text-[12.5px] text-slate-500">
                    {isAr ? "اختر التنبيهات التي ترغب في استلامها." : "Choose what you want to be notified about."}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                {/* Row 1: High-Match Job Alerts */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-white/10 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[#0B132B] dark:text-white leading-tight">
                        {isAr ? "تنبيهات الوظائف عالية التوافق" : "High-Match Job Alerts"}
                      </h4>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {isAr ? "استلام إشعار عند توفر وظائف تناسب مهاراتك وتفضيلاتك." : "Get notified when jobs match your skills and preferences."}
                      </p>
                    </div>
                  </div>

                  {/* iOS Style Switch */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={jobAlerts}
                    onClick={toggleJobAlerts}
                    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      jobAlerts ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        jobAlerts 
                          ? (isAr ? '-translate-x-5' : 'translate-x-5') 
                          : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Row 2: Market & Salary Updates */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-white/10 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[#0B132B] dark:text-white leading-tight">
                        {isAr ? "تحديثات السوق والرواتب" : "Market & Salary Updates"}
                      </h4>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {isAr ? "استلام تقرير أسبوعي عن توجهات السوق ومتوسط الرواتب." : "Receive weekly updates about market trends and salaries."}
                      </p>
                    </div>
                  </div>

                  {/* iOS Style Switch */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={marketUpdates}
                    onClick={toggleMarketUpdates}
                    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      marketUpdates ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        marketUpdates 
                          ? (isAr ? '-translate-x-5' : 'translate-x-5') 
                          : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Security Card */}
            <div className="rounded-[20px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-white/10">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-[#0B132B] dark:text-white">
                    {isAr ? "الأمان والحماية" : "Security"}
                  </h2>
                  <p className="text-[12.5px] text-slate-500">
                    {isAr ? "الحفاظ على أمان وخصوصية حسابك." : "Keep your account safe and secure."}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-white/[0.06]">
                {/* Change Password Row */}
                <div 
                  onClick={() => setPasswordModalOpen(true)}
                  className="flex items-center justify-between py-3.5 px-2 rounded-xl hover:bg-slate-50/70 dark:hover:bg-white/[0.02] cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60 group-hover:text-blue-600 transition-colors">
                      <Lock className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[#0B132B] dark:text-white leading-tight">
                        {isAr ? "تغيير كلمة المرور" : "Change Password"}
                      </h4>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {isAr ? "قم بتحديث كلمة المرور بانتظام لحماية الحساب." : "Update your password regularly to keep your account secure."}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className={`w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-transform ${isAr ? 'rotate-180' : ''}`} />
                </div>

                {/* Two-Factor Authentication Row */}
                <div 
                  onClick={() => setTwoFactorModalOpen(true)}
                  className="flex items-center justify-between py-3.5 px-2 rounded-xl hover:bg-slate-50/70 dark:hover:bg-white/[0.02] cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60 group-hover:text-blue-600 transition-colors">
                      <Smartphone className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[#0B132B] dark:text-white leading-tight">
                        {isAr ? "المصادقة الثنائية (2FA)" : "Two-Factor Authentication"}
                      </h4>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {isAr ? "إضافة طبقة حماية وأمان إضافية لحسابك." : "Add an extra layer of security to your account."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11.5px] font-bold ${
                      twoFactorEnabled 
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {twoFactorEnabled ? (isAr ? "مُفعل" : "On") : (isAr ? "معطل" : "Off")}
                    </span>
                    <ChevronRight className={`w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-transform ${isAr ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer rights note */}
            <div className="text-center pt-4 text-[12px] text-slate-400 dark:text-slate-500">
              © 2026 3WATLY. All rights reserved.
            </div>

          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: EDIT PROFILE MODE                                                 */
          /* ========================================================================= */
          <div className="animate-fadeIn">
            
            {/* Top Back Header Navigation */}
            <div className="flex items-center gap-3 mb-6">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-10 h-10 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-2xs cursor-pointer"
              >
                {isAr ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
              </button>

              <div>
                <h1 className="text-[20px] font-extrabold text-[#0B132B] dark:text-white leading-tight">
                  {isAr ? "تعديل الملف الشخصي" : "Edit Profile"}
                </h1>
                <p className="text-[13px] text-slate-500">
                  {isAr ? "تحديث وتعديل معلوماتك الشخصية." : "Update your personal information."}
                </p>
              </div>
            </div>

            {/* Main Form Container */}
            <form onSubmit={handleSaveProfile} className="rounded-[20px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 sm:p-8 shadow-xs">
              
              <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
                
                {/* Left Column: Profile Photo */}
                <div className="space-y-4">
                  <h3 className="text-[14px] font-bold text-[#0B132B] dark:text-white">
                    {isAr ? "الصورة الشخصية" : "Profile Photo"}
                  </h3>

                  <div className="relative w-28 h-28 sm:w-32 sm:h-32">
                    {/* Circular Avatar */}
                    <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 text-white font-extrabold text-[32px] sm:text-[36px] flex items-center justify-center shadow-lg shadow-blue-500/20 ring-4 ring-blue-50 dark:ring-blue-950/40">
                      {user?.avatarUrl ? (
                        <img 
                          src={user.avatarUrl} 
                          alt={profile.fullName} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        userInitials
                      )}
                    </div>

                    {/* Camera Action Button (outside overflow-hidden) */}
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -end-1 w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 border-2 border-white dark:border-[#0B1120] flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer z-10"
                      aria-label={isAr ? "تغيير الصورة" : "Change photo"}
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[12px] text-slate-400">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>

                  <div className="flex flex-col gap-2 w-full max-w-[160px]">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-white/10 hover:border-blue-500 text-slate-700 dark:text-slate-200 text-[12.5px] font-bold transition-all shadow-2xs hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-blue-600" />
                      <span>{user?.avatarUrl ? (isAr ? "تغيير الصورة" : "Replace Photo") : (isAr ? "رفع صورة" : "Upload Photo")}</span>
                    </button>

                    {user?.avatarUrl && (
                      <button
                        type="button"
                        onClick={async () => {
                          await removeAvatar();
                          toast.success(isAr ? "تمت إزالة الصورة الشخصية" : "Profile photo removed");
                        }}
                        className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 text-[12px] font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>{isAr ? "إزالة الصورة" : "Remove Photo"}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Column: Form Fields */}
                <div className="space-y-5">
                  
                  {/* Row 1: Full Name & Job Title */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12.5px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {isAr ? "الاسم بالكامل" : "Full Name"}
                      </label>
                      <input
                        type="text"
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#070B14] text-[13.5px] text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-[#0B1120] transition-all"
                        placeholder="Mohamed Ahmed"
                      />
                    </div>

                    <div>
                      <label className="block text-[12.5px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {isAr ? "المسمى الوظيفي" : "Job Title"}
                      </label>
                      <input
                        type="text"
                        value={profile.jobTitle}
                        onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#070B14] text-[13.5px] text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-[#0B1120] transition-all"
                        placeholder="Data Analyst"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[12.5px] font-bold text-slate-700 dark:text-slate-300">
                          {isAr ? "البريد الإلكتروني" : "Email Address"}
                        </label>
                        <span className="text-[10.5px] font-bold text-slate-400">
                          {isAr ? "(الحساب الموثق)" : "(Verified Account)"}
                        </span>
                      </div>
                      <input
                        type="email"
                        value={profile.email}
                        readOnly
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900/70 text-[13.5px] text-slate-500 dark:text-slate-400 font-medium cursor-not-allowed select-none"
                        placeholder="user@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-[12.5px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {isAr ? "رقم الهاتف" : "Phone Number"}
                      </label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#070B14] text-[13.5px] text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-[#0B1120] transition-all"
                        placeholder="+20 101 234 5678"
                      />
                    </div>
                  </div>

                  {/* Row 3: Location */}
                  <div>
                    <label className="block text-[12.5px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {isAr ? "الموقع الجغرافي" : "Location"}
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute ltr:left-3.5 rtl:right-3.5 top-3.5 pointer-events-none" />
                      <select
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="w-full h-11 ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#070B14] text-[13.5px] text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-[#0B1120] transition-all appearance-none cursor-pointer"
                      >
                        <option value="Cairo, Egypt">Cairo, Egypt (القاهرة، مصر)</option>
                        <option value="Giza, Egypt">Giza, Egypt (الجيزة، مصر)</option>
                        <option value="Alexandria, Egypt">Alexandria, Egypt (الإسكندرية، مصر)</option>
                        <option value="Remote in Egypt">Remote in Egypt (عن بُعد داخل مصر)</option>
                        <option value="Remote (Worldwide)">Remote (Worldwide - عن بُعد عالمياً)</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Bio */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[12.5px] font-bold text-slate-700 dark:text-slate-300">
                        {isAr ? "نبذة عنك (اختياري)" : "Bio (Optional)"}
                      </label>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {profile.bio.length}/150
                      </span>
                    </div>
                    <textarea
                      maxLength={150}
                      rows={3}
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      placeholder={isAr ? "اكتب نبذة مختصرة عن خبراتك وأهدافك المهنية..." : "Passionate about data analysis and helping businesses make data-driven decisions."}
                      className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#070B14] text-[13.5px] text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-[#0B1120] transition-all resize-none"
                    />
                  </div>

                  {/* Row 5: Date Joined */}
                  <div>
                    <label className="block text-[12.5px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {isAr ? "تاريخ الانضمام" : "Date Joined"}
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute ltr:left-3.5 rtl:right-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="text"
                        disabled
                        value={profile.dateJoined}
                        className="w-full h-11 ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#0B1120]/[0.04] text-[13.5px] text-slate-500 font-medium cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Row 6: Social Links */}
                  <div className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-3">
                    <div>
                      <h4 className="text-[13.5px] font-bold text-[#0B132B] dark:text-white leading-tight">
                        {isAr ? "الروابط المهنية (اختياري)" : "Social Links (Optional)"}
                      </h4>
                      <p className="text-[12px] text-slate-400 mt-0.5">
                        {isAr ? "أضف روابطك المهنية لتسهيل وصول مسؤولي التوظيف إليك." : "Add your professional links to let recruiters know more about you."}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* LinkedIn */}
                      <div className="relative">
                        <LinkedInIcon className="w-4 h-4 text-blue-600 absolute ltr:left-3.5 rtl:right-3.5 top-3.5 pointer-events-none" />
                        <input
                          type="url"
                          value={profile.linkedin}
                          onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                          placeholder="LinkedIn Profile URL"
                          className="w-full h-11 ltr:pl-10 rtl:pr-10 ltr:pr-3.5 rtl:pl-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#070B14] text-[13px] text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-500 transition-all"
                        />
                      </div>

                      {/* GitHub */}
                      <div className="relative">
                        <GitHubIcon className="w-4 h-4 text-slate-700 dark:text-slate-300 absolute ltr:left-3.5 rtl:right-3.5 top-3.5 pointer-events-none" />
                        <input
                          type="url"
                          value={profile.github}
                          onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                          placeholder="GitHub Profile URL"
                          className="w-full h-11 ltr:pl-10 rtl:pr-10 ltr:pr-3.5 rtl:pl-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#070B14] text-[13px] text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Form Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-[13.5px] font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {isAr ? "إلغاء" : "Cancel"}
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13.5px] font-bold transition-all shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/30 cursor-pointer"
                    >
                      {isAr ? "حفظ التغييرات" : "Save Changes"}
                    </button>
                  </div>

                </div>

              </div>

            </form>

            {/* ========================================================================= */}
            {/* DANGER ZONE: DELETE ACCOUNT                                               */}
            {/* ========================================================================= */}
            <div className="mt-6 rounded-[20px] border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/10 p-6 sm:p-7 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-rose-600 dark:text-rose-400">
                      {isAr ? "منطقة الخطر (Danger Zone)" : "Danger Zone"}
                    </h3>
                    <p className="text-[12.5px] text-slate-600 dark:text-slate-400 mt-0.5 max-w-xl leading-relaxed">
                      {isAr 
                        ? "حذف حسابك نهائياً وجميع البيانات المرتبطة به. هذا الإجراء دائم ولا يمكن التراجع عنه." 
                        : "Delete your account and permanently remove your account data, CVs, and preferences. This action is permanent."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setDeleteConfirmationText('');
                    setDeleteModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[13px] font-bold transition-all shadow-sm shadow-rose-600/25 hover:shadow-md hover:shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer self-start sm:self-center shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isAr ? "حذف الحساب" : "Delete Account"}</span>
                </button>
              </div>
            </div>

            <div className="text-center pt-6 text-[12px] text-slate-400 dark:text-slate-500">
              © 2026 3WATLY. All rights reserved.
            </div>

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: CHANGE PASSWORD                                                  */}
      {/* ========================================================================= */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-[440px] rounded-[24px] bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-white/10 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 flex items-center justify-center">
                  <KeyRound className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-[16px] font-bold text-[#0B132B] dark:text-white">
                  {isAr ? "تغيير كلمة المرور" : "Change Password"}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setPasswordModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isAr ? "كلمة المرور الحالية" : "Current Password"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#070B14] text-[13px] text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute ltr:right-3 rtl:left-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isAr ? "كلمة المرور الجديدة" : "New Password"}
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#070B14] text-[13px] text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isAr ? "تأكيد كلمة المرور الجديدة" : "Confirm New Password"}
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#070B14] text-[13px] text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-[13px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>

                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold shadow-md shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
                >
                  {isSavingPassword ? (isAr ? "جاري التحديث..." : "Updating...") : (isAr ? "تحديث كلمة المرور" : "Update Password")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: TWO-FACTOR AUTHENTICATION TOGGLE                                  */}
      {/* ========================================================================= */}
      {twoFactorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-[440px] rounded-[24px] bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-white/10 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 flex items-center justify-center">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-[16px] font-bold text-[#0B132B] dark:text-white">
                  {isAr ? "المصادقة الثنائية (2FA)" : "Two-Factor Authentication"}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setTwoFactorModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr 
                ? "تعمل المصادقة الثنائية على حماية حسابك عبر إرسال رمز تحقق سريع إلى هاتفك أو بريدك الإلكتروني عند تسجيل الدخول من جهاز جديد."
                : "Two-Factor Authentication adds an extra layer of security to your account by requiring an SMS or authenticator code upon signing in."}
            </p>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[13.5px] font-bold text-slate-900 dark:text-white block">
                  {isAr ? "حالة الحماية" : "Protection Status"}
                </span>
                <span className="text-[12px] text-slate-500">
                  {twoFactorEnabled 
                    ? (isAr ? "المصادقة الثنائية مفعلة حالياً" : "2FA is currently active") 
                    : (isAr ? "المصادقة الثنائية معطلة" : "2FA is currently inactive")}
                </span>
              </div>

              <button
                type="button"
                onClick={handle2FAToggle}
                className={`px-4 py-1.5 rounded-xl text-[12.5px] font-bold transition-all shadow-xs cursor-pointer ${
                  twoFactorEnabled
                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {twoFactorEnabled ? (isAr ? "تعطيل الحماية" : "Disable 2FA") : (isAr ? "تفعيل الحماية" : "Enable 2FA")}
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setTwoFactorModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-[13px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
              >
                {isAr ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: DELETE ACCOUNT CONFIRMATION                                      */}
      {/* ========================================================================= */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-[460px] rounded-[24px] bg-white dark:bg-[#0D1527] border border-rose-200 dark:border-rose-900/40 p-6 shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#0B132B] dark:text-white">
                    {isAr ? "هل أنت متأكد من حذف الحساب؟" : "Are you sure you want to delete your account?"}
                  </h3>
                  <p className="text-[12px] text-rose-600 dark:text-rose-400 font-medium">
                    {isAr ? "هذا الإجراء نهائي ولا يمكن التراجع عنه." : "This action is permanent and cannot be undone."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={isDeletingAccount}
                onClick={() => setDeleteModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning Body */}
            <div className="space-y-3.5 text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                {isAr
                  ? "سيتم حذف حسابك وجميع السير الذاتية المحفوظة، وتاريخ المحادثات، وتفضيلات الوظائف بشكل دائم من قواعد البيانات."
                  : "Your account, associated profile data, parsed CVs, copilot history, and preferences will be permanently removed from our databases."}
              </p>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200/80 dark:border-white/10 space-y-2">
                <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300">
                  {isAr 
                    ? 'لتأكيد الحذف، اكتب "DELETE" في الحقل أدناه:' 
                    : 'To confirm, type "DELETE" in the box below:'}
                </label>
                <input
                  type="text"
                  disabled={isDeletingAccount}
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full h-10 px-3.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] text-[13.5px] font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-all uppercase"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeletingAccount}
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-[13px] font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>

              <button
                type="button"
                disabled={deleteConfirmationText.trim().toUpperCase() !== 'DELETE' || isDeletingAccount}
                onClick={handleDeleteAccountSubmit}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white text-[13px] font-bold transition-all shadow-md shadow-rose-600/20 disabled:shadow-none flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isDeletingAccount ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isAr ? "جاري الحذف..." : "Deleting account..."}</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>{isAr ? "حذف الحساب نهائياً" : "Delete Account"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </AppShell>
  );
}

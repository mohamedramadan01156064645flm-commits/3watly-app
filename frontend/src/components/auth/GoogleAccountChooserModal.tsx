"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, UserPlus, Check, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

export interface GoogleAccount {
  name: string;
  email: string;
  avatarUrl: string;
}

const DEFAULT_ACCOUNTS: GoogleAccount[] = [
  {
    name: 'Mohamed Ahmed',
    email: 'mohamed.ahmed@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  },
  {
    name: 'Ahmed Amr',
    email: 'ahmed.amr@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
  },
  {
    name: 'Sara Mahmoud',
    email: 'sara.mahmoud@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
  },
];

interface GoogleAccountChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (account: { name: string; email: string; avatarUrl?: string | null }) => void;
}

export function GoogleAccountChooserModal({
  isOpen,
  onClose,
  onSelectAccount,
}: GoogleAccountChooserModalProps) {
  const { isAr } = useLanguage();
  const [accounts, setAccounts] = useState<GoogleAccount[]>(DEFAULT_ACCOUNTS);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [selectedPresetAvatar, setSelectedPresetAvatar] = useState<string | null>(null);
  const [customAvatarPreview, setCustomAvatarPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleChoose = async (acc: { name: string; email: string; avatarUrl?: string | null }) => {
    setIsProcessing(true);
    setTimeout(() => {
      onSelectAccount(acc);
      setIsProcessing(false);
    }, 450);
  };

  const handleAddCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim()) return;

    const email = customEmail.includes('@') ? customEmail.trim() : `${customEmail.trim()}@gmail.com`;
    const avatar = customAvatarPreview || selectedPresetAvatar || null;

    const newAcc: GoogleAccount = {
      name: customName.trim(),
      email,
      avatarUrl: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    };

    setAccounts((prev) => [newAcc, ...prev]);
    handleChoose(newAcc);
  };

  const handleCustomPhotoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomAvatarPreview(url);
      setSelectedPresetAvatar(null);
    }
  };

  const PRESET_AVATARS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Box */}
      <div className="relative w-full max-w-[440px] rounded-3xl bg-white dark:bg-[#0F172A] p-7 shadow-2xl border border-slate-200/90 dark:border-slate-800 transition-all text-[#1E293B] dark:text-white z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 ltr:right-5 rtl:left-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google Header */}
        <div className="flex flex-col items-center text-center">
          {/* Google SVG Logo */}
          <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-3">
            <svg viewBox="0 0 24 24" className="w-7 h-7" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.46a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.26-2.08 3.59-5.15 3.59-8.81Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.96-1.08 7.94-2.92l-3.88-3a7.2 7.2 0 0 1-10.72-3.78H1.31v3.1A12 12 0 0 0 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.34 14.3a7.19 7.19 0 0 1 0-4.6V6.6H1.31a12 12 0 0 0 0 10.8l4.03-3.1Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.31 6.6l4.03 3.1A7.16 7.16 0 0 1 12 4.75Z"
              />
            </svg>
          </div>

          <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {isAr ? 'اختيار حساب Google' : 'Choose an account'}
          </h3>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            {isAr ? 'للمتابعة إلى منصة عواطلي 3WATLY' : 'to continue to 3WATLY'}
          </p>
        </div>

        {/* Body Content */}
        {!showAddCustom ? (
          <div className="mt-6 space-y-2">
            {/* Account Items List */}
            {accounts.map((acc, idx) => (
              <button
                key={idx}
                onClick={() => handleChoose(acc)}
                disabled={isProcessing}
                className="w-full flex items-center gap-3.5 p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all text-left rtl:text-right group cursor-pointer disabled:opacity-50"
              >
                <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                  <img
                    src={acc.avatarUrl}
                    alt={acc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[14px] font-bold text-slate-900 dark:text-white truncate">
                    {acc.name}
                  </h4>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 truncate">
                    {acc.email}
                  </p>
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition shrink-0">
                  {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </div>
              </button>
            ))}

            {/* Use Another Account Button */}
            <button
              onClick={() => setShowAddCustom(true)}
              className="w-full flex items-center gap-3.5 p-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-left rtl:text-right cursor-pointer mt-3"
            >
              <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                <UserPlus className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-[13.5px] font-semibold text-blue-600 dark:text-blue-400">
                  {isAr ? 'استخدام حساب آخر (أدخل اسمك وإيميلك)...' : 'Use another Google account...'}
                </span>
              </div>
            </button>
          </div>
        ) : (
          /* Custom Google Account Form */
          <form onSubmit={handleAddCustomSubmit} className="mt-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {isAr ? 'إدخال بيانات حساب Google الخاص بك' : 'Enter your Google account details'}
              </span>
              <button
                type="button"
                onClick={() => setShowAddCustom(false)}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                {isAr ? 'رجوع' : 'Back'}
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isAr ? 'الاسم بالكامل (Google Name)' : 'Full Name (Google Name)'}
              </label>
              <input
                type="text"
                required
                placeholder={isAr ? 'مثال: محمد أحمد' : 'e.g. Mohamed Ahmed'}
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isAr ? 'البريد الإلكتروني (Google Email)' : 'Google Email Address'}
              </label>
              <input
                type="email"
                required
                placeholder="yourname@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                {isAr ? 'صورة الحساب (اختياري)' : 'Account Photo (Optional)'}
              </label>
              <div className="flex items-center gap-3">
                {PRESET_AVATARS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSelectedPresetAvatar(url);
                      setCustomAvatarPreview(null);
                    }}
                    className={`relative w-10 h-10 rounded-full overflow-hidden border-2 transition ${
                      selectedPresetAvatar === url && !customAvatarPreview
                        ? 'border-blue-600 scale-110 shadow-md'
                        : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt="Preset" className="w-full h-full object-cover" />
                    {selectedPresetAvatar === url && !customAvatarPreview && (
                      <div className="absolute inset-0 bg-blue-600/40 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}

                {/* Upload File Input */}
                <label className="relative w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center cursor-pointer hover:border-blue-500 transition shrink-0">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomPhotoFile}
                    className="hidden"
                  />
                  {customAvatarPreview ? (
                    <img
                      src={customAvatarPreview}
                      alt="Uploaded"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500">+</span>
                  )}
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={!customName.trim() || !customEmail.trim() || isProcessing}
              className="w-full mt-4 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-600/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isProcessing
                  ? (isAr ? 'جاري تسجيل الدخول...' : 'Signing in...')
                  : (isAr ? 'متابعة بهذا الحساب' : 'Continue with this account')}
              </span>
            </button>
          </form>
        )}

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-400">
            {isAr
              ? 'بالنقر على أي حساب، يتم إنشاء ملفك الشخصي ومزامنة اسمك وصورتك تلقائياً.'
              : 'Selecting an account automatically creates your profile and syncs your name and photo.'}
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, UserPlus, Check, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

export interface LinkedInAccount {
  name: string;
  email: string;
  avatarUrl: string;
  headline: string;
}

const DEFAULT_LINKEDIN_ACCOUNTS: LinkedInAccount[] = [
  {
    name: 'Mohamed Ahmed',
    email: 'mohamed.ahmed@linkedin.com',
    headline: 'Senior Software Engineer | Cairo',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  },
  {
    name: 'Ahmed Amr',
    email: 'ahmed.amr@linkedin.com',
    headline: 'Data Scientist & AI Specialist',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
  },
  {
    name: 'Nouran Hassan',
    email: 'nouran.hassan@linkedin.com',
    headline: 'Product Designer (UI/UX)',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
  },
];

interface LinkedInAccountChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (account: { name: string; email: string; avatarUrl?: string | null }) => void;
}

export function LinkedInAccountChooserModal({
  isOpen,
  onClose,
  onSelectAccount,
}: LinkedInAccountChooserModalProps) {
  const { isAr } = useLanguage();
  const [accounts, setAccounts] = useState<LinkedInAccount[]>(DEFAULT_LINKEDIN_ACCOUNTS);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customHeadline, setCustomHeadline] = useState('');
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

    const email = customEmail.includes('@') ? customEmail.trim() : `${customEmail.trim()}@linkedin.com`;

    const newAcc: LinkedInAccount = {
      name: customName.trim(),
      email,
      headline: customHeadline.trim() || 'Professional on LinkedIn',
      avatarUrl: customAvatarPreview || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    };

    setAccounts((prev) => [newAcc, ...prev]);
    handleChoose(newAcc);
  };

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

        {/* LinkedIn Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-[#0A66C2]/10 border border-[#0A66C2]/20 flex items-center justify-center mb-3">
            <svg viewBox="0 0 24 24" className="w-7 h-7" aria-hidden="true">
              <path
                fill="#0A66C2"
                d="M4.98 3.5a2.5 2.5 0 1 1-.02 5 2.5 2.5 0 0 1 .02-5ZM3 9h4v12H3V9Zm6.5 0h3.83v1.64h.05a4.2 4.2 0 0 1 3.78-2.08C20.6 8.56 22 10.6 22 14.1V21h-4v-6.1c0-1.53-.55-2.57-1.92-2.57-1.05 0-1.67.7-1.94 1.38-.1.25-.13.6-.13.94V21h-4V9Z"
              />
            </svg>
          </div>

          <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {isAr ? 'اختيار حساب LinkedIn' : 'Sign in with LinkedIn'}
          </h3>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            {isAr ? 'للمتابعة إلى منصة عواطلي 3WATLY' : 'to continue to 3WATLY'}
          </p>
        </div>

        {/* Body Content */}
        {!showAddCustom ? (
          <div className="mt-6 space-y-2">
            {accounts.map((acc, idx) => (
              <button
                key={idx}
                onClick={() => handleChoose(acc)}
                disabled={isProcessing}
                className="w-full flex items-center gap-3.5 p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 hover:border-[#0A66C2]/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all text-left rtl:text-right group cursor-pointer disabled:opacity-50"
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
                  <p className="text-[11.5px] text-[#0A66C2] font-medium truncate">
                    {acc.headline}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {acc.email}
                  </p>
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-[#0A66C2] group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition shrink-0">
                  {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </div>
              </button>
            ))}

            <button
              onClick={() => setShowAddCustom(true)}
              className="w-full flex items-center gap-3.5 p-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-[#0A66C2] hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-left rtl:text-right cursor-pointer mt-3"
            >
              <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                <UserPlus className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-[13.5px] font-semibold text-[#0A66C2] dark:text-blue-400">
                  {isAr ? 'استخدام حساب آخر (أدخل اسمك وإيميلك)...' : 'Use another LinkedIn account...'}
                </span>
              </div>
            </button>
          </div>
        ) : (
          <form onSubmit={handleAddCustomSubmit} className="mt-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {isAr ? 'إدخال بيانات حساب LinkedIn' : 'Enter your LinkedIn details'}
              </span>
              <button
                type="button"
                onClick={() => setShowAddCustom(false)}
                className="text-xs font-semibold text-[#0A66C2] dark:text-blue-400 hover:underline"
              >
                {isAr ? 'رجوع' : 'Back'}
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isAr ? 'الاسم بالكامل (LinkedIn Name)' : 'Full Name (LinkedIn Name)'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mohamed Ahmed"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isAr ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <input
                type="email"
                required
                placeholder="yourname@linkedin.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
              />
            </div>

            <button
              type="submit"
              disabled={!customName.trim() || !customEmail.trim() || isProcessing}
              className="w-full mt-4 py-3 px-4 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white text-sm font-bold shadow-lg shadow-blue-600/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
      </div>
    </div>
  );
}

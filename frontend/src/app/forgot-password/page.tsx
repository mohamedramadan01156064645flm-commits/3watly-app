"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Decor } from '@/components/brand/Decor';
import { AuthSidePanel } from '@/components/brand/AuthSidePanel';
import { SubmitButton } from '@/components/Form/SubmitButton';
import { TextField } from '@/components/Form/TextField';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { TopToast } from '@/components/ui/TopToast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { isAr, t } = useLanguage();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [topError, setTopError] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  // Auto-dismiss top error after 4 seconds
  useEffect(() => {
    if (topError) {
      const timer = setTimeout(() => {
        setTopError(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [topError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setHasError(true);
      setTopError(isAr ? 'يرجى إدخال بريد إلكتروني صحيح لإرسال الرابط.' : 'Please enter a valid email address.');
      return;
    }

    setHasError(false);
    setTopError(null);
    setIsSubmitting(true);

    try {
      const res = await resetPassword(email.trim());
      if (res.success) {
        setIsSent(true);
        toast.success(isAr ? 'تم إرسال رابط إعادة التعيين بنجاح!' : 'Reset link sent successfully!');
      } else {
        setTopError(res.error || (isAr ? 'حدث خطأ أثناء الإرسال. يرجى التأكد من البريد والمحاولة لاحقاً.' : 'Failed to send reset link.'));
      }
    } catch {
      setTopError(isAr ? 'حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.' : 'Failed to send reset link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#F8FAFC] dark:bg-[#060913] text-[#1E293B] dark:text-[#F8FAFC] flex flex-col justify-between">
      <Decor />

      {/* Floating Top Toast */}
      <TopToast
        message={topError}
        type="error"
        onClose={() => setTopError(null)}
      />

      {/* Floating Language & Theme Toggles */}
      <div className="absolute top-6 ltr:right-6 rtl:left-6 lg:top-8 lg:ltr:right-10 lg:rtl:left-10 z-30 flex items-center gap-2.5">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      {/* Main Grid Content */}
      <main className="relative z-10 mx-auto grid w-full max-w-[1360px] grid-cols-1 items-center gap-12 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16 lg:px-12 lg:py-16">
        
        {/* Left Column: Modern AuthSidePanel */}
        <AuthSidePanel mode="forgot-password" />

        {/* Right Column: Auth Form Card */}
        <section className="w-full flex justify-center lg:justify-end">
          <div className="w-full max-w-[520px] rounded-[28px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0D1527] p-7 sm:p-10 shadow-[0_20px_50px_rgba(27,45,105,0.08)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_20px_rgba(99,102,241,0.06)]">
            {!isSent ? (
              <>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/80 flex items-center justify-center border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h2 className="mt-3 text-[26px] font-black leading-tight tracking-tight text-[#0B132B] dark:text-white">
                    {isAr ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                  </h2>
                  <p className="mt-1 text-[13.5px] font-normal text-slate-500 dark:text-slate-400">
                    {isAr ? 'ادخل بريدك المسجل وسنرسل لك رابطاً لإعادة التعيين فوراً' : "No worries, we'll send you reset instructions"}
                  </p>
                </div>

                <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
                  <TextField
                    id="email"
                    label={isAr ? 'البريد الإلكتروني' : 'Email Address'}
                    placeholder={isAr ? 'name@example.com' : 'name@example.com'}
                    icon="mail"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(val) => {
                      setEmail(val);
                      if (hasError) setHasError(false);
                    }}
                    hasError={hasError}
                  />

                  <div className="pt-2">
                    <SubmitButton
                      loading={isSubmitting}
                      label={isAr ? 'إرسال رابط إعادة التعيين ⚡' : 'Send Reset Link ⚡'}
                    />
                  </div>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center border border-emerald-200 dark:border-emerald-500/30 mb-4 shadow-sm">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-[24px] font-black leading-tight tracking-tight text-[#0B132B] dark:text-white">
                  {isAr ? 'تم إرسال الرابط!' : 'Check Your Email!'}
                </h2>
                <p className="mt-2 text-[13.5px] font-normal text-slate-500 dark:text-slate-400 max-w-[340px] leading-relaxed">
                  {isAr 
                    ? `أرسلنا رابط إعادة تعيين كلمة المرور إلى ${email}. تفقد بريدك الوارد.` 
                    : `We sent a password reset link to ${email}. Please check your inbox.`}
                </p>
                <div className="mt-6 w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-[12.5px] text-slate-500 dark:text-slate-400">
                  {isAr ? 'لم يصلك البريد بعد؟ ' : "Didn't receive the email? "}
                  <button
                    type="button"
                    onClick={() => setIsSent(false)}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    {isAr ? 'أعد المحاولة' : 'try again'}
                  </button>
                </div>
              </div>
            )}

            <p className="mt-6 text-center text-[13.5px]">
              <Link 
                href="/login" 
                className="inline-flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
              >
                <ArrowLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                <span>{isAr ? 'العودة لتسجيل الدخول' : 'Back to Login'}</span>
              </Link>
            </p>
          </div>
        </section>

      </main>

      <footer className="relative z-10 py-6 text-center text-[12px] text-slate-400 dark:text-slate-500 font-medium">
        {t('footerRights')}
      </footer>
    </div>
  );
}

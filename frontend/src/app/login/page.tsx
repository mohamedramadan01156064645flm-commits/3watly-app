"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Decor } from '@/components/brand/Decor';
import { AuthSidePanel } from '@/components/brand/AuthSidePanel';
import { Sparkle } from '@/components/brand/Sparkle';
import { Checkbox } from '@/components/Form/Checkbox';
import { Divider } from '@/components/Form/Divider';
import { SocialAuthButtons } from '@/components/Form/SocialAuthButtons';
import { SubmitButton } from '@/components/Form/SubmitButton';
import { TextField } from '@/components/Form/TextField';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { TopToast } from '@/components/ui/TopToast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { isAr, t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const { user, loading, login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topError, setTopError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: boolean; password?: boolean }>({});


  // Restore remembered email on mount if available
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('3watly_remember_email');
      if (savedEmail) {
        setEmail(savedEmail);
        setRemember(true);
      }
    } catch {}
  }, []);

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
    const newErrors: { email?: boolean; password?: boolean } = {};

    if (!email.trim()) newErrors.email = true;
    if (!password.trim()) newErrors.password = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTopError(isAr ? "يرجى ملء جميع الحقول المطلوبة للمتابعة." : "Please fill in all required fields to continue.");
      return;
    }

    setErrors({});
    setTopError(null);
    setIsSubmitting(true);
    try {
      const res = await login(email.trim(), password, remember);
      if (res.success) {
        toast.success(isAr ? "تم تسجيل الدخول بنجاح!" : "Logged in successfully!");
        if (res.onboardingCompleted) {
          router.push('/dashboard');
        } else {
          router.push('/onboarding/career-path');
        }
      } else {
        const msg = res.error || (isAr ? "بيانات الدخول غير صحيحة. يرجى التحقق من البريد وكلمة المرور." : "Invalid credentials. Please check your email and password.");
        setTopError(msg);
        setErrors({ email: true, password: true });
      }
    } catch {
      setTopError(isAr ? "حدث خطأ غير متوقع أثناء تسجيل الدخول." : "An unexpected error occurred during login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#F8FAFC] dark:bg-[#060913] text-[#1E293B] dark:text-[#F8FAFC] flex flex-col justify-between">
      <Decor />

      {/* Floating Top-Center Notification */}
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
        <AuthSidePanel mode="login" />

        {/* Right Column: Auth Form Card */}
        <section className="w-full flex justify-center lg:justify-end">
          <div className="w-full max-w-[520px] rounded-[28px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0D1527] p-7 sm:p-10 shadow-[0_20px_50px_rgba(27,45,105,0.08)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_20px_rgba(99,102,241,0.06)]">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/80 flex items-center justify-center border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400">
                <Sparkle className="h-6 w-6" />
              </div>
              <h2 className="mt-3 text-[26px] font-black leading-tight tracking-tight text-[#0B132B] dark:text-white">
                {isAr ? "تسجيل الدخول" : "Welcome Back"}
              </h2>
              <p className="mt-1 text-[13.5px] font-normal text-slate-500 dark:text-slate-400">
                {isAr ? "سجّل دخولك لحسابك لمتابعة خطتك المهنية" : "Log in to your account to continue"}
              </p>
            </div>

            {/* Google & LinkedIn OAuth Buttons */}
            <div className="mt-6">
              <SocialAuthButtons
                googleLabel={isAr ? "حساب Google" : "Google"}
                linkedinLabel={isAr ? "حساب LinkedIn" : "LinkedIn"}
              />
            </div>

            <div className="my-5">
              <Divider label={isAr ? "أو باستخدام البريد الإلكتروني" : "or continue with email"} />
            </div>

            <form
              className="space-y-4"
              onSubmit={handleSubmit}
            >
              <TextField
                id="email"
                label={isAr ? "البريد الإلكتروني" : "Email Address"}
                placeholder={isAr ? "name@example.com" : "name@example.com"}
                icon="mail"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(val) => {
                  setEmail(val);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: false }));
                }}
                hasError={errors.email}
              />

              <div>
                <TextField
                  id="password"
                  label={isAr ? "كلمة المرور" : "Password"}
                  placeholder={isAr ? "••••••••" : "••••••••"}
                  icon="lock"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(val) => {
                    setPassword(val);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: false }));
                  }}
                  hasError={errors.password}
                />

                <div className="mt-2.5 flex items-center justify-between text-[12.5px]">
                  <Checkbox
                    id="remember"
                    label={isAr ? "تذكرني على هذا الجهاز" : "Remember me"}
                    checked={remember}
                    onChange={setRemember}
                  />

                  <Link
                    href="/forgot-password"
                    className="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    {isAr ? "نسيت كلمة المرور؟" : "Forgot Password?"}
                  </Link>
                </div>
              </div>

              <div className="pt-2">
                <SubmitButton
                  loading={isSubmitting}
                  label={isAr ? "تسجيل الدخول" : "Log In"}
                />
              </div>

              <p className="text-center text-[13px] text-slate-500 dark:text-slate-400 pt-3">
                {isAr ? "ليس لديك حساب بعد؟" : "Don't have an account yet?"}{' '}
                <Link
                  href="/signup"
                  className="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
                >
                  {isAr ? "إنشاء حساب جديد مجاناً" : "Sign Up for Free"}
                </Link>
              </p>
            </form>
          </div>
        </section>

      </main>

      <footer className="relative z-10 py-6 text-center text-[12px] text-slate-400 dark:text-slate-500 font-medium">
        {t('footerRights')}
      </footer>
    </div>
  );
}

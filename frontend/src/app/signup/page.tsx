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
import { LegalModal, LegalModalType } from '@/components/legal/LegalModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function SignUpPage() {
  const router = useRouter();
  const { isAr, t } = useLanguage();
  const { user, loading, signup } = useAuth();
  

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [topError, setTopError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    fullName?: boolean;
    email?: boolean;
    password?: boolean;
    confirmPassword?: boolean;
    agreed?: boolean;
  }>({});

  // Legal Modal State
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<LegalModalType>('terms');

  // Auto-dismiss top error after 4 seconds
  useEffect(() => {
    if (topError) {
      const timer = setTimeout(() => {
        setTopError(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [topError]);

  const openLegalModal = (type: LegalModalType, e: React.MouseEvent) => {
    e.preventDefault();
    setLegalModalType(type);
    setLegalModalOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const newErrors: {
      fullName?: boolean;
      email?: boolean;
      password?: boolean;
      confirmPassword?: boolean;
      agreed?: boolean;
    } = {};

    if (!fullName.trim()) newErrors.fullName = true;
    if (!email.trim()) newErrors.email = true;
    if (!password.trim()) newErrors.password = true;
    if (!confirmPassword.trim()) newErrors.confirmPassword = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTopError(isAr ? "يرجى ملء جميع الحقول المطلوبة للمتابعة." : "Please fill in all required fields to continue.");
      return;
    }

    if (password.length < 6) {
      setErrors({ password: true });
      setTopError(isAr ? "كلمة المرور يجب أن تتكون من 6 خانات على الأقل." : "Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrors({ password: true, confirmPassword: true });
      setTopError(isAr ? "كلمتا المرور غير متطابقتين. يرجى التأكد وإعادة الإدخال." : "Passwords do not match. Please re-enter.");
      return;
    }

    if (!agreed) {
      setErrors({ agreed: true });
      setTopError(isAr ? "يرجى الموافقة على شروط الاستخدام وسياسة الخصوصية." : "Please accept terms & privacy policy to continue.");
      return;
    }

    setErrors({});
    setTopError(null);
    setIsSubmitting(true);

    try {
      const res = await signup(fullName.trim(), email.trim(), password);
      if (res.success) {
        toast.success(isAr ? "تم إنشاء حسابك بنجاح! أهلاً بك في عواطلي." : "Account created successfully! Welcome to 3WATLY.");
        router.push('/onboarding/career-path');
      } else {
        setTopError(res.error || (isAr ? "فشل إنشاء الحساب. قد يكون البريد مسجلاً مسبقاً." : "Failed to create account. Email may already be in use."));
        setErrors({ email: true });
      }
    } catch {
      setTopError(isAr ? "حدث خطأ غير متوقع أثناء إنشاء الحساب." : "An unexpected error occurred during signup.");
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

      {/* Interactive Bilingual Legal Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        type={legalModalType}
        onClose={() => setLegalModalOpen(false)}
      />

      {/* Floating Language & Theme Toggles */}
      <div className="absolute top-6 ltr:right-6 rtl:left-6 lg:top-8 lg:ltr:right-10 lg:rtl:left-10 z-30 flex items-center gap-2.5">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      {/* Main Grid Content */}
      <main className="relative z-10 mx-auto grid w-full max-w-[1360px] grid-cols-1 items-center gap-12 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16 lg:px-12 lg:py-16">
        
        {/* Left Column: Modern AuthSidePanel */}
        <AuthSidePanel mode="signup" />

        {/* Right Column: Auth Form Card */}
        <section className="w-full flex justify-center lg:justify-end">
          <div className="w-full max-w-[520px] rounded-[28px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0D1527] p-7 sm:p-10 shadow-[0_20px_50px_rgba(27,45,105,0.08)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_20px_rgba(99,102,241,0.06)]">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/80 flex items-center justify-center border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400">
                <Sparkle className="h-6 w-6" />
              </div>
              <h2 className="mt-3 text-[26px] font-black leading-tight tracking-tight text-[#0B132B] dark:text-white">
                {isAr ? "إنشاء حساب جديد" : "Create an Account"}
              </h2>
              <p className="mt-1 text-[13.5px] font-normal text-slate-500 dark:text-slate-400">
                {isAr ? "ابدأ رحلة تطوير مسارك المهني بالبيانات والذكاء الاصطناعي" : "Start your data-driven career growth journey with AI"}
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
              className="space-y-3.5"
              onSubmit={handleSubmit}
            >
              <TextField
                id="fullName"
                label={isAr ? "الاسم بالكامل" : "Full Name"}
                placeholder={isAr ? "مثال: أحمد عمرو" : "e.g. Ahmed Amr"}
                icon="user"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(val) => {
                  setFullName(val);
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: false }));
                }}
                hasError={errors.fullName}
              />

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

              <TextField
                id="password"
                label={isAr ? "كلمة المرور" : "Password"}
                placeholder={isAr ? "6 خانات على الأقل" : "At least 6 characters"}
                icon="lock"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(val) => {
                  setPassword(val);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: false }));
                }}
                hasError={errors.password}
              />

              <TextField
                id="confirmPassword"
                label={isAr ? "تأكيد كلمة المرور" : "Confirm Password"}
                placeholder={isAr ? "أعد كتابة كلمة المرور" : "Re-enter password"}
                icon="lock"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(val) => {
                  setConfirmPassword(val);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: false }));
                }}
                hasError={errors.confirmPassword}
              />

              {/* Interactive Terms & Privacy Checkbox with Modals */}
              <div className={`p-2.5 rounded-xl border transition-colors ${
                errors.agreed 
                  ? 'border-rose-500 bg-rose-50/20 dark:bg-rose-950/20 ring-2 ring-rose-500/20' 
                  : 'border-transparent'
              }`}>
                <div className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    id="terms-checkbox"
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                      if (errors.agreed) setErrors((prev) => ({ ...prev, agreed: false }));
                    }}
                    className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="terms-checkbox" className="cursor-pointer select-none">
                    {isAr ? (
                      <>
                        أوافق على{' '}
                        <button
                          type="button"
                          onClick={(e) => openLegalModal('terms', e)}
                          className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline cursor-pointer"
                        >
                          شروط الاستخدام
                        </button>
                        {' '}و{' '}
                        <button
                          type="button"
                          onClick={(e) => openLegalModal('privacy', e)}
                          className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline cursor-pointer"
                        >
                          سياسة الخصوصية
                        </button>
                      </>
                    ) : (
                      <>
                        I agree to the{' '}
                        <button
                          type="button"
                          onClick={(e) => openLegalModal('terms', e)}
                          className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline cursor-pointer"
                        >
                          Terms of Service
                        </button>
                        {' '}and{' '}
                        <button
                          type="button"
                          onClick={(e) => openLegalModal('privacy', e)}
                          className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline cursor-pointer"
                        >
                          Privacy Policy
                        </button>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <SubmitButton
                  loading={isSubmitting}
                  label={isAr ? "إنشاء حسابي مجاناً" : "Create Free Account"}
                />
              </div>

              <p className="text-center text-[13px] text-slate-500 dark:text-slate-400 pt-2">
                {isAr ? "لديك حساب بالفعل؟" : "Already have an account?"}{' '}
                <Link
                  href="/login"
                  className="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
                >
                  {isAr ? "تسجيل الدخول" : "Log In"}
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

"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Star, Upload, Brain, Target, Sparkles, Rocket } from 'lucide-react';
import { AnalyzePanel, PlanPanel, UploadPanel } from './StepPanels';
import { testimonials } from '@/data/landing';
import { useLanguage } from '@/contexts/LanguageContext';

const panels = [UploadPanel, AnalyzePanel, PlanPanel];

const iconsMap: Record<string, React.ReactNode> = {
  upload: <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
  brain: <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
  target: <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
};

export function HowItWorks() {
  const { isAr } = useLanguage();

  const steps = isAr
    ? [
        {
          number: '1',
          title: 'ارفع سيرتك الذاتية (CV)',
          description: 'ارفع ملف الـ CV وحدد تخصصك المستهدف والمحافظة المناسبة ليك.',
          progress: 34,
          icon: 'upload'
        },
        {
          number: '2',
          title: 'تحليل فوري بالذكاء الاصطناعي',
          description: 'نظامنا بيفحص مهاراتك وسنوات خبرتك ويقارنها بمتطلبات سوق العمل المصري.',
          progress: 68,
          icon: 'brain'
        },
        {
          number: '3',
          title: 'استلم خطتك المهنية والوظائف',
          description: 'احصل على خطة لتطوير مهاراتك مع ترشيحات لأفضل الوظائف المطابقة ليك.',
          progress: 100,
          icon: 'target'
        }
      ]
    : [
        {
          number: '1',
          title: 'Upload Your CV',
          description: 'Upload your CV and tell us your target role and preferred location.',
          progress: 34,
          icon: 'upload'
        },
        {
          number: '2',
          title: 'AI Analyzes Everything',
          description: 'Our AI engine analyzes your skills, experience, and the Egyptian job market.',
          progress: 68,
          icon: 'brain'
        },
        {
          number: '3',
          title: 'Get Your Career Plan',
          description: 'Receive a personalized career plan with job matches and skill roadmap.',
          progress: 100,
          icon: 'target'
        }
      ];

  return (
    <section id="how-it-works" className="w-full bg-white dark:bg-[#060913] py-16 px-6 sm:px-10 lg:px-16 border-t border-slate-100 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-300 text-[12px] font-bold tracking-wider uppercase border border-blue-100/80 dark:border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? "بسيطة • ذكية • مخصصة لك" : "Simple. Smart. Personalized."}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0F172A] dark:text-white leading-tight tracking-tight">
            {isAr ? (
              <>
                كيف تعمل منصة <span className="bg-gradient-to-r from-[#1B57E0] to-[#10B981] bg-clip-text text-transparent">عواطلي</span>
              </>
            ) : (
              <>
                How <span className="bg-gradient-to-r from-[#1B57E0] to-[#10B981] bg-clip-text text-transparent">3WATLY</span> Works
              </>
            )}
          </h2>

          <p className="text-[15px] text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            {isAr ? "3 خطوات عملية وسهلة لتصل لأفضل الفرص المناسبة لمهاراتك." : "Three simple steps to unlock your best career opportunities."}
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3 relative">
          {steps.map((step, index) => {
            const Panel = panels[index];
            const isLast = index === steps.length - 1;

            return (
              <div key={step.number} className="relative flex">
                
                {/* Number Badge */}
                <div
                  className={`absolute -top-5 left-1/2 z-20 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full text-[15px] font-black text-white ring-4 ring-white dark:ring-[#060913] shadow-md ${
                    isLast ? 'bg-emerald-500' : 'bg-blue-600'
                  }`}
                >
                  {step.number}
                </div>

                {/* Arrow to next step on desktop */}
                {!isLast && (
                  <div
                    className="absolute ltr:-right-4 rtl:-left-4 top-[42%] z-20 hidden h-8 w-8 items-center justify-center rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] shadow-md lg:flex"
                    aria-hidden="true"
                  >
                    <ArrowRight className={`h-4 w-4 text-blue-600 dark:text-blue-400 ${isAr ? "rotate-180" : ""}`} />
                  </div>
                )}

                {/* Step Card Container */}
                <div className="flex w-full flex-col rounded-[28px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 pt-9 shadow-xl shadow-slate-200/50 dark:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.7),0_0_15px_rgba(99,102,241,0.06)] hover:shadow-2xl transition-all">
                  
                  {/* Visual Preview */}
                  <div className="h-[210px]">
                    <Panel />
                  </div>

                  {/* Step Description */}
                  <div className="mt-5 flex items-start gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isLast 
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-500/30' 
                          : 'bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-500/30'
                      }`}
                    >
                      {iconsMap[step.icon]}
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-slate-900 dark:text-white leading-snug">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed min-h-[38px] font-normal">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bottom Line */}
                  <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full ${isLast ? 'bg-emerald-500' : 'bg-blue-600'}`}
                      style={{ width: `${step.progress}%` }}
                    />
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="relative mt-12 overflow-hidden rounded-[26px] border border-slate-200/70 dark:border-white/10 bg-[#F4F8FF] dark:bg-gradient-to-r dark:from-[#0B1224] dark:via-[#111C38] dark:to-[#09101E] px-6 py-6 sm:px-10 sm:py-6 shadow-xl shadow-slate-200/50 dark:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),0_0_20px_rgba(99,102,241,0.1)]">
          
          <div className="pointer-events-none absolute inset-0 select-none dark:hidden">
            <Image
              src="/images/rocket-banner-bg.png"
              alt="Rocket banner background"
              fill
              className="object-cover object-left opacity-90"
              priority
            />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-between gap-6 lg:flex-row ltr:sm:pl-28 ltr:lg:pl-36 rtl:sm:pr-28 rtl:lg:pr-36">
            
            {/* Content */}
            <div className="text-center lg:text-left rtl:lg:text-right space-y-1">
              <h3 className="text-[19px] sm:text-[21px] font-black text-[#0F172A] dark:text-white tracking-tight leading-snug">
                {isAr ? "أقوى انطلاقة لمسارك المهني تبدأ الآن." : "Your best career move starts here."}
              </h3>
              <p className="text-[13px] text-slate-600 dark:text-slate-400 font-medium">
                {isAr ? "انضم لآلاف المتخصصين الذين يطورون مسارهم مع عواطلي." : "Join thousands of professionals growing with 3WATLY."}
              </p>
              
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start rtl:lg:justify-start gap-2.5">
                <div className="flex items-center -space-x-2 rtl:space-x-reverse">
                  {testimonials.map((person) => (
                    <img
                      key={person.name}
                      src={person.avatar}
                      alt=""
                      className="h-6 w-6 rounded-full border-2 border-white dark:border-[#0B1224] object-cover shadow-sm"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? "يثق بنا أكثر من 15,000 متخصص" : "Trusted by 15,000+ professionals"}
                </span>
              </div>
            </div>

            {/* Action */}
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-bold shadow-lg shadow-blue-600/25 hover:-translate-y-0.5 transition-all"
              >
                <span>{isAr ? "ابدأ مجاناً الآن" : "Get Started Free"}</span>
                <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
              </Link>
              <p className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{isAr ? "بدون أي رسوم أو بطاقة ائتمان" : "No credit card required"}</span>
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

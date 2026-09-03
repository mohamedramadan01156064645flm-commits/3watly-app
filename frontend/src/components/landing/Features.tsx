"use client";

import React from 'react';
import { ArrowRight, CheckCircle2, BarChart3, FileText, Sparkles, LayoutGrid } from 'lucide-react';
import { CopilotPanel, CvPreviewPanel, SkillGapPanel } from './FeaturePanels';
import { useLanguage } from '@/contexts/LanguageContext';

const panels = [SkillGapPanel, CvPreviewPanel, CopilotPanel];

const iconsMap: Record<string, React.ReactNode> = {
  bar: <BarChart3 className="w-5 h-5" />,
  file: <FileText className="w-5 h-5" />,
  sparkles: <Sparkles className="w-5 h-5" />
};

const tones: Record<string, { tile: string; bullet: string; link: string }> = {
  success: {
    tile: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/30',
    bullet: 'text-emerald-500 dark:text-emerald-400',
    link: 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300'
  },
  primary: {
    tile: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/30',
    bullet: 'text-blue-600 dark:text-blue-400',
    link: 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
  },
  accent: {
    tile: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/30',
    bullet: 'text-indigo-500 dark:text-indigo-400',
    link: 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300'
  }
};

export function Features() {
  const { isAr } = useLanguage();

  const featureCards = isAr
    ? [
        {
          title: 'تحليل فجوات المهارات الفعلي',
          description: 'اعرف مهاراتك الحالية، ايه اللي ناقصك بالظبط، وايه المهارات المطلوبة لتترقى.',
          icon: 'bar',
          tone: 'success',
          bullets: [
            'فحص ذكي لمهاراتك وخبراتك الحالية',
            'مقارنة حية بمتطلبات الوظائف في مصر',
            'توصيات مخصصة بمسارات التعلم الأهم'
          ]
        },
        {
          title: 'صانع سيرة ذاتية متوافق مع ATS',
          description: 'أنشئ سيرة ذاتية احترافية تجتاز أنظمة الفرز الآلي وتلفت انتباه مسؤولي التوظيف.',
          icon: 'file',
          tone: 'primary',
          bullets: [
            'مؤشر توافق ATS ونصائح تحسين فورية',
            'نماذج مخصصة لقطاعات التكنولوجيا',
            'اقتراحات ذكية للكلمات المفتاحية'
          ]
        },
        {
          title: 'المساعد المهني الذكي (AI Copilot)',
          description: 'مستشارك المهني المتاح 24/7 لتقديم النصائح والإجابة على أي استفسار في مسارك.',
          icon: 'sparkles',
          tone: 'accent',
          bullets: [
            'إرشاد وتوجيه مهني مخصص لخبرتك',
            'رؤى مبنية على سوق العمل المصري الحقيقي',
            'دعم ذكي وتفاعلي في أي وقت'
          ]
        }
      ]
    : [
        {
          title: 'Live Skill Gap Analyzer',
          description: "Know exactly what skills you have, what's missing, and what to learn next.",
          icon: 'bar',
          tone: 'success',
          bullets: [
            'AI analyzes your current skills',
            'Compares with target role & market demand',
            'Personalized learning recommendations'
          ]
        },
        {
          title: 'ATS-Friendly CV Builder',
          description: 'Create a professional CV that passes ATS and gets you noticed.',
          icon: 'file',
          tone: 'primary',
          bullets: [
            'ATS score & optimization tips',
            'Industry-specific templates',
            'Keyword & content suggestions'
          ]
        },
        {
          title: 'AI Career Copilot',
          description: 'Your personal AI assistant for career advice, insights, and next steps.',
          icon: 'sparkles',
          tone: 'accent',
          bullets: [
            'Personalized career guidance',
            'Egyptian market insights',
            '24/7 AI-powered support'
          ]
        }
      ];

  return (
    <section id="features" className="w-full bg-transparent py-14 px-6 sm:px-10 lg:px-16 transition-colors duration-300 scroll-mt-20">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-300 text-[12px] font-bold tracking-wider uppercase border border-blue-100/80 dark:border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? "أقوى المميزات" : "Powerful Features"}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0F172A] dark:text-white leading-tight tracking-tight">
            {isAr ? (
              <>
                كل الأدوات اللي هتحتاجها <br className="hidden sm:inline" />
                لبناء <span className="bg-gradient-to-r from-[#1B57E0] to-[#10B981] bg-clip-text text-transparent">مسار مهني ناجح</span>
              </>
            ) : (
              <>
                Everything you need to <br className="hidden sm:inline" />
                build the <span className="bg-gradient-to-r from-[#1B57E0] to-[#10B981] bg-clip-text text-transparent">right career</span>
              </>
            )}
          </h2>

          <p className="text-[15px] text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            {isAr ? (
              <>
                منصة عواطلي تدمج قوة الذكاء الاصطناعي مع بيانات حقيقية لسوق العمل المصري لتمنحك{' '}
                <span className="font-semibold text-blue-600 dark:text-blue-400">أفضلية تنافسية حقيقية</span> في رحلتك المهنية.
              </>
            ) : (
              <>
                3WATLY combines AI technology with real Egyptian market data to give you an{' '}
                <span className="font-semibold text-blue-600 dark:text-blue-400">unfair advantage</span> in your career journey.
              </>
            )}
          </p>
        </div>

        {/* 3 Main Feature Cards */}
        <div className="mt-12 grid gap-7 lg:grid-cols-3">
          {featureCards.map((card, index) => {
            const Icon = iconsMap[card.icon] || <Sparkles className="w-5 h-5" />;
            const Panel = panels[index];
            const tone = tones[card.tone];

            return (
              <div
                key={card.title}
                className="flex flex-col rounded-[28px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-xl shadow-slate-200/50 dark:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.7),0_0_15px_rgba(99,102,241,0.06)] hover:shadow-2xl transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start gap-3.5">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tone.tile}`}>
                    {Icon}
                  </div>
                  <div>
                    <h3 className="text-[17px] font-bold text-slate-900 dark:text-white leading-snug">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-[12.5px] text-slate-500 dark:text-slate-400 leading-relaxed min-h-[36px] font-normal">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Interactive Inner Panel Preview */}
                <div className="mt-5 h-[255px]">
                  <Panel />
                </div>

                {/* Bullets */}
                <ul className="mt-5 flex flex-col gap-2">
                  {card.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 text-[13px] font-medium text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${tone.bullet}`} />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Footer Link */}
                <a
                  href="#how-it-works"
                  className={`mt-auto inline-flex items-center gap-1.5 pt-5 text-[13.5px] font-bold transition-colors ${tone.link}`}
                >
                  <span>{isAr ? "اعرف المزيد" : "Learn more"}</span>
                  <ArrowRight className={`h-4 w-4 ${isAr ? "rotate-180" : ""}`} />
                </a>
              </div>
            );
          })}
        </div>

        {/* Explore All Features Button */}
        <div className="mt-10 flex justify-center">
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white dark:bg-[#0B1120]/[0.04] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white text-[13.5px] font-bold shadow-sm hover:border-slate-300 dark:hover:border-white/20 transition-all"
          >
            <LayoutGrid className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{isAr ? "استكشف خطوات العمل" : "Explore how it works"}</span>
            <ArrowRight className={`w-4 h-4 text-slate-400 ${isAr ? "rotate-180" : ""}`} />
          </a>
        </div>

      </div>
    </section>
  );
}

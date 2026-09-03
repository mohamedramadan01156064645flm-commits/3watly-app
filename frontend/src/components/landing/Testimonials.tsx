"use client";

import React from 'react';
import { UserCheck, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function Testimonials() {
  const { isAr } = useLanguage();

  const testimonials = isAr
    ? [
        {
          quote: "عواطلي ساعدني اكتشف فجوات مهارات مكنتش واخد بالي منها خالص. بعد شهر ونص بالظبط جالي العرض اللي بحلم بيه.",
          name: 'أحمد م.',
          role: 'محلل بيانات أول',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'
        },
        {
          quote: "صانع السيرة الذاتية عبقري، مؤشر الـ ATS لملفي زاد من 62% لـ 94%، ومكالمات الـ HR زادت جداً.",
          name: 'سارة ك.',
          role: 'أخصائية تسويق رقمي',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80'
        },
        {
          quote: "أول مرة أشوف بيانات حقيقية ودقيقة لرواتب قطاع التكنولوجيا في مصر بالشكل ده. المنصة ممتازة.",
          name: 'عمر ط.',
          role: 'مهندس برمجيات',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80'
        },
        {
          quote: "المساعد الذكي (Copilot) بيحسسك إن معاك Mentor خبير في سوق العمل المصري متاح 24/7.",
          name: 'مي ر.',
          role: 'محللة نظم وأعمال',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80'
        }
      ]
    : [
        {
          quote: "3WATLY helped me discover skills I didn't know I was missing. I got my dream offer in just 6 weeks.",
          name: 'Ahmed M.',
          role: 'Senior Data Analyst',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'
        },
        {
          quote: 'The CV builder is genius. My ATS score jumped from 62% to 94% on the first pass and interview calls skyrocketed.',
          name: 'Sara K.',
          role: 'Marketing Specialist',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80'
        },
        {
          quote: 'The salary insights are spot on. Finally, real data for the Egyptian tech market.',
          name: 'Omar T.',
          role: 'Software Engineer',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80'
        },
        {
          quote: 'The AI Copilot feels like having a senior career mentor available 24/7.',
          name: 'Maya R.',
          role: 'Business Analyst',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80'
        }
      ];

  return (
    <section id="testimonials" className="w-full bg-white dark:bg-[#060913] pt-16 pb-10 px-6 sm:px-10 lg:px-16 border-t border-slate-100 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-300 text-[11.5px] font-bold tracking-wider uppercase border border-blue-100/80 dark:border-blue-500/30">
            <UserCheck className="w-3.5 h-3.5" />
            <span>{isAr ? "قصص النجاح وآراء المستخدمين" : "Success Stories & Reviews"}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-[#0F172A] dark:text-white leading-tight tracking-tight">
            {isAr ? (
              <>
                تجارب حقيقية من <span className="bg-gradient-to-r from-[#1B57E0] to-[#10B981] bg-clip-text text-transparent">كفاءات مصرية طموحة</span>
              </>
            ) : (
              <>
                Real stories from <span className="bg-gradient-to-r from-[#1B57E0] to-[#10B981] bg-clip-text text-transparent">ambitious professionals</span>
              </>
            )}
          </h2>
        </div>

        {/* 4 Testimonial Cards */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="flex flex-col rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-xl shadow-slate-200/50 dark:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.7),0_0_15px_rgba(99,102,241,0.06)] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <Quote className="h-5 w-5 text-blue-600 dark:text-blue-400 fill-blue-600/10 dark:fill-blue-400/10" />

              <blockquote className="mt-3 text-[13px] leading-relaxed text-slate-600 dark:text-slate-300 font-medium flex-1">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <div className="mt-4 flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="h-9 w-9 shrink-0 rounded-full object-cover shadow-sm border border-slate-200 dark:border-white/10"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <span className="block truncate text-[13px] font-bold text-slate-900 dark:text-white leading-tight">
                    {testimonial.name}
                  </span>
                  <span className="block truncate text-[11px] text-slate-400 font-medium">
                    {testimonial.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

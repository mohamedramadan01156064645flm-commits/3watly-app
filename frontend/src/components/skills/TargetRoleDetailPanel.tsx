'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  CheckCircle2,
} from 'lucide-react';
import { CarouselDots } from './CarouselDots';
import { RoleItem } from '@/data/rolesData';
import { useLanguage } from '@/contexts/LanguageContext';

const PANEL_BACKGROUND = '/images/role-card-bg.png';

interface TargetRoleDetailPanelProps {
  role: RoleItem;
  labels: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onConfirm: () => void;
}

export function TargetRoleDetailPanel({
  role,
  labels,
  activeIndex,
  onSelect,
  onConfirm,
}: TargetRoleDetailPanelProps) {
  const { isAr } = useLanguage();
  const reduceMotion = useReducedMotion();
  const t = role.theme;
  const Icon = role.icon;

  const title = isAr ? role.title : role.titleEn;
  const description = isAr ? role.description : (role.descriptionEn || role.description);

  return (
    <div
      className="relative w-full rounded-[24px] p-[1.5px]"
      style={{
        backgroundImage: `linear-gradient(150deg, ${t.borderActive}cc 0%, ${t.borderIdle}66 40%, ${t.borderActive}4d 100%)`,
        boxShadow: `0 24px 60px rgba(0,0,0,0.75), 0 0 35px ${t.glow}`,
      }}
    >
      <section
        dir={isAr ? 'rtl' : 'ltr'}
        aria-live="polite"
        aria-label={isAr ? `تفاصيل ${title}` : `Details of ${title}`}
        className="relative w-full overflow-hidden rounded-[23px]"
        style={{ backgroundColor: '#030b1c' }}
      >
        {/* Background artwork on left side */}
        <img
          src={PANEL_BACKGROUND}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-left"
        />

        {/* Readability veil */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{
            backgroundImage: isAr
              ? 'linear-gradient(270deg, rgba(3,9,24,0.96) 0%, rgba(3,9,24,0.88) 45%, rgba(3,9,24,0.40) 72%, rgba(3,9,24,0.05) 100%)'
              : 'linear-gradient(90deg, rgba(3,9,24,0.96) 0%, rgba(3,9,24,0.88) 45%, rgba(3,9,24,0.40) 72%, rgba(3,9,24,0.05) 100%)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[#030b1c]/85 md:hidden"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(110% 120% at 100% 50%, ${t.glow} 0%, rgba(0,0,0,0) 62%)`,
            opacity: 0.45,
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0) 100%)',
          }}
        />

        <motion.div
          key={role.id}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="relative grid grid-cols-12 gap-4 p-5 sm:p-6 sm:pb-8 lg:gap-6 items-center"
        >
          {/* ── Role Details, Description, and Core Skills ──────────────── */}
          <div className="col-span-12 md:col-span-8 flex flex-col items-center md:items-start text-center md:text-start gap-3">
            <div
              className="flex items-center gap-3 rounded-[15px] border py-1.5 px-3.5"
              style={{
                borderColor: `${t.borderIdle}cc`,
                backgroundColor: 'rgba(6, 26, 52, 0.75)',
                boxShadow:
                  '0 10px 24px rgba(2,8,20,0.65), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              <span
                className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-[12px]"
                style={{
                  backgroundImage: `linear-gradient(158deg, ${t.iconFrom} 0%, ${t.iconTo} 100%)`,
                  boxShadow: `0 10px 20px ${t.glow}, inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -8px 12px rgba(0,0,0,0.22)`,
                }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
                  style={{
                    backgroundImage:
                      'linear-gradient(180deg, rgba(255,255,255,0.3), rgba(255,255,255,0))',
                  }}
                />
                <Icon
                  aria-hidden="true"
                  className="relative h-5 w-5 text-white"
                  strokeWidth={1.8}
                />
              </span>
              <div className="flex flex-col items-start">
                <h3 className="text-[18px] font-extrabold leading-none text-white sm:text-[20px]">
                  {title}
                </h3>
                {isAr && role.titleEn && (
                  <span className="text-[11.5px] font-semibold text-slate-300 mt-1 opacity-80">
                    ({role.titleEn})
                  </span>
                )}
              </div>
            </div>

            <p className="max-w-[560px] text-[13px] leading-relaxed text-slate-300 line-clamp-2">
              {description}
            </p>

            {/* Target Skills Pills */}
            <div className="w-full">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {isAr ? 'المهارات والركائز الأساسية للمسار:' : 'Key Track Pillars & Core Skills:'}
              </span>
              <ul className="flex flex-wrap items-stretch justify-center md:justify-start gap-2 w-full">
                {role.skills.map((skill) => {
                  const SkillIcon = skill.icon;
                  const skillLabel = isAr ? skill.label : (skill.labelEn || skill.label);
                  return (
                    <li
                      key={skill.label}
                      className="flex items-center gap-1.5 rounded-[11px] border border-[#1B3B6B] bg-[#05142C]/85 px-3 py-1.5"
                      style={{
                        boxShadow:
                          'inset 0 1px 0 rgba(255,255,255,0.09), 0 6px 14px rgba(0,0,0,0.4)',
                      }}
                    >
                      <SkillIcon
                        aria-hidden="true"
                        className="h-3.5 w-3.5 shrink-0"
                        style={{ color: t.accent }}
                        strokeWidth={2}
                      />
                      <span className="text-[12px] font-semibold leading-tight text-slate-200">
                        {skillLabel}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* ── Call to Action Button: "Change" ──────────── */}
          <div className="col-span-12 md:col-span-4 flex justify-center md:justify-end items-center pt-2 md:pt-0">
            <button
              type="button"
              onClick={onConfirm}
              className="group/cta inline-flex w-full max-w-[220px] items-center justify-center gap-2.5 rounded-full px-6 py-3 text-[14.5px] font-black text-white outline-none transition-all duration-200 hover:-translate-y-[2px] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#03091a] active:translate-y-0 cursor-pointer shadow-lg"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, #8B5CF6 0%, #6366F1 52%, #2F80ED 100%)',
                boxShadow:
                  '0 12px 28px rgba(91,63,222,0.6), inset 0 1px 0 rgba(255,255,255,0.3)',
              }}
            >
              <CheckCircle2 className="h-4.5 w-4.5" />
              <span>{isAr ? 'تغيير' : 'Change'}</span>
              {isAr ? (
                <ChevronLeftIcon className="h-4 w-4 transition-transform duration-200 group-hover/cta:-translate-x-[2px]" />
              ) : (
                <ChevronRightIcon className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-[2px]" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Carousel Dots indicator */}
        <CarouselDots
          labels={labels}
          activeIndex={activeIndex}
          onSelect={onSelect}
          size="sm"
          className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0"
        />
      </section>
    </div>
  );
}

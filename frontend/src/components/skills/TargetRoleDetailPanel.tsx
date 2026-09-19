'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  BriefcaseIcon,
  CalendarDaysIcon,
  ChevronRightIcon,
  MapPinIcon,
  TrendingUpIcon,
} from 'lucide-react';
import { CarouselDots } from './CarouselDots';
import { RoleItem } from '@/data/rolesData';

const PANEL_BACKGROUND = '/images/role-card-bg.png';

interface TargetRoleDetailPanelProps {
  role: RoleItem;
  labels: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onConfirm: () => void;
}

interface DetailRow {
  label: string;
  value: string;
  icon: React.ElementType;
  iconColor: string;
  valueColor: string;
}

export function TargetRoleDetailPanel({
  role,
  labels,
  activeIndex,
  onSelect,
  onConfirm,
}: TargetRoleDetailPanelProps) {
  const reduceMotion = useReducedMotion();
  const t = role.theme;
  const Icon = role.icon;

  const rows: DetailRow[] = [
    {
      label: 'الموقع',
      value: role.location,
      icon: MapPinIcon,
      iconColor: t.accent,
      valueColor: '#FFFFFF',
    },
    {
      label: 'عدد الوظائف',
      value: `${role.jobs} وظيفة`,
      icon: BriefcaseIcon,
      iconColor: t.accent,
      valueColor: '#FFFFFF',
    },
    {
      label: 'نسبة النمو',
      value: role.growth,
      icon: TrendingUpIcon,
      iconColor: '#34D399',
      valueColor: '#34D399',
    },
    {
      label: 'الراتب',
      value: role.salary,
      icon: CalendarDaysIcon,
      iconColor: t.accent,
      valueColor: '#FFFFFF',
    },
  ];

  return (
    <div
      className="relative w-full rounded-[24px] p-[1.5px]"
      style={{
        backgroundImage: `linear-gradient(150deg, ${t.borderActive}cc 0%, ${t.borderIdle}66 40%, ${t.borderActive}4d 100%)`,
        boxShadow: `0 24px 60px rgba(0,0,0,0.75), 0 0 35px ${t.glow}`,
      }}
    >
      <section
        dir="rtl"
        aria-live="polite"
        aria-label={`تفاصيل ${role.title}`}
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
            backgroundImage:
              'linear-gradient(270deg, rgba(3,9,24,0.96) 0%, rgba(3,9,24,0.88) 45%, rgba(3,9,24,0.40) 72%, rgba(3,9,24,0.05) 100%)',
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
          className="relative grid grid-cols-12 gap-4 p-4.5 sm:p-5 sm:pb-8 lg:gap-6 items-center"
        >
          {/* ── Right (RTL right): Quick facts ─────────────────────────────── */}
          <div className="order-2 col-span-12 flex flex-col justify-center gap-2 border-t border-[#153055] pt-3.5 md:order-1 md:col-span-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
            {rows.map((row) => {
              const RowIcon = row.icon;
              return (
                <div key={row.label} className="flex items-center justify-between gap-3">
                  <span
                    className="shrink-0 rounded-[9px] border border-[#204775] bg-[#06172F]/85 px-3 py-1 text-[11.5px] font-semibold leading-none text-slate-200"
                    style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)' }}
                  >
                    {row.label}
                  </span>
                  <span dir="ltr" className="flex min-w-0 items-center gap-1.5 text-right">
                    <RowIcon
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0"
                      style={{ color: row.iconColor }}
                      strokeWidth={2.1}
                    />
                    <span
                      className="truncate text-[13px] font-bold leading-none"
                      style={{ color: row.valueColor }}
                    >
                      {row.value}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>

          {/* ── Middle: Identity, Summary, Skills ──────────────── */}
          <div className="order-1 col-span-12 flex flex-col items-center justify-center gap-2.5 text-center md:order-2 md:col-span-5">
            <div
              dir="ltr"
              className="flex items-center gap-3 rounded-[15px] border py-1.5 pl-2 pr-4"
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
              <h3 className="text-[19px] font-extrabold leading-none text-white sm:text-[21px]">
                {role.title}
              </h3>
            </div>

            <p className="max-w-[420px] text-[12.5px] leading-relaxed text-slate-300 line-clamp-2">
              {role.description}
            </p>

            <ul dir="rtl" className="flex flex-wrap items-stretch justify-center gap-2 w-full">
              {role.skills.map((skill) => {
                const SkillIcon = skill.icon;
                return (
                  <li
                    key={skill.label}
                    className="flex min-w-[85px] flex-1 flex-col items-center justify-center gap-1 rounded-[11px] border border-[#1B3B6B] bg-[#05142C]/85 px-2 py-1.5"
                    style={{
                      boxShadow:
                        'inset 0 1px 0 rgba(255,255,255,0.09), 0 6px 14px rgba(0,0,0,0.4)',
                    }}
                  >
                    <SkillIcon
                      aria-hidden="true"
                      className="h-4 w-4"
                      style={{ color: t.accent }}
                      strokeWidth={2}
                    />
                    <span className="text-[11px] font-semibold leading-tight text-slate-200 truncate max-w-[90px]">
                      {skill.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ── Left (RTL left): Call to Action over Artwork ──────────── */}
          <div className="order-3 col-span-12 flex justify-center md:justify-start items-end md:col-span-3 pt-2 md:pt-0">
            <button
              type="button"
              onClick={onConfirm}
              className="group/cta inline-flex w-full max-w-[240px] items-center justify-center gap-2.5 rounded-full px-5 py-2.5 text-[14px] font-bold text-white outline-none transition-all duration-200 hover:-translate-y-[2px] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#03091a] active:translate-y-0 cursor-pointer shadow-lg"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, #8B5CF6 0%, #6366F1 52%, #2F80ED 100%)',
                boxShadow:
                  '0 12px 28px rgba(91,63,222,0.6), inset 0 1px 0 rgba(255,255,255,0.3)',
              }}
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/20">
                <ChevronRightIcon
                  aria-hidden="true"
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover/cta:translate-x-[2px]"
                  strokeWidth={3}
                />
              </span>
              <span>استعرض الوظائف</span>
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

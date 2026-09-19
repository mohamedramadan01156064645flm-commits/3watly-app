"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { TechIcon } from './TechIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import type { TechItem } from '@/data/techStack';

interface TechCardProps {
  item: TechItem;
  duplicate?: boolean;
}

export function TechCard({ item, duplicate = false }: TechCardProps) {
  const { isAr } = useLanguage();
  const a = item.accent;
  const b = item.accentAlt;

  return (
    <Link
      href={`/jobs?q=${encodeURIComponent(item.query)}`}
      aria-hidden={duplicate || undefined}
      tabIndex={duplicate ? -1 : undefined}
      className="tech-card-shell group/card relative block shrink-0 rounded-[26px] p-[1px] transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02] cursor-pointer"
      style={{
        background: `linear-gradient(140deg, rgb(${a} / 0.9) 0%, rgb(${b} / 0.5) 30%, rgb(${a} / 0.1) 60%, rgb(${a} / 0.7) 100%)`,
        boxShadow: `0 0 0 1px rgb(${a} / 0.15), 0 16px 32px -12px rgba(0, 0, 0, 0.9), 0 0 24px rgb(${a} / 0.35)`
      }}
    >
      {/* Floor reflection / under-card glow */}
      <span
        className="tech-card-glow pointer-events-none absolute -bottom-3 left-6 right-6 h-5 rounded-full blur-md opacity-70 transition-opacity duration-300 group-hover/card:opacity-100"
        style={{ background: `rgb(${a} / 0.45)` }}
        aria-hidden="true"
      />

      {/* Internal Glassmorphic Capsule */}
      <span
        dir="ltr"
        className="tech-card-inner relative flex items-center gap-3.5 overflow-hidden rounded-[25px] py-3 pl-3.5 pr-11 sm:gap-4 sm:py-3.5 sm:pl-4 sm:pr-12 text-left"
      >
        {/* Top specular sheen highlight */}
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
          style={{
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.12), transparent 100%)'
          }}
          aria-hidden="true"
        />

        {/* Ambient corner tints */}
        <span
          className="pointer-events-none absolute -left-8 -top-10 h-28 w-28 rounded-full blur-xl"
          style={{ background: `rgb(${b} / 0.22)` }}
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute -bottom-10 right-4 h-24 w-24 rounded-full blur-xl"
          style={{ background: `rgb(${a} / 0.18)` }}
          aria-hidden="true"
        />

        {/* Glowing node sitting directly on the card perimeter */}
        <span
          className="tech-card-node pointer-events-none absolute -left-[1px] bottom-3.5 h-2 w-2 rounded-full"
          style={{
            background: '#ffffff',
            boxShadow: `0 0 8px 2px rgb(${a} / 0.95), 0 0 18px 6px rgb(${a} / 0.5)`
          }}
          aria-hidden="true"
        />
        <span
          className="tech-card-node pointer-events-none absolute right-7 top-0 h-1.5 w-1.5 rounded-full"
          style={{
            background: '#ffffff',
            boxShadow: `0 0 8px 2px rgb(${b} / 0.9)`
          }}
          aria-hidden="true"
        />

        {/* Raised Tech Icon Squircle */}
        <span
          className="tech-card-squircle relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] transition-transform duration-300 group-hover/card:scale-105 sm:h-11 sm:w-11"
          style={{
            background: `linear-gradient(150deg, rgb(${a} / 0.25) 0%, rgba(4, 12, 28, 0.92) 75%)`,
            border: `1px solid rgb(${a} / 0.45)`,
            boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 4px 12px -2px rgba(0, 0, 0, 0.8), 0 0 16px rgb(${a} / 0.28)`
          }}
        >
          <span
            className="tech-card-icon-img block h-6 w-6 sm:h-[26px] sm:w-[26px]"
            style={{
              filter: `drop-shadow(0 0 8px rgb(${a} / 0.7)) drop-shadow(0 2px 3px rgba(0, 0, 0, 0.6))`
            }}
          >
            <TechIcon name={item.icon} color={item.iconColor} />
          </span>
        </span>

        {/* Title & Subtitle */}
        <span className="relative flex min-w-0 flex-col pr-2 text-left" dir="ltr">
          <span
            className="tech-card-title text-[15px] sm:text-[16.5px] font-bold leading-tight tracking-tight whitespace-nowrap"
            style={{ textShadow: `0 0 16px rgb(${a} / 0.4)` }}
          >
            {item.name}
          </span>
          <span
            className="tech-card-subtitle mt-0.5 whitespace-nowrap text-[11px] sm:text-[11.5px] font-semibold leading-tight tracking-wide"
            dir={isAr ? "rtl" : "ltr"}
            style={{ color: `rgb(${a} / 0.95)`, textAlign: isAr ? 'right' : 'left' }}
          >
            {isAr ? item.subtitleAr : item.subtitleEn}
          </span>
        </span>

        {/* Sleek Chevron Arrow Button */}
        <span
          className="tech-card-chevron-bg absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full transition-transform duration-200 group-hover/card:translate-x-0.5 sm:h-7 sm:w-7"
          style={{
            border: `1px solid rgb(${a} / 0.45)`,
            boxShadow: `0 0 10px rgb(${a} / 0.35)`
          }}
          aria-hidden="true"
        >
          <ChevronRight
            className="tech-card-chevron-icon h-3.5 w-3.5"
            strokeWidth={2.5}
            style={{
              color: `rgb(${a})`,
              filter: `drop-shadow(0 0 5px rgb(${a} / 0.9))`
            }}
          />
        </span>
      </span>
    </Link>
  );
}


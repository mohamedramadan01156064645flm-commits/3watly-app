'use client';

import React from 'react';
import { BriefcaseIcon, FlameIcon, MapPinIcon, TrendingUpIcon } from 'lucide-react';
import { CardWaves } from './CardWaves';
import { RoleItem } from '@/data/rolesData';

interface TargetRoleCardProps {
  role: RoleItem;
  isActive: boolean;
  width: number;
  height: number;
  onSelect: () => void;
}

export function TargetRoleCard({ role, isActive, width, height, onSelect }: TargetRoleCardProps) {
  const t = role.theme;
  const Icon = role.icon;

  const tile = isActive ? 52 : 42;
  const glyph = isActive ? 26 : 20;
  const pad = isActive ? 14 : 10;

  return (
    <div
      dir="rtl"
      aria-current={isActive ? 'true' : undefined}
      className="relative select-none cursor-pointer group"
      onClick={onSelect}
      style={{
        width,
        height,
        transition: 'all 380ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {/* Detached outer glow ring for active card */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-1 rounded-[22px] border transition-all duration-300"
        style={{
          borderColor: t.borderActive,
          opacity: isActive ? 0.9 : 0,
          boxShadow: `0 0 24px ${t.glow}, inset 0 0 16px ${t.glow}`,
        }}
      />

      {/* Main card boundary with crisp border */}
      <div
        className="relative h-full w-full rounded-[20px] p-[1.5px] transition-all duration-300"
        style={{
          background: isActive
            ? `linear-gradient(145deg, ${t.borderActive} 0%, ${t.borderActive}99 40%, ${t.borderIdle}66 100%)`
            : `linear-gradient(145deg, ${t.borderActive}70 0%, ${t.borderIdle}80 40%, rgba(255,255,255,0.08) 100%)`,
          boxShadow: isActive
            ? `0 0 35px ${t.glow}, 0 20px 40px rgba(0,0,0,0.8)`
            : `0 10px 25px rgba(0,0,0,0.6)`,
        }}
      >
        <div
          className="relative h-full w-full overflow-hidden rounded-[19px] flex flex-col justify-between"
          style={{
            backgroundImage: `radial-gradient(120% 80% at 15% -10%, ${t.surfaceTop} 0%, rgba(0,0,0,0) 65%), linear-gradient(165deg, ${t.surfaceTop}70 0%, ${t.surfaceBottom} 60%, #030611 100%)`,
            backgroundColor: t.surfaceBottom,
            padding: pad,
          }}
        >
          <CardWaves color={t.accent} strong={isActive} uid={role.id} />

          {/* Top light bloom */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-6 -top-8 h-36 w-36 rounded-full transition-opacity duration-300"
            style={{
              background: `radial-gradient(closest-side, ${t.bloom}, rgba(0,0,0,0))`,
              opacity: isActive ? 1 : 0.45,
            }}
          />

          {/* Top gloss line */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[1px]"
            style={{
              backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
            }}
          />

          {/* Header Row: Icon + Most Wanted Badge */}
          <div dir="ltr" className="relative z-10 flex items-start justify-between gap-1.5 shrink-0">
            <div
              className="relative grid place-items-center overflow-hidden transition-all duration-300 rounded-[14px]"
              style={{
                width: tile,
                height: tile,
                backgroundImage: `linear-gradient(155deg, ${t.iconFrom} 0%, ${t.iconTo} 100%)`,
                boxShadow: `0 8px 20px ${t.glow}, inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -8px 12px rgba(0,0,0,0.25)`,
              }}
            >
              <Icon
                aria-hidden
                style={{ width: glyph, height: glyph }}
                strokeWidth={1.9}
                className="relative text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.4)]"
              />
            </div>

            {role.hot && (
              <div
                dir="rtl"
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-bold text-white shadow-md"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #1668C9 0%, #2E90F2 100%)',
                  boxShadow: '0 6px 14px rgba(29,111,209,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
                }}
              >
                <FlameIcon className="h-3 w-3 text-[#FF8A3D]" fill="currentColor" strokeWidth={1.2} />
                <span>الأكثر طلباً</span>
              </div>
            )}
          </div>

          {/* Body Content */}
          <div className="relative z-10 my-auto text-center space-y-1">
            <h3
              className="font-extrabold text-white leading-tight transition-all duration-300 line-clamp-2"
              style={{ fontSize: isActive ? 15 : 13 }}
            >
              {role.title}
            </h3>

            {role.subtitle && (
              <p
                dir="ltr"
                className="font-semibold text-white/85 text-[11px] leading-tight truncate"
              >
                {role.subtitle}
              </p>
            )}

            <p
              className="text-slate-300/85 leading-snug line-clamp-2 px-1"
              style={{ fontSize: isActive ? 11 : 10 }}
            >
              {role.description}
            </p>
          </div>

          {/* Bottom stats bar */}
          <div
            dir="ltr"
            className="relative z-10 flex items-center justify-between rounded-[10px] border border-white/10 px-2 py-1.5 shrink-0"
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex items-center gap-1">
              <TrendingUpIcon className="h-3 w-3 text-[#34D399]" strokeWidth={2.2} />
              <span className="text-[10.5px] font-bold text-[#34D399] leading-none">{role.growth}</span>
            </div>

            <div className="flex items-center gap-1">
              <BriefcaseIcon className="h-3 w-3" style={{ color: t.accent }} strokeWidth={2} />
              <span className="text-[10px] font-bold text-slate-200 leading-none truncate max-w-[54px]">
                {role.jobs} وظيفة
              </span>
            </div>

            <div className="flex items-center gap-1">
              <MapPinIcon className="h-3 w-3" style={{ color: t.accent }} strokeWidth={2} />
              <span className="text-[10px] font-bold text-slate-200 leading-none truncate max-w-[42px]">
                {role.location.split('/')[0].trim()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

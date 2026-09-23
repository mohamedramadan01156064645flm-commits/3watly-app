'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, SparklesIcon, TargetIcon, XIcon } from 'lucide-react';
import { useSkillPlan } from '@/contexts/SkillPlanContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { TARGET_ROLES } from '@/data/rolesData';
import { TargetRoleCard } from './TargetRoleCard';
import { TargetRoleDetailPanel } from './TargetRoleDetailPanel';
import { CarouselDots } from './CarouselDots';

// ─── Card dimensions ──────────────────────────────────────────────────────────
// Active card: 200×230, idle cards: 162×195, gap 14
// Carousel track height = 230 + 28 (breathing) = 258
const A_W = 200; const A_H = 230;
const I_W = 162; const I_H = 195;
const GAP = 14;
const TRACK_H = A_H + 28;

const SPAN = 3;

const DEPTH = [
  { rotate: 0,  z: 0,    scale: 1,     opacity: 1    },
  { rotate: 9,  z: -55,  scale: 0.97,  opacity: 0.88 },
  { rotate: 13, z: -115, scale: 0.93,  opacity: 0.6  },
  { rotate: 16, z: -170, scale: 0.88,  opacity: 0    },
];

function mod(v: number, n: number) { return ((v % n) + n) % n; }

function slotX(offset: number) {
  if (offset === 0) return 0;
  const steps = Math.abs(offset);
  const dist = A_W / 2 + GAP + I_W / 2 + (steps - 1) * (I_W + GAP);
  return Math.sign(offset) * dist;
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function TargetRoleModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { roleId, setRoleId } = useSkillPlan();
  const { isAr } = useLanguage();
  const touchX = useRef<number | null>(null);
  const [pos, setPos] = useState(0);

  useEffect(() => {
    if (open) {
      const i = TARGET_ROLES.findIndex(r => r.id === roleId);
      setPos(i >= 0 ? i : 0);
    }
  }, [open, roleId]);

  const labels     = useMemo(() => TARGET_ROLES.map(r => isAr ? r.title : r.titleEn), [isAr]);
  const activeIdx  = mod(pos, TARGET_ROLES.length);
  const activeRole = TARGET_ROLES[activeIdx];

  const step = useCallback((d: number) => setPos(p => p + d), []);
  const goTo = useCallback((idx: number) => {
    setPos(p => {
      const half = TARGET_ROLES.length / 2;
      let delta = idx - mod(p, TARGET_ROLES.length);
      if (delta > half) delta -= TARGET_ROLES.length;
      if (delta < -half) delta += TARGET_ROLES.length;
      return p + delta;
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') { e.preventDefault(); step(isAr ? -1 : 1); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); step(isAr ? 1 : -1); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, isAr, step, onClose]);

  const slots = useMemo(() => {
    const out: { key: number; offset: number; roleIndex: number }[] = [];
    for (let o = -SPAN; o <= SPAN; o++)
      out.push({ key: pos + o, offset: o, roleIndex: mod(pos + o, TARGET_ROLES.length) });
    return out;
  }, [pos]);

  const confirm = () => { setRoleId(activeRole.id); onClose(); };

  if (!open) return null;

  return (
    <>
      {/* ── Backdrop ───────────────────────────────────── */}
      <div
        className="fixed inset-0 z-40 bg-black/72 backdrop-blur-md"
        onClick={onClose}
        aria-hidden
        style={{ animation: 'trm-fade .16s ease' }}
      />

      {/* ── Dialog box ────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        dir={isAr ? 'rtl' : 'ltr'}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 pointer-events-none"
      >
        <div
          className="pointer-events-auto relative flex flex-col overflow-hidden rounded-[22px] w-full"
          style={{
            maxWidth: 720,
            // No overflow: height = header(~108px) + carousel(TRACK_H) + dots(32) + detail(~200px) + gaps(~40) ≈ 638px
            background: 'linear-gradient(160deg, #08091e 0%, #04060f 55%, #060c18 100%)',
            boxShadow: '0 28px 70px rgba(0,0,0,0.92), 0 0 0 1px rgba(255,255,255,0.09), 0 0 60px rgba(88,28,180,0.18)',
            animation: 'trm-up .22s cubic-bezier(.22,1,.36,1)',
          }}
        >
          {/* Ambient blobs (contained inside modal) */}
          <div aria-hidden className="pointer-events-none absolute -left-20 -top-20 h-52 w-60 rounded-full"
            style={{ background: 'radial-gradient(closest-side,rgba(88,28,180,.42),transparent)' }} />
          <div aria-hidden className="pointer-events-none absolute right-0 -top-10 h-36 w-48 rounded-full"
            style={{ background: 'radial-gradient(closest-side,rgba(38,64,190,.28),transparent)' }} />
          <div aria-hidden className="pointer-events-none absolute right-4 top-4 h-10 w-18 opacity-25"
            style={{ backgroundImage: 'radial-gradient(rgba(150,132,255,.6) 1.1px,transparent 1.1px)', backgroundSize: '9px 9px' }} />

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label={isAr ? "إغلاق" : "Close"}
            className="absolute top-3 ltr:right-3 rtl:left-3 z-20 grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.07] text-slate-300 outline-none transition-colors hover:bg-white/[0.14] hover:text-white cursor-pointer"
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,.5)' }}
          >
            <XIcon className="h-4 w-4" strokeWidth={2.5} />
          </button>

          {/* ── Header ─────────────────────────────────── */}
          <div className="relative shrink-0 px-6 pt-5 pb-3 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <span
                className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-[12px]"
                style={{
                  backgroundImage: 'linear-gradient(145deg,#A78BFA 0%,#6D28D9 48%,#2563EB 100%)',
                  boxShadow: '0 8px 20px rgba(109,40,217,.55),inset 0 2px 0 rgba(255,255,255,.28)',
                }}
              >
                <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
                  style={{ backgroundImage: 'linear-gradient(180deg,rgba(255,255,255,.26),transparent)' }} />
                <TargetIcon aria-hidden className="relative h-5 w-5 text-white" strokeWidth={2} />
              </span>

              <h2 className="text-[18px] font-extrabold text-white sm:text-[21px]">
                {isAr ? 'المسمى الوظيفي ' : 'Target '}
                <span className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(90deg,#C084FC 0%,#F472B6 100%)' }}>
                  {isAr ? 'المستهدف' : 'Career Role'}
                </span>
              </h2>

              <SparklesIcon aria-hidden className="h-4 w-4 text-[#93C5FD]"
                strokeWidth={2} fill="currentColor" fillOpacity={.25} />
            </div>

            <p className="mt-1.5 text-[12px] text-slate-400">
              {isAr
                ? 'يتم إعادة حساب مهاراتك والوظائف المطابقة لك بناءً على المسمى الذي تختاره.'
                : 'Your skills and matched roadmap are automatically recalculated based on your selected role.'}
            </p>

            <div className="mt-3 h-px"
              style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent)' }} />
          </div>

          {/* ── Carousel ──────────────────────────────── */}
          <div
            className="relative shrink-0 px-10 sm:px-12"
            role="group"
            aria-roledescription="carousel"
          >
            {/* Arrows */}
            <button type="button" onClick={() => step(-1)} aria-label={isAr ? "السابق" : "Previous"}
              className="absolute left-1 top-1/2 z-[60] -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full border border-white/12 bg-white/[0.07] text-slate-300 outline-none transition-colors hover:bg-white/[0.14] hover:text-white active:scale-95 cursor-pointer"
              style={{ boxShadow: '0 6px 18px rgba(0,0,0,.55)' }}>
              <ChevronLeftIcon className="h-4 w-4" strokeWidth={2.3} />
            </button>
            <button type="button" onClick={() => step(1)} aria-label={isAr ? "التالي" : "Next"}
              className="absolute right-1 top-1/2 z-[60] -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full border border-white/12 bg-white/[0.07] text-slate-300 outline-none transition-colors hover:bg-white/[0.14] hover:text-white active:scale-95 cursor-pointer"
              style={{ boxShadow: '0 6px 18px rgba(0,0,0,.55)' }}>
              <ChevronRightIcon className="h-4 w-4" strokeWidth={2.3} />
            </button>

            {/* 3D track */}
            <div
              className="relative overflow-hidden"
              style={{ height: TRACK_H, perspective: '1200px', perspectiveOrigin: '50% 50%' }}
              onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
              onTouchEnd={e => {
                if (touchX.current === null) return;
                const d = e.changedTouches[0].clientX - touchX.current;
                if (Math.abs(d) > 40) step(d < 0 ? 1 : -1);
                touchX.current = null;
              }}
            >
              {slots.map(({ key, offset, roleIndex }) => {
                const dist = Math.min(Math.abs(offset), DEPTH.length - 1);
                const dep  = DEPTH[dist];
                const dir  = Math.sign(offset);
                const isAct = offset === 0;
                const role  = TARGET_ROLES[roleIndex];
                return (
                  <div
                    key={key}
                    className="absolute left-1/2 top-1/2"
                    style={{
                      transformOrigin: 'center center',
                      transform: `translate(-50%,-50%) translateX(${slotX(offset)}px) translateZ(${dep.z}px) rotateY(${-dir * dep.rotate}deg) scale(${dep.scale})`,
                      opacity: dep.opacity,
                      pointerEvents: dep.opacity === 0 ? 'none' : 'auto',
                      zIndex: 40 - dist,
                      willChange: 'transform,opacity',
                      transition: 'transform 420ms cubic-bezier(.22,1,.36,1),opacity 420ms cubic-bezier(.22,1,.36,1)',
                    }}
                  >
                    <TargetRoleCard
                      role={role}
                      isActive={isAct}
                      width={isAct ? A_W : I_W}
                      height={isAct ? A_H : I_H}
                      onSelect={() => step(offset)}
                    />
                  </div>
                );
              })}

              {/* Edge fade masks */}
              <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-[45] w-10"
                style={{ backgroundImage: 'linear-gradient(90deg,#04060f,transparent)' }} />
              <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-[45] w-10"
                style={{ backgroundImage: 'linear-gradient(270deg,#04060f,transparent)' }} />
            </div>
          </div>

          {/* ── Dots ──────────────────────────────────── */}
          <CarouselDots
            labels={labels}
            activeIndex={activeIdx}
            onSelect={goTo}
            className="mt-2 justify-center shrink-0"
            size="sm"
          />

          {/* ── Detail panel ──────────────────────────── */}
          <div className="shrink-0 px-4 sm:px-5 pb-5 pt-3">
            <TargetRoleDetailPanel
              role={activeRole}
              labels={labels}
              activeIndex={activeIdx}
              onSelect={goTo}
              onConfirm={confirm}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes trm-fade { from{opacity:0} to{opacity:1} }
        @keyframes trm-up   { from{opacity:0;transform:translateY(16px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
      `}</style>
    </>
  );
}

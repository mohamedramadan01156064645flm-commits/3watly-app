"use client";

import React from 'react';

export function HeroBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
      aria-hidden="true"
    >
      <style>{`
        .hero-bg-layer {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 350ms cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          user-select: none;
        }

        /* 1. Arabic Dark: active when html is RTL and Dark */
        html[dir="rtl"].dark .hero-ar-dark,
        html:not([dir="ltr"]).dark .hero-ar-dark {
          opacity: 1;
        }

        /* 2. Arabic Light: active when html is RTL and Light */
        html[dir="rtl"]:not(.dark) .hero-ar-light,
        html:not([dir="ltr"]):not(.dark) .hero-ar-light {
          opacity: 1;
        }

        /* 3. English Dark: active when html is LTR and Dark */
        html[dir="ltr"].dark .hero-en-dark {
          opacity: 1;
        }

        /* 4. English Light: active when html is LTR and Light */
        html[dir="ltr"]:not(.dark) .hero-en-light {
          opacity: 1;
        }
      `}</style>

      {/* 1. Arabic Dark Mode (hero-ar-dark: laptop on left, open sky on right) */}
      <picture className="hero-bg-layer hero-ar-dark">
        <source
          type="image/webp"
          srcSet="/images/hero-ar-dark.webp 1x, /images/hero-ar-dark-2x.webp 2x"
        />
        <img
          src="/images/hero-ar-dark.png"
          alt="Hero Background Arabic Dark"
          className="h-full w-full object-cover object-[center_top] pointer-events-none select-none"
          fetchPriority="high"
          decoding="async"
        />
      </picture>

      {/* 2. Arabic Light Mode (hero-ar-light: laptop on left, open sky on right) */}
      <picture className="hero-bg-layer hero-ar-light">
        <source
          type="image/webp"
          srcSet="/images/hero-ar-light.webp 1x, /images/hero-ar-light-2x.webp 2x"
        />
        <img
          src="/images/hero-ar-light.png"
          alt="Hero Background Arabic Light"
          className="h-full w-full object-cover object-[center_top] pointer-events-none select-none"
          loading="lazy"
          fetchPriority="low"
          decoding="async"
        />
      </picture>

      {/* 3. English Dark Mode (hero-en-dark: laptop on right, open sky on left) */}
      <picture className="hero-bg-layer hero-en-dark">
        <source
          type="image/webp"
          srcSet="/images/hero-en-dark.webp 1x, /images/hero-en-dark-2x.webp 2x"
        />
        <img
          src="/images/hero-en-dark.png"
          alt="Hero Background English Dark"
          className="h-full w-full object-cover object-[center_top] pointer-events-none select-none"
          loading="lazy"
          fetchPriority="low"
          decoding="async"
        />
      </picture>

      {/* 4. English Light Mode (hero-en-light: laptop on right, open sky on left) */}
      <picture className="hero-bg-layer hero-en-light">
        <source
          type="image/webp"
          srcSet="/images/hero-en-light.webp 1x, /images/hero-en-light-2x.webp 2x"
        />
        <img
          src="/images/hero-en-light.png"
          alt="Hero Background English Light"
          className="h-full w-full object-cover object-[center_top] pointer-events-none select-none"
          loading="lazy"
          fetchPriority="low"
          decoding="async"
        />
      </picture>

      {/* 5. Seamless Bottom Gradient Blend: dissolves 3D hero artwork smoothly into the page canvas */}
      <div 
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 sm:h-64 lg:h-84 z-10 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#040816] dark:via-[#040816]/80 dark:to-transparent" 
        aria-hidden="true"
      />
    </div>
  );
}

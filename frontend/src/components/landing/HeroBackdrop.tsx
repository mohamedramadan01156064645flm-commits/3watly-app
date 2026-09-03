"use client";

import React from 'react';

export function HeroBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Light Mode Exact Background */}
      <img
        src="/images/hero-light-bg.png"
        alt="Hero Background Light"
        className="absolute inset-0 h-full w-full object-cover object-center dark:hidden pointer-events-none select-none"
      />
      {/* Light Mode Smooth Bottom Blend */}
      <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-white via-white/80 to-transparent dark:hidden pointer-events-none" />

      {/* Dark Mode Exact Background */}
      <img
        src="/images/hero-dark-bg.png"
        alt="Hero Background Dark"
        className="absolute inset-0 h-full w-full object-cover object-center hidden dark:block pointer-events-none select-none"
      />
      {/* Dark Mode Smooth Bottom Blend (Seamless into #060913) */}
      <div className="absolute bottom-0 left-0 right-0 h-52 bg-gradient-to-t from-[#060913] via-[#060913]/85 to-transparent hidden dark:block pointer-events-none" />
    </div>
  );
}

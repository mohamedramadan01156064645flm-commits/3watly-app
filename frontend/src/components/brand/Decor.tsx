import React from 'react';

/** Clean, modern atmospheric background glows for light & dark modes. */
export function Decor() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Light mode: soft sky glow. Dark mode: subtle deep indigo ambient hue */}
      <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-blue-100/40 dark:bg-indigo-900/15 blur-[120px] transition-colors duration-500" />
      <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-indigo-100/40 dark:bg-blue-950/20 blur-[130px] transition-colors duration-500" />

      {/* Ultra-subtle concentric radar waves */}
      <svg
        className="absolute -bottom-32 -right-32 h-[520px] w-[520px] text-indigo-200/30 dark:text-white/[0.02] transition-colors duration-300"
        viewBox="0 0 400 400"
        fill="none"
      >
        <circle cx="200" cy="200" r="90" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="200" cy="200" r="145" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="200" cy="200" r="200" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </div>
  );
}
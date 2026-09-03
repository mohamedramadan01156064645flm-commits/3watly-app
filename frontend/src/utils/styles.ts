/** Shared surface recipes so every onboarding panel uses the same material. */
export const surface =
'rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0D1527] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_28px_-24px_rgba(27,45,105,0.28)] dark:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.6),0_0_0_1px_rgba(99,102,241,0.04)] transition-colors duration-200';

export const surfaceInteractive =
`${surface} hover:border-slate-300 dark:hover:border-white/20 hover:shadow-[0_2px_4px_rgba(16,24,40,0.04),0_18px_36px_-24px_rgba(27,45,105,0.38)] dark:hover:shadow-[0_18px_40px_-16px_rgba(0,0,0,0.7)] active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-blue/20 dark:focus-visible:ring-indigo-500/30`;

export const rowSurface =
'rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0D1527] transition-[border-color,background-color,transform] duration-150 ease-smooth';
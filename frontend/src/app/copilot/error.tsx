"use client";

import React, { useEffect } from 'react';
import { AlertTriangleIcon, RefreshCwIcon } from 'lucide-react';

export default function CopilotError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Copilot error caught by boundary:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-200 dark:border-amber-800/40 shadow-xs mb-4">
        <AlertTriangleIcon className="h-7 w-7" />
      </div>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
        تعذر الاتصال بـ Copilot مؤقتاً
      </h2>
      <p className="mt-1.5 max-w-md text-sm text-slate-500 dark:text-slate-400">
        حدث خطأ أثناء تحميل واجهة المحادثة الذكية. يمكنك إعادة المحاولة.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all cursor-pointer"
      >
        <RefreshCwIcon className="h-4 w-4" />
        <span>إعادة المحاولة</span>
      </button>
    </div>
  );
}

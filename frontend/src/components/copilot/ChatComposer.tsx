"use client";

import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { PaperclipIcon, SendHorizonalIcon, ChevronDownIcon, XIcon, Loader2Icon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const arabicPrimarySuggestions = [
  "كيف أطور مهاراتي كـ Data Analyst في مصر؟",
  "ما هي أكثر المهارات المطلوبة في سوق العمل حالياً؟",
  "راجع سيرتي الذاتية وقدم لي نصائح تحسين لـ ATS",
  "ما هو متوسط رواتب المطورين في القاهرة؟"
];

const arabicMoreSuggestions = [
  "كيف أستعد لمقابلة عمل تقنية في شركة مصرية؟",
  "ما هي الشهادات الأكثر طلباً في مجال البيانات؟",
  "ابنِ لي خطة مهارات للأشهر الثلاثة القادمة",
  "هل مهارة Python كافية للتقديم على وظائف Junior؟"
];

const englishPrimarySuggestions = [
  "How to grow as a Data Analyst in Egypt?",
  "What are the top demanded tech skills right now?",
  "Review my CV and suggest ATS improvements",
  "What is the average developer salary in Cairo?"
];

const englishMoreSuggestions = [
  "How to prepare for a technical interview in Egypt?",
  "Which certifications are most valued for data roles?",
  "Build me a 3-month skill learning roadmap",
  "Is Python enough to apply for junior roles?"
];

type ChatComposerProps = {
  onSend: (text: string, attachment?: string) => void;
  isThinking: boolean;
};

export function ChatComposer({ onSend, isThinking }: ChatComposerProps) {
  const { isAr } = useLanguage();
  const [value, setValue] = useState('');
  const [attachment, setAttachment] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const primarySuggestions = isAr ? arabicPrimarySuggestions : englishPrimarySuggestions;
  const moreSuggestions = isAr ? arabicMoreSuggestions : englishMoreSuggestions;

  const submit = (text: string) => {
    if (isThinking) return;
    const trimmed = text.trim();
    if (!trimmed && !attachment) return;
    onSend(trimmed || (isAr ? `راجع سيرتي الذاتية: ${attachment}` : `Review my CV: ${attachment}`), attachment ?? undefined);
    setValue('');
    setAttachment(null);
    setShowMore(false);
  };

  const canSend = (value.trim().length > 0 || !!attachment) && !isThinking;

  return (
    <div className="rounded-[16px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] p-4 shadow-sm">
      {attachment && (
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2">
          <PaperclipIcon className="h-[14px] w-[14px] text-blue-600 dark:text-blue-400" strokeWidth={2} />
          <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold text-slate-800 dark:text-slate-200">
            {attachment}
          </span>
          <button
            type="button"
            onClick={() => setAttachment(null)}
            aria-label="Remove attachment"
            className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 transition-colors"
          >
            <XIcon className="h-3.5 w-3.5" strokeWidth={2.4} />
          </button>
        </div>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit(value);
        }}
        className="flex items-center gap-3"
      >
        <label className="min-w-0 flex-1">
          <span className="sr-only">Ask anything about your career</span>
          <input
            type="text"
            value={value}
            disabled={isThinking}
            onChange={(event) => setValue(event.target.value)}
            placeholder={
              isAr
                ? "اسأل المساعد الذكي أي شيء عن مسارك المهني وسوق العمل..."
                : "Ask anything about your career, skills, or Egyptian job market..."
            }
            className="h-[40px] w-full bg-transparent px-2 text-[14.5px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none disabled:opacity-60"
          />
        </label>

        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              setAttachment(file.name);
              toast.success(isAr ? 'تم إرفاق الملف بنجاح' : 'File attached', {
                description: file.name,
              });
            }
            event.target.value = '';
          }}
        />

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          aria-label="Attach a file"
          disabled={isThinking}
          title={isAr ? "إرفاق سيرة ذاتية أو ملف" : "Attach CV or document"}
          className="flex h-[40px] w-[40px] items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-40"
        >
          <PaperclipIcon className="h-[17px] w-[17px]" strokeWidth={1.9} />
        </button>

        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send message"
          className="flex h-[40px] w-[40px] items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md shadow-blue-600/25 disabled:opacity-40 disabled:hover:bg-blue-600 cursor-pointer disabled:cursor-not-allowed"
        >
          {isThinking ? (
            <Loader2Icon className="h-[18px] w-[18px] animate-spin" strokeWidth={2} />
          ) : (
            <SendHorizonalIcon className="h-[18px] w-[18px] rtl:rotate-180" strokeWidth={2} />
          )}
        </button>
      </form>

      <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
        {primarySuggestions.map((s) => (
          <SuggestionChip
            key={s}
            label={s}
            onClick={() => submit(s)}
            disabled={isThinking}
          />
        ))}
        {showMore &&
          moreSuggestions.map((s) => (
            <SuggestionChip
              key={s}
              label={s}
              onClick={() => submit(s)}
              disabled={isThinking}
            />
          ))}
        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          aria-expanded={showMore}
          className="flex h-[32px] items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/60 px-3.5 text-[12px] font-semibold text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
        >
          <span>{showMore ? (isAr ? 'اقتراحات أقل' : 'Fewer suggestions') : (isAr ? 'المزيد من الاقتراحات' : 'More suggestions')}</span>
          <ChevronDownIcon
            className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-150 ${
              showMore ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>
    </div>
  );
}

function SuggestionChip({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="h-[32px] rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/80 px-3.5 text-[12px] font-medium text-slate-700 dark:text-slate-200 transition-all hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed truncate max-w-[280px]"
    >
      {label}
    </button>
  );
}
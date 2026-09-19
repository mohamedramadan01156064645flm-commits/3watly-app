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
  onSend: (text: string, attachment?: string, attachmentData?: any) => void;
  isThinking: boolean;
};

export function ChatComposer({ onSend, isThinking }: ChatComposerProps) {
  const { isAr } = useLanguage();
  const [value, setValue] = useState('');
  const [attachment, setAttachment] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<any | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const primarySuggestions = isAr ? arabicPrimarySuggestions : englishPrimarySuggestions;
  const moreSuggestions = isAr ? arabicMoreSuggestions : englishMoreSuggestions;

  const submit = (text: string) => {
    if (isThinking || isParsing) return;
    const trimmed = text.trim();
    if (!trimmed && !attachment) return;
    const defaultPrompt = isAr 
      ? `يرجى مراجعة وتحليل سيرتي الذاتية المرفقة (${attachment}) بالتفصيل وتقديم تقييم للـ ATS ونقاط القوة والضعف والمهارات المطلوبة.`
      : `Please thoroughly review and analyze my attached resume (${attachment}), evaluating ATS readiness, key strengths, gaps, and market fit.`;
    
    onSend(trimmed || defaultPrompt, attachment ?? undefined, parsedData ?? undefined);
    setValue('');
    setAttachment(null);
    setParsedData(null);
    setShowMore(false);
  };

  const canSend = (value.trim().length > 0 || !!attachment) && !isThinking && !isParsing;

  return (
    <div className="rounded-[16px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] p-4 shadow-sm">
      {attachment && (
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-blue-200/70 dark:border-blue-500/20 bg-blue-50/70 dark:bg-blue-950/40 px-3.5 py-2">
          {isParsing ? (
            <Loader2Icon className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400 shrink-0" />
          ) : (
            <PaperclipIcon className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" strokeWidth={2} />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-bold text-slate-900 dark:text-slate-100">
              {attachment}
            </p>
            <p className="text-[11px] text-blue-700 dark:text-blue-300 font-medium">
              {isParsing 
                ? (isAr ? 'جاري قراءة واستخراج بيانات السيرة الذاتية...' : 'Parsing and analyzing resume data...') 
                : (parsedData?.skills?.length
                    ? (isAr ? `✓ تم التحليل بنجاح (${parsedData.skills.length} مهارة، ${parsedData.projects?.length || 0} مشاريع)` : `✓ Parsed (${parsedData.skills.length} skills, ${parsedData.projects?.length || 0} projects)`)
                    : (isAr ? 'جاهز للمراجعة والتحليل' : 'Ready for review'))}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setAttachment(null);
              setParsedData(null);
              setIsParsing(false);
            }}
            aria-label="Remove attachment"
            className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
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
            disabled={isThinking || isParsing}
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
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;

            if (file.size > 8 * 1024 * 1024) {
              toast.error(isAr ? 'حجم الملف كبير جداً (الحد الأقصى 8 ميجابايت)' : 'File too large (Max 8MB)');
              event.target.value = '';
              return;
            }

            setAttachment(file.name);
            setIsParsing(true);

            try {
              const formData = new FormData();
              formData.append('file', file);
              const res = await fetch('/api/cv/parse', {
                method: 'POST',
                body: formData,
              });

              if (res.ok) {
                const json = await res.json();
                if (json.success && json.data) {
                  setParsedData(json.data);
                  try {
                    localStorage.setItem('3watly_parsed_cv', JSON.stringify(json.data));
                    window.dispatchEvent(new CustomEvent('3watly_active_cv_changed', { detail: json.data }));
                  } catch {}
                  toast.success(isAr ? 'تم استخراج بيانات السيرة الذاتية بنجاح ✓' : 'Resume parsed successfully ✓', {
                    description: isAr
                      ? `استخرجنا ${json.data.skills?.length || 0} مهارة و ${json.data.projects?.length || 0} مشاريع جاهزة للفحص.`
                      : `Found ${json.data.skills?.length || 0} skills and ${json.data.projects?.length || 0} projects.`,
                  });
                } else {
                  toast.info(isAr ? 'تم إرفاق الملف' : 'File attached');
                }
              } else {
                toast.info(isAr ? 'تم إرفاق الملف' : 'File attached');
              }
            } catch (err) {
              console.warn('Error parsing attached CV:', err);
              toast.info(isAr ? 'تم إرفاق الملف' : 'File attached');
            } finally {
              setIsParsing(false);
              event.target.value = '';
            }
          }}
        />

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          aria-label="Attach a file"
          disabled={isThinking || isParsing}
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
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { CheckIcon, FileTextIcon, Loader2Icon, UploadCloudIcon } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOnboarding } from '@/contexts/OnboardingContext';

interface ReuploadModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (fileName: string) => void;
}

const STEPS_EN = [
  'Uploading document',
  'Extracting text layers',
  'Running ATS checks'
];

const STEPS_AR = [
  'رفع المستند',
  'استخراج طبقات النصوص',
  'إجراء فحوصات الـ ATS'
];

export function ReuploadModal({
  open,
  onClose,
  onComplete
}: ReuploadModalProps) {
  const { isAr } = useLanguage();
  const { uploadFile } = useOnboarding();
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [step, setStep] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);

  const steps = isAr ? STEPS_AR : STEPS_EN;

  useEffect(() => {
    if (open) return;
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    setFile(null);
    setStep(-1);
    setDragging(false);
  }, [open]);

  const start = async (selected: File) => {
    setFile(selected);
    setStep(0);
    try {
      uploadFile({
        name: selected.name,
        sizeLabel: `${(selected.size / (1024 * 1024)).toFixed(1)} MB`,
        rawFile: selected,
        file: selected
      });
    } catch {}

    timers.current = [
      window.setTimeout(() => setStep(1), 600),
      window.setTimeout(() => setStep(2), 1200),
      window.setTimeout(() => {
        setStep(3);
        onComplete(selected.name);
      }, 1900)
    ];
  };

  const running = step >= 0 && step < 3;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isAr ? "إعادة رفع سيرتك الذاتية" : "Re-upload your CV"}
      description={
        isAr
          ? "سنقوم بإعادة فحص الهيكل، الاستخراج الآلي، ومطابقة الكلمات المفتاحية على الملف الجديد."
          : "We re-run every structure, parser and keyword check on the new file."
      }>
      
      {step < 0 ? (
        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              const dropped = event.dataTransfer.files?.[0];
              if (dropped) start(dropped);
            }}
            className={`flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors duration-150 ease-smooth cursor-pointer ${
              dragging
                ? 'border-brand-400 bg-brand-50'
                : 'border-slate-300 bg-slate-50 dark:bg-[#0B1120]/[0.04] hover:border-brand-300 hover:bg-brand-50/40'
            }`}>
            
            <UploadCloudIcon
              className="h-8 w-8 text-brand-600"
              aria-hidden="true" />
            
            <p className="mt-3 text-sm font-semibold text-slate-800">
              {isAr ? "اسحب سيرتك الذاتية هنا، أو اضغط للاختيار" : "Drop your CV here, or click to browse"}
            </p>
            <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
              {isAr ? "ملفات PDF أو DOCX حتى 5 ميجابايت" : "PDF or DOCX, up to 5 MB"}
            </p>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(event) => {
              const selected = event.target.files?.[0];
              if (selected) start(selected);
            }} />
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-[#0B1120]/[0.04] px-4 py-3">
            <FileTextIcon
              className="h-5 w-5 shrink-0 text-brand-600"
              aria-hidden="true" />
          
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {file?.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {running ? (isAr ? 'جاري التحليل…' : 'Analyzing…') : (isAr ? 'اكتمل التحليل' : 'Analysis complete')}
              </p>
            </div>
          </div>

          <ul className="mt-4 space-y-3" aria-live="polite">
            {steps.map((label, index) => {
              const done = step > index;
              const active = step === index;
              return (
                <li key={label} className="flex items-center gap-3 text-sm">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      done
                        ? 'bg-emerald-500 text-white'
                        : active
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-200 text-slate-500 dark:text-slate-400'
                    }`}>
                    
                    {done ? (
                      <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : active ? (
                      <Loader2Icon
                        className="h-3.5 w-3.5 animate-spin"
                        aria-hidden="true" />
                    ) : (
                      <span className="text-[11px] font-semibold">
                        {index + 1}
                      </span>
                    )}
                  </span>
                  <span
                    className={
                      done || active
                        ? 'font-medium text-slate-800'
                        : 'text-slate-400'
                    }>
                    {label}
                  </span>
                </li>);
            })}
          </ul>
        </div>
      )}
    </Modal>);
}

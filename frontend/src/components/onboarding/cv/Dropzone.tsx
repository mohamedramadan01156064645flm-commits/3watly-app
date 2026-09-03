"use client";

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleAlertIcon, CircleCheckIcon, LockIcon, XIcon } from 'lucide-react';
import { EASE, springPop } from '../../../utils/motion';
import type { ParseStatus, UploadedFile } from '../../../types/onboarding';
import { useLanguage } from '@/contexts/LanguageContext';

const CLOUD_IMAGE = "/f4a5ae02-bd4f-4232-99c9-5d8471d21aea.png";

const MAX_MB = 10;
const ALLOWED = ['pdf', 'docx'];

interface DropzoneProps {
  file: UploadedFile | null;
  status: ParseStatus;
  progress: number;
  onFile: (file: UploadedFile) => void;
  onRemove: () => void;
}

function extensionOf(name: string) {
  return name.split('.').pop()?.toLowerCase() ?? '';
}

export function Dropzone({ file, status, progress, onFile, onRemove }: DropzoneProps) {
  const { isAr } = useLanguage();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const parsing = status === 'uploading' || status === 'parsing';

  const handleFiles = (files: FileList | null) => {
    const next = files?.[0];
    if (!next) return;

    if (!ALLOWED.includes(extensionOf(next.name))) {
      setError(isAr ? "نوع الملف غير مدعوم. يرجى رفع ملف بصيغة PDF أو DOCX." : "That file type isn't supported. Upload a PDF or DOCX.");
      return;
    }

    const mb = next.size / (1024 * 1024);
    if (mb > MAX_MB) {
      setError(isAr ? `حجم الملف ${mb.toFixed(1)} ميجابايت. الحد الأقصى هو ${MAX_MB} ميجابايت.` : `That file is ${mb.toFixed(1)} MB. The limit is ${MAX_MB} MB.`);
      return;
    }

    setError(null);
    onFile({
      name: next.name,
      sizeLabel: `${Math.max(0.1, Number(mb.toFixed(1)))} MB`,
      file: next,
      rawFile: next
    });
  };

  const openPicker = () => inputRef.current?.click();

  return (
    <div className="flex h-full flex-col">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload your CV. PDF or DOCX, up to 10 megabytes."
        onClick={openPicker}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openPicker();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
        className={`flex flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-8 py-9 text-center transition-[border-color,background-color,box-shadow] duration-150 ease-smooth focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/25 dark:focus-visible:ring-indigo-500/30 ${
        error ?
        'border-[#E9A3A0] bg-[#FFFAFA] dark:border-red-500/40 dark:bg-red-950/20' :
        dragging ?
        'border-blue-600 bg-[#EEF4FE] dark:border-indigo-400 dark:bg-indigo-950/30 shadow-[inset_0_0_0_4px_rgba(27,87,224,0.06)]' :
        'border-[#C3D3F3] dark:border-slate-600/60 bg-[#FBFCFF] dark:bg-[#0B1120] hover:border-blue-600 dark:hover:border-indigo-400 hover:bg-[#F7FAFF] dark:hover:bg-[#111B30]'}`
        }>

        <motion.img
          src={CLOUD_IMAGE}
          alt=""
          aria-hidden="true"
          draggable={false}
          animate={dragging ? { y: -6, scale: 1.04 } : { y: 0, scale: 1 }}
          transition={{ duration: 0.2, ease: EASE }}
          className="h-[124px] w-[168px] select-none object-contain dark:brightness-110" />

        <h2 className="mt-3 text-[20px] font-bold tracking-tight text-[#0B132B] dark:text-white">
          {isAr ? "اسحب وأفلت سيرتك الذاتية (PDF/DOCX) هنا" : "Drop your CV (PDF/DOCX) here"}
        </h2>
        <span className="mt-1.5 text-[14.5px] font-bold text-blue-600 dark:text-blue-400">
          {isAr ? "أو اضغط لتصفح واختيار الملف من جهازك" : "or click to browse files"}
        </span>
        <p className="mt-2 text-[12.5px] font-normal text-slate-400 dark:text-slate-500">
          {isAr ? `الحد الأقصى للحجم: ${MAX_MB} ميجابايت • صيغ PDF أو DOCX فقط` : `Max file size: ${MAX_MB}MB • PDF or DOCX only`}
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,application/pdf"
          className="sr-only"
          onChange={(event) => {
            handleFiles(event.target.files);
            event.target.value = '';
          }} />

        <AnimatePresence initial={false}>
          {error &&
          <motion.p
            key="error"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            role="alert"
            className="mt-5 flex items-center gap-2 rounded-lg bg-[#FDECEA] dark:bg-red-950/40 px-3 py-2 text-[12.5px] font-medium text-[#B4231F] dark:text-red-400">
              <CircleAlertIcon className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
              {error}
            </motion.p>
          }
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {file &&
          <motion.div
            key="file"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={springPop}
            onClick={(event) => event.stopPropagation()}
            className="mt-6 w-full max-w-[340px] rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#131C31] px-3.5 py-3 text-left rtl:text-right shadow-sm">

              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FDECEA] dark:bg-red-950/40">
                  <span className="text-[9px] font-bold tracking-tight text-[#D93025] dark:text-red-400">
                    {extensionOf(file.name).toUpperCase().slice(0, 4) || 'DOC'}
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-semibold text-[#0B132B] dark:text-white">
                    {file.name}
                  </span>
                  <span className="block text-[11.5px] font-normal text-slate-400 dark:text-slate-500">
                    {file.sizeLabel} {parsing ? (isAr ? '• جاري التحليل...' : '• analyzing') : (isAr ? '• جاهز' : '• ready')}
                  </span>
                </span>
                {!parsing &&
              <CircleCheckIcon
                className="h-[19px] w-[19px] shrink-0 text-emerald-500"
                strokeWidth={2}
                aria-hidden="true" />
              }
                <button
                type="button"
                onClick={onRemove}
                aria-label={`Remove ${file.name}`}
                className="rounded-md p-1 text-slate-400 dark:text-slate-500 transition-colors duration-150 ease-smooth hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-600 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 cursor-pointer">
                  <XIcon className="h-4 w-4" strokeWidth={2.2} />
                </button>
              </div>

              {parsing &&
            <div className="mt-2.5 h-[5px] overflow-hidden rounded-full bg-[#E7EAF3] dark:bg-slate-700">
                  <motion.span
                className="block h-full rounded-full bg-blue-600"
                animate={{ width: `${Math.max(progress, 6)}%` }}
                transition={{ duration: 0.2, ease: 'linear' }} />
                </div>
            }
            </motion.div>
          }
        </AnimatePresence>
      </div>

      <p className="mt-3 flex shrink-0 items-center justify-center gap-2 text-[12px] font-normal text-slate-400 dark:text-slate-500">
        <LockIcon className="h-[13px] w-[13px]" strokeWidth={1.9} aria-hidden="true" />
        {isAr ? "بياناتك مشفرة ومحمية تماماً ولا نشاركها مع أي طرف ثالث." : "We never share your data with third parties."}
      </p>
    </div>);
}
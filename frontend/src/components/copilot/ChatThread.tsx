"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  CheckCheckIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  CopyIcon,
  CheckIcon,
  PaperclipIcon,
  SparklesIcon,
  ArrowUpRightIcon,
  CompassIcon,
  BriefcaseIcon,
  FileTextIcon,
  TargetIcon,
  BarChart3Icon,
  SettingsIcon,
  UploadIcon,
} from 'lucide-react';
import { ChatMessage, Feedback, ChatNavigationItem } from '../../contexts/ChatContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { inferNavigationButtons } from '@/lib/copilot/navigation';
import { RichText } from './RichText';
import { RoadmapCard } from './RoadmapCard';

type ChatThreadProps = {
  messages: ChatMessage[];
  onFeedback: (id: string, value: Feedback) => void;
  onSendMessage?: (text: string) => void;
};

export function ChatThread({ messages, onFeedback, onSendMessage }: ChatThreadProps) {
  return (
    <div className="space-y-6" aria-live="polite">
      {messages.map((message) => {
        if (message.role === 'user') {
          return <UserBubble key={message.id} message={message} />;
        }
        if (message.pending && !message.text) {
          return <ThinkingBubble key={message.id} />;
        }
        return (
          <AssistantCard
            key={message.id}
            message={message}
            onFeedback={onFeedback}
            onSendMessage={onSendMessage}
          />
        );
      })}
    </div>
  );
}

function UserBubble({ message }: { message: ChatMessage }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      className="flex justify-end"
    >
      <div className="max-w-[720px] rounded-[16px] rounded-tr-[4px] bg-blue-600 px-5 py-3.5 text-white shadow-md">
        <p className="whitespace-pre-line text-[14px] leading-[1.6]">
          {message.text || message.content}
        </p>
        {message.attachment && (
          <p className="mt-2 flex items-center gap-1.5 rounded-[8px] bg-white/15 px-2.5 py-1.5 text-[12px] text-white/90">
            <PaperclipIcon className="h-[13px] w-[13px]" strokeWidth={2.2} />
            {message.attachment}
          </p>
        )}
        <p className="mt-1.5 flex items-center justify-end gap-1.5 text-[11px] text-white/75">
          {message.time}
          <CheckCheckIcon className="h-[14px] w-[14px]" strokeWidth={2.4} />
        </p>
      </div>
    </motion.div>
  );
}

function ThinkingBubble() {
  const { isAr } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      className="rounded-[16px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] p-5 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
          <SparklesIcon className="h-4 w-4 text-white" />
        </span>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[13.5px] font-bold text-slate-900 dark:text-white">3WATLY Copilot</span>
            <span className="flex items-center gap-1" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-blue-600"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: 'linear',
                  }}
                />
              ))}
            </span>
          </div>
          <span className="text-[12px] text-slate-500 dark:text-slate-400">
            {isAr
              ? 'يحلل بيانات ملفك المهني ومتطلبات سوق العمل المصري...'
              : 'Analyzing your career profile and Egyptian market signals...'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function AssistantCard({
  message,
  onFeedback,
  onSendMessage,
}: {
  message: ChatMessage;
  onFeedback: (id: string, value: Feedback) => void;
  onSendMessage?: (text: string) => void;
}) {
  const { isAr } = useLanguage();
  const textContent = message.text || message.content || '';
  const payload = message.payload;
  const navigation = message.navigation || [];
  const followUps = message.followUps || [];

  // Intelligently ensure navigation buttons are ALWAYS present on every assistant message
  const effectiveNavigation = (navigation && navigation.length > 0)
    ? navigation
    : inferNavigationButtons(textContent, isAr);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(textContent);
      toast.success('تم نسخ الرد إلى الحافظة / Copied to clipboard');
    } catch {
      toast.error('Could not access clipboard');
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
      className="rounded-[16px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] p-5 shadow-sm"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
          <SparklesIcon className="h-4 w-4 text-white" />
        </span>
        <span className="text-[13.5px] font-bold text-slate-900 dark:text-white">3WATLY Copilot</span>
        <span className="text-[11.5px] text-slate-400">{message.time}</span>
      </div>

      <div className="mt-3.5 ltr:pl-[42px] rtl:pr-[42px] space-y-4">
        {/* Render Live Streaming Markdown Text */}
        {textContent && (
          <div className="text-[14px] leading-[1.7] text-slate-800 dark:text-slate-200">
            <EnhancedMarkdown text={textContent} />
          </div>
        )}

        {/* Render Structured Payload if present */}
        {payload && (
          <div>
            <p className="text-[13.5px] leading-[1.6] text-slate-700 dark:text-slate-300">
              {payload.intro}
            </p>

            <ol className="mt-2.5 space-y-2 pl-5 text-[13.5px] leading-[1.6] text-slate-700 dark:text-slate-300">
              {payload.points.map((point, i) => (
                <li key={i} className="list-decimal">
                  <RichText text={point.text} />
                </li>
              ))}
            </ol>

            {payload.outro && (
              <p className="mt-3 text-[13.5px] leading-[1.6] text-slate-700 dark:text-slate-300">
                {payload.outro}
              </p>
            )}

            {payload.showRoadmap && (
              <div className="mt-4">
                <RoadmapCard />
              </div>
            )}
          </div>
        )}

        {/* Navigation Action Buttons - Guaranteed on every message */}
        {effectiveNavigation.length > 0 && (
          <div className="pt-2">
            <div className="flex flex-wrap items-center gap-2.5">
              {effectiveNavigation.map((nav, idx) => (
                <NavigationButton key={idx} item={nav} />
              ))}
            </div>
          </div>
        )}

        {/* Suggested Follow-up Questions */}
        {followUps.length > 0 && onSendMessage && (
          <div className="pt-2">
            <p className="text-[11.5px] font-semibold text-slate-400 mb-1.5">
              أسئلة مقترحة للمتابعة:
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {followUps.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSendMessage(q)}
                  className="rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 text-[12px] font-medium text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Controls: Feedback & Copy */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
          <IconButton
            label="Helpful"
            active={message.feedback === 'up'}
            activeClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
            onClick={() => {
              onFeedback(message.id, message.feedback === 'up' ? null : 'up');
              if (message.feedback !== 'up') toast.success('شكراً لتقييمك الإيجابي ✓');
            }}
          >
            <ThumbsUpIcon className="h-[15px] w-[15px]" strokeWidth={1.9} />
          </IconButton>

          <IconButton
            label="Not helpful"
            active={message.feedback === 'down'}
            activeClass="bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
            onClick={() => {
              onFeedback(message.id, message.feedback === 'down' ? null : 'down');
              if (message.feedback !== 'down') toast.info('شكراً، سنعمل على تحسين جودة الإجابات');
            }}
          >
            <ThumbsDownIcon className="h-[15px] w-[15px]" strokeWidth={1.9} />
          </IconButton>

          <IconButton label="Copy answer" onClick={copy}>
            <CopyIcon className="h-[15px] w-[15px]" strokeWidth={1.9} />
          </IconButton>

          <span className="text-[11.5px] text-slate-400">
            {message.feedback ? 'تم حفظ التقييم' : 'هل كانت هذه الإجابة مفيدة؟'}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

function NavigationButton({ item }: { item: ChatNavigationItem }) {
  const router = useRouter();

  const getIcon = () => {
    switch (item.path) {
      case '/jobs':
        return <BriefcaseIcon className="h-4 w-4" />;
      case '/skill-plan':
        return <TargetIcon className="h-4 w-4" />;
      case '/cv-builder':
        return <FileTextIcon className="h-4 w-4" />;
      case '/ats-diagnostics':
        return <CheckIcon className="h-4 w-4" />;
      case '/market':
        return <BarChart3Icon className="h-4 w-4" />;
      case '/settings':
        return <SettingsIcon className="h-4 w-4" />;
      case '/onboarding/upload-cv':
        return <UploadIcon className="h-4 w-4" />;
      default:
        return <CompassIcon className="h-4 w-4" />;
    }
  };

  const isPrimary = item.priority !== 'secondary';

  return (
    <button
      type="button"
      onClick={() => router.push(item.path)}
      className={`group inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-semibold transition-all cursor-pointer shadow-xs ${
        isPrimary
          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 hover:shadow-md'
          : 'border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400'
      }`}
    >
      <span className="opacity-90">{getIcon()}</span>
      <span>{item.label}</span>
      <ArrowUpRightIcon className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
}

function EnhancedMarkdown({ text }: { text: string }) {
  // Parse code blocks, headers, blockquotes, bullets, and paragraphs
  const rawParts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2">
      {rawParts.map((part, partIdx) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          const firstLine = lines[0].trim();
          const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
          const lang = hasLang ? firstLine : '';
          const code = (hasLang ? lines.slice(1) : lines).join('\n');

          return <CodeBlock key={partIdx} code={code} language={lang} />;
        }

        const lines = part.split('\n');

        return (
          <div key={partIdx} className="space-y-1.5">
            {lines.map((line, idx) => {
              const trimmed = line.trim();

              if (trimmed.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-[15px] font-bold text-slate-900 dark:text-white mt-3 mb-1">
                    <RichText text={trimmed.slice(4)} />
                  </h3>
                );
              }

              if (trimmed.startsWith('## ')) {
                return (
                  <h2 key={idx} className="text-[16px] font-extrabold text-slate-900 dark:text-white mt-4 mb-1.5">
                    <RichText text={trimmed.slice(3)} />
                  </h2>
                );
              }

              if (trimmed.startsWith('# ')) {
                return (
                  <h1 key={idx} className="text-[17px] font-black text-slate-900 dark:text-white mt-4 mb-2">
                    <RichText text={trimmed.slice(2)} />
                  </h1>
                );
              }

              if (trimmed.startsWith('> ')) {
                return (
                  <div
                    key={idx}
                    className="border-l-4 rtl:border-l-0 rtl:border-r-4 border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 px-3.5 py-2 rounded-r-lg rtl:rounded-r-none rtl:rounded-l-lg text-[13px] text-slate-700 dark:text-slate-300 italic"
                  >
                    <RichText text={trimmed.slice(2)} />
                  </div>
                );
              }

              if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
                return (
                  <div key={idx} className="flex items-start gap-2 pl-2 rtl:pl-0 rtl:pr-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                    <span className="flex-1">
                      <RichText text={trimmed.slice(2)} />
                    </span>
                  </div>
                );
              }

              if (/^\d+\.\s/.test(trimmed)) {
                const numMatch = trimmed.match(/^(\d+)\.\s(.*)$/);
                if (numMatch) {
                  return (
                    <div key={idx} className="flex items-start gap-2 pl-2 rtl:pl-0 rtl:pr-2">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">{numMatch[1]}.</span>
                      <span className="flex-1">
                        <RichText text={numMatch[2]} />
                      </span>
                    </div>
                  );
                }
              }

              if (!trimmed) {
                return <div key={idx} className="h-1.5" />;
              }

              return (
                <p key={idx}>
                  <RichText text={line} />
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('تم نسخ الكود / Code copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="relative my-3 overflow-hidden rounded-xl border border-slate-800 bg-[#0d1117] text-slate-100 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-1.5 text-[11px] text-slate-400">
        <span>{language || 'code'}</span>
        <button
          type="button"
          onClick={copyCode}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? <CheckIcon className="h-3.5 w-3.5 text-emerald-400" /> : <CopyIcon className="h-3.5 w-3.5" />}
          <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  active,
  activeClass = '',
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  activeClass?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 cursor-pointer ${
        active
          ? activeClass
          : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
      }`}
    >
      {children}
    </button>
  );
}
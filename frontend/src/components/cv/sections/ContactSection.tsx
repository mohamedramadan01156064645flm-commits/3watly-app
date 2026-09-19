"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  ChevronDown as ChevronDownIcon,
  Globe, 
  Link as LinkIcon,
  Check
} from 'lucide-react';
import { 
  FaLinkedin, 
  FaGithub, 
  FaXTwitter, 
  FaDribbble, 
  FaMedium, 
  FaDev 
} from 'react-icons/fa6';
import { useCV } from '../../../contexts/CVContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { TextField } from '../../ui/Field';
import type { Contact, SocialLink, SocialPlatform } from '../../../types/cv';

// ─── Platform definitions with colors ─────────────────────────────────────────
const PLATFORMS: Array<{
  id: SocialPlatform;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;       // text color for icon
  bg: string;          // background pill color
  border: string;      // border color
}> = [
  { id: 'LinkedIn',  label: 'LinkedIn',        icon: FaLinkedin, color: 'text-[#0A66C2]',  bg: 'bg-blue-50 dark:bg-blue-950/50',    border: 'border-blue-200 dark:border-blue-700/50' },
  { id: 'GitHub',    label: 'GitHub',           icon: FaGithub,   color: 'text-slate-800 dark:text-white', bg: 'bg-slate-100 dark:bg-slate-800/60', border: 'border-slate-300 dark:border-slate-600/50' },
  { id: 'Twitter',   label: 'Twitter / X',      icon: FaXTwitter, color: 'text-slate-900 dark:text-slate-100', bg: 'bg-slate-100 dark:bg-slate-800/60', border: 'border-slate-300 dark:border-slate-600/50' },
  { id: 'Portfolio', label: 'Portfolio',        icon: Globe,      color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/50', border: 'border-indigo-200 dark:border-indigo-700/50' },
  { id: 'Dribbble',  label: 'Dribbble',         icon: FaDribbble, color: 'text-pink-500',  bg: 'bg-pink-50 dark:bg-pink-950/50',    border: 'border-pink-200 dark:border-pink-700/50' },
  { id: 'Medium',    label: 'Medium',           icon: FaMedium,   color: 'text-slate-900 dark:text-slate-100', bg: 'bg-slate-100 dark:bg-slate-800/60', border: 'border-slate-300 dark:border-slate-600/50' },
  { id: 'Dev.to',    label: 'Dev.to',           icon: FaDev,      color: 'text-slate-900 dark:text-slate-100', bg: 'bg-slate-100 dark:bg-slate-800/60', border: 'border-slate-300 dark:border-slate-600/50' },
  { id: 'Personal',  label: 'Personal Website', icon: Globe,      color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/50', border: 'border-violet-200 dark:border-violet-700/50' },
  { id: 'Other',     label: 'Other',            icon: LinkIcon,   color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800/60', border: 'border-slate-300 dark:border-slate-600/50' },
];

// ─── Portal dropdown for platform selection ────────────────────────────────────
interface PlatformDropdownProps {
  value: SocialPlatform;
  onChange: (val: SocialPlatform) => void;
  isAr?: boolean;
}

function PlatformDropdown({ value, onChange, isAr = false }: PlatformDropdownProps) {
  const [open, setOpen] = useState(false);
  const [dropPos, setDropPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const current = PLATFORMS.find((p) => p.id === value) || PLATFORMS[0];
  const IconComp = current.icon;

  const openDropdown = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dropWidth = Math.max(rect.width, 230);
    // Check if dropdown fits below trigger or needs to open above
    const fitsBelow = rect.bottom + 270 <= window.innerHeight;
    const top = fitsBelow ? rect.bottom + 6 : Math.max(10, rect.top - 276);

    // Compute left coordinate with RTL awareness and screen edge clamping
    const rawLeft = isAr ? rect.right - dropWidth : rect.left;
    const left = Math.max(10, Math.min(window.innerWidth - dropWidth - 10, rawLeft));

    setDropPos({
      top,
      left,
      width: dropWidth,
    });
    setOpen(true);
  }, [isAr]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        dropRef.current?.contains(e.target as Node) ||
        triggerRef.current?.contains(e.target as Node)
      ) return;
      setOpen(false);
    };

    // Close on external scroll, but NOT when scrolling inside the dropdown list
    const handleScroll = (e: Event) => {
      if (dropRef.current?.contains(e.target as Node)) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener('mousedown', handleClick);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [open]);

  const dropdownEl = open && dropPos ? ReactDOM.createPortal(
    <div
      ref={dropRef}
      data-dropdown="platform"
      style={{
        position: 'fixed',
        top: dropPos.top,
        left: dropPos.left,
        width: dropPos.width,
        zIndex: 99999,
      }}
      className="rounded-2xl border border-white/10 bg-[#0B1120] shadow-2xl shadow-black/60 overflow-hidden backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Header */}
      <div className="px-3 pt-2.5 pb-1.5 border-b border-white/[0.08] flex items-center justify-between">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {isAr ? "اختر المنصة" : "Select Platform"}
        </p>
        <span className="text-[10px] text-blue-400 font-semibold">
          {PLATFORMS.length} {isAr ? "منصات" : "options"}
        </span>
      </div>
      {/* Options list */}
      <div className="py-1 max-h-60 overflow-y-auto overscroll-contain">
        {PLATFORMS.map((p) => {
          const Icon = p.icon;
          const isSelected = p.id === value;
          return (
            <button
              key={p.id}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(p.id);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left rtl:text-right transition-colors cursor-pointer group ${
                isSelected
                  ? 'bg-blue-600/15 text-white'
                  : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              {/* Colored icon pill */}
              <span className={`flex items-center justify-center w-7 h-7 rounded-xl shrink-0 ${p.bg} ${p.border} border shadow-xs transition-transform group-hover:scale-105`}>
                <Icon className={`w-3.5 h-3.5 ${p.color}`} />
              </span>
              <span className="text-[13px] font-semibold flex-1 truncate">{p.label}</span>
              {isSelected && <Check className="w-4 h-4 text-blue-400 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openDropdown())}
        className={`relative w-full h-9 flex items-center gap-2 pl-2.5 pr-7 rounded-xl border text-[12.5px] font-semibold transition-all cursor-pointer select-none ${
          open
            ? 'border-blue-500 bg-[#040816] text-white shadow-xs shadow-blue-500/20'
            : 'border-slate-200/90 dark:border-white/10 bg-slate-50/80 dark:bg-[#040816] text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-white/20'
        }`}
      >
        {/* Current icon pill */}
        <span className={`flex items-center justify-center w-6 h-6 rounded-lg shrink-0 ${current.bg} ${current.border} border`}>
          <IconComp className={`w-3 h-3 ${current.color}`} />
        </span>
        <span className="flex-1 truncate text-left rtl:text-right">{current.label}</span>
        <ChevronDownIcon
          className={`w-3.5 h-3.5 text-slate-400 absolute ltr:right-2.5 rtl:left-2.5 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-150 ${open ? 'rotate-180 text-blue-400' : ''}`}
        />
      </button>
      {dropdownEl}
    </>
  );
}

// ─── Main ContactSection ───────────────────────────────────────────────────────
export function ContactSection() {
  const { cv, update } = useCV();
  const { isAr } = useLanguage();

  const setField = (key: keyof Contact) => (value: string) =>
    update(
      (prev) => ({ ...prev, contact: { ...prev.contact, [key]: value } }),
      `contact-${key}`
    );

  // Initialize socialLinks from existing linkedin/github/portfolio if not already present
  const links: SocialLink[] = React.useMemo(() => {
    const isPlaceholder = (u?: string) => !u || u.toLowerCase().includes('your-profile');
    const existing = (Array.isArray(cv.contact.socialLinks) ? cv.contact.socialLinks : [])
      .filter((l) => !isPlaceholder(l.url));

    const result: SocialLink[] = [...existing];
    if (cv.contact.linkedin && !isPlaceholder(cv.contact.linkedin) && !result.some((l) => l.platform === 'LinkedIn')) {
      result.unshift({ id: 'link-li', platform: 'LinkedIn', url: cv.contact.linkedin });
    }
    if (cv.contact.github && !isPlaceholder(cv.contact.github) && !result.some((l) => l.platform === 'GitHub')) {
      result.push({ id: 'link-gh', platform: 'GitHub', url: cv.contact.github });
    }
    if (cv.contact.portfolio && !isPlaceholder(cv.contact.portfolio) && !result.some((l) => l.platform === 'Portfolio' || l.platform === 'Personal')) {
      result.push({ id: 'link-pf', platform: 'Portfolio', url: cv.contact.portfolio });
    }
    return result;
  }, [cv.contact.socialLinks, cv.contact.linkedin, cv.contact.github, cv.contact.portfolio]);

  const updateLinks = (newLinks: SocialLink[]) => {
    const li = newLinks.find((l) => l.platform === 'LinkedIn')?.url || '';
    const gh = newLinks.find((l) => l.platform === 'GitHub')?.url || '';
    const pf = newLinks.find((l) => l.platform === 'Portfolio' || l.platform === 'Personal')?.url || '';

    update(
      (prev) => ({
        ...prev,
        contact: {
          ...prev.contact,
          linkedin: li,
          github: gh,
          portfolio: pf,
          socialLinks: newLinks
        }
      }),
      'contact-social-links'
    );
  };

  const addSocialLink = () => {
    const newLink: SocialLink = {
      id: `link-${Date.now()}`,
      platform: 'LinkedIn',
      url: ''
    };
    updateLinks([...links, newLink]);
  };

  const removeSocialLink = (id: string) => {
    updateLinks(links.filter((l) => l.id !== id));
  };

  const updateSocialLink = (id: string, field: keyof SocialLink, value: string) => {
    updateLinks(
      links.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const moveLink = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;
    const reordered = [...links];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    updateLinks(reordered);
  };

  return (
    <div className="space-y-6">
      {/* 1. Primary Personal Information */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          label="Full Name"
          value={cv.contact.fullName}
          onChange={setField('fullName')}
          placeholder="Ahmed Amr"
          invalid={cv.contact.fullName.trim() === ''}
          error={
            cv.contact.fullName.trim() === '' ? 'Your name is required.' : undefined
          }
        />
        
        <TextField
          label="Professional Headline / Title"
          value={cv.contact.jobTitle}
          onChange={setField('jobTitle')}
          placeholder="Junior Machine Learning Engineer | Data Analyst"
          hint="Benchmark keywords for your target role."
        />
        
        <TextField
          label="Phone Number"
          value={cv.contact.phone}
          onChange={setField('phone')}
          type="tel"
          placeholder="+20 111 139 3711"
        />
        
        <TextField
          label="Email Address"
          value={cv.contact.email}
          onChange={setField('email')}
          type="email"
          placeholder="ahmedamr021222@gmail.com"
          invalid={
            cv.contact.email.trim() !== '' && !cv.contact.email.includes('@')
          }
          error={
            cv.contact.email.trim() !== '' && !cv.contact.email.includes('@')
              ? 'Add a valid email so recruiters can reach you.'
              : undefined
          }
        />

        <div className="sm:col-span-2">
          <TextField
            label="Location / City"
            value={cv.contact.location}
            onChange={setField('location')}
            placeholder="Cairo, Egypt"
          />
        </div>
      </div>

      {/* 2. Social Links Section */}
      <div className="pt-3 border-t border-slate-200 dark:border-white/10">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <h4 className="text-[13.5px] font-bold text-slate-900 dark:text-white">
              {isAr ? "روابط المنصات والحسابات" : "Social Links"}
            </h4>
            <span className="text-[11.5px] text-slate-400 dark:text-slate-500 font-normal">
              (LinkedIn, GitHub, Portfolio...)
            </span>
          </div>

          <button
            type="button"
            onClick={addSocialLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200/80 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-[12px] font-bold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAr ? "إضافة رابط" : "Add Social Link"}</span>
          </button>
        </div>

        {/* Links List */}
        {links.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-white/10 p-4 text-center bg-slate-50/50 dark:bg-white/[0.01]">
            <p className="text-[12.5px] text-slate-500 dark:text-slate-400">
              {isAr
                ? "لم تقم بإضافة روابط بعد. اضغط «إضافة رابط» لإدراج حسابك على LinkedIn أو GitHub أو موقعك الشخصي."
                : 'No social links added yet. Click "+ Add Social Link" to include your LinkedIn, GitHub, or Portfolio.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {links.map((link, index) => (
              <div
                key={link.id}
                className="p-3 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] shadow-2xs space-y-2.5 transition-colors"
              >
                {/* Top Row: Platform Select + Custom Label + Reorder/Delete */}
                <div className="flex items-center gap-2">
                  {/* ── Beautiful custom platform dropdown ── */}
                  <div className="w-[155px] sm:w-[175px] shrink-0">
                    <PlatformDropdown
                      value={link.platform}
                      onChange={(val) => updateSocialLink(link.id, 'platform', val)}
                      isAr={isAr}
                    />
                  </div>

                  {/* Custom Label Input */}
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={link.customLabel || ''}
                      onChange={(e) => updateSocialLink(link.id, 'customLabel', e.target.value)}
                      placeholder={isAr ? "الاسم (مثال: لينكد إن، موقعي)" : "Display Name (optional)"}
                      title={isAr ? "الاسم المعروض للرابط في السيرة الذاتية" : "Display name for this link"}
                      className="w-full h-9 px-3 rounded-xl border border-slate-200/90 dark:border-white/10 bg-slate-50/80 dark:bg-[#040816] text-[12.5px] text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Actions: Reorder + Delete */}
                  <div className="flex items-center gap-1 shrink-0">
                    <div className="flex items-center gap-0.5 border border-slate-200/90 dark:border-white/10 rounded-xl bg-slate-50/80 dark:bg-[#040816] p-0.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveLink(index, 'up')}
                        title={isAr ? "تحريك لأعلى" : "Move up"}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-white/10 disabled:opacity-25 cursor-pointer disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === links.length - 1}
                        onClick={() => moveLink(index, 'down')}
                        title={isAr ? "تحريك لأسفل" : "Move down"}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-white/10 disabled:opacity-25 cursor-pointer disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeSocialLink(link.id)}
                      title={isAr ? "حذف الرابط" : "Delete link"}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bottom Row: Full URL Input */}
                <div className="relative w-full">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <LinkIcon className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="url"
                    dir="ltr"
                    value={link.url}
                    onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                    placeholder={
                      link.platform === 'LinkedIn'
                        ? 'https://linkedin.com/in/username'
                        : link.platform === 'GitHub'
                        ? 'https://github.com/username'
                        : link.platform === 'Twitter'
                        ? 'https://x.com/username'
                        : link.platform === 'Dribbble'
                        ? 'https://dribbble.com/username'
                        : link.platform === 'Medium'
                        ? 'https://medium.com/@username'
                        : 'https://yourwebsite.com'
                    }
                    className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200/90 dark:border-white/10 bg-slate-50/80 dark:bg-[#040816] text-[12.5px] text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-sans text-left transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

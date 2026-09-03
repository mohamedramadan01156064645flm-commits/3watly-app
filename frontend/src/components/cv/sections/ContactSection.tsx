"use client";

import React from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Globe, 
  Link as LinkIcon 
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

const PLATFORMS: Array<{ id: SocialPlatform; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'LinkedIn', label: 'LinkedIn', icon: FaLinkedin },
  { id: 'GitHub', label: 'GitHub', icon: FaGithub },
  { id: 'Twitter', label: 'Twitter / X', icon: FaXTwitter },
  { id: 'Portfolio', label: 'Portfolio', icon: Globe },
  { id: 'Dribbble', label: 'Dribbble', icon: FaDribbble },
  { id: 'Medium', label: 'Medium', icon: FaMedium },
  { id: 'Dev.to', label: 'Dev.to', icon: FaDev },
  { id: 'Personal', label: 'Personal Website', icon: Globe },
  { id: 'Other', label: 'Other', icon: LinkIcon }
];

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
    if (Array.isArray(cv.contact.socialLinks) && cv.contact.socialLinks.length > 0) {
      return cv.contact.socialLinks;
    }
    const defaults: SocialLink[] = [];
    if (cv.contact.linkedin) {
      defaults.push({ id: 'link-li', platform: 'LinkedIn', url: cv.contact.linkedin });
    }
    if (cv.contact.github) {
      defaults.push({ id: 'link-gh', platform: 'GitHub', url: cv.contact.github });
    }
    if (cv.contact.portfolio) {
      defaults.push({ id: 'link-pf', platform: 'Portfolio', url: cv.contact.portfolio });
    }
    return defaults;
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

      {/* 2. Social Links Section (Matching Resumeforfree 1:1) */}
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
            {links.map((link, index) => {
              const platformMeta = PLATFORMS.find((p) => p.id === link.platform) || PLATFORMS[0];
              const IconComp = platformMeta.icon;

              return (
                <div
                  key={link.id}
                  dir="ltr"
                  className="flex items-center gap-2 p-2.5 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] shadow-2xs text-left transition-colors"
                >
                  {/* Platform Select (With isolated custom chevron to avoid overlap in RTL/LTR) */}
                  <div className="relative min-w-[145px] sm:min-w-[165px]">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-blue-600 dark:text-blue-400">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <select
                      value={link.platform}
                      onChange={(e) => updateSocialLink(link.id, 'platform', e.target.value as SocialPlatform)}
                      className="w-full h-9 pl-9 pr-7 rounded-xl border border-slate-200/90 dark:border-white/10 bg-slate-50/80 dark:bg-[#060913] text-[12.5px] font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
                    >
                      {PLATFORMS.map((p) => (
                        <option key={p.id} value={p.id} className="bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white">
                          {p.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* URL Input */}
                  <div className="flex-1">
                    <input
                      type="text"
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
                      className="w-full h-9 px-3.5 rounded-xl border border-slate-200/90 dark:border-white/10 bg-slate-50/80 dark:bg-[#060913] text-[12.5px] text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-sans"
                    />
                  </div>

                  {/* Up / Down Reorder Buttons */}
                  <div className="flex items-center gap-0.5 border border-slate-200/90 dark:border-white/10 rounded-xl bg-slate-50/80 dark:bg-[#060913] p-0.5 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveLink(index, 'up')}
                      title="Move up"
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-white/10 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === links.length - 1}
                      onClick={() => moveLink(index, 'down')}
                      title="Move down"
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-white/10 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Delete Trash Button */}
                  <button
                    type="button"
                    onClick={() => removeSocialLink(link.id)}
                    title="Delete link"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

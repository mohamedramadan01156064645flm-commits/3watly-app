"use client";

import React from 'react';
import {
  Mail,
  MapPin,
  Phone,
  Globe,
  ExternalLink
} from 'lucide-react';
import { FaLinkedin as LinkedinIcon, FaGithub as GithubIcon } from 'react-icons/fa6';
import { useCV } from '../../contexts/CVContext';
import { SECTION_META } from '../../data/cvData';
import { formatDateRange, visibleSections } from '../../utils/cvHelpers';
import type { CVData, SectionId, TemplateId } from '../../types/cv';

interface StyleConfig {
  page: string;
  name: string;
  role: string;
  contact: string;
  heading: string;
  headingRule: string;
  body: string;
  itemTitle: string;
  itemSub: string;
  meta: string;
  gap: string;
  itemGap: string;
  fontFamily: string;
}

const STYLES: Record<TemplateId, StyleConfig> = {
  'ats-classic': {
    page: 'px-4 py-5 sm:px-9 sm:py-8',
    name: 'text-[24px] sm:text-[28px] font-extrabold tracking-tight text-slate-900 dark:text-white',
    role: 'mt-0.5 text-[14px] sm:text-[15px] font-bold text-blue-700 dark:text-blue-400',
    contact: 'mt-2 text-[12px] text-slate-600 dark:text-slate-400',
    heading: 'text-[12.5px] sm:text-[13px] font-bold uppercase tracking-wider text-slate-900 dark:text-white',
    headingRule: 'mt-1 border-b-2 border-slate-300 dark:border-white/20',
    body: 'text-[12px] sm:text-[12.5px] leading-[1.6] text-slate-800 dark:text-slate-300',
    itemTitle: 'text-[13.5px] sm:text-[14px] font-bold text-slate-900 dark:text-white',
    itemSub: 'text-[12.5px] sm:text-[13px] font-semibold text-blue-700 dark:text-blue-400',
    meta: 'text-[11px] sm:text-[11.5px] text-slate-500 dark:text-slate-400',
    gap: 'mt-4',
    itemGap: 'mt-2.5',
    fontFamily: 'Georgia, "Times New Roman", serif'
  },
  'compact': {
    page: 'px-4 py-4 sm:px-7 sm:py-6',
    name: 'text-[22px] sm:text-[24px] font-extrabold tracking-tight text-slate-900 dark:text-white',
    role: 'text-[13px] sm:text-[13.5px] font-bold text-blue-700 dark:text-blue-400',
    contact: 'mt-1.5 text-[11px] text-slate-600 dark:text-slate-400',
    heading: 'text-[11.5px] font-bold uppercase tracking-wider text-slate-900 dark:text-white',
    headingRule: 'mt-0.5 border-b border-slate-300 dark:border-white/20',
    body: 'text-[11px] sm:text-[11.5px] leading-[1.45] text-slate-800 dark:text-slate-300',
    itemTitle: 'text-[12.5px] sm:text-[13px] font-bold text-slate-900 dark:text-white',
    itemSub: 'text-[11.5px] sm:text-[12px] font-semibold text-blue-700 dark:text-blue-400',
    meta: 'text-[10.5px] sm:text-[11px] text-slate-500 dark:text-slate-400',
    gap: 'mt-3',
    itemGap: 'mt-1.5',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  'two-column': {
    page: 'px-4 py-5 sm:px-8 sm:py-7',
    name: 'text-[24px] sm:text-[26px] font-extrabold tracking-tight text-slate-900 dark:text-white',
    role: 'mt-0.5 text-[13.5px] sm:text-[14px] font-bold text-blue-700 dark:text-blue-400',
    contact: 'mt-2 text-[11px] sm:text-[11.5px] text-slate-600 dark:text-slate-400',
    heading: 'text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-slate-900 dark:text-white',
    headingRule: 'mt-1 border-b border-slate-300 dark:border-white/20',
    body: 'text-[11.5px] sm:text-[12px] leading-[1.55] text-slate-800 dark:text-slate-300',
    itemTitle: 'text-[13px] sm:text-[13.5px] font-bold text-slate-900 dark:text-white',
    itemSub: 'text-[12px] sm:text-[12.5px] font-semibold text-blue-700 dark:text-blue-400',
    meta: 'text-[10.5px] sm:text-[11px] text-slate-500 dark:text-slate-400',
    gap: 'mt-4',
    itemGap: 'mt-2',
    fontFamily: 'Inter, system-ui, sans-serif'
  },
  'simple': {
    page: 'px-4 py-5 sm:px-10 sm:py-9',
    name: 'text-[24px] sm:text-[28px] font-serif font-bold tracking-normal text-slate-900 dark:text-white text-center',
    role: 'mt-1 text-[13.5px] sm:text-[14.5px] font-serif italic text-slate-600 dark:text-slate-300 text-center',
    contact: 'mt-2.5 text-[11px] sm:text-[11.5px] text-slate-600 dark:text-slate-400 text-center',
    heading: 'text-[12px] sm:text-[13px] font-serif font-bold uppercase tracking-widest text-slate-900 dark:text-white text-center',
    headingRule: 'mt-1 border-b border-slate-400 dark:border-white/30',
    body: 'text-[12px] sm:text-[12.5px] font-serif leading-[1.65] text-slate-800 dark:text-slate-300',
    itemTitle: 'text-[13.5px] sm:text-[14px] font-serif font-bold text-slate-900 dark:text-white',
    itemSub: 'text-[12.5px] sm:text-[13px] font-serif italic text-slate-700 dark:text-slate-300',
    meta: 'text-[11px] sm:text-[11.5px] text-slate-500 dark:text-slate-400',
    gap: 'mt-4',
    itemGap: 'mt-2.5',
    fontFamily: 'Georgia, "Times New Roman", serif'
  },
  'modern-minimal': {
    page: 'px-4 py-5 sm:px-9 sm:py-8',
    name: 'text-[24px] sm:text-[28px] font-extrabold tracking-tight text-slate-900 dark:text-white',
    role: 'mt-0.5 text-[14px] sm:text-[15px] font-bold text-blue-700 dark:text-blue-400',
    contact: 'mt-2 text-[12px] text-slate-600 dark:text-slate-400',
    heading: 'text-[12.5px] sm:text-[13px] font-bold uppercase tracking-wider text-slate-900 dark:text-white',
    headingRule: 'mt-1 border-b-2 border-slate-300 dark:border-white/20',
    body: 'text-[12px] sm:text-[12.5px] leading-[1.6] text-slate-800 dark:text-slate-300',
    itemTitle: 'text-[13.5px] sm:text-[14px] font-bold text-slate-900 dark:text-white',
    itemSub: 'text-[12.5px] sm:text-[13px] font-semibold text-blue-700 dark:text-blue-400',
    meta: 'text-[11px] sm:text-[11.5px] text-slate-500 dark:text-slate-400',
    gap: 'mt-4',
    itemGap: 'mt-2.5',
    fontFamily: 'Georgia, "Times New Roman", serif'
  }
};

export function CVPreview() {
  const { cv, template } = useCV();
  const activeTemplateKey = STYLES[template] ? template : 'ats-classic';
  const style = STYLES[activeTemplateKey];
  const sections = visibleSections(cv);

  // Helper to format clean link URLs
  const formatUrl = (url?: string) => {
    if (!url) return '';
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  };

  // Helper to collect and normalize all social links
  const activeSocialLinks = React.useMemo(() => {
    if (Array.isArray(cv.contact.socialLinks) && cv.contact.socialLinks.length > 0) {
      return cv.contact.socialLinks.filter((l) => Boolean(l.url && l.url.trim()));
    }
    const legacy: Array<{ id: string; platform: string; url: string }> = [];
    if (cv.contact.linkedin?.trim()) {
      legacy.push({ id: 'li', platform: 'LinkedIn', url: cv.contact.linkedin });
    }
    if (cv.contact.github?.trim()) {
      legacy.push({ id: 'gh', platform: 'GitHub', url: cv.contact.github });
    }
    if (cv.contact.portfolio?.trim()) {
      legacy.push({ id: 'pf', platform: 'Portfolio', url: cv.contact.portfolio });
    }
    return legacy;
  }, [cv.contact.socialLinks, cv.contact.linkedin, cv.contact.github, cv.contact.portfolio]);

  const isTwoColumn = template === 'two-column';

  return (
    <div className="print-region">
      {/* Display-only scrollable viewport with transparent floating scrollbar */}
      <div className="cv-scroll-viewport no-print-wrapper overflow-y-auto overflow-x-hidden py-4 sm:py-6 cv-preview-scroller">
        <article
          id="cv-paper-root"
          dir="ltr"
          className={`print-page cv-paper-root relative w-full max-w-[800px] mx-auto bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-slate-200/90 dark:border-white/10 rounded-xl sm:rounded-2xl transition-all duration-300 text-left ${style.page}`}
          style={{ fontFamily: style.fontFamily }}
        >
          {/* Header: Name + Headline + 2-Line Contact & Links */}
          <header className="border-b border-slate-200 dark:border-white/10 pb-4 text-center">
            <h1 className={style.name}>{cv.contact.fullName || 'Candidate Name'}</h1>
            {cv.contact.jobTitle && <p className={style.role}>{cv.contact.jobTitle}</p>}

            {/* Contact Line 1: Email • Phone • Location */}
            <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-0.5 text-[12px] text-slate-600 dark:text-slate-400 mt-2 font-sans">
              {cv.contact.email && (
                <a
                  href={`mailto:${cv.contact.email}`}
                  className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {cv.contact.email}
                </a>
              )}
              {cv.contact.phone && (
                <>
                  {cv.contact.email && <span className="text-slate-300 dark:text-slate-600">•</span>}
                  <a
                    href={`tel:${cv.contact.phone.replace(/[^\d+]/g, '')}`}
                    className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {cv.contact.phone}
                  </a>
                </>
              )}
              {cv.contact.location && (
                <>
                  {(cv.contact.email || cv.contact.phone) && <span className="text-slate-300 dark:text-slate-600">•</span>}
                  <span>{cv.contact.location}</span>
                </>
              )}
            </div>

            {/* Contact Line 2: Links (LinkedIn • GitHub • Portfolio • etc.) */}
            {activeSocialLinks.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-0.5 text-[12px] text-blue-600 dark:text-blue-400 mt-1 font-sans font-medium">
                {activeSocialLinks.map((item, idx) => (
                  <React.Fragment key={item.id || idx}>
                    {idx > 0 && <span className="text-slate-300 dark:text-slate-600 font-normal">•</span>}
                    <a
                      href={formatUrl(item.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {item.platform || 'Link'}
                    </a>
                  </React.Fragment>
                ))}
              </div>
            )}
          </header>

          {/* Render 2-Column or Single Column */}
          {isTwoColumn ? (
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-4 items-start">
              {/* Left Column (Skills + Education) */}
              <div className="col-span-1 sm:col-span-4 space-y-4 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-white/10 pb-4 sm:pb-0 sm:pr-4">
                {sections.includes('skills') && (
                  <section>
                    <h2 className={style.heading}>{SECTION_META['skills'].label}</h2>
                    {style.headingRule && <div className={style.headingRule} />}
                    <SkillsSectionContent cv={cv} style={style} />
                  </section>
                )}
                {sections.includes('education') && (
                  <section>
                    <h2 className={style.heading}>{SECTION_META['education'].label}</h2>
                    {style.headingRule && <div className={style.headingRule} />}
                    <EducationSectionContent cv={cv} style={style} />
                  </section>
                )}
              </div>

              {/* Right Column (Summary + Experience + Projects) */}
              <div className="col-span-1 sm:col-span-8 space-y-4">
                {sections.includes('summary') && (
                  <section>
                    <h2 className={style.heading}>{SECTION_META['summary'].label}</h2>
                    {style.headingRule && <div className={style.headingRule} />}
                    <SummarySectionContent cv={cv} style={style} />
                  </section>
                )}
                {sections.includes('experience') && (
                  <section>
                    <h2 className={style.heading}>{SECTION_META['experience'].label}</h2>
                    {style.headingRule && <div className={style.headingRule} />}
                    <ExperienceSectionContent cv={cv} style={style} />
                  </section>
                )}
                {sections.includes('projects') && (
                  <section>
                    <h2 className={style.heading}>{SECTION_META['projects'].label}</h2>
                    {style.headingRule && <div className={style.headingRule} />}
                    <ProjectsSectionContent cv={cv} style={style} />
                  </section>
                )}
              </div>
            </div>
          ) : (
            /* Standard Single-Column Flow */
            <div className="space-y-4 pt-3">
              {sections.map((id) => (
                <section key={id} className={style.gap}>
                  <h2 className={style.heading}>{SECTION_META[id].label}</h2>
                  {style.headingRule && <div className={style.headingRule} />}
                  <SectionContent id={id} cv={cv} style={style} />
                </section>
              ))}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}

function SectionContent({
  id,
  cv,
  style
}: {
  id: SectionId;
  cv: CVData;
  style: StyleConfig;
}) {
  if (id === 'summary') return <SummarySectionContent cv={cv} style={style} />;
  if (id === 'experience') return <ExperienceSectionContent cv={cv} style={style} />;
  if (id === 'education') return <EducationSectionContent cv={cv} style={style} />;
  if (id === 'projects') return <ProjectsSectionContent cv={cv} style={style} />;
  if (id === 'skills') return <SkillsSectionContent cv={cv} style={style} />;
  return null;
}

function SummarySectionContent({ cv, style }: { cv: CVData; style: StyleConfig }) {
  if (!cv.summary.trim()) return null;
  return <p className={`${style.itemGap} ${style.body}`}>{cv.summary}</p>;
}

function ExperienceSectionContent({ cv, style }: { cv: CVData; style: StyleConfig }) {
  if (cv.experience.length === 0) return null;
  return (
    <div className="space-y-3">
      {cv.experience.map((item, index) => (
        <div key={item.id} className={index === 0 ? style.itemGap : 'mt-2.5'}>
          <div className="flex items-baseline justify-between gap-4">
            <p className={style.itemTitle}>{item.role}</p>
            <p className={`shrink-0 text-right ${style.meta}`}>
              {formatDateRange(item.startDate, item.endDate, item.current)}
            </p>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <p className={style.itemSub}>{item.company}</p>
            {item.location && <p className={style.meta}>{item.location}</p>}
          </div>
          <Bullets bullets={item.bullets} style={style} />
        </div>
      ))}
    </div>
  );
}

function EducationSectionContent({ cv, style }: { cv: CVData; style: StyleConfig }) {
  if (cv.education.length === 0) return null;
  return (
    <div className="space-y-2.5">
      {cv.education.map((item, index) => (
        <div key={item.id} className={index === 0 ? style.itemGap : 'mt-2'}>
          <div className="flex items-baseline justify-between gap-4">
            <p className={style.itemTitle}>
              {item.degree} {item.major && `in ${item.major}`}
            </p>
            <p className={`shrink-0 text-right ${style.meta}`}>
              {formatDateRange(item.startDate, item.endDate, false)}
            </p>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <p className={style.itemSub}>{item.institution}</p>
            {item.location && <p className={style.meta}>{item.location}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectsSectionContent({ cv, style }: { cv: CVData; style: StyleConfig }) {
  if (cv.projects.length === 0) return null;
  
  const formatUrl = (url?: string) => {
    if (!url) return '';
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  };

  return (
    <div className="space-y-3">
      {cv.projects.map((item, index) => (
        <div key={item.id} className={index === 0 ? style.itemGap : 'mt-2.5'}>
          <div className="flex items-baseline justify-between gap-4">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className={style.itemTitle}>{item.title}</span>
              {item.github && (
                <a
                  href={formatUrl(item.github)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-[12px] font-semibold"
                >
                  • GitHub
                </a>
              )}
              {item.link && (
                <a
                  href={formatUrl(item.link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-[12px] font-semibold"
                >
                  • Live Demo
                </a>
              )}
            </div>
            {item.technologies.length > 0 && (
              <p className={`shrink-0 text-right ${style.meta}`}>
                {item.technologies.join(', ')}
              </p>
            )}
          </div>
          <Bullets bullets={item.bullets} style={style} />
        </div>
      ))}
    </div>
  );
}

function SkillsSectionContent({ cv, style }: { cv: CVData; style: StyleConfig }) {
  if (cv.skills.length === 0) return null;
  return (
    <div className={`${style.itemGap}`}>
      {cv.skillsSummary && (
        <p className={`mb-2 ${style.body}`}>{cv.skillsSummary}</p>
      )}
      <dl className="space-y-1.5">
        {cv.skills.map((group) => (
          <div key={group.id} className="flex gap-2.5">
            <dt className={`w-[140px] shrink-0 font-bold text-slate-900 dark:text-white ${style.body}`}>
              {group.label}:
            </dt>
            <dd className={style.body}>{group.skills.join(', ')}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Bullets({
  bullets,
  style
}: {
  bullets: string[];
  style: StyleConfig;
}) {
  const items = bullets.filter((bullet) => bullet.trim() !== '');
  if (items.length === 0) return null;
  return (
    <ul className={`mt-1.5 space-y-1 ${style.body}`}>
      {items.map((bullet, index) => (
        <li key={index} className="flex gap-2">
          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" />
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  );
}

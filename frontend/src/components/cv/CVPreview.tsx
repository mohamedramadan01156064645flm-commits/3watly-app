"use client";

import React from 'react';
import { Link as LinkIcon } from 'lucide-react';
import { 
  FaLinkedin, 
  FaGithub, 
  FaXTwitter, 
  FaDribbble, 
  FaMedium, 
  FaDev,
  FaGlobe
} from 'react-icons/fa6';
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
  headerAlign?: 'center' | 'left';
  headingVariant?: 'classic' | 'modern-accent' | 'compact-banner' | 'simple-double';
  skillsVariant?: 'classic' | 'chips' | 'compact';
}

// 5 DISTINCT TEMPLATES WITH OBVIOUS, PREMIUM VISUAL IDENTITIES
const STYLES: Record<TemplateId, StyleConfig> = {
  'ats-classic': {
    page: 'p-6 sm:p-10',
    name: 'text-[25px] sm:text-[29px] font-bold tracking-tight text-slate-900 dark:text-white text-center',
    role: 'mt-0.5 text-[13.5px] sm:text-[14.5px] font-semibold text-slate-800 dark:text-slate-200 text-center',
    contact: 'mt-1.5 text-[11.5px] text-slate-700 dark:text-slate-300 text-center',
    heading: 'text-[12.5px] sm:text-[13px] font-bold uppercase tracking-wider text-slate-900 dark:text-white',
    headingRule: 'mt-1 border-b-2 border-slate-900 dark:border-white/40',
    body: 'text-[11.5px] sm:text-[12px] leading-[1.55] text-slate-900 dark:text-slate-100',
    itemTitle: 'text-[12.5px] sm:text-[13px] font-bold text-slate-900 dark:text-white',
    itemSub: 'text-[12px] sm:text-[12.5px] italic text-slate-700 dark:text-slate-300',
    meta: 'text-[11.5px] sm:text-[12px] text-slate-600 dark:text-slate-400 font-medium',
    gap: 'mt-3.5',
    itemGap: 'mt-2',
    fontFamily: '"Times New Roman", Times, Georgia, serif',
    headerAlign: 'center',
    headingVariant: 'classic',
    skillsVariant: 'classic'
  },
  'modern-minimal': {
    page: 'p-6 sm:p-10',
    name: 'text-[26px] sm:text-[30px] font-extrabold tracking-tight text-slate-900 dark:text-white text-left',
    role: 'mt-0.5 text-[13.5px] sm:text-[14.5px] font-bold text-blue-600 dark:text-blue-400 tracking-wider text-left uppercase',
    contact: 'mt-2 text-[11.5px] text-slate-600 dark:text-slate-300 text-left',
    heading: 'text-[12.5px] sm:text-[13px] font-extrabold uppercase tracking-wider text-slate-900 dark:text-white',
    headingRule: '',
    body: 'text-[11.5px] sm:text-[12px] leading-[1.6] text-slate-900 dark:text-slate-100',
    itemTitle: 'text-[13px] font-bold text-slate-900 dark:text-white',
    itemSub: 'text-[12px] font-medium text-slate-600 dark:text-slate-400',
    meta: 'text-[11.5px] text-slate-500 dark:text-slate-400 font-medium',
    gap: 'mt-4',
    itemGap: 'mt-2',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    headerAlign: 'left',
    headingVariant: 'modern-accent',
    skillsVariant: 'chips'
  },
  'compact': {
    page: 'p-4 sm:p-7',
    name: 'text-[22px] sm:text-[25px] font-bold tracking-tight text-slate-900 dark:text-white text-center',
    role: 'mt-0.5 text-[12.5px] font-semibold text-slate-700 dark:text-slate-300 text-center',
    contact: 'mt-1 text-[11px] text-slate-600 dark:text-slate-400 text-center',
    heading: 'text-[11.5px] sm:text-[12px] font-bold uppercase tracking-wider text-slate-900 dark:text-white',
    headingRule: '',
    body: 'text-[11px] sm:text-[11.5px] leading-[1.4] text-slate-900 dark:text-slate-100',
    itemTitle: 'text-[11.5px] sm:text-[12px] font-bold text-slate-900 dark:text-white',
    itemSub: 'text-[11px] italic text-slate-700 dark:text-slate-300',
    meta: 'text-[10.5px] text-slate-600 dark:text-slate-400 font-medium',
    gap: 'mt-2.5',
    itemGap: 'mt-1',
    fontFamily: 'Calibri, Arial, Helvetica, sans-serif',
    headerAlign: 'center',
    headingVariant: 'compact-banner',
    skillsVariant: 'compact'
  },
  'two-column': {
    page: 'p-5 sm:p-8',
    name: 'text-[24px] sm:text-[28px] font-extrabold tracking-tight text-slate-900 dark:text-white text-center',
    role: 'mt-0.5 text-[13px] sm:text-[14px] font-semibold text-slate-700 dark:text-slate-300 text-center',
    contact: 'mt-1.5 text-[11px] text-slate-600 dark:text-slate-300 text-center',
    heading: 'text-[11.5px] sm:text-[12px] font-extrabold uppercase tracking-wider text-slate-900 dark:text-white',
    headingRule: 'mt-1 border-b-2 border-slate-800/60 dark:border-white/25',
    body: 'text-[11px] sm:text-[11.5px] leading-[1.5] text-slate-900 dark:text-slate-100',
    itemTitle: 'text-[12px] sm:text-[12.5px] font-bold text-slate-900 dark:text-white',
    itemSub: 'text-[11.5px] italic text-slate-700 dark:text-slate-300',
    meta: 'text-[10.5px] text-slate-500 dark:text-slate-400 font-medium',
    gap: 'mt-3.5',
    itemGap: 'mt-2',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    headerAlign: 'center',
    headingVariant: 'classic',
    skillsVariant: 'chips'
  },
  'simple': {
    page: 'p-6 sm:p-10',
    name: 'text-[23px] sm:text-[27px] font-normal tracking-[0.18em] uppercase text-slate-900 dark:text-white text-center',
    role: 'mt-1 text-[13px] italic tracking-widest text-slate-600 dark:text-slate-300 text-center',
    contact: 'mt-2 text-[11px] text-slate-600 dark:text-slate-400 text-center',
    heading: 'text-[11.5px] sm:text-[12px] font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-white text-center',
    headingRule: '',
    body: 'text-[11.5px] sm:text-[12px] leading-[1.65] text-slate-900 dark:text-slate-100',
    itemTitle: 'text-[12.5px] sm:text-[13px] font-bold text-slate-900 dark:text-white',
    itemSub: 'text-[12px] italic text-slate-700 dark:text-slate-300',
    meta: 'text-[11px] text-slate-500 dark:text-slate-400',
    gap: 'mt-4',
    itemGap: 'mt-2',
    fontFamily: 'Georgia, "Times New Roman", serif',
    headerAlign: 'center',
    headingVariant: 'simple-double',
    skillsVariant: 'classic'
  }
};

/** Clean location strings that mistakenly have date ranges concatenated into them */
function cleanLocationText(loc?: string): string {
  if (!loc) return '';
  return loc
    .replace(/\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)?\s*\d{4}\s*[-–—]\s*(?:present|\w+\s*\d{4})?/gi, '')
    .replace(/^[,\s·•-]+|[,\s·•-]+$/g, '')
    .trim();
}

/** Helper to format clean link URLs */
function formatUrl(url?: string): string {
  if (!url) return '';
  const u = url.trim();
  return u.startsWith('http://') || u.startsWith('https://') ? u : `https://${u}`;
}

/** Official platform icon resolver — black icon for ATS and print safety */
function getPlatformIcon(platform?: string) {
  const p = (platform || '').toLowerCase().trim();
  if (p.includes('linkedin')) return FaLinkedin;
  if (p.includes('github')) return FaGithub;
  if (p.includes('twitter') || p === 'x' || p.includes('x.com')) return FaXTwitter;
  if (p.includes('dribbble')) return FaDribbble;
  if (p.includes('medium')) return FaMedium;
  if (p.includes('dev')) return FaDev;
  if (p.includes('portfolio') || p.includes('personal') || p.includes('web') || p.includes('site')) return FaGlobe;
  return LinkIcon;
}

export function CVPreview() {
  const { cv, template } = useCV();
  const activeTemplateKey = STYLES[template] ? template : 'ats-classic';
  const style = STYLES[activeTemplateKey];
  const sections = visibleSections(cv);

  // Helper to collect and normalize all social links (Displays name only: LinkedIn, GitHub, etc.)
  const activeSocialLinks = React.useMemo(() => {
    const isExcluded = (u?: string) => {
      if (!u) return true;
      const lower = u.toLowerCase().trim();
      if (lower.startsWith('tel:') || lower.startsWith('mailto:')) return true;
      if (lower.includes('your-profile')) return true;
      const digitsOnly = lower.replace(/[^\d]/g, '');
      if (cv.contact.phone && digitsOnly.length >= 8 && cv.contact.phone.replace(/[^\d]/g, '').includes(digitsOnly)) {
        return true;
      }
      return false;
    };

    let rawItems: Array<{ id: string; platform: string; url: string; customLabel?: string }> = [];
    if (Array.isArray(cv.contact.socialLinks) && cv.contact.socialLinks.length > 0) {
      rawItems.push(
        ...cv.contact.socialLinks
          .filter((l) => Boolean(l.url && l.url.trim() && !isExcluded(l.url)))
          .map((l, idx) => ({
            id: l.id || `sl-${idx}`,
            platform: l.platform || 'Link',
            url: l.url,
            customLabel: l.customLabel?.trim() || undefined,
          }))
      );
    }
    if (cv.contact.linkedin?.trim() && !isExcluded(cv.contact.linkedin)) {
      rawItems.push({ id: 'li', platform: 'LinkedIn', url: cv.contact.linkedin });
    }
    if (cv.contact.github?.trim() && !isExcluded(cv.contact.github)) {
      rawItems.push({ id: 'gh', platform: 'GitHub', url: cv.contact.github });
    }
    if (cv.contact.portfolio?.trim() && !isExcluded(cv.contact.portfolio)) {
      rawItems.push({ id: 'pf', platform: 'Portfolio', url: cv.contact.portfolio });
    }

    // Deduplicate by clean URL and platform
    const seen = new Set<string>();
    const deduplicated: Array<{ id: string; platform: string; url: string; customLabel?: string }> = [];
    for (const item of rawItems) {
      const cleanUrl = item.url.trim().toLowerCase().replace(/\/$/, '');
      const key = `${item.platform.toLowerCase()}_${cleanUrl}`;
      if (!seen.has(key) && !seen.has(cleanUrl)) {
        seen.add(key);
        seen.add(cleanUrl);
        deduplicated.push(item);
      }
    }
    return deduplicated;
  }, [cv.contact.socialLinks, cv.contact.linkedin, cv.contact.github, cv.contact.portfolio, cv.contact.phone]);

  const isTwoColumn = template === 'two-column';

  // Check if experiences consist of internships
  const isAllInternships = React.useMemo(() => {
    return (
      cv.experience.length > 0 &&
      cv.experience.every((e) => (e as any).type === 'internship' || /intern\b|تدريب/i.test(e.role))
    );
  }, [cv.experience]);

  const getSectionTitle = (id: SectionId) => {
    if (id === 'experience') {
      if (isAllInternships) return 'INTERNSHIPS';
      if (cv.experience.some((e) => (e as any).type === 'internship' || /intern\b/i.test(e.role))) {
        return 'EXPERIENCE & INTERNSHIPS';
      }
      return 'EXPERIENCE';
    }
    return SECTION_META[id]?.label || id.toUpperCase();
  };

  // Dynamic heading renderer supporting all 5 template styles
  const renderHeading = (title: string) => {
    if (style.headingVariant === 'modern-accent') {
      return (
        <div className="mb-2">
          <h2 className="inline-block border-l-[3.5px] border-blue-600 dark:border-blue-500 pl-2.5 font-extrabold uppercase text-[12px] sm:text-[12.5px] tracking-wider text-slate-900 dark:text-white bg-blue-50/60 dark:bg-blue-950/30 py-0.5 pr-3 rounded-r">
            {title}
          </h2>
        </div>
      );
    }

    if (style.headingVariant === 'compact-banner') {
      return (
        <div className="mb-1.5">
          <h2 className="w-full bg-slate-100 dark:bg-slate-800/90 px-2.5 py-1 rounded-sm text-[11px] sm:text-[11.5px] font-bold uppercase tracking-wider text-slate-900 dark:text-white border-l-[3px] border-slate-700 dark:border-slate-300">
            {title}
          </h2>
        </div>
      );
    }

    if (style.headingVariant === 'simple-double') {
      return (
        <div className="mb-2 text-center">
          <h2 className="border-t border-b border-slate-300 dark:border-slate-700 py-1 uppercase tracking-[0.2em] text-[11.5px] font-bold text-slate-900 dark:text-white">
            {title}
          </h2>
        </div>
      );
    }

    // Classic default (ats-classic, two-column)
    return (
      <div>
        <h2 className={style.heading}>{title}</h2>
        {style.headingRule && <div className={style.headingRule} />}
      </div>
    );
  };

  return (
    <div className="print-region w-full">
      <article
        id="cv-paper-root"
          dir="ltr"
          className={`print-page cv-paper-root relative w-full max-w-[820px] min-h-[1080px] mx-auto bg-white dark:bg-[#0E1626] text-slate-900 dark:text-slate-100 shadow-2xl border border-slate-200 dark:border-white/10 rounded-sm transition-all duration-300 text-left ${style.page}`}
          style={{ fontFamily: style.fontFamily }}
        >
          {/* Header: Name + Headline + Contact Line + Profiles Line */}
          <header className={`pb-3 ${
            style.headerAlign === 'left'
              ? 'text-left border-b-2 border-slate-200/80 dark:border-white/10 mb-4'
              : 'text-center pb-2.5'
          }`}>
            <h1 className={style.name}>{cv.contact.fullName || 'Candidate Name'}</h1>
            {cv.contact.jobTitle && <p className={style.role}>{cv.contact.jobTitle}</p>}

            {/* Line 1: Primary Contacts (Email • Phone • Location) */}
            {(cv.contact.email || cv.contact.phone || cv.contact.location) && (
              <div className={`flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11.5px] text-slate-700 dark:text-slate-300 mt-1.5 font-sans ${
                style.headerAlign === 'left' ? 'justify-start' : 'justify-center'
              }`}>
                {cv.contact.email && (
                  <a
                    href={`mailto:${cv.contact.email}`}
                    className="hover:underline text-slate-800 dark:text-slate-200"
                  >
                    {cv.contact.email}
                  </a>
                )}
                {cv.contact.email && cv.contact.phone && <span className="text-slate-400 dark:text-slate-600 select-none">•</span>}
                {cv.contact.phone && (
                  <a
                    href={`tel:${cv.contact.phone.replace(/[^\d+]/g, '')}`}
                    className="hover:underline text-slate-800 dark:text-slate-200"
                  >
                    {cv.contact.phone}
                  </a>
                )}
                {(cv.contact.email || cv.contact.phone) && cv.contact.location && (
                  <span className="text-slate-400 dark:text-slate-600 select-none">•</span>
                )}
                {cv.contact.location && (
                  <span className="text-slate-600 dark:text-slate-400">
                    {cleanLocationText(cv.contact.location)}
                  </span>
                )}
              </div>
            )}

            {/* Line 2: Online Social / Portfolio Links (LinkedIn • GitHub • Portfolio) */}
            {activeSocialLinks.length > 0 && (
              <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-slate-700 dark:text-slate-300 mt-1 font-sans ${
                style.headerAlign === 'left' ? 'justify-start' : 'justify-center'
              }`}>
                {activeSocialLinks.map((item, idx) => {
                  const IconComp = getPlatformIcon(item.platform);
                  const displayLabel = item.customLabel?.trim() || item.platform || 'Link';
                  return (
                    <React.Fragment key={item.id || idx}>
                      {idx > 0 && <span className="text-slate-400 dark:text-slate-600 select-none mx-0.5">•</span>}
                      <a
                        href={formatUrl(item.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-slate-900 dark:text-slate-100 font-semibold hover:underline"
                      >
                        {IconComp && (
                          <IconComp
                            aria-hidden="true"
                            focusable="false"
                            className="w-3.5 h-3.5 text-black dark:text-white shrink-0 inline-block align-middle"
                          />
                        )}
                        <span>{displayLabel}</span>
                      </a>
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </header>

          {/* Render 2-Column or Single Column */}
          {isTwoColumn ? (
            /* Perfectly Balanced Executive Two-Column Layout */
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-2 items-start">
              {/* Left Column (Sidebar): 5 cols (~40% width) with clean container */}
              <div className="col-span-1 sm:col-span-5 bg-slate-50/70 dark:bg-slate-900/50 p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-white/10 space-y-5">
                {sections.includes('skills') && (
                  <section>
                    {renderHeading(getSectionTitle('skills'))}
                    <TwoColumnSkillsContent cv={cv} style={style} />
                  </section>
                )}
                {sections.includes('education') && (
                  <section>
                    {renderHeading(getSectionTitle('education'))}
                    <TwoColumnEducationContent cv={cv} style={style} />
                  </section>
                )}
                {sections.includes('certifications') && (
                  <section>
                    {renderHeading(getSectionTitle('certifications'))}
                    <TwoColumnCertificationsContent cv={cv} style={style} />
                  </section>
                )}
              </div>

              {/* Right Column (Main): 7 cols (~60% width) */}
              <div className="col-span-1 sm:col-span-7 space-y-5">
                {sections.includes('summary') && (
                  <section>
                    {renderHeading(getSectionTitle('summary'))}
                    <SummarySectionContent cv={cv} style={style} />
                  </section>
                )}
                {sections.includes('experience') && (
                  <section>
                    {renderHeading(getSectionTitle('experience'))}
                    <ExperienceSectionContent cv={cv} style={style} />
                  </section>
                )}
                {sections.includes('projects') && (
                  <section>
                    {renderHeading(getSectionTitle('projects'))}
                    <ProjectsSectionContent cv={cv} style={style} />
                  </section>
                )}
              </div>
            </div>
          ) : (
            /* Standard Single-Column Flow */
            <div className="space-y-3.5 pt-1">
              {sections.map((id) => (
                <section key={id} className={style.gap}>
                  {renderHeading(getSectionTitle(id))}
                  <SectionContent id={id} cv={cv} style={style} />
                </section>
              ))}
            </div>
          )}
        </article>
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
  if (id === 'certifications') return <CertificationsSectionContent cv={cv} style={style} />;
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
      {cv.experience.map((item, index) => {
        const cleanLoc = cleanLocationText(item.location);
        return (
          <div key={item.id} className={index === 0 ? style.itemGap : 'mt-2.5'}>
            {/* Top row: Role + Date range */}
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
              <p className={style.itemTitle}>{item.role}</p>
              <span className={`shrink-0 text-right ${style.meta}`}>
                {formatDateRange(item.startDate, item.endDate, item.current)}
              </span>
            </div>
            {/* Second row: Company + Clean Location */}
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
              {item.companyUrl ? (
                <a
                  href={formatUrl(item.companyUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${style.itemSub} hover:underline font-semibold text-blue-600 dark:text-blue-400`}
                >
                  {item.company}
                </a>
              ) : (
                <p className={style.itemSub}>{item.company}</p>
              )}
              {cleanLoc && <span className={`shrink-0 text-right ${style.itemSub}`}>{cleanLoc}</span>}
            </div>
            <Bullets bullets={item.bullets} style={style} />
          </div>
        );
      })}
    </div>
  );
}

function EducationSectionContent({ cv, style }: { cv: CVData; style: StyleConfig }) {
  if (cv.education.length === 0) return null;
  return (
    <div className="space-y-2.5">
      {cv.education.map((item, index) => {
        const cleanLoc = cleanLocationText(item.location);
        return (
          <div key={item.id} className={index === 0 ? style.itemGap : 'mt-2'}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
              <p className={style.itemTitle}>
                {item.degree} {item.major && `in ${item.major}`}
              </p>
              <span className={`shrink-0 text-right ${style.meta}`}>
                {formatDateRange(item.startDate, item.endDate, false)}
              </span>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
              <p className={style.itemSub}>{item.institution}</p>
              {cleanLoc && <span className={`shrink-0 text-right ${style.itemSub}`}>{cleanLoc}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProjectsSectionContent({ cv, style }: { cv: CVData; style: StyleConfig }) {
  if (cv.projects.length === 0) return null;

  const formatUrl = (url?: string) => {
    if (!url) return '';
    const u = url.trim();
    return u.startsWith('http://') || u.startsWith('https://') ? u : `https://${u}`;
  };

  return (
    <div className="space-y-3">
      {cv.projects.map((item, index) => (
        <div key={item.id} className={index === 0 ? style.itemGap : 'mt-2.5'}>
          {/* Top row: Project Title & Links on left, Technologies on right */}
          <div className="flex items-start justify-between gap-x-4 gap-y-1">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <span className={style.itemTitle}>{item.title}</span>
                {item.github && (
                  <a
                    href={formatUrl(item.github)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-[11px] font-semibold inline-flex items-center gap-0.5"
                  >
                    <span>GitHub</span>
                    <span className="text-[9px]">↗</span>
                  </a>
                )}
                {item.link && (
                  <a
                    href={formatUrl(item.link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-[11px] font-semibold inline-flex items-center gap-0.5"
                  >
                    <span>Live Demo</span>
                    <span className="text-[9px]">↗</span>
                  </a>
                )}
              </div>
            </div>
            {item.technologies && item.technologies.length > 0 && (
              <span className={`shrink-0 text-right ${style.meta} max-w-[45%]`}>
                {item.technologies.join(', ')}
              </span>
            )}
          </div>
          <Bullets bullets={item.bullets} style={style} />
        </div>
      ))}
    </div>
  );
}

/** Standard single-column skills content */
function SkillsSectionContent({ cv, style }: { cv: CVData; style: StyleConfig }) {
  if (cv.skills.length === 0) return null;
  return (
    <div className={`${style.itemGap}`}>
      {cv.skillsSummary && (
        <p className={`mb-2 ${style.body}`}>{cv.skillsSummary}</p>
      )}
      <dl className="space-y-2">
        {cv.skills.map((group) => (
          <div key={group.id} className="flex flex-wrap sm:flex-nowrap gap-x-2.5 gap-y-1">
            <dt className={`font-bold text-slate-900 dark:text-white shrink-0 ${style.body}`}>
              {group.label}:
            </dt>
            {style.skillsVariant === 'chips' ? (
              <dd className="flex flex-wrap gap-1.5 flex-1">
                {group.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[11px] font-medium border border-slate-200/80 dark:border-white/10"
                  >
                    {s}
                  </span>
                ))}
              </dd>
            ) : (
              <dd className={style.body}>{group.skills.join(', ')}</dd>
            )}
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Spacious Stacked Skills Layout specifically for Two-Column Sidebar */
function TwoColumnSkillsContent({ cv, style }: { cv: CVData; style: StyleConfig }) {
  if (cv.skills.length === 0) return null;
  return (
    <div className="mt-2 space-y-3">
      {cv.skillsSummary && (
        <p className="mb-2 text-[10.5px] leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
          {cv.skillsSummary}
        </p>
      )}
      {cv.skills.map((group) => (
        <div key={group.id} className="space-y-1">
          <dt className="font-bold text-slate-900 dark:text-white text-[11px] block">
            {group.label}
          </dt>
          <dd className="flex flex-wrap gap-1">
            {group.skills.map((s, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-medium border border-slate-200 dark:border-white/10 shadow-2xs"
              >
                {s}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </div>
  );
}

/** Clean Stacked Education Layout for Two-Column Sidebar */
function TwoColumnEducationContent({ cv, style }: { cv: CVData; style: StyleConfig }) {
  if (cv.education.length === 0) return null;
  return (
    <div className="mt-2 space-y-2.5">
      {cv.education.map((item) => {
        const cleanLoc = cleanLocationText(item.location);
        return (
          <div key={item.id} className="space-y-0.5">
            <p className="font-bold text-slate-900 dark:text-white text-[11.5px] leading-snug">
              {item.degree} {item.major && `(${item.major})`}
            </p>
            <p className="italic text-slate-700 dark:text-slate-300 text-[11px]">
              {item.institution}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              {formatDateRange(item.startDate, item.endDate, false)}
              {cleanLoc && ` • ${cleanLoc}`}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/** Clean Stacked Certifications Layout for Two-Column Sidebar */
function TwoColumnCertificationsContent({ cv, style }: { cv: CVData; style: StyleConfig }) {
  const certs = cv.certifications || [];
  if (certs.length === 0) return null;

  const fmtUrl = (url?: string) => {
    if (!url) return '';
    const u = url.trim();
    return u.startsWith('http://') || u.startsWith('https://') ? u : `https://${u}`;
  };

  return (
    <div className="mt-2 space-y-2.5">
      {certs.map((cert) => (
        <div key={cert.id} className="space-y-0.5">
          <p className="font-bold text-slate-900 dark:text-white text-[11.5px] leading-snug">
            {cert.name}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-1 text-[10.5px] text-slate-600 dark:text-slate-400">
            {cert.issuer && <span className="italic">{cert.issuer}</span>}
            {cert.date && <span className="font-medium">{cert.date}</span>}
          </div>
          {cert.url && (
            <a
              href={fmtUrl(cert.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-blue-600 dark:text-blue-400 text-[10.5px] font-semibold hover:underline"
            >
              <span>Verify</span>
              <span className="text-[9px]">↗</span>
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

function CertificationsSectionContent({ cv, style }: { cv: CVData; style: StyleConfig }) {
  const certs = cv.certifications || [];
  if (certs.length === 0) return null;

  const fmtUrl = (url?: string) => {
    if (!url) return '';
    const u = url.trim();
    return u.startsWith('http://') || u.startsWith('https://') ? u : `https://${u}`;
  };

  return (
    <div className={`${style.itemGap} space-y-1.5`}>
      {certs.map((cert) => (
        <div key={cert.id} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className={style.body}>{cert.name}</span>
            {cert.issuer && (
              <span className={`${style.meta} italic`}>— {cert.issuer}</span>
            )}
            {cert.url && (
              <a
                href={fmtUrl(cert.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 underline text-[11px] font-medium"
              >
                Verify ↗
              </a>
            )}
          </div>
          {cert.date && (
            <span className={`shrink-0 text-right ${style.meta}`}>{cert.date}</span>
          )}
        </div>
      ))}
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
    <ul className={`mt-1 space-y-0.5 ${style.body}`}>
      {items.map((bullet, index) => (
        <li key={index} className="flex items-start gap-2">
          <span className="text-slate-900 dark:text-blue-400 font-bold select-none text-[13px] leading-[1.3]">•</span>
          <span className="leading-relaxed">{bullet}</span>
        </li>
      ))}
    </ul>
  );
}

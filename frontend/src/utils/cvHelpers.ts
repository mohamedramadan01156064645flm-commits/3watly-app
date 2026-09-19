import type { CVData, SectionId } from '../types/cv';

export function uid(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

const MONTHS = [
  'Jan', 'January',
  'Feb', 'February',
  'Mar', 'March',
  'Apr', 'April',
  'May',
  'Jun', 'June',
  'Jul', 'July',
  'Aug', 'August',
  'Sep', 'September',
  'Oct', 'October',
  'Nov', 'November',
  'Dec', 'December'
];

export const MONTH_OPTIONS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/** A parser-safe date looks like "Mar 2024", "September 2022", "2024", or "Present". */
export function isCleanDate(value: string): boolean {
  const v = value.trim();
  if (v === '' || v === 'Present' || /present|now|حالياً/i.test(v)) return true;
  if (/^\d{4}(\s*[-–—]\s*\d{4})?$/.test(v)) return true;
  return new RegExp(`^(${MONTHS.join('|')})\\s+\\d{4}$`, 'i').test(v);
}

export function hasMetric(text: string): boolean {
  return /\d/.test(text);
}

export function hasSectionContent(cv: CVData, id: SectionId): boolean {
  switch (id) {
    case 'contact':
      return Boolean(cv.contact.fullName || cv.contact.email || cv.contact.phone);
    case 'summary':
      return Boolean(cv.summary && cv.summary.trim().length > 0);
    case 'experience':
      return Boolean(cv.experience && cv.experience.length > 0 && cv.experience.some(e => e.role?.trim() || e.company?.trim()));
    case 'education':
      return Boolean(cv.education && cv.education.length > 0 && cv.education.some(e => e.degree?.trim() || e.institution?.trim()));
    case 'projects':
      return Boolean(cv.projects && cv.projects.length > 0 && cv.projects.some(p => p.title?.trim() || (p.bullets && p.bullets.length > 0)));
    case 'skills':
      return Boolean(cv.skills && cv.skills.length > 0 && cv.skills.some(g => g.skills && g.skills.length > 0));
    case 'certifications':
      return Boolean(cv.certifications && cv.certifications.length > 0 && cv.certifications.some(c => c.name?.trim()));
    default:
      return true;
  }
}

export function visibleSections(cv: CVData): SectionId[] {
  return cv.sectionOrder.filter((id) => !cv.hiddenSections.includes(id) && hasSectionContent(cv, id));
}

export function totalSkills(cv: CVData): number {
  return cv.skills.reduce((sum, group) => sum + group.skills.length, 0);
}

export function experienceBullets(cv: CVData): string[] {
  const exp = (cv.experience || []).flatMap((item) => item.bullets || []);
  const prj = (cv.projects || []).flatMap((item) => item.bullets || []);
  return [...exp, ...prj];
}


/** Share of experience bullets that carry a measurable number. */
export function metricRatio(cv: CVData): number {
  const bullets = experienceBullets(cv).filter((b) => b.trim() !== '');
  if (bullets.length === 0) return 0;
  return bullets.filter(hasMetric).length / bullets.length;
}

export function cvToText(cv: CVData): string {
  const parts: string[] = [
    cv.contact.fullName,
    cv.contact.jobTitle,
    cv.contact.email,
    cv.contact.phone,
    cv.contact.location,
    cv.summary,
    cv.skillsSummary ?? ''
  ];

  if (Array.isArray(cv.contact.socialLinks)) {
    cv.contact.socialLinks.forEach((l) => {
      if (l.customLabel) parts.push(l.customLabel);
      if (l.platform) parts.push(l.platform);
    });
  }

  cv.experience.forEach((item) => {
    parts.push(item.role, item.company, item.location, ...item.bullets);
  });
  cv.education.forEach((item) => {
    parts.push(item.degree, item.institution, item.major);
  });
  cv.projects.forEach((item) => {
    parts.push(item.title, item.technologies.join(' '), ...item.bullets);
  });
  cv.skills.forEach((group) => {
    parts.push(group.label, group.skills.join(' '));
  });
  (cv.certifications || []).forEach((cert) => {
    parts.push(cert.name, cert.issuer);
  });
  return parts.filter(Boolean).join(' \n ');
}

export function containsKeyword(text: string, keyword: string): boolean {
  if (!text || !keyword) return false;
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i').test(text)) {
    return true;
  }
  // Robust check for punctuation/casing variants (e.g. "T-SQL" vs "TSQL", "Power-BI" vs "PowerBI")
  const normKw = keyword.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (normKw.length >= 3) {
    const normText = text.toLowerCase().replace(/[^a-z0-9]/g, ' ');
    if (new RegExp(`(^|\\s)${normKw}(\\s|$)`, 'i').test(normText)) {
      return true;
    }
  }
  return false;
}

const STRONGER_VERBS: Record<string, string> = {
  Supported: 'Facilitated',
  Helped: 'Contributed to',
  Assisted: 'Collaborated on',
  Created: 'Designed and built',
  Cleaned: 'Standardized',
  Worked: 'Delivered',
  Made: 'Developed',
  Did: 'Executed',
  Used: 'Leveraged',
  Got: 'Achieved',
  Managed: 'Oversaw',
  Wrote: 'Authored',
  Fixed: 'Resolved',
  Ran: 'Executed',
};

/** Qualitative suffixes — never invent fake percentages */
const IMPACT_SUFFIXES = [
  ', improving overall workflow efficiency',
  ', supporting data-driven business decisions',
  ', enhancing data quality and reliability',
  ', delivering actionable insights to stakeholders',
  ', strengthening team productivity and collaboration',
];

/**
 * Rewrites a bullet so it leads with a strong verb and ends with a meaningful
 * qualitative outcome. Deterministic — same input always produces the same output.
 */
export function enhanceBullet(text: string, seed = 0): string {
  let out = text.trim();
  if (out === '') return out;
  const firstWord = out.split(' ')[0];
  const stronger = STRONGER_VERBS[firstWord];
  if (stronger) out = `${stronger}${out.slice(firstWord.length)}`;
  if (hasMetric(out)) return out;
  const suffix = IMPACT_SUFFIXES[(out.length + seed) % IMPACT_SUFFIXES.length];
  out = out.replace(/[.\s]+$/, '');
  return `${out}${suffix}.`;
}

export interface SectionStatus {
  complete: boolean;
  count: number | null;
}

export function sectionStatus(cv: CVData, id: SectionId): SectionStatus {
  switch (id) {
    case 'contact':{
        const c = cv.contact;
        return {
          complete: Boolean(
            c.fullName && c.jobTitle && c.email && c.phone && c.location
          ),
          count: null
        };
      }
    case 'summary':
      return { complete: cv.summary.trim().length >= 80, count: null };
    case 'experience':
      return {
        complete:
        cv.experience.length > 0 &&
        cv.experience.every(
          (e) =>
          e.role.trim() !== '' &&
          e.company.trim() !== '' &&
          e.startDate.trim() !== '' &&
          e.bullets.filter((b) => b.trim() !== '').length >= 2
        ),
        count: cv.experience.length
      };
    case 'education':
      return {
        complete:
        cv.education.length > 0 &&
        cv.education.every(
          (e) => e.degree.trim() !== '' && e.institution.trim() !== ''
        ),
        count: cv.education.length
      };
    case 'projects':
      return {
        complete:
        cv.projects.length > 0 &&
        cv.projects.every(
          (p) =>
          p.title.trim() !== '' &&
          p.bullets.filter((b) => b.trim() !== '').length >= 1
        ),
        count: cv.projects.length
      };
    case 'skills':
      return { complete: totalSkills(cv) >= 5, count: totalSkills(cv) };
    case 'certifications':
      return {
        complete:
          (cv.certifications || []).length > 0 &&
          (cv.certifications || []).every((c) => c.name.trim() !== ''),
        count: (cv.certifications || []).length
      };
    default:
      return { complete: false, count: null };
  }
}

export function formatDateRange(
start: string,
end: string,
current: boolean)
: string {
  const from = start.trim() || '—';
  const to = current ? 'Present' : end.trim() || 'Present';
  return `${from} – ${to}`;
}
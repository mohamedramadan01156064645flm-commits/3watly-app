"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  MailIcon, 
  MapPinIcon, 
  PhoneIcon, 
  Briefcase, 
  GraduationCap, 
  Layers, 
  ExternalLink, 
  FolderGit2, 
  Award,
  Globe
} from 'lucide-react';
import type { ParsedCv } from '../../../types/onboarding';
import { useLanguage } from '@/contexts/LanguageContext';

function LinkedinIcon({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function GithubIcon({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function formatUrl(url?: string): string {
  if (!url) return '';
  const u = url.trim();
  return u.startsWith('http://') || u.startsWith('https://') ? u : `https://${u}`;
}

interface CvPreviewProps {
  cv: ParsedCv;
  scanning: boolean;
}

function SkeletonRow({ w = 'w-full', h = 'h-2.5' }: { w?: string; h?: string }) {
  return <div className={`${h} ${w} rounded-full bg-slate-200 dark:bg-slate-700/70 animate-pulse`} />;
}

export function CvPreview({ cv, scanning }: CvPreviewProps) {
  const { isAr } = useLanguage();

  // True when file just selected and API hasn't returned yet
  const isParsing = scanning && !cv.email && !cv.summary;

  // Real extracted fields
  const fullName = cv.fullName || '';
  const roleTitle = cv.currentTitle || cv.targetRole || '';
  const email = cv.email || '';
  const phone = cv.phone || '';
  const location = cv.location || '';
  const summary = cv.summary || '';

  // Extract and clean all social and personal profile links
  const socialLinks = React.useMemo(() => {
    const list: Array<{ id: string; platform: string; url: string; label: string }> = [];
    const isExcluded = (u?: string) => {
      if (!u) return true;
      const lower = u.toLowerCase().trim();
      if (lower.startsWith('tel:') || lower.startsWith('mailto:')) return true;
      if (lower.includes('your-profile')) return true;
      const digitsOnly = lower.replace(/[^\d]/g, '');
      if (phone && digitsOnly.length >= 8 && phone.replace(/[^\d]/g, '').includes(digitsOnly)) {
        return true;
      }
      return false;
    };

    if (Array.isArray(cv.socialLinks) && cv.socialLinks.length > 0) {
      cv.socialLinks.forEach((sl: any, idx: number) => {
        if (sl.url && !isExcluded(sl.url)) {
          list.push({
            id: sl.id || `sl-${idx}`,
            platform: sl.platform || 'Other',
            url: formatUrl(sl.url),
            label: sl.platform || 'Link'
          });
        }
      });
    }

    if (!list.some(l => l.platform.toLowerCase() === 'linkedin') && cv.linkedin && !isExcluded(cv.linkedin)) {
      list.push({ id: 'li', platform: 'LinkedIn', url: formatUrl(cv.linkedin), label: 'LinkedIn' });
    }
    if (!list.some(l => l.platform.toLowerCase() === 'github') && cv.github && !isExcluded(cv.github)) {
      list.push({ id: 'gh', platform: 'GitHub', url: formatUrl(cv.github), label: 'GitHub' });
    }
    if (!list.some(l => l.platform.toLowerCase() === 'portfolio') && cv.portfolio && !isExcluded(cv.portfolio)) {
      list.push({ id: 'pf', platform: 'Portfolio', url: formatUrl(cv.portfolio), label: 'Portfolio' });
    }

    // Deduplicate by clean url
    const seen = new Set<string>();
    return list.filter((item) => {
      const clean = item.url.toLowerCase().replace(/\/$/, '');
      if (seen.has(clean)) return false;
      seen.add(clean);
      return true;
    });
  }, [cv.socialLinks, cv.linkedin, cv.github, cv.portfolio, phone]);

  const experiencesList = cv.experiences && cv.experiences.length > 0
    ? cv.experiences
    : cv.experience
    ? [{
        id: 'exp-single',
        role: cv.experience.title,
        company: cv.experience.company,
        companyUrl: '',
        startDate: cv.experience.period?.split('—')?.[0]?.trim() || '',
        endDate: cv.experience.period?.split('—')?.[1]?.trim() || 'Present',
        current: true,
        location: cv.experience.location,
        bullets: cv.experience.bullets || []
      }]
    : [];

  const projectsList = Array.isArray(cv.projects) ? cv.projects : [];

  const educationList = cv.educationHistory && cv.educationHistory.length > 0
    ? cv.educationHistory
    : cv.education
    ? [{
        id: 'edu-single',
        degree: cv.education.degree,
        institution: cv.education.school,
        major: '',
        startDate: cv.education.period?.split('—')?.[0]?.trim() || '',
        endDate: cv.education.period?.split('—')?.[1]?.trim() || ''
      }]
    : [];

  const certificatesList = Array.isArray(cv.certificates) ? cv.certificates : [];

  const skillsList = cv.skills && cv.skills.length > 0
    ? cv.skills
    : cv.detectedSkills?.map((s) => s.name) || [];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-xs transition-all select-none">

      {/* Electric Blue Laser Scan Beam — shown always while scanning */}
      {scanning && (
        <>
          {/* Transparent Blue Gradient Sweep */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 h-28 bg-gradient-to-b from-blue-500/10 via-cyan-400/15 to-transparent z-10"
            initial={{ top: '-10%' }}
            animate={{ top: ['-10%', '85%', '-10%'] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Glowing Electric Blue Laser Line */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 h-[3.5px] bg-gradient-to-r from-transparent via-cyan-300 via-blue-500 to-transparent shadow-[0_0_24px_6px_rgba(59,130,246,0.9),0_0_8px_2px_rgba(6,182,212,0.8)] z-20"
            initial={{ top: '3%' }}
            animate={{ top: ['3%', '95%', '3%'] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* Scrollable CV Paper */}
      <div
        className="max-h-[520px] overflow-y-auto [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 hover:[&::-webkit-scrollbar-thumb]:bg-blue-500 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {isParsing ? (
          /* ======== SKELETON while API is running ======== */
          <div className="space-y-4 py-1">
            <div className="border-b border-slate-100 dark:border-white/10 pb-3 space-y-2">
              <SkeletonRow w="w-48" h="h-4" />
              <SkeletonRow w="w-32" h="h-3" />
              <div className="flex gap-3 mt-2">
                <SkeletonRow w="w-28" h="h-2.5" />
                <SkeletonRow w="w-24" h="h-2.5" />
                <SkeletonRow w="w-20" h="h-2.5" />
              </div>
            </div>
            <div className="space-y-1.5">
              <SkeletonRow w="w-24" h="h-2" />
              <SkeletonRow w="w-full" />
              <SkeletonRow w="w-5/6" />
              <SkeletonRow w="w-4/5" />
            </div>
            <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-white/5">
              <SkeletonRow w="w-28" h="h-2" />
              <div className="flex justify-between gap-4">
                <SkeletonRow w="w-36" h="h-3" />
                <SkeletonRow w="w-24" h="h-2.5" />
              </div>
              <SkeletonRow w="w-32" h="h-2.5" />
              <SkeletonRow w="w-full" />
              <SkeletonRow w="w-5/6" />
            </div>
          </div>
        ) : (
          /* ======== REAL CV DATA after API returns ======== */
          <div className="space-y-4 text-slate-900 dark:text-white">

            {/* Header */}
            <header className="border-b border-slate-100 dark:border-white/10 pb-3.5">
              <h2 className="text-[18px] font-black tracking-tight text-slate-900 dark:text-white uppercase font-sans">
                {fullName || 'Candidate Name'}
              </h2>
              {roleTitle && (
                <p className="mt-0.5 text-[13px] font-bold text-blue-600 dark:text-blue-400 font-sans">
                  {roleTitle}
                </p>
              )}
              
              {/* Primary Contact Row */}
              <ul className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600 dark:text-slate-400 font-sans">
                {email && (
                  <li className="flex items-center gap-1">
                    <MailIcon className="h-3 w-3 text-slate-400" />
                    <span>{email}</span>
                  </li>
                )}
                {phone && (
                  <li className="flex items-center gap-1">
                    <PhoneIcon className="h-3 w-3 text-slate-400" />
                    <span dir="ltr">{phone}</span>
                  </li>
                )}
                {location && (
                  <li className="flex items-center gap-1">
                    <MapPinIcon className="h-3 w-3 text-slate-400" />
                    <span>{location}</span>
                  </li>
                )}
              </ul>

              {/* Social and Profile Links (LinkedIn, GitHub, Portfolio, etc.) */}
              {socialLinks.length > 0 && (
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 pt-1 font-sans">
                  {socialLinks.map((item) => {
                    const isLi = item.platform.toLowerCase() === 'linkedin';
                    const isGh = item.platform.toLowerCase() === 'github';
                    const isPf = item.platform.toLowerCase() === 'portfolio' || item.platform.toLowerCase() === 'personal';

                    return (
                      <a
                        key={item.id}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/80 dark:border-white/10 text-[11px] font-semibold transition-all shadow-2xs group"
                      >
                        {isLi && <LinkedinIcon className="h-3 w-3 text-[#0A66C2]" />}
                        {isGh && <GithubIcon className="h-3 w-3 text-slate-900 dark:text-white" />}
                        {isPf && <Globe className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />}
                        {!isLi && !isGh && !isPf && <ExternalLink className="h-3 w-3 text-slate-400" />}
                        <span>{item.label}</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </header>

            {/* Summary */}
            {summary && (
              <section className="space-y-1 font-sans">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {isAr ? "الملخص المهني" : "PROFESSIONAL SUMMARY"}
                </h3>
                <p className="text-[11.5px] leading-[1.6] text-slate-600 dark:text-slate-300">
                  {summary}
                </p>
              </section>
            )}

            {/* Work Experience */}
            {experiencesList.length > 0 && (
              <section className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-white/5">
                <h3 className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-sans flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                  <span>{isAr ? "الخبرات المهنية" : "WORK EXPERIENCE"}</span>
                </h3>
                <div className="space-y-3">
                  {experiencesList.map((exp, idx) => (
                    <div key={idx} className="space-y-1 font-sans">
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className="text-[12.5px] font-bold text-slate-900 dark:text-white">
                          {exp.role}
                        </h4>
                        <span className="text-[10.5px] font-medium text-slate-400 shrink-0">
                          {exp.startDate ? `${exp.startDate} — ${exp.endDate || 'Present'}` : ''}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {exp.companyUrl ? (
                          <a
                            href={formatUrl(exp.companyUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <span>{exp.company}</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        ) : (
                          <span className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300">
                            {exp.company}
                          </span>
                        )}
                        {exp.location && (
                          <span className="text-[10.5px] text-slate-400">
                            • {exp.location}
                          </span>
                        )}
                      </div>
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className="mt-1 space-y-1">
                          {exp.bullets.map((b, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects Section with GitHub & Live Demo Links */}
            {projectsList.length > 0 && (
              <section className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-white/5">
                <h3 className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-sans flex items-center gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>{isAr ? "المشاريع العملية" : "PROJECTS"}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({projectsList.length})</span>
                </h3>
                <div className="space-y-3 font-sans">
                  {projectsList.map((project, idx) => (
                    <div key={project.id || idx} className="space-y-1.5 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] p-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-[12px] font-bold text-slate-900 dark:text-white">
                          {project.title}
                        </h4>
                        
                        {/* Project Repo & Live Demo Links */}
                        <div className="flex items-center gap-1.5">
                          {project.github && (
                            <a
                              href={formatUrl(project.github)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-white/10 hover:bg-blue-100 dark:hover:bg-blue-950 text-slate-800 dark:text-slate-200 text-[10.5px] font-semibold transition-colors"
                              title="GitHub Repository"
                            >
                              <GithubIcon className="h-2.5 w-2.5" />
                              <span>GitHub</span>
                            </a>
                          )}
                          {project.link && (
                            <a
                              href={formatUrl(project.link)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100/70 dark:bg-blue-950/70 hover:bg-blue-200 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 text-[10.5px] font-bold transition-colors"
                              title="Live Demo"
                            >
                              <ExternalLink className="h-2.5 w-2.5" />
                              <span>Live Demo</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Technologies Tags */}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((t, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-1.5 py-0.2 rounded text-[9.5px] font-medium bg-slate-200/50 dark:bg-white/5 text-slate-600 dark:text-slate-400"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Project Bullets */}
                      {project.bullets && project.bullets.length > 0 && (
                        <ul className="space-y-1 pt-0.5">
                          {project.bullets.map((b, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-1.5 text-[10.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-indigo-500" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {educationList.length > 0 && (
              <section className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
                <h3 className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-sans flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isAr ? "التعليم" : "EDUCATION"}</span>
                </h3>
                <div className="space-y-2 font-sans">
                  {educationList.map((edu, idx) => (
                    <div key={idx} className="flex items-baseline justify-between gap-2">
                      <div>
                        <h4 className="text-[11.5px] font-bold text-slate-900 dark:text-white">
                          {edu.degree}{edu.major ? ` in ${edu.major}` : ''}
                        </h4>
                        <p className="text-[10.5px] text-slate-500">{edu.institution}</p>
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 shrink-0">
                        {edu.startDate ? `${edu.startDate} — ${edu.endDate}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certificates Section */}
            {certificatesList.length > 0 && (
              <section className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5 font-sans">
                <h3 className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isAr ? "الشهادات والاعتمادات" : "CERTIFICATES & CREDENTIALS"}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({certificatesList.length})</span>
                </h3>
                <div className="space-y-1.5">
                  {certificatesList.map((cert, idx) => (
                    <div key={cert.id || idx} className="flex items-baseline justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{cert.name}</span>
                        {cert.issuer && (
                          <span className="text-[10px] text-slate-400">({cert.issuer})</span>
                        )}
                        {cert.url && (
                          <a
                            href={formatUrl(cert.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                            title="Verify credential"
                          >
                            <ExternalLink className="h-2.5 w-2.5 inline" />
                          </a>
                        )}
                      </div>
                      {cert.date && (
                        <span className="text-[10px] text-slate-400 shrink-0">{cert.date}</span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {skillsList.length > 0 && (
              <section className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-white/5 font-sans">
                <h3 className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span>{isAr ? "المهارات والتقنيات" : "SKILLS & TECHNOLOGIES"}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({skillsList.length})</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {skillsList.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 text-[10.5px] font-bold border border-blue-100 dark:border-blue-500/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
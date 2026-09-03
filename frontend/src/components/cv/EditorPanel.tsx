"use client";

import React, { useState } from 'react';
import {
  BriefcaseIcon,
  ClipboardCheckIcon,
  GraduationCapIcon,
  LayoutGridIcon,
  ListOrderedIcon,
  SparklesIcon,
  UserIcon } from
'lucide-react';
import { useCV } from '../../contexts/CVContext';
import { SECTION_META } from '../../data/cvData';
import { sectionStatus } from '../../utils/cvHelpers';
import type { SectionId } from '../../types/cv';
import { SectionRow } from './SectionRow';
import { ReorderModal } from './ReorderModal';
import { ContactSection } from './sections/ContactSection';
import { SummarySection } from './sections/SummarySection';
import { ExperienceSection } from './sections/ExperienceSection';
import { EducationSection } from './sections/EducationSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { SkillsSection } from './sections/SkillsSection';

const ICONS: Record<SectionId, React.ComponentType<{className?: string;}>> = {
  contact: UserIcon,
  summary: SparklesIcon,
  experience: BriefcaseIcon,
  education: GraduationCapIcon,
  projects: ClipboardCheckIcon,
  skills: LayoutGridIcon
};

const PANELS: Record<SectionId, React.ComponentType> = {
  contact: ContactSection,
  summary: SummarySection,
  experience: ExperienceSection,
  education: EducationSection,
  projects: ProjectsSection,
  skills: SkillsSection
};

export function EditorPanel() {
  const { cv } = useCV();
  const [open, setOpen] = useState<SectionId[]>(['contact']);
  const [reorderOpen, setReorderOpen] = useState(false);

  const toggle = (id: SectionId) =>
    setOpen((current) =>
      current.includes(id)
        ? current.filter((s) => s !== id)
        : [...current, id]
    );

  return (
    <div>
      <div className="divide-y divide-slate-200 dark:divide-white/10 overflow-hidden rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] shadow-card">
        {/* 1. Header & Contact Information (Personal Info & Links) */}
        <SectionRow
          key="contact"
          id="contact"
          label={SECTION_META['contact'].label || 'Header & Contact Information'}
          icon={ICONS['contact']}
          open={open.includes('contact')}
          onToggle={() => toggle('contact')}
          complete={Boolean(cv.contact.fullName.trim() && cv.contact.email.trim())}
          badge={
            <span className="rounded-md bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:text-blue-400">
              Header
            </span>
          }
        >
          <ContactSection />
        </SectionRow>

        {/* 2. Content Sections */}
        {cv.sectionOrder.map((id) => {
          if (id === 'contact') return null;
          const status = sectionStatus(cv, id);
          const Panel = PANELS[id];
          const hidden = cv.hiddenSections.includes(id);
          return (
            <SectionRow
              key={id}
              id={id}
              label={SECTION_META[id].label}
              icon={ICONS[id]}
              open={open.includes(id)}
              onToggle={() => toggle(id)}
              complete={status.complete}
              count={status.count}
              badge={
                <>
                  {id === 'summary' && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-violet-50 dark:bg-violet-950/60 px-2 py-0.5 text-[11px] font-semibold text-violet-700 dark:text-violet-400">
                      <SparklesIcon className="h-3 w-3" aria-hidden="true" />
                      AI Assisted
                    </span>
                  )}
                  {hidden && (
                    <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                      Hidden
                    </span>
                  )}
                </>
              }
            >
              <Panel />
            </SectionRow>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setReorderOpen(true)}
        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-card transition-colors duration-150 ease-smooth hover:bg-slate-50 dark:bg-[#070C18]">
        
        <ListOrderedIcon
          className="h-4 w-4 text-slate-500"
          aria-hidden="true" />
        
        Reorder Sections
      </button>

      <ReorderModal
        open={reorderOpen}
        onClose={() => setReorderOpen(false)} />
      
    </div>);

}

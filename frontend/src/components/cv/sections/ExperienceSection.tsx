"use client";

import React from 'react';
import { PlusIcon } from 'lucide-react';
import { useCV } from '../../../contexts/CVContext';
import { TextField } from '../../ui/Field';
import { BulletList } from '../BulletList';
import { ItemShell } from '../ItemShell';
import { AIEnhanceButton } from '../AIEnhanceButton';
import { enhanceBullet, isCleanDate, uid } from '../../../utils/cvHelpers';
import type { ExperienceItem } from '../../../types/cv';

const EMPTY: Omit<ExperienceItem, 'id'> = {
  role: '',
  company: '',
  startDate: '',
  endDate: '',
  current: true,
  location: '',
  bullets: ['']
};

export function ExperienceSection() {
  const { cv, update } = useCV();

  const patch = (id: string, changes: Partial<ExperienceItem>, label: string) =>
  update(
    (prev) => ({
      ...prev,
      experience: prev.experience.map((item) =>
      item.id === id ? { ...item, ...changes } : item
      )
    }),
    `${label}-${id}`
  );

  return (
    <div>
      {cv.experience.map((item, index) =>
      <ItemShell
        key={item.id}
        first={index === 0}
        label={`Role ${index + 1}`}
        onDuplicate={() =>
        update((prev) => {
          const copy = { ...item, id: uid('exp'), bullets: [...item.bullets] };
          const next = [...prev.experience];
          next.splice(index + 1, 0, copy);
          return { ...prev, experience: next };
        })
        }
        onDelete={() =>
        update((prev) => ({
          ...prev,
          experience: prev.experience.filter((e) => e.id !== item.id)
        }))
        }>
        
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField
            label="Job Title"
            value={item.role}
            onChange={(value) => patch(item.id, { role: value }, 'role')}
            placeholder="Data Analyst" />
          
            <TextField
            label="Company"
            value={item.company}
            onChange={(value) => patch(item.id, { company: value }, 'company')}
            placeholder="Vodafone Egypt" />
          
            <TextField
            label="Start Date"
            value={item.startDate}
            onChange={(value) =>
            patch(item.id, { startDate: value }, 'start')
            }
            placeholder="Jan 2023"
            invalid={!isCleanDate(item.startDate)}
            error={
            isCleanDate(item.startDate) ?
            undefined :
            'Use the ATS-safe format "Jan 2023".'
            } />
          
            <div>
              <TextField
              label="End Date"
              value={item.current ? 'Present' : item.endDate}
              onChange={(value) => {
                if (item.current) return;
                patch(item.id, { endDate: value }, 'end');
              }}
              placeholder="Dec 2024"
              invalid={!item.current && !isCleanDate(item.endDate)}
              error={
              !item.current && !isCleanDate(item.endDate) ?
              'Use the ATS-safe format "Dec 2024".' :
              undefined
              } />
            
              <label className="mt-2 flex items-center gap-2 text-[13px] text-slate-600">
                <input
                type="checkbox"
                checked={item.current}
                onChange={(event) =>
                patch(item.id, { current: event.target.checked }, 'current')
                }
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
              
                I currently work here
              </label>
            </div>
            <TextField
            className="sm:col-span-2"
            label="Location"
            value={item.location}
            onChange={(value) =>
            patch(item.id, { location: value }, 'location')
            }
            placeholder="Cairo, Egypt (Hybrid)" />
          
          </div>

          <p className="mb-2 mt-4 text-[13px] font-medium text-slate-600">
            Impact Bullets
          </p>
          <BulletList
          bullets={item.bullets}
          itemLabel="bullet"
          onChange={(bullets) => patch(item.id, { bullets }, 'bullets')}
          footer={
          <AIEnhanceButton
            label="Enhance Impact Bullets"
            hint="AI will improve clarity, impact, and metrics."
            onEnhance={() => {
              patch(
                item.id,
                {
                  bullets: item.bullets.map((bullet, i) =>
                  enhanceBullet(bullet, i)
                  )
                },
                'bullets-ai'
              );
              return `Bullets for ${item.role || 'this role'} now lead with strong verbs and metrics.`;
            }} />

          } />
        
        </ItemShell>
      )}

      <button
        type="button"
        onClick={() =>
        update((prev) => ({
          ...prev,
          experience: [...prev.experience, { ...EMPTY, id: uid('exp') }]
        }))
        }
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-500 transition-colors duration-150 ease-smooth hover:border-brand-400 hover:text-brand-600">
        
        <PlusIcon className="h-4 w-4" aria-hidden="true" />
        Add Another Role
      </button>
    </div>);

}

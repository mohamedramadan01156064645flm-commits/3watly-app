"use client";

import React from 'react';
import { PlusIcon } from 'lucide-react';
import { useCV } from '../../../contexts/CVContext';
import { TextField } from '../../ui/Field';
import { ItemShell } from '../ItemShell';
import { isCleanDate, uid } from '../../../utils/cvHelpers';
import type { EducationItem } from '../../../types/cv';

const EMPTY: Omit<EducationItem, 'id'> = {
  degree: '',
  institution: '',
  startDate: '',
  endDate: '',
  location: '',
  major: ''
};

export function EducationSection() {
  const { cv, update } = useCV();

  const patch = (id: string, changes: Partial<EducationItem>, label: string) =>
  update(
    (prev) => ({
      ...prev,
      education: prev.education.map((item) =>
      item.id === id ? { ...item, ...changes } : item
      )
    }),
    `${label}-${id}`
  );

  return (
    <div>
      {cv.education.map((item, index) =>
      <ItemShell
        key={item.id}
        first={index === 0}
        label={`Degree ${index + 1}`}
        onDuplicate={() =>
        update((prev) => {
          const next = [...prev.education];
          next.splice(index + 1, 0, { ...item, id: uid('edu') });
          return { ...prev, education: next };
        })
        }
        onDelete={() =>
        update((prev) => ({
          ...prev,
          education: prev.education.filter((e) => e.id !== item.id)
        }))
        }>
        
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField
            className="sm:col-span-2"
            label="Degree"
            value={item.degree}
            onChange={(value) => patch(item.id, { degree: value }, 'degree')}
            placeholder="Bachelor of Business Administration (BBA)" />
          
            <TextField
            label="Institution"
            value={item.institution}
            onChange={(value) =>
            patch(item.id, { institution: value }, 'institution')
            }
            placeholder="The American University in Cairo" />
          
            <TextField
            label="Major"
            value={item.major}
            onChange={(value) => patch(item.id, { major: value }, 'major')}
            placeholder="Management Information Systems" />
          
            <TextField
            label="Start Date"
            value={item.startDate}
            onChange={(value) =>
            patch(item.id, { startDate: value }, 'edu-start')
            }
            placeholder="Sep 2017"
            invalid={!isCleanDate(item.startDate)}
            error={
            isCleanDate(item.startDate) ?
            undefined :
            'Use the ATS-safe format "Sep 2017".'
            } />
          
            <TextField
            label="End Date"
            value={item.endDate}
            onChange={(value) =>
            patch(item.id, { endDate: value }, 'edu-end')
            }
            placeholder="May 2021"
            invalid={!isCleanDate(item.endDate)}
            error={
            isCleanDate(item.endDate) ?
            undefined :
            'Use the ATS-safe format "May 2021".'
            } />
          
            <TextField
            className="sm:col-span-2"
            label="Location"
            value={item.location}
            onChange={(value) =>
            patch(item.id, { location: value }, 'edu-location')
            }
            placeholder="Cairo, Egypt" />
          
          </div>
        </ItemShell>
      )}

      <button
        type="button"
        onClick={() =>
        update((prev) => ({
          ...prev,
          education: [...prev.education, { ...EMPTY, id: uid('edu') }]
        }))
        }
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-500 transition-colors duration-150 ease-smooth hover:border-brand-400 hover:text-brand-600">
        
        <PlusIcon className="h-4 w-4" aria-hidden="true" />
        Add Another Degree
      </button>
    </div>);

}

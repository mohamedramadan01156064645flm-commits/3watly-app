"use client";

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PlusIcon, SparklesIcon } from 'lucide-react';
import { useCV } from '../../../contexts/CVContext';
import { CONTROL_CLASS } from '../../ui/Field';
import { TagInput } from '../../ui/TagInput';
import { BulletList } from '../BulletList';
import { ItemShell } from '../ItemShell';
import { AIEnhanceButton } from '../AIEnhanceButton';
import { enhanceBullet, uid } from '../../../utils/cvHelpers';
import type { ProjectItem } from '../../../types/cv';

const EMPTY: Omit<ProjectItem, 'id'> = {
  title: '',
  technologies: [],
  bullets: ['']
};

const TIPS = [
'Open each bullet with the outcome, not the tool.',
'Name the data volume or audience the project served.',
'Close with a number: time saved, revenue, accuracy, adoption.'];


export function ProjectsSection() {
  const { cv, update } = useCV();
  const [tipsFor, setTipsFor] = useState<string | null>(null);

  const patch = (id: string, changes: Partial<ProjectItem>, label: string) =>
  update(
    (prev) => ({
      ...prev,
      projects: prev.projects.map((item) =>
      item.id === id ? { ...item, ...changes } : item
      )
    }),
    `${label}-${id}`
  );

  return (
    <div>
      {cv.projects.map((item, index) =>
      <ItemShell
        key={item.id}
        first={index === 0}
        label="Project Title"
        onDuplicate={() =>
        update((prev) => {
          const next = [...prev.projects];
          next.splice(index + 1, 0, {
            ...item,
            id: uid('prj'),
            bullets: [...item.bullets],
            technologies: [...item.technologies]
          });
          return { ...prev, projects: next };
        })
        }
        onDelete={() =>
        update((prev) => ({
          ...prev,
          projects: prev.projects.filter((p) => p.id !== item.id)
        }))
        }>
        
          <input
            value={item.title}
            aria-label={`Project ${index + 1} title`}
            placeholder="Axon: End-to-End Alzheimer's Detection System"
            onChange={(event) =>
              patch(item.id, { title: event.target.value }, 'title')
            }
            className={CONTROL_CLASS}
          />

          {/* Project Links (GitHub & Live Demo) */}
          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div>
              <label className="block text-[11.5px] font-medium text-slate-500 mb-1">
                GitHub Repository URL (optional)
              </label>
              <input
                value={item.github || ''}
                placeholder="https://github.com/user/repo"
                onChange={(event) =>
                  patch(item.id, { github: event.target.value }, 'github')
                }
                className={CONTROL_CLASS}
              />
            </div>
            <div>
              <label className="block text-[11.5px] font-medium text-slate-500 mb-1">
                Live Demo / App URL (optional)
              </label>
              <input
                value={item.link || ''}
                placeholder="https://huggingface.co/spaces/..."
                onChange={(event) =>
                  patch(item.id, { link: event.target.value }, 'link')
                }
                className={CONTROL_CLASS}
              />
            </div>
          </div>

          <div className="mt-3">
            <TagInput
              label="Technologies Used"
              tags={item.technologies}
              emptyHint="No tools added yet."
              onChange={(technologies) =>
                patch(item.id, { technologies }, 'tech')
              }
            />
          </div>


          <div className="mb-2 mt-4 flex items-center justify-between gap-3">
            <p className="text-[13px] font-medium text-slate-600">
              Project Description
            </p>
            <button
            type="button"
            aria-expanded={tipsFor === item.id}
            onClick={() =>
            setTipsFor((current) => current === item.id ? null : item.id)
            }
            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors duration-150 ease-smooth ${
            tipsFor === item.id ?
            'border-violet-200 bg-violet-50 text-violet-700' :
            'border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-violet-700'}`
            }>
            
              <SparklesIcon className="h-3.5 w-3.5" aria-hidden="true" />
              AI Tips
            </button>
          </div>

          <AnimatePresence initial={false}>
            {tipsFor === item.id &&
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="mb-3 overflow-hidden rounded-lg border border-violet-100 bg-violet-50 px-4 py-3 text-[13px] leading-relaxed text-violet-900">
            
                {TIPS.map((tip) =>
            <li key={tip} className="flex gap-2 py-0.5">
                    <span aria-hidden="true">•</span>
                    {tip}
                  </li>
            )}
              </motion.ul>
          }
          </AnimatePresence>

          <BulletList
          bullets={item.bullets}
          itemLabel="bullet"
          onChange={(bullets) => patch(item.id, { bullets }, 'prj-bullets')}
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
                'prj-bullets-ai'
              );
              return `Bullets for ${item.title || 'this project'} now lead with strong verbs and metrics.`;
            }} />

          } />
        
        </ItemShell>
      )}

      <button
        type="button"
        onClick={() =>
        update((prev) => ({
          ...prev,
          projects: [...prev.projects, { ...EMPTY, id: uid('prj') }]
        }))
        }
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-500 transition-colors duration-150 ease-smooth hover:border-brand-400 hover:text-brand-600">
        
        <PlusIcon className="h-4 w-4" aria-hidden="true" />
        Add Another Project
      </button>
    </div>);

}

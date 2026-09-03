"use client";

import React from 'react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  EyeIcon,
  EyeOffIcon,
  GripVerticalIcon } from
'lucide-react';
import { Modal } from '../ui/Modal';
import { useCV } from '../../contexts/CVContext';
import { SECTION_META } from '../../data/cvData';
import type { SectionId } from '../../types/cv';

interface ReorderModalProps {
  open: boolean;
  onClose: () => void;
}

export function ReorderModal({ open, onClose }: ReorderModalProps) {
  const { cv, update } = useCV();

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= cv.sectionOrder.length) return;
    update((prev) => {
      const order = [...prev.sectionOrder];
      const [item] = order.splice(index, 1);
      order.splice(target, 0, item);
      return { ...prev, sectionOrder: order };
    });
  };

  const toggleVisibility = (id: SectionId) =>
  update((prev) => ({
    ...prev,
    hiddenSections: prev.hiddenSections.includes(id) ?
    prev.hiddenSections.filter((s) => s !== id) :
    [...prev.hiddenSections, id]
  }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Reorder sections"
      description="The order here is the order recruiters and ATS parsers read."
      footer={
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 ease-smooth hover:bg-brand-700">
        
          Done
        </button>
      }>
      
      <ul className="space-y-2">
        {cv.sectionOrder.map((id, index) => {
          const hidden = cv.hiddenSections.includes(id);
          const locked = id === 'contact';
          return (
            <li
              key={id}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
              hidden ?
              'border-slate-200 bg-slate-50' :
              'border-slate-200 bg-white'}`
              }>
              
              <GripVerticalIcon
                className="h-4 w-4 text-slate-300"
                aria-hidden="true" />
              
              <span className="w-5 text-xs font-semibold tabular-nums text-slate-400">
                {index + 1}
              </span>
              <span
                className={`flex-1 text-sm font-medium ${
                hidden ? 'text-slate-400' : 'text-slate-800'}`
                }>
                
                {SECTION_META[id].label}
                {locked &&
                <span className="ml-2 text-[11px] font-normal text-slate-400">
                    always first
                  </span>
                }
              </span>

              <button
                type="button"
                onClick={() => toggleVisibility(id)}
                disabled={locked}
                aria-label={
                hidden ?
                `Show ${SECTION_META[id].label} on CV` :
                `Hide ${SECTION_META[id].label} from CV`
                }
                className="rounded-md p-1.5 text-slate-400 transition-colors duration-150 ease-smooth hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:text-slate-200 disabled:hover:bg-transparent">
                
                {hidden ?
                <EyeOffIcon className="h-4 w-4" aria-hidden="true" /> :

                <EyeIcon className="h-4 w-4" aria-hidden="true" />
                }
              </button>
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label={`Move ${SECTION_META[id].label} up`}
                className="rounded-md p-1.5 text-slate-500 transition-colors duration-150 ease-smooth hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-200 disabled:hover:bg-transparent">
                
                <ArrowUpIcon className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === cv.sectionOrder.length - 1}
                aria-label={`Move ${SECTION_META[id].label} down`}
                className="rounded-md p-1.5 text-slate-500 transition-colors duration-150 ease-smooth hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-200 disabled:hover:bg-transparent">
                
                <ArrowDownIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>);

        })}
      </ul>
    </Modal>);

}

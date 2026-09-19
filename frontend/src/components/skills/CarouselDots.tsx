'use client';

import React from 'react';

interface CarouselDotsProps {
  labels: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
  /** Visual size preset */
  size?: 'md' | 'sm';
  className?: string;
}

export function CarouselDots({
  labels,
  activeIndex,
  onSelect,
  size = 'md',
  className = '',
}: CarouselDotsProps) {
  const track = size === 'md' ? 'h-[8px]' : 'h-[6px]';
  const dot = size === 'md' ? 'w-[8px]' : 'w-[6px]';
  const active = size === 'md' ? 'w-[26px]' : 'w-[40px]';

  return (
    <div dir="ltr" className={`flex items-center gap-2.5 ${className}`}>
      {labels.map((label, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={label}
            type="button"
            onClick={() => onSelect(index)}
            aria-label={label}
            aria-current={isActive ? 'true' : undefined}
            className={`${track} ${isActive ? active : dot} rounded-full outline-none transition-[width,background-color] duration-300 ${
              isActive
                ? 'bg-[#3FA9FF]'
                : 'bg-slate-600/70 hover:bg-slate-400'
            }`}
            style={
              isActive
                ? { boxShadow: '0 0 12px rgba(63,169,255,0.75)' }
                : undefined
            }
          />
        );
      })}
    </div>
  );
}

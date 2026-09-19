"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MarqueeBackdrop } from './MarqueeBackdrop';
import { TechCard } from './TechCard';
import { techStack } from '@/data/techStack';
import { useLanguage } from '@/contexts/LanguageContext';
import type { TechItem } from '@/data/techStack';

interface TechMarqueeProps {
  items?: TechItem[];
  durationSeconds?: number;
  className?: string;
}

export function TechMarquee({
  items = techStack,
  durationSeconds = 55,
  className = ''
}: TechMarqueeProps) {
  const { isAr } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate items to create an unbroken seamless loop
  const loop = [...items, ...items];

  return (
    <section
      dir="ltr"
      aria-label={isAr ? "المهارات والتقنيات الأكثر طلباً في سوق العمل" : "Most in-demand technologies"}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      className={`group relative isolate w-full select-none py-8 sm:py-12 bg-white dark:bg-[#040816] ${className}`}
      style={{ contain: 'layout paint' }}
    >
      {/* Sinuous Glowing Energy Wave & Floating Elements */}
      <MarqueeBackdrop />

      {/* Marquee Track — mask fades edges of the scrolling strip only */}
      <div
        className="relative py-3 sm:py-5 z-10 overflow-hidden"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          contain: 'layout paint'
        }}
      >
        <motion.div
          className="flex w-max items-center gap-4 pr-4 sm:gap-6 sm:pr-6"
          style={{
            willChange: 'transform',
            transform: 'translateZ(0)'
          }}
          animate={{
            x: isAr ? ['-50%', '0%'] : ['0%', '-50%']
          }}
          transition={{
            duration: isPaused ? 10000 : durationSeconds,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop'
          }}
        >
          {loop.map((item, index) => (
            <TechCard
              key={`${item.id}-${index}`}
              item={item}
              duplicate={index >= items.length}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

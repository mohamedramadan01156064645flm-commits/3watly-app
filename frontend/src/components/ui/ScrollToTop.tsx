"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFlying, setIsFlying] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (currentScroll > 280) {
        if (!isFlying) setIsVisible(true);
      } else {
        if (!isFlying) setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [isFlying]);

  const handleScrollToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isFlying) return;

    setIsFlying(true);

    // Smooth page scroll to top
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } catch {
      window.scrollTo(0, 0);
    }

    // Reset flying state once at top
    setTimeout(() => {
      setIsFlying(false);
      setIsVisible(false);
    }, 800);
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="scroll-top-btn"
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          animate={
            isFlying
              ? {
                  y: -580,
                  opacity: [1, 0.9, 0.3, 0],
                  scale: [1, 1.2, 0.85, 0.4],
                  transition: {
                    duration: 0.75,
                    ease: [0.16, 1, 0.3, 1], // Smooth snappy exponential upward acceleration
                  },
                }
              : {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: {
                    duration: 0.25,
                    ease: "easeOut",
                  },
                }
          }
          exit={{ opacity: 0, scale: 0.6, y: 30, transition: { duration: 0.2 } }}
          className="fixed bottom-7 right-7 z-[9999] pointer-events-auto"
        >
          <motion.button
            type="button"
            onClick={handleScrollToTop}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.92 }}
            aria-label="Scroll to top"
            className="group relative flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-[0_10px_25px_-5px_rgba(37,99,235,0.45)] hover:shadow-[0_15px_30px_-5px_rgba(37,99,235,0.6)] border border-blue-400/30 transition-colors duration-200 cursor-pointer overflow-hidden"
          >
            {/* Rocket Thruster Glow Effect during flight */}
            {isFlying && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1.5 }}
                className="absolute -bottom-2 inset-x-0 h-4 bg-gradient-to-t from-cyan-400 via-blue-300 to-transparent blur-xs pointer-events-none"
              />
            )}

            <ArrowUp className={`h-5 w-5 stroke-[2.75] transition-transform duration-300 ${isFlying ? '-translate-y-1' : 'group-hover:-translate-y-0.5'}`} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

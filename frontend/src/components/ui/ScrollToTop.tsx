"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFlying, setIsFlying] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const currentScroll =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
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
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } catch {
      window.scrollTo(0, 0);
    }
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
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={
            isFlying
              ? {
                  y: -600,
                  opacity: [1, 0.9, 0.3, 0],
                  scale: [1, 1.15, 0.8, 0.3],
                  transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
                }
              : {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: { duration: 0.25, ease: 'easeOut' },
                }
          }
          exit={{ opacity: 0, scale: 0.7, y: 20, transition: { duration: 0.2 } }}
          className="fixed bottom-7 right-7 z-[9999] pointer-events-auto"
        >
          {/* Main 3D Glossy Button — Clean, Standalone, No background circles */}
          <motion.button
            type="button"
            onClick={handleScrollToTop}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.92 }}
            aria-label="Scroll to top"
            style={{
              position: 'relative',
              width: 50,
              height: 50,
              borderRadius: 16,
              border: 'none',
              cursor: 'pointer',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(155deg, #3B82F6 0%, #1D4ED8 45%, #1E40AF 100%)',
              boxShadow: '0 8px 20px -4px rgba(29, 78, 216, 0.5), inset 0 1.5px 2px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.25)',
              transform: 'translateZ(0)',
            }}
          >
            {/* Top Glossy Highlight Reflection */}
            <span
              aria-hidden
              style={{
                position: 'absolute',
                top: 2,
                left: '12%',
                width: '76%',
                height: '42%',
                borderRadius: '12px 12px 50% 50%',
                background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.05) 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Arrow Icon */}
            <ArrowUp
              style={{
                position: 'relative',
                zIndex: 1,
                width: 22,
                height: 22,
                color: '#ffffff',
                strokeWidth: 2.75,
                filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))',
                transform: isFlying ? 'translateY(-3px)' : 'none',
                transition: 'transform 0.2s',
              }}
            />

            {/* Flight thruster glow on click */}
            {isFlying && (
              <motion.span
                initial={{ opacity: 0, scaleY: 0.2 }}
                animate={{ opacity: 1, scaleY: 1 }}
                style={{
                  position: 'absolute',
                  bottom: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 20,
                  height: 14,
                  background: 'linear-gradient(to bottom, rgba(96, 165, 250, 0.9), transparent)',
                  borderRadius: '0 0 50% 50%',
                  pointerEvents: 'none',
                }}
              />
            )}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

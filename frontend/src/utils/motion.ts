export const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

export const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
  transition: { duration: 0.26, ease: EASE }
};

/** Entrance for a grid/list item, capped so the last item never feels late. */
export function riseIn(index: number, step = 0.045, cap = 0.36) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, delay: Math.min(index * step, cap), ease: EASE }
  };
}

export const springPop = {
  type: 'spring' as const,
  stiffness: 520,
  damping: 26,
  mass: 0.6
};
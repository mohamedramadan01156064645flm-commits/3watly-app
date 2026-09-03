import React from 'react';

interface SparkleProps {
  className?: string;
}

/** The four-point sparkle + small companion star used above the card titles. */
export function Sparkle({ className = 'h-8 w-8' }: SparkleProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path
        d="M13 6.5c.9 4.2 2.3 5.6 6.5 6.5-4.2.9-5.6 2.3-6.5 6.5-.9-4.2-2.3-5.6-6.5-6.5 4.2-.9 5.6-2.3 6.5-6.5Z"
        fill="currentColor" />
      
      <path
        d="M24 3.5c.42 1.95 1.05 2.58 3 3-1.95.42-2.58 1.05-3 3-.42-1.95-1.05-2.58-3-3 1.95-.42 2.58-1.05 3-3Z"
        fill="currentColor" />
      
      <path
        d="M9 22.5c.3 1.4.76 1.86 2.16 2.16-1.4.3-1.86.76-2.16 2.16-.3-1.4-.76-1.86-2.16-2.16 1.4-.3 1.86-.76 2.16-2.16Z"
        fill="currentColor"
        opacity="0.85" />
      
    </svg>);

}
import React from 'react';

interface UnderlineProps {
  className?: string;
}

/** Single tapered brush stroke that underlines the accent word in the headings. */
export function Underline({ className = '' }: UnderlineProps) {
  return (
    <svg
      viewBox="0 0 240 14"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}>
      
      <path
        d="M4 10.2C48 3.4 120 1.6 236 5.4"
        stroke="#12B76A"
        strokeWidth="4"
        strokeLinecap="round" />
      
    </svg>);

}
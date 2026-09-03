import React from 'react';

export function PythonGlyph({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <defs>
        <linearGradient id="py-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#387EB8" />
          <stop offset="100%" stopColor="#2B5B84" />
        </linearGradient>
        <linearGradient id="py-yellow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFE873" />
          <stop offset="100%" stopColor="#FFD43B" />
        </linearGradient>
      </defs>
      <path
        d="M11.9 2C8.7 2 6.8 3.4 6.8 5.6v2.7h5.3v.7H4.4C2.3 9 1 10.9 1 14.1c0 3.2 1.8 4.6 4.6 4.6h1.5v-2.1c0-2.3 2-4.2 4.3-4.2h5.3v-.8c0-2.2-1.9-4.3-4.3-4.3h-.5V5.6c0-2.2-1.9-3.6-4-3.6zm-1.8 1.8c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z"
        fill="url(#py-blue)"
      />
      <path
        d="M12.1 22c3.2 0 5.1-1.4 5.1-3.6v-2.7h-5.3v-.7h7.7c2.1 0 3.4-1.9 3.4-5.1 0-3.2-1.8-4.6-4.6-4.6h-1.5v2.1c0 2.3-2 4.2-4.3 4.2H7.3v.8c0 2.2 1.9 4.3 4.3 4.3h.5v1.7c0 2.2 1.9 3.6 4 3.6zm1.8-1.8c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"
        fill="url(#py-yellow)"
      />
    </svg>
  );
}

export function SqlGlyph({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <ellipse cx="12" cy="6" rx="9" ry="3.5" fill="#3B82F6" opacity="0.9" />
      <path
        d="M3 6v6c0 1.9 4 3.5 9 3.5s9-1.6 9-3.5V6"
        stroke="#2563EB"
        strokeWidth="2.2"
        fill="none"
      />
      <path
        d="M3 12v6c0 1.9 4 3.5 9 3.5s9-1.6 9-3.5v-6"
        stroke="#1D4ED8"
        strokeWidth="2.2"
        fill="none"
      />
    </svg>
  );
}

export function DockerGlyph({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      {/* Containers */}
      <rect x="7" y="7" width="2.2" height="2" rx="0.3" fill="#0284C7" />
      <rect x="9.8" y="7" width="2.2" height="2" rx="0.3" fill="#0284C7" />
      <rect x="12.6" y="7" width="2.2" height="2" rx="0.3" fill="#0284C7" />
      <rect x="4.2" y="9.5" width="2.2" height="2" rx="0.3" fill="#0284C7" />
      <rect x="7" y="9.5" width="2.2" height="2" rx="0.3" fill="#0284C7" />
      <rect x="9.8" y="9.5" width="2.2" height="2" rx="0.3" fill="#0284C7" />
      <rect x="12.6" y="9.5" width="2.2" height="2" rx="0.3" fill="#0284C7" />
      <rect x="15.4" y="9.5" width="2.2" height="2" rx="0.3" fill="#0284C7" />
      
      {/* Whale Body */}
      <path
        d="M22.5 12.8c-.6-.4-1.6-.4-2.2 0-.3.2-.5.5-.7.9-.9-.6-2.1-.9-3.4-.8-1.5.1-3 1-3.7 2.3H3.2c-.4 0-.8.2-1 .5-.6.8-.7 2.2-.2 3.4 1 2.3 3.6 3.9 6.8 3.9 5.2 0 9.7-3.1 11.2-7.8.6.1 1.3 0 1.8-.4.5-.4.8-1 .7-1.5v-.5z"
        fill="#0284C7"
      />
      <circle cx="6" cy="15" r="0.7" fill="#fff" />
    </svg>
  );
}

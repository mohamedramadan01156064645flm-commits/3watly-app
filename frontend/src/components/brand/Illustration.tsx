import React from 'react';

const ILLUSTRATION_URL = "/f332b1ae-0c59-46f6-9194-cb498c87548f.png";

interface IllustrationProps {
  className?: string;
}

export function Illustration({ className = '' }: IllustrationProps) {
  return (
    <div className="relative flex items-center justify-center">
      <img
        src={ILLUSTRATION_URL}
        alt="AI Career Growth and Market Intelligence 3D Illustration"
        className={`select-none object-contain drop-shadow-2xl ${className}`}
        draggable={false}
      />
    </div>
  );
}
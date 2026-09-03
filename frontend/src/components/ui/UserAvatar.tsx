"use client";

import React, { useState } from 'react';

interface UserAvatarProps {
  avatarUrl?: string | null;
  name?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  xs: 'h-7 w-7 text-[10px]',
  sm: 'h-8.5 w-8.5 text-[12px]',
  md: 'h-10 w-10 text-[14px]',
  lg: 'h-16 w-16 text-[22px]',
  xl: 'h-24 w-24 text-[28px]'
};

export function getInitials(name?: string | null): string {
  if (!name || !name.trim()) return 'U';
  const clean = name.trim().replace(/['"]/g, '');
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const first = parts[0].charAt(0);
    const second = parts[1].charAt(0);
    return `${first}${second}`.toUpperCase();
  }
  return clean.slice(0, Math.min(2, clean.length)).toUpperCase();
}

export function UserAvatar({
  avatarUrl,
  name,
  size = 'md',
  className = ''
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name);
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  if (avatarUrl && !imageError) {
    return (
      <div
        className={`relative flex shrink-0 items-center justify-center rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-200/80 dark:ring-white/10 shadow-xs ${sizeClass} ${className}`}
      >
        <img
          src={avatarUrl}
          alt={name ? `${name}'s avatar` : 'User avatar'}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 via-blue-700 to-indigo-600 text-white font-black shadow-sm ring-1 ring-white/20 select-none ${sizeClass} ${className}`}
    >
      <span>{initials}</span>
    </div>
  );
}

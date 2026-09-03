"use client";

import React, { useState } from 'react';

interface CompanyLogoProps {
  company: string;
  logoUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Map known Egyptian/global companies to their Clearbit domain for high-quality logos
const COMPANY_DOMAIN_MAP: Record<string, string> = {
  'vodafone': 'vodafone.com',
  'vodafone egypt': 'vodafone.com.eg',
  'valeo': 'valeo.com',
  'valeo egypt': 'valeo.com',
  'siemens': 'siemens.com',
  'siemens eda': 'siemens.com',
  'microsoft': 'microsoft.com',
  'google': 'google.com',
  'amazon': 'amazon.com',
  'meta': 'meta.com',
  'apple': 'apple.com',
  'oracle': 'oracle.com',
  'sap': 'sap.com',
  'ibm': 'ibm.com',
  'cisco': 'cisco.com',
  'intel': 'intel.com',
  'hp': 'hp.com',
  'dell': 'dell.com',
  'paymob': 'paymob.com',
  'fawry': 'fawry.com',
  'cib': 'cibeg.com',
  'commercial international bank': 'cibeg.com',
  'nbe': 'nbe.com.eg',
  'national bank of egypt': 'nbe.com.eg',
  'banque misr': 'banquemisr.com',
  'swvl': 'swvl.com',
  'instabug': 'instabug.com',
  'flairs': 'flairstech.com',
  'flairstech': 'flairstech.com',
  'giza systems': 'gizasystems.com',
  'exceed': 'xceedcc.com',
  'nokia': 'nokia.com',
  'ericsson': 'ericsson.com',
  'huawei': 'huawei.com',
  'samsung': 'samsung.com',
  'lg': 'lg.com',
  'bm technologies': 'bmtechnologies.com',
  'xlevel': 'xlevel.io',
  'excellitii': 'excelliti.com',
  'exceeliti': 'excelliti.com',
  'excelliti': 'excelliti.com',
  'exceliti': 'excelliti.com',
};

function getDomain(company: string): string | null {
  const norm = (company || '').toLowerCase().trim();
  for (const [key, domain] of Object.entries(COMPANY_DOMAIN_MAP)) {
    if (norm.includes(key)) return domain;
  }
  const cleaned = norm
    .replace(/egypt|مصر|co\.|ltd\.|inc\.|llc|group|technologies|technology|tech|solutions|services|systems|s\.a\.e\.|s\.a\.|corp|corporation/gi, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
  if (cleaned.length >= 3) return `${cleaned}.com`;
  return null;
}

export function CompanyLogo({ company, logoUrl, size = 'md', className = '' }: CompanyLogoProps) {
  const [primaryError, setPrimaryError] = useState(false);
  const [clearbitError, setClearbitError] = useState(false);
  const norm = (company || '').toLowerCase().trim();

  const dims = {
    sm: 'h-10 w-10 rounded-xl',
    md: 'h-11 w-11 rounded-xl',
    lg: 'h-14 w-14 rounded-2xl'
  }[size];

  const baseBox = `relative flex items-center justify-center shrink-0 overflow-hidden bg-white dark:bg-[#0D1527] border border-slate-200/80 dark:border-white/10 shadow-xs p-1.5 ${dims} ${className}`;

  // 1. Official Built-in Vector Logos for Top Known Egyptian & Global Employers
  if (norm.includes('vodafone')) {
    return (
      <div className={baseBox}>
        <svg viewBox="0 0 100 100" className="w-full h-full p-0.5">
          <circle cx="50" cy="50" r="48" fill="#E60000" />
          <path
            d="M50 20 C36 20 25 31 25 45 C25 61 38 74 50 82 C62 74 75 61 75 45 C75 31 64 20 50 20 Z M50 67 C41 60 34 52 34 44 C34 36 41 30 50 30 C59 30 66 36 66 44 C66 52 59 60 50 67 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    );
  }

  if (norm.includes('valeo')) {
    return (
      <div className={baseBox}>
        <span className="text-[#16A34A] font-black italic text-[14px] tracking-tight font-sans select-none">
          Valeo
        </span>
      </div>
    );
  }

  if (norm.includes('siemens')) {
    return (
      <div className={baseBox}>
        <span className="text-[#00646E] font-black text-[12.5px] tracking-tighter font-sans select-none">
          SIEMENS
        </span>
      </div>
    );
  }

  if (norm.includes('paymob')) {
    return (
      <div className={baseBox}>
        <span className="text-[#0066F5] font-black text-[13px] tracking-tight font-sans select-none">
          Paymob
        </span>
      </div>
    );
  }

  if (norm.includes('fawry') || norm.includes('فوري')) {
    return (
      <div className={baseBox}>
        <div className="w-8 h-5 rounded bg-[#FFDE00] flex items-center justify-center border border-amber-300">
          <span className="text-[#002D62] text-[9.5px] font-black select-none">FAWRY</span>
        </div>
      </div>
    );
  }

  if (norm.includes('cib') || norm.includes('commercial international bank') || norm.includes('البنك التجاري')) {
    return (
      <div className={baseBox}>
        <div className="w-8 h-6 rounded bg-[#002D62] flex items-center justify-center">
          <span className="text-[#00A4E4] text-[11px] font-black tracking-tight select-none">CIB</span>
        </div>
      </div>
    );
  }

  if (norm.includes('swvl')) {
    return (
      <div className={baseBox}>
        <div className="w-8 h-5 rounded bg-[#E8004C] flex items-center justify-center">
          <span className="text-white text-[9.5px] font-black select-none">SWVL</span>
        </div>
      </div>
    );
  }

  if (norm.includes('instabug')) {
    return (
      <div className={baseBox}>
        <div className="flex items-center justify-center">
          <span className="text-[#0B1A30] dark:text-white font-black text-[12px] tracking-tight select-none">
            INSTABUG
          </span>
        </div>
      </div>
    );
  }

  // 2. Real Verified CDN Logo URL
  if (logoUrl && !primaryError && (logoUrl.startsWith('http') || logoUrl.startsWith('/'))) {
    return (
      <div className={baseBox}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          alt={company}
          onError={() => setPrimaryError(true)}
          className="w-full h-full object-contain select-none"
          loading="lazy"
        />
      </div>
    );
  }

  // 3. Clearbit Logo API
  const domain = getDomain(company);
  if (domain && !clearbitError) {
    const clearbitUrl = `https://logo.clearbit.com/${domain}`;
    return (
      <div className={baseBox}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={clearbitUrl}
          alt={company}
          onError={() => setClearbitError(true)}
          className="w-full h-full object-contain select-none p-0.5"
          loading="lazy"
        />
      </div>
    );
  }

  // 4. Dynamic Modern Gradient Initials Badge (fallback)
  const getInitials = (name: string) => {
    if (!name) return 'CO';
    const parts = name.trim().replace(/\b(egypt|مصر|co\.|ltd\.)\b/gi, '').trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(company);
  const gradients = [
    'from-blue-600 to-indigo-700',
    'from-indigo-600 to-purple-700',
    'from-emerald-600 to-teal-700',
    'from-cyan-600 to-blue-700',
    'from-violet-600 to-pink-700',
    'from-amber-500 to-orange-600',
    'from-rose-600 to-pink-700',
    'from-sky-600 to-cyan-700',
  ];
  const charCode = (company.charCodeAt(0) || 0) + (company.charCodeAt(company.length - 1) || 0);
  const selectedGradient = gradients[charCode % gradients.length];

  return (
    <div className={`flex items-center justify-center shrink-0 overflow-hidden bg-gradient-to-br ${selectedGradient} text-white font-black text-[13px] tracking-wider shadow-xs select-none ${dims} ${className}`}>
      {initials}
    </div>
  );
}

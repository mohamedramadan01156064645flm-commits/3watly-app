import React from 'react';

/* ========================================================================= */
/* 1. VODAFONE (Exact Speechmark Vector)                                     */
/* ========================================================================= */
export function VodafoneLogo({ className = "h-6 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 text-black dark:text-white ${className}`}>
      {/* Speechmark Badge: Black in Light, Official Red (#E60000) in Dark */}
      <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-black dark:bg-[#E60000] shadow-sm shrink-0 transition-colors duration-200">
        <svg viewBox="0 0 32 32" className="h-3.5 w-3.5 fill-white">
          <path d="M16 4C9.37 4 4 9.37 4 16C4 22.63 9.37 28 16 28C17.9 28 19.68 27.56 21.26 26.77L25.5 31.5L23.2 25.2C26.18 22.98 28 19.68 28 16C28 9.37 22.63 4 16 4ZM16 24C11.58 24 8 20.42 8 16C8 11.58 11.58 8 16 8C20.42 8 24 11.58 24 16C24 20.42 20.42 24 16 24Z" />
        </svg>
      </div>
      <span className="font-extrabold text-[1.25rem] tracking-tight lowercase leading-none select-none">
        vodafone
      </span>
    </div>
  );
}

/* ========================================================================= */
/* 2. IBM (Exact 8-Bar Geometry)                                             */
/* ========================================================================= */
export function IbmLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 40" className={`h-5 w-auto fill-black dark:fill-white shrink-0 transition-colors duration-200 ${className}`}>
      <g>
        {/* I */}
        <rect x="0" y="0" width="22" height="3" />
        <rect x="0" y="5" width="22" height="3" />
        <rect x="7" y="10" width="8" height="3" />
        <rect x="7" y="15" width="8" height="3" />
        <rect x="7" y="20" width="8" height="3" />
        <rect x="7" y="25" width="8" height="3" />
        <rect x="0" y="30" width="22" height="3" />
        <rect x="0" y="35" width="22" height="3" />

        {/* B */}
        <path d="M28 0h18c5 0 8 2 8 4.5s-3 4.5-8 4.5h-18v-9zm0 5h17c2 0 4-.5 4-1.5S47 2 45 2H28v3zm0 25h19c5 0 9 2 9 4.5s-4 4.5-9 4.5H28v-9zm0 5h18c2 0 4-.5 4-1.5s-2-1.5-4-1.5H28v3z" />
        <rect x="28" y="10" width="10" height="3" />
        <rect x="42" y="10" width="8" height="3" />
        <rect x="28" y="15" width="20" height="3" />
        <rect x="28" y="20" width="20" height="3" />
        <rect x="28" y="25" width="10" height="3" />
        <rect x="44" y="25" width="8" height="3" />

        {/* M */}
        <rect x="62" y="0" width="8" height="3" />
        <rect x="74" y="0" width="8" height="3" />
        <rect x="86" y="0" width="8" height="3" />
        <rect x="62" y="5" width="9" height="3" />
        <rect x="73.5" y="5" width="9" height="3" />
        <rect x="85" y="5" width="9" height="3" />
        <rect x="62" y="10" width="10" height="3" />
        <rect x="73" y="10" width="10" height="3" />
        <rect x="84" y="10" width="10" height="3" />
        <rect x="62" y="15" width="12" height="3" />
        <rect x="72.5" y="15" width="11" height="3" />
        <rect x="82" y="15" width="12" height="3" />
        <rect x="62" y="20" width="8" height="3" />
        <rect x="75" y="20" width="6" height="3" />
        <rect x="86" y="20" width="8" height="3" />
        <rect x="62" y="25" width="8" height="3" />
        <rect x="86" y="25" width="8" height="3" />
        <rect x="62" y="30" width="8" height="3" />
        <rect x="86" y="30" width="8" height="3" />
        <rect x="62" y="35" width="8" height="3" />
        <rect x="86" y="35" width="8" height="3" />
      </g>
    </svg>
  );
}

/* ========================================================================= */
/* 3. MICROSOFT (Official 4-Square Vector)                                   */
/* ========================================================================= */
export function MicrosoftLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 text-black dark:text-white ${className}`}>
      {/* 4 Squares: Monochrome Black in Light, Official 4 Brand Colors in Dark */}
      <div className="grid grid-cols-2 gap-[2px] w-[18px] h-[18px] shrink-0">
        <div className="bg-black dark:bg-[#F25022] w-2 h-2 rounded-[1px] transition-colors duration-200" />
        <div className="bg-black dark:bg-[#7FBA00] w-2 h-2 rounded-[1px] transition-colors duration-200" />
        <div className="bg-black dark:bg-[#00A4EF] w-2 h-2 rounded-[1px] transition-colors duration-200" />
        <div className="bg-black dark:bg-[#FFB900] w-2 h-2 rounded-[1px] transition-colors duration-200" />
      </div>
      <span className="font-semibold text-[1.2rem] tracking-tight leading-none select-none">
        Microsoft
      </span>
    </div>
  );
}

/* ========================================================================= */
/* 4. INSTABASE (Official Node Mark)                                         */
/* ========================================================================= */
export function InstabaseLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 text-black dark:text-white ${className}`}>
      {/* Node Icon: Black in Light, Official Purple (#8B5CF6) in Dark */}
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-black dark:fill-[#8B5CF6] shrink-0 transition-colors duration-200">
        <path d="M12 2C10.9 2 10 2.9 10 4C10 4.7 10.4 5.3 11 5.7V8.3C9.8 8.6 8.7 9.4 8.2 10.5H5.7C5.3 9.9 4.7 9.5 4 9.5C2.9 9.5 2 10.4 2 11.5C2 12.6 2.9 13.5 4 13.5C4.7 13.5 5.3 13.1 5.7 12.5H8.2C8.7 13.6 9.8 14.4 11 14.7V17.3C10.4 17.7 10 18.3 10 19C10 20.1 10.9 21 12 21C13.1 21 14 20.1 14 19C14 18.3 13.6 17.7 13 17.3V14.7C14.2 14.4 15.3 13.6 15.8 12.5H18.3C18.7 13.1 19.3 13.5 20 13.5C21.1 13.5 22 12.6 22 11.5C22 10.4 21.1 9.5 20 9.5C19.3 9.5 18.7 9.9 18.3 10.5H15.8C15.3 9.4 14.2 8.6 13 8.3V5.7C13.6 5.3 14 4.7 14 4C14 2.9 13.1 2 12 2Z" />
      </svg>
      <span className="font-extrabold text-[1.1rem] tracking-[0.12em] uppercase leading-none select-none">
        INSTABASE
      </span>
    </div>
  );
}

/* ========================================================================= */
/* 5. CAREEM (Official Twin Dots & Smile Arc)                                */
/* ========================================================================= */
export function CareemLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 text-black dark:text-[#00EB89] ${className}`}>
      {/* Careem Smiley: Black in Light, Official Green (#00EB89) in Dark */}
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-black dark:fill-[#00EB89] shrink-0 transition-colors duration-200">
        <circle cx="8" cy="7" r="1.8" />
        <circle cx="16" cy="7" r="1.8" />
        <path d="M5 12C5 16.4 8.6 20 13 20C16.8 20 20 17.2 20.8 13.5H18.2C17.5 15.8 15.4 17.5 13 17.5C10 17.5 7.5 15 7.5 12C7.5 9 10 6.5 13 6.5C15.4 6.5 17.5 8.2 18.2 10.5H20.8C20 6.8 16.8 4 13 4C8.6 4 5 7.6 5 12Z" />
      </svg>
      <span className="font-extrabold text-[1.25rem] tracking-tight leading-none select-none">
        Careem
      </span>
    </div>
  );
}

/* ========================================================================= */
/* 6. PAYMOB (Official Italic Logotype)                                      */
/* ========================================================================= */
export function PaymobLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      {/* Paymob: Black in Light, Official Blue (#0052FF) in Dark */}
      <span className="font-black text-[1.35rem] tracking-tight italic leading-none text-black dark:text-[#0052FF] select-none transition-colors duration-200">
        Paymob
      </span>
    </div>
  );
}

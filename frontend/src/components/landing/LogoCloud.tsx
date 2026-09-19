"use client";

import React from 'react';
import { 
  VodafoneLogo, 
  IbmLogo, 
  MicrosoftLogo, 
  InstabaseLogo, 
  CareemLogo, 
  PaymobLogo 
} from '@/components/brand/CompanyLogos';
import { useLanguage } from '@/contexts/LanguageContext';

const companies = [
  { name: "Vodafone", url: "https://web.vodafone.com.eg", Component: VodafoneLogo },
  { name: "IBM", url: "https://www.ibm.com/eg-en", Component: IbmLogo },
  { name: "Microsoft", url: "https://www.microsoft.com", Component: MicrosoftLogo },
  { name: "Instabase", url: "https://www.instabase.com", Component: InstabaseLogo },
  { name: "Careem", url: "https://www.careem.com", Component: CareemLogo },
  { name: "Paymob", url: "https://paymob.com", Component: PaymobLogo }
];

export function LogoCloud() {
  const { isAr } = useLanguage();

  return (
    <div className="w-full pt-4 pb-2">
      <div className="max-w-[1280px] mx-auto text-center">
        <p className="text-[12.5px] font-medium text-slate-500 dark:text-slate-400">
          {isAr ? "شواغر وظيفية ومؤشرات سوق العمل من كبرى الشركات" : "Active job openings and hiring benchmarks from leading employers"}
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 sm:gap-x-14">
          {companies.map(({ name, url, Component }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              title={`Visit ${name} official website`}
              className="opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <Component className="scale-100" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

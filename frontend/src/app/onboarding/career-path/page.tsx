"use client";

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3Icon,
  DatabaseIcon,
  CodeIcon,
  NetworkIcon,
  CloudIcon,
  PlusIcon,
  XIcon,
  CheckIcon
} from 'lucide-react';
import { StepShell } from '@/components/onboarding/StepShell';
import { SecureBadge } from '@/components/onboarding/PageHeading';
import { StepFooter } from '@/components/onboarding/StepFooter';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LOCATION_OPTIONS, LocationItem } from '@/data/roles';
import type { RoleId } from '@/types/onboarding';

const iconMap = {
  analytics: BarChart3Icon,
  database: DatabaseIcon,
  code: CodeIcon,
  network: NetworkIcon,
  cloud: CloudIcon
};

export default function CareerPathPage() {
  const router = useRouter();
  const { isAr } = useLanguage();
  const { role, experience, locations, selectRole, setExperience, toggleLocation } =
    useOnboarding();
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const roleOptionsList = isAr
    ? [
        {
          id: 'data-analyst' as const,
          title: 'Data Analyst (محلل بيانات)',
          description: 'تحليل البيانات واستخراج الرؤى ومؤشرات الأداء لدعم اتخاذ القرارات الذكية.',
          icon: 'analytics' as const,
          tone: 'blue' as const
        },
        {
          id: 'data-engineer' as const,
          title: 'Data Engineer (مهندس بيانات)',
          description: 'بناء وتطوير خطوط نقل البيانات (Pipelines) والأنظمة السحابية وقواعد البيانات الضخمة.',
          icon: 'database' as const,
          tone: 'green' as const
        },
        {
          id: 'software-engineer' as const,
          title: 'Software Engineer (مهندس برمجيات)',
          description: 'تصميم وتطوير أنظمة وتطبيقات برمجية قوية وقابلة للتوسع.',
          icon: 'code' as const,
          tone: 'blue' as const
        },
        {
          id: 'ml-engineer' as const,
          title: 'Machine Learning & AI Engineer',
          description: 'بناء وتدريب نماذج الـ ML ونماذج الذكاء الاصطناعي والتنبؤ الآلي.',
          icon: 'network' as const,
          tone: 'violet' as const
        },
        {
          id: 'devops' as const,
          title: 'DevOps & Cloud Engineer',
          description: 'أتمتة وإدارة الـ Cloud Infrastructure وخطوط الـ CI/CD والأنظمة الموثوقة.',
          icon: 'cloud' as const,
          tone: 'blue' as const
        }
      ]
    : [
        {
          id: 'data-analyst' as const,
          title: 'Data Analyst',
          description: 'Turn data into actionable insights and drive business decisions.',
          icon: 'analytics' as const,
          tone: 'blue' as const
        },
        {
          id: 'data-engineer' as const,
          title: 'Data Engineer',
          description: 'Build and maintain reliable data pipelines and infrastructure.',
          icon: 'database' as const,
          tone: 'green' as const
        },
        {
          id: 'software-engineer' as const,
          title: 'Software Engineer',
          description: 'Design, build, and scale high-performance software systems.',
          icon: 'code' as const,
          tone: 'blue' as const
        },
        {
          id: 'ml-engineer' as const,
          title: 'Machine Learning Engineer',
          description: 'Build intelligent models that learn, predict, and automate tasks.',
          icon: 'network' as const,
          tone: 'violet' as const
        },
        {
          id: 'devops' as const,
          title: 'DevOps Specialist',
          description: 'Automate, deploy, and manage reliable cloud infrastructure.',
          icon: 'cloud' as const,
          tone: 'blue' as const
        }
      ];

  const experienceLevelsList = [
    { id: 'fresh', en: 'Fresh Graduate', ar: 'خريج جديد' },
    { id: 'junior', en: '1-2 Years', ar: 'سنة - سنتين' },
    { id: 'mid', en: '3-5 Years', ar: '3 - 5 سنوات' },
    { id: 'senior', en: '5+ Years', ar: '+5 سنوات' }
  ];

  const remainingLocations = LOCATION_OPTIONS.filter((loc) => !locations.includes(loc.id));

  React.useEffect(() => {
    if (!locationMenuOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setLocationMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [locationMenuOpen]);

  const getLocationLabel = (id: string) => {
    const found = LOCATION_OPTIONS.find(l => l.id === id);
    if (!found) return id;
    return isAr ? found.ar : found.en;
  };

  return (
    <StepShell step={1}>
      <div className="flex min-h-[calc(100vh-196px)] flex-col">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[27px] font-bold leading-tight tracking-tight text-[#0B132B] dark:text-white">
              {isAr ? "حدد مسارك المهني المستهدف" : "Choose Your Target Role"}
            </h1>
            <p className="mt-1.5 text-[14px] font-normal text-slate-500 dark:text-slate-400">
              {isAr 
                ? "هنخصص التوصيات وتحليلات الفجوة المهارية بناءً على دورك المستهدف" 
                : "We will tailor your skill gap, market insights, and job matches to this target."}
            </p>
          </div>
          <div className="pt-1.5">
            <SecureBadge />
          </div>
        </div>

        <section aria-labelledby="target-role-heading" className="mt-8">
          <h2 id="target-role-heading" className="text-[14px] font-bold text-[#0B132B] dark:text-white">
            {isAr ? "المسمى الوظيفي المستهدف" : "Target Role"}
          </h2>
          <div className="mt-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {roleOptionsList.map((item) => {
              const Icon = iconMap[item.icon];
              const selected = role === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectRole(item.id)}
                  aria-pressed={selected}
                  className={`group relative flex flex-col rounded-2xl border p-5 text-left rtl:text-right transition-all duration-200 cursor-pointer ${
                    selected
                      ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 dark:border-blue-500 shadow-md ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#070B14] hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                        selected
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-[#0B1120]/5 text-slate-700 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-white/10'
                      }`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                    </span>
                    {selected && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs">
                        <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-[15px] font-bold text-[#0B132B] dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[12.5px] font-normal leading-relaxed text-slate-500 dark:text-slate-400">
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="experience-heading" className="mt-8">
          <h2 id="experience-heading" className="text-[14px] font-bold text-[#0B132B] dark:text-white">
            {isAr ? "مستوى الخبرة الحالي" : "Current Experience Level"}
          </h2>
          <div className="mt-3.5 flex flex-wrap gap-2.5">
            {experienceLevelsList.map((level) => {
              const selected = experience === level.en || experience === level.ar;
              return (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setExperience(level.en)}
                  aria-pressed={selected}
                  className={`rounded-xl border px-4 py-2.5 text-[13px] font-semibold transition-all duration-150 cursor-pointer ${
                    selected
                      ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                      : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#070B14] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  {isAr ? level.ar : level.en}
                </button>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="location-heading" className="mt-8">
          <h2 id="location-heading" className="text-[14px] font-bold text-[#0B132B] dark:text-white">
            {isAr ? "مواقع العمل المفضلة في مصر" : "Preferred Job Locations"}
          </h2>
          <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
            {locations.map((locId) => (
              <span
                key={locId}
                className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/50 px-3 py-1.5 text-[12.5px] font-semibold text-blue-700 dark:text-blue-300 shadow-2xs"
              >
                <span>{getLocationLabel(locId)}</span>
                <button
                  type="button"
                  onClick={() => toggleLocation(locId)}
                  className="rounded-full p-0.5 hover:bg-blue-200 dark:hover:bg-blue-900 cursor-pointer"
                >
                  <XIcon className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}

            {remainingLocations.length > 0 && (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setLocationMenuOpen(!locationMenuOpen)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-slate-300 dark:border-white/20 bg-white dark:bg-[#070B14] px-3.5 py-1.5 text-[12.5px] font-semibold text-slate-600 dark:text-slate-300 hover:border-slate-400 cursor-pointer"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                  <span>{isAr ? "إضافة موقع آخر" : "Add location"}</span>
                </button>

                {locationMenuOpen && (
                  <div className="absolute ltr:left-0 rtl:right-0 top-full mt-2 w-56 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] p-1.5 shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-150">
                    {remainingLocations.map((loc) => (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => {
                          toggleLocation(loc.id);
                          setLocationMenuOpen(false);
                        }}
                        className="w-full text-left rtl:text-right rounded-xl px-3 py-2 text-[12.5px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
                      >
                        {isAr ? loc.ar : loc.en}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <div className="mt-auto pt-8">
          <StepFooter
            onNext={() => router.push('/onboarding/cv-upload')}
            nextDisabled={!role}
            nextLabel={isAr ? "المتابعة لرفع الـ CV" : "Continue to CV Upload"}
            hint={!role ? (isAr ? "اختر مساراً وظيفياً للمتابعة" : "Please select a target role to continue") : undefined}
          />
        </div>
      </div>
    </StepShell>
  );
}

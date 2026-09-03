import React from 'react';
import {
  SiApacheairflow,
  SiApachespark,
  SiDocker,
  SiGit,
  SiKubernetes,
  SiNodedotjs,
  SiPandas,
  SiPostgresql,
  SiPython,
  SiPytorch,
  SiReact,
  SiScikitlearn,
  SiTensorflow,
  SiTypescript,
  SiFlutter,
  SiFlask,
  SiNumpy,
  SiGithub,
  SiDjango,
  SiFastapi,
  SiNextdotjs,
  SiVuedotjs,
  SiAngular,
  SiMongodb,
  SiRedis,
  SiMysql,
  SiOpencv,
  SiKeras,
  SiLinux,
  SiGnubash,
  SiCplusplus,
  SiGo,
  SiR,
  SiPostman,
  SiHtml5,
  SiGraphql,
  SiTailwindcss,
  SiJavascript,
  SiGooglecloud
} from 'react-icons/si';
import {
  BrainIcon,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  CloudIcon,
  LightbulbIcon,
  PlugIcon,
  SigmaIcon,
  TerminalIcon,
  Cpu,
  Database,
  Layers,
  Code2
} from 'lucide-react';
import type { TechKey } from '../../types/onboarding';

type IconComponent = React.ComponentType<{ className?: string }>;

function ExcelMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="2" y="3" width="20" height="18" rx="3" fill="#1D6F42" />
      <path
        d="M8.4 8.2l3.6 7.6M12 8.2l-3.6 7.6"
        stroke="#fff"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <rect x="14" y="7.6" width="5.4" height="8.8" rx="1" fill="#fff" opacity="0.9" />
      <path d="M14 10.6h5.4M14 13.4h5.4" stroke="#1D6F42" strokeWidth="1" />
    </svg>
  );
}

function PowerBiMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="3" y="10" width="4.6" height="11" rx="1.4" fill="#F2C811" />
      <rect x="9.7" y="6" width="4.6" height="15" rx="1.4" fill="#EAA300" />
      <rect x="16.4" y="2.5" width="4.6" height="18.5" rx="1.4" fill="#D68A00" />
    </svg>
  );
}

function TableauMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="10.8" y="1.5" width="2.4" height="21" rx="0.6" fill="#E8762D" />
      <rect x="1.5" y="10.8" width="21" height="2.4" rx="0.6" fill="#E8762D" />
      <rect x="5.5" y="5" width="2" height="14" rx="0.5" fill="#5C7A99" />
      <rect x="5" y="5.5" width="14" height="2" rx="0.5" fill="#5C7A99" />
      <rect x="16.5" y="5" width="2" height="14" rx="0.5" fill="#5C7A99" />
      <rect x="5" y="16.5" width="14" height="2" rx="0.5" fill="#5C7A99" />
    </svg>
  );
}

function AwsMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M4.5 15.5c5 3.5 11 3.5 15.5 0M18 13.5l2.5 2.5-3.5 1"
        stroke="#FF9900"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x="3.5" y="11" fill="#FF9900" fontSize="8.5" fontWeight="900" fontFamily="sans-serif">
        AWS
      </text>
    </svg>
  );
}

interface TechMeta {
  Icon: IconComponent;
  color: string;
  tile: string;
}

const registry: Record<string, TechMeta> = {
  // Python & Data Science
  python: { Icon: SiPython, color: 'text-[#3776AB]', tile: 'bg-[#EEF3FE] dark:bg-blue-950/70' },
  pandas: { Icon: SiPandas, color: 'text-[#150458] dark:text-[#818cf8]', tile: 'bg-[#EEEDFB] dark:bg-indigo-950/70' },
  numpy: { Icon: SiNumpy, color: 'text-[#013243] dark:text-[#38bdf8]', tile: 'bg-[#E0F2FE] dark:bg-sky-950/70' },
  scikitlearn: { Icon: SiScikitlearn, color: 'text-[#F7931E]', tile: 'bg-[#FEF4E7] dark:bg-amber-950/70' },
  sklearn: { Icon: SiScikitlearn, color: 'text-[#F7931E]', tile: 'bg-[#FEF4E7] dark:bg-amber-950/70' },
  scikit: { Icon: SiScikitlearn, color: 'text-[#F7931E]', tile: 'bg-[#FEF4E7] dark:bg-amber-950/70' },

  // AI & Deep Learning
  tensorflow: { Icon: SiTensorflow, color: 'text-[#FF6F00]', tile: 'bg-[#FFF2E5] dark:bg-orange-950/70' },
  pytorch: { Icon: SiPytorch, color: 'text-[#EE4C2C]', tile: 'bg-[#FDECE8] dark:bg-red-950/70' },
  keras: { Icon: SiKeras, color: 'text-[#D00000]', tile: 'bg-[#FDE8E8] dark:bg-red-950/70' },
  opencv: { Icon: SiOpencv, color: 'text-[#5C3EE8]', tile: 'bg-[#EFEAFF] dark:bg-purple-950/70' },
  machinelearning: { Icon: Cpu, color: 'text-[#8B5CF6]', tile: 'bg-[#F3E8FF] dark:bg-purple-950/70' },
  ml: { Icon: Cpu, color: 'text-[#8B5CF6]', tile: 'bg-[#F3E8FF] dark:bg-purple-950/70' },
  deeplearning: { Icon: BrainIcon, color: 'text-[#EC4899]', tile: 'bg-[#FCE7F3] dark:bg-pink-950/70' },
  nlp: { Icon: BrainIcon, color: 'text-[#6366F1]', tile: 'bg-[#EEF2FF] dark:bg-indigo-950/70' },

  // Mobile & Web Frameworks
  flutter: { Icon: SiFlutter, color: 'text-[#02569B] dark:text-[#38bdf8]', tile: 'bg-[#E0F2FE] dark:bg-sky-950/70' },
  flask: { Icon: SiFlask, color: 'text-[#000000] dark:text-white', tile: 'bg-[#F1F5F9] dark:bg-slate-800' },
  fastapi: { Icon: SiFastapi, color: 'text-[#059669]', tile: 'bg-[#ECFDF5] dark:bg-emerald-950/70' },
  django: { Icon: SiDjango, color: 'text-[#092E20] dark:text-[#34D399]', tile: 'bg-[#ECFDF5] dark:bg-emerald-950/70' },
  react: { Icon: SiReact, color: 'text-[#087EA4]', tile: 'bg-[#E8F4F8] dark:bg-cyan-950/70' },
  reactjs: { Icon: SiReact, color: 'text-[#087EA4]', tile: 'bg-[#E8F4F8] dark:bg-cyan-950/70' },
  nextjs: { Icon: SiNextdotjs, color: 'text-[#000000] dark:text-white', tile: 'bg-[#F1F5F9] dark:bg-slate-800' },
  next: { Icon: SiNextdotjs, color: 'text-[#000000] dark:text-white', tile: 'bg-[#F1F5F9] dark:bg-slate-800' },
  vue: { Icon: SiVuedotjs, color: 'text-[#4FC08D]', tile: 'bg-[#ECFDF5] dark:bg-emerald-950/70' },
  angular: { Icon: SiAngular, color: 'text-[#DD0031]', tile: 'bg-[#FEE2E2] dark:bg-red-950/70' },
  node: { Icon: SiNodedotjs, color: 'text-[#5FA04E]', tile: 'bg-[#EDF6EA] dark:bg-emerald-950/70' },
  nodejs: { Icon: SiNodedotjs, color: 'text-[#5FA04E]', tile: 'bg-[#EDF6EA] dark:bg-emerald-950/70' },

  // Languages
  typescript: { Icon: SiTypescript, color: 'text-[#3178C6]', tile: 'bg-[#EAF1FA] dark:bg-blue-950/70' },
  ts: { Icon: SiTypescript, color: 'text-[#3178C6]', tile: 'bg-[#EAF1FA] dark:bg-blue-950/70' },
  javascript: { Icon: SiJavascript, color: 'text-[#F7DF1E]', tile: 'bg-[#FEFCE8] dark:bg-amber-950/70' },
  js: { Icon: SiJavascript, color: 'text-[#F7DF1E]', tile: 'bg-[#FEFCE8] dark:bg-amber-950/70' },
  cplusplus: { Icon: SiCplusplus, color: 'text-[#00599C]', tile: 'bg-[#EBF3FA] dark:bg-blue-950/70' },
  cpp: { Icon: SiCplusplus, color: 'text-[#00599C]', tile: 'bg-[#EBF3FA] dark:bg-blue-950/70' },
  csharp: { Icon: Code2, color: 'text-[#9B4993]', tile: 'bg-[#FDF2F8] dark:bg-purple-950/70' },
  cs: { Icon: Code2, color: 'text-[#9B4993]', tile: 'bg-[#FDF2F8] dark:bg-purple-950/70' },
  go: { Icon: SiGo, color: 'text-[#00ADD8]', tile: 'bg-[#E0F7FC] dark:bg-cyan-950/70' },
  golang: { Icon: SiGo, color: 'text-[#00ADD8]', tile: 'bg-[#E0F7FC] dark:bg-cyan-950/70' },
  r: { Icon: SiR, color: 'text-[#276DC3]', tile: 'bg-[#EAF1FA] dark:bg-blue-950/70' },
  html: { Icon: SiHtml5, color: 'text-[#E34F26]', tile: 'bg-[#FDECE8] dark:bg-orange-950/70' },
  html5: { Icon: SiHtml5, color: 'text-[#E34F26]', tile: 'bg-[#FDECE8] dark:bg-orange-950/70' },
  tailwind: { Icon: SiTailwindcss, color: 'text-[#06B6D4]', tile: 'bg-[#ECFEFF] dark:bg-cyan-950/70' },
  tailwindcss: { Icon: SiTailwindcss, color: 'text-[#06B6D4]', tile: 'bg-[#ECFEFF] dark:bg-cyan-950/70' },

  // Databases & SQL
  sql: { Icon: Database, color: 'text-[#0284C7]', tile: 'bg-[#EDF4FB] dark:bg-sky-950/70' },
  postgresql: { Icon: SiPostgresql, color: 'text-[#336791]', tile: 'bg-[#EDF4FB] dark:bg-blue-950/70' },
  postgres: { Icon: SiPostgresql, color: 'text-[#336791]', tile: 'bg-[#EDF4FB] dark:bg-blue-950/70' },
  mysql: { Icon: SiMysql, color: 'text-[#4479A1]', tile: 'bg-[#EDF4FB] dark:bg-blue-950/70' },
  mongodb: { Icon: SiMongodb, color: 'text-[#47A248]', tile: 'bg-[#ECFDF5] dark:bg-emerald-950/70' },
  redis: { Icon: SiRedis, color: 'text-[#DC382D]', tile: 'bg-[#FEE2E2] dark:bg-red-950/70' },

  // BI & Visualization
  powerbi: { Icon: PowerBiMark, color: '', tile: 'bg-[#FFF6E5] dark:bg-amber-950/70' },
  excel: { Icon: ExcelMark, color: '', tile: 'bg-[#E9F6EE] dark:bg-emerald-950/70' },
  tableau: { Icon: TableauMark, color: '', tile: 'bg-[#FFF7ED] dark:bg-orange-950/70' },
  viz: { Icon: BarChart3, color: 'text-[#1B57E0]', tile: 'bg-[#EEF3FE] dark:bg-blue-950/70' },
  datavisualization: { Icon: BarChart3, color: 'text-[#1B57E0]', tile: 'bg-[#EEF3FE] dark:bg-blue-950/70' },
  matplotlib: { Icon: LineChart, color: 'text-[#11557C] dark:text-[#38BDF8]', tile: 'bg-[#EBF5FB] dark:bg-sky-950/70' },
  seaborn: { Icon: Activity, color: 'text-[#4C72B0] dark:text-[#818CF8]', tile: 'bg-[#EEF2FF] dark:bg-indigo-950/70' },
  statistics: { Icon: SigmaIcon, color: 'text-[#0F766E]', tile: 'bg-[#E7F5F3] dark:bg-teal-950/70' },

  // Cloud & DevOps
  docker: { Icon: SiDocker, color: 'text-[#2496ED]', tile: 'bg-[#EAF4FE] dark:bg-blue-950/70' },
  kubernetes: { Icon: SiKubernetes, color: 'text-[#326CE5]', tile: 'bg-[#EBF1FE] dark:bg-blue-950/70' },
  k8s: { Icon: SiKubernetes, color: 'text-[#326CE5]', tile: 'bg-[#EBF1FE] dark:bg-blue-950/70' },
  git: { Icon: SiGit, color: 'text-[#F05033]', tile: 'bg-[#FDEDEA] dark:bg-red-950/70' },
  github: { Icon: SiGithub, color: 'text-[#24292E] dark:text-white', tile: 'bg-[#F1F5F9] dark:bg-slate-800' },
  spark: { Icon: SiApachespark, color: 'text-[#E25A1C]', tile: 'bg-[#FDEFE9] dark:bg-orange-950/70' },
  airflow: { Icon: SiApacheairflow, color: 'text-[#017CEE]', tile: 'bg-[#E9F3FE] dark:bg-blue-950/70' },
  aws: { Icon: AwsMark, color: '', tile: 'bg-[#FFFBEB] dark:bg-amber-950/70' },
  gcp: { Icon: SiGooglecloud, color: 'text-[#4285F4]', tile: 'bg-[#EBF3FE] dark:bg-blue-950/70' },
  cloud: { Icon: CloudIcon, color: 'text-[#1B57E0]', tile: 'bg-[#EEF3FE] dark:bg-blue-950/70' },
  linux: { Icon: SiLinux, color: 'text-[#FCC624] dark:text-white', tile: 'bg-[#FFFBEB] dark:bg-amber-950/70' },
  bash: { Icon: SiGnubash, color: 'text-[#4EAA25]', tile: 'bg-[#ECFDF5] dark:bg-emerald-950/70' },
  terminal: { Icon: TerminalIcon, color: 'text-[#334155] dark:text-slate-300', tile: 'bg-[#EEF1F6] dark:bg-slate-800' },
  api: { Icon: SiPostman, color: 'text-[#FF6C37]', tile: 'bg-[#FFF1EC] dark:bg-orange-950/70' },
  restapi: { Icon: PlugIcon, color: 'text-[#4F46E5]', tile: 'bg-[#EEEDFD] dark:bg-indigo-950/70' },
  graphql: { Icon: SiGraphql, color: 'text-[#E10098]', tile: 'bg-[#FDF2F8] dark:bg-pink-950/70' },
  problem: { Icon: LightbulbIcon, color: 'text-[#C2410C]', tile: 'bg-[#FEF1E7] dark:bg-amber-950/70' }
};

const fallback: TechMeta = { Icon: Code2, color: 'text-blue-600 dark:text-blue-400', tile: 'bg-blue-50 dark:bg-blue-950/70' };

function normalizeKey(key: string): string {
  if (!key) return '';
  return key.toLowerCase().replace(/[^a-z0-9]/g, '');
}

interface TechIconProps {
  name: TechKey | string;
  className?: string;
}

export function TechIcon({ name, className = 'h-4 w-4' }: TechIconProps) {
  const norm = normalizeKey(name);
  const meta = registry[norm] || registry[name.toLowerCase()] || fallback;
  const Icon = meta.Icon;
  return <Icon className={`${className} ${meta.color}`} />;
}

export function techTile(name: TechKey | string) {
  const norm = normalizeKey(name);
  return (registry[norm] || registry[name.toLowerCase()] || fallback).tile;
}

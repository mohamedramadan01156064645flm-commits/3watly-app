"use client";

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Info, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dropdown } from '../ui/Dropdown';
import { metrics } from '../../data/market';
import { Filters, getChartModel } from '../../utils/marketData';

type SeriesKey = 'ai' | 'docker' | 'avg';

const series: { key: SeriesKey; label: string; color: string; dashed?: boolean; badge: string }[] = [
  { key: 'ai', label: 'Generative AI Tools', color: '#12B76A', badge: '+45%' },
  { key: 'docker', label: 'Docker', color: '#1B57E0', badge: '+24%' },
  { key: 'avg', label: 'Market Average', color: '#94A3B8', dashed: true, badge: '+8%' }
];

export function GrowthChart({ filters }: { filters: Filters }) {
  const { isAr } = useLanguage();
  const router = useRouter();
  const [metric, setMetric] = useState('growth');
  const [hidden, setHidden] = useState<SeriesKey[]>([]);

  const model = useMemo(() => getChartModel(filters, metric), [filters, metric]);
  const isVisible = (key: SeriesKey) => !hidden.includes(key);

  const toggle = (key: SeriesKey) => {
    setHidden((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      return next.length === series.length ? prev : next;
    });
  };

  return (
    <section className="flex h-full flex-col justify-between rounded-[24px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-3">
          <div>
            <h2 className="flex items-center gap-1.5 text-[17px] font-bold text-[#0B132B] dark:text-white">
              {isAr ? 'المهارات الأكثر نمواً في مصر' : 'Fastest Growing Skills in Egypt'}
              <Info className="h-4 w-4 text-slate-400" />
            </h2>
            <p className="mt-0.5 text-[12.5px] text-slate-500 dark:text-slate-400">
              {isAr ? 'نسبة النمو في إعلانات الوظائف خلال آخر 90 يوماً' : '% growth in job postings over the last 90 days'}
            </p>
          </div>
          <Dropdown options={metrics} value={metric} onChange={setMetric} menuWidth="w-[180px]" />
        </div>

        {/* Legend Row with Badges */}
        <div className="mt-2 flex flex-wrap items-center gap-5">
          {series.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => toggle(s.key)}
              aria-pressed={isVisible(s.key)}
              className={`flex items-center gap-2 text-[12.5px] font-semibold transition-all cursor-pointer ${
                isVisible(s.key)
                  ? 'text-slate-800 dark:text-slate-200'
                  : 'text-slate-400 dark:text-slate-600 line-through'
              }`}
            >
              <span
                className="h-2 w-5 rounded-full"
                style={{ backgroundColor: s.color, opacity: isVisible(s.key) ? 1 : 0.3 }}
              />
              <span>{s.label}</span>
              <span
                className="px-1.5 py-0.2 rounded-md text-[11px] font-bold text-white"
                style={{ backgroundColor: s.color }}
              >
                {s.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Line Chart */}
        <div className="mt-4 h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={model.points} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.12)" />
              <XAxis
                dataKey="tick"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 11.5 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 11.5 }}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#FFF',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
                }}
              />
              {isVisible('ai') && (
                <Line
                  type="monotone"
                  dataKey="ai"
                  stroke="#12B76A"
                  strokeWidth={2.8}
                  dot={{ fill: '#12B76A', r: 3.5 }}
                  activeDot={{ r: 5 }}
                />
              )}
              {isVisible('docker') && (
                <Line
                  type="monotone"
                  dataKey="docker"
                  stroke="#1B57E0"
                  strokeWidth={2.8}
                  dot={{ fill: '#1B57E0', r: 3.5 }}
                  activeDot={{ r: 5 }}
                />
              )}
              {isVisible('avg') && (
                <Line
                  type="monotone"
                  dataKey="avg"
                  stroke="#94A3B8"
                  strokeWidth={1.8}
                  strokeDasharray="4 4"
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row Callout matching image */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E8F8F0] dark:bg-emerald-950/70 text-[#12B76A] dark:text-[#34D399] shrink-0">
            <TrendingUp className="h-4.5 w-4.5" />
          </div>
          <p className="text-[12.5px] text-slate-600 dark:text-slate-300">
            {isAr ? (
              <>
                <strong>أدوات الذكاء الاصطناعي التوليدي</strong> هي المهارة الأسرع نمواً بزيادة طلب <strong className="text-[#12B76A]">45%+</strong> في السوق.
              </>
            ) : (
              <>
                <strong>Generative AI Tools</strong> is the fastest growing skill with <strong className="text-[#12B76A]">45%</strong> growth in demand.
              </>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push('/skills')}
          className="px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[12.5px] font-bold text-[#1B57E0] dark:text-[#60A5FA] hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-2xs cursor-pointer"
        >
          {isAr ? 'استكشف مسار التعلم' : 'Explore Learning Path'}
        </button>
      </div>
    </section>
  );
}

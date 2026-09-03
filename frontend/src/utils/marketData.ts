import { allSkills, industries, regions, timeframes, SkillBar } from '../data/market';

export type Filters = {industry: string;region: string;timeframe: string;};

export const defaultFilters: Filters = { industry: 'tech', region: 'cairo-alex', timeframe: '90' };

function resolve(filters: Filters) {
  return {
    industry: industries.find((i) => i.id === filters.industry) ?? industries[0],
    region: regions.find((r) => r.id === filters.region) ?? regions[0],
    timeframe: timeframes.find((t) => t.id === filters.timeframe) ?? timeframes[1]
  };
}

export type StatSet = {
  jobs: number;
  jobsDelta: number;
  companies: number;
  companiesDelta: number;
  remote: number;
  remoteDelta: number;
  topSkill: {name: string;share: number;};
};

export function getStats(filters: Filters): StatSet {
  const { industry, region, timeframe } = resolve(filters);
  const jobs = Math.round(industry.jobs * region.scale * timeframe.scale);
  const companies = Math.round(industry.companies * region.scale * (0.72 + timeframe.scale * 0.28));
  const remote = Math.max(6, Math.min(74, industry.remote + region.remoteAdj));
  const seed = industry.label.length + region.label.length + Number(timeframe.id);

  return {
    jobs,
    jobsDelta: Number((5 + seed % 7 + timeframe.scale).toFixed(1)),
    companies,
    companiesDelta: Number((3.4 + seed % 5 * 0.8).toFixed(1)),
    remote: Number(remote.toFixed(1)),
    remoteDelta: Number((2.1 + seed % 4 * 0.9).toFixed(1)),
    topSkill: industry.topSkill
  };
}

export function getSkillRanking(filters: Filters): SkillBar[] {
  const { industry, region, timeframe } = resolve(filters);
  const regionShift = region.remoteAdj * 0.25;
  const timeShift = Number(timeframe.id) % 90 * 0.02;

  return allSkills.
  map((skill) => {
    const bias = industry.bias[skill.name] ?? 0.88;
    const value = Math.round(Math.max(4, Math.min(96, skill.value * bias + regionShift + timeShift)));
    return { ...skill, value };
  }).
  sort((a, b) => b.value - a.value);
}

export function getTopSkills(filters: Filters): SkillBar[] {
  return getSkillRanking(filters).slice(0, 8);
}

export type ChartPoint = {tick: string;ai: number;docker: number;avg: number;};

export type ChartModel = {
  points: ChartPoint[];
  yTicks: number[];
  yMax: number;
  peaks: {ai: number;docker: number;avg: number;};
  formatY: (value: number) => string;
  formatValue: (value: number) => string;
  badges: {ai: string;docker: string;avg: string;};
};

const shape = (t: number, max: number, bend: number) =>
max * (1 - Math.exp(-bend * t)) / (1 - Math.exp(-bend));

function niceTicks(max: number): number[] {
  const raw = max / 5;
  const magnitude = Math.pow(10, Math.floor(Math.log10(Math.max(raw, 1))));
  const step = Math.ceil(raw / magnitude) * magnitude;
  return Array.from({ length: 6 }, (_, i) => Math.round(step * i));
}

export function getChartModel(filters: Filters, metric: string): ChartModel {
  const { industry, region, timeframe } = resolve(filters);
  const volume = industry.jobs * region.scale / 1000;

  const scaleFor = (base: number) => {
    if (metric === 'postings') return Math.round(base * volume * 1.8);
    if (metric === 'share') return Number((base * 0.34).toFixed(1));
    return base;
  };

  const peaks = {
    ai: scaleFor(timeframe.peaks.ai),
    docker: scaleFor(timeframe.peaks.docker),
    avg: scaleFor(timeframe.peaks.avg)
  };

  const points: ChartPoint[] = Array.from({ length: 25 }, (_, i) => {
    const t = i / 24;
    const wobble = Math.sin(i * 1.7) * (metric === 'postings' ? peaks.ai * 0.012 : 0.5);
    return {
      tick: i % 4 === 0 ? timeframe.ticks[i / 4] : '',
      ai: Math.max(0, Number((shape(t, peaks.ai, 1.5) + (i === 0 ? 0 : wobble * 0.6)).toFixed(2))),
      docker: Math.max(0, Number((shape(t, peaks.docker, 2.4) + (i === 0 ? 0 : wobble * 0.35)).toFixed(2))),
      avg: Number(shape(t, peaks.avg, 1.2).toFixed(2))
    };
  });

  const formatY =
  metric === 'postings' ?
  (v: number) => v >= 1000 ? `${Math.round(v / 1000)}k` : String(Math.round(v)) :
  (v: number) => `${Math.round(v)}%`;

  const formatValue =
  metric === 'postings' ?
  (v: number) => Math.round(v).toLocaleString() :
  (v: number) => `${v.toFixed(1)}%`;

  const prefix = metric === 'growth' ? '+' : '';
  const suffix = metric === 'postings' ? '' : '%';
  const badge = (v: number) =>
  metric === 'postings' ? `${prefix}${Math.round(v).toLocaleString()}` : `${prefix}${Math.round(v)}${suffix}`;

  const yTicks = niceTicks(peaks.ai);

  return {
    points,
    yTicks,
    yMax: yTicks[yTicks.length - 1],
    peaks,
    formatY,
    formatValue,
    badges: { ai: badge(peaks.ai), docker: badge(peaks.docker), avg: badge(peaks.avg) }
  };
}

export function filterSummary(filters: Filters) {
  const { industry, region, timeframe } = resolve(filters);
  return { industry: industry.label, region: region.label, timeframe: timeframe.label };
}

export function buildReportCsv(filters: Filters): string {
  const stats = getStats(filters);
  const summary = filterSummary(filters);
  const rows: string[][] = [
  ['3WATLY Market Overview Report'],
  ['Industry', summary.industry],
  ['Region', summary.region],
  ['Timeframe', summary.timeframe],
  [],
  ['Metric', 'Value', 'Change'],
  ['Total analyzed jobs', String(stats.jobs), `+${stats.jobsDelta}%`],
  ['Hiring companies', String(stats.companies), `+${stats.companiesDelta}%`],
  ['Remote / hybrid ratio', `${stats.remote}%`, `+${stats.remoteDelta}%`],
  ['Top in-demand skill', stats.topSkill.name, `${stats.topSkill.share}% of roles`],
  [],
  ['Rank', 'Skill', 'Share of postings'],
  ...getSkillRanking(filters).map((s, i) => [String(i + 1), s.name, `${s.value}%`])];


  return rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
}

export function downloadFile(filename: string, content: string, mime = 'text/csv;charset=utf-8') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
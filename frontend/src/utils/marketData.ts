import {
  careerTracks,
  workModels,
  experienceLevels,
  SkillBar,
  CareerTrack,
  WorkModel,
  ExperienceLevel,
} from '../data/market';

export type Filters = {
  track: string;
  workModel: string;
  experience: string;
};

export const defaultFilters: Filters = {
  track: 'all',
  workModel: 'all',
  experience: 'all',
};

function resolve(filters: Filters): {
  track: CareerTrack;
  workModel: WorkModel;
  experience: ExperienceLevel;
} {
  return {
    track: careerTracks.find((t) => t.id === filters.track) ?? careerTracks[0],
    workModel: workModels.find((w) => w.id === filters.workModel) ?? workModels[0],
    experience: experienceLevels.find((e) => e.id === filters.experience) ?? experienceLevels[0],
  };
}

export type StatSet = {
  jobs: number;
  jobsDelta: number;
  companies: number;
  companiesDelta: number;
  remote: number;
  remoteDelta: number;
  topSkill: { name: string; share: number };
};

export function getStats(filters: Filters): StatSet {
  const { track, workModel, experience } = resolve(filters);

  // Scaled jobs & companies based on workModel and experience level
  const jobs = Math.round(track.jobs * workModel.scale * experience.scale);
  const companies = Math.round(track.companies * workModel.scale * (0.8 + experience.scale * 0.2));

  // Remote percentage adjusts based on workModel
  const baseRemote = workModel.id === 'remote' ? 100 : workModel.id === 'cairo-giza' ? 22.5 : track.remote;
  const remote = Math.max(8, Math.min(100, baseRemote + workModel.remoteAdj * 0.2));

  const seed = track.label.length + workModel.label.length + experience.label.length;

  return {
    jobs,
    jobsDelta: Number((12 + (seed % 9) * 1.5).toFixed(1)),
    companies,
    companiesDelta: Number((8 + (seed % 6) * 1.2).toFixed(1)),
    remote: Number(remote.toFixed(1)),
    remoteDelta: Number((5 + (seed % 5) * 0.8).toFixed(1)),
    topSkill: track.topSkill,
  };
}

export function getSkillRanking(filters: Filters): SkillBar[] {
  const { track, workModel, experience } = resolve(filters);
  const remoteBump = workModel.id === 'remote' || workModel.id === 'gulf-global' ? 3 : 0;
  const expFactor = experience.id === 'senior' ? 1.05 : experience.id === 'entry' ? 0.95 : 1.0;

  return track.skills
    .map((skill, index) => {
      // Small realistic variation based on work model and experience
      const bonus = (skill.category === 'cloud' || skill.category === 'tool' ? remoteBump : 0);
      const computedValue = Math.min(98, Math.max(15, Math.round(skill.value * expFactor + bonus)));
      return {
        ...skill,
        value: computedValue,
        rank: index + 1,
      };
    })
    .sort((a, b) => b.value - a.value);
}

export function getTopSkills(filters: Filters): SkillBar[] {
  return getSkillRanking(filters).slice(0, 8);
}

export type ChartPoint = {
  tick: string;
  ai: number;
  docker: number;
  avg: number;
};

export type ChartModel = {
  points: ChartPoint[];
  yTicks: number[];
  yMax: number;
  peaks: { ai: number; docker: number; avg: number };
  seriesLabels: { primary: string; secondary: string; average: string };
  formatY: (value: number) => string;
  formatValue: (value: number) => string;
  badges: { ai: string; docker: string; avg: string };
};

const shape = (t: number, max: number, bend: number) =>
  (max * (1 - Math.exp(-bend * t))) / (1 - Math.exp(-bend));

function niceTicks(max: number): number[] {
  const raw = max / 5;
  const magnitude = Math.pow(10, Math.floor(Math.log10(Math.max(raw, 1))));
  const step = Math.ceil(raw / magnitude) * magnitude;
  return Array.from({ length: 6 }, (_, i) => Math.round(step * i));
}

export function getChartModel(filters: Filters, metric: string): ChartModel {
  const { track } = resolve(filters);
  const primaryPeak = parseInt(track.trendingHighlights.primary.badge.replace(/[^0-9]/g, '')) || 45;
  const secondaryPeak = parseInt(track.trendingHighlights.secondary.badge.replace(/[^0-9]/g, '')) || 28;
  const avgPeak = parseInt(track.trendingHighlights.average.badge.replace(/[^0-9]/g, '')) || 12;

  const peaks = {
    ai: primaryPeak,
    docker: secondaryPeak,
    avg: avgPeak,
  };

  const ticks = ['May 1', 'May 15', 'Jun 1', 'Jun 15', 'Jul 1', 'Jul 15', 'Jul 30'];

  const points: ChartPoint[] = Array.from({ length: 25 }, (_, i) => {
    const t = i / 24;
    const wobble = Math.sin(i * 1.5) * (peaks.ai * 0.04);
    return {
      tick: i % 4 === 0 ? ticks[i / 4] : '',
      ai: Math.max(0, Number((shape(t, peaks.ai, 1.6) + (i === 0 ? 0 : wobble * 0.4)).toFixed(1))),
      docker: Math.max(0, Number((shape(t, peaks.docker, 2.2) + (i === 0 ? 0 : wobble * 0.25)).toFixed(1))),
      avg: Number(shape(t, peaks.avg, 1.2).toFixed(1)),
    };
  });

  const formatY = (v: number) => `${Math.round(v)}%`;
  const formatValue = (v: number) => `+${v.toFixed(1)}%`;
  const badge = (v: number) => `+${Math.round(v)}%`;
  const yTicks = niceTicks(peaks.ai);

  return {
    points,
    yTicks,
    yMax: yTicks[yTicks.length - 1],
    peaks,
    seriesLabels: {
      primary: track.trendingHighlights.primary.name,
      secondary: track.trendingHighlights.secondary.name,
      average: track.trendingHighlights.average.name,
    },
    formatY,
    formatValue,
    badges: {
      ai: track.trendingHighlights.primary.badge,
      docker: track.trendingHighlights.secondary.badge,
      avg: track.trendingHighlights.average.badge,
    },
  };
}

export function filterSummary(filters: Filters) {
  const { track, workModel, experience } = resolve(filters);
  return {
    track: track.label,
    trackAr: track.labelAr,
    workModel: workModel.label,
    workModelAr: workModel.labelAr,
    experience: experience.label,
    experienceAr: experience.labelAr,
  };
}

export function buildReportCsv(filters: Filters): string {
  const stats = getStats(filters);
  const summary = filterSummary(filters);
  const rows: string[][] = [
    ['3WATLY Tech Market Intelligence Report'],
    ['Career Track', summary.track],
    ['Work Model & Location', summary.workModel],
    ['Experience Level', summary.experience],
    [],
    ['Key Metric', 'Value', 'Growth'],
    ['Active analyzed jobs in Egypt', String(stats.jobs), `+${stats.jobsDelta}%`],
    ['Hiring tech companies', String(stats.companies), `+${stats.companiesDelta}%`],
    ['Remote / hybrid positions ratio', `${stats.remote}%`, `+${stats.remoteDelta}%`],
    ['Top in-demand skill', stats.topSkill.name, `${stats.topSkill.share}% of open roles`],
    [],
    ['Rank', 'Skill Name', 'Category', 'Share of Postings', 'Growth Momentum', 'Estimated Job Openings'],
    ...getSkillRanking(filters).map((s, i) => [
      String(i + 1),
      s.name,
      s.categoryLabel || 'Tech',
      `${s.value}%`,
      s.trend || '+15%',
      String(s.jobCount || 1000),
    ]),
  ];

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
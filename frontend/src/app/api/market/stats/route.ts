import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { careerTracks, CareerTrack } from '@/data/market';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

let memoryCache: { key: string; data: any; timestamp: number } | null = null;
const CACHE_TTL_MS = 30 * 1000; // 30s cache

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const track = searchParams.get('track') || searchParams.get('industry') || 'all';
    const workModel = searchParams.get('workModel') || searchParams.get('region') || 'all';
    const experience = searchParams.get('experience') || searchParams.get('timeframe') || 'all';
    const role = searchParams.get('role') || '';
    const cacheKey = `${track}-${workModel}-${experience}-${role}`;

    if (memoryCache && memoryCache.key === cacheKey && (Date.now() - memoryCache.timestamp) < CACHE_TTL_MS) {
      return NextResponse.json(memoryCache.data, {
        headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' }
      });
    }

    const TRACK_KEYWORDS: Record<string, { titles: string[]; skills: string[] }> = {
      'frontend': {
        titles: ['frontend', 'front end', 'react', 'web developer', 'ui developer', 'next.js', 'angular', 'vue'],
        skills: ['react', 'typescript', 'javascript', 'next.js', 'tailwind css', 'redux', 'html', 'css', 'figma']
      },
      'backend': {
        titles: ['backend', 'back end', 'node', 'java', 'api', 'fastapi', 'django', 'python', 'go', 'spring boot'],
        skills: ['node.js', 'postgresql', 'python', 'docker', 'redis', 'java', 'mongodb', 'rest apis', 'go', 'kafka']
      },
      'data-ai': {
        titles: ['data', 'analytics', 'machine learning', 'ai', 'bi', 'etl', 'scientist', 'big data'],
        skills: ['python', 'sql', 'power bi', 'pandas', 'tableau', 'spark', 'dbt', 'machine learning', 'generative ai', 'snowflake']
      },
      'devops': {
        titles: ['devops', 'cloud', 'sre', 'reliability', 'infrastructure', 'platform', 'kubernetes', 'system engineer'],
        skills: ['docker', 'kubernetes', 'aws', 'ci/cd', 'linux', 'terraform', 'azure', 'git', 'grafana', 'ansible']
      },
      'mobile': {
        titles: ['mobile', 'flutter', 'android', 'ios', 'react native', 'dart', 'swift', 'kotlin'],
        skills: ['flutter', 'dart', 'react native', 'firebase', 'kotlin', 'swift', 'rest apis', 'sqlite']
      },
      'qa': {
        titles: ['qa', 'tester', 'testing', 'quality', 'automation', 'sdet'],
        skills: ['selenium', 'cypress', 'postman', 'playwright', 'jira', 'automation testing', 'jmeter']
      },
      'cybersecurity': {
        titles: ['security', 'cyber', 'soc', 'penetration', 'infosec', 'firewall', 'threat'],
        skills: ['network security', 'siem', 'penetration testing', 'linux', 'splunk', 'cloud security', 'wireshark']
      },
      'all': {
        titles: ['developer', 'engineer', 'analyst', 'data', 'cloud', 'software', 'tech'],
        skills: ['sql', 'python', 'javascript', 'react', 'typescript', 'docker', 'git', 'aws', 'node.js']
      }
    };

    const activeTrackConfig = TRACK_KEYWORDS[track] || TRACK_KEYWORDS['all'];
    const activeCareerTrack: CareerTrack = careerTracks.find((t) => t.id === track) || careerTracks[0];

    const supabase = await createClient();
    let jobs: any[] = [];
    let exactTotalCount = 0;

    if (supabase) {
      try {
        let query = supabase.from('jobs').select('title, company, is_remote, work_type, location, required_skills, posted_at, created_at', { count: 'exact' });

        // Filter by location or workModel
        if (workModel === 'remote') {
          query = query.or('is_remote.eq.true,work_type.ilike.%remote%');
        } else if (workModel === 'hybrid') {
          query = query.ilike('work_type', '%hybrid%');
        } else if (workModel === 'cairo-giza') {
          query = query.or('location.ilike.%cairo%,location.ilike.%giza%');
        } else if (workModel === 'alex-regions') {
          query = query.ilike('location', '%alex%');
        }

        const { data, count, error } = await query.limit(1000);
        if (!error && Array.isArray(data)) {
          jobs = data;
          exactTotalCount = count || data.length;
        }
      } catch (e) {
        console.warn('Market stats Supabase query fallback:', e);
      }
    }

    // Role specific keywords mapping for higher precision
    const ROLE_KEYWORDS: Record<string, { titles: string[]; skills: string[] }> = {
      'data-engineer': {
        titles: ['data engineer', 'etl', 'big data', 'data pipeline', 'pipeline engineer', 'dbt'],
        skills: ['python', 'sql', 'spark', 'airflow', 'etl', 'docker', 'kafka']
      },
      'senior-data-analyst': {
        titles: ['data analyst', 'analyst', 'power bi', 'business intelligence', 'bi analyst', 'analytics'],
        skills: ['sql', 'power bi', 'excel', 'tableau', 'python', 'statistics']
      },
      'bi-developer': {
        titles: ['bi developer', 'business intelligence', 'power bi', 'tableau', 'dax developer', 'bi'],
        skills: ['power bi', 'dax', 'sql', 'tableau', 'data modeling']
      },
      'analytics-engineer': {
        titles: ['analytics engineer', 'dbt developer', 'data modeler', 'snowflake', 'warehouse'],
        skills: ['sql', 'dbt', 'python', 'snowflake', 'data modeling']
      },
      'frontend-developer': {
        titles: ['frontend', 'react', 'front end', 'ui developer', 'web developer', 'next.js'],
        skills: ['react', 'typescript', 'javascript', 'tailwind css', 'next.js']
      },
      'backend-developer': {
        titles: ['backend', 'back end', 'node', 'django', 'api engineer', 'microservices', 'fastapi'],
        skills: ['node.js', 'postgresql', 'python', 'docker', 'redis', 'apis']
      },
      'flutter-developer': {
        titles: ['flutter', 'mobile developer', 'dart', 'android', 'ios'],
        skills: ['flutter', 'dart', 'firebase', 'mobile app']
      },
      'ai-ml-engineer': {
        titles: ['machine learning', 'ai engineer', 'deep learning', 'ml engineer', 'data scientist', 'genai'],
        skills: ['python', 'pytorch', 'machine learning', 'fastapi', 'llm']
      },
      'fullstack-developer': {
        titles: ['full stack', 'fullstack', 'software engineer', 'web developer'],
        skills: ['react', 'node.js', 'typescript', 'sql', 'docker']
      }
    };

    // Filter jobs by Track or Role
    let trackJobs = jobs;
    if (role && ROLE_KEYWORDS[role]) {
      const roleConfig = ROLE_KEYWORDS[role];
      const roleFiltered = jobs.filter((j) => {
        const titleLo = (j.title || '').toLowerCase();
        const skillsLo: string[] = (Array.isArray(j.required_skills) ? j.required_skills : []).map((s: unknown) => String(s).toLowerCase());
        const titleMatch = roleConfig.titles.some((kw) => titleLo.includes(kw));
        const skillMatch = roleConfig.skills.some((kw) => skillsLo.some((s) => s.includes(kw)));
        return titleMatch || skillMatch;
      });
      if (roleFiltered.length >= 3) {
        trackJobs = roleFiltered;
      }
    } else if (track !== 'all') {
      const filtered = jobs.filter((j) => {
        const titleLo = (j.title || '').toLowerCase();
        const skillsLo: string[] = (Array.isArray(j.required_skills) ? j.required_skills : []).map((s: unknown) => String(s).toLowerCase());
        const titleMatch = activeTrackConfig.titles.some((kw) => titleLo.includes(kw));
        const skillMatch = activeTrackConfig.skills.some((kw) => skillsLo.some((s) => s.includes(kw)));
        return titleMatch || skillMatch;
      });
      if (filtered.length > 5) {
        trackJobs = filtered;
      }
    }

    const totalJobs = trackJobs.length > 0 ? (track !== 'all' ? trackJobs.length : Math.max(exactTotalCount, trackJobs.length)) : activeCareerTrack.jobs;
    const companiesSet = new Set(trackJobs.map((j) => j.company).filter(Boolean));
    const totalCompanies = companiesSet.size > 0 ? companiesSet.size : activeCareerTrack.companies;

    const remoteCount = trackJobs.filter((j) => j.is_remote || (j.work_type && j.work_type.toLowerCase().includes('remote')) || (j.work_type && j.work_type.toLowerCase().includes('hybrid'))).length;
    const remotePercentage = trackJobs.length > 0 ? Math.round((remoteCount / trackJobs.length) * 100) : activeCareerTrack.remote;

    // Aggregate skills from real jobs matching track
    const skillFrequency: Record<string, number> = {};
    trackJobs.forEach((j) => {
      const skills: string[] = Array.isArray(j.required_skills)
        ? j.required_skills
        : typeof j.required_skills === 'string'
        ? (() => { try { return JSON.parse(j.required_skills || '[]'); } catch { return []; } })()
        : [];

      skills.forEach((s) => {
        if (!s || typeof s !== 'string') return;
        const trimmed = s.trim();
        if (trimmed.length < 2 || trimmed.length > 35) return;
        const key = trimmed;
        skillFrequency[key] = (skillFrequency[key] || 0) + 1;
      });
    });

    // Merge with predefined rich track skills to ensure high fidelity, rich categorization & trend velocity
    const dynamicTopSkills = activeCareerTrack.skills.slice(0, 8).map((curated) => {
      const realCount = Object.entries(skillFrequency).find(
        ([k]) => k.toLowerCase() === curated.name.toLowerCase()
      )?.[1];

      const computedPercentage = realCount && totalJobs > 0
        ? Math.min(96, Math.max(25, Math.round((realCount / totalJobs) * 100)))
        : curated.value;

      return {
        name: curated.name,
        value: computedPercentage,
        icon: curated.icon,
        category: curated.category,
        categoryLabel: curated.categoryLabel,
        categoryLabelAr: curated.categoryLabelAr,
        trend: curated.trend,
        isHot: curated.isHot,
        jobCount: curated.jobCount || (realCount ? realCount * 12 : Math.round(totalJobs * (computedPercentage / 100))),
      };
    });

    const result = {
      stats: {
        totalJobs,
        totalCompanies,
        remoteJobsPercentage: workModel === 'remote' ? 100 : workModel === 'cairo-giza' ? 22 : (remotePercentage || activeCareerTrack.remote),
        topSkillName: dynamicTopSkills[0]?.name || activeCareerTrack.topSkill.name,
        topSkillPercentage: dynamicTopSkills[0]?.value || activeCareerTrack.topSkill.share,
        trackLabel: activeCareerTrack.label,
        trackLabelAr: activeCareerTrack.labelAr,
      },
      topSkills: dynamicTopSkills,
      trendingHighlights: activeCareerTrack.trendingHighlights,
      insights: activeCareerTrack.insights,
      filters: { track, workModel, experience, role },
    };

    memoryCache = { key: cacheKey, data: result, timestamp: Date.now() };

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' }
    });
  } catch (err: unknown) {
    console.error('Error in /api/market/stats:', err);
    return NextResponse.json({ error: 'Failed to generate market stats' }, { status: 500 });
  }
}

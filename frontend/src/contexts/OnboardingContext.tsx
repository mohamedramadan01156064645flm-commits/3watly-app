"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { ParsedCv, ParseStatus, RoleId, RoleProfile, UploadedFile, TechKey } from '../types/onboarding';
import { roleProfiles } from '../data/roleProfiles';
import { useAuth } from './AuthContext';
import { extractNameFromFilename } from '../utils/formatName';
import { toast } from 'sonner';

interface OnboardingState {
  role: RoleId | null;
  experience: string;
  locations: string[];
  file: UploadedFile | null;
  status: ParseStatus;
  progress: number;
  stageMessage: string;
  checksRevealed: number;
  parsedCv: ParsedCv | null;
  profile: RoleProfile | null;
  skillsAdded: number;
  previewUrl: string | null;
  hasNoCv: boolean;
  careerStage: string;
  quickSkills: string[];
  careerGoal: string;
  selectRole: (role: RoleId) => void;
  setExperience: (level: string) => void;
  toggleLocation: (location: string) => void;
  uploadFile: (file: UploadedFile) => Promise<void>;
  removeFile: () => void;
  setQuickProfileData: (data: { careerStage: string; experience: string; skills: string[]; goal: string; fullName?: string }) => void;
  reset: () => void;
}

function syncParsedCvToCVBuilder(finalParsedCv: ParsedCv, userFullName?: string, userId?: string) {
  if (!userId) return;
  if (typeof window === 'undefined') return;

  const roleTitle = finalParsedCv.currentTitle || finalParsedCv.targetRole || finalParsedCv.experiences?.[0]?.role || 'Professional';

  const adaptedProjects = (finalParsedCv.projects || []).map((p, idx) => ({
    id: p.id || `prj-${idx + 1}`,
    title: p.title || `Project ${idx + 1}`,
    technologies: Array.isArray(p.technologies) ? p.technologies : [],
    github: p.github || '',
    link: p.link || '',
    bullets: Array.isArray(p.bullets) && p.bullets.length > 0
      ? p.bullets
      : (p.description ? [p.description] : [])
  }));

  const adaptedExperiences = (finalParsedCv.experiences || []).map((exp, idx) => ({
    id: exp.id || `exp-${idx + 1}`,
    role: exp.role || finalParsedCv.currentTitle || 'Professional',
    company: exp.company || '',
    companyUrl: exp.companyUrl || '',
    startDate: exp.startDate || '',
    endDate: exp.endDate || 'Present',
    current: Boolean(exp.current),
    location: exp.location || finalParsedCv.location || '',
    bullets: Array.isArray(exp.bullets) ? exp.bullets : []
  }));

  const rawEduList = (finalParsedCv.educationHistory && finalParsedCv.educationHistory.length > 0)
    ? finalParsedCv.educationHistory
    : (finalParsedCv.education ? [{
        id: 'edu-1',
        degree: finalParsedCv.education.degree,
        institution: finalParsedCv.education.school,
        startDate: finalParsedCv.education.period?.split('—')?.[0]?.trim() || '',
        endDate: finalParsedCv.education.period?.split('—')?.[1]?.trim() || '',
        location: finalParsedCv.location || '',
        major: ''
      }] : []);

  const adaptedEducation = rawEduList.map((edu: any, idx: number) => ({
    id: edu.id || `edu-${idx + 1}`,
    degree: edu.degree || 'Bachelor Degree',
    institution: edu.institution || edu.school || '',
    startDate: edu.startDate || '',
    endDate: edu.endDate || edu.period || '',
    location: edu.location || finalParsedCv.location || '',
    major: edu.major || ''
  }));

  let adaptedSkills: Array<{ id: string; label: string; skills: string[] }> = [];
  if (Array.isArray(finalParsedCv.categorizedSkillGroups) && finalParsedCv.categorizedSkillGroups.length > 0) {
    adaptedSkills = finalParsedCv.categorizedSkillGroups.map((g: any, idx: number) => ({
      id: g.id || `skill-g-${idx + 1}`,
      label: g.label || 'Technical Skills',
      skills: Array.isArray(g.skills) ? g.skills : []
    }));
  } else if (finalParsedCv.skills && finalParsedCv.skills.length > 0) {
    adaptedSkills = [{ id: 'tech-1', label: 'Technical Skills', skills: finalParsedCv.skills }];
  }

  const parsedSocialLinks: Array<{ id: string; platform: any; url: string }> = [];
  if (Array.isArray(finalParsedCv.socialLinks) && finalParsedCv.socialLinks.length > 0) {
    finalParsedCv.socialLinks.forEach((sl: any, idx: number) => {
      if (sl.url && !parsedSocialLinks.some((l) => l.url.toLowerCase() === sl.url.toLowerCase())) {
        parsedSocialLinks.push({
          id: sl.id || `link-${idx + 1}`,
          platform: sl.platform || 'Other',
          url: sl.url
        });
      }
    });
  }

  // Fallbacks if not in socialLinks
  if (!parsedSocialLinks.some(s => s.platform === 'LinkedIn') && finalParsedCv.linkedin) {
    parsedSocialLinks.push({ id: 'link-li', platform: 'LinkedIn', url: finalParsedCv.linkedin });
  }
  if (!parsedSocialLinks.some(s => s.platform === 'GitHub') && finalParsedCv.github) {
    parsedSocialLinks.push({ id: 'link-gh', platform: 'GitHub', url: finalParsedCv.github });
  }
  if (!parsedSocialLinks.some(s => s.platform === 'Portfolio') && finalParsedCv.portfolio) {
    parsedSocialLinks.push({ id: 'link-pf', platform: 'Portfolio', url: finalParsedCv.portfolio });
  }

  const convertedCvData = {
    contact: {
      fullName: finalParsedCv.fullName || userFullName || '',
      jobTitle: finalParsedCv.currentTitle || roleTitle,
      email: finalParsedCv.email || '',
      phone: finalParsedCv.phone || '',
      location: finalParsedCv.location || '',
      linkedin: finalParsedCv.linkedin || '',
      github: finalParsedCv.github || '',
      portfolio: finalParsedCv.portfolio || '',
      socialLinks: parsedSocialLinks
    },
    summary: finalParsedCv.summary || '',
    experience: adaptedExperiences,
    education: adaptedEducation,
    projects: adaptedProjects,
    skills: adaptedSkills,
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects'] as any,
    hiddenSections: [] as any,
    skillsSummary: null
  };

  const newVersionId = `ver-${Date.now()}`;
  const newPrimaryVersion = {
    id: newVersionId,
    name: finalParsedCv.fullName ? `${finalParsedCv.fullName} (الأساسية)` : 'سيرتي الذاتية (الأساسية)',
    targetRole: roleTitle,
    cvData: convertedCvData,
    templateId: 'ats-classic',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    atsScore: finalParsedCv.atsReport?.score
  };

  try {
    const existingVersJson = localStorage.getItem(`3watly_cv_versions_${userId}`);
    let existingVers: any[] = [];
    if (existingVersJson) {
      try {
        const parsed = JSON.parse(existingVersJson);
        if (Array.isArray(parsed)) existingVers = parsed;
      } catch {}
    }
    const otherVers = existingVers.map((v: any) => ({ ...v, isActive: false }));
    const updatedVersions = [newPrimaryVersion, ...otherVers];
    localStorage.setItem(`3watly_cv_versions_${userId}`, JSON.stringify(updatedVersions));
    localStorage.setItem(`3watly_active_cv_id_${userId}`, newVersionId);
    localStorage.setItem(`3watly_cv_draft_${userId}`, JSON.stringify(convertedCvData));
    localStorage.setItem(`3watly_target_role_${userId}`, roleTitle);
  } catch (storageErr) {
    console.warn('Failed to sync to 3watly_cv_versions:', storageErr);
  }

  try {
    window.dispatchEvent(new CustomEvent('3watly_active_cv_changed', { detail: newPrimaryVersion }));
    window.dispatchEvent(new CustomEvent('3watly_parsed_cv_updated', { detail: finalParsedCv }));
  } catch {}
}

const OnboardingContext = createContext<OnboardingState | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { user, updateFullName, updateTargetRole, updateExperience, setOnboardingCompleted } = useAuth();
  const [role, setRole] = useState<RoleId | null>('data-analyst');
  const [experience, setExperienceState] = useState('Fresh Graduate');
  const [locations, setLocations] = useState<string[]>(['Cairo', 'Giza', 'Remote']);
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [status, setStatus] = useState<ParseStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [stageMessage, setStageMessage] = useState('');
  const [checksRevealed, setChecksRevealed] = useState(0);
  const [skillsAdded, setSkillsAdded] = useState(0);
  const [parsedCv, setParsedCv] = useState<ParsedCv | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hasNoCv, setHasNoCv] = useState(false);
  const [careerStage, setCareerStage] = useState('student');
  const [quickSkills, setQuickSkills] = useState<string[]>([]);
  const [careerGoal, setCareerGoal] = useState('first-job');

  const setExperience = useCallback((val: string) => {
    setExperienceState(val);
    try {
      localStorage.setItem(`3watly_experience_${user?.id}`, val);
    } catch {}
  }, []);

  // Restore onboarding and parsed CV from localStorage on mount
  useEffect(() => {
    try {
      const savedCv = localStorage.getItem(`3watly_parsed_cv_${user?.id}`);
      if (savedCv) {
        const parsed = JSON.parse(savedCv);
        setParsedCv(parsed);
        setStatus('complete');
        setProgress(100);
        setChecksRevealed(4);
      }
      const savedRole = localStorage.getItem(`3watly_role_${user?.id}`);
      if (savedRole) {
        setRole(savedRole as RoleId);
      }
      const savedExp = localStorage.getItem(`3watly_experience_${user?.id}`);
      if (savedExp) {
        setExperienceState(savedExp);
      }
    } catch (e) {
      console.warn('Error loading onboarding state:', e);
    }
  }, []);

  const toggleLocation = useCallback((location: string) => {
    setLocations((prev) =>
      prev.includes(location) ? prev.filter((item) => item !== location) : [...prev, location]
    );
  }, []);

  const removeFile = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    setStatus('idle');
    setProgress(0);
    setStageMessage('');
    setChecksRevealed(0);
    setSkillsAdded(0);
    setParsedCv(null);
    localStorage.removeItem(`3watly_parsed_cv_${user?.id}`);
  }, [previewUrl]);

  const selectRole = useCallback((next: RoleId) => {
    setRole(next);
    localStorage.setItem(`3watly_role_${user?.id}`, next);
    updateTargetRole(next.replace(/-/g, ' '));
  }, [updateTargetRole]);

  const reset = useCallback(() => {
    removeFile();
    setRole('data-analyst');
    setExperienceState('Fresh Graduate');
    setLocations(['Cairo', 'Giza', 'Remote']);
    localStorage.removeItem(`3watly_role_${user?.id}`);
    localStorage.removeItem(`3watly_experience_${user?.id}`);
  }, [removeFile]);

  // Real CV Upload & Parsing Handler
  const uploadFile = useCallback(
    async (nextFile: UploadedFile) => {
      const raw = nextFile.rawFile || nextFile.file;
      setFile(nextFile);
      setStatus('uploading');
      setProgress(15);
      setStageMessage('Uploading CV document...');
      setChecksRevealed(0);
      setSkillsAdded(0);

      // Create preview object URL for real document view
      if (raw) {
        const objUrl = URL.createObjectURL(raw);
        setPreviewUrl(objUrl);
      }

      try {
        setProgress(35);
        setStageMessage('Reading document structure and layout...');
        setChecksRevealed(1);

        const formData = new FormData();
        if (raw) {
          formData.append('file', raw);
        } else {
          // If no raw file, construct text blob
          const blob = new Blob([nextFile.name], { type: 'text/plain' });
          formData.append('file', blob, nextFile.name);
        }
        // Only send targetRole if explicitly selected and not the placeholder default
        if (role && role !== 'data-analyst') formData.append('targetRole', role);

        // Stage 2: Entity extraction
        setProgress(60);
        setStageMessage('Extracting contact details, experiences, and technical skills...');
        setChecksRevealed(2);

        // Call Next.js Server Parsing API
        const response = await fetch('/api/cv/parse', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const errJson = await response.json().catch(() => ({}));
          throw new Error(errJson.error || 'Server failed to parse CV');
        }

        // Stage 3: ATS analysis & insights
        setProgress(85);
        setStageMessage('Analyzing ATS compliance & matching against Egyptian market...');
        setChecksRevealed(3);

        const result = await response.json();
        const data = result.data;

        // Construct normalized ParsedCv object
        const detectedSkills: { key: TechKey; name: string }[] = (data.skills || []).map((s: string) => ({
          key: (s.toLowerCase().replace(/[^a-z]/g, '') as TechKey) || 'sql',
          name: s
        }));

        // Resolve the human-readable role title from the detected currentTitle first, then selected role
        const roleLabels: Record<string, string> = {
          'data-analyst':      'Data Analyst',
          'data-engineer':     'Data Engineer',
          'software-engineer': 'Software Engineer',
          'ml-engineer':       'Machine Learning Engineer',
          'devops':            'DevOps Engineer',
        };
        const resolvedTitle = data.currentTitle || data.targetRole || (role && role !== 'data-analyst' ? roleLabels[role] : '') || '';

        const finalParsedCv: ParsedCv = {
          fullName: data.fullName || user?.fullName || extractNameFromFilename(nextFile.name) || '',
          currentTitle: data.currentTitle || resolvedTitle || 'Professional',
          email: data.email || user?.email || '',
          phone: data.phone || '',
          // Only use location extracted from CV — no hardcoded Cairo fallback
          location: data.location || '',
          linkedin: data.linkedin || '',
          github: data.github || '',
          portfolio: data.portfolio || '',
          socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
          links: Array.isArray(data.links) ? data.links : [],
          summary: data.summary || '',
          filename: nextFile.name,
          targetRole: resolvedTitle || data.currentTitle || 'Professional',
          experienceYears: data.experienceYears || 0,
          experiences: data.experiences || [],
          experience: {
            title: data.experiences?.[0]?.role || data.currentTitle || resolvedTitle || '',
            company: data.experiences?.[0]?.company || '',
            location: data.location || '',
            period: data.experiences?.[0]?.startDate
              ? `${data.experiences[0].startDate} — ${data.experiences[0].endDate || 'Present'}`
              : '',
            bullets: data.experiences?.[0]?.bullets || []
          },
          educationHistory: data.education || [],
          education: {
            degree: data.education?.[0]?.degree || '',
            school: data.education?.[0]?.institution || '',
            period: data.education?.[0]?.startDate
              ? `${data.education[0].startDate} — ${data.education[0].endDate || ''}`
              : ''
          },
          skills: data.skills || [],
          detectedSkills,
          categorizedSkills: data.categorizedSkills,
          categorizedSkillGroups: data.categorizedSkillGroups,
          projects: Array.isArray(data.projects) ? data.projects.map((p: any, idx: number) => ({
            id: p.id || `prj-${idx + 1}`,
            title: p.title || `Project ${idx + 1}`,
            description: p.description || '',
            technologies: Array.isArray(p.technologies) ? p.technologies : [],
            bullets: Array.isArray(p.bullets) ? p.bullets : [],
            github: p.github || '',
            link: p.link || ''
          })) : [],
          atsReport: data.atsReport,
          certificates: data.certificates || [],
          actionPlan: data.actionPlan
        };

        // Complete parsing
        await new Promise((r) => setTimeout(r, 300));
        setProgress(100);
        setStatus('complete');
        setChecksRevealed(4);
        setStageMessage('Parsing and market alignment complete!');
        setParsedCv(finalParsedCv);
        setSkillsAdded(detectedSkills.length);
        setOnboardingCompleted(true);

        // Sync extracted name to AuthContext
        if (data.fullName && data.fullName.trim()) {
          updateFullName(data.fullName.trim());
        }

        // Sync detected target role to AuthContext + Supabase (canonical source of truth)
        const detectedRole = finalParsedCv.targetRole || finalParsedCv.currentTitle;
        if (detectedRole && detectedRole.trim()) {
          updateTargetRole(detectedRole.trim());
          // Also sync 3watly_role for SkillPlanContext
          localStorage.setItem(`3watly_role_${user?.id}`, detectedRole.trim().toLowerCase().replace(/\s+/g, '-'));
        }

        // If candidate experiences are all internships, align experience level to 'Fresh Graduate'
        if (data.isAllInternships || (Array.isArray(data.experiences) && data.experiences.length > 0 && data.experiences.every((e: any) => e.type === 'internship'))) {
          setExperienceState('Fresh Graduate');
          updateExperience('Fresh Graduate');
          try {
            localStorage.setItem(`3watly_experience_${user?.id}`, 'Fresh Graduate');
          } catch {}
        }

        // Save to localStorage
        try {
          localStorage.setItem(`3watly_parsed_cv_${user?.id}`, JSON.stringify(finalParsedCv));
        } catch (storageErr) {
          console.warn('Storage error:', storageErr);
        }

        // Synchronize with CV Builder context and versions
        syncParsedCvToCVBuilder(finalParsedCv, user?.fullName);

        // Sync to Supabase cloud
        if (user?.id) {
          try {
            fetch('/api/cv/document', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: user.id,
                filename: file?.name || 'Curriculum Vitae',
                targetRole: finalParsedCv.targetRole || role,
                parsedCv: finalParsedCv,
                rawText: (finalParsedCv as any).rawText || '',
                atsScore: (finalParsedCv as any).atsScore || 85,
              }),
            }).catch(() => null);
          } catch {}
        }

        const isArabic = typeof window !== 'undefined' && localStorage.getItem('3watly_lang') === 'ar';
        toast.success(
          isArabic
            ? 'تم تحليل سيرتك الذاتية ومعالجة ATS بنجاح ✓'
            : 'CV parsed and ATS analyzed successfully!'
        );
      } catch (err: any) {
        console.error('CV Upload / Parsing Error:', err);
        setStatus('error');
        setStageMessage(err.message || 'Error occurred while analyzing CV');
        toast.error(err.message || 'Failed to parse CV');
      }
    },
    [role, user, updateFullName]
  );

  const setQuickProfileData = useCallback(
    (data: { careerStage: string; experience: string; skills: string[]; goal: string; fullName?: string }) => {
      setHasNoCv(true);
      setCareerStage(data.careerStage);
      setExperience(data.experience);
      updateExperience(data.experience);
      setQuickSkills(data.skills);
      setCareerGoal(data.goal);

      if (data.fullName) {
        updateFullName(data.fullName);
      }

      const roleTitle = role ? role.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Career Specialist';
      if (roleTitle) updateTargetRole(roleTitle);
      const resolvedName = data.fullName || user?.fullName || 'Professional';

      const detectedSkills: { key: TechKey; name: string }[] = data.skills.map((s) => ({
        key: (s.toLowerCase().replace(/[^a-z]/g, '') as TechKey) || 'sql',
        name: s
      }));

      const constructedCv: ParsedCv = {
        fullName: resolvedName,
        currentTitle: roleTitle,
        email: user?.email || '',
        phone: '',       // no hardcoded phone
        location: '',    // no hardcoded location
        summary: `Targeting ${roleTitle} opportunities with expertise in ${data.skills.slice(0, 3).join(', ')}.`,
        filename: 'Quick_Profile.pdf',
        experienceYears: data.experience.includes('3-5') ? 4 : data.experience.includes('1-2') ? 2 : 0,
        experiences: [],
        experience: {
          title: roleTitle,
          company: '',
          location: '',
          period: '',
          bullets: []
        },
        educationHistory: [],
        education: {
          degree: '',
          school: '',
          period: ''
        },
        skills: data.skills,
        detectedSkills,
        atsReport: undefined,
        actionPlan: [
          {
            title: `Advanced ${data.skills[0] || 'Technical'} Mastery`,
            category: 'Technical Skills',
            description: `Enhance your proficiency in ${data.skills[0] || 'core tools'} with market-aligned projects.`,
            priority: 'high'
          },
          {
            title: 'Build Complete ATS Resume',
            category: 'CV Optimization',
            description: 'Use the 3WATLY CV Builder to export an official ATS-compliant resume.',
            priority: 'medium'
          }
        ]
      };

      setParsedCv(constructedCv);
      setStatus('complete');
      setProgress(100);
      setChecksRevealed(4);
      try {
        localStorage.setItem(`3watly_parsed_cv_${user?.id}`, JSON.stringify(constructedCv));
      } catch {}
      syncParsedCvToCVBuilder(constructedCv, resolvedName);
    },
    [role, user, updateFullName]
  );

  // Construct dynamic RoleProfile derived from REAL parsed CV data
  const profile: RoleProfile | null = React.useMemo(() => {
    if (!parsedCv) {
      return role && roleProfiles[role] ? roleProfiles[role] : null;
    }

    const atsScore = parsedCv.atsReport?.score ?? null;
    const expYears = parsedCv.experienceYears ?? 0;
    const skillsList = parsedCv.skills ?? [];

    const topSkills = parsedCv.detectedSkills && parsedCv.detectedSkills.length > 0
      ? parsedCv.detectedSkills.slice(0, 6)
      : skillsList.slice(0, 6).map(s => ({ key: s.toLowerCase().replace(/[^a-z0-9]/g, '') as TechKey, name: s }));

    const fallbackGaps = role && roleProfiles[role]?.skillGaps ? roleProfiles[role].skillGaps : [];

    return {
      headline: `${parsedCv.fullName}${parsedCv.currentTitle ? ` • ${parsedCv.currentTitle}` : ''}`,
      scores: {
        overall: atsScore ?? (skillsList.length > 0 ? Math.min(80, skillsList.length * 10) : 0),
        skills: Math.min(100, skillsList.length * 10),
        experience: Math.min(100, expYears * 25),
        education: parsedCv.educationHistory && parsedCv.educationHistory.length > 0 ? 80 : 0
      },
      experienceYears: expYears,
      relevance: { relevant: skillsList.length > 0 ? 70 : 0, related: 20, other: 10 },
      strengths: parsedCv.atsReport?.strengths?.length ? parsedCv.atsReport.strengths : (skillsList.length > 0 ? [`Relevant skills: ${skillsList.slice(0, 3).join(', ')}`] : []),
      topSkills,
      extraSkillCount: Math.max(0, skillsList.length - 6),
      skillGaps: fallbackGaps,
      targetRoles: parsedCv.currentTitle ? [
        { title: parsedCv.currentTitle, match: atsScore ?? 70, label: (atsScore && atsScore >= 80) ? 'Strong Match' : 'Good Match' }
      ] : [],
      actions: parsedCv.actionPlan?.map((ap) => ({
        key: 'course' as const,
        title: ap.title,
        meta: ap.description
      })) || [],
      priorities: parsedCv.actionPlan?.map((ap) => ({
        key: 'project' as const,
        title: ap.title,
        description: ap.description,
        impact: ap.priority === 'high' ? 'High' : ap.priority === 'medium' ? 'Medium' : 'Low'
      })) || []
    };
  }, [parsedCv, role]);

  return (
    <OnboardingContext.Provider
      value={{
        role,
        experience,
        locations,
        file,
        status,
        progress,
        stageMessage,
        checksRevealed,
        parsedCv,
        profile,
        skillsAdded,
        previewUrl,
        hasNoCv,
        careerStage,
        quickSkills,
        careerGoal,
        selectRole,
        setExperience,
        toggleLocation,
        uploadFile,
        removeFile,
        setQuickProfileData,
        reset
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used inside an OnboardingProvider');
  }
  return context;
}

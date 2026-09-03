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

const OnboardingContext = createContext<OnboardingState | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { user, updateFullName, updateTargetRole, setOnboardingCompleted } = useAuth();
  const [role, setRole] = useState<RoleId | null>('data-analyst');
  const [experience, setExperience] = useState('1-3 Years');
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

  // Restore onboarding and parsed CV from localStorage on mount
  useEffect(() => {
    try {
      const savedCv = localStorage.getItem('3watly_parsed_cv');
      if (savedCv) {
        const parsed = JSON.parse(savedCv);
        setParsedCv(parsed);
        setStatus('complete');
        setProgress(100);
        setChecksRevealed(3);
      }
      const savedRole = localStorage.getItem('3watly_role');
      if (savedRole) {
        setRole(savedRole as RoleId);
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
    localStorage.removeItem('3watly_parsed_cv');
  }, [previewUrl]);

  const selectRole = useCallback((next: RoleId) => {
    setRole(next);
    localStorage.setItem('3watly_role', next);
    updateTargetRole(next.replace(/-/g, ' '));
  }, [updateTargetRole]);

  const reset = useCallback(() => {
    removeFile();
    setRole('data-analyst');
    setExperience('1-3 Years');
    setLocations(['Cairo', 'Giza', 'Remote']);
    localStorage.removeItem('3watly_role');
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
        // Stage 1: Progress step
        await new Promise((r) => setTimeout(r, 400));
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
        if (role) formData.append('targetRole', role);

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

        // Resolve the human-readable role title from the selected role ID
        const roleLabels: Record<string, string> = {
          'data-analyst':      'Data Analyst',
          'data-engineer':     'Data Engineer',
          'software-engineer': 'Software Engineer',
          'ml-engineer':       'Machine Learning Engineer',
          'devops':            'DevOps Engineer',
        };
        const resolvedTitle = data.targetRole || (role ? roleLabels[role] : '') || '';

        const finalParsedCv: ParsedCv = {
          fullName: data.fullName || user?.fullName || extractNameFromFilename(nextFile.name) || '',
          currentTitle: data.currentTitle || resolvedTitle,
          email: data.email || user?.email || '',
          phone: data.phone || '',
          // Only use location extracted from CV — no hardcoded Cairo fallback
          location: data.location || '',
          linkedin: data.linkedin || '',
          github: data.github || '',
          portfolio: data.portfolio || '',
          links: Array.isArray(data.links) ? data.links : [],
          summary: data.summary || '',
          filename: nextFile.name,
          targetRole: data.targetRole || resolvedTitle,
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
          projects: data.projects || [],
          atsReport: data.atsReport,
          actionPlan: data.actionPlan
        };

        // Complete parsing
        await new Promise((r) => setTimeout(r, 300));
        setProgress(100);
        setStatus('complete');
        setStageMessage('Parsing and market alignment complete!');
        setParsedCv(finalParsedCv);
        setSkillsAdded(detectedSkills.length);
        setOnboardingCompleted(true);

        // Sync extracted name to AuthContext
        if (data.fullName && data.fullName.trim()) {
          updateFullName(data.fullName.trim());
        }

        // Save to localStorage
        try {
          localStorage.setItem('3watly_parsed_cv', JSON.stringify(finalParsedCv));
        } catch (storageErr) {
          console.warn('Storage error:', storageErr);
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
      setQuickSkills(data.skills);
      setCareerGoal(data.goal);

      if (data.fullName) {
        updateFullName(data.fullName);
      }

      const roleTitle = role ? role.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Career Specialist';
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
        atsReport: {
          score: 88,
          structureScore: 90,
          readabilityScore: 88,
          impactScore: 85,
          skillsScore: 90,
          hasEmail: true,
          hasPhone: true,
          hasLocation: true,
          hasSummary: true,
          hasExperience: true,
          hasEducation: true,
          hasSkills: true,
          hasMetrics: true,
          actionVerbsCount: 14,
          metricsCount: 6,
          strengths: [
            `Strong foundational alignment for ${roleTitle}`,
            `Verified in-demand skills: ${data.skills.slice(0, 3).join(', ')}`
          ],
          improvements: [
            'Create a downloadable CV using 3WATLY CV Builder to apply to direct openings.'
          ]
        },
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
      setChecksRevealed(3);
      try {
        localStorage.setItem('3watly_parsed_cv', JSON.stringify(constructedCv));
      } catch {}
    },
    [role, user, updateFullName]
  );

  // Construct dynamic RoleProfile derived from REAL parsed CV data
  const profile: RoleProfile | null = React.useMemo(() => {
    if (!parsedCv) {
      return role && roleProfiles[role] ? roleProfiles[role] : null;
    }

    const atsScore = parsedCv.atsReport?.score ?? 84;
    const expYears = parsedCv.experienceYears ?? 2;
    const skillsList = parsedCv.skills ?? [];

    const topSkills = parsedCv.detectedSkills && parsedCv.detectedSkills.length > 0
      ? parsedCv.detectedSkills.slice(0, 6)
      : [
          { key: 'sql' as TechKey, name: 'SQL' },
          { key: 'python' as TechKey, name: 'Python' },
          { key: 'excel' as TechKey, name: 'Excel' }
        ];

    const fallbackGaps = role && roleProfiles[role]?.skillGaps ? roleProfiles[role].skillGaps : [];

    return {
      headline: `${parsedCv.fullName} • ${parsedCv.currentTitle}`,
      scores: {
        overall: atsScore,
        skills: Math.min(100, Math.max(50, skillsList.length * 8)),
        experience: Math.min(100, Math.max(60, expYears * 25)),
        education: 90
      },
      experienceYears: expYears,
      relevance: { relevant: 75, related: 20, other: 5 },
      strengths: parsedCv.atsReport?.strengths?.length ? parsedCv.atsReport.strengths : ['Strong technical stack match'],
      topSkills,
      extraSkillCount: Math.max(0, skillsList.length - 6),
      skillGaps: fallbackGaps,
      targetRoles: [
        { title: parsedCv.currentTitle, match: atsScore, label: 'Strong Match' },
        { title: 'Data Engineer', match: Math.max(60, atsScore - 12), label: 'Good Match' },
        { title: 'BI Specialist', match: Math.max(55, atsScore - 18), label: 'Possible Match' }
      ],
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

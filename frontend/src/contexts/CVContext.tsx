"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { toast } from 'sonner';
import { initialCV } from '../data/cvData';
import type { CVData, CVVersion, FixId, SaveStatus, TemplateId } from '../types/cv';
import { analyzeCV, type Analysis } from '../utils/atsAnalysis';
import { enhanceBullet } from '../utils/cvHelpers';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './AuthContext';

interface HistoryState {
  present: CVData;
  past: CVData[];
  future: CVData[];
}

interface CVContextValue {
  cv: CVData;
  template: TemplateId;
  setTemplate: (template: TemplateId) => void;
  saveStatus: SaveStatus;
  /**
   * Applies an immutable update. Passing the same `label` within a short window
   * coalesces edits so undo steps map to intents, not keystrokes.
   */
  update: (updater: (prev: CVData) => CVData, label?: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  analysis: Analysis;
  applyFix: (id: FixId) => string;

  // Multi-CV Version Management
  versions: CVVersion[];
  activeVersionId: string;
  editingVersionId: string;
  currentVersion: CVVersion | null;
  activeVersion: CVVersion | null;
  setActiveVersion: (id: string) => void;
  switchEditingVersion: (id: string) => void;
  createVersion: (name: string, targetRole?: string, fromCv?: CVData) => CVVersion;
  duplicateVersion: (id: string, newName?: string) => CVVersion;
  renameVersion: (id: string, newName: string, newTargetRole?: string) => void;
  deleteVersion: (id: string) => void;
}

const CVContext = createContext<CVContextValue | null>(null);

const MAX_HISTORY = 60;
const COALESCE_MS = 900;

function syncActiveCVToPlatform(version: CVVersion) {
  try {
    localStorage.setItem('3watly_active_cv_id', version.id);
    localStorage.setItem('3watly_target_role', version.targetRole || version.cvData.contact.jobTitle);

    const flatSkills: string[] = [];
    version.cvData.skills.forEach(g => {
      g.skills.forEach(s => {
        if (!flatSkills.includes(s)) flatSkills.push(s);
      });
    });

    const parsedData = {
      fullName: version.cvData.contact.fullName,
      currentTitle: version.cvData.contact.jobTitle,
      email: version.cvData.contact.email,
      phone: version.cvData.contact.phone,
      location: version.cvData.contact.location,
      linkedin: version.cvData.contact.linkedin,
      summary: version.cvData.summary,
      targetRole: version.targetRole || version.cvData.contact.jobTitle,
      skills: flatSkills,
      categorizedSkillGroups: version.cvData.skills,
      experiences: version.cvData.experience,
      education: version.cvData.education,
      educationHistory: version.cvData.education,
      projects: version.cvData.projects
    };

    localStorage.setItem('3watly_parsed_cv', JSON.stringify(parsedData));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('3watly_active_cv_changed', { detail: version }));
    }
  } catch (e) {
    console.warn('Failed to sync active CV to platform:', e);
  }
}

export function CVProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryState>({
    present: initialCV,
    past: [],
    future: []
  });
  const [template, setTemplate] = useState<TemplateId>('ats-classic');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');

  // Multi-CV versions state
  const [versions, setVersions] = useState<CVVersion[]>([]);
  const [activeVersionId, setActiveVersionIdState] = useState<string>('ver-default');
  const [editingVersionId, setEditingVersionId] = useState<string>('ver-default');

  const lastLabel = useRef<string | null>(null);
  const lastEditAt = useRef<number>(0);
  const saveTimer = useRef<number | undefined>(undefined);
  const cvRef = useRef<CVData>(initialCV);

  cvRef.current = history.present;

  // Hydrate CV versions on mount
  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    const loadAllCVData = async () => {
      let initialVersionsList: CVVersion[] = [];
      let activeId = 'ver-default';

      // 1. Try loading versions from localStorage
      try {
        const savedVersionsJson = localStorage.getItem('3watly_cv_versions');
        const savedActiveId = localStorage.getItem('3watly_active_cv_id');
        if (savedVersionsJson) {
          const parsedVers = JSON.parse(savedVersionsJson);
          if (Array.isArray(parsedVers) && parsedVers.length > 0) {
            initialVersionsList = parsedVers;
            if (savedActiveId && parsedVers.some(v => v.id === savedActiveId)) {
              activeId = savedActiveId;
            } else {
              activeId = parsedVers[0].id;
            }
          }
        }
      } catch (e) {
        console.warn('Failed to read 3watly_cv_versions:', e);
      }

      // 2. If no versions stored yet, create primary version from parsed onboarding CV or draft
      if (initialVersionsList.length === 0) {
        let baseCv = initialCV;
        let baseRole = '';

        try {
          const parsedOnboarding = localStorage.getItem('3watly_parsed_cv');
          if (parsedOnboarding) {
            const p = JSON.parse(parsedOnboarding);

            const adaptedExperience = Array.isArray(p.experiences) && p.experiences.length > 0
              ? p.experiences.map((exp: any, idx: number) => ({
                  id: exp.id || `exp-${idx + 1}`,
                  role: exp.role || p.currentTitle || 'Professional',
                  company: exp.company || '',
                  startDate: exp.startDate || '',
                  endDate: exp.endDate || 'Present',
                  current: Boolean(exp.current),
                  location: exp.location || p.location || '',
                  bullets: Array.isArray(exp.bullets) ? exp.bullets : []
                }))
              : [];

            const rawEduList = Array.isArray(p.education) && p.education.length > 0
              ? p.education
              : (Array.isArray(p.educationHistory) && p.educationHistory.length > 0 ? p.educationHistory : []);

            const adaptedEducation = rawEduList.length > 0
              ? rawEduList.map((edu: any, idx: number) => ({
                  id: edu.id || `edu-${idx + 1}`,
                  degree: edu.degree || 'Bachelor Degree',
                  institution: edu.institution || edu.school || '',
                  startDate: edu.startDate || '',
                  endDate: edu.endDate || edu.period || '',
                  location: edu.location || p.location || '',
                  major: edu.major || ''
                }))
              : [];

            const adaptedProjects = Array.isArray(p.projects) && p.projects.length > 0
              ? p.projects.map((proj: any, idx: number) => ({
                  id: proj.id || `prj-${idx + 1}`,
                  title: proj.title || `Project ${idx + 1}`,
                  technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
                  github: proj.github || '',
                  link: proj.link || '',
                  bullets: Array.isArray(proj.bullets) && proj.bullets.length > 0
                    ? proj.bullets
                    : (proj.description ? [proj.description] : [])
                }))
              : [];

            let adaptedSkills: import('../types/cv').SkillGroup[] = [];
            if (Array.isArray(p.categorizedSkillGroups) && p.categorizedSkillGroups.length > 0) {
              adaptedSkills = p.categorizedSkillGroups.map((g: any, idx: number) => ({
                id: g.id || `skill-g-${idx + 1}`,
                label: g.label || 'Technical Skills',
                skills: Array.isArray(g.skills) ? g.skills : []
              }));
            } else if (p.categorizedSkills && typeof p.categorizedSkills === 'object') {
              const groups = [];
              if (p.categorizedSkills.programming?.length) {
                groups.push({ id: 'prog', label: 'Programming & Databases', skills: p.categorizedSkills.programming });
              }
              if (p.categorizedSkills.frameworks?.length) {
                groups.push({ id: 'fw', label: 'Machine Learning & Frameworks', skills: p.categorizedSkills.frameworks });
              }
              if (p.categorizedSkills.databasesAndTools?.length) {
                groups.push({ id: 'tools', label: 'Tools & Backend', skills: p.categorizedSkills.databasesAndTools });
              }
              if (p.categorizedSkills.soft?.length) {
                groups.push({ id: 'soft', label: 'Core Competencies', skills: p.categorizedSkills.soft });
              }
              if (groups.length > 0) adaptedSkills = groups;
            } else if (p.skills && p.skills.length > 0) {
              adaptedSkills = [{ id: 'tech-1', label: 'Technical Skills', skills: p.skills }];
            }

            // Build socialLinks from parsed links array or individual fields
            const platformMap: Record<string, import('../types/cv').SocialPlatform> = {
              linkedin: 'LinkedIn',
              github: 'GitHub',
              portfolio: 'Portfolio',
              kaggle: 'Other',
              leetcode: 'Other',
              behance: 'Dribbble',
              medium: 'Medium',
              website: 'Personal'
            };
            const parsedSocialLinks: import('../types/cv').SocialLink[] = [];
            if (Array.isArray(p.links) && p.links.length > 0) {
              p.links.forEach((l: any, idx: number) => {
                const platform = platformMap[l.type] ?? 'Other';
                if (l.url && !parsedSocialLinks.some(sl => sl.url === l.url)) {
                  parsedSocialLinks.push({ id: `link-${idx}`, platform, url: l.url });
                }
              });
            } else {
              if (p.linkedin) parsedSocialLinks.push({ id: 'link-li', platform: 'LinkedIn', url: p.linkedin });
              if (p.github) parsedSocialLinks.push({ id: 'link-gh', platform: 'GitHub', url: p.github });
              if (p.portfolio) parsedSocialLinks.push({ id: 'link-pf', platform: 'Portfolio', url: p.portfolio });
            }

            baseCv = {
              ...initialCV,
              contact: {
                fullName: p.fullName || user?.fullName || '',
                jobTitle: p.currentTitle || p.targetRole || '',
                email: p.email || user?.email || '',
                phone: p.phone || '',
                location: p.location || '',
                linkedin: p.linkedin || '',
                github: p.github || '',
                portfolio: p.portfolio || '',
                socialLinks: parsedSocialLinks
              },
              summary: p.summary || '',
              skillsSummary: '',
              experience: adaptedExperience,
              education: adaptedEducation,
              projects: adaptedProjects,
              skills: adaptedSkills,
              sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects'],
              hiddenSections: []
            };

            baseRole = p.targetRole || p.currentTitle || '';
          }
        } catch (e) {
          console.warn('Fallback initialization:', e);
        }

        const defaultVersion: CVVersion = {
          id: 'ver-primary',
          name: baseCv.contact.jobTitle 
            ? `${baseCv.contact.jobTitle} (الأساسية)` 
            : (baseCv.contact.fullName ? `سيرة ${baseCv.contact.fullName}` : 'سيرتي الذاتية الأولى'),
          targetRole: baseRole || 'مساري المستهدف',
          cvData: baseCv,
          templateId: 'ats-classic',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true
        };

        initialVersionsList = [defaultVersion];
        activeId = defaultVersion.id;
        localStorage.setItem('3watly_cv_versions', JSON.stringify(initialVersionsList));
        syncActiveCVToPlatform(defaultVersion);
      }

      if (isMounted) {
        setVersions(initialVersionsList);
        setActiveVersionIdState(activeId);
        setEditingVersionId(activeId);

        const currentToEdit = initialVersionsList.find(v => v.id === activeId) || initialVersionsList[0];
        if (currentToEdit) {
          setHistory({
            present: currentToEdit.cvData,
            past: [],
            future: []
          });
          setTemplate(currentToEdit.templateId || 'ats-classic');
        }
      }
    };

    loadAllCVData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Derived current & active versions
  const currentVersion = useMemo(() => {
    return versions.find(v => v.id === editingVersionId) || versions[0] || null;
  }, [versions, editingVersionId]);

  const activeVersion = useMemo(() => {
    return versions.find(v => v.id === activeVersionId) || versions[0] || null;
  }, [versions, activeVersionId]);

  // Cloud & LocalStorage Save Debounce
  const triggerSave = useCallback((updatedCv: CVData, currentTemplate: TemplateId, versionIdToSave: string) => {
    setSaveStatus('saving');
    if (saveTimer.current) window.clearTimeout(saveTimer.current);

    saveTimer.current = window.setTimeout(async () => {
      setVersions(prev => {
        const next = prev.map(v => {
          if (v.id === versionIdToSave) {
            const updated: CVVersion = {
              ...v,
              cvData: updatedCv,
              templateId: currentTemplate,
              updatedAt: new Date().toISOString()
            };
            // If this is the active version, sync to platform
            if (v.id === activeVersionId) {
              syncActiveCVToPlatform(updated);
            }
            return updated;
          }
          return v;
        });

        try {
          localStorage.setItem('3watly_cv_versions', JSON.stringify(next));
          localStorage.setItem('3watly_cv_draft', JSON.stringify(updatedCv));
        } catch {}

        return next;
      });

      setSaveStatus('saved');
    }, 450);
  }, [activeVersionId]);

  // Switch which version is currently being edited in CV Builder
  const switchEditingVersion = useCallback((id: string) => {
    const target = versions.find(v => v.id === id);
    if (!target) return;

    setEditingVersionId(target.id);
    setHistory({
      present: target.cvData,
      past: [],
      future: []
    });
    setTemplate(target.templateId || 'ats-classic');
    toast.info(`تم التبديل لمحرر: ${target.name}`);
  }, [versions]);

  // Set version as platform active (drives Jobs, ATS, Skill Gap, Copilot)
  const setActiveVersion = useCallback((id: string) => {
    const target = versions.find(v => v.id === id);
    if (!target) return;

    setActiveVersionIdState(target.id);
    setVersions(prev => {
      const next = prev.map(v => ({
        ...v,
        isActive: v.id === target.id
      }));
      localStorage.setItem('3watly_cv_versions', JSON.stringify(next));
      return next;
    });

    syncActiveCVToPlatform({ ...target, isActive: true });
    toast.success(`تم تعيين "${target.name}" كنسخة أساسية نشطة للمنصة 🎯`);
  }, [versions]);

  // Create a brand new version
  const createVersion = useCallback((name: string, targetRole: string = 'Data Analyst', fromCv?: CVData) => {
    const newId = `ver-${Date.now()}`;
    const newVersion: CVVersion = {
      id: newId,
      name: name.trim() || `نسخة ${versions.length + 1}`,
      targetRole: targetRole.trim() || 'Data Analyst',
      cvData: fromCv || initialCV,
      templateId: 'ats-classic',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: false
    };

    setVersions(prev => {
      const next = [...prev, newVersion];
      localStorage.setItem('3watly_cv_versions', JSON.stringify(next));
      return next;
    });

    switchEditingVersion(newId);
    toast.success(`تم إنشاء نسخة جديدة: "${newVersion.name}"`);
    return newVersion;
  }, [versions.length, switchEditingVersion]);

  // Duplicate an existing version (e.g. tailor for specific job)
  const duplicateVersion = useCallback((id: string, newName?: string) => {
    const source = versions.find(v => v.id === id) || currentVersion;
    if (!source) return createVersion('نسخة مستنسخة');

    const newId = `ver-${Date.now()}`;
    const duplicated: CVVersion = {
      id: newId,
      name: newName || `${source.name} (نسخة مخصصة)`,
      targetRole: source.targetRole,
      cvData: JSON.parse(JSON.stringify(source.cvData)),
      templateId: source.templateId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: false
    };

    setVersions(prev => {
      const next = [...prev, duplicated];
      localStorage.setItem('3watly_cv_versions', JSON.stringify(next));
      return next;
    });

    switchEditingVersion(newId);
    toast.success(`تم استنساخ النسخة بنجاح: "${duplicated.name}"`);
    return duplicated;
  }, [versions, currentVersion, createVersion, switchEditingVersion]);

  // Rename a version
  const renameVersion = useCallback((id: string, newName: string, newTargetRole?: string) => {
    setVersions(prev => {
      const next = prev.map(v => {
        if (v.id === id) {
          const updated = {
            ...v,
            name: newName.trim() || v.name,
            targetRole: newTargetRole ? newTargetRole.trim() : v.targetRole,
            updatedAt: new Date().toISOString()
          };
          if (v.id === activeVersionId) {
            syncActiveCVToPlatform(updated);
          }
          return updated;
        }
        return v;
      });
      localStorage.setItem('3watly_cv_versions', JSON.stringify(next));
      return next;
    });
    toast.success('تم تحديث اسم ومجال النسخة بنجاح');
  }, [activeVersionId]);

  // Delete a version (must retain at least 1)
  const deleteVersion = useCallback((id: string) => {
    if (versions.length <= 1) {
      toast.error('لا يمكن حذف النسخة الوحيدة المتبقية');
      return;
    }

    setVersions(prev => {
      const next = prev.filter(v => v.id !== id);
      localStorage.setItem('3watly_cv_versions', JSON.stringify(next));

      // If we deleted the active or editing version, fallback to first available
      if (id === activeVersionId) {
        const newActive = next[0];
        setActiveVersionIdState(newActive.id);
        syncActiveCVToPlatform(newActive);
      }
      if (id === editingVersionId) {
        const newEdit = next[0];
        setEditingVersionId(newEdit.id);
        setHistory({
          present: newEdit.cvData,
          past: [],
          future: []
        });
        setTemplate(newEdit.templateId || 'ats-classic');
      }

      return next;
    });

    toast.success('تم حذف النسخة');
  }, [versions.length, activeVersionId, editingVersionId]);

  const update = useCallback(
    (updater: (prev: CVData) => CVData, label?: string) => {
      const now = Date.now();
      const current = cvRef.current;
      const next = updater(current);

      if (next === current) return;

      const coalesce =
        label &&
        lastLabel.current === label &&
        now - lastEditAt.current < COALESCE_MS;

      lastLabel.current = label ?? null;
      lastEditAt.current = now;

      setHistory((prev) => {
        if (coalesce) {
          return {
            present: next,
            past: prev.past,
            future: []
          };
        }
        return {
          present: next,
          past: [...prev.past.slice(-(MAX_HISTORY - 1)), prev.present],
          future: []
        };
      });

      triggerSave(next, template, editingVersionId);
    },
    [template, editingVersionId, triggerSave]
  );

  const handleSetTemplate = useCallback((nextTemplate: TemplateId) => {
    setTemplate(nextTemplate);
    triggerSave(cvRef.current, nextTemplate, editingVersionId);
  }, [editingVersionId, triggerSave]);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;
      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, -1);
      return {
        present: previous,
        past: newPast,
        future: [prev.present, ...prev.future].slice(0, MAX_HISTORY)
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;
      const next = prev.future[0];
      const newFuture = prev.future.slice(1);
      return {
        present: next,
        past: [...prev.past, prev.present].slice(-MAX_HISTORY),
        future: newFuture
      };
    });
  }, []);

  const analysis = useMemo(() => analyzeCV(history.present, template), [history.present, template]);

  const applyFix = useCallback(
    (id: FixId): string => {
      let toastMessage = '';
      update((prev) => {
        switch (id) {
          case 'keywords': {
            const missing = analysis.keywords.missing.slice(0, 3);
            if (missing.length === 0) {
              toastMessage = 'All priority keywords are already present.';
              return prev;
            }
            toastMessage = `Added ${missing.join(', ')} to your Technical Skills group.`;
            const skills = [...prev.skills];
            const target = skills[0] ?? {
              id: 'skill-tech',
              label: 'Technical Skills',
              skills: []
            };
            const nextSkills = Array.from(new Set([...target.skills, ...missing]));
            if (skills.length === 0) {
              return { ...prev, skills: [{ ...target, skills: nextSkills }] };
            }
            skills[0] = { ...target, skills: nextSkills };
            return { ...prev, skills };
          }
          case 'metrics': {
            const exp = prev.experience.map((item, index) => {
              const bullets = item.bullets.map((b, bIdx) =>
                enhanceBullet(b, index + bIdx)
              );
              return { ...item, bullets };
            });
            toastMessage = 'Enhanced bullets with measurable impact outcomes.';
            return { ...prev, experience: exp };
          }
          case 'skills-summary': {
            const topList = prev.skills
              .flatMap((g) => g.skills)
              .slice(0, 8)
              .join(' · ');
            toastMessage = 'Added an ATS-focused Skills Summary banner.';
            return {
              ...prev,
              skillsSummary: topList
                ? `Core Competencies: ${topList}`
                : 'Core Competencies: SQL · Python · Excel · Power BI · Data Modeling'
            };
          }
          default:
            return prev;
        }
      }, `fix-${id}`);

      return toastMessage;
    },
    [analysis.keywords.missing, update]
  );

  const value = useMemo(
    () => ({
      cv: history.present,
      template,
      setTemplate: handleSetTemplate,
      saveStatus,
      update,
      undo,
      redo,
      canUndo: history.past.length > 0,
      canRedo: history.future.length > 0,
      analysis,
      applyFix,
      versions,
      activeVersionId,
      editingVersionId,
      currentVersion,
      activeVersion,
      setActiveVersion,
      switchEditingVersion,
      createVersion,
      duplicateVersion,
      renameVersion,
      deleteVersion
    }),
    [
      history.present,
      template,
      handleSetTemplate,
      saveStatus,
      update,
      undo,
      redo,
      history.past.length,
      history.future.length,
      analysis,
      applyFix,
      versions,
      activeVersionId,
      editingVersionId,
      currentVersion,
      activeVersion,
      setActiveVersion,
      switchEditingVersion,
      createVersion,
      duplicateVersion,
      renameVersion,
      deleteVersion
    ]
  );

  return <CVContext.Provider value={value}>{children}</CVContext.Provider>;
}

export function useCV() {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
}

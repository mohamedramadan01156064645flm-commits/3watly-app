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
import { analyzeCV, getMarketKeywordsForRole, type Analysis } from '../utils/atsAnalysis';
import { enhanceBullet } from '../utils/cvHelpers';
import {
  addSkillsSmartly,
  getSmartSkillCategory,
  normalizeSkillName,
  areSkillsEquivalent
} from '../utils/skillTaxonomy';
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
  applyFix: (id: FixId) => Promise<string>;
  addSkillToActiveCv: (skillName: string, categoryLabel?: string) => Promise<{ success: boolean; categoryLabel: string; isNew: boolean }>;

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

function syncActiveCVToPlatform(version: CVVersion, userId?: string) {
  let uid = userId;
  if (!uid && typeof window !== 'undefined') {
    try {
      const rawUser = localStorage.getItem('3watly_user');
      if (rawUser) {
        uid = JSON.parse(rawUser)?.id;
      }
    } catch {}
  }

  try {
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
      github: version.cvData.contact.github || '',
      portfolio: version.cvData.contact.portfolio || '',
      socialLinks: version.cvData.contact.socialLinks || [],
      links: (version.cvData.contact.socialLinks || []).map(sl => ({
        title: sl.platform,
        url: sl.url,
        type: sl.platform.toLowerCase() as any
      })),
      summary: version.cvData.summary,
      targetRole: version.targetRole || version.cvData.contact.jobTitle,
      skills: flatSkills,
      categorizedSkillGroups: version.cvData.skills,
      experiences: version.cvData.experience,
      education: version.cvData.education,
      projects: version.cvData.projects,
      atsScore: version.atsScore ?? (version.analysis?.score ?? analyzeCV(version.cvData, version.templateId).score),
      atsReport: {
        score: version.atsScore ?? (version.analysis?.score ?? analyzeCV(version.cvData, version.templateId).score),
        band: version.analysis?.band
      }
    };

    const targetRoleVal = version.targetRole || version.cvData.contact.jobTitle;

    // Save to user-scoped keys
    if (uid) {
      localStorage.setItem(`3watly_active_cv_id_${uid}`, version.id);
      localStorage.setItem(`3watly_target_role_${uid}`, targetRoleVal);
      localStorage.setItem(`3watly_parsed_cv_${uid}`, JSON.stringify(parsedData));
    }

    // Save to global keys for backward compatibility
    localStorage.setItem('3watly_active_cv_id', version.id);
    localStorage.setItem('3watly_target_role', targetRoleVal);
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
  const userRef = useRef(user);
  userRef.current = user;

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
    if (!user?.id) return;
    let isMounted = true;
    const supabase = createClient();

    // ── One-time migration: remove stale duplicate keys from 3watly_parsed_cv ──
    // Older versions of syncActiveCVToPlatform saved both 'experiences' + 'experience'
    // and both 'education' + 'educationHistory', causing double entries in the CV Builder.
    try {
      const rawParsed = localStorage.getItem(`3watly_parsed_cv_${user?.id}`);
      if (rawParsed) {
        const p = JSON.parse(rawParsed);
        let changed = false;
        // Remove the stale alias key 'educationHistory' — 'education' is canonical
        if (p.educationHistory !== undefined) { delete p.educationHistory; changed = true; }
        // Remove stale alias key 'experience' — 'experiences' is canonical (from parse API)
        // But ONLY if 'experiences' already exists and is equal in length
        if (p.experience !== undefined && Array.isArray(p.experiences) && p.experiences.length > 0) {
          delete p.experience; changed = true;
        }
        if (changed) localStorage.setItem(`3watly_parsed_cv_${user?.id}`, JSON.stringify(p));
      }
    } catch {}

    const loadAllCVData = async () => {
      let initialVersionsList: CVVersion[] = [];
      let activeId = 'ver-default';

      // 1. Try loading versions from localStorage
      try {
        const savedVersionsJson = localStorage.getItem(`3watly_cv_versions_${user?.id}`);
        const savedActiveId = localStorage.getItem(`3watly_active_cv_id_${user?.id}`);
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

      // 1.5. If no versions in localStorage, fetch saved CV document from Supabase cloud
      if (initialVersionsList.length === 0 && user?.id) {
        try {
          const cloudRes = await fetch(`/api/cv/document?userId=${encodeURIComponent(user.id)}`);
          if (cloudRes.ok) {
            const cloudJson = await cloudRes.json();
            const doc = cloudJson.document;
            if (doc) {
              if (Array.isArray(doc.versions) && doc.versions.length > 0) {
                initialVersionsList = doc.versions;
                activeId = doc.activeVersionId || doc.versions[0].id;
                try {
                  localStorage.setItem(`3watly_cv_versions_${user.id}`, JSON.stringify(initialVersionsList));
                  localStorage.setItem(`3watly_active_cv_id_${user.id}`, activeId);
                } catch {}
              }
              if (doc.parsedCv) {
                try {
                  localStorage.setItem(`3watly_parsed_cv_${user.id}`, JSON.stringify(doc.parsedCv));
                  localStorage.setItem('3watly_parsed_cv', JSON.stringify(doc.parsedCv));
                } catch {}
              }
              if (doc.cvData && initialVersionsList.length === 0) {
                const cloudVersion: CVVersion = {
                  id: 'ver-cloud-primary',
                  name: doc.filename || 'سيرتي الذاتية المحفوظة',
                  targetRole: doc.targetRole || 'Professional',
                  cvData: doc.cvData,
                  templateId: 'ats-classic',
                  createdAt: doc.updatedAt || new Date().toISOString(),
                  updatedAt: doc.updatedAt || new Date().toISOString(),
                  isActive: true
                };
                initialVersionsList = [cloudVersion];
                activeId = cloudVersion.id;
                try {
                  localStorage.setItem(`3watly_cv_versions_${user.id}`, JSON.stringify(initialVersionsList));
                  localStorage.setItem(`3watly_active_cv_id_${user.id}`, activeId);
                } catch {}
              }
            }
          }
        } catch (cloudErr) {
          console.warn('Could not restore CV from cloud:', cloudErr);
        }
      }

      // 2. Check if active version has no real content or if a richer parsed CV exists in 3watly_parsed_cv
      let shouldRebuildFromParsed = initialVersionsList.length === 0;
      if (!shouldRebuildFromParsed) {
        const activeVer = initialVersionsList.find(v => v.id === activeId);
        const parsedOnboardingStr = localStorage.getItem(`3watly_parsed_cv_${user?.id}`);
        if (parsedOnboardingStr) {
          try {
            const p = JSON.parse(parsedOnboardingStr);
            const pHasContent = Boolean(p && (p.fullName || (Array.isArray(p.skills) && p.skills.length > 0) || (Array.isArray(p.projects) && p.projects.length > 0)));
            const activeVerIsBare = !activeVer || (!activeVer.cvData?.contact?.fullName && (!activeVer.cvData?.projects || activeVer.cvData?.projects.length === 0));
            if (pHasContent && activeVerIsBare) {
              shouldRebuildFromParsed = true;
            }
          } catch {}
        }
      }

      // If no versions stored yet or active version is an empty placeholder, create primary version from parsed onboarding CV or draft
      if (shouldRebuildFromParsed) {
        let baseCv = initialCV;
        let baseRole = '';

        try {
          const parsedOnboarding = localStorage.getItem(`3watly_parsed_cv_${user?.id}`);
          if (parsedOnboarding) {
            const p = JSON.parse(parsedOnboarding);

            // ── Experience: prefer p.experiences (API output), fall back to p.experience (synced CV)
            // IMPORTANT: never merge both — they contain the same data, just different keys
            const rawExpList = (() => {
              const fromExperiences = Array.isArray(p.experiences) && p.experiences.length > 0 ? p.experiences : null;
              const fromExperience = Array.isArray(p.experience) && p.experience.length > 0 ? p.experience : null;
              // Use whichever is richer (more bullets = parsed API version)
              if (fromExperiences && fromExperience) {
                const expBullets = fromExperiences.reduce((s: number, e: any) => s + (e.bullets?.length || 0), 0);
                const expBullets2 = fromExperience.reduce((s: number, e: any) => s + (e.bullets?.length || 0), 0);
                return expBullets >= expBullets2 ? fromExperiences : fromExperience;
              }
              return fromExperiences || fromExperience || [];
            })();

            const adaptedExperience = rawExpList.map((exp: any, idx: number) => ({
              id: exp.id || `exp-${idx + 1}`,
              role: exp.role || p.currentTitle || 'Professional',
              company: exp.company || '',
              companyUrl: exp.companyUrl || '',
              startDate: exp.startDate || '',
              endDate: exp.endDate || 'Present',
              current: Boolean(exp.current),
              location: exp.location || p.location || '',
              bullets: Array.isArray(exp.bullets) ? exp.bullets : [],
              type: exp.type || (exp.isIntern || /intern\b|تدريب/i.test(exp.role) ? 'internship' : 'job')
            }));

            // ── Education: use ONLY ONE source to prevent duplication
            // 'education' is canonical (from API). 'educationHistory' is the old alias saved by syncActiveCVToPlatform.
            // Never merge both — they contain the same entries.
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

            // 1. Use pre-structured socialLinks from the parser (new path)
            if (Array.isArray(p.socialLinks) && p.socialLinks.length > 0) {
              p.socialLinks.forEach((l: any) => {
                if (l.url && !parsedSocialLinks.some((sl) => sl.url === l.url)) {
                  parsedSocialLinks.push({
                    id: l.id || `link-${parsedSocialLinks.length}`,
                    platform: (l.platform as import('../types/cv').SocialPlatform) || 'Other',
                    url: l.url
                  });
                }
              });
            }

            // 2. Fallback: use raw links array from ExtractedLinkItem[]
            if (parsedSocialLinks.length === 0 && Array.isArray(p.links) && p.links.length > 0) {
              p.links.forEach((l: any, idx: number) => {
                const platform = platformMap[l.type] ?? 'Other';
                if (l.url && !parsedSocialLinks.some(sl => sl.url === l.url)) {
                  parsedSocialLinks.push({ id: `link-${idx}`, platform, url: l.url });
                }
              });
            }

            // 3. Fallback: build from individual linkedin/github/portfolio fields
            if (parsedSocialLinks.length === 0) {
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
              sectionOrder: (Array.isArray(p.sectionOrder) && p.sectionOrder.length > 0
                ? p.sectionOrder
                : ['summary', 'education', 'experience', 'skills', 'projects']) as any,
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

        initialVersionsList = [defaultVersion, ...initialVersionsList.filter(v => v.id !== defaultVersion.id).map(v => ({ ...v, isActive: false }))];
        activeId = defaultVersion.id;
        localStorage.setItem(`3watly_cv_versions_${user?.id}`, JSON.stringify(initialVersionsList));
        localStorage.setItem(`3watly_active_cv_id_${user?.id}`, activeId);
        syncActiveCVToPlatform(defaultVersion, user?.id);
      }

      if (isMounted) {
        setVersions(initialVersionsList);
        setActiveVersionIdState(activeId);
        setEditingVersionId(activeId);

        const currentToEdit = initialVersionsList.find(v => v.id === activeId) || initialVersionsList[0];
        if (currentToEdit) {
          // Auto-heal misclassified 'Data Analyst' titles when version name, summary or experience clearly indicates another profession
          if (
            currentToEdit.cvData &&
            currentToEdit.cvData.contact &&
            (!currentToEdit.cvData.contact.jobTitle || /data\s*analyst/i.test(currentToEdit.cvData.contact.jobTitle))
          ) {
            const nameMatch = currentToEdit.name.match(/\b(sales\s*representative|sales\s*executive|sales\s*specialist|medical\s*representative|pharmacy\s*assistant|technical\s*support|help\s*desk|desktop\s*support|it\s*support|systems?\s*administrator|network\s*engineer|software\s*engineer|frontend\s*developer|backend\s*developer|full\s*stack|mobile\s*developer|product\s*manager|project\s*manager|graphic\s*designer|ui\/ux|devops|cyber\s*security)\b/i);
            const summaryMatch = (currentToEdit.cvData.summary || '').match(/(?:results[- ]driven|results[- ]oriented|accomplished|seasoned|experienced|dynamic|passionate|certified|dedicated|motivated|seeking|as)\s+([A-Za-z\s\/\-&]{3,40}?(?:representative|specialist|engineer|developer|analyst|technician|administrator|manager|coordinator|assistant|consultant|associate|executive|officer|agent))/i);
            const expRole = currentToEdit.cvData.experience?.[0]?.role;

            const detectedRealTitle = (nameMatch ? nameMatch[1] : null) || (summaryMatch ? summaryMatch[1] : null) || (expRole && !/data\s*analyst/i.test(expRole) ? expRole : null);

            if (detectedRealTitle && detectedRealTitle.trim()) {
              const cleanTitle = detectedRealTitle.replace(/\s*resume$/i, '').trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
              currentToEdit.cvData.contact.jobTitle = cleanTitle;
              currentToEdit.targetRole = cleanTitle;
              try {
                localStorage.setItem(`3watly_cv_versions_${user?.id}`, JSON.stringify(initialVersionsList));
                syncActiveCVToPlatform(currentToEdit, user?.id);
              } catch {}
            }
          }

          // Auto-heal missing education if education is empty or invalid
          if (
            currentToEdit.cvData &&
            (!Array.isArray(currentToEdit.cvData.education) || currentToEdit.cvData.education.length === 0 || !currentToEdit.cvData.education.some(e => e.degree?.trim() || e.institution?.trim()))
          ) {
            try {
              const rawParsedStr = localStorage.getItem(`3watly_parsed_cv_${user?.id}`);
              let healedEdu: import('../types/cv').EducationItem[] = [];
              if (rawParsedStr) {
                const parsed = JSON.parse(rawParsedStr);
                const rawEdu = Array.isArray(parsed.education) && parsed.education.length > 0 ? parsed.education : (Array.isArray(parsed.educationHistory) ? parsed.educationHistory : []);
                if (rawEdu.length > 0) {
                  healedEdu = rawEdu.map((edu: any, idx: number) => ({
                    id: edu.id || `edu-${idx + 1}`,
                    degree: edu.degree || 'Bachelor Degree',
                    institution: edu.institution || edu.school || 'University',
                    startDate: edu.startDate || '2018',
                    endDate: edu.endDate || edu.period || '2022',
                    location: edu.location || currentToEdit.cvData.contact.location || '',
                    major: edu.major || ''
                  }));
                } else if (parsed.rawText) {
                  // Re-scan rawText for universities or faculties
                  const uniMatch = parsed.rawText.match(/\b(cairo|ain\s*shams|alexandria|mansoura|helwan|assiut|zagazig|auc|guc|bue|fue|must|msa|miu|aastmt|hti|جامعة\s*[\u0600-\u06FF]+|كلية\s*[\u0600-\u06FF]+)[a-zA-Z\s]{0,30}(?:university|college|academy|institute)?/i);
                  const facMatch = parsed.rawText.match(/\b(faculty\s*of\s*[a-zA-Z\s]+|college\s*of\s*[a-zA-Z\s]+|كلية\s*[\u0600-\u06FF\s]+)/i);
                  if (uniMatch || facMatch) {
                    const instName = uniMatch ? uniMatch[0].trim() : (facMatch ? facMatch[0].trim() : 'University');
                    let degName = facMatch ? facMatch[0].trim() : 'Bachelor Degree';
                    if (/pharmacy|صيدل/i.test(parsed.rawText)) degName = 'Bachelor of Pharmacy (B.Pharm)';
                    else if (/commerce|تجارة/i.test(parsed.rawText)) degName = 'Bachelor of Commerce (B.Com)';
                    else if (/engineering|هندس/i.test(parsed.rawText)) degName = 'Bachelor of Engineering (B.Sc.)';
                    else if (/computer|حاسبات/i.test(parsed.rawText)) degName = 'Bachelor of Computer Science (B.Sc.)';

                    healedEdu = [{
                      id: 'edu-healed-1',
                      degree: degName,
                      institution: instName,
                      startDate: '2018',
                      endDate: '2022',
                      location: currentToEdit.cvData.contact.location || 'Cairo, Egypt',
                      major: /pharmacy/i.test(degName) ? 'Pharmacy' : ''
                    }];
                  }
                }
              }

              if (healedEdu.length > 0) {
                currentToEdit.cvData.education = healedEdu;
                localStorage.setItem(`3watly_cv_versions_${user?.id}`, JSON.stringify(initialVersionsList));
                syncActiveCVToPlatform(currentToEdit, user?.id);
              }
            } catch (e) {
              console.warn('Education auto-heal error:', e);
            }
          }

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

    // Event listener for cross-context CV updates (from Onboarding, direct uploads, or re-parses)
    const handleActiveCVChanged = (event: Event) => {
      const customEvent = event as CustomEvent<CVVersion>;
      const version = customEvent.detail;
      if (version && version.id && version.cvData) {
        setVersions(prev => {
          const filtered = prev.filter(v => v.id !== version.id).map(v => ({ ...v, isActive: false }));
          return [version, ...filtered];
        });
        setActiveVersionIdState(version.id);
        setEditingVersionId(version.id);
        setHistory({
          present: version.cvData,
          past: [],
          future: []
        });
        setTemplate(version.templateId || 'ats-classic');
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('3watly_active_cv_changed', handleActiveCVChanged);
    }

    return () => {
      isMounted = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('3watly_active_cv_changed', handleActiveCVChanged);
      }
    };
  }, [user]);

  // Clear in-memory CV data immediately on user logout so stale CV is not held in memory
  useEffect(() => {
    if (!user?.id) {
      setVersions([]);
      setHistory({
        present: initialCV,
        past: [],
        future: []
      });
      setActiveVersionIdState('ver-default');
      setEditingVersionId('ver-default');
    }
  }, [user?.id]);

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
      let versionToSync: CVVersion | null = null;
      let nextVersions: CVVersion[] = [];

      setVersions(prev => {
        const next = prev.map(v => {
          if (v.id === versionIdToSave) {
            const liveAnalysis = analyzeCV(updatedCv, currentTemplate);
            const updated: CVVersion = {
              ...v,
              cvData: updatedCv,
              templateId: currentTemplate,
              updatedAt: new Date().toISOString(),
              atsScore: liveAnalysis.score,
              analysis: liveAnalysis
            };
            if (v.id === activeVersionId) {
              versionToSync = updated;
            }
            return updated;
          }
          return v;
        });

        nextVersions = next;
        const uid = userRef.current?.id;
        try {
          if (uid) {
            localStorage.setItem(`3watly_cv_versions_${uid}`, JSON.stringify(next));
            localStorage.setItem(`3watly_cv_draft_${uid}`, JSON.stringify(updatedCv));
          }
          localStorage.setItem('3watly_cv_versions', JSON.stringify(next));
          localStorage.setItem('3watly_cv_draft', JSON.stringify(updatedCv));
        } catch {}

        return next;
      });

      const uid = userRef.current?.id;
      if (versionToSync) {
        syncActiveCVToPlatform(versionToSync!, uid);
      }

      // Background cloud sync to Supabase
      if (uid) {
        try {
          const targetVer = nextVersions.find(v => v.id === versionIdToSave) || versionToSync;
          fetch('/api/cv/document', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: uid,
              cvData: updatedCv,
              versions: nextVersions,
              activeVersionId,
              targetRole: targetVer?.targetRole || updatedCv.contact.jobTitle,
              filename: targetVer?.name || 'Curriculum Vitae'
            })
          }).catch(() => null);
        } catch {}
      }

      setSaveStatus('saved');
    }, 450);
  }, [activeVersionId]);

  // Switch which version is currently being edited in CV Builder
  const switchEditingVersion = useCallback((id: string) => {
    setVersions(prev => {
      const target = prev.find(v => v.id === id);
      if (target) {
        setEditingVersionId(target.id);
        setHistory({
          present: target.cvData,
          past: [],
          future: []
        });
        setTemplate(target.templateId || 'ats-classic');
        toast.info(`تم التبديل لمحرر: ${target.name}`);
      }
      return prev;
    });
  }, []);

  // Set version as platform active (drives Jobs, ATS, Skill Gap, Copilot)
  const setActiveVersion = useCallback((id: string) => {
    const uid = userRef.current?.id;
    setVersions(prev => {
      const target = prev.find(v => v.id === id);
      if (!target) return prev;

      setActiveVersionIdState(target.id);
      const next = prev.map(v => ({
        ...v,
        isActive: v.id === target.id
      }));

      try {
        if (uid) {
          localStorage.setItem(`3watly_cv_versions_${uid}`, JSON.stringify(next));
          localStorage.setItem(`3watly_active_cv_id_${uid}`, target.id);
        }
        localStorage.setItem('3watly_cv_versions', JSON.stringify(next));
        localStorage.setItem('3watly_active_cv_id', target.id);
      } catch {}

      syncActiveCVToPlatform({ ...target, isActive: true }, uid);

      if (uid) {
        try {
          fetch('/api/cv/document', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: uid,
              cvData: target.cvData,
              versions: next,
              activeVersionId: target.id,
              targetRole: target.targetRole,
              filename: target.name
            })
          }).catch(() => null);
        } catch {}
      }

      toast.success(`تم تعيين "${target.name}" كنسخة أساسية نشطة للمنصة 🎯`);
      return next;
    });
  }, []);

  // Create a brand new version (immediately updates editor and preview state)
  const createVersion = useCallback((name: string, targetRole: string = 'Data Analyst', fromCv?: CVData) => {
    const newId = `ver-${Date.now()}`;
    const cvPayload = fromCv || initialCV;
    const newVersion: CVVersion = {
      id: newId,
      name: name.trim() || 'سيرة ذاتية جديدة',
      targetRole: targetRole.trim() || 'Data Analyst',
      cvData: cvPayload,
      templateId: 'ats-classic',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    };

    const uid = userRef.current?.id;
    let nextVersions: CVVersion[] = [];

    setVersions(prev => {
      const next = [newVersion, ...prev.map(v => ({ ...v, isActive: false }))];
      nextVersions = next;
      try {
        if (uid) {
          localStorage.setItem(`3watly_cv_versions_${uid}`, JSON.stringify(next));
          localStorage.setItem(`3watly_active_cv_id_${uid}`, newId);
          localStorage.setItem(`3watly_cv_draft_${uid}`, JSON.stringify(cvPayload));
        }
        localStorage.setItem('3watly_cv_versions', JSON.stringify(next));
        localStorage.setItem('3watly_active_cv_id', newId);
        localStorage.setItem('3watly_cv_draft', JSON.stringify(cvPayload));
      } catch {}
      return next;
    });

    // Synchronously update editor & preview state
    setEditingVersionId(newId);
    setActiveVersionIdState(newId);
    setHistory({
      present: cvPayload,
      past: [],
      future: []
    });
    setTemplate('ats-classic');

    syncActiveCVToPlatform(newVersion, uid);

    if (uid) {
      try {
        fetch('/api/cv/document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: uid,
            cvData: cvPayload,
            versions: nextVersions,
            activeVersionId: newId,
            targetRole: newVersion.targetRole,
            filename: newVersion.name
          })
        }).catch(() => null);
      } catch {}
    }

    toast.success(`تم إنشاء وتفعيل: "${newVersion.name}" 🚀`);
    return newVersion;
  }, []);

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

    const uid = userRef.current?.id;
    let nextVersions: CVVersion[] = [];

    setVersions(prev => {
      const next = [...prev, duplicated];
      nextVersions = next;
      try {
        if (uid) {
          localStorage.setItem(`3watly_cv_versions_${uid}`, JSON.stringify(next));
        }
        localStorage.setItem('3watly_cv_versions', JSON.stringify(next));
      } catch {}
      return next;
    });

    switchEditingVersion(newId);

    if (uid) {
      try {
        fetch('/api/cv/document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: uid,
            cvData: duplicated.cvData,
            versions: nextVersions,
            activeVersionId,
            targetRole: duplicated.targetRole,
            filename: duplicated.name
          })
        }).catch(() => null);
      } catch {}
    }

    toast.success(`تم استنساخ النسخة بنجاح: "${duplicated.name}"`);
    return duplicated;
  }, [versions, currentVersion, createVersion, switchEditingVersion, activeVersionId]);

  // Rename a version
  const renameVersion = useCallback((id: string, newName: string, newTargetRole?: string) => {
    const uid = userRef.current?.id;
    let nextVersions: CVVersion[] = [];

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
            syncActiveCVToPlatform(updated, uid);
          }
          return updated;
        }
        return v;
      });
      nextVersions = next;
      try {
        if (uid) {
          localStorage.setItem(`3watly_cv_versions_${uid}`, JSON.stringify(next));
        }
        localStorage.setItem('3watly_cv_versions', JSON.stringify(next));
      } catch {}
      return next;
    });

    if (uid) {
      try {
        const activeOne = nextVersions.find(v => v.id === activeVersionId) || nextVersions[0];
        fetch('/api/cv/document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: uid,
            cvData: activeOne?.cvData,
            versions: nextVersions,
            activeVersionId,
            targetRole: activeOne?.targetRole,
            filename: activeOne?.name
          })
        }).catch(() => null);
      } catch {}
    }

    toast.success('تم تحديث اسم ومجال النسخة بنجاح');
  }, [activeVersionId]);

  // Delete a version (must retain at least 1)
  const deleteVersion = useCallback((id: string) => {
    if (versions.length <= 1) {
      toast.error('لا يمكن حذف النسخة الوحيدة المتبقية');
      return;
    }

    const uid = userRef.current?.id;
    let nextVersions: CVVersion[] = [];

    setVersions(prev => {
      const next = prev.filter(v => v.id !== id);
      nextVersions = next;
      try {
        if (uid) {
          localStorage.setItem(`3watly_cv_versions_${uid}`, JSON.stringify(next));
        }
        localStorage.setItem('3watly_cv_versions', JSON.stringify(next));
      } catch {}

      // If we deleted the active or editing version, fallback to first available
      if (id === activeVersionId) {
        const newActive = next[0];
        setActiveVersionIdState(newActive.id);
        syncActiveCVToPlatform(newActive, uid);
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

    if (uid) {
      try {
        const activeOne = nextVersions.find(v => v.id === activeVersionId) || nextVersions[0];
        fetch('/api/cv/document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: uid,
            cvData: activeOne?.cvData,
            versions: nextVersions,
            activeVersionId: activeOne?.id,
            targetRole: activeOne?.targetRole,
            filename: activeOne?.name
          })
        }).catch(() => null);
      } catch {}
    }

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
    async (id: FixId): Promise<string> => {
      let toastMessage = '';
      const current = cvRef.current;
      const targetRole = current.contact.jobTitle || activeVersion?.targetRole || 'Professional';
      const flatSkills: string[] = current.skills.flatMap((g) => g.skills);

      switch (id) {
        case 'metrics': {
          const hasExp = (current.experience || []).length > 0;
          const hasProj = (current.projects || []).length > 0;

          if (!hasExp && !hasProj) {
            toastMessage = 'لا توجد خبرات أو مشاريع مسجلة بعد لتطبيق تحسين الصياغة عليها.';
            return toastMessage;
          }

          toast.loading(
            'جاري استدعاء الذكاء الاصطناعي (Gemini) لإعادة صياغة الإنجازات وفق معايير ATS ومعادلة X-Y-Z...',
            { id: 'ats-fix' }
          );

          try {
            let newExp = current.experience;
            if (hasExp) {
              const allExpBullets = current.experience.flatMap((e) => e.bullets || []).filter(b => b.trim().length > 0);
              if (allExpBullets.length > 0) {
                const res = await fetch('/api/cv/enhance', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    type: 'bullets',
                    role: targetRole,
                    skills: flatSkills,
                    bullets: allExpBullets
                  })
                });
                if (res.ok) {
                  const data = await res.json();
                  if (Array.isArray(data.bullets) && data.bullets.length > 0) {
                    let cursor = 0;
                    newExp = current.experience.map((item) => {
                      const count = (item.bullets || []).length;
                      const enhancedSlice = data.bullets.slice(cursor, cursor + count);
                      cursor += count;
                      return {
                        ...item,
                        bullets: enhancedSlice.length > 0 ? enhancedSlice : item.bullets
                      };
                    });
                  }
                }
              }
            }

            let newProjects = current.projects;
            if (hasProj) {
              const allProjBullets = current.projects.flatMap((p) => p.bullets || []).filter(b => b.trim().length > 0);
              if (allProjBullets.length > 0) {
                const res = await fetch('/api/cv/enhance', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    type: 'bullets',
                    role: targetRole,
                    skills: flatSkills,
                    bullets: allProjBullets
                  })
                });
                if (res.ok) {
                  const data = await res.json();
                  if (Array.isArray(data.bullets) && data.bullets.length > 0) {
                    let cursor = 0;
                    newProjects = current.projects.map((item) => {
                      const count = (item.bullets || []).length;
                      const enhancedSlice = data.bullets.slice(cursor, cursor + count);
                      cursor += count;
                      return {
                        ...item,
                        bullets: enhancedSlice.length > 0 ? enhancedSlice : item.bullets
                      };
                    });
                  }
                }
              }
            }

            update((prev) => ({
              ...prev,
              experience: newExp,
              projects: newProjects
            }), 'fix-metrics');

            toast.dismiss('ats-fix');
            return 'تمت ترقية نقاط الإنجازات بنجاح بواسطة الذكاء الاصطناعي وتطبيق صياغة الـ ATS المقاسة!';
          } catch {
            toast.dismiss('ats-fix');
            const fallbackExp = current.experience.map((item, idx) => ({
              ...item,
              bullets: (item.bullets || []).map((b, bIdx) => enhanceBullet(b, idx + bIdx))
            }));
            const fallbackProjects = current.projects.map((item, idx) => ({
              ...item,
              bullets: (item.bullets || []).map((b, bIdx) => enhanceBullet(b, idx + bIdx))
            }));
            update((prev) => ({
              ...prev,
              experience: fallbackExp,
              projects: fallbackProjects
            }), 'fix-metrics');
            return 'تم تحسين صياغة نقاط الخبرات والمشاريع بأفعال إنجاز قوية.';
          }
        }

        case 'summary-missing':
        case 'summary-short': {
          toast.loading(
            'جاري كتابة ملخص مهني احترافي بالذكاء الاصطناعي مستنداً لمهاراتك وهدفك الوظيفي...',
            { id: 'ats-fix' }
          );

          try {
            const res = await fetch('/api/cv/enhance', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'summary',
                role: targetRole,
                skills: flatSkills.slice(0, 10),
                content: current.summary
              })
            });

            if (res.ok) {
              const data = await res.json();
              if (data.summary && data.summary.trim().length > 20) {
                update((prev) => ({
                  ...prev,
                  summary: data.summary.trim()
                }), 'fix-summary');
                toast.dismiss('ats-fix');
                return 'تمت صياغة ملخص مهني احترافي متوافق تماماً مع الـ ATS بالذكاء الاصطناعي!';
              }
            }
          } catch {}

          toast.dismiss('ats-fix');
          const fallbackSummary = `Results-driven ${targetRole} with solid expertise in ${flatSkills.slice(0, 5).join(', ')}. Demonstrated experience in delivering robust technical solutions, optimizing workflows, and driving measurable impact.`;
          update((prev) => ({ ...prev, summary: fallbackSummary }), 'fix-summary');
          return 'تمت إضافة ملخص مهني احترافي متوافق مع أنظمة الـ ATS.';
        }

        case 'few-bullets': {
          toast.loading(
            'جاري توليد نقاط إنجاز تفصيلية بالأفعال القوية بالذكاء الاصطناعي...',
            { id: 'ats-fix' }
          );

          try {
            const res = await fetch('/api/cv/enhance', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'bullets',
                role: targetRole,
                skills: flatSkills,
                bullets: [
                  `Developed core features and technical implementations for ${targetRole}.`,
                  `Collaborated on architecture design, testing, and continuous deployment pipelines.`,
                  `Analyzed performance metrics and optimized workflow throughput.`
                ]
              })
            });

            let newBullets = [
              `Engineered scalable ${targetRole} solutions leveraging modern technical workflows.`,
              `Collaborated with cross-functional teams to deliver high-quality project milestones.`,
              `Optimized execution pipelines resulting in measurable productivity gains.`
            ];

            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data.bullets) && data.bullets.length > 0) {
                newBullets = data.bullets;
              }
            }

            update((prev) => {
              const newExp = prev.experience.map((e) => {
                if ((e.bullets || []).filter(b => b.trim()).length < 2) {
                  return { ...e, bullets: [...(e.bullets || []).filter(b => b.trim()), ...newBullets.slice(0, 2)] };
                }
                return e;
              });

              const newProjects = prev.projects.map((p) => {
                if ((p.bullets || []).filter(b => b.trim()).length < 2) {
                  return { ...p, bullets: [...(p.bullets || []).filter(b => b.trim()), ...newBullets.slice(0, 2)] };
                }
                return p;
              });

              return { ...prev, experience: newExp, projects: newProjects };
            }, 'fix-few-bullets');

            toast.dismiss('ats-fix');
            return 'تمت إضافة نقاط إنجاز تفصيلية مدعومة بالذكاء الاصطناعي!';
          } catch {
            toast.dismiss('ats-fix');
            return 'تمت إضافة نقاط إنجاز تفصيلية.';
          }
        }

        case 'keywords': {
          const missing = analysis.keywords.missing.slice(0, 4);
          if (missing.length === 0) {
            return 'كافة الكلمات المفتاحية الأساسية موجودة بالفعل!';
          }

          update((prev) => {
            const smartSkills = addSkillsSmartly(prev.skills, missing, true);
            return { ...prev, skills: smartSkills };
          }, 'fix-keywords');

          return `تمت إضافة الكلمات المفتاحية الناقصة (${missing.join('، ')}) وتوزيعها بذكاء في أقسامها الصحيحة بالسيرة الذاتية 🎯`;
        }

        case 'few-skills': {
          const roleKeywords = getMarketKeywordsForRole(targetRole);
          const currentLower = new Set(flatSkills.map(s => s.toLowerCase()));
          const toAdd = roleKeywords.keywords.filter((k: string) => !currentLower.has(k.toLowerCase())).slice(0, 5);

          if (toAdd.length === 0) {
            return 'قسم المهارات مكتمل وشامل بالفعل!';
          }

          update((prev) => {
            const smartSkills = addSkillsSmartly(prev.skills, toAdd, true);
            return { ...prev, skills: smartSkills };
          }, 'fix-few-skills');

          return `تمت إضافة ${toAdd.join('، ')} وتوزيعها في الأقسام المخصصة لرفع مطابقة الـ ATS 🚀`;
        }



        case 'linkedin-missing': {
          const cleanName = (current.contact.fullName || 'user').toLowerCase().replace(/\s+/g, '-');
          const defaultUrl = `https://linkedin.com/in/${cleanName}`;

          update((prev) => ({
            ...prev,
            contact: {
              ...prev.contact,
              linkedin: defaultUrl
            }
          }), 'fix-linkedin');

          return 'تمت إضافة رابط LinkedIn إلى بيانات التواصل (يمكنك تعديل الرابط من قسم بيانات التواصل بمحرر الـ CV).';
        }

        default:
          return 'تم تحديث السيرة الذاتية.';
      }
    },
    [analysis.keywords.missing, activeVersion?.targetRole, update]
  );

  const addSkillToActiveCv = useCallback(
    async (
      skillName: string,
      customCategoryLabel?: string
    ): Promise<{ success: boolean; categoryLabel: string; isNew: boolean }> => {
      const canon = normalizeSkillName(skillName);
      if (!canon) return { success: false, categoryLabel: '', isNew: false };

      let targetLabel = '';
      let isNew = false;

      update((prev) => {
        const skills = (prev.skills || []).map((g) => ({ ...g, skills: [...g.skills] }));

        if (customCategoryLabel && customCategoryLabel.trim()) {
          const trimmedCustom = customCategoryLabel.trim();
          const existingGroup = skills.find(
            (g) => g.label.trim().toLowerCase() === trimmedCustom.toLowerCase()
          );
          if (existingGroup) {
            targetLabel = existingGroup.label;
            if (!existingGroup.skills.some((s) => areSkillsEquivalent(s, canon))) {
              existingGroup.skills.push(canon);
            }
            return { ...prev, skills };
          } else {
            isNew = true;
            targetLabel = trimmedCustom;
            skills.push({
              id: `group-${Date.now().toString(36)}`,
              label: trimmedCustom,
              skills: [canon]
            });
            return { ...prev, skills };
          }
        }

        const meta = getSmartSkillCategory(canon, skills, true);
        targetLabel = meta.targetGroupLabel;
        isNew = meta.isNewGroup;

        const updated = addSkillsSmartly(skills, [canon], true);
        return { ...prev, skills: updated };
      }, 'add-skill-smart');

      return { success: true, categoryLabel: targetLabel, isNew };
    },
    [update]
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
      addSkillToActiveCv,
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
      addSkillToActiveCv,
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

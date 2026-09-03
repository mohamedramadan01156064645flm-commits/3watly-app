export const ALLOWED_NAV_PATHS = [
  '/dashboard',
  '/jobs',
  '/skill-plan',
  '/cv-builder',
  '/ats-diagnostics',
  '/market',
  '/settings',
  '/onboarding/upload-cv',
] as const;

export type AllowedNavigationPath = (typeof ALLOWED_NAV_PATHS)[number];

export interface NavPathMeta {
  path: AllowedNavigationPath;
  defaultLabelAr: string;
  defaultLabelEn: string;
}

export const NAV_PATH_REGISTRY: Record<AllowedNavigationPath, NavPathMeta> = {
  '/dashboard': {
    path: '/dashboard',
    defaultLabelAr: 'لوحة التحكم الرئيسية',
    defaultLabelEn: 'Career Dashboard',
  },
  '/jobs': {
    path: '/jobs',
    defaultLabelAr: 'استعراض الوظائف المطابقة',
    defaultLabelEn: 'Explore Matched Jobs',
  },
  '/skill-plan': {
    path: '/skill-plan',
    defaultLabelAr: 'بناء خطة المهارات',
    defaultLabelEn: 'Skill Gap & Learning Plan',
  },
  '/cv-builder': {
    path: '/cv-builder',
    defaultLabelAr: 'محرر السيرة الذاتية (CV Builder)',
    defaultLabelEn: 'Edit CV in Builder',
  },
  '/ats-diagnostics': {
    path: '/ats-diagnostics',
    defaultLabelAr: 'فحص الـ ATS وتوافق السيرة الذاتية',
    defaultLabelEn: 'ATS Diagnostic & Score',
  },
  '/market': {
    path: '/market',
    defaultLabelAr: 'مؤشرات وسوق العمل المصري',
    defaultLabelEn: 'Market Intelligence',
  },
  '/settings': {
    path: '/settings',
    defaultLabelAr: 'إعدادات الحساب والملف الشخصي',
    defaultLabelEn: 'Profile Settings',
  },
  '/onboarding/upload-cv': {
    path: '/onboarding/upload-cv',
    defaultLabelAr: 'رفع سيرة ذاتية جديدة',
    defaultLabelEn: 'Upload New CV',
  },
};

export function isAllowedNavPath(path: string): path is AllowedNavigationPath {
  return ALLOWED_NAV_PATHS.includes(path as AllowedNavigationPath);
}

export function sanitizeNavPath(path: string): AllowedNavigationPath | null {
  const clean = path.trim().split('?')[0].replace(/\/+$/, '') || '/';
  if (isAllowedNavPath(clean)) return clean;
  if (clean.startsWith('/jobs')) return '/jobs';
  if (clean.startsWith('/skill')) return '/skill-plan';
  if (clean.startsWith('/cv')) return '/cv-builder';
  if (clean.startsWith('/ats')) return '/ats-diagnostics';
  if (clean.startsWith('/market')) return '/market';
  if (clean.startsWith('/dash')) return '/dashboard';
  if (clean.startsWith('/setting')) return '/settings';
  return null;
}

export function inferNavigationButtons(
  text: string,
  isAr: boolean = true
): Array<{ path: AllowedNavigationPath; label: string; priority: 'primary' | 'secondary' }> {
  if (!text) return [];
  const t = text.toLowerCase();
  const buttons: Array<{ path: AllowedNavigationPath; label: string; priority: 'primary' | 'secondary' }> = [];

  const mentionsJobs = /وظائف|وظيفة|شاغر|شواغر|تقديم|شركات|تطابق|match|فرص|شركة|job|hiring|company/i.test(t);
  const mentionsATS = /ats|سيرة|سيرتك|cv|فحص|توافق|تنسيق|صياغة|معدل|resume/i.test(t);
  const mentionsSkills = /مهارة|مهارات|فجوة|تعلم|كورسات|مسار|دورات|skill|learn|course|gap/i.test(t);
  const mentionsCVEdit = /تعديل|إضافة|محرر|أقسام|خبرات|مشاريع|builder|edit cv/i.test(t);
  const mentionsMarket = /سوق|رواتب|راتب|طلب|نمو|إحصائيات|market|salary|trend/i.test(t);

  if (mentionsJobs) {
    buttons.push({
      path: '/jobs',
      label: isAr ? 'استعراض الوظائف المطابقة' : 'Explore Matching Jobs',
      priority: 'primary',
    });
  }

  if (mentionsATS) {
    buttons.push({
      path: '/ats-diagnostics',
      label: isAr ? 'فحص السيرة الذاتية (ATS)' : 'Check ATS Score',
      priority: buttons.length === 0 ? 'primary' : 'secondary',
    });
  } else if (mentionsSkills) {
    buttons.push({
      path: '/skill-plan',
      label: isAr ? 'خطة سد الفجوة المهارية' : 'View Skill Plan',
      priority: buttons.length === 0 ? 'primary' : 'secondary',
    });
  } else if (mentionsCVEdit) {
    buttons.push({
      path: '/cv-builder',
      label: isAr ? 'محرر السيرة الذاتية' : 'Open CV Builder',
      priority: buttons.length === 0 ? 'primary' : 'secondary',
    });
  } else if (mentionsMarket) {
    buttons.push({
      path: '/market',
      label: isAr ? 'تحليلات السوق والرواتب' : 'Market & Salary Insights',
      priority: buttons.length === 0 ? 'primary' : 'secondary',
    });
  }

  // Fallback guarantee: always provide at least 1 relevant button
  if (buttons.length === 0) {
    buttons.push({
      path: '/jobs',
      label: isAr ? 'استعراض الوظائف المطابقة' : 'Explore Matching Jobs',
      priority: 'primary',
    });
    buttons.push({
      path: '/ats-diagnostics',
      label: isAr ? 'فحص الـ ATS' : 'ATS Diagnostics',
      priority: 'secondary',
    });
  }

  return buttons.slice(0, 2);
}

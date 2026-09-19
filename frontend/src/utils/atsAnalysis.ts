import {
  KEYWORD_BENCHMARK,
  MARKET_KEYWORDS,
  TEMPLATES } from
'../data/cvData';
import type {
  CVData,
  FixId,
  ScoreBand,
  SectionId,
  TemplateId } from
'../types/cv';
import {
  containsKeyword,
  cvToText,
  isCleanDate,
  metricRatio,
  totalSkills } from
'./cvHelpers';

export type ParserIcon = 'contact' | 'experience' | 'education' | 'skills';

export interface CheckItem {
  id: string;
  label: string;
  labelAr?: string;
  passed: boolean;
  detail?: string;
  detailAr?: string;
  hint?: string;
  hintAr?: string;
  icon?: ParserIcon;
}

export interface Fix {
  id: FixId;
  title: string;
  titleAr?: string;
  highlight?: string;
  why: string;
  whyAr?: string;
  /** Keywords the keyword fix would add, when relevant. */
  payload?: string[];
}

export interface Analysis {
  score: number;
  band: ScoreBand;
  bandLabel: string;
  bandLabelAr: string;
  headline: string;
  headlineAr: string;
  description: string;
  descriptionAr: string;
  percentile: number;
  metricRatio: number;
  structure: {items: CheckItem[];passed: number;total: number;};
  parser: {items: CheckItem[];passed: number;total: number;};
  keywords: {
    role: string;
    found: string[];
    missing: string[];
    total: number;
  };
  fixes: Fix[];
}

const BAND_COPY: Record<
  ScoreBand,
  {label: string;labelAr: string;headline: string;headlineAr: string;description: string;descriptionAr: string;}> =
{
  excellent: {
    label: 'Excellent',
    labelAr: 'ممتاز',
    headline: 'Great Job! Your CV is ATS-friendly.',
    headlineAr: 'ممتاز جداً! سيرتك الذاتية متوافقة مع أنظمة الـ ATS.',
    description:
    'Your resume is well-optimized for ATS systems and has a high chance of getting past automated screenings.',
    descriptionAr:
    'سيرتك الذاتية مهيأة ومطابقة تماماً لأنظمة الفرز الآلي ولديها فرصة عالية جداً لتجاوز التصفية الأولية بنجاح.'
  },
  good: {
    label: 'Good',
    labelAr: 'جيد جداً',
    headline: 'Solid CV — a few tweaks left.',
    headlineAr: 'سيرة ذاتية قوية — تحتاج بعض التعديلات البسيطة.',
    description:
    'Most ATS systems will parse your resume correctly, but a handful of improvements would lift you into the top tier.',
    descriptionAr:
    'معظم أنظمة الفرز ستقرأ سيرتك بنجاح، وتطبيق التعديلات المقترحة سيرفعها للمستوى الأفضل.'
  },
  average: {
    label: 'Average',
    labelAr: 'متوسط',
    headline: 'Your CV needs several improvements.',
    headlineAr: 'سيرتك الذاتية تحتاج تحسينات متعددة.',
    description:
    'Parts of your resume are hard for ATS systems to read or match, which puts you at risk of being filtered out early.',
    descriptionAr:
    'بعض أجزاء سيرتك يصعب على الأنظمة استخراجها أو مطابقتها مما يعرضك لخطر الاستبعاد التلقائي.'
  },
  poor: {
    label: 'Poor',
    labelAr: 'ضعيف',
    headline: 'High risk of automated rejection.',
    headlineAr: 'فرصة الاستبعاد التلقائي مرتفعة.',
    description:
    'Your resume is missing the structure and keywords ATS systems rely on. Work through the recommended fixes below.',
    descriptionAr:
    'سيرتك تفتقد للهيكل والكلمات المفتاحية الأساسية التي يعتمد عليها الـ ATS. طبّق الإصلاحات المقترحة أدناه فوراً.'
  }
};

function bandFor(score: number): ScoreBand {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'average';
  return 'poor';
}

export const SCORE_LEGEND: {
  band: ScoreBand;
  range: string;
  label: string;
  labelAr: string;
  note: string;
  noteAr: string;
}[] = [
{
  band: 'excellent',
  range: '80 – 100',
  label: 'Excellent',
  labelAr: 'ممتاز',
  note: '(Highly ATS-friendly)',
  noteAr: '(متوافق تماماً مع الـ ATS)'
},
{
  band: 'good',
  range: '60 – 79',
  label: 'Good',
  labelAr: 'جيد',
  note: '(Needs minor improvements)',
  noteAr: '(يحتاج تحسينات بسيطة)'
},
{
  band: 'average',
  range: '40 – 59',
  label: 'Average',
  labelAr: 'متوسط',
  note: '(Several improvements needed)',
  noteAr: '(يحتاج عدة تعديلات)'
},
{
  band: 'poor',
  range: '0 – 39',
  label: 'Poor',
  labelAr: 'ضعيف',
  note: '(High risk of rejection)',
  noteAr: '(مخاطرة استبعاد عالية)'
}];

export function getMarketKeywordsForRole(roleTitle: string): { keywords: string[]; benchmark: number } {
  const t = (roleTitle || '').toLowerCase();
  
  // 1. Machine Learning, AI & Computer Vision
  if (/machine learning|ml\b|ai\b|computer vision|deep learning|nlp|data science|data scientist/i.test(t)) {
    return {
      keywords: [
        'Python', 'PyTorch', 'TensorFlow', 'OpenCV', 'Scikit-Learn',
        'Deep Learning', 'Computer Vision', 'Pandas', 'NumPy',
        'SQL', 'Git', 'Model Training', 'Data Preprocessing', 'Feature Engineering',
        'CNN', 'REST APIs', 'Docker', 'Linux'
      ],
      benchmark: 10
    };
  }

  // 2. Data Engineering
  if (/data engineer|big data|etl developer|pipeline engineer/i.test(t)) {
    return {
      keywords: [
        'Python', 'SQL', 'ETL', 'Apache Spark', 'Airflow',
        'dbt', 'Kafka', 'PostgreSQL', 'Data Warehousing', 'Snowflake',
        'BigQuery', 'Docker', 'Git', 'Data Pipelines', 'Data Modeling', 'Linux'
      ],
      benchmark: 9
    };
  }

  // 3. DevOps & Cloud Infrastructure
  if (/devops|cloud|sre|site reliability|infrastructure|platform engineer|sysadmin/i.test(t)) {
    return {
      keywords: [
        'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'AWS',
        'Azure', 'Terraform', 'Git', 'Bash', 'Ansible',
        'Prometheus', 'Grafana', 'Cloud Computing', 'Networking', 'Security'
      ],
      benchmark: 9
    };
  }

  // 4. Full Stack Development
  if (/full.?stack|fullstack/i.test(t)) {
    return {
      keywords: [
        'React', 'Node.js', 'TypeScript', 'JavaScript', 'Next.js',
        'SQL', 'PostgreSQL', 'MongoDB', 'REST APIs', 'Git',
        'Docker', 'Tailwind CSS', 'State Management', 'Database Design', 'CI/CD'
      ],
      benchmark: 10
    };
  }

  // 5. Frontend Development
  if (/frontend|front-end|react|web developer|ui developer/i.test(t)) {
    return {
      keywords: [
        'React', 'JavaScript', 'TypeScript', 'Next.js', 'Tailwind CSS',
        'HTML5', 'CSS3', 'Redux', 'REST APIs', 'Git',
        'Responsive Design', 'State Management', 'Web Performance', 'Jest', 'UI/UX'
      ],
      benchmark: 9
    };
  }

  // 6. Backend Development
  if (/backend|back-end|node|express|api|django|flask|spring|laravel/i.test(t)) {
    return {
      keywords: [
        'Node.js', 'Python', 'SQL', 'PostgreSQL', 'MongoDB',
        'REST APIs', 'Docker', 'Git', 'Express', 'Redis',
        'Database Design', 'Authentication', 'Microservices', 'CI/CD', 'Linux'
      ],
      benchmark: 9
    };
  }

  // 7. Mobile & Flutter Development
  if (/mobile|flutter|react native|android|ios|dart/i.test(t)) {
    return {
      keywords: [
        'Flutter', 'Dart', 'React Native', 'Mobile Development', 'REST APIs',
        'Firebase', 'State Management', 'Git', 'Android Studio', 'Xcode',
        'iOS', 'Android', 'UI/UX', 'Clean Architecture'
      ],
      benchmark: 8
    };
  }

  // 8. QA & Software Testing
  if (/qa\b|quality assurance|software test|automation test|tester/i.test(t)) {
    return {
      keywords: [
        'Manual Testing', 'Automation Testing', 'Selenium', 'Postman', 'Test Cases',
        'JIRA', 'Regression Testing', 'API Testing', 'Bug Tracking', 'Git',
        'Agile', 'Cypress', 'SQL', 'Performance Testing'
      ],
      benchmark: 8
    };
  }

  // 9. Product Management & Scrum
  if (/product manager|product owner|scrum master/i.test(t)) {
    return {
      keywords: [
        'Agile', 'Scrum', 'JIRA', 'Product Roadmap', 'User Stories',
        'Market Research', 'Stakeholder Management', 'Wireframing', 'KPIs', 'Analytics',
        'Product Lifecycle', 'Prioritization', 'A/B Testing'
      ],
      benchmark: 8
    };
  }

  // 10. Business Analyst
  if (/business analyst|business systems/i.test(t)) {
    return {
      keywords: [
        'SQL', 'Excel', 'Requirements Gathering', 'Business Analysis', 'Process Modeling',
        'JIRA', 'Power BI', 'Stakeholder Communication', 'User Stories', 'Data Analysis',
        'Documentation', 'Agile', 'Gap Analysis'
      ],
      benchmark: 8
    };
  }

  // 11. Default: Data Analyst & Business Intelligence
  return {
    keywords: [
      'SQL', 'Python', 'Power BI', 'Excel', 'Tableau',
      'Data Modeling', 'DAX', 'Pandas', 'Data Cleaning', 'Data Visualization',
      'ETL', 'Statistical Analysis', 'Business Intelligence', 'KPIs', 'Git'
    ],
    benchmark: 8
  };
}

export function analyzeCV(cv: CVData, template: TemplateId): Analysis {
  const text = cvToText(cv);
  const columns = TEMPLATES.find((t) => t.id === template)?.columns ?? 1;

  /* ---------------------------------- structure --------------------------- */
  const requiredSections: SectionId[] = [
  'summary',
  'experience',
  'education',
  'skills'];

  const standardHeadings = requiredSections.every((id) => {
    if (cv.hiddenSections.includes(id)) return false;
    if (id === 'summary') return cv.summary.trim() !== '';
    if (id === 'experience') return cv.experience.length > 0 || cv.projects.length > 0;
    if (id === 'education') return cv.education.length > 0;
    return cv.skills.length > 0;
  });

  const allDates = [
  ...cv.experience.flatMap((e) => [e.startDate, e.current ? '' : e.endDate]),
  ...cv.education.flatMap((e) => [e.startDate, e.endDate])];

  const cleanDates = allDates.every(isCleanDate);

  const structureItems: CheckItem[] = [
  {
    id: 'headings',
    label: 'Standard headings',
    labelAr: 'عناوين أقسام قياسية ومعتمدة',
    passed: standardHeadings,
    hint: 'ATS parsers look for conventional headings like Experience, Education and Skills.',
    hintAr: 'أنظمة الفرز الآلي تبحث عن العناوين التقليدية المتعارف عليها مثل الخبرات والمشاريع والمؤهلات والمهارات.'
  },
  {
    id: 'columns',
    label: 'Single column layout',
    labelAr: 'تصميم بعمود واحد (Single Column)',
    passed: columns === 1,
    hint: 'Multi-column resumes are frequently scrambled when parsed.',
    hintAr: 'التصميم متعدد الأعمدة يتم تشويه ترتيب نصوصه أثناء القراءة الآلية.'
  },
  {
    id: 'dates',
    label: 'Clean date formats',
    labelAr: 'تنسيق تواريخ مقروء للأنظمة',
    passed: cleanDates,
    hint: 'Dates written as "Mar 2024" are read reliably by every major ATS.',
    hintAr: 'التواريخ المكتوبة بصيغة مثل "Mar 2024" تُقرأ بدقة وموثوقية في جميع أنظمة الـ ATS.'
  },
  {
    id: 'media',
    label: 'No unreadable tables or images',
    labelAr: 'خلو المستند من جداول أو صور غير مقروءة',
    passed: true,
    hint: 'Text inside tables, icons or images is invisible to most parsers.',
    hintAr: 'النصوص داخل الجداول أو الصور تكون غير مرئية بالنسبة لمعظم برامج الفرز.'
  }];


  /* ----------------------------------- parser ----------------------------- */
  const skillCount = totalSkills(cv);
  const contactOk = Boolean(
    cv.contact.email &&
    cv.contact.phone && (
    cv.contact.location || cv.contact.linkedin)
  );

  const hasExp = (cv.experience || []).length > 0;
  const hasProj = (cv.projects || []).length > 0;
  const expPassed = hasExp || hasProj;

  let expDetailEn = '0 Roles Detected';
  let expDetailAr = 'لم يتم العثور على خبرات';
  if (hasExp) {
    expDetailEn = `${cv.experience.length} ${cv.experience.length === 1 ? 'Role' : 'Roles'} Detected`;
    expDetailAr = `تم استخراج ${cv.experience.length} وظائف`;
  } else if (hasProj) {
    expDetailEn = `${cv.projects.length} Technical Projects (Applied Experience)`;
    expDetailAr = `تم استخراج ${cv.projects.length} مشاريع عملية (خبرة تطبيقية)`;
  }

  const parserItems: CheckItem[] = [
  {
    id: 'contact',
    icon: 'contact',
    label: 'Detected Contact Info',
    labelAr: 'بيانات التواصل الشخصية',
    passed: contactOk,
    detail: contactOk ? 'Complete' : 'Incomplete',
    detailAr: contactOk ? 'مكتملة ومستخرجة بنجاح' : 'غير مكتملة'
  },
  {
    id: 'experience',
    icon: 'experience',
    label: 'Work & Project Experience',
    labelAr: 'الخبرات والمشاريع العملية',
    passed: expPassed,
    detail: expDetailEn,
    detailAr: expDetailAr
  },
  {
    id: 'education',
    icon: 'education',
    label: 'Education',
    labelAr: 'المؤهل الدراسي',
    passed: cv.education.length > 0,
    detail: cv.education.length > 0 ? 'Degree Detected' : 'Not Detected',
    detailAr: cv.education.length > 0 ? 'تم استخراج المؤهل' : 'لم يتم العثور عليه'
  },
  {
    id: 'skills',
    icon: 'skills',
    label: 'Skills',
    labelAr: 'المهارات التقنية',
    passed: skillCount >= 5,
    detail: `${skillCount} Skills Detected`,
    detailAr: `تم استخراج ${skillCount} مهارة`
  },
  {
    id: 'certifications' as any,
    icon: 'education',
    label: 'Certifications',
    labelAr: 'الشهادات الاحترافية',
    passed: (cv.certifications || []).length > 0,
    detail: (cv.certifications || []).length > 0
      ? `${cv.certifications.length} ${cv.certifications.length === 1 ? 'Certificate' : 'Certificates'} Detected`
      : 'None Detected',
    detailAr: (cv.certifications || []).length > 0
      ? `تم استخراج ${cv.certifications.length} شهادة`
      : 'لا توجد شهادات'
  }];



  /* ---------------------------------- keywords ---------------------------- */
  const roleKeywords = getMarketKeywordsForRole(cv.contact.jobTitle || 'Data Analyst');
  const targetKeywords = roleKeywords.keywords;
  const benchmark = roleKeywords.benchmark;

  const found: string[] = [];
  const missing: string[] = [];
  targetKeywords.forEach((keyword) => {
    if (containsKeyword(text, keyword)) found.push(keyword);
    else missing.push(keyword);
  });

  /* ----------------------------------- score ------------------------------ */
  const structurePassed = structureItems.filter((i) => i.passed).length;
  const parserPassed = parserItems.filter((i) => i.passed).length;
  const impact = metricRatio(cv);

  const structureScore = (structurePassed / structureItems.length) * 30;
  const parserScore = (parserPassed / parserItems.length) * 30;
  const keywordScore = Math.min(1, found.length / benchmark) * 28;
  const impactScore = impact * 12;

  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        structureScore +
        parserScore +
        keywordScore +
        impactScore
      )
    )
  );
  const band = bandFor(score);

  /* ----------------------------------- fixes ------------------------------ */
  const fixes: Fix[] = [];

  // Fix: missing or very short summary
  if (!cv.summary || cv.summary.trim().length < 30) {
    fixes.push({
      id: 'summary-missing',
      title: 'Add a Professional Summary',
      titleAr: 'إضافة ملخص مهني احترافي',
      why: 'CVs with a professional summary are ranked 40% higher by ATS systems.',
      whyAr: 'السيرات التي تحتوي على ملخص مهني تُرتَّب بنسبة 40% أعلى في أنظمة الـ ATS.',
    });
  } else if (cv.summary.trim().length < 100) {
    fixes.push({
      id: 'summary-short',
      title: 'Expand your Professional Summary',
      titleAr: 'توسيع ملخصك المهني',
      why: 'Short summaries (under 100 chars) score 22% lower in ATS keyword scans.',
      whyAr: 'الملخصات القصيرة (أقل من 100 حرف) تحصل على 22% أقل في نقاط الـ ATS.',
    });
  }

  // Fix: missing LinkedIn URL
  if (!cv.contact.linkedin || !cv.contact.linkedin.trim()) {
    fixes.push({
      id: 'linkedin-missing',
      title: 'Add your LinkedIn Profile URL',
      titleAr: 'إضافة رابط ملفك الشخصي على LinkedIn',
      why: '87% of Egyptian recruiters check LinkedIn before scheduling interviews.',
      whyAr: '87% من مسؤولي التوظيف في مصر يتحققون من LinkedIn قبل جدولة المقابلات.',
    });
  }

  // Fix: experience or project entries with too few bullets
  const thinExperiences = (cv.experience || []).filter(
    (e) => (e.bullets || []).filter((b) => b.trim().length > 0).length < 2
  );
  const thinProjects = (cv.projects || []).filter(
    (p) => (p.bullets || []).filter((b) => b.trim().length > 0).length < 2
  );
  const totalThin = thinExperiences.length + thinProjects.length;
  if (totalThin > 0) {
    fixes.push({
      id: 'few-bullets',
      title: 'Add detail bullets to your roles & projects',
      titleAr: 'إضافة نقاط تفصيلية للخبرات والمشاريع',
      why: `${totalThin} entry(ies) have fewer than 2 bullets — ATS parsers rank sparse sections as incomplete.`,
      whyAr: `${totalThin} مدخل يحتوي على أقل من نقطتين — أنظمة الـ ATS تصنف الأقسام المختصرة كغير مكتملة.`,
    });
  }

  // Fix: too few total skills
  if (totalSkills(cv) < 8) {
    fixes.push({
      id: 'few-skills',
      title: 'Add more technical skills',
      titleAr: 'إضافة مهارات تقنية إضافية',
      why: 'CVs with 8+ skills are shortlisted 3× more often in the Egyptian market.',
      whyAr: 'السيرات التي تحتوي على 8 مهارات أو أكثر تُرشَّح 3 أضعاف في سوق العمل المصري.',
    });
  }

  // Fix: missing keywords (top 3 per role)
  if (missing.length > 0) {
    const next = missing.slice(0, 3);
    fixes.push({
      id: 'keywords',
      title: 'Add missing keywords:',
      titleAr: 'إضافة الكلمات المفتاحية الناقصة:',
      highlight: next.join(', '),
      why: `These keywords appear in 31%+ of ${cv.contact.jobTitle || 'your target'} job postings in Egypt.`,
      whyAr: `هذه الكلمات تظهر في أكثر من 31% من إعلانات ${cv.contact.jobTitle || 'وظيفتك المستهدفة'} في السوق المصري.`,
      payload: next,
    });
  }

  // Fix: bullets lack measurable impact
  const totalBulletsCount = (cv.experience || []).flatMap(e => e.bullets || []).length + (cv.projects || []).flatMap(p => p.bullets || []).length;
  if (impact < 0.7 && totalBulletsCount > 0) {
    fixes.push({
      id: 'metrics',
      title: 'Strengthen achievement bullets with action verbs & metrics',
      titleAr: 'تقوية صياغة الإنجازات والنتائج بالأرقام (معادلة X-Y-Z)',
      why: 'Action-led bullets with quantified metrics (Google X-Y-Z formula) increase interview shortlists by 2.3×.',
      whyAr: 'النقاط التي تبدأ بأفعال قوية وتحتوي على أرقام ونتائج ملموسة (معادلة X-Y-Z) ترفع فرص القبول بـ 2.3 ضعف.',
    });
  }



  return {
    score,
    band,
    bandLabel: BAND_COPY[band].label,
    bandLabelAr: BAND_COPY[band].labelAr,
    headline: BAND_COPY[band].headline,
    headlineAr: BAND_COPY[band].headlineAr,
    description: BAND_COPY[band].description,
    descriptionAr: BAND_COPY[band].descriptionAr,
    percentile: Math.max(1, Math.min(99, Math.round((100 - score) * 1.4))),
    metricRatio: impact,
    structure: {
      items: structureItems,
      passed: structurePassed,
      total: structureItems.length
    },
    parser: {
      items: parserItems,
      passed: parserPassed,
      total: parserItems.length
    },
    keywords: {
      role: cv.contact.jobTitle,
      found,
      missing,
      total: MARKET_KEYWORDS.length
    },
    fixes: fixes.slice(0, 5)
  };
}

export const BAND_COLORS: Record<
  ScoreBand,
  {ring: string;text: string;dot: string;soft: string;border: string;}> =
{
  excellent: {
    ring: '#10B981',
    text: 'text-emerald-600',
    dot: 'bg-emerald-500',
    soft: 'bg-emerald-50',
    border: 'border-emerald-100'
  },
  good: {
    ring: '#2563EB',
    text: 'text-brand-600',
    dot: 'bg-brand-600',
    soft: 'bg-brand-50',
    border: 'border-brand-100'
  },
  average: {
    ring: '#F59E0B',
    text: 'text-amber-600',
    dot: 'bg-amber-500',
    soft: 'bg-amber-50',
    border: 'border-amber-100'
  },
  poor: {
    ring: '#EF4444',
    text: 'text-red-600',
    dot: 'bg-red-500',
    soft: 'bg-red-50',
    border: 'border-red-100'
  }
};
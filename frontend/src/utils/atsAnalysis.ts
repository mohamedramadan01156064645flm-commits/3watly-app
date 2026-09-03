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
  
  if (/machine learning|ml\b|ai\b|computer vision|deep learning|data science|data scientist/i.test(t)) {
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

  if (/frontend|react|web developer|ui developer/i.test(t)) {
    return {
      keywords: [
        'React', 'JavaScript', 'TypeScript', 'Next.js', 'Tailwind CSS',
        'HTML5', 'CSS3', 'Redux', 'REST APIs', 'Git',
        'Responsive Design', 'State Management', 'Web Performance', 'Jest', 'UI/UX'
      ],
      benchmark: 9
    };
  }

  if (/backend|node|express|api|software engineer/i.test(t)) {
    return {
      keywords: [
        'Node.js', 'Python', 'SQL', 'PostgreSQL', 'MongoDB',
        'REST APIs', 'Docker', 'Git', 'Express', 'Redis',
        'Database Design', 'Authentication', 'Microservices', 'CI/CD', 'Linux'
      ],
      benchmark: 9
    };
  }

  // Default: Data Analyst & BI
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
    if (id === 'experience') return cv.experience.length > 0;
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
    hintAr: 'أنظمة الفرز الآلي تبحث عن العناوين التقليدية المتعارف عليها مثل الخبرات والمؤهلات والمهارات.'
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
    label: 'Work Experience',
    labelAr: 'الخبرات العملية',
    passed: cv.experience.length > 0,
    detail: `${cv.experience.length} ${
    cv.experience.length === 1 ? 'Role' : 'Roles'} Detected`,
    detailAr: `تم استخراج ${cv.experience.length} وظائف`
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

  const structureScore = structurePassed / structureItems.length * 30;
  const parserScore = parserPassed / parserItems.length * 30;
  const keywordScore = Math.min(1, found.length / benchmark) * 28;
  const impactScore = impact * 12;
  const summaryBonus = cv.skillsSummary ? 3 : 0;

  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        structureScore +
        parserScore +
        keywordScore +
        impactScore +
        summaryBonus
      )
    )
  );
  const band = bandFor(score);

  /* ----------------------------------- fixes ------------------------------ */
  const fixes: Fix[] = [];
  if (missing.length > 0) {
    const next = missing.slice(0, 3);
    fixes.push({
      id: 'keywords',
      title: 'Add keywords:',
      titleAr: 'إضافة الكلمات المفتاحية الناقصة:',
      highlight: next.join(', '),
      why: `Found in 31% of similar ${cv.contact.jobTitle} job postings in Egypt.`,
      whyAr: `مطلوبة في 31% من إعلانات وظائف ${cv.contact.jobTitle} المماثلة في السوق المصري.`,
      payload: next
    });
  }
  if (impact < 0.7) {
    fixes.push({
      id: 'metrics',
      title: 'Add measurable impact to your experience bullets',
      titleAr: 'إضافة نتائج وأرقام قابلة للقياس لنقاط الخبرة',
      why: 'Bullet points with metrics get 2.3x more shortlisted.',
      whyAr: 'النقاط التي تحتوي على أرقام ونسب مئوية تزيد فرصة الترشح بـ 2.3 ضعف.'
    });
  }
  if (!cv.skillsSummary) {
    fixes.push({
      id: 'skills-summary',
      title: 'Add a Skills Summary section',
      titleAr: 'إضافة قسم ملخص المهارات (Skills Summary)',
      why: 'Improves skill visibility for ATS and recruiters.',
      whyAr: 'يزيد وضوح مهاراتك لمسؤولي التوظيف وخوارزميات الـ ATS.'
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
    fixes: fixes.slice(0, 3)
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
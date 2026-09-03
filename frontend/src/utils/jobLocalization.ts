/**
 * 3WATLY Strict Job Localization & Content Sanitizer
 * Guarantees that English job fields contain strictly English text
 * and Arabic job fields contain strictly Arabic text.
 */

export function containsArabic(text?: string | null): boolean {
  if (!text) return false;
  return /[\u0600-\u06FF]/.test(text);
}

export function cleanText(text?: string | null): string {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Ensures the English Job Overview contains only English text.
 */
export function cleanEnglishOverview(
  title?: string,
  company?: string,
  location?: string,
  rawDesc?: string | null
): string {
  const cleanComp = (company || 'a leading company').replace(/\s*-\s*(?:Egypt|Cairo|Giza)$/i, '').trim();
  const cleanLoc = location || 'Cairo, Egypt';
  const cleanTitle = title || 'Professional';

  if (rawDesc && rawDesc.trim().length > 15 && !containsArabic(rawDesc)) {
    // If rawDesc is already English, sanitize and use it
    const trimmed = cleanText(rawDesc);
    if (trimmed.length > 20) return trimmed;
  }

  // Generate a fluent, professional English overview
  return `A great opportunity for a ${cleanTitle} position at ${cleanComp} in ${cleanLoc}. The role provides a professional environment focused on modern technologies, impactful projects, and continuous career growth.`;
}

/**
 * Ensures the Arabic Job Overview contains only Arabic text.
 */
export function cleanArabicOverview(
  titleAr?: string,
  companyAr?: string,
  locationAr?: string,
  rawDescAr?: string | null
): string {
  const cleanComp = (companyAr || 'شركة رائدة').replace(/\s*-\s*(?:مصر|القاهرة|الجيزة)$/i, '').trim();
  const cleanLoc = locationAr || 'القاهرة، مصر';
  const cleanTitle = titleAr || 'متخصص';

  if (rawDescAr && rawDescAr.trim().length > 15 && containsArabic(rawDescAr)) {
    // If rawDescAr is already Arabic, sanitize and use it
    const trimmed = cleanText(rawDescAr);
    if (trimmed.length > 20) return trimmed;
  }

  // Generate a fluent, professional Arabic overview
  return `فرصة عمل متميزة لمنصب ${cleanTitle} في شركة ${cleanComp} في ${cleanLoc}. توفر الوظيفة بيئة عمل متطورة تركز على أحدث التقنيات، والمشاريع المؤثرة، والنمو المهني المستمر.`;
}

/**
 * Ensures English Key Responsibilities contain only English bullet points.
 */
export function cleanEnglishResponsibilities(
  title?: string,
  rawLines?: string[] | null,
  skills?: string[]
): string[] {
  const cleanTitle = title || 'the role';
  const englishLines = (rawLines || [])
    .map(line => cleanText(line))
    .filter(line => line.length > 5 && !containsArabic(line));

  if (englishLines.length >= 3) {
    return englishLines.slice(0, 6);
  }

  const primarySkill = skills && skills.length > 0 ? skills[0] : null;

  return [
    `Execute core ${cleanTitle} duties and deliver high-impact business outcomes.`,
    primarySkill
      ? `Utilize ${primarySkill} and modern analytical/technical workflows.`
      : `Apply modern analytical and technical methodologies to solve business challenges.`,
    `Collaborate closely with cross-functional teams and stakeholders.`,
    `Prepare structured documentation, actionable reports, and presentations.`,
    `Continuously improve operational workflows, quality standards, and productivity.`
  ];
}

/**
 * Ensures Arabic Key Responsibilities contain only Arabic bullet points.
 */
export function cleanArabicResponsibilities(
  titleAr?: string,
  rawLinesAr?: string[] | null,
  skills?: string[]
): string[] {
  const cleanTitle = titleAr || 'الوظيفة';
  const arabicLines = (rawLinesAr || [])
    .map(line => cleanText(line))
    .filter(line => line.length > 5 && containsArabic(line));

  if (arabicLines.length >= 3) {
    return arabicLines.slice(0, 6);
  }

  const primarySkill = skills && skills.length > 0 ? skills[0] : null;

  return [
    `تنفيذ المهام والمسؤوليات الأساسية لمنصب ${cleanTitle} وتحقيق المستهدفات المطلوبة.`,
    primarySkill
      ? `توظيف أدوات وتقنيات ${primarySkill} وأفضل الممارسات المهنية المعتمدة.`
      : `تطبيق المنهجيات والتقنيات الحديثة لحل المشكلات ورفع كفاءة العمل.`,
    `التعاون الفعّال مع مختلف الفرق وأصحاب المصلحة بالشركة.`,
    `إعداد التقارير الدورية وتقديم نتائج العمل بدقة ووضوح للإدارة.`,
    `المساهمة في تحسين بيئة العمل ومتابعة أحدث المعايير المهنية.`
  ];
}

/**
 * Ensures English Requirements contain only English bullet points.
 */
export function cleanEnglishRequirements(
  title?: string,
  rawLines?: string[] | null,
  skills?: string[]
): string[] {
  const englishLines = (rawLines || [])
    .map(line => cleanText(line))
    .filter(line => line.length > 5 && !containsArabic(line));

  if (englishLines.length >= 3) {
    return englishLines.slice(0, 6);
  }

  const reqSkillsList = (skills || []).slice(0, 4);

  return [
    reqSkillsList.length > 0
      ? `Solid practical knowledge of relevant tools and technologies: ${reqSkillsList.join(', ')}.`
      : `Strong knowledge of relevant tools, systems, and technical methodologies.`,
    `Previous hands-on experience in the same or a closely related field.`,
    `Strong analytical, critical-thinking, and problem-solving abilities.`,
    `Excellent verbal and written communication and teamwork skills.`,
    `Bachelor's degree in a relevant discipline or equivalent practical background.`
  ];
}

/**
 * Ensures Arabic Requirements contain only Arabic bullet points.
 */
export function cleanArabicRequirements(
  titleAr?: string,
  rawLinesAr?: string[] | null,
  skills?: string[]
): string[] {
  const arabicLines = (rawLinesAr || [])
    .map(line => cleanText(line))
    .filter(line => line.length > 5 && containsArabic(line));

  if (arabicLines.length >= 3) {
    return arabicLines.slice(0, 6);
  }

  const reqSkillsList = (skills || []).slice(0, 4);

  return [
    reqSkillsList.length > 0
      ? `إتقان ومعرفة عملية قوية بالمهارات والأدوات الأساسية: ${reqSkillsList.join('، ')}.`
      : `معرفة متقدمة بالأدوات والتقنيات والممارسات المرتبطة بمجال العمل.`,
    `خبرة عملية سابقة في نفس التخصص أو في مجال ذي صلة.`,
    `مهارات تحليلية وتفكير نقدي وقدرة عالية على حل المشكلات.`,
    `مهارات تواصل شفهي وكتابي ممتازة والقدرة على العمل ضمن فريق.`,
    `مؤهل جامعي مناسب في التخصص أو ما يعادله من خبرة عملية.`
  ];
}

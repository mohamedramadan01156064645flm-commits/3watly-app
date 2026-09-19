/**
 * Intelligent CV Link Intelligence Engine
 * 
 * 1. Multi-source link extraction (PDF Link Annotations with exact coordinate anchor slicing,
 *    DOCX relationship extraction, markdown links, and raw URL regex).
 * 2. Spatial & Contextual awareness (knows if a link belongs to Header, Experience, Projects, or Certifications).
 * 3. Deep Classification (Personal Social Profile vs Project Repository vs Live Demo vs Company vs Certificate).
 * 4. Zero-Fabrication: Never injects fake URLs (like 'your-profile') and never misinterprets 'tel:' as a website.
 */

export type LinkCategory =
  | 'linkedin_profile'
  | 'github_profile'
  | 'portfolio'
  | 'personal_website'
  | 'twitter'
  | 'kaggle'
  | 'leetcode'
  | 'medium'
  | 'devto'
  | 'behance'
  | 'dribbble'
  | 'project_repo'
  | 'project_demo'
  | 'company'
  | 'certificate'
  | 'other';

export interface RawExtractedLink {
  url: string;
  anchorText: string;
  pageNumber?: number;
  y?: number;
  x?: number;
  lineText?: string;
  source: 'pdf_annotation' | 'docx_rel' | 'markdown' | 'regex_text';
}

export interface ClassifiedLink {
  id: string;
  url: string;
  cleanUrl: string;
  category: LinkCategory;
  platform: string; // 'LinkedIn' | 'GitHub' | 'Portfolio' | 'Personal' | 'Live Demo' | 'Company' | 'Certificate' | etc.
  anchorText: string;
  sectionContext: 'header' | 'experience' | 'projects' | 'education' | 'certificates' | 'unknown';
  associatedEntity?: string; // Project title, company name, or cert name
}

export interface CVLinksResult {
  headerContacts: {
    linkedin: string;
    github: string;
    portfolio: string;
    socialLinks: Array<{ id: string; platform: string; url: string; customLabel?: string }>;
  };
  projectLinks: Array<{
    projectTitleMatcher: string;
    github?: string;
    demo?: string;
    generalUrl?: string;
  }>;
  experienceLinks: Array<{
    companyMatcher: string;
    url: string;
  }>;
  certificateLinks: Array<{
    titleMatcher: string;
    url: string;
  }>;
  allClassified: ClassifiedLink[];
}

// Known certification and credential domains
const CERT_DOMAINS = [
  'cognitiveclass.ai',
  'freecodecamp.org',
  '365datascience.com',
  'coursera.org',
  'udemy.com',
  'edx.org',
  'datacamp.com',
  'credly.com',
  'credential.net',
  'acclaim.com',
  'simplilearn.com',
  'pluralsight.com',
  'skillshare.com',
  'udacity.com',
  'alison.com',
  'ibm.com/training',
  'microsoft.com/learning',
  'google.com/certificates',
];

// Domains that should NEVER be treated as user content or links
const JUNK_DOMAINS = [
  'ns.adobe.com',
  'w3.org',
  'purl.org',
  'xml.org',
  'schemas.openxmlformats.org',
  'schemas.microsoft.com',
  'schema.org',
  'localhost',
  '127.0.0.1',
  'example.com',
];

export function cleanUrl(url: string): string {
  if (!url) return '';
  let clean = url.trim();
  // Strip trailing punctuation often captured from text
  clean = clean.replace(/[.,;:)>\]\\"]+$/, '');
  
  // Never format tel: or mailto: as https://
  if (clean.startsWith('mailto:') || clean.startsWith('tel:')) {
    return clean;
  }

  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    clean = `https://${clean}`;
  }
  return clean;
}

export function isJunkUrl(url: string): boolean {
  if (!url) return true;
  const lower = url.toLowerCase();
  return JUNK_DOMAINS.some((d) => lower.includes(d));
}

export function isCertUrl(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    CERT_DOMAINS.some((d) => lower.includes(d)) ||
    lower.includes('/certificates/') ||
    lower.includes('/certification/') ||
    lower.includes('verify.') ||
    lower.includes('credential.')
  );
}

/**
 * Classifies an individual link using domain analysis, path structure, anchor text, and CV section context.
 */
export function classifySingleLink(
  rawUrl: string,
  anchorText: string = '',
  sectionContext: ClassifiedLink['sectionContext'] = 'unknown'
): { category: LinkCategory; platform: string } {
  const url = cleanUrl(rawUrl);
  const lower = url.toLowerCase();
  const lowerAnchor = anchorText.toLowerCase().trim();

  // 1. Phone / Email exclusion
  if (lower.startsWith('tel:') || lower.startsWith('callto:')) {
    return { category: 'other', platform: 'Phone' };
  }
  if (lower.startsWith('mailto:')) {
    return { category: 'other', platform: 'Email' };
  }

  // 2. Certification platforms
  if (isCertUrl(lower) || (sectionContext === 'certificates' && lowerAnchor.includes('link'))) {
    return { category: 'certificate', platform: 'Certificate' };
  }

  // 3. AI Demos & Interactive Apps (Hugging Face, Streamlit, Colab, Gradio, etc.)
  if (
    lower.includes('huggingface.co/spaces/') ||
    lower.includes('.hf.space') ||
    lower.includes('streamlit.app') ||
    lower.includes('colab.research.google.com') ||
    lowerAnchor.includes('live demo') ||
    lowerAnchor.includes('demo') ||
    lowerAnchor.includes('app') ||
    lowerAnchor.includes('interactive')
  ) {
    return { category: 'project_demo', platform: 'Live Demo' };
  }

  // 4. LinkedIn
  if (lower.includes('linkedin.com/in/') || lower.includes('linkedin.com/pub/')) {
    return { category: 'linkedin_profile', platform: 'LinkedIn' };
  }
  if (lower.includes('linkedin.com/company/')) {
    return { category: 'company', platform: 'Company' };
  }

  // 5. GitHub: Distinguish personal profile (1 path segment) from project repo (2+ segments)
  if (lower.includes('github.com/')) {
    const cleanPath = lower
      .replace(/^https?:\/\/(?:www\.)?github\.com\//, '')
      .replace(/\/$/, '');
    const parts = cleanPath.split('/').filter(Boolean);

    // 2+ path segments: Repo (e.g. github.com/user/repo)
    if (parts.length >= 2) {
      return { category: 'project_repo', platform: 'GitHub' };
    }

    // Exactly 1 path segment: Profile (e.g. github.com/user)
    return { category: 'github_profile', platform: 'GitHub' };
  }

  // 6. Portfolio / GitHub Pages
  if (
    /[a-z0-9_-]+\.github\.io/i.test(lower) ||
    lowerAnchor.includes('portfolio') ||
    lower.includes('portfolio')
  ) {
    return { category: 'portfolio', platform: 'Portfolio' };
  }

  // 7. General Hosting platforms (Vercel, Netlify)
  if (lower.includes('vercel.app') || lower.includes('netlify.app')) {
    if (sectionContext === 'projects' || lowerAnchor.includes('demo')) {
      return { category: 'project_demo', platform: 'Live Demo' };
    }
    return { category: 'portfolio', platform: 'Portfolio' };
  }

  // 8. Other Popular Tech Profiles
  if (lower.includes('kaggle.com')) return { category: 'kaggle', platform: 'Kaggle' };
  if (lower.includes('leetcode.com')) return { category: 'leetcode', platform: 'LeetCode' };
  if (lower.includes('medium.com')) return { category: 'medium', platform: 'Medium' };
  if (lower.includes('dev.to')) return { category: 'devto', platform: 'Dev.to' };
  if (lower.includes('twitter.com') || lower.includes('x.com')) return { category: 'twitter', platform: 'Twitter' };
  if (lower.includes('behance.net')) return { category: 'behance', platform: 'Behance' };
  if (lower.includes('dribbble.com')) return { category: 'dribbble', platform: 'Dribbble' };

  // 9. Contextual fallback
  if (sectionContext === 'experience') {
    return { category: 'company', platform: 'Company' };
  }
  if (sectionContext === 'projects') {
    return { category: 'project_demo', platform: 'Live Demo' };
  }
  if (sectionContext === 'header') {
    return { category: 'personal_website', platform: 'Personal' };
  }

  return { category: 'personal_website', platform: 'Website' };
}

/**
 * Extracts links from PDF pages with character-precise anchor text slicing and Y coordinates.
 */
export async function extractLinksFromPdf(pdf: any): Promise<RawExtractedLink[]> {
  const results: RawExtractedLink[] = [];

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const annots = await page.getAnnotations();
    const textContent = await page.getTextContent();
    const items = textContent.items || [];

    const linkAnnots = annots.filter(
      (a: any) =>
        a.subtype === 'Link' &&
        (a.url || a.unsafeUrl || a.action?.uri)
    );

    for (const a of linkAnnots) {
      const rawUrl = (a.url || a.unsafeUrl || a.action?.uri || '').trim();
      if (!rawUrl || isJunkUrl(rawUrl)) continue;

      const rect = a.rect || [0, 0, 0, 0];
      const minY = Math.min(rect[1], rect[3]);
      const maxY = Math.max(rect[1], rect[3]);
      const minX = Math.min(rect[0], rect[2]);
      const maxX = Math.max(rect[0], rect[2]);

      // Find text items on the same horizontal line
      const itemsOnLine = items.filter((it: any) => {
        const y = it.transform?.[5] ?? 0;
        return Math.abs(y - minY) < 6 && it.str && it.str.trim().length > 0;
      });

      // Find the specific item overlapping the annotation horizontally
      const item =
        itemsOnLine.find((it: any) => {
          const itX = it.transform?.[4] ?? 0;
          const itW = it.width || it.str.length * 6;
          return itX <= minX + 3 && itX + itW >= maxX - 3;
        }) || itemsOnLine[0];

      let anchorText = '';
      if (item && item.str) {
        const itemX = item.transform?.[4] ?? 0;
        const itemW = item.width || item.str.length * 6;
        const charW = itemW / Math.max(1, item.str.length);
        const startIdx = Math.max(
          0,
          Math.min(item.str.length - 1, Math.round((minX - itemX) / charW))
        );
        const endIdx = Math.max(
          startIdx + 1,
          Math.min(item.str.length, Math.round((maxX - itemX) / charW))
        );
        anchorText = item.str.substring(startIdx, endIdx).trim();
      }

      const fullLineText = itemsOnLine.map((it: any) => it.str).join(' ').trim();

      results.push({
        url: cleanUrl(rawUrl),
        anchorText: anchorText || fullLineText,
        pageNumber: p,
        y: minY,
        x: minX,
        lineText: fullLineText,
        source: 'pdf_annotation',
      });
    }
  }

  return results;
}

/**
 * Extracts links from raw text (Markdown syntax [text](url) and plaintext URL regex).
 */
export function extractLinksFromText(rawText: string): RawExtractedLink[] {
  const results: RawExtractedLink[] = [];
  const seen = new Set<string>();

  // 1. Markdown links: [Anchor Text](URL)
  const mdRegex = /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/gi;
  let match: RegExpExecArray | null;
  while ((match = mdRegex.exec(rawText)) !== null) {
    const anchor = match[1].trim();
    const url = cleanUrl(match[2]);
    if (!isJunkUrl(url) && !seen.has(url.toLowerCase())) {
      seen.add(url.toLowerCase());
      results.push({
        url,
        anchorText: anchor,
        source: 'markdown',
      });
    }
  }

  // 2. Standalone URLs: https://...
  const urlRegex = /https?:\/\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]+/gi;
  while ((match = urlRegex.exec(rawText)) !== null) {
    const url = cleanUrl(match[0]);
    if (!isJunkUrl(url) && !seen.has(url.toLowerCase())) {
      seen.add(url.toLowerCase());
      results.push({
        url,
        anchorText: '',
        source: 'regex_text',
      });
    }
  }

  // 3. Domain shortcuts: linkedin.com/in/..., github.com/...
  const shortcutRegex = /(?:www\.)?(linkedin\.com\/in\/[a-zA-Z0-9_\-\/]+|github\.com\/[a-zA-Z0-9_\-\/]+|[a-zA-Z0-9_\-]+\.github\.io)/gi;
  while ((match = shortcutRegex.exec(rawText)) !== null) {
    const url = cleanUrl(`https://${match[0]}`);
    if (!isJunkUrl(url) && !seen.has(url.toLowerCase())) {
      seen.add(url.toLowerCase());
      results.push({
        url,
        anchorText: '',
        source: 'regex_text',
      });
    }
  }

  return results;
}

/**
 * Master Link Resolver: Combines all extracted links, maps them to CV sections,
 * and correlates them directly to specific projects, experiences, certificates, and header contacts.
 */
export function processDocumentLinks(
  rawLinks: RawExtractedLink[],
  sectionBoundaries?: {
    headerMinY?: number;
    experienceMinY?: number;
    projectsMinY?: number;
    certificatesMinY?: number;
  },
  projectTitles: string[] = [],
  companyNames: string[] = []
): CVLinksResult {
  const allClassified: ClassifiedLink[] = [];
  const seenUrls = new Set<string>();

  for (let i = 0; i < rawLinks.length; i++) {
    const item = rawLinks[i];
    const key = item.url.toLowerCase();
    if (seenUrls.has(key)) continue;
    seenUrls.add(key);

    // Skip mailto and tel from web links
    if (key.startsWith('mailto:') || key.startsWith('tel:')) continue;

    // Detect Section Context
    let section: ClassifiedLink['sectionContext'] = 'unknown';
    const line = (item.lineText || '').toLowerCase();
    const anchor = (item.anchorText || '').toLowerCase();

    const bounds = sectionBoundaries || {
      headerMinY: 650,
      experienceMinY: 450,
      projectsMinY: 150,
      certificatesMinY: 50,
    };

    if (item.y !== undefined) {
      if ((item.pageNumber ?? 1) === 1 && item.y >= (bounds.headerMinY ?? 650)) {
        section = 'header';
      } else if (item.y >= (bounds.experienceMinY ?? 450)) {
        section = 'experience';
      } else if (item.y >= (bounds.projectsMinY ?? 150)) {
        section = 'projects';
      } else {
        section = 'certificates';
      }
    } else {
      // Fallback heuristics using line text & anchors
      if (i < 4 && (key.includes('linkedin.com/in/') || key.includes('github.com/') || /[a-z0-9_-]+\.github\.io/i.test(key))) {
        section = 'header';
      } else if (
        line.includes('project') ||
        anchor.includes('demo') ||
        key.includes('huggingface.co/spaces') ||
        key.replace(/^https?:\/\/(?:www\.)?github\.com\//, '').replace(/\/$/, '').split('/').filter(Boolean).length >= 2
      ) {
        section = 'projects';
      } else if (line.includes('intern') || line.includes('company') || key.includes('linkedin.com/company/')) {
        section = 'experience';
      } else if (line.includes('certificate') || isCertUrl(key)) {
        section = 'certificates';
      } else if (i < 4) {
        section = 'header';
      }
    }

    const { category, platform } = classifySingleLink(item.url, item.anchorText, section);

    allClassified.push({
      id: `link-${allClassified.length + 1}`,
      url: item.url,
      cleanUrl: cleanUrl(item.url),
      category,
      platform,
      anchorText: item.anchorText,
      sectionContext: section,
      associatedEntity: item.lineText,
    });
  }

  // 1. Header Contacts (LinkedIn, GitHub profile, Portfolio, and Social Links array)
  let linkedin = '';
  let github = '';
  let portfolio = '';
  const socialLinks: Array<{ id: string; platform: string; url: string }> = [];
  const seenPlatforms = new Set<string>();

  const headerLinks = allClassified.filter(
    (l) => l.sectionContext === 'header' || l.category === 'linkedin_profile' || l.category === 'github_profile' || l.category === 'portfolio'
  );

  for (const l of headerLinks) {
    if (l.category === 'linkedin_profile') {
      if (!linkedin) linkedin = l.cleanUrl;
      if (!seenPlatforms.has('LinkedIn')) {
        seenPlatforms.add('LinkedIn');
        socialLinks.push({ id: 'link-li', platform: 'LinkedIn', url: l.cleanUrl });
      }
    } else if (l.category === 'github_profile') {
      if (!github) github = l.cleanUrl;
      if (!seenPlatforms.has('GitHub')) {
        seenPlatforms.add('GitHub');
        socialLinks.push({ id: 'link-gh', platform: 'GitHub', url: l.cleanUrl });
      }
    } else if (l.category === 'portfolio') {
      if (!portfolio) portfolio = l.cleanUrl;
      if (!seenPlatforms.has('Portfolio')) {
        seenPlatforms.add('Portfolio');
        socialLinks.push({ id: 'link-pf', platform: 'Portfolio', url: l.cleanUrl });
      }
    } else if (l.category === 'personal_website' && l.sectionContext === 'header') {
      if (!portfolio) portfolio = l.cleanUrl;
      if (!seenPlatforms.has('Personal')) {
        seenPlatforms.add('Personal');
        socialLinks.push({ id: `link-web-${l.id}`, platform: 'Personal', url: l.cleanUrl });
      }
    } else if (
      l.category === 'twitter' ||
      l.category === 'kaggle' ||
      l.category === 'leetcode' ||
      l.category === 'medium' ||
      l.category === 'devto' ||
      l.category === 'behance' ||
      l.category === 'dribbble'
    ) {
      if (!seenPlatforms.has(l.platform)) {
        seenPlatforms.add(l.platform);
        socialLinks.push({ id: `link-${l.category}`, platform: l.platform, url: l.cleanUrl });
      }
    }
  }

  // 2. Correlate Project Links
  const projectLinks: CVLinksResult['projectLinks'] = [];
  const projectClassified = allClassified.filter(
    (l) => l.sectionContext === 'projects' || l.category === 'project_repo' || l.category === 'project_demo'
  );

  projectTitles.forEach((title) => {
    const titleTokens = title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 3);

    // Find links that match on line text or URL slug
    const matchingLinks = projectClassified.filter((l) => {
      const lineLower = (l.associatedEntity || '').toLowerCase();
      const urlLower = l.cleanUrl.toLowerCase();
      return titleTokens.some((tok) => lineLower.includes(tok) || urlLower.includes(tok));
    });

    const repoLink = matchingLinks.find((l) => l.category === 'project_repo');
    const demoLink = matchingLinks.find((l) => l.category === 'project_demo');

    projectLinks.push({
      projectTitleMatcher: title,
      github: repoLink?.cleanUrl,
      demo: demoLink?.cleanUrl,
      generalUrl: demoLink?.cleanUrl || repoLink?.cleanUrl,
    });
  });

  // 3. Correlate Company Links
  const experienceLinks: CVLinksResult['experienceLinks'] = [];
  const companyClassified = allClassified.filter((l) => l.category === 'company' || l.sectionContext === 'experience');

  companyNames.forEach((comp) => {
    const compLower = comp.toLowerCase().replace(/[^a-z0-9]/g, '');
    const match = companyClassified.find((l) => {
      const lineLower = (l.associatedEntity || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const urlLower = l.cleanUrl.toLowerCase().replace(/[^a-z0-9]/g, '');
      return lineLower.includes(compLower) || urlLower.includes(compLower);
    });

    if (match) {
      experienceLinks.push({
        companyMatcher: comp,
        url: match.cleanUrl,
      });
    }
  });

  // 4. Correlate Certificate Links
  const certificateLinks: CVLinksResult['certificateLinks'] = allClassified
    .filter((l) => l.category === 'certificate' || l.sectionContext === 'certificates')
    .map((l) => ({
      titleMatcher: l.associatedEntity || l.anchorText,
      url: l.cleanUrl,
    }));

  return {
    headerContacts: {
      linkedin,
      github,
      portfolio,
      socialLinks,
    },
    projectLinks,
    experienceLinks,
    certificateLinks,
    allClassified,
  };
}

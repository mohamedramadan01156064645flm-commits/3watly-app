import * as cheerio from 'cheerio';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xwkkwmplohwsnwxjxusx.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8',
  'Referer': 'https://www.google.com/',
  'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Windows"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'cross-site'
};

const SEARCH_QUERIES = [
  'data analyst', 'business intelligence', 'data engineer', 'data scientist',
  'python', 'sql developer', 'frontend developer', 'react', 'backend developer',
  'node.js', 'full stack developer', 'machine learning', 'devops', 'product manager',
  'business analyst', 'power bi developer', 'flutter developer', 'ui ux designer'
];

const KNOWN_SKILLS = [
  'Python', 'SQL', 'Power BI', 'Tableau', 'Excel', 'Pandas', 'NumPy', 'R',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server', 'Docker',
  'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'GitHub', 'CI/CD', 'Linux',
  'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Express',
  'FastAPI', 'Django', 'Flask', 'Java', 'Spring Boot', 'C#', '.NET', 'PHP',
  'Laravel', 'Airflow', 'Kafka', 'dbt', 'Snowflake', 'BigQuery', 'ETL',
  'Data Modeling', 'Data Warehousing', 'Machine Learning', 'TensorFlow', 'PyTorch',
  'Flutter', 'React Native', 'Figma', 'UI/UX', 'Agile', 'Scrum', 'Jira'
];

function generateJobId(url) {
  return 'wuzzuf_' + crypto.createHash('md5').update(url).digest('hex').slice(0, 16);
}

function parseSeniority(str) {
  const s = str.toLowerCase();
  if (s.includes('entry') || s.includes('fresh') || s.includes('مبتدئ') || s.includes('حديث')) return 'Fresh';
  if (s.includes('junior')) return 'Junior';
  if (s.includes('senior') || s.includes('lead') || s.includes('manager') || s.includes('أول') || s.includes('متقدم')) return 'Senior';
  return 'Mid';
}

function parseWorkType(str) {
  const s = str.toLowerCase();
  const isRemote = s.includes('remote') || s.includes('work from home') || s.includes('عن بُعد') || s.includes('عن بعد');
  let workType = 'On-site';
  if (s.includes('hybrid') || s.includes('مرن') || s.includes('هجين')) workType = 'Hybrid';
  if (isRemote && !s.includes('hybrid')) workType = 'Remote';
  return { workType, isRemote };
}

function translateTitleToAr(title) {
  const t = title.toLowerCase();
  let prefix = '';
  if (t.includes('senior') || t.includes('lead') || t.includes('principal')) prefix = 'أول ';
  if (t.includes('junior') || t.includes('entry')) prefix = 'مبتدئ ';
  if (t.includes('fresh')) prefix = 'حديث التخرج ';

  if (t.includes('data analyst') || t.includes('data analytics')) return `محلل بيانات ${prefix}`.trim();
  if (t.includes('business intelligence') || t.includes('bi developer')) return `مطور ذكاء أعمال (BI) ${prefix}`.trim();
  if (t.includes('data engineer')) return `مهندس بيانات ${prefix}`.trim();
  if (t.includes('data scientist')) return `عالم بيانات ${prefix}`.trim();
  if (t.includes('frontend') || t.includes('front-end') || t.includes('react')) return `مطور واجهات أمامية (Frontend) ${prefix}`.trim();
  if (t.includes('backend') || t.includes('back-end') || t.includes('node') || t.includes('django')) return `مطور واجهات خلفية (Backend) ${prefix}`.trim();
  if (t.includes('full stack') || t.includes('fullstack')) return `مطور برمجيات شامل (Full Stack) ${prefix}`.trim();
  if (t.includes('devops') || t.includes('cloud')) return `مهندس DevOps وسحابيات ${prefix}`.trim();
  if (t.includes('machine learning') || t.includes('ai engineer') || t.includes('deep learning')) return `مهندس ذكاء اصطناعي وتعلم آلي ${prefix}`.trim();
  if (t.includes('product manager') || t.includes('product owner')) return `مدير منتجات رقمية ${prefix}`.trim();
  if (t.includes('business analyst')) return `محلل نظم وأعمال ${prefix}`.trim();
  if (t.includes('power bi')) return `مطور تقارير وذكاء أعمال Power BI ${prefix}`.trim();
  if (t.includes('ui/ux') || t.includes('ux/ui') || t.includes('product designer')) return `مصمم واجهات وتجربة المستخدم (UI/UX) ${prefix}`.trim();
  if (t.includes('flutter') || t.includes('mobile developer') || t.includes('ios') || t.includes('android')) return `مطور تطبيقات هواتف ${prefix}`.trim();
  if (t.includes('qa') || t.includes('quality') || t.includes('software tester')) return `مهندس جودة واختبار برمجيات (QA) ${prefix}`.trim();
  if (t.includes('scrum') || t.includes('project manager')) return `مدير مشاريع تقنية ${prefix}`.trim();
  return title;
}

function translateLocationToAr(location) {
  const l = location.toLowerCase();
  if (l.includes('sheikh zayed') || l.includes('zayed')) return 'الشيخ زايد، الجيزة';
  if (l.includes('6th of october') || l.includes('october')) return 'السادس من أكتوبر، الجيزة';
  if (l.includes('smart village')) return 'القرية الذكية، الجيزة';
  if (l.includes('new cairo') || l.includes('tagamoa') || l.includes('5th settlement')) return 'القاهرة الجديدة، القاهرة';
  if (l.includes('maadi')) return 'المعادي، القاهرة';
  if (l.includes('nasr city')) return 'مدينة نصر، القاهرة';
  if (l.includes('heliopolis') || l.includes('masr el gedida')) return 'مصر الجديدة، القاهرة';
  if (l.includes('dokki')) return 'الدقي، الجيزة';
  if (l.includes('mohandessin')) return 'المهندسين، الجيزة';
  if (l.includes('giza')) return 'الجيزة، مصر';
  if (l.includes('alexandria') || l.includes('alex')) return 'الإسكندرية، مصر';
  if (l.includes('cairo')) return 'القاهرة، مصر';
  if (l.includes('remote')) return 'عن بُعد (مصر)';
  return location;
}

function estimateSalary(seniority, isRemote) {
  if (isRemote) {
    if (seniority === 'Fresh') return '$600 - $1,000 / mo';
    if (seniority === 'Junior') return '$1,000 - $1,800 / mo';
    if (seniority === 'Senior') return '$2,800 - $5,000 / mo';
    return '$1,800 - $2,800 / mo';
  }
  if (seniority === 'Fresh') return '14,000 - 20,000 ج.م / شهرياً';
  if (seniority === 'Junior') return '20,000 - 32,000 ج.م / شهرياً';
  if (seniority === 'Senior') return '50,000 - 90,000 ج.م / شهرياً';
  return '32,000 - 50,000 ج.م / شهرياً';
}

function extractSkills(text, tags = []) {
  const set = new Set(tags.map(t => t.trim()).filter(t => t.length > 1));
  KNOWN_SKILLS.forEach(k => {
    if (new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(text)) {
      set.add(k);
    }
  });
  return Array.from(set).slice(0, 10);
}

async function fetchWithRetry(url, maxRetries = 2) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, { headers: BROWSER_HEADERS });
      if (res.status === 429) {
        const waitMs = (attempt + 1) * 3000 + Math.floor(Math.random() * 1000);
        console.warn(`[WuzzufScraper] ⏳ 429 received. Backing off for ${waitMs}ms (attempt ${attempt + 1}/${maxRetries + 1})...`);
        await new Promise(r => setTimeout(r, waitMs));
        continue;
      }
      if (!res.ok) return null;
      return await res.text();
    } catch (e) {
      if (attempt === maxRetries) return null;
      await new Promise(r => setTimeout(r, 1500));
    }
  }
  return null;
}

async function scrapeWuzzuf() {
  console.log('🚀 [3WATLY Cloud Scraper] Starting crawl of Wuzzuf Egypt & Global Tech postings...');
  const allJobs = new Map();

  for (const q of SEARCH_QUERIES) {
    for (let page = 0; page <= 2; page++) {
      const url = `https://wuzzuf.net/search/jobs/?q=${encodeURIComponent(q)}&a=hpb&start=${page}`;
      const html = await fetchWithRetry(url, 2);
      if (!html) continue;

      try {
        const $ = cheerio.load(html);
        $('style, script').remove();

        const cards = $('div[class*="css-1gatmva"], div[class*="css-pkv5jc"], div.css-1gatmva, div.css-pkv5jc');
        cards.each((_, el) => {
          try {
            const card = $(el);

            const link = card.find('h2 a[href*="/jobs/p/"], h2 a[href*="/job/"], h2 a[href*="/internship/"], h3 a[href*="/jobs/p/"], h3 a[href*="/job/"], a[href*="/jobs/p/"], a[href*="/job/"], a[href*="/internship/"], h2 a').first();
            const title = link.text().trim();
            let applyUrl = link.attr('href') || '';
            if (!title || !applyUrl) return;
            if (/\/jobs\/careers\/|\/company\/|\/companies\/|\/careers\/|search\/|location=/i.test(applyUrl)) return;
            if (applyUrl.startsWith('/')) applyUrl = 'https://wuzzuf.net' + applyUrl;

            // Company Name Extraction (3-layer fallback: Link text -> Alt text -> Career URL regex)
            let company = card.find('a[href*="/jobs/careers/"], a.css-ipsyv7, a[class*="css-ipsyv7"], a[class*="css-17s97q8"]').first().text().trim();
            if (!company || company.length < 2) {
              const alt = card.find('img[alt*="Jobs and Careers"]').attr('alt') || '';
              if (alt) {
                company = alt.replace(/^Jobs and Careers at /i, '').replace(/ Egypt$/i, '').trim();
              }
            }
            if (!company || company.length < 2) {
              const careerHref = card.find('a[href*="/jobs/careers/"]').attr('href') || '';
              const match = careerHref.match(/careers\/(.*?)(?:-Egypt)?-\d+/);
              if (match && match[1]) {
                company = decodeURIComponent(match[1].replace(/-/g, ' '));
              }
            }
            if (!company || company.length < 2) {
              company = card.text().includes('Confidential') ? 'Confidential' : 'Confidential Employer';
            }
            company = company.replace(/-$/, '').trim();

            // Company Logo (Direct CDN URL)
            const logoImg = card.find('img[src*="company_logo"], img[class*="css-1in28d3"], a[href*="/jobs/careers/"] img, img[class*="css-128m8ex"]').first();
            let companyLogo = logoImg.attr('src') || logoImg.attr('data-src') || null;
            if (companyLogo && (companyLogo.startsWith('data:') || companyLogo.includes('placeholder') || companyLogo.includes('default'))) {
              companyLogo = null;
            }

            // Location
            const locElem = card.find('span[class*="css-16x61xq"], span[class*="css-5wys0k"], .job-location').first();
            let location = locElem.text().trim().replace(/<!-- -->/g, '').replace(/\s+/g, ' ');
            if (!location) location = 'Cairo, Egypt';

            // Badges
            const badges = [];
            card.find('span[class*="css-1ve4b75"], span[class*="css-y4nlo8"], span[class*="eoyjyou0"], a[href*="Full-Time"], a[href*="Part-Time"], a[href*="Remote"], a[href*="On-Site"], a[href*="Hybrid"]').each((_, b) => badges.push($(b).text().trim()));
            const badgeStr = badges.join(' ');

            const { workType, isRemote } = parseWorkType(badgeStr + ' ' + location);
            const seniority = parseSeniority(badgeStr + ' ' + title);

            // Skills
            const tags = [];
            card.find('a[class*="css-5x9pm1"], a[class*="css-5x9545"], div[class*="css-y4nlo8"] a, a[href*="-Jobs-in-Egypt"]').each((_, t) => {
              const txt = $(t).text().replace(/^[·\s]+/, '').trim();
              if (txt && !txt.includes('Full Time') && !txt.includes('On-site') && !txt.includes('Hybrid') && !txt.includes('Remote') && !txt.includes('Yrs of Exp')) {
                tags.push(txt);
              }
            });

            const skills = extractSkills(title + ' ' + badgeStr + ' ' + tags.join(' '), tags);
            const titleAr = translateTitleToAr(title);
            const locationAr = translateLocationToAr(location);
            const salary = estimateSalary(seniority, isRemote);

            const id = generateJobId(applyUrl);
            allJobs.set(id, {
              id,
              title,
              title_ar: titleAr,
              company,
              company_ar: company,
              company_logo: companyLogo,
              location,
              location_ar: locationAr,
              work_type: workType,
              is_remote: isRemote,
              seniority,
              salary_range: salary,
              required_skills: skills,
              description: `A great opportunity for a ${title} position at ${company} in ${location}. The role provides a professional environment focused on modern technologies and continuous career growth.`,
              description_ar: `فرصة عمل متميزة لمنصب ${titleAr} في شركة ${company} (${locationAr}). بيئة عمل متطورة تركز على أحدث التقنيات والنمو المهني.`,
              requirements: `• Strong practical knowledge of relevant tools and technologies: ${skills.slice(0, 4).join(', ')}.\n• Previous hands-on experience in the same or related field.\n• Strong analytical, critical-thinking, and problem-solving skills.\n• Excellent communication and teamwork abilities.`,
              requirements_ar: `• إتقان أدوات وتقنيات: ${skills.slice(0, 4).join('، ')}.\n• خبرة عملية مثبتة في نفس التخصص.\n• مهارات تحليلية وتفكير نقدي وحل المشكلات.\n• قدرة على العمل الجماعي والتواصل الفعال.`,
              apply_url: applyUrl,
              source: 'wuzzuf',
              posted_at: new Date().toISOString(),
              created_at: new Date().toISOString()
            });
          } catch (err) {}
        });

        console.log(`✅ Scraped "${q}" (page ${page + 1}) → Total unique: ${allJobs.size}`);
        await new Promise(r => setTimeout(r, 1400 + Math.floor(Math.random() * 600)));
      } catch (err) {
        console.warn(`Error on query "${q}":`, err.message);
      }
    }
  }

  // Remotive Remote Tech jobs
  try {
    const remotiveCategories = ['data', 'software-dev', 'qa', 'devops'];
    for (const cat of remotiveCategories) {
      const res = await fetch(`https://remotive.com/api/remote-jobs?category=${cat}&limit=30`);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.jobs)) {
          json.jobs.slice(0, 25).forEach(j => {
            const id = generateJobId(j.url);
            const skills = extractSkills(j.title + ' ' + (j.tags || []).join(' ') + ' ' + (j.description || ''), j.tags || []);
            const seniority = parseSeniority(j.title);
            allJobs.set(id, {
              id,
              title: j.title,
              title_ar: translateTitleToAr(j.title),
              company: j.company_name,
              company_ar: j.company_name,
              company_logo: j.company_logo || null,
              location: j.candidate_required_location || 'Remote (Worldwide)',
              location_ar: 'عن بُعد (عالمي / مصر)',
              work_type: 'Remote',
              is_remote: true,
              seniority,
              salary_range: j.salary || estimateSalary(seniority, true),
              required_skills: skills,
              description: j.description ? j.description.slice(0, 1000).replace(/<[^>]+>/g, '') : `Remote position for ${j.title} at ${j.company_name}.`,
              requirements: `• Required stack: ${skills.slice(0, 5).join(', ')}.\n• Self-starter with proven track record in remote environments.\n• Strong verbal and written communication skills.`,
              apply_url: j.url,
              source: 'remotive',
              posted_at: j.publication_date || new Date().toISOString(),
              created_at: new Date().toISOString()
            });
          });
        }
      }
    }
  } catch (remotiveErr) {}

  const jobsList = Array.from(allJobs.values());
  console.log(`\n📦 Total unique live jobs collected: ${jobsList.length}`);

  let upsertedCount = 0;
  const CHUNK_SIZE = 50;
  for (let i = 0; i < jobsList.length; i += CHUNK_SIZE) {
    const chunk = jobsList.slice(i, i + CHUNK_SIZE);
    const { error } = await supabase.from('jobs').upsert(chunk, { onConflict: 'id' });
    if (!error) {
      upsertedCount += chunk.length;
    } else {
      console.error('Supabase batch error:', error.message);
    }
  }

  console.log(`\n🎉 Successfully synced ${upsertedCount} live jobs into Supabase!`);
}

scrapeWuzzuf();

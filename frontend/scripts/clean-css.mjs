import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

function getEnvVal(key) {
  if (process.env[key]) return process.env[key];
  const envPath = path.resolve('D:/Projects/3watly/frontend/.env.local');
  const content = fs.readFileSync(envPath, 'utf-8');
  const m = content.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : '';
}

const supabase = createClient(getEnvVal('NEXT_PUBLIC_SUPABASE_URL'), getEnvVal('SUPABASE_SERVICE_ROLE_KEY'));

function cleanCssText(t) {
  if (!t) return t;
  return t
    .replace(/\.css-[a-zA-Z0-9_-]+\s*\{[^}]*\}/gi, '')
    .replace(/\{[^}]*\}/g, '')
    .replace(/\.css-[a-zA-Z0-9_-]+/gi, '')
    .replace(/@media[^{]*\{[^}]*\}\s*\}/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function run() {
  const { data, error } = await supabase.from('jobs').select('id, title, company, title_ar, company_ar');
  if (error) { console.error('DB Error:', error); return; }
  console.log(`Auditing ${data.length} jobs in Supabase for CSS contamination...`);
  let count = 0;
  for (const row of data) {
    const cleanedTitle = cleanCssText(row.title);
    const cleanedCompany = cleanCssText(row.company);
    const cleanedTitleAr = cleanCssText(row.title_ar);
    const cleanedCompanyAr = cleanCssText(row.company_ar);

    if (cleanedTitle !== row.title || cleanedCompany !== row.company || cleanedTitleAr !== row.title_ar || cleanedCompanyAr !== row.company_ar) {
      count++;
      console.log(`[#${count}] Cleaning job: ${row.id}`);
      if (cleanedTitle !== row.title) console.log(`  Title: "${row.title}" -> "${cleanedTitle}"`);
      if (cleanedCompany !== row.company) console.log(`  Company: "${row.company}" -> "${cleanedCompany}"`);

      await supabase.from('jobs').update({
        title: cleanedTitle,
        company: cleanedCompany,
        title_ar: cleanedTitleAr,
        company_ar: cleanedCompanyAr
      }).eq('id', row.id);
    }
  }
  console.log(`\nSuccessfully cleaned ${count} jobs with CSS residue in Supabase!`);
}
run();

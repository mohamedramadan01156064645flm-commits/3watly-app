import { createClient } from '@supabase/supabase-js';
import { SKILLS } from '../src/data/skillCatalog';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(url, key);

function mapKind(kind: string): string {
  const k = (kind || '').toLowerCase();
  if (k === 'video') return 'video';
  if (k === 'course') return 'course';
  if (k === 'docs' || k === 'article') return 'article';
  if (k === 'project' || k === 'repo') return 'repo';
  if (k === 'practice') return 'practice';
  if (k === 'book') return 'book';
  return 'other';
}

async function seed() {
  if (!url || !key) {
    console.error('Missing Supabase credentials in environment.');
    return;
  }
  console.log('Connecting to Supabase:', url);
  const rows: any[] = [];
  let order = 0;

  for (const [skillKey, skillDef] of Object.entries(SKILLS)) {
    if (!skillDef.resources || !Array.isArray(skillDef.resources)) continue;

    for (const res of skillDef.resources) {
      order += 1;
      rows.push({
        skill_key: skillKey,
        title: res.title,
        title_ar: null,
        provider: res.provider || 'Other',
        provider_icon: null,
        kind: mapKind(res.kind),
        url: res.url,
        duration_hours: res.hours ? Number(res.hours) : null,
        is_free: res.free !== false,
        language: 'en',
        is_active: true,
        display_order: order,
      });
    }
  }

  console.log(`Found ${rows.length} total resources across all skills.`);

  const { data, error } = await supabase.from('resources').insert(rows).select();

  if (error) {
    console.error('Seeding error:', error.message);
  } else {
    console.log(`✅ SUCCESS: Inserted ${data.length} resources into Supabase table 'resources'!`);
  }
}

seed();

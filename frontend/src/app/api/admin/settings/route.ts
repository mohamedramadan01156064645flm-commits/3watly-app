import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, writeAuditLog } from '@/lib/admin/authorization';
import { createAdminClient } from '@/lib/supabase/admin';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface PlatformSettings {
  platformName: string;
  tagline: string;
  supportEmail: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  aiModel: string;
  dailyQuota: string;
  deepAtsScan: boolean;
  autoSkillMatch: boolean;
  sessionTimeout: string;
  enforce2FA: boolean;
  updatedAt?: string;
  updatedBy?: string;
}

const DEFAULT_SETTINGS: PlatformSettings = {
  platformName: '3watly — عواطلي',
  tagline: 'منصة تسريع التوظيف والذكاء الاصطناعي المهني في السوق المصري',
  supportEmail: 'support@3watly.com',
  maintenanceMode: false,
  allowRegistration: true,
  requireEmailVerification: false,
  aiModel: 'gemini-1.5-pro',
  dailyQuota: '20',
  deepAtsScan: true,
  autoSkillMatch: true,
  sessionTimeout: '60',
  enforce2FA: false,
};

const SETTINGS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'platformSettings.json');

function readSettings(): PlatformSettings {
  try {
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      const content = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8');
      return { ...DEFAULT_SETTINGS, ...JSON.parse(content) };
    }
  } catch (err) {
    console.warn('Could not read settings file, using defaults:', err);
  }
  return DEFAULT_SETTINGS;
}

function writeSettings(settings: PlatformSettings) {
  try {
    const dir = path.dirname(SETTINGS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write settings file:', err);
  }
}

// GET /api/admin/settings
export async function GET(request: NextRequest) {
  let session;
  try {
    session = await requireAdmin();
  } catch (errorResponse) {
    return errorResponse as NextResponse;
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  // Diagnostics check
  if (action === 'diagnostics') {
    const start = performance.now();
    try {
      const supabase = createAdminClient();
      if (!supabase) throw new Error('Database service unavailable');

      const [profCheck, jobsCheck] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('jobs').select('id', { count: 'exact', head: true }),
      ]);

      const latency = Math.round(performance.now() - start);

      return NextResponse.json({
        db: true,
        auth: true,
        latency: latency || 25,
        totalProfiles: profCheck.count ?? 0,
        totalJobs: jobsCheck.count ?? 0,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      return NextResponse.json({
        db: false,
        auth: false,
        latency: 999,
        error: err.message,
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }
  }

  const current = readSettings();
  return NextResponse.json({ settings: current });
}

// POST /api/admin/settings — Save settings
export async function POST(request: NextRequest) {
  let session;
  try {
    session = await requireAdmin();
  } catch (errorResponse) {
    return errorResponse as NextResponse;
  }

  try {
    const body = await request.json().catch(() => ({}));
    const current = readSettings();

    const updatedSettings: PlatformSettings = {
      ...current,
      ...body,
      updatedAt: new Date().toISOString(),
      updatedBy: session.email,
    };

    writeSettings(updatedSettings);

    // Audit Log entry
    await writeAuditLog({
      actorId: session.userId,
      actorEmail: session.email,
      action: 'admin.settings_update',
      targetType: 'system_settings',
      targetId: 'global',
      metadata: {
        platformName: updatedSettings.platformName,
        maintenanceMode: updatedSettings.maintenanceMode,
        aiModel: updatedSettings.aiModel,
        updatedBy: session.email,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (e: any) {
    console.error('[/api/admin/settings POST] Error:', e);
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { runWuzzufScraper } from '@/lib/scraper/wuzzuf';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Allow up to 5 minutes on Vercel/serverless

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);
    const keyParam = searchParams.get('key');
    const cronSecret = process.env.CRON_SECRET || '3watly_secure_cron_token_2026';

    // Allow internal cron call, bearer token, or secret key query param
    const isAuthorized =
      authHeader === `Bearer ${cronSecret}` ||
      keyParam === cronSecret ||
      process.env.NODE_ENV === 'development';

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized cron trigger' }, { status: 401 });
    }

    const result = await runWuzzufScraper();

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      ...result
    });
  } catch (error: any) {
    console.error('Error in /api/cron/scrape:', error);
    return NextResponse.json({ error: error?.message || 'Scraping failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}

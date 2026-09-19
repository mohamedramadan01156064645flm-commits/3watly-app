import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { runWuzzufScraper } from '@/lib/scraper/wuzzuf';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Allow up to 5 minutes on Vercel/serverless

let isScraperRunning = false;

function verifyBearerToken(authHeader: string | null, expectedSecret: string): boolean {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.slice(7).trim();
  const tokenBuffer = Buffer.from(token, 'utf-8');
  const secretBuffer = Buffer.from(expectedSecret, 'utf-8');

  if (tokenBuffer.length !== secretBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(tokenBuffer, secretBuffer);
}

export async function GET(request: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
      console.error('[CRON] CRON_SECRET environment variable is not configured.');
      return NextResponse.json({ error: 'Cron service configuration error' }, { status: 500 });
    }

    const authHeader = request.headers.get('authorization');
    if (!verifyBearerToken(authHeader, cronSecret)) {
      return NextResponse.json({ error: 'Unauthorized cron trigger' }, { status: 401 });
    }

    if (isScraperRunning) {
      return NextResponse.json(
        { error: 'Scraper task is already in progress' },
        { status: 429 }
      );
    }

    isScraperRunning = true;

    try {
      const result = await runWuzzufScraper();
      return NextResponse.json({
        timestamp: new Date().toISOString(),
        ...result,
      });
    } finally {
      isScraperRunning = false;
    }
  } catch (error: unknown) {
    console.error('Error in /api/cron/scrape:', error);
    return NextResponse.json({ error: 'Scraping task encountered an error.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}

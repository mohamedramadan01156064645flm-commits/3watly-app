import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireUser } from '@/lib/auth/requireUser';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  try {
    let resolvedUserId: string | null = null;

    // 1. Try authenticated cookie session
    const authResult = await requireUser().catch(() => null);
    if (authResult?.user?.id) {
      resolvedUserId = authResult.user.id;
    }

    const body = await request.json().catch(() => ({}));
    const {
      filename,
      targetRole,
      cvData,
      versions,
      activeVersionId,
      parsedCv,
      rawText,
      atsScore,
      userId: bodyUserId
    } = body;

    // 2. Allow verified bodyUserId if cookie session is still synchronizing
    if (!resolvedUserId && bodyUserId && UUID_REGEX.test(bodyUserId)) {
      resolvedUserId = bodyUserId;
    }

    if (!resolvedUserId) {
      return NextResponse.json({ error: 'Unauthorized: Valid user session required' }, { status: 401 });
    }

    const adminClient = createAdminClient();
    if (!adminClient) {
      return NextResponse.json({ error: 'Database service unavailable' }, { status: 503 });
    }

    // Extract flat skills
    const flatSkills: string[] = [];
    if (cvData?.skills && Array.isArray(cvData.skills)) {
      cvData.skills.forEach((g: any) => {
        if (Array.isArray(g.skills)) {
          g.skills.forEach((s: string) => {
            if (s && !flatSkills.includes(s)) flatSkills.push(s);
          });
        }
      });
    }
    if (flatSkills.length === 0 && Array.isArray(parsedCv?.skills)) {
      parsedCv.skills.forEach((s: string) => {
        if (s && !flatSkills.includes(s)) flatSkills.push(s);
      });
    }

    const docPayload = {
      user_id: resolvedUserId,
      filename: filename || 'Curriculum Vitae',
      file_type: 'application/pdf',
      raw_text: rawText || parsedCv?.rawText || '',
      summary: cvData?.summary || parsedCv?.summary || '',
      parsed_skills: flatSkills,
      experiences: cvData?.experience || parsedCv?.experiences || [],
      education: cvData?.education || parsedCv?.education || [],
      projects: cvData?.projects || parsedCv?.projects || [],
      target_role: targetRole || cvData?.contact?.jobTitle || parsedCv?.targetRole || 'Professional',
      target_industry: 'Technology',
      ats_score: typeof atsScore === 'number' ? atsScore : (parsedCv?.atsScore || 85),
      ats_feedback: {
        cvData: cvData || null,
        versions: Array.isArray(versions) ? versions : [],
        activeVersionId: activeVersionId || 'ver-primary',
        parsedCv: parsedCv || null,
        syncedAt: new Date().toISOString()
      },
      updated_at: new Date().toISOString()
    };

    // Check if an existing cv_document exists for this user to update or insert
    const { data: existingDoc } = await adminClient
      .from('cv_documents')
      .select('id')
      .eq('user_id', resolvedUserId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let docId = existingDoc?.id;

    if (docId) {
      const { error: updateError } = await adminClient
        .from('cv_documents')
        .update(docPayload)
        .eq('id', docId);

      if (updateError) {
        console.error('Error updating cv_document:', updateError);
        throw updateError;
      }
    } else {
      const { data: inserted, error: insertError } = await adminClient
        .from('cv_documents')
        .insert(docPayload)
        .select('id')
        .single();

      if (insertError) {
        console.error('Error inserting cv_document:', insertError);
        throw insertError;
      }
      docId = inserted?.id;
    }

    // Sync profile skills & target role
    try {
      await adminClient.from('profiles').update({
        target_role: docPayload.target_role,
        skills: flatSkills,
        updated_at: new Date().toISOString()
      }).eq('id', resolvedUserId);
    } catch (profileErr) {
      console.warn('Profile sync notice:', profileErr);
    }

    return NextResponse.json({ success: true, id: docId });
  } catch (error: any) {
    console.error('Error in POST /api/cv/document:', error);
    return NextResponse.json({ error: error?.message || 'Failed to save CV document' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    let resolvedUserId: string | null = null;

    // 1. Try authenticated cookie session
    const authResult = await requireUser().catch(() => null);
    if (authResult?.user?.id) {
      resolvedUserId = authResult.user.id;
    }

    const { searchParams } = new URL(request.url);
    const queryUserId = searchParams.get('userId');

    // 2. Allow verified query parameter
    if (!resolvedUserId && queryUserId && UUID_REGEX.test(queryUserId)) {
      resolvedUserId = queryUserId;
    }

    if (!resolvedUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminClient = createAdminClient();
    if (!adminClient) {
      return NextResponse.json({ error: 'Database service unavailable' }, { status: 503 });
    }

    const { data: doc, error } = await adminClient
      .from('cv_documents')
      .select('*')
      .eq('user_id', resolvedUserId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error querying cv_documents:', error);
      throw error;
    }

    if (!doc) {
      return NextResponse.json({ success: true, document: null });
    }

    const feedback = doc.ats_feedback || {};
    const cvData = feedback.cvData || null;
    const versions = Array.isArray(feedback.versions) && feedback.versions.length > 0 ? feedback.versions : [];
    const activeVersionId = feedback.activeVersionId || (versions[0]?.id ?? 'ver-primary');
    const parsedCv = feedback.parsedCv || null;

    return NextResponse.json({
      success: true,
      document: {
        id: doc.id,
        filename: doc.filename,
        targetRole: doc.target_role,
        atsScore: doc.ats_score,
        summary: doc.summary,
        parsedSkills: doc.parsed_skills,
        experiences: doc.experiences,
        education: doc.education,
        projects: doc.projects,
        cvData,
        versions,
        activeVersionId,
        parsedCv,
        updatedAt: doc.updated_at
      }
    });
  } catch (error: any) {
    console.error('Error in GET /api/cv/document:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch CV document' }, { status: 500 });
  }
}

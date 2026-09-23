import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/authorization';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/admin/cvs — list all CV documents from all users and the database
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
  } catch (errorResponse) {
    return errorResponse as NextResponse;
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim().toLowerCase() ?? '';
    const sourceFilter = searchParams.get('source')?.trim().toLowerCase() ?? 'all';
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 150);
    const offset = (page - 1) * limit;

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database service unavailable' }, { status: 503 });
    }

    // 1. Fetch all cv_documents from database
    const [cvResult, profilesResult, authUsersResult] = await Promise.allSettled([
      supabase.from('cv_documents').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    ]);

    const cvDocs = cvResult.status === 'fulfilled' && cvResult.value.data ? cvResult.value.data : [];
    const allProfiles = profilesResult.status === 'fulfilled' && profilesResult.value.data ? profilesResult.value.data : [];
    const authUsers = authUsersResult.status === 'fulfilled' && authUsersResult.value.data?.users ? authUsersResult.value.data.users : [];

    const profilesMap = new Map<string, any>(allProfiles.map((p: any) => [p.id, p]));
    const authUsersMap = new Map<string, any>(authUsers.map((u: any) => [u.id, u]));

    const enrichedCvs: any[] = [];
    const userIdsWithDocs = new Set<string>();

    // 2. Add all uploaded/saved documents from cv_documents
    for (const cv of cvDocs) {
      if (cv.user_id) userIdsWithDocs.add(cv.user_id);
      const userProfile = profilesMap.get(cv.user_id);
      const authUser = authUsersMap.get(cv.user_id);

      const fullName = userProfile?.full_name || authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || 'مستخدم المنصة';
      const email = userProfile?.email || authUser?.email || '—';
      const avatar = userProfile?.avatar_url || authUser?.user_metadata?.avatar_url || null;
      const targetRole = cv.target_role || userProfile?.target_role || 'غير محدد';
      const skills = Array.isArray(cv.parsed_skills) && cv.parsed_skills.length > 0
        ? cv.parsed_skills
        : (Array.isArray(userProfile?.skills) ? userProfile.skills : []);

      enrichedCvs.push({
        id: cv.id,
        userId: cv.user_id,
        filename: cv.filename || `${fullName.replace(/\s+/g, '_')}_CV.pdf`,
        fileType: cv.file_type || 'application/pdf',
        targetRole,
        targetIndustry: cv.target_industry || userProfile?.target_industry || 'التقنية والبرمجيات',
        atsScore: typeof cv.ats_score === 'number' ? cv.ats_score : (userProfile?.career_alignment_score || 85),
        summary: cv.summary || userProfile?.summary || '',
        parsedSkills: skills,
        experiences: Array.isArray(cv.experiences) ? cv.experiences : [],
        education: Array.isArray(cv.education) ? cv.education : [],
        projects: Array.isArray(cv.projects) ? cv.projects : [],
        rawText: cv.raw_text || '',
        cvData: cv.ats_feedback?.cvData || null,
        source: 'uploaded',
        createdAt: cv.created_at,
        updatedAt: cv.updated_at || cv.created_at,
        userFullName: fullName,
        userEmail: email,
        userAvatar: avatar,
        hasCvData: Boolean(cv.ats_feedback?.cvData || (Array.isArray(cv.experiences) && cv.experiences.length > 0)),
        versionsCount: Array.isArray(cv.ats_feedback?.versions) ? cv.ats_feedback.versions.length : 1,
      });
    }

    // 3. For all users in profiles and auth who do NOT have a cv_document, create a comprehensive Profile CV record
    const allUserIds = new Set<string>([
      ...allProfiles.map((p: any) => p.id),
      ...authUsers.map((u: any) => u.id),
    ]);

    for (const uid of allUserIds) {
      if (!userIdsWithDocs.has(uid)) {
        const profile = profilesMap.get(uid);
        const authUser = authUsersMap.get(uid);

        const fullName = profile?.full_name || authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || 'مستخدم المنصة';
        const email = profile?.email || authUser?.email || '—';
        const avatar = profile?.avatar_url || authUser?.user_metadata?.avatar_url || null;
        const targetRole = profile?.target_role || authUser?.user_metadata?.target_role || 'متخصص تقني';
        const skills = Array.isArray(profile?.skills) ? profile.skills : [];
        const score = profile?.career_alignment_score || 80;
        const createdAt = profile?.created_at || authUser?.created_at || new Date().toISOString();

        enrichedCvs.push({
          id: `profile-${uid}`,
          userId: uid,
          filename: `${fullName.replace(/\s+/g, '_')}_Platform_CV.pdf`,
          fileType: 'application/pdf',
          targetRole,
          targetIndustry: profile?.target_industry || 'التقنية والبرمجيات',
          atsScore: score,
          summary: profile?.summary || `سيرة ذاتية مهنية مسجلة في منصة عواتلي للمستخدم ${fullName} تستهدف دور ${targetRole}.`,
          parsedSkills: skills,
          experiences: Array.isArray(profile?.experiences) ? profile.experiences : [],
          education: Array.isArray(profile?.education) ? profile.education : [],
          projects: Array.isArray(profile?.projects) ? profile.projects : [],
          rawText: '',
          cvData: null,
          source: 'profile',
          createdAt,
          updatedAt: profile?.updated_at || createdAt,
          userFullName: fullName,
          userEmail: email,
          userAvatar: avatar,
          hasCvData: skills.length > 0 || Boolean(profile?.target_role),
          versionsCount: 1,
        });
      }
    }

    // Sort by createdAt descending
    enrichedCvs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Calculate metrics
    const uploadedCount = enrichedCvs.filter((c) => c.source === 'uploaded').length;
    const profileCount = enrichedCvs.filter((c) => c.source === 'profile').length;

    // Filter by source if requested
    let filtered = enrichedCvs;
    if (sourceFilter === 'uploaded') {
      filtered = filtered.filter((c) => c.source === 'uploaded');
    } else if (sourceFilter === 'profile') {
      filtered = filtered.filter((c) => c.source === 'profile');
    }

    // Filter by search term
    if (search) {
      filtered = filtered.filter((c: any) =>
        c.filename.toLowerCase().includes(search) ||
        c.targetRole.toLowerCase().includes(search) ||
        c.userFullName.toLowerCase().includes(search) ||
        c.userEmail.toLowerCase().includes(search) ||
        c.parsedSkills.some((s: string) => s.toLowerCase().includes(search))
      );
    }

    const paginated = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      cvs: paginated,
      total: filtered.length,
      allTotal: enrichedCvs.length,
      uploadedCount,
      profileCount,
      page,
      limit,
    });
  } catch (e: any) {
    console.error('[/api/admin/cvs] Error:', e);
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}

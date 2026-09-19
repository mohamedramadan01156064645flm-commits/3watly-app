-- =========================================================================
-- 3WATLY Security Patch - Idempotent Database Policies & Schema Hardening
-- Run this in your Supabase Project SQL Editor
-- =========================================================================

-- 1. PROFILES: Restrict SELECT to authenticated owner only (Close PII scrape vulnerability)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- 2. PROFILES: Add WITH CHECK on UPDATE to prevent row hijacking / changing id
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 3. CV DOCUMENTS: Add WITH CHECK on UPDATE and ensure user_id is NOT NULL
DROP POLICY IF EXISTS "Users can update their own CV documents" ON public.cv_documents;

CREATE POLICY "Users can update their own CV documents"
  ON public.cv_documents FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Clean up any legacy orphan rows before enforcing NOT NULL
DELETE FROM public.cv_documents WHERE user_id IS NULL;

ALTER TABLE public.cv_documents 
  ALTER COLUMN user_id SET NOT NULL;

-- 4. COPILOT MESSAGES: Add WITH CHECK on UPDATE
DROP POLICY IF EXISTS "Users can update feedback on their own copilot messages" ON public.copilot_messages;

CREATE POLICY "Users can update feedback on their own copilot messages"
  ON public.copilot_messages FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. JOBS: Remove public / authenticated INSERT & UPDATE policies
-- (Scraper uses the service-role key which bypasses RLS automatically; client anon key must only SELECT)
DROP POLICY IF EXISTS "Authenticated users or service role can insert jobs" ON public.jobs;
DROP POLICY IF EXISTS "Authenticated users or service role can update jobs" ON public.jobs;

-- Ensure SELECT policy remains active for public job searches
DROP POLICY IF EXISTS "Jobs are publicly viewable" ON public.jobs;
CREATE POLICY "Jobs are publicly viewable"
  ON public.jobs FOR SELECT
  USING (true);

-- =========================================================================
-- Security Patch Complete
-- =========================================================================

-- =========================================================================
-- 3WATLY Platform Complete Production Database Schema
-- Paste this script into Supabase SQL Editor and click "Run"
-- =========================================================================

-- Optional: Enable pgvector extension for AI semantic search if supported
CREATE EXTENSION IF NOT EXISTS vector;

-- =========================================================================
-- 1. PROFILES TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  target_role TEXT DEFAULT 'Data Analyst',
  experience_years INTEGER DEFAULT 1,
  target_industry TEXT DEFAULT 'Technology',
  preferred_locations JSONB DEFAULT '["Cairo", "Giza", "Remote"]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  career_alignment_score INTEGER DEFAULT 85,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- =========================================================================
-- 2. CV DOCUMENTS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.cv_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_type TEXT DEFAULT 'application/pdf',
  raw_text TEXT,
  summary TEXT,
  parsed_skills JSONB DEFAULT '[]'::jsonb,
  experiences JSONB DEFAULT '[]'::jsonb,
  education JSONB DEFAULT '[]'::jsonb,
  projects JSONB DEFAULT '[]'::jsonb,
  target_role TEXT,
  target_industry TEXT,
  ats_score NUMERIC DEFAULT 0.0,
  ats_feedback JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.cv_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own CV documents" ON public.cv_documents;
CREATE POLICY "Users can view their own CV documents"
  ON public.cv_documents FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own CV documents" ON public.cv_documents;
CREATE POLICY "Users can insert their own CV documents"
  ON public.cv_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own CV documents" ON public.cv_documents;
CREATE POLICY "Users can update their own CV documents"
  ON public.cv_documents FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own CV documents" ON public.cv_documents;
CREATE POLICY "Users can delete their own CV documents"
  ON public.cv_documents FOR DELETE
  USING (auth.uid() = user_id);

-- =========================================================================
-- 3. JOBS TABLE (Public Egyptian Market Jobs)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_ar TEXT,
  company TEXT NOT NULL,
  company_ar TEXT,
  company_logo TEXT,
  location TEXT DEFAULT 'Cairo, Egypt',
  location_ar TEXT,
  work_type TEXT DEFAULT 'Full Time',
  is_remote BOOLEAN DEFAULT false,
  seniority TEXT DEFAULT 'Mid',
  salary_range TEXT,
  salary_min NUMERIC,
  salary_max NUMERIC,
  salary_currency TEXT DEFAULT 'EGP',
  required_skills JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  requirements TEXT,
  apply_url TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'wuzzuf',
  posted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Jobs are publicly viewable" ON public.jobs;
CREATE POLICY "Jobs are publicly viewable"
  ON public.jobs FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users or service role can insert jobs" ON public.jobs;
CREATE POLICY "Authenticated users or service role can insert jobs"
  ON public.jobs FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users or service role can update jobs" ON public.jobs;
CREATE POLICY "Authenticated users or service role can update jobs"
  ON public.jobs FOR UPDATE
  USING (true);

-- Indexing for fast search and matching
CREATE INDEX IF NOT EXISTS idx_jobs_title ON public.jobs(title);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON public.jobs(company);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_is_remote ON public.jobs(is_remote);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_at ON public.jobs(posted_at DESC);

-- =========================================================================
-- 4. COPILOT MESSAGES TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.copilot_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  feedback TEXT CHECK (feedback IN ('up', 'down', null)),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.copilot_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own copilot messages" ON public.copilot_messages;
CREATE POLICY "Users can view their own copilot messages"
  ON public.copilot_messages FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own copilot messages" ON public.copilot_messages;
CREATE POLICY "Users can insert their own copilot messages"
  ON public.copilot_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update feedback on their own copilot messages" ON public.copilot_messages;
CREATE POLICY "Users can update feedback on their own copilot messages"
  ON public.copilot_messages FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own copilot messages" ON public.copilot_messages;
CREATE POLICY "Users can delete their own copilot messages"
  ON public.copilot_messages FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_copilot_user_created ON public.copilot_messages(user_id, created_at ASC);

-- =========================================================================
-- 5. AUTOMATED USER TRIGGER
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, onboarding_completed, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'display_name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture'
    ),
    false,
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

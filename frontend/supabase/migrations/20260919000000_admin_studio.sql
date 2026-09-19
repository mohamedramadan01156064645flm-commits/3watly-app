-- ============================================================
-- 3watly Admin Studio — DB Migration
-- Phase 1: Roles, Status, Resources, Audit Logs, RLS
-- Run once via Supabase SQL Editor or CLI
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. PROFILES — add email, role & account_status + auto-sync trigger
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Ensure all columns exist safely
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email                TEXT,
  ADD COLUMN IF NOT EXISTS full_name            TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url           TEXT,
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS role                 TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('owner', 'admin', 'user')),
  ADD COLUMN IF NOT EXISTS account_status       TEXT NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'suspended')),
  ADD COLUMN IF NOT EXISTS created_at           TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at           TIMESTAMPTZ DEFAULT NOW();

-- Automatic trigger: whenever a user is created in auth.users, sync to public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role, account_status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', NULL),
    'user',
    'active'
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = COALESCE(profiles.full_name, EXCLUDED.full_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Back-fill any existing users from auth.users into profiles
INSERT INTO public.profiles (id, email, full_name, avatar_url, role, account_status)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', split_part(email, '@', 1)),
  COALESCE(raw_user_meta_data->>'avatar_url', raw_user_meta_data->>'picture', NULL),
  'user',
  'active'
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email;

-- ─────────────────────────────────────────────
-- 2. RESOURCES TABLE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resources (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_key     TEXT        NOT NULL,            -- e.g. 'sql', 'python'
  title         TEXT        NOT NULL,
  title_ar      TEXT,
  provider      TEXT        NOT NULL,            -- e.g. 'YouTube', 'Coursera', 'GitHub'
  provider_icon TEXT,                            -- custom icon URL or lucide icon name
  kind          TEXT        NOT NULL DEFAULT 'video'
    CHECK (kind IN ('video', 'article', 'course', 'repo', 'practice', 'book', 'other')),
  url           TEXT        NOT NULL,
  duration_hours NUMERIC(5,1),
  is_free       BOOLEAN     NOT NULL DEFAULT TRUE,
  language      TEXT        NOT NULL DEFAULT 'en'
    CHECK (language IN ('en', 'ar', 'both')),
  is_active     BOOLEAN     NOT NULL DEFAULT TRUE,
  display_order INTEGER     NOT NULL DEFAULT 0,
  created_by    UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 3. AUDIT LOGS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email TEXT,
  action      TEXT        NOT NULL,   -- e.g. 'user.suspend', 'resource.create'
  target_type TEXT,                   -- e.g. 'user', 'resource'
  target_id   TEXT,
  metadata    JSONB       DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 4. INDEXES
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_profiles_role
  ON profiles(role);

CREATE INDEX IF NOT EXISTS idx_profiles_account_status
  ON profiles(account_status);

CREATE INDEX IF NOT EXISTS idx_resources_skill_key
  ON resources(skill_key);

CREATE INDEX IF NOT EXISTS idx_resources_is_active
  ON resources(is_active);

CREATE INDEX IF NOT EXISTS idx_resources_display_order
  ON resources(display_order ASC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id
  ON audit_logs(actor_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
  ON audit_logs(created_at DESC NULLS LAST);

-- ─────────────────────────────────────────────
-- 5. AUTO-UPDATE updated_at on resources
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_resources_updated_at ON resources;
CREATE TRIGGER trg_resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────
-- 6. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────

-- --- profiles ---
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins and owners can read all profiles
DROP POLICY IF EXISTS "profiles_select_admin" ON profiles;
CREATE POLICY "profiles_select_admin"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'owner')
    )
  );

-- Users can update own profile (but not role or account_status)
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    -- role and account_status changes are blocked for non-owners via API layer
  );

-- Only owners can update role and account_status (enforced at API layer + this policy)
DROP POLICY IF EXISTS "profiles_update_owner" ON profiles;
CREATE POLICY "profiles_update_owner"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role = 'owner'
    )
  );

-- --- resources ---
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read active resources
DROP POLICY IF EXISTS "resources_select_active" ON resources;
CREATE POLICY "resources_select_active"
  ON resources FOR SELECT
  USING (is_active = TRUE);

-- Admins and owners can read all resources (including inactive)
DROP POLICY IF EXISTS "resources_select_admin" ON resources;
CREATE POLICY "resources_select_admin"
  ON resources FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'owner')
    )
  );

-- Admins and owners can insert resources
DROP POLICY IF EXISTS "resources_insert_admin" ON resources;
CREATE POLICY "resources_insert_admin"
  ON resources FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'owner')
    )
  );

-- Admins and owners can update resources
DROP POLICY IF EXISTS "resources_update_admin" ON resources;
CREATE POLICY "resources_update_admin"
  ON resources FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'owner')
    )
  );

-- Admins and owners can delete resources
DROP POLICY IF EXISTS "resources_delete_admin" ON resources;
CREATE POLICY "resources_delete_admin"
  ON resources FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'owner')
    )
  );

-- --- audit_logs ---
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only owners and admins can read audit logs
DROP POLICY IF EXISTS "audit_logs_select_admin" ON audit_logs;
CREATE POLICY "audit_logs_select_admin"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'owner')
    )
  );

-- Audit logs can only be inserted via service role (admin client)
-- No INSERT policy for authenticated users = only service_role can write

-- ─────────────────────────────────────────────
-- Done! Apply via Supabase SQL Editor
-- ─────────────────────────────────────────────

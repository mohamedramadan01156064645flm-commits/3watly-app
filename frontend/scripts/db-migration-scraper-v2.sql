-- ============================================================
-- 3watly / عواطلي — Wuzzuf Scraper DB Migration
-- Run once on your Supabase SQL Editor or via psql
-- ============================================================

-- 1. New skill columns (safe to run multiple times)
ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS inferred_skills   JSONB    DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS preferred_skills  JSONB    DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS skill_source      JSONB    DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS data_quality      VARCHAR(20) DEFAULT 'unresolved',
  ADD COLUMN IF NOT EXISTS last_enriched_at  TIMESTAMPTZ;

-- 2. Constraints
ALTER TABLE jobs
  ADD CONSTRAINT IF NOT EXISTS chk_data_quality
  CHECK (data_quality IN ('verified', 'partial', 'inferred', 'unresolved'));

-- 3. Performance indexes
CREATE INDEX IF NOT EXISTS idx_jobs_posted_at
  ON jobs(posted_at DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_jobs_data_quality
  ON jobs(data_quality);

CREATE INDEX IF NOT EXISTS idx_jobs_title_lower
  ON jobs(lower(title));

CREATE INDEX IF NOT EXISTS idx_jobs_company_lower
  ON jobs(lower(company));

-- 4. Back-fill data_quality for existing rows
UPDATE jobs
SET data_quality = CASE
  WHEN jsonb_array_length(required_skills) >= 2
       AND posted_at IS NOT NULL
       AND company IS NOT NULL
    THEN 'verified'
  WHEN jsonb_array_length(required_skills) >= 1
    THEN 'partial'
  WHEN company IS NOT NULL AND posted_at IS NOT NULL
    THEN 'inferred'
  ELSE 'unresolved'
END
WHERE data_quality IS NULL OR data_quality = 'unresolved';

-- 5. Reset fake posted_at dates
--    Any job stored with posted_at within 10 minutes of created_at
--    was likely assigned new Date() by the old scraper — null them out
--    so they get re-enriched on next run.
UPDATE jobs
SET posted_at = NULL
WHERE
  posted_at IS NOT NULL
  AND created_at IS NOT NULL
  AND ABS(EXTRACT(EPOCH FROM (posted_at - created_at))) < 600  -- within 10 min
  AND data_quality IN ('unresolved', 'inferred');

-- Done!

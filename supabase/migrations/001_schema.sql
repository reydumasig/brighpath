-- ============================================================
-- BrightPath MOS – Database Schema
-- Migration: 001_schema.sql
-- ============================================================

-- ----------------------------------------------------------------
-- Extensions
-- ----------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------
-- Helper: updated_at trigger function
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------
-- departments
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS departments (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  leader        TEXT,
  scorecard_key TEXT,
  is_parent     BOOLEAN NOT NULL DEFAULT false,
  parent_id     TEXT REFERENCES departments(id) ON DELETE SET NULL,
  sort_order    INT NOT NULL DEFAULT 0
);

-- ----------------------------------------------------------------
-- quarters
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quarters (
  id         TEXT PRIMARY KEY,           -- e.g. 'FY26-Q2'
  name       TEXT NOT NULL,              -- e.g. 'Q2 FY26'
  starts_on  DATE NOT NULL,
  ends_on    DATE NOT NULL,
  is_current BOOLEAN NOT NULL DEFAULT false
);

-- Only one quarter should be current; partial unique index enforces it
CREATE UNIQUE INDEX IF NOT EXISTS quarters_single_current
  ON quarters (is_current)
  WHERE is_current = true;

-- ----------------------------------------------------------------
-- scorecard_metrics
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS scorecard_metrics (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id TEXT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  quarter_id    TEXT NOT NULL REFERENCES quarters(id) ON DELETE CASCADE,
  metric        TEXT NOT NULL,
  owner         TEXT,
  goal          TEXT,
  sort_order    INT NOT NULL DEFAULT 0
);

-- ----------------------------------------------------------------
-- metric_values
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS metric_values (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_id   UUID NOT NULL REFERENCES scorecard_metrics(id) ON DELETE CASCADE,
  week_date   DATE NOT NULL,
  value       NUMERIC,
  source      TEXT NOT NULL DEFAULT 'manual',
  synced_at   TIMESTAMPTZ,
  UNIQUE (metric_id, week_date)
);

-- ----------------------------------------------------------------
-- rocks
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rocks (
  id            TEXT PRIMARY KEY,
  department_id TEXT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  quarter_id    TEXT NOT NULL REFERENCES quarters(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  owner         TEXT,
  status        TEXT NOT NULL DEFAULT 'on-track'
                  CHECK (status IN ('on-track', 'off-track', 'done')),
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER rocks_set_updated_at
  BEFORE UPDATE ON rocks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ----------------------------------------------------------------
-- rock_comments
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rock_comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rock_id    TEXT NOT NULL REFERENCES rocks(id) ON DELETE CASCADE,
  parent_id  UUID REFERENCES rock_comments(id) ON DELETE CASCADE,
  author     TEXT NOT NULL,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- issues
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS issues (
  id            TEXT PRIMARY KEY,
  department_id TEXT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  quarter_id    TEXT NOT NULL REFERENCES quarters(id) ON DELETE CASCADE,
  week_date     DATE,
  text          TEXT NOT NULL,
  owner         TEXT,
  added_by      TEXT,
  complete      BOOLEAN NOT NULL DEFAULT false,
  is_ids        BOOLEAN NOT NULL DEFAULT false,
  triage        TEXT CHECK (triage IN ('todo', 'parking')),
  source        TEXT NOT NULL DEFAULT 'manual',
  source_ref    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER issues_set_updated_at
  BEFORE UPDATE ON issues
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ----------------------------------------------------------------
-- headlines
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS headlines (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id TEXT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  week_date     DATE NOT NULL,
  type          TEXT NOT NULL CHECK (type IN ('good', 'bad')),
  text          TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- work_items
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS work_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id TEXT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  quarter_id    TEXT NOT NULL REFERENCES quarters(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  owner         TEXT,
  contributors  TEXT[] NOT NULL DEFAULT '{}',
  due_date      DATE,
  status        TEXT NOT NULL DEFAULT 'Not Started'
                  CHECK (status IN ('Not Started', 'In Progress', 'Blocked', 'Done')),
  notes         TEXT,
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER work_items_set_updated_at
  BEFORE UPDATE ON work_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ----------------------------------------------------------------
-- risks
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS risks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id TEXT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  quarter_id    TEXT NOT NULL REFERENCES quarters(id) ON DELETE CASCADE,
  text          TEXT NOT NULL,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER risks_set_updated_at
  BEFORE UPDATE ON risks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ----------------------------------------------------------------
-- voting_sessions
-- id mirrors quarter_id for easy lookup
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS voting_sessions (
  id         TEXT PRIMARY KEY,            -- same value as quarter_id
  quarter_id TEXT NOT NULL REFERENCES quarters(id) ON DELETE CASCADE,
  active     BOOLEAN NOT NULL DEFAULT false,
  started_at TIMESTAMPTZ,
  closed_at  TIMESTAMPTZ
);

-- ----------------------------------------------------------------
-- votes
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS votes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  TEXT NOT NULL REFERENCES voting_sessions(id) ON DELETE CASCADE,
  voter_name  TEXT NOT NULL,
  issue_id    TEXT NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  points      INT NOT NULL CHECK (points IN (1, 2, 3, 4)),
  UNIQUE (session_id, voter_name, issue_id)
);

-- ----------------------------------------------------------------
-- user_profiles
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT,
  full_name     TEXT,
  department_id TEXT REFERENCES departments(id) ON DELETE SET NULL,
  role          TEXT NOT NULL DEFAULT 'member'
                  CHECK (role IN ('admin', 'exec', 'dept_head', 'member')),
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- connected_sources
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS connected_sources (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  role          TEXT,
  monogram      TEXT,
  color         TEXT,
  status        TEXT NOT NULL DEFAULT 'live',
  last_synced_at TIMESTAMPTZ
);

-- ----------------------------------------------------------------
-- sync_logs
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sync_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id     TEXT NOT NULL REFERENCES connected_sources(id) ON DELETE CASCADE,
  status        TEXT,
  rows_affected INT,
  error         TEXT,
  started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at   TIMESTAMPTZ
);

-- ----------------------------------------------------------------
-- Indexes for common query patterns
-- ----------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_scorecard_metrics_dept_quarter
  ON scorecard_metrics (department_id, quarter_id);

CREATE INDEX IF NOT EXISTS idx_metric_values_metric_week
  ON metric_values (metric_id, week_date DESC);

CREATE INDEX IF NOT EXISTS idx_rocks_dept_quarter
  ON rocks (department_id, quarter_id);

CREATE INDEX IF NOT EXISTS idx_issues_dept_quarter
  ON issues (department_id, quarter_id);

CREATE INDEX IF NOT EXISTS idx_issues_week_date
  ON issues (week_date DESC);

CREATE INDEX IF NOT EXISTS idx_headlines_dept_week
  ON headlines (department_id, week_date DESC);

CREATE INDEX IF NOT EXISTS idx_work_items_dept_quarter
  ON work_items (department_id, quarter_id);

CREATE INDEX IF NOT EXISTS idx_votes_session
  ON votes (session_id);

CREATE INDEX IF NOT EXISTS idx_sync_logs_source
  ON sync_logs (source_id, started_at DESC);

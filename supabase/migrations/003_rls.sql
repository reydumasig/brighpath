-- ============================================================
-- BrightPath MOS – Row Level Security
-- Migration: 003_rls.sql
-- ============================================================

-- ----------------------------------------------------------------
-- Helper functions
-- ----------------------------------------------------------------

CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM   user_profiles
  WHERE  id = auth.uid()
  LIMIT  1;
$$;

CREATE OR REPLACE FUNCTION get_my_dept()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT department_id
  FROM   user_profiles
  WHERE  id = auth.uid()
  LIMIT  1;
$$;

-- ----------------------------------------------------------------
-- quarters – public read, no RLS needed
-- ----------------------------------------------------------------
-- (intentionally left without RLS; all users may read quarter list)

-- ----------------------------------------------------------------
-- departments – public read, no RLS needed
-- ----------------------------------------------------------------
-- (intentionally left without RLS; all users may read department list)

-- ----------------------------------------------------------------
-- user_profiles
-- ----------------------------------------------------------------
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "user_profiles: own read"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Admins and execs can read all profiles
CREATE POLICY "user_profiles: admin/exec read all"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (get_my_role() IN ('admin', 'exec'));

-- Users can update their own profile
CREATE POLICY "user_profiles: own update"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING  (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ----------------------------------------------------------------
-- scorecard_metrics
-- ----------------------------------------------------------------
ALTER TABLE scorecard_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "scorecard_metrics: authenticated read"
  ON scorecard_metrics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "scorecard_metrics: dept_head+ write"
  ON scorecard_metrics FOR INSERT
  TO authenticated
  WITH CHECK (
    get_my_role() IN ('admin', 'exec')
    OR (get_my_role() = 'dept_head' AND department_id = get_my_dept())
  );

CREATE POLICY "scorecard_metrics: dept_head+ update"
  ON scorecard_metrics FOR UPDATE
  TO authenticated
  USING (
    get_my_role() IN ('admin', 'exec')
    OR (get_my_role() = 'dept_head' AND department_id = get_my_dept())
  )
  WITH CHECK (
    get_my_role() IN ('admin', 'exec')
    OR (get_my_role() = 'dept_head' AND department_id = get_my_dept())
  );

CREATE POLICY "scorecard_metrics: dept_head+ delete"
  ON scorecard_metrics FOR DELETE
  TO authenticated
  USING (
    get_my_role() IN ('admin', 'exec')
    OR (get_my_role() = 'dept_head' AND department_id = get_my_dept())
  );

-- ----------------------------------------------------------------
-- metric_values
-- ----------------------------------------------------------------
ALTER TABLE metric_values ENABLE ROW LEVEL SECURITY;

CREATE POLICY "metric_values: authenticated read"
  ON metric_values FOR SELECT
  TO authenticated
  USING (true);

-- Write allowed for admin/exec globally, or dept_head if metric belongs to their dept
CREATE POLICY "metric_values: dept_head+ write"
  ON metric_values FOR INSERT
  TO authenticated
  WITH CHECK (
    get_my_role() IN ('admin', 'exec')
    OR (
      get_my_role() = 'dept_head'
      AND EXISTS (
        SELECT 1 FROM scorecard_metrics sm
        WHERE sm.id = metric_id
          AND sm.department_id = get_my_dept()
      )
    )
  );

CREATE POLICY "metric_values: dept_head+ update"
  ON metric_values FOR UPDATE
  TO authenticated
  USING (
    get_my_role() IN ('admin', 'exec')
    OR (
      get_my_role() = 'dept_head'
      AND EXISTS (
        SELECT 1 FROM scorecard_metrics sm
        WHERE sm.id = metric_id
          AND sm.department_id = get_my_dept()
      )
    )
  )
  WITH CHECK (
    get_my_role() IN ('admin', 'exec')
    OR (
      get_my_role() = 'dept_head'
      AND EXISTS (
        SELECT 1 FROM scorecard_metrics sm
        WHERE sm.id = metric_id
          AND sm.department_id = get_my_dept()
      )
    )
  );

CREATE POLICY "metric_values: dept_head+ delete"
  ON metric_values FOR DELETE
  TO authenticated
  USING (
    get_my_role() IN ('admin', 'exec')
    OR (
      get_my_role() = 'dept_head'
      AND EXISTS (
        SELECT 1 FROM scorecard_metrics sm
        WHERE sm.id = metric_id
          AND sm.department_id = get_my_dept()
      )
    )
  );

-- ----------------------------------------------------------------
-- rocks
-- ----------------------------------------------------------------
ALTER TABLE rocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rocks: authenticated read"
  ON rocks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "rocks: dept match or exec+ write"
  ON rocks FOR INSERT
  TO authenticated
  WITH CHECK (
    get_my_role() IN ('admin', 'exec')
    OR department_id = get_my_dept()
  );

CREATE POLICY "rocks: dept match or exec+ update"
  ON rocks FOR UPDATE
  TO authenticated
  USING (
    get_my_role() IN ('admin', 'exec')
    OR department_id = get_my_dept()
  )
  WITH CHECK (
    get_my_role() IN ('admin', 'exec')
    OR department_id = get_my_dept()
  );

CREATE POLICY "rocks: dept match or exec+ delete"
  ON rocks FOR DELETE
  TO authenticated
  USING (
    get_my_role() IN ('admin', 'exec')
    OR department_id = get_my_dept()
  );

-- ----------------------------------------------------------------
-- rock_comments
-- ----------------------------------------------------------------
ALTER TABLE rock_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rock_comments: authenticated read"
  ON rock_comments FOR SELECT
  TO authenticated
  USING (true);

-- Any authenticated user may add a comment
CREATE POLICY "rock_comments: authenticated insert"
  ON rock_comments FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authors or admin/exec may update/delete their own comments
CREATE POLICY "rock_comments: author or admin update"
  ON rock_comments FOR UPDATE
  TO authenticated
  USING (
    get_my_role() IN ('admin', 'exec')
    OR author = (SELECT email FROM user_profiles WHERE id = auth.uid())
    OR author = (SELECT full_name FROM user_profiles WHERE id = auth.uid())
  )
  WITH CHECK (true);

CREATE POLICY "rock_comments: author or admin delete"
  ON rock_comments FOR DELETE
  TO authenticated
  USING (
    get_my_role() IN ('admin', 'exec')
    OR author = (SELECT email FROM user_profiles WHERE id = auth.uid())
    OR author = (SELECT full_name FROM user_profiles WHERE id = auth.uid())
  );

-- ----------------------------------------------------------------
-- issues
-- ----------------------------------------------------------------
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "issues: authenticated read"
  ON issues FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "issues: dept match or exec+ insert"
  ON issues FOR INSERT
  TO authenticated
  WITH CHECK (
    get_my_role() IN ('admin', 'exec')
    OR department_id = get_my_dept()
  );

CREATE POLICY "issues: dept match or exec+ update"
  ON issues FOR UPDATE
  TO authenticated
  USING (
    get_my_role() IN ('admin', 'exec')
    OR department_id = get_my_dept()
  )
  WITH CHECK (
    get_my_role() IN ('admin', 'exec')
    OR department_id = get_my_dept()
  );

CREATE POLICY "issues: dept match or exec+ delete"
  ON issues FOR DELETE
  TO authenticated
  USING (
    get_my_role() IN ('admin', 'exec')
    OR department_id = get_my_dept()
  );

-- ----------------------------------------------------------------
-- headlines
-- ----------------------------------------------------------------
ALTER TABLE headlines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "headlines: authenticated read"
  ON headlines FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "headlines: dept match or exec+ insert"
  ON headlines FOR INSERT
  TO authenticated
  WITH CHECK (
    get_my_role() IN ('admin', 'exec')
    OR department_id = get_my_dept()
  );

CREATE POLICY "headlines: dept match or exec+ update"
  ON headlines FOR UPDATE
  TO authenticated
  USING (
    get_my_role() IN ('admin', 'exec')
    OR department_id = get_my_dept()
  )
  WITH CHECK (
    get_my_role() IN ('admin', 'exec')
    OR department_id = get_my_dept()
  );

CREATE POLICY "headlines: dept match or exec+ delete"
  ON headlines FOR DELETE
  TO authenticated
  USING (
    get_my_role() IN ('admin', 'exec')
    OR department_id = get_my_dept()
  );

-- ----------------------------------------------------------------
-- work_items
-- ----------------------------------------------------------------
ALTER TABLE work_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "work_items: authenticated read"
  ON work_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "work_items: dept match or exec+ insert"
  ON work_items FOR INSERT
  TO authenticated
  WITH CHECK (
    get_my_role() IN ('admin', 'exec')
    OR department_id = get_my_dept()
  );

CREATE POLICY "work_items: dept match or exec+ update"
  ON work_items FOR UPDATE
  TO authenticated
  USING (
    get_my_role() IN ('admin', 'exec')
    OR department_id = get_my_dept()
  )
  WITH CHECK (
    get_my_role() IN ('admin', 'exec')
    OR department_id = get_my_dept()
  );

CREATE POLICY "work_items: dept match or exec+ delete"
  ON work_items FOR DELETE
  TO authenticated
  USING (
    get_my_role() IN ('admin', 'exec')
    OR department_id = get_my_dept()
  );

-- ----------------------------------------------------------------
-- risks
-- ----------------------------------------------------------------
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "risks: authenticated read"
  ON risks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "risks: dept match or exec+ insert"
  ON risks FOR INSERT
  TO authenticated
  WITH CHECK (
    get_my_role() IN ('admin', 'exec')
    OR department_id = get_my_dept()
  );

CREATE POLICY "risks: dept match or exec+ update"
  ON risks FOR UPDATE
  TO authenticated
  USING (
    get_my_role() IN ('admin', 'exec')
    OR department_id = get_my_dept()
  )
  WITH CHECK (
    get_my_role() IN ('admin', 'exec')
    OR department_id = get_my_dept()
  );

CREATE POLICY "risks: dept match or exec+ delete"
  ON risks FOR DELETE
  TO authenticated
  USING (
    get_my_role() IN ('admin', 'exec')
    OR department_id = get_my_dept()
  );

-- ----------------------------------------------------------------
-- voting_sessions
-- ----------------------------------------------------------------
ALTER TABLE voting_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "voting_sessions: authenticated read"
  ON voting_sessions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "voting_sessions: admin/exec write"
  ON voting_sessions FOR INSERT
  TO authenticated
  WITH CHECK (get_my_role() IN ('admin', 'exec'));

CREATE POLICY "voting_sessions: admin/exec update"
  ON voting_sessions FOR UPDATE
  TO authenticated
  USING  (get_my_role() IN ('admin', 'exec'))
  WITH CHECK (get_my_role() IN ('admin', 'exec'));

CREATE POLICY "voting_sessions: admin/exec delete"
  ON voting_sessions FOR DELETE
  TO authenticated
  USING (get_my_role() IN ('admin', 'exec'));

-- ----------------------------------------------------------------
-- votes
-- ----------------------------------------------------------------
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read all votes in any session
CREATE POLICY "votes: authenticated read"
  ON votes FOR SELECT
  TO authenticated
  USING (true);

-- Users can only cast votes where voter_name matches their identity
-- Checked against both email and full_name to handle either convention
CREATE POLICY "votes: own voter_name insert"
  ON votes FOR INSERT
  TO authenticated
  WITH CHECK (
    voter_name = (SELECT email     FROM user_profiles WHERE id = auth.uid())
    OR voter_name = (SELECT full_name FROM user_profiles WHERE id = auth.uid())
    -- Also allow admin/exec to cast/manage votes
    OR get_my_role() IN ('admin', 'exec')
  );

CREATE POLICY "votes: own voter_name update"
  ON votes FOR UPDATE
  TO authenticated
  USING (
    voter_name = (SELECT email     FROM user_profiles WHERE id = auth.uid())
    OR voter_name = (SELECT full_name FROM user_profiles WHERE id = auth.uid())
    OR get_my_role() IN ('admin', 'exec')
  )
  WITH CHECK (
    voter_name = (SELECT email     FROM user_profiles WHERE id = auth.uid())
    OR voter_name = (SELECT full_name FROM user_profiles WHERE id = auth.uid())
    OR get_my_role() IN ('admin', 'exec')
  );

CREATE POLICY "votes: own voter_name delete"
  ON votes FOR DELETE
  TO authenticated
  USING (
    voter_name = (SELECT email     FROM user_profiles WHERE id = auth.uid())
    OR voter_name = (SELECT full_name FROM user_profiles WHERE id = auth.uid())
    OR get_my_role() IN ('admin', 'exec')
  );

-- ----------------------------------------------------------------
-- connected_sources
-- ----------------------------------------------------------------
ALTER TABLE connected_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "connected_sources: authenticated read"
  ON connected_sources FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "connected_sources: admin write"
  ON connected_sources FOR INSERT
  TO authenticated
  WITH CHECK (get_my_role() = 'admin');

CREATE POLICY "connected_sources: admin update"
  ON connected_sources FOR UPDATE
  TO authenticated
  USING  (get_my_role() = 'admin')
  WITH CHECK (get_my_role() = 'admin');

CREATE POLICY "connected_sources: admin delete"
  ON connected_sources FOR DELETE
  TO authenticated
  USING (get_my_role() = 'admin');

-- ----------------------------------------------------------------
-- sync_logs
-- ----------------------------------------------------------------
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sync_logs: authenticated read"
  ON sync_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "sync_logs: admin write"
  ON sync_logs FOR INSERT
  TO authenticated
  WITH CHECK (get_my_role() = 'admin');

CREATE POLICY "sync_logs: admin update"
  ON sync_logs FOR UPDATE
  TO authenticated
  USING  (get_my_role() = 'admin')
  WITH CHECK (get_my_role() = 'admin');

CREATE POLICY "sync_logs: admin delete"
  ON sync_logs FOR DELETE
  TO authenticated
  USING (get_my_role() = 'admin');

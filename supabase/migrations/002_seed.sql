-- ============================================================
-- BrightPath MOS – Seed Data
-- Migration: 002_seed.sql
-- ============================================================

-- ----------------------------------------------------------------
-- departments
-- ----------------------------------------------------------------
INSERT INTO departments (id, name, leader, scorecard_key, is_parent, parent_id, sort_order) VALUES
  ('services',    'Services',                   'Jordan Lin', 'services',    true,  NULL,       1),
  ('residential', 'Residential',                NULL,         'residential', false, 'services', 2),
  ('ubs',         'UBS',                        NULL,         'ubs',         false, 'services', 3),
  ('qat',         'QA & Training',              NULL,         'qat',         false, NULL,       4),
  ('hr',          'HR',                         NULL,         'hr',          false, NULL,       5),
  ('finance',     'Finance',                    NULL,         'finance',     false, NULL,       6),
  ('dam',         'Development & Acct Mgmt',    NULL,         'dam',         false, NULL,       7)
ON CONFLICT (id) DO UPDATE SET
  name          = EXCLUDED.name,
  leader        = EXCLUDED.leader,
  scorecard_key = EXCLUDED.scorecard_key,
  is_parent     = EXCLUDED.is_parent,
  parent_id     = EXCLUDED.parent_id,
  sort_order    = EXCLUDED.sort_order;

-- ----------------------------------------------------------------
-- quarters
-- ----------------------------------------------------------------
INSERT INTO quarters (id, name, starts_on, ends_on, is_current) VALUES
  ('FY26-Q1', 'Q1 FY26', '2026-01-05', '2026-03-30', false),
  ('FY26-Q2', 'Q2 FY26', '2026-04-06', '2026-06-29', true)
ON CONFLICT (id) DO UPDATE SET
  name       = EXCLUDED.name,
  starts_on  = EXCLUDED.starts_on,
  ends_on    = EXCLUDED.ends_on,
  is_current = EXCLUDED.is_current;

-- ----------------------------------------------------------------
-- connected_sources
-- ----------------------------------------------------------------
INSERT INTO connected_sources (id, name, role, monogram, color, status) VALUES
  ('zoho',         'Zoho CRM',           'Case management & referrals', 'Z', '#E24B16', 'live'),
  ('therap',       'Therap EHR',         'Clinical & service docs',     'T', '#7A3E9D', 'live'),
  ('quickbooks',   'QuickBooks Online',  'GL & finance',                '$', '#2CA01C', 'live'),
  ('when_i_work',  'When I Work',        'Scheduling & staffing',       'W', '#1B74E8', 'live'),
  ('jazzhr',       'JazzHR',             'Recruiting',                  'J', '#FF6B35', 'live'),
  ('docusign',     'DocuSign',           'Compliance docs',             'D', '#FFCC22', 'live')
ON CONFLICT (id) DO UPDATE SET
  name          = EXCLUDED.name,
  role          = EXCLUDED.role,
  monogram      = EXCLUDED.monogram,
  color         = EXCLUDED.color,
  status        = EXCLUDED.status;

-- ----------------------------------------------------------------
-- scorecard_metrics  (all linked to FY26-Q2)
-- ----------------------------------------------------------------

-- Finance
INSERT INTO scorecard_metrics (department_id, quarter_id, metric, sort_order) VALUES
  ('finance', 'FY26-Q2', 'UBS Margin %',            1),
  ('finance', 'FY26-Q2', 'Residential Margin %',    2),
  ('finance', 'FY26-Q2', 'A/R Outstanding %',       3),
  ('finance', 'FY26-Q2', 'Labor %',                 4),
  ('finance', 'FY26-Q2', 'OT %',                    5),
  ('finance', 'FY26-Q2', 'Admin %',                 6);

-- HR
INSERT INTO scorecard_metrics (department_id, quarter_id, metric, sort_order) VALUES
  ('hr', 'FY26-Q2', 'Staffing %',                   1),
  ('hr', 'FY26-Q2', 'Turnover (Voluntary)',          2),
  ('hr', 'FY26-Q2', 'Open Positions',               3),
  ('hr', 'FY26-Q2', 'Training Compliance %',        4),
  ('hr', 'FY26-Q2', 'Annual Reviews Past Due',      5);

-- Residential
INSERT INTO scorecard_metrics (department_id, quarter_id, metric, sort_order) VALUES
  ('residential', 'FY26-Q2', 'OT Hours',                    1),
  ('residential', 'FY26-Q2', 'Outcomes %',                  2),
  ('residential', 'FY26-Q2', 'GERs Open',                   3),
  ('residential', 'FY26-Q2', 'T-Logs Outstanding',          4),
  ('residential', 'FY26-Q2', 'Medication Discrepancies',    5);

-- UBS
INSERT INTO scorecard_metrics (department_id, quarter_id, metric, sort_order) VALUES
  ('ubs', 'FY26-Q2', 'MA Past Due',              1),
  ('ubs', 'FY26-Q2', 'EVV Compliance %',         2),
  ('ubs', 'FY26-Q2', 'Billable Hours',           3),
  ('ubs', 'FY26-Q2', 'Caseload Engagement %',   4);

-- QA & Training
INSERT INTO scorecard_metrics (department_id, quarter_id, metric, sort_order) VALUES
  ('qat', 'FY26-Q2', 'Orientation Records Past Due',    1),
  ('qat', 'FY26-Q2', 'Training Compliance %',           2),
  ('qat', 'FY26-Q2', 'Compliance Deadlines Past Due',   3);

-- Development & Acct Mgmt
INSERT INTO scorecard_metrics (department_id, quarter_id, metric, sort_order) VALUES
  ('dam', 'FY26-Q2', 'Referrals Received',           1),
  ('dam', 'FY26-Q2', 'Qualified Referrals',          2),
  ('dam', 'FY26-Q2', 'Decision-to-Admission Days',   3),
  ('dam', 'FY26-Q2', 'Active Pipeline',              4);

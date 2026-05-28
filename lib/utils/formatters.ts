import type { MetricStatus, RockStatus, ParsedGoal } from '@/lib/types'

// ─── Week/date constants ─────────────────────────────────────────────────────

export const CURRENT_WEEK = '2026-05-18'

/**
 * All 13 Mondays of FY26-Q2 (2026-04-06 through 2026-06-29)
 */
export const Q2_WEEKS: string[] = [
  '2026-04-06',
  '2026-04-13',
  '2026-04-20',
  '2026-04-27',
  '2026-05-04',
  '2026-05-11',
  '2026-05-18',
  '2026-05-25',
  '2026-06-01',
  '2026-06-08',
  '2026-06-15',
  '2026-06-22',
  '2026-06-29',
]

// ─── Week formatting ─────────────────────────────────────────────────────────

/**
 * Formats a Monday ISO date string as "May 18 – 24" (inclusive Sunday).
 */
export function formatWeekRange(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const start = new Date(year, month - 1, day)
  const end = new Date(year, month - 1, day + 6)

  const startMonth = start.toLocaleString('en-US', { month: 'short' })
  const endMonth = end.toLocaleString('en-US', { month: 'short' })
  const startDay = start.getDate()
  const endDay = end.getDate()

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} – ${endDay}`
  }
  return `${startMonth} ${startDay} – ${endMonth} ${endDay}`
}

/**
 * Formats a Monday ISO date string as "May 18".
 */
export function formatWeekShort(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const monthStr = date.toLocaleString('en-US', { month: 'short' })
  return `${monthStr} ${date.getDate()}`
}

/**
 * Adds `days` calendar days to an ISO date string and returns an ISO date string.
 */
export function dateAddDays(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + days)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Returns the array of 13 Monday ISO date strings for the given quarter ID.
 * Hardcoded for FY26-Q1 and FY26-Q2.
 */
export function getQuarterWeeks(quarterId: string): string[] {
  const Q1_WEEKS: string[] = [
    '2026-01-05',
    '2026-01-12',
    '2026-01-19',
    '2026-01-26',
    '2026-02-02',
    '2026-02-09',
    '2026-02-16',
    '2026-02-23',
    '2026-03-02',
    '2026-03-09',
    '2026-03-16',
    '2026-03-23',
    '2026-03-30',
  ]
  if (quarterId === 'FY26-Q1') return Q1_WEEKS
  if (quarterId === 'FY26-Q2') return Q2_WEEKS
  return []
}

// ─── Metric value formatting ─────────────────────────────────────────────────

const PERCENT_KEYWORDS = [
  'margin',
  'rate',
  '%',
  'compliance',
  'engagement',
  'occupancy',
  'utilization',
]

const HOURS_DAYS_KEYWORDS = ['hours', 'days']

/**
 * Formats a metric value with a smart unit suffix based on the metric name.
 * - Contains 'margin', 'rate', '%', etc. → "90.0%"
 * - Contains 'hours', 'days' → "8.0 hours" / "3.0 days"
 * - Otherwise → "42.5"
 * Returns an empty string for null values.
 */
export function formatMetricValue(
  value: number | null,
  metricName: string
): string {
  if (value === null) return ''

  const lower = metricName.toLowerCase()
  const rounded = Math.round(value * 10) / 10

  if (PERCENT_KEYWORDS.some((kw) => lower.includes(kw))) {
    return `${rounded}%`
  }

  for (const kw of HOURS_DAYS_KEYWORDS) {
    if (lower.includes(kw)) {
      return `${rounded} ${kw}`
    }
  }

  return `${rounded}`
}

// ─── Goal parsing ─────────────────────────────────────────────────────────────

/**
 * Parses a goal string into a structured object.
 *
 * Supported formats:
 *   ">90"    → direction: 'above', value: 90
 *   "<8"     → direction: 'below', value: 8
 *   ">90%"   → direction: 'above', value: 90
 *   "40-60"  → direction: 'range', low: 40, high: 60, isRange: true
 *   "0.389"  → treated as a percentage: value: 38.9, direction: null
 */
export function parseGoal(goal: string | null | undefined): ParsedGoal {
  if (!goal) {
    return { raw: goal ?? '', direction: null, value: null, isRange: false }
  }

  const raw = goal.trim()

  // Range: "40-60"
  const rangeMatch = raw.match(/^(-?\d+(?:\.\d+)?)\s*[-–]\s*(-?\d+(?:\.\d+)?)%?$/)
  if (rangeMatch) {
    const low = parseFloat(rangeMatch[1])
    const high = parseFloat(rangeMatch[2])
    return { raw, direction: 'range', value: null, isRange: true, low, high }
  }

  // Above: ">90" or ">90%"
  const aboveMatch = raw.match(/^>\s*(-?\d+(?:\.\d+)?)%?$/)
  if (aboveMatch) {
    return {
      raw,
      direction: 'above',
      value: parseFloat(aboveMatch[1]),
      isRange: false,
    }
  }

  // Below: "<8" or "<8%"
  const belowMatch = raw.match(/^<\s*(-?\d+(?:\.\d+)?)%?$/)
  if (belowMatch) {
    return {
      raw,
      direction: 'below',
      value: parseFloat(belowMatch[1]),
      isRange: false,
    }
  }

  // Plain decimal that looks like a proportion (e.g. "0.389" → 38.9%)
  const decimalMatch = raw.match(/^0\.\d+$/)
  if (decimalMatch) {
    return {
      raw,
      direction: null,
      value: parseFloat(raw) * 100,
      isRange: false,
    }
  }

  // Plain number
  const plainMatch = raw.match(/^(-?\d+(?:\.\d+)?)%?$/)
  if (plainMatch) {
    return {
      raw,
      direction: null,
      value: parseFloat(plainMatch[1]),
      isRange: false,
    }
  }

  return { raw, direction: null, value: null, isRange: false }
}

// ─── Metric status ────────────────────────────────────────────────────────────

/**
 * Returns the MetricStatus for a given week index based on its value vs. goal.
 *
 * - 'neutral'  → no goal, no value, or week index is out of range
 * - 'green'    → value meets the goal
 * - 'yellow'   → within 10% of the goal threshold
 * - 'red'      → outside the goal by more than 10%
 */
export function metricStatusAt(
  weeklyValues: (number | null)[],
  weekIndex: number,
  goal: string | null
): MetricStatus {
  if (!goal) return 'neutral'
  const value = weeklyValues[weekIndex]
  if (value === null || value === undefined) return 'neutral'

  const parsed = parseGoal(goal)
  if (parsed.direction === null && !parsed.isRange && parsed.value === null) {
    return 'neutral'
  }

  if (parsed.isRange && parsed.low !== undefined && parsed.high !== undefined) {
    const { low, high } = parsed
    const span = high - low
    const buffer = span * 0.1

    if (value >= low && value <= high) return 'green'
    if (value >= low - buffer && value <= high + buffer) return 'yellow'
    return 'red'
  }

  if (parsed.direction === 'above' && parsed.value !== null) {
    const target = parsed.value
    if (value >= target) return 'green'
    if (value >= target * 0.9) return 'yellow'
    return 'red'
  }

  if (parsed.direction === 'below' && parsed.value !== null) {
    const target = parsed.value
    if (value <= target) return 'green'
    if (value <= target * 1.1) return 'yellow'
    return 'red'
  }

  // Plain target (exact match within 10%)
  if (parsed.value !== null) {
    const target = parsed.value
    const diff = Math.abs(value - target)
    const tolerance = Math.abs(target) * 0.1
    if (diff === 0) return 'green'
    if (diff <= tolerance) return 'yellow'
    return 'red'
  }

  return 'neutral'
}

// ─── Color / label maps ───────────────────────────────────────────────────────

export const STATUS_COLORS: Record<MetricStatus, string> = {
  green: '#6B8770',
  yellow: '#C8841C',
  red: '#B8553A',
  neutral: '#9C9A93',
}

export const ROCK_STATUS_COLORS: Record<RockStatus, string> = {
  'on-track': '#6B8770',
  'off-track': '#B8553A',
  done: '#9C9A93',
}

export const ROCK_STATUS_LABELS: Record<RockStatus, string> = {
  'on-track': 'On Track',
  'off-track': 'Off Track',
  done: 'Done',
}

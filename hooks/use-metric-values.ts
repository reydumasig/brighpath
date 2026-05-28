'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Q2_WEEKS } from '@/lib/utils/formatters'
import type { ScorecardMetric, MetricValue } from '@/lib/types'

// ─── DB row shapes ────────────────────────────────────────────────────────────

interface MetricValueRow {
  id: string
  metric_id: string
  week_date: string
  value: number | null
  source: string
  synced_at: string | null
}

interface ScorecardMetricRow {
  id: string
  department_id: string
  quarter_id: string
  metric: string
  owner: string | null
  goal: string | null
  sort_order: number
  values: MetricValueRow[] | null
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapMetricValue(row: MetricValueRow): MetricValue {
  return {
    id: row.id,
    metricId: row.metric_id,
    weekDate: row.week_date,
    value: row.value,
    source: row.source,
    syncedAt: row.synced_at ?? undefined,
  }
}

function mapMetric(
  row: ScorecardMetricRow,
  weeks: string[]
): ScorecardMetric {
  const valuesByWeek = new Map<string, MetricValue>()
  for (const v of row.values ?? []) {
    valuesByWeek.set(v.week_date, mapMetricValue(v))
  }

  const weeklyValues: MetricValue[] = weeks.map((weekDate) => {
    return (
      valuesByWeek.get(weekDate) ?? {
        id: '',
        metricId: row.id,
        weekDate,
        value: null,
        source: 'manual',
      }
    )
  })

  return {
    id: row.id,
    departmentId: row.department_id,
    quarterId: row.quarter_id,
    metric: row.metric,
    owner: row.owner ?? undefined,
    goal: row.goal ?? undefined,
    sortOrder: row.sort_order,
    weeklyValues,
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useMetricValues(
  deptId: string,
  quarterId: string = 'FY26-Q2'
) {
  const [metrics, setMetrics] = useState<ScorecardMetric[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    setIsLoading(true)
    const supabase = createClient()

    // Fetch metrics with their values aggregated via a left join
    const { data, error } = await supabase
      .from('scorecard_metrics')
      .select(
        `
        *,
        values:metric_values(*)
        `
      )
      .eq('department_id', deptId)
      .eq('quarter_id', quarterId)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('useMetricValues: failed to load metrics', error)
      setIsLoading(false)
      return
    }

    const rows = (data ?? []) as ScorecardMetricRow[]
    setMetrics(rows.map((r) => mapMetric(r, Q2_WEEKS)))
    setIsLoading(false)
  }, [deptId, quarterId])

  useEffect(() => {
    load()
  }, [load])

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const updateMetricValue = useCallback(
    async (
      metricId: string,
      weekDate: string,
      value: number
    ): Promise<void> => {
      // Optimistic update
      setMetrics((prev) =>
        prev.map((m) => {
          if (m.id !== metricId) return m
          const weeklyValues = (m.weeklyValues ?? []).map((wv) =>
            wv.weekDate === weekDate ? { ...wv, value } : wv
          )
          return { ...m, weeklyValues }
        })
      )

      const supabase = createClient()
      const { error } = await supabase.from('metric_values').upsert(
        {
          metric_id: metricId,
          week_date: weekDate,
          value,
          source: 'manual',
        },
        { onConflict: 'metric_id,week_date' }
      )

      if (error) {
        console.error(
          'useMetricValues: updateMetricValue failed, reverting',
          error
        )
        await load()
      }
    },
    [load]
  )

  return { metrics, isLoading, updateMetricValue }
}

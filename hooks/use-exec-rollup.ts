'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CURRENT_WEEK } from '@/lib/utils/formatters'
import type { Issue, Rock } from '@/lib/types'

// ─── Department name map ──────────────────────────────────────────────────────

const DEPT_NAMES: Record<string, string> = {
  services: 'Services',
  residential: 'Residential',
  ubs: 'UBS',
  qat: 'QA & Training',
  hr: 'HR',
  finance: 'Finance',
  dam: 'Dev & Acct Mgmt',
}

// ─── Extended types ───────────────────────────────────────────────────────────

export type IssueWithDept = Issue & { deptName: string }
export type RockWithDept = Rock & { deptName: string }

// ─── DB row shapes ────────────────────────────────────────────────────────────

interface IssueRow {
  id: string
  department_id: string
  quarter_id: string
  week_date: string | null
  text: string
  owner: string | null
  added_by: string | null
  complete: boolean
  is_ids: boolean
  triage: 'todo' | 'parking' | null
  source: string
  source_ref: string | null
  created_at: string
  updated_at: string
}

interface RockRow {
  id: string
  department_id: string
  quarter_id: string
  title: string
  description: string | null
  owner: string | null
  status: Rock['status']
  sort_order: number
  created_at: string
  updated_at: string
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapIssue(row: IssueRow): Issue {
  return {
    id: row.id,
    departmentId: row.department_id,
    quarterId: row.quarter_id,
    weekDate: row.week_date ?? '',
    text: row.text,
    owner: row.owner ?? undefined,
    addedBy: row.added_by ?? undefined,
    complete: row.complete,
    isIds: row.is_ids,
    triage: row.triage,
    source: row.source,
    sourceRef: row.source_ref ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapRock(row: RockRow): Rock {
  return {
    id: row.id,
    departmentId: row.department_id,
    quarterId: row.quarter_id,
    title: row.title,
    description: row.description ?? undefined,
    owner: row.owner ?? undefined,
    status: row.status,
    sortOrder: row.sort_order,
    comments: [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function deptName(departmentId: string): string {
  return DEPT_NAMES[departmentId] ?? departmentId
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useExecRollup(
  quarterId: string = 'FY26-Q2',
  weekDate: string = CURRENT_WEEK
) {
  const [idsPending, setIdsPending] = useState<IssueWithDept[]>([])
  const [todoItems, setTodoItems] = useState<IssueWithDept[]>([])
  const [parkingLot, setParkingLot] = useState<IssueWithDept[]>([])
  const [offTrackRocks, setOffTrackRocks] = useState<RockWithDept[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      const supabase = createClient()

      const [issuesResult, rocksResult] = await Promise.all([
        supabase
          .from('issues')
          .select('*')
          .eq('quarter_id', quarterId)
          .order('week_date', { ascending: true })
          .order('created_at', { ascending: true }),
        supabase
          .from('rocks')
          .select('*')
          .eq('quarter_id', quarterId)
          .eq('status', 'off-track')
          .order('department_id', { ascending: true })
          .order('sort_order', { ascending: true }),
      ])

      if (cancelled) return

      if (issuesResult.error) {
        console.error(
          'useExecRollup: failed to load issues',
          issuesResult.error
        )
      } else {
        const allIssues: Issue[] = (issuesResult.data ?? []).map((r) =>
          mapIssue(r as IssueRow)
        )

        setIdsPending(
          allIssues
            .filter((i) => i.isIds && i.triage === null && !i.complete)
            .map((i) => ({ ...i, deptName: deptName(i.departmentId) }))
        )

        setTodoItems(
          allIssues
            .filter((i) => i.triage === 'todo' && !i.complete)
            .map((i) => ({ ...i, deptName: deptName(i.departmentId) }))
        )

        setParkingLot(
          allIssues
            .filter((i) => i.triage === 'parking')
            .map((i) => ({ ...i, deptName: deptName(i.departmentId) }))
        )
      }

      if (rocksResult.error) {
        console.error(
          'useExecRollup: failed to load rocks',
          rocksResult.error
        )
      } else {
        setOffTrackRocks(
          (rocksResult.data ?? [])
            .map((r) => mapRock(r as RockRow))
            .map((r) => ({ ...r, deptName: deptName(r.departmentId) }))
        )
      }

      setIsLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [quarterId, weekDate])

  return { idsPending, todoItems, parkingLot, offTrackRocks, isLoading }
}

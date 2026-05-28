'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Issue } from '@/lib/types'

// ─── DB row shape ─────────────────────────────────────────────────────────────

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

// ─── Mapper ───────────────────────────────────────────────────────────────────

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

// ─── useIssues ────────────────────────────────────────────────────────────────

export function useIssues(
  deptId: string,
  weekDate: string,
  quarterId: string = 'FY26-Q2'
) {
  const [issues, setIssues] = useState<Issue[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    setIsLoading(true)
    const supabase = createClient()

    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .eq('department_id', deptId)
      .eq('week_date', weekDate)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('useIssues: failed to load issues', error)
      setIsLoading(false)
      return
    }

    setIssues((data ?? []).map((r) => mapIssue(r as IssueRow)))
    setIsLoading(false)
  }, [deptId, weekDate])

  useEffect(() => {
    load()
  }, [load])

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const addIssue = useCallback(
    async (text: string, owner?: string): Promise<Issue | null> => {
      const supabase = createClient()
      const { data: row, error } = await supabase
        .from('issues')
        .insert({
          department_id: deptId,
          quarter_id: quarterId,
          week_date: weekDate,
          text,
          owner: owner ?? null,
          source: 'manual',
        })
        .select()
        .single()

      if (error || !row) {
        console.error('useIssues: addIssue failed', error)
        return null
      }

      const newIssue = mapIssue(row as IssueRow)
      setIssues((prev) => [...prev, newIssue])
      return newIssue
    },
    [deptId, quarterId, weekDate]
  )

  const updateIssue = useCallback(
    async (id: string, data: Partial<Issue>): Promise<void> => {
      // Optimistic update
      setIssues((prev) =>
        prev.map((i) => (i.id === id ? { ...i, ...data } : i))
      )

      const supabase = createClient()
      const payload: Record<string, unknown> = {}
      if (data.text !== undefined) payload.text = data.text
      if (data.owner !== undefined) payload.owner = data.owner
      if (data.complete !== undefined) payload.complete = data.complete
      if (data.isIds !== undefined) payload.is_ids = data.isIds
      if (data.triage !== undefined) payload.triage = data.triage
      if (data.source !== undefined) payload.source = data.source

      const { error } = await supabase
        .from('issues')
        .update(payload)
        .eq('id', id)

      if (error) {
        console.error('useIssues: updateIssue failed, reverting', error)
        await load()
      }
    },
    [load]
  )

  const deleteIssue = useCallback(
    async (id: string): Promise<void> => {
      const prev = issues
      setIssues((i) => i.filter((issue) => issue.id !== id))

      const supabase = createClient()
      const { error } = await supabase.from('issues').delete().eq('id', id)

      if (error) {
        console.error('useIssues: deleteIssue failed, reverting', error)
        setIssues(prev)
      }
    },
    [issues]
  )

  const triageIssue = useCallback(
    async (id: string, triage: 'todo' | 'parking' | null): Promise<void> => {
      setIssues((prev) =>
        prev.map((i) => (i.id === id ? { ...i, triage } : i))
      )

      const supabase = createClient()
      const { error } = await supabase
        .from('issues')
        .update({ triage })
        .eq('id', id)

      if (error) {
        console.error('useIssues: triageIssue failed, reverting', error)
        await load()
      }
    },
    [load]
  )

  const toggleComplete = useCallback(
    async (id: string): Promise<void> => {
      // Find current value first
      const current = issues.find((i) => i.id === id)
      if (!current) return

      const nextComplete = !current.complete
      setIssues((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, complete: nextComplete } : i
        )
      )

      const supabase = createClient()
      const { error } = await supabase
        .from('issues')
        .update({ complete: nextComplete })
        .eq('id', id)

      if (error) {
        console.error('useIssues: toggleComplete failed, reverting', error)
        await load()
      }
    },
    [issues, load]
  )

  const flagIDS = useCallback(
    async (id: string, value: boolean): Promise<void> => {
      setIssues((prev) =>
        prev.map((i) => (i.id === id ? { ...i, isIds: value } : i))
      )

      const supabase = createClient()
      const { error } = await supabase
        .from('issues')
        .update({ is_ids: value })
        .eq('id', id)

      if (error) {
        console.error('useIssues: flagIDS failed, reverting', error)
        await load()
      }
    },
    [load]
  )

  return {
    issues,
    isLoading,
    addIssue,
    updateIssue,
    deleteIssue,
    triageIssue,
    toggleComplete,
    flagIDS,
  }
}

// ─── useQuarterIssues ─────────────────────────────────────────────────────────

export function useQuarterIssues(
  deptId: string,
  quarterId: string = 'FY26-Q2'
) {
  const [allIssues, setAllIssues] = useState<Issue[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      const supabase = createClient()

      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .eq('department_id', deptId)
        .eq('quarter_id', quarterId)
        .order('week_date', { ascending: true })
        .order('created_at', { ascending: true })

      if (cancelled) return

      if (error) {
        console.error('useQuarterIssues: failed to load', error)
        setIsLoading(false)
        return
      }

      setAllIssues((data ?? []).map((r) => mapIssue(r as IssueRow)))
      setIsLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [deptId, quarterId])

  const idsPending = allIssues.filter(
    (i) => i.isIds && i.triage === null && !i.complete
  )
  const todoItems = allIssues.filter(
    (i) => i.triage === 'todo' && !i.complete
  )
  const parkingLot = allIssues.filter((i) => i.triage === 'parking')

  return { allIssues, idsPending, todoItems, parkingLot, isLoading }
}

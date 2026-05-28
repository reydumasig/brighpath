'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { WorkItem } from '@/lib/types'

// ─── DB row shapes ────────────────────────────────────────────────────────────

interface WorkItemRow {
  id: string
  department_id: string
  quarter_id: string
  title: string
  owner: string | null
  contributors: string[]
  due_date: string | null
  status: WorkItem['status']
  notes: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

interface RiskRow {
  id: string
  department_id: string
  quarter_id: string
  text: string
  updated_at: string
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

function mapWorkItem(row: WorkItemRow): WorkItem {
  return {
    id: row.id,
    departmentId: row.department_id,
    quarterId: row.quarter_id,
    title: row.title,
    owner: row.owner ?? undefined,
    contributors: row.contributors ?? [],
    dueDate: row.due_date ?? undefined,
    status: row.status,
    notes: row.notes ?? undefined,
    sortOrder: row.sort_order,
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useWorkItems(
  deptId: string,
  quarterId: string = 'FY26-Q2'
) {
  const [items, setItems] = useState<WorkItem[]>([])
  const [risks, setRisks] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    setIsLoading(true)
    const supabase = createClient()

    const [itemsResult, risksResult] = await Promise.all([
      supabase
        .from('work_items')
        .select('*')
        .eq('department_id', deptId)
        .eq('quarter_id', quarterId)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true }),
      supabase
        .from('risks')
        .select('text')
        .eq('department_id', deptId)
        .eq('quarter_id', quarterId)
        .limit(1)
        .single(),
    ])

    if (itemsResult.error) {
      console.error('useWorkItems: failed to load work items', itemsResult.error)
    } else {
      setItems(
        (itemsResult.data ?? []).map((r) => mapWorkItem(r as WorkItemRow))
      )
    }

    // risks row may not exist yet — ignore PGRST116 (no rows returned)
    if (
      risksResult.error &&
      (risksResult.error as { code?: string }).code !== 'PGRST116'
    ) {
      console.error('useWorkItems: failed to load risks', risksResult.error)
    } else {
      setRisks((risksResult.data as RiskRow | null)?.text ?? '')
    }

    setIsLoading(false)
  }, [deptId, quarterId])

  useEffect(() => {
    load()
  }, [load])

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const addItem = useCallback(
    async (data: Partial<WorkItem>): Promise<WorkItem | null> => {
      const supabase = createClient()
      const { data: row, error } = await supabase
        .from('work_items')
        .insert({
          department_id: deptId,
          quarter_id: quarterId,
          title: data.title ?? '',
          owner: data.owner ?? null,
          contributors: data.contributors ?? [],
          due_date: data.dueDate ?? null,
          status: data.status ?? 'Not Started',
          notes: data.notes ?? null,
          sort_order: data.sortOrder ?? 0,
        })
        .select()
        .single()

      if (error || !row) {
        console.error('useWorkItems: addItem failed', error)
        return null
      }

      const newItem = mapWorkItem(row as WorkItemRow)
      setItems((prev) => [...prev, newItem])
      return newItem
    },
    [deptId, quarterId]
  )

  const updateItem = useCallback(
    async (id: string, data: Partial<WorkItem>): Promise<void> => {
      // Optimistic update
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...data } : item))
      )

      const supabase = createClient()
      const payload: Record<string, unknown> = {}
      if (data.title !== undefined) payload.title = data.title
      if (data.owner !== undefined) payload.owner = data.owner
      if (data.contributors !== undefined)
        payload.contributors = data.contributors
      if (data.dueDate !== undefined) payload.due_date = data.dueDate
      if (data.status !== undefined) payload.status = data.status
      if (data.notes !== undefined) payload.notes = data.notes
      if (data.sortOrder !== undefined) payload.sort_order = data.sortOrder

      const { error } = await supabase
        .from('work_items')
        .update(payload)
        .eq('id', id)

      if (error) {
        console.error('useWorkItems: updateItem failed, reverting', error)
        await load()
      }
    },
    [load]
  )

  const deleteItem = useCallback(
    async (id: string): Promise<void> => {
      const prev = items
      setItems((i) => i.filter((item) => item.id !== id))

      const supabase = createClient()
      const { error } = await supabase
        .from('work_items')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('useWorkItems: deleteItem failed, reverting', error)
        setItems(prev)
      }
    },
    [items]
  )

  const updateRisks = useCallback(
    async (text: string): Promise<void> => {
      // Optimistic update
      setRisks(text)

      const supabase = createClient()

      // Check whether a risks row already exists for this dept/quarter
      const { data: existing } = await supabase
        .from('risks')
        .select('id')
        .eq('department_id', deptId)
        .eq('quarter_id', quarterId)
        .limit(1)
        .single()

      const error = existing
        ? (
            await supabase
              .from('risks')
              .update({ text })
              .eq('id', existing.id)
          ).error
        : (
            await supabase
              .from('risks')
              .insert({ department_id: deptId, quarter_id: quarterId, text })
          ).error

      if (error) {
        console.error('useWorkItems: updateRisks failed, reverting', error)
        await load()
      }
    },
    [deptId, quarterId, load]
  )

  return { items, risks, isLoading, addItem, updateItem, deleteItem, updateRisks }
}

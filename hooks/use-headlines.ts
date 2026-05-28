'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Headline } from '@/lib/types'

// ─── DB row shape ─────────────────────────────────────────────────────────────

interface HeadlineRow {
  id: string
  department_id: string
  week_date: string
  type: 'good' | 'bad'
  text: string
  created_at: string
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

function mapHeadline(row: HeadlineRow): Headline {
  return {
    id: row.id,
    departmentId: row.department_id,
    weekDate: row.week_date,
    type: row.type,
    text: row.text,
    createdAt: row.created_at,
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useHeadlines(deptId: string, weekDate: string) {
  const [headlines, setHeadlines] = useState<Headline[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    setIsLoading(true)
    const supabase = createClient()

    const { data, error } = await supabase
      .from('headlines')
      .select('*')
      .eq('department_id', deptId)
      .eq('week_date', weekDate)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('useHeadlines: failed to load', error)
      setIsLoading(false)
      return
    }

    setHeadlines((data ?? []).map((r) => mapHeadline(r as HeadlineRow)))
    setIsLoading(false)
  }, [deptId, weekDate])

  useEffect(() => {
    load()
  }, [load])

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const addHeadline = useCallback(
    async (type: 'good' | 'bad', text: string): Promise<Headline | null> => {
      const supabase = createClient()
      const { data: row, error } = await supabase
        .from('headlines')
        .insert({
          department_id: deptId,
          week_date: weekDate,
          type,
          text,
        })
        .select()
        .single()

      if (error || !row) {
        console.error('useHeadlines: addHeadline failed', error)
        return null
      }

      const newHeadline = mapHeadline(row as HeadlineRow)
      setHeadlines((prev) => [...prev, newHeadline])
      return newHeadline
    },
    [deptId, weekDate]
  )

  const updateHeadline = useCallback(
    async (id: string, text: string): Promise<void> => {
      // Optimistic update
      setHeadlines((prev) =>
        prev.map((h) => (h.id === id ? { ...h, text } : h))
      )

      const supabase = createClient()
      const { error } = await supabase
        .from('headlines')
        .update({ text })
        .eq('id', id)

      if (error) {
        console.error('useHeadlines: updateHeadline failed, reverting', error)
        await load()
      }
    },
    [load]
  )

  const deleteHeadline = useCallback(
    async (id: string): Promise<void> => {
      const prev = headlines
      setHeadlines((h) => h.filter((headline) => headline.id !== id))

      const supabase = createClient()
      const { error } = await supabase
        .from('headlines')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('useHeadlines: deleteHeadline failed, reverting', error)
        setHeadlines(prev)
      }
    },
    [headlines]
  )

  const good = headlines.filter((h) => h.type === 'good')
  const bad = headlines.filter((h) => h.type === 'bad')

  return { good, bad, isLoading, addHeadline, updateHeadline, deleteHeadline }
}

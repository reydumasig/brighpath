'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Rock, RockComment } from '@/lib/types'

// ─── DB row shapes (snake_case from Supabase) ────────────────────────────────

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

interface CommentRow {
  id: string
  rock_id: string
  parent_id: string | null
  author: string
  body: string
  created_at: string
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

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

function mapComment(row: CommentRow): RockComment {
  return {
    id: row.id,
    rockId: row.rock_id,
    parentId: row.parent_id ?? undefined,
    author: row.author,
    body: row.body,
    createdAt: row.created_at,
    replies: [],
  }
}

function buildCommentTree(comments: RockComment[]): RockComment[] {
  const byId = new Map<string, RockComment>()
  const roots: RockComment[] = []

  for (const c of comments) {
    byId.set(c.id, { ...c, replies: [] })
  }

  for (const c of byId.values()) {
    if (c.parentId) {
      const parent = byId.get(c.parentId)
      if (parent) {
        parent.replies = parent.replies ?? []
        parent.replies.push(c)
      } else {
        roots.push(c)
      }
    } else {
      roots.push(c)
    }
  }

  return roots
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useRocks(deptId: string, quarterId: string = 'FY26-Q2') {
  const [rocks, setRocks] = useState<Rock[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    setIsLoading(true)
    const supabase = createClient()

    const { data: rockRows, error: rockErr } = await supabase
      .from('rocks')
      .select('*')
      .eq('department_id', deptId)
      .eq('quarter_id', quarterId)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (rockErr || !rockRows) {
      console.error('useRocks: failed to load rocks', rockErr)
      setIsLoading(false)
      return
    }

    const mapped = rockRows.map((r) => mapRock(r as RockRow))

    if (mapped.length === 0) {
      setRocks([])
      setIsLoading(false)
      return
    }

    const rockIds = mapped.map((r) => r.id)

    const { data: commentRows, error: commentErr } = await supabase
      .from('rock_comments')
      .select('*')
      .in('rock_id', rockIds)
      .order('created_at', { ascending: true })

    if (commentErr) {
      console.error('useRocks: failed to load comments', commentErr)
    }

    const allComments: RockComment[] = (commentRows ?? []).map((c) =>
      mapComment(c as CommentRow)
    )

    const rocksWithComments = mapped.map((rock) => {
      const rockComments = allComments.filter((c) => c.rockId === rock.id)
      return { ...rock, comments: buildCommentTree(rockComments) }
    })

    setRocks(rocksWithComments)
    setIsLoading(false)
  }, [deptId, quarterId])

  useEffect(() => {
    load()
  }, [load])

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const addRock = useCallback(
    async (data: Partial<Rock>): Promise<Rock | null> => {
      const supabase = createClient()
      const { data: row, error } = await supabase
        .from('rocks')
        .insert({
          department_id: deptId,
          quarter_id: quarterId,
          title: data.title ?? '',
          description: data.description ?? null,
          owner: data.owner ?? null,
          status: data.status ?? 'on-track',
          sort_order: data.sortOrder ?? 0,
        })
        .select()
        .single()

      if (error || !row) {
        console.error('useRocks: addRock failed', error)
        return null
      }

      const newRock: Rock = { ...mapRock(row as RockRow), comments: [] }
      setRocks((prev) => [...prev, newRock])
      return newRock
    },
    [deptId, quarterId]
  )

  const updateRock = useCallback(
    async (id: string, data: Partial<Rock>): Promise<void> => {
      // Optimistic update
      setRocks((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...data } : r))
      )

      const supabase = createClient()
      const payload: Record<string, unknown> = {}
      if (data.title !== undefined) payload.title = data.title
      if (data.description !== undefined) payload.description = data.description
      if (data.owner !== undefined) payload.owner = data.owner
      if (data.status !== undefined) payload.status = data.status
      if (data.sortOrder !== undefined) payload.sort_order = data.sortOrder

      const { error } = await supabase
        .from('rocks')
        .update(payload)
        .eq('id', id)

      if (error) {
        console.error('useRocks: updateRock failed, reverting', error)
        await load()
      }
    },
    [load]
  )

  const deleteRock = useCallback(
    async (id: string): Promise<void> => {
      // Optimistic update
      const prev = rocks
      setRocks((r) => r.filter((rock) => rock.id !== id))

      const supabase = createClient()
      const { error } = await supabase.from('rocks').delete().eq('id', id)

      if (error) {
        console.error('useRocks: deleteRock failed, reverting', error)
        setRocks(prev)
      }
    },
    [rocks]
  )

  const addComment = useCallback(
    async (
      rockId: string,
      author: string,
      body: string
    ): Promise<RockComment | null> => {
      const supabase = createClient()
      const { data: row, error } = await supabase
        .from('rock_comments')
        .insert({ rock_id: rockId, author, body, parent_id: null })
        .select()
        .single()

      if (error || !row) {
        console.error('useRocks: addComment failed', error)
        return null
      }

      const newComment: RockComment = {
        ...mapComment(row as CommentRow),
        replies: [],
      }

      setRocks((prev) =>
        prev.map((r) => {
          if (r.id !== rockId) return r
          return {
            ...r,
            comments: [...(r.comments ?? []), newComment],
          }
        })
      )

      return newComment
    },
    []
  )

  const addReply = useCallback(
    async (
      parentId: string,
      rockId: string,
      author: string,
      body: string
    ): Promise<RockComment | null> => {
      const supabase = createClient()
      const { data: row, error } = await supabase
        .from('rock_comments')
        .insert({ rock_id: rockId, parent_id: parentId, author, body })
        .select()
        .single()

      if (error || !row) {
        console.error('useRocks: addReply failed', error)
        return null
      }

      const newReply: RockComment = {
        ...mapComment(row as CommentRow),
        replies: [],
      }

      // Re-load to get the updated comment tree rather than manually splicing
      await load()
      return newReply
    },
    [load]
  )

  return {
    rocks,
    isLoading,
    addRock,
    updateRock,
    deleteRock,
    addComment,
    addReply,
  }
}

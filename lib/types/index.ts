// ─── Status / label union types ─────────────────────────────────────────────

export type MetricStatus = 'green' | 'yellow' | 'red' | 'neutral'
export type RockStatus = 'on-track' | 'off-track' | 'done'

// ─── Parsed goal shape ───────────────────────────────────────────────────────

export type ParsedGoal = {
  raw: string
  direction: 'above' | 'below' | 'range' | null
  value: number | null
  isRange: boolean
  low?: number
  high?: number
}

// ─── Domain interfaces ───────────────────────────────────────────────────────

export interface Department {
  id: string
  name: string
  leader?: string
  scorecardKey?: string
  isParent: boolean
  parentId?: string
  sortOrder: number
}

export interface Quarter {
  id: string
  name: string
  startsOn: string
  endsOn: string
  isCurrent: boolean
}

export interface MetricValue {
  id: string
  metricId: string
  weekDate: string
  value: number | null
  source: string
  syncedAt?: string
}

export interface ScorecardMetric {
  id: string
  departmentId: string
  quarterId: string
  metric: string
  owner?: string
  goal?: string
  sortOrder?: number
  weeklyValues?: MetricValue[]
}

export interface RockComment {
  id: string
  rockId: string
  parentId?: string
  author: string
  body: string
  createdAt: string
  replies?: RockComment[]
}

export interface Rock {
  id: string
  departmentId: string
  quarterId: string
  title: string
  description?: string
  owner?: string
  status: RockStatus
  sortOrder?: number
  comments?: RockComment[]
  createdAt: string
  updatedAt: string
}

export interface Issue {
  id: string
  departmentId: string
  quarterId: string
  weekDate: string
  text: string
  owner?: string
  addedBy?: string
  complete: boolean
  isIds: boolean
  triage: 'todo' | 'parking' | null
  source: string
  sourceRef?: string
  createdAt: string
  updatedAt: string
}

export interface Headline {
  id: string
  departmentId: string
  weekDate: string
  type: 'good' | 'bad'
  text: string
  createdAt: string
}

export interface WorkItem {
  id: string
  departmentId: string
  quarterId: string
  title: string
  owner?: string
  contributors: string[]
  dueDate?: string
  status: 'Not Started' | 'In Progress' | 'Blocked' | 'Done'
  notes?: string
  sortOrder?: number
}

export interface Risk {
  id: string
  departmentId: string
  quarterId: string
  text: string
  updatedAt: string
}

export interface VotingSession {
  id: string
  quarterId: string
  active: boolean
  startedAt?: string
  closedAt?: string
}

export interface Vote {
  id: string
  sessionId: string
  voterName: string
  issueId: string
  points: 1 | 2 | 3 | 4
}

export interface UserProfile {
  id: string
  email: string
  fullName?: string
  departmentId?: string
  role: 'admin' | 'exec' | 'dept_head' | 'member'
  avatarUrl?: string
}

export interface ConnectedSource {
  id: string
  name: string
  role: string
  monogram: string
  color: string
  status: 'live' | 'degraded' | 'offline'
  lastSyncedAt?: string
}

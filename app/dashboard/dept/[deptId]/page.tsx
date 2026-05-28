'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { formatWeekRange, formatWeekShort, CURRENT_WEEK, Q2_WEEKS } from '@/lib/utils/formatters'

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const T = {
  paper: '#F5F1EA',
  paperBorder: '#E4DFD6',
  teal: '#2A7F8F',
  tealLight: '#EBF5F7',
  amber: '#C8841C',
  muted: '#7A766E',
  heading: '#1C1A17',
  body: '#3A3733',
  cardBg: '#FDFCF9',
  shimmer1: '#EDE9E1',
  shimmer2: '#F5F1EA',
} as const

// ─── Department metadata ──────────────────────────────────────────────────────

const DEPT_META: Record<string, { name: string; leader?: string; scorecardKey: string }> = {
  services:    { name: 'Services',         leader: 'Jordan Lin',       scorecardKey: 'services' },
  residential: { name: 'Residential',      leader: 'Maya Chen',        scorecardKey: 'residential' },
  ubs:         { name: 'UBS',              leader: 'Devon Pierce',     scorecardKey: 'ubs' },
  qat:         { name: 'QA & Training',    leader: 'Priya Sundaram',   scorecardKey: 'qat' },
  hr:          { name: 'HR',               leader: 'Marcus Olson',     scorecardKey: 'hr' },
  finance:     { name: 'Finance',          leader: 'Brandon Kim',      scorecardKey: 'finance' },
  dam:         { name: 'Dev & Acct Mgmt',  leader: 'Jamie Whitford',   scorecardKey: 'dam' },
}

// ─── Week picker ──────────────────────────────────────────────────────────────

interface WeekPickerProps {
  selectedWeek: string
  onChange: (week: string) => void
}

function WeekPicker({ selectedWeek, onChange }: WeekPickerProps) {
  const currentIdx = Q2_WEEKS.indexOf(CURRENT_WEEK)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flexWrap: 'wrap',
        padding: '12px 16px',
        background: T.cardBg,
        border: `1px solid ${T.paperBorder}`,
        borderRadius: '10px',
      }}
    >
      {/* Q1 history button */}
      <button
        style={{
          padding: '4px 10px',
          borderRadius: '6px',
          border: `1px dashed ${T.paperBorder}`,
          background: 'transparent',
          fontSize: '12px',
          color: T.muted,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontFamily: 'inherit',
        }}
      >
        <span>Q1 history</span>
        <span style={{ fontSize: '9px' }}>▾</span>
      </button>

      <span
        style={{
          width: '1px',
          height: '18px',
          background: T.paperBorder,
          display: 'block',
          marginLeft: '2px',
          marginRight: '2px',
        }}
      />

      {/* Q2 week buttons */}
      {Q2_WEEKS.map((week, idx) => {
        const isFuture = idx > currentIdx
        const isSelected = week === selectedWeek
        const isCurrent = week === CURRENT_WEEK

        return (
          <button
            key={week}
            disabled={isFuture}
            onClick={() => !isFuture && onChange(week)}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: isSelected
                ? `1.5px solid ${T.teal}`
                : `1px solid ${isCurrent ? T.teal + '60' : T.paperBorder}`,
              background: isSelected ? T.teal : isCurrent ? T.tealLight : 'transparent',
              color: isSelected ? '#fff' : isFuture ? T.paperBorder : T.body,
              fontSize: '12px',
              fontWeight: isSelected || isCurrent ? 600 : 400,
              cursor: isFuture ? 'not-allowed' : 'pointer',
              opacity: isFuture ? 0.4 : 1,
              fontFamily: 'inherit',
              transition: 'background 0.1s, border-color 0.1s',
              whiteSpace: 'nowrap',
            }}
          >
            {formatWeekShort(week)}
          </button>
        )
      })}
    </div>
  )
}

// ─── Skeleton shimmer ──────────────────────────────────────────────────────────

function SkeletonRockCard() {
  return (
    <div
      style={{
        border: `1px solid ${T.paperBorder}`,
        borderRadius: '8px',
        padding: '16px',
        background: T.cardBg,
      }}
    >
      <style>{`
        @keyframes bp-shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .bp-shimmer-line {
          background: linear-gradient(90deg, ${T.shimmer1} 25%, ${T.shimmer2} 50%, ${T.shimmer1} 75%);
          background-size: 800px 100%;
          animation: bp-shimmer 1.6s infinite;
          border-radius: 4px;
        }
      `}</style>
      <div className="bp-shimmer-line" style={{ height: '14px', width: '65%', marginBottom: '10px' }} />
      <div className="bp-shimmer-line" style={{ height: '11px', width: '40%', marginBottom: '14px' }} />
      <div style={{ display: 'flex', gap: '8px' }}>
        <div className="bp-shimmer-line" style={{ height: '22px', width: '70px' }} />
        <div className="bp-shimmer-line" style={{ height: '22px', width: '50px' }} />
      </div>
    </div>
  )
}

// ─── Tab placeholder cards ────────────────────────────────────────────────────

function PlaceholderCard({ message }: { message: string }) {
  return (
    <Card
      style={{
        background: T.cardBg,
        border: `1px dashed ${T.paperBorder}`,
        boxShadow: 'none',
        borderRadius: '10px',
      }}
    >
      <CardContent
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 32px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '13px', color: T.muted, fontStyle: 'italic' }}>{message}</p>
      </CardContent>
    </Card>
  )
}

function RocksPlaceholder() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Card
        style={{
          background: T.cardBg,
          border: `1px dashed ${T.paperBorder}`,
          boxShadow: 'none',
          borderRadius: '10px',
        }}
      >
        <CardContent style={{ padding: '20px' }}>
          <p style={{ fontSize: '13px', color: T.muted, fontStyle: 'italic', marginBottom: '16px' }}>
            Quarterly rocks are loading... (connects to Supabase)
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SkeletonRockCard />
            <SkeletonRockCard />
            <SkeletonRockCard />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function IssuesPlaceholder({ selectedWeek }: { selectedWeek: string }) {
  return (
    <Card
      style={{
        background: T.cardBg,
        border: `1px dashed ${T.paperBorder}`,
        boxShadow: 'none',
        borderRadius: '10px',
      }}
    >
      <CardHeader>
        <CardTitle
          style={{
            fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
            fontWeight: 700,
            fontSize: '13.5px',
            color: T.heading,
          }}
        >
          Issues for week of {formatWeekRange(selectedWeek)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p style={{ fontSize: '13px', color: T.muted, fontStyle: 'italic' }}>
          No issues recorded for this week yet.
        </p>
      </CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DeptPage({ params }: { params: Promise<{ deptId: string }> }) {
  const { deptId } = React.use(params)
  const [selectedWeek, setSelectedWeek] = useState(CURRENT_WEEK)

  const meta = DEPT_META[deptId]

  if (!meta) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 32px',
          gap: '12px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
            fontWeight: 700,
            fontSize: '18px',
            color: T.heading,
          }}
        >
          Department not found
        </p>
        <p style={{ fontSize: '13px', color: T.muted }}>
          &ldquo;{deptId}&rdquo; is not a recognised department.
        </p>
        <Link
          href="/dashboard/exec"
          style={{
            fontSize: '13px',
            color: T.teal,
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }}
        >
          ← Back to Executive Summary
        </Link>
      </div>
    )
  }

  const tabs = [
    { value: 'rocks',       label: 'Rocks' },
    { value: 'project',     label: 'Project Plan' },
    { value: 'metrics',     label: 'Metrics' },
    { value: 'issues',      label: 'Issues' },
    { value: 'ids',         label: 'IDS' },
    { value: 'todo',        label: 'To Do' },
    { value: 'parking',     label: 'Parking Lot' },
  ]

  return (
    <div style={{ maxWidth: '1100px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page header */}
      <div>
        <h1
          style={{
            fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
            fontWeight: 700,
            fontSize: '26px',
            color: T.heading,
            letterSpacing: '-0.02em',
            marginBottom: '4px',
          }}
        >
          {meta.name}
        </h1>
        {meta.leader && (
          <p style={{ fontSize: '13px', color: T.muted }}>
            <span style={{ fontWeight: 500, color: T.body }}>{meta.leader}</span>
            {' '}· Department Head
          </p>
        )}
      </div>

      {/* Week picker */}
      <WeekPicker selectedWeek={selectedWeek} onChange={setSelectedWeek} />

      {/* Tabs */}
      <Tabs defaultValue="rocks" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <TabsList
          style={{
            background: T.paper,
            border: `1px solid ${T.paperBorder}`,
            borderRadius: '8px',
            padding: '3px',
            height: 'auto',
            gap: '2px',
            width: 'fit-content',
          }}
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              style={{ fontSize: '13px', borderRadius: '6px', padding: '5px 12px' }}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="rocks">
          <RocksPlaceholder />
        </TabsContent>

        <TabsContent value="project">
          <PlaceholderCard message="Project plan syncs from Supabase" />
        </TabsContent>

        <TabsContent value="metrics">
          <PlaceholderCard message="Scorecard data will sync from integrated sources (QuickBooks, When I Work, Therap, etc.)" />
        </TabsContent>

        <TabsContent value="issues">
          <IssuesPlaceholder selectedWeek={selectedWeek} />
        </TabsContent>

        <TabsContent value="ids">
          <PlaceholderCard message="Issues flagged for IDS will appear here" />
        </TabsContent>

        <TabsContent value="todo">
          <PlaceholderCard message="To-do items for this department will appear here" />
        </TabsContent>

        <TabsContent value="parking">
          <PlaceholderCard message="Parking lot items will appear here" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { formatWeekRange, CURRENT_WEEK } from '@/lib/utils/formatters'

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const T = {
  paper: '#F5F1EA',
  paperBorder: '#E4DFD6',
  teal: '#2A7F8F',
  tealLight: '#EBF5F7',
  amber: '#C8841C',
  amberLight: '#FDF3E3',
  red: '#B8553A',
  redLight: '#FDECEA',
  muted: '#7A766E',
  heading: '#1C1A17',
  body: '#3A3733',
  cardBg: '#FDFCF9',
} as const

// ─── KPI card ────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string
  value: number
  accent?: 'red' | 'amber' | 'teal' | 'neutral'
}

function KpiCard({ label, value, accent = 'neutral' }: KpiCardProps) {
  const dotColor =
    accent === 'red'
      ? T.red
      : accent === 'amber'
      ? T.amber
      : accent === 'teal'
      ? T.teal
      : T.muted

  const activeBg =
    accent === 'red' && value > 0
      ? T.redLight
      : accent === 'amber' && value > 0
      ? T.amberLight
      : T.cardBg

  const valueColor =
    accent === 'red' && value > 0
      ? T.red
      : accent === 'amber' && value > 0
      ? T.amber
      : T.heading

  return (
    <div
      style={{
        background: activeBg,
        border: `1px solid ${T.paperBorder}`,
        borderRadius: '10px',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        <span
          style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: dotColor,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: '11.5px',
            fontWeight: 500,
            color: T.muted,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {label}
        </span>
      </div>
      <span
        style={{
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: '32px',
          fontWeight: 700,
          color: valueColor,
          lineHeight: 1,
        }}
      >
        {value}
      </span>
    </div>
  )
}

// ─── Rollup card ─────────────────────────────────────────────────────────────

interface RollupCardProps {
  title: string
  itemCount: number
  items: Array<{ id: string; label: string; dept?: string }>
  emptyMessage?: string
}

function RollupCard({ title, itemCount, items, emptyMessage = 'No items yet' }: RollupCardProps) {
  return (
    <Card
      style={{
        background: T.cardBg,
        border: `1px solid ${T.paperBorder}`,
        boxShadow: 'none',
        borderRadius: '10px',
      }}
    >
      <CardHeader
        style={{
          borderBottom: `1px solid ${T.paperBorder}`,
          paddingBottom: '12px',
          marginBottom: '0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <CardTitle
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: '13.5px',
              color: T.heading,
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </CardTitle>
          <span
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '12px',
              fontWeight: 600,
              color: T.muted,
              background: T.paper,
              border: `1px solid ${T.paperBorder}`,
              borderRadius: '4px',
              padding: '1px 7px',
            }}
          >
            {itemCount}
          </span>
        </div>
      </CardHeader>
      <CardContent style={{ paddingTop: '12px' }}>
        {items.length === 0 ? (
          <p
            style={{
              fontSize: '13px',
              color: T.muted,
              fontStyle: 'italic',
              textAlign: 'center',
              padding: '20px 0',
            }}
          >
            {emptyMessage}
          </p>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {items.map((item) => (
              <li
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                  fontSize: '13px',
                  color: T.body,
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLLIElement).style.background = T.paper
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLLIElement).style.background = 'transparent'
                }}
              >
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.label}
                </span>
                {item.dept && (
                  <span
                    style={{
                      fontSize: '11px',
                      color: T.muted,
                      background: T.paper,
                      border: `1px solid ${T.paperBorder}`,
                      borderRadius: '4px',
                      padding: '1px 6px',
                      marginLeft: '8px',
                      flexShrink: 0,
                    }}
                  >
                    {item.dept}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Voting placeholder ───────────────────────────────────────────────────────

function VotingPlaceholder() {
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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 32px',
          gap: '12px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: T.tealLight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: T.teal,
          }}
        >
          ◎
        </div>
        <div>
          <p
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              color: T.heading,
              marginBottom: '6px',
            }}
          >
            End-of-quarter voting opens when the quarter closes
          </p>
          <p style={{ fontSize: '13px', color: T.muted, maxWidth: '420px' }}>
            Parking lot items will appear here. Team members will be able to vote on which issues to
            carry forward into the next quarter.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ExecPage() {
  const kpis = [
    { label: 'IDS Pending', value: 0, accent: 'red' as const },
    { label: 'To Do', value: 0, accent: 'neutral' as const },
    { label: 'Parking Lot', value: 0, accent: 'neutral' as const },
    { label: 'Off-track Rocks', value: 0, accent: 'amber' as const },
    { label: 'Red Metrics', value: 0, accent: 'red' as const },
  ]

  const rollupCards = [
    {
      id: 'ids',
      title: 'IDS — pending triage',
      items: [] as Array<{ id: string; label: string; dept?: string }>,
      emptyMessage: 'No IDS items pending triage',
    },
    {
      id: 'todo',
      title: 'To Do — active commitments',
      items: [] as Array<{ id: string; label: string; dept?: string }>,
      emptyMessage: 'No active to-do items',
    },
    {
      id: 'rocks',
      title: 'Off-track rocks',
      items: [] as Array<{ id: string; label: string; dept?: string }>,
      emptyMessage: 'All rocks on track',
    },
    {
      id: 'metrics',
      title: 'Red metrics this week',
      items: [] as Array<{ id: string; label: string; dept?: string }>,
      emptyMessage: 'No red metrics this week',
    },
  ]

  return (
    <div style={{ maxWidth: '1200px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
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
          Executive Summary
        </h1>
        <p style={{ fontSize: '14px', color: T.muted }}>
          Week of {formatWeekRange(CURRENT_WEEK)}
        </p>
      </div>

      {/* 5-column KPI grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '12px',
        }}
      >
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} label={kpi.label} value={kpi.value} accent={kpi.accent} />
        ))}
      </div>

      {/* 2-column rollup grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
        }}
      >
        {rollupCards.map((card) => (
          <RollupCard
            key={card.id}
            title={card.title}
            itemCount={card.items.length}
            items={card.items}
            emptyMessage={card.emptyMessage}
          />
        ))}
      </div>

      {/* Quarter wrap-up */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: '16px',
              color: T.heading,
              letterSpacing: '-0.01em',
            }}
          >
            Quarter wrap-up
          </h2>
          <span
            style={{
              fontSize: '11px',
              color: T.muted,
              background: T.paper,
              border: `1px solid ${T.paperBorder}`,
              borderRadius: '4px',
              padding: '2px 8px',
              fontWeight: 500,
            }}
          >
            Q2 FY26
          </span>
        </div>
        <VotingPlaceholder />
      </div>
    </div>
  )
}

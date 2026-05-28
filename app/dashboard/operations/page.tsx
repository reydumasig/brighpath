'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const T = {
  paper: '#F5F1EA',
  paperBorder: '#E4DFD6',
  teal: '#2A7F8F',
  tealLight: '#EBF5F7',
  tealBorder: '#A8D4DA',
  muted: '#7A766E',
  heading: '#1C1A17',
  body: '#3A3733',
  cardBg: '#FDFCF9',
} as const

// ─── Tracker data ─────────────────────────────────────────────────────────────

interface TrackerCategory {
  id: string
  name: string
  description: string
  subItems: string[]
}

const TRACKER_CATEGORIES: TrackerCategory[] = [
  {
    id: 'onboarding',
    name: 'New Hire Onboarding',
    description: 'Track I-9s, background studies, and first-day readiness across all new staff.',
    subItems: [
      'I-9 completion',
      'Background study status',
      'System access provisioned',
      'Orientation scheduled',
    ],
  },
  {
    id: 'training',
    name: 'Staff Training',
    description: 'Monitor required training completion rates, overdue items, and certifications.',
    subItems: [
      'Required training %',
      'Overdue by staff',
      'CPR/First Aid expiry',
      'Certification renewals',
    ],
  },
  {
    id: 'staffing',
    name: 'Staffing & Scheduling',
    description: 'Live view of open shifts, overtime, fill rates, and call-outs by location.',
    subItems: [
      'Open shifts this week',
      'OT hours by location',
      'Fill rate %',
      'Call-outs logged',
    ],
  },
  {
    id: 'termination',
    name: 'Termination Process',
    description: 'Ensure all off-boarding steps are completed for departing employees.',
    subItems: [
      'Exit interview completed',
      'Equipment returned',
      'Access revoked',
      'Final pay processed',
    ],
  },
  {
    id: 'incidents',
    name: 'Incident Reports',
    description: 'Track open incidents, overdue follow-ups, and regulatory submission status.',
    subItems: [
      'Open incidents',
      'Overdue follow-ups',
      'GER submissions',
      'DHS notifications sent',
    ],
  },
  {
    id: 'loa',
    name: 'Leaves of Absence',
    description: 'Monitor active LOAs, return-to-work timelines, FMLA tracking, and coverage.',
    subItems: [
      'Active LOAs',
      'Return-to-work dates',
      'FMLA tracking',
      'Coverage arranged',
    ],
  },
  {
    id: 'credentials',
    name: 'Credentials & Renewals',
    description: 'Flag expiring and expired credentials before they become compliance risks.',
    subItems: [
      'Expiring within 30 days',
      'Expired (action required)',
      'Background study renewals',
      'License verifications',
    ],
  },
]

// ─── Tracker card ──────────────────────────────────────────────────────────────

function TrackerCard({ category }: { category: TrackerCategory }) {
  return (
    <Card
      style={{
        background: T.cardBg,
        border: `1px solid ${T.paperBorder}`,
        boxShadow: 'none',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardHeader
        style={{
          borderBottom: `1px solid ${T.paperBorder}`,
          paddingBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <CardTitle
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: '13.5px',
                color: T.heading,
                letterSpacing: '-0.01em',
                marginBottom: '4px',
              }}
            >
              {category.name}
            </CardTitle>
            <p style={{ fontSize: '12px', color: T.muted, lineHeight: 1.45, margin: 0 }}>
              {category.description}
            </p>
          </div>
          <Badge
            variant="secondary"
            style={{
              fontSize: '10px',
              fontWeight: 600,
              color: T.muted,
              background: T.paper,
              border: `1px solid ${T.paperBorder}`,
              borderRadius: '4px',
              padding: '2px 7px',
              height: 'auto',
              flexShrink: 0,
            }}
          >
            Coming Soon
          </Badge>
        </div>
      </CardHeader>

      <CardContent style={{ flex: 1, paddingTop: '14px', paddingBottom: '14px' }}>
        <ul
          style={{
            listStyle: 'none',
            margin: '0 0 16px',
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '7px',
          }}
        >
          {category.subItems.map((item) => (
            <li
              key={item}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12.5px',
                color: T.body,
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: T.paperBorder,
                  flexShrink: 0,
                }}
              />
              {item}
            </li>
          ))}
        </ul>

        <Button
          disabled
          variant="outline"
          size="sm"
          style={{
            width: '100%',
            fontSize: '12px',
            color: T.muted,
            borderColor: T.paperBorder,
            background: T.paper,
            cursor: 'not-allowed',
            opacity: 0.7,
          }}
        >
          Connect Google Sheet
        </Button>
      </CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OperationsPage() {
  return (
    <div style={{ maxWidth: '1200px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
          Operations
        </h1>
        <p style={{ fontSize: '14px', color: T.muted }}>
          Cross-functional trackers that span multiple departments
        </p>
      </div>

      {/* Info banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '14px 18px',
          background: T.tealLight,
          border: `1px solid ${T.tealBorder}`,
          borderRadius: '10px',
        }}
      >
        <span style={{ fontSize: '16px', color: T.teal, flexShrink: 0, marginTop: '1px' }}>ℹ</span>
        <p style={{ fontSize: '13px', color: T.teal, lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
          Connect your Google Sheets trackers to populate live data. Each category maps to one or
          more sheets from your existing workflow.
        </p>
      </div>

      {/* 3-column tracker grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          alignItems: 'start',
        }}
      >
        {TRACKER_CATEGORIES.map((category) => (
          <TrackerCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}

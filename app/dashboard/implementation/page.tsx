'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const T = {
  paper: '#F5F1EA',
  paperBorder: '#E4DFD6',
  teal: '#2A7F8F',
  tealLight: '#EBF5F7',
  tealDark: '#1F5F6B',
  amber: '#C8841C',
  amberLight: '#FDF3E3',
  sage: '#5A7A5A',
  sageLight: '#EDF2ED',
  muted: '#7A766E',
  mutedDark: '#5A5650',
  heading: '#1C1A17',
  body: '#3A3733',
  cardBg: '#FDFCF9',
  dark: '#111210',
  darkCard: '#1A1C19',
  darkBorder: '#2E3028',
} as const

// ─── Month data ───────────────────────────────────────────────────────────────

interface WorkBlock {
  label: string
  description: string
}

interface MonthData {
  number: number
  name: string
  tagline: string
  description: string
  workBlocks: WorkBlock[]
  deliverables: string[]
  asks: string[]
  milestone: string
  accentColor: string
  accentLight: string
}

const MONTHS: MonthData[] = [
  {
    number: 1,
    name: 'Listen & Learn',
    tagline: 'Build the baseline.',
    description:
      'We shadow your team, map your data flows, and stand up a read-only version of the MOS populated with your real data.',
    workBlocks: [
      { label: 'Discovery interviews', description: 'All department heads' },
      { label: 'Data source mapping + API connections', description: '' },
      { label: 'Read-only MOS', description: 'Populated with Week 1 data' },
    ],
    deliverables: ['Live MOS with real data', 'Integration map', 'Week 1 scorecard'],
    asks: ['Access to all 6 systems', '2 hrs/dept head', 'Weekly sync call'],
    milestone: 'You see your real data in the dashboard.',
    accentColor: T.teal,
    accentLight: T.tealLight,
  },
  {
    number: 2,
    name: 'Run in Parallel',
    tagline: 'Verify, calibrate, adopt.',
    description:
      'Your team runs the MOS alongside current tools. We fix edge cases and train dept heads.',
    workBlocks: [
      { label: 'Weekly scorecard calibration sessions', description: '' },
      { label: 'Rocks + issues workflow training', description: '' },
      { label: 'Department onboarding', description: 'One per week' },
    ],
    deliverables: [
      'Calibrated scorecard',
      'Team trained on IDS/rocks',
      'Dept heads self-sufficient',
    ],
    asks: ['Dept heads enter data weekly', 'Flag anything that feels off'],
    milestone: 'The MOS replaces your weekly prep doc.',
    accentColor: T.amber,
    accentLight: T.amberLight,
  },
  {
    number: 3,
    name: 'Refine & Replace',
    tagline: 'Make it yours.',
    description:
      'Deprecate the old tools, refine the workflows, hand over the keys.',
    workBlocks: [
      { label: 'Old-tool deprecation plan', description: '' },
      { label: 'Custom module config', description: 'Intake builder' },
      { label: 'Handover documentation', description: '' },
    ],
    deliverables: [
      'Deprecated tool list',
      'Custom modules live',
      'Full handover docs',
    ],
    asks: ['Commit to the new workflow', 'Identify Phase 2 priorities'],
    milestone: 'The MOS is your operating system.',
    accentColor: T.sage,
    accentLight: T.sageLight,
  },
]

// ─── Work block row ────────────────────────────────────────────────────────────

function WorkBlockRow({ block }: { block: WorkBlock }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        padding: '7px 0',
        borderBottom: `1px solid ${T.paperBorder}`,
      }}
    >
      <span
        style={{
          display: 'inline-block',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: T.paperBorder,
          flexShrink: 0,
          marginTop: '5px',
        }}
      />
      <div>
        <span style={{ fontSize: '13px', color: T.body, fontWeight: 500 }}>{block.label}</span>
        {block.description && (
          <span style={{ fontSize: '12px', color: T.muted }}> — {block.description}</span>
        )}
      </div>
    </div>
  )
}

// ─── Month column ──────────────────────────────────────────────────────────────

function MonthCard({ month }: { month: MonthData }) {
  return (
    <Card
      style={{
        background: T.cardBg,
        border: `1px solid ${T.paperBorder}`,
        borderTop: `3px solid ${month.accentColor}`,
        boxShadow: 'none',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Month header */}
      <CardHeader style={{ paddingBottom: '0' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: month.accentLight,
            border: `1px solid ${month.accentColor}30`,
            borderRadius: '5px',
            padding: '3px 8px',
            marginBottom: '10px',
            width: 'fit-content',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '11px',
              fontWeight: 700,
              color: month.accentColor,
            }}
          >
            Month {month.number}
          </span>
        </div>
        <CardTitle
          style={{
            fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
            fontWeight: 700,
            fontSize: '18px',
            color: T.heading,
            letterSpacing: '-0.02em',
            marginBottom: '6px',
          }}
        >
          {month.name}
        </CardTitle>
        <p style={{ fontSize: '12.5px', color: T.muted, fontStyle: 'italic', margin: '0 0 4px' }}>
          {month.tagline}
        </p>
        <p style={{ fontSize: '13px', color: T.body, lineHeight: 1.5, margin: 0 }}>
          {month.description}
        </p>
      </CardHeader>

      <CardContent style={{ flex: 1, paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Work blocks */}
        <div>
          <p
            style={{
              fontSize: '10.5px',
              fontWeight: 600,
              color: T.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '6px',
            }}
          >
            Work blocks
          </p>
          <div>
            {month.workBlocks.map((block, i) => (
              <WorkBlockRow key={i} block={block} />
            ))}
          </div>
        </div>

        {/* Deliverables */}
        <div>
          <p
            style={{
              fontSize: '10.5px',
              fontWeight: 600,
              color: T.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '8px',
            }}
          >
            Deliverables
          </p>
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
            }}
          >
            {month.deliverables.map((d) => (
              <li key={d} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: T.body }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: month.accentColor,
                    flexShrink: 0,
                  }}
                />
                {d}
              </li>
            ))}
          </ul>
        </div>

        {/* What we ask */}
        <div>
          <p
            style={{
              fontSize: '10.5px',
              fontWeight: 600,
              color: T.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '8px',
            }}
          >
            What we ask
          </p>
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
            }}
          >
            {month.asks.map((a) => (
              <li key={a} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: T.body }}>
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
                {a}
              </li>
            ))}
          </ul>
        </div>

        {/* Milestone */}
        <div
          style={{
            marginTop: 'auto',
            padding: '12px 14px',
            background: month.accentLight,
            border: `1px solid ${month.accentColor}30`,
            borderRadius: '8px',
          }}
        >
          <p
            style={{
              fontSize: '10.5px',
              fontWeight: 600,
              color: month.accentColor,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              marginBottom: '4px',
            }}
          >
            Milestone
          </p>
          <p
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: T.heading,
              fontStyle: 'italic',
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            &ldquo;{month.milestone}&rdquo;
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── How we work principle ────────────────────────────────────────────────────

interface Principle {
  title: string
  body: string
}

const PRINCIPLES: Principle[] = [
  {
    title: 'One team, not a vendor',
    body: 'We embed with your leadership team. No ticket queues, no account managers — you talk directly to the people building the system.',
  },
  {
    title: 'Fixed-fee, no surprises',
    body: 'One flat rate for the full 3-month engagement. Every feature, every integration, every training session included.',
  },
  {
    title: 'Mission-driven',
    body: "We exist to help disability service providers run better. We understand your compliance burdens, funding cycles, and what's at stake for the people you serve.",
  },
  {
    title: 'Full visibility always',
    body: 'The MOS is yours — no vendor lock-in. We document everything and hand it over completely when the engagement closes.',
  },
]

function PrincipleCard({ principle }: { principle: Principle }) {
  return (
    <div
      style={{
        padding: '20px 22px',
        background: T.tealLight,
        border: `1px solid ${T.teal}20`,
        borderRadius: '10px',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
          fontWeight: 700,
          fontSize: '14px',
          color: T.heading,
          marginBottom: '7px',
        }}
      >
        {principle.title}
      </p>
      <p style={{ fontSize: '13px', color: T.mutedDark, lineHeight: 1.55, margin: 0 }}>
        {principle.body}
      </p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ImplementationPage() {
  return (
    <div style={{ maxWidth: '1100px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Page header */}
      <div>
        <p
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: T.teal,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '8px',
          }}
        >
          The S360 Path
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
            fontWeight: 700,
            fontSize: '28px',
            color: T.heading,
            letterSpacing: '-0.02em',
            marginBottom: '8px',
          }}
        >
          From demo to operating system in 90 days.
        </h1>
        <p style={{ fontSize: '14px', color: T.muted, maxWidth: '560px', lineHeight: 1.55 }}>
          A structured 3-month engagement where we build, validate, and hand over a Management
          Operating System tailored to BrightPath — no templates, no guesswork.
        </p>
      </div>

      {/* 3-column month grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          alignItems: 'start',
        }}
      >
        {MONTHS.map((month) => (
          <MonthCard key={month.number} month={month} />
        ))}
      </div>

      {/* How we work */}
      <div>
        <h2
          style={{
            fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
            fontWeight: 700,
            fontSize: '18px',
            color: T.heading,
            letterSpacing: '-0.01em',
            marginBottom: '16px',
          }}
        >
          How we work
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
          }}
        >
          {PRINCIPLES.map((p) => (
            <PrincipleCard key={p.title} principle={p} />
          ))}
        </div>
      </div>

      {/* Dark CTA section */}
      <div
        style={{
          background: T.dark,
          borderRadius: '14px',
          padding: '44px 48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          textAlign: 'center',
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: '24px',
              color: '#F5F1EA',
              letterSpacing: '-0.02em',
              marginBottom: '8px',
            }}
          >
            Ready to start?
          </h2>
          <p style={{ fontSize: '14px', color: '#A8A49C', maxWidth: '400px', lineHeight: 1.55, margin: '0 auto' }}>
            Book a 45-minute discovery call. We&apos;ll map your current data landscape and show you
            what your MOS would look like with real BrightPath data.
          </p>
        </div>
        <button
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: T.teal,
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.background = T.tealDark
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.background = T.teal
          }}
        >
          Book a discovery call
          <span style={{ fontSize: '16px' }}>→</span>
        </button>
      </div>
    </div>
  )
}

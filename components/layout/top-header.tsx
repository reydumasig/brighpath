'use client'

import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface ConnectedSource {
  monogram: string
  name: string
  color: string
  textColor: string
  status: 'live' | 'syncing' | 'error' | 'idle'
  lastSync: string
}

const SOURCES: ConnectedSource[] = [
  { monogram: 'Z', name: 'Zoho CRM', color: '#0F9D9D', textColor: '#fff', status: 'live', lastSync: 'Just now' },
  { monogram: 'T', name: 'Therap', color: '#7B5EA7', textColor: '#fff', status: 'live', lastSync: '2 min ago' },
  { monogram: '$', name: 'QuickBooks', color: '#2CA01C', textColor: '#fff', status: 'live', lastSync: '5 min ago' },
  { monogram: 'W', name: 'When I Work', color: '#1E88E5', textColor: '#fff', status: 'syncing', lastSync: 'Syncing…' },
  { monogram: 'J', name: 'JazzHR', color: '#E8560A', textColor: '#fff', status: 'live', lastSync: '12 min ago' },
  { monogram: 'D', name: 'DocuSign', color: '#D4A017', textColor: '#fff', status: 'idle', lastSync: '1 hr ago' },
]

function StatusDot({ status }: { status: ConnectedSource['status'] }) {
  const colors: Record<ConnectedSource['status'], string> = {
    live: '#6B8770',
    syncing: '#C8841C',
    error: '#B8553A',
    idle: '#9C9A93',
  }

  return (
    <span
      style={{
        display: 'inline-block',
        width: '7px',
        height: '7px',
        borderRadius: '50%',
        background: colors[status],
        animation: status === 'live' ? 'mos-pulse 2s ease-in-out infinite' : 'none',
        flexShrink: 0,
      }}
    />
  )
}

function ConnectedSourcesDots() {
  return (
    <Popover>
      <PopoverTrigger>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '4px 6px',
            borderRadius: '6px',
            transition: 'background 0.1s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = '#F0EAE0')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = 'transparent')}
          title="Connected data sources"
        >
          {SOURCES.map((src, i) => (
            <div
              key={src.monogram}
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: src.color,
                color: src.textColor,
                fontSize: '9px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid rgba(255,255,255,0.85)',
                marginLeft: i === 0 ? 0 : '-6px',
                zIndex: SOURCES.length - i,
                position: 'relative',
                letterSpacing: '0.02em',
              }}
            >
              {src.monogram}
            </div>
          ))}
        </div>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="end"
        sideOffset={8}
      >
        <div style={{ padding: '2px 0' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#9C9A93',
              padding: '0 4px 8px',
            }}
          >
            Connected Sources
          </div>
          {SOURCES.map((src) => (
            <div
              key={src.monogram}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 4px',
                borderRadius: '4px',
              }}
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  background: src.color,
                  color: src.textColor,
                  fontSize: '10px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {src.monogram}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '12.5px', fontWeight: 500, color: '#1F2024' }}>{src.name}</div>
                <div style={{ fontSize: '11px', color: '#9C9A93' }}>{src.lastSync}</div>
              </div>
              <StatusDot status={src.status} />
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface TopHeaderProps {
  title: string
  subtitle?: string
}

export function TopHeader({ title, subtitle }: TopHeaderProps) {
  return (
    <>
      <style>{`
        @keyframes mos-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
      `}</style>
      <header
        style={{
          height: '60px',
          position: 'sticky',
          top: 0,
          zIndex: 30,
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E5DFD3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          flexShrink: 0,
        }}
      >
        {/* Left: breadcrumb + title */}
        <div>
          <div
            style={{
              fontSize: '11px',
              color: '#9C9A93',
              letterSpacing: '0.04em',
              marginBottom: '1px',
            }}
          >
            BrightPath
            <span style={{ margin: '0 5px', color: '#C8C4BC' }}>/</span>
            <span style={{ color: '#6B6A66' }}>{title}</span>
          </div>
          {subtitle && (
            <div style={{ fontSize: '11.5px', color: '#9C9A93' }}>{subtitle}</div>
          )}
        </div>

        {/* Right: connected sources + divider + logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ConnectedSourcesDots />

          <div style={{ width: '1px', height: '28px', background: '#E5DFD3' }} />

          {/* Logo mark */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #2A7F8F 0%, #C8841C 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                color: '#fff',
              }}
            >
              ◉
            </div>
            <span
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: '13px',
                color: '#1A1A1A',
                letterSpacing: '-0.01em',
              }}
            >
              BrightPath
            </span>
          </div>
        </div>
      </header>
    </>
  )
}

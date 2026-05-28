'use client'

import React, { useState } from 'react'
import Link from 'next/link'

interface NavItem {
  label: string
  href: string
  icon: string
  badge?: string
  children?: NavItem[]
}

interface NavSection {
  section: string
  items: NavItem[]
}

const NAV: NavSection[] = [
  {
    section: 'Overview',
    items: [
      { label: 'Executive', href: '/dashboard/exec', icon: '◐' },
    ],
  },
  {
    section: 'Departments',
    items: [
      {
        label: 'Services',
        href: '/dashboard/dept/services',
        icon: '▦',
        children: [
          { label: 'Residential', href: '/dashboard/dept/residential', icon: '▣' },
          { label: 'UBS', href: '/dashboard/dept/ubs', icon: '◫' },
        ],
      },
      { label: 'QA & Training', href: '/dashboard/dept/qat', icon: '✦' },
      { label: 'HR', href: '/dashboard/dept/hr', icon: '◉' },
      { label: 'Finance', href: '/dashboard/dept/finance', icon: '≣' },
      { label: 'Dev & Acct Mgmt', href: '/dashboard/dept/dam', icon: '◆' },
    ],
  },
  {
    section: 'Cross-functional',
    items: [
      { label: 'Operations', href: '/dashboard/operations', icon: '❖' },
    ],
  },
  {
    section: 'Custom Modules',
    items: [
      { label: 'Intake Builder', href: '/dashboard/intake', icon: '⊞', badge: 'Phase 2' },
    ],
  },
]

interface SidebarProps {
  activePath: string
  user?: { name: string; email: string; initials: string } | null
}

function isActive(href: string, activePath: string): boolean {
  return activePath === href || activePath.startsWith(href + '/')
}

interface NavItemRowProps {
  item: NavItem
  activePath: string
  depth?: number
}

function NavItemRow({ item, activePath, depth = 0 }: NavItemRowProps) {
  const [open, setOpen] = useState(() => {
    if (!item.children) return false
    return item.children.some((c) => isActive(c.href, activePath)) || isActive(item.href, activePath)
  })
  const active = isActive(item.href, activePath)

  const rowStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: depth === 0 ? '6px 12px' : '5px 12px 5px 28px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13.5px',
    fontWeight: active ? 600 : 400,
    color: active ? '#F5F1EA' : '#A8A49C',
    background: active ? '#232323' : 'transparent',
    borderLeft: active ? '2px solid #2A7F8F' : '2px solid transparent',
    textDecoration: 'none',
    transition: 'background 0.1s, color 0.1s',
    userSelect: 'none',
    marginBottom: '1px',
  }

  if (item.children) {
    return (
      <>
        <div
          style={rowStyles}
          onClick={() => setOpen((o) => !o)}
          onMouseEnter={(e) => {
            if (!active) {
              ;(e.currentTarget as HTMLDivElement).style.background = '#232323'
              ;(e.currentTarget as HTMLDivElement).style.color = '#F5F1EA'
            }
          }}
          onMouseLeave={(e) => {
            if (!active) {
              ;(e.currentTarget as HTMLDivElement).style.background = 'transparent'
              ;(e.currentTarget as HTMLDivElement).style.color = '#A8A49C'
            }
          }}
        >
          <span style={{ fontSize: '12px', width: '14px', textAlign: 'center', flexShrink: 0 }}>
            {item.icon}
          </span>
          <span style={{ flex: 1 }}>{item.label}</span>
          {item.badge && (
            <span className="phase2-badge" style={{ fontSize: '9px', padding: '1px 5px' }}>
              P2
            </span>
          )}
          <span
            style={{
              fontSize: '10px',
              color: '#6E6C66',
              transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.15s',
              marginLeft: '2px',
            }}
          >
            ▶
          </span>
        </div>
        {open && item.children.map((child) => (
          <NavItemRow key={child.href} item={child} activePath={activePath} depth={depth + 1} />
        ))}
      </>
    )
  }

  return (
    <Link
      href={item.href}
      style={rowStyles}
      onMouseEnter={(e) => {
        if (!active) {
          ;(e.currentTarget as HTMLAnchorElement).style.background = '#232323'
          ;(e.currentTarget as HTMLAnchorElement).style.color = '#F5F1EA'
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          ;(e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
          ;(e.currentTarget as HTMLAnchorElement).style.color = '#A8A49C'
        }
      }}
    >
      <span style={{ fontSize: '12px', width: '14px', textAlign: 'center', flexShrink: 0 }}>
        {item.icon}
      </span>
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.badge && (
        <span className="phase2-badge" style={{ fontSize: '9px', padding: '1px 5px' }}>
          P2
        </span>
      )}
    </Link>
  )
}

export function Sidebar({ activePath, user }: SidebarProps) {
  const displayName = user?.name ?? 'BrightPath User'
  const initials = user?.initials ?? 'BP'
  const role = user?.email ? 'Admin' : 'Guest'

  return (
    <aside
      style={{
        width: '248px',
        minWidth: '248px',
        height: '100vh',
        background: '#1A1A1A',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRight: '1px solid #2A2A2A',
        flexShrink: 0,
      }}
    >
      {/* Logo area */}
      <div
        style={{
          padding: '20px 16px 16px',
          borderBottom: '1px solid #2A2A2A',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #2A7F8F 0%, #C8841C 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            flexShrink: 0,
          }}
        >
          ◉
        </div>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: '15px',
              color: '#F5F1EA',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}
          >
            BrightPath
          </div>
          <div style={{ fontSize: '10px', color: '#6E6C66', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            MOS
          </div>
        </div>
      </div>

      {/* Nav sections */}
      <nav
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 8px',
          scrollbarWidth: 'none',
        }}
      >
        {NAV.map((section) => (
          <div key={section.section} style={{ marginBottom: '8px' }}>
            <div
              style={{
                fontSize: '10.5px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: '#6E6C66',
                margin: '14px 4px 6px',
                fontWeight: 500,
              }}
            >
              {section.section}
            </div>
            {section.items.map((item) => (
              <NavItemRow key={item.href} item={item} activePath={activePath} />
            ))}
          </div>
        ))}
      </nav>

      {/* S360 Path CTA */}
      <div style={{ padding: '8px 10px 10px' }}>
        <Link
          href="/dashboard/implementation"
          style={{
            display: 'block',
            padding: '12px 14px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #1F5F6B 0%, #2A7F8F 100%)',
            textDecoration: 'none',
            marginBottom: '10px',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#E6EFF1', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            The S360 Path
          </div>
          <div style={{ fontSize: '12px', color: '#A8D4DA', marginTop: '3px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>From Demo to OS</span>
            <span style={{ fontSize: '14px' }}>→</span>
          </div>
        </Link>

        {/* User section */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 6px',
            borderRadius: '6px',
            cursor: 'default',
          }}
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: '#2A7F8F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 700,
              color: '#F5F1EA',
              flexShrink: 0,
              letterSpacing: '0.02em',
            }}
          >
            {initials}
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div
              style={{
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#C8C4BC',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {displayName}
            </div>
            <div style={{ fontSize: '11px', color: '#6E6C66' }}>{role}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

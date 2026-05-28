'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { TopHeader } from '@/components/layout/top-header'

function getPageMeta(pathname: string): { title: string; subtitle?: string } {
  if (pathname.startsWith('/dashboard/exec')) return { title: 'Executive', subtitle: 'Company-wide KPIs & health' }
  if (pathname.startsWith('/dashboard/dept/residential')) return { title: 'Residential', subtitle: 'Residential services department' }
  if (pathname.startsWith('/dashboard/dept/ubs')) return { title: 'UBS', subtitle: 'Unique Behavioral Services' }
  if (pathname.startsWith('/dashboard/dept/services')) return { title: 'Services', subtitle: 'Services department overview' }
  if (pathname.startsWith('/dashboard/dept/qat')) return { title: 'QA & Training', subtitle: 'Quality assurance & staff training' }
  if (pathname.startsWith('/dashboard/dept/hr')) return { title: 'HR', subtitle: 'Human resources' }
  if (pathname.startsWith('/dashboard/dept/finance')) return { title: 'Finance', subtitle: 'Financial operations' }
  if (pathname.startsWith('/dashboard/dept/dam')) return { title: 'Dev & Acct Mgmt', subtitle: 'Development & account management' }
  if (pathname.startsWith('/dashboard/operations')) return { title: 'Operations', subtitle: 'Cross-functional operations' }
  if (pathname.startsWith('/dashboard/intake')) return { title: 'Intake Builder', subtitle: 'Build and manage intake workflows' }
  if (pathname.startsWith('/dashboard/implementation')) return { title: 'The S360 Path', subtitle: 'Implementation roadmap' }
  return { title: 'BrightPath MOS' }
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [user, setUser] = useState<{ name: string; email: string; initials: string } | null>(null)
  const { title, subtitle } = getPageMeta(pathname)

  useEffect(() => {
    async function loadUser() {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data } = await supabase.auth.getUser()
        if (data.user) {
          const email = data.user.email ?? ''
          const fullName =
            (data.user.user_metadata?.full_name as string) ||
            (data.user.user_metadata?.name as string) ||
            email
          const parts = fullName.trim().split(' ')
          const initials =
            parts.length >= 2
              ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
              : fullName.slice(0, 2).toUpperCase()
          setUser({ name: fullName, email, initials })
        }
      } catch {
        // not authenticated — layout still renders
      }
    }
    loadUser()
  }, [])

  return (
    <div style={{ height: '100vh', display: 'flex', overflow: 'hidden' }}>
      <Sidebar activePath={pathname} user={user} />
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <TopHeader title={title} subtitle={subtitle} />
        <div
          className="mos-content"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '28px 32px',
          }}
        >
          {children}
        </div>
      </main>
    </div>
  )
}

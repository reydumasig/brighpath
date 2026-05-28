import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard/exec'

  if (code) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`)
      }
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(error.message)}`
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed'
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(message)}`
      )
    }
  }

  // No code param — redirect to login with a generic error
  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent('Missing authorization code')}`
  )
}

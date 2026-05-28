'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGoogleSignIn() {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (authError) {
        setError(authError.message)
        setLoading(false)
      }
      // On success, the browser will redirect to Google — no further action needed.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0D1117',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
      }}
    >
      {/* Background gradient orb */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(42,127,143,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Login card */}
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          background: 'rgba(26,26,26,0.95)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '40px 36px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo mark */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #2A7F8F 0%, #C8841C 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              color: '#fff',
              boxShadow: '0 4px 20px rgba(42,127,143,0.35)',
            }}
          >
            ◉
          </div>
          <div
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: '22px',
              color: '#F5F1EA',
              letterSpacing: '-0.02em',
            }}
          >
            BrightPath
          </div>
        </div>

        {/* Heading */}
        <div style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: '18px',
              color: '#F5F1EA',
              letterSpacing: '-0.01em',
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            Sign in to BrightPath MOS
          </h1>
          <p
            style={{
              fontSize: '13.5px',
              color: '#6E6C66',
              marginTop: '8px',
            }}
          >
            Management Operating System
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(184,85,58,0.15)',
              border: '1px solid rgba(184,85,58,0.3)',
              fontSize: '13px',
              color: '#E07A5F',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        {/* Google sign-in button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '12px 20px',
            borderRadius: '10px',
            background: loading ? 'rgba(245,241,234,0.05)' : 'rgba(245,241,234,0.08)',
            border: '1px solid rgba(245,241,234,0.15)',
            color: loading ? '#6E6C66' : '#F5F1EA',
            fontSize: '14.5px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s, border-color 0.15s',
            letterSpacing: '0.01em',
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,241,234,0.13)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,241,234,0.25)'
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,241,234,0.08)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,241,234,0.15)'
            }
          }}
        >
          {/* Google G icon */}
          {!loading ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.20455C17.64 8.56637 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
              <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
              <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
              <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
            </svg>
          ) : (
            <span style={{ fontSize: '14px' }}>⟳</span>
          )}
          {loading ? 'Redirecting…' : 'Continue with Google'}
        </button>

        <div
          style={{
            height: '1px',
            background: 'rgba(255,255,255,0.06)',
            width: '100%',
          }}
        />

        {/* Footer */}
        <p
          style={{
            fontSize: '12px',
            color: '#4A4845',
            margin: 0,
            letterSpacing: '0.02em',
          }}
        >
          Powered by{' '}
          <span style={{ color: '#6E6C66', fontWeight: 600 }}>Summit 360</span>
        </p>
      </div>
    </div>
  )
}

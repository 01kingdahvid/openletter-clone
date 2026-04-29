'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function VerifyPage () {
  const supabase = createClient()
  const router = useRouter()

  const [status, setStatus] = useState('Verifying your email...')

  useEffect(() => {
    const verifySession = async () => {
      try {
        const hash = window.location.hash
        if (!hash) {
          router.replace('/dashboard')
          return
        }

        const params = new URLSearchParams(hash.replace('#', ''))
        const access_token = params.get('access_token')
        const refresh_token = params.get('refresh_token')

        if (!access_token || !refresh_token) {
          setStatus('Verification link is invalid or expired.')
          setTimeout(() => router.replace('/'), 2000)
          return
        }

        const { error: sessionError } = await supabase.auth.setSession({
          access_token,
          refresh_token
        })

        if (sessionError) {
          setStatus(sessionError.message)
          setTimeout(() => router.replace('/'), 2000)
          return
        }

        const {
          data: { user },
          error: userError
        } = await supabase.auth.getUser()
        if (userError || !user) {
          await supabase.auth.signOut()
          setStatus('User not found. Please login again.')
          setTimeout(() => router.replace('/'), 2000)
          return
        }

        // Upsert profile and update signatures
        await supabase.from('profiles').upsert({
          id: user.id,
          email: user.email,
          full_name:
            user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
        })

        await supabase
          .from('signatures')
          .update({ verified: true, user_id: user.id })
          .eq('email', user.email)
          .eq('verified', false)

        // Clear the hash from the URL
        window.history.replaceState({}, document.title, '/verify')

        // Redirect immediately
        setStatus('Verification successful. Redirecting...')
        router.replace('/dashboard')
      } catch (err) {
        console.error(err)
        setStatus('Something went wrong during verification.')
        setTimeout(() => router.replace('/'), 2000)
      }
    }

    verifySession()
  }, [])

  return (
    <main
      style={{
        minHeight: '60vh',
        display: 'grid',
        placeItems: 'center',
        padding: '2rem',
        textAlign: 'center'
      }}
    >
      <div>
        <h1>Email Verification</h1>
        <p>{status}</p>
      </div>
    </main>
  )
}

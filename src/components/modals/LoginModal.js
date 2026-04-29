'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import styles from './LoginModal.module.css'

export default function LoginModal({ onClose }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const supabase = createClient()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/verify`,
        shouldCreateUser: true
      }
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }

    setLoading(false)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={styles.close}
          onClick={onClose}
        >
          ×
        </button>

        {!sent ? (
          <>
            <h2 className={styles.title}>Login</h2>

            <p className={styles.sub}>
              Enter your email and we’ll send a secure magic link.
            </p>

            <form
              onSubmit={handleSubmit}
              className={styles.form}
            >
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={styles.input}
              />

              {error && (
                <p className={styles.error}>{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className={styles.btn}
              >
                {loading ? 'Sending...' : 'Send Magic Link'}
              </button>
            </form>
          </>
        ) : (
          <>
          <div className={styles.checkmark}>✓</div>
            <h2 className={styles.title}>
              Check your inbox
            </h2>

            <p className={styles.sub}>
              We sent a secure login link to:
              <br />
              <strong>{email}</strong>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
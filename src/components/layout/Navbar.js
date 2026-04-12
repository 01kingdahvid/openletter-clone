'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_, session) => {
        setUser(session?.user ?? null)
      })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setShowModal(false)
    router.push('/')
  }

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'User'

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>

        {/* LOGO */}
        <Link href="/" className={styles.logo}>
          openletter<span>.mars</span>
        </Link>

        {/* RIGHT SIDE */}
        <div className={styles.right}>

          <div className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>

            {!user && (
              <Link href="/login" className={styles.login}>
                Login
              </Link>
            )}

            {user && (
              <button
                className={styles.userBtn}
                onClick={() => setShowModal(!showModal)}
              >
                <span className={styles.avatar}>
                  {firstName.charAt(0)}
                </span>
                {firstName}
              </button>
            )}
          </div>


           {!user && (
              <Link href="/login" className={styles.log}>
                Login
              </Link>
            )}

          {/* HAMBURGER */}
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* USER MODAL */}
      {showModal && user && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>{user.user_metadata?.full_name}</h3>
            <p>{user.email}</p>
            <p className={styles.muted}>No additional information provided</p>

            <div className={styles.divider} />

            <p className={styles.link}>Connect X to boost verification</p>
            <p className={styles.link}>Edit / add more</p>

            <div className={styles.divider} />

            <p className={styles.level}>Level 1 Evaluator</p>
            <p className={styles.progress}>
              91 signatures until next level
            </p>

            <button onClick={handleSignOut} className={styles.signOut}>
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
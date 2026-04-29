'use client'

import Link from 'next/link'
import { useState } from 'react'
import styles from './LetterCard.module.css'
import SignatureForm from '@/components/letter/SignatureForm'
import { useRealtimeSignatures } from '@/hooks/useRealtimeSignatures'

export default function LetterCardClient({
  letterId,
  letterSlug,
  letterTitle,
  letterSubtitle,
  displayDate,
  signatureCount: initialCount,
  recentSigners: initialRecent,
  contextExcerpt,
}) {
  const [open, setOpen] = useState(false)

  // initialRecent comes in as a joined string from the server e.g. "Alice and Bob"
  // The hook expects an array, so split it back out (or pass [] if empty)
  const initialRecentArray = initialRecent
    ? initialRecent.split(' and ').filter(Boolean)
    : []

  const { totalSignatures, recentSigners } = useRealtimeSignatures(
    letterId,
    initialCount,
    initialRecentArray
  )

  // recentSigners is always an array from the hook
  const recentLine =
    recentSigners.length > 0 ? `${recentSigners.join(' and ')} have signed` : ''

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <Link href={`/letter/${letterSlug}`} className={styles.title}>
          {letterTitle}
        </Link>

        <p className={styles.subtitle}>{letterSubtitle}</p>
        <p className={styles.date}>{displayDate}</p>

        <div className={styles.signatureRow}>
          <div className={styles.signatureInfo}>
            <p className={styles.count}>
              {totalSignatures.toLocaleString()} signatures
            </p>
            <div className={styles.verified}>✔ Verified</div>
            {recentLine && (
              <p className={styles.recent}>{recentLine}</p>
            )}
          </div>
          <button className={styles.signBtn} onClick={() => setOpen(true)}>
            Sign this letter
          </button>
        </div>

        <div className={styles.context}>
          <p>
            <b>Context</b>: {contextExcerpt}
          </p>
          <div className={styles.fade}></div>
        </div>

        <Link href={`/letter/${letterSlug}`} className={styles.readMore}>
          Continue reading →
        </Link>
      </div>

      {open && (
        <SignatureForm
          open={open}
          onClose={() => setOpen(false)}
          letterId={letterId}
        />
      )}
    </div>
  )
}
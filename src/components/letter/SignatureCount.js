'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import styles from './SignatureCount.module.css'

export default function SignatureCount({ initial, lastSigners }) {
  const [count, setCount] = useState(initial)
  const [signers, setSigners] = useState(lastSigners)
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('signatures-count')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'signatures', filter: 'verified=eq.true' }, async () => {
        const { count: newCount } = await supabase
          .from('signatures')
          .select('*', { count: 'exact', head: true })
          .eq('verified', true)

        const { data: recent } = await supabase
          .from('signatures')
          .select('full_name')
          .eq('verified', true)
          .order('created_at', { ascending: false })
          .limit(3)

        setCount(newCount)
        setSigners(recent || [])
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.countBlock}>
        <span className={styles.number}>{count?.toLocaleString() ?? 0}</span>
        <span className={styles.label}>signatures</span>
      </div>
      {signers?.length > 0 && (
        <p className={styles.recent}>
          Recently signed by{' '}
          {signers.map((s, i) => (
            <span key={i}>
              <strong>{s.full_name}</strong>
              {i < signers.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
      )}
      <div className={styles.progress}>
        <div className={styles.bar} style={{ width: `${Math.min((count / 10000) * 100, 100)}%` }} />
      </div>
      <p className={styles.goal}>Goal: 10,000 signatures</p>
    </div>
  )
}
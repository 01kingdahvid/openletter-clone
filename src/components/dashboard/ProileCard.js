'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import LevelBadge from './LevelBadge'
import styles from './ProfileCard.module.css'

export default function ProfileCard({ user, profile, signature }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    twitter: profile?.twitter || '',
    linkedin: profile?.linkedin || '',
    facebook: profile?.facebook || '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const supabase = createClient()

  const handleSave = async () => {
    setSaving(true)
    await supabase.from('profiles').update(form).eq('id', user.id)
    setSaving(false)
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 3000)
  }

  // Level logic
  const getLevel = () => {
    if (!signature?.verified) return 1
    if (profile?.twitter || profile?.linkedin || profile?.facebook) return 3
    return 2
  }

  const level = getLevel()

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.top}>
            <div className={styles.avatarBlock}>
              <div className={styles.avatar}>
                {(profile?.full_name || user.email).charAt(0).toUpperCase()}
              </div>
              <LevelBadge level={level} />
            </div>
            <div className={styles.info}>
              <h1 className={styles.name}>{profile?.full_name || 'Your Name'}</h1>
              <p className={styles.email}>{user.email}</p>
              <p className={styles.status}>
                {signature?.verified
                  ? '✓ Signature verified'
                  : '⏳ Signature pending verification'}
              </p>
            </div>
          </div>

          <div className={styles.details}>
            {signature && (
              <div className={styles.sigInfo}>
                <h3>Your signature details</h3>
                <p>{[signature.job_title, signature.organization, signature.country].filter(Boolean).join(' · ')}</p>
              </div>
            )}
          </div>

          <div className={styles.social}>
            <div className={styles.socialHeader}>
              <h3>Social profiles <span className={styles.boost}>Boost to Level 3</span></h3>
            </div>
            {editing ? (
              <div className={styles.editForm}>
                {['twitter','linkedin','facebook'].map(field => (
                  <div key={field} className={styles.editRow}>
                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    <input
                      type="url"
                      placeholder={`https://${field}.com/yourhandle`}
                      value={form[field]}
                      onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                    />
                  </div>
                ))}
                <div className={styles.editActions}>
                  <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button className={styles.cancelBtn} onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className={styles.socialLinks}>
                {['twitter','linkedin','facebook'].map(field => (
                  <div key={field} className={styles.socialRow}>
                    <span className={styles.socialLabel}>{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                    {profile?.[field]
                      ? <a href={profile[field]} target="_blank" rel="noopener noreferrer">{profile[field]}</a>
                      : <span className={styles.notSet}>Not set</span>}
                  </div>
                ))}
                <button className={styles.editBtn} onClick={() => setEditing(true)}>Edit profile</button>
              </div>
            )}
          </div>

          {saved && <p className={styles.savedMsg}>✓ Profile saved</p>}
        </div>
      </div>
    </div>
  )
}
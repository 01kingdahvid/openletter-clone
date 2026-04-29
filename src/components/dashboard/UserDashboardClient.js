'use client'
import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const LEVEL_LABELS = [
  '',
  'Evaluator',
  'Trusted Evaluator',
  'Senior Evaluator',
  'Expert Evaluator',
  'Master Evaluator'
]
const LEVEL_THRESHOLDS = [0, 10, 50, 100, 200]

export default function UserDashboardClient ({
  user,
  profile: initProfile,
  signatures,
  socialVerifications,
  reviewCount
}) {
  const [profile, setProfile] = useState(initProfile)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    full_name: initProfile?.full_name ?? '',
    bio: initProfile?.bio ?? '',
    country: initProfile?.country ?? '',
    twitter: initProfile?.twitter ?? '',
    instagram: initProfile?.instagram ?? '',
    facebook: initProfile?.facebook ?? '',
    linkedin: initProfile?.linkedin ?? ''
  })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)
  const supabase = createClient()

  const currentLevel = profile?.level ?? 1
  const nextThreshold = LEVEL_THRESHOLDS[currentLevel] ?? 200
  const reviewsToNext = Math.max(0, nextThreshold - reviewCount)

  async function saveProfile () {
    setSaving(true)
    const { data, error } = await supabase
      .from('profiles')
      .update(form)
      .eq('id', user.id)
      .select()
      .single()
    if (!error) {
      setProfile(data)
      setEditing(false)
      setMsg('Profile saved.')
      setTimeout(() => setMsg(null), 2500)
    }
    setSaving(false)
  }

  return (
    <main
      style={{ maxWidth: '740px', margin: '0 auto', padding: '2rem 1.25rem' }}
    >
      <h1
        style={{ fontWeight: 500, fontSize: '1.5rem', marginBottom: '0.25rem' }}
      >
        My profile
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
        Level {currentLevel} — {LEVEL_LABELS[currentLevel]}
        {reviewsToNext > 0 &&
          ` · ${reviewsToNext} reviews to level ${currentLevel + 1}`}
      </p>

      {/* Trust score bar */}
      <div
        style={{
          marginBottom: '2rem',
          padding: '1rem 1.25rem',
          background: 'var(--color-background-secondary)',
          borderRadius: '12px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem'
          }}
        >
          <span style={{ fontWeight: 500 }}>Trust score</span>
          <span style={{ fontWeight: 500 }}>
            {(profile?.trust_score ?? 0).toFixed(1)} / 100
          </span>
        </div>
        <div
          style={{
            height: 6,
            borderRadius: 3,
            background: 'var(--color-border-tertiary)'
          }}
        >
          <div
            style={{
              height: 6,
              borderRadius: 3,
              background: 'var(--color-text-success)',
              width: `${profile?.trust_score ?? 0}%`,
              transition: 'width 0.4s'
            }}
          />
        </div>
        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--color-text-tertiary)',
            margin: '0.5rem 0 0'
          }}
        >
          Improved by peer reviews and verified social accounts
        </p>
      </div>

      {/* Verified social accounts */}
      <div style={{ marginBottom: '2rem' }}>
        <h2
          style={{
            fontWeight: 500,
            fontSize: '1.1rem',
            marginBottom: '0.75rem'
          }}
        >
          Verified social accounts
        </h2>
        {['twitter', 'instagram', 'facebook', 'linkedin'].map(platform => {
          const sv = socialVerifications.find(s => s.platform === platform)
          return (
            <div
              key={platform}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.6rem 0',
                borderBottom: '1px solid var(--color-border-tertiary)'
              }}
            >
              <span
                style={{
                  width: 80,
                  textTransform: 'capitalize',
                  fontSize: '0.9rem'
                }}
              >
                {platform}
              </span>
              {sv ? (
                <span
                  style={{
                    color: 'var(--color-text-success)',
                    fontSize: '0.875rem'
                  }}
                >
                  ✓ @{sv.handle} verified · +{platform === 'twitter' ? 15 : 10}
                  pts
                </span>
              ) : (
                <span
                  style={{
                    color: 'var(--color-text-tertiary)',
                    fontSize: '0.875rem'
                  }}
                >
                  Not connected — +10–15 trust pts
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Profile edit */}
      <div style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem'
          }}
        >
          <h2 style={{ fontWeight: 500, fontSize: '1.1rem', margin: 0 }}>
            Profile details
          </h2>
          {!editing && (
            <button onClick={() => setEditing(true)} style={ghostBtn}>
              Edit
            </button>
          )}
        </div>

        {!editing ? (
          <dl
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr',
              gap: '0.5rem 1rem',
              fontSize: '0.9rem'
            }}
          >
            {[
              ['Name', profile?.full_name],
              ['Country', profile?.country],
              ['Bio', profile?.bio],
              ['Twitter', profile?.twitter],
              ['Instagram', profile?.instagram],
              ['Facebook', profile?.facebook],
              ['LinkedIn', profile?.linkedin]
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <React.Fragment key={k}>
                  <dt style={{ color: 'var(--color-text-secondary)' }}>{k}</dt>
                  <dd style={{ margin: 0 }}>{v}</dd>
                </React.Fragment>
              ))}
          </dl>
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {[
              ['full_name', 'Full name', 'text'],
              ['bio', 'Bio', 'text'],
              ['country', 'Country', 'text'],
              ['twitter', 'Twitter / X handle', 'text'],
              ['instagram', 'Instagram handle', 'text'],
              ['facebook', 'Facebook URL', 'text'],
              ['linkedin', 'LinkedIn URL', 'text']
            ].map(([key, label]) => (
              <div key={key}>
                <label
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--color-text-secondary)'
                  }}
                >
                  {label}
                </label>
                <input
                  value={form[key]}
                  onChange={e =>
                    setForm(f => ({ ...f, [key]: e.target.value }))
                  }
                  style={{
                    display: 'block',
                    width: '100%',
                    marginTop: '0.2rem',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid var(--color-border-secondary)',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    background: 'var(--color-background-secondary)',
                    color: 'var(--color-text-primary)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            ))}
            {msg && (
              <p
                style={{
                  color: 'var(--color-text-success)',
                  fontSize: '0.85rem',
                  margin: 0
                }}
              >
                {msg}
              </p>
            )}
            <div
              style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}
            >
              <button
                onClick={saveProfile}
                disabled={saving}
                style={primaryBtn}
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button onClick={() => setEditing(false)} style={ghostBtn}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Signed letters */}
      <div>
        <h2
          style={{
            fontWeight: 500,
            fontSize: '1.1rem',
            marginBottom: '0.75rem'
          }}
        >
          Letters you signed
        </h2>
        {signatures.length === 0 && (
          <p
            style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}
          >
            No signatures yet.
          </p>
        )}
        {signatures.map(sig => (
          <div
            key={sig.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 0',
              borderBottom: '1px solid var(--color-border-tertiary)'
            }}
          >
            <span style={{ flex: 1 }}>
              {sig.letters?.title ?? 'Unknown letter'}
            </span>
            {sig.verified ? (
              <span
                style={{
                  color: 'var(--color-text-success)',
                  fontSize: '0.8rem'
                }}
              >
                ✓ Verified
              </span>
            ) : (
              <span
                style={{
                  color: 'var(--color-text-tertiary)',
                  fontSize: '0.8rem'
                }}
              >
                Pending verification
              </span>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}

const primaryBtn = {
  padding: '0.55rem 1.25rem',
  background: 'var(--color-text-primary)',
  color: 'var(--color-background-primary)',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 500,
  cursor: 'pointer',
  fontSize: '0.875rem'
}
const ghostBtn = {
  padding: '0.5rem 1rem',
  background: 'transparent',
  color: 'var(--color-text-primary)',
  border: '1px solid var(--color-border-secondary)',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.875rem'
}

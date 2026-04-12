'use client'
import { useState } from 'react'
import AlmostDoneModal from '@/components/modals/AlmostDoneModal'
import styles from './SignatureForm.module.css'

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Argentina','Australia','Austria','Bangladesh',
  'Belgium','Brazil','Canada','Chile','China','Colombia','Croatia','Czech Republic',
  'Denmark','Egypt','Ethiopia','Finland','France','Germany','Ghana','Greece',
  'Hungary','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy',
  'Japan','Jordan','Kenya','Malaysia','Mexico','Morocco','Netherlands','New Zealand',
  'Nigeria','Norway','Pakistan','Peru','Philippines','Poland','Portugal','Romania',
  'Russia','Saudi Arabia','Senegal','Singapore','South Africa','South Korea','Spain',
  'Sri Lanka','Sweden','Switzerland','Tanzania','Thailand','Turkey','Uganda',
  'Ukraine','United Kingdom','United States','Vietnam','Zimbabwe'
].sort()

export default function SignatureForm() {
  const [form, setForm] = useState({
    full_name: '', email: '', gender: '',
    job_title: '', organization: '', honors: '', country: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Something went wrong.')
      return
    }

    setSubmittedEmail(form.email)
    setShowModal(true)
  }

  return (
    <>
      <div className={styles.card} id="sign">
        <h2 className={styles.heading}>Add your signature</h2>
        <p className={styles.sub}>Your voice matters. Join thousands who have already signed.</p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="full_name">Full name <span className={styles.req}>*</span></label>
              <input
                id="full_name" name="full_name" type="text"
                value={form.full_name} onChange={handleChange}
                placeholder="Jane Smith" required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="email">Email <span className={styles.req}>*</span></label>
              <input
                id="email" name="email" type="email"
                value={form.email} onChange={handleChange}
                placeholder="jane@example.com" required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="gender">Gender <span className={styles.req}>*</span></label>
              <select id="gender" name="gender" value={form.gender} onChange={handleChange} required>
                <option value="">Select…</option>
                <option>Female</option>
                <option>Male</option>
                <option>Non-binary</option>
                <option>Prefer not to say</option>
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="country">Country</label>
              <select id="country" name="country" value={form.country} onChange={handleChange}>
                <option value="">Select…</option>
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="job_title">Job title <span className={styles.optional}>(optional)</span></label>
              <input
                id="job_title" name="job_title" type="text"
                value={form.job_title} onChange={handleChange}
                placeholder="Professor of Economics"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="organization">Organization / Institution <span className={styles.optional}>(optional)</span></label>
              <input
                id="organization" name="organization" type="text"
                value={form.organization} onChange={handleChange}
                placeholder="Harvard University"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="honors">Noteworthy honors <span className={styles.optional}>(optional)</span></label>
            <input
              id="honors" name="honors" type="text"
              value={form.honors} onChange={handleChange}
              placeholder="Nobel Laureate, FRS, FRSC…"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? 'Submitting…' : 'Sign this letter'}
          </button>

          <p className={styles.privacy}>
            Your email is used only to verify your signature. We never share it publicly.
          </p>
        </form>
      </div>

      {showModal && (
        <AlmostDoneModal email={submittedEmail} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}
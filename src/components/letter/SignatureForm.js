'use client'

import { useState } from 'react'
import { Modal, message } from 'antd'
import AlmostDoneModal from '@/components/modals/AlmostDoneModal'
import styles from './SignatureForm.module.css'

const COUNTRIES = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Argentina',
  'Australia',
  'Austria',
  'Bangladesh',
  'Belgium',
  'Brazil',
  'Canada',
  'Chile',
  'China',
  'Colombia',
  'Croatia',
  'Czech Republic',
  'Denmark',
  'Egypt',
  'Ethiopia',
  'Finland',
  'France',
  'Germany',
  'Ghana',
  'Greece',
  'Hungary',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Japan',
  'Jordan',
  'Kenya',
  'Malaysia',
  'Mexico',
  'Morocco',
  'Netherlands',
  'New Zealand',
  'Nigeria',
  'Norway',
  'Pakistan',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Romania',
  'Russia',
  'Saudi Arabia',
  'Senegal',
  'Singapore',
  'South Africa',
  'South Korea',
  'Spain',
  'Sri Lanka',
  'Sweden',
  'Switzerland',
  'Tanzania',
  'Thailand',
  'Turkey',
  'Uganda',
  'Ukraine',
  'United Kingdom',
  'United States',
  'Vietnam',
  'Zimbabwe'
].sort()

export default function SignatureForm ({ open, onClose, letterId }) {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    gender: '',
    job_title: '',
    organization: '',
    honors: '',
    country: ''
  })
  const [loading, setLoading] = useState(false)
  const [showAlmostDone, setShowAlmostDone] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [error, setError] = useState('')

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, letter_id: letterId })
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      message.success('Signature submitted! Please verify your email.')
      setSubmittedEmail(form.email)
      // Close Ant Design modal first
      onClose()
      // Allow time for modal close animation, then show AlmostDone
      setTimeout(() => {
        setShowAlmostDone(true)
      }, 300)
    } else {
      setError(data.error || 'Failed to submit signature.')
      message.error(data.error || 'Submission failed.')
    }
  }

  return (
    <>
      <Modal
        open={open}
        onCancel={loading ? undefined : onClose}
        footer={null}
        centered
        width={600}
        destroyOnHidden
      >
        <h2 className={styles.heading}>Add your signature</h2>
        <p className={styles.sub}>
          Your voice matters. Join thousands who have already signed.
        </p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* Form fields (same as before) */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Full name *</label>
              <input
                name='full_name'
                value={form.full_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Email *</label>
              <input
                name='email'
                type='email'
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Gender *</label>
              <select
                name='gender'
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value=''>Select…</option>
                <option>Female</option>
                <option>Male</option>
                <option>Non-binary</option>
                <option>Prefer not to say</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Country</label>
              <select
                name='country'
                value={form.country}
                onChange={handleChange}
              >
                <option value=''>Select…</option>
                {COUNTRIES.map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Job title</label>
              <input
                name='job_title'
                value={form.job_title}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label>Organization</label>
              <input
                name='organization'
                value={form.organization}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={styles.field}>
            <label>Honors</label>
            <input name='honors' value={form.honors} onChange={handleChange} />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type='submit' disabled={loading} className={styles.submit}>
            {loading ? 'Submitting…' : 'Sign this letter'}
          </button>
        </form>
      </Modal>

      {showAlmostDone && (
        <AlmostDoneModal
          email={submittedEmail}
          onClose={() => setShowAlmostDone(false)}
        />
      )}
    </>
  )
}

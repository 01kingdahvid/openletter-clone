'use client'
import { useState } from 'react'
import styles from './contact.module.css'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setLoading(false)
    if (res.ok) {
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } else {
      setStatus('error')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>Contact</p>
          <h1 className={styles.title}>Get in touch</h1>
          <p className={styles.sub}>Questions, media enquiries, or partnership requests — we'd love to hear from you.</p>
        </header>

        {status === 'success' ? (
          <div className={styles.success}>
            <p>✓ Message sent. We'll get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="name">Your name <span className={styles.req}>*</span></label>
                <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required placeholder="Jane Smith" />
              </div>
              <div className={styles.field}>
                <label htmlFor="email">Email <span className={styles.req}>*</span></label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="jane@example.com" />
              </div>
            </div>
            <div className={styles.field}>
              <label htmlFor="subject">Subject</label>
              <input id="subject" name="subject" type="text" value={form.subject} onChange={handleChange} placeholder="Media enquiry" />
            </div>
            <div className={styles.field}>
              <label htmlFor="message">Message <span className={styles.req}>*</span></label>
              <textarea id="message" name="message" rows="6" value={form.message} onChange={handleChange} required placeholder="Write your message…" />
            </div>
            {status === 'error' && <p className={styles.error}>Something went wrong. Please try again.</p>}
            <button type="submit" className={styles.submit} disabled={loading}>
              {loading ? 'Sending…' : 'Send message'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
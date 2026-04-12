'use client'
import styles from './AlmostDoneModal.module.css'

export default function AlmostDoneModal({ email, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.icon}>✉️</div>
        <h2 className={styles.heading}>Almost done!</h2>
        <p className={styles.body}>
          Please verify your email
        </p>
        <p className={styles.email}>{email}</p>
        <p className={styles.desc}>
          A verification link has been sent to your email. Click it to confirm your signature and access your personal dashboard.
        </p>
        <p className={styles.hint}>
          Don't see it? Check your spam folder.
        </p>
        <button className={styles.close} onClick={onClose}>Got it</button>
      </div>
    </div>
  )
}
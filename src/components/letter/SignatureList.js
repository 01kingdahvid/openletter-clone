import styles from './SignatureList.module.css'

export default function SignatureList({ signatures }) {
  if (!signatures?.length) return null

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.heading}>Who has signed</h3>
      <ul className={styles.list}>
        {signatures.map(sig => (
          <li key={sig.id} className={styles.item}>
            <div className={styles.avatar}>
              {sig.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className={styles.name}>{sig.full_name}</p>
              <p className={styles.meta}>
                {[sig.job_title, sig.organization, sig.country].filter(Boolean).join(' · ')}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
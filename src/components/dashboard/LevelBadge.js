import styles from './LevelBadge.module.css'

const LEVELS = {
  1: { label: 'Signatory', color: 'gray' },
  2: { label: 'Verified', color: 'green' },
  3: { label: 'Ambassador', color: 'gold' },
}

export default function LevelBadge({ level }) {
  const { label, color } = LEVELS[level] || LEVELS[1]
  return (
    <span className={`${styles.badge} ${styles[color]}`}>
      Level {level} · {label}
    </span>
  )
}
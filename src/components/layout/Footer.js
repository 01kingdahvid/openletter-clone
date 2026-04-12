import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer () {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.brand}>OpenLetter</p>
        <nav className={styles.links}>
          <Link href='/'>The Letter</Link>
          <Link href='/about'>About</Link>
          <Link href='/contact'>Contact</Link>
        </nav>
        <p className={styles.copy}>
          © {new Date().getFullYear()} OpenLetter. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

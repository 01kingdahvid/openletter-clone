import styles from './about.module.css'

export const metadata = {
  title: 'About | OpenLetter',
  description: 'Learn about this open letter and the people behind it.',
}

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>About us</p>
          <h1 className={styles.title}>Why this letter exists</h1>
        </header>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>Our mission</h2>
            <p>
              OpenLetter is a platform for collective voices. We believe that critical questions about
              technology, policy, and society deserve public deliberation — not just boardroom decisions.
              This letter is one expression of that belief.
            </p>
          </section>

          <section className={styles.section}>
            <h2>How signatures work</h2>
            <p>
              When you sign the letter, you receive a verification email. Once verified, your name appears
              publicly alongside other signatories. Your email is never displayed or shared.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Who we are</h2>
            <p>
              This initiative is maintained by a small team of researchers, technologists, and advocates
              committed to responsible AI. We are not affiliated with any political party or corporation.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Privacy & transparency</h2>
            <p>
              We collect only the information you provide on the signature form. We use it solely to
              verify your signature and display your name (with optional affiliation) on this page.
              We will never sell or share your data.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
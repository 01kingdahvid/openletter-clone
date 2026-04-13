'use client'

import styles from './HowItWorks.module.css'

const steps = [
  {
    number: '01',
    title: 'Sign with Accountability',
    desc: `We ask for your name and verify your email and location. You can also link your X (formerly Twitter) account to strengthen your authenticity.`
  },
  {
    number: '02',
    title: 'Evaluate Your Peers',
    desc: `After signing, you’ll help verify other signers: Are they real? Are they notable?`
  },
  {
    number: '03',
    title: 'Reviewed',
    desc: `Just like you’re evaluating others, they’re evaluating you. That’s how we keep the system honest.`
  },
  {
    number: '04',
    title: 'Reviews Strengthen the Network',
    desc: `Each time you review a peer, your input helps strengthen the letter’s integrity. Behind the scenes, we use proven models to identify trustworthy voices—like pairwise ranking for notability and trust graphs to check for authenticity.`
  },
  {
    number: '05',
    title: 'The Verified List Is Public',
    desc: `Signers appear on the public list immediately; subsequent peer reviews then improve each signer’s trust ranking.`
  }
]

export default function HowItWorks () {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* LEFT TEXT */}
        <div className={styles.left}>
          <span className={styles.subheading}>
            How our peer verification works
          </span>
          <h1>Why Every Signature Counts.</h1>
          <p>
            Signers help verify each other — so every name on our letters earns
            its place.
          </p>
        </div>

        {/* RIGHT STEPPER */}
        <div className={styles.right}>
          <div className={styles.stepper}>
            {steps.map((step, index) => (
              <div key={index} className={styles.step}>
                <div className={styles.number}>{step.number}</div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

import styles from './LetterBody.module.css'

export default function LetterBody() {
  return (
    <article className={styles.letter}>
      <p>
        Artificial intelligence is no longer a distant promise — it is reshaping how we work, communicate,
        and make decisions that affect millions of lives. The pace of development has outstripped our collective
        ability to understand its consequences.
      </p>
      <p>
        We believe that this moment calls for courage, clarity, and accountability. AI systems should be
        developed transparently, with independent oversight and meaningful public participation. The benefits
        must be shared broadly, not concentrated in the hands of a few.
      </p>
      <p>
        Specifically, we call for:
      </p>
      <ul>
        <li>Mandatory independent audits of high-impact AI systems</li>
        <li>Binding international frameworks for AI safety research</li>
        <li>Equitable access to AI tools and education globally</li>
        <li>Clear legal accountability for algorithmic harm</li>
        <li>Inclusive governance that centres affected communities</li>
      </ul>
      <p>
        The decisions made in the next few years will shape the trajectory of this technology for decades.
        We cannot afford to sleepwalk into a future we did not choose.
      </p>
      <p>
        We stand together in calling for a responsible, inclusive, and democratic approach to artificial intelligence.
      </p>
      <p className={styles.cta}>
        <strong>If you agree, add your name.</strong>
      </p>
    </article>
  )
}
"use client";

import styles from "./WhyChooseUs.module.css";

export default function WhyChooseUs() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>

        {/* LEFT */}
        <div className={styles.col}>
          <span className={styles.subheading}>Why we exist?</span>

          <h2>Built for the Public Good.</h2>

          <p>
            OpenLetter.net is a project by Survival & Flourishing Corp, a Public
            Benefit Corporation funded by Jaan Tallinn. This site exists to help
            humanity coordinate on issues that matter most—nothing more, nothing
            less.
          </p>

          <button className={styles.button}>
            Survival & Flourishing Corp
          </button>
        </div>

        {/* DIVIDER */}
        <div className={styles.divider} />

        {/* RIGHT */}
        <div className={styles.col}>
          <span className={styles.subheading}>
            Why verification matters?
          </span>

          <h2>Restoring Signal to Public Petitions.</h2>

          <p>
            In a world flooded with bots, fake accounts, and performative
            outrage, OpenLetter.net restores signal to public petitions. Our
            goal is for every name to undergo peer review to ensure authenticity
            and strengthen the impact of our letters.
          </p>

          <button className={styles.button}>
            About Us
          </button>
        </div>

      </div>
    </section>
  );
}
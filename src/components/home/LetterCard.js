'use client'

import Link from 'next/link'
import styles from './LetterCard.module.css'

export default function LetterCard () {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        {/* TITLE */}
        <Link href='/disrupting-deepfakes' className={styles.title}>
          Disrupting the Deepfake Supply Chain
        </Link>

        {/* SUBTEXT */}
        <p className={styles.subtitle}>
          A call for new laws and regulations to protect everyone from the harms
          of deepfakes
        </p>

        {/* DATE */}
        <p className={styles.date}>February 21, 2024</p>

        {/* SIGNATURE ROW */}
        <div className={styles.signatureRow}>
          {/* LEFT */}
          <div className={styles.signatureInfo}>
            <p className={styles.count}>1,675 signatures</p>

            <div className={styles.verified}>✔ Verified</div>

            <p className={styles.recent}>
              Irene Chen and Stuart Russell have signed
            </p>
          </div>

          {/* RIGHT */}
          <button className={styles.signBtn}>Sign this letter</button>
        </div>

        {/* CONTEXT */}
        <div className={styles.context}>
          <p>
            <b>Context </b>: Many experts have warned that artificial
            intelligence (“AI”) could cause significant harm to humanity if not
            handled responsibly. The impact of AI is compounded significantly by
            its ability to imitate real humans. In the statement below,
            “deepfakes” refers to non-consensual or grossly misleading
            AI-generated voices, images, or videos, that a reasonable person
            would mistake as real. This does not include slight alterations to
            an image or voice, nor innocuous entertainment or satire that is
            easily recognized as synthetic. Today, deepfakes often involve
            sexual imagery, fraud, or political disinformation. Since AI is
            progressing rapidly and making deepfakes much easier to create,
            safeguards are needed for the functioning and integrity of our
            digital infrastructure: Statement Deepfakes are a growing threat to
            society, and governments must impose obligations throughout the
            supply chain to stop the proliferation of deepfakes. New laws
            should: Fully criminalize deepfake child pornography, even when only
            fictional children are depicted; Establish criminal penalties for
            anyone who knowingly creates or knowingly facilitates the spread of
            harmful deepfakes; and Require software developers and distributors
            to prevent their audio and visual products from creating harmful
            deepfakes, and to be held liable if their preventive measures are
            too easily circumvented. If designed wisely, such laws could nurture
            socially responsible businesses, and would not need to be
            excessively burdensome. Reasons: Not all signers will have the same
            reasons for supporting the statement above, and they may not all
            agree on the content below. Nonetheless, at least some early signers
            were motivated by one or more of the following points: Nonconsensual
            pornography: AI-generated pornography is a rapidly growing industry,
            and many targets are minors. One report found that deepfake
            pornography makes up 98% of all deepfake videos online, following a
            400% increase in deepfake sexual content from 2022 to 2023, reaching
            monthly traffic exceeding 34 million in 2023, with 99% percent of
            those targeted being women. This follows a pre-existing trend in
            technology-facilitated gender-based violence, where 58% of young
            women and girls globally have experienced online harassment on
            social media platforms, with disproportionate impact experienced on
            the basis of gender, race, ethnicity, sexual orientation, religion,
            and other factors. <br />
            <b>Fraud:</b> Deepfake fraud for impersonation and identity theft is a
            threat to both individuals and businesses. AI can make convincing
            deepfake videos of private individuals using as little as one photo.
            Deepfake fraud reportedly increased by 3000% in 2023. Elections:
            With half of the world’s population facing elections soon, the
            widespread creation and proliferation of deepfakes is a growing
            threat to democratic processes around the world True-to-life
            deepfakes of celebrities and political figures are already spreading
            rapidly. <br/>
            <b>Practicality:</b>  On a positive note, it is possible for
            cameras to generate tamper-proof digital seals on unaltered
            photographs and videos of the real world, using cryptographic
            signature techniques similar to website certificates and login
            credentials. If broadly employed, these seals would allow anyone to
            use open-source authentication apps to verify that a properly signed
            photo or video is authentic. Device manufacturers, software
            developers, and media companies should work together and popularize
            these or similar content authentication methods.
            <br/>
            <b>Urgency:</b> 
            Unprecedented AI progress is making deepfake creation fast, cheap,
            and easy. The total number of deepfakes has grown by 550% from 2019
            to 2023. Inadequate laws: Current laws do not adequately target and
            limit deepfake production and dissemination, and even requirements
            on creators — who are often underage — are ineffective. The whole
            deepfake supply chain should be held accountable, just as they are
            for malware and child pornography. Mass confusion: For a modern
            society to function, people need to have access to believable,
            authentic information. Misleading the public through the use of AI
            should be regulated and enforced through specific, formalized laws.
            It’s becoming harder and harder to know what is real on the
            internet, and lines need to be drawn to protect our ability to
            recognize real human beings. <br/>
            <b>Performers:</b> As audience members, we
            delight in the feats of real human performers in dance, film, magic,
            music, sports, and theater. If broadcast entertainment becomes
            saturated with deepfakes, the connection between audience and
            performers will erode, and deepfakes will unfairly displace the
            people whose works were used to “train” AI in the first place.
          </p>

          <div className={styles.fade}></div>
        </div>
        <Link href='/disrupting-deepfakes' className={styles.readMore}>
          Continue reading →
        </Link>
      </div>
    </div>
  )
}

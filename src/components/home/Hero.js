import styles from './Hero.module.css';

export default function Hero() {
  return (
    <>
      <div className={styles.hero}>
        <h1>
          Empower Change <br /> with Open Letters.
        </h1>
        <p>
          Sign public letters that rally people around the world’s most critical
          challenges. Signatures appear immediately upon signing and then undergo
          peer review to ensure authenticity.
        </p>
      </div>
    </>
  );
}
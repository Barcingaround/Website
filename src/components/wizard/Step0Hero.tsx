import { useBuilderStore } from '../../store/builderStore';
import styles from './Step0Hero.module.css';

export default function Step0Hero() {
  const setStep = useBuilderStore(s => s.setStep);

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.trustPill}>
          <span>Locally sourced</span>
          <span className={styles.dot}>·</span>
          <span>Handcrafted</span>
          <span className={styles.dot}>·</span>
          <span>Miami-delivered</span>
          <span className={styles.dot}>·</span>
          <span>24hr notice</span>
        </div>

        <h1 className={`hero-headline ${styles.headline}`}>
          Build Your Perfect Board
        </h1>

        <p className={`hero-subheadline ${styles.subheadline}`}>
          Choose your ingredients, see your creation come to life.
        </p>

        <button
          type="button"
          className={styles.cta}
          onClick={() => setStep(1)}
          aria-label="Start building your board"
        >
          Start Building
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className={styles.previewBoards} aria-hidden="true">
          <div className={styles.previewCard}>
            <div className={styles.previewBoardPlaceholder} />
            <span className={styles.previewLabel}>Cheese &amp; Charcuterie</span>
          </div>
          <div className={styles.previewCard}>
            <div className={`${styles.previewBoardPlaceholder} ${styles.previewCO}`} />
            <span className={styles.previewLabel}>Cheese Only</span>
          </div>
        </div>
      </div>
    </section>
  );
}

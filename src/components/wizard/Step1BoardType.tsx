import { useState } from 'react';
import { useBuilderStore } from '../../store/builderStore';
import styles from './Step1BoardType.module.css';

type SelectedCategory = 'cc' | 'co' | null;

export default function Step1BoardType() {
  const setStep = useBuilderStore(s => s.setStep);
  const [selected, setSelected] = useState<SelectedCategory>(null);

  function handleContinue() {
    if (!selected) return;
    // Store the category preference for Step 2
    // Step 2 will render size options for the selected category
    sessionStorage.setItem('selectedCategory', selected);
    setStep(2);
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2>What type of board?</h2>
          <p>Choose your board style. You can add both types to the same order.</p>
        </div>

        <div className={styles.cards}>
          <button
            type="button"
            className={`${styles.card} ${selected === 'cc' ? styles.cardSelected : ''}`}
            onClick={() => setSelected('cc')}
            aria-pressed={selected === 'cc'}
            aria-label="Cheese and Charcuterie board — artisan cheeses with premium cured meats"
          >
            <div className={styles.cardIllustration}>
              <div className={styles.ccIllustration} aria-hidden="true">
                <div className={styles.illMeat} />
                <div className={styles.illCheese1} />
                <div className={styles.illCheese2} />
                <div className={styles.illGrapes} />
              </div>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.categoryBadge}>Cheese &amp; Charcuterie</div>
              <h3 className={styles.cardTitle}>The Classic Board</h3>
              <p className={styles.cardDesc}>
                Artisan cheeses, premium cured meats, fresh fruits &amp; seasonal accoutrements. Our signature.
              </p>
              <div className={styles.cardFrom}>From $139</div>
            </div>
            <div className={styles.checkmark} aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="10" fill="var(--brand-green)"/>
                <path d="M6 10l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>

          <button
            type="button"
            className={`${styles.card} ${selected === 'co' ? styles.cardSelected : ''}`}
            onClick={() => setSelected('co')}
            aria-pressed={selected === 'co'}
            aria-label="Cheese Only board — five artisan cheese varieties with exotic fruits"
          >
            <div className={styles.cardIllustration}>
              <div className={styles.coIllustration} aria-hidden="true">
                <div className={styles.illBoursin} />
                <div className={styles.illDragonFruit} />
                <div className={styles.illGouda} />
                <div className={styles.illKiwi} />
              </div>
            </div>
            <div className={styles.cardBody}>
              <div className={`${styles.categoryBadge} ${styles.categoryBadgeCO}`}>Cheese Only</div>
              <h3 className={styles.cardTitle}>The Cheese Lover's Board</h3>
              <p className={styles.cardDesc}>
                Five artisan varieties — brie, manchego, gouda, boursin and more — with exotic fruits &amp; seasonal accoutrements. No compromise.
              </p>
              <div className={styles.cardFrom}>From $139</div>
            </div>
            <div className={styles.checkmark} aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="10" fill="var(--brand-green)"/>
                <path d="M6 10l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.btnBack}
            onClick={() => setStep(0)}
          >
            ← Back
          </button>
          <button
            type="button"
            className={styles.btnContinue}
            onClick={handleContinue}
            disabled={!selected}
            aria-disabled={!selected}
          >
            Continue →
          </button>
        </div>
      </div>
    </section>
  );
}

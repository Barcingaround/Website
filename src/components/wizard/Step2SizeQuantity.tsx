import { useState, useMemo } from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { BOARD_SIZES, type BoardSKU } from '../../data/boardSizes';
import styles from './Step2SizeQuantity.module.css';

const CATEGORY_SKUS: Record<string, BoardSKU[]> = {
  cc: ['cc_small', 'cc_medium', 'cc_large'],
  co: ['co_small', 'co_medium', 'co_large'],
};

const SIZE_LABELS: Record<string, { icon: string; highlight: string }> = {
  small:  { icon: '◦', highlight: 'Perfect for intimate gatherings' },
  medium: { icon: '○', highlight: 'Great for parties & events' },
  large:  { icon: '●', highlight: 'Ideal for large celebrations' },
};

export default function Step2SizeQuantity() {
  const setStep = useBuilderStore(s => s.setStep);
  const addBoard = useBuilderStore(s => s.addBoard);
  const resetOrder = useBuilderStore(s => s.resetOrder);

  const category = (sessionStorage.getItem('selectedCategory') || 'cc') as 'cc' | 'co';
  const [quantities, setQuantities] = useState<Record<BoardSKU, number>>({
    cc_small: 0, cc_medium: 0, cc_large: 0,
    co_small: 0, co_medium: 0, co_large: 0,
  });

  const skus = CATEGORY_SKUS[category];

  const subtotal = useMemo(() => {
    return Object.entries(quantities).reduce((sum, [sku, qty]) => {
      return sum + BOARD_SIZES[sku as BoardSKU].price * qty;
    }, 0);
  }, [quantities]);

  const totalBoards = Object.values(quantities).reduce((sum, q) => sum + q, 0);

  function increment(sku: BoardSKU) {
    setQuantities(q => ({ ...q, [sku]: (q[sku] || 0) + 1 }));
  }

  function decrement(sku: BoardSKU) {
    setQuantities(q => ({ ...q, [sku]: Math.max(0, (q[sku] || 0) - 1) }));
  }

  function handleContinue() {
    if (totalBoards === 0) return;
    // Clear any boards from a previous visit to this step, then add fresh
    useBuilderStore.getState().resetOrder();
    for (const [sku, qty] of Object.entries(quantities)) {
      for (let i = 0; i < qty; i++) {
        useBuilderStore.getState().addBoard(sku as BoardSKU, false);
      }
    }
    setStep(3);
  }

  function handleBack() {
    resetOrder();
    setStep(1);
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2>Choose your size{totalBoards > 1 ? 's' : ''}</h2>
          <p>
            {category === 'cc' ? 'Cheese & Charcuterie boards' : 'Cheese Only boards'} — how many of each?
          </p>
        </div>

        <div className={styles.grid}>
          {skus.map(sku => {
            const config = BOARD_SIZES[sku];
            const qty = quantities[sku];
            const sizeInfo = SIZE_LABELS[config.size];
            return (
              <div key={sku} className={`${styles.sizeCard} ${qty > 0 ? styles.sizeCardActive : ''}`}>
                <div className={styles.sizeIllustration} aria-hidden="true">
                  <div className={`${styles.boardThumb} ${styles[`board_${config.shape}`]} ${styles[`board_${config.size}`]}`} />
                </div>
                <div className={styles.sizeInfo}>
                  <div className={styles.sizeLabel}>
                    <span className={styles.sizeIcon}>{sizeInfo.icon}</span>
                    <span className={styles.sizeName}>{config.size.charAt(0).toUpperCase() + config.size.slice(1)}</span>
                  </div>
                  <div className={styles.serves}>Serves {config.serves}</div>
                  <div className={styles.highlight}>{sizeInfo.highlight}</div>
                  <div className={styles.price}>
                    ${config.price.toFixed(2)}
                    {!config.priceConfirmed && <span className={styles.approxBadge}>~approx</span>}
                  </div>
                </div>
                <div className={styles.stepper}>
                  <button
                    type="button"
                    className={styles.stepBtn}
                    onClick={() => decrement(sku)}
                    disabled={qty <= 0}
                    aria-label={`Remove one ${config.displayName}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  </button>
                  <span className={styles.qty} aria-live="polite">{qty}</span>
                  <button
                    type="button"
                    className={styles.stepBtn}
                    onClick={() => increment(sku)}
                    aria-label={`Add one ${config.displayName}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Running subtotal */}
        {totalBoards > 0 && (
          <div className={styles.subtotalBar} aria-live="polite">
            <span>{totalBoards} board{totalBoards > 1 ? 's' : ''}</span>
            <span className={styles.subtotalDivider}> · </span>
            <span className={`price ${styles.subtotalPrice}`}>${subtotal.toFixed(2)}</span>
          </div>
        )}

        <div className={styles.actions}>
          <button type="button" className={styles.btnBack} onClick={handleBack}>← Back</button>
          <button
            type="button"
            className={styles.btnContinue}
            onClick={handleContinue}
            disabled={totalBoards === 0}
          >
            Customize My Board{totalBoards > 1 ? 's' : ''} →
          </button>
        </div>
      </div>
    </section>
  );
}

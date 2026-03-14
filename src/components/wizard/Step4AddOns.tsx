import { useState } from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { ADD_ONS } from '../../data/addOns';
import styles from './Step4AddOns.module.css';

export default function Step4AddOns() {
  const setStep = useBuilderStore(s => s.setStep);
  const addOns = useBuilderStore(s => s.addOns);
  const addAddOn = useBuilderStore(s => s.addAddOn);
  const removeAddOn = useBuilderStore(s => s.removeAddOn);
  const setAddOnCustomText = useBuilderStore(s => s.setAddOnCustomText);
  // Initialize from store so text is restored if user navigates away and back
  const storedMessageText = addOns.find(a => a.customText)?.customText ?? '';
  const [messageText, setMessageText] = useState(storedMessageText);

  function toggleAddOn(id: string, price: number) {
    if (addOns.find(a => a.addOnId === id)) {
      removeAddOn(id);
    } else {
      addAddOn(id, price);
    }
  }

  function isSelected(id: string) {
    return !!addOns.find(a => a.addOnId === id);
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2>Complete your order</h2>
          <p>Optional add-ons to make your event even more special.</p>
        </div>

        <div className={styles.grid}>
          {ADD_ONS.map(addOn => {
            const selected = isSelected(addOn.id);
            return (
              <div
                key={addOn.id}
                className={`${styles.card} ${selected ? styles.cardSelected : ''}`}
              >
                <div className={styles.cardBody}>
                  <div className={styles.cardName}>{addOn.displayName}</div>
                  <div className={styles.cardDesc}>{addOn.description}</div>
                  <div className={styles.cardPrice}>
                    {addOn.price === 0 ? 'Free' : `+$${addOn.price.toFixed(2)}`}
                    {!addOn.priceConfirmed && <span className={styles.approx}> (approx)</span>}
                  </div>
                </div>

                {addOn.hasCustomText && selected && (
                  <div className={styles.messageInput}>
                    <textarea
                      placeholder="Write your message here… (200 characters max)"
                      maxLength={200}
                      value={messageText}
                      onChange={e => {
                        setMessageText(e.target.value);
                        setAddOnCustomText(addOn.id, e.target.value);
                      }}
                      className={styles.textarea}
                      aria-label="Custom message"
                    />
                    <div className={styles.charCount}>{messageText.length}/200</div>
                  </div>
                )}

                <button
                  type="button"
                  className={`${styles.toggleBtn} ${selected ? styles.toggleBtnSelected : ''}`}
                  onClick={() => toggleAddOn(addOn.id, addOn.price)}
                  aria-pressed={selected}
                >
                  {selected ? '✓ Added' : '+ Add'}
                </button>
              </div>
            );
          })}
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.btnBack} onClick={() => setStep(3)}>← Back</button>
          <button type="button" className={styles.btnContinue} onClick={() => setStep(5)}>
            Review Order →
          </button>
        </div>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { useOrderState } from '../../hooks/useOrderState';
import { validateOrder } from '../../utils/validation';
import styles from './Step6Checkout.module.css';

// Delivery time slots
const TIME_SLOTS = [
  '10:00 AM – 12:00 PM',
  '12:00 PM – 2:00 PM',
  '2:00 PM – 4:00 PM',
  '4:00 PM – 6:00 PM',
];

function getMinDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1); // 24hr notice
  // Skip Sunday (0)
  if (d.getDay() === 0) d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

function isDateDisabled(dateStr: string): boolean {
  const d = new Date(dateStr + 'T00:00:00');
  return d.getDay() === 0; // Sunday
}

export default function Step6Checkout() {
  const setStep = useBuilderStore(s => s.setStep);
  const deliveryDate = useBuilderStore(s => s.deliveryDate);
  const deliveryTime = useBuilderStore(s => s.deliveryTime);
  const deliveryAddress = useBuilderStore(s => s.deliveryAddress);
  const specialInstructions = useBuilderStore(s => s.specialInstructions);
  const giftMessage = useBuilderStore(s => s.giftMessage);
  const setDeliveryDate = useBuilderStore(s => s.setDeliveryDate);
  const setDeliveryTime = useBuilderStore(s => s.setDeliveryTime);
  const setDeliveryAddress = useBuilderStore(s => s.setDeliveryAddress);
  const setSpecialInstructions = useBuilderStore(s => s.setSpecialInstructions);
  const setGiftMessage = useBuilderStore(s => s.setGiftMessage);

  const { boards, orderTotal, hasUnconfirmedPrices } = useOrderState();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validation = validateOrder(boards);
  const hasErrors = !validation.valid;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (hasErrors) return;
    setSubmitting(true);

    // Build order object
    const orderObj = {
      order_id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      delivery_date: deliveryDate,
      delivery_time_preference: deliveryTime,
      delivery_address: deliveryAddress,
      special_instructions: specialInstructions,
      gift_message: giftMessage,
      boards: boards.map(b => ({
        board_id: b.boardId,
        sku: b.sku,
        board_name: b.boardName,
        price: b.price,
        price_confirmed: b.priceConfirmed,
        ingredients: b.ingredientSelections,
        accoutrements: b.accoutrementSelections,
      })),
      order_total: orderTotal,
    };

    // Post to parent Wix page via postMessage
    try {
      window.parent.postMessage({
        type: 'BOARD_MIAMI_ORDER',
        payload: orderObj,
      }, '*');

      // Fire analytics
      if (typeof window !== 'undefined' && (window as Window & { gtag?: Function }).gtag) {
        (window as Window & { gtag: Function }).gtag('event', 'order_placed', {
          board_count: boards.length,
          total: orderTotal,
          skus: boards.map(b => b.sku),
        });
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Order submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section className={styles.section}>
        <div className="container">
          <div className={styles.success}>
            <div className={styles.successIcon}>🎉</div>
            <h2>Order Submitted!</h2>
            <p>Thank you! Your board order has been received. We'll reach out to confirm your order and delivery details.</p>
            <p className={styles.successNote}>You'll receive a confirmation email shortly.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2>Delivery Details</h2>
          <p>Almost there! Tell us where and when to deliver your boards.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.formGrid}>
            {/* Left column */}
            <div className={styles.formColumn}>
              <div className={styles.field}>
                <label htmlFor="delivery-address" className={styles.label}>Delivery Address *</label>
                <input
                  id="delivery-address"
                  type="text"
                  className={styles.input}
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  placeholder="123 Brickell Ave, Miami FL 33130"
                  required
                />
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label htmlFor="delivery-date" className={styles.label}>Delivery Date * <span className={styles.fieldNote}>(24hr min, no Sundays)</span></label>
                  <input
                    id="delivery-date"
                    type="date"
                    className={styles.input}
                    value={deliveryDate ?? ''}
                    min={getMinDate()}
                    onChange={e => {
                      if (!isDateDisabled(e.target.value)) {
                        setDeliveryDate(e.target.value);
                      }
                    }}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="delivery-time" className={styles.label}>Preferred Time</label>
                  <select
                    id="delivery-time"
                    className={styles.select}
                    value={deliveryTime ?? ''}
                    onChange={e => setDeliveryTime(e.target.value)}
                  >
                    <option value="">Select time window</option>
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="special-instructions" className={styles.label}>Special Instructions</label>
                <textarea
                  id="special-instructions"
                  className={styles.textarea}
                  value={specialInstructions}
                  onChange={e => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Please leave at front desk, gate code is #1234"
                  maxLength={350}
                  rows={3}
                />
                <div className={styles.charCount}>{specialInstructions.length}/350</div>
              </div>

              <div className={styles.field}>
                <label htmlFor="gift-message" className={styles.label}>Gift Message</label>
                <textarea
                  id="gift-message"
                  className={styles.textarea}
                  value={giftMessage}
                  onChange={e => setGiftMessage(e.target.value)}
                  placeholder="e.g. Happy Birthday! xo"
                  maxLength={200}
                  rows={2}
                />
                <div className={styles.charCount}>{giftMessage.length}/200</div>
              </div>
            </div>

            {/* Right column — order summary */}
            <div className={styles.summaryColumn}>
              <div className={styles.orderSummary}>
                <h4>Order Summary</h4>
                {boards.map(b => (
                  <div key={b.boardId} className={styles.summaryRow}>
                    <span>{b.boardName || `Board ${b.boardNumber}`}</span>
                    <span>${b.price.toFixed(2)}</span>
                  </div>
                ))}
                <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                  <span>Total</span>
                  <span className={styles.totalAmt}>${orderTotal.toFixed(2)}</span>
                </div>
                {hasUnconfirmedPrices && (
                  <div className={styles.priceNote}>* Some prices are approximate</div>
                )}
                <div className={styles.taxNote}>Price does not include taxes</div>
                <div className={styles.amexNote}>
                  AMEX charges may appear as WIX COM INC
                </div>
              </div>

              {/* Validation warnings */}
              {validation.errors.length > 0 && (
                <div className={styles.validationErrors}>
                  {validation.errors.map((err, i) => (
                    <div
                      key={i}
                      className={[
                        styles.validationError,
                        err.severity === 'error' ? styles.validation_error : styles.validation_warning,
                      ].join(' ')}
                    >
                      {err.severity === 'error' ? '⚠️' : '💡'} {err.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.submitRow}>
            <button type="button" className={styles.btnBack} onClick={() => setStep(5)}>← Back</button>
            <button
              type="submit"
              className={styles.btnSubmit}
              disabled={submitting || hasErrors || !deliveryAddress || !deliveryDate}
            >
              {submitting ? 'Submitting…' : 'Add to Cart →'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

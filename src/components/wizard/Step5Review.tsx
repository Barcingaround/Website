import { useBuilderStore } from '../../store/builderStore';
import { useOrderState } from '../../hooks/useOrderState';
import { getIngredientById } from '../../data/ingredients';
import { BOARD_SIZES } from '../../data/boardSizes';
import { ADD_ONS } from '../../data/addOns';
import LiveBoardCanvas from '../canvas/LiveBoardCanvas';
import styles from './Step5Review.module.css';

export default function Step5Review() {
  const setStep = useBuilderStore(s => s.setStep);
  const setCurrentBoardIndex = useBuilderStore(s => s.setCurrentBoardIndex);
  const { boards, addOns, boardsTotal, addOnsTotal, orderTotal, hasUnconfirmedPrices } = useOrderState();

  function editBoard(index: number) {
    setCurrentBoardIndex(index);
    setStep(3);
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2>Your Order</h2>
          <p>Review your boards and make any final adjustments.</p>
        </div>

        <div className={styles.boards}>
          {boards.map((board, idx) => {
            const config = BOARD_SIZES[board.sku];
            return (
              <div key={board.boardId} className={styles.boardCard}>
                <div className={styles.boardCardTop}>
                  <div className={styles.boardInfo}>
                    <div className={styles.boardLabel}>
                      {board.category === 'cc' ? '🧀🥩' : '🧀'}
                      <span>{config.displayName}</span>
                    </div>
                    <div className={styles.boardName}>{board.boardName}</div>
                    <div className={styles.boardServes}>Serves {config.serves}</div>
                  </div>
                  <div className={styles.boardActions}>
                    <div className={styles.boardPrice}>
                      ${board.price.toFixed(2)}
                      {!board.priceConfirmed && <span className={styles.approxNote}> *approx</span>}
                    </div>
                    <button
                      type="button"
                      className={styles.editBtn}
                      onClick={() => editBoard(idx)}
                    >
                      ✏️ Edit
                    </button>
                  </div>
                </div>

                <div className={styles.boardCardBody}>
                  {/* Mini board thumbnail */}
                  <div className={styles.boardThumbnail}>
                    <LiveBoardCanvas board={board} className={styles.thumbCanvas} />
                  </div>

                  {/* Ingredient list */}
                  <div className={styles.ingredientList}>
                    {board.ingredientSelections.map(sel => {
                      const ing = getIngredientById(sel.ingredientId);
                      if (!ing) return null;
                      const unitsPerPt = typeof ing.unitsPerPoint === 'number'
                        ? ing.unitsPerPoint
                        : (ing.unitsPerPoint as { cc: number; co: number })[board.category] ?? 0;
                      const units = sel.pointsAllocated * unitsPerPt;
                      return (
                        <div key={sel.ingredientId} className={styles.ingRow}>
                          <span className={styles.ingName}>{ing.displayName}</span>
                          <span className={styles.ingQty}>{units} {ing.unitLabel}</span>
                        </div>
                      );
                    })}
                    {board.accoutrementSelections.length > 0 && (
                      <div className={styles.accsSection}>
                        <div className={styles.accsSectionLabel}>Accoutrements</div>
                        {board.accoutrementSelections.map(sel => {
                          const ing = getIngredientById(sel.ingredientId);
                          if (!ing) return null;
                          return (
                            <div key={sel.ingredientId} className={styles.ingRow}>
                              <span className={styles.ingName}>{ing.displayName}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div className={styles.fixedNote}>+ Jars, rosemary, microgreens (always included)</div>
                  </div>
                </div>

                <div className={styles.deliveryNote}>
                  📅 Available with 24hr notice · No Sunday delivery
                </div>
              </div>
            );
          })}
        </div>

        {/* Add-ons */}
        {addOns.length > 0 && (
          <div className={styles.addOnsSection}>
            <h3>Add-Ons</h3>
            {addOns.map(addOn => {
              const def = ADD_ONS.find(a => a.id === addOn.addOnId);
              return (
                <div key={addOn.addOnId} className={styles.addOnRow}>
                  <span>{def?.displayName}</span>
                  <span>{addOn.price === 0 ? 'Free' : `$${(addOn.price * addOn.quantity).toFixed(2)}`}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Totals */}
        <div className={styles.totals}>
          <div className={styles.totalRow}>
            <span>Boards subtotal</span>
            <span>${boardsTotal.toFixed(2)}</span>
          </div>
          {addOnsTotal > 0 && (
            <div className={styles.totalRow}>
              <span>Add-ons</span>
              <span>${addOnsTotal.toFixed(2)}</span>
            </div>
          )}
          <div className={`${styles.totalRow} ${styles.totalRowFinal}`}>
            <span>Order Total</span>
            <span className={styles.totalAmount}>${orderTotal.toFixed(2)}</span>
          </div>
          {hasUnconfirmedPrices && (
            <div className={styles.priceNote}>
              * Some prices are approximate and will be confirmed before checkout.
            </div>
          )}
          <div className={styles.taxNote}>Price above does not include taxes</div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.btnBack} onClick={() => setStep(4)}>← Back</button>
          <button type="button" className={styles.btnContinue} onClick={() => setStep(6)}>
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </section>
  );
}

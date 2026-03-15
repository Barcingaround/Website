import { useBuilderStore } from '../../store/builderStore';
import { useOrderState } from '../../hooks/useOrderState';
import { getIngredientById } from '../../data/ingredients';
import { BOARD_SIZES } from '../../data/boardSizes';
import { ADD_ONS } from '../../data/addOns';
import type { BoardConfig, IngredientSelection } from '../../store/builderStore';
import type { Ingredient } from '../../data/ingredients';
import LiveBoardCanvas from '../canvas/LiveBoardCanvas';
import styles from './Step5Review.module.css';

// ─── Category meta ───────────────────────────────────────────────────────────
const CATEGORY_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  cheese:       { label: 'Cheeses',       color: '#8B6A00', bg: '#FDF6DC', border: '#E8D48A' },
  meat:         { label: 'Meats',         color: '#7A2424', bg: '#FBF0F0', border: '#D4A8A8' },
  fruit:        { label: 'Fruits & Extras', color: '#2D5A2D', bg: '#EFF6EF', border: '#A8C8A8' },
  accoutrement: { label: 'Accoutrements', color: '#6B4423', bg: '#FAF2EA', border: '#D4B898' },
};

const CATEGORY_ORDER: Ingredient['category'][] = ['meat', 'cheese', 'fruit', 'accoutrement'];

// ─── Ingredient grouped row ───────────────────────────────────────────────────
interface GroupedIngredient {
  ingredient: Ingredient;
  sel: IngredientSelection;
  units: number;
}

function groupIngredients(
  selections: IngredientSelection[],
  board: BoardConfig
): Record<string, GroupedIngredient[]> {
  const groups: Record<string, GroupedIngredient[]> = {};
  for (const sel of selections) {
    const ing = getIngredientById(sel.ingredientId);
    if (!ing) continue;
    const unitsPerPt = typeof ing.unitsPerPoint === 'number'
      ? ing.unitsPerPoint
      : (ing.unitsPerPoint as { cc: number; co: number })[board.category] ?? 0;
    const units = sel.pointsAllocated * unitsPerPt;
    const cat = ing.category;
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push({ ingredient: ing, sel, units });
  }
  return groups;
}

// ─── Ingredient dot (mini icon using renderColor) ─────────────────────────────
function IngredientDot({ ingredient }: { ingredient: Ingredient }) {
  const color = (ingredient.renderColor as string | undefined) ?? '#888';
  return (
    <span
      className={styles.ingDot}
      style={{ background: color }}
      aria-hidden="true"
    />
  );
}

// ─── Board ingredient breakdown ───────────────────────────────────────────────
function BoardIngredientBreakdown({ board }: { board: BoardConfig }) {
  const mainGroups = groupIngredients(board.ingredientSelections, board);
  const accsGroups = groupIngredients(board.accoutrementSelections, board);

  // Merge accoutrements into main groups under 'accoutrement' key
  const allGroups: Record<string, GroupedIngredient[]> = { ...mainGroups };
  if (accsGroups['accoutrement']) {
    allGroups['accoutrement'] = [
      ...(allGroups['accoutrement'] ?? []),
      ...accsGroups['accoutrement'],
    ];
  }

  const hasIngredients = Object.values(allGroups).some(g => g.length > 0);

  return (
    <div className={styles.breakdown}>
      {!hasIngredients && (
        <p className={styles.emptyNote}>No ingredients selected yet.</p>
      )}

      {CATEGORY_ORDER.map(cat => {
        const group = allGroups[cat];
        if (!group || group.length === 0) return null;
        const meta = CATEGORY_META[cat];

        return (
          <div key={cat} className={styles.categoryBlock}>
            <div
              className={styles.categoryHeader}
              style={{ color: meta.color, borderColor: meta.border }}
            >
              <span
                className={styles.categoryPill}
                style={{ background: meta.bg, color: meta.color, borderColor: meta.border }}
              >
                {meta.label}
              </span>
              <span className={styles.categoryLine} style={{ background: meta.border }} />
            </div>

            <div className={styles.ingRows}>
              {group.map(({ ingredient, sel, units }) => (
                <div key={ingredient.id} className={styles.ingRow}>
                  <div className={styles.ingLeft}>
                    <IngredientDot ingredient={ingredient} />
                    <span className={styles.ingName}>{ingredient.displayName}</span>
                  </div>
                  <div className={styles.ingRight}>
                    {cat !== 'accoutrement' ? (
                      <span
                        className={styles.ingQtyPill}
                        style={{
                          background: (CATEGORY_META[ingredient.category]?.bg ?? '#f5f5f5'),
                          color: (CATEGORY_META[ingredient.category]?.color ?? '#333'),
                          borderColor: (CATEGORY_META[ingredient.category]?.border ?? '#ddd'),
                        }}
                      >
                        {units} {ingredient.unitLabel}
                      </span>
                    ) : (
                      <span className={styles.ingQtyPillNeutral}>
                        {sel.pointsAllocated > 0 ? `${units} ${ingredient.unitLabel}` : 'included'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className={styles.fixedInclusions}>
        <span className={styles.fixedInclusionsLabel}>Always included</span>
        <span className={styles.fixedInclusionsItems}>Jars · Rosemary · Microgreens</span>
      </div>
    </div>
  );
}

// ─── Main Step5Review ─────────────────────────────────────────────────────────
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
                {/* ── Card header ── */}
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

                {/* ── Card body: canvas + breakdown ── */}
                <div className={styles.boardCardBody}>
                  <div className={styles.boardThumbnail}>
                    <LiveBoardCanvas board={board} className={styles.thumbCanvas} />
                  </div>

                  <BoardIngredientBreakdown board={board} />
                </div>

                <div className={styles.deliveryNote}>
                  📅 Available with 24hr notice · No Sunday delivery
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Add-ons ── */}
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

        {/* ── Totals ── */}
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

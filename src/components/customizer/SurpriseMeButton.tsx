import { useBuilderStore } from '../../store/builderStore';
import type { BoardConfig } from '../../store/builderStore';
import { seededRNG } from '../../utils/seededRandom';
import { MEATS } from '../../data/ingredients/meats';
import { CHEESES } from '../../data/ingredients/cheeses';
import { FRUITS } from '../../data/ingredients/fruits';
import { ACCOUTREMENTS } from '../../data/ingredients/accoutrements';
import type { Ingredient } from '../../data/ingredients';
import styles from './SurpriseMeButton.module.css';

interface SurpriseMeProps {
  board: BoardConfig;
}

export default function SurpriseMeButton({ board }: SurpriseMeProps) {
  const updateIngredientPoints = useBuilderStore(s => s.updateIngredientPoints);
  const clearBoard = useBuilderStore(s => s.clearBoard);

  function handleSurpriseMe() {
    clearBoard(board.boardId);
    const rng = seededRNG(Date.now()); // Use current time as seed for variety

    // Get eligible ingredients for this board type
    const meats: Ingredient[] = board.category === 'cc'
      ? MEATS.filter(m => m.boardTypes.includes('cc'))
      : [];
    const cheeses = CHEESES.filter(c => c.boardTypes.includes(board.category));
    const fruits = FRUITS.filter(f => f.boardTypes.includes(board.category));
    const accs = ACCOUTREMENTS.filter(a => a.boardTypes.includes(board.category));

    // Allocate main budget
    let remaining = board.mainPointBudget;
    const MAX_PER_INGREDIENT_RATIO = 0.4;
    const maxPerIngredient = Math.floor(board.mainPointBudget * MAX_PER_INGREDIENT_RATIO);

    function allocate(pool: Ingredient[], minPoints: number, maxPoints: number): void {
      if (pool.length === 0 || remaining <= 0) return;
      // Shuffle pool
      const shuffled = [...pool].sort(() => rng() - 0.5);
      for (const ing of shuffled) {
        if (remaining <= 0) break;
        const maxCanAllocate = Math.min(maxPoints, remaining, maxPerIngredient);
        if (maxCanAllocate < ing.pointCost) continue;
        // Allocate 1 to N times the pointCost
        const maxAllocations = Math.floor(maxCanAllocate / ing.pointCost);
        const allocations = Math.max(
          Math.ceil(minPoints / ing.pointCost),
          Math.floor(rng() * maxAllocations) + 1
        );
        const pts = Math.min(allocations * ing.pointCost, remaining);
        if (pts > 0) {
          updateIngredientPoints(board.boardId, ing.id, pts, false);
          remaining -= pts;
        }
      }
    }

    // Ensure minimums: 1 meat (CC), 1 cheese, 2 fruits
    if (board.category === 'cc' && meats.length > 0) {
      const meat = meats[Math.floor(rng() * meats.length)];
      updateIngredientPoints(board.boardId, meat.id, meat.pointCost, false);
      remaining -= meat.pointCost;
    }

    // At least 1 cheese
    if (cheeses.length > 0) {
      const cheese = cheeses[Math.floor(rng() * cheeses.length)];
      updateIngredientPoints(board.boardId, cheese.id, cheese.pointCost, false);
      remaining -= cheese.pointCost;
    }

    // Fill remainder
    allocate([...meats, ...cheeses, ...fruits], 1, remaining);

    // Fill accoutrements sub-budget
    let accsRemaining = board.accsBudget;
    const shuffledAccs = [...accs].sort(() => rng() - 0.5);
    for (const acc of shuffledAccs) {
      if (accsRemaining <= 0) break;
      updateIngredientPoints(board.boardId, acc.id, acc.pointCost, true);
      accsRemaining -= acc.pointCost;
    }
  }

  return (
    <button
      type="button"
      className={styles.btn}
      onClick={handleSurpriseMe}
      aria-label="Surprise me — automatically fill board with random ingredients"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 1l1.5 3 3.5.5-2.5 2.5.5 3.5L8 9 4.5 10.5l.5-3.5L2.5 4.5 6 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
      Surprise Me
    </button>
  );
}

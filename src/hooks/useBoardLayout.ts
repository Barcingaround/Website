import { useMemo } from 'react';
import type { BoardConfig } from '../store/builderStore';
import type { LayoutItem } from '../canvas/IngredientDrawers';
import { computeBoardLayout } from '../canvas/BoardRenderer';

/**
 * Memoized hook — recomputes layout only when board config changes.
 * Since computeBoardLayout is a pure function (same input → same output),
 * this is safe to cache by deep equality of board config.
 */
export function useBoardLayout(board: BoardConfig | null): LayoutItem[] {
  return useMemo(() => {
    if (!board) return [];
    return computeBoardLayout(board);
  }, [
    board?.sku,
    board?.visualSeed,
    board?.category,
    board?.size,
    // Stringify selections for deep comparison — these arrays change reference on every render
    JSON.stringify(board?.ingredientSelections),
    JSON.stringify(board?.accoutrementSelections),
  ]); // eslint-disable-line react-hooks/exhaustive-deps
}

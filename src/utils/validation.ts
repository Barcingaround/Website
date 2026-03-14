import type { BoardConfig } from '../store/builderStore';
import { MEATS } from '../data/ingredients/meats';
import { CHEESES } from '../data/ingredients/cheeses';

export interface ValidationResult {
  valid: boolean;
  errors: Array<{ message: string; severity: 'error' | 'warning'; boardId?: string }>;
}

const MEAT_IDS = new Set(MEATS.map(m => m.id));
const CHEESE_IDS = new Set(CHEESES.map(c => c.id));

export function validateOrder(boards: BoardConfig[]): ValidationResult {
  const errors: ValidationResult['errors'] = [];

  if (boards.length === 0) {
    errors.push({ message: 'Please add at least one board.', severity: 'error' });
    return { valid: false, errors };
  }

  for (const board of boards) {
    // HARD BLOCK: no meat on Cheese Only boards
    const hasMeatOnCO = board.category === 'co' &&
      board.ingredientSelections.some(s => MEAT_IDS.has(s.ingredientId));
    if (hasMeatOnCO) {
      errors.push({
        boardId: board.boardId,
        message: 'Cheese Only boards cannot include meat selections.',
        severity: 'error',
      });
    }

    const mainPointsUsed = board.ingredientSelections.reduce((sum, s) => sum + s.pointsAllocated, 0);
    const budgetPct = mainPointsUsed / board.mainPointBudget;

    // WARNING: low budget usage
    if (budgetPct < 0.8) {
      const remaining = board.mainPointBudget - mainPointsUsed;
      errors.push({
        boardId: board.boardId,
        message: `${board.boardName || 'Your board'} has ${remaining} pts unused — your board may have empty space. Add more ingredients?`,
        severity: 'warning',
      });
    }

    // WARNING: no cheese selected
    const hasCheese = board.ingredientSelections.some(s => CHEESE_IDS.has(s.ingredientId));
    if (!hasCheese) {
      errors.push({
        boardId: board.boardId,
        message: 'Every great board needs at least one cheese!',
        severity: 'warning',
      });
    }

    // WARNING: Cheese Only should have ≥3 cheese varieties
    if (board.category === 'co') {
      const cheeseVarietyCount = board.ingredientSelections.filter(
        s => CHEESE_IDS.has(s.ingredientId) && s.pointsAllocated > 0
      ).length;
      if (cheeseVarietyCount < 3) {
        errors.push({
          boardId: board.boardId,
          message: 'Cheese Only boards shine with variety! Try selecting at least 3 different cheeses.',
          severity: 'warning',
        });
      }
    }
  }

  const hasErrors = errors.some(e => e.severity === 'error');
  return { valid: !hasErrors, errors };
}

import { useMemo } from 'react';
import type { BoardConfig } from '../store/builderStore';

export interface PointBudgetState {
  mainPointsUsed: number;
  mainPointsRemaining: number;
  mainBudgetPct: number;
  accsPointsUsed: number;
  accsPointsRemaining: number;
  accsBudgetPct: number;
  isMainFull: boolean;
  isMainWarning: boolean; // >85%
  isAccsFull: boolean;
  canAddMainPoints: (cost: number) => boolean;
  canAddAccsPoints: (cost: number) => boolean;
}

export function usePointBudget(board: BoardConfig): PointBudgetState {
  return useMemo(() => {
    const mainPointsUsed = board.ingredientSelections.reduce(
      (sum, sel) => sum + sel.pointsAllocated, 0
    );
    const accsPointsUsed = board.accoutrementSelections.reduce(
      (sum, sel) => sum + sel.pointsAllocated, 0
    );

    const mainPointsRemaining = board.mainPointBudget - mainPointsUsed;
    const accsPointsRemaining = board.accsBudget - accsPointsUsed;

    const mainBudgetPct = Math.min(100, (mainPointsUsed / board.mainPointBudget) * 100);
    const accsBudgetPct = Math.min(100, (accsPointsUsed / board.accsBudget) * 100);

    return {
      mainPointsUsed,
      mainPointsRemaining,
      mainBudgetPct,
      accsPointsUsed,
      accsPointsRemaining,
      accsBudgetPct,
      isMainFull: mainPointsRemaining <= 0,
      isMainWarning: mainBudgetPct >= 85,
      isAccsFull: accsPointsRemaining <= 0,
      canAddMainPoints: (cost: number) => mainPointsRemaining >= cost,
      canAddAccsPoints: (cost: number) => accsPointsRemaining >= cost,
    };
  }, [board.ingredientSelections, board.accoutrementSelections, board.mainPointBudget, board.accsBudget]);
}

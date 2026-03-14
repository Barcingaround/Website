import { useBuilderStore } from '../store/builderStore';
import type { BoardConfig } from '../store/builderStore';
import { CHEESES } from '../data/ingredients/cheeses';
import { useMemo } from 'react';

export function useBoardState(boardId: string) {
  const boards = useBuilderStore(s => s.boards);
  const updateIngredientPoints = useBuilderStore(s => s.updateIngredientPoints);
  const updateBoardName = useBuilderStore(s => s.updateBoardName);

  const board = boards.find(b => b.boardId === boardId);

  const cheeseVarietyCount = useMemo(() => {
    if (!board) return 0;
    const cheeseIds = new Set(CHEESES.map(c => c.id));
    return board.ingredientSelections.filter(
      s => cheeseIds.has(s.ingredientId) && s.pointsAllocated > 0
    ).length;
  }, [board]);

  function getIngredientPoints(ingredientId: string, isAccoutrement: boolean): number {
    if (!board) return 0;
    const list = isAccoutrement ? board.accoutrementSelections : board.ingredientSelections;
    return list.find(s => s.ingredientId === ingredientId)?.pointsAllocated ?? 0;
  }

  function setIngredientPoints(ingredientId: string, points: number, isAccoutrement: boolean) {
    if (!board) return;
    updateIngredientPoints(board.boardId, ingredientId, Math.max(0, points), isAccoutrement);
  }

  function incrementIngredient(ingredientId: string, cost: number, isAccoutrement: boolean) {
    const current = getIngredientPoints(ingredientId, isAccoutrement);
    setIngredientPoints(ingredientId, current + cost, isAccoutrement);
  }

  function decrementIngredient(ingredientId: string, cost: number, isAccoutrement: boolean) {
    const current = getIngredientPoints(ingredientId, isAccoutrement);
    setIngredientPoints(ingredientId, Math.max(0, current - cost), isAccoutrement);
  }

  return {
    board: board as BoardConfig | undefined,
    cheeseVarietyCount,
    getIngredientPoints,
    setIngredientPoints,
    incrementIngredient,
    decrementIngredient,
    updateBoardName: (name: string) => board && updateBoardName(board.boardId, name),
  };
}

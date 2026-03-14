import { useMemo } from 'react';
import { useBuilderStore } from '../store/builderStore';

export function useOrderState() {
  const boards = useBuilderStore(s => s.boards);
  const addOns = useBuilderStore(s => s.addOns);

  const boardsTotal = useMemo(
    () => boards.reduce((sum, b) => sum + b.price, 0),
    [boards]
  );

  const addOnsTotal = useMemo(
    () => addOns.reduce((sum, a) => sum + a.price * a.quantity, 0),
    [addOns]
  );

  const orderTotal = boardsTotal + addOnsTotal;

  const hasUnconfirmedPrices = boards.some(b => !b.priceConfirmed);

  const boardCount = boards.length;

  return {
    boards,
    addOns,
    boardsTotal,
    addOnsTotal,
    orderTotal,
    hasUnconfirmedPrices,
    boardCount,
  };
}

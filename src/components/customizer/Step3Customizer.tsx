import { useState } from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { useBoardState } from '../../hooks/useBoardState';
import { usePointBudget } from '../../hooks/usePointBudget';
import CustomizerHeader from './CustomizerHeader';
import IngredientTabs from './IngredientTabs';
import LiveBoardCanvas from '../canvas/LiveBoardCanvas';
import DietaryFilters from './DietaryFilters';
import SurpriseMeButton from './SurpriseMeButton';
import { ToastContainer } from '../shared/Toast';
import styles from './Step3Customizer.module.css';

interface ToastItem { id: string; message: string; type?: 'info' | 'warning' | 'error' | 'success' }

export default function Step3Customizer() {
  const boards = useBuilderStore(s => s.boards);
  const currentBoardIndex = useBuilderStore(s => s.currentBoardIndex);
  const setCurrentBoardIndex = useBuilderStore(s => s.setCurrentBoardIndex);
  const setStep = useBuilderStore(s => s.setStep);
  const dietaryFilters = useBuilderStore(s => s.dietaryFilters);
  const setDietaryFilter = useBuilderStore(s => s.setDietaryFilter);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const currentBoard = boards[currentBoardIndex];

  const {
    cheeseVarietyCount,
    getIngredientPoints,
    incrementIngredient,
    decrementIngredient,
    updateBoardName,
  } = useBoardState(currentBoard?.boardId ?? '');

  const budget = usePointBudget(currentBoard ?? {
    boardId: '', sku: 'cc_small', category: 'cc', size: 'small',
    boardName: '', boardNumber: 1, mainPointBudget: 0, accsBudget: 0,
    ingredientSelections: [], accoutrementSelections: [],
    visualSeed: 42, visualSnapshot: null, price: 0, priceConfirmed: false,
  });

  function addToast(message: string, type: ToastItem['type'] = 'info') {
    const id = Date.now().toString();
    setToasts(t => [...t, { id, message, type }]);
  }

  function removeToast(id: string) {
    setToasts(t => t.filter(x => x.id !== id));
  }

  function handleIncrement(ingredientId: string, cost: number, isAcc: boolean) {
    if (isAcc ? !budget.canAddAccsPoints(cost) : !budget.canAddMainPoints(cost)) {
      addToast("You're out of points! Remove something first.", 'warning');
      return;
    }
    incrementIngredient(ingredientId, cost, isAcc);
  }

  function handleDecrement(ingredientId: string, cost: number, isAcc: boolean) {
    decrementIngredient(ingredientId, cost, isAcc);
  }

  function handleNext() {
    if (currentBoardIndex < boards.length - 1) {
      setCurrentBoardIndex(currentBoardIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setStep(4);
    }
  }

  function handleBack() {
    if (currentBoardIndex > 0) {
      setCurrentBoardIndex(currentBoardIndex - 1);
    } else {
      setStep(2);
    }
  }

  if (!currentBoard) {
    return <div>No board configured. <button onClick={() => setStep(1)}>Start over</button></div>;
  }

  const isLastBoard = currentBoardIndex === boards.length - 1;

  return (
    <div className={styles.layout}>
      {/* Sticky customizer header */}
      <CustomizerHeader
        board={currentBoard}
        mainPointsUsed={budget.mainPointsUsed}
        accsPointsUsed={budget.accsPointsUsed}
        cheeseVarietyCount={cheeseVarietyCount}
        boardCount={boards.length}
        currentIndex={currentBoardIndex}
        onNameChange={updateBoardName}
      />

      <div className={styles.body}>
        {/* Left panel — ingredient selection */}
        <div className={styles.leftPanel}>
          <div className={styles.toolbarRow}>
            <DietaryFilters filters={dietaryFilters} onChange={setDietaryFilter} />
            <SurpriseMeButton board={currentBoard} />
          </div>

          <div className={styles.tabsWrapper}>
            <IngredientTabs
              board={currentBoard}
              dietaryFilters={dietaryFilters}
              getPoints={(id, isAcc) => getIngredientPoints(id, isAcc)}
              canAdd={(cost, isAcc) => isAcc ? budget.canAddAccsPoints(cost) : budget.canAddMainPoints(cost)}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
            />
          </div>

          {/* Navigation */}
          <div className={styles.navRow}>
            <button type="button" className={styles.btnBack} onClick={handleBack}>← Back</button>
            <button type="button" className={styles.btnNext} onClick={handleNext}>
              {isLastBoard ? 'Review Add-Ons →' : `Next Board (${currentBoardIndex + 2} of ${boards.length}) →`}
            </button>
          </div>
        </div>

        {/* Right panel — live board visual (desktop) */}
        <div className={styles.rightPanel}>
          <div className={styles.boardVisualPanel}>
            <div className={styles.boardPanelLabel} aria-hidden="true">Your Board</div>
            <LiveBoardCanvas
              board={currentBoard}
              className={styles.canvasWrapper}
            />
            <button
              type="button"
              className={styles.downloadBtn}
              aria-label="Download board preview image"
            >
              ↓ Preview
            </button>
          </div>
        </div>
      </div>

      {/* Mobile — sticky bottom drawer */}
      <div className={`${styles.mobileDrawer} ${mobileDrawerOpen ? styles.mobileDrawerOpen : ''}`}>
        <button
          type="button"
          className={styles.drawerHandle}
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          aria-expanded={mobileDrawerOpen}
          aria-label={mobileDrawerOpen ? 'Hide board preview' : 'See your board'}
        >
          {mobileDrawerOpen ? '↓ Hide Board' : '↑ See Your Board'}
        </button>
        {mobileDrawerOpen && (
          <LiveBoardCanvas board={currentBoard} className={styles.mobileCanvas} />
        )}
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

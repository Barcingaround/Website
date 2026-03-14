import { useState } from 'react';
import type { BoardConfig } from '../../store/builderStore';
import PointBudgetBar from './PointBudgetBar';
import styles from './CustomizerHeader.module.css';

interface CustomizerHeaderProps {
  board: BoardConfig;
  mainPointsUsed: number;
  accsPointsUsed: number;
  cheeseVarietyCount: number;
  boardCount: number;
  currentIndex: number;
  onNameChange: (name: string) => void;
  onDuplicate?: () => void;
}

export default function CustomizerHeader({
  board,
  mainPointsUsed,
  accsPointsUsed,
  cheeseVarietyCount,
  boardCount,
  currentIndex,
  onNameChange,
  onDuplicate,
}: CustomizerHeaderProps) {
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(board.boardName);

  function commitName() {
    setEditingName(false);
    if (nameValue.trim()) onNameChange(nameValue.trim());
    else setNameValue(board.boardName);
  }

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        {/* Category badge */}
        <div className={styles.typeBadge}>
          <span>{board.category === 'cc' ? '🧀🥩' : '🧀'}</span>
          <span>{board.category === 'cc' ? 'Cheese & Charcuterie' : 'Cheese Only'}</span>
          <span className={styles.sizePill}>{board.size.charAt(0).toUpperCase() + board.size.slice(1)}</span>
        </div>

        {/* Board count indicator */}
        {boardCount > 1 && (
          <div className={styles.boardCount}>
            Board {currentIndex + 1} of {boardCount}
          </div>
        )}
      </div>

      {/* Board name */}
      <div className={styles.nameRow}>
        {editingName ? (
          <input
            type="text"
            className={styles.nameInput}
            value={nameValue}
            onChange={e => setNameValue(e.target.value)}
            onBlur={commitName}
            onKeyDown={e => { if (e.key === 'Enter') commitName(); if (e.key === 'Escape') { setEditingName(false); setNameValue(board.boardName); } }}
            maxLength={60}
            autoFocus
            aria-label="Board name"
          />
        ) : (
          <button
            type="button"
            className={styles.nameDisplay}
            onClick={() => setEditingName(true)}
            aria-label={`Board name: ${board.boardName}. Click to edit.`}
          >
            <span>{board.boardName}</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className={styles.editIcon}>
              <path d="M10 2l2 2-7 7H3V9l7-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {onDuplicate && (
          <button type="button" className={styles.duplicateBtn} onClick={onDuplicate}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <rect x="1" y="3" width="9" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M4 3V2a1 1 0 011-1h7a1 1 0 011 1v9a1 1 0 01-1 1h-1" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Duplicate from…
          </button>
        )}
      </div>

      {/* Budget bars */}
      <div className={styles.budgetSection}>
        <PointBudgetBar used={mainPointsUsed} total={board.mainPointBudget} label="Ingredients" />
        <PointBudgetBar used={accsPointsUsed} total={board.accsBudget} label="Accoutrements" isAccoutrements />
      </div>

      {/* Cheese variety counter (CO only) */}
      {board.category === 'co' && (
        <div className={styles.cheeseCounter} aria-live="polite">
          <span
            className={`${styles.cheeseDots} ${cheeseVarietyCount >= 3 ? styles.cheeseDotsGood : ''}`}
            aria-label={`${cheeseVarietyCount} of 5 cheese varieties selected`}
          >
            {[1,2,3,4,5].map(i => (
              <span key={i} className={`${styles.cheeseDot} ${i <= cheeseVarietyCount ? styles.cheeseDotFilled : ''}`} aria-hidden="true" />
            ))}
          </span>
          <span className={styles.cheeseLabel}>
            {cheeseVarietyCount} / 5 cheese varieties
            {cheeseVarietyCount < 3 && <span className={styles.cheeseHint}> — add more for variety!</span>}
          </span>
        </div>
      )}
    </header>
  );
}

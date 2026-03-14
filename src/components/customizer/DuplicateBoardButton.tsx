import React from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { trackBoardDuplicated } from '../../utils/analytics';
import styles from './DuplicateBoardButton.module.css';

interface DuplicateBoardButtonProps {
  boardId: string;
}

export function DuplicateBoardButton({ boardId }: DuplicateBoardButtonProps): React.ReactElement {
  const { boards, duplicateBoard } = useBuilderStore(s => ({
    boards: s.boards,
    duplicateBoard: s.duplicateBoard,
  }));

  const board = boards.find(b => b.boardId === boardId);

  function handleDuplicate() {
    duplicateBoard(boardId);
    if (board) trackBoardDuplicated(board.sku);
  }

  return (
    <button
      type="button"
      className={styles.btn}
      onClick={handleDuplicate}
      aria-label="Duplicate this board"
      title="Add another board with the same ingredients"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="5" y="5" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11 5V3a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      Duplicate Board
    </button>
  );
}

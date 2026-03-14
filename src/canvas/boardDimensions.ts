import type { BoardSKU } from '../data/boardSizes';

export interface BoardDimensions {
  viewBox: string;
  width: number;
  height: number;
  shape: 'circle' | 'rectangle';
  rx?: number;
  radius?: number;
  cx?: number;
  cy?: number;
}

export const BOARD_DIMENSIONS: Record<BoardSKU, BoardDimensions> = {
  cc_small: {
    viewBox: '0 0 600 600',
    width: 600,
    height: 600,
    shape: 'circle',
    radius: 280,
    cx: 300,
    cy: 300,
  },
  cc_medium: {
    viewBox: '0 0 800 560',
    width: 800,
    height: 560,
    shape: 'rectangle',
    rx: 16,
  },
  cc_large: {
    viewBox: '0 0 960 660',
    width: 960,
    height: 660,
    shape: 'rectangle',
    rx: 16,
  },
  co_small: {
    viewBox: '0 0 720 520',
    width: 720,
    height: 520,
    shape: 'rectangle',
    rx: 16,
  },
  co_medium: {
    viewBox: '0 0 800 560',
    width: 800,
    height: 560,
    shape: 'rectangle',
    rx: 16,
  },
  co_large: {
    viewBox: '0 0 960 660',
    width: 960,
    height: 660,
    shape: 'rectangle',
    rx: 16,
  },
};

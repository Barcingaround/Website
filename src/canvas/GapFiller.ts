/**
 * Gap Filler — post-process pass that places tiny microgreen tufts into
 * uncovered areas to suggest fresh garnish.
 *
 * Coverage target is intentionally low (45%) — boards should breathe.
 * The wood grain is meant to be visible. We no longer carpet the board
 * with herb sprigs; instead we scatter subtle microgreen dot-clusters
 * only into genuinely empty voids.
 */

import type { LayoutItem, SVGElementDescriptor } from './IngredientDrawers';
import type { Zone } from './ZoneEngine';

const GRID_COLS = 20;
const GRID_ROWS = 20;
const TARGET_COVERAGE = 0.45;   // 45% — breathing room is intentional
const MIN_GAP_SIZE = 60;        // px — only fill large empty voids
const MAX_FILL_ELEMENTS = 8;    // hard cap regardless of coverage

interface CoverageGrid {
  cells: boolean[][];
  cellW: number;
  cellH: number;
  boardW: number;
  boardH: number;
}

function buildCoverageGrid(
  items: LayoutItem[],
  boardW: number,
  boardH: number
): CoverageGrid {
  const cellW = boardW / GRID_COLS;
  const cellH = boardH / GRID_ROWS;

  const cells: boolean[][] = Array.from({ length: GRID_ROWS }, () =>
    new Array(GRID_COLS).fill(false)
  );

  for (const item of items) {
    const colStart = Math.max(0, Math.floor(item.x / cellW));
    const colEnd   = Math.min(GRID_COLS - 1, Math.floor((item.x + item.width) / cellW));
    const rowStart = Math.max(0, Math.floor(item.y / cellH));
    const rowEnd   = Math.min(GRID_ROWS - 1, Math.floor((item.y + item.height) / cellH));

    for (let row = rowStart; row <= rowEnd; row++) {
      for (let col = colStart; col <= colEnd; col++) {
        cells[row][col] = true;
      }
    }
  }

  return { cells, cellW, cellH, boardW, boardH };
}

function computeCoverage(grid: CoverageGrid): number {
  let covered = 0;
  for (const row of grid.cells) {
    for (const cell of row) {
      if (cell) covered++;
    }
  }
  return covered / (GRID_COLS * GRID_ROWS);
}

function findGapCenters(grid: CoverageGrid): Array<{ x: number; y: number }> {
  const gaps: Array<{ x: number; y: number }> = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      if (!grid.cells[row][col]) {
        const cx = (col + 0.5) * grid.cellW;
        const cy = (row + 0.5) * grid.cellH;
        if (grid.cellW >= MIN_GAP_SIZE || grid.cellH >= MIN_GAP_SIZE) {
          gaps.push({ x: cx, y: cy });
        }
      }
    }
  }
  return gaps;
}

/**
 * Draw a small cluster of microgreen dots — subtle, organic, not a full sprig.
 * Returns a LayoutItem with tiny circles in deep green.
 */
function drawMicrogreenTuft(id: string, cx: number, cy: number, rng: () => number): LayoutItem {
  const count = 5 + Math.floor(rng() * 5); // 5–9 dots
  const elements: SVGElementDescriptor[] = [];

  for (let i = 0; i < count; i++) {
    const dx = (rng() - 0.5) * 14;
    const dy = (rng() - 0.5) * 10;
    const r  = 1.5 + rng() * 1.5;
    const dotColor = rng() > 0.5 ? '#3A6830' : '#5A8840';
    elements.push({
      type: 'circle',
      attrs: {
        cx: dx,
        cy: dy,
        r,
        fill: dotColor,
        opacity: 0.55 + rng() * 0.2,
      },
    });
  }

  const tuftW = 20;
  const tuftH = 16;
  return {
    id,
    ingredientId: 'microgreen_tuft',
    renderStyle: 'microgreen_tuft',
    x: cx - tuftW / 2,
    y: cy - tuftH / 2,
    width: tuftW,
    height: tuftH,
    rotation: (rng() - 0.5) * 40,
    zIndex: 1,
    elements,
  };
}

/**
 * Fills coverage gaps with microgreen tufts.
 * Returns additional LayoutItems to append to the layout.
 */
export function fillGaps(
  existingItems: LayoutItem[],
  boardW: number,
  boardH: number,
  garnishZone: Zone | undefined,
  rng: () => number
): LayoutItem[] {
  const fillerItems: LayoutItem[] = [];

  const grid = buildCoverageGrid(existingItems, boardW, boardH);
  const coverage = computeCoverage(grid);

  if (coverage >= TARGET_COVERAGE) return [];

  const gaps = findGapCenters(grid);
  if (gaps.length === 0) return [];

  const shuffled = [...gaps].sort(() => rng() - 0.5);

  let idx = 2000;
  let count = 0;

  for (const gap of shuffled) {
    if (count >= MAX_FILL_ELEMENTS) break;

    const x = garnishZone
      ? Math.max(garnishZone.x + 8, Math.min(garnishZone.x + garnishZone.w - 8, gap.x))
      : gap.x;
    const y = garnishZone
      ? Math.max(garnishZone.y + 8, Math.min(garnishZone.y + garnishZone.h - 8, gap.y))
      : gap.y;

    fillerItems.push(drawMicrogreenTuft(`mg_tuft_${idx++}`, x, y, rng));
    count++;
  }

  return fillerItems;
}

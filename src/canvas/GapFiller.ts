/**
 * Gap Filler — post-process pass that scatters rosemary/microgreens into
 * uncovered areas until >95% of board surface is visually covered.
 *
 * Coverage map: 20×20 grid of cells. A cell is "covered" if any LayoutItem's
 * bounding box overlaps it. Cells with coverage < 95% get a herb sprig added.
 */

import type { LayoutItem } from './IngredientDrawers';
import { drawHerbSprig } from './IngredientDrawers';
import type { Zone } from './ZoneEngine';

const GRID_COLS = 20;
const GRID_ROWS = 20;
const TARGET_COVERAGE = 0.95;
const MIN_GAP_SIZE = 30; // px — gaps smaller than this are ignored

interface CoverageGrid {
  cells: boolean[][];
  cellW: number;
  cellH: number;
  boardX: number;
  boardY: number;
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

  // Initialize all cells as uncovered
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

  return { cells, cellW, cellH, boardX: 0, boardY: 0, boardW, boardH };
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

/** Find uncovered zones large enough to place a sprig (≥ MIN_GAP_SIZE) */
function findGapCenters(grid: CoverageGrid): Array<{ x: number; y: number }> {
  const gaps: Array<{ x: number; y: number }> = [];

  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      if (!grid.cells[row][col]) {
        const cx = (col + 0.5) * grid.cellW;
        const cy = (row + 0.5) * grid.cellH;
        // Only consider gaps large enough
        if (grid.cellW >= MIN_GAP_SIZE || grid.cellH >= MIN_GAP_SIZE) {
          gaps.push({ x: cx, y: cy });
        }
      }
    }
  }

  return gaps;
}

/**
 * Fills coverage gaps with herb sprigs.
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

  let grid = buildCoverageGrid(existingItems, boardW, boardH);
  let coverage = computeCoverage(grid);

  if (coverage >= TARGET_COVERAGE) return [];

  const gaps = findGapCenters(grid);
  if (gaps.length === 0) return [];

  // Shuffle gaps so we fill randomly
  const shuffled = [...gaps].sort(() => rng() - 0.5);

  let sprigIndex = 1000; // offset to avoid ID collision with BoardRenderer sprigs

  for (const gap of shuffled) {
    if (coverage >= TARGET_COVERAGE) break;

    // Clamp to garnish zone if defined
    const x = garnishZone
      ? Math.max(garnishZone.x + 5, Math.min(garnishZone.x + garnishZone.w - 5, gap.x))
      : gap.x;
    const y = garnishZone
      ? Math.max(garnishZone.y + 5, Math.min(garnishZone.y + garnishZone.h - 5, gap.y))
      : gap.y;

    const rot = (rng() - 0.5) * 160;
    const color = rng() > 0.5 ? '#4A7A30' : '#6A9A40'; // rosemary vs microgreens tint
    const sprig = drawHerbSprig(`gap_fill_${sprigIndex++}`, x, y, rot, color);
    fillerItems.push(sprig);

    // Mark cell as covered
    const col = Math.min(GRID_COLS - 1, Math.floor(x / grid.cellW));
    const row = Math.min(GRID_ROWS - 1, Math.floor(y / grid.cellH));
    grid.cells[row][col] = true;
    coverage = computeCoverage(grid);
  }

  return fillerItems;
}

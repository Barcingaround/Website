/**
 * URL state encoder/decoder — base64 encodes board config for share links.
 * Format: /build-your-board?board=<base64(JSON)>
 *
 * Only serializes the minimal subset needed to reconstruct a board:
 * sku, ingredientSelections, accoutrementSelections, visualSeed, name
 */

import type { BoardConfig, IngredientSelection } from '../store/builderStore';

interface SerializedBoard {
  sku: string;
  s: Array<[string, number]>; // [ingredientId, pointsAllocated]
  a: Array<[string, number]>; // accoutrements
  seed: number;
  name?: string;
}

export function encodeBoardConfig(board: BoardConfig): string {
  const payload: SerializedBoard = {
    sku: board.sku,
    s: board.ingredientSelections.map(sel => [sel.ingredientId, sel.pointsAllocated]),
    a: board.accoutrementSelections.map(sel => [sel.ingredientId, sel.pointsAllocated]),
    seed: board.visualSeed,
    name: board.name,
  };
  return btoa(JSON.stringify(payload));
}

export function decodeBoardConfig(encoded: string): Partial<BoardConfig> | null {
  try {
    const payload = JSON.parse(atob(encoded)) as SerializedBoard;
    const toSel = (pair: [string, number]): IngredientSelection => ({
      ingredientId: pair[0],
      pointsAllocated: pair[1],
    });
    return {
      sku: payload.sku,
      ingredientSelections: payload.s.map(toSel),
      accoutrementSelections: payload.a.map(toSel),
      visualSeed: payload.seed,
      name: payload.name,
    };
  } catch {
    return null;
  }
}

/** Generate a shareable URL for the current board */
export function buildShareUrl(board: BoardConfig): string {
  const encoded = encodeBoardConfig(board);
  const base = window.location.origin;
  return `${base}/build-your-board?board=${encodeURIComponent(encoded)}`;
}

/** Read board config from current URL search params (if present) */
export function readBoardFromUrl(): Partial<BoardConfig> | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('board');
  if (!encoded) return null;
  return decodeBoardConfig(encoded);
}

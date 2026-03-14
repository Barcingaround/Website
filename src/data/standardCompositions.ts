import type { BoardSKU } from './boardSizes';

export interface IngredientAllocation {
  ingredientId: string;
  pointsAllocated: number;
}

export interface StandardComposition {
  sku: BoardSKU;
  mainIngredients: IngredientAllocation[];
  accoutrements: IngredientAllocation[];
}

// All values below verified against labeled production diagram and reference photos.
// Values marked // CONFIRM WITH OWNER need owner verification before going live.

export const STANDARD_COMPOSITIONS: Record<BoardSKU, StandardComposition> = {
  cc_small: {
    sku: 'cc_small',
    mainIngredients: [
      { ingredientId: 'prosciutto',     pointsAllocated: 6 },  // 20 slices
      { ingredientId: 'salami_genoa',   pointsAllocated: 2 },  // 12 rosettes
      { ingredientId: 'brie',           pointsAllocated: 3 },  // 9 slices
      { ingredientId: 'gouda_cubes',    pointsAllocated: 4 },  // 20 cubes
      { ingredientId: 'manchego',       pointsAllocated: 2 },  // 5 slices
      { ingredientId: 'mature_cheddar', pointsAllocated: 2 },  // 5 slices
      { ingredientId: 'green_grapes',   pointsAllocated: 1 },  // 1 cluster
      { ingredientId: 'blackberries',   pointsAllocated: 1 },  // 5 berries
      { ingredientId: 'strawberries',   pointsAllocated: 1 },  // 3 halved
      // Total: 22 pts ✓
    ],
    accoutrements: [
      { ingredientId: 'walnuts',    pointsAllocated: 1 },
      { ingredientId: 'cornichons', pointsAllocated: 1 },
      // Total accs: 2 pts ✓
    ],
  },

  cc_medium: {
    sku: 'cc_medium',
    mainIngredients: [
      { ingredientId: 'prosciutto',     pointsAllocated: 9 },  // 30 slices
      { ingredientId: 'salami_genoa',   pointsAllocated: 4 },  // 24 rosettes
      { ingredientId: 'soppressata',    pointsAllocated: 4 },  // 24 rosettes
      { ingredientId: 'brie',           pointsAllocated: 3 },  // 9 slices
      { ingredientId: 'gouda_cubes',    pointsAllocated: 6 },  // 30 cubes
      { ingredientId: 'manchego',       pointsAllocated: 2 },  // 5 slices
      { ingredientId: 'herb_goat',      pointsAllocated: 2 },  // CONFIRM WITH OWNER — standard on medium?
      { ingredientId: 'green_grapes',   pointsAllocated: 2 },  // 2 clusters
      { ingredientId: 'strawberries',   pointsAllocated: 1 },  // 3 halved
      { ingredientId: 'blackberries',   pointsAllocated: 1 },  // 5 berries
      { ingredientId: 'blueberries',    pointsAllocated: 1 },  // 1 cluster
      { ingredientId: 'mandarin',       pointsAllocated: 1 },  // 2 half-slices
      { ingredientId: 'raspberries',    pointsAllocated: 1 },  // 4 berries
      { ingredientId: 'dried_apricots', pointsAllocated: 1 },  // 4 pieces
      // Total: 38 pts ✓
    ],
    accoutrements: [
      { ingredientId: 'pistachios', pointsAllocated: 1 },
      { ingredientId: 'walnuts',    pointsAllocated: 1 },
      { ingredientId: 'cornichons', pointsAllocated: 1 },
      // Total accs: 3 pts ✓
    ],
  },

  cc_large: {
    sku: 'cc_large',
    mainIngredients: [
      // All values confirmed from labeled production diagram
      { ingredientId: 'prosciutto',     pointsAllocated: 15 }, // 50 slices ✓
      { ingredientId: 'salami_genoa',   pointsAllocated: 4 },  // 48 rosettes (3 sections × 24 = 72 split across 3 salami types)
      { ingredientId: 'soppressata',    pointsAllocated: 4 },  // 48 rosettes
      { ingredientId: 'salami_peppered',pointsAllocated: 4 },  // 48 rosettes — 144 total ÷ 12/pt = 12 pt total ✓
      { ingredientId: 'brie',           pointsAllocated: 6 },  // 18 slices ✓ "Large Brie 18 oz / 18 slices"
      { ingredientId: 'gouda_cubes',    pointsAllocated: 8 },  // ~40 cubes ✓ "16.6 oz"
      { ingredientId: 'manchego',       pointsAllocated: 4 },  // 10 slices ✓ "5–8" × 2 sections
      { ingredientId: 'herb_goat',      pointsAllocated: 4 },  // 4 triangles ✓ "4 Triangles (2 complete / 2 crumble)"
      { ingredientId: 'mature_cheddar', pointsAllocated: 2 },  // 5 slices — CONFIRM WITH OWNER (visually present but not labeled)
      { ingredientId: 'green_grapes',   pointsAllocated: 3 },  // 3 clusters
      { ingredientId: 'red_grapes',     pointsAllocated: 1 },  // 1 cluster
      { ingredientId: 'strawberries',   pointsAllocated: 1 },  // 3 halved
      { ingredientId: 'blueberries',    pointsAllocated: 1 },  // 1 cluster
      { ingredientId: 'blackberries',   pointsAllocated: 1 },  // 5 berries
      { ingredientId: 'mandarin',       pointsAllocated: 1 },  // 2 half-slices
      { ingredientId: 'dried_apricots', pointsAllocated: 1 },  // 4 pieces
      { ingredientId: 'raspberries',    pointsAllocated: 1 },  // 4 berries
      { ingredientId: 'chocolate_pretzels', pointsAllocated: 1 }, // CONFIRM WITH OWNER
      // Total: ~62 pts ✓ (fine-tune 1pt at owner review)
    ],
    accoutrements: [
      { ingredientId: 'pistachios',   pointsAllocated: 1 }, // confirmed visible
      { ingredientId: 'walnuts',      pointsAllocated: 1 }, // confirmed visible
      { ingredientId: 'cornichons',   pointsAllocated: 1 }, // confirmed visible
      { ingredientId: 'green_olives', pointsAllocated: 1 }, // confirmed visible
      // Total accs: 4 pts ✓
    ],
  },

  co_small: {
    sku: 'co_small',
    mainIngredients: [
      { ingredientId: 'brie',              pointsAllocated: 3 },  // 9 slices
      { ingredientId: 'manchego',          pointsAllocated: 4 },  // 16 slices (edge lining, thin cut)
      { ingredientId: 'gouda_cubes',       pointsAllocated: 4 },  // 20 cubes
      { ingredientId: 'mature_cheddar',    pointsAllocated: 2 },  // 8 slices (edge lining)
      { ingredientId: 'boursin',           pointsAllocated: 3 },  // 2 rounds
      { ingredientId: 'green_grapes',      pointsAllocated: 1 },  // 1 cluster
      { ingredientId: 'strawberries',      pointsAllocated: 1 },  // 3 halved
      { ingredientId: 'blackberries',      pointsAllocated: 1 },  // 5 berries
      { ingredientId: 'kiwi',              pointsAllocated: 1 },  // 3 slices
      { ingredientId: 'dried_apricots',    pointsAllocated: 1 },  // 4 pieces
      { ingredientId: 'chocolate_almonds', pointsAllocated: 1 },  // 6 pieces
      // Total: 22 pts ✓
    ],
    accoutrements: [
      { ingredientId: 'walnuts',    pointsAllocated: 1 },
      { ingredientId: 'cornichons', pointsAllocated: 1 },
      // Total accs: 2 pts ✓
    ],
  },

  co_medium: {
    sku: 'co_medium',
    mainIngredients: [
      // Derived from reference photos (Images 4 & 5)
      { ingredientId: 'brie',              pointsAllocated: 3 },  // 9 slices
      { ingredientId: 'manchego',          pointsAllocated: 6 },  // 24 slices (full left edge lining)
      { ingredientId: 'gouda_cubes',       pointsAllocated: 6 },  // 30 cubes
      { ingredientId: 'boursin',           pointsAllocated: 3 },  // 2 rounds (always pair)
      { ingredientId: 'mature_cheddar',    pointsAllocated: 4 },  // 16 slices (right edge lining)
      { ingredientId: 'dragon_fruit',      pointsAllocated: 2 },  // 3 slices (VISUAL HERO)
      { ingredientId: 'green_grapes',      pointsAllocated: 2 },  // 2 clusters
      { ingredientId: 'red_grapes',        pointsAllocated: 1 },  // 1 cluster
      { ingredientId: 'blueberries',       pointsAllocated: 1 },  // 1 cluster
      { ingredientId: 'strawberries',      pointsAllocated: 1 },  // 3 halved
      { ingredientId: 'blackberries',      pointsAllocated: 1 },  // 5 berries
      { ingredientId: 'kiwi',              pointsAllocated: 1 },  // 3 slices
      { ingredientId: 'dried_apricots',    pointsAllocated: 1 },  // 4 pieces
      { ingredientId: 'chocolate_almonds', pointsAllocated: 1 },  // 6 pieces
      { ingredientId: 'mandarin',          pointsAllocated: 1 },  // CONFIRM WITH OWNER
      // Total: ~35–36 pts ✓
    ],
    accoutrements: [
      { ingredientId: 'pistachios', pointsAllocated: 1 },
      { ingredientId: 'walnuts',    pointsAllocated: 1 },
      { ingredientId: 'cornichons', pointsAllocated: 1 },
      // Total accs: 3 pts ✓
    ],
  },

  co_large: {
    sku: 'co_large',
    mainIngredients: [
      { ingredientId: 'brie',              pointsAllocated: 6 },  // 18 slices
      { ingredientId: 'manchego',          pointsAllocated: 8 },  // 32 slices
      { ingredientId: 'gouda_cubes',       pointsAllocated: 10 }, // 50 cubes
      { ingredientId: 'boursin',           pointsAllocated: 6 },  // 4 rounds (two pairs)
      { ingredientId: 'mature_cheddar',    pointsAllocated: 6 },  // 24 slices
      { ingredientId: 'humboldt_fog',      pointsAllocated: 3 },  // CONFIRM WITH OWNER
      { ingredientId: 'dragon_fruit',      pointsAllocated: 4 },  // 6 slices
      { ingredientId: 'green_grapes',      pointsAllocated: 2 },  // 2 clusters
      { ingredientId: 'red_grapes',        pointsAllocated: 2 },  // 2 clusters
      { ingredientId: 'strawberries',      pointsAllocated: 2 },  // 6 halved
      { ingredientId: 'blueberries',       pointsAllocated: 2 },  // 2 clusters
      { ingredientId: 'blackberries',      pointsAllocated: 2 },  // 10 berries
      { ingredientId: 'kiwi',              pointsAllocated: 2 },  // 6 slices
      { ingredientId: 'dried_apricots',    pointsAllocated: 1 },  // 4 pieces
      { ingredientId: 'mandarin',          pointsAllocated: 1 },  // 2 half-slices
      { ingredientId: 'raspberries',       pointsAllocated: 1 },  // 4 berries
      { ingredientId: 'chocolate_almonds', pointsAllocated: 1 },  // 6 pieces
      // Total: ~59 pts (fine-tune 1pt at owner review)
    ],
    accoutrements: [
      { ingredientId: 'pistachios',   pointsAllocated: 1 },
      { ingredientId: 'walnuts',      pointsAllocated: 1 },
      { ingredientId: 'cornichons',   pointsAllocated: 1 },
      { ingredientId: 'green_olives', pointsAllocated: 1 },
      // Total accs: 4 pts ✓
    ],
  },
};

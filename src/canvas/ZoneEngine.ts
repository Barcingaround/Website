import type { BoardSKU } from '../data/boardSizes';

export interface Zone {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ZoneMap {
  // ── Legacy zones (kept for compatibility) ────────────────────────────────
  TOP_SWEEP?: Zone;
  LEFT_FLANK?: Zone;
  RIGHT_FLANK?: Zone;
  UPPER_LEFT_FAN?: Zone;
  UPPER_RIGHT_CORNER?: Zone;
  CENTER_MOUND?: Zone;
  CENTER_UPPER?: Zone;
  SALAMI_BAND?: Zone;
  LOWER_LEFT?: Zone;
  LOWER_CENTER?: Zone;
  LOWER_RIGHT?: Zone;
  LOWER_RIGHT_FAN?: Zone;
  LOWER_ARC?: Zone;
  LOWER_LEFT_ANCHOR?: Zone;
  RIGHT_CENTER?: Zone;
  LEFT_EDGE_LINING?: Zone;
  RIGHT_EDGE_LINING?: Zone;
  ACCENT_SCATTER?: Zone;
  GARNISH_SCATTER?: Zone;
  JAR_PLACEMENT?: Zone;

  // ── Artisan composition zones ─────────────────────────────────────────────
  // Fan meats (prosciutto/serrano/coppa) — each gets its own slot
  MEAT_PRIMARY?: Zone;     // upper-left — first/only fan meat
  MEAT_SECONDARY?: Zone;   // upper-right — second fan meat
  MEAT_TERTIARY?: Zone;    // left-side mid — third fan meat

  // Salami rosette clusters — each variety gets its own slot
  SALAMI_ZONE_1?: Zone;    // mid-left cluster
  SALAMI_ZONE_2?: Zone;    // center cluster
  SALAMI_ZONE_3?: Zone;    // mid-right cluster
  SALAMI_ZONE_4?: Zone;    // lower-left cluster (4th variety)

  // Cheese zones — each cheese anchored to its own area
  BRIE_ZONE?: Zone;
  MANCHEGO_ZONE?: Zone;
  GOUDA_ZONE?: Zone;
  CHEDDAR_ZONE?: Zone;
  SOFT_CHEESE_ZONE?: Zone;

  // Fruit accent zones
  FRUIT_UPPER_RIGHT?: Zone;
  FRUIT_LOWER_LEFT?: Zone;
  FRUIT_SCATTER?: Zone;

  // Small accoutrements
  ACCS_LOWER?: Zone;

  // Jar anchor
  JAR_ZONE?: Zone;

  [key: string]: Zone | undefined;
}

/**
 * Artisan zone layout for a reference 800×560 rectangle.
 * Zones are designed for a "diagonal cascade" composition:
 *   - Meats: upper corners, fan across top
 *   - Cheeses: left-flank, right-flank, and center
 *   - Salamis: mid-board clusters, spread diagonally
 *   - Fruits: accent pops in corners and between items
 *   - Accoutrements: lower center fill
 *   - Jars: lower-right anchor
 * Board wood grain is intentionally visible (~45% negative space).
 */
function makeRectZones(W: number, H: number): ZoneMap {
  const sx = W / 800;
  const sy = H / 560;
  function z(x: number, y: number, w: number, h: number): Zone {
    return { x: x * sx, y: y * sy, w: w * sx, h: h * sy };
  }

  return {
    // ── Legacy / backwards-compat ──────────────────────────────────────────
    TOP_SWEEP:           z(0,   0,   800, 110),
    LEFT_FLANK:          z(0,   110, 130, 450),
    RIGHT_FLANK:         z(670, 110, 130, 450),
    UPPER_LEFT_FAN:      z(0,   110, 200, 180),
    UPPER_RIGHT_CORNER:  z(580, 110, 220, 200),
    CENTER_UPPER:        z(130, 110, 540, 130),
    CENTER_MOUND:        z(200, 130, 400, 240),
    SALAMI_BAND:         z(130, 280, 540, 130),
    LOWER_LEFT:          z(0,   360, 200, 200),
    LOWER_CENTER:        z(200, 390, 400, 170),
    LOWER_RIGHT:         z(550, 350, 250, 210),
    LOWER_RIGHT_FAN:     z(570, 370, 230, 180),
    LOWER_ARC:           z(130, 480, 540,  80),
    LOWER_LEFT_ANCHOR:   z(20,  380, 180, 180),
    RIGHT_CENTER:        z(610, 260, 180, 180),
    LEFT_EDGE_LINING:    z(0,   110,  80, 450),
    RIGHT_EDGE_LINING:   z(720, 110,  80, 450),
    ACCENT_SCATTER:      z(130, 130, 540, 270),
    GARNISH_SCATTER:     z(10,  10,  780, 540),
    JAR_PLACEMENT:       z(690, 390, 100, 120),

    // ── Artisan composition zones ──────────────────────────────────────────
    // Fan meats — each in its own sector
    MEAT_PRIMARY:        z(10,   8,  290, 120),  // upper-left
    MEAT_SECONDARY:      z(500,  8,  290, 120),  // upper-right
    MEAT_TERTIARY:       z(10, 130,  200, 130),  // left-mid

    // Salami clusters — diagonal cascade across center
    SALAMI_ZONE_1:       z(110, 240, 170, 170),  // mid-left cluster
    SALAMI_ZONE_2:       z(290, 200, 170, 170),  // center cluster
    SALAMI_ZONE_3:       z(470, 220, 155, 155),  // mid-right cluster
    SALAMI_ZONE_4:       z(110, 360, 150, 130),  // lower-left (4th type)

    // Cheese zones — anchored artfully
    BRIE_ZONE:           z(10,  110, 220, 220),  // left anchor
    MANCHEGO_ZONE:       z(570, 100, 220, 210),  // right anchor
    GOUDA_ZONE:          z(220, 140, 360, 220),  // center mound
    CHEDDAR_ZONE:        z(570, 320, 220, 200),  // lower-right
    SOFT_CHEESE_ZONE:    z(220, 380, 350, 170),  // lower center

    // Fruit accents
    FRUIT_UPPER_RIGHT:   z(560, 100, 230, 170),  // grapes upper-right
    FRUIT_LOWER_LEFT:    z(10,  350, 190, 190),  // berries lower-left
    FRUIT_SCATTER:       z(180, 250, 370, 160),  // scattered through center

    // Accoutrements
    ACCS_LOWER:          z(210, 400, 340, 130),

    // Jar anchor (lower-right corner)
    JAR_ZONE:            z(680, 390, 110, 150),
  };
}

export function getZonesForSKU(sku: BoardSKU): ZoneMap {
  switch (sku) {
    case 'cc_small':  return makeCircleZones();
    case 'cc_medium': return makeRectZones(800, 560);
    case 'cc_large':  return makeRectZones(960, 660);
    case 'co_small':  return makeRectZones(720, 520);
    case 'co_medium': return makeRectZones(800, 560);
    case 'co_large':  return makeRectZones(960, 660);
  }
}

/** Polar zones for the circular Small C&C board */
function makeCircleZones(): ZoneMap {
  const cx = 300, cy = 300, r = 280;
  return {
    TOP_SWEEP:        { x: cx - r,       y: cy - r,       w: 2*r,     h: r * 0.55 },
    LEFT_FLANK:       { x: cx - r,       y: cy - r*0.4,   w: r*0.7,   h: r*1.3   },
    RIGHT_FLANK:      { x: cx + r*0.3,   y: cy - r*0.4,   w: r*0.7,   h: r*1.3   },
    CENTER_MOUND:     { x: cx - r*0.4,   y: cy - r*0.4,   w: r*0.8,   h: r*0.8   },
    SALAMI_BAND:      { x: cx - r*0.7,   y: cy + r*0.05,  w: r*1.4,   h: r*0.55  },
    LOWER_CENTER:     { x: cx - r*0.4,   y: cy + r*0.2,   w: r*0.8,   h: r*0.6   },
    LOWER_LEFT:       { x: cx - r,       y: cy + r*0.1,   w: r*0.6,   h: r*0.8   },
    ACCENT_SCATTER:   { x: cx - r*0.9,   y: cy - r*0.9,   w: r*1.8,   h: r*1.8   },
    GARNISH_SCATTER:  { x: cx - r,       y: cy - r,       w: 2*r,     h: 2*r     },
    JAR_PLACEMENT:    { x: cx + r*0.3,   y: cy - r*0.2,   w: r*0.5,   h: r*0.5   },
    TOP_ARC:          { x: cx - r,       y: cy - r,       w: 2*r,     h: r*0.6   },

    // Artisan zones for circle board
    MEAT_PRIMARY:     { x: cx - r,       y: cy - r,       w: r,       h: r*0.7   },
    MEAT_SECONDARY:   { x: cx,           y: cy - r,       w: r,       h: r*0.7   },
    SALAMI_ZONE_1:    { x: cx - r*0.8,   y: cy - r*0.1,   w: r*0.7,   h: r*0.7   },
    SALAMI_ZONE_2:    { x: cx - r*0.1,   y: cy - r*0.15,  w: r*0.7,   h: r*0.7   },
    SALAMI_ZONE_3:    { x: cx + r*0.1,   y: cy + r*0.05,  w: r*0.6,   h: r*0.6   },
    BRIE_ZONE:        { x: cx - r,       y: cy - r*0.3,   w: r*0.75,  h: r*0.75  },
    MANCHEGO_ZONE:    { x: cx + r*0.25,  y: cy - r*0.3,   w: r*0.75,  h: r*0.75  },
    GOUDA_ZONE:       { x: cx - r*0.4,   y: cy - r*0.4,   w: r*0.8,   h: r*0.8   },
    CHEDDAR_ZONE:     { x: cx + r*0.1,   y: cy + r*0.1,   w: r*0.75,  h: r*0.75  },
    SOFT_CHEESE_ZONE: { x: cx - r*0.45,  y: cy + r*0.15,  w: r*0.9,   h: r*0.7   },
    FRUIT_UPPER_RIGHT:{ x: cx + r*0.2,   y: cy - r*0.9,   w: r*0.75,  h: r*0.75  },
    FRUIT_LOWER_LEFT: { x: cx - r,       y: cy + r*0.15,  w: r*0.75,  h: r*0.75  },
    FRUIT_SCATTER:    { x: cx - r*0.5,   y: cy - r*0.25,  w: r,       h: r*0.75  },
    ACCS_LOWER:       { x: cx - r*0.5,   y: cy + r*0.2,   w: r,       h: r*0.65  },
    JAR_ZONE:         { x: cx + r*0.3,   y: cy + r*0.1,   w: r*0.55,  h: r*0.7   },
  };
}

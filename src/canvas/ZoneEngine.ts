import type { BoardSKU } from '../data/boardSizes';

export interface Zone {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ZoneMap {
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
  [key: string]: Zone | undefined;
}

/** Base zone definitions for a reference 800×560 rect board, scaled to actual size */
function makeRectZones(W: number, H: number): ZoneMap {
  const sx = W / 800;
  const sy = H / 560;
  function z(x: number, y: number, w: number, h: number): Zone {
    return { x: x * sx, y: y * sy, w: w * sx, h: h * sy };
  }

  return {
    TOP_SWEEP:           z(0,   0,   800, 110),
    LEFT_FLANK:          z(0,   110, 130, 450),
    RIGHT_FLANK:         z(670, 110, 130, 450),
    UPPER_LEFT_FAN:      z(0,   110, 200, 180),
    UPPER_RIGHT_CORNER:  z(580, 110, 220, 200),
    CENTER_UPPER:        z(130, 110, 540, 130),
    CENTER_MOUND:        z(200, 130, 400, 240),
    SALAMI_BAND:         z(130, 340, 540, 110),
    LOWER_LEFT:          z(0,   360, 200, 200),
    LOWER_CENTER:        z(200, 400, 400, 160),
    LOWER_RIGHT:         z(550, 350, 250, 210),
    LOWER_RIGHT_FAN:     z(550, 380, 250, 180),
    LOWER_ARC:           z(130, 480, 540, 80),
    LOWER_LEFT_ANCHOR:   z(20,  400, 180, 160),
    RIGHT_CENTER:        z(600, 280, 190, 180),
    LEFT_EDGE_LINING:    z(0,   110, 80,  450),
    RIGHT_EDGE_LINING:   z(720, 110, 80,  450),
    // Dynamic zones computed at render time:
    ACCENT_SCATTER:      z(130, 130, 540, 270),
    GARNISH_SCATTER:     z(10,  10,  780, 540),
    JAR_PLACEMENT:       z(700, 130, 90,  90),
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
  // For circular board (600×600, radius 280, center 300,300),
  // zones are expressed as their bounding boxes for compatibility
  const cx = 300, cy = 300, r = 280;
  return {
    TOP_SWEEP:        { x: cx - r, y: cy - r, w: 2*r, h: r * 0.55 },   // top arc
    LEFT_FLANK:       { x: cx - r, y: cy - r*0.4, w: r*0.7, h: r*1.3 },
    RIGHT_FLANK:      { x: cx + r*0.3, y: cy - r*0.4, w: r*0.7, h: r*1.3 },
    CENTER_MOUND:     { x: cx - r*0.4, y: cy - r*0.4, w: r*0.8, h: r*0.8 },
    SALAMI_BAND:      { x: cx - r*0.7, y: cy + r*0.1, w: r*1.4, h: r*0.5 },
    LOWER_CENTER:     { x: cx - r*0.4, y: cy + r*0.2, w: r*0.8, h: r*0.6 },
    LOWER_LEFT:       { x: cx - r, y: cy + r*0.1, w: r*0.6, h: r*0.8 },
    ACCENT_SCATTER:   { x: cx - r*0.9, y: cy - r*0.9, w: r*1.8, h: r*1.8 },
    GARNISH_SCATTER:  { x: cx - r, y: cy - r, w: 2*r, h: 2*r },
    JAR_PLACEMENT:    { x: cx + r*0.3, y: cy - r*0.2, w: r*0.5, h: r*0.5 },
    TOP_ARC:          { x: cx - r, y: cy - r, w: 2*r, h: r*0.6 },
  };
}

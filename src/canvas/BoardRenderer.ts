/**
 * Core board layout engine.
 * PURE FUNCTION — same inputs always produce same output (deterministic via seeded RNG).
 *
 * Composition philosophy (artisan / Instagram-worthy):
 *  - Every ingredient type gets its OWN zone. Multiple meats of the same style
 *    are NEVER stacked on top of each other — each gets a distinct area.
 *  - Fan meats (prosciutto/serrano/coppa) cascade across the upper board.
 *  - Salami rosette clusters are placed diagonally through the center.
 *  - Cheeses anchor their own quadrant (left, right, center, lower-right).
 *  - Fruits pop as color accents in upper-right and lower-left.
 *  - Herbs: exactly 3–5 intentionally placed sprigs, not random carpet.
 *  - Board wood grain is intentionally visible (~50% negative space).
 *
 * Dynamic Composition Engine:
 *  - Below MIN_POINTS_THRESHOLD (5 pts): board stays mostly empty.
 *  - Density modes (sparse / moderate / full) scale zones proportionally.
 *  - Each ingredient's zone scales with its share of total allocated points.
 *  - Color adjacency: contrasting ingredient types assigned to non-adjacent zones.
 */

import type { BoardConfig, IngredientSelection } from '../store/builderStore';
import type { BoardSKU } from '../data/boardSizes';
import type { LayoutItem } from './IngredientDrawers';
import type { Zone } from './ZoneEngine';
import { getZonesForSKU } from './ZoneEngine';
import { seededRNG } from '../utils/seededRandom';
import { getIngredientById } from '../data/ingredients';
import { BOARD_DIMENSIONS } from './boardDimensions';
import { fillGaps } from './GapFiller';
import {
  drawDrapedMeat,
  drawSalamiRosette,
  drawFanArc,
  drawStackedMound,
  drawRoundDisc,
  drawRoundSlices,
  drawExoticAnchor,
  drawCitrusSlice,
  drawGrapeCluster,
  drawBerryScatter,
  drawBerryCluster,
  drawNutCluster,
  drawPickleCluster,
  drawOliveCluster,
  drawSmallScatter,
  drawHerbSprig,
  drawBrandedJar,
} from './IngredientDrawers';

// ─── Constants ────────────────────────────────────────────────────────────────
/** Min total points before any ingredients render (board stays clean below this) */
const MIN_POINTS_THRESHOLD = 5;

/** Zone scale factor by density mode */
const DENSITY_ZONE_SCALE: Record<string, number> = {
  sparse:   0.68,
  moderate: 0.85,
  full:     1.0,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Scale a zone proportionally toward its own center.
 * factor=1.0 → unchanged; factor=0.7 → 30% smaller, same center.
 */
function scaleZone(zone: Zone, factor: number): Zone {
  const dw = zone.w * (1 - factor);
  const dh = zone.h * (1 - factor);
  return {
    x: zone.x + dw / 2,
    y: zone.y + dh / 2,
    w: zone.w * factor,
    h: zone.h * factor,
  };
}

/**
 * Shift a zone toward the board center to tighten the composition
 * when the board is sparse. `cx`/`cy` = board center coordinates.
 */
function pullZoneTowardCenter(
  zone: Zone,
  factor: number, // 0=no pull, 1=fully at center
  boardW: number,
  boardH: number
): Zone {
  const bcx = boardW / 2;
  const bcy = boardH / 2;
  const zoneCx = zone.x + zone.w / 2;
  const zoneCy = zone.y + zone.h / 2;
  const newCx = zoneCx + (bcx - zoneCx) * factor;
  const newCy = zoneCy + (bcy - zoneCy) * factor;
  return {
    x: newCx - zone.w / 2,
    y: newCy - zone.h / 2,
    w: zone.w,
    h: zone.h,
  };
}

/**
 * Get the zone scale for a single ingredient based on its point share.
 * More points → larger zone, more visual space for that ingredient.
 */
function ingredientZoneScale(pointsAllocated: number, totalPoints: number): number {
  if (totalPoints === 0) return 0.5;
  const share = pointsAllocated / totalPoints;
  // Scale from 0.55 (low share) to 1.0 (dominant share)
  return Math.min(1.0, 0.55 + share * 2.0);
}

// ─── Main Layout Function ─────────────────────────────────────────────────────

export function computeBoardLayout(board: BoardConfig): LayoutItem[] {
  const rng = seededRNG(board.visualSeed);
  const sku = board.sku as BoardSKU;
  const zones = getZonesForSKU(sku);
  const dims = BOARD_DIMENSIONS[sku];
  const category = board.category;
  const size = board.size;

  const allSelections = [...board.ingredientSelections, ...board.accoutrementSelections];

  // ── Compute total points ──────────────────────────────────────────────────
  const totalPoints = allSelections.reduce((sum, s) => sum + s.pointsAllocated, 0);

  // ── Density mode ─────────────────────────────────────────────────────────
  const densityMode: 'sparse' | 'moderate' | 'full' =
    totalPoints < 10 ? 'sparse' :
    totalPoints < 22 ? 'moderate' :
    'full';

  const densityZoneScale = DENSITY_ZONE_SCALE[densityMode];

  // Pull-toward-center factor: sparse boards cluster ingredients
  const pullFactor = densityMode === 'sparse' ? 0.28 : densityMode === 'moderate' ? 0.10 : 0;

  /**
   * Compute the effective zone for an ingredient, accounting for:
   * 1. Base density (how full the board is overall)
   * 2. Ingredient's own point share (how dominant it is)
   */
  function effectiveZone(baseZone: Zone, pointsAllocated: number): Zone {
    const ingScale = ingredientZoneScale(pointsAllocated, totalPoints);
    const combinedScale = densityZoneScale * ingScale;
    let z = scaleZone(baseZone, Math.max(0.4, combinedScale));
    if (pullFactor > 0) {
      z = pullZoneTowardCenter(z, pullFactor, dims.width, dims.height);
    }
    return z;
  }

  const layoutItems: LayoutItem[] = [];

  function resolveUnits(sel: IngredientSelection): number {
    const ing = getIngredientById(sel.ingredientId);
    if (!ing) return 0;
    const upp = typeof ing.unitsPerPoint === 'number'
      ? ing.unitsPerPoint
      : (ing.unitsPerPoint as { cc: number; co: number })[category] ?? 0;
    return sel.pointsAllocated * upp;
  }

  // ── MINIMUM THRESHOLD CHECK ────────────────────────────────────────────────
  // Below 5 pts: only show jars (fixed inclusions) — board looks artfully minimal
  if (totalPoints < MIN_POINTS_THRESHOLD) {
    const jarZone = zones.JAR_ZONE ?? zones.JAR_PLACEMENT;
    if (jarZone) {
      layoutItems.push(drawBrandedJar('jam_jar_0', jarZone.x + jarZone.w * 0.3, jarZone.y + jarZone.h * 0.5, false));
      if (category === 'co') {
        layoutItems.push(drawBrandedJar('honey_jar', jarZone.x + jarZone.w * 0.7, jarZone.y + jarZone.h * 0.5, true));
      }
    }
    return layoutItems.sort((a, b) => a.zIndex - b.zIndex);
  }

  // ─── 1. FAN MEATS (prosciutto, serrano, coppa) ──────────────────────────
  const fanMeatZoneKeys = ['MEAT_PRIMARY', 'MEAT_SECONDARY', 'MEAT_TERTIARY'];

  const fanMeatSelections = allSelections.filter(sel => {
    const ing = getIngredientById(sel.ingredientId);
    return ing?.category === 'meat' &&
      (ing.renderStyle === 'continuous_fan' || ing.renderStyle === 'folded_fan');
  });

  fanMeatSelections.forEach((sel, i) => {
    const ing = getIngredientById(sel.ingredientId);
    if (!ing) return;
    const zoneKey = fanMeatZoneKeys[i] ?? 'MEAT_PRIMARY';
    const baseZone = zones[zoneKey] ?? zones.TOP_SWEEP;
    if (!baseZone) return;
    const units = resolveUnits(sel);
    const zone = effectiveZone(baseZone, sel.pointsAllocated);
    layoutItems.push(drawDrapedMeat(
      sel.ingredientId,
      units,
      zone,
      ing.renderColor as string || '#C4706B',
      rng,
    ));
  });

  // ─── 2. SALAMI ROSETTE CLUSTERS ──────────────────────────────────────────
  if (category === 'cc') {
    const salamiZoneKeys = ['SALAMI_ZONE_1', 'SALAMI_ZONE_2', 'SALAMI_ZONE_3', 'SALAMI_ZONE_4'];

    const salamiSelections = allSelections.filter(sel => {
      const ing = getIngredientById(sel.ingredientId);
      return ing?.renderStyle === 'rosette_cluster';
    });

    salamiSelections.forEach((sel, i) => {
      const ing = getIngredientById(sel.ingredientId);
      if (!ing) return;
      const zoneKey = salamiZoneKeys[i % salamiZoneKeys.length];
      const baseZone = zones[zoneKey] ?? zones.SALAMI_BAND;
      if (!baseZone) return;
      const units = resolveUnits(sel);
      const zone = effectiveZone(baseZone, sel.pointsAllocated);
      layoutItems.push(drawSalamiRosette(
        sel.ingredientId,
        units,
        zone,
        ing.renderColor as string || '#8B3A3A',
        sel.ingredientId === 'salami_peppered' || sel.ingredientId === 'salami_calabrese',
        sel.ingredientId === 'coppa',
        rng,
      ));
    });
  }

  // ─── 3. EDGE-LINING CHEESES (CO boards) ──────────────────────────────────
  if (category === 'co') {
    for (const sel of allSelections) {
      const ing = getIngredientById(sel.ingredientId);
      if (!ing || ing.category !== 'cheese') continue;
      const zoneKey = (ing.zone as { cc?: string; co?: string })?.co;
      if (zoneKey !== 'LEFT_EDGE_LINING' && zoneKey !== 'RIGHT_EDGE_LINING') continue;
      const baseZone = zones[zoneKey];
      if (!baseZone) continue;
      const units = resolveUnits(sel);
      const zone = effectiveZone(baseZone, sel.pointsAllocated);
      layoutItems.push(drawFanArc(
        sel.ingredientId, units, zone,
        ing.renderColor as string || '#E8D48A',
        (ing as { rindColor?: string }).rindColor || '#C4A855',
        'none', rng,
      ));
    }
  }

  // ─── 4. FANNED CHEESES (brie, manchego, cheddar, humboldt fog) ───────────
  const cheeseZoneMap: Record<string, string> = {
    brie:           'BRIE_ZONE',
    manchego:       'MANCHEGO_ZONE',
    mature_cheddar: 'CHEDDAR_ZONE',
    humboldt_fog:   'LOWER_RIGHT_FAN',
  };

  for (const sel of allSelections) {
    const ing = getIngredientById(sel.ingredientId);
    if (!ing || ing.category !== 'cheese') continue;
    if (ing.renderStyle !== 'fan_arc') continue;

    const coZone = (ing.zone as { cc?: string; co?: string })?.co;
    if (category === 'co' && (coZone === 'LEFT_EDGE_LINING' || coZone === 'RIGHT_EDGE_LINING')) continue;

    const artisanZoneKey = cheeseZoneMap[sel.ingredientId];
    let baseZone = artisanZoneKey ? zones[artisanZoneKey] : undefined;
    if (!baseZone) {
      const legacyZoneConfig = ing.zone as { cc?: string; co?: string } | string;
      const legacyZoneKey = typeof legacyZoneConfig === 'string'
        ? legacyZoneConfig
        : (legacyZoneConfig[category] ?? 'CENTER_MOUND');
      baseZone = zones[legacyZoneKey];
    }
    if (!baseZone) continue;

    const units = resolveUnits(sel);
    const zone = effectiveZone(baseZone, sel.pointsAllocated);
    const special = sel.ingredientId === 'humboldt_fog' ? 'ash_line'
      : sel.ingredientId === 'herb_goat' ? 'herb_coat'
      : 'none';
    layoutItems.push(drawFanArc(
      sel.ingredientId, units, zone,
      ing.renderColor as string || '#F5EDD0',
      (ing as { rindColor?: string }).rindColor || '#E0D8C0',
      special as 'ash_line' | 'herb_coat' | 'none', rng,
    ));
  }

  // ─── 5. GOUDA CENTER MOUND ────────────────────────────────────────────────
  for (const sel of allSelections) {
    if (sel.ingredientId !== 'gouda_cubes') continue;
    const ing = getIngredientById(sel.ingredientId);
    const baseZone = zones.GOUDA_ZONE ?? zones.CENTER_MOUND;
    if (!ing || !baseZone) continue;
    const units = resolveUnits(sel);
    const zone = effectiveZone(baseZone, sel.pointsAllocated);
    layoutItems.push(drawStackedMound(
      sel.ingredientId, units, zone,
      ing.renderColor as string || '#E8A030', rng,
    ));
  }

  // ─── 6. SOFT CHEESES (Boursin, Goat Cheese) ──────────────────────────────
  for (const sel of allSelections) {
    const ing = getIngredientById(sel.ingredientId);
    if (!ing || ing.category !== 'cheese') continue;
    const baseZone = zones.SOFT_CHEESE_ZONE ?? zones.LOWER_CENTER;
    if (!baseZone) continue;
    const units = resolveUnits(sel);
    const zone = effectiveZone(baseZone, sel.pointsAllocated);

    if (ing.renderStyle === 'round_disc') {
      layoutItems.push(drawRoundDisc(
        sel.ingredientId, units, zone,
        ing.renderColor as string || '#EDE8DC',
        (ing as { herbColor?: string }).herbColor || '#7A9950', rng,
      ));
    } else if (ing.renderStyle === 'round_slices') {
      layoutItems.push(drawRoundSlices(
        sel.ingredientId, units, zone,
        ing.renderColor as string || '#F2EDE0',
        (ing as { herbColor?: string }).herbColor || '#6B8C4A', rng,
      ));
    }
  }

  // ─── 7. DRAGON FRUIT (CO only — ALWAYS on top, zIndex 50) ────────────────
  for (const sel of allSelections) {
    if (sel.ingredientId !== 'dragon_fruit') continue;
    const ing = getIngredientById(sel.ingredientId);
    const baseZone = zones.LOWER_LEFT_ANCHOR;
    if (!ing || !baseZone) continue;
    const units = resolveUnits(sel);
    const zone = effectiveZone(baseZone, sel.pointsAllocated);
    layoutItems.push(drawExoticAnchor(
      sel.ingredientId, units, zone,
      (ing as { skinColor?: string }).skinColor || '#E8205A',
      (ing as { interiorColor?: string }).interiorColor || '#F5F0F0', rng,
    ));
  }

  // ─── 8. FRUITS ────────────────────────────────────────────────────────────
  const fruitSelections = allSelections.filter(sel => {
    const ing = getIngredientById(sel.ingredientId);
    return ing?.category === 'fruit' && sel.ingredientId !== 'dragon_fruit';
  });

  let scatterFruitIdx = 0;
  for (const sel of fruitSelections) {
    const ing = getIngredientById(sel.ingredientId);
    if (!ing) continue;
    const units = resolveUnits(sel);

    if (ing.renderStyle === 'grape_cluster') {
      const baseZone = zones.FRUIT_UPPER_RIGHT ?? zones.UPPER_RIGHT_CORNER ?? zones.ACCENT_SCATTER;
      if (!baseZone) continue;
      const zone = effectiveZone(baseZone, sel.pointsAllocated);
      layoutItems.push(drawGrapeCluster(
        sel.ingredientId, units, zone,
        ing.renderColor as string || '#8FBA5E',
        (ing as { highlightColor?: string }).highlightColor || '#C4E08A', rng,
      ));
      continue;
    }

    const isEven = scatterFruitIdx % 2 === 0;
    scatterFruitIdx++;

    const baseScatterZone = isEven
      ? (zones.FRUIT_LOWER_LEFT ?? zones.LOWER_LEFT ?? zones.ACCENT_SCATTER)
      : (zones.FRUIT_SCATTER ?? zones.ACCENT_SCATTER);
    if (!baseScatterZone) continue;
    const scatterZone = effectiveZone(baseScatterZone, sel.pointsAllocated);

    switch (ing.renderStyle) {
      case 'berry_scatter':
        layoutItems.push(drawBerryScatter(
          sel.ingredientId, units, scatterZone,
          ing.renderColor as string || '#D63B3B',
          sel.ingredientId === 'strawberries',
          sel.ingredientId === 'raspberries', rng,
        ));
        break;
      case 'berry_cluster':
        layoutItems.push(drawBerryCluster(
          sel.ingredientId, units, scatterZone,
          ing.renderColor as string || '#3B4B7A',
          (ing as { highlightColor?: string }).highlightColor || '#6070AA', rng,
        ));
        break;
      case 'citrus_slice':
        layoutItems.push(drawCitrusSlice(
          sel.ingredientId, units, scatterZone,
          ing.renderColor as string || '#F07820',
          sel.ingredientId === 'kiwi'
            ? ((ing as { centerColor?: string }).centerColor || '#E8E8C0')
            : ((ing as { segmentColor?: string }).segmentColor || '#F5A040'),
          sel.ingredientId === 'kiwi', rng,
        ));
        break;
      case 'arc_placement':
      case 'small_scatter':
        layoutItems.push(drawSmallScatter(
          sel.ingredientId, units, scatterZone,
          ing.renderColor as string || '#3A2010',
          sel.ingredientId === 'chocolate_pretzels', rng,
        ));
        break;
      default: {
        const legacyZoneConfig = ing.zone as string | { cc?: string; co?: string };
        const legacyZoneKey = typeof legacyZoneConfig === 'string'
          ? legacyZoneConfig
          : (legacyZoneConfig[category] ?? 'ACCENT_SCATTER');
        const legacyBaseZone = zones[legacyZoneKey] ?? zones.ACCENT_SCATTER;
        if (legacyBaseZone) {
          layoutItems.push(drawSmallScatter(
            sel.ingredientId, units,
            effectiveZone(legacyBaseZone, sel.pointsAllocated),
            ing.renderColor as string || '#3A2010',
            false, rng,
          ));
        }
      }
    }
  }

  // ─── 9. ACCOUTREMENTS ─────────────────────────────────────────────────────
  for (const sel of board.accoutrementSelections) {
    const ing = getIngredientById(sel.ingredientId);
    if (!ing) continue;
    const units = resolveUnits(sel);
    const baseZone = zones.ACCS_LOWER ?? zones.LOWER_CENTER;
    if (!baseZone) continue;
    const zone = effectiveZone(baseZone, sel.pointsAllocated);

    switch (ing.renderStyle) {
      case 'nut_cluster':
        layoutItems.push(drawNutCluster(
          sel.ingredientId, units, zone,
          ing.renderColor as string || '#8B6040',
          sel.ingredientId === 'pistachios', rng,
        ));
        break;
      case 'pickle_cluster':
        layoutItems.push(drawPickleCluster(
          sel.ingredientId, units, zone,
          ing.renderColor as string || '#6B9040', rng,
        ));
        break;
      case 'olive_cluster':
        layoutItems.push(drawOliveCluster(
          sel.ingredientId, units, zone,
          ing.renderColor as string || '#7A9840', rng,
        ));
        break;
    }
  }

  // ─── 10. FIXED INCLUSIONS (Jars) ──────────────────────────────────────────
  const jarCount = size === 'large' ? 2 : 1;
  const jarZone = zones.JAR_ZONE ?? zones.JAR_PLACEMENT;
  if (jarZone) {
    for (let j = 0; j < jarCount; j++) {
      const cx = jarZone.x + jarZone.w / 2 + (j - (jarCount - 1) / 2) * 46;
      const cy = jarZone.y + jarZone.h / 2;
      layoutItems.push(drawBrandedJar(`jam_jar_${j}`, cx, cy, false));
    }
    if (category === 'co') {
      const hcx = jarZone.x + jarZone.w * 0.75;
      const hcy = jarZone.y + jarZone.h * 0.7;
      layoutItems.push(drawBrandedJar('honey_jar', hcx, hcy, true));
    }
  }

  // ─── 11. GARNISH (Rosemary Sprigs — intentional placement only) ───────────
  // Sprigs are placed at compositional "bridge" points between zones.
  // Sparse boards get fewer sprigs (2), full boards get up to 5.
  const maxSprigs = densityMode === 'sparse' ? 2 : densityMode === 'moderate' ? 3 : 5;

  const sprigBridges: Array<{ x: number; y: number; rot: number }> = [
    { x: zones.BRIE_ZONE ? zones.BRIE_ZONE.x + zones.BRIE_ZONE.w * 0.85 : dims.width * 0.27,
      y: zones.BRIE_ZONE ? zones.BRIE_ZONE.y + zones.BRIE_ZONE.h * 0.15 : dims.height * 0.12,
      rot: -35 },
    { x: zones.MANCHEGO_ZONE ? zones.MANCHEGO_ZONE.x + zones.MANCHEGO_ZONE.w * 0.1 : dims.width * 0.7,
      y: zones.MANCHEGO_ZONE ? zones.MANCHEGO_ZONE.y + zones.MANCHEGO_ZONE.h * 0.85 : dims.height * 0.42,
      rot: 45 },
    { x: dims.width * 0.48,
      y: zones.SOFT_CHEESE_ZONE ? zones.SOFT_CHEESE_ZONE.y - 10 : dims.height * 0.72,
      rot: 12 },
    { x: zones.SALAMI_ZONE_1 ? zones.SALAMI_ZONE_1.x - 12 : dims.width * 0.1,
      y: zones.SALAMI_ZONE_1 ? zones.SALAMI_ZONE_1.y + zones.SALAMI_ZONE_1.h * 0.5 : dims.height * 0.55,
      rot: -60 },
    { x: zones.CHEDDAR_ZONE ? zones.CHEDDAR_ZONE.x + 10 : dims.width * 0.72,
      y: zones.CHEDDAR_ZONE ? zones.CHEDDAR_ZONE.y - 8 : dims.height * 0.6,
      rot: 70 },
  ];

  sprigBridges.slice(0, maxSprigs).forEach((bridge, i) => {
    layoutItems.push(drawHerbSprig(
      `rosemary_${i}`,
      bridge.x + (rng() - 0.5) * 14,
      bridge.y + (rng() - 0.5) * 10,
      bridge.rot + (rng() - 0.5) * 20,
      '#3D6B28', rng,
    ));
  });

  // ─── 12. GAP FILL (subtle microgreen tufts, capped at 8) ──────────────────
  // Only in moderate/full density — sparse boards intentionally show wood grain
  if (densityMode !== 'sparse') {
    const gapFillers = fillGaps(layoutItems, dims.width, dims.height, zones.GARNISH_SCATTER, rng);
    layoutItems.push(...gapFillers);
  }

  // ─── Sort by zIndex ────────────────────────────────────────────────────────
  return layoutItems.sort((a, b) => a.zIndex - b.zIndex);
}

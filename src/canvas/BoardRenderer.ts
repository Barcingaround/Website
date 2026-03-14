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
 */

import type { BoardConfig, IngredientSelection } from '../store/builderStore';
import type { BoardSKU } from '../data/boardSizes';
import type { LayoutItem } from './IngredientDrawers';
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

export function computeBoardLayout(board: BoardConfig): LayoutItem[] {
  const rng = seededRNG(board.visualSeed);
  const sku = board.sku as BoardSKU;
  const zones = getZonesForSKU(sku);
  const dims = BOARD_DIMENSIONS[sku];
  const category = board.category;
  const size = board.size;

  const layoutItems: LayoutItem[] = [];

  function resolveUnits(sel: IngredientSelection): number {
    const ing = getIngredientById(sel.ingredientId);
    if (!ing) return 0;
    const upp = typeof ing.unitsPerPoint === 'number'
      ? ing.unitsPerPoint
      : (ing.unitsPerPoint as { cc: number; co: number })[category] ?? 0;
    return sel.pointsAllocated * upp;
  }

  const allSelections = [...board.ingredientSelections, ...board.accoutrementSelections];

  // ─── 1. FAN MEATS (prosciutto, serrano, coppa) ──────────────────────────
  // Each fan meat gets its own dedicated zone — never stacked together.
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
    const zone = zones[zoneKey] ?? zones.TOP_SWEEP;
    if (!zone) return;
    const units = resolveUnits(sel);
    layoutItems.push(drawDrapedMeat(
      sel.ingredientId,
      units,
      zone,
      ing.renderColor as string || '#C4706B',
      rng,
    ));
  });

  // ─── 2. SALAMI ROSETTE CLUSTERS ──────────────────────────────────────────
  // Each salami variety gets its own cluster zone.
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
      const zone = zones[zoneKey] ?? zones.SALAMI_BAND;
      if (!zone) return;
      const units = resolveUnits(sel);
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

  // ─── 3. EDGE-LINING CHEESES (CO boards: manchego LEFT, cheddar RIGHT) ───
  if (category === 'co') {
    for (const sel of allSelections) {
      const ing = getIngredientById(sel.ingredientId);
      if (!ing || ing.category !== 'cheese') continue;
      const zoneKey = (ing.zone as { cc?: string; co?: string })?.co;
      if (zoneKey !== 'LEFT_EDGE_LINING' && zoneKey !== 'RIGHT_EDGE_LINING') continue;
      const zone = zones[zoneKey];
      if (!zone) continue;
      const units = resolveUnits(sel);
      layoutItems.push(drawFanArc(
        sel.ingredientId, units, zone,
        ing.renderColor as string || '#E8D48A',
        (ing as { rindColor?: string }).rindColor || '#C4A855',
        'none', rng,
      ));
    }
  }

  // ─── 4. FANNED CHEESES (brie, manchego, cheddar, humboldt fog) ──────────
  // Each cheese routes to its own artisan zone.
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

    // Skip CO edge-lining cheeses (handled above)
    const coZone = (ing.zone as { cc?: string; co?: string })?.co;
    if (category === 'co' && (coZone === 'LEFT_EDGE_LINING' || coZone === 'RIGHT_EDGE_LINING')) continue;

    // Prefer artisan zone, fall back to legacy zone
    const artisanZoneKey = cheeseZoneMap[sel.ingredientId];
    let zone = artisanZoneKey ? zones[artisanZoneKey] : undefined;
    if (!zone) {
      const legacyZoneConfig = ing.zone as { cc?: string; co?: string } | string;
      const legacyZoneKey = typeof legacyZoneConfig === 'string'
        ? legacyZoneConfig
        : (legacyZoneConfig[category] ?? 'CENTER_MOUND');
      zone = zones[legacyZoneKey];
    }
    if (!zone) continue;

    const units = resolveUnits(sel);
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

  // ─── 5. GOUDA CENTER MOUND ───────────────────────────────────────────────
  for (const sel of allSelections) {
    if (sel.ingredientId !== 'gouda_cubes') continue;
    const ing = getIngredientById(sel.ingredientId);
    const zone = zones.GOUDA_ZONE ?? zones.CENTER_MOUND;
    if (!ing || !zone) continue;
    const units = resolveUnits(sel);
    layoutItems.push(drawStackedMound(
      sel.ingredientId, units, zone,
      ing.renderColor as string || '#E8A030', rng,
    ));
  }

  // ─── 6. SOFT CHEESES (Boursin, Goat Cheese) ─────────────────────────────
  for (const sel of allSelections) {
    const ing = getIngredientById(sel.ingredientId);
    if (!ing || ing.category !== 'cheese') continue;
    const zone = zones.SOFT_CHEESE_ZONE ?? zones.LOWER_CENTER;
    if (!zone) continue;
    const units = resolveUnits(sel);

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

  // ─── 7. DRAGON FRUIT (CO only — ALWAYS on top, zIndex 50) ───────────────
  for (const sel of allSelections) {
    if (sel.ingredientId !== 'dragon_fruit') continue;
    const ing = getIngredientById(sel.ingredientId);
    const zone = zones.LOWER_LEFT_ANCHOR;
    if (!ing || !zone) continue;
    const units = resolveUnits(sel);
    layoutItems.push(drawExoticAnchor(
      sel.ingredientId, units, zone,
      (ing as { skinColor?: string }).skinColor || '#E8205A',
      (ing as { interiorColor?: string }).interiorColor || '#F5F0F0', rng,
    ));
  }

  // ─── 8. FRUITS ───────────────────────────────────────────────────────────
  // Grapes → FRUIT_UPPER_RIGHT; berries → FRUIT_LOWER_LEFT + FRUIT_SCATTER (alternating)
  const fruitSelections = allSelections.filter(sel => {
    const ing = getIngredientById(sel.ingredientId);
    return ing?.category === 'fruit' && sel.ingredientId !== 'dragon_fruit';
  });

  let scatterFruitIdx = 0;
  for (const sel of fruitSelections) {
    const ing = getIngredientById(sel.ingredientId);
    if (!ing) continue;
    const units = resolveUnits(sel);

    // Grapes go to upper-right
    if (ing.renderStyle === 'grape_cluster') {
      const zone = zones.FRUIT_UPPER_RIGHT ?? zones.UPPER_RIGHT_CORNER ?? zones.ACCENT_SCATTER;
      if (!zone) continue;
      layoutItems.push(drawGrapeCluster(
        sel.ingredientId, units, zone,
        ing.renderColor as string || '#8FBA5E',
        (ing as { highlightColor?: string }).highlightColor || '#C4E08A', rng,
      ));
      continue;
    }

    // Scatter fruits alternate between lower-left and central scatter
    const isEven = scatterFruitIdx % 2 === 0;
    scatterFruitIdx++;

    const scatterZone = isEven
      ? (zones.FRUIT_LOWER_LEFT ?? zones.LOWER_LEFT ?? zones.ACCENT_SCATTER)
      : (zones.FRUIT_SCATTER ?? zones.ACCENT_SCATTER);
    if (!scatterZone) continue;

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
        const legacyZone = zones[legacyZoneKey] ?? zones.ACCENT_SCATTER;
        if (legacyZone) {
          layoutItems.push(drawSmallScatter(
            sel.ingredientId, units, legacyZone,
            ing.renderColor as string || '#3A2010',
            false, rng,
          ));
        }
      }
    }
  }

  // ─── 9. ACCOUTREMENTS ────────────────────────────────────────────────────
  for (const sel of board.accoutrementSelections) {
    const ing = getIngredientById(sel.ingredientId);
    if (!ing) continue;
    const units = resolveUnits(sel);
    const zone = zones.ACCS_LOWER ?? zones.LOWER_CENTER;
    if (!zone) continue;

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

  // ─── 10. FIXED INCLUSIONS (Jars) ─────────────────────────────────────────
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

  // ─── 11. GARNISH (Rosemary Sprigs — intentional placement only) ──────────
  // A small fixed number of sprigs placed at compositional "bridge" points
  // between major zones — not random carpet filling.
  const sprigBridges: Array<{ x: number; y: number; rot: number }> = [
    // Between meat zone and cheese zone (upper-left bridge)
    { x: zones.BRIE_ZONE ? zones.BRIE_ZONE.x + zones.BRIE_ZONE.w * 0.85 : dims.width * 0.27,
      y: zones.BRIE_ZONE ? zones.BRIE_ZONE.y + zones.BRIE_ZONE.h * 0.15 : dims.height * 0.12,
      rot: -35 },
    // Between right cheese and fruit (upper-right bridge)
    { x: zones.MANCHEGO_ZONE ? zones.MANCHEGO_ZONE.x + zones.MANCHEGO_ZONE.w * 0.1 : dims.width * 0.7,
      y: zones.MANCHEGO_ZONE ? zones.MANCHEGO_ZONE.y + zones.MANCHEGO_ZONE.h * 0.85 : dims.height * 0.42,
      rot: 45 },
    // Lower center accent
    { x: dims.width * 0.48,
      y: zones.SOFT_CHEESE_ZONE ? zones.SOFT_CHEESE_ZONE.y - 10 : dims.height * 0.72,
      rot: 12 },
  ];

  // Add 1–2 more sprigs for medium/large boards
  if (size !== 'small') {
    sprigBridges.push({
      x: zones.SALAMI_ZONE_1 ? zones.SALAMI_ZONE_1.x - 12 : dims.width * 0.1,
      y: zones.SALAMI_ZONE_1 ? zones.SALAMI_ZONE_1.y + zones.SALAMI_ZONE_1.h * 0.5 : dims.height * 0.55,
      rot: -60,
    });
  }
  if (size === 'large') {
    sprigBridges.push({
      x: zones.CHEDDAR_ZONE ? zones.CHEDDAR_ZONE.x + 10 : dims.width * 0.72,
      y: zones.CHEDDAR_ZONE ? zones.CHEDDAR_ZONE.y - 8 : dims.height * 0.6,
      rot: 70,
    });
  }

  sprigBridges.forEach((bridge, i) => {
    layoutItems.push(drawHerbSprig(
      `rosemary_${i}`,
      bridge.x + (rng() - 0.5) * 14,
      bridge.y + (rng() - 0.5) * 10,
      bridge.rot + (rng() - 0.5) * 20,
      '#3D6B28', rng,
    ));
  });

  // ─── 12. GAP FILL (subtle microgreen tufts, capped at 8) ─────────────────
  const gapFillers = fillGaps(layoutItems, dims.width, dims.height, zones.GARNISH_SCATTER, rng);
  layoutItems.push(...gapFillers);

  // ─── Sort by zIndex ───────────────────────────────────────────────────────
  return layoutItems.sort((a, b) => a.zIndex - b.zIndex);
}

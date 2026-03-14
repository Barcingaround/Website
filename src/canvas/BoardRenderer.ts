/**
 * Core board layout engine.
 * PURE FUNCTION — same inputs always produce same output (deterministic via seeded RNG).
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
  drawContinuousFan,
  drawRosetteCluster,
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

  // Resolve unit counts for each selection
  function resolveUnits(sel: IngredientSelection): number {
    const ing = getIngredientById(sel.ingredientId);
    if (!ing) return 0;
    const upp = typeof ing.unitsPerPoint === 'number'
      ? ing.unitsPerPoint
      : (ing.unitsPerPoint as { cc: number; co: number })[category] ?? 0;
    return sel.pointsAllocated * upp;
  }

  const allSelections = [...board.ingredientSelections, ...board.accoutrementSelections];

  // ─── 1. MEATS: TOP_SWEEP (prosciutto, serrano) ───────────────────────────
  for (const sel of allSelections) {
    const ing = getIngredientById(sel.ingredientId);
    if (!ing || ing.category !== 'meat') continue;
    if (ing.renderStyle === 'continuous_fan' || ing.renderStyle === 'folded_fan') {
      const zone = zones.TOP_SWEEP;
      if (!zone) continue;
      const units = resolveUnits(sel);
      layoutItems.push(drawContinuousFan(sel.ingredientId, units, zone, ing.renderColor as string || '#C4706B', rng));
    }
  }

  // ─── 2. EDGE-LINING CHEESES (CO boards: manchego LEFT_EDGE_LINING, cheddar RIGHT_EDGE_LINING) ─
  if (category === 'co') {
    for (const sel of allSelections) {
      const ing = getIngredientById(sel.ingredientId);
      if (!ing || ing.category !== 'cheese') continue;
      const zoneKey = (ing.zone as { cc?: string; co?: string })?.co;
      if (zoneKey !== 'LEFT_EDGE_LINING' && zoneKey !== 'RIGHT_EDGE_LINING') continue;
      const zone = zones[zoneKey];
      if (!zone) continue;
      const units = resolveUnits(sel);
      layoutItems.push(drawFanArc(sel.ingredientId, units, zone, ing.renderColor as string || '#E8D48A', (ing as {rindColor?: string}).rindColor || '#C4A855', 'none', rng));
    }
  }

  // ─── 3. FANNED CHEESES ────────────────────────────────────────────────────
  for (const sel of allSelections) {
    const ing = getIngredientById(sel.ingredientId);
    if (!ing || ing.category !== 'cheese') continue;
    if (ing.renderStyle !== 'fan_arc') continue;
    const zoneConfig = ing.zone as { cc?: string; co?: string } | string;
    const zoneKey = typeof zoneConfig === 'string' ? zoneConfig : (zoneConfig[category] ?? 'CENTER_MOUND');
    if (zoneKey === 'LEFT_EDGE_LINING' || zoneKey === 'RIGHT_EDGE_LINING') continue; // already handled
    const zone = zones[zoneKey];
    if (!zone) continue;
    const units = resolveUnits(sel);
    const special = sel.ingredientId === 'humboldt_fog' ? 'ash_line' : sel.ingredientId === 'herb_goat' ? 'herb_coat' : 'none';
    layoutItems.push(drawFanArc(sel.ingredientId, units, zone, ing.renderColor as string || '#F5EDD0', (ing as {rindColor?: string}).rindColor || '#E0D8C0', special as 'ash_line' | 'herb_coat' | 'none', rng));
  }

  // ─── 4. GOUDA CENTER MOUND ────────────────────────────────────────────────
  for (const sel of allSelections) {
    if (sel.ingredientId !== 'gouda_cubes') continue;
    const ing = getIngredientById(sel.ingredientId);
    const zone = zones.CENTER_MOUND;
    if (!ing || !zone) continue;
    const units = resolveUnits(sel);
    layoutItems.push(drawStackedMound(sel.ingredientId, units, zone, ing.renderColor as string || '#F0C84A', rng));
  }

  // ─── 5. SALAMI BAND (C&C only) ────────────────────────────────────────────
  if (category === 'cc') {
    const salamiSelections = allSelections.filter(sel => {
      const ing = getIngredientById(sel.ingredientId);
      return ing?.renderStyle === 'rosette_cluster';
    });

    if (salamiSelections.length > 0) {
      const totalUnits = salamiSelections.reduce((sum, sel) => sum + resolveUnits(sel), 0);
      const zone = zones.SALAMI_BAND;
      if (zone) {
        // Split zone equally among salami types
        const subW = zone.w / salamiSelections.length;
        salamiSelections.forEach((sel, i) => {
          const ing = getIngredientById(sel.ingredientId);
          const subZone = { x: zone.x + i * subW, y: zone.y, w: subW, h: zone.h };
          const units = resolveUnits(sel);
          layoutItems.push(drawRosetteCluster(sel.ingredientId, units, subZone, ing?.renderColor as string || '#8B3A3A', rng));
        });
      }
    }
  }

  // ─── 6. SOFT CHEESES (Boursin, Goat Cheese) ──────────────────────────────
  for (const sel of allSelections) {
    const ing = getIngredientById(sel.ingredientId);
    if (!ing || ing.category !== 'cheese') continue;
    const zone = zones.LOWER_CENTER;
    if (!zone) continue;
    const units = resolveUnits(sel);

    if (ing.renderStyle === 'round_disc') {
      layoutItems.push(drawRoundDisc(sel.ingredientId, units, zone, ing.renderColor as string || '#EDE8DC', (ing as {herbColor?: string}).herbColor || '#7A9950', rng));
    } else if (ing.renderStyle === 'round_slices') {
      layoutItems.push(drawRoundSlices(sel.ingredientId, units, zone, ing.renderColor as string || '#F2EDE0', (ing as {herbColor?: string}).herbColor || '#6B8C4A', rng));
    }
  }

  // ─── 7. DRAGON FRUIT (CO only — ALWAYS on top, zIndex 50) ────────────────
  for (const sel of allSelections) {
    if (sel.ingredientId !== 'dragon_fruit') continue;
    const ing = getIngredientById(sel.ingredientId);
    const zone = zones.LOWER_LEFT_ANCHOR;
    if (!ing || !zone) continue;
    const units = resolveUnits(sel);
    layoutItems.push(drawExoticAnchor(sel.ingredientId, units, zone, (ing as {skinColor?: string}).skinColor || '#E8205A', (ing as {interiorColor?: string}).interiorColor || '#F5F0F0', rng));
  }

  // ─── 8. FRUITS ────────────────────────────────────────────────────────────
  for (const sel of allSelections) {
    const ing = getIngredientById(sel.ingredientId);
    if (!ing || ing.category !== 'fruit') continue;
    if (sel.ingredientId === 'dragon_fruit') continue; // handled above
    const units = resolveUnits(sel);

    const zoneConfig = ing.zone as string | { cc?: string; co?: string };
    const zoneKey = typeof zoneConfig === 'string' ? zoneConfig : (zoneConfig[category] ?? 'ACCENT_SCATTER');
    const zone = zones[zoneKey] ?? zones.ACCENT_SCATTER;
    if (!zone) continue;

    switch (ing.renderStyle) {
      case 'grape_cluster':
        layoutItems.push(drawGrapeCluster(sel.ingredientId, units, zone, ing.renderColor as string || '#8FBA5E', (ing as {highlightColor?: string}).highlightColor || '#C4E08A', rng));
        break;
      case 'berry_scatter':
        layoutItems.push(drawBerryScatter(sel.ingredientId, units, zone, ing.renderColor as string || '#D63B3B', sel.ingredientId === 'strawberries', sel.ingredientId === 'raspberries', rng));
        break;
      case 'berry_cluster':
        layoutItems.push(drawBerryCluster(sel.ingredientId, units, zone, ing.renderColor as string || '#3B4B7A', (ing as {highlightColor?: string}).highlightColor || '#6070AA', rng));
        break;
      case 'citrus_slice':
        layoutItems.push(drawCitrusSlice(sel.ingredientId, units, zone, ing.renderColor as string || '#F07820', sel.ingredientId === 'kiwi' ? ((ing as {centerColor?: string}).centerColor || '#E8E8C0') : ((ing as {segmentColor?: string}).segmentColor || '#F5A040'), sel.ingredientId === 'kiwi', rng));
        break;
      case 'arc_placement':
      case 'small_scatter':
        layoutItems.push(drawSmallScatter(sel.ingredientId, units, zone, ing.renderColor as string || '#3A2010', sel.ingredientId === 'chocolate_pretzels', rng));
        break;
    }
  }

  // ─── 9. ACCOUTREMENTS ─────────────────────────────────────────────────────
  for (const sel of board.accoutrementSelections) {
    const ing = getIngredientById(sel.ingredientId);
    if (!ing) continue;
    const units = resolveUnits(sel);
    const zone = zones.ACCENT_SCATTER ?? zones.LOWER_CENTER;
    if (!zone) continue;

    switch (ing.renderStyle) {
      case 'nut_cluster':
        layoutItems.push(drawNutCluster(sel.ingredientId, units, zone, ing.renderColor as string || '#8B6040', sel.ingredientId === 'pistachios', rng));
        break;
      case 'pickle_cluster':
        layoutItems.push(drawPickleCluster(sel.ingredientId, units, zone, ing.renderColor as string || '#6B9040', rng));
        break;
      case 'olive_cluster':
        layoutItems.push(drawOliveCluster(sel.ingredientId, units, zone, ing.renderColor as string || '#7A9840', rng));
        break;
    }
  }

  // ─── 10. FIXED INCLUSIONS (Jars) ─────────────────────────────────────────
  const jarCount = size === 'large' ? 2 : 1;
  const jarZone = zones.JAR_PLACEMENT;
  if (jarZone) {
    for (let j = 0; j < jarCount; j++) {
      const cx = jarZone.x + jarZone.w / 2 + (j - 0.5) * jarZone.w * 0.4;
      const cy = jarZone.y + jarZone.h / 2;
      layoutItems.push(drawBrandedJar(`jam_jar_${j}`, cx, cy, false));
    }
    // Honey jar for CO boards
    if (category === 'co') {
      const hcx = jarZone.x + jarZone.w * 0.8;
      const hcy = jarZone.y + jarZone.h * 0.8;
      layoutItems.push(drawBrandedJar('honey_jar', hcx, hcy, true));
    }
  }

  // ─── 11. GARNISH SCATTER (Rosemary + Microgreens) ─────────────────────────
  const sprigCounts = { small: 3, medium: 5, large: 8 };
  const sprigCount = sprigCounts[size];
  const garnishZone = zones.GARNISH_SCATTER;
  if (garnishZone) {
    for (let i = 0; i < sprigCount; i++) {
      const cx = garnishZone.x + rng() * garnishZone.w;
      const cy = garnishZone.y + rng() * garnishZone.h;
      const rot = (rng() - 0.5) * 160;
      layoutItems.push(drawHerbSprig(`rosemary_${i}`, cx, cy, rot, '#4A7A30', rng));
    }
  }

  // ─── 12. GAP FILL (>95% board coverage) ──────────────────────────────────
  const gapFillers = fillGaps(layoutItems, dims.width, dims.height, zones.GARNISH_SCATTER, rng);
  layoutItems.push(...gapFillers);

  // ─── Sort by zIndex ───────────────────────────────────────────────────────
  return layoutItems.sort((a, b) => a.zIndex - b.zIndex);
}

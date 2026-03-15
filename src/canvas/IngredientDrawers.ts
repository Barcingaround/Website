/**
 * SVG ingredient drawers — all visual rendering for board ingredients.
 *
 * Design principles:
 * - Every item looks like actual food, not abstract shapes
 * - Meats: translucent ribbon/petal drapes (prosciutto/serrano), rosettes
 *   with fat marbling and fold creases (salami)
 * - Cheeses: visible rinds, wedge fans with realistic textures
 * - Quantities reflect in count/size/density, not thickness in one spot
 * - Gradient IDs reference GradientDefs.tsx; all major items use them
 */

export interface SVGElementDescriptor {
  type: 'path' | 'circle' | 'rect' | 'ellipse' | 'line' | 'polygon' | 'g';
  attrs: Record<string, string | number | undefined>;
  children?: SVGElementDescriptor[];
  gradientId?: string;
}

export interface LayoutItem {
  id: string;
  ingredientId: string;
  renderStyle: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  zIndex: number;
  elements: SVGElementDescriptor[];
}

import type { Zone } from './ZoneEngine';

// ─── DRAPED MEAT (Prosciutto / Serrano / Coppa) ──────────────────────────────
//
// Each slice is rendered as a loose, slightly crumpled ribbon petal — the way
// prosciutto looks when loosely folded on a real board: translucent, silky,
// showing individual layers through each other. Fat streaks cross each piece.
//
export function drawDrapedMeat(
  ingredientId: string,
  units: number,
  zone: Zone,
  _color: string,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];

  // Number of individual drape pieces = unit count directly (each unit = 1 visible drape fold)
  const numPieces = Math.max(3, Math.min(20, units));
  const isProsc = ingredientId === 'prosciutto' || ingredientId.includes('prosciutto');
  const gradId = isProsc ? 'prosciuttoFill' : ingredientId.includes('serrano') ? 'serranoFill' : 'coppaFill';

  // Fan pivot: determine which corner of the zone to fan from
  // Use upper-left corner as default focal point for a natural cascade
  const pivotX = zone.x + zone.w * 0.08;
  const pivotY = zone.y + zone.h * 0.92;

  // Piece dimensions
  const pieceLen = Math.min(zone.w * 0.75, zone.h * 1.8, 110);
  const pieceW   = Math.min(zone.w / 5, 28);

  // Fan spread angle
  const totalAng = Math.min(75, 20 + numPieces * 3.5);
  const startAng = -totalAng / 2 - 80; // rotate so fan points upward from pivot

  for (let i = 0; i < numPieces; i++) {
    const t = numPieces === 1 ? 0.5 : i / (numPieces - 1);
    const ang = ((startAng + t * totalAng) * Math.PI) / 180;

    // Direction vector for this piece
    const dirX = Math.cos(ang);
    const dirY = Math.sin(ang);
    // Perpendicular
    const perpX = -dirY;
    const perpY = dirX;

    // Base of the piece (near pivot)
    const baseX = pivotX + dirX * pieceLen * 0.05;
    const baseY = pivotY + dirY * pieceLen * 0.05;
    // Tip of the piece (far end)
    const tipX = pivotX + dirX * pieceLen;
    const tipY = pivotY + dirY * pieceLen;

    // Waviness: slight S-curve on each long edge for organic look
    const wL = (rng() - 0.5) * 10; // left edge wave
    const wR = (rng() - 0.5) * 10; // right edge wave
    const mx = (baseX + tipX) / 2;
    const my = (baseY + tipY) / 2;

    // Left edge control points
    const lx1 = mx + perpX * (-pieceW * 0.5 + wL) - dirX * 5;
    const ly1 = my + perpY * (-pieceW * 0.5 + wL) - dirY * 5;
    // Right edge control points
    const rx1 = mx + perpX * (pieceW * 0.5 + wR) + dirX * 5;
    const ry1 = my + perpY * (pieceW * 0.5 + wR) + dirY * 5;

    // Build the drape petal path:
    // Start at base-left, curve to tip-left, across tip, curve back to base-right
    const blX = baseX - perpX * pieceW * 0.5;
    const blY = baseY - perpY * pieceW * 0.5;
    const brX = baseX + perpX * pieceW * 0.5;
    const brY = baseY + perpY * pieceW * 0.5;
    const tlX = tipX - perpX * pieceW * 0.3 + (rng() - 0.5) * 6;
    const tlY = tipY - perpY * pieceW * 0.3 + (rng() - 0.5) * 6;
    const trX = tipX + perpX * pieceW * 0.3 + (rng() - 0.5) * 6;
    const trY = tipY + perpY * pieceW * 0.3 + (rng() - 0.5) * 6;

    const piecePath = [
      `M ${blX.toFixed(1)} ${blY.toFixed(1)}`,
      `C ${lx1.toFixed(1)} ${ly1.toFixed(1)} ${lx1.toFixed(1)} ${ly1.toFixed(1)} ${tlX.toFixed(1)} ${tlY.toFixed(1)}`,
      `Q ${(tipX + (rng()-0.5)*4).toFixed(1)} ${(tipY + (rng()-0.5)*4).toFixed(1)} ${trX.toFixed(1)} ${trY.toFixed(1)}`,
      `C ${rx1.toFixed(1)} ${ry1.toFixed(1)} ${rx1.toFixed(1)} ${ry1.toFixed(1)} ${brX.toFixed(1)} ${brY.toFixed(1)}`,
      `Q ${(baseX + (rng()-0.5)*3).toFixed(1)} ${(baseY + (rng()-0.5)*3).toFixed(1)} ${blX.toFixed(1)} ${blY.toFixed(1)}`,
      'Z',
    ].join(' ');

    const opacity = 0.58 + (i / numPieces) * 0.28;

    elements.push({
      type: 'path',
      attrs: {
        d: piecePath,
        fill: `url(#${gradId})`,
        opacity,
        filter: 'url(#meatShadow)',
      },
    });

    // Fat streak: a thin curved line across the piece (cream/translucent)
    if (rng() > 0.35) {
      const streakT = 0.3 + rng() * 0.4;
      const sStartX = blX + (tlX - blX) * streakT;
      const sStartY = blY + (tlY - blY) * streakT;
      const sEndX   = brX + (trX - brX) * streakT;
      const sEndY   = brY + (trY - brY) * streakT;
      const sMidX   = (sStartX + sEndX) / 2 + (rng() - 0.5) * 5;
      const sMidY   = (sStartY + sEndY) / 2 + (rng() - 0.5) * 3;
      elements.push({
        type: 'path',
        attrs: {
          d: `M ${sStartX.toFixed(1)} ${sStartY.toFixed(1)} Q ${sMidX.toFixed(1)} ${sMidY.toFixed(1)} ${sEndX.toFixed(1)} ${sEndY.toFixed(1)}`,
          stroke: 'url(#prosciuttoFatStreak)',
          'stroke-width': (1.5 + rng() * 1.5).toFixed(1),
          fill: 'none',
          opacity: 0.45,
        },
      });
    }
  }

  return {
    id: `${ingredientId}_drape`,
    ingredientId,
    renderStyle: 'continuous_fan',
    x: zone.x,
    y: zone.y,
    width: zone.w,
    height: zone.h,
    zIndex: 10,
    elements,
  };
}

// Keep old export name as alias for any code still using it
export const drawContinuousFan = drawDrapedMeat;

// ─── SALAMI ROSETTE CLUSTER ───────────────────────────────────────────────────
//
// Each rosette represents a salami slice folded into a "rose" shape.
// Real salami rosettes show: circular face with fat marbling (cream dots),
// a fold crease line across the upper portion, and for peppered/spiced
// varieties, small dark specks near the circumference.
//
export function drawSalamiRosette(
  ingredientId: string,
  units: number,
  zone: Zone,
  color: string,
  hasSpiceSpecks: boolean,
  isHeavilyMarbled: boolean, // true for coppa
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const count = Math.max(1, units);

  // Auto-size rosettes to fill the zone without crowding
  const area = zone.w * zone.h;
  const rosetteDiam = Math.min(34, Math.max(18, Math.sqrt(area / count) * 0.82));
  const r = rosetteDiam / 2;

  // Organic grid placement with jitter
  const cols = Math.max(1, Math.ceil(Math.sqrt(count * (zone.w / zone.h))));
  const rows = Math.ceil(count / cols);
  const jitter = 0.25;

  let placed = 0;
  for (let row = 0; row < rows && placed < count; row++) {
    for (let col = 0; col < cols && placed < count; col++) {
      const cx = zone.x + (col + 0.5 + (rng() - 0.5) * jitter) * (zone.w / cols);
      const cy = zone.y + (row + 0.5 + (rng() - 0.5) * jitter) * (zone.h / rows);

      // Slight rotation per rosette (rosettes aren't perfectly upright)
      const rot = (rng() - 0.5) * 30;

      // ── Base circle (the slice face) ─────────────────────────────────────
      elements.push({
        type: 'circle',
        attrs: {
          cx, cy, r,
          fill: 'url(#salamiRosetteFill)',
          opacity: 0.9,
          filter: 'url(#ingredientShadow)',
        },
      });

      // ── Fat marbling dots (cream ellipses scattered across the slice) ────
      const marbleCount = isHeavilyMarbled ? 18 : 8 + Math.floor(rng() * 5);
      for (let m = 0; m < marbleCount; m++) {
        // Scatter within 85% of radius
        const mAngle = rng() * Math.PI * 2;
        const mDist  = rng() * r * 0.82;
        const mx = cx + Math.cos(mAngle) * mDist;
        const my = cy + Math.sin(mAngle) * mDist;
        const mRx = 2.5 + rng() * (isHeavilyMarbled ? 4.5 : 2.5);
        const mRy = 1.2 + rng() * (isHeavilyMarbled ? 2.5 : 1.5);
        const mRot = rng() * 180;
        elements.push({
          type: 'ellipse',
          attrs: {
            cx: mx, cy: my,
            rx: mRx, ry: mRy,
            fill: 'url(#salamiFatMarble)',
            opacity: 0.72 + rng() * 0.2,
            transform: `rotate(${mRot.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)})`,
          },
        });
      }

      // ── Fold crease: arc across the upper third of the slice ──────────────
      // This is the key visual that makes it look like a real rosette fold
      const creaseY = cy - r * 0.35;
      const creaseR = r * 0.95;
      const creaseStartX = cx - Math.sqrt(Math.max(0, creaseR * creaseR - (creaseY - cy) * (creaseY - cy)));
      const creaseEndX   = cx + Math.sqrt(Math.max(0, creaseR * creaseR - (creaseY - cy) * (creaseY - cy)));
      elements.push({
        type: 'path',
        attrs: {
          d: `M ${creaseStartX.toFixed(1)} ${creaseY.toFixed(1)} Q ${cx.toFixed(1)} ${(creaseY - r * 0.15).toFixed(1)} ${creaseEndX.toFixed(1)} ${creaseY.toFixed(1)}`,
          stroke: shiftColor(color, 0, -22),
          'stroke-width': '1.8',
          fill: 'none',
          opacity: 0.55,
          transform: `rotate(${rot.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})`,
        },
      });

      // ── Spice specks near circumference (peppered, calabrese) ────────────
      if (hasSpiceSpecks) {
        const speckCount = 8 + Math.floor(rng() * 6);
        for (let s = 0; s < speckCount; s++) {
          const sAngle = rng() * Math.PI * 2;
          const sDist  = r * (0.55 + rng() * 0.35); // near outer edge
          elements.push({
            type: 'circle',
            attrs: {
              cx: cx + Math.cos(sAngle) * sDist,
              cy: cy + Math.sin(sAngle) * sDist,
              r: 0.9 + rng() * 0.8,
              fill: '#1A1008',
              opacity: 0.65 + rng() * 0.2,
            },
          });
        }
      }

      placed++;
    }
  }

  return {
    id: `${ingredientId}_rosette`,
    ingredientId,
    renderStyle: 'rosette_cluster',
    x: zone.x,
    y: zone.y,
    width: zone.w,
    height: zone.h,
    zIndex: 12,
    elements,
  };
}

// Keep old export name as alias
export const drawRosetteCluster = (
  ingredientId: string, units: number, zone: Zone, _color: string, rng: () => number
) => drawSalamiRosette(ingredientId, units, zone, _color, false, false, rng);

// ─── FAN ARC (Brie, Manchego, Cheddar, Humboldt Fog) ─────────────────────────
//
// Cheese wedges fanned from a pivot point. Each cheese type gets:
// - A clearly visible rind at the outer arc edge (thicker stroke, distinct color)
// - Interior texture variation (subtle gradient, small "eye" holes for some)
// - Humboldt Fog: characteristic grey ash line through all wedges
//
export function drawFanArc(
  ingredientId: string,
  units: number,
  zone: Zone,
  color: string,
  rindColor: string,
  specialFeature: 'ash_line' | 'herb_coat' | 'none',
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const sliceCount = Math.max(3, Math.min(units, 18));
  const fanAngle = Math.min(90, 22 + sliceCount * 4.5);
  const startAngle = -fanAngle / 2;

  // Assign gradient ID based on ingredient
  const gradMap: Record<string, string> = {
    brie:           'brieFill',
    manchego:       'manchegoFill',
    gouda_cubes:    'goudaFill',
    mature_cheddar: 'cheddarFill',
    herb_goat:      'goatFill',
    boursin:        'boursinFill',
    humboldt_fog:   'humboldtFill',
  };
  const gradId = gradMap[ingredientId] || 'brieFill';

  // Rind stroke width by cheese type
  const rindW: Record<string, number> = {
    brie:         7,   // Brie has a very visible white rind
    manchego:     4,
    mature_cheddar: 3,
    humboldt_fog: 3,
    herb_goat:    5,
  };
  const rindStrokeW = rindW[ingredientId] ?? 3;

  // Fan pivot — at the "inward" edge of the zone
  let pivotX: number, pivotY: number, pivotEdge: 'left' | 'right' | 'bottom' | 'top';
  if (zone.x < 80) {
    pivotX = zone.x + 12; pivotY = zone.y + zone.h * 0.55; pivotEdge = 'left';
  } else if (zone.x + zone.w > 720) {
    pivotX = zone.x + zone.w - 12; pivotY = zone.y + zone.h * 0.55; pivotEdge = 'right';
  } else if (zone.y + zone.h > 500) {
    pivotX = zone.x + zone.w / 2; pivotY = zone.y + zone.h - 8; pivotEdge = 'bottom';
  } else {
    pivotX = zone.x + zone.w / 2; pivotY = zone.y + zone.h; pivotEdge = 'bottom';
  }

  const sliceLength = Math.min(zone.w * 0.9, zone.h * 1.3, 120);

  for (let i = 0; i < sliceCount; i++) {
    const angle = startAngle + (i / Math.max(1, sliceCount - 1)) * fanAngle;
    const rad   = (angle * Math.PI) / 180;

    let dx: number, dy: number;
    switch (pivotEdge) {
      case 'left':   dx = Math.cos(rad);       dy = Math.sin(rad);       break;
      case 'right':  dx = -Math.cos(rad);      dy = Math.sin(rad);       break;
      case 'bottom': dx = Math.sin(rad);       dy = -Math.abs(Math.cos(rad)); break;
      default:       dx = Math.cos(rad);       dy = Math.sin(rad);
    }

    const tipX  = pivotX + dx * sliceLength;
    const tipY  = pivotY + dy * sliceLength;
    const perpX = -dy * sliceLength * 0.16;
    const perpY =  dx * sliceLength * 0.16;

    // Wedge path with slightly rounded tip
    const wedgePath = [
      `M ${pivotX.toFixed(1)} ${pivotY.toFixed(1)}`,
      `L ${(tipX - perpX).toFixed(1)} ${(tipY - perpY).toFixed(1)}`,
      `Q ${tipX.toFixed(1)} ${(tipY - perpY * 0.2 + (rng()-0.5)*3).toFixed(1)} ${(tipX + perpX).toFixed(1)} ${(tipY + perpY).toFixed(1)}`,
      'Z',
    ].join(' ');

    const baseOpacity = 0.80 + i * 0.008;

    // Fill with gradient
    elements.push({
      type: 'path',
      attrs: {
        d: wedgePath,
        fill: `url(#${gradId})`,
        opacity: baseOpacity,
        filter: i === 0 ? 'url(#softShadow)' : undefined,
      },
    });

    // Outer rind arc — the key visual distinguisher for each cheese
    const rindArc = [
      `M ${(tipX - perpX).toFixed(1)} ${(tipY - perpY).toFixed(1)}`,
      `Q ${tipX.toFixed(1)} ${tipY.toFixed(1)} ${(tipX + perpX).toFixed(1)} ${(tipY + perpY).toFixed(1)}`,
    ].join(' ');
    elements.push({
      type: 'path',
      attrs: {
        d: rindArc,
        stroke: rindColor,
        'stroke-width': rindStrokeW,
        fill: 'none',
        opacity: 0.85,
        'stroke-linecap': 'round',
      },
    });

    // ── Brie: white visible rind (extra visible) ─────────────────────────
    if (ingredientId === 'brie') {
      elements.push({
        type: 'path',
        attrs: {
          d: rindArc,
          stroke: '#F5F2EC',
          'stroke-width': rindStrokeW + 2,
          fill: 'none',
          opacity: 0.7,
          'stroke-linecap': 'round',
        },
      });
    }

    // ── Manchego: herringbone rind pattern ──────────────────────────────
    if (ingredientId === 'manchego') {
      // Small cross-hatch ticks along the outer arc
      for (let t = 0; t <= 4; t++) {
        const tt = t / 4;
        const arcX = tipX - perpX + (tipX + perpX - (tipX - perpX)) * tt;
        const arcY = tipY - perpY + (tipY + perpY - (tipY - perpY)) * tt;
        elements.push({
          type: 'line',
          attrs: {
            x1: arcX - 2, y1: arcY - 3,
            x2: arcX + 2, y2: arcY + 3,
            stroke: '#806020',
            'stroke-width': 1,
            opacity: 0.55,
          },
        });
      }
    }

    // ── Humboldt Fog: grey ash line across each wedge ─────────────────
    if (specialFeature === 'ash_line') {
      const ashT  = 0.48;
      const ashX  = pivotX + (tipX - pivotX) * ashT;
      const ashY  = pivotY + (tipY - pivotY) * ashT;
      const ashPX = perpX * 0.9 * ashT;
      const ashPY = perpY * 0.9 * ashT;
      elements.push({
        type: 'path',
        attrs: {
          d: `M ${(ashX - ashPX).toFixed(1)} ${(ashY - ashPY).toFixed(1)} L ${(ashX + ashPX).toFixed(1)} ${(ashY + ashPY).toFixed(1)}`,
          stroke: '#7A7A72',
          'stroke-width': 3.5,
          opacity: 0.72,
          'stroke-linecap': 'round',
        },
      });
    }

    // ── Cheese eyes (small holes visible in cross-section) ──────────
    if ((ingredientId === 'manchego' || ingredientId === 'mature_cheddar') && rng() > 0.55) {
      const eyeT = 0.35 + rng() * 0.35;
      const eyeX = pivotX + (tipX - pivotX) * eyeT + (rng() - 0.5) * 8;
      const eyeY = pivotY + (tipY - pivotY) * eyeT + (rng() - 0.5) * 6;
      elements.push({
        type: 'ellipse',
        attrs: {
          cx: eyeX, cy: eyeY,
          rx: 3 + rng() * 2,
          ry: 2 + rng() * 1.5,
          fill: shiftColor(color, -5, -12),
          opacity: 0.4,
        },
      });
    }
  }

  return {
    id: `${ingredientId}_fan`,
    ingredientId,
    renderStyle: 'fan_arc',
    x: zone.x, y: zone.y, width: zone.w, height: zone.h,
    zIndex: 20,
    elements,
  };
}

// ─── STACKED MOUND (Gouda cubes) ──────────────────────────────────────────────
//
// Amber-orange Gouda cubes stacked into a mound. Each cube shows 3 faces
// (top, right side, bottom side) for a 3D isometric look. Rind edge on each.
//
export function drawStackedMound(
  ingredientId: string,
  units: number,
  zone: Zone,
  _color: string,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];

  const cubeSize = Math.min(30, Math.max(16, zone.w / (units * 0.42)));
  const perRow   = Math.max(1, Math.round(zone.w / (cubeSize * 1.18)));
  const layers   = Math.ceil(units / perRow);

  let placed = 0;
  for (let layer = 0; layer < layers && placed < units; layer++) {
    const cubesInLayer = Math.min(units - placed, perRow);
    const layerY   = zone.y + zone.h - (layer + 1) * (cubeSize * 0.88);
    const layerW   = cubesInLayer * (cubeSize * 1.12);
    const startX   = zone.x + (zone.w - layerW) / 2 + (rng() - 0.5) * 5;

    for (let col = 0; col < cubesInLayer && placed < units; col++) {
      const cx = startX + col * (cubeSize * 1.12) + (rng() - 0.5) * 3;
      const cy = layerY + (rng() - 0.5) * 3;

      // Top face (lightest — catching light)
      elements.push({
        type: 'rect',
        attrs: {
          x: cx, y: cy,
          width: cubeSize, height: cubeSize,
          rx: 2,
          fill: 'url(#goudaFill)',
          opacity: 0.92,
          filter: layer === 0 ? 'url(#ingredientShadow)' : undefined,
        },
      });
      // Rind edge on top face
      elements.push({
        type: 'rect',
        attrs: {
          x: cx, y: cy,
          width: cubeSize, height: cubeSize,
          rx: 2,
          fill: 'none',
          stroke: 'url(#goudaRind)',
          'stroke-width': 2.5,
          opacity: 0.7,
        },
      });
      // Right face (darker)
      elements.push({
        type: 'polygon',
        attrs: {
          points: `${cx + cubeSize},${cy} ${cx + cubeSize + 5},${cy + 4} ${cx + cubeSize + 5},${cy + cubeSize + 4} ${cx + cubeSize},${cy + cubeSize}`,
          fill: '#B07010',
          opacity: 0.65,
        },
      });
      // Bottom face (darkest)
      elements.push({
        type: 'polygon',
        attrs: {
          points: `${cx},${cy + cubeSize} ${cx + cubeSize},${cy + cubeSize} ${cx + cubeSize + 5},${cy + cubeSize + 4} ${cx + 5},${cy + cubeSize + 4}`,
          fill: '#906000',
          opacity: 0.55,
        },
      });

      placed++;
    }
  }

  return {
    id: `${ingredientId}_mound`,
    ingredientId,
    renderStyle: 'stacked_mound',
    x: zone.x, y: zone.y, width: zone.w, height: zone.h,
    zIndex: 25,
    elements,
  };
}

// ─── ROUND DISC (Boursin) ─────────────────────────────────────────────────────
export function drawRoundDisc(
  ingredientId: string,
  units: number,
  zone: Zone,
  _color: string,
  herbColor: string,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const pairs = Math.max(1, Math.round(units / 2));
  const r = Math.min(38, zone.w / (pairs * 2.6));

  for (let p = 0; p < pairs; p++) {
    const groupCx = zone.x + zone.w / 2 + (p - (pairs - 1) / 2) * (r * 2.5);
    const cy = zone.y + zone.h / 2;

    for (const offX of [-r * 0.55, r * 0.55]) {
      const cx = groupCx + offX;
      elements.push({
        type: 'circle',
        attrs: { cx, cy, r, fill: 'url(#boursinFill)', opacity: 0.92, filter: 'url(#softShadow)' },
      });
      // Herb & pepper coating
      for (let h = 0; h < 16; h++) {
        const hx = cx + (rng() - 0.5) * r * 1.7;
        const hy = cy + (rng() - 0.5) * r * 1.7;
        const isInsideCircle = (hx - cx) ** 2 + (hy - cy) ** 2 < (r * 0.82) ** 2;
        if (!isInsideCircle) continue;
        elements.push({
          type: 'ellipse',
          attrs: {
            cx: hx, cy: hy,
            rx: 2.2, ry: 1,
            fill: herbColor,
            opacity: 0.65,
            transform: `rotate(${(rng() * 180).toFixed(1)} ${hx.toFixed(1)} ${hy.toFixed(1)})`,
          },
        });
      }
      // Highlight
      elements.push({
        type: 'circle',
        attrs: { cx: cx - r * 0.2, cy: cy - r * 0.25, r: r * 0.28, fill: '#FFFFFF', opacity: 0.18 },
      });
    }
  }

  return {
    id: `${ingredientId}_disc`,
    ingredientId,
    renderStyle: 'round_disc',
    x: zone.x, y: zone.y, width: zone.w, height: zone.h,
    zIndex: 28,
    elements,
  };
}

// ─── ROUND SLICES (Goat cheese) ───────────────────────────────────────────────
export function drawRoundSlices(
  ingredientId: string,
  units: number,
  zone: Zone,
  _color: string,
  herbColor: string,
  _rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const r = Math.min(34, zone.h * 0.44);

  for (let i = 0; i < units; i++) {
    const cx = zone.x + zone.w / 2 + (i - (units - 1) / 2) * (r * 1.6 + 10);
    const cy = zone.y + zone.h / 2;

    const startAngle = -65;
    const endAngle   = 65;
    const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180);
    const y1 = cy + r * Math.sin((startAngle * Math.PI) / 180);
    const x2 = cx + r * Math.cos((endAngle * Math.PI) / 180);
    const y2 = cy + r * Math.sin((endAngle * Math.PI) / 180);

    elements.push({
      type: 'path',
      attrs: {
        d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`,
        fill: 'url(#goatFill)',
        opacity: 0.88,
        filter: 'url(#softShadow)',
      },
    });
    // Herb coat on curved outer edge
    elements.push({
      type: 'path',
      attrs: {
        d: `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`,
        stroke: herbColor,
        'stroke-width': 6,
        opacity: 0.6,
        fill: 'none',
        'stroke-linecap': 'round',
      },
    });
  }

  return {
    id: `${ingredientId}_slices`,
    ingredientId,
    renderStyle: 'round_slices',
    x: zone.x, y: zone.y, width: zone.w, height: zone.h,
    zIndex: 28,
    elements,
  };
}

// ─── EXOTIC ANCHOR (Dragon Fruit) ─────────────────────────────────────────────
export function drawExoticAnchor(
  ingredientId: string,
  units: number,
  zone: Zone,
  _skinColor: string,
  _interiorColor: string,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const r = Math.min(42, Math.min(zone.w / (units * 1.6), zone.h * 0.44));

  for (let i = 0; i < units; i++) {
    const cx = zone.x + r * 0.6 + i * (r * 1.7) + (rng() - 0.5) * 8;
    const cy = zone.y + zone.h / 2 + (rng() - 0.5) * 10;
    const rot = (rng() - 0.5) * 18;

    elements.push({
      type: 'circle',
      attrs: { cx, cy, r, fill: 'url(#dragonFruitSkin)', opacity: 0.96, filter: 'url(#ingredientShadow)', transform: `rotate(${rot.toFixed(1)} ${cx} ${cy})` },
    });
    elements.push({
      type: 'circle',
      attrs: { cx, cy, r: r * 0.76, fill: 'url(#dragonFruitInterior)', opacity: 0.97 },
    });
    // Black seed dots scattered in interior
    for (let s = 0; s < 28; s++) {
      const ang  = rng() * Math.PI * 2;
      const dist = rng() * r * 0.62;
      elements.push({
        type: 'circle',
        attrs: {
          cx: cx + Math.cos(ang) * dist,
          cy: cy + Math.sin(ang) * dist,
          r: 1.3,
          fill: '#1A1A1A',
          opacity: 0.82,
        },
      });
    }
  }

  return {
    id: `${ingredientId}_anchor`,
    ingredientId,
    renderStyle: 'exotic_anchor',
    x: zone.x, y: zone.y, width: zone.w, height: zone.h,
    zIndex: 50,
    elements,
  };
}

// ─── CITRUS SLICE (Mandarin, Kiwi) ───────────────────────────────────────────
export function drawCitrusSlice(
  ingredientId: string,
  units: number,
  zone: Zone,
  _color: string,
  extraColor: string,
  isKiwi: boolean,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const r = Math.min(24, zone.h * 0.32);

  for (let i = 0; i < units; i++) {
    const cx = zone.x + zone.w / 2 + (i - (units - 1) / 2) * (r * 2.3 + 5) + (rng() - 0.5) * 8;
    const cy = zone.y + zone.h / 2 + (rng() - 0.5) * 12;
    const rot = (rng() - 0.5) * 35;
    const gradId = isKiwi ? 'kiwiFill' : 'mandarinFill';

    if (isKiwi) {
      elements.push({
        type: 'circle',
        attrs: { cx, cy, r, fill: `url(#${gradId})`, opacity: 0.9, transform: `rotate(${rot} ${cx} ${cy})`, filter: 'url(#softShadow)' },
      });
      // Brown outer ring
      elements.push({
        type: 'circle',
        attrs: { cx, cy, r, fill: 'none', stroke: '#6A4820', 'stroke-width': 2.5, opacity: 0.5 },
      });
      // White center
      elements.push({
        type: 'circle',
        attrs: { cx, cy, r: r * 0.28, fill: extraColor, opacity: 0.88 },
      });
      // Seeds at even intervals
      for (let s = 0; s < 14; s++) {
        const ang = (s / 14) * Math.PI * 2;
        elements.push({
          type: 'ellipse',
          attrs: {
            cx: cx + Math.cos(ang) * r * 0.54,
            cy: cy + Math.sin(ang) * r * 0.54,
            rx: 1.5, ry: 0.9,
            fill: '#1A1A1A',
            opacity: 0.72,
            transform: `rotate(${((ang * 180) / Math.PI).toFixed(1)} ${(cx + Math.cos(ang) * r * 0.54).toFixed(1)} ${(cy + Math.sin(ang) * r * 0.54).toFixed(1)})`,
          },
        });
      }
    } else {
      // D-shape mandarin half
      elements.push({
        type: 'path',
        attrs: {
          d: `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} L ${cx} ${cy - r} Z`,
          fill: `url(#${gradId})`,
          opacity: 0.88,
          transform: `rotate(${rot} ${cx} ${cy})`,
          filter: 'url(#softShadow)',
        },
      });
      // Segment lines
      for (let seg = 1; seg < 7; seg++) {
        const ang = ((seg / 7) - 0.5) * Math.PI;
        elements.push({
          type: 'line',
          attrs: {
            x1: cx, y1: cy,
            x2: cx + Math.cos(ang) * r,
            y2: cy + Math.sin(ang) * r,
            stroke: '#C05008',
            'stroke-width': 0.7,
            opacity: 0.45,
          },
        });
      }
      // White pith outline
      elements.push({
        type: 'path',
        attrs: {
          d: `M ${cx} ${cy - r} L ${cx} ${cy + r}`,
          stroke: '#FFF8F0',
          'stroke-width': 2,
          opacity: 0.55,
        },
      });
    }
  }

  return {
    id: `${ingredientId}_citrus`,
    ingredientId,
    renderStyle: 'citrus_slice',
    x: zone.x, y: zone.y, width: zone.w, height: zone.h,
    zIndex: 35,
    elements,
  };
}

// ─── GRAPE CLUSTER ────────────────────────────────────────────────────────────
export function drawGrapeCluster(
  ingredientId: string,
  units: number,
  zone: Zone,
  _color: string,
  highlightColor: string,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const grapeR = 7.5;
  const gradId = ingredientId.includes('red') ? 'redGrapeFill' : 'greenGrapeFill';

  // Classic pyramid cluster arrangement
  const clusterPositions = [
    [0, 0],
    [-15, 10], [15, 10],
    [-8, 20], [8, 20], [0, 20],
    [-15, 30], [0, 30], [15, 30],
    [-8, 40], [8, 40],
    [0, 50],
    [-14, 42], [14, 42],
  ];

  for (let u = 0; u < units; u++) {
    const baseCx = zone.x + (u + 0.5) * (zone.w / units) + (rng() - 0.5) * 14;
    const baseCy = zone.y + zone.h * 0.2 + (rng() - 0.5) * 8;

    // Stem
    elements.push({
      type: 'path',
      attrs: {
        d: `M ${baseCx} ${baseCy - 10} Q ${baseCx - 5} ${baseCy - 6} ${baseCx} ${baseCy}`,
        stroke: '#6A5020',
        'stroke-width': 1.5,
        fill: 'none',
        opacity: 0.7,
      },
    });

    for (const [dx, dy] of clusterPositions) {
      const gx = baseCx + dx;
      const gy = baseCy + dy;
      elements.push({
        type: 'circle',
        attrs: { cx: gx, cy: gy, r: grapeR, fill: `url(#${gradId})`, opacity: 0.88, filter: 'url(#ingredientShadow)' },
      });
      // Highlight
      elements.push({
        type: 'circle',
        attrs: { cx: gx - 2.5, cy: gy - 2.5, r: 2.5, fill: highlightColor, opacity: 0.55 },
      });
    }
  }

  return {
    id: `${ingredientId}_grapes`,
    ingredientId,
    renderStyle: 'grape_cluster',
    x: zone.x, y: zone.y, width: zone.w, height: zone.h,
    zIndex: 30,
    elements,
  };
}

// ─── BERRY SCATTER ────────────────────────────────────────────────────────────
export function drawBerryScatter(
  ingredientId: string,
  units: number,
  zone: Zone,
  color: string,
  isStrawberry: boolean,
  isRaspberry: boolean,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const r = isStrawberry ? 10 : 7;
  const gradId = isStrawberry ? 'strawberryFill'
    : isRaspberry ? 'raspberryFill'
    : 'blackberryFill';

  for (let i = 0; i < units; i++) {
    const cx  = zone.x + (rng() * 0.78 + 0.11) * zone.w;
    const cy  = zone.y + (rng() * 0.78 + 0.11) * zone.h;
    const rot = rng() * 360;

    if (isStrawberry) {
      // Halved heart / teardrop cross-section
      elements.push({
        type: 'path',
        attrs: {
          d: `M ${cx} ${cy + r * 1.1} C ${cx - r * 1.35} ${cy - r * 0.1} ${cx - r * 1.1} ${cy - r} ${cx} ${cy - r * 0.3} C ${cx + r * 1.1} ${cy - r} ${cx + r * 1.35} ${cy - r * 0.1} ${cx} ${cy + r * 1.1} Z`,
          fill: `url(#${gradId})`,
          opacity: 0.88,
          filter: 'url(#softShadow)',
          transform: `rotate(${rot.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})`,
        },
      });
      // White center cross-section
      elements.push({
        type: 'ellipse',
        attrs: { cx, cy: cy + r * 0.05, rx: r * 0.45, ry: r * 0.65, fill: '#FFF5EE', opacity: 0.55 },
      });
      // Tiny seed dots on surface
      for (let s = 0; s < 8; s++) {
        const sang = (s / 8) * Math.PI * 2;
        const sd = r * (0.45 + rng() * 0.35);
        elements.push({
          type: 'ellipse',
          attrs: {
            cx: cx + Math.cos(sang) * sd * 0.7,
            cy: cy + Math.sin(sang) * sd,
            rx: 0.8, ry: 1.2,
            fill: '#C0E050',
            opacity: 0.6,
          },
        });
      }
    } else if (isRaspberry) {
      // Central bump + surrounding drupelets
      elements.push({
        type: 'circle',
        attrs: { cx, cy, r, fill: `url(#${gradId})`, opacity: 0.88 },
      });
      for (let d = 0; d < 5; d++) {
        const da = (d / 5) * Math.PI * 2 + 0.3;
        const dcx = cx + Math.cos(da) * r * 0.46;
        const dcy = cy + Math.sin(da) * r * 0.46;
        elements.push({
          type: 'circle',
          attrs: { cx: dcx, cy: dcy, r: r * 0.38, fill: shiftColor(color, 5, 5), opacity: 0.82 },
        });
      }
      elements.push({
        type: 'circle',
        attrs: { cx, cy, r: r * 0.28, fill: 'rgba(30,10,10,0.3)', opacity: 0.7 },
      });
    } else {
      // Blackberry — aggregate drupes
      elements.push({
        type: 'circle',
        attrs: { cx, cy, r, fill: `url(#${gradId})`, opacity: 0.92 },
      });
      for (let d = 0; d < 7; d++) {
        const da = (d / 7) * Math.PI * 2;
        elements.push({
          type: 'circle',
          attrs: {
            cx: cx + Math.cos(da) * r * 0.5,
            cy: cy + Math.sin(da) * r * 0.5,
            r: r * 0.32,
            fill: shiftColor(color, 10, 12),
            opacity: 0.85,
          },
        });
      }
      // Center drupelet
      elements.push({
        type: 'circle',
        attrs: { cx, cy, r: r * 0.25, fill: shiftColor(color, 15, 18), opacity: 0.9 },
      });
    }
  }

  return {
    id: `${ingredientId}_berries`,
    ingredientId,
    renderStyle: 'berry_scatter',
    x: zone.x, y: zone.y, width: zone.w, height: zone.h,
    zIndex: 32,
    elements,
  };
}

// ─── BERRY CLUSTER (Blueberries) ──────────────────────────────────────────────
export function drawBerryCluster(
  ingredientId: string,
  units: number,
  zone: Zone,
  color: string,
  highlightColor: string,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const berryR = 5.5;

  for (let u = 0; u < units; u++) {
    const cx = zone.x + (u + 0.5) * (zone.w / units) + (rng() - 0.5) * 12;
    const cy = zone.y + zone.h / 2 + (rng() - 0.5) * 10;
    const count = 18 + Math.floor(rng() * 8);

    for (let i = 0; i < count; i++) {
      const ang  = rng() * Math.PI * 2;
      const dist = rng() * berryR * 3.8;
      const bx   = cx + Math.cos(ang) * dist;
      const by   = cy + Math.sin(ang) * dist;
      const br   = berryR * (0.7 + rng() * 0.35);
      elements.push({
        type: 'circle',
        attrs: { cx: bx, cy: by, r: br, fill: 'url(#blueberryFill)', opacity: 0.85, filter: 'url(#ingredientShadow)' },
      });
      // Crown dimple
      elements.push({
        type: 'circle',
        attrs: { cx: bx, cy: by - br * 0.55, r: br * 0.3, fill: shiftColor(color, -10, -15), opacity: 0.5 },
      });
      // Highlight
      elements.push({
        type: 'circle',
        attrs: { cx: bx - br * 0.25, cy: by - br * 0.3, r: 1.8, fill: highlightColor, opacity: 0.45 },
      });
    }
  }

  return {
    id: `${ingredientId}_cluster`,
    ingredientId,
    renderStyle: 'berry_cluster',
    x: zone.x, y: zone.y, width: zone.w, height: zone.h,
    zIndex: 32,
    elements,
  };
}

// ─── NUT CLUSTER ─────────────────────────────────────────────────────────────
export function drawNutCluster(
  ingredientId: string,
  units: number,
  zone: Zone,
  color: string,
  isPistachio: boolean,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const gradId = isPistachio ? 'pistachioFill' : 'walnutFill';
  const countPer = 6 + Math.floor(rng() * 4);

  for (let u = 0; u < units; u++) {
    const groupCx = zone.x + (u + 0.5) * (zone.w / units);
    const groupCy = zone.y + zone.h / 2;

    for (let i = 0; i < countPer; i++) {
      const nx  = groupCx + (rng() - 0.5) * 32;
      const ny  = groupCy + (rng() - 0.5) * 26;
      const rot = rng() * 360;

      if (isPistachio) {
        // Shell oval
        elements.push({
          type: 'ellipse',
          attrs: {
            cx: nx, cy: ny,
            rx: 9, ry: 6,
            fill: `url(#${gradId})`,
            opacity: 0.87,
            filter: 'url(#ingredientShadow)',
            transform: `rotate(${rot.toFixed(1)} ${nx.toFixed(1)} ${ny.toFixed(1)})`,
          },
        });
        // Split line
        if (rng() > 0.35) {
          elements.push({
            type: 'line',
            attrs: {
              x1: nx - 3, y1: ny, x2: nx + 3, y2: ny,
              stroke: '#406820',
              'stroke-width': 2.5,
              opacity: 0.88,
              transform: `rotate(${rot.toFixed(1)} ${nx.toFixed(1)} ${ny.toFixed(1)})`,
            },
          });
        }
        // Green interior peek
        if (rng() > 0.5) {
          elements.push({
            type: 'ellipse',
            attrs: {
              cx: nx, cy: ny,
              rx: 3.5, ry: 2.5,
              fill: '#88C040',
              opacity: 0.7,
              transform: `rotate(${rot.toFixed(1)} ${nx.toFixed(1)} ${ny.toFixed(1)})`,
            },
          });
        }
      } else {
        // Walnut half — organic lobed shape
        elements.push({
          type: 'path',
          attrs: {
            d: `M ${nx} ${ny - 8} C ${nx - 9} ${ny - 8} ${nx - 9} ${ny + 8} ${nx} ${ny + 8} C ${nx + 9} ${ny + 8} ${nx + 9} ${ny - 8} ${nx} ${ny - 8}`,
            fill: `url(#${gradId})`,
            opacity: 0.85,
            filter: 'url(#ingredientShadow)',
            transform: `rotate(${rot.toFixed(1)} ${nx.toFixed(1)} ${ny.toFixed(1)})`,
          },
        });
        // Interior ridges
        elements.push({
          type: 'path',
          attrs: {
            d: `M ${nx} ${ny - 6} Q ${nx + 4} ${ny} ${nx} ${ny + 6} Q ${nx - 4} ${ny} ${nx} ${ny - 6}`,
            fill: shiftColor(color, -12, -18),
            opacity: 0.45,
          },
        });
      }
    }
  }

  return {
    id: `${ingredientId}_nuts`,
    ingredientId,
    renderStyle: 'nut_cluster',
    x: zone.x, y: zone.y, width: zone.w, height: zone.h,
    zIndex: 33,
    elements,
  };
}

// ─── PICKLE CLUSTER ───────────────────────────────────────────────────────────
export function drawPickleCluster(
  ingredientId: string,
  units: number,
  zone: Zone,
  _color: string,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];

  for (let u = 0; u < units; u++) {
    const groupCx = zone.x + (u + 0.5) * (zone.w / units);
    const groupCy = zone.y + zone.h / 2;

    for (let i = 0; i < 5; i++) {
      const cx  = groupCx + (rng() - 0.5) * 34;
      const cy  = groupCy + (rng() - 0.5) * 22;
      const rot = rng() * 360;
      elements.push({
        type: 'ellipse',
        attrs: {
          cx, cy, rx: 5.5, ry: 10,
          fill: 'url(#cornichonFill)',
          opacity: 0.85,
          filter: 'url(#ingredientShadow)',
          transform: `rotate(${rot.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})`,
        },
      });
      // Ridges
      for (let ridge = -2; ridge <= 2; ridge++) {
        elements.push({
          type: 'line',
          attrs: {
            x1: cx - 4, y1: cy + ridge * 2.8,
            x2: cx + 4, y2: cy + ridge * 2.8,
            stroke: '#4A6828',
            'stroke-width': 0.6,
            opacity: 0.45,
            transform: `rotate(${rot.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})`,
          },
        });
      }
    }
  }

  return {
    id: `${ingredientId}_pickles`,
    ingredientId,
    renderStyle: 'pickle_cluster',
    x: zone.x, y: zone.y, width: zone.w, height: zone.h,
    zIndex: 33,
    elements,
  };
}

// ─── OLIVE CLUSTER ────────────────────────────────────────────────────────────
export function drawOliveCluster(
  ingredientId: string,
  units: number,
  zone: Zone,
  _color: string,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];

  for (let u = 0; u < units; u++) {
    const groupCx = zone.x + (u + 0.5) * (zone.w / units);
    const groupCy = zone.y + zone.h / 2;

    for (let i = 0; i < 9; i++) {
      const cx  = groupCx + (rng() - 0.5) * 36;
      const cy  = groupCy + (rng() - 0.5) * 26;
      const rot = (rng() - 0.5) * 60;
      elements.push({
        type: 'ellipse',
        attrs: {
          cx, cy, rx: 5.5, ry: 7.5,
          fill: 'url(#oliveFill)',
          opacity: 0.88,
          filter: 'url(#ingredientShadow)',
          transform: `rotate(${rot.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})`,
        },
      });
      // Sheen highlight
      elements.push({
        type: 'ellipse',
        attrs: { cx: cx - 1.5, cy: cy - 2.5, rx: 2, ry: 3, fill: 'white', opacity: 0.22 },
      });
      // Pimento hole
      if (rng() > 0.55) {
        elements.push({
          type: 'circle',
          attrs: { cx, cy, r: 2, fill: '#D04830', opacity: 0.65 },
        });
      }
    }
  }

  return {
    id: `${ingredientId}_olives`,
    ingredientId,
    renderStyle: 'olive_cluster',
    x: zone.x, y: zone.y, width: zone.w, height: zone.h,
    zIndex: 33,
    elements,
  };
}

// ─── SMALL SCATTER (Chocolate almonds / pretzels) ─────────────────────────────
export function drawSmallScatter(
  ingredientId: string,
  units: number,
  zone: Zone,
  _color: string,
  isPretzel: boolean,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];

  for (let i = 0; i < units; i++) {
    const cx  = zone.x + (rng() * 0.78 + 0.11) * zone.w;
    const cy  = zone.y + (rng() * 0.78 + 0.11) * zone.h;
    const rot = rng() * 360;

    if (isPretzel) {
      elements.push({
        type: 'path',
        attrs: {
          d: `M ${cx} ${cy - 9} A 5 5 0 1 1 ${cx - 5.5} ${cy + 2} A 5 5 0 1 1 ${cx + 5.5} ${cy + 2} Z`,
          fill: 'url(#chocolateFill)',
          opacity: 0.88,
          transform: `rotate(${rot.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})`,
        },
      });
    } else {
      elements.push({
        type: 'ellipse',
        attrs: {
          cx, cy, rx: 7, ry: 4.5,
          fill: 'url(#chocolateFill)',
          opacity: 0.9,
          filter: 'url(#ingredientShadow)',
          transform: `rotate(${rot.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})`,
        },
      });
      // Almond interior peek
      elements.push({
        type: 'ellipse',
        attrs: {
          cx, cy, rx: 3.5, ry: 2.2,
          fill: '#F0D080',
          opacity: 0.35,
          transform: `rotate(${rot.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})`,
        },
      });
    }
  }

  return {
    id: `${ingredientId}_scatter`,
    ingredientId,
    renderStyle: 'small_scatter',
    x: zone.x, y: zone.y, width: zone.w, height: zone.h,
    zIndex: 34,
    elements,
  };
}

// ─── HERB SPRIG (Rosemary) ────────────────────────────────────────────────────
//
// More realistic rosemary: S-curved woody stem, paired needle leaves at each
// segment (one each side). Used sparingly — only 3–5 per board.
//
export function drawHerbSprig(
  id: string,
  cx: number,
  cy: number,
  rotation: number,
  _color: string,
  rng: () => number = Math.random
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const len = 32 + rng() * 16;
  const stemColor = '#3D6828';
  const needleColor = '#4A8030';

  // S-curved stem using two control points
  const cp1X = cx + (rng() - 0.5) * 8;
  const cp1Y = cy - len * 0.45;
  const cp2X = cx + (rng() - 0.5) * 6;
  const cp2Y = cy - len * 0.85;
  const tipX = cx + (rng() - 0.5) * 4;
  const tipY = cy - len;

  const transformStr = `rotate(${rotation.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})`;

  elements.push({
    type: 'path',
    attrs: {
      d: `M ${cx} ${cy} C ${cp1X} ${cp1Y} ${cp2X} ${cp2Y} ${tipX} ${tipY}`,
      stroke: stemColor,
      'stroke-width': 1.5,
      fill: 'none',
      opacity: 0.88,
      transform: transformStr,
    },
  });

  // Paired needle leaves along the stem
  const segCount = 7;
  for (let n = 0; n < segCount; n++) {
    const t  = (n + 1) / (segCount + 1);
    // Approximate point on bezier at t
    const bx = cx + 3 * t * (1 - t) * (1 - t) * (cp1X - cx) + 3 * t * t * (1 - t) * (cp2X - cx) + t * t * t * (tipX - cx);
    const by = cy + 3 * t * (1 - t) * (1 - t) * (cp1Y - cy) + 3 * t * t * (1 - t) * (cp2Y - cy) + t * t * t * (tipY - cy);

    // Needle length decreases towards tip
    const nLen = 7 + (1 - t) * 6;
    const baseAng = rotation * (Math.PI / 180); // incorporate sprig rotation

    // Left needle
    const lAng = baseAng + Math.PI / 2 + (rng() - 0.5) * 0.3;
    elements.push({
      type: 'line',
      attrs: {
        x1: bx, y1: by,
        x2: bx + Math.cos(lAng) * nLen,
        y2: by + Math.sin(lAng) * nLen,
        stroke: needleColor,
        'stroke-width': 0.9,
        opacity: 0.78,
        transform: transformStr,
      },
    });
    // Right needle (mirror)
    const rAng = baseAng - Math.PI / 2 + (rng() - 0.5) * 0.3;
    elements.push({
      type: 'line',
      attrs: {
        x1: bx, y1: by,
        x2: bx + Math.cos(rAng) * nLen,
        y2: by + Math.sin(rAng) * nLen,
        stroke: needleColor,
        'stroke-width': 0.9,
        opacity: 0.78,
        transform: transformStr,
      },
    });
  }

  return {
    id,
    ingredientId: 'rosemary_sprigs',
    renderStyle: 'herb_sprig',
    x: cx - 18, y: cy - len - 5,
    width: 36, height: len + 5,
    zIndex: 45,
    elements,
  };
}

// ─── BRANDED JAR (Jam / Honey) ────────────────────────────────────────────────
//
// Proper mason-jar silhouette: rect body with rounded bottom, slight neck,
// flat lid with slight 3D, glass sheen stripe, label color band.
//
export function drawBrandedJar(
  id: string,
  cx: number,
  cy: number,
  isHoney: boolean
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];

  const bodyW  = isHoney ? 28 : 38;
  const bodyH  = isHoney ? 34 : 46;
  const neckW  = bodyW * 0.78;
  const neckH  = bodyH * 0.16;
  const lidW   = bodyW * 0.90;
  const lidH   = 7;
  const bx     = cx - bodyW / 2;
  const by     = cy - bodyH / 2;
  const contentGrad = isHoney ? 'honeyJarBody' : 'jamJarBody';

  // ── Jar body (glass effect: content color visible through glass) ─────────
  elements.push({
    type: 'rect',
    attrs: {
      x: bx, y: by,
      width: bodyW, height: bodyH,
      rx: 5,
      fill: `url(#${contentGrad})`,
      opacity: 0.88,
      filter: 'url(#jarShadow)',
    },
  });

  // ── Glass sheen stripe (diagonal white highlight) ─────────────────────
  elements.push({
    type: 'rect',
    attrs: {
      x: bx + bodyW * 0.12, y: by + bodyH * 0.06,
      width: bodyW * 0.22, height: bodyH * 0.78,
      rx: 3,
      fill: 'url(#jarGlassSheen)',
      opacity: 1,
    },
  });

  // ── Neck (slightly narrower top section) ─────────────────────────────
  elements.push({
    type: 'rect',
    attrs: {
      x: cx - neckW / 2, y: by - neckH,
      width: neckW, height: neckH + 4,
      rx: 3,
      fill: `url(#${contentGrad})`,
      opacity: 0.82,
    },
  });

  // ── Lid (flat metal/wood lid) ─────────────────────────────────────────
  elements.push({
    type: 'rect',
    attrs: {
      x: cx - lidW / 2, y: by - neckH - lidH,
      width: lidW, height: lidH,
      rx: 2,
      fill: 'url(#jarLidGradient)',
      opacity: 0.92,
    },
  });

  // ── Label band in the center of the body ─────────────────────────────
  const labelColor = isHoney ? '#8A5C10' : '#2D5A2D';
  elements.push({
    type: 'rect',
    attrs: {
      x: bx + 3, y: by + bodyH * 0.3,
      width: bodyW - 6, height: bodyH * 0.38,
      rx: 2,
      fill: 'none',
      stroke: labelColor,
      'stroke-width': 1.5,
      opacity: 0.55,
    },
  });

  return {
    id,
    ingredientId: isHoney ? 'honey_jar_garden_delights' : 'jam_jar_board_miami',
    renderStyle: 'branded_jar',
    x: cx - bodyW / 2, y: by - neckH - lidH,
    width: bodyW, height: bodyH + neckH + lidH,
    zIndex: 40,
    elements,
  };
}

// ─── Utility: naive RGB lightness shift ────────────────────────────────────
function shiftColor(hex: string, _hueShift: number, lightnessShift: number): string {
  const rV = parseInt(hex.slice(1, 3), 16);
  const gV = parseInt(hex.slice(3, 5), 16);
  const bV = parseInt(hex.slice(5, 7), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const f = 1 + lightnessShift / 100;
  return `#${clamp(rV * f).toString(16).padStart(2, '0')}${clamp(gV * f).toString(16).padStart(2, '0')}${clamp(bV * f).toString(16).padStart(2, '0')}`;
}

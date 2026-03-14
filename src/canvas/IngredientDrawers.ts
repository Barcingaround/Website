/**
 * SVG element descriptor — represents a rendered ingredient group
 * The React component converts these into SVG <g> elements
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
import { seededRNG } from '../utils/seededRandom';

// ─── CONTINUOUS FAN (Prosciutto / Serrano) ───────────────────────────────────
export function drawContinuousFan(
  ingredientId: string,
  units: number,
  zone: Zone,
  color: string,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  // Draw overlapping layered strips filling the zone
  const depth = Math.min(zone.h, 20 + (units / 10) * zone.h * 0.6);
  const numStrips = Math.max(4, Math.floor(units / 3));

  for (let i = 0; i < numStrips; i++) {
    const yOff = (i / numStrips) * depth;
    const hue = (rng() - 0.5) * 12;
    const opacity = 0.55 + (i / numStrips) * 0.35;
    const waviness = (rng() - 0.5) * 6;
    elements.push({
      type: 'path',
      attrs: {
        d: `M ${zone.x} ${zone.y + yOff + waviness} Q ${zone.x + zone.w/2} ${zone.y + yOff + waviness + (rng()-0.5)*4} ${zone.x + zone.w} ${zone.y + yOff + waviness} L ${zone.x + zone.w} ${zone.y + yOff + 8 + waviness} Q ${zone.x + zone.w/2} ${zone.y + yOff + 8 + waviness + (rng()-0.5)*3} ${zone.x} ${zone.y + yOff + 8 + waviness} Z`,
        fill: shiftColor(color, hue, 0),
        opacity,
        stroke: shiftColor(color, hue - 10, -20),
        'stroke-width': '0.3',
      },
    });
  }

  return { id: `${ingredientId}_fan`, ingredientId, renderStyle: 'continuous_fan', x: zone.x, y: zone.y, width: zone.w, height: depth, zIndex: 10, elements };
}

// ─── ROSETTE CLUSTER (Salami) ─────────────────────────────────────────────────
export function drawRosetteCluster(
  ingredientId: string,
  units: number,
  zone: Zone,
  color: string,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const count = units;
  const rosetteDiam = Math.min(28, Math.sqrt((zone.w * zone.h) / count) * 0.85);
  const r = rosetteDiam / 2;

  // Grid placement across zone
  const cols = Math.ceil(Math.sqrt(count * (zone.w / zone.h)));
  const rows = Math.ceil(count / cols);

  let placed = 0;
  for (let row = 0; row < rows && placed < count; row++) {
    for (let col = 0; col < cols && placed < count; col++) {
      const cx = zone.x + (col + 0.5 + (rng() - 0.5) * 0.3) * (zone.w / cols);
      const cy = zone.y + (row + 0.5 + (rng() - 0.5) * 0.3) * (zone.h / rows);

      // Base circle
      elements.push({
        type: 'circle',
        attrs: { cx, cy, r, fill: color, opacity: 0.88 },
      });
      // Spiral petal effect
      for (let p = 0; p < 6; p++) {
        const angle = (p / 6) * Math.PI * 2;
        const px = cx + Math.cos(angle) * r * 0.55;
        const py = cy + Math.sin(angle) * r * 0.55;
        elements.push({
          type: 'circle',
          attrs: { cx: px, cy: py, r: r * 0.35, fill: shiftColor(color, 0, -15), opacity: 0.7 },
        });
      }
      // Center dot
      elements.push({
        type: 'circle',
        attrs: { cx, cy, r: r * 0.2, fill: shiftColor(color, 0, -30), opacity: 0.9 },
      });
      placed++;
    }
  }

  return { id: `${ingredientId}_rosette`, ingredientId, renderStyle: 'rosette_cluster', x: zone.x, y: zone.y, width: zone.w, height: zone.h, zIndex: 12, elements };
}

// ─── FAN ARC (Brie, Manchego, Cheddar, Humboldt Fog) ─────────────────────────
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
  const sliceCount = Math.min(units, 18);
  const fanAngle = Math.min(80, 20 + sliceCount * 4);
  const startAngle = -fanAngle / 2;

  // Fan pivot is at the edge of the zone
  let pivotX: number, pivotY: number, pivotEdge: 'left' | 'right' | 'bottom';
  if (zone.x < 100) { pivotX = zone.x + 5; pivotY = zone.y + zone.h / 2; pivotEdge = 'left'; }
  else if (zone.x + zone.w > 700) { pivotX = zone.x + zone.w - 5; pivotY = zone.y + zone.h / 2; pivotEdge = 'right'; }
  else { pivotX = zone.x + zone.w / 2; pivotY = zone.y + zone.h; pivotEdge = 'bottom'; }

  const sliceLength = Math.min(zone.w * 0.8, zone.h * 1.2, 100);

  for (let i = 0; i < sliceCount; i++) {
    const angle = startAngle + (i / Math.max(1, sliceCount - 1)) * fanAngle;
    const rad = (angle * Math.PI) / 180;

    let dx: number, dy: number;
    if (pivotEdge === 'left') { dx = Math.cos(rad); dy = Math.sin(rad); }
    else if (pivotEdge === 'right') { dx = -Math.cos(rad); dy = Math.sin(rad); }
    else { dx = Math.cos(rad + Math.PI / 2); dy = -Math.abs(Math.sin(rad + Math.PI / 2)); }

    const tipX = pivotX + dx * sliceLength;
    const tipY = pivotY + dy * sliceLength;
    const perpX = -dy * sliceLength * 0.18;
    const perpY = dx * sliceLength * 0.18;

    const wedgePath = `M ${pivotX} ${pivotY} L ${tipX - perpX} ${tipY - perpY} Q ${tipX} ${tipY - perpY * 0.3} ${tipX + perpX} ${tipY + perpY} Z`;

    const lightness = (rng() - 0.5) * 8;
    elements.push({
      type: 'path',
      attrs: {
        d: wedgePath,
        fill: shiftColor(color, lightness, lightness),
        opacity: 0.82 + i * 0.01,
        stroke: rindColor,
        'stroke-width': '0.8',
      },
    });

    // Humboldt Fog ash line
    if (specialFeature === 'ash_line') {
      const midX = pivotX + dx * sliceLength * 0.5;
      const midY = pivotY + dy * sliceLength * 0.5;
      elements.push({
        type: 'line',
        attrs: {
          x1: midX - perpX * 0.8, y1: midY - perpY * 0.8,
          x2: midX + perpX * 0.8, y2: midY + perpY * 0.8,
          stroke: '#888880', 'stroke-width': '1.5', opacity: 0.8,
        },
      });
    }
  }

  return { id: `${ingredientId}_fan`, ingredientId, renderStyle: 'fan_arc', x: zone.x, y: zone.y, width: zone.w, height: zone.h, zIndex: 20, elements };
}

// ─── STACKED MOUND (Gouda cubes) ──────────────────────────────────────────────
export function drawStackedMound(
  ingredientId: string,
  units: number,
  zone: Zone,
  color: string,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const cubeSize = Math.min(28, Math.max(14, zone.w / (units * 0.4)));
  const layers = Math.ceil(units / Math.round(zone.w / (cubeSize * 1.1)));

  let placed = 0;
  for (let layer = 0; layer < layers && placed < units; layer++) {
    const cubesInLayer = Math.min(units - placed, Math.round(zone.w / (cubeSize * 1.15)));
    const layerY = zone.y + zone.h - (layer + 1) * (cubeSize * 0.85);
    const layerWidth = cubesInLayer * (cubeSize * 1.1);
    const startX = zone.x + (zone.w - layerWidth) / 2 + (rng() - 0.5) * 6;

    for (let col = 0; col < cubesInLayer && placed < units; col++) {
      const cx = startX + col * (cubeSize * 1.1) + (rng() - 0.5) * 3;
      const cy = layerY + (rng() - 0.5) * 3;

      // Top face (lighter)
      elements.push({
        type: 'rect',
        attrs: { x: cx, y: cy, width: cubeSize, height: cubeSize, rx: 2, fill: shiftColor(color, 8, 8), opacity: 0.92 },
      });
      // Right shadow face
      elements.push({
        type: 'polygon',
        attrs: {
          points: `${cx + cubeSize},${cy} ${cx + cubeSize + 4},${cy + 4} ${cx + cubeSize + 4},${cy + cubeSize + 4} ${cx + cubeSize},${cy + cubeSize}`,
          fill: shiftColor(color, -8, -15), opacity: 0.7,
        },
      });
      // Bottom shadow face
      elements.push({
        type: 'polygon',
        attrs: {
          points: `${cx},${cy + cubeSize} ${cx + cubeSize},${cy + cubeSize} ${cx + cubeSize + 4},${cy + cubeSize + 4} ${cx + 4},${cy + cubeSize + 4}`,
          fill: shiftColor(color, -15, -20), opacity: 0.65,
        },
      });
      placed++;
    }
  }

  return { id: `${ingredientId}_mound`, ingredientId, renderStyle: 'stacked_mound', x: zone.x, y: zone.y, width: zone.w, height: zone.h, zIndex: 25, elements };
}

// ─── ROUND DISC (Boursin) — always 2 rounds ───────────────────────────────────
export function drawRoundDisc(
  ingredientId: string,
  units: number,
  zone: Zone,
  color: string,
  herbColor: string,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const pairs = Math.max(1, Math.round(units / 2));
  const r = Math.min(36, zone.w / (pairs * 2.5));

  for (let p = 0; p < pairs; p++) {
    const groupCx = zone.x + zone.w / 2 + (p - (pairs - 1) / 2) * (r * 2.4);
    const cy = zone.y + zone.h / 2;

    // Both rounds side by side
    for (const offX of [-r * 0.6, r * 0.6]) {
      const cx = groupCx + offX;
      // Base disc
      elements.push({
        type: 'circle',
        attrs: { cx, cy, r, fill: color, opacity: 0.9 },
      });
      // Herb flecks
      for (let h = 0; h < 12; h++) {
        const hx = cx + (rng() - 0.5) * r * 1.6;
        const hy = cy + (rng() - 0.5) * r * 1.6;
        elements.push({
          type: 'ellipse',
          attrs: { cx: hx, cy: hy, rx: 2, ry: 1, fill: herbColor, opacity: 0.6, transform: `rotate(${rng() * 180} ${hx} ${hy})` },
        });
      }
      // Center highlight
      elements.push({
        type: 'circle',
        attrs: { cx, cy: cy - r * 0.1, r: r * 0.3, fill: shiftColor(color, 5, 5), opacity: 0.4 },
      });
    }
  }

  return { id: `${ingredientId}_disc`, ingredientId, renderStyle: 'round_disc', x: zone.x, y: zone.y, width: zone.w, height: zone.h, zIndex: 28, elements };
}

// ─── ROUND SLICES (Goat cheese triangles) ────────────────────────────────────
export function drawRoundSlices(
  ingredientId: string,
  units: number,
  zone: Zone,
  color: string,
  herbColor: string,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const r = Math.min(32, zone.h * 0.45);

  for (let i = 0; i < units; i++) {
    const cx = zone.x + zone.w / 2 + (i - (units - 1) / 2) * (r * 1.5 + 8);
    const cy = zone.y + zone.h / 2;

    const isComplete = i % 2 === 0;
    // Triangle wedge shape
    const startAngle = -60;
    const endAngle = 60;
    const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180);
    const y1 = cy + r * Math.sin((startAngle * Math.PI) / 180);
    const x2 = cx + r * Math.cos((endAngle * Math.PI) / 180);
    const y2 = cy + r * Math.sin((endAngle * Math.PI) / 180);

    const outerPath = isComplete
      ? `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`
      : `M ${cx} ${cy} L ${x1} ${y1} Q ${cx + r * 1.1} ${cy - r * 0.1} ${x2} ${y2} Z`;

    elements.push({ type: 'path', attrs: { d: outerPath, fill: color, opacity: 0.88 } });
    // Herb coat on outer edge
    elements.push({
      type: 'path',
      attrs: {
        d: `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`,
        stroke: herbColor, 'stroke-width': '5', opacity: 0.65, fill: 'none',
      },
    });
  }

  return { id: `${ingredientId}_slices`, ingredientId, renderStyle: 'round_slices', x: zone.x, y: zone.y, width: zone.w, height: zone.h, zIndex: 28, elements };
}

// ─── EXOTIC ANCHOR (Dragon Fruit) — CRITICAL VISUAL ──────────────────────────
export function drawExoticAnchor(
  ingredientId: string,
  units: number,
  zone: Zone,
  skinColor: string,
  interiorColor: string,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const r = Math.min(40, Math.min(zone.w / (units * 1.5), zone.h * 0.45));

  for (let i = 0; i < units; i++) {
    const cx = zone.x + r + i * (r * 1.6) + (rng() - 0.5) * 8;
    const cy = zone.y + zone.h / 2 + (rng() - 0.5) * 10;
    const rot = (rng() - 0.5) * 20;

    // Outer skin ring (vivid magenta)
    elements.push({
      type: 'circle',
      attrs: { cx, cy, r, fill: skinColor, opacity: 0.95, transform: `rotate(${rot} ${cx} ${cy})` },
    });
    // White interior
    elements.push({
      type: 'circle',
      attrs: { cx, cy, r: r * 0.78, fill: interiorColor, opacity: 0.96 },
    });
    // Black seed dots — scattered in circular pattern
    for (let s = 0; s < 24; s++) {
      const angle = rng() * Math.PI * 2;
      const dist = rng() * r * 0.65;
      const sx = cx + Math.cos(angle) * dist;
      const sy = cy + Math.sin(angle) * dist;
      elements.push({
        type: 'circle',
        attrs: { cx: sx, cy: sy, r: 1.2, fill: '#1A1A1A', opacity: 0.8 },
      });
    }
  }

  return { id: `${ingredientId}_anchor`, ingredientId, renderStyle: 'exotic_anchor', x: zone.x, y: zone.y, width: zone.w, height: zone.h, zIndex: 50, elements };
}

// ─── CITRUS SLICE (Mandarin, Kiwi) ───────────────────────────────────────────
export function drawCitrusSlice(
  ingredientId: string,
  units: number,
  zone: Zone,
  color: string,
  extraColor: string,
  isKiwi: boolean,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const r = Math.min(22, zone.h * 0.3);

  for (let i = 0; i < units; i++) {
    const cx = zone.x + zone.w / 2 + (i - (units - 1) / 2) * (r * 2.2 + 4) + (rng() - 0.5) * 8;
    const cy = zone.y + zone.h / 2 + (rng() - 0.5) * 12;
    const rot = (rng() - 0.5) * 30;

    if (isKiwi) {
      // Full circle
      elements.push({ type: 'circle', attrs: { cx, cy, r, fill: color, opacity: 0.9, transform: `rotate(${rot} ${cx} ${cy})` } });
      // White center
      elements.push({ type: 'circle', attrs: { cx, cy, r: r * 0.28, fill: extraColor, opacity: 0.9 } });
      // Seeds
      for (let s = 0; s < 12; s++) {
        const ang = (s / 12) * Math.PI * 2;
        const sx = cx + Math.cos(ang) * r * 0.55;
        const sy = cy + Math.sin(ang) * r * 0.55;
        elements.push({ type: 'circle', attrs: { cx: sx, cy: sy, r: 1, fill: '#1A1A1A', opacity: 0.75 } });
      }
    } else {
      // D-shape mandarin half
      elements.push({
        type: 'path',
        attrs: {
          d: `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} L ${cx} ${cy - r} Z`,
          fill: color, opacity: 0.88, transform: `rotate(${rot} ${cx} ${cy})`,
        },
      });
      // Segment lines
      for (let seg = 1; seg < 7; seg++) {
        const ang = ((seg / 7) - 0.5) * Math.PI;
        elements.push({
          type: 'line',
          attrs: { x1: cx, y1: cy, x2: cx + Math.cos(ang) * r, y2: cy + Math.sin(ang) * r, stroke: '#D06010', 'stroke-width': '0.8', opacity: 0.5 },
        });
      }
    }
  }

  return { id: `${ingredientId}_citrus`, ingredientId, renderStyle: 'citrus_slice', x: zone.x, y: zone.y, width: zone.w, height: zone.h, zIndex: 35, elements };
}

// ─── GRAPE CLUSTER ────────────────────────────────────────────────────────────
export function drawGrapeCluster(
  ingredientId: string,
  units: number,
  zone: Zone,
  color: string,
  highlightColor: string,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const grapeR = 7;
  const grapePositions = [
    [0, 0], [-14, 8], [14, 8], [-7, 16], [7, 16], [0, 24],
    [-14, 24], [14, 24], [-7, 32], [7, 32], [0, 40],
    [-14, 40], [14, 40], [-7, 48], [7, 48],
  ];

  for (let u = 0; u < units; u++) {
    const cx = zone.x + (u + 0.5) * (zone.w / units) + (rng() - 0.5) * 12;
    const cy = zone.y + zone.h * 0.25 + (rng() - 0.5) * 8;

    for (const [dx, dy] of grapePositions) {
      elements.push({
        type: 'circle',
        attrs: { cx: cx + dx, cy: cy + dy, r: grapeR, fill: color, opacity: 0.88 },
      });
      // Highlight dot
      elements.push({
        type: 'circle',
        attrs: { cx: cx + dx - 2, cy: cy + dy - 2, r: 2, fill: highlightColor, opacity: 0.65 },
      });
    }
  }

  return { id: `${ingredientId}_grapes`, ingredientId, renderStyle: 'grape_cluster', x: zone.x, y: zone.y, width: zone.w, height: zone.h, zIndex: 30, elements };
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
  const r = isStrawberry ? 9 : 6;

  for (let i = 0; i < units; i++) {
    const cx = zone.x + (rng() * 0.8 + 0.1) * zone.w;
    const cy = zone.y + (rng() * 0.8 + 0.1) * zone.h;
    const rot = rng() * 360;

    if (isStrawberry) {
      // Heart cross-section
      elements.push({
        type: 'path',
        attrs: {
          d: `M ${cx} ${cy + r * 1.2} C ${cx - r * 1.4} ${cy} ${cx - r * 1.4} ${cy - r * 0.8} ${cx} ${cy - r * 0.2} C ${cx + r * 1.4} ${cy - r * 0.8} ${cx + r * 1.4} ${cy} ${cx} ${cy + r * 1.2} Z`,
          fill: color, opacity: 0.85, transform: `rotate(${rot} ${cx} ${cy})`,
        },
      });
      // White center
      elements.push({
        type: 'ellipse',
        attrs: { cx, cy, rx: r * 0.5, ry: r * 0.7, fill: '#FFF8F0', opacity: 0.6 },
      });
    } else if (isRaspberry) {
      // Bumpy surface
      elements.push({ type: 'circle', attrs: { cx, cy, r, fill: color, opacity: 0.85 } });
      for (let d = 0; d < 5; d++) {
        const da = (d / 5) * Math.PI * 2;
        elements.push({
          type: 'circle',
          attrs: { cx: cx + Math.cos(da) * r * 0.45, cy: cy + Math.sin(da) * r * 0.45, r: r * 0.35, fill: shiftColor(color, 5, 5), opacity: 0.8 },
        });
      }
      // Hollow center
      elements.push({ type: 'circle', attrs: { cx, cy, r: r * 0.3, fill: 'rgba(30,10,10,0.35)', opacity: 0.7 } });
    } else {
      // Blackberry — aggregate drupes
      elements.push({ type: 'circle', attrs: { cx, cy, r, fill: color, opacity: 0.9 } });
      for (let d = 0; d < 6; d++) {
        const da = (d / 6) * Math.PI * 2;
        elements.push({
          type: 'circle',
          attrs: { cx: cx + Math.cos(da) * r * 0.52, cy: cy + Math.sin(da) * r * 0.52, r: r * 0.3, fill: shiftColor(color, 10, 10), opacity: 0.85 },
        });
      }
    }
  }

  return { id: `${ingredientId}_berries`, ingredientId, renderStyle: 'berry_scatter', x: zone.x, y: zone.y, width: zone.w, height: zone.h, zIndex: 32, elements };
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
  const berryR = 5;

  for (let u = 0; u < units; u++) {
    const cx = zone.x + (u + 0.5) * (zone.w / units) + (rng() - 0.5) * 10;
    const cy = zone.y + zone.h / 2 + (rng() - 0.5) * 10;
    const count = 20 + Math.floor(rng() * 5);

    for (let i = 0; i < count; i++) {
      const angle = rng() * Math.PI * 2;
      const dist = rng() * berryR * 3.5;
      const bx = cx + Math.cos(angle) * dist;
      const by = cy + Math.sin(angle) * dist;
      elements.push({
        type: 'circle',
        attrs: { cx: bx, cy: by, r: berryR * (0.7 + rng() * 0.3), fill: color, opacity: 0.82 },
      });
      elements.push({
        type: 'circle',
        attrs: { cx: bx - 1, cy: by - 1, r: 1.5, fill: highlightColor, opacity: 0.5 },
      });
    }
  }

  return { id: `${ingredientId}_cluster`, ingredientId, renderStyle: 'berry_cluster', x: zone.x, y: zone.y, width: zone.w, height: zone.h, zIndex: 32, elements };
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
  const count = 5 + Math.floor(rng() * 3);

  for (let u = 0; u < units; u++) {
    const groupCx = zone.x + (u + 0.5) * (zone.w / units);
    const groupCy = zone.y + zone.h / 2;

    for (let i = 0; i < count; i++) {
      const cx = groupCx + (rng() - 0.5) * 28;
      const cy = groupCy + (rng() - 0.5) * 22;
      const rot = rng() * 360;

      if (isPistachio) {
        // Shell-on oval
        elements.push({
          type: 'ellipse',
          attrs: { cx, cy, rx: 8, ry: 5, fill: color, opacity: 0.85, transform: `rotate(${rot} ${cx} ${cy})` },
        });
        // Open split
        if (rng() > 0.4) {
          elements.push({
            type: 'line',
            attrs: { x1: cx - 3, y1: cy, x2: cx + 3, y2: cy, stroke: '#7A9840', 'stroke-width': '2', opacity: 0.9, transform: `rotate(${rot} ${cx} ${cy})` },
          });
        }
      } else {
        // Walnut half — organic lobe shape
        elements.push({
          type: 'path',
          attrs: {
            d: `M ${cx} ${cy - 7} C ${cx - 8} ${cy - 7} ${cx - 8} ${cy + 7} ${cx} ${cy + 7} C ${cx + 8} ${cy + 7} ${cx + 8} ${cy - 7} ${cx} ${cy - 7}`,
            fill: color, opacity: 0.82, transform: `rotate(${rot} ${cx} ${cy})`,
          },
        });
        // Interior ridge
        elements.push({
          type: 'path',
          attrs: {
            d: `M ${cx} ${cy - 5} Q ${cx + 3} ${cy} ${cx} ${cy + 5} Q ${cx - 3} ${cy} ${cx} ${cy - 5}`,
            fill: shiftColor(color, -10, -15), opacity: 0.5,
          },
        });
      }
    }
  }

  return { id: `${ingredientId}_nuts`, ingredientId, renderStyle: 'nut_cluster', x: zone.x, y: zone.y, width: zone.w, height: zone.h, zIndex: 33, elements };
}

// ─── PICKLE CLUSTER ───────────────────────────────────────────────────────────
export function drawPickleCluster(
  ingredientId: string,
  units: number,
  zone: Zone,
  color: string,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];

  for (let u = 0; u < units; u++) {
    const groupCx = zone.x + (u + 0.5) * (zone.w / units);
    const groupCy = zone.y + zone.h / 2;

    for (let i = 0; i < 5; i++) {
      const cx = groupCx + (rng() - 0.5) * 30;
      const cy = groupCy + (rng() - 0.5) * 20;
      const rot = rng() * 360;
      elements.push({
        type: 'ellipse',
        attrs: { cx, cy, rx: 5, ry: 9, fill: color, opacity: 0.82, transform: `rotate(${rot} ${cx} ${cy})` },
      });
      // Ridges
      for (let r2 = -2; r2 <= 2; r2++) {
        elements.push({
          type: 'line',
          attrs: { x1: cx - 4, y1: cy + r2 * 2.5, x2: cx + 4, y2: cy + r2 * 2.5, stroke: shiftColor(color, -15, -10), 'stroke-width': '0.6', opacity: 0.5, transform: `rotate(${rot} ${cx} ${cy})` },
        });
      }
    }
  }

  return { id: `${ingredientId}_pickles`, ingredientId, renderStyle: 'pickle_cluster', x: zone.x, y: zone.y, width: zone.w, height: zone.h, zIndex: 33, elements };
}

// ─── OLIVE CLUSTER ────────────────────────────────────────────────────────────
export function drawOliveCluster(
  ingredientId: string,
  units: number,
  zone: Zone,
  color: string,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];

  for (let u = 0; u < units; u++) {
    const groupCx = zone.x + (u + 0.5) * (zone.w / units);
    const groupCy = zone.y + zone.h / 2;

    for (let i = 0; i < 9; i++) {
      const cx = groupCx + (rng() - 0.5) * 32;
      const cy = groupCy + (rng() - 0.5) * 24;
      elements.push({
        type: 'ellipse',
        attrs: { cx, cy, rx: 5, ry: 7, fill: color, opacity: 0.85 },
      });
      // Sheen
      elements.push({
        type: 'ellipse',
        attrs: { cx: cx - 1, cy: cy - 2, rx: 2, ry: 3, fill: 'white', opacity: 0.25 },
      });
    }
  }

  return { id: `${ingredientId}_olives`, ingredientId, renderStyle: 'olive_cluster', x: zone.x, y: zone.y, width: zone.w, height: zone.h, zIndex: 33, elements };
}

// ─── SMALL SCATTER (Chocolate almonds/pretzels) ────────────────────────────
export function drawSmallScatter(
  ingredientId: string,
  units: number,
  zone: Zone,
  color: string,
  isPretzel: boolean,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];

  for (let i = 0; i < units; i++) {
    const cx = zone.x + (rng() * 0.8 + 0.1) * zone.w;
    const cy = zone.y + (rng() * 0.8 + 0.1) * zone.h;
    const rot = rng() * 360;

    if (isPretzel) {
      // Pretzel knot shape
      elements.push({
        type: 'path',
        attrs: {
          d: `M ${cx} ${cy - 8} A 5 5 0 1 1 ${cx - 5} ${cy + 2} A 5 5 0 1 1 ${cx + 5} ${cy + 2} Z`,
          fill: color, opacity: 0.85, transform: `rotate(${rot} ${cx} ${cy})`,
        },
      });
    } else {
      // Almond oval
      elements.push({
        type: 'ellipse',
        attrs: { cx, cy, rx: 6, ry: 4, fill: color, opacity: 0.88, transform: `rotate(${rot} ${cx} ${cy})` },
      });
      // Chocolate sheen
      elements.push({
        type: 'ellipse',
        attrs: { cx: cx - 1, cy: cy - 1, rx: 2, ry: 1.5, fill: '#5A3020', opacity: 0.4, transform: `rotate(${rot} ${cx} ${cy})` },
      });
    }
  }

  return { id: `${ingredientId}_scatter`, ingredientId, renderStyle: 'small_scatter', x: zone.x, y: zone.y, width: zone.w, height: zone.h, zIndex: 34, elements };
}

// ─── HERB SPRIG (Rosemary) ────────────────────────────────────────────────────
export function drawHerbSprig(
  id: string,
  cx: number,
  cy: number,
  rotation: number,
  color: string
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const len = 28 + Math.random() * 12;
  // Stem
  elements.push({
    type: 'line',
    attrs: { x1: cx, y1: cy, x2: cx, y2: cy - len, stroke: color, 'stroke-width': '1.2', opacity: 0.85, transform: `rotate(${rotation} ${cx} ${cy})` },
  });
  // Needles
  for (let n = 0; n < 8; n++) {
    const ny = cy - (n + 0.5) * (len / 8);
    const nx = cx;
    const ang = (n % 2 === 0 ? 1 : -1) * 45;
    elements.push({
      type: 'line',
      attrs: { x1: nx, y1: ny, x2: nx + Math.cos((ang * Math.PI) / 180) * 8, y2: ny - Math.abs(Math.sin((ang * Math.PI) / 180)) * 4, stroke: color, 'stroke-width': '0.8', opacity: 0.75, transform: `rotate(${rotation} ${cx} ${cy})` },
    });
  }

  return { id, ingredientId: 'rosemary_sprigs', renderStyle: 'herb_sprig', x: cx - 10, y: cy - len, width: 20, height: len, zIndex: 45, elements };
}

// ─── BRANDED JAR ──────────────────────────────────────────────────────────────
export function drawBrandedJar(
  id: string,
  cx: number,
  cy: number,
  isHoney: boolean
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const r = isHoney ? 16 : 22;
  const jarColor = isHoney ? '#F5D060' : '#FFFFFF';
  const lidColor = isHoney ? '#D4A020' : '#1A1A1A';
  const labelColor = isHoney ? '#C8A040' : '#2D5A2D';

  // Jar body
  elements.push({ type: 'circle', attrs: { cx, cy, r, fill: jarColor, opacity: 0.92 } });
  // Lid
  elements.push({ type: 'circle', attrs: { cx, cy, r: r * 0.45, fill: lidColor, opacity: 0.9 } });
  // Label ring
  elements.push({ type: 'circle', attrs: { cx, cy: cy + r * 0.2, r: r * 0.65, fill: 'none', stroke: labelColor, 'stroke-width': '1.5', opacity: 0.7 } });
  // Brand dot
  elements.push({ type: 'circle', attrs: { cx, cy: cy + r * 0.2, r: r * 0.2, fill: labelColor, opacity: 0.5 } });

  return { id, ingredientId: isHoney ? 'honey_jar_garden_delights' : 'jam_jar_board_miami', renderStyle: 'branded_jar', x: cx - r, y: cy - r, width: r * 2, height: r * 2, zIndex: 40, elements };
}

// ─── Utility: naive color shift ────────────────────────────────────────────
function shiftColor(hex: string, hueShift: number, lightnessShift: number): string {
  // Parse hex
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const factor = 1 + lightnessShift / 100;
  const nr = clamp(r * factor);
  const ng = clamp(g * factor);
  const nb = clamp(b * factor);
  return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
}

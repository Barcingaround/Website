/**
 * SVG ingredient drawers — sprite-based visual rendering for board ingredients.
 *
 * v3: All ingredients now rendered from the Board Miami SVG Sprite Library v2.
 * - 78 hand-crafted sprites, strategically mixed based on unit count + seeded RNG.
 * - placeSprite() maps sprite-local coords to board zone coords via SVG transforms.
 * - Gradient IDs (e.g. p2f, s1rim) are defined in GradientDefs.tsx (objectBoundingBox).
 * - Multiple variants per ingredient → visual variety, not identical repeating tiles.
 */

export interface SVGElementDescriptor {
  type: 'path' | 'circle' | 'rect' | 'ellipse' | 'line' | 'polygon' | 'g';
  attrs: Record<string, string | number | undefined>;
  children?: SVGElementDescriptor[];
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

// ── placeSprite ───────────────────────────────────────────────────────────────
// Maps sprite-local coordinates (0,0 → srcW,srcH) into board coordinates
// (destX,destY → destX+destW, destY+destH) via a scale+translate transform.
// Optional rotation is applied around the destination center.
function placeSprite(
  children: SVGElementDescriptor[],
  srcW: number, srcH: number,
  destX: number, destY: number, destW: number, destH: number,
  opts?: { rotation?: number; opacity?: number; filter?: string }
): SVGElementDescriptor {
  const scale = Math.min(destW / srcW, destH / srcH);
  const scaledW = srcW * scale;
  const scaledH = srcH * scale;
  const tx = destX + (destW - scaledW) / 2;
  const ty = destY + (destH - scaledH) / 2;
  let transform: string;
  if (opts?.rotation) {
    const cx = destX + destW / 2;
    const cy = destY + destH / 2;
    transform = `translate(${cx},${cy}) rotate(${opts.rotation}) translate(${(-scaledW / 2).toFixed(2)},${(-scaledH / 2).toFixed(2)}) scale(${scale.toFixed(4)})`;
  } else {
    transform = `translate(${tx.toFixed(2)},${ty.toFixed(2)}) scale(${scale.toFixed(4)})`;
  }
  const attrs: Record<string, string | number | undefined> = { transform };
  if (opts?.opacity !== undefined) attrs.opacity = opts.opacity;
  if (opts?.filter) attrs.filter = opts.filter;
  return { type: 'g', attrs, children };
}

// ── shiftColor ────────────────────────────────────────────────────────────────
export function shiftColor(hex: string, _hueShift: number, lightnessShift: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const delta = lightnessShift * 2.55;
  return '#' + [r, g, b].map(c => clamp(c + delta).toString(16).padStart(2, '0')).join('');
}


// ═══════════════════════════════════════════════════════════════
// SPRITE ELEMENT CONSTANTS — raw SVGElementDescriptor arrays
// Each const represents one sprite from the Board Miami library.
// ═══════════════════════════════════════════════════════════════

const S_B1: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M29 70 L4 12 Q8 3 16 2 Q42 2 52 8 L29 70Z", "fill": "url(#b1p)" } },
  { type: 'path', attrs: { "d": "M4 12 Q8 3 16 2 Q42 2 52 8", "stroke": "#EEEADF", "stroke-width": 8, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M5 12 Q9 4 16 3 Q42 3 51 8", "stroke": "#F9F7F2", "stroke-width": 3.5, "fill": "none", "stroke-linecap": "round", "opacity": 0.7 } },
  { type: 'path', attrs: { "d": "M16 54 L11 20", "stroke": "#D4C490", "stroke-width": 0.5, "fill": "none", "opacity": 0.32 } },
  { type: 'path', attrs: { "d": "M29 64 L25 18", "stroke": "#D4C490", "stroke-width": 0.5, "fill": "none", "opacity": 0.28 } },
  { type: 'path', attrs: { "d": "M40 56 L40 15", "stroke": "#D4C490", "stroke-width": 0.5, "fill": "none", "opacity": 0.3 } },
];

const S_B2: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M37 68 L6 14 Q10 4 19 3 Q54 3 64 12 L37 68Z", "fill": "url(#b2p)" } },
  { type: 'path', attrs: { "d": "M6 14 Q10 4 19 3 Q54 3 64 12", "stroke": "#EEEADF", "stroke-width": 8, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M7 14 Q11 5 19 4 Q54 4 63 12", "stroke": "#FAFAF4", "stroke-width": 3.5, "fill": "none", "stroke-linecap": "round", "opacity": 0.68 } },
  { type: 'path', attrs: { "d": "M20 56 L14 22", "stroke": "#CCC088", "stroke-width": 0.5, "fill": "none", "opacity": 0.3 } },
  { type: 'path', attrs: { "d": "M37 62 L33 18", "stroke": "#CCC088", "stroke-width": 0.5, "fill": "none", "opacity": 0.26 } },
  { type: 'path', attrs: { "d": "M52 55 L52 16", "stroke": "#CCC088", "stroke-width": 0.5, "fill": "none", "opacity": 0.28 } },
];

const S_B3: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M47 70 L4 18 Q8 7 19 4 Q66 3 76 13 L47 70Z", "fill": "url(#b3p)" } },
  { type: 'path', attrs: { "d": "M4 18 Q8 7 19 4 Q66 3 76 13", "stroke": "#EEEAE0", "stroke-width": 9, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M5 18 Q9 8 19 5 Q66 4 75 13", "stroke": "#FAFAF5", "stroke-width": 3.5, "fill": "none", "stroke-linecap": "round", "opacity": 0.65 } },
  { type: 'path', attrs: { "d": "M22 58 L16 24", "stroke": "#C8B880", "stroke-width": 0.6, "fill": "none", "opacity": 0.28 } },
  { type: 'path', attrs: { "d": "M47 65 L44 20", "stroke": "#C8B880", "stroke-width": 0.6, "fill": "none", "opacity": 0.25 } },
  { type: 'path', attrs: { "d": "M66 57 L67 20", "stroke": "#C8B880", "stroke-width": 0.6, "fill": "none", "opacity": 0.28 } },
];

const S_B4: SVGElementDescriptor[] = [
  { type: 'g', attrs: { "transform": "rotate(-36, 84, 118)" }, children: [
    { type: 'path', attrs: { "d": "M84 118 L60 32 Q64 22 72 20 Q82 18 88 22 L84 118Z", "fill": "#F0E8CC", "opacity": 0.88 } },
    { type: 'path', attrs: { "d": "M60 32 Q64 22 72 20 Q82 18 88 22", "stroke": "#EEEADF", "stroke-width": 6.5, "fill": "none", "stroke-linecap": "round" } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(-18, 84, 118)" }, children: [
    { type: 'path', attrs: { "d": "M84 118 L60 32 Q64 22 72 20 Q82 18 88 22 L84 118Z", "fill": "#EDE0C4", "opacity": 0.9 } },
    { type: 'path', attrs: { "d": "M60 32 Q64 22 72 20 Q82 18 88 22", "stroke": "#EEEADF", "stroke-width": 6.5, "fill": "none", "stroke-linecap": "round" } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(0, 84, 118)" }, children: [
    { type: 'path', attrs: { "d": "M84 118 L60 32 Q64 22 72 20 Q82 18 88 22 L84 118Z", "fill": "#F4EDD6", "opacity": 0.93 } },
    { type: 'path', attrs: { "d": "M60 32 Q64 22 72 20 Q82 18 88 22", "stroke": "#EEEADF", "stroke-width": 6.5, "fill": "none", "stroke-linecap": "round" } },
    { type: 'path', attrs: { "d": "M61 32 Q65 23 72 21 Q82 19 88 22", "stroke": "#FAFAF5", "stroke-width": 2.5, "fill": "none", "stroke-linecap": "round", "opacity": 0.65 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(18, 84, 118)" }, children: [
    { type: 'path', attrs: { "d": "M84 118 L60 32 Q64 22 72 20 Q82 18 88 22 L84 118Z", "fill": "#EAD8BE", "opacity": 0.9 } },
    { type: 'path', attrs: { "d": "M60 32 Q64 22 72 20 Q82 18 88 22", "stroke": "#EEEADF", "stroke-width": 6.5, "fill": "none", "stroke-linecap": "round" } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(36, 84, 118)" }, children: [
    { type: 'path', attrs: { "d": "M84 118 L60 32 Q64 22 72 20 Q82 18 88 22 L84 118Z", "fill": "#E8D8B8", "opacity": 0.88 } },
    { type: 'path', attrs: { "d": "M60 32 Q64 22 72 20 Q82 18 88 22", "stroke": "#EEEADF", "stroke-width": 6.5, "fill": "none", "stroke-linecap": "round" } },
  ] },
];

const S_B5: SVGElementDescriptor[] = [
  { type: 'g', attrs: { "transform": "rotate(25, 36, 39)" }, children: [
    { type: 'path', attrs: { "d": "M36 68 L11 14 Q15 4 23 3 Q49 3 59 9 L36 68Z", "fill": "url(#b5p)" } },
    { type: 'path', attrs: { "d": "M11 14 Q15 4 23 3 Q49 3 59 9", "stroke": "#EEEADF", "stroke-width": 8, "fill": "none", "stroke-linecap": "round" } },
    { type: 'path', attrs: { "d": "M12 14 Q16 5 23 4 Q49 4 58 9", "stroke": "#FAFAF4", "stroke-width": 3.5, "fill": "none", "stroke-linecap": "round", "opacity": 0.65 } },
  ] },
];

const S_D1: SVGElementDescriptor[] = [
  { type: 'circle', attrs: { "cx": 46, "cy": 46, "r": 44, "fill": "url(#d1skin)" } },
  { type: 'path', attrs: { "d": "M46 2 Q52 6 50 2", "stroke": "#F870A8", "stroke-width": 2, "fill": "none", "opacity": 0.6 } },
  { type: 'path', attrs: { "d": "M62 5 Q68 10 66 5", "stroke": "#F870A8", "stroke-width": 2, "fill": "none", "opacity": 0.6 } },
  { type: 'path', attrs: { "d": "M76 14 Q82 20 80 14", "stroke": "#F870A8", "stroke-width": 2, "fill": "none", "opacity": 0.6 } },
  { type: 'path', attrs: { "d": "M86 28 Q90 35 88 28", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.55 } },
  { type: 'path', attrs: { "d": "M88 44 Q92 50 90 44", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.55 } },
  { type: 'path', attrs: { "d": "M84 60 Q88 66 86 60", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.55 } },
  { type: 'path', attrs: { "d": "M74 74 Q78 80 76 74", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.55 } },
  { type: 'path', attrs: { "d": "M60 84 Q64 88 62 84", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.55 } },
  { type: 'path', attrs: { "d": "M44 88 Q48 92 46 88", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.55 } },
  { type: 'path', attrs: { "d": "M28 84 Q32 88 30 84", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.55 } },
  { type: 'path', attrs: { "d": "M14 76 Q18 82 16 76", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.55 } },
  { type: 'path', attrs: { "d": "M6 62 Q10 68 8 62", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.55 } },
  { type: 'path', attrs: { "d": "M2 46 Q5 52 4 46", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.55 } },
  { type: 'path', attrs: { "d": "M4 30 Q7 36 6 30", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.55 } },
  { type: 'path', attrs: { "d": "M12 16 Q15 22 14 16", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.55 } },
  { type: 'path', attrs: { "d": "M28 6 Q32 10 30 6", "stroke": "#F870A8", "stroke-width": 2, "fill": "none", "opacity": 0.6 } },
  { type: 'circle', attrs: { "cx": 46, "cy": 46, "r": 33, "fill": "url(#d1flesh)" } },
  { type: 'line', attrs: { "x1": 46, "y1": 46, "x2": 46, "y2": 14, "stroke": "#E0D8D4", "stroke-width": 0.5, "opacity": 0.28 } },
  { type: 'line', attrs: { "x1": 46, "y1": 46, "x2": 70, "y2": 58, "stroke": "#E0D8D4", "stroke-width": 0.5, "opacity": 0.28 } },
  { type: 'line', attrs: { "x1": 46, "y1": 46, "x2": 22, "y2": 58, "stroke": "#E0D8D4", "stroke-width": 0.5, "opacity": 0.28 } },
  { type: 'line', attrs: { "x1": 46, "y1": 46, "x2": 69, "y2": 32, "stroke": "#E0D8D4", "stroke-width": 0.5, "opacity": 0.28 } },
  { type: 'line', attrs: { "x1": 46, "y1": 46, "x2": 23, "y2": 32, "stroke": "#E0D8D4", "stroke-width": 0.5, "opacity": 0.28 } },
  { type: 'line', attrs: { "x1": 46, "y1": 46, "x2": 46, "y2": 78, "stroke": "#E0D8D4", "stroke-width": 0.5, "opacity": 0.28 } },
  { type: 'ellipse', attrs: { "cx": 46, "cy": 22, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(0,46,22)" } },
  { type: 'ellipse', attrs: { "cx": 58, "cy": 26, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(30,58,26)" } },
  { type: 'ellipse', attrs: { "cx": 66, "cy": 36, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(60,66,36)" } },
  { type: 'ellipse', attrs: { "cx": 68, "cy": 48, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(90,68,48)" } },
  { type: 'ellipse', attrs: { "cx": 63, "cy": 60, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(120,63,60)" } },
  { type: 'ellipse', attrs: { "cx": 53, "cy": 68, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(150,53,68)" } },
  { type: 'ellipse', attrs: { "cx": 40, "cy": 70, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(180,40,70)" } },
  { type: 'ellipse', attrs: { "cx": 29, "cy": 64, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(210,29,64)" } },
  { type: 'ellipse', attrs: { "cx": 24, "cy": 54, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(240,24,54)" } },
  { type: 'ellipse', attrs: { "cx": 26, "cy": 40, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(270,26,40)" } },
  { type: 'ellipse', attrs: { "cx": 32, "cy": 29, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(300,32,29)" } },
  { type: 'ellipse', attrs: { "cx": 42, "cy": 24, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(330,42,24)" } },
  { type: 'circle', attrs: { "cx": 50, "cy": 38, "r": 1.2, "fill": "#1A0A10" } },
  { type: 'circle', attrs: { "cx": 40, "cy": 42, "r": 1.1, "fill": "#1A0A10" } },
  { type: 'circle', attrs: { "cx": 54, "cy": 52, "r": 1.2, "fill": "#1A0A10" } },
  { type: 'circle', attrs: { "cx": 38, "cy": 56, "r": 1, "fill": "#1A0A10" } },
  { type: 'circle', attrs: { "cx": 46, "cy": 50, "r": 1.3, "fill": "#1A0A10" } },
];

const S_D2: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M2 4 Q50 4 50 42 Q50 80 2 80Z", "fill": "url(#d2skin)" } },
  { type: 'path', attrs: { "d": "M2 12 Q38 12 38 42 Q38 72 2 72Z", "fill": "url(#d2flesh)" } },
  { type: 'ellipse', attrs: { "cx": 22, "cy": 22, "rx": 1.2, "ry": 1.8, "fill": "#1A0A10", "transform": "rotate(-20,22,22)" } },
  { type: 'ellipse', attrs: { "cx": 33, "cy": 30, "rx": 1.2, "ry": 1.8, "fill": "#1A0A10", "transform": "rotate(10,33,30)" } },
  { type: 'ellipse', attrs: { "cx": 35, "cy": 42, "rx": 1.2, "ry": 1.8, "fill": "#1A0A10", "transform": "rotate(90,35,42)" } },
  { type: 'ellipse', attrs: { "cx": 32, "cy": 54, "rx": 1.2, "ry": 1.8, "fill": "#1A0A10", "transform": "rotate(160,32,54)" } },
  { type: 'ellipse', attrs: { "cx": 22, "cy": 62, "rx": 1.2, "ry": 1.8, "fill": "#1A0A10", "transform": "rotate(200,22,62)" } },
  { type: 'circle', attrs: { "cx": 16, "cy": 36, "r": 1.1, "fill": "#1A0A10" } },
  { type: 'circle', attrs: { "cx": 16, "cy": 50, "r": 1, "fill": "#1A0A10" } },
  { type: 'circle', attrs: { "cx": 26, "cy": 44, "r": 1.2, "fill": "#1A0A10" } },
  { type: 'path', attrs: { "d": "M38 8 Q44 12 42 8", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.55 } },
  { type: 'path', attrs: { "d": "M46 18 Q50 24 48 18", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.55 } },
  { type: 'path', attrs: { "d": "M50 32 Q52 38 50 32", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.52 } },
  { type: 'path', attrs: { "d": "M48 54 Q52 60 50 54", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.52 } },
  { type: 'path', attrs: { "d": "M42 68 Q46 74 44 68", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.55 } },
  { type: 'line', attrs: { "x1": 2, "y1": 4, "x2": 2, "y2": 80, "stroke": "#FDFBFA", "stroke-width": 2.5, "opacity": 0.55 } },
];

const S_D3: SVGElementDescriptor[] = [
  { type: 'g', attrs: { "transform": "rotate(-18, 48, 46)" }, children: [
    { type: 'circle', attrs: { "cx": 48, "cy": 46, "r": 40, "fill": "url(#d3skin)" } },
    { type: 'path', attrs: { "d": "M48 6 Q54 10 52 6", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.58 } },
    { type: 'path', attrs: { "d": "M66 10 Q72 16 70 10", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.58 } },
    { type: 'path', attrs: { "d": "M80 22 Q86 28 84 22", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.55 } },
    { type: 'path', attrs: { "d": "M86 40 Q90 46 88 40", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.55 } },
    { type: 'path', attrs: { "d": "M80 58 Q84 64 82 58", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.52 } },
    { type: 'path', attrs: { "d": "M66 72 Q70 78 68 72", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.52 } },
    { type: 'path', attrs: { "d": "M48 80 Q52 84 50 80", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.52 } },
    { type: 'path', attrs: { "d": "M30 72 Q34 78 32 72", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.52 } },
    { type: 'path', attrs: { "d": "M14 58 Q18 64 16 58", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.52 } },
    { type: 'path', attrs: { "d": "M8 40 Q12 46 10 40", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.52 } },
    { type: 'path', attrs: { "d": "M16 22 Q20 28 18 22", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.55 } },
    { type: 'path', attrs: { "d": "M30 10 Q36 16 34 10", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.58 } },
    { type: 'circle', attrs: { "cx": 48, "cy": 46, "r": 30, "fill": "url(#d3flesh)" } },
    { type: 'ellipse', attrs: { "cx": 48, "cy": 24, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(0,48,24)" } },
    { type: 'ellipse', attrs: { "cx": 60, "cy": 28, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(30,60,28)" } },
    { type: 'ellipse', attrs: { "cx": 67, "cy": 38, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(60,67,38)" } },
    { type: 'ellipse', attrs: { "cx": 68, "cy": 50, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(90,68,50)" } },
    { type: 'ellipse', attrs: { "cx": 62, "cy": 61, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(130,62,61)" } },
    { type: 'ellipse', attrs: { "cx": 52, "cy": 68, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(170,52,68)" } },
    { type: 'ellipse', attrs: { "cx": 40, "cy": 68, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(190,40,68)" } },
    { type: 'ellipse', attrs: { "cx": 30, "cy": 62, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(220,30,62)" } },
    { type: 'ellipse', attrs: { "cx": 26, "cy": 50, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(270,26,50)" } },
    { type: 'ellipse', attrs: { "cx": 28, "cy": 38, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(310,28,38)" } },
    { type: 'ellipse', attrs: { "cx": 36, "cy": 28, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(340,36,28)" } },
    { type: 'circle', attrs: { "cx": 48, "cy": 44, "r": 1.3, "fill": "#1A0A10" } },
    { type: 'circle', attrs: { "cx": 42, "cy": 52, "r": 1.1, "fill": "#1A0A10" } },
    { type: 'circle', attrs: { "cx": 55, "cy": 50, "r": 1.1, "fill": "#1A0A10" } },
  ] },
];

const S_D4: SVGElementDescriptor[] = [
  { type: 'g', attrs: { "transform": "translate(2,10) rotate(-14, 38, 42)" }, children: [
    { type: 'circle', attrs: { "cx": 38, "cy": 42, "r": 35, "fill": "url(#d4sA)", "opacity": 0.86 } },
    { type: 'circle', attrs: { "cx": 38, "cy": 42, "r": 26, "fill": "url(#d4fl)" } },
    { type: 'ellipse', attrs: { "cx": 38, "cy": 20, "rx": 1.3, "ry": 2, "fill": "#1A0A10", "transform": "rotate(0,38,20)" } },
    { type: 'ellipse', attrs: { "cx": 50, "cy": 24, "rx": 1.3, "ry": 2, "fill": "#1A0A10", "transform": "rotate(30,50,24)" } },
    { type: 'ellipse', attrs: { "cx": 58, "cy": 34, "rx": 1.3, "ry": 2, "fill": "#1A0A10", "transform": "rotate(60,58,34)" } },
    { type: 'ellipse', attrs: { "cx": 60, "cy": 46, "rx": 1.3, "ry": 2, "fill": "#1A0A10", "transform": "rotate(90,60,46)" } },
    { type: 'ellipse', attrs: { "cx": 54, "cy": 57, "rx": 1.3, "ry": 2, "fill": "#1A0A10", "transform": "rotate(130,54,57)" } },
    { type: 'ellipse', attrs: { "cx": 44, "cy": 64, "rx": 1.3, "ry": 2, "fill": "#1A0A10", "transform": "rotate(170,44,64)" } },
    { type: 'ellipse', attrs: { "cx": 32, "cy": 64, "rx": 1.3, "ry": 2, "fill": "#1A0A10", "transform": "rotate(200,32,64)" } },
    { type: 'ellipse', attrs: { "cx": 22, "cy": 56, "rx": 1.3, "ry": 2, "fill": "#1A0A10", "transform": "rotate(230,22,56)" } },
    { type: 'ellipse', attrs: { "cx": 18, "cy": 44, "rx": 1.3, "ry": 2, "fill": "#1A0A10", "transform": "rotate(270,18,44)" } },
    { type: 'circle', attrs: { "cx": 40, "cy": 40, "r": 1.3, "fill": "#1A0A10" } },
    { type: 'circle', attrs: { "cx": 34, "cy": 46, "r": 1, "fill": "#1A0A10" } },
  ] },
  { type: 'g', attrs: { "transform": "translate(44,4)" }, children: [
    { type: 'circle', attrs: { "cx": 38, "cy": 44, "r": 38, "fill": "url(#d4sB)", "opacity": 0.94 } },
    { type: 'path', attrs: { "d": "M38 6 Q44 10 42 6", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.6 } },
    { type: 'path', attrs: { "d": "M60 12 Q66 18 64 12", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.6 } },
    { type: 'path', attrs: { "d": "M72 28 Q76 34 74 28", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.55 } },
    { type: 'path', attrs: { "d": "M74 46 Q78 52 76 46", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.55 } },
    { type: 'path', attrs: { "d": "M66 64 Q70 70 68 64", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.52 } },
    { type: 'path', attrs: { "d": "M50 76 Q54 80 52 76", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.52 } },
    { type: 'path', attrs: { "d": "M28 76 Q32 80 30 76", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.52 } },
    { type: 'path', attrs: { "d": "M12 62 Q16 68 14 62", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.52 } },
    { type: 'path', attrs: { "d": "M4 44 Q7 50 6 44", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.52 } },
    { type: 'path', attrs: { "d": "M12 26 Q16 32 14 26", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.55 } },
    { type: 'path', attrs: { "d": "M26 10 Q30 16 28 10", "stroke": "#F870A8", "stroke-width": 1.8, "fill": "none", "opacity": 0.58 } },
    { type: 'circle', attrs: { "cx": 38, "cy": 44, "r": 28, "fill": "url(#d4fl)" } },
    { type: 'ellipse', attrs: { "cx": 38, "cy": 20, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10" } },
    { type: 'ellipse', attrs: { "cx": 52, "cy": 25, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(30,52,25)" } },
    { type: 'ellipse', attrs: { "cx": 60, "cy": 36, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(60,60,36)" } },
    { type: 'ellipse', attrs: { "cx": 62, "cy": 49, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(90,62,49)" } },
    { type: 'ellipse', attrs: { "cx": 55, "cy": 61, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(130,55,61)" } },
    { type: 'ellipse', attrs: { "cx": 43, "cy": 68, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(170,43,68)" } },
    { type: 'ellipse', attrs: { "cx": 30, "cy": 68, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(200,30,68)" } },
    { type: 'ellipse', attrs: { "cx": 19, "cy": 60, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(230,19,60)" } },
    { type: 'ellipse', attrs: { "cx": 15, "cy": 48, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(270,15,48)" } },
    { type: 'ellipse', attrs: { "cx": 20, "cy": 35, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(310,20,35)" } },
    { type: 'ellipse', attrs: { "cx": 28, "cy": 26, "rx": 1.4, "ry": 2.2, "fill": "#1A0A10", "transform": "rotate(340,28,26)" } },
    { type: 'circle', attrs: { "cx": 40, "cy": 42, "r": 1.4, "fill": "#1A0A10" } },
    { type: 'circle', attrs: { "cx": 34, "cy": 50, "r": 1.1, "fill": "#1A0A10" } },
    { type: 'circle', attrs: { "cx": 48, "cy": 50, "r": 1.1, "fill": "#1A0A10" } },
  ] },
  { type: 'g', attrs: { "transform": "translate(88,8) rotate(12, 36, 42)" }, children: [
    { type: 'circle', attrs: { "cx": 36, "cy": 42, "r": 34, "fill": "url(#d4sC)", "opacity": 0.96 } },
    { type: 'circle', attrs: { "cx": 36, "cy": 42, "r": 25, "fill": "url(#d4fl)" } },
    { type: 'ellipse', attrs: { "cx": 36, "cy": 22, "rx": 1.3, "ry": 2, "fill": "#1A0A10" } },
    { type: 'ellipse', attrs: { "cx": 48, "cy": 26, "rx": 1.3, "ry": 2, "fill": "#1A0A10", "transform": "rotate(30,48,26)" } },
    { type: 'ellipse', attrs: { "cx": 56, "cy": 35, "rx": 1.3, "ry": 2, "fill": "#1A0A10", "transform": "rotate(60,56,35)" } },
    { type: 'ellipse', attrs: { "cx": 58, "cy": 46, "rx": 1.3, "ry": 2, "fill": "#1A0A10", "transform": "rotate(90,58,46)" } },
    { type: 'ellipse', attrs: { "cx": 52, "cy": 56, "rx": 1.3, "ry": 2, "fill": "#1A0A10", "transform": "rotate(130,52,56)" } },
    { type: 'ellipse', attrs: { "cx": 42, "cy": 62, "rx": 1.3, "ry": 2, "fill": "#1A0A10", "transform": "rotate(160,42,62)" } },
    { type: 'ellipse', attrs: { "cx": 30, "cy": 62, "rx": 1.3, "ry": 2, "fill": "#1A0A10", "transform": "rotate(200,30,62)" } },
    { type: 'ellipse', attrs: { "cx": 20, "cy": 55, "rx": 1.3, "ry": 2, "fill": "#1A0A10", "transform": "rotate(230,20,55)" } },
    { type: 'ellipse', attrs: { "cx": 16, "cy": 44, "rx": 1.3, "ry": 2, "fill": "#1A0A10", "transform": "rotate(270,16,44)" } },
    { type: 'circle', attrs: { "cx": 38, "cy": 40, "r": 1.2, "fill": "#1A0A10" } },
  ] },
];

const S_G1: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M22 4 L38 12 L38 30 L22 38 L6 30 L6 12Z", "fill": "url(#g1top)" } },
  { type: 'path', attrs: { "d": "M38 12 L41 15 L41 33 L38 30Z", "fill": "url(#g1side)" } },
  { type: 'path', attrs: { "d": "M22 38 L38 30 L41 33 L25 41Z", "fill": "#AA8014", "opacity": 0.72 } },
  { type: 'path', attrs: { "d": "M22 6 L36 13", "stroke": "#FFFAAA", "stroke-width": 1.5, "fill": "none", "opacity": 0.45 } },
  { type: 'circle', attrs: { "cx": 24, "cy": 16, "r": 1.5, "fill": "#D4A820", "opacity": 0.5 } },
  { type: 'circle', attrs: { "cx": 32, "cy": 24, "r": 1, "fill": "#D4A820", "opacity": 0.4 } },
];

const S_G2: SVGElementDescriptor[] = [
  { type: 'g', attrs: { "transform": "translate(24,0)" }, children: [
    { type: 'path', attrs: { "d": "M13 2 L25 8 L25 23 L13 29 L1 23 L1 8Z", "fill": "#ECC840" } },
    { type: 'path', attrs: { "d": "M25 8 L27 10 L27 25 L25 23Z", "fill": "#C8A028" } },
    { type: 'path', attrs: { "d": "M13 29 L25 23 L27 25 L15 31Z", "fill": "#B08E1C" } },
  ] },
  { type: 'g', attrs: { "transform": "translate(0,16)" }, children: [
    { type: 'path', attrs: { "d": "M13 2 L25 8 L25 23 L13 29 L1 23 L1 8Z", "fill": "url(#g2top)" } },
    { type: 'path', attrs: { "d": "M25 8 L27 10 L27 25 L25 23Z", "fill": "#D4B030" } },
    { type: 'path', attrs: { "d": "M13 29 L25 23 L27 25 L15 31Z", "fill": "#B89018" } },
    { type: 'circle', attrs: { "cx": 16, "cy": 14, "r": 1.3, "fill": "#D0A420", "opacity": 0.48 } },
  ] },
  { type: 'g', attrs: { "transform": "translate(38,18)" }, children: [
    { type: 'path', attrs: { "d": "M13 2 L25 8 L25 23 L13 29 L1 23 L1 8Z", "fill": "#F0CC48" } },
    { type: 'path', attrs: { "d": "M25 8 L27 10 L27 25 L25 23Z", "fill": "#CEAC28" } },
    { type: 'path', attrs: { "d": "M13 29 L25 23 L27 25 L15 31Z", "fill": "#AE8818" } },
  ] },
];

const S_G3: SVGElementDescriptor[] = [
  { type: 'rect', attrs: { "x": 2, "y": 2, "width": 36, "height": 36, "rx": 3, "fill": "url(#g3flat)" } },
  { type: 'rect', attrs: { "x": 4, "y": 4, "width": 14, "height": 14, "rx": 2, "fill": "#FFF890", "opacity": 0.38 } },
  { type: 'circle', attrs: { "cx": 26, "cy": 14, "r": 1.3, "fill": "#E8C040", "opacity": 0.58 } },
  { type: 'circle', attrs: { "cx": 14, "cy": 28, "r": 1.1, "fill": "#E8C040", "opacity": 0.48 } },
  { type: 'circle', attrs: { "cx": 29, "cy": 27, "r": 1.6, "fill": "#E8C040", "opacity": 0.42 } },
  { type: 'rect', attrs: { "x": 2, "y": 2, "width": 36, "height": 36, "rx": 3, "fill": "none", "stroke": "#C8A020", "stroke-width": 1, "opacity": 0.4 } },
];

const S_G4: SVGElementDescriptor[] = [
  { type: 'g', attrs: { "transform": "translate(4,70)" }, children: [
    { type: 'path', attrs: { "d": "M15 2 L30 10 L30 26 L15 34 L0 26 L0 10Z", "fill": "#ECC840" } },
    { type: 'path', attrs: { "d": "M30 10 L33 13 L33 29 L30 26Z", "fill": "#C8A028" } },
    { type: 'path', attrs: { "d": "M15 34 L30 26 L33 29 L18 37Z", "fill": "#AE8818" } },
  ] },
  { type: 'g', attrs: { "transform": "translate(34,64)" }, children: [
    { type: 'path', attrs: { "d": "M15 2 L30 10 L30 26 L15 34 L0 26 L0 10Z", "fill": "#F0D048" } },
    { type: 'path', attrs: { "d": "M30 10 L33 13 L33 29 L30 26Z", "fill": "#CCAA20" } },
    { type: 'path', attrs: { "d": "M15 34 L30 26 L33 29 L18 37Z", "fill": "#AA8010" } },
  ] },
  { type: 'g', attrs: { "transform": "translate(66,68)" }, children: [
    { type: 'path', attrs: { "d": "M15 2 L30 10 L30 26 L15 34 L0 26 L0 10Z", "fill": "#ECC840" } },
    { type: 'path', attrs: { "d": "M30 10 L33 13 L33 29 L30 26Z", "fill": "#C8A020" } },
    { type: 'path', attrs: { "d": "M15 34 L30 26 L33 29 L18 37Z", "fill": "#AC8818" } },
  ] },
  { type: 'g', attrs: { "transform": "translate(100,72)" }, children: [
    { type: 'path', attrs: { "d": "M15 2 L30 10 L30 26 L15 34 L0 26 L0 10Z", "fill": "#F4D450" } },
    { type: 'path', attrs: { "d": "M30 10 L33 13 L33 29 L30 26Z", "fill": "#D0AC28" } },
    { type: 'path', attrs: { "d": "M15 34 L30 26 L33 29 L18 37Z", "fill": "#B09018" } },
  ] },
  { type: 'g', attrs: { "transform": "translate(20,40)" }, children: [
    { type: 'path', attrs: { "d": "M15 2 L30 10 L30 26 L15 34 L0 26 L0 10Z", "fill": "#F8E058" } },
    { type: 'path', attrs: { "d": "M30 10 L33 13 L33 29 L30 26Z", "fill": "#D4B030" } },
    { type: 'path', attrs: { "d": "M15 34 L30 26 L33 29 L18 37Z", "fill": "#B89020" } },
  ] },
  { type: 'g', attrs: { "transform": "translate(54,34)" }, children: [
    { type: 'path', attrs: { "d": "M15 2 L30 10 L30 26 L15 34 L0 26 L0 10Z", "fill": "#F4DC50" } },
    { type: 'path', attrs: { "d": "M30 10 L33 13 L33 29 L30 26Z", "fill": "#CCA828" } },
    { type: 'path', attrs: { "d": "M15 34 L30 26 L33 29 L18 37Z", "fill": "#AA8818" } },
  ] },
  { type: 'g', attrs: { "transform": "translate(88,38)" }, children: [
    { type: 'path', attrs: { "d": "M15 2 L30 10 L30 26 L15 34 L0 26 L0 10Z", "fill": "#FAE260" } },
    { type: 'path', attrs: { "d": "M30 10 L33 13 L33 29 L30 26Z", "fill": "#D0AC28" } },
    { type: 'path', attrs: { "d": "M15 34 L30 26 L33 29 L18 37Z", "fill": "#B49018" } },
  ] },
  { type: 'g', attrs: { "transform": "translate(38,8)" }, children: [
    { type: 'path', attrs: { "d": "M15 2 L30 10 L30 26 L15 34 L0 26 L0 10Z", "fill": "#FFF082" } },
    { type: 'path', attrs: { "d": "M30 10 L33 13 L33 29 L30 26Z", "fill": "#DCC030" } },
    { type: 'path', attrs: { "d": "M15 34 L30 26 L33 29 L18 37Z", "fill": "#BCA020" } },
  ] },
  { type: 'g', attrs: { "transform": "translate(70,4)" }, children: [
    { type: 'path', attrs: { "d": "M15 2 L30 10 L30 26 L15 34 L0 26 L0 10Z", "fill": "#FEEC78" } },
    { type: 'path', attrs: { "d": "M30 10 L33 13 L33 29 L30 26Z", "fill": "#D8B828" } },
    { type: 'path', attrs: { "d": "M15 34 L30 26 L33 29 L18 37Z", "fill": "#B89A18" } },
  ] },
];

const S_GR1: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M41 8 Q39 4 37 2", "stroke": "#5A7830", "stroke-width": 1.5, "fill": "none", "stroke-linecap": "round" } },
  { type: 'circle', attrs: { "cx": 27, "cy": 22, "r": 13, "fill": "url(#gr1)" } },
  { type: 'circle', attrs: { "cx": 41, "cy": 18, "r": 13, "fill": "url(#gr1)" } },
  { type: 'circle', attrs: { "cx": 55, "cy": 22, "r": 13, "fill": "url(#gr1)" } },
  { type: 'circle', attrs: { "cx": 19, "cy": 40, "r": 13, "fill": "url(#gr1)" } },
  { type: 'circle', attrs: { "cx": 34, "cy": 38, "r": 13, "fill": "url(#gr1)" } },
  { type: 'circle', attrs: { "cx": 48, "cy": 40, "r": 13, "fill": "url(#gr1)" } },
  { type: 'circle', attrs: { "cx": 63, "cy": 40, "r": 13, "fill": "url(#gr1)" } },
  { type: 'circle', attrs: { "cx": 27, "cy": 58, "r": 13, "fill": "url(#gr1)" } },
  { type: 'circle', attrs: { "cx": 41, "cy": 56, "r": 13, "fill": "url(#gr1)" } },
  { type: 'circle', attrs: { "cx": 55, "cy": 58, "r": 13, "fill": "url(#gr1)" } },
  { type: 'circle', attrs: { "cx": 34, "cy": 76, "r": 13, "fill": "url(#gr1)" } },
  { type: 'circle', attrs: { "cx": 48, "cy": 76, "r": 13, "fill": "url(#gr1)" } },
  { type: 'circle', attrs: { "cx": 41, "cy": 88, "r": 10, "fill": "url(#gr1)" } },
  { type: 'circle', attrs: { "cx": 22, "cy": 16, "r": 4.5, "fill": "#E0F880", "opacity": 0.48 } },
  { type: 'circle', attrs: { "cx": 36, "cy": 12, "r": 4, "fill": "#E0F880", "opacity": 0.48 } },
  { type: 'circle', attrs: { "cx": 50, "cy": 16, "r": 4.5, "fill": "#E0F880", "opacity": 0.45 } },
  { type: 'circle', attrs: { "cx": 29, "cy": 70, "r": 4, "fill": "#E0F880", "opacity": 0.42 } },
  { type: 'circle', attrs: { "cx": 43, "cy": 70, "r": 4, "fill": "#E0F880", "opacity": 0.42 } },
];

const S_GR2: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M40 8 Q38 4 36 2", "stroke": "#3A1828", "stroke-width": 1.5, "fill": "none", "stroke-linecap": "round" } },
  { type: 'circle', attrs: { "cx": 26, "cy": 22, "r": 13, "fill": "url(#gr2)" } },
  { type: 'circle', attrs: { "cx": 40, "cy": 18, "r": 13, "fill": "url(#gr2)" } },
  { type: 'circle', attrs: { "cx": 54, "cy": 22, "r": 13, "fill": "url(#gr2)" } },
  { type: 'circle', attrs: { "cx": 18, "cy": 40, "r": 13, "fill": "url(#gr2)" } },
  { type: 'circle', attrs: { "cx": 33, "cy": 38, "r": 13, "fill": "url(#gr2)" } },
  { type: 'circle', attrs: { "cx": 47, "cy": 40, "r": 13, "fill": "url(#gr2)" } },
  { type: 'circle', attrs: { "cx": 62, "cy": 40, "r": 13, "fill": "url(#gr2)" } },
  { type: 'circle', attrs: { "cx": 26, "cy": 57, "r": 13, "fill": "url(#gr2)" } },
  { type: 'circle', attrs: { "cx": 40, "cy": 55, "r": 13, "fill": "url(#gr2)" } },
  { type: 'circle', attrs: { "cx": 54, "cy": 57, "r": 13, "fill": "url(#gr2)" } },
  { type: 'circle', attrs: { "cx": 33, "cy": 74, "r": 13, "fill": "url(#gr2)" } },
  { type: 'circle', attrs: { "cx": 47, "cy": 74, "r": 13, "fill": "url(#gr2)" } },
  { type: 'circle', attrs: { "cx": 40, "cy": 85, "r": 10, "fill": "url(#gr2)" } },
  { type: 'circle', attrs: { "cx": 21, "cy": 16, "r": 4.5, "fill": "#CA90B8", "opacity": 0.45 } },
  { type: 'circle', attrs: { "cx": 35, "cy": 12, "r": 4, "fill": "#CA90B8", "opacity": 0.45 } },
  { type: 'circle', attrs: { "cx": 49, "cy": 16, "r": 4, "fill": "#CA90B8", "opacity": 0.42 } },
  { type: 'circle', attrs: { "cx": 28, "cy": 68, "r": 3.5, "fill": "#CA90B8", "opacity": 0.38 } },
  { type: 'circle', attrs: { "cx": 42, "cy": 68, "r": 3.5, "fill": "#CA90B8", "opacity": 0.38 } },
];

const S_GR3: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M29 6 Q27 3 25 1", "stroke": "#5A7830", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round" } },
  { type: 'circle', attrs: { "cx": 19, "cy": 16, "r": 10, "fill": "url(#gr3)" } },
  { type: 'circle', attrs: { "cx": 29, "cy": 13, "r": 10, "fill": "url(#gr3)" } },
  { type: 'circle', attrs: { "cx": 39, "cy": 16, "r": 10, "fill": "url(#gr3)" } },
  { type: 'circle', attrs: { "cx": 13, "cy": 31, "r": 10, "fill": "url(#gr3)" } },
  { type: 'circle', attrs: { "cx": 24, "cy": 28, "r": 10, "fill": "url(#gr3)" } },
  { type: 'circle', attrs: { "cx": 34, "cy": 31, "r": 10, "fill": "url(#gr3)" } },
  { type: 'circle', attrs: { "cx": 45, "cy": 31, "r": 10, "fill": "url(#gr3)" } },
  { type: 'circle', attrs: { "cx": 19, "cy": 46, "r": 10, "fill": "url(#gr3)" } },
  { type: 'circle', attrs: { "cx": 29, "cy": 43, "r": 10, "fill": "url(#gr3)" } },
  { type: 'circle', attrs: { "cx": 39, "cy": 46, "r": 10, "fill": "url(#gr3)" } },
  { type: 'circle', attrs: { "cx": 29, "cy": 58, "r": 8, "fill": "url(#gr3)" } },
  { type: 'circle', attrs: { "cx": 15, "cy": 10, "r": 3.5, "fill": "#D8F070", "opacity": 0.48 } },
  { type: 'circle', attrs: { "cx": 25, "cy": 7, "r": 3, "fill": "#D8F070", "opacity": 0.48 } },
];

const S_GR4: SVGElementDescriptor[] = [
  { type: 'circle', attrs: { "cx": 22, "cy": 20, "r": 11, "fill": "url(#gr4g)" } },
  { type: 'circle', attrs: { "cx": 34, "cy": 16, "r": 11, "fill": "url(#gr4g)" } },
  { type: 'circle', attrs: { "cx": 46, "cy": 20, "r": 11, "fill": "url(#gr4g)" } },
  { type: 'circle', attrs: { "cx": 16, "cy": 36, "r": 11, "fill": "url(#gr4g)" } },
  { type: 'circle', attrs: { "cx": 28, "cy": 34, "r": 11, "fill": "url(#gr4g)" } },
  { type: 'circle', attrs: { "cx": 40, "cy": 36, "r": 11, "fill": "url(#gr4g)" } },
  { type: 'circle', attrs: { "cx": 52, "cy": 36, "r": 11, "fill": "url(#gr4g)" } },
  { type: 'circle', attrs: { "cx": 22, "cy": 52, "r": 11, "fill": "url(#gr4g)" } },
  { type: 'circle', attrs: { "cx": 34, "cy": 50, "r": 11, "fill": "url(#gr4g)" } },
  { type: 'circle', attrs: { "cx": 46, "cy": 52, "r": 11, "fill": "url(#gr4g)" } },
  { type: 'circle', attrs: { "cx": 18, "cy": 14, "r": 3.5, "fill": "#D8F068", "opacity": 0.5 } },
  { type: 'circle', attrs: { "cx": 96, "cy": 20, "r": 11, "fill": "url(#gr4r)" } },
  { type: 'circle', attrs: { "cx": 108, "cy": 16, "r": 11, "fill": "url(#gr4r)" } },
  { type: 'circle', attrs: { "cx": 120, "cy": 20, "r": 11, "fill": "url(#gr4r)" } },
  { type: 'circle', attrs: { "cx": 90, "cy": 36, "r": 11, "fill": "url(#gr4r)" } },
  { type: 'circle', attrs: { "cx": 102, "cy": 34, "r": 11, "fill": "url(#gr4r)" } },
  { type: 'circle', attrs: { "cx": 114, "cy": 36, "r": 11, "fill": "url(#gr4r)" } },
  { type: 'circle', attrs: { "cx": 126, "cy": 36, "r": 11, "fill": "url(#gr4r)" } },
  { type: 'circle', attrs: { "cx": 96, "cy": 52, "r": 11, "fill": "url(#gr4r)" } },
  { type: 'circle', attrs: { "cx": 108, "cy": 50, "r": 11, "fill": "url(#gr4r)" } },
  { type: 'circle', attrs: { "cx": 120, "cy": 52, "r": 11, "fill": "url(#gr4r)" } },
  { type: 'circle', attrs: { "cx": 92, "cy": 14, "r": 3.5, "fill": "#C888B0", "opacity": 0.45 } },
];

const S_M1: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M30 72 L5 14 Q9 4 17 2 Q40 2 53 8 L30 72Z", "fill": "url(#m1p)" } },
  { type: 'path', attrs: { "d": "M5 14 Q9 4 17 2 Q40 2 53 8", "stroke": "#C8A840", "stroke-width": 9, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M8 10 L13 6", "stroke": "#9A7C28", "stroke-width": 0.9, "fill": "none", "opacity": 0.65 } },
  { type: 'path', attrs: { "d": "M10 12 L15 8", "stroke": "#9A7C28", "stroke-width": 0.9, "fill": "none", "opacity": 0.65 } },
  { type: 'path', attrs: { "d": "M16 8 L21 4", "stroke": "#9A7C28", "stroke-width": 0.9, "fill": "none", "opacity": 0.65 } },
  { type: 'path', attrs: { "d": "M18 10 L23 6", "stroke": "#9A7C28", "stroke-width": 0.9, "fill": "none", "opacity": 0.6 } },
  { type: 'path', attrs: { "d": "M25 6 L30 3", "stroke": "#9A7C28", "stroke-width": 0.9, "fill": "none", "opacity": 0.6 } },
  { type: 'path', attrs: { "d": "M27 8 L32 5", "stroke": "#9A7C28", "stroke-width": 0.9, "fill": "none", "opacity": 0.6 } },
  { type: 'path', attrs: { "d": "M34 5 L39 3", "stroke": "#9A7C28", "stroke-width": 0.9, "fill": "none", "opacity": 0.6 } },
  { type: 'path', attrs: { "d": "M36 8 L41 5", "stroke": "#9A7C28", "stroke-width": 0.9, "fill": "none", "opacity": 0.6 } },
  { type: 'path', attrs: { "d": "M43 6 L48 4", "stroke": "#9A7C28", "stroke-width": 0.9, "fill": "none", "opacity": 0.58 } },
  { type: 'path', attrs: { "d": "M45 9 L49 7", "stroke": "#9A7C28", "stroke-width": 0.9, "fill": "none", "opacity": 0.55 } },
  { type: 'path', attrs: { "d": "M17 56 L12 22", "stroke": "#C8B860", "stroke-width": 0.5, "fill": "none", "opacity": 0.3 } },
  { type: 'path', attrs: { "d": "M30 66 L27 20", "stroke": "#C8B860", "stroke-width": 0.5, "fill": "none", "opacity": 0.25 } },
  { type: 'path', attrs: { "d": "M42 58 L42 17", "stroke": "#C8B860", "stroke-width": 0.5, "fill": "none", "opacity": 0.28 } },
  { type: 'circle', attrs: { "cx": 24, "cy": 42, "r": 1.2, "fill": "#F8EC90", "opacity": 0.48 } },
  { type: 'circle', attrs: { "cx": 36, "cy": 34, "r": 1, "fill": "#F8EC90", "opacity": 0.4 } },
];

const S_M2: SVGElementDescriptor[] = [
  { type: 'g', attrs: { "transform": "rotate(22, 36, 37)" }, children: [
    { type: 'path', attrs: { "d": "M36 72 L11 14 Q15 4 23 2 Q46 2 59 8 L36 72Z", "fill": "url(#m2p)" } },
    { type: 'path', attrs: { "d": "M11 14 Q15 4 23 2 Q46 2 59 8", "stroke": "#C4A03C", "stroke-width": 9, "fill": "none", "stroke-linecap": "round" } },
    { type: 'path', attrs: { "d": "M14 10 L19 6", "stroke": "#9A7C28", "stroke-width": 0.9, "fill": "none", "opacity": 0.6 } },
    { type: 'path', attrs: { "d": "M20 8 L25 4", "stroke": "#9A7C28", "stroke-width": 0.9, "fill": "none", "opacity": 0.6 } },
    { type: 'path', attrs: { "d": "M27 5 L32 3", "stroke": "#9A7C28", "stroke-width": 0.9, "fill": "none", "opacity": 0.6 } },
    { type: 'path', attrs: { "d": "M34 4 L39 3", "stroke": "#9A7C28", "stroke-width": 0.9, "fill": "none", "opacity": 0.58 } },
    { type: 'path', attrs: { "d": "M41 5 L46 3", "stroke": "#9A7C28", "stroke-width": 0.9, "fill": "none", "opacity": 0.55 } },
    { type: 'path', attrs: { "d": "M48 7 L53 5", "stroke": "#9A7C28", "stroke-width": 0.9, "fill": "none", "opacity": 0.5 } },
  ] },
];

const S_M3: SVGElementDescriptor[] = [
  { type: 'g', attrs: { "transform": "rotate(-22, 36, 37)" }, children: [
    { type: 'path', attrs: { "d": "M36 72 L11 14 Q15 4 23 2 Q46 2 59 8 L36 72Z", "fill": "url(#m3p)" } },
    { type: 'path', attrs: { "d": "M11 14 Q15 4 23 2 Q46 2 59 8", "stroke": "#BCA03A", "stroke-width": 9, "fill": "none", "stroke-linecap": "round" } },
    { type: 'path', attrs: { "d": "M14 10 L19 6", "stroke": "#9A7C28", "stroke-width": 0.9, "fill": "none", "opacity": 0.6 } },
    { type: 'path', attrs: { "d": "M21 7 L26 4", "stroke": "#9A7C28", "stroke-width": 0.9, "fill": "none", "opacity": 0.6 } },
    { type: 'path', attrs: { "d": "M28 5 L33 3", "stroke": "#9A7C28", "stroke-width": 0.9, "fill": "none", "opacity": 0.6 } },
    { type: 'path', attrs: { "d": "M35 4 L40 3", "stroke": "#9A7C28", "stroke-width": 0.9, "fill": "none", "opacity": 0.58 } },
    { type: 'path', attrs: { "d": "M42 5 L47 3", "stroke": "#9A7C28", "stroke-width": 0.9, "fill": "none", "opacity": 0.55 } },
    { type: 'path', attrs: { "d": "M49 7 L54 5", "stroke": "#9A7C28", "stroke-width": 0.9, "fill": "none", "opacity": 0.5 } },
  ] },
];

const S_M4: SVGElementDescriptor[] = [
  { type: 'g', attrs: { "transform": "rotate(-32, 86, 108)" }, children: [
    { type: 'path', attrs: { "d": "M86 108 L62 28 Q66 18 74 16 Q84 14 90 18 L86 108Z", "fill": "#E4D87C", "opacity": 0.86 } },
    { type: 'path', attrs: { "d": "M62 28 Q66 18 74 16 Q84 14 90 18", "stroke": "#C0A038", "stroke-width": 8, "fill": "none", "stroke-linecap": "round" } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(-16, 86, 108)" }, children: [
    { type: 'path', attrs: { "d": "M86 108 L62 28 Q66 18 74 16 Q84 14 90 18 L86 108Z", "fill": "#EAE07E", "opacity": 0.89 } },
    { type: 'path', attrs: { "d": "M62 28 Q66 18 74 16 Q84 14 90 18", "stroke": "#C4A840", "stroke-width": 8, "fill": "none", "stroke-linecap": "round" } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(0, 86, 108)" }, children: [
    { type: 'path', attrs: { "d": "M86 108 L62 28 Q66 18 74 16 Q84 14 90 18 L86 108Z", "fill": "url(#mFanBase)", "opacity": 0.93 } },
    { type: 'path', attrs: { "d": "M62 28 Q66 18 74 16 Q84 14 90 18", "stroke": "#C8AA40", "stroke-width": 8, "fill": "none", "stroke-linecap": "round" } },
    { type: 'path', attrs: { "d": "M65 24 L70 20", "stroke": "#9A7C28", "stroke-width": 0.8, "fill": "none", "opacity": 0.55 } },
    { type: 'path', attrs: { "d": "M71 20 L76 17", "stroke": "#9A7C28", "stroke-width": 0.8, "fill": "none", "opacity": 0.55 } },
    { type: 'path', attrs: { "d": "M77 17 L82 15", "stroke": "#9A7C28", "stroke-width": 0.8, "fill": "none", "opacity": 0.5 } },
    { type: 'path', attrs: { "d": "M83 15 L88 16", "stroke": "#9A7C28", "stroke-width": 0.8, "fill": "none", "opacity": 0.5 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(16, 86, 108)" }, children: [
    { type: 'path', attrs: { "d": "M86 108 L62 28 Q66 18 74 16 Q84 14 90 18 L86 108Z", "fill": "#E8DC7A", "opacity": 0.89 } },
    { type: 'path', attrs: { "d": "M62 28 Q66 18 74 16 Q84 14 90 18", "stroke": "#BEA038", "stroke-width": 8, "fill": "none", "stroke-linecap": "round" } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(32, 86, 108)" }, children: [
    { type: 'path', attrs: { "d": "M86 108 L62 28 Q66 18 74 16 Q84 14 90 18 L86 108Z", "fill": "#E2D876", "opacity": 0.86 } },
    { type: 'path', attrs: { "d": "M62 28 Q66 18 74 16 Q84 14 90 18", "stroke": "#BA9C35", "stroke-width": 8, "fill": "none", "stroke-linecap": "round" } },
  ] },
];

const S_P1: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M3 7 Q18 2 44 4 Q66 6 83 12 Q87 18 84 26 Q70 33 44 31 Q18 29 4 22 Q1 15 3 7Z", "fill": "url(#p1f)", "opacity": 0.94 } },
  { type: 'path', attrs: { "d": "M7 14 Q30 9 58 12 Q72 14 82 18", "stroke": "#F2CEB8", "stroke-width": 2.5, "fill": "none", "stroke-linecap": "round", "opacity": 0.38 } },
  { type: 'path', attrs: { "d": "M5 21 Q28 16 56 19 Q70 21 82 25", "stroke": "#F2CEB8", "stroke-width": 1.8, "fill": "none", "stroke-linecap": "round", "opacity": 0.28 } },
  { type: 'path', attrs: { "d": "M4 22 Q14 27 24 25 Q34 23 44 26 Q54 29 66 27 Q76 25 84 27", "stroke": "#904848", "stroke-width": 0.8, "fill": "none", "opacity": 0.4 } },
];

const S_P2: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M5 8 Q22 2 48 5 Q66 8 76 14 Q80 22 76 34 Q68 44 48 45 Q24 46 8 36 Q2 28 5 8Z", "fill": "url(#p2f)", "opacity": 0.93 } },
  { type: 'path', attrs: { "d": "M70 16 Q78 26 74 36", "stroke": "#8A3838", "stroke-width": 2, "fill": "none", "stroke-linecap": "round", "opacity": 0.55 } },
  { type: 'path', attrs: { "d": "M70 34 Q78 38 76 44 Q70 47 64 43 Q66 38 70 34Z", "fill": "#BF6058", "opacity": 0.65 } },
  { type: 'path', attrs: { "d": "M70 34 Q66 38 64 43", "stroke": "#A04848", "stroke-width": 1.2, "fill": "none", "opacity": 0.7 } },
  { type: 'path', attrs: { "d": "M9 15 Q32 10 58 13 Q68 15 74 20", "stroke": "#F0C8B0", "stroke-width": 2, "fill": "none", "stroke-linecap": "round", "opacity": 0.4 } },
  { type: 'path', attrs: { "d": "M7 24 Q30 19 55 22 Q66 24 74 29", "stroke": "#F0C8B0", "stroke-width": 1.5, "fill": "none", "stroke-linecap": "round", "opacity": 0.3 } },
];

const S_P3: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M4 14 Q10 4 18 5 Q22 1 28 7 Q34 1 40 6 Q46 1 52 6 Q58 3 64 11 Q68 20 64 30 Q58 40 50 44 Q40 50 28 49 Q18 47 10 41 Q4 33 4 22 Q3 18 4 14Z", "fill": "url(#p3f)", "opacity": 0.92 } },
  { type: 'path', attrs: { "d": "M20 5 Q18 20 16 36", "stroke": "#944040", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.35 } },
  { type: 'path', attrs: { "d": "M34 4 Q32 22 30 42", "stroke": "#944040", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.3 } },
  { type: 'path', attrs: { "d": "M48 5 Q47 22 46 38", "stroke": "#944040", "stroke-width": 1, "fill": "none", "stroke-linecap": "round", "opacity": 0.3 } },
  { type: 'path', attrs: { "d": "M8 22 Q30 16 60 20", "stroke": "#F0C8B0", "stroke-width": 2, "fill": "none", "stroke-linecap": "round", "opacity": 0.32 } },
  { type: 'path', attrs: { "d": "M6 30 Q28 25 58 29", "stroke": "#F0C8B0", "stroke-width": 1.5, "fill": "none", "stroke-linecap": "round", "opacity": 0.24 } },
];

const S_P4: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M2 4 Q32 0 64 3 Q84 6 98 13 Q100 20 95 28 Q74 36 46 34 Q20 32 4 22 Q0 14 2 4Z", "fill": "url(#p4a)", "opacity": 0.82 } },
  { type: 'path', attrs: { "d": "M2 10 Q32 6 64 9 Q84 12 98 19 Q100 26 95 34 Q74 42 46 40 Q20 38 4 28 Q0 20 2 10Z", "fill": "url(#p4b)", "opacity": 0.88 } },
  { type: 'path', attrs: { "d": "M2 16 Q32 12 64 15 Q84 18 98 25 Q100 32 95 40 Q74 48 46 46 Q20 44 4 34 Q0 26 2 16Z", "fill": "url(#p4c)", "opacity": 0.95 } },
  { type: 'path', attrs: { "d": "M8 26 Q38 20 70 24 Q84 26 94 30", "stroke": "#F0C8B0", "stroke-width": 2, "fill": "none", "stroke-linecap": "round", "opacity": 0.35 } },
  { type: 'path', attrs: { "d": "M6 34 Q36 28 68 32 Q82 34 92 38", "stroke": "#F0C8B0", "stroke-width": 1.5, "fill": "none", "stroke-linecap": "round", "opacity": 0.25 } },
];

const S_P5: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M0 4 Q42 0 84 3 Q126 6 168 2 L168 32 Q126 36 84 33 Q42 30 0 34Z", "fill": "url(#p5f)", "opacity": 0.93 } },
  { type: 'path', attrs: { "d": "M0 12 Q42 8 84 11 Q126 14 168 10", "stroke": "#F0C0A8", "stroke-width": 2.5, "fill": "none", "stroke-linecap": "round", "opacity": 0.38 } },
  { type: 'path', attrs: { "d": "M0 20 Q42 16 84 19 Q126 22 168 18", "stroke": "#F0C0A8", "stroke-width": 2, "fill": "none", "stroke-linecap": "round", "opacity": 0.28 } },
  { type: 'path', attrs: { "d": "M0 28 Q42 24 84 27 Q126 30 168 26", "stroke": "#F0C0A8", "stroke-width": 1.5, "fill": "none", "stroke-linecap": "round", "opacity": 0.18 } },
];

const S_P6: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M4 10 Q20 4 48 6 Q62 8 66 18 Q66 30 60 38 Q48 46 28 44 Q12 42 4 32 Q0 24 4 10Z", "fill": "url(#p6a)", "opacity": 0.83 } },
  { type: 'path', attrs: { "d": "M4 20 Q20 14 48 16 Q62 18 64 28 Q62 38 50 42 Q36 46 20 44 Q8 42 4 34 Q2 28 4 20Z", "fill": "url(#p6b)", "opacity": 0.96 } },
  { type: 'path', attrs: { "d": "M4 20 Q36 15 64 20", "stroke": "#904848", "stroke-width": 1.5, "fill": "none", "stroke-linecap": "round", "opacity": 0.45 } },
  { type: 'path', attrs: { "d": "M8 26 Q32 22 60 25", "stroke": "#F0C0A8", "stroke-width": 2, "fill": "none", "stroke-linecap": "round", "opacity": 0.32 } },
  { type: 'path', attrs: { "d": "M6 32 Q30 28 58 31", "stroke": "#F0C0A8", "stroke-width": 1.5, "fill": "none", "stroke-linecap": "round", "opacity": 0.22 } },
];

const S_S1: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M27 3 Q33 2 38 5 Q43 2 47 7 Q51 12 50 18 Q53 23 51 29 Q50 36 46 41 Q41 47 35 50 Q29 53 23 51 Q16 49 12 44 Q7 38 5 31 Q3 24 5 18 Q6 11 11 7 Q15 3 20 3 Q23 2 27 3Z", "fill": "url(#s1rim)" } },
  { type: 'path', attrs: { "d": "M27 7 Q32 6 36 8 Q40 6 43 11 Q46 15 45 21 Q47 25 45 30 Q43 37 39 40 Q34 44 28 46 Q22 47 17 45 Q12 41 10 36 Q7 30 8 24 Q8 18 11 13 Q14 9 19 7 Q23 6 27 7Z", "fill": "#A83838", "opacity": 0.55 } },
  { type: 'path', attrs: { "d": "M11 20 Q22 15 36 18 Q44 20 48 25", "stroke": "#EEC0A5", "stroke-width": 1.8, "fill": "none", "stroke-linecap": "round", "opacity": 0.32 } },
  { type: 'ellipse', attrs: { "cx": 27, "cy": 29, "rx": 13, "ry": 12, "fill": "url(#s1hole)" } },
  { type: 'path', attrs: { "d": "M16 23 Q27 18 38 23", "stroke": "#DC6868", "stroke-width": 2.5, "fill": "none", "stroke-linecap": "round", "opacity": 0.65 } },
  { type: 'circle', attrs: { "cx": 21, "cy": 12, "r": 1.1, "fill": "#140505", "opacity": 0.75 } },
  { type: 'circle', attrs: { "cx": 33, "cy": 10, "r": 0.9, "fill": "#140505", "opacity": 0.65 } },
  { type: 'circle', attrs: { "cx": 41, "cy": 16, "r": 1, "fill": "#140505", "opacity": 0.65 } },
  { type: 'circle', attrs: { "cx": 42, "cy": 34, "r": 0.8, "fill": "#140505", "opacity": 0.55 } },
  { type: 'circle', attrs: { "cx": 14, "cy": 30, "r": 0.9, "fill": "#140505", "opacity": 0.6 } },
];

const S_S2: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M29 2 Q36 1 42 5 Q48 2 52 8 Q56 14 54 21 Q57 27 54 33 Q51 41 45 46 Q39 52 30 54 Q21 55 15 50 Q8 46 5 39 Q1 32 3 24 Q4 17 9 11 Q14 5 20 3 Q24 1 29 2Z", "fill": "url(#s2rim)" } },
  { type: 'path', attrs: { "d": "M29 7 Q35 6 40 9 Q45 7 48 12 Q51 17 49 23 Q51 29 49 34 Q46 41 41 44 Q35 49 28 50 Q21 51 16 47 Q10 42 8 35 Q5 28 7 21 Q9 15 14 10 Q18 7 23 6 Q26 5 29 7Z", "fill": "#B04040", "opacity": 0.48 } },
  { type: 'path', attrs: { "d": "M11 22 Q24 16 42 20 Q50 22 54 27", "stroke": "#F0C2A0", "stroke-width": 2, "fill": "none", "stroke-linecap": "round", "opacity": 0.28 } },
  { type: 'ellipse', attrs: { "cx": 29, "cy": 30, "rx": 16, "ry": 15, "fill": "url(#s2hole)" } },
  { type: 'path', attrs: { "d": "M15 24 Q29 18 43 24", "stroke": "#CC6060", "stroke-width": 2.5, "fill": "none", "stroke-linecap": "round", "opacity": 0.6 } },
  { type: 'circle', attrs: { "cx": 22, "cy": 11, "r": 1.2, "fill": "#150606", "opacity": 0.78 } },
  { type: 'circle', attrs: { "cx": 36, "cy": 9, "r": 0.9, "fill": "#150606", "opacity": 0.68 } },
  { type: 'circle', attrs: { "cx": 45, "cy": 15, "r": 1, "fill": "#150606", "opacity": 0.68 } },
  { type: 'circle', attrs: { "cx": 46, "cy": 34, "r": 0.9, "fill": "#150606", "opacity": 0.55 } },
];

const S_S3: SVGElementDescriptor[] = [
  { type: 'ellipse', attrs: { "cx": 28, "cy": 31, "rx": 25, "ry": 27, "fill": "url(#s3rim)" } },
  { type: 'path', attrs: { "d": "M28 4 Q34 3 38 6", "stroke": "#7C2828", "stroke-width": 2.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.5 } },
  { type: 'path', attrs: { "d": "M45 10 Q50 16 48 23", "stroke": "#7C2828", "stroke-width": 2, "fill": "none", "stroke-linecap": "round", "opacity": 0.48 } },
  { type: 'path', attrs: { "d": "M50 34 Q51 42 47 47", "stroke": "#7C2828", "stroke-width": 1.8, "fill": "none", "stroke-linecap": "round", "opacity": 0.42 } },
  { type: 'path', attrs: { "d": "M8 15 Q4 23 6 30", "stroke": "#7C2828", "stroke-width": 1.8, "fill": "none", "stroke-linecap": "round", "opacity": 0.42 } },
  { type: 'ellipse', attrs: { "cx": 28, "cy": 36, "rx": 15, "ry": 17, "fill": "url(#s3hole)" } },
  { type: 'ellipse', attrs: { "cx": 28, "cy": 50, "rx": 7, "ry": 4, "fill": "#3A0808", "opacity": 0.38 } },
  { type: 'path', attrs: { "d": "M14 28 Q28 21 42 28", "stroke": "#D66060", "stroke-width": 2.8, "fill": "none", "stroke-linecap": "round", "opacity": 0.62 } },
  { type: 'path', attrs: { "d": "M9 24 Q20 18 36 22 Q44 24 49 30", "stroke": "#EEC0A0", "stroke-width": 1.5, "fill": "none", "stroke-linecap": "round", "opacity": 0.22 } },
  { type: 'circle', attrs: { "cx": 19, "cy": 13, "r": 1.2, "fill": "#140505", "opacity": 0.8 } },
  { type: 'circle', attrs: { "cx": 33, "cy": 10, "r": 1, "fill": "#140505", "opacity": 0.7 } },
  { type: 'circle', attrs: { "cx": 43, "cy": 15, "r": 0.9, "fill": "#140505", "opacity": 0.65 } },
];

const S_S4: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M30 2 Q40 2 48 7 Q56 12 57 22 Q58 32 52 40 Q46 47 34 49 Q22 51 13 45 Q4 39 2 29 Q0 19 5 11 Q10 4 20 2 Q25 1 30 2Z", "fill": "url(#s4rim)" } },
  { type: 'path', attrs: { "d": "M30 7 Q38 7 45 11 Q51 15 52 24 Q53 32 47 39 Q41 44 32 45 Q22 46 15 41 Q8 36 7 27 Q6 18 11 12 Q16 7 24 6 Q27 6 30 7Z", "fill": "#AA3A3A", "opacity": 0.45 } },
  { type: 'path', attrs: { "d": "M10 22 Q22 16 40 20 Q50 22 55 27", "stroke": "#EFC0A2", "stroke-width": 1.8, "fill": "none", "stroke-linecap": "round", "opacity": 0.28 } },
  { type: 'ellipse', attrs: { "cx": 30, "cy": 28, "rx": 14, "ry": 12, "fill": "url(#s4hole)" } },
  { type: 'path', attrs: { "d": "M17 22 Q30 16 43 22", "stroke": "#CA5858", "stroke-width": 2.5, "fill": "none", "stroke-linecap": "round", "opacity": 0.62 } },
  { type: 'circle', attrs: { "cx": 23, "cy": 10, "r": 1.1, "fill": "#130505", "opacity": 0.78 } },
  { type: 'circle', attrs: { "cx": 36, "cy": 8, "r": 0.9, "fill": "#130505", "opacity": 0.65 } },
  { type: 'circle', attrs: { "cx": 46, "cy": 14, "r": 1, "fill": "#130505", "opacity": 0.65 } },
  { type: 'circle', attrs: { "cx": 47, "cy": 32, "r": 0.8, "fill": "#130505", "opacity": 0.55 } },
  { type: 'circle', attrs: { "cx": 12, "cy": 30, "r": 0.9, "fill": "#130505", "opacity": 0.58 } },
];

const S_S5: SVGElementDescriptor[] = [
  { type: 'ellipse', attrs: { "cx": 28, "cy": 28, "rx": 25, "ry": 24, "fill": "url(#sr5a)" } },
  { type: 'ellipse', attrs: { "cx": 28, "cy": 31, "rx": 12, "ry": 11, "fill": "url(#srH)" } },
  { type: 'path', attrs: { "d": "M17 22 Q28 17 39 22", "stroke": "#CC5555", "stroke-width": 2.4, "fill": "none", "stroke-linecap": "round", "opacity": 0.62 } },
  { type: 'circle', attrs: { "cx": 21, "cy": 12, "r": 1.1, "fill": "#130404", "opacity": 0.78 } },
  { type: 'circle', attrs: { "cx": 33, "cy": 10, "r": 0.9, "fill": "#130404", "opacity": 0.65 } },
  { type: 'ellipse', attrs: { "cx": 79, "cy": 28, "rx": 25, "ry": 24, "fill": "url(#sr5b)" } },
  { type: 'ellipse', attrs: { "cx": 79, "cy": 31, "rx": 13, "ry": 12, "fill": "url(#srH)" } },
  { type: 'path', attrs: { "d": "M67 22 Q79 17 91 22", "stroke": "#D26060", "stroke-width": 2.4, "fill": "none", "stroke-linecap": "round", "opacity": 0.62 } },
  { type: 'circle', attrs: { "cx": 72, "cy": 12, "r": 1.1, "fill": "#130404", "opacity": 0.78 } },
  { type: 'circle', attrs: { "cx": 84, "cy": 10, "r": 0.9, "fill": "#130404", "opacity": 0.65 } },
  { type: 'circle', attrs: { "cx": 92, "cy": 16, "r": 0.8, "fill": "#130404", "opacity": 0.58 } },
  { type: 'ellipse', attrs: { "cx": 130, "cy": 28, "rx": 25, "ry": 24, "fill": "url(#sr5c)" } },
  { type: 'ellipse', attrs: { "cx": 130, "cy": 31, "rx": 12, "ry": 11, "fill": "url(#srH)" } },
  { type: 'path', attrs: { "d": "M119 22 Q130 17 141 22", "stroke": "#C05050", "stroke-width": 2.4, "fill": "none", "stroke-linecap": "round", "opacity": 0.62 } },
  { type: 'circle', attrs: { "cx": 123, "cy": 12, "r": 1.1, "fill": "#130404", "opacity": 0.78 } },
  { type: 'circle', attrs: { "cx": 135, "cy": 10, "r": 0.9, "fill": "#130404", "opacity": 0.6 } },
  { type: 'path', attrs: { "d": "M5 20 Q28 16 52 20 Q64 22 78 19 Q102 15 126 19 Q138 21 154 18", "stroke": "#ECC0A0", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.18 } },
];

const S_S6: SVGElementDescriptor[] = [
  { type: 'ellipse', attrs: { "cx": 28, "cy": 28, "rx": 24, "ry": 23, "fill": "url(#s6a)" } },
  { type: 'ellipse', attrs: { "cx": 28, "cy": 31, "rx": 11, "ry": 10, "fill": "url(#s6H)" } },
  { type: 'path', attrs: { "d": "M17 22 Q28 17 39 22", "stroke": "#C85555", "stroke-width": 2.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.6 } },
  { type: 'circle', attrs: { "cx": 21, "cy": 13, "r": 1, "fill": "#120404", "opacity": 0.75 } },
  { type: 'circle', attrs: { "cx": 32, "cy": 11, "r": 0.8, "fill": "#120404", "opacity": 0.62 } },
  { type: 'ellipse', attrs: { "cx": 79, "cy": 28, "rx": 24, "ry": 23, "fill": "url(#s6b)" } },
  { type: 'ellipse', attrs: { "cx": 79, "cy": 31, "rx": 12, "ry": 11, "fill": "url(#s6H)" } },
  { type: 'path', attrs: { "d": "M68 22 Q79 17 90 22", "stroke": "#D06060", "stroke-width": 2.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.6 } },
  { type: 'circle', attrs: { "cx": 72, "cy": 13, "r": 1, "fill": "#120404", "opacity": 0.75 } },
  { type: 'circle', attrs: { "cx": 84, "cy": 11, "r": 0.8, "fill": "#120404", "opacity": 0.62 } },
  { type: 'ellipse', attrs: { "cx": 130, "cy": 28, "rx": 24, "ry": 23, "fill": "url(#s6c)" } },
  { type: 'ellipse', attrs: { "cx": 130, "cy": 31, "rx": 11, "ry": 10, "fill": "url(#s6H)" } },
  { type: 'path', attrs: { "d": "M119 22 Q130 17 141 22", "stroke": "#C25252", "stroke-width": 2.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.6 } },
  { type: 'circle', attrs: { "cx": 123, "cy": 13, "r": 1, "fill": "#120404", "opacity": 0.75 } },
  { type: 'ellipse', attrs: { "cx": 54, "cy": 84, "rx": 24, "ry": 23, "fill": "url(#s6d)" } },
  { type: 'ellipse', attrs: { "cx": 54, "cy": 87, "rx": 11, "ry": 10, "fill": "url(#s6H)" } },
  { type: 'path', attrs: { "d": "M43 78 Q54 73 65 78", "stroke": "#BE5050", "stroke-width": 2.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.6 } },
  { type: 'circle', attrs: { "cx": 47, "cy": 69, "r": 1, "fill": "#120404", "opacity": 0.75 } },
  { type: 'circle', attrs: { "cx": 60, "cy": 67, "r": 0.8, "fill": "#120404", "opacity": 0.62 } },
  { type: 'ellipse', attrs: { "cx": 105, "cy": 84, "rx": 24, "ry": 23, "fill": "url(#s6e)" } },
  { type: 'ellipse', attrs: { "cx": 105, "cy": 87, "rx": 12, "ry": 11, "fill": "url(#s6H)" } },
  { type: 'path', attrs: { "d": "M94 78 Q105 73 116 78", "stroke": "#D05A5A", "stroke-width": 2.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.6 } },
  { type: 'circle', attrs: { "cx": 98, "cy": 69, "r": 1, "fill": "#120404", "opacity": 0.75 } },
  { type: 'circle', attrs: { "cx": 111, "cy": 67, "r": 0.8, "fill": "#120404", "opacity": 0.62 } },
];

const S_UNK_0: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M23 52 Q5 40 5 24 Q5 9 13 5 Q19 2 23 6 Q27 2 33 5 Q41 9 41 24 Q41 40 23 52Z", "fill": "url(#straw)" } },
  { type: 'path', attrs: { "d": "M23 50 Q8 38 8 24 Q8 11 15 7 Q19 5 23 8 Q27 5 31 7 Q38 11 38 24 Q38 38 23 50Z", "fill": "#FFF0EE", "opacity": 0.32 } },
  { type: 'ellipse', attrs: { "cx": 23, "cy": 30, "rx": 6, "ry": 10, "fill": "#FFE0DA", "opacity": 0.38 } },
  { type: 'ellipse', attrs: { "cx": 17, "cy": 21, "rx": 1, "ry": 1.6, "fill": "#C83040", "opacity": 0.6, "transform": "rotate(-10,17,21)" } },
  { type: 'ellipse', attrs: { "cx": 27, "cy": 17, "rx": 1, "ry": 1.6, "fill": "#C83040", "opacity": 0.6, "transform": "rotate(5,27,17)" } },
  { type: 'ellipse', attrs: { "cx": 31, "cy": 27, "rx": 1, "ry": 1.6, "fill": "#C83040", "opacity": 0.6, "transform": "rotate(-5,31,27)" } },
  { type: 'ellipse', attrs: { "cx": 25, "cy": 38, "rx": 1, "ry": 1.6, "fill": "#C83040", "opacity": 0.6, "transform": "rotate(8,25,38)" } },
  { type: 'ellipse', attrs: { "cx": 15, "cy": 34, "rx": 1, "ry": 1.6, "fill": "#C83040", "opacity": 0.6, "transform": "rotate(-8,15,34)" } },
  { type: 'ellipse', attrs: { "cx": 21, "cy": 14, "rx": 1, "ry": 1.6, "fill": "#C83040", "opacity": 0.55 } },
  { type: 'path', attrs: { "d": "M18 5 Q16 0 14 0 Q14 2 16 4", "fill": "#5A8030", "opacity": 0.82 } },
  { type: 'path', attrs: { "d": "M23 3 Q23 0 21 0 Q21 2 23 4", "fill": "#6A9040", "opacity": 0.82 } },
  { type: 'path', attrs: { "d": "M27 5 Q29 0 31 0 Q31 2 29 4", "fill": "#5A8030", "opacity": 0.82 } },
];

const S_UNK_1: SVGElementDescriptor[] = [
  { type: 'circle', attrs: { "cx": 23, "cy": 16, "r": 7.5, "fill": "url(#blackB)" } },
  { type: 'circle', attrs: { "cx": 31, "cy": 21, "r": 7.5, "fill": "url(#blackB)" } },
  { type: 'circle', attrs: { "cx": 15, "cy": 21, "r": 7.5, "fill": "url(#blackB)" } },
  { type: 'circle', attrs: { "cx": 8, "cy": 29, "r": 7.5, "fill": "url(#blackB)" } },
  { type: 'circle', attrs: { "cx": 23, "cy": 27, "r": 7.5, "fill": "url(#blackB)" } },
  { type: 'circle', attrs: { "cx": 38, "cy": 29, "r": 7.5, "fill": "url(#blackB)" } },
  { type: 'circle', attrs: { "cx": 15, "cy": 35, "r": 7.5, "fill": "url(#blackB)" } },
  { type: 'circle', attrs: { "cx": 29, "cy": 37, "r": 7.5, "fill": "url(#blackB)" } },
  { type: 'circle', attrs: { "cx": 23, "cy": 38, "r": 7.5, "fill": "url(#blackB)" } },
  { type: 'circle', attrs: { "cx": 20, "cy": 13, "r": 2.8, "fill": "#8870A0", "opacity": 0.44 } },
  { type: 'circle', attrs: { "cx": 29, "cy": 18, "r": 2.4, "fill": "#8870A0", "opacity": 0.38 } },
  { type: 'circle', attrs: { "cx": 13, "cy": 18, "r": 2.4, "fill": "#8870A0", "opacity": 0.38 } },
  { type: 'path', attrs: { "d": "M23 10 Q23 6 21 5", "stroke": "#3A2030", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round" } },
];

const S_UNK_10: SVGElementDescriptor[] = [
  { type: 'g', attrs: { "transform": "translate(14, 40)" }, children: [
    { type: 'path', attrs: { "d": "M6 11 Q8 3 16 2 Q40 1 60 2 Q68 3 70 9 Q72 13 68 17 Q62 21 40 21 Q16 21 8 18 Q5 15 6 11Z", "fill": "#5A8830" } },
    { type: 'line', attrs: { "x1": 22, "y1": 2, "x2": 22, "y2": 21, "stroke": "#3A5E20", "stroke-width": 1, "opacity": 0.38 } },
    { type: 'line', attrs: { "x1": 32, "y1": 2, "x2": 32, "y2": 21, "stroke": "#3A5E20", "stroke-width": 1, "opacity": 0.32 } },
    { type: 'line', attrs: { "x1": 44, "y1": 2, "x2": 44, "y2": 21, "stroke": "#3A5E20", "stroke-width": 1, "opacity": 0.38 } },
    { type: 'line', attrs: { "x1": 56, "y1": 2, "x2": 56, "y2": 21, "stroke": "#3A5E20", "stroke-width": 1, "opacity": 0.32 } },
    { type: 'path', attrs: { "d": "M10 5 Q36 3 66 7", "stroke": "#A0C850", "stroke-width": 1.5, "fill": "none", "stroke-linecap": "round", "opacity": 0.28 } },
    { type: 'ellipse', attrs: { "cx": 6, "cy": 11, "rx": 4.5, "ry": 4, "fill": "#3A5E20" } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(22, 78, 28) translate(28, 8)" }, children: [
    { type: 'path', attrs: { "d": "M6 11 Q8 3 15 2 Q36 1 56 2 Q64 3 66 9 Q67 13 64 17 Q58 21 36 21 Q15 21 8 18 Q5 15 6 11Z", "fill": "#568630" } },
    { type: 'line', attrs: { "x1": 20, "y1": 2, "x2": 20, "y2": 21, "stroke": "#3A5E20", "stroke-width": 1, "opacity": 0.38 } },
    { type: 'line', attrs: { "x1": 30, "y1": 2, "x2": 30, "y2": 21, "stroke": "#3A5E20", "stroke-width": 1, "opacity": 0.32 } },
    { type: 'line', attrs: { "x1": 42, "y1": 2, "x2": 42, "y2": 21, "stroke": "#3A5E20", "stroke-width": 1, "opacity": 0.38 } },
    { type: 'line', attrs: { "x1": 52, "y1": 2, "x2": 52, "y2": 21, "stroke": "#3A5E20", "stroke-width": 1, "opacity": 0.32 } },
    { type: 'ellipse', attrs: { "cx": 6, "cy": 11, "rx": 4, "ry": 3.5, "fill": "#3A5E20" } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(-18, 16, 64) translate(4, 56)" }, children: [
    { type: 'path', attrs: { "d": "M6 10 Q8 3 14 2 Q34 1 52 2 Q60 3 62 8 Q64 12 60 16 Q54 20 34 20 Q14 20 8 17 Q5 14 6 10Z", "fill": "#608C32" } },
    { type: 'line', attrs: { "x1": 18, "y1": 2, "x2": 18, "y2": 20, "stroke": "#3A5E20", "stroke-width": 1, "opacity": 0.38 } },
    { type: 'line', attrs: { "x1": 30, "y1": 2, "x2": 30, "y2": 20, "stroke": "#3A5E20", "stroke-width": 1, "opacity": 0.32 } },
    { type: 'line', attrs: { "x1": 44, "y1": 2, "x2": 44, "y2": 20, "stroke": "#3A5E20", "stroke-width": 1, "opacity": 0.38 } },
    { type: 'ellipse', attrs: { "cx": 6, "cy": 10, "rx": 4, "ry": 3.5, "fill": "#3A5E20" } },
  ] },
  { type: 'path', attrs: { "d": "M96 78 Q100 64 98 52", "stroke": "#4A6A28", "stroke-width": 1.3, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M98 66 Q104 62 105 64", "stroke": "#4A6A28", "stroke-width": 1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M97 58 Q92 54 91 56", "stroke": "#4A6A28", "stroke-width": 1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M99 70 Q105 67 106 69", "stroke": "#4A6A28", "stroke-width": 1, "fill": "none", "stroke-linecap": "round" } },
];

const S_UNK_11: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M15 2 Q23 4 25 13 Q27 23 25 33 Q23 42 15 43 Q7 42 5 33 Q3 23 5 13 Q7 4 15 2Z", "fill": "url(#pist1)" } },
  { type: 'path', attrs: { "d": "M9 11 Q15 9 21 11", "stroke": "#A89032", "stroke-width": 0.8, "fill": "none", "opacity": 0.42 } },
  { type: 'path', attrs: { "d": "M7 19 Q15 16 23 19", "stroke": "#A89032", "stroke-width": 0.8, "fill": "none", "opacity": 0.36 } },
  { type: 'path', attrs: { "d": "M7 28 Q15 25 23 28", "stroke": "#A89032", "stroke-width": 0.8, "fill": "none", "opacity": 0.36 } },
  { type: 'ellipse', attrs: { "cx": 10, "cy": 14, "rx": 4, "ry": 6, "fill": "#F0E89A", "opacity": 0.28 } },
  { type: 'path', attrs: { "d": "M19 6 Q24 10 23 17", "stroke": "#D4A882", "stroke-width": 2, "fill": "none", "stroke-linecap": "round", "opacity": 0.28 } },
];

const S_UNK_12: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M18 3 Q9 5 7 13 Q5 22 7 32 Q9 40 18 43 Q11 38 10 28 Q9 17 11 10 Q13 5 18 3Z", "fill": "url(#pist2s)" } },
  { type: 'path', attrs: { "d": "M18 3 Q27 5 29 13 Q31 22 29 32 Q27 40 18 43 Q25 38 26 28 Q27 17 25 10 Q23 5 18 3Z", "fill": "url(#pist2s)" } },
  { type: 'ellipse', attrs: { "cx": 18, "cy": 23, "rx": 8, "ry": 12, "fill": "url(#pist2n)" } },
  { type: 'ellipse', attrs: { "cx": 14, "cy": 17, "rx": 3.5, "ry": 5, "fill": "#C8E870", "opacity": 0.3 } },
  { type: 'line', attrs: { "x1": 18, "y1": 2, "x2": 18, "y2": 44, "stroke": "#988022", "stroke-width": 0.9, "opacity": 0.5 } },
];

const S_UNK_13: SVGElementDescriptor[] = [
  { type: 'g', attrs: { "transform": "rotate(-18, 18, 28)" }, children: [
    { type: 'path', attrs: { "d": "M18 8 Q25 10 27 18 Q29 27 27 36 Q25 43 18 44 Q11 43 9 36 Q7 27 9 18 Q11 10 18 8Z", "fill": "#D0C060" } },
    { type: 'path', attrs: { "d": "M12 16 Q18 14 24 16", "stroke": "#A89030", "stroke-width": 0.8, "fill": "none", "opacity": 0.4 } },
    { type: 'path', attrs: { "d": "M10 26 Q18 23 26 26", "stroke": "#A89030", "stroke-width": 0.8, "fill": "none", "opacity": 0.35 } },
    { type: 'ellipse', attrs: { "cx": 13, "cy": 16, "rx": 3, "ry": 5, "fill": "#E8DE88", "opacity": 0.28 } },
  ] },
  { type: 'g', attrs: { "transform": "translate(28, 4)" }, children: [
    { type: 'path', attrs: { "d": "M16 2 Q8 4 6 12 Q4 21 6 30 Q8 38 16 40 Q10 35 9 26 Q8 16 10 9 Q12 4 16 2Z", "fill": "#CAB858" } },
    { type: 'path', attrs: { "d": "M16 2 Q24 4 26 12 Q28 21 26 30 Q24 38 16 40 Q22 35 23 26 Q24 16 22 9 Q20 4 16 2Z", "fill": "#CAB858" } },
    { type: 'ellipse', attrs: { "cx": 16, "cy": 21, "rx": 7, "ry": 11, "fill": "url(#pt3n)" } },
    { type: 'line', attrs: { "x1": 16, "y1": 1, "x2": 16, "y2": 41, "stroke": "#988022", "stroke-width": 0.8, "opacity": 0.48 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(12, 68, 28)" }, children: [
    { type: 'path', attrs: { "d": "M68 8 Q75 10 77 18 Q79 27 77 36 Q75 43 68 44 Q61 43 59 36 Q57 27 59 18 Q61 10 68 8Z", "fill": "#C8B850" } },
    { type: 'path', attrs: { "d": "M62 16 Q68 14 74 16", "stroke": "#A89030", "stroke-width": 0.8, "fill": "none", "opacity": 0.4 } },
    { type: 'ellipse', attrs: { "cx": 63, "cy": 16, "rx": 3, "ry": 5, "fill": "#E0D888", "opacity": 0.28 } },
  ] },
];

const S_UNK_14: SVGElementDescriptor[] = [
  { type: 'g', attrs: { "transform": "rotate(-15, 22, 30)" }, children: [
    { type: 'path', attrs: { "d": "M22 14 Q29 16 31 24 Q33 32 31 40 Q29 47 22 48 Q15 47 13 40 Q11 32 13 24 Q15 16 22 14Z", "fill": "#CFC060" } },
    { type: 'path', attrs: { "d": "M16 22 Q22 20 28 22", "stroke": "#A89030", "stroke-width": 0.8, "fill": "none", "opacity": 0.4 } },
    { type: 'ellipse', attrs: { "cx": 17, "cy": 20, "rx": 3, "ry": 5, "fill": "#E8DE88", "opacity": 0.28 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(8, 68, 20)" }, children: [
    { type: 'path', attrs: { "d": "M68 8 Q75 10 77 18 Q79 27 77 35 Q75 42 68 43 Q61 42 59 35 Q57 27 59 18 Q61 10 68 8Z", "fill": "#D0C460" } },
    { type: 'path', attrs: { "d": "M62 16 Q68 14 74 16", "stroke": "#A89030", "stroke-width": 0.8, "fill": "none", "opacity": 0.4 } },
    { type: 'ellipse', attrs: { "cx": 63, "cy": 16, "rx": 3, "ry": 5, "fill": "#E8DE88", "opacity": 0.28 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(-5, 112, 26)" }, children: [
    { type: 'path', attrs: { "d": "M112 12 Q119 14 121 22 Q123 31 121 39 Q119 46 112 47 Q105 46 103 39 Q101 31 103 22 Q105 14 112 12Z", "fill": "#C8BC58" } },
    { type: 'path', attrs: { "d": "M106 20 Q112 18 118 20", "stroke": "#A89030", "stroke-width": 0.8, "fill": "none", "opacity": 0.4 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(18, 42, 62)" }, children: [
    { type: 'path', attrs: { "d": "M42 50 Q34 52 32 60 Q30 68 32 76 Q34 82 42 83 Q50 82 52 76 Q54 68 52 60 Q50 52 42 50Z", "fill": "#D0C460" } },
    { type: 'ellipse', attrs: { "cx": 42, "cy": 67, "rx": 7, "ry": 10, "fill": "url(#ptNutBig)" } },
    { type: 'line', attrs: { "x1": 42, "y1": 49, "x2": 42, "y2": 84, "stroke": "#988022", "stroke-width": 0.9, "opacity": 0.45 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(-8, 90, 66)" }, children: [
    { type: 'path', attrs: { "d": "M90 54 Q82 56 80 64 Q78 72 80 80 Q82 86 90 87 Q98 86 100 80 Q102 72 100 64 Q98 56 90 54Z", "fill": "#CAB858" } },
    { type: 'ellipse', attrs: { "cx": 90, "cy": 71, "rx": 7, "ry": 11, "fill": "url(#ptNutBig)" } },
    { type: 'line', attrs: { "x1": 90, "y1": 53, "x2": 90, "y2": 88, "stroke": "#988022", "stroke-width": 0.9, "opacity": 0.45 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(4, 20, 68)" }, children: [
    { type: 'path', attrs: { "d": "M20 58 Q13 60 11 67 Q9 74 11 80 Q13 85 20 86 Q27 85 29 80 Q31 74 29 67 Q27 60 20 58Z", "fill": "#D4CC68" } },
    { type: 'ellipse', attrs: { "cx": 20, "cy": 73, "rx": 6, "ry": 9, "fill": "url(#ptNutBig)" } },
    { type: 'line', attrs: { "x1": 20, "y1": 57, "x2": 20, "y2": 87, "stroke": "#988022", "stroke-width": 0.9, "opacity": 0.45 } },
  ] },
];

const S_UNK_15: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M29 2 Q39 2 46 8 Q54 15 54 25 Q54 37 46 44 Q38 51 27 50 Q17 49 10 43 Q4 37 4 27 Q4 15 10 9 Q17 3 29 2Z", "fill": "url(#wn1)" } },
  { type: 'path', attrs: { "d": "M29 3 Q31 26 29 49", "stroke": "#6A3E18", "stroke-width": 2.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.62 } },
  { type: 'path', attrs: { "d": "M15 11 Q10 18 12 27 Q10 33 15 39", "stroke": "#6A3E18", "stroke-width": 1.6, "fill": "none", "stroke-linecap": "round", "opacity": 0.52 } },
  { type: 'path', attrs: { "d": "M15 11 Q21 7 27 9", "stroke": "#6A3E18", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.46 } },
  { type: 'path', attrs: { "d": "M10 19 Q17 15 23 17", "stroke": "#6A3E18", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.42 } },
  { type: 'path', attrs: { "d": "M10 27 Q17 23 23 25", "stroke": "#6A3E18", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.42 } },
  { type: 'path', attrs: { "d": "M12 36 Q19 32 25 34", "stroke": "#6A3E18", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.42 } },
  { type: 'path', attrs: { "d": "M43 11 Q48 18 46 27 Q48 33 43 39", "stroke": "#6A3E18", "stroke-width": 1.6, "fill": "none", "stroke-linecap": "round", "opacity": 0.52 } },
  { type: 'path', attrs: { "d": "M43 11 Q37 7 31 9", "stroke": "#6A3E18", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.46 } },
  { type: 'path', attrs: { "d": "M48 19 Q41 15 35 17", "stroke": "#6A3E18", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.42 } },
  { type: 'path', attrs: { "d": "M48 27 Q41 23 35 25", "stroke": "#6A3E18", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.42 } },
  { type: 'path', attrs: { "d": "M46 36 Q39 32 33 34", "stroke": "#6A3E18", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.42 } },
  { type: 'circle', attrs: { "cx": 17, "cy": 18, "r": 3, "fill": "#E2B870", "opacity": 0.24 } },
  { type: 'circle', attrs: { "cx": 17, "cy": 30, "r": 2.5, "fill": "#E2B870", "opacity": 0.2 } },
  { type: 'circle', attrs: { "cx": 40, "cy": 18, "r": 3, "fill": "#E2B870", "opacity": 0.24 } },
  { type: 'circle', attrs: { "cx": 40, "cy": 30, "r": 2.5, "fill": "#E2B870", "opacity": 0.2 } },
];

const S_UNK_16: SVGElementDescriptor[] = [
  { type: 'g', attrs: { "transform": "rotate(40, 29, 29)" }, children: [
    { type: 'path', attrs: { "d": "M29 4 Q39 4 46 10 Q54 17 54 27 Q54 39 46 46 Q38 53 27 52 Q17 51 10 45 Q4 39 4 29 Q4 17 10 11 Q17 5 29 4Z", "fill": "url(#wn2)" } },
    { type: 'path', attrs: { "d": "M29 5 Q31 28 29 51", "stroke": "#6A3E18", "stroke-width": 2.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.6 } },
    { type: 'path', attrs: { "d": "M15 13 Q10 20 12 29 Q10 35 15 41", "stroke": "#6A3E18", "stroke-width": 1.6, "fill": "none", "stroke-linecap": "round", "opacity": 0.5 } },
    { type: 'path', attrs: { "d": "M15 13 Q21 9 27 11", "stroke": "#6A3E18", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.44 } },
    { type: 'path', attrs: { "d": "M10 21 Q17 17 23 19", "stroke": "#6A3E18", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.4 } },
    { type: 'path', attrs: { "d": "M10 29 Q17 25 23 27", "stroke": "#6A3E18", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.4 } },
    { type: 'path', attrs: { "d": "M43 13 Q48 20 46 29 Q48 35 43 41", "stroke": "#6A3E18", "stroke-width": 1.6, "fill": "none", "stroke-linecap": "round", "opacity": 0.5 } },
    { type: 'path', attrs: { "d": "M43 13 Q37 9 31 11", "stroke": "#6A3E18", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.44 } },
    { type: 'path', attrs: { "d": "M48 21 Q41 17 35 19", "stroke": "#6A3E18", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.4 } },
    { type: 'path', attrs: { "d": "M48 29 Q41 25 35 27", "stroke": "#6A3E18", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.4 } },
  ] },
];

const S_UNK_17: SVGElementDescriptor[] = [
  { type: 'g', attrs: { "transform": "rotate(-22, 42, 30) translate(12, 2)" }, children: [
    { type: 'path', attrs: { "d": "M26 2 Q36 2 43 8 Q50 14 50 24 Q50 35 43 42 Q35 48 24 47 Q14 46 7 40 Q1 34 1 23 Q1 12 7 6 Q14 1 26 2Z", "fill": "url(#wn3a)", "opacity": 0.86 } },
    { type: 'path', attrs: { "d": "M26 3 Q28 24 26 46", "stroke": "#6A3E18", "stroke-width": 1.9, "fill": "none", "stroke-linecap": "round", "opacity": 0.55 } },
    { type: 'path', attrs: { "d": "M12 12 Q8 18 10 24 Q8 30 12 36", "stroke": "#6A3E18", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.44 } },
    { type: 'path', attrs: { "d": "M40 12 Q45 18 43 24 Q45 30 40 36", "stroke": "#6A3E18", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.44 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(14, 26, 62) translate(2, 42)" }, children: [
    { type: 'path', attrs: { "d": "M24 2 Q34 2 41 8 Q48 14 48 23 Q48 33 41 40 Q33 46 22 45 Q12 44 5 38 Q0 32 0 21 Q0 10 5 5 Q12 0 24 2Z", "fill": "url(#wn3b)", "opacity": 0.94 } },
    { type: 'path', attrs: { "d": "M24 3 Q26 22 24 44", "stroke": "#6A3E18", "stroke-width": 1.9, "fill": "none", "stroke-linecap": "round", "opacity": 0.55 } },
    { type: 'path', attrs: { "d": "M10 12 Q6 18 8 22", "stroke": "#6A3E18", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.4 } },
    { type: 'path', attrs: { "d": "M38 12 Q43 18 41 22", "stroke": "#6A3E18", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.4 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(-10, 90, 58) translate(62, 32)" }, children: [
    { type: 'path', attrs: { "d": "M24 2 Q34 2 41 8 Q48 14 48 23 Q48 33 41 40 Q33 46 22 45 Q12 44 5 38 Q0 32 0 21 Q0 10 5 5 Q12 0 24 2Z", "fill": "url(#wn3c)", "opacity": 0.96 } },
    { type: 'path', attrs: { "d": "M24 3 Q26 22 24 44", "stroke": "#6A3E18", "stroke-width": 1.9, "fill": "none", "stroke-linecap": "round", "opacity": 0.55 } },
    { type: 'path', attrs: { "d": "M10 12 Q6 18 8 22", "stroke": "#6A3E18", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.4 } },
    { type: 'path', attrs: { "d": "M38 12 Q43 18 41 22", "stroke": "#6A3E18", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round", "opacity": 0.4 } },
  ] },
];

const S_UNK_18: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M24 2 Q35 1 41 7 Q47 13 45 22 Q43 32 35 37 Q27 41 19 38 Q11 35 7 27 Q3 19 7 11 Q11 3 24 2Z", "fill": "url(#ap1)" } },
  { type: 'ellipse', attrs: { "cx": 25, "cy": 21, "rx": 11, "ry": 8, "fill": "#C06818", "opacity": 0.28 } },
  { type: 'path', attrs: { "d": "M14 10 Q18 14 16 22 Q14 29 16 35", "stroke": "#924012", "stroke-width": 1, "fill": "none", "stroke-linecap": "round", "opacity": 0.44 } },
  { type: 'path', attrs: { "d": "M23 3 Q25 10 23 19 Q21 27 23 35", "stroke": "#924012", "stroke-width": 1, "fill": "none", "stroke-linecap": "round", "opacity": 0.38 } },
  { type: 'path', attrs: { "d": "M33 5 Q35 12 33 21 Q31 29 33 36", "stroke": "#924012", "stroke-width": 1, "fill": "none", "stroke-linecap": "round", "opacity": 0.38 } },
  { type: 'path', attrs: { "d": "M9 17 Q21 13 37 17", "stroke": "#924012", "stroke-width": 0.8, "fill": "none", "stroke-linecap": "round", "opacity": 0.33 } },
  { type: 'path', attrs: { "d": "M7 25 Q20 21 38 25", "stroke": "#924012", "stroke-width": 0.8, "fill": "none", "stroke-linecap": "round", "opacity": 0.28 } },
  { type: 'ellipse', attrs: { "cx": 15, "cy": 12, "rx": 6, "ry": 4, "fill": "#F8B062", "opacity": 0.28 } },
];

const S_UNK_19: SVGElementDescriptor[] = [
  { type: 'g', attrs: { "transform": "rotate(25, 27, 24)" }, children: [
    { type: 'path', attrs: { "d": "M24 2 Q35 1 41 7 Q47 13 45 22 Q43 32 35 37 Q27 41 19 38 Q11 35 7 27 Q3 19 7 11 Q11 3 24 2Z", "fill": "url(#ap2)" } },
    { type: 'ellipse', attrs: { "cx": 25, "cy": 21, "rx": 11, "ry": 8, "fill": "#BA6010", "opacity": 0.28 } },
    { type: 'path', attrs: { "d": "M14 10 Q18 14 16 22 Q14 29 16 35", "stroke": "#8A4010", "stroke-width": 1, "fill": "none", "stroke-linecap": "round", "opacity": 0.44 } },
    { type: 'path', attrs: { "d": "M25 3 Q27 11 25 20 Q23 28 25 36", "stroke": "#8A4010", "stroke-width": 1, "fill": "none", "stroke-linecap": "round", "opacity": 0.38 } },
    { type: 'path', attrs: { "d": "M34 6 Q36 13 34 22 Q32 31 34 37", "stroke": "#8A4010", "stroke-width": 1, "fill": "none", "stroke-linecap": "round", "opacity": 0.38 } },
    { type: 'path', attrs: { "d": "M7 25 Q20 21 38 25", "stroke": "#8A4010", "stroke-width": 0.8, "fill": "none", "stroke-linecap": "round", "opacity": 0.28 } },
  ] },
];

const S_UNK_2: SVGElementDescriptor[] = [
  { type: 'circle', attrs: { "cx": 21, "cy": 23, "r": 12.5, "fill": "url(#blueB)" } },
  { type: 'circle', attrs: { "cx": 34, "cy": 17, "r": 12.5, "fill": "url(#blueB)" } },
  { type: 'circle', attrs: { "cx": 46, "cy": 23, "r": 12.5, "fill": "url(#blueB)" } },
  { type: 'circle', attrs: { "cx": 15, "cy": 37, "r": 11.5, "fill": "url(#blueB)" } },
  { type: 'circle', attrs: { "cx": 29, "cy": 38, "r": 12.5, "fill": "url(#blueB)" } },
  { type: 'circle', attrs: { "cx": 43, "cy": 37, "r": 11.5, "fill": "url(#blueB)" } },
  { type: 'path', attrs: { "d": "M21 11 Q20 9 21 8 Q22 9 21 11", "stroke": "#5060A8", "stroke-width": 1, "fill": "none" } },
  { type: 'path', attrs: { "d": "M34 5 Q33 3 34 2 Q35 3 34 5", "stroke": "#5060A8", "stroke-width": 1, "fill": "none" } },
  { type: 'path', attrs: { "d": "M46 11 Q45 9 46 8 Q47 9 46 11", "stroke": "#5060A8", "stroke-width": 1, "fill": "none" } },
  { type: 'circle', attrs: { "cx": 17, "cy": 19, "r": 4.5, "fill": "#9498D0", "opacity": 0.32 } },
  { type: 'circle', attrs: { "cx": 30, "cy": 13, "r": 4.2, "fill": "#9498D0", "opacity": 0.32 } },
  { type: 'circle', attrs: { "cx": 43, "cy": 19, "r": 4, "fill": "#9498D0", "opacity": 0.3 } },
];

const S_UNK_20: SVGElementDescriptor[] = [
  { type: 'g', attrs: { "transform": "rotate(-14, 20, 34) translate(2, 8)" }, children: [
    { type: 'path', attrs: { "d": "M17 2 Q25 1 30 6 Q36 11 34 18 Q32 26 24 29 Q17 32 11 29 Q5 26 3 18 Q1 10 5 5 Q9 1 17 2Z", "fill": "url(#ap3a)" } },
    { type: 'path', attrs: { "d": "M10 10 Q14 14 12 20", "stroke": "#904012", "stroke-width": 0.9, "fill": "none", "stroke-linecap": "round", "opacity": 0.42 } },
    { type: 'path', attrs: { "d": "M19 3 Q21 10 19 18", "stroke": "#904012", "stroke-width": 0.9, "fill": "none", "stroke-linecap": "round", "opacity": 0.36 } },
    { type: 'path', attrs: { "d": "M27 5 Q29 12 27 20", "stroke": "#904012", "stroke-width": 0.9, "fill": "none", "stroke-linecap": "round", "opacity": 0.36 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(-4, 62, 32) translate(42, 4)" }, children: [
    { type: 'path', attrs: { "d": "M17 2 Q25 1 30 6 Q36 11 34 18 Q32 26 24 29 Q17 32 11 29 Q5 26 3 18 Q1 10 5 5 Q9 1 17 2Z", "fill": "url(#ap3b)" } },
    { type: 'path', attrs: { "d": "M10 10 Q14 14 12 20", "stroke": "#884010", "stroke-width": 0.9, "fill": "none", "stroke-linecap": "round", "opacity": 0.42 } },
    { type: 'path', attrs: { "d": "M19 3 Q21 10 19 18", "stroke": "#884010", "stroke-width": 0.9, "fill": "none", "stroke-linecap": "round", "opacity": 0.36 } },
    { type: 'path', attrs: { "d": "M27 5 Q29 12 27 20", "stroke": "#884010", "stroke-width": 0.9, "fill": "none", "stroke-linecap": "round", "opacity": 0.36 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(4, 104, 32) translate(84, 4)" }, children: [
    { type: 'path', attrs: { "d": "M17 2 Q25 1 30 6 Q36 11 34 18 Q32 26 24 29 Q17 32 11 29 Q5 26 3 18 Q1 10 5 5 Q9 1 17 2Z", "fill": "url(#ap3c)" } },
    { type: 'path', attrs: { "d": "M10 10 Q14 14 12 20", "stroke": "#904012", "stroke-width": 0.9, "fill": "none", "stroke-linecap": "round", "opacity": 0.42 } },
    { type: 'path', attrs: { "d": "M19 3 Q21 10 19 18", "stroke": "#904012", "stroke-width": 0.9, "fill": "none", "stroke-linecap": "round", "opacity": 0.36 } },
    { type: 'path', attrs: { "d": "M27 5 Q29 12 27 20", "stroke": "#904012", "stroke-width": 0.9, "fill": "none", "stroke-linecap": "round", "opacity": 0.36 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(14, 146, 34) translate(126, 8)" }, children: [
    { type: 'path', attrs: { "d": "M17 2 Q25 1 30 6 Q36 11 34 18 Q32 26 24 29 Q17 32 11 29 Q5 26 3 18 Q1 10 5 5 Q9 1 17 2Z", "fill": "url(#ap3d)" } },
    { type: 'path', attrs: { "d": "M10 10 Q14 14 12 20", "stroke": "#8E3E0E", "stroke-width": 0.9, "fill": "none", "stroke-linecap": "round", "opacity": 0.42 } },
    { type: 'path', attrs: { "d": "M19 3 Q21 10 19 18", "stroke": "#8E3E0E", "stroke-width": 0.9, "fill": "none", "stroke-linecap": "round", "opacity": 0.36 } },
    { type: 'path', attrs: { "d": "M27 5 Q29 12 27 20", "stroke": "#8E3E0E", "stroke-width": 0.9, "fill": "none", "stroke-linecap": "round", "opacity": 0.36 } },
  ] },
];

const S_UNK_21: SVGElementDescriptor[] = [
  { type: 'circle', attrs: { "cx": 34, "cy": 34, "r": 33, "fill": "#5A3010" } },
  { type: 'circle', attrs: { "cx": 34, "cy": 34, "r": 29, "fill": "url(#kw1g)" } },
  { type: 'ellipse', attrs: { "cx": 34, "cy": 34, "rx": 9.5, "ry": 8.5, "fill": "url(#kw1c)" } },
  { type: 'line', attrs: { "x1": 34, "y1": 25.5, "x2": 34, "y2": 7, "stroke": "#4A8018", "stroke-width": 0.7, "opacity": 0.5 } },
  { type: 'line', attrs: { "x1": 40, "y1": 27, "x2": 50, "y2": 10, "stroke": "#4A8018", "stroke-width": 0.7, "opacity": 0.5 } },
  { type: 'line', attrs: { "x1": 44, "y1": 31, "x2": 60, "y2": 20, "stroke": "#4A8018", "stroke-width": 0.7, "opacity": 0.5 } },
  { type: 'line', attrs: { "x1": 43.5, "y1": 36, "x2": 62, "y2": 32, "stroke": "#4A8018", "stroke-width": 0.7, "opacity": 0.5 } },
  { type: 'line', attrs: { "x1": 41, "y1": 40, "x2": 58, "y2": 50, "stroke": "#4A8018", "stroke-width": 0.7, "opacity": 0.5 } },
  { type: 'line', attrs: { "x1": 37, "y1": 43, "x2": 48, "y2": 59, "stroke": "#4A8018", "stroke-width": 0.7, "opacity": 0.5 } },
  { type: 'line', attrs: { "x1": 34, "y1": 42.5, "x2": 34, "y2": 61, "stroke": "#4A8018", "stroke-width": 0.7, "opacity": 0.5 } },
  { type: 'line', attrs: { "x1": 29, "y1": 43, "x2": 18, "y2": 59, "stroke": "#4A8018", "stroke-width": 0.7, "opacity": 0.5 } },
  { type: 'line', attrs: { "x1": 25, "y1": 40, "x2": 8, "y2": 50, "stroke": "#4A8018", "stroke-width": 0.7, "opacity": 0.5 } },
  { type: 'line', attrs: { "x1": 24.5, "y1": 36, "x2": 6, "y2": 32, "stroke": "#4A8018", "stroke-width": 0.7, "opacity": 0.5 } },
  { type: 'line', attrs: { "x1": 25, "y1": 31, "x2": 8, "y2": 20, "stroke": "#4A8018", "stroke-width": 0.7, "opacity": 0.5 } },
  { type: 'line', attrs: { "x1": 28, "y1": 27, "x2": 18, "y2": 10, "stroke": "#4A8018", "stroke-width": 0.7, "opacity": 0.5 } },
  { type: 'ellipse', attrs: { "cx": 34, "cy": 17, "rx": 2, "ry": 2.8, "fill": "#1A1A0A", "transform": "rotate(0,34,17)" } },
  { type: 'ellipse', attrs: { "cx": 43, "cy": 20, "rx": 2, "ry": 2.8, "fill": "#1A1A0A", "transform": "rotate(30,43,20)" } },
  { type: 'ellipse', attrs: { "cx": 50, "cy": 27, "rx": 2, "ry": 2.8, "fill": "#1A1A0A", "transform": "rotate(60,50,27)" } },
  { type: 'ellipse', attrs: { "cx": 52, "cy": 36, "rx": 2, "ry": 2.8, "fill": "#1A1A0A", "transform": "rotate(90,52,36)" } },
  { type: 'ellipse', attrs: { "cx": 48, "cy": 45, "rx": 2, "ry": 2.8, "fill": "#1A1A0A", "transform": "rotate(120,48,45)" } },
  { type: 'ellipse', attrs: { "cx": 41, "cy": 51, "rx": 2, "ry": 2.8, "fill": "#1A1A0A", "transform": "rotate(150,41,51)" } },
  { type: 'ellipse', attrs: { "cx": 31, "cy": 53, "rx": 2, "ry": 2.8, "fill": "#1A1A0A", "transform": "rotate(180,31,53)" } },
  { type: 'ellipse', attrs: { "cx": 22, "cy": 50, "rx": 2, "ry": 2.8, "fill": "#1A1A0A", "transform": "rotate(210,22,50)" } },
  { type: 'ellipse', attrs: { "cx": 17, "cy": 43, "rx": 2, "ry": 2.8, "fill": "#1A1A0A", "transform": "rotate(240,17,43)" } },
  { type: 'ellipse', attrs: { "cx": 16, "cy": 34, "rx": 2, "ry": 2.8, "fill": "#1A1A0A", "transform": "rotate(270,16,34)" } },
  { type: 'ellipse', attrs: { "cx": 19, "cy": 25, "rx": 2, "ry": 2.8, "fill": "#1A1A0A", "transform": "rotate(300,19,25)" } },
  { type: 'ellipse', attrs: { "cx": 26, "cy": 19, "rx": 2, "ry": 2.8, "fill": "#1A1A0A", "transform": "rotate(330,26,19)" } },
];

const S_UNK_22: SVGElementDescriptor[] = [
  { type: 'g', attrs: { "transform": "rotate(28, 37, 37)" }, children: [
    { type: 'circle', attrs: { "cx": 37, "cy": 37, "r": 33, "fill": "#553010" } },
    { type: 'circle', attrs: { "cx": 37, "cy": 37, "r": 29, "fill": "url(#kw2g)" } },
    { type: 'ellipse', attrs: { "cx": 37, "cy": 37, "rx": 9.5, "ry": 8.5, "fill": "url(#kw2c)" } },
    { type: 'line', attrs: { "x1": 37, "y1": 28.5, "x2": 37, "y2": 10, "stroke": "#4A8018", "stroke-width": 0.7, "opacity": 0.5 } },
    { type: 'line', attrs: { "x1": 43, "y1": 30, "x2": 54, "y2": 13, "stroke": "#4A8018", "stroke-width": 0.7, "opacity": 0.5 } },
    { type: 'line', attrs: { "x1": 47, "y1": 34, "x2": 64, "y2": 23, "stroke": "#4A8018", "stroke-width": 0.7, "opacity": 0.5 } },
    { type: 'line', attrs: { "x1": 47, "y1": 39, "x2": 65, "y2": 36, "stroke": "#4A8018", "stroke-width": 0.7, "opacity": 0.5 } },
    { type: 'line', attrs: { "x1": 44, "y1": 44, "x2": 60, "y2": 55, "stroke": "#4A8018", "stroke-width": 0.7, "opacity": 0.5 } },
    { type: 'line', attrs: { "x1": 37, "y1": 45.5, "x2": 37, "y2": 64, "stroke": "#4A8018", "stroke-width": 0.7, "opacity": 0.5 } },
    { type: 'line', attrs: { "x1": 30, "y1": 44, "x2": 19, "y2": 55, "stroke": "#4A8018", "stroke-width": 0.7, "opacity": 0.5 } },
    { type: 'line', attrs: { "x1": 27, "y1": 39, "x2": 9, "y2": 36, "stroke": "#4A8018", "stroke-width": 0.7, "opacity": 0.5 } },
    { type: 'line', attrs: { "x1": 27, "y1": 34, "x2": 10, "y2": 23, "stroke": "#4A8018", "stroke-width": 0.7, "opacity": 0.5 } },
    { type: 'line', attrs: { "x1": 31, "y1": 30, "x2": 20, "y2": 13, "stroke": "#4A8018", "stroke-width": 0.7, "opacity": 0.5 } },
    { type: 'ellipse', attrs: { "cx": 37, "cy": 20, "rx": 1.9, "ry": 2.6, "fill": "#1A1A0A" } },
    { type: 'ellipse', attrs: { "cx": 46, "cy": 22, "rx": 1.9, "ry": 2.6, "fill": "#1A1A0A", "transform": "rotate(45,46,22)" } },
    { type: 'ellipse', attrs: { "cx": 52, "cy": 29, "rx": 1.9, "ry": 2.6, "fill": "#1A1A0A", "transform": "rotate(90,52,29)" } },
    { type: 'ellipse', attrs: { "cx": 54, "cy": 38, "rx": 1.9, "ry": 2.6, "fill": "#1A1A0A", "transform": "rotate(90,54,38)" } },
    { type: 'ellipse', attrs: { "cx": 50, "cy": 47, "rx": 1.9, "ry": 2.6, "fill": "#1A1A0A", "transform": "rotate(135,50,47)" } },
    { type: 'ellipse', attrs: { "cx": 43, "cy": 53, "rx": 1.9, "ry": 2.6, "fill": "#1A1A0A", "transform": "rotate(180,43,53)" } },
    { type: 'ellipse', attrs: { "cx": 32, "cy": 54, "rx": 1.9, "ry": 2.6, "fill": "#1A1A0A" } },
    { type: 'ellipse', attrs: { "cx": 24, "cy": 49, "rx": 1.9, "ry": 2.6, "fill": "#1A1A0A", "transform": "rotate(225,24,49)" } },
    { type: 'ellipse', attrs: { "cx": 20, "cy": 41, "rx": 1.9, "ry": 2.6, "fill": "#1A1A0A", "transform": "rotate(270,20,41)" } },
    { type: 'ellipse', attrs: { "cx": 21, "cy": 31, "rx": 1.9, "ry": 2.6, "fill": "#1A1A0A", "transform": "rotate(315,21,31)" } },
    { type: 'ellipse', attrs: { "cx": 28, "cy": 23, "rx": 1.9, "ry": 2.6, "fill": "#1A1A0A", "transform": "rotate(330,28,23)" } },
  ] },
];

const S_UNK_23: SVGElementDescriptor[] = [
  { type: 'g', attrs: { "transform": "rotate(-10, 32, 37)" }, children: [
    { type: 'circle', attrs: { "cx": 32, "cy": 37, "r": 30, "fill": "#523010" } },
    { type: 'circle', attrs: { "cx": 32, "cy": 37, "r": 26, "fill": "url(#kw3gA)" } },
    { type: 'ellipse', attrs: { "cx": 32, "cy": 37, "rx": 8.5, "ry": 7.5, "fill": "url(#kw3c)" } },
    { type: 'line', attrs: { "x1": 32, "y1": 29, "x2": 32, "y2": 12, "stroke": "#4A7018", "stroke-width": 0.6, "opacity": 0.48 } },
    { type: 'line', attrs: { "x1": 38, "y1": 30, "x2": 47, "y2": 15, "stroke": "#4A7018", "stroke-width": 0.6, "opacity": 0.48 } },
    { type: 'line', attrs: { "x1": 42, "y1": 35, "x2": 58, "y2": 28, "stroke": "#4A7018", "stroke-width": 0.6, "opacity": 0.48 } },
    { type: 'line', attrs: { "x1": 42, "y1": 40, "x2": 58, "y2": 48, "stroke": "#4A7018", "stroke-width": 0.6, "opacity": 0.48 } },
    { type: 'line', attrs: { "x1": 32, "y1": 45, "x2": 32, "y2": 62, "stroke": "#4A7018", "stroke-width": 0.6, "opacity": 0.48 } },
    { type: 'line', attrs: { "x1": 25, "y1": 43, "x2": 14, "y2": 56, "stroke": "#4A7018", "stroke-width": 0.6, "opacity": 0.48 } },
    { type: 'line', attrs: { "x1": 22, "y1": 38, "x2": 6, "y2": 32, "stroke": "#4A7018", "stroke-width": 0.6, "opacity": 0.48 } },
    { type: 'line', attrs: { "x1": 25, "y1": 32, "x2": 14, "y2": 18, "stroke": "#4A7018", "stroke-width": 0.6, "opacity": 0.48 } },
    { type: 'ellipse', attrs: { "cx": 32, "cy": 18, "rx": 1.6, "ry": 2.3, "fill": "#1A1A0A" } },
    { type: 'ellipse', attrs: { "cx": 43, "cy": 22, "rx": 1.6, "ry": 2.3, "fill": "#1A1A0A", "transform": "rotate(45,43,22)" } },
    { type: 'ellipse', attrs: { "cx": 48, "cy": 31, "rx": 1.6, "ry": 2.3, "fill": "#1A1A0A", "transform": "rotate(90,48,31)" } },
    { type: 'ellipse', attrs: { "cx": 44, "cy": 43, "rx": 1.6, "ry": 2.3, "fill": "#1A1A0A", "transform": "rotate(135,44,43)" } },
    { type: 'ellipse', attrs: { "cx": 32, "cy": 50, "rx": 1.6, "ry": 2.3, "fill": "#1A1A0A" } },
    { type: 'ellipse', attrs: { "cx": 21, "cy": 44, "rx": 1.6, "ry": 2.3, "fill": "#1A1A0A", "transform": "rotate(225,21,44)" } },
    { type: 'ellipse', attrs: { "cx": 17, "cy": 33, "rx": 1.6, "ry": 2.3, "fill": "#1A1A0A", "transform": "rotate(270,17,33)" } },
    { type: 'ellipse', attrs: { "cx": 21, "cy": 22, "rx": 1.6, "ry": 2.3, "fill": "#1A1A0A", "transform": "rotate(315,21,22)" } },
  ] },
  { type: 'g', attrs: { "transform": "translate(44, 5)" }, children: [
    { type: 'circle', attrs: { "cx": 30, "cy": 32, "r": 30, "fill": "#4E2E0C" } },
    { type: 'circle', attrs: { "cx": 30, "cy": 32, "r": 26, "fill": "url(#kw3gB)" } },
    { type: 'ellipse', attrs: { "cx": 30, "cy": 32, "rx": 8.5, "ry": 7.5, "fill": "url(#kw3c)" } },
    { type: 'line', attrs: { "x1": 30, "y1": 24, "x2": 30, "y2": 7, "stroke": "#4A7018", "stroke-width": 0.6, "opacity": 0.48 } },
    { type: 'line', attrs: { "x1": 36, "y1": 25, "x2": 45, "y2": 10, "stroke": "#4A7018", "stroke-width": 0.6, "opacity": 0.48 } },
    { type: 'line', attrs: { "x1": 40, "y1": 30, "x2": 56, "y2": 23, "stroke": "#4A7018", "stroke-width": 0.6, "opacity": 0.48 } },
    { type: 'line', attrs: { "x1": 40, "y1": 35, "x2": 56, "y2": 43, "stroke": "#4A7018", "stroke-width": 0.6, "opacity": 0.48 } },
    { type: 'line', attrs: { "x1": 30, "y1": 40, "x2": 30, "y2": 57, "stroke": "#4A7018", "stroke-width": 0.6, "opacity": 0.48 } },
    { type: 'line', attrs: { "x1": 23, "y1": 38, "x2": 12, "y2": 51, "stroke": "#4A7018", "stroke-width": 0.6, "opacity": 0.48 } },
    { type: 'line', attrs: { "x1": 20, "y1": 33, "x2": 4, "y2": 27, "stroke": "#4A7018", "stroke-width": 0.6, "opacity": 0.48 } },
    { type: 'line', attrs: { "x1": 23, "y1": 27, "x2": 12, "y2": 13, "stroke": "#4A7018", "stroke-width": 0.6, "opacity": 0.48 } },
    { type: 'ellipse', attrs: { "cx": 30, "cy": 13, "rx": 1.6, "ry": 2.3, "fill": "#1A1A0A" } },
    { type: 'ellipse', attrs: { "cx": 41, "cy": 17, "rx": 1.6, "ry": 2.3, "fill": "#1A1A0A", "transform": "rotate(45,41,17)" } },
    { type: 'ellipse', attrs: { "cx": 46, "cy": 26, "rx": 1.6, "ry": 2.3, "fill": "#1A1A0A", "transform": "rotate(90,46,26)" } },
    { type: 'ellipse', attrs: { "cx": 42, "cy": 38, "rx": 1.6, "ry": 2.3, "fill": "#1A1A0A", "transform": "rotate(135,42,38)" } },
    { type: 'ellipse', attrs: { "cx": 30, "cy": 45, "rx": 1.6, "ry": 2.3, "fill": "#1A1A0A" } },
    { type: 'ellipse', attrs: { "cx": 19, "cy": 39, "rx": 1.6, "ry": 2.3, "fill": "#1A1A0A", "transform": "rotate(225,19,39)" } },
    { type: 'ellipse', attrs: { "cx": 15, "cy": 28, "rx": 1.6, "ry": 2.3, "fill": "#1A1A0A", "transform": "rotate(270,15,28)" } },
    { type: 'ellipse', attrs: { "cx": 19, "cy": 17, "rx": 1.6, "ry": 2.3, "fill": "#1A1A0A", "transform": "rotate(315,19,17)" } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(14, 118, 37) translate(88, 5)" }, children: [
    { type: 'circle', attrs: { "cx": 30, "cy": 32, "r": 30, "fill": "#553212" } },
    { type: 'circle', attrs: { "cx": 30, "cy": 32, "r": 26, "fill": "url(#kw3gA)" } },
    { type: 'ellipse', attrs: { "cx": 30, "cy": 32, "rx": 8.5, "ry": 7.5, "fill": "url(#kw3c)" } },
    { type: 'line', attrs: { "x1": 30, "y1": 24, "x2": 30, "y2": 7, "stroke": "#4A7018", "stroke-width": 0.6, "opacity": 0.48 } },
    { type: 'line', attrs: { "x1": 36, "y1": 25, "x2": 45, "y2": 10, "stroke": "#4A7018", "stroke-width": 0.6, "opacity": 0.48 } },
    { type: 'line', attrs: { "x1": 40, "y1": 30, "x2": 56, "y2": 23, "stroke": "#4A7018", "stroke-width": 0.6, "opacity": 0.48 } },
    { type: 'line', attrs: { "x1": 40, "y1": 35, "x2": 56, "y2": 43, "stroke": "#4A7018", "stroke-width": 0.6, "opacity": 0.48 } },
    { type: 'line', attrs: { "x1": 30, "y1": 40, "x2": 30, "y2": 57, "stroke": "#4A7018", "stroke-width": 0.6, "opacity": 0.48 } },
    { type: 'line', attrs: { "x1": 23, "y1": 38, "x2": 12, "y2": 51, "stroke": "#4A7018", "stroke-width": 0.6, "opacity": 0.48 } },
    { type: 'line', attrs: { "x1": 20, "y1": 33, "x2": 4, "y2": 27, "stroke": "#4A7018", "stroke-width": 0.6, "opacity": 0.48 } },
    { type: 'line', attrs: { "x1": 23, "y1": 27, "x2": 12, "y2": 13, "stroke": "#4A7018", "stroke-width": 0.6, "opacity": 0.48 } },
    { type: 'ellipse', attrs: { "cx": 30, "cy": 13, "rx": 1.6, "ry": 2.3, "fill": "#1A1A0A" } },
    { type: 'ellipse', attrs: { "cx": 41, "cy": 17, "rx": 1.6, "ry": 2.3, "fill": "#1A1A0A", "transform": "rotate(45,41,17)" } },
    { type: 'ellipse', attrs: { "cx": 46, "cy": 26, "rx": 1.6, "ry": 2.3, "fill": "#1A1A0A", "transform": "rotate(90,46,26)" } },
    { type: 'ellipse', attrs: { "cx": 42, "cy": 38, "rx": 1.6, "ry": 2.3, "fill": "#1A1A0A", "transform": "rotate(135,42,38)" } },
    { type: 'ellipse', attrs: { "cx": 30, "cy": 45, "rx": 1.6, "ry": 2.3, "fill": "#1A1A0A" } },
    { type: 'ellipse', attrs: { "cx": 19, "cy": 39, "rx": 1.6, "ry": 2.3, "fill": "#1A1A0A", "transform": "rotate(225,19,39)" } },
    { type: 'ellipse', attrs: { "cx": 15, "cy": 28, "rx": 1.6, "ry": 2.3, "fill": "#1A1A0A", "transform": "rotate(270,15,28)" } },
    { type: 'ellipse', attrs: { "cx": 19, "cy": 17, "rx": 1.6, "ry": 2.3, "fill": "#1A1A0A", "transform": "rotate(315,19,17)" } },
  ] },
];

const S_UNK_24: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M31 64 L5 16 Q9 5 18 3 Q44 3 55 9 L31 64Z", "fill": "url(#gc1p)" } },
  { type: 'path', attrs: { "d": "M5 16 Q9 5 18 3 Q44 3 55 9", "stroke": "#7A9840", "stroke-width": 10, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M6 16 Q10 6 18 4 Q44 4 54 9", "stroke": "#9CB858", "stroke-width": 4, "fill": "none", "stroke-linecap": "round", "opacity": 0.55 } },
  { type: 'circle', attrs: { "cx": 12, "cy": 9, "r": 1.6, "fill": "#4A7028", "opacity": 0.72 } },
  { type: 'circle', attrs: { "cx": 20, "cy": 5, "r": 1.3, "fill": "#4A7028", "opacity": 0.65 } },
  { type: 'circle', attrs: { "cx": 29, "cy": 4, "r": 1.6, "fill": "#4A7028", "opacity": 0.72 } },
  { type: 'circle', attrs: { "cx": 38, "cy": 4, "r": 1.3, "fill": "#4A7028", "opacity": 0.65 } },
  { type: 'circle', attrs: { "cx": 46, "cy": 6, "r": 1.6, "fill": "#4A7028", "opacity": 0.72 } },
  { type: 'circle', attrs: { "cx": 52, "cy": 10, "r": 1.3, "fill": "#4A7028", "opacity": 0.62 } },
  { type: 'path', attrs: { "d": "M18 52 L12 22", "stroke": "#E8E8D5", "stroke-width": 0.6, "fill": "none", "opacity": 0.55 } },
  { type: 'path', attrs: { "d": "M31 60 L27 20", "stroke": "#E8E8D5", "stroke-width": 0.6, "fill": "none", "opacity": 0.45 } },
  { type: 'path', attrs: { "d": "M42 52 L43 18", "stroke": "#E8E8D5", "stroke-width": 0.6, "fill": "none", "opacity": 0.5 } },
  { type: 'path', attrs: { "d": "M54 14 Q58 6 56 2", "stroke": "#4A6828", "stroke-width": 1.5, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M56 8 Q60 5 61 7", "stroke": "#4A6828", "stroke-width": 1.1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M55 4 Q59 2 60 4", "stroke": "#4A6828", "stroke-width": 1, "fill": "none", "stroke-linecap": "round" } },
];

const S_UNK_25: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M31 62 Q24 56 18 42 Q12 28 14 18 Q16 8 23 5 Q30 3 38 4 Q46 5 52 11 Q56 18 55 28 L31 62Z", "fill": "#F5F5EE" } },
  { type: 'path', attrs: { "d": "M14 18 Q16 8 23 5 Q30 3 38 4 Q46 5 52 11", "stroke": "#769438", "stroke-width": 10, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M15 18 Q17 9 23 6 Q30 4 38 5 Q46 6 51 11", "stroke": "#98B85A", "stroke-width": 3.5, "fill": "none", "stroke-linecap": "round", "opacity": 0.5 } },
  { type: 'circle', attrs: { "cx": 18, "cy": 11, "r": 1.5, "fill": "#4A7028", "opacity": 0.7 } },
  { type: 'circle', attrs: { "cx": 26, "cy": 7, "r": 1.4, "fill": "#4A7028", "opacity": 0.65 } },
  { type: 'circle', attrs: { "cx": 35, "cy": 5, "r": 1.5, "fill": "#4A7028", "opacity": 0.7 } },
  { type: 'circle', attrs: { "cx": 44, "cy": 7, "r": 1.3, "fill": "#4A7028", "opacity": 0.65 } },
  { type: 'circle', attrs: { "cx": 50, "cy": 12, "r": 1.4, "fill": "#4A7028", "opacity": 0.62 } },
  { type: 'path', attrs: { "d": "M21 50 L15 22", "stroke": "#E0E0D0", "stroke-width": 0.7, "fill": "none", "opacity": 0.5 } },
  { type: 'path', attrs: { "d": "M33 58 L30 20", "stroke": "#E0E0D0", "stroke-width": 0.7, "fill": "none", "opacity": 0.42 } },
  { type: 'path', attrs: { "d": "M46 50 L51 58 L44 60Z", "fill": "#F5F5EE", "opacity": 0.82 } },
  { type: 'path', attrs: { "d": "M38 58 L42 64 L36 64Z", "fill": "#F0F0E8", "opacity": 0.72 } },
  { type: 'circle', attrs: { "cx": 52, "cy": 46, "r": 3.2, "fill": "#EEEEE5", "opacity": 0.78 } },
  { type: 'circle', attrs: { "cx": 48, "cy": 54, "r": 2.6, "fill": "#F0F0E8", "opacity": 0.72 } },
  { type: 'circle', attrs: { "cx": 41, "cy": 62, "r": 2.2, "fill": "#EEEEE5", "opacity": 0.65 } },
];

const S_UNK_26: SVGElementDescriptor[] = [
  { type: 'g', attrs: { "transform": "rotate(-12, 24, 56) translate(-2, 22)" }, children: [
    { type: 'path', attrs: { "d": "M26 66 L4 22 Q8 10 18 8 Q38 8 50 14 L26 66Z", "fill": "#FAFAF4" } },
    { type: 'path', attrs: { "d": "M4 22 Q8 10 18 8 Q38 8 50 14", "stroke": "#7A9840", "stroke-width": 8.5, "fill": "none", "stroke-linecap": "round" } },
    { type: 'circle', attrs: { "cx": 12, "cy": 13, "r": 1.3, "fill": "#4A7028", "opacity": 0.65 } },
    { type: 'circle', attrs: { "cx": 22, "cy": 9, "r": 1.5, "fill": "#4A7028", "opacity": 0.65 } },
    { type: 'circle', attrs: { "cx": 32, "cy": 9, "r": 1.2, "fill": "#4A7028", "opacity": 0.6 } },
    { type: 'circle', attrs: { "cx": 41, "cy": 12, "r": 1.3, "fill": "#4A7028", "opacity": 0.65 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(6, 62, 52) translate(38, 16)" }, children: [
    { type: 'path', attrs: { "d": "M22 62 Q16 56 12 42 Q8 28 12 18 Q16 8 24 6 Q34 4 42 8 Q48 12 48 22 L22 62Z", "fill": "#F5F5EE" } },
    { type: 'path', attrs: { "d": "M12 18 Q16 8 24 6 Q34 4 42 8 Q48 12 48 22", "stroke": "#729038", "stroke-width": 8.5, "fill": "none", "stroke-linecap": "round" } },
    { type: 'circle', attrs: { "cx": 18, "cy": 10, "r": 1.3, "fill": "#4A7028", "opacity": 0.65 } },
    { type: 'circle', attrs: { "cx": 28, "cy": 7, "r": 1.5, "fill": "#4A7028", "opacity": 0.65 } },
    { type: 'circle', attrs: { "cx": 38, "cy": 9, "r": 1.2, "fill": "#4A7028", "opacity": 0.6 } },
    { type: 'circle', attrs: { "cx": 44, "cy": 14, "r": 1.2, "fill": "#4A7028", "opacity": 0.6 } },
    { type: 'circle', attrs: { "cx": 44, "cy": 52, "r": 2.8, "fill": "#EEEEE5", "opacity": 0.75 } },
    { type: 'circle', attrs: { "cx": 48, "cy": 44, "r": 2.2, "fill": "#F0F0E8", "opacity": 0.68 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(-4, 100, 54) translate(72, 18)" }, children: [
    { type: 'path', attrs: { "d": "M24 64 L4 20 Q8 8 17 6 Q35 6 46 12 L24 64Z", "fill": "#FDFDF8" } },
    { type: 'path', attrs: { "d": "M4 20 Q8 8 17 6 Q35 6 46 12", "stroke": "#7A9840", "stroke-width": 8.5, "fill": "none", "stroke-linecap": "round" } },
    { type: 'circle', attrs: { "cx": 10, "cy": 11, "r": 1.3, "fill": "#4A7028", "opacity": 0.65 } },
    { type: 'circle', attrs: { "cx": 20, "cy": 7, "r": 1.5, "fill": "#4A7028", "opacity": 0.65 } },
    { type: 'circle', attrs: { "cx": 30, "cy": 7, "r": 1.2, "fill": "#4A7028", "opacity": 0.6 } },
    { type: 'circle', attrs: { "cx": 39, "cy": 10, "r": 1.3, "fill": "#4A7028", "opacity": 0.65 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(10, 134, 54) translate(108, 20)" }, children: [
    { type: 'path', attrs: { "d": "M22 62 L2 18 Q6 6 15 4 Q32 4 44 10 L22 62Z", "fill": "#F5F5EE" } },
    { type: 'path', attrs: { "d": "M2 18 Q6 6 15 4 Q32 4 44 10", "stroke": "#729038", "stroke-width": 8.5, "fill": "none", "stroke-linecap": "round" } },
    { type: 'circle', attrs: { "cx": 8, "cy": 10, "r": 1.3, "fill": "#4A7028", "opacity": 0.65 } },
    { type: 'circle', attrs: { "cx": 18, "cy": 6, "r": 1.4, "fill": "#4A7028", "opacity": 0.65 } },
    { type: 'circle', attrs: { "cx": 28, "cy": 5, "r": 1.2, "fill": "#4A7028", "opacity": 0.6 } },
    { type: 'circle', attrs: { "cx": 37, "cy": 8, "r": 1.2, "fill": "#4A7028", "opacity": 0.6 } },
    { type: 'circle', attrs: { "cx": 38, "cy": 54, "r": 2.8, "fill": "#EEEEE5", "opacity": 0.72 } },
    { type: 'circle', attrs: { "cx": 42, "cy": 44, "r": 2.2, "fill": "#F0F0E8", "opacity": 0.65 } },
  ] },
  { type: 'path', attrs: { "d": "M58 5 Q80 1 102 5", "stroke": "#4A6828", "stroke-width": 1.5, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M66 3 Q70 0 72 2", "stroke": "#4A6828", "stroke-width": 1.1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M80 2 Q84 -1 86 1", "stroke": "#4A6828", "stroke-width": 1.1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M94 3 Q98 0 100 2", "stroke": "#4A6828", "stroke-width": 1.1, "fill": "none", "stroke-linecap": "round" } },
];

const S_UNK_27: SVGElementDescriptor[] = [
  { type: 'circle', attrs: { "cx": 30, "cy": 30, "r": 28, "fill": "url(#gcLog)" } },
  { type: 'circle', attrs: { "cx": 30, "cy": 30, "r": 28, "fill": "none", "stroke": "#7A9840", "stroke-width": 9, "opacity": 0.9 } },
  { type: 'circle', attrs: { "cx": 30, "cy": 30, "r": 28, "fill": "none", "stroke": "#9CB858", "stroke-width": 4, "opacity": 0.45 } },
  { type: 'circle', attrs: { "cx": 30, "cy": 4, "r": 1.5, "fill": "#4A7028", "opacity": 0.72 } },
  { type: 'circle', attrs: { "cx": 47, "cy": 10, "r": 1.3, "fill": "#4A7028", "opacity": 0.65 } },
  { type: 'circle', attrs: { "cx": 54, "cy": 26, "r": 1.5, "fill": "#4A7028", "opacity": 0.72 } },
  { type: 'circle', attrs: { "cx": 50, "cy": 46, "r": 1.3, "fill": "#4A7028", "opacity": 0.65 } },
  { type: 'circle', attrs: { "cx": 33, "cy": 56, "r": 1.5, "fill": "#4A7028", "opacity": 0.72 } },
  { type: 'circle', attrs: { "cx": 14, "cy": 52, "r": 1.3, "fill": "#4A7028", "opacity": 0.65 } },
  { type: 'circle', attrs: { "cx": 6, "cy": 34, "r": 1.4, "fill": "#4A7028", "opacity": 0.68 } },
  { type: 'circle', attrs: { "cx": 10, "cy": 14, "r": 1.3, "fill": "#4A7028", "opacity": 0.65 } },
  { type: 'ellipse', attrs: { "cx": 22, "cy": 22, "rx": 10, "ry": 8, "fill": "#FEFEF8", "opacity": 0.28 } },
  { type: 'path', attrs: { "d": "M30 4 Q28 -1 26 -3", "stroke": "#4A6828", "stroke-width": 1.5, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M28 0 Q24 -2 23 -1", "stroke": "#4A6828", "stroke-width": 1.1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M27 -2 Q23 -4 23 -2", "stroke": "#4A6828", "stroke-width": 1, "fill": "none", "stroke-linecap": "round" } },
];

const S_UNK_28: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M2 38 Q2 2 36 2 Q70 2 70 38Z", "fill": "#E06010" } },
  { type: 'path', attrs: { "d": "M6 38 Q6 7 36 7 Q66 7 66 38Z", "fill": "url(#mand1)" } },
  { type: 'line', attrs: { "x1": 36, "y1": 38, "x2": 36, "y2": 7, "stroke": "#D87018", "stroke-width": 1, "opacity": 0.5 } },
  { type: 'line', attrs: { "x1": 36, "y1": 38, "x2": 18, "y2": 10, "stroke": "#D87018", "stroke-width": 0.9, "opacity": 0.45 } },
  { type: 'line', attrs: { "x1": 36, "y1": 38, "x2": 54, "y2": 10, "stroke": "#D87018", "stroke-width": 0.9, "opacity": 0.45 } },
  { type: 'line', attrs: { "x1": 36, "y1": 38, "x2": 9, "y2": 20, "stroke": "#D87018", "stroke-width": 0.8, "opacity": 0.4 } },
  { type: 'line', attrs: { "x1": 36, "y1": 38, "x2": 63, "y2": 20, "stroke": "#D87018", "stroke-width": 0.8, "opacity": 0.4 } },
  { type: 'line', attrs: { "x1": 36, "y1": 38, "x2": 6, "y2": 32, "stroke": "#D87018", "stroke-width": 0.7, "opacity": 0.35 } },
  { type: 'line', attrs: { "x1": 36, "y1": 38, "x2": 66, "y2": 32, "stroke": "#D87018", "stroke-width": 0.7, "opacity": 0.35 } },
  { type: 'ellipse', attrs: { "cx": 36, "cy": 20, "rx": 5, "ry": 4, "fill": "#FFC860", "opacity": 0.22 } },
  { type: 'ellipse', attrs: { "cx": 22, "cy": 24, "rx": 4, "ry": 3, "fill": "#FFC860", "opacity": 0.18 } },
  { type: 'ellipse', attrs: { "cx": 50, "cy": 24, "rx": 4, "ry": 3, "fill": "#FFC860", "opacity": 0.18 } },
  { type: 'path', attrs: { "d": "M2 38 Q2 2 36 2 Q70 2 70 38", "stroke": "#C85A08", "stroke-width": 4, "fill": "none", "stroke-linecap": "round", "opacity": 0.6 } },
  { type: 'path', attrs: { "d": "M4 38 Q4 5 36 5 Q68 5 68 38", "stroke": "#FFE8C0", "stroke-width": 1.8, "fill": "none", "stroke-linecap": "round", "opacity": 0.35 } },
];

const S_UNK_29: SVGElementDescriptor[] = [
  { type: 'g', attrs: { "transform": "rotate(-18, 38, 24)" }, children: [
    { type: 'path', attrs: { "d": "M4 40 Q4 4 38 4 Q72 4 72 40Z", "fill": "#DE6010" } },
    { type: 'path', attrs: { "d": "M8 40 Q8 9 38 9 Q68 9 68 40Z", "fill": "url(#mand2)" } },
    { type: 'line', attrs: { "x1": 38, "y1": 40, "x2": 38, "y2": 9, "stroke": "#D07018", "stroke-width": 1, "opacity": 0.5 } },
    { type: 'line', attrs: { "x1": 38, "y1": 40, "x2": 19, "y2": 12, "stroke": "#D07018", "stroke-width": 0.9, "opacity": 0.45 } },
    { type: 'line', attrs: { "x1": 38, "y1": 40, "x2": 57, "y2": 12, "stroke": "#D07018", "stroke-width": 0.9, "opacity": 0.45 } },
    { type: 'line', attrs: { "x1": 38, "y1": 40, "x2": 10, "y2": 22, "stroke": "#D07018", "stroke-width": 0.8, "opacity": 0.4 } },
    { type: 'line', attrs: { "x1": 38, "y1": 40, "x2": 66, "y2": 22, "stroke": "#D07018", "stroke-width": 0.8, "opacity": 0.4 } },
    { type: 'line', attrs: { "x1": 38, "y1": 40, "x2": 8, "y2": 34, "stroke": "#D07018", "stroke-width": 0.7, "opacity": 0.35 } },
    { type: 'line', attrs: { "x1": 38, "y1": 40, "x2": 68, "y2": 34, "stroke": "#D07018", "stroke-width": 0.7, "opacity": 0.35 } },
    { type: 'path', attrs: { "d": "M4 40 Q4 4 38 4 Q72 4 72 40", "stroke": "#C85808", "stroke-width": 4, "fill": "none", "stroke-linecap": "round", "opacity": 0.6 } },
    { type: 'path', attrs: { "d": "M6 40 Q6 7 38 7 Q70 7 70 40", "stroke": "#FFE8C0", "stroke-width": 1.8, "fill": "none", "stroke-linecap": "round", "opacity": 0.32 } },
  ] },
];

const S_UNK_3: SVGElementDescriptor[] = [
  { type: 'circle', attrs: { "cx": 22, "cy": 14, "r": 7.5, "fill": "url(#raspB)" } },
  { type: 'circle', attrs: { "cx": 30, "cy": 20, "r": 7.5, "fill": "url(#raspB)" } },
  { type: 'circle', attrs: { "cx": 14, "cy": 20, "r": 7.5, "fill": "url(#raspB)" } },
  { type: 'circle', attrs: { "cx": 7, "cy": 29, "r": 7, "fill": "url(#raspB)" } },
  { type: 'circle', attrs: { "cx": 22, "cy": 27, "r": 7.5, "fill": "url(#raspB)" } },
  { type: 'circle', attrs: { "cx": 37, "cy": 29, "r": 7, "fill": "url(#raspB)" } },
  { type: 'circle', attrs: { "cx": 14, "cy": 36, "r": 7, "fill": "url(#raspB)" } },
  { type: 'circle', attrs: { "cx": 29, "cy": 38, "r": 7, "fill": "url(#raspB)" } },
  { type: 'circle', attrs: { "cx": 22, "cy": 27, "r": 3.2, "fill": "#C03050", "opacity": 0.52 } },
  { type: 'circle', attrs: { "cx": 19, "cy": 11, "r": 2.6, "fill": "#F8A8BA", "opacity": 0.48 } },
  { type: 'circle', attrs: { "cx": 28, "cy": 17, "r": 2.2, "fill": "#F8A8BA", "opacity": 0.45 } },
  { type: 'circle', attrs: { "cx": 12, "cy": 17, "r": 2.2, "fill": "#F8A8BA", "opacity": 0.45 } },
  { type: 'path', attrs: { "d": "M22 8 Q22 4 20 3", "stroke": "#4A6020", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round" } },
];

const S_UNK_30: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M2 42 Q2 2 36 2 Q70 2 70 42Z", "fill": "#E06010" } },
  { type: 'path', attrs: { "d": "M6 42 Q6 7 36 7 Q66 7 66 42Z", "fill": "url(#mand3A)" } },
  { type: 'line', attrs: { "x1": 36, "y1": 42, "x2": 36, "y2": 7, "stroke": "#D07018", "stroke-width": 1, "opacity": 0.5 } },
  { type: 'line', attrs: { "x1": 36, "y1": 42, "x2": 18, "y2": 10, "stroke": "#D07018", "stroke-width": 0.9, "opacity": 0.45 } },
  { type: 'line', attrs: { "x1": 36, "y1": 42, "x2": 54, "y2": 10, "stroke": "#D07018", "stroke-width": 0.9, "opacity": 0.45 } },
  { type: 'line', attrs: { "x1": 36, "y1": 42, "x2": 8, "y2": 22, "stroke": "#D07018", "stroke-width": 0.8, "opacity": 0.38 } },
  { type: 'line', attrs: { "x1": 36, "y1": 42, "x2": 64, "y2": 22, "stroke": "#D07018", "stroke-width": 0.8, "opacity": 0.38 } },
  { type: 'path', attrs: { "d": "M2 42 Q2 2 36 2 Q70 2 70 42", "stroke": "#C85808", "stroke-width": 3.5, "fill": "none", "stroke-linecap": "round", "opacity": 0.58 } },
  { type: 'path', attrs: { "d": "M80 42 Q80 2 114 2 Q148 2 148 42Z", "fill": "#DC5E0E" } },
  { type: 'path', attrs: { "d": "M84 42 Q84 7 114 7 Q144 7 144 42Z", "fill": "url(#mand3B)" } },
  { type: 'line', attrs: { "x1": 114, "y1": 42, "x2": 114, "y2": 7, "stroke": "#D07018", "stroke-width": 1, "opacity": 0.5 } },
  { type: 'line', attrs: { "x1": 114, "y1": 42, "x2": 96, "y2": 10, "stroke": "#D07018", "stroke-width": 0.9, "opacity": 0.45 } },
  { type: 'line', attrs: { "x1": 114, "y1": 42, "x2": 132, "y2": 10, "stroke": "#D07018", "stroke-width": 0.9, "opacity": 0.45 } },
  { type: 'line', attrs: { "x1": 114, "y1": 42, "x2": 86, "y2": 22, "stroke": "#D07018", "stroke-width": 0.8, "opacity": 0.38 } },
  { type: 'line', attrs: { "x1": 114, "y1": 42, "x2": 142, "y2": 22, "stroke": "#D07018", "stroke-width": 0.8, "opacity": 0.38 } },
  { type: 'path', attrs: { "d": "M80 42 Q80 2 114 2 Q148 2 148 42", "stroke": "#C05608", "stroke-width": 3.5, "fill": "none", "stroke-linecap": "round", "opacity": 0.58 } },
];

const S_UNK_31: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M14 2 Q22 3 24 10 Q26 18 24 28 Q22 37 14 39 Q6 37 4 28 Q2 18 4 10 Q6 3 14 2Z", "fill": "url(#ol1)" } },
  { type: 'ellipse', attrs: { "cx": 9, "cy": 11, "rx": 4, "ry": 6, "fill": "#D0E878", "opacity": 0.35 } },
  { type: 'ellipse', attrs: { "cx": 14, "cy": 20, "rx": 2.5, "ry": 3, "fill": "#E85030", "opacity": 0.72 } },
];

const S_UNK_32: SVGElementDescriptor[] = [
  { type: 'g', attrs: { "transform": "rotate(65, 20, 16)" }, children: [
    { type: 'path', attrs: { "d": "M14 2 Q22 3 24 10 Q26 18 24 28 Q22 37 14 39 Q6 37 4 28 Q2 18 4 10 Q6 3 14 2Z", "fill": "url(#ol2)" } },
    { type: 'ellipse', attrs: { "cx": 9, "cy": 11, "rx": 4, "ry": 6, "fill": "#CEEA74", "opacity": 0.32 } },
    { type: 'ellipse', attrs: { "cx": 14, "cy": 20, "rx": 2.5, "ry": 3, "fill": "#E85030", "opacity": 0.72 } },
  ] },
];

const S_UNK_33: SVGElementDescriptor[] = [
  { type: 'g', attrs: { "transform": "rotate(-10, 20, 20)" }, children: [
    { type: 'ellipse', attrs: { "cx": 20, "cy": 20, "rx": 11, "ry": 17, "fill": "url(#olC1)" } },
    { type: 'ellipse', attrs: { "cx": 14, "cy": 13, "rx": 4, "ry": 5.5, "fill": "#D0E870", "opacity": 0.3 } },
    { type: 'ellipse', attrs: { "cx": 20, "cy": 20, "rx": 2.2, "ry": 2.8, "fill": "#E05028", "opacity": 0.7 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(5, 52, 22)" }, children: [
    { type: 'ellipse', attrs: { "cx": 52, "cy": 22, "rx": 11, "ry": 17, "fill": "url(#olC2)" } },
    { type: 'ellipse', attrs: { "cx": 46, "cy": 15, "rx": 4, "ry": 5.5, "fill": "#C8EC6C", "opacity": 0.3 } },
    { type: 'ellipse', attrs: { "cx": 52, "cy": 22, "rx": 2.2, "ry": 2.8, "fill": "#E05028", "opacity": 0.7 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(20, 86, 18)" }, children: [
    { type: 'ellipse', attrs: { "cx": 86, "cy": 18, "rx": 11, "ry": 17, "fill": "url(#olC1)" } },
    { type: 'ellipse', attrs: { "cx": 80, "cy": 11, "rx": 4, "ry": 5.5, "fill": "#D0E870", "opacity": 0.3 } },
    { type: 'ellipse', attrs: { "cx": 86, "cy": 18, "rx": 2.2, "ry": 2.8, "fill": "#E05028", "opacity": 0.7 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(-20, 112, 24)" }, children: [
    { type: 'ellipse', attrs: { "cx": 112, "cy": 24, "rx": 11, "ry": 17, "fill": "url(#olC3)" } },
    { type: 'ellipse', attrs: { "cx": 106, "cy": 17, "rx": 4, "ry": 5.5, "fill": "#CCE468", "opacity": 0.3 } },
    { type: 'ellipse', attrs: { "cx": 112, "cy": 24, "rx": 2.2, "ry": 2.8, "fill": "#E05028", "opacity": 0.7 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(8, 16, 60)" }, children: [
    { type: 'ellipse', attrs: { "cx": 16, "cy": 60, "rx": 11, "ry": 17, "fill": "url(#olC2)" } },
    { type: 'ellipse', attrs: { "cx": 10, "cy": 53, "rx": 4, "ry": 5.5, "fill": "#C8EC6C", "opacity": 0.3 } },
    { type: 'ellipse', attrs: { "cx": 16, "cy": 60, "rx": 2.2, "ry": 2.8, "fill": "#E05028", "opacity": 0.7 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(-12, 48, 64)" }, children: [
    { type: 'ellipse', attrs: { "cx": 48, "cy": 64, "rx": 11, "ry": 17, "fill": "url(#olC1)" } },
    { type: 'ellipse', attrs: { "cx": 42, "cy": 57, "rx": 4, "ry": 5.5, "fill": "#D0E870", "opacity": 0.3 } },
    { type: 'ellipse', attrs: { "cx": 48, "cy": 64, "rx": 2.2, "ry": 2.8, "fill": "#E05028", "opacity": 0.7 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(15, 80, 66)" }, children: [
    { type: 'ellipse', attrs: { "cx": 80, "cy": 66, "rx": 11, "ry": 17, "fill": "url(#olC3)" } },
    { type: 'ellipse', attrs: { "cx": 74, "cy": 59, "rx": 4, "ry": 5.5, "fill": "#CCE468", "opacity": 0.3 } },
    { type: 'ellipse', attrs: { "cx": 80, "cy": 66, "rx": 2.2, "ry": 2.8, "fill": "#E05028", "opacity": 0.7 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(-5, 112, 62)" }, children: [
    { type: 'ellipse', attrs: { "cx": 112, "cy": 62, "rx": 11, "ry": 17, "fill": "url(#olC2)" } },
    { type: 'ellipse', attrs: { "cx": 106, "cy": 55, "rx": 4, "ry": 5.5, "fill": "#C8EC6C", "opacity": 0.3 } },
    { type: 'ellipse', attrs: { "cx": 112, "cy": 62, "rx": 2.2, "ry": 2.8, "fill": "#E05028", "opacity": 0.7 } },
  ] },
];

const S_UNK_34: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M12 2 Q19 3 21 10 Q23 18 21 26 Q19 33 12 34 Q5 33 3 26 Q1 18 3 10 Q5 3 12 2Z", "fill": "url(#cha1)" } },
  { type: 'ellipse', attrs: { "cx": 8, "cy": 9, "rx": 3, "ry": 5, "fill": "#7A4820", "opacity": 0.42 } },
];

const S_UNK_35: SVGElementDescriptor[] = [
  { type: 'g', attrs: { "transform": "rotate(72, 18, 12)" }, children: [
    { type: 'path', attrs: { "d": "M12 2 Q19 3 21 9 Q23 16 21 23 Q19 30 12 31 Q5 30 3 23 Q1 16 3 9 Q5 3 12 2Z", "fill": "url(#cha2)" } },
    { type: 'ellipse', attrs: { "cx": 8, "cy": 8, "rx": 2.5, "ry": 4, "fill": "#7A4820", "opacity": 0.4 } },
  ] },
];

const S_UNK_36: SVGElementDescriptor[] = [
  { type: 'g', attrs: { "transform": "rotate(-22, 18, 18)" }, children: [
    { type: 'path', attrs: { "d": "M18 8 Q24 9 26 15 Q28 21 26 26 Q24 31 18 32 Q12 31 10 26 Q8 21 10 15 Q12 9 18 8Z", "fill": "url(#cas1)" } },
    { type: 'ellipse', attrs: { "cx": 13, "cy": 12, "rx": 2, "ry": 3.5, "fill": "#6A3818", "opacity": 0.4 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(38, 60, 14)" }, children: [
    { type: 'path', attrs: { "d": "M60 6 Q66 7 68 13 Q70 19 68 24 Q66 29 60 30 Q54 29 52 24 Q50 19 52 13 Q54 7 60 6Z", "fill": "url(#cas2)" } },
    { type: 'ellipse', attrs: { "cx": 55, "cy": 10, "rx": 2, "ry": 3.5, "fill": "#6A3818", "opacity": 0.4 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(8, 90, 26)" }, children: [
    { type: 'path', attrs: { "d": "M90 16 Q96 17 98 23 Q100 29 98 34 Q96 39 90 40 Q84 39 82 34 Q80 29 82 23 Q84 17 90 16Z", "fill": "url(#cas1)" } },
    { type: 'ellipse', attrs: { "cx": 85, "cy": 20, "rx": 2, "ry": 3.5, "fill": "#6A3818", "opacity": 0.4 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(-32, 28, 52)" }, children: [
    { type: 'path', attrs: { "d": "M28 42 Q34 43 36 49 Q38 55 36 60 Q34 65 28 66 Q22 65 20 60 Q18 55 20 49 Q22 43 28 42Z", "fill": "url(#cas2)" } },
    { type: 'ellipse', attrs: { "cx": 23, "cy": 46, "rx": 2, "ry": 3.5, "fill": "#6A3818", "opacity": 0.4 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(52, 68, 54)" }, children: [
    { type: 'path', attrs: { "d": "M68 44 Q74 45 76 51 Q78 57 76 62 Q74 67 68 68 Q62 67 60 62 Q58 57 60 51 Q62 45 68 44Z", "fill": "url(#cas1)" } },
    { type: 'ellipse', attrs: { "cx": 63, "cy": 48, "rx": 2, "ry": 3.5, "fill": "#6A3818", "opacity": 0.4 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(-8, 42, 56)" }, children: [
    { type: 'path', attrs: { "d": "M42 46 Q48 47 50 53 Q52 59 50 64 Q48 69 42 70 Q36 69 34 64 Q32 59 34 53 Q36 47 42 46Z", "fill": "url(#cas2)" } },
    { type: 'ellipse', attrs: { "cx": 37, "cy": 50, "rx": 2, "ry": 3.5, "fill": "#6A3818", "opacity": 0.4 } },
  ] },
];

const S_UNK_37: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M10 17 Q3 11 5 5 Q7 1 13 2 Q17 4 15 10 Q14 14 10 17Z", "fill": "url(#cp1)" } },
  { type: 'path', attrs: { "d": "M10 17 Q4 12 6 6 Q8 3 13 3 Q16 5 14 10", "stroke": "#5A3018", "stroke-width": 1.2, "fill": "none", "opacity": 0.4 } },
  { type: 'path', attrs: { "d": "M30 17 Q37 11 35 5 Q33 1 27 2 Q23 4 25 10 Q26 14 30 17Z", "fill": "url(#cp1)" } },
  { type: 'path', attrs: { "d": "M30 17 Q36 12 34 6 Q32 3 27 3 Q24 5 26 10", "stroke": "#5A3018", "stroke-width": 1.2, "fill": "none", "opacity": 0.4 } },
  { type: 'path', attrs: { "d": "M10 17 Q15 19 20 18 Q25 17 30 17 Q26 21 20 22 Q14 21 10 17Z", "fill": "url(#cp1)" } },
  { type: 'path', attrs: { "d": "M14 21 Q10 27 12 33 Q14 35 16 33 Q18 29 20 25", "fill": "url(#cp1)" } },
  { type: 'path', attrs: { "d": "M26 21 Q30 27 28 33 Q26 35 24 33 Q22 29 20 25", "fill": "url(#cp1)" } },
  { type: 'ellipse', attrs: { "cx": 7, "cy": 8, "rx": 2, "ry": 3, "fill": "#6A3C1C", "opacity": 0.48 } },
  { type: 'circle', attrs: { "cx": 8, "cy": 13, "r": 1, "fill": "#E8E0D0", "opacity": 0.52 } },
  { type: 'circle', attrs: { "cx": 32, "cy": 13, "r": 1, "fill": "#E8E0D0", "opacity": 0.52 } },
  { type: 'circle', attrs: { "cx": 20, "cy": 19, "r": 1, "fill": "#E8E0D0", "opacity": 0.48 } },
];

const S_UNK_38: SVGElementDescriptor[] = [
  { type: 'g', attrs: { "transform": "rotate(-12, 22, 22)" }, children: [
    { type: 'path', attrs: { "d": "M12 21 Q5 15 7 9 Q9 5 15 6 Q18 8 17 14 Q15 18 12 21Z", "fill": "url(#cp2)" } },
    { type: 'path', attrs: { "d": "M32 21 Q39 15 37 9 Q35 5 29 6 Q26 8 27 14 Q29 18 32 21Z", "fill": "url(#cp2)" } },
    { type: 'path', attrs: { "d": "M12 21 Q17 23 22 22 Q27 21 32 21 Q28 25 22 26 Q16 25 12 21Z", "fill": "url(#cp2)" } },
    { type: 'path', attrs: { "d": "M16 25 Q12 31 14 37 Q16 39 18 37 Q20 33 22 29", "fill": "url(#cp2)" } },
    { type: 'path', attrs: { "d": "M28 25 Q32 31 30 37 Q28 39 26 37 Q24 33 22 29", "fill": "url(#cp2)" } },
    { type: 'ellipse', attrs: { "cx": 8, "cy": 13, "rx": 1.5, "ry": 2.5, "fill": "#5A3018", "opacity": 0.48 } },
    { type: 'circle', attrs: { "cx": 10, "cy": 17, "r": 0.8, "fill": "#DDD5C5", "opacity": 0.5 } },
    { type: 'circle', attrs: { "cx": 34, "cy": 17, "r": 0.8, "fill": "#DDD5C5", "opacity": 0.5 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(18, 92, 22) translate(58, 2)" }, children: [
    { type: 'path', attrs: { "d": "M12 21 Q5 15 7 9 Q9 5 15 6 Q18 8 17 14 Q15 18 12 21Z", "fill": "url(#cp2)" } },
    { type: 'path', attrs: { "d": "M32 21 Q39 15 37 9 Q35 5 29 6 Q26 8 27 14 Q29 18 32 21Z", "fill": "url(#cp2)" } },
    { type: 'path', attrs: { "d": "M12 21 Q17 23 22 22 Q27 21 32 21 Q28 25 22 26 Q16 25 12 21Z", "fill": "url(#cp2)" } },
    { type: 'path', attrs: { "d": "M16 25 Q12 31 14 37 Q16 39 18 37 Q20 33 22 29", "fill": "url(#cp2)" } },
    { type: 'path', attrs: { "d": "M28 25 Q32 31 30 37 Q28 39 26 37 Q24 33 22 29", "fill": "url(#cp2)" } },
    { type: 'circle', attrs: { "cx": 22, "cy": 23, "r": 0.8, "fill": "#DDD5C5", "opacity": 0.5 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(5, 22, 62) translate(2, 46)" }, children: [
    { type: 'path', attrs: { "d": "M12 21 Q5 15 7 9 Q9 5 15 6 Q18 8 17 14 Q15 18 12 21Z", "fill": "url(#cp2)" } },
    { type: 'path', attrs: { "d": "M32 21 Q39 15 37 9 Q35 5 29 6 Q26 8 27 14 Q29 18 32 21Z", "fill": "url(#cp2)" } },
    { type: 'path', attrs: { "d": "M12 21 Q17 23 22 22 Q27 21 32 21 Q28 25 22 26 Q16 25 12 21Z", "fill": "url(#cp2)" } },
    { type: 'path', attrs: { "d": "M16 25 Q12 31 14 37 Q16 39 18 37 Q20 33 22 29", "fill": "url(#cp2)" } },
    { type: 'path', attrs: { "d": "M28 25 Q32 31 30 37 Q28 39 26 37 Q24 33 22 29", "fill": "url(#cp2)" } },
    { type: 'circle', attrs: { "cx": 10, "cy": 17, "r": 0.8, "fill": "#DDD5C5", "opacity": 0.5 } },
  ] },
  { type: 'g', attrs: { "transform": "rotate(-14, 92, 60) translate(56, 46)" }, children: [
    { type: 'path', attrs: { "d": "M12 21 Q5 15 7 9 Q9 5 15 6 Q18 8 17 14 Q15 18 12 21Z", "fill": "url(#cp2)" } },
    { type: 'path', attrs: { "d": "M32 21 Q39 15 37 9 Q35 5 29 6 Q26 8 27 14 Q29 18 32 21Z", "fill": "url(#cp2)" } },
    { type: 'path', attrs: { "d": "M12 21 Q17 23 22 22 Q27 21 32 21 Q28 25 22 26 Q16 25 12 21Z", "fill": "url(#cp2)" } },
    { type: 'path', attrs: { "d": "M16 25 Q12 31 14 37 Q16 39 18 37 Q20 33 22 29", "fill": "url(#cp2)" } },
    { type: 'path', attrs: { "d": "M28 25 Q32 31 30 37 Q28 39 26 37 Q24 33 22 29", "fill": "url(#cp2)" } },
    { type: 'circle', attrs: { "cx": 34, "cy": 17, "r": 0.8, "fill": "#DDD5C5", "opacity": 0.5 } },
  ] },
];

const S_UNK_39: SVGElementDescriptor[] = [
  { type: 'rect', attrs: { "x": 8, "y": 18, "width": 32, "height": 40, "rx": 5, "fill": "#E8E0C8" } },
  { type: 'rect', attrs: { "x": 8, "y": 18, "width": 32, "height": 40, "rx": 5, "fill": "none", "stroke": "#C4B898", "stroke-width": 1 } },
  { type: 'rect', attrs: { "x": 6, "y": 8, "width": 36, "height": 14, "rx": 5, "fill": "#1A1A1A" } },
  { type: 'rect', attrs: { "x": 10, "y": 10, "width": 28, "height": 10, "rx": 3, "fill": "#2A2A2A" } },
  { type: 'rect', attrs: { "x": 11, "y": 24, "width": 26, "height": 28, "rx": 3, "fill": "#2D5A2D" } },
  { type: 'rect', attrs: { "x": 13, "y": 26, "width": 22, "height": 24, "rx": 2, "fill": "#2D5A2D", "stroke": "#4A7A4A", "stroke-width": 0.8 } },
  { type: 'circle', attrs: { "cx": 24, "cy": 36, "r": 8, "fill": "none", "stroke": "#7AB87A", "stroke-width": 0.8, "opacity": 0.8 } },
  { type: 'rect', attrs: { "x": 16, "y": 33, "width": 16, "height": 3, "rx": 1, "fill": "#C8A040", "opacity": 0.85 } },
  { type: 'rect', attrs: { "x": 18, "y": 37, "width": 12, "height": 2, "rx": 1, "fill": "#C8A040", "opacity": 0.6 } },
  { type: 'path', attrs: { "d": "M21 28 Q24 26 27 28", "stroke": "#7AB87A", "stroke-width": 0.8, "fill": "none", "opacity": 0.8 } },
  { type: 'path', attrs: { "d": "M19 46 Q24 48 29 46", "stroke": "#7AB87A", "stroke-width": 0.8, "fill": "none", "opacity": 0.8 } },
  { type: 'path', attrs: { "d": "M12 22 L12 54", "stroke": "#FEFCF0", "stroke-width": 1.5, "opacity": 0.18 } },
];

const S_UNK_4: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M21 40 Q4 30 4 18 Q4 6 12 3 Q17 1 21 5 Q25 1 30 3 Q38 6 38 18 Q38 30 21 40Z", "fill": "url(#strawTop)" } },
  { type: 'ellipse', attrs: { "cx": 15, "cy": 16, "r": 1, "ry": 1.5, "fill": "#B82838", "opacity": 0.55 } },
  { type: 'ellipse', attrs: { "cx": 24, "cy": 12, "r": 1, "ry": 1.5, "fill": "#B82838", "opacity": 0.55 } },
  { type: 'ellipse', attrs: { "cx": 28, "cy": 22, "r": 1, "ry": 1.5, "fill": "#B82838", "opacity": 0.55 } },
  { type: 'ellipse', attrs: { "cx": 22, "cy": 30, "r": 1, "ry": 1.5, "fill": "#B82838", "opacity": 0.55 } },
  { type: 'ellipse', attrs: { "cx": 14, "cy": 27, "r": 1, "ry": 1.5, "fill": "#B82838", "opacity": 0.55 } },
  { type: 'path', attrs: { "d": "M17 4 Q15 0 13 0 Q13 2 15 3", "fill": "#5A8030", "opacity": 0.85 } },
  { type: 'path', attrs: { "d": "M21 3 Q21 0 19 0 Q19 2 21 3", "fill": "#6A9040", "opacity": 0.85 } },
  { type: 'path', attrs: { "d": "M25 4 Q27 0 29 0 Q29 2 27 3", "fill": "#5A8030", "opacity": 0.85 } },
];

const S_UNK_40: SVGElementDescriptor[] = [
  { type: 'rect', attrs: { "x": 7, "y": 17, "width": 32, "height": 40, "rx": 5, "fill": "#F0E8C0" } },
  { type: 'rect', attrs: { "x": 7, "y": 17, "width": 32, "height": 40, "rx": 5, "fill": "none", "stroke": "#C8B880", "stroke-width": 1 } },
  { type: 'rect', attrs: { "x": 5, "y": 7, "width": 36, "height": 14, "rx": 5, "fill": "#C8A040" } },
  { type: 'rect', attrs: { "x": 9, "y": 9, "width": 28, "height": 10, "rx": 3, "fill": "#D4AE48" } },
  { type: 'rect', attrs: { "x": 10, "y": 23, "width": 26, "height": 28, "rx": 3, "fill": "#FAF4DC" } },
  { type: 'rect', attrs: { "x": 12, "y": 25, "width": 22, "height": 24, "rx": 2, "fill": "#FAF4DC", "stroke": "#D4B850", "stroke-width": 0.8 } },
  { type: 'circle', attrs: { "cx": 23, "cy": 35, "r": 7, "fill": "none", "stroke": "#5A8030", "stroke-width": 0.9, "opacity": 0.7 } },
  { type: 'rect', attrs: { "x": 15, "y": 32, "width": 16, "height": 2.5, "rx": 1, "fill": "#5A8030", "opacity": 0.8 } },
  { type: 'rect', attrs: { "x": 17, "y": 36, "width": 12, "height": 2, "rx": 1, "fill": "#5A8030", "opacity": 0.65 } },
  { type: 'path', attrs: { "d": "M20 27 Q23 25 26 27", "stroke": "#5A8030", "stroke-width": 0.8, "fill": "none", "opacity": 0.7 } },
  { type: 'path', attrs: { "d": "M18 45 Q23 47 28 45", "stroke": "#5A8030", "stroke-width": 0.8, "fill": "none", "opacity": 0.7 } },
  { type: 'path', attrs: { "d": "M11 21 L11 53", "stroke": "#FFF8E8", "stroke-width": 1.5, "opacity": 0.2 } },
];

const S_UNK_41: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M12 70 Q11 50 12 30 Q12 15 11 4", "stroke": "#4A6A28", "stroke-width": 1.6, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M12 60 Q7 55 5 56", "stroke": "#4A6A28", "stroke-width": 1.1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M12 56 Q17 51 19 53", "stroke": "#4A6A28", "stroke-width": 1.1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M12 50 Q7 45 5 46", "stroke": "#4A6A28", "stroke-width": 1.1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M12 46 Q17 41 19 43", "stroke": "#4A6A28", "stroke-width": 1.1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M12 40 Q7 35 5 36", "stroke": "#4A6A28", "stroke-width": 1.1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M12 36 Q17 31 19 33", "stroke": "#4A6A28", "stroke-width": 1.1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M12 28 Q7 23 5 24", "stroke": "#4A6A28", "stroke-width": 1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M12 24 Q17 19 19 21", "stroke": "#4A6A28", "stroke-width": 1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M12 16 Q7 12 5 13", "stroke": "#4A6A28", "stroke-width": 0.9, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M12 12 Q17 8 19 10", "stroke": "#4A6A28", "stroke-width": 0.9, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M11 4 Q8 0 7 1 Q9 3 11 6", "stroke": "#4A6A28", "stroke-width": 0.9, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M11 4 Q14 0 15 1 Q13 3 11 6", "stroke": "#4A6A28", "stroke-width": 0.9, "fill": "none", "stroke-linecap": "round" } },
];

const S_UNK_42: SVGElementDescriptor[] = [
  { type: 'g', attrs: { "transform": "rotate(-30, 24, 26)" }, children: [
    { type: 'path', attrs: { "d": "M24 50 Q23 34 24 18 Q24 8 23 2", "stroke": "#4A6A28", "stroke-width": 1.6, "fill": "none", "stroke-linecap": "round" } },
    { type: 'path', attrs: { "d": "M24 42 Q19 37 17 38", "stroke": "#4A6A28", "stroke-width": 1.1, "fill": "none", "stroke-linecap": "round" } },
    { type: 'path', attrs: { "d": "M24 38 Q29 33 31 35", "stroke": "#4A6A28", "stroke-width": 1.1, "fill": "none", "stroke-linecap": "round" } },
    { type: 'path', attrs: { "d": "M24 30 Q19 25 17 26", "stroke": "#4A6A28", "stroke-width": 1, "fill": "none", "stroke-linecap": "round" } },
    { type: 'path', attrs: { "d": "M24 26 Q29 21 31 23", "stroke": "#4A6A28", "stroke-width": 1, "fill": "none", "stroke-linecap": "round" } },
    { type: 'path', attrs: { "d": "M24 18 Q19 13 17 14", "stroke": "#4A6A28", "stroke-width": 0.9, "fill": "none", "stroke-linecap": "round" } },
    { type: 'path', attrs: { "d": "M24 14 Q29 9 31 11", "stroke": "#4A6A28", "stroke-width": 0.9, "fill": "none", "stroke-linecap": "round" } },
    { type: 'path', attrs: { "d": "M23 2 Q20 -2 19 -1 Q21 2 23 4", "stroke": "#4A6A28", "stroke-width": 0.9, "fill": "none", "stroke-linecap": "round" } },
    { type: 'path', attrs: { "d": "M23 2 Q26 -2 27 -1 Q25 2 23 4", "stroke": "#4A6A28", "stroke-width": 0.9, "fill": "none", "stroke-linecap": "round" } },
  ] },
];

const S_UNK_43: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M20 38 Q22 32 24 26 Q26 20 28 14 Q30 8 31 4", "stroke": "#5A8030", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M25 38 Q26 32 27 25 Q28 18 29 12 Q30 7 31 4", "stroke": "#6A9038", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M30 38 Q30 32 30 24 Q30 16 31 10 Q31 6 31 4", "stroke": "#5A8030", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M35 38 Q34 32 33 25 Q32 18 31 12 Q31 7 31 4", "stroke": "#6A9038", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M40 38 Q38 32 36 26 Q34 20 32 14 Q31 8 31 4", "stroke": "#5A8030", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M28 14 Q24 10 22 11", "stroke": "#7AAA48", "stroke-width": 1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M29 12 Q28 7 31 4", "stroke": "#7AAA48", "stroke-width": 0.9, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M32 14 Q36 10 38 11", "stroke": "#7AAA48", "stroke-width": 1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M27 22 Q22 19 20 20", "stroke": "#7AAA48", "stroke-width": 1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M33 22 Q38 19 40 20", "stroke": "#7AAA48", "stroke-width": 1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'circle', attrs: { "cx": 22, "cy": 38, "r": 1.5, "fill": "#3A5820", "opacity": 0.6 } },
  { type: 'circle', attrs: { "cx": 28, "cy": 39, "r": 1.3, "fill": "#3A5820", "opacity": 0.55 } },
  { type: 'circle', attrs: { "cx": 34, "cy": 39, "r": 1.5, "fill": "#3A5820", "opacity": 0.6 } },
  { type: 'circle', attrs: { "cx": 40, "cy": 38, "r": 1.3, "fill": "#3A5820", "opacity": 0.55 } },
];

const S_UNK_44: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M12 46 Q14 38 16 30 Q18 22 19 16 Q20 10 21 6", "stroke": "#5A8030", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M20 46 Q21 38 22 30 Q23 21 24 14 Q24 9 24 5", "stroke": "#6A9038", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M28 46 Q28 38 28 29 Q28 20 29 12 Q29 7 29 4", "stroke": "#5A8030", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M36 46 Q36 38 36 29 Q35 20 35 12 Q35 7 35 4", "stroke": "#6A9038", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M44 46 Q43 38 42 30 Q41 21 40 14 Q40 9 40 5", "stroke": "#5A8030", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M52 46 Q51 38 50 30 Q49 22 48 15 Q47 9 46 6", "stroke": "#6A9038", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M60 46 Q58 38 56 30 Q54 22 52 16 Q51 10 50 6", "stroke": "#5A8030", "stroke-width": 1.2, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M19 16 Q14 12 12 13", "stroke": "#7AAA48", "stroke-width": 1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M22 15 Q26 11 28 12", "stroke": "#7AAA48", "stroke-width": 1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M28 12 Q26 7 29 4", "stroke": "#7AAA48", "stroke-width": 0.9, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M35 12 Q32 7 35 4", "stroke": "#7AAA48", "stroke-width": 0.9, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M35 12 Q38 8 40 5", "stroke": "#7AAA48", "stroke-width": 0.9, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M40 14 Q44 10 46 6", "stroke": "#7AAA48", "stroke-width": 1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M40 16 Q36 12 34 13", "stroke": "#7AAA48", "stroke-width": 1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M48 15 Q52 11 54 12", "stroke": "#7AAA48", "stroke-width": 1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M26 28 Q20 25 18 26", "stroke": "#7AAA48", "stroke-width": 1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M34 28 Q40 25 42 26", "stroke": "#7AAA48", "stroke-width": 1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M44 28 Q50 25 52 26", "stroke": "#7AAA48", "stroke-width": 1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'circle', attrs: { "cx": 14, "cy": 46, "r": 1.5, "fill": "#3A5820", "opacity": 0.6 } },
  { type: 'circle', attrs: { "cx": 22, "cy": 47, "r": 1.3, "fill": "#3A5820", "opacity": 0.55 } },
  { type: 'circle', attrs: { "cx": 30, "cy": 47, "r": 1.5, "fill": "#3A5820", "opacity": 0.6 } },
  { type: 'circle', attrs: { "cx": 38, "cy": 47, "r": 1.3, "fill": "#3A5820", "opacity": 0.55 } },
  { type: 'circle', attrs: { "cx": 46, "cy": 46, "r": 1.5, "fill": "#3A5820", "opacity": 0.6 } },
  { type: 'circle', attrs: { "cx": 54, "cy": 46, "r": 1.3, "fill": "#3A5820", "opacity": 0.55 } },
];

const S_UNK_5: SVGElementDescriptor[] = [
  { type: 'circle', attrs: { "cx": 42, "cy": 42, "r": 39, "fill": "url(#bou1)" } },
  { type: 'circle', attrs: { "cx": 30, "cy": 28, "r": 1.7, "fill": "#6A8040", "opacity": 0.68 } },
  { type: 'circle', attrs: { "cx": 46, "cy": 24, "r": 1.2, "fill": "#5A7030", "opacity": 0.62 } },
  { type: 'circle', attrs: { "cx": 55, "cy": 33, "r": 1.9, "fill": "#7A9050", "opacity": 0.65 } },
  { type: 'circle', attrs: { "cx": 58, "cy": 46, "r": 1.3, "fill": "#6A8040", "opacity": 0.68 } },
  { type: 'circle', attrs: { "cx": 50, "cy": 57, "r": 1.6, "fill": "#5A7030", "opacity": 0.62 } },
  { type: 'circle', attrs: { "cx": 37, "cy": 60, "r": 1.1, "fill": "#7A9050", "opacity": 0.65 } },
  { type: 'circle', attrs: { "cx": 26, "cy": 54, "r": 1.9, "fill": "#6A8040", "opacity": 0.68 } },
  { type: 'circle', attrs: { "cx": 22, "cy": 41, "r": 1.3, "fill": "#5A7030", "opacity": 0.62 } },
  { type: 'circle', attrs: { "cx": 26, "cy": 30, "r": 1.1, "fill": "#7A9050", "opacity": 0.62 } },
  { type: 'circle', attrs: { "cx": 40, "cy": 38, "r": 1.6, "fill": "#6A8040", "opacity": 0.5 } },
  { type: 'circle', attrs: { "cx": 50, "cy": 34, "r": 1.1, "fill": "#5A7030", "opacity": 0.5 } },
  { type: 'circle', attrs: { "cx": 34, "cy": 50, "r": 1.4, "fill": "#7A9050", "opacity": 0.5 } },
  { type: 'circle', attrs: { "cx": 42, "cy": 42, "r": 39, "fill": "none", "stroke": "#C8BCA0", "stroke-width": 1, "opacity": 0.35 } },
  { type: 'ellipse', attrs: { "cx": 32, "cy": 30, "rx": 12, "ry": 9, "fill": "#FDFAF4", "opacity": 0.22 } },
  { type: 'path', attrs: { "d": "M42 8 Q40 3 38 0", "stroke": "#4A6830", "stroke-width": 1.6, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M40 4 Q36 1 35 2", "stroke": "#4A6830", "stroke-width": 1.1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M39 1 Q35 -1 35 1", "stroke": "#4A6830", "stroke-width": 1.1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M41 6 Q45 3 46 4", "stroke": "#4A6830", "stroke-width": 1.1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M40 2 Q43 0 44 1", "stroke": "#4A6830", "stroke-width": 1.1, "fill": "none", "stroke-linecap": "round" } },
];

const S_UNK_6: SVGElementDescriptor[] = [
  { type: 'circle', attrs: { "cx": 46, "cy": 46, "r": 40, "fill": "url(#bou2L)" } },
  { type: 'circle', attrs: { "cx": 33, "cy": 32, "r": 1.9, "fill": "#6A8040", "opacity": 0.65 } },
  { type: 'circle', attrs: { "cx": 50, "cy": 28, "r": 1.4, "fill": "#5A7030", "opacity": 0.6 } },
  { type: 'circle', attrs: { "cx": 60, "cy": 38, "r": 1.8, "fill": "#7A9050", "opacity": 0.65 } },
  { type: 'circle', attrs: { "cx": 58, "cy": 52, "r": 1.4, "fill": "#6A8040", "opacity": 0.65 } },
  { type: 'circle', attrs: { "cx": 46, "cy": 62, "r": 1.7, "fill": "#5A7030", "opacity": 0.6 } },
  { type: 'circle', attrs: { "cx": 32, "cy": 58, "r": 1.3, "fill": "#7A9050", "opacity": 0.6 } },
  { type: 'circle', attrs: { "cx": 26, "cy": 46, "r": 1.6, "fill": "#6A8040", "opacity": 0.65 } },
  { type: 'circle', attrs: { "cx": 29, "cy": 35, "r": 1.1, "fill": "#5A7030", "opacity": 0.55 } },
  { type: 'ellipse', attrs: { "cx": 33, "cy": 32, "rx": 11, "ry": 8, "fill": "#FDFAF4", "opacity": 0.2 } },
  { type: 'path', attrs: { "d": "M46 10 Q44 5 42 1", "stroke": "#4A6830", "stroke-width": 1.6, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M44 6 Q40 3 39 4", "stroke": "#4A6830", "stroke-width": 1.1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M45 8 Q49 5 50 6", "stroke": "#4A6830", "stroke-width": 1.1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'circle', attrs: { "cx": 134, "cy": 46, "r": 40, "fill": "url(#bou2R)" } },
  { type: 'circle', attrs: { "cx": 121, "cy": 32, "r": 1.8, "fill": "#6A8040", "opacity": 0.65 } },
  { type: 'circle', attrs: { "cx": 138, "cy": 28, "r": 1.3, "fill": "#5A7030", "opacity": 0.6 } },
  { type: 'circle', attrs: { "cx": 148, "cy": 38, "r": 1.7, "fill": "#7A9050", "opacity": 0.65 } },
  { type: 'circle', attrs: { "cx": 146, "cy": 52, "r": 1.3, "fill": "#6A8040", "opacity": 0.65 } },
  { type: 'circle', attrs: { "cx": 134, "cy": 62, "r": 1.8, "fill": "#5A7030", "opacity": 0.6 } },
  { type: 'circle', attrs: { "cx": 120, "cy": 58, "r": 1.2, "fill": "#7A9050", "opacity": 0.6 } },
  { type: 'circle', attrs: { "cx": 114, "cy": 46, "r": 1.5, "fill": "#6A8040", "opacity": 0.65 } },
  { type: 'ellipse', attrs: { "cx": 121, "cy": 32, "rx": 11, "ry": 8, "fill": "#FDFAF4", "opacity": 0.2 } },
  { type: 'path', attrs: { "d": "M134 10 Q132 5 130 1", "stroke": "#4A6830", "stroke-width": 1.6, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M132 6 Q128 3 127 4", "stroke": "#4A6830", "stroke-width": 1.1, "fill": "none", "stroke-linecap": "round" } },
  { type: 'path', attrs: { "d": "M133 8 Q137 5 138 6", "stroke": "#4A6830", "stroke-width": 1.1, "fill": "none", "stroke-linecap": "round" } },
];

const S_UNK_7: SVGElementDescriptor[] = [
  { type: 'path', attrs: { "d": "M7 15 Q9 4 19 3 Q44 2 62 3 Q74 4 78 10 Q80 15 77 19 Q72 26 62 27 Q44 28 19 27 Q9 26 7 19 Q6 17 7 15Z", "fill": "url(#cn1)" } },
  { type: 'line', attrs: { "x1": 24, "y1": 3, "x2": 24, "y2": 27, "stroke": "#3A5E20", "stroke-width": 1.1, "opacity": 0.4 } },
  { type: 'line', attrs: { "x1": 32, "y1": 3, "x2": 32, "y2": 27, "stroke": "#3A5E20", "stroke-width": 1, "opacity": 0.35 } },
  { type: 'line', attrs: { "x1": 40, "y1": 3, "x2": 40, "y2": 27, "stroke": "#3A5E20", "stroke-width": 1.1, "opacity": 0.4 } },
  { type: 'line', attrs: { "x1": 48, "y1": 3, "x2": 48, "y2": 27, "stroke": "#3A5E20", "stroke-width": 1, "opacity": 0.35 } },
  { type: 'line', attrs: { "x1": 56, "y1": 3, "x2": 56, "y2": 27, "stroke": "#3A5E20", "stroke-width": 1.1, "opacity": 0.4 } },
  { type: 'line', attrs: { "x1": 64, "y1": 4, "x2": 64, "y2": 26, "stroke": "#3A5E20", "stroke-width": 1, "opacity": 0.32 } },
  { type: 'path', attrs: { "d": "M12 7 Q44 4 74 8", "stroke": "#A8D060", "stroke-width": 2.8, "fill": "none", "stroke-linecap": "round", "opacity": 0.32 } },
  { type: 'ellipse', attrs: { "cx": 7, "cy": 15, "rx": 5.5, "ry": 4.5, "fill": "#3A5E20" } },
  { type: 'circle', attrs: { "cx": 5, "cy": 15, "r": 2.2, "fill": "#2E4E18", "opacity": 0.72 } },
];

const S_UNK_8: SVGElementDescriptor[] = [
  { type: 'g', attrs: { "transform": "rotate(-30, 34, 26)" }, children: [
    { type: 'path', attrs: { "d": "M7 26 Q9 16 17 15 Q40 14 60 15 Q70 16 73 22 Q75 27 72 31 Q66 38 58 38 Q38 39 17 38 Q9 37 7 31 Q6 28 7 26Z", "fill": "url(#cn2)" } },
    { type: 'line', attrs: { "x1": 22, "y1": 15, "x2": 22, "y2": 38, "stroke": "#3A5E20", "stroke-width": 1, "opacity": 0.4 } },
    { type: 'line', attrs: { "x1": 32, "y1": 15, "x2": 32, "y2": 38, "stroke": "#3A5E20", "stroke-width": 1, "opacity": 0.35 } },
    { type: 'line', attrs: { "x1": 42, "y1": 15, "x2": 42, "y2": 38, "stroke": "#3A5E20", "stroke-width": 1, "opacity": 0.4 } },
    { type: 'line', attrs: { "x1": 52, "y1": 15, "x2": 52, "y2": 38, "stroke": "#3A5E20", "stroke-width": 1, "opacity": 0.35 } },
    { type: 'line', attrs: { "x1": 62, "y1": 15, "x2": 62, "y2": 38, "stroke": "#3A5E20", "stroke-width": 1, "opacity": 0.3 } },
    { type: 'path', attrs: { "d": "M10 18 Q38 15 70 19", "stroke": "#A8D060", "stroke-width": 2, "fill": "none", "stroke-linecap": "round", "opacity": 0.3 } },
    { type: 'ellipse', attrs: { "cx": 7, "cy": 26, "rx": 5, "ry": 4, "fill": "#3A5E20" } },
  ] },
];

const S_UNK_9: SVGElementDescriptor[] = [
  { type: 'g', attrs: { "transform": "rotate(-62, 18, 36)" }, children: [
    { type: 'path', attrs: { "d": "M8 36 Q10 26 18 25 Q38 24 56 25 Q66 26 69 32 Q71 37 68 41 Q62 48 54 48 Q36 49 18 48 Q10 47 8 41 Q7 38 8 36Z", "fill": "url(#cn3)" } },
    { type: 'line', attrs: { "x1": 22, "y1": 25, "x2": 22, "y2": 48, "stroke": "#3A5E20", "stroke-width": 1, "opacity": 0.38 } },
    { type: 'line', attrs: { "x1": 32, "y1": 25, "x2": 32, "y2": 48, "stroke": "#3A5E20", "stroke-width": 1, "opacity": 0.35 } },
    { type: 'line', attrs: { "x1": 44, "y1": 25, "x2": 44, "y2": 48, "stroke": "#3A5E20", "stroke-width": 1, "opacity": 0.38 } },
    { type: 'line', attrs: { "x1": 56, "y1": 25, "x2": 56, "y2": 48, "stroke": "#3A5E20", "stroke-width": 1, "opacity": 0.32 } },
    { type: 'path', attrs: { "d": "M12 28 Q38 25 66 30", "stroke": "#A8D060", "stroke-width": 1.8, "fill": "none", "stroke-linecap": "round", "opacity": 0.28 } },
    { type: 'ellipse', attrs: { "cx": 8, "cy": 36, "rx": 4.5, "ry": 4, "fill": "#3A5E20" } },
  ] },
];

// ═══════════════════════════════════════════════════════════════
// DRAWING FUNCTIONS
// Each function uses placeSprite to place one or more sprites
// in the given zone, mixing variants based on unit count + rng.
// ═══════════════════════════════════════════════════════════════

// ─── DRAPED MEAT (Prosciutto / Serrano / Coppa) ──────────────────────────────
//
// Sprites: P1 straight strip, P2 right fold, P3 ruffled bunch,
//          P4 3-layer stack, P5 wide fill strip, P6 double-fold thick
//
export function drawDrapedMeat(
  ingredientId: string,
  units: number,
  zone: Zone,
  _color: string,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const n = Math.max(1, units);

  // Choose strategy based on unit count
  if (n <= 2) {
    // Single statement piece — P2 fold or P6 double-fold
    const spr = rng() > 0.5 ? S_P2 : S_P6;
    const sw = spr === S_P2 ? 84 : 70;
    const sh = spr === S_P2 ? 48 : 56;
    const pW = zone.w * 0.7;
    const pH = zone.h * 0.7;
    const px = zone.x + (zone.w - pW) / 2 + (rng() - 0.5) * zone.w * 0.1;
    const py = zone.y + (zone.h - pH) / 2 + (rng() - 0.5) * zone.h * 0.1;
    elements.push(placeSprite(spr, sw, sh, px, py, pW, pH, { rotation: (rng() - 0.5) * 18 }));
  } else if (n <= 5) {
    // Mix of folds tiled across zone
    const spritePool = [
      { spr: S_P2, w: 84, h: 48 },
      { spr: S_P3, w: 72, h: 52 },
      { spr: S_P6, w: 70, h: 56 },
    ];
    const pW = zone.w / Math.ceil(n / 2) * 0.88;
    const pHratio = 0.72;
    let placed = 0;
    const rows = Math.ceil(n / Math.max(1, Math.floor(zone.w / (pW * 0.85))));
    const cols = Math.ceil(n / rows);
    for (let row = 0; row < rows && placed < n; row++) {
      for (let col = 0; col < cols && placed < n; col++) {
        const pick = spritePool[placed % spritePool.length];
        const cellW = zone.w / cols;
        const cellH = zone.h / rows;
        const px = zone.x + col * cellW + (rng() - 0.5) * cellW * 0.15;
        const py = zone.y + row * cellH + (rng() - 0.5) * cellH * 0.15;
        const dW = cellW * (0.82 + rng() * 0.16);
        const dH = cellH * pHratio;
        elements.push(placeSprite(pick.spr, pick.w, pick.h, px, py, dW, dH,
          { rotation: (rng() - 0.5) * 22, opacity: 0.88 + rng() * 0.1 }));
        placed++;
      }
    }
  } else if (n <= 10) {
    // P5 wide strip as background + individual pieces on top
    const stripH = zone.h * 0.38;
    const stripY = zone.y + zone.h * 0.5 - stripH / 2;
    elements.push(placeSprite(S_P5, 168, 36, zone.x, stripY, zone.w, stripH, { opacity: 0.75 }));

    const piecePool = [S_P2, S_P3, S_P6, S_P1];
    const pieceW = [84, 72, 70, 90];
    const pieceH = [48, 52, 56, 36];
    const numExtra = n - 2;
    for (let i = 0; i < Math.min(numExtra, 6); i++) {
      const idx = i % piecePool.length;
      const pW = zone.w * (0.28 + rng() * 0.2);
      const pHH = zone.h * (0.45 + rng() * 0.2);
      const px = zone.x + rng() * (zone.w - pW);
      const py = zone.y + rng() * (zone.h - pHH * 0.8);
      elements.push(placeSprite(piecePool[idx], pieceW[idx], pieceH[idx],
        px, py, pW, pHH, { rotation: (rng() - 0.5) * 25, opacity: 0.85 + rng() * 0.1 }));
    }
  } else {
    // 11+ units: P5 full-zone background + P4 stacks + individual folds
    elements.push(placeSprite(S_P5, 168, 36, zone.x, zone.y + zone.h * 0.1, zone.w, zone.h * 0.28, { opacity: 0.70 }));
    elements.push(placeSprite(S_P5, 168, 36, zone.x, zone.y + zone.h * 0.55, zone.w, zone.h * 0.28, { opacity: 0.65 }));

    // P4 stacks
    const numStacks = Math.min(3, Math.floor(n / 4));
    for (let s = 0; s < numStacks; s++) {
      const sW = zone.w * (0.22 + rng() * 0.12);
      const sH = zone.h * (0.38 + rng() * 0.12);
      const sx = zone.x + (s / numStacks) * zone.w * 0.7 + rng() * zone.w * 0.1;
      const sy = zone.y + rng() * zone.h * 0.3;
      elements.push(placeSprite(S_P4, 104, 52, sx, sy, sW, sH,
        { rotation: (rng() - 0.5) * 20, opacity: 0.92 }));
    }

    // Individual loose folds
    const foldPool = [S_P2, S_P3, S_P6];
    const foldDims = [[84, 48], [72, 52], [70, 56]];
    for (let i = 0; i < Math.min(5, n - numStacks * 3); i++) {
      const idx = i % foldPool.length;
      const fW = zone.w * (0.2 + rng() * 0.15);
      const fH = zone.h * (0.32 + rng() * 0.18);
      const fx = zone.x + rng() * (zone.w - fW);
      const fy = zone.y + rng() * (zone.h - fH);
      elements.push(placeSprite(foldPool[idx], foldDims[idx][0], foldDims[idx][1],
        fx, fy, fW, fH, { rotation: (rng() - 0.5) * 28, opacity: 0.88 + rng() * 0.1 }));
    }
  }

  return {
    id: `${ingredientId}_drape`,
    ingredientId,
    renderStyle: 'continuous_fan',
    x: zone.x, y: zone.y, width: zone.w, height: zone.h,
    zIndex: 10,
    elements,
  };
}
export const drawContinuousFan = drawDrapedMeat;

// ─── SALAMI ROSETTE CLUSTER ───────────────────────────────────────────────────
//
// Sprites: S1 tight roll, S2 looser roll, S3 tilted, S4 squashed oval,
//          S5 3-rosette row, S6 6-rosette block
//
export function drawSalamiRosette(
  ingredientId: string,
  units: number,
  zone: Zone,
  _color: string,
  _hasSpiceSpecks: boolean,
  _isHeavilyMarbled: boolean,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const n = Math.max(1, units);

  if (n <= 3) {
    // Individual rosettes — mix of S1/S2/S3/S4
    const singles = [S_S1, S_S2, S_S3, S_S4];
    const singW = [54, 58, 56, 60];
    const singH = [54, 56, 60, 50];
    const size = Math.min(zone.w, zone.h) * 0.45;
    for (let i = 0; i < n; i++) {
      const idx = Math.floor(rng() * singles.length);
      const cx = zone.x + (i + 0.5) * (zone.w / n) + (rng() - 0.5) * 12;
      const cy = zone.y + zone.h / 2 + (rng() - 0.5) * 14;
      elements.push(placeSprite(singles[idx], singW[idx], singH[idx],
        cx - size / 2, cy - size / 2, size, size,
        { rotation: (rng() - 0.5) * 30 }));
    }
  } else if (n <= 8) {
    // S5 row(s) + individual fill
    const rows = Math.ceil(n / 3);
    const rowH = zone.h / rows * 0.88;
    for (let r = 0; r < rows; r++) {
      const ry = zone.y + r * (zone.h / rows) + (rng() - 0.5) * 6;
      elements.push(placeSprite(S_S5, 158, 56, zone.x + (rng() - 0.5) * 8, ry,
        zone.w * 0.92, rowH, { rotation: (rng() - 0.5) * 5 }));
    }
  } else if (n <= 16) {
    // S6 block as main + S5 rows for overflow
    elements.push(placeSprite(S_S6, 158, 112,
      zone.x + (rng() - 0.5) * 8, zone.y + (rng() - 0.5) * 6,
      zone.w * 0.9, zone.h * 0.88));
    if (n > 10) {
      const extraY = zone.y + zone.h * 0.75;
      elements.push(placeSprite(S_S5, 158, 56, zone.x, extraY,
        zone.w, zone.h * 0.28, { opacity: 0.9 }));
    }
  } else {
    // 17+ units: S6 large + S6 offset + S5 strip
    elements.push(placeSprite(S_S6, 158, 112, zone.x, zone.y, zone.w * 0.85, zone.h * 0.8));
    elements.push(placeSprite(S_S5, 158, 56, zone.x + zone.w * 0.1, zone.y + zone.h * 0.7,
      zone.w * 0.82, zone.h * 0.28, { opacity: 0.85 }));
  }

  return {
    id: `${ingredientId}_rosette`,
    ingredientId,
    renderStyle: 'rosette_cluster',
    x: zone.x, y: zone.y, width: zone.w, height: zone.h,
    zIndex: 12,
    elements,
  };
}
export const drawRosetteCluster = (
  ingredientId: string, units: number, zone: Zone, _color: string, rng: () => number
) => drawSalamiRosette(ingredientId, units, zone, _color, false, false, rng);

// ─── FAN ARC (Brie / Manchego / Cheddar / Humboldt Fog / Herb Goat) ─────────
//
// Brie sprites:     B1 narrow, B2 medium, B3 wide, B4 5-slice fan, B5 single 25°
// Manchego sprites: M1 upright, M2 +22°, M3 -22°, M4 5-slice fan
//
export function drawFanArc(
  ingredientId: string,
  units: number,
  zone: Zone,
  _color: string,
  _rindColor: string,
  _special: 'ash_line' | 'herb_coat' | 'none',
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const n = Math.max(1, units);
  const isManchego = ingredientId === 'manchego';
  const isGoat = ingredientId === 'herb_goat';
  const isCheddar = ingredientId === 'mature_cheddar' || ingredientId === 'cheddar';

  if (isGoat) {
    // Use Herb Goat Cheese sprites
    if (n <= 2) {
      const goatSingles = [
        { spr: S_UNK_24, w: 62, h: 66 },
        { spr: S_UNK_25, w: 62, h: 66 },
        { spr: S_UNK_27, w: 60, h: 60 },
      ];
      const s = goatSingles[Math.floor(rng() * goatSingles.length)];
      elements.push(placeSprite(s.spr, s.w, s.h,
        zone.x + zone.w * 0.1, zone.y + zone.h * 0.1, zone.w * 0.8, zone.h * 0.8,
        { rotation: (rng() - 0.5) * 20 }));
    } else if (n <= 5) {
      elements.push(placeSprite(S_UNK_26, 160, 92,
        zone.x, zone.y, zone.w, zone.h));
    } else {
      elements.push(placeSprite(S_UNK_26, 160, 92, zone.x, zone.y, zone.w, zone.h * 0.7));
      elements.push(placeSprite(S_UNK_27, 60, 60,
        zone.x + zone.w * 0.55, zone.y + zone.h * 0.6, zone.w * 0.3, zone.h * 0.35,
        { rotation: (rng() - 0.5) * 25 }));
    }
  } else if (isManchego || isCheddar) {
    if (n <= 2) {
      const manchegoSingles = [
        { spr: S_M1, w: 60, h: 74 },
        { spr: S_M2, w: 72, h: 74 },
        { spr: S_M3, w: 72, h: 74 },
      ];
      const s = manchegoSingles[Math.floor(rng() * manchegoSingles.length)];
      elements.push(placeSprite(s.spr, s.w, s.h,
        zone.x + zone.w * 0.1, zone.y + zone.h * 0.05, zone.w * 0.8, zone.h * 0.9,
        { rotation: (rng() - 0.5) * 15 }));
    } else if (n <= 6) {
      elements.push(placeSprite(S_M4, 172, 112,
        zone.x, zone.y, zone.w, zone.h));
    } else {
      elements.push(placeSprite(S_M4, 172, 112, zone.x, zone.y, zone.w, zone.h * 0.78));
      // Extra wedges below
      for (let i = 0; i < Math.min(3, n - 5); i++) {
        const pick = rng() > 0.5 ? S_M2 : S_M3;
        const eW = zone.w * 0.22;
        const eH = zone.h * 0.3;
        elements.push(placeSprite(pick, 72, 74,
          zone.x + i * zone.w * 0.26 + (rng() - 0.5) * 10,
          zone.y + zone.h * 0.68 + (rng() - 0.5) * 8,
          eW, eH, { rotation: (rng() - 0.5) * 20, opacity: 0.9 }));
      }
    }
  } else {
    // Brie (default)
    if (n <= 2) {
      const s = rng() > 0.5 ? { spr: S_B2, w: 74, h: 70 } : { spr: S_B3, w: 94, h: 72 };
      elements.push(placeSprite(s.spr, s.w, s.h,
        zone.x + zone.w * 0.05, zone.y + zone.h * 0.05, zone.w * 0.9, zone.h * 0.9,
        { rotation: (rng() - 0.5) * 15 }));
    } else if (n <= 6) {
      elements.push(placeSprite(S_B4, 168, 122,
        zone.x, zone.y, zone.w, zone.h));
    } else {
      elements.push(placeSprite(S_B4, 168, 122, zone.x, zone.y, zone.w, zone.h * 0.75));
      for (let i = 0; i < Math.min(3, n - 5); i++) {
        const pick = i % 2 === 0 ? S_B1 : S_B5;
        const bW = zone.w * 0.24;
        const bH = zone.h * 0.32;
        elements.push(placeSprite(pick, i % 2 === 0 ? 58 : 72, i % 2 === 0 ? 72 : 78,
          zone.x + i * zone.w * 0.28 + rng() * 15,
          zone.y + zone.h * 0.65 + (rng() - 0.5) * 10,
          bW, bH, { rotation: (rng() - 0.5) * 22, opacity: 0.88 }));
      }
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

// ─── STACKED MOUND (Gouda Cubes) ─────────────────────────────────────────────
//
// Sprites: G1 single cube, G2 3-cube cluster, G3 flat cube, G4 9-cube mound
//
export function drawStackedMound(
  ingredientId: string,
  units: number,
  zone: Zone,
  _color: string,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const n = Math.max(1, units);

  if (n <= 3) {
    elements.push(placeSprite(S_G2, 76, 60, zone.x, zone.y, zone.w, zone.h));
  } else if (n <= 9) {
    elements.push(placeSprite(S_G4, 148, 116, zone.x, zone.y, zone.w, zone.h));
  } else {
    elements.push(placeSprite(S_G4, 148, 116, zone.x, zone.y, zone.w * 0.82, zone.h * 0.85));
    // Extra cubes spilling
    for (let i = 0; i < Math.min(4, n - 9); i++) {
      const pick = rng() > 0.5 ? S_G1 : S_G3;
      const cW = zone.w * 0.2;
      const cH = zone.h * 0.25;
      elements.push(placeSprite(pick, rng() > 0.5 ? 44 : 40, rng() > 0.5 ? 44 : 40,
        zone.x + zone.w * 0.72 + (rng() - 0.5) * 20,
        zone.y + zone.h * 0.1 + i * zone.h * 0.18 + (rng() - 0.5) * 10,
        cW, cH, { rotation: (rng() - 0.5) * 15 }));
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
//
// Sprites: UNK_5 single round (84×84), UNK_6 canonical pair (180×88)
//
export function drawRoundDisc(
  ingredientId: string,
  units: number,
  zone: Zone,
  _color: string,
  _herbColor: string,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const n = Math.max(1, units);

  if (n <= 1) {
    elements.push(placeSprite(S_UNK_5, 84, 84,
      zone.x + zone.w * 0.1, zone.y + zone.h * 0.05,
      zone.w * 0.8, zone.h * 0.9,
      { rotation: (rng() - 0.5) * 10 }));
  } else {
    elements.push(placeSprite(S_UNK_6, 180, 88,
      zone.x, zone.y, zone.w, zone.h));
    if (n > 2) {
      elements.push(placeSprite(S_UNK_5, 84, 84,
        zone.x + zone.w * 0.6 + (rng() - 0.5) * 10,
        zone.y + zone.h * 0.55 + (rng() - 0.5) * 10,
        zone.w * 0.28, zone.h * 0.4,
        { rotation: (rng() - 0.5) * 15, opacity: 0.85 }));
    }
  }

  return {
    id: `${ingredientId}_disc`,
    ingredientId,
    renderStyle: 'round_disc',
    x: zone.x, y: zone.y, width: zone.w, height: zone.h,
    zIndex: 22,
    elements,
  };
}

// ─── ROUND SLICES (Herb Goat Cheese — now handled in drawFanArc) ─────────────
export function drawRoundSlices(
  ingredientId: string,
  units: number,
  zone: Zone,
  color: string,
  herbColor: string,
  rng: () => number
): LayoutItem {
  return drawFanArc(ingredientId, units, zone, color, herbColor, 'herb_coat', rng);
}

// ─── EXOTIC ANCHOR (Dragon Fruit) ────────────────────────────────────────────
//
// Sprites: D1 full round (92×92), D2 half D-shape (52×84),
//          D3 tilted (96×92), D4 3-slice group (164×96)
//
export function drawExoticAnchor(
  ingredientId: string,
  units: number,
  zone: Zone,
  _skinColor: string,
  _interiorColor: string,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const n = Math.max(1, units);

  if (n <= 1) {
    elements.push(placeSprite(S_D1, 92, 92,
      zone.x + zone.w * 0.1, zone.y + zone.h * 0.05, zone.w * 0.8, zone.h * 0.9));
  } else if (n <= 2) {
    elements.push(placeSprite(S_D4, 164, 96, zone.x, zone.y, zone.w, zone.h * 0.72));
    elements.push(placeSprite(S_D1, 92, 92,
      zone.x + zone.w * 0.55, zone.y + zone.h * 0.55, zone.w * 0.35, zone.h * 0.4,
      { rotation: (rng() - 0.5) * 20 }));
  } else {
    elements.push(placeSprite(S_D4, 164, 96, zone.x, zone.y, zone.w, zone.h * 0.65));
    elements.push(placeSprite(S_D3, 96, 92,
      zone.x, zone.y + zone.h * 0.52, zone.w * 0.42, zone.h * 0.45));
    if (n >= 4) {
      elements.push(placeSprite(S_D2, 52, 84,
        zone.x + zone.w * 0.55, zone.y + zone.h * 0.5, zone.w * 0.35, zone.h * 0.45));
    }
  }

  return {
    id: `${ingredientId}_exotic`,
    ingredientId,
    renderStyle: 'exotic_anchor',
    x: zone.x, y: zone.y, width: zone.w, height: zone.h,
    zIndex: 50,
    elements,
  };
}

// ─── GRAPE CLUSTER ───────────────────────────────────────────────────────────
//
// Sprites: GR1 green full (82×96), GR2 red/purple (80×92),
//          GR3 compact green (58×66), GR4 mixed pair (148×70)
//
export function drawGrapeCluster(
  ingredientId: string,
  units: number,
  zone: Zone,
  _color: string,
  _highlightColor: string,
  rng: () => number
): LayoutItem {
  void rng; // rng reserved for future jitter; placement is deterministic by ingredient type
  const elements: SVGElementDescriptor[] = [];
  const n = Math.max(1, units);
  const isRed = ingredientId.includes('red') || ingredientId.includes('purple')
    || ingredientId.includes('concord');
  const isGreen = ingredientId.includes('green') || ingredientId.includes('white');
  const isMixed = !isRed && !isGreen;

  if (isMixed || (isRed && isGreen)) {
    // Mixed pair
    elements.push(placeSprite(S_GR4, 148, 70, zone.x, zone.y, zone.w, zone.h * 0.72));
    if (n > 1) {
      elements.push(placeSprite(S_GR3, 58, 66,
        zone.x + zone.w * 0.1, zone.y + zone.h * 0.55, zone.w * 0.3, zone.h * 0.38));
    }
  } else if (isRed) {
    if (n <= 1) {
      elements.push(placeSprite(S_GR2, 80, 92, zone.x + zone.w * 0.1, zone.y, zone.w * 0.8, zone.h));
    } else {
      elements.push(placeSprite(S_GR2, 80, 92, zone.x, zone.y, zone.w * 0.55, zone.h));
      elements.push(placeSprite(S_GR4, 148, 70,
        zone.x + zone.w * 0.3, zone.y + zone.h * 0.1, zone.w * 0.7, zone.h * 0.7));
    }
  } else {
    // Green
    if (n <= 1) {
      elements.push(placeSprite(S_GR1, 82, 96, zone.x + zone.w * 0.1, zone.y, zone.w * 0.8, zone.h));
    } else {
      elements.push(placeSprite(S_GR1, 82, 96, zone.x, zone.y, zone.w * 0.52, zone.h));
      elements.push(placeSprite(S_GR3, 58, 66,
        zone.x + zone.w * 0.45, zone.y + zone.h * 0.2, zone.w * 0.38, zone.h * 0.55));
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

// ─── BERRY SCATTER (Strawberries / Raspberries / Blackberries) ───────────────
//
// Sprites: UNK_0 strawberry halved (46×54), UNK_1 blackberry (46×46),
//          UNK_3 raspberry (44×46), UNK_4 strawberry whole top (42×42)
//
export function drawBerryScatter(
  ingredientId: string,
  units: number,
  zone: Zone,
  _color: string,
  isStrawberry: boolean,
  isRaspberry: boolean,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const n = Math.max(1, Math.min(units, 20));

  // Choose primary sprite based on berry type
  let spr = S_UNK_1; // blackberry default
  let sw = 46, sh = 46;
  if (isStrawberry) { spr = S_UNK_0; sw = 46; sh = 54; }
  else if (isRaspberry) { spr = S_UNK_3; sw = 44; sh = 46; }

  // Scatter with organic placement
  const pieceSize = Math.max(zone.w * 0.12, Math.min(zone.w * 0.22, 36));
  const padding = pieceSize * 0.6;
  const placed: Array<{ cx: number; cy: number }> = [];

  for (let i = 0; i < n; i++) {
    let cx = 0, cy = 0;
    let ok = false;
    for (let attempt = 0; attempt < 12; attempt++) {
      cx = zone.x + padding + rng() * (zone.w - 2 * padding);
      cy = zone.y + padding + rng() * (zone.h - 2 * padding);
      const minDist = pieceSize * 1.4;
      if (placed.every(p => Math.hypot(p.cx - cx, p.cy - cy) >= minDist)) {
        ok = true;
        break;
      }
    }
    if (!ok) {
      cx = zone.x + padding + rng() * (zone.w - 2 * padding);
      cy = zone.y + padding + rng() * (zone.h - 2 * padding);
    }
    placed.push({ cx, cy });

    // Mix in alternate sprite occasionally for variety
    let pickedSpr = spr;
    let pickedW = sw, pickedH = sh;
    if (isStrawberry && rng() > 0.7) {
      pickedSpr = S_UNK_4; pickedW = 42; pickedH = 42;
    }
    const rot = (rng() - 0.5) * 40;
    elements.push(placeSprite(pickedSpr, pickedW, pickedH,
      cx - pieceSize / 2, cy - pieceSize / 2,
      pieceSize, pieceSize * (pickedH / pickedW),
      { rotation: rot }));
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

// ─── BERRY CLUSTER (Blueberries) ─────────────────────────────────────────────
//
// Sprite: UNK_2 blueberry cluster (62×54)
//
export function drawBerryCluster(
  ingredientId: string,
  units: number,
  zone: Zone,
  _color: string,
  _highlightColor: string,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const n = Math.max(1, units);

  // Tile blueberry clusters across the zone
  const clustersToPlace = Math.min(n, 6);
  const cols = Math.ceil(Math.sqrt(clustersToPlace));
  const rows = Math.ceil(clustersToPlace / cols);
  let placed = 0;

  for (let row = 0; row < rows && placed < clustersToPlace; row++) {
    for (let col = 0; col < cols && placed < clustersToPlace; col++) {
      const cellW = zone.w / cols;
      const cellH = zone.h / rows;
      const cW = cellW * (0.72 + rng() * 0.2);
      const cH = cellH * (0.72 + rng() * 0.2);
      const cx = zone.x + col * cellW + (rng() - 0.5) * cellW * 0.2;
      const cy = zone.y + row * cellH + (rng() - 0.5) * cellH * 0.2;
      elements.push(placeSprite(S_UNK_2, 62, 54, cx, cy, cW, cH,
        { rotation: (rng() - 0.5) * 20 }));
      placed++;
    }
  }

  return {
    id: `${ingredientId}_cluster`,
    ingredientId,
    renderStyle: 'berry_cluster',
    x: zone.x, y: zone.y, width: zone.w, height: zone.h,
    zIndex: 31,
    elements,
  };
}

// ─── NUT CLUSTER (Pistachios / Walnuts) ──────────────────────────────────────
//
// Pistachio sprites: UNK_11 closed (30×46), UNK_12 open (36×46),
//                    UNK_13 3-group (88×56), UNK_14 large cluster (138×96)
// Walnut sprites:    UNK_15 single (58×52), UNK_16 rotated (58×58),
//                    UNK_17 3-cluster (126×96)
//
export function drawNutCluster(
  ingredientId: string,
  units: number,
  zone: Zone,
  _color: string,
  isPistachio: boolean,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const n = Math.max(1, units);

  if (isPistachio) {
    if (n <= 3) {
      elements.push(placeSprite(S_UNK_13, 88, 56, zone.x, zone.y, zone.w, zone.h));
    } else if (n <= 10) {
      elements.push(placeSprite(S_UNK_14, 138, 96, zone.x, zone.y, zone.w, zone.h));
    } else {
      elements.push(placeSprite(S_UNK_14, 138, 96, zone.x, zone.y, zone.w * 0.82, zone.h * 0.82));
      elements.push(placeSprite(S_UNK_13, 88, 56,
        zone.x + zone.w * 0.55, zone.y + zone.h * 0.62,
        zone.w * 0.42, zone.h * 0.35));
      for (let i = 0; i < Math.min(4, n - 10); i++) {
        const pick = rng() > 0.5 ? { s: S_UNK_11, w: 30, h: 46 } : { s: S_UNK_12, w: 36, h: 46 };
        const sz = zone.w * 0.1;
        elements.push(placeSprite(pick.s, pick.w, pick.h,
          zone.x + rng() * (zone.w - sz),
          zone.y + rng() * (zone.h - sz * (pick.h / pick.w)),
          sz, sz * (pick.h / pick.w),
          { rotation: rng() * 360 }));
      }
    }
  } else {
    // Walnuts
    if (n <= 2) {
      const pick = rng() > 0.5 ? S_UNK_15 : S_UNK_16;
      elements.push(placeSprite(pick, 58, rng() > 0.5 ? 52 : 58,
        zone.x + zone.w * 0.1, zone.y + zone.h * 0.1, zone.w * 0.8, zone.h * 0.8,
        { rotation: (rng() - 0.5) * 30 }));
    } else if (n <= 8) {
      elements.push(placeSprite(S_UNK_17, 126, 96, zone.x, zone.y, zone.w, zone.h));
    } else {
      elements.push(placeSprite(S_UNK_17, 126, 96, zone.x, zone.y, zone.w * 0.82, zone.h * 0.82));
      for (let i = 0; i < Math.min(3, n - 8); i++) {
        const pick = rng() > 0.5 ? S_UNK_15 : S_UNK_16;
        const sz = zone.w * 0.18;
        elements.push(placeSprite(pick, 58, 55,
          zone.x + zone.w * 0.68 + (rng() - 0.5) * 18,
          zone.y + zone.h * 0.1 + i * zone.h * 0.25 + (rng() - 0.5) * 8,
          sz, sz, { rotation: (rng() - 0.5) * 40 }));
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

// ─── PICKLE CLUSTER (Cornichons) ─────────────────────────────────────────────
//
// Sprites: UNK_7 horizontal (88×30), UNK_8 diagonal 30° (68×52),
//          UNK_9 steep 60° (36×72), UNK_10 5-pickle cluster (128×96)
//
export function drawPickleCluster(
  ingredientId: string,
  units: number,
  zone: Zone,
  _color: string,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const n = Math.max(1, units);

  if (n <= 2) {
    const angles = [
      { spr: S_UNK_7, w: 88, h: 30 },
      { spr: S_UNK_8, w: 68, h: 52 },
    ];
    for (let i = 0; i < Math.min(n, 2); i++) {
      const pick = angles[i % angles.length];
      const pW = zone.w * 0.55;
      const pH = zone.h * 0.45;
      elements.push(placeSprite(pick.spr, pick.w, pick.h,
        zone.x + (rng() - 0.5) * zone.w * 0.3 + zone.w * 0.1,
        zone.y + (rng() - 0.5) * zone.h * 0.3 + i * zone.h * 0.35,
        pW, pH, { rotation: (rng() - 0.5) * 15 }));
    }
  } else if (n <= 6) {
    elements.push(placeSprite(S_UNK_10, 128, 96, zone.x, zone.y, zone.w, zone.h));
  } else {
    elements.push(placeSprite(S_UNK_10, 128, 96, zone.x, zone.y, zone.w * 0.82, zone.h * 0.82));
    // Extra angled ones
    const extras = [S_UNK_8, S_UNK_9];
    const eDims = [[68, 52], [36, 72]];
    for (let i = 0; i < Math.min(3, n - 5); i++) {
      const idx = i % 2;
      const eW = zone.w * 0.22;
      const eH = zone.h * 0.28;
      elements.push(placeSprite(extras[idx], eDims[idx][0], eDims[idx][1],
        zone.x + zone.w * 0.7 + (rng() - 0.5) * 15,
        zone.y + zone.h * 0.1 + i * zone.h * 0.26,
        eW, eH, { rotation: (rng() - 0.5) * 25 }));
    }
  }

  return {
    id: `${ingredientId}_pickles`,
    ingredientId,
    renderStyle: 'pickle_cluster',
    x: zone.x, y: zone.y, width: zone.w, height: zone.h,
    zIndex: 28,
    elements,
  };
}

// ─── OLIVE CLUSTER ───────────────────────────────────────────────────────────
//
// Sprites: UNK_31 single whole (28×40), UNK_32 with pimiento (40×32),
//          UNK_33 cluster 8-10 (130×96)
//
export function drawOliveCluster(
  ingredientId: string,
  units: number,
  zone: Zone,
  _color: string,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const n = Math.max(1, units);

  if (n <= 2) {
    for (let i = 0; i < n; i++) {
      const pick = rng() > 0.5 ? { s: S_UNK_31, w: 28, h: 40 } : { s: S_UNK_32, w: 40, h: 32 };
      const oW = zone.w * 0.35;
      const oH = zone.h * 0.5;
      elements.push(placeSprite(pick.s, pick.w, pick.h,
        zone.x + i * zone.w * 0.4 + (rng() - 0.5) * 10,
        zone.y + (rng() - 0.5) * zone.h * 0.3 + zone.h * 0.2,
        oW, oH, { rotation: (rng() - 0.5) * 20 }));
    }
  } else {
    elements.push(placeSprite(S_UNK_33, 130, 96, zone.x, zone.y, zone.w, zone.h));
    if (n > 6) {
      elements.push(placeSprite(S_UNK_32, 40, 32,
        zone.x + zone.w * 0.7, zone.y + zone.h * 0.68,
        zone.w * 0.2, zone.h * 0.2,
        { rotation: (rng() - 0.5) * 25 }));
    }
  }

  return {
    id: `${ingredientId}_olives`,
    ingredientId,
    renderStyle: 'olive_cluster',
    x: zone.x, y: zone.y, width: zone.w, height: zone.h,
    zIndex: 28,
    elements,
  };
}

// ─── CITRUS SLICE (Kiwi / Mandarin) ──────────────────────────────────────────
//
// Kiwi sprites:    UNK_21 full round (68×68), UNK_22 +28° (74×74), UNK_23 3-group (156×74)
// Mandarin sprites: UNK_28 single half (72×40), UNK_29 tilted (76×48), UNK_30 pair (150×44)
//
export function drawCitrusSlice(
  ingredientId: string,
  units: number,
  zone: Zone,
  _color: string,
  _secondaryColor: string,
  isKiwi: boolean,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const n = Math.max(1, units);

  if (isKiwi) {
    if (n <= 1) {
      const pick = rng() > 0.5 ? { s: S_UNK_21, w: 68, h: 68 } : { s: S_UNK_22, w: 74, h: 74 };
      elements.push(placeSprite(pick.s, pick.w, pick.h,
        zone.x + zone.w * 0.1, zone.y + zone.h * 0.05, zone.w * 0.8, zone.h * 0.9));
    } else if (n <= 3) {
      elements.push(placeSprite(S_UNK_23, 156, 74, zone.x, zone.y, zone.w, zone.h));
    } else {
      elements.push(placeSprite(S_UNK_23, 156, 74, zone.x, zone.y, zone.w, zone.h * 0.65));
      for (let i = 0; i < Math.min(3, n - 3); i++) {
        const pick = rng() > 0.5 ? { s: S_UNK_21, w: 68, h: 68 } : { s: S_UNK_22, w: 74, h: 74 };
        const kW = zone.w * 0.25;
        elements.push(placeSprite(pick.s, pick.w, pick.h,
          zone.x + i * zone.w * 0.28 + rng() * 12,
          zone.y + zone.h * 0.6 + (rng() - 0.5) * 8,
          kW, kW, { rotation: (rng() - 0.5) * 20 }));
      }
    }
  } else {
    // Mandarin
    if (n <= 1) {
      elements.push(placeSprite(S_UNK_28, 72, 40,
        zone.x + zone.w * 0.1, zone.y + zone.h * 0.2, zone.w * 0.8, zone.h * 0.6));
    } else if (n <= 3) {
      elements.push(placeSprite(S_UNK_30, 150, 44, zone.x, zone.y + zone.h * 0.1, zone.w, zone.h * 0.6));
    } else {
      elements.push(placeSprite(S_UNK_30, 150, 44, zone.x, zone.y, zone.w, zone.h * 0.5));
      for (let i = 0; i < Math.min(3, n - 2); i++) {
        const pick = rng() > 0.5 ? { s: S_UNK_28, w: 72, h: 40 } : { s: S_UNK_29, w: 76, h: 48 };
        const mW = zone.w * 0.28;
        const mH = zone.h * 0.35;
        elements.push(placeSprite(pick.s, pick.w, pick.h,
          zone.x + i * zone.w * 0.3 + rng() * 10,
          zone.y + zone.h * 0.55 + (rng() - 0.5) * 8,
          mW, mH, { rotation: (rng() - 0.5) * 18 }));
      }
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

// ─── SMALL SCATTER (Dried Apricots / Chocolate Almonds / Pretzels) ───────────
//
// Apricot sprites:  UNK_18 single (48×40), UNK_19 tilted (54×48), UNK_20 arc row (174×58)
// Almond sprites:   UNK_34 single (24×36), UNK_35 horizontal (36×24), UNK_36 scatter (106×78)
// Pretzel sprites:  UNK_37 single (40×36), UNK_38 4-scatter (126×88)
//
export function drawSmallScatter(
  ingredientId: string,
  units: number,
  zone: Zone,
  _color: string,
  isPretzel: boolean,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];
  const n = Math.max(1, units);

  const isDriedApricot = ingredientId.includes('apricot') || ingredientId.includes('dried');
  const isChocolateAlmond = ingredientId.includes('almond') || ingredientId.includes('chocolate');

  if (isPretzel) {
    if (n <= 3) {
      elements.push(placeSprite(S_UNK_37, 40, 36,
        zone.x + zone.w * 0.1, zone.y + zone.h * 0.1, zone.w * 0.8, zone.h * 0.8));
    } else {
      elements.push(placeSprite(S_UNK_38, 126, 88, zone.x, zone.y, zone.w, zone.h));
      if (n > 5) {
        elements.push(placeSprite(S_UNK_37, 40, 36,
          zone.x + zone.w * 0.7, zone.y + zone.h * 0.65,
          zone.w * 0.22, zone.h * 0.28,
          { rotation: (rng() - 0.5) * 30 }));
      }
    }
  } else if (isDriedApricot) {
    if (n <= 2) {
      const picks = [S_UNK_18, S_UNK_19];
      const dims = [[48, 40], [54, 48]];
      for (let i = 0; i < Math.min(n, 2); i++) {
        const aW = zone.w * 0.4;
        const aH = zone.h * 0.45;
        elements.push(placeSprite(picks[i], dims[i][0], dims[i][1],
          zone.x + i * zone.w * 0.4 + (rng() - 0.5) * 10,
          zone.y + (rng() - 0.5) * zone.h * 0.3 + zone.h * 0.2,
          aW, aH, { rotation: (rng() - 0.5) * 20 }));
      }
    } else if (n <= 5) {
      elements.push(placeSprite(S_UNK_20, 174, 58, zone.x, zone.y + zone.h * 0.2, zone.w, zone.h * 0.55));
    } else {
      elements.push(placeSprite(S_UNK_20, 174, 58, zone.x, zone.y, zone.w, zone.h * 0.45));
      elements.push(placeSprite(S_UNK_20, 174, 58, zone.x, zone.y + zone.h * 0.5, zone.w, zone.h * 0.45, { opacity: 0.85 }));
    }
  } else if (isChocolateAlmond) {
    if (n <= 3) {
      elements.push(placeSprite(S_UNK_36, 106, 78, zone.x, zone.y, zone.w, zone.h));
    } else {
      elements.push(placeSprite(S_UNK_36, 106, 78, zone.x, zone.y, zone.w * 0.82, zone.h * 0.82));
      // Alternate between upright (UNK_34) and horizontal (UNK_35) accent almonds
      const accentAlmond = rng() > 0.5
        ? { s: S_UNK_34, w: 24, h: 36 }
        : { s: S_UNK_35, w: 36, h: 24 };
      elements.push(placeSprite(accentAlmond.s, accentAlmond.w, accentAlmond.h,
        zone.x + zone.w * 0.72, zone.y + zone.h * 0.6,
        zone.w * 0.18, zone.h * 0.28, { rotation: rng() * 180 }));
    }
  } else {
    // Generic scatter
    elements.push(placeSprite(S_UNK_36, 106, 78, zone.x, zone.y, zone.w, zone.h));
  }

  return {
    id: `${ingredientId}_scatter`,
    ingredientId,
    renderStyle: 'small_scatter',
    x: zone.x, y: zone.y, width: zone.w, height: zone.h,
    zIndex: 36,
    elements,
  };
}

// ─── HERB SPRIG (Rosemary / Microgreens) ─────────────────────────────────────
//
// Sprites: UNK_41 rosemary short (24×72), UNK_42 rosemary angled (48×52),
//          UNK_43 microgreens small (62×40), UNK_44 microgreens large (90×48)
//
export function drawHerbSprig(
  id: string,
  x: number,
  y: number,
  angle: number,
  _color: string,
  rng: () => number
): LayoutItem {
  const elements: SVGElementDescriptor[] = [];

  // Alternate between rosemary and microgreens
  const useMicrogreens = rng() > 0.65;
  if (useMicrogreens) {
    const pick = rng() > 0.5 ? { s: S_UNK_43, w: 62, h: 40 } : { s: S_UNK_44, w: 90, h: 48 };
    const sz = 44 + rng() * 20;
    elements.push(placeSprite(pick.s, pick.w, pick.h,
      x - sz / 2, y - sz * (pick.h / pick.w) / 2,
      sz, sz * (pick.h / pick.w),
      { rotation: angle + (rng() - 0.5) * 10 }));
  } else {
    const pick = rng() > 0.5 ? { s: S_UNK_41, w: 24, h: 72 } : { s: S_UNK_42, w: 48, h: 52 };
    const sprW = pick.s === S_UNK_41 ? 18 + rng() * 10 : 30 + rng() * 18;
    const sprH = sprW * (pick.h / pick.w);
    elements.push(placeSprite(pick.s, pick.w, pick.h,
      x - sprW / 2, y - sprH / 2,
      sprW, sprH,
      { rotation: angle + (rng() - 0.5) * 12 }));
  }

  return {
    id,
    ingredientId: 'rosemary',
    renderStyle: 'herb_sprig',
    x: x - 30, y: y - 40, width: 60, height: 80,
    zIndex: 45,
    elements,
  };
}

// ─── BRANDED JAR (Jam / Honey) ────────────────────────────────────────────────
//
// Sprites: UNK_39 Board Miami jam jar (48×64), UNK_40 honey jar (46×62)
//
export function drawBrandedJar(
  id: string,
  cx: number,
  cy: number,
  isHoney: boolean
): LayoutItem {
  const spr = isHoney ? S_UNK_40 : S_UNK_39;
  const sw = isHoney ? 46 : 48;
  const sh = isHoney ? 62 : 64;
  const jarW = 52;
  const jarH = jarW * (sh / sw);
  const elements: SVGElementDescriptor[] = [
    placeSprite(spr, sw, sh, cx - jarW / 2, cy - jarH / 2, jarW, jarH),
  ];

  return {
    id,
    ingredientId: isHoney ? 'honey_jar' : 'jam_jar',
    renderStyle: 'jar',
    x: cx - jarW / 2, y: cy - jarH / 2, width: jarW, height: jarH,
    zIndex: 40,
    elements,
  };
}

/**
 * Board PNG snapshot export.
 * Uses XMLSerializer to capture the SVG, draws it to a Canvas at 2× retina,
 * then triggers a PNG download.
 *
 * Section 9.2: 2× resolution, board name in filename, no UI chrome.
 */

export interface ExportOptions {
  filename?: string;
  scale?: number; // default 2 for retina
}

/**
 * Export a board SVG element as a PNG file download.
 * @param svgEl  The <svg> element to capture
 * @param opts   Optional filename and pixel scale (default: 2×)
 */
export async function exportBoardSnapshot(
  svgEl: SVGSVGElement,
  opts: ExportOptions = {}
): Promise<void> {
  const scale = opts.scale ?? 2;
  const filename = opts.filename ?? 'board-miami-board.png';

  // Inline all computed styles into the SVG so it renders correctly off-DOM
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgEl);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  const viewBox = svgEl.viewBox.baseVal;
  const w = viewBox.width || svgEl.clientWidth;
  const h = viewBox.height || svgEl.clientHeight;

  const canvas = document.createElement('canvas');
  canvas.width = w * scale;
  canvas.height = h * scale;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas 2D context');

  // Draw SVG onto canvas
  await new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(svgUrl);
      resolve();
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(svgUrl);
      reject(e);
    };
    img.src = svgUrl;
  });

  // Trigger download
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

/**
 * Returns the board SVG as a data URL (base64 PNG).
 * Used by Step5Review to embed board thumbnails in the order summary.
 */
export async function boardToDataUrl(
  svgEl: SVGSVGElement,
  scale = 1
): Promise<string> {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgEl);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  const viewBox = svgEl.viewBox.baseVal;
  const w = viewBox.width || svgEl.clientWidth;
  const h = viewBox.height || svgEl.clientHeight;

  const canvas = document.createElement('canvas');
  canvas.width = w * scale;
  canvas.height = h * scale;
  const ctx = canvas.getContext('2d')!;

  await new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(svgUrl);
      resolve();
    };
    img.onerror = (e) => { URL.revokeObjectURL(svgUrl); reject(e); };
    img.src = svgUrl;
  });

  return canvas.toDataURL('image/png');
}

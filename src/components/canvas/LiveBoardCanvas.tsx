/**
 * LiveBoardCanvas — the main SVG rendering component.
 * Consumes a BoardConfig, computes layout, and renders the illustrated board.
 *
 * Used in:
 *  - Step3Customizer (right 42% panel, sticky)
 *  - Step5Review (mini thumbnails per board)
 */

import React, { useRef } from 'react';
import type { BoardConfig } from '../../store/builderStore';
import { BOARD_DIMENSIONS } from '../../canvas/boardDimensions';
import type { BoardSKU } from '../../data/boardSizes';
import { useBoardLayout } from '../../hooks/useBoardLayout';
import { GradientDefs } from '../../canvas/GradientDefs';
import { BoardBackground } from './BoardBackground';
import { IngredientLayer } from './IngredientLayer';
import styles from './LiveBoardCanvas.module.css';

interface LiveBoardCanvasProps {
  board: BoardConfig;
  /** When true, renders at a fixed small size suitable for order review thumbnails */
  thumbnail?: boolean;
  /** Forwarded ref — used by canvasExport to grab the SVG element */
  svgRef?: React.RefObject<SVGSVGElement>;
  /** Disable drop-in animations (used for snapshots and thumbnails) */
  animated?: boolean;
  className?: string;
}

export function LiveBoardCanvas({
  board,
  thumbnail = false,
  svgRef,
  animated = true,
  className,
}: LiveBoardCanvasProps): React.ReactElement {
  const internalRef = useRef<SVGSVGElement>(null);
  const ref = svgRef ?? internalRef;

  const sku = board.sku as BoardSKU;
  const dims = BOARD_DIMENSIONS[sku];
  const layoutItems = useBoardLayout(board);

  const { viewBox, width, height, shape } = dims;

  // Clip path ID unique per board to avoid cross-board clipping conflicts
  const clipId = `board-clip-${board.id ?? sku}`;

  return (
    <div
      className={[
        styles.canvasWrapper,
        thumbnail ? styles.thumbnail : styles.full,
        className,
      ].filter(Boolean).join(' ')}
      role="img"
      aria-label={`${board.name ?? 'Your board'} — live board illustration`}
    >
      <svg
        ref={ref}
        viewBox={viewBox}
        width={thumbnail ? undefined : width}
        height={thumbnail ? undefined : height}
        xmlns="http://www.w3.org/2000/svg"
        className={styles.svg}
        data-sku={sku}
        data-seed={board.visualSeed}
        style={{ maxWidth: '100%', height: 'auto' }}
      >
        <GradientDefs />

        {/* Clip path so ingredients don't bleed outside board edge */}
        <defs>
          {shape === 'circle' && dims.radius && dims.cx && dims.cy ? (
            <clipPath id={clipId}>
              <circle cx={dims.cx} cy={dims.cy} r={dims.radius - 2} />
            </clipPath>
          ) : (
            <clipPath id={clipId}>
              <rect
                x={2}
                y={2}
                width={width - 4}
                height={height - 4}
                rx={(dims.rx ?? 16) - 2}
                ry={(dims.rx ?? 16) - 2}
              />
            </clipPath>
          )}
        </defs>

        {/* Board wood grain background */}
        <BoardBackground dims={dims} />

        {/* Clipped ingredient layers — sorted by zIndex from computeBoardLayout */}
        <g clipPath={`url(#${clipId})`}>
          {layoutItems.map((item) => (
            <IngredientLayer
              key={item.id}
              item={item}
              animationsEnabled={animated && !thumbnail}
            />
          ))}
        </g>

        {/* Board edge shadow on top */}
        {shape === 'circle' && dims.radius && dims.cx && dims.cy ? (
          <circle
            cx={dims.cx}
            cy={dims.cy}
            r={dims.radius}
            fill="none"
            stroke="#8B6820"
            strokeWidth="4"
            opacity={0.5}
          />
        ) : (
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            rx={dims.rx ?? 16}
            ry={dims.rx ?? 16}
            fill="none"
            stroke="#8B6820"
            strokeWidth="4"
            opacity={0.4}
          />
        )}
      </svg>

      {/* Loading fallback — shown while layout computes (typically instant) */}
      {layoutItems.length === 0 && (
        <div className={styles.emptyState} aria-hidden="true">
          <span className={styles.emptyText}>Select ingredients to build your board</span>
        </div>
      )}
    </div>
  );
}

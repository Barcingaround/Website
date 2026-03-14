/**
 * Board background — renders the wooden board shape (circle or rounded rect)
 * with a warm wood-grain texture, subtle vignette, and board edge.
 */

import React from 'react';
import type { BoardDimensions } from '../../canvas/boardDimensions';

interface BoardBackgroundProps {
  dims: BoardDimensions;
}

export function BoardBackground({ dims }: BoardBackgroundProps): React.ReactElement {
  const { width, height, shape, rx, radius, cx, cy } = dims;

  if (shape === 'circle' && radius && cx && cy) {
    return (
      <g className="board-background">
        {/* Board base */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="url(#boardCircleGrain)"
          stroke="#B89850"
          strokeWidth="3"
        />
        {/* Wood grain lines */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="url(#woodGrainLines)"
          opacity={0.5}
        />
        {/* Inner rim */}
        <circle
          cx={cx}
          cy={cy}
          r={radius - 12}
          fill="none"
          stroke="#C8A040"
          strokeWidth="1"
          opacity={0.4}
        />
        {/* Vignette */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="url(#boardVignette)"
        />
      </g>
    );
  }

  // Rectangle board
  return (
    <g className="board-background">
      {/* Board base */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={rx ?? 16}
        ry={rx ?? 16}
        fill="url(#boardWoodGrain)"
        stroke="#B89850"
        strokeWidth="3"
      />
      {/* Wood grain lines overlay */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={rx ?? 16}
        ry={rx ?? 16}
        fill="url(#woodGrainLines)"
        opacity={0.45}
      />
      {/* Inner border detail */}
      <rect
        x={10}
        y={10}
        width={width - 20}
        height={height - 20}
        rx={(rx ?? 16) - 4}
        ry={(rx ?? 16) - 4}
        fill="none"
        stroke="#C8A040"
        strokeWidth="1"
        opacity={0.35}
      />
      {/* Vignette overlay */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={rx ?? 16}
        ry={rx ?? 16}
        fill="url(#boardVignette)"
      />
    </g>
  );
}

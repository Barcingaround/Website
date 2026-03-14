/**
 * Board background — renders the wooden board shape (circle or rounded rect)
 * with a warm artisan wood-grain texture, inner glow, and a raised edge effect.
 */

import React from 'react';
import type { BoardDimensions } from '../../canvas/boardDimensions';

interface BoardBackgroundProps {
  dims: BoardDimensions;
}

export function BoardBackground({ dims }: BoardBackgroundProps): React.ReactElement {
  const { width, height, shape, rx, radius, cx, cy } = dims;
  const r = rx ?? 16;

  if (shape === 'circle' && radius && cx && cy) {
    return (
      <g className="board-background">
        {/* Outer shadow ring — gives raised-edge feel */}
        <circle cx={cx} cy={cy} r={radius + 4} fill="none" stroke="#8A6030" strokeWidth="6" opacity={0.35} />
        {/* Board base — richer warm wood */}
        <circle cx={cx} cy={cy} r={radius} fill="url(#boardCircleGrain)" stroke="#A88038" strokeWidth="3" />
        {/* Wood grain lines */}
        <circle cx={cx} cy={cy} r={radius} fill="url(#woodGrainLines)" opacity={0.55} />
        {/* Warm inner glow from center */}
        <circle cx={cx} cy={cy} r={radius} fill="url(#boardInnerGlow)" />
        {/* Inner rim detail */}
        <circle cx={cx} cy={cy} r={radius - 10} fill="none" stroke="#C8A040" strokeWidth="0.8" opacity={0.30} />
        {/* Vignette */}
        <circle cx={cx} cy={cy} r={radius} fill="url(#boardVignette)" />
      </g>
    );
  }

  // Rectangle board
  return (
    <g className="board-background">
      {/* Outer shadow — raises the board off the background */}
      <rect x={-3} y={-3} width={width + 6} height={height + 6} rx={r + 2} ry={r + 2}
        fill="none" stroke="#7A5028" strokeWidth="5" opacity={0.30} />
      {/* Board base — warm artisan wood */}
      <rect x={0} y={0} width={width} height={height} rx={r} ry={r}
        fill="url(#boardWoodGrain)" stroke="#A88038" strokeWidth="2.5" />
      {/* Wood grain lines overlay (more visible) */}
      <rect x={0} y={0} width={width} height={height} rx={r} ry={r}
        fill="url(#woodGrainLines)" opacity={0.55} />
      {/* Warm inner glow from center */}
      <rect x={0} y={0} width={width} height={height} rx={r} ry={r}
        fill="url(#boardInnerGlow)" />
      {/* Inner border detail — delicate golden line */}
      <rect x={8} y={8} width={width - 16} height={height - 16} rx={r - 4} ry={r - 4}
        fill="none" stroke="#C8A040" strokeWidth="0.8" opacity={0.28} />
      {/* Vignette overlay — darkens corners slightly */}
      <rect x={0} y={0} width={width} height={height} rx={r} ry={r}
        fill="url(#boardVignette)" />
    </g>
  );
}

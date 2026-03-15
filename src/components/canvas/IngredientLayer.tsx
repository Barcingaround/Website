/**
 * IngredientLayer — renders a single LayoutItem as an SVG <g> element.
 * Recursively renders SVGElementDescriptor children.
 * Handles staggered enter animations via CSS transitions.
 *
 * v2: staggered entry — each item enters with a per-index delay so the board
 * "fills in" from back to front (lower zIndex items appear first).
 * Spring-like cubic-bezier overshoot for a lively feel.
 */

import React, { useEffect, useState } from 'react';
import type { LayoutItem, SVGElementDescriptor } from '../../canvas/IngredientDrawers';

interface IngredientLayerProps {
  item: LayoutItem;
  animationsEnabled: boolean;
  /** Index in the sorted layout array — drives stagger delay */
  index?: number;
}

/** Recursively render SVGElementDescriptor tree into React SVG elements */
function renderDescriptor(desc: SVGElementDescriptor, key: string): React.ReactElement | null {
  const { type, attrs, children } = desc;

  const props: Record<string, string | number | undefined> = { key };
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined) continue;
    const reactKey = k
      .replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
      .replace(/^class$/, 'className');
    props[reactKey] = v;
  }

  const renderedChildren = children?.map((child, i) =>
    renderDescriptor(child, `${key}_${i}`)
  );

  switch (type) {
    case 'path':
      return <path {...props} />;
    case 'circle':
      return <circle {...props}>{renderedChildren}</circle>;
    case 'rect':
      return <rect {...props}>{renderedChildren}</rect>;
    case 'ellipse':
      return <ellipse {...props}>{renderedChildren}</ellipse>;
    case 'line':
      return <line {...props} />;
    case 'polygon':
      return <polygon {...props} />;
    case 'g':
      return <g {...props}>{renderedChildren}</g>;
    default:
      return null;
  }
}

export function IngredientLayer({
  item,
  animationsEnabled,
  index = 0,
}: IngredientLayerProps): React.ReactElement {
  const [visible, setVisible] = useState(!animationsEnabled);

  useEffect(() => {
    if (!animationsEnabled) {
      setVisible(true);
      return;
    }
    // Staggered delay: each item enters ~40ms after the previous one,
    // capped at 480ms so large boards don't feel sluggish.
    const staggerMs = Math.min(index * 40, 480);
    const id = setTimeout(() => {
      requestAnimationFrame(() => setVisible(true));
    }, staggerMs);
    return () => clearTimeout(id);
  }, [animationsEnabled, index]);

  const transform = item.rotation
    ? `translate(${item.x + item.width / 2}, ${item.y + item.height / 2}) rotate(${item.rotation}) translate(${-(item.x + item.width / 2)}, ${-(item.y + item.height / 2)})`
    : undefined;

  // Spring-like cubic-bezier (overshoot ~8%) for lively pop
  const springEasing = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
  const duration = '320ms';

  const style: React.CSSProperties = animationsEnabled ? {
    opacity: visible ? 1 : 0,
    transition: `opacity ${duration} ${springEasing}, transform ${duration} ${springEasing}`,
    transformOrigin: `${item.x + item.width / 2}px ${item.y + item.height / 2}px`,
    transform: visible
      ? (transform ?? 'none')
      : `${transform ? transform + ' ' : ''}scale(0.82)`,
  } : {};

  return (
    <g
      data-ingredient={item.ingredientId}
      data-render-style={item.renderStyle}
      transform={animationsEnabled ? undefined : transform}
      style={style}
    >
      {item.elements.map((desc, i) => renderDescriptor(desc, `${item.id}_${i}`))}
    </g>
  );
}

/**
 * IngredientLayer — renders a single LayoutItem as an SVG <g> element.
 * Recursively renders SVGElementDescriptor children.
 * Handles enter/exit animations via CSS classes.
 */

import React, { useEffect, useState } from 'react';
import type { LayoutItem, SVGElementDescriptor } from '../../canvas/IngredientDrawers';

interface IngredientLayerProps {
  item: LayoutItem;
  animationsEnabled: boolean;
}

/** Recursively render SVGElementDescriptor tree into React SVG elements */
function renderDescriptor(desc: SVGElementDescriptor, key: string): React.ReactElement | null {
  const { type, attrs, children } = desc;

  // Convert attrs record to React-compatible SVG props
  // (convert kebab-case like stroke-width → strokeWidth)
  const props: Record<string, string | number | undefined> = { key };
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined) continue;
    // React SVG props use camelCase for some attributes
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

export function IngredientLayer({ item, animationsEnabled }: IngredientLayerProps): React.ReactElement {
  const [visible, setVisible] = useState(!animationsEnabled);

  useEffect(() => {
    if (!animationsEnabled) {
      setVisible(true);
      return;
    }
    // Trigger enter animation on mount
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [animationsEnabled]);

  const transform = item.rotation
    ? `translate(${item.x + item.width / 2}, ${item.y + item.height / 2}) rotate(${item.rotation}) translate(${-(item.x + item.width / 2)}, ${-(item.y + item.height / 2)})`
    : undefined;

  const style: React.CSSProperties = animationsEnabled ? {
    opacity: visible ? 1 : 0,
    transition: 'opacity 300ms cubic-bezier(0.34, 1.56, 0.64, 1), transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    transformOrigin: `${item.x + item.width / 2}px ${item.y + item.height / 2}px`,
    transform: visible
      ? (transform ?? 'none')
      : `${transform ? transform + ' ' : ''}scale(0.85)`,
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

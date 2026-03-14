import { useMemo } from 'react';
import type { Ingredient } from '../../data/ingredients';
import type { BoardConfig } from '../../store/builderStore';
import { STANDARD_COMPOSITIONS } from '../../data/standardCompositions';
import Stepper from '../shared/Stepper';
import Badge from '../shared/Badge';
import styles from './IngredientCard.module.css';

interface IngredientCardProps {
  ingredient: Ingredient;
  board: BoardConfig;
  currentPoints: number;
  canIncrement: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
}

const ALLERGEN_ICONS: Record<string, { symbol: string; label: string }> = {
  dairy:      { symbol: '🥛', label: 'Contains dairy' },
  pork:       { symbol: '🐷', label: 'Contains pork' },
  tree_nuts:  { symbol: '🌰', label: 'Contains tree nuts' },
  gluten:     { symbol: '🌾', label: 'Contains gluten' },
};

export default function IngredientCard({
  ingredient,
  board,
  currentPoints,
  canIncrement,
  onIncrement,
  onDecrement,
}: IngredientCardProps) {
  const isSelected = currentPoints > 0;

  const isStandard = useMemo(() => {
    const composition = STANDARD_COMPOSITIONS[board.sku];
    return composition?.mainIngredients.some(a => a.ingredientId === ingredient.id) ?? false;
  }, [board.sku, ingredient.id]);

  const unitsPerPt = typeof ingredient.unitsPerPoint === 'number'
    ? ingredient.unitsPerPoint
    : (ingredient.unitsPerPoint as { cc: number; co: number })[board.category] ?? 0;

  const totalUnits = currentPoints * unitsPerPt;

  // Allergens to show
  const displayAllergens = ingredient.allergens.filter(a => ALLERGEN_ICONS[a]);

  return (
    <article
      className={`${styles.card} ${isSelected ? styles.selected : ''} ${!canIncrement && !isSelected ? styles.dim : ''}`}
      aria-label={`${ingredient.displayName}, ${ingredient.pointCost} point${ingredient.pointCost > 1 ? 's' : ''} per allocation, currently ${currentPoints} ${currentPoints === 1 ? 'allocation' : 'allocations'}`}
    >
      {/* Icon area */}
      <div className={styles.icon} aria-hidden="true">
        <IngredientIcon ingredient={ingredient} />
      </div>

      {/* Name + badges */}
      <div className={styles.nameRow}>
        <span className={`ingredient-name ${styles.name}`}>{ingredient.displayName}</span>
        <div className={styles.badges}>
          <Badge variant="point">{ingredient.pointCost} pt{ingredient.pointCost > 1 ? 's' : ''}</Badge>
          {ingredient.seasonal && <Badge variant="seasonal">Seasonal</Badge>}
          {isStandard && <Badge variant="standard">Standard</Badge>}
        </div>
      </div>

      {/* Yield preview */}
      <div className={styles.yield}>
        {currentPoints > 0 ? (
          <span className={styles.yieldActive}>
            {currentPoints} pt{currentPoints > 1 ? 's' : ''} → <strong>{totalUnits} {ingredient.unitLabel}</strong>
          </span>
        ) : (
          <span className={styles.yieldHint}>
            {ingredient.pointCost} pt = {unitsPerPt} {ingredient.unitLabel}
          </span>
        )}
      </div>

      {/* Allergens */}
      {displayAllergens.length > 0 && (
        <div className={styles.allergens} aria-label="Allergens">
          {displayAllergens.map(a => (
            <span key={a} title={ALLERGEN_ICONS[a].label} aria-label={ALLERGEN_ICONS[a].label} className={styles.allergenIcon}>
              {ALLERGEN_ICONS[a].symbol}
            </span>
          ))}
        </div>
      )}

      {/* Stepper */}
      <div className={styles.stepperRow}>
        <Stepper
          value={currentPoints}
          min={0}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          incrementDisabled={!canIncrement}
          ariaLabel={`${ingredient.displayName} point allocation`}
        />
      </div>
    </article>
  );
}

// Tiny SVG icon for each ingredient — simplified colored shape
function IngredientIcon({ ingredient }: { ingredient: Ingredient }) {
  const color = (ingredient.renderColor as string | undefined) ?? '#888';
  const size = 40;

  // Different icon shapes by render style
  switch (ingredient.renderStyle) {
    case 'continuous_fan':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          {[0, 4, 8, 12].map(y => (
            <rect key={y} x="2" y={y + 6} width="36" height="3" rx="1.5" fill={color} opacity={0.6 + y * 0.05} />
          ))}
        </svg>
      );
    case 'rosette_cluster':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          {[[20,18],[12,24],[28,24],[16,31],[24,31]].map(([cx,cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="6" fill={color} opacity={0.85} />
          ))}
        </svg>
      );
    case 'fan_arc':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <path d="M4 36 L20 8 L36 36 Z" fill={color} opacity={0.35} />
          <path d="M7 36 L20 11 L33 36 Z" fill={color} opacity={0.55} />
          <path d="M10 36 L20 14 L30 36 Z" fill={color} opacity={0.8} />
        </svg>
      );
    case 'stacked_mound':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <rect x="8" y="22" width="24" height="12" rx="2" fill={color} opacity={0.5} />
          <rect x="10" y="18" width="20" height="10" rx="2" fill={color} opacity={0.7} />
          <rect x="13" y="14" width="14" height="9" rx="2" fill={color} opacity={0.9} />
        </svg>
      );
    case 'round_disc':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <circle cx="14" cy="22" r="11" fill={color} opacity={0.85} />
          <circle cx="26" cy="22" r="11" fill={color} opacity={0.85} />
        </svg>
      );
    case 'grape_cluster':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          {[[20,10],[15,16],[25,16],[12,22],[20,22],[28,22],[17,28],[23,28]].map(([cx,cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="5" fill={color} opacity={0.8} />
          ))}
        </svg>
      );
    case 'exotic_anchor':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="16" fill={(ingredient as {interiorColor?: string}).interiorColor ?? '#fff'} />
          <circle cx="20" cy="20" r="16" fill="none" stroke={color} strokeWidth="5" />
          {[1,2,3,4,5,6,7,8].map(i => (
            <circle key={i}
              cx={20 + 8 * Math.cos(i * Math.PI / 4)}
              cy={20 + 8 * Math.sin(i * Math.PI / 4)}
              r="1.5" fill="#1A1A1A" />
          ))}
        </svg>
      );
    case 'citrus_slice':
      if (ingredient.id === 'kiwi') {
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="17" fill={color} />
            <circle cx="20" cy="20" r="7" fill="#E8E8C0" />
            {[0,1,2,3,4,5,6,7].map(i => (
              <line key={i}
                x1={20 + 8 * Math.cos(i * Math.PI / 4)}
                y1={20 + 8 * Math.sin(i * Math.PI / 4)}
                x2={20 + 16 * Math.cos(i * Math.PI / 4)}
                y2={20 + 16 * Math.sin(i * Math.PI / 4)}
                stroke="#3A6020" strokeWidth="1.5" opacity={0.5} />
            ))}
          </svg>
        );
      }
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <path d="M6 20 A 16 16 0 0 1 34 20 Z" fill={color} opacity={0.9} />
          {[1,2,3,4,5].map(i => (
            <line key={i} x1="20" y1="20" x2={6 + 28 * (i/6)} y2="20" stroke="#D06010" strokeWidth="0.8" />
          ))}
        </svg>
      );
    case 'berry_scatter':
      if (ingredient.id === 'strawberries') {
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
            <path d="M20 6 C8 6 4 16 8 24 C12 32 20 34 20 34 C20 34 28 32 32 24 C36 16 32 6 20 6Z" fill={color} />
            <path d="M20 6 C18 4 20 2 22 4" stroke="#5A8A30" strokeWidth="2" fill="none" />
          </svg>
        );
      }
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="14" fill={color} />
          <circle cx="20" cy="20" r="3" fill="none" stroke={color} strokeWidth="1.5" opacity={0.6} />
        </svg>
      );
    case 'berry_cluster':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          {[[20,14],[14,20],[26,20],[17,26],[23,26],[20,32]].map(([cx,cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="5.5" fill={color} opacity={0.8} />
          ))}
        </svg>
      );
    case 'nut_cluster':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <ellipse cx="16" cy="20" rx="9" ry="7" fill={color} opacity={0.8} />
          <ellipse cx="26" cy="18" rx="9" ry="7" fill={color} opacity={0.9} />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="16" fill={color} opacity={0.6} />
        </svg>
      );
  }
}

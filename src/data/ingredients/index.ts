export type { Ingredient } from './meats';
export { MEATS } from './meats';
export { CHEESES } from './cheeses';
export { FRUITS } from './fruits';
export { ACCOUTREMENTS, FIXED_INCLUSIONS } from './accoutrements';
export type { FixedInclusion } from './accoutrements';

import { MEATS } from './meats';
import { CHEESES } from './cheeses';
import { FRUITS } from './fruits';
import { ACCOUTREMENTS } from './accoutrements';
import type { Ingredient } from './meats';

export const ALL_INGREDIENTS: Ingredient[] = [
  ...MEATS,
  ...CHEESES,
  ...FRUITS,
  ...ACCOUTREMENTS,
];

export function getIngredientById(id: string): Ingredient | undefined {
  return ALL_INGREDIENTS.find(i => i.id === id);
}

export function getIngredientsByCategory(category: Ingredient['category']): Ingredient[] {
  return ALL_INGREDIENTS.filter(i => i.category === category);
}

export function getIngredientsByBoardType(boardType: 'cc' | 'co'): Ingredient[] {
  return ALL_INGREDIENTS.filter(i => i.boardTypes.includes(boardType));
}

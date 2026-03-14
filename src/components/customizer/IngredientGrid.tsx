import type { Ingredient } from '../../data/ingredients';
import type { BoardConfig } from '../../store/builderStore';
import IngredientCard from './IngredientCard';
import styles from './IngredientGrid.module.css';

interface IngredientGridProps {
  ingredients: Ingredient[];
  board: BoardConfig;
  getPoints: (id: string, isAcc: boolean) => number;
  canAdd: (cost: number, isAcc: boolean) => boolean;
  onIncrement: (id: string, cost: number, isAcc: boolean) => void;
  onDecrement: (id: string, cost: number, isAcc: boolean) => void;
  isAccoutrements?: boolean;
}

export default function IngredientGrid({
  ingredients,
  board,
  getPoints,
  canAdd,
  onIncrement,
  onDecrement,
  isAccoutrements = false,
}: IngredientGridProps) {
  if (ingredients.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No ingredients available for this board type.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid} role="list">
      {ingredients.map(ingredient => {
        const pts = getPoints(ingredient.id, isAccoutrements);
        const canInc = canAdd(ingredient.pointCost, isAccoutrements);
        return (
          <div key={ingredient.id} role="listitem">
            <IngredientCard
              ingredient={ingredient}
              board={board}
              currentPoints={pts}
              canIncrement={canInc}
              onIncrement={() => onIncrement(ingredient.id, ingredient.pointCost, isAccoutrements)}
              onDecrement={() => onDecrement(ingredient.id, ingredient.pointCost, isAccoutrements)}
            />
          </div>
        );
      })}
    </div>
  );
}

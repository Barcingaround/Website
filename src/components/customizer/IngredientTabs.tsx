import { useState } from 'react';
import type { BoardConfig } from '../../store/builderStore';
import { MEATS } from '../../data/ingredients/meats';
import { CHEESES } from '../../data/ingredients/cheeses';
import { FRUITS } from '../../data/ingredients/fruits';
import { ACCOUTREMENTS } from '../../data/ingredients/accoutrements';
import type { Ingredient } from '../../data/ingredients';
import IngredientGrid from './IngredientGrid';
import styles from './IngredientTabs.module.css';

interface IngredientTabsProps {
  board: BoardConfig;
  dietaryFilters: { halalFriendly: boolean; nutFree: boolean; noDairy: boolean };
  getPoints: (id: string, isAcc: boolean) => number;
  canAdd: (cost: number, isAcc: boolean) => boolean;
  onIncrement: (id: string, cost: number, isAcc: boolean) => void;
  onDecrement: (id: string, cost: number, isAcc: boolean) => void;
}

type TabId = 'meats' | 'cheeses' | 'fruits' | 'accs';

function filterByDiet(ingredients: Ingredient[], filters: IngredientTabsProps['dietaryFilters']): Ingredient[] {
  return ingredients.filter(i => {
    if (filters.halalFriendly && i.allergens.includes('pork')) return false;
    if (filters.nutFree && i.allergens.includes('tree_nuts')) return false;
    if (filters.noDairy && i.allergens.includes('dairy')) return false;
    return true;
  });
}

export default function IngredientTabs({
  board,
  dietaryFilters,
  getPoints,
  canAdd,
  onIncrement,
  onDecrement,
}: IngredientTabsProps) {
  const isCC = board.category === 'cc';
  const [activeTab, setActiveTab] = useState<TabId>(isCC ? 'meats' : 'cheeses');

  const tabs: Array<{ id: TabId; label: string; show: boolean }> = [
    { id: 'meats',   label: 'Meats',        show: isCC },
    { id: 'cheeses', label: 'Cheeses',       show: true },
    { id: 'fruits',  label: 'Fruits',        show: true },
    { id: 'accs',    label: 'Accoutrements', show: true },
  ];

  const visibleTabs = tabs.filter(t => t.show);

  function getIngredients(tab: TabId): Ingredient[] {
    let list: Ingredient[] = [];
    switch (tab) {
      case 'meats':   list = MEATS.filter(m => m.boardTypes.includes(board.category)); break;
      case 'cheeses': list = CHEESES.filter(c => c.boardTypes.includes(board.category)); break;
      case 'fruits':  list = FRUITS.filter(f => f.boardTypes.includes(board.category)); break;
      case 'accs':    list = ACCOUTREMENTS.filter(a => a.boardTypes.includes(board.category)); break;
    }
    return filterByDiet(list, dietaryFilters);
  }

  return (
    <div className={styles.tabs}>
      <div className={styles.tabList} role="tablist" aria-label="Ingredient categories">
        {visibleTabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        className={styles.tabPanel}
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        <IngredientGrid
          ingredients={getIngredients(activeTab)}
          board={board}
          getPoints={getPoints}
          canAdd={canAdd}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          isAccoutrements={activeTab === 'accs'}
        />
      </div>
    </div>
  );
}

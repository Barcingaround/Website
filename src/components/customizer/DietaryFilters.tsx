import styles from './DietaryFilters.module.css';
import type { BuilderState } from '../../store/builderStore';

interface DietaryFiltersProps {
  filters: BuilderState['dietaryFilters'];
  onChange: (key: keyof BuilderState['dietaryFilters'], value: boolean) => void;
}

const FILTERS: Array<{ key: keyof BuilderState['dietaryFilters']; label: string }> = [
  { key: 'halalFriendly', label: 'Halal-friendly' },
  { key: 'nutFree',       label: 'Nut-free' },
  { key: 'noDairy',       label: 'No dairy' },
];

export default function DietaryFilters({ filters, onChange }: DietaryFiltersProps) {
  return (
    <div className={styles.row} role="group" aria-label="Dietary filters">
      {FILTERS.map(f => (
        <label key={f.key} className={`${styles.filter} ${filters[f.key] ? styles.filterActive : ''}`}>
          <input
            type="checkbox"
            checked={filters[f.key]}
            onChange={e => onChange(f.key, e.target.checked)}
            className={styles.checkbox}
          />
          {f.label}
        </label>
      ))}
    </div>
  );
}

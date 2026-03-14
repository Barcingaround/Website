import styles from './PointBudgetBar.module.css';

interface PointBudgetBarProps {
  used: number;
  total: number;
  label?: string;
  isAccoutrements?: boolean;
}

export default function PointBudgetBar({ used, total, label, isAccoutrements = false }: PointBudgetBarProps) {
  const pct = Math.min(100, (used / total) * 100);
  const isWarning = pct >= 85 && pct < 100;
  const isFull = pct >= 100;

  return (
    <div className={styles.wrapper}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.barContainer}>
        <div
          className={`${styles.barFill} ${isWarning ? styles.warning : ''} ${isFull ? styles.full : ''} ${isAccoutrements ? styles.accs : ''} budget-bar-fill`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={used}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`${used} of ${total} ${isAccoutrements ? 'accoutrement' : 'ingredient'} points used`}
        />
      </div>
      <span
        className={`${styles.counter} ${isFull ? styles.counterFull : ''}`}
        aria-live="polite"
      >
        {used} / {total} pts
      </span>
    </div>
  );
}

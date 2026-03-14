import styles from './Stepper.module.css';

interface StepperProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
  incrementDisabled?: boolean;
  ariaLabel?: string;
}

export default function Stepper({
  value,
  min = 0,
  onIncrement,
  onDecrement,
  disabled = false,
  incrementDisabled = false,
  ariaLabel = 'quantity',
}: StepperProps) {
  return (
    <div className={styles.stepper} role="group" aria-label={ariaLabel}>
      <button
        type="button"
        className={styles.btn}
        onClick={onDecrement}
        disabled={disabled || value <= min}
        aria-label={`Decrease ${ariaLabel}`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
      <span className={styles.value} aria-live="polite" aria-label={`${value} allocations`}>
        {value}
      </span>
      <button
        type="button"
        className={styles.btn}
        onClick={onIncrement}
        disabled={disabled || incrementDisabled}
        aria-label={`Increase ${ariaLabel}`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

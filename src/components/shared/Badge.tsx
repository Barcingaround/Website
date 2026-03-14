import styles from './Badge.module.css';

interface BadgeProps {
  variant: 'point' | 'seasonal' | 'standard' | 'category' | 'warning';
  children: React.ReactNode;
}

export default function Badge({ variant, children }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {children}
    </span>
  );
}

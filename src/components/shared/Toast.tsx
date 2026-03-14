import { useEffect, useState } from 'react';
import styles from './Toast.module.css';

interface ToastProps {
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onClose, 200);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`${styles.toast} ${styles[type]} ${exiting ? styles.exiting : styles.entering}`}
      role="status"
      aria-live="polite"
    >
      <span>{message}</span>
      <button
        type="button"
        className={styles.close}
        onClick={() => { setExiting(true); setTimeout(onClose, 200); }}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}

// Toast container that manages multiple toasts
interface ToastItem {
  id: string;
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className={styles.container} aria-live="polite" aria-label="Notifications">
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => onRemove(t.id)} />
      ))}
    </div>
  );
}

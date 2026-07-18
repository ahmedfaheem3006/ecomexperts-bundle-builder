import type { SaveStatus as SaveStatusValue } from '../../types/bundle';
import styles from './SaveStatus.module.css';

type SaveStatusProps = {
  status: SaveStatusValue;
};

export function SaveStatus({ status }: SaveStatusProps) {
  if (status === 'idle') {
    return null;
  }

  if (status === 'error') {
    return (
      <p className={styles.error} role="alert">
        Your configuration could not be saved.
      </p>
    );
  }

  return (
    <p
      className={styles.saved}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      Your configuration was saved.
    </p>
  );
}

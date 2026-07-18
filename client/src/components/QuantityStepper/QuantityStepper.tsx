import { quantityIcons } from '../../assets/assetRegistry';
import styles from './QuantityStepper.module.css';

type QuantityStepperProps = {
  label: string;
  value: number;
  minimum?: number;
  disabled?: boolean;
  appearance?: keyof typeof quantityIcons;
  onIncrement: () => void;
  onDecrement: () => void;
};

export function QuantityStepper({
  label,
  value,
  minimum = 0,
  disabled = false,
  appearance = 'cardNeutral',
  onIncrement,
  onDecrement,
}: QuantityStepperProps) {
  const icons = quantityIcons[appearance];

  return (
    <div className={styles.root} aria-label={`${label} quantity controls`}>
      <button
        type="button"
        className={styles.button}
        aria-label={`Decrease ${label}`}
        disabled={disabled || value <= minimum}
        onClick={onDecrement}
      >
        <img src={icons.minus} alt="" />
      </button>
      <output className={styles.value} aria-label={`${label} quantity`}>
        {value}
      </output>
      <button
        type="button"
        className={styles.button}
        aria-label={`Increase ${label}`}
        disabled={disabled}
        onClick={onIncrement}
      >
        <img src={icons.plus} alt="" />
      </button>
    </div>
  );
}

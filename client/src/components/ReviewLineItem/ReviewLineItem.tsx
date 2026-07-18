import { resolveAsset } from '../../assets/assetRegistry';
import { useBundle } from '../../context/useBundle';
import { formatCurrency } from '../../state/selectors';
import type { DerivedReviewLine } from '../../types/bundle';
import { QuantityStepper } from '../QuantityStepper/QuantityStepper';
import styles from './ReviewLineItem.module.css';

type ReviewLineItemProps = {
  line: DerivedReviewLine;
};

function formatLinePrice(cents: number, suffix?: '/mo'): string {
  if (cents === 0) {
    return 'FREE';
  }
  return `${formatCurrency(cents)}${suffix ?? ''}`;
}

export function ReviewLineItem({ line }: ReviewLineItemProps) {
  const { changeQuantity } = useBundle();

  return (
    <article className={styles.line} aria-label={line.name}>
      <img className={styles.image} src={resolveAsset(line.image)} alt="" />
      <h4>{line.name}</h4>
      {line.quantityKey && line.quantity !== null ? (
        <div className={styles.controls}>
          <QuantityStepper
            label={`${line.name} review`}
            value={line.quantity}
            minimum={line.minimum}
            disabled={line.controlsDisabled}
            appearance={
              line.controlsDisabled ? 'requiredDisabled' : 'reviewActive'
            }
            onDecrement={() =>
              changeQuantity(line.quantityKey!, -1, line.minimum)
            }
            onIncrement={() => changeQuantity(line.quantityKey!, 1)}
          />
        </div>
      ) : null}
      <div className={styles.price}>
        {line.compareAtCents !== null ? (
          <del>{formatLinePrice(line.compareAtCents, line.billingSuffix)}</del>
        ) : null}
        <span>{formatLinePrice(line.currentCents, line.billingSuffix)}</span>
      </div>
    </article>
  );
}

import { resolveAsset } from '../../assets/assetRegistry';
import { formatCurrency } from '../../state/selectors';
import type { BundleData, PriceTotals } from '../../types/bundle';
import styles from './PriceSummary.module.css';

type PriceSummaryProps = {
  totals: PriceTotals;
  financing: BundleData['financing'];
  guarantee: BundleData['guarantee'];
};

export function PriceSummary({
  totals,
  financing,
  guarantee,
}: PriceSummaryProps) {
  return (
    <div className={styles.root}>
      <div className={styles.totalRow}>
        <div className={styles.guaranteeBlock}>
          <img src={resolveAsset(guarantee.image)} alt={guarantee.title} />
          <div className={styles.guaranteeText}>
            <h4>30-day hassle-free returns</h4>
            <p>If you're not totally in love with the product, we will refund you 100%.</p>
          </div>
        </div>
        <div className={styles.pricingBlock}>
          <span className={styles.financing}>{financing.label}</span>
          <div className={styles.prices}>
            {totals.savingsCents > 0 ? (
              <del aria-label="Compare-at total">
                {formatCurrency(totals.compareAtCents)}
              </del>
            ) : null}
            <strong aria-label="Bundle total">
              {formatCurrency(totals.currentCents)}
            </strong>
          </div>
        </div>
      </div>
      <p className={styles.savings} aria-label="Bundle savings">
        Congrats! You’re saving {formatCurrency(totals.savingsCents)} on your
        security bundle!
      </p>
    </div>
  );
}

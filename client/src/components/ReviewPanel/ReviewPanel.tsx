import { useRef, useState } from 'react';

import { useBundle } from '../../context/useBundle';
import { CheckoutDialog } from '../CheckoutDialog/CheckoutDialog';
import { PriceSummary } from '../PriceSummary/PriceSummary';
import { ReviewSection } from '../ReviewSection/ReviewSection';
import { SaveStatus } from '../SaveStatus/SaveStatus';
import styles from './ReviewPanel.module.css';

export function ReviewPanel() {
  const {
    bundle,
    state,
    reviewSections,
    totals,
    saveConfiguration,
  } = useBundle();
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const checkoutButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <aside className={styles.review} aria-labelledby="review-title">
      <span className={styles.eyebrow}>{bundle.reviewPanel.eyebrow}</span>
      <div className={styles.content}>
        <div className={styles.leftColumn}>
          <header>
            <h2 id="review-title">{bundle.reviewPanel.title}</h2>
            <p>{bundle.reviewPanel.description}</p>
          </header>

          <div className={styles.sections}>
            {reviewSections.map((section) => (
              <ReviewSection key={section.id} section={section} />
            ))}
          </div>
        </div>

        <div className={styles.rightColumn}>
          <PriceSummary
            totals={totals}
            financing={bundle.financing}
            guarantee={bundle.guarantee}
          />

          <button
            ref={checkoutButtonRef}
            type="button"
            className={styles.checkout}
            onClick={() => setCheckoutOpen(true)}
          >
            {bundle.reviewPanel.checkoutLabel}
          </button>
          <button
            type="button"
            className={styles.save}
            onClick={saveConfiguration}
          >
            {bundle.reviewPanel.saveForLaterLabel}
          </button>
          <SaveStatus status={state.saveStatus} />
        </div>
      </div>

      <CheckoutDialog
        isOpen={isCheckoutOpen}
        totalCents={totals.currentCents}
        returnFocusRef={checkoutButtonRef}
        onClose={() => setCheckoutOpen(false)}
      />
    </aside>
  );
}

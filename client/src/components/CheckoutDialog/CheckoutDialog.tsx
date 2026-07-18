import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
} from 'react';

import { formatCurrency } from '../../state/selectors';
import { useBundle } from '../../context/useBundle';
import styles from './CheckoutDialog.module.css';

type CheckoutDialogProps = {
  isOpen: boolean;
  totalCents: number;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
};

export function CheckoutDialog({
  isOpen,
  totalCents,
  returnFocusRef,
  onClose,
}: CheckoutDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const doneButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  const [isSubmitted, setSubmitted] = useState(false);
  const { reviewSections, totals } = useBundle();

  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      cancelButtonRef.current?.focus();
      return;
    }

    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      setSubmitted(false);
      returnFocusRef.current?.focus();
    }
  }, [isOpen, returnFocusRef]);

  if (!isOpen) {
    return null;
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (!focusableElements || focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement?.focus();
    } else if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement?.focus();
    }
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = async () => {
    try {
      const orderedItems = reviewSections.flatMap((section) =>
        section.lines.map((line) => ({
          name: section.label ? `${section.label} — ${line.name}` : line.name,
          quantity: line.quantity ?? 1,
          priceLabel: line.currentCents === 0 ? 'FREE' : formatCurrency(line.currentCents) + (line.billingSuffix ?? ''),
        }))
      );

      const orderPayload = {
        items: orderedItems,
        totalLabel: formatCurrency(totals.currentCents),
        savingsLabel: formatCurrency(totals.savingsCents),
      };

      await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });
    } catch (err) {
      console.error('Failed to save order to API:', err);
    }

    setSubmitted(true);
    window.setTimeout(() => {
      doneButtonRef.current?.focus();
    }, 0);
  };

  if (isSubmitted) {
    return (
      <div
        className={styles.backdrop}
        role="presentation"
        onMouseDown={handleBackdropClick}
        onKeyDown={handleKeyDown}
      >
        <div
          ref={dialogRef}
          className={`${styles.dialog} ${styles.successContainer}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-success-title"
          aria-describedby="checkout-success-description"
        >
          <svg className={styles.successIcon} viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
            <circle className={styles.successCircle} cx="26" cy="26" r="25" fill="none" />
            <path className={styles.successCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
          <h2 id="checkout-success-title">Order Placed Successfully!</h2>
          <p id="checkout-success-description">
            Thank you! Your security bundle configuration has been submitted.
          </p>
          <div className={styles.actions}>
            <button ref={doneButtonRef} type="button" className={styles.confirm} onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onMouseDown={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-dialog-title"
        aria-describedby="checkout-dialog-description"
      >
        <h2 id="checkout-dialog-title">Confirm checkout</h2>
        <p id="checkout-dialog-description">
          Your bundle total is {formatCurrency(totalCents)}. Continue to
          checkout?
        </p>
        <div className={styles.actions}>
          <button ref={cancelButtonRef} type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={styles.confirm} onClick={() => { void handleConfirm(); }}>
            Confirm checkout
          </button>
        </div>
      </div>
    </div>
  );
}

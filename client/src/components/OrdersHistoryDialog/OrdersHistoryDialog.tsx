import { useEffect, useState, useRef, type KeyboardEvent, type MouseEvent } from 'react';
import styles from './OrdersHistoryDialog.module.css';

type OrderItem = {
  name: string;
  quantity: number;
  priceLabel: string;
};

type Order = {
  id: string;
  createdAt: string;
  items: OrderItem[];
  totalLabel: string;
  savingsLabel: string;
};

type OrdersHistoryDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function OrdersHistoryDialog({ isOpen, onClose }: OrdersHistoryDialogProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    setError(null);
    fetch('http://localhost:3001/api/orders')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load orders');
        return res.json();
      })
      .then((data) => {
        setOrders(data as Order[]);
        setLoading(false);
        window.setTimeout(() => {
          closeButtonRef.current?.focus();
        }, 0);
      })
      .catch((err) => {
        console.error(err);
        setError('Could not retrieve orders. Please make sure the server is running.');
        setLoading(false);
        window.setTimeout(() => {
          closeButtonRef.current?.focus();
        }, 0);
      });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== 'Tab') return;

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

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString();
    } catch {
      return isoString;
    }
  };

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
        aria-labelledby="orders-dialog-title"
      >
        <h2 id="orders-dialog-title">Past Orders History</h2>

        <div className={styles.ordersContent}>
          {loading ? (
            <p className={styles.statusText}>Loading orders...</p>
          ) : error ? (
            <p className={styles.errorText}>{error}</p>
          ) : orders.length === 0 ? (
            <p className={styles.statusText}>No past orders found.</p>
          ) : (
            <div className={styles.ordersList}>
              {orders.slice().reverse().map((order) => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <span className={styles.orderId}>{order.id}</span>
                    <span className={styles.orderDate}>{formatDate(order.createdAt)}</span>
                  </div>
                  <ul className={styles.orderItems}>
                    {order.items.map((item, idx) => (
                      <li key={idx} className={styles.orderItem}>
                        <span>{item.name}</span>
                        <span>Qty: {item.quantity} ({item.priceLabel})</span>
                      </li>
                    ))}
                  </ul>
                  <div className={styles.orderFooter}>
                    <span>Savings: <strong className={styles.savings}>{order.savingsLabel}</strong></span>
                    <span>Total: <strong className={styles.total}>{order.totalLabel}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button ref={closeButtonRef} type="button" className={styles.closeBtn} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

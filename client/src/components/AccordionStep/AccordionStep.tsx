import type { ReactNode, Ref } from 'react';

import { resolveAsset } from '../../assets/assetRegistry';
import styles from './AccordionStep.module.css';

type AccordionStepProps = {
  id: string;
  eyebrow: string;
  title: string;
  icon: string;
  selectedCount: number;
  isOpen: boolean;
  headerRef?: Ref<HTMLButtonElement>;
  onToggle: () => void;
  onNext?: () => void;
  nextLabel?: string;
  children: ReactNode;
};

export function AccordionStep({
  id,
  eyebrow,
  title,
  icon,
  selectedCount,
  isOpen,
  headerRef,
  onToggle,
  onNext,
  nextLabel,
  children,
}: AccordionStepProps) {
  const headerId = `${id}-accordion-header`;
  const panelId = `${id}-accordion-panel`;

  return (
    <section className={`${styles.step} ${isOpen ? styles.expanded : styles.collapsed}`}>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <h2 className={styles.heading}>
        <button
          ref={headerRef}
          type="button"
          id={headerId}
          className={styles.header}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span className={styles.titleGroup}>
            <img src={resolveAsset(icon)} alt="" />
            <span>{title}</span>
          </span>
          <span className={styles.summary}>
            {selectedCount} selected
            <img
              className={styles.chevron}
              src={resolveAsset('client/src/assets/icons/chevron-up.svg')}
              alt=""
            />
          </span>
        </button>
      </h2>

      {isOpen ? (
        <div
          id={panelId}
          className={styles.panel}
          role="region"
          aria-labelledby={headerId}
        >
          {children}
          {onNext && nextLabel ? (
            <button type="button" className={styles.next} onClick={onNext}>
              {nextLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

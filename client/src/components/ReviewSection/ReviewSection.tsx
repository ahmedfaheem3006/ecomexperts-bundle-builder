import type { DerivedReviewSection } from '../../types/bundle';
import { ReviewLineItem } from '../ReviewLineItem/ReviewLineItem';
import styles from './ReviewSection.module.css';

type ReviewSectionProps = {
  section: DerivedReviewSection;
};

export function ReviewSection({ section }: ReviewSectionProps) {
  return (
    <section className={styles.section} aria-label={section.label ?? section.id}>
      {section.label ? <h3>{section.label}</h3> : null}
      <div className={styles.lines}>
        {section.lines.map((line) => (
          <ReviewLineItem key={line.id} line={line} />
        ))}
      </div>
    </section>
  );
}

import { resolveAsset } from '../../assets/assetRegistry';
import type { ProductVariant } from '../../types/bundle';
import styles from './VariantSelector.module.css';

type VariantSelectorProps = {
  productName: string;
  variants: ProductVariant[];
  activeVariantId: string | null;
  onSelect: (variantId: string) => void;
};

export function VariantSelector({
  productName,
  variants,
  activeVariantId,
  onSelect,
}: VariantSelectorProps) {
  return (
    <div
      className={styles.root}
      role="group"
      aria-label={`${productName} variants`}
    >
      {variants.map((variant) => (
        <button
          type="button"
          key={variant.id}
          className={styles.variant}
          aria-label={`Select ${productName} ${variant.label}`}
          aria-pressed={variant.id === activeVariantId}
          onClick={() => onSelect(variant.id)}
        >
          <img src={resolveAsset(variant.image)} alt="" />
          <span>{variant.label}</span>
        </button>
      ))}
    </div>
  );
}

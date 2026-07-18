import { resolveAsset } from '../../assets/assetRegistry';
import { useBundle } from '../../context/useBundle';
import {
  getActiveQuantityKey,
  getActiveVariantId,
  getCameraTotalQuantity,
} from '../../state/selectors';
import type { CameraProduct } from '../../types/bundle';
import { QuantityStepper } from '../QuantityStepper/QuantityStepper';
import { VariantSelector } from '../VariantSelector/VariantSelector';
import styles from './ProductCard.module.css';

type ProductCardProps = {
  product: CameraProduct;
  onLearnMore?: (product: CameraProduct) => void;
};

export function ProductCard({ product, onLearnMore }: ProductCardProps) {
  const { state, setActiveVariant, changeQuantity } = useBundle();
  const activeVariantId = getActiveVariantId(product, state);
  const quantityKey = getActiveQuantityKey(product, state);
  const activeVariant = product.variants.find(
    (variant) => variant.id === activeVariantId,
  );
  const quantity = state.quantities[quantityKey] ?? 0;
  const isSelected = getCameraTotalQuantity(product, state) > 0;
  const quantityLabel = activeVariant
    ? `${product.name} ${activeVariant.label}`
    : product.name;

  return (
    <article
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      aria-label={product.name}
      data-selected={isSelected}
    >
      <div className={styles.imageColumn}>
        <img
          className={styles.productImage}
          src={resolveAsset(activeVariant?.image ?? product.image)}
          alt={product.name}
        />
        {product.cardPrice.discountLabel ? (
          <span className={styles.discount}>
            {product.cardPrice.discountLabel}
          </span>
        ) : null}
      </div>

      <div className={styles.content}>
        <div>
          <h3>{product.name}</h3>
          <p>
            {product.description}{' '}
            <a
              href={`#${product.id}`}
              onClick={(e) => {
                e.preventDefault();
                onLearnMore?.(product);
              }}
            >
              {product.learnMoreLabel}
            </a>
          </p>
        </div>

        {product.variants.length > 0 ? (
          <VariantSelector
            productName={product.name}
            variants={product.variants}
            activeVariantId={activeVariantId}
            onSelect={(variantId) =>
              setActiveVariant(product.id, variantId)
            }
          />
        ) : null}

        <div className={styles.footer}>
          <QuantityStepper
            label={quantityLabel}
            value={quantity}
            appearance={isSelected ? 'cardSelected' : 'cardNeutral'}
            onDecrement={() => changeQuantity(quantityKey, -1)}
            onIncrement={() => changeQuantity(quantityKey, 1)}
          />
          <div className={styles.price}>
            {product.cardPrice.compareAtLabel ? (
              <del>{product.cardPrice.compareAtLabel}</del>
            ) : null}
            <span>{product.cardPrice.currentLabel}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

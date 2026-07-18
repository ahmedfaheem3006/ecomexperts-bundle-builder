import { resolveAsset } from '../../assets/assetRegistry';
import { useBundle } from '../../context/useBundle';
import type { Price } from '../../types/bundle';
import { QuantityStepper } from '../QuantityStepper/QuantityStepper';
import styles from './OptionList.module.css';

export type OptionListItem = {
  id: string;
  name: string;
  image: string;
  quantityKey: string;
  required: boolean;
  price: Price;
};

type OptionListProps = {
  items: OptionListItem[];
  label: string;
};

export function OptionList({ items, label }: OptionListProps) {
  const { state, changeQuantity } = useBundle();

  return (
    <div className={styles.list} aria-label={label}>
      {items.map((item) => {
        const quantity = state.quantities[item.quantityKey] ?? 0;
        return (
          <article key={item.id} className={styles.item}>
            <img src={resolveAsset(item.image)} alt="" />
            <div className={styles.details}>
              <h3>{item.name}</h3>
              <div className={styles.price}>
                {item.price.compareAtLabel ? (
                  <del>{item.price.compareAtLabel}</del>
                ) : null}
                <span>{item.price.currentLabel}</span>
              </div>
            </div>
            <QuantityStepper
              label={item.name}
              value={quantity}
              minimum={item.required ? 1 : 0}
              disabled={item.required}
              appearance={
                item.required ? 'requiredDisabled' : 'cardNeutral'
              }
              onDecrement={() =>
                changeQuantity(item.quantityKey, -1, item.required ? 1 : 0)
              }
              onIncrement={() => changeQuantity(item.quantityKey, 1)}
            />
          </article>
        );
      })}
    </div>
  );
}

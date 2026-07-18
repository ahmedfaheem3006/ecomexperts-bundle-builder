import { useBundle } from '../../context/useBundle';
import { ProductCard } from '../ProductCard/ProductCard';
import type { CameraProduct } from '../../types/bundle';
import styles from './ProductGrid.module.css';

type ProductGridProps = {
  onLearnMore?: (product: CameraProduct) => void;
};

export function ProductGrid({ onLearnMore }: ProductGridProps) {
  const { bundle } = useBundle();

  return (
    <div className={styles.grid} aria-label="Camera products">
      {bundle.cameras.map((camera) => (
        <ProductCard key={camera.id} product={camera} onLearnMore={onLearnMore} />
      ))}
    </div>
  );
}

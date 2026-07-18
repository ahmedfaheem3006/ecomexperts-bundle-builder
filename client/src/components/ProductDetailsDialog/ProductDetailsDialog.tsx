import { useEffect, useRef, type KeyboardEvent, type MouseEvent } from 'react';
import { resolveAsset } from '../../assets/assetRegistry';
import styles from './ProductDetailsDialog.module.css';

type ProductInfo = {
  features: string[];
  specs: Record<string, string>;
};

const PRODUCT_EXTRA_DETAILS: Record<string, ProductInfo> = {
  'wyze-cam-v4': {
    features: [
      '2.5K QHD Resolution for crystal clear video quality',
      'Enhanced Color Night Vision in ultra-low light',
      'IP65 weather resistance for indoor/outdoor use',
      'Integrated motion-activated spotlight and siren',
      'Smart AI alerts for people, packages, pets, and vehicles',
    ],
    specs: {
      'Resolution': '2560 x 1440 (2.5K)',
      'Field of View': '116° Diagonal',
      'Night Vision': 'Color Night Vision (4 IR LEDs)',
      'Audio': 'Two-Way Audio with Noise Cancellation',
      'Power Source': '5V/2A Wired USB',
      'Local Storage': 'MicroSD card slot (up to 256GB)',
    },
  },
  'wyze-cam-pan-v3': {
    features: [
      '360° Pan & 180° Tilt for complete room coverage',
      'Automatic motion tracking follows subjects dynamically',
      'Sleek IP65 weatherproof design works indoors or outdoors',
      'Privacy mode rotates camera downwards when off',
      'Custom patrol routes can scan the room automatically',
    ],
    specs: {
      'Resolution': '1080p Full HD',
      'Pan Range': '360° Horizontal rotation',
      'Tilt Range': '180° Vertical range',
      'Field of View': '120° Diagonal',
      'Audio': 'Two-Way Audio with Built-in Speaker',
      'Power Source': '5V/2A Wired USB',
    },
  },
  'wyze-cam-floodlight-v2': {
    features: [
      'Powerful 2600-lumen super-bright LED floodlights',
      '2K High Definition video with wide 160° viewing angle',
      'PIR sensor with 270° wide-area motion detection range',
      'Custom lighting schedules and ambient light detection',
      '105dB warning siren to deter unwanted visitors',
    ],
    specs: {
      'Resolution': '2048 x 1536 (2K)',
      'Brightness': '2600 Lumens (Adjustable)',
      'Field of View': '160° Diagonal',
      'Motion Detection': '270° PIR sensor up to 30 feet',
      'Power Source': '110-240V Hardwired',
      'Weatherproofing': 'IP65 Weatherproof',
    },
  },
  'wyze-duo-cam-doorbell': {
    features: [
      'Dual-camera design eliminates doorstep blindspots',
      'Head-to-Toe ultra-wide field of view shows packages clearly',
      'Smart package delivery and pickup alerts',
      'Clear two-way conversations with guests at the door',
      'Multiple digital chime sound options included',
    ],
    specs: {
      'Main Camera': '2K HD Resolution',
      'Bottom Camera': '1080p package-viewing camera',
      'Field of View': '150° Diagonal',
      'Power Source': 'Rechargeable Battery or Hardwired',
      'Connectivity': '2.4GHz Wi-Fi',
      'Chime': 'Wireless digital indoor chime included',
    },
  },
  'wyze-battery-cam-pro': {
    features: [
      '2.5K HDR video quality captures vibrant, rich details',
      '100% wire-free setup with quick-release rechargeable battery',
      'Dual-band Wi-Fi (2.4GHz / 5GHz) for fast, stable connections',
      'Radar motion sensing for precise notification zones',
      'Built-in spotlight and loud 80dB alarm siren',
    ],
    specs: {
      'Resolution': '2.5K QHD with HDR',
      'Battery Capacity': '6200 mAh rechargeable pack',
      'Field of View': '134° Diagonal',
      'Connectivity': 'Dual-Band 2.4GHz & 5GHz Wi-Fi',
      'Power Source': 'Wire-free Battery (Solar panel compatible)',
      'Local Storage': 'MicroSD card slot (up to 256GB)',
    },
  },
};

type ProductDetailsDialogProps = {
  isOpen: boolean;
  product: {
    id: string;
    name: string;
    image: string;
    description: string;
    cardPrice: {
      currentLabel: string;
    };
  } | null;
  onClose: () => void;
};

export function ProductDetailsDialog({ isOpen, product, onClose }: ProductDetailsDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      window.setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const details = PRODUCT_EXTRA_DETAILS[product.id] || {
    features: ['High quality security camera', 'Smart motion alerts', 'Live view feed'],
    specs: { 'Type': 'Security Camera', 'Connectivity': 'Wi-Fi' },
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [tabindex]:not([tabindex="-1"])',
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
        aria-labelledby="product-dialog-title"
      >
        <div className={styles.header}>
          <h2 id="product-dialog-title">{product.name}</h2>
          <span className={styles.price}>{product.cardPrice.currentLabel}</span>
        </div>

        <div className={styles.body}>
          <div className={styles.heroSection}>
            <div className={styles.imageWrapper}>
              <img className={styles.image} src={resolveAsset(product.image)} alt={product.name} />
            </div>
            <div className={styles.descriptionBlock}>
              <p className={styles.description}>{product.description}</p>
              <h3 className={styles.subTitle}>Key Features</h3>
              <ul className={styles.featuresList}>
                {details.features.map((feature, idx) => (
                  <li key={idx} className={styles.featureItem}>
                    <svg className={styles.checkIcon} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.specificationsSection}>
            <h3 className={styles.subTitle}>Technical Specifications</h3>
            <div className={styles.specsGrid}>
              {Object.entries(details.specs).map(([key, value]) => (
                <div key={key} className={styles.specRow}>
                  <span className={styles.specLabel}>{key}</span>
                  <span className={styles.specValue}>{value}</span>
                </div>
              ))}
            </div>
          </div>
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

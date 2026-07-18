import { createContext } from 'react';

import type {
  BundleData,
  BundleState,
  DerivedReviewSection,
  PriceTotals,
} from '../types/bundle';

export type BundleContextValue = {
  bundle: BundleData;
  state: BundleState;
  reviewSections: DerivedReviewSection[];
  totals: PriceTotals;
  toggleStep: (stepId: string) => void;
  openStep: (stepId: string) => void;
  setActiveVariant: (productId: string, variantId: string) => void;
  changeQuantity: (
    quantityKey: string,
    delta: 1 | -1,
    minimum?: number,
  ) => void;
  saveConfiguration: () => void;
};

export const BundleContext = createContext<BundleContextValue | null>(null);

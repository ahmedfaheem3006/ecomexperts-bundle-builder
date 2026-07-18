import { useContext } from 'react';

import { BundleContext, type BundleContextValue } from './bundleContextValue';

export function useBundle(): BundleContextValue {
  const context = useContext(BundleContext);
  if (!context) {
    throw new Error('useBundle must be used inside BundleProvider.');
  }
  return context;
}

import {
  useCallback,
  useMemo,
  useReducer,
  type PropsWithChildren,
} from 'react';

import { bundleReducer, createInitialBundleState } from '../state/bundleReducer';
import { restoreBundleState, saveBundleState } from '../state/persistence';
import { derivePriceTotals, deriveReviewSections } from '../state/selectors';
import type { BundleData, BundleState } from '../types/bundle';
import { BundleContext, type BundleContextValue } from './bundleContextValue';

function initializeState(bundle: BundleData): BundleState {
  const initialState = createInitialBundleState(bundle);
  const responsiveInitialState =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(max-width: 560px)').matches
      ? { ...initialState, openStepId: '' }
      : initialState;

  if (typeof localStorage === 'undefined') {
    return responsiveInitialState;
  }
  return restoreBundleState(bundle, localStorage, responsiveInitialState);
}

type BundleProviderProps = PropsWithChildren<{
  bundle: BundleData;
}>;

export function BundleProvider({ bundle, children }: BundleProviderProps) {
  const [state, dispatch] = useReducer(bundleReducer, bundle, initializeState);

  const reviewSections = useMemo(
    () => deriveReviewSections(bundle, state),
    [bundle, state],
  );
  const totals = useMemo(
    () => derivePriceTotals(reviewSections),
    [reviewSections],
  );

  const toggleStep = useCallback((stepId: string) => {
    dispatch({ type: 'TOGGLE_STEP', stepId });
  }, []);

  const openStep = useCallback((stepId: string) => {
    dispatch({ type: 'OPEN_STEP', stepId });
  }, []);

  const setActiveVariant = useCallback(
    (productId: string, variantId: string) => {
      dispatch({ type: 'SET_ACTIVE_VARIANT', productId, variantId });
    },
    [],
  );

  const changeQuantity = useCallback(
    (quantityKey: string, delta: 1 | -1, minimum = 0) => {
      dispatch({
        type: 'CHANGE_QUANTITY',
        quantityKey,
        delta,
        minimum,
      });
    },
    [],
  );

  const saveConfiguration = useCallback(() => {
    if (typeof localStorage === 'undefined') {
      dispatch({ type: 'SET_SAVE_STATUS', status: 'error' });
      return;
    }

    try {
      saveBundleState(state, localStorage);
      dispatch({ type: 'SET_SAVE_STATUS', status: 'saved' });
    } catch {
      dispatch({ type: 'SET_SAVE_STATUS', status: 'error' });
    }
  }, [state]);

  const contextValue = useMemo<BundleContextValue>(
    () => ({
      bundle,
      state,
      reviewSections,
      totals,
      toggleStep,
      openStep,
      setActiveVariant,
      changeQuantity,
      saveConfiguration,
    }),
    [
      bundle,
      state,
      reviewSections,
      totals,
      toggleStep,
      openStep,
      setActiveVariant,
      changeQuantity,
      saveConfiguration,
    ],
  );

  return (
    <BundleContext.Provider value={contextValue}>
      {children}
    </BundleContext.Provider>
  );
}

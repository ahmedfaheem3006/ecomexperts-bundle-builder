import { createInitialBundleState } from './bundleReducer';
import type { BundleData, BundleState } from '../types/bundle';

export const BUNDLE_STORAGE_KEY = 'bundle-builder:configuration';
export const BUNDLE_STORAGE_VERSION = 1;

type StoredBundleState = {
  version: typeof BUNDLE_STORAGE_VERSION;
  state: Pick<
    BundleState,
    'openStepId' | 'activeVariantByProduct' | 'quantities'
  >;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidStoredState(
  value: unknown,
  bundle: BundleData,
): value is StoredBundleState {
  if (!isRecord(value) || value['version'] !== BUNDLE_STORAGE_VERSION) {
    return false;
  }

  const storedState = value['state'];
  if (!isRecord(storedState)) {
    return false;
  }

  const openStepId = storedState['openStepId'];
  const validStepIds = new Set(bundle.steps.map((step) => step.id));
  if (
    typeof openStepId !== 'string' ||
    (openStepId !== '' && !validStepIds.has(openStepId as never))
  ) {
    return false;
  }

  const quantities = storedState['quantities'];
  if (!isRecord(quantities)) {
    return false;
  }

  const expectedQuantityKeys = Object.keys(bundle.quantities).sort();
  const storedQuantityKeys = Object.keys(quantities).sort();
  if (expectedQuantityKeys.join('|') !== storedQuantityKeys.join('|')) {
    return false;
  }

  for (const quantityKey of expectedQuantityKeys) {
    const quantity = quantities[quantityKey];
    if (
      typeof quantity !== 'number' ||
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      return false;
    }
  }

  for (const requiredItem of bundle.sensors.filter((item) => item.required)) {
    const requiredQuantity = quantities[requiredItem.quantityKey];
    if (typeof requiredQuantity !== 'number' || requiredQuantity < 1) {
      return false;
    }
  }

  const activeVariantByProduct = storedState['activeVariantByProduct'];
  if (!isRecord(activeVariantByProduct)) {
    return false;
  }

  const camerasById = new Map(
    bundle.cameras.map((camera) => [camera.id, camera]),
  );
  for (const [productId, variantId] of Object.entries(
    activeVariantByProduct,
  )) {
    const camera = camerasById.get(productId);
    if (
      !camera ||
      typeof variantId !== 'string' ||
      !camera.variants.some((variant) => variant.id === variantId)
    ) {
      return false;
    }
  }

  return true;
}

export function restoreBundleState(
  bundle: BundleData,
  storage: Storage,
  initialState = createInitialBundleState(bundle),
): BundleState {
  try {
    const serializedState = storage.getItem(BUNDLE_STORAGE_KEY);
    if (!serializedState) {
      return initialState;
    }

    const parsedState: unknown = JSON.parse(serializedState);
    if (!isValidStoredState(parsedState, bundle)) {
      return initialState;
    }

    return {
      ...initialState,
      ...parsedState.state,
      quantities: { ...parsedState.state.quantities },
      activeVariantByProduct: {
        ...parsedState.state.activeVariantByProduct,
      },
      saveStatus: 'idle',
    };
  } catch {
    return initialState;
  }
}

export function saveBundleState(state: BundleState, storage: Storage): void {
  const storedState: StoredBundleState = {
    version: BUNDLE_STORAGE_VERSION,
    state: {
      openStepId: state.openStepId,
      activeVariantByProduct: state.activeVariantByProduct,
      quantities: state.quantities,
    },
  };

  storage.setItem(BUNDLE_STORAGE_KEY, JSON.stringify(storedState));
}

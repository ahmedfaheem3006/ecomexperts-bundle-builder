import type { BundleData, BundleState, SaveStatus } from '../types/bundle';

export type BundleAction =
  | { type: 'TOGGLE_STEP'; stepId: string }
  | { type: 'OPEN_STEP'; stepId: string }
  | { type: 'SET_ACTIVE_VARIANT'; productId: string; variantId: string }
  | {
      type: 'CHANGE_QUANTITY';
      quantityKey: string;
      delta: 1 | -1;
      minimum?: number;
    }
  | { type: 'SET_QUANTITY'; quantityKey: string; quantity: number }
  | { type: 'SET_SAVE_STATUS'; status: SaveStatus };

export function createInitialBundleState(bundle: BundleData): BundleState {
  const activeVariantByProduct: Record<string, string> = {};

  for (const camera of bundle.cameras) {
    if (camera.initialActiveVariantId) {
      activeVariantByProduct[camera.id] = camera.initialActiveVariantId;
    }
  }

  return {
    openStepId:
      bundle.steps.find((step) => step.desktopInitiallyExpanded)?.id ??
      bundle.steps[0]?.id ??
      '',
    activeVariantByProduct,
    quantities: { ...bundle.quantities },
    saveStatus: 'idle',
  };
}

export function bundleReducer(
  state: BundleState,
  action: BundleAction,
): BundleState {
  switch (action.type) {
    case 'TOGGLE_STEP':
      return {
        ...state,
        openStepId: state.openStepId === action.stepId ? '' : action.stepId,
      };
    case 'OPEN_STEP':
      return { ...state, openStepId: action.stepId };
    case 'SET_ACTIVE_VARIANT':
      return {
        ...state,
        activeVariantByProduct: {
          ...state.activeVariantByProduct,
          [action.productId]: action.variantId,
        },
      };
    case 'CHANGE_QUANTITY': {
      const currentQuantity = state.quantities[action.quantityKey] ?? 0;
      const minimum = action.minimum ?? 0;
      const nextQuantity = Math.max(minimum, currentQuantity + action.delta);
      return {
        ...state,
        quantities: {
          ...state.quantities,
          [action.quantityKey]: nextQuantity,
        },
        saveStatus: 'idle',
      };
    }
    case 'SET_QUANTITY':
      return {
        ...state,
        quantities: {
          ...state.quantities,
          [action.quantityKey]: Math.max(0, Math.trunc(action.quantity)),
        },
        saveStatus: 'idle',
      };
    case 'SET_SAVE_STATUS':
      return { ...state, saveStatus: action.status };
    default:
      return state;
  }
}

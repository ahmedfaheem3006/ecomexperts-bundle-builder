import { describe, expect, it } from 'vitest';

import { bundleFixture } from '../test/bundle.fixture';
import { bundleReducer, createInitialBundleState } from './bundleReducer';
import {
  derivePriceTotals,
  deriveReviewSections,
  getSelectedProductCount,
} from './selectors';

describe('bundle reducer and selectors', () => {
  it('keeps every variant quantity independent when variants switch', () => {
    const initialState = createInitialBundleState(bundleFixture);
    const blackActive = bundleReducer(initialState, {
      type: 'SET_ACTIVE_VARIANT',
      productId: 'wyze-cam-v4',
      variantId: 'black',
    });
    const blackIncremented = bundleReducer(blackActive, {
      type: 'CHANGE_QUANTITY',
      quantityKey: 'wyze-cam-v4:black',
      delta: 1,
    });
    const whiteActiveAgain = bundleReducer(blackIncremented, {
      type: 'SET_ACTIVE_VARIANT',
      productId: 'wyze-cam-v4',
      variantId: 'white',
    });

    expect(whiteActiveAgain.quantities['wyze-cam-v4:white']).toBe(1);
    expect(whiteActiveAgain.quantities['wyze-cam-v4:black']).toBe(1);
    expect(whiteActiveAgain.activeVariantByProduct['wyze-cam-v4']).toBe(
      'white',
    );
  });

  it('counts selected cameras by distinct product, not units or variants', () => {
    let state = createInitialBundleState(bundleFixture);
    expect(getSelectedProductCount('cameras', bundleFixture, state)).toBe(2);

    state = bundleReducer(state, {
      type: 'CHANGE_QUANTITY',
      quantityKey: 'wyze-cam-v4:black',
      delta: 1,
    });
    expect(getSelectedProductCount('cameras', bundleFixture, state)).toBe(2);

    state = bundleReducer(state, {
      type: 'CHANGE_QUANTITY',
      quantityKey: 'wyze-cam-floodlight-v2:white',
      delta: 1,
    });
    expect(getSelectedProductCount('cameras', bundleFixture, state)).toBe(3);
  });

  it('derives exact initial and live totals and savings', () => {
    const initialState = createInitialBundleState(bundleFixture);
    const initialTotals = derivePriceTotals(
      deriveReviewSections(bundleFixture, initialState),
    );

    expect(initialTotals).toEqual({
      currentCents: 18789,
      compareAtCents: 23881,
      savingsCents: 5092,
    });

    const updatedState = bundleReducer(initialState, {
      type: 'CHANGE_QUANTITY',
      quantityKey: 'wyze-cam-v4:white',
      delta: 1,
    });
    const updatedTotals = derivePriceTotals(
      deriveReviewSections(bundleFixture, updatedState),
    );

    expect(updatedTotals).toEqual({
      currentCents: 21587,
      compareAtCents: 27479,
      savingsCents: 5892,
    });
  });
});

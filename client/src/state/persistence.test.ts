import { beforeEach, describe, expect, it } from 'vitest';

import { bundleFixture } from '../test/bundle.fixture';
import { bundleReducer, createInitialBundleState } from './bundleReducer';
import {
  BUNDLE_STORAGE_KEY,
  restoreBundleState,
  saveBundleState,
} from './persistence';

describe('bundle persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('writes and restores versioned configuration state', () => {
    const initialState = createInitialBundleState(bundleFixture);
    const updatedState = bundleReducer(initialState, {
      type: 'CHANGE_QUANTITY',
      quantityKey: 'wyze-cam-v4:black',
      delta: 1,
    });

    saveBundleState(updatedState, localStorage);
    const serializedState = localStorage.getItem(BUNDLE_STORAGE_KEY);
    expect(serializedState).not.toBeNull();
    expect(JSON.parse(serializedState ?? '{}')).toMatchObject({ version: 1 });

    const restoredState = restoreBundleState(bundleFixture, localStorage);
    expect(restoredState.quantities['wyze-cam-v4:black']).toBe(1);
    expect(restoredState.quantities['wyze-cam-v4:white']).toBe(1);
  });

  it('falls back to the Figma initial state for invalid saved data', () => {
    localStorage.setItem(
      BUNDLE_STORAGE_KEY,
      JSON.stringify({ version: 1, state: { quantities: { invalid: -4 } } }),
    );

    const restoredState = restoreBundleState(bundleFixture, localStorage);
    expect(restoredState).toEqual(createInitialBundleState(bundleFixture));
  });
});

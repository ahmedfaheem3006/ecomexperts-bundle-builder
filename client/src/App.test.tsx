import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { App } from './App';
import { BUNDLE_STORAGE_KEY } from './state/persistence';
import { bundleFixture } from './test/bundle.fixture';

function mockBundleRequest() {
  return vi.spyOn(globalThis, 'fetch').mockImplementation(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(structuredClone(bundleFixture)),
    } as Response),
  );
}

async function renderLoadedApp() {
  render(<App />);
  await screen.findByRole('heading', { name: 'Let’s get started!' });
}

describe('Bundle Builder integration', () => {
  beforeEach(() => {
    localStorage.clear();
    mockBundleRequest();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('opens step one initially and supports toggle and next-step focus', async () => {
    const user = userEvent.setup();
    await renderLoadedApp();

    const cameraStep = screen.getByRole('button', {
      name: /Choose your cameras/,
    });
    const planStep = screen.getByRole('button', {
      name: /^Choose your plan 1 selected$/,
    });
    expect(cameraStep).toHaveAttribute('aria-expanded', 'true');
    expect(planStep).toHaveAttribute('aria-expanded', 'false');

    await user.click(cameraStep);
    expect(cameraStep).toHaveAttribute('aria-expanded', 'false');
    await user.click(cameraStep);

    await user.click(
      screen.getByRole('button', { name: 'Next: Choose your plan' }),
    );
    expect(planStep).toHaveAttribute('aria-expanded', 'true');
    expect(planStep).toHaveFocus();
  });

  it('keeps product-card and review-panel steppers synchronized', async () => {
    const user = userEvent.setup();
    await renderLoadedApp();

    const productCard = screen.getByRole('article', { name: 'Wyze Cam v4' });
    await user.click(
      within(productCard).getByRole('button', {
        name: 'Increase Wyze Cam v4 White',
      }),
    );

    expect(
      screen.getByLabelText('Wyze Cam v4 — White review quantity'),
    ).toHaveTextContent('2');

    const reviewLine = screen.getByRole('article', {
      name: 'Wyze Cam v4 — White',
    });
    await user.click(
      within(reviewLine).getByRole('button', {
        name: 'Decrease Wyze Cam v4 — White review',
      }),
    );

    expect(
      within(productCard).getByLabelText('Wyze Cam v4 White quantity'),
    ).toHaveTextContent('1');
  });

  it('preserves independent variants and counts distinct products', async () => {
    const user = userEvent.setup();
    await renderLoadedApp();

    const cameraStep = screen.getByRole('button', {
      name: /Choose your cameras/,
    });
    const camV4Card = screen.getByRole('article', { name: 'Wyze Cam v4' });
    await user.click(
      within(camV4Card).getByRole('button', {
        name: 'Select Wyze Cam v4 Black',
      }),
    );
    await user.click(
      within(camV4Card).getByRole('button', {
        name: 'Increase Wyze Cam v4 Black',
      }),
    );
    expect(cameraStep).toHaveTextContent('2 selected');
    expect(
      screen.getByRole('article', { name: 'Wyze Cam v4 — White' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('article', { name: 'Wyze Cam v4 — Black' }),
    ).toBeInTheDocument();

    const floodlightCard = screen.getByRole('article', {
      name: 'Wyze Cam Floodlight v2',
    });
    await user.click(
      within(floodlightCard).getByRole('button', {
        name: 'Increase Wyze Cam Floodlight v2 White',
      }),
    );
    expect(cameraStep).toHaveTextContent('3 selected');

    await user.click(
      within(camV4Card).getByRole('button', {
        name: 'Select Wyze Cam v4 White',
      }),
    );
    expect(
      within(camV4Card).getByLabelText('Wyze Cam v4 White quantity'),
    ).toHaveTextContent('1');
  });

  it('updates totals and savings live', async () => {
    const user = userEvent.setup();
    await renderLoadedApp();

    expect(screen.getByLabelText('Bundle total')).toHaveTextContent('$187.89');
    expect(screen.getByLabelText('Bundle savings')).toHaveTextContent('$50.92');

    const productCard = screen.getByRole('article', { name: 'Wyze Cam v4' });
    await user.click(
      within(productCard).getByRole('button', {
        name: 'Increase Wyze Cam v4 White',
      }),
    );

    expect(screen.getByLabelText('Bundle total')).toHaveTextContent('$215.87');
    expect(screen.getByLabelText('Bundle savings')).toHaveTextContent('$58.92');
  });

  it('saves versioned state and restores it after reload', async () => {
    const user = userEvent.setup();
    const firstRender = render(<App />);
    await screen.findByRole('heading', { name: 'Let’s get started!' });

    const productCard = screen.getByRole('article', { name: 'Wyze Cam v4' });
    await user.click(
      within(productCard).getByRole('button', {
        name: 'Increase Wyze Cam v4 White',
      }),
    );
    await user.click(
      screen.getByRole('button', { name: 'Save my system for later' }),
    );
    expect(screen.getByText('Your configuration was saved.')).toBeVisible();
    expect(JSON.parse(localStorage.getItem(BUNDLE_STORAGE_KEY) ?? '{}')).toMatchObject({
      version: 1,
    });

    firstRender.unmount();
    render(<App />);
    await screen.findByRole('heading', { name: 'Let’s get started!' });
    const restoredCard = screen.getByRole('article', { name: 'Wyze Cam v4' });
    expect(
      within(restoredCard).getByLabelText('Wyze Cam v4 White quantity'),
    ).toHaveTextContent('2');
  });

  it('falls back to Figma state when saved data is invalid', async () => {
    localStorage.setItem(
      BUNDLE_STORAGE_KEY,
      JSON.stringify({ version: 99, state: { quantities: {} } }),
    );
    await renderLoadedApp();

    const productCard = screen.getByRole('article', { name: 'Wyze Cam v4' });
    expect(
      within(productCard).getByLabelText('Wyze Cam v4 White quantity'),
    ).toHaveTextContent('1');
  });

  it('opens and closes an accessible checkout confirmation dialog', async () => {
    const user = userEvent.setup();
    await renderLoadedApp();

    const checkoutButton = screen.getByRole('button', { name: 'Checkout' });
    await user.click(checkoutButton);
    const dialog = screen.getByRole('dialog', { name: 'Confirm checkout' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();

    fireEvent.keyDown(dialog.parentElement ?? dialog, {
      key: 'Tab',
      shiftKey: true,
    });
    expect(
      screen.getByRole('button', { name: 'Confirm checkout' }),
    ).toHaveFocus();

    fireEvent.keyDown(dialog.parentElement ?? dialog, { key: 'Tab' });
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();

    fireEvent.keyDown(dialog.parentElement ?? dialog, { key: 'Escape' });
    expect(
      screen.queryByRole('dialog', { name: 'Confirm checkout' }),
    ).not.toBeInTheDocument();
    expect(checkoutButton).toHaveFocus();
  });

  it('starts with all accordion steps collapsed on a phone viewport', async () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({ matches: true }),
    );
    await renderLoadedApp();

    const stepButtons = [
      screen.getByRole('button', { name: /Choose your cameras/ }),
      screen.getByRole('button', { name: /Choose your plan/ }),
      screen.getByRole('button', { name: /Choose your sensors/ }),
      screen.getByRole('button', { name: /Add extra protection/ }),
    ];

    for (const stepButton of stepButtons) {
      expect(stepButton).toHaveAttribute('aria-expanded', 'false');
    }
  });
});

import { useEffect, useState } from 'react';

import { fetchBundle } from './api/bundle';
import { BundleBuilder } from './components/BundleBuilder/BundleBuilder';
import { BundleProvider } from './context/BundleContext';
import type { BundleData } from './types/bundle';
import styles from './App.module.css';

export function App() {
  const [bundle, setBundle] = useState<BundleData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    void fetchBundle(controller.signal)
      .then((bundleData) => {
        setBundle(bundleData);
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') {
          return;
        }
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'The bundle could not be loaded.',
        );
      });

    return () => controller.abort();
  }, []);

  if (error) {
    return (
      <main className={styles.status}>
        <h1>Bundle unavailable</h1>
        <p role="alert">{error}</p>
      </main>
    );
  }

  if (!bundle) {
    return (
      <main className={styles.status}>
        <p role="status">Loading bundle…</p>
      </main>
    );
  }

  return (
    <main className={styles.root}>
      <BundleProvider bundle={bundle}>
        <BundleBuilder />
      </BundleProvider>
    </main>
  );
}

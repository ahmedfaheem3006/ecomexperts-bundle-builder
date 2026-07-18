import type { BundleData } from '../types/bundle';

function isBundleData(value: unknown): value is BundleData {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<BundleData>;
  return (
    candidate.currency === 'USD' &&
    Array.isArray(candidate.steps) &&
    candidate.steps.length === 4 &&
    Array.isArray(candidate.cameras) &&
    candidate.cameras.length === 5 &&
    typeof candidate.quantities === 'object' &&
    candidate.quantities !== null &&
    typeof candidate.reviewPanel === 'object' &&
    candidate.reviewPanel !== null
  );
}

export async function fetchBundle(signal?: AbortSignal): Promise<BundleData> {
  const response = await fetch('/api/bundle', { signal });

  if (!response.ok) {
    throw new Error(`Bundle request failed with status ${response.status}.`);
  }

  const data: unknown = await response.json();
  if (!isBundleData(data)) {
    throw new Error('The bundle API returned an invalid payload.');
  }

  return data;
}

import type {
  BundleData,
  BundleState,
  CameraProduct,
  DerivedReviewLine,
  DerivedReviewSection,
  Price,
  PriceTotals,
  ReviewItem,
  StepId,
} from '../types/bundle';

function getQuantity(state: BundleState, quantityKey: string): number {
  return state.quantities[quantityKey] ?? 0;
}

export function getActiveVariantId(
  camera: CameraProduct,
  state: BundleState,
): string | null {
  return (
    state.activeVariantByProduct[camera.id] ??
    camera.initialActiveVariantId ??
    camera.variants[0]?.id ??
    null
  );
}

export function getActiveQuantityKey(
  camera: CameraProduct,
  state: BundleState,
): string {
  if (camera.variants.length === 0) {
    if (!camera.defaultQuantityKey) {
      throw new Error(`Camera ${camera.id} has no default quantity key.`);
    }
    return camera.defaultQuantityKey;
  }

  const activeVariantId = getActiveVariantId(camera, state);
  const activeVariant = camera.variants.find(
    (variant) => variant.id === activeVariantId,
  );
  if (!activeVariant) {
    throw new Error(`Camera ${camera.id} has no usable active variant.`);
  }
  return activeVariant.quantityKey;
}

export function getCameraTotalQuantity(
  camera: CameraProduct,
  state: BundleState,
): number {
  if (camera.variants.length === 0) {
    return camera.defaultQuantityKey
      ? getQuantity(state, camera.defaultQuantityKey)
      : 0;
  }

  return camera.variants.reduce(
    (total, variant) => total + getQuantity(state, variant.quantityKey),
    0,
  );
}

export function getSelectedProductCount(
  stepId: StepId,
  bundle: BundleData,
  state: BundleState,
): number {
  switch (stepId) {
    case 'cameras':
      return bundle.cameras.filter(
        (camera) => getCameraTotalQuantity(camera, state) > 0,
      ).length;
    case 'plan':
      return getQuantity(state, bundle.plan.quantityKey) > 0 ? 1 : 0;
    case 'sensors':
      return bundle.sensors.filter(
        (sensor) => getQuantity(state, sensor.quantityKey) > 0,
      ).length;
    case 'extra-protection':
      return bundle.accessories.filter(
        (accessory) => getQuantity(state, accessory.quantityKey) > 0,
      ).length;
  }
}

function findInitialReviewItem(
  bundle: BundleData,
  entityId: string,
): ReviewItem | undefined {
  return bundle.reviewPanel.sections
    .flatMap((section) => section.items)
    .find((item) => item.entityId === entityId);
}

function getUnitPrice(price: Price, initialQuantity: number): Price {
  if (initialQuantity <= 0) {
    return price;
  }

  return {
    ...price,
    currentCents: price.currentCents / initialQuantity,
    compareAtCents:
      price.compareAtCents === null
        ? null
        : price.compareAtCents / initialQuantity,
  };
}

function getEntityUnitPrice(
  bundle: BundleData,
  entityId: string,
  fallbackPrice: Price,
): Price {
  const reviewItem = findInitialReviewItem(bundle, entityId);
  if (!reviewItem || reviewItem.quantity === null || reviewItem.quantity === 0) {
    return fallbackPrice;
  }
  return getUnitPrice(reviewItem, reviewItem.quantity);
}

function createPricedLine(
  base: Omit<DerivedReviewLine, 'currentCents' | 'compareAtCents'>,
  unitPrice: Price,
): DerivedReviewLine {
  const quantity = base.quantity ?? 1;
  return {
    ...base,
    currentCents: unitPrice.currentCents * quantity,
    compareAtCents:
      unitPrice.compareAtCents === null
        ? null
        : unitPrice.compareAtCents * quantity,
  };
}

export function deriveReviewSections(
  bundle: BundleData,
  state: BundleState,
): DerivedReviewSection[] {
  const linesByCategory = new Map<string, DerivedReviewLine[]>();
  const addLine = (line: DerivedReviewLine) => {
    const categoryLines = linesByCategory.get(line.categoryId) ?? [];
    categoryLines.push(line);
    linesByCategory.set(line.categoryId, categoryLines);
  };

  for (const camera of bundle.cameras) {
    const unitPrice = getEntityUnitPrice(
      bundle,
      camera.id,
      camera.cardPrice,
    );

    if (camera.variants.length === 0 && camera.defaultQuantityKey) {
      const quantity = getQuantity(state, camera.defaultQuantityKey);
      if (quantity > 0) {
        addLine(
          createPricedLine(
            {
              id: camera.defaultQuantityKey,
              categoryId: 'cameras',
              name: camera.name,
              image: camera.image,
              quantityKey: camera.defaultQuantityKey,
              quantity,
              minimum: 0,
              controlsDisabled: false,
              includeInTotals: true,
            },
            unitPrice,
          ),
        );
      }
      continue;
    }

    for (const variant of camera.variants) {
      const quantity = getQuantity(state, variant.quantityKey);
      if (quantity === 0) {
        continue;
      }

      addLine(
        createPricedLine(
          {
            id: variant.quantityKey,
            categoryId: 'cameras',
            name: `${camera.name} — ${variant.label}`,
            image: variant.image,
            quantityKey: variant.quantityKey,
            quantity,
            minimum: 0,
            controlsDisabled: false,
            includeInTotals: true,
          },
          unitPrice,
        ),
      );
    }
  }

  for (const sensor of bundle.sensors) {
    const quantity = getQuantity(state, sensor.quantityKey);
    if (quantity === 0) {
      continue;
    }
    const unitPrice = getEntityUnitPrice(
      bundle,
      sensor.id,
      sensor.initialReviewPrice,
    );
    addLine(
      createPricedLine(
        {
          id: sensor.quantityKey,
          categoryId: 'sensors',
          name: sensor.name,
          image: sensor.image,
          quantityKey: sensor.quantityKey,
          quantity,
          minimum: sensor.required ? 1 : 0,
          controlsDisabled: sensor.required,
          includeInTotals: true,
        },
        unitPrice,
      ),
    );
  }

  for (const accessory of bundle.accessories) {
    const quantity = getQuantity(state, accessory.quantityKey);
    if (quantity === 0) {
      continue;
    }
    const unitPrice = getEntityUnitPrice(
      bundle,
      accessory.id,
      accessory.initialReviewPrice,
    );
    addLine(
      createPricedLine(
        {
          id: accessory.quantityKey,
          categoryId: 'accessories',
          name: accessory.name,
          image: accessory.image,
          quantityKey: accessory.quantityKey,
          quantity,
          minimum: 0,
          controlsDisabled: false,
          includeInTotals: true,
        },
        unitPrice,
      ),
    );
  }

  const planQuantity = getQuantity(state, bundle.plan.quantityKey);
  if (planQuantity > 0) {
    addLine(
      createPricedLine(
        {
          id: bundle.plan.quantityKey,
          categoryId: 'plan',
          name: bundle.plan.name,
          image: bundle.plan.icon,
          quantityKey: bundle.plan.quantityKey,
          quantity: planQuantity,
          minimum: 0,
          controlsDisabled: false,
          billingSuffix: '/mo',
          includeInTotals: true,
        },
        bundle.plan.initialReviewPrice,
      ),
    );
  }

  addLine(
    createPricedLine(
      {
        id: bundle.shipping.id,
        categoryId: 'shipping',
        name: bundle.shipping.name,
        image: bundle.shipping.icon,
        quantityKey: null,
        quantity: null,
        minimum: 0,
        controlsDisabled: true,
        includeInTotals: false,
      },
      bundle.shipping.initialReviewPrice,
    ),
  );

  return bundle.reviewPanel.sections
    .map((section) => ({
      id: section.id,
      label: section.desktopLabel,
      lines: linesByCategory.get(section.id) ?? [],
    }))
    .filter((section) => section.lines.length > 0);
}

export function derivePriceTotals(
  sections: DerivedReviewSection[],
): PriceTotals {
  return sections
    .flatMap((section) => section.lines)
    .filter((line) => line.includeInTotals)
    .reduce<PriceTotals>(
      (totals, line) => {
        const compareAtCents = line.compareAtCents ?? line.currentCents;
        return {
          currentCents: totals.currentCents + line.currentCents,
          compareAtCents: totals.compareAtCents + compareAtCents,
          savingsCents:
            totals.savingsCents + (compareAtCents - line.currentCents),
        };
      },
      { currentCents: 0, compareAtCents: 0, savingsCents: 0 },
    );
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

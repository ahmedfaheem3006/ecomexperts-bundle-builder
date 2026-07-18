import { z } from 'zod';

const assetPathSchema = z
  .string()
  .regex(/^client\/src\/assets\/(products|variants|icons|badges)\/[a-z0-9-]+\.(png|svg)$/);

const nullableMoneyFieldsSchema = z.object({
  currentCents: z.number().int().nonnegative(),
  currentLabel: z.string().min(1),
  compareAtCents: z.number().int().nonnegative().nullable(),
  compareAtLabel: z.string().min(1).nullable(),
});

const cardPriceSchema = nullableMoneyFieldsSchema.extend({
  discountPercent: z.number().int().min(0).max(100).nullable(),
  discountLabel: z.string().min(1).nullable(),
});

const quantityKeySchema = z
  .string()
  .regex(/^[a-z0-9-]+:(?:[a-z0-9-]+|default)$/);

const variantSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  label: z.string().min(1),
  image: assetPathSchema,
  quantityKey: quantityKeySchema,
});

const cameraSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  categoryId: z.literal('cameras'),
  description: z.string().min(1),
  learnMoreLabel: z.literal('Learn More'),
  image: assetPathSchema,
  cardPrice: cardPriceSchema,
  variants: z.array(variantSchema),
  defaultQuantityKey: quantityKeySchema.optional(),
  initialActiveVariantId: z.string().regex(/^[a-z0-9-]+$/).nullable(),
});

const reviewPricedEntitySchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  categoryId: z.enum(['sensors', 'accessories']),
  image: assetPathSchema,
  quantityKey: quantityKeySchema,
  required: z.boolean(),
  initialReviewPrice: nullableMoneyFieldsSchema,
});

const reviewItemSchema = nullableMoneyFieldsSchema.extend({
  entityType: z.enum(['camera', 'sensor', 'accessory', 'plan', 'shipping']),
  entityId: z.string().regex(/^[a-z0-9-]+$/),
  quantityKey: quantityKeySchema.nullable(),
  quantity: z.number().int().nonnegative().nullable(),
});

export const bundleSchema = z
  .object({
    source: z.object({
      figmaFileKey: z.literal('rBxplaFFJ2CaIttgPuSPQm'),
      desktopNodeId: z.literal('68:9663'),
      mobileNodeId: z.literal('74:19845'),
      desktopFrame: z.object({
        width: z.literal(1440),
        height: z.literal(1077),
      }),
      mobileFrame: z.object({
        width: z.literal(390),
        height: z.literal(1252),
      }),
    }),
    currency: z.literal('USD'),
    steps: z
      .array(
        z.object({
          id: z.enum(['cameras', 'plan', 'sensors', 'extra-protection']),
          order: z.number().int().min(1).max(4),
          eyebrow: z.string().regex(/^Step [1-4] of 4$/),
          title: z.string().min(1),
          categoryId: z.enum(['cameras', 'plan', 'sensors', 'accessories']),
          initialSelectedCount: z.number().int().nonnegative(),
          desktopInitiallyExpanded: z.boolean(),
          mobileInitiallyExpanded: z.boolean(),
          icon: assetPathSchema,
        }),
      )
      .length(4),
    categories: z.array(
      z.object({
        id: z.enum(['cameras', 'sensors', 'accessories', 'plan', 'shipping']),
        label: z.string().min(1).nullable(),
        mobileLabel: z.string().min(1).optional(),
      }),
    ),
    cameras: z.array(cameraSchema).length(5),
    plan: z.object({
      id: z.literal('cam-unlimited'),
      name: z.literal('Cam Unlimited'),
      categoryId: z.literal('plan'),
      quantityKey: quantityKeySchema,
      icon: assetPathSchema,
      billingPeriod: z.literal('month'),
      initialReviewPrice: nullableMoneyFieldsSchema,
    }),
    sensors: z.array(reviewPricedEntitySchema).length(2),
    accessories: z.array(reviewPricedEntitySchema).length(1),
    shipping: z.object({
      id: z.literal('fast-shipping'),
      name: z.literal('Fast Shipping'),
      categoryId: z.literal('shipping'),
      icon: assetPathSchema,
      initialReviewPrice: nullableMoneyFieldsSchema,
    }),
    quantities: z.record(quantityKeySchema, z.number().int().nonnegative()),
    financing: z.object({
      label: z.literal('as low as $19.19/mo'),
      amountCents: z.literal(1919),
      billingPeriod: z.literal('month'),
    }),
    guarantee: z.object({
      title: z.literal('100% Wyze satisfaction guarantee'),
      detail: z.literal('Try worry-free for 30 days'),
      image: assetPathSchema,
    }),
    totalsMetadata: z.object({
      compareAtCents: z.number().int().nonnegative(),
      compareAtLabel: z.string().min(1),
      totalCents: z.number().int().nonnegative(),
      totalLabel: z.string().min(1),
      savingsCents: z.number().int().nonnegative(),
      savingsLabel: z.string().min(1),
      savingsMessage: z.string().min(1),
    }),
    reviewPanel: z.object({
      eyebrow: z.literal('Review'),
      title: z.literal('Your security system'),
      description: z.literal(
        'Review your personalized protection system designed to keep what matters most safe.',
      ),
      sections: z.array(
        z.object({
          id: z.enum(['cameras', 'sensors', 'accessories', 'plan', 'shipping']),
          desktopLabel: z.string().min(1).nullable(),
          mobileLabel: z.string().min(1).nullable(),
          items: z.array(reviewItemSchema).min(1),
        }),
      ),
      checkoutLabel: z.literal('Checkout'),
      saveForLaterLabel: z.literal('Save my system for later'),
    }),
  })
  .superRefine((bundle, context) => {
    const expectedQuantityKeys = new Set<string>();
    const knownEntityIds = new Set<string>();

    const stepOrders = bundle.steps.map((step) => step.order).sort();
    if (stepOrders.join(',') !== '1,2,3,4') {
      context.addIssue({
        code: 'custom',
        path: ['steps'],
        message: 'Steps must contain each order from 1 through 4 exactly once.',
      });
    }

    for (const camera of bundle.cameras) {
      knownEntityIds.add(camera.id);

      if (camera.variants.length === 0) {
        const expectedKey = `${camera.id}:default`;
        expectedQuantityKeys.add(expectedKey);
        if (camera.defaultQuantityKey !== expectedKey) {
          context.addIssue({
            code: 'custom',
            path: ['cameras', camera.id, 'defaultQuantityKey'],
            message: `Products without variants must use ${expectedKey}.`,
          });
        }
        if (camera.initialActiveVariantId !== null) {
          context.addIssue({
            code: 'custom',
            path: ['cameras', camera.id, 'initialActiveVariantId'],
            message: 'A product without variants cannot have an active variant.',
          });
        }
        continue;
      }

      const variantIds = new Set(camera.variants.map((variant) => variant.id));
      for (const variant of camera.variants) {
        const expectedKey = `${camera.id}:${variant.id}`;
        expectedQuantityKeys.add(expectedKey);
        if (variant.quantityKey !== expectedKey) {
          context.addIssue({
            code: 'custom',
            path: ['cameras', camera.id, 'variants', variant.id, 'quantityKey'],
            message: `Variant quantities must use ${expectedKey}.`,
          });
        }
      }

      if (
        camera.initialActiveVariantId !== null &&
        !variantIds.has(camera.initialActiveVariantId)
      ) {
        context.addIssue({
          code: 'custom',
          path: ['cameras', camera.id, 'initialActiveVariantId'],
          message: 'The initial active variant must exist on the product.',
        });
      }
    }

    knownEntityIds.add(bundle.plan.id);
    expectedQuantityKeys.add(`${bundle.plan.id}:default`);

    for (const sensor of bundle.sensors) {
      knownEntityIds.add(sensor.id);
      expectedQuantityKeys.add(`${sensor.id}:default`);
      if (sensor.quantityKey !== `${sensor.id}:default`) {
        context.addIssue({
          code: 'custom',
          path: ['sensors', sensor.id, 'quantityKey'],
          message: 'Products without variants must use productId:default.',
        });
      }
      if (sensor.required && (bundle.quantities[sensor.quantityKey] ?? 0) < 1) {
        context.addIssue({
          code: 'custom',
          path: ['quantities', sensor.quantityKey],
          message: 'Required products must have an initial quantity of at least one.',
        });
      }
    }

    for (const accessory of bundle.accessories) {
      knownEntityIds.add(accessory.id);
      expectedQuantityKeys.add(`${accessory.id}:default`);
      if (accessory.quantityKey !== `${accessory.id}:default`) {
        context.addIssue({
          code: 'custom',
          path: ['accessories', accessory.id, 'quantityKey'],
          message: 'Products without variants must use productId:default.',
        });
      }
    }

    knownEntityIds.add(bundle.shipping.id);

    for (const key of expectedQuantityKeys) {
      if (!(key in bundle.quantities)) {
        context.addIssue({
          code: 'custom',
          path: ['quantities', key],
          message: 'Every product or variant must have an initial quantity.',
        });
      }
    }

    for (const key of Object.keys(bundle.quantities)) {
      if (!expectedQuantityKeys.has(key)) {
        context.addIssue({
          code: 'custom',
          path: ['quantities', key],
          message: 'Unknown quantity key.',
        });
      }
    }

    for (const section of bundle.reviewPanel.sections) {
      for (const item of section.items) {
        if (!knownEntityIds.has(item.entityId)) {
          context.addIssue({
            code: 'custom',
            path: ['reviewPanel', 'sections', section.id, item.entityId],
            message: 'Review items must reference a known entity.',
          });
        }
        if (item.quantityKey === null || item.quantity === null) {
          if (
            item.entityType !== 'shipping' ||
            item.quantityKey !== null ||
            item.quantity !== null
          ) {
            context.addIssue({
              code: 'custom',
              path: ['reviewPanel', 'sections', section.id, item.entityId],
              message: 'Only the shipping row may omit a quantity.',
            });
          }
          continue;
        }
        if (bundle.quantities[item.quantityKey] !== item.quantity) {
          context.addIssue({
            code: 'custom',
            path: ['reviewPanel', 'sections', section.id, item.quantityKey],
            message: 'Review quantities must match the initial quantities map.',
          });
        }
      }
    }

    if (
      bundle.totalsMetadata.compareAtCents - bundle.totalsMetadata.totalCents !==
      bundle.totalsMetadata.savingsCents
    ) {
      context.addIssue({
        code: 'custom',
        path: ['totalsMetadata'],
        message: 'Savings must equal compare-at total minus current total.',
      });
    }
  });

export type Bundle = z.infer<typeof bundleSchema>;

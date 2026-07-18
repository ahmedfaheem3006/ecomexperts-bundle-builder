export type CategoryId =
  | 'cameras'
  | 'sensors'
  | 'accessories'
  | 'plan'
  | 'shipping';

export type StepId = 'cameras' | 'plan' | 'sensors' | 'extra-protection';

export type SaveStatus = 'idle' | 'saved' | 'error';

export type BundleState = {
  openStepId: string;
  activeVariantByProduct: Record<string, string>;
  quantities: Record<string, number>;
  saveStatus: SaveStatus;
};

export type Price = {
  currentCents: number;
  currentLabel: string;
  compareAtCents: number | null;
  compareAtLabel: string | null;
};

export type CardPrice = Price & {
  discountPercent: number | null;
  discountLabel: string | null;
};

export type ProductVariant = {
  id: string;
  label: string;
  image: string;
  quantityKey: string;
};

export type CameraProduct = {
  id: string;
  name: string;
  categoryId: 'cameras';
  description: string;
  learnMoreLabel: 'Learn More';
  image: string;
  cardPrice: CardPrice;
  variants: ProductVariant[];
  defaultQuantityKey?: string;
  initialActiveVariantId: string | null;
};

export type BundleStep = {
  id: StepId;
  order: number;
  eyebrow: string;
  title: string;
  categoryId: Exclude<CategoryId, 'shipping'>;
  initialSelectedCount: number;
  desktopInitiallyExpanded: boolean;
  mobileInitiallyExpanded: boolean;
  icon: string;
};

export type CatalogItem = {
  id: string;
  name: string;
  categoryId: 'sensors' | 'accessories';
  image: string;
  quantityKey: string;
  required: boolean;
  initialReviewPrice: Price;
};

export type ReviewItem = Price & {
  entityType: 'camera' | 'sensor' | 'accessory' | 'plan' | 'shipping';
  entityId: string;
  quantityKey: string | null;
  quantity: number | null;
};

export type ReviewSectionData = {
  id: CategoryId;
  desktopLabel: string | null;
  mobileLabel: string | null;
  items: ReviewItem[];
};

export type BundleData = {
  source: {
    figmaFileKey: string;
    desktopNodeId: string;
    mobileNodeId: string;
    desktopFrame: { width: number; height: number };
    mobileFrame: { width: number; height: number };
  };
  currency: 'USD';
  steps: BundleStep[];
  categories: Array<{
    id: CategoryId;
    label: string | null;
    mobileLabel?: string;
  }>;
  cameras: CameraProduct[];
  plan: {
    id: string;
    name: string;
    categoryId: 'plan';
    quantityKey: string;
    icon: string;
    billingPeriod: 'month';
    initialReviewPrice: Price;
  };
  sensors: CatalogItem[];
  accessories: CatalogItem[];
  shipping: {
    id: string;
    name: string;
    categoryId: 'shipping';
    icon: string;
    initialReviewPrice: Price;
  };
  quantities: Record<string, number>;
  financing: {
    label: string;
    amountCents: number;
    billingPeriod: 'month';
  };
  guarantee: {
    title: string;
    detail: string;
    image: string;
  };
  totalsMetadata: {
    compareAtCents: number;
    compareAtLabel: string;
    totalCents: number;
    totalLabel: string;
    savingsCents: number;
    savingsLabel: string;
    savingsMessage: string;
  };
  reviewPanel: {
    eyebrow: 'Review';
    title: string;
    description: string;
    sections: ReviewSectionData[];
    checkoutLabel: string;
    saveForLaterLabel: string;
  };
};

export type DerivedReviewLine = {
  id: string;
  categoryId: CategoryId;
  name: string;
  image: string;
  quantityKey: string | null;
  quantity: number | null;
  minimum: number;
  controlsDisabled: boolean;
  currentCents: number;
  compareAtCents: number | null;
  billingSuffix?: '/mo';
  includeInTotals: boolean;
};

export type DerivedReviewSection = {
  id: CategoryId;
  label: string | null;
  lines: DerivedReviewLine[];
};

export type PriceTotals = {
  currentCents: number;
  compareAtCents: number;
  savingsCents: number;
};

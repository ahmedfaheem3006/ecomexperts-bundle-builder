import satisfactionGuarantee from './badges/satisfaction-guarantee.png';
import chevronDown from './icons/chevron-down.svg';
import chevronUp from './icons/chevron-up.svg';
import planCamUnlimited from './icons/plan-cam-unlimited.svg';
import quantityMinusCardNeutral from './icons/quantity-minus-card-neutral.svg';
import quantityMinusCardSelected from './icons/quantity-minus-card-selected.svg';
import quantityMinusRequiredDisabled from './icons/quantity-minus-required-disabled.svg';
import quantityMinusReviewActive from './icons/quantity-minus-review-active.svg';
import quantityPlusCardNeutral from './icons/quantity-plus-card-neutral.svg';
import quantityPlusCardSelected from './icons/quantity-plus-card-selected.svg';
import quantityPlusRequiredDisabled from './icons/quantity-plus-required-disabled.svg';
import quantityPlusReviewActive from './icons/quantity-plus-review-active.svg';
import shipping from './icons/shipping.svg';
import stepCamera from './icons/step-camera.svg';
import stepExtraProtection from './icons/step-extra-protection.svg';
import stepPlan from './icons/step-plan.svg';
import stepSensors from './icons/step-sensors.svg';
import wyzeBatteryCamPro from './products/wyze-battery-cam-pro.png';
import wyzeCamFloodlightV2 from './products/wyze-cam-floodlight-v2.png';
import wyzeCamPanV3 from './products/wyze-cam-pan-v3.png';
import wyzeCamV4 from './products/wyze-cam-v4.png';
import wyzeDuoCamDoorbell from './products/wyze-duo-cam-doorbell.png';
import wyzeMicroSdCard from './products/wyze-microsd-card-256gb.png';
import wyzeSenseHub from './products/wyze-sense-hub.png';
import wyzeSenseMotionSensor from './products/wyze-sense-motion-sensor.png';
import wyzeBatteryCamProBlack from './variants/wyze-battery-cam-pro-black.png';
import wyzeBatteryCamProWhite from './variants/wyze-battery-cam-pro-white.png';
import wyzeCamFloodlightV2Black from './variants/wyze-cam-floodlight-v2-black.png';
import wyzeCamFloodlightV2White from './variants/wyze-cam-floodlight-v2-white.png';
import wyzeCamPanV3Black from './variants/wyze-cam-pan-v3-black.png';
import wyzeCamPanV3White from './variants/wyze-cam-pan-v3-white.png';
import wyzeCamV4Black from './variants/wyze-cam-v4-black.png';
import wyzeCamV4Grey from './variants/wyze-cam-v4-grey.png';
import wyzeCamV4White from './variants/wyze-cam-v4-white.png';

const assetRegistry: Record<string, string> = {
  'client/src/assets/badges/satisfaction-guarantee.png': satisfactionGuarantee,
  'client/src/assets/icons/chevron-down.svg': chevronDown,
  'client/src/assets/icons/chevron-up.svg': chevronUp,
  'client/src/assets/icons/plan-cam-unlimited.svg': planCamUnlimited,
  'client/src/assets/icons/shipping.svg': shipping,
  'client/src/assets/icons/step-camera.svg': stepCamera,
  'client/src/assets/icons/step-extra-protection.svg': stepExtraProtection,
  'client/src/assets/icons/step-plan.svg': stepPlan,
  'client/src/assets/icons/step-sensors.svg': stepSensors,
  'client/src/assets/products/wyze-battery-cam-pro.png': wyzeBatteryCamPro,
  'client/src/assets/products/wyze-cam-floodlight-v2.png': wyzeCamFloodlightV2,
  'client/src/assets/products/wyze-cam-pan-v3.png': wyzeCamPanV3,
  'client/src/assets/products/wyze-cam-v4.png': wyzeCamV4,
  'client/src/assets/products/wyze-duo-cam-doorbell.png': wyzeDuoCamDoorbell,
  'client/src/assets/products/wyze-microsd-card-256gb.png': wyzeMicroSdCard,
  'client/src/assets/products/wyze-sense-hub.png': wyzeSenseHub,
  'client/src/assets/products/wyze-sense-motion-sensor.png':
    wyzeSenseMotionSensor,
  'client/src/assets/variants/wyze-battery-cam-pro-black.png':
    wyzeBatteryCamProBlack,
  'client/src/assets/variants/wyze-battery-cam-pro-white.png':
    wyzeBatteryCamProWhite,
  'client/src/assets/variants/wyze-cam-floodlight-v2-black.png':
    wyzeCamFloodlightV2Black,
  'client/src/assets/variants/wyze-cam-floodlight-v2-white.png':
    wyzeCamFloodlightV2White,
  'client/src/assets/variants/wyze-cam-pan-v3-black.png': wyzeCamPanV3Black,
  'client/src/assets/variants/wyze-cam-pan-v3-white.png': wyzeCamPanV3White,
  'client/src/assets/variants/wyze-cam-v4-black.png': wyzeCamV4Black,
  'client/src/assets/variants/wyze-cam-v4-grey.png': wyzeCamV4Grey,
  'client/src/assets/variants/wyze-cam-v4-white.png': wyzeCamV4White,
};

export const quantityIcons = {
  cardNeutral: {
    minus: quantityMinusCardNeutral,
    plus: quantityPlusCardNeutral,
  },
  cardSelected: {
    minus: quantityMinusCardSelected,
    plus: quantityPlusCardSelected,
  },
  requiredDisabled: {
    minus: quantityMinusRequiredDisabled,
    plus: quantityPlusRequiredDisabled,
  },
  reviewActive: {
    minus: quantityMinusReviewActive,
    plus: quantityPlusReviewActive,
  },
} as const;

export function resolveAsset(assetPath: string): string {
  const resolvedAsset = assetRegistry[assetPath];
  if (!resolvedAsset) {
    throw new Error(`Unknown bundle asset: ${assetPath}`);
  }
  return resolvedAsset;
}

import {
  trackEvent as trackPostHog,
  setUserProperties as setPostHogProps,
} from "./analytics";
import { trackGAEvent, setGAUserProperties } from "./googleAnalytics";

/**
 * Track event in both PostHog and Google Analytics
 * This is the preferred method for consistent tracking across both platforms
 */
export const trackDualEvent = (
  eventName: string,
  properties?: Record<string, any>
) => {
  // Track in PostHog
  trackPostHog(eventName, properties);

  // Track in Google Analytics (with GA4-friendly event name)
  const gaEventName = eventName.replace(/_/g, "_"); // GA4 supports underscores
  trackGAEvent(gaEventName, properties);
};

/**
 * Set user properties in both platforms
 */
export const setDualUserProperties = (properties: Record<string, any>) => {
  setPostHogProps(properties);
  setGAUserProperties(properties);
};

/**
 * Track conversion in both platforms
 */
export const trackDualConversion = (
  conversionName: string,
  value?: number,
  additionalProps?: Record<string, any>
) => {
  // PostHog
  trackPostHog(conversionName, {
    ...additionalProps,
    conversion_value: value,
  });

  // Google Analytics
  trackGAEvent(conversionName, {
    ...additionalProps,
    value: value,
    currency: "USD",
  });
};

/**
 * Track CTA click in both platforms
 */
export const trackDualCTA = (
  buttonText: string,
  location: string,
  ctaType: string,
  additionalProps?: Record<string, any>
) => {
  const props = {
    buttonText,
    location,
    ctaType,
    ...additionalProps,
  };

  trackDualEvent("cta_clicked", props);
};

/**
 * Track video event in both platforms
 */
export const trackDualVideoEvent = (
  action:
    | "loaded"
    | "played"
    | "paused"
    | "completed"
    | "progress"
    | "drop_off",
  videoId: string,
  videoTitle: string,
  additionalProps?: Record<string, any>
) => {
  const props = {
    videoId,
    videoTitle,
    ...additionalProps,
  };

  trackDualEvent(`video_${action}`, props);
};

export default {
  trackDualEvent,
  setDualUserProperties,
  trackDualConversion,
  trackDualCTA,
  trackDualVideoEvent,
};

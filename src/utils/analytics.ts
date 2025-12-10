import posthog from "posthog-js";

/**
 * Track custom events in PostHog
 * @param eventName - Name of the event to track
 * @param properties - Additional properties to attach to the event
 */
export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>
) => {
  if (typeof window !== "undefined" && posthog) {
    posthog.capture(eventName, properties);
  }
};

/**
 * Identify a user in PostHog
 * @param userId - Unique identifier for the user
 * @param properties - Additional user properties
 */
export const identifyUser = (
  userId: string,
  properties?: Record<string, any>
) => {
  if (typeof window !== "undefined" && posthog) {
    posthog.identify(userId, properties);
  }
};

/**
 * Reset the PostHog user (useful for logout)
 */
export const resetUser = () => {
  if (typeof window !== "undefined" && posthog) {
    posthog.reset();
  }
};

/**
 * Set user properties in PostHog
 * @param properties - Properties to set for the current user
 */
export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window !== "undefined" && posthog) {
    posthog.people.set(properties);
  }
};

/**
 * Track page view manually (if auto capture is disabled)
 * @param pageName - Optional page name
 */
export const trackPageView = (pageName?: string) => {
  if (typeof window !== "undefined" && posthog) {
    posthog.capture("$pageview", pageName ? { page: pageName } : undefined);
  }
};

export default {
  trackEvent,
  identifyUser,
  resetUser,
  setUserProperties,
  trackPageView,
};

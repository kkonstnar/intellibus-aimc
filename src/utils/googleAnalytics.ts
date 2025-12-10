import ReactGA from "react-ga4";

/**
 * Initialize Google Analytics 4
 */
export const initGA = () => {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (measurementId) {
    ReactGA.initialize(measurementId, {
      gaOptions: {
        // Optional: Add custom configuration
        siteSpeedSampleRate: 100,
      },
      gtagOptions: {
        // Disable in development
        send_page_view: process.env.NODE_ENV === "production",
      },
    });

    if (process.env.NODE_ENV === "production") {
      console.log("Google Analytics initialized successfully");
    } else {
      console.log(
        "Google Analytics initialized (development mode - not sending data)"
      );
    }
  } else {
    console.warn(
      "Google Analytics Measurement ID not found. Analytics will not be tracked."
    );
  }
};

/**
 * Track page view in GA4
 */
export const trackPageView = (path?: string, title?: string) => {
  if (process.env.NODE_ENV === "production") {
    ReactGA.send({
      hitType: "pageview",
      page: path || window.location.pathname,
      title: title || document.title,
    });
  }
};

/**
 * Track custom event in GA4
 */
export const trackGAEvent = (
  eventName: string,
  params?: Record<string, any>
) => {
  if (process.env.NODE_ENV === "production") {
    ReactGA.event(eventName, params);
  }
};

/**
 * Set user properties in GA4
 */
export const setGAUserProperties = (properties: Record<string, any>) => {
  if (process.env.NODE_ENV === "production") {
    ReactGA.set(properties);
  }
};

/**
 * Track conversion/goal completion
 */
export const trackConversion = (
  conversionName: string,
  value?: number,
  currency: string = "USD"
) => {
  if (process.env.NODE_ENV === "production") {
    ReactGA.event(conversionName, {
      value: value,
      currency: currency,
    });
  }
};

export default {
  initGA,
  trackPageView,
  trackGAEvent,
  setGAUserProperties,
  trackConversion,
};

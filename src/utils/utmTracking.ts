import { trackEvent, setUserProperties } from "./analytics";

interface UTMParameters {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  utm_id?: string;
  referrer?: string;
}

/**
 * Capture and store UTM parameters from URL
 * This should be called on initial app load
 */
export const captureUTMParameters = (): UTMParameters => {
  const urlParams = new URLSearchParams(window.location.search);

  const utmParams: UTMParameters = {
    utm_source: urlParams.get("utm_source") || undefined,
    utm_medium: urlParams.get("utm_medium") || undefined,
    utm_campaign: urlParams.get("utm_campaign") || undefined,
    utm_term: urlParams.get("utm_term") || undefined,
    utm_content: urlParams.get("utm_content") || undefined,
    utm_id: urlParams.get("utm_id") || undefined,
    referrer: document.referrer || undefined,
  };

  // Filter out undefined values
  const filteredParams = Object.fromEntries(
    Object.entries(utmParams).filter(([_, value]) => value !== undefined)
  );

  // Store in localStorage for persistence across session
  if (Object.keys(filteredParams).length > 0) {
    localStorage.setItem("utm_params", JSON.stringify(filteredParams));

    // Set as user properties in PostHog
    setUserProperties(filteredParams);

    // Track landing with UTM parameters
    trackEvent("landing_with_utm", {
      ...filteredParams,
      landingPage: window.location.pathname,
      timestamp: new Date().toISOString(),
    });
  }

  return utmParams;
};

/**
 * Get stored UTM parameters
 */
export const getUTMParameters = (): UTMParameters => {
  try {
    const stored = localStorage.getItem("utm_params");
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Error retrieving UTM parameters:", error);
    return {};
  }
};

/**
 * Clear stored UTM parameters
 */
export const clearUTMParameters = (): void => {
  localStorage.removeItem("utm_params");
};

/**
 * Get referrer information
 */
export const getReferrerInfo = () => {
  const referrer = document.referrer;
  let referrerType = "direct";
  let referrerDomain = "";

  if (referrer) {
    try {
      const referrerUrl = new URL(referrer);
      referrerDomain = referrerUrl.hostname;

      // Categorize referrer
      if (referrerDomain.includes("google")) {
        referrerType = "organic_search_google";
      } else if (
        referrerDomain.includes("bing") ||
        referrerDomain.includes("yahoo")
      ) {
        referrerType = "organic_search_other";
      } else if (
        referrerDomain.includes("facebook") ||
        referrerDomain.includes("instagram") ||
        referrerDomain.includes("linkedin") ||
        referrerDomain.includes("twitter") ||
        referrerDomain.includes("x.com")
      ) {
        referrerType = "social";
      } else if (referrerDomain === window.location.hostname) {
        referrerType = "internal";
      } else {
        referrerType = "referral";
      }
    } catch (error) {
      console.error("Error parsing referrer:", error);
    }
  }

  return {
    referrer,
    referrerType,
    referrerDomain,
  };
};

/**
 * Track initial landing and capture all attribution data
 */
export const trackLanding = () => {
  const utmParams = captureUTMParameters();
  const referrerInfo = getReferrerInfo();
  const deviceInfo = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
  };

  trackEvent("page_landing", {
    ...utmParams,
    ...referrerInfo,
    ...deviceInfo,
    landingPage: window.location.pathname,
    timestamp: new Date().toISOString(),
  });
};

export default {
  captureUTMParameters,
  getUTMParameters,
  clearUTMParameters,
  getReferrerInfo,
  trackLanding,
};

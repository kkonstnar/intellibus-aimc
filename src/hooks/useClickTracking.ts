import { useEffect } from "react";
import { trackEvent } from "../utils/analytics";

interface ClickTrackingOptions {
  enableAutoTracking?: boolean;
  excludeSelectors?: string[];
}

/**
 * Custom hook for automatic click tracking
 * Tracks all clicks on links, buttons, and interactive elements
 */
export const useClickTracking = ({
  enableAutoTracking = true,
  excludeSelectors = [],
}: ClickTrackingOptions = {}) => {
  useEffect(() => {
    if (!enableAutoTracking) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Check if click should be excluded
      if (excludeSelectors.some((selector) => target.closest(selector))) {
        return;
      }

      // Track button clicks
      if (target.tagName === "BUTTON" || target.closest("button")) {
        const button =
          target.tagName === "BUTTON" ? target : target.closest("button");
        const buttonText = button?.textContent?.trim() || "Unknown Button";
        const buttonId = button?.id || undefined;
        const buttonClass = button?.className || undefined;

        trackEvent("button_clicked", {
          buttonText,
          buttonId,
          buttonClass,
          timestamp: new Date().toISOString(),
        });
      }

      // Track link clicks
      if (target.tagName === "A" || target.closest("a")) {
        const link =
          target.tagName === "A"
            ? (target as HTMLAnchorElement)
            : target.closest("a");
        const linkText = link?.textContent?.trim() || "Unknown Link";
        const linkHref = link?.href || undefined;
        const isExternal =
          linkHref?.startsWith("http") &&
          !linkHref?.includes(window.location.hostname);

        trackEvent("link_clicked", {
          linkText,
          linkHref,
          isExternal,
          timestamp: new Date().toISOString(),
        });
      }

      // Track interactive element clicks (elements with onClick, role="button", etc.)
      if (
        target.hasAttribute("onclick") ||
        target.getAttribute("role") === "button" ||
        target.closest('[role="button"]')
      ) {
        const element = target;
        const elementText = element?.textContent?.trim() || "Unknown Element";
        const elementRole = element?.getAttribute("role") || undefined;
        const elementAriaLabel =
          element?.getAttribute("aria-label") || undefined;

        trackEvent("interactive_element_clicked", {
          elementText,
          elementRole,
          elementAriaLabel,
          timestamp: new Date().toISOString(),
        });
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [enableAutoTracking, excludeSelectors]);
};

export default useClickTracking;

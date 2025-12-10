import { useEffect, useRef } from "react";
import { trackEvent } from "../utils/analytics";

interface ScrollTrackingOptions {
  pageName: string;
  throttleMs?: number;
}

/**
 * Custom hook for scroll depth tracking
 * Tracks scroll depth at 25%, 50%, 75%, and 100%
 */
export const useScrollTracking = ({
  pageName,
  throttleMs = 500,
}: ScrollTrackingOptions) => {
  const milestonesTrackedRef = useRef<Set<number>>(new Set());
  const maxScrollRef = useRef<number>(0);
  const lastScrollTimeRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();

      // Throttle scroll events
      if (now - lastScrollTimeRef.current < throttleMs) {
        return;
      }
      lastScrollTimeRef.current = now;

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      const scrollableHeight = documentHeight - windowHeight;
      const scrollPercentage = (scrollTop / scrollableHeight) * 100;

      // Track max scroll depth
      if (scrollPercentage > maxScrollRef.current) {
        maxScrollRef.current = scrollPercentage;
      }

      // Track milestones: 25%, 50%, 75%, 100%
      const milestones = [25, 50, 75, 100];
      milestones.forEach((milestone) => {
        if (
          scrollPercentage >= milestone &&
          !milestonesTrackedRef.current.has(milestone)
        ) {
          milestonesTrackedRef.current.add(milestone);

          trackEvent("scroll_depth", {
            pageName,
            depth: `${milestone}%`,
            scrollPercentage: Math.round(scrollPercentage),
            timestamp: new Date().toISOString(),
          });
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Track when user leaves the page
    return () => {
      window.removeEventListener("scroll", handleScroll);

      // Send final max scroll depth on unmount
      if (maxScrollRef.current > 0) {
        trackEvent("page_max_scroll_depth", {
          pageName,
          maxScrollDepth: Math.round(maxScrollRef.current),
        });
      }
    };
  }, [pageName, throttleMs]);
};

export default useScrollTracking;

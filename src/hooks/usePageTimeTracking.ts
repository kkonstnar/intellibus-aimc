import { useEffect, useRef } from "react";
import { trackEvent } from "../utils/analytics";

interface PageTimeTrackingOptions {
  pageName: string;
}

/**
 * Custom hook for tracking time spent on page
 * Tracks active time (when tab is visible) and total time
 */
export const usePageTimeTracking = ({ pageName }: PageTimeTrackingOptions) => {
  const startTimeRef = useRef<number>(Date.now());
  const activeTimeRef = useRef<number>(0);
  const lastActiveTimeRef = useRef<number>(Date.now());
  const isActiveRef = useRef<boolean>(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab became hidden - stop counting active time
        if (isActiveRef.current) {
          activeTimeRef.current += Date.now() - lastActiveTimeRef.current;
          isActiveRef.current = false;
        }
      } else {
        // Tab became visible - start counting active time
        if (!isActiveRef.current) {
          lastActiveTimeRef.current = Date.now();
          isActiveRef.current = true;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Track time milestones while on page
    const intervalId = setInterval(() => {
      if (isActiveRef.current) {
        const currentActiveTime =
          activeTimeRef.current + (Date.now() - lastActiveTimeRef.current);
        const totalTime = Date.now() - startTimeRef.current;

        // Track every 30 seconds of active time
        if (currentActiveTime > 0 && currentActiveTime % 30000 < 1000) {
          trackEvent("page_time_milestone", {
            pageName,
            activeTimeSeconds: Math.round(currentActiveTime / 1000),
            totalTimeSeconds: Math.round(totalTime / 1000),
          });
        }
      }
    }, 1000);

    // Cleanup and send final time on unmount
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(intervalId);

      // Calculate final times
      let finalActiveTime = activeTimeRef.current;
      if (isActiveRef.current) {
        finalActiveTime += Date.now() - lastActiveTimeRef.current;
      }
      const finalTotalTime = Date.now() - startTimeRef.current;

      trackEvent("page_time_spent", {
        pageName,
        activeTimeSeconds: Math.round(finalActiveTime / 1000),
        totalTimeSeconds: Math.round(finalTotalTime / 1000),
        engagementRate: Math.round((finalActiveTime / finalTotalTime) * 100),
      });
    };
  }, [pageName]);
};

export default usePageTimeTracking;

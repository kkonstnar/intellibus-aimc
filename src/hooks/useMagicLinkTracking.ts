// Magic Link Tracking Hook

import { useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import posthog from "posthog-js";
import { trackDualEvent } from "../utils/dualAnalytics";

export const useMagicLinkTracking = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const utmSource = searchParams?.get("utm_source");
    const email = searchParams?.get("ph_email");
    const userId = searchParams?.get("ph_user_id");
    const timestamp = searchParams?.get("ph_timestamp");

    // Only run tracking for magic link traffic
    if (utmSource === "magic_link_email" && email && userId) {
      console.log("🎯 Magic link user detected:", { email, userId });

      // 1. Identify user immediately in PostHog
      posthog.identify(userId, {
        email,
        traffic_source: "magic_link_email",
        signup_flow: "free_course",
        landed_at: new Date().toISOString(),
        $set_once: {
          first_seen: new Date().toISOString(),
          signup_source: "magic_link_email",
        },
        $set: {
          last_seen: new Date().toISOString(),
          current_page: pathname,
        },
      });

      // 2. Track landing event
      trackDualEvent("magic_link_page_landed", {
        email,
        user_id: userId,
        utm_source: utmSource,
        utm_medium: searchParams?.get("utm_medium"),
        utm_campaign: searchParams?.get("utm_campaign"),
        timestamp: new Date().toISOString(),
        landing_page: pathname,
      });

      // 3. Set super properties (will be sent with ALL future events)
      posthog.register({
        traffic_source: "magic_link_email",
        user_flow: "free_course_signup",
        magic_link_session: true,
      });

      // 4. Track page performance
      if ("performance" in window && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

        if (pageLoadTime > 0) {
          trackDualEvent("magic_link_page_performance", {
            page_load_time: pageLoadTime,
            dns_time: perfData.domainLookupEnd - perfData.domainLookupStart,
            server_response_time: perfData.responseEnd - perfData.requestStart,
            dom_ready_time:
              perfData.domContentLoadedEventEnd - perfData.navigationStart,
          });
        }
      }

      // 5. Track if user becomes inactive (possible friction point)
      let inactivityTimer: NodeJS.Timeout;

      const trackInactivity = () => {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
          trackDualEvent("magic_link_user_inactive_30s", {
            email,
            user_id: userId,
            current_page: pathname,
            inactive_duration: 30,
          });
        }, 30000); // 30 seconds
      };

      // Reset timer on user activity
      const resetInactivityTimer = () => trackInactivity();

      window.addEventListener("mousemove", resetInactivityTimer);
      window.addEventListener("keypress", resetInactivityTimer);
      window.addEventListener("scroll", resetInactivityTimer);
      window.addEventListener("click", resetInactivityTimer);

      trackInactivity(); // Start timer

      // 6. Track if user leaves page (dropped off)
      const handleBeforeUnload = () => {
        const timeSpent = timestamp ? Date.now() - parseInt(timestamp) : 0;

        trackDualEvent("magic_link_page_abandoned", {
          email,
          user_id: userId,
          time_spent: timeSpent,
          current_page: pathname,
        });
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      // Cleanup
      return () => {
        clearTimeout(inactivityTimer);
        window.removeEventListener("mousemove", resetInactivityTimer);
        window.removeEventListener("keypress", resetInactivityTimer);
        window.removeEventListener("scroll", resetInactivityTimer);
        window.removeEventListener("click", resetInactivityTimer);
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [searchParams, pathname]);
};

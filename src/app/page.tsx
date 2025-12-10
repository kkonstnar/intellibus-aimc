"use client";

import { Suspense, useEffect } from "react";
import HeroSection from "@/src/components/HeroSection";
import WhatYouGetSection from "@/src/components/WhatYouGetSection";
import AIMasterclassTVSection from "@/src/components/AIMasterclassTVSection";
import SocialProofSection from "@/src/components/SocialProofSection";
import FreeSyllabusPreviewSection from "@/src/components/FreeSyllabusPreviewSection";
import UpgradePathsSection from "@/src/components/UpgradePathsSection";
import MeetTheInstructorsSection from "@/src/components/MeetTheInstructorsSection";
import ValuePropositionSection from "@/src/components/ValuePropositionSection";
import ImagePreviews from "@/src/components/ImagePreviews";
import FAQSection from "@/src/components/FAQSection";
import FinalCallSection from "@/src/components/FinalCallSection";
import Footer from "@/src/components/Footer";
import { trackLanding } from "@/src/utils/utmTracking";
import { usePageTimeTracking } from "@/src/hooks/usePageTimeTracking";
import { useScrollTracking } from "@/src/hooks/useScrollTracking";
import { initGA, trackPageView } from "@/src/utils/googleAnalytics";
import { getUserId } from "@/src/utils/userIdentification";
import { identifyUser } from "@/src/utils/analytics";
import ReactGA from "react-ga4";
import { usePathname, useSearchParams } from "next/navigation";

function LandingPageContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Track page time and scroll depth
  usePageTimeTracking({ pageName: "landing_page" });
  useScrollTracking({ pageName: "landing_page" });

  useEffect(() => {
    // Initialize Google Analytics on mount
    initGA();

    // Get or create user ID and set in both platforms
    const userId = getUserId();

    // Identify user in PostHog
    identifyUser(userId);

    // Set user ID in Google Analytics
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (measurementId) {
      ReactGA.gtag("config", measurementId, {
        user_id: userId,
      });
    }

    // Capture UTM parameters and track landing on initial load
    trackLanding();

    // Track page view in Google Analytics
    const queryString = searchParams?.toString() || "";
    trackPageView(pathname + (queryString ? `?${queryString}` : ""));
  }, [pathname, searchParams]);

  return (
    <div className="App">
      <HeroSection />
      <WhatYouGetSection />
      <AIMasterclassTVSection />
      <FreeSyllabusPreviewSection />
      <SocialProofSection />
      <MeetTheInstructorsSection />
      <ValuePropositionSection />
      <ImagePreviews />
      <UpgradePathsSection />
      <FAQSection />
      <FinalCallSection />
      <Footer />
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <LandingPageContent />
    </Suspense>
  );
}


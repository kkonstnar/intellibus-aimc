// Course Page - Main page for the free course offering

import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useSession } from "../lib/auth-client";
import MagicLinkForm from "../components/MagicLinkForm";
import CourseContent from "../components/CourseContent";
import { trackDualEvent } from "../utils/dualAnalytics";
import { usePageTimeTracking } from "../hooks/usePageTimeTracking";
import { useScrollTracking } from "../hooks/useScrollTracking";

export default function CoursePage() {
  const { data: session, isPending } = useSession();

  // Track page analytics
  usePageTimeTracking({ pageName: "course_page" });
  useScrollTracking({ pageName: "course_page" });

  useEffect(() => {
    trackDualEvent("course_page_viewed", {
      authenticated: !!session,
      page: "free_course",
      timestamp: new Date().toISOString(),
    });

    if (!session && !isPending) {
      trackDualEvent("course_email_form_viewed", {
        timestamp: new Date().toISOString(),
      });
    }
  }, [session, isPending]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
          <p className="text-gray-400 font-medium">Loading your course...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {!session ? <MagicLinkForm /> : <CourseContent user={session.user} />}
    </div>
  );
}

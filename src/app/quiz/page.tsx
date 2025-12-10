"use client";

import { useEffect } from "react";
import QuizExample from "@/src/components/QuizExample";
import { usePageTimeTracking } from "@/src/hooks/usePageTimeTracking";
import { useScrollTracking } from "@/src/hooks/useScrollTracking";

export default function Quiz() {
  usePageTimeTracking({ pageName: "quiz_page" });
  useScrollTracking({ pageName: "quiz_page" });

  return <QuizExample />;
}


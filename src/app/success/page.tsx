"use client";

import { Suspense } from "react";
import SuccessPage from "@/src/pages/SuccessPage";
import { Loader2 } from "lucide-react";

function SuccessLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
    </div>
  );
}

export default function Success() {
  return (
    <Suspense fallback={<SuccessLoading />}>
      <SuccessPage />
    </Suspense>
  );
}


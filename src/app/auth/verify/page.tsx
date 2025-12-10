"use client";

import { Suspense } from "react";
import AuthCallback from "@/src/components/AuthCallback";
import { Loader2 } from "lucide-react";

function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
    </div>
  );
}

export default function AuthVerify() {
  return (
    <Suspense fallback={<AuthLoading />}>
      <AuthCallback />
    </Suspense>
  );
}


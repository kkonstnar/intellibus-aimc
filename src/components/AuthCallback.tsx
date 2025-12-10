"use client";

// Auth Callback Component - Handles magic link verification

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, Home, RefreshCw } from "lucide-react";
import { useMagicLinkTracking } from "../hooks/useMagicLinkTracking";
import { trackDualEvent } from "../utils/dualAnalytics";
import { useSession } from "../lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending: isLoading } = useSession();
  const [verificationStatus, setVerificationStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Track magic link journey
  useMagicLinkTracking();

  useEffect(() => {
    const email = searchParams?.get("ph_email");
    const userId = searchParams?.get("ph_user_id");

    // Track verification attempt
    trackDualEvent("magic_link_verification_started", {
      email: email || undefined,
      user_id: userId || undefined,
      timestamp: new Date().toISOString(),
    });

    // Check if verification was successful
    const checkVerification = async () => {
      try {
        // Better Auth handles the verification automatically
        // We just need to check if the session was created
        
        // Wait a moment for Better Auth to process
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (session && session.user) {
          // Success!
          setVerificationStatus("success");
          
          trackDualEvent("magic_link_auth_success", {
            email: session.user.email,
            user_id: session.user.id,
            timestamp: new Date().toISOString(),
          });

          // Redirect to course page after a brief moment
          setTimeout(() => {
            router.push("/course");
          }, 1500);
        } else if (!isLoading) {
          // If not loading and no session, something went wrong
          throw new Error("Authentication failed");
        }
      } catch (error) {
        setVerificationStatus("error");
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        setErrorMessage(errorMsg);
        
        trackDualEvent("magic_link_auth_failed", {
          email: email || undefined,
          error: errorMsg,
          timestamp: new Date().toISOString(),
        });
      }
    };

    if (!isLoading) {
      checkVerification();
    }
  }, [session, isLoading, router, searchParams]);

  if (verificationStatus === "verifying" || isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-gray-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
            <CardTitle className="text-lg">Verifying Your Access</CardTitle>
            <CardDescription>
              Please wait while we confirm your magic link
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (verificationStatus === "success") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-gray-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">Success!</CardTitle>
            <CardDescription className="mt-4">
              You're all set. Redirecting to your course...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading your course content
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-gray-200">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-lg">Verification Failed</CardTitle>
          <CardDescription className="mt-4">
            {errorMessage || "Your magic link may have expired or is invalid."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={() => router.push("/course")}
            className="w-full"
            size="lg"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Request New Link
          </Button>
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="w-full border-gray-300"
            size="lg"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


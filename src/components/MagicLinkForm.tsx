"use client";

// Magic Link Form - Clean Udemy-inspired design

import React, { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { sendMagicLink } from "../lib/auth-client";
import { trackDualEvent } from "../utils/dualAnalytics";

export default function MagicLinkForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    trackDualEvent("course_email_form_submitted", { email });

    const result = await sendMagicLink(email);

    if (result.success) {
      setSent(true);
      trackDualEvent("magic_link_request_success", { email });
    } else {
      setError(result.error || "Failed to send. Please try again.");
      trackDualEvent("magic_link_request_failed", { email, error: result.error });
    }

    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-[#1c1d1f] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Check your inbox
              </h2>
              <p className="text-gray-600 mb-4">
                We sent a login link to
              </p>
              <p className="font-medium text-gray-900 bg-gray-100 py-2 px-4 rounded mb-6">
                {email}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Click the link in the email to access your course.
                <br />
                Link expires in 15 minutes.
              </p>
              <hr className="my-6" />
              <p className="text-sm text-gray-500">
                Didn't receive it?{" "}
                <button
                onClick={() => {
                  setSent(false);
                  setEmail("");
                }}
                  className="text-purple-600 hover:text-purple-700 font-medium"
              >
                  Try again
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c1d1f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/AIMC_Angled_Horiz_w Title_Violet.png"
            alt="AI Masterclass"
            className="h-12 mx-auto"
          />
            </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Access Your Course
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Enter your email to get instant access
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-bold text-gray-900 mb-2"
              >
                Email
                </label>
              <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                  required
                  disabled={loading}
                className="w-full px-4 py-3 border border-gray-900 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-600">{error}</p>
              </div>
              )}

            <button
                type="submit"
              disabled={loading || !email}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed text-white font-bold rounded transition-colors"
              >
                {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                </span>
                ) : (
                "Get Access"
                )}
            </button>
            </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            No password needed. We'll email you a secure login link.
          </p>
        </div>

        {/* Features */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-4">What you'll get:</p>
          <div className="flex justify-center gap-8 text-sm text-gray-300">
            <div>
              <div className="text-white font-bold text-lg">6</div>
              <div>Lessons</div>
            </div>
            <div>
              <div className="text-white font-bold text-lg">90+</div>
              <div>Minutes</div>
            </div>
            <div>
              <div className="text-white font-bold text-lg">Free</div>
              <div>Access</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

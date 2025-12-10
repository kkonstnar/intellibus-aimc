"use client";

import React, { useEffect } from 'react';
import posthog from 'posthog-js';

interface PostHogProviderProps {
  children: React.ReactNode;
}

export const PostHogProvider: React.FC<PostHogProviderProps> = ({ children }) => {
  useEffect(() => {
    // Initialize PostHog only if API key is provided
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_API_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

    if (apiKey) {
      posthog.init(apiKey, {
        api_host: host,
        // Enable session recording (optional - can be disabled)
        session_recording: {
          recordCrossOriginIframes: true,
        },
        // Capture pageviews automatically
        capture_pageview: true,
        // Capture page leave events
        capture_pageleave: true,
        // Log initialization in development
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('PostHog: Running in development mode');
          }
        },
      });

      console.log('PostHog initialized successfully');
    } else {
      console.warn('PostHog API key not found. Analytics will not be tracked.');
    }

    // Cleanup function
    return () => {
      // Optional: Add any cleanup logic if needed
    };
  }, []);

  return <>{children}</>;
};

export default PostHogProvider;


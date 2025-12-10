// Email Template with PostHog Tracking - Using React Email

import React from 'react';
import { render } from '@react-email/render';
import MagicLinkEmail from './MagicLinkEmail';

interface EmailTemplateParams {
  email: string;
  magicLinkUrl: string;
  userId: string;
  trackingUrl: string;
}

export const getMagicLinkEmailTemplate = async ({
  email,
  magicLinkUrl,
  userId,
  trackingUrl,
}: EmailTemplateParams): Promise<string> => {
  return await render(
    React.createElement(MagicLinkEmail, {
      email,
      magicLinkUrl,
      userId,
      trackingUrl,
    })
  );
};

// Plain text version for email clients that don't support HTML
export const getMagicLinkEmailTextVersion = ({
  magicLinkUrl,
}: Omit<EmailTemplateParams, "userId" | "trackingUrl" | "email">): string => {
  return `
Welcome to AI Masterclass!

Hi there!

Your free AI Masterclass course is ready. Click the link below to access your course (valid for 15 minutes):

${magicLinkUrl}

What's Inside:
- Complete AI fundamentals course
- Hands-on practical exercises
- Real-world case studies
- Certificate of completion

Questions? Just reply to this email.

If you didn't request this email, you can safely ignore it.

© ${new Date().getFullYear()} AI Masterclass
  `.trim();
};

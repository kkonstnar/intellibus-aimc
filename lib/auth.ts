// Better Auth Configuration for Next.js

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink } from "better-auth/plugins";
import { PostHog } from "posthog-node";
import { Resend } from "resend";
import { prisma } from "./db";
import {
  getMagicLinkEmailTemplate,
  getMagicLinkEmailTextVersion,
} from "./emailTemplate";

// Initialize PostHog for server-side tracking (optional)
let posthog: PostHog | null = null;
if (process.env.POSTHOG_API_KEY) {
  posthog = new PostHog(process.env.POSTHOG_API_KEY, {
    host: process.env.POSTHOG_HOST || "https://us.i.posthog.com",
    flushAt: 1,
    flushInterval: 0,
  });
  console.log("✅ PostHog analytics enabled");
} else {
  console.log("ℹ️  PostHog analytics disabled (set POSTHOG_API_KEY to enable)");
}

// Email setup with Resend (optional)
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

if (resend) {
  console.log("✅ Resend email enabled");
} else {
  console.log("ℹ️  Email sending disabled (set RESEND_API_KEY to enable)");
}

// Build plugins array - only add Polar if configured
const plugins: any[] = [];

// Polar SDK Client Setup (optional - only if configured)
if (process.env.POLAR_ACCESS_TOKEN && process.env.POLAR_PRODUCT_ID) {
  try {
    const {
      polar,
      checkout,
      portal,
      usage,
      webhooks,
    } = require("@polar-sh/better-auth");
    const { Polar } = require("@polar-sh/sdk");

    const polarClient = new Polar({
      accessToken: process.env.POLAR_ACCESS_TOKEN,
      server:
        (process.env.POLAR_SERVER as "sandbox" | "production") || "sandbox",
    });

    console.log("✅ Polar payment integration enabled");
    console.log(`   Product ID: ${process.env.POLAR_PRODUCT_ID}`);
    console.log(`   Server: ${process.env.POLAR_SERVER || "sandbox"}`);

    plugins.push(
      polar({
        client: polarClient,
        createCustomerOnSignUp: true,
        getCustomerCreateParams: async ({ user }: { user: any }) => ({
          metadata: {
            ...(user.id && { userId: user.id }),
            ...(user.email && { email: user.email }),
            signupDate: new Date().toISOString(),
          },
        }),
        use: [
          checkout({
            products: [
              {
                productId: process.env.POLAR_PRODUCT_ID,
                slug: "ai-masterclass-preorder",
              },
            ],
            successUrl: `${
              process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
            }/success?checkout_id={CHECKOUT_ID}`,
            authenticatedUsersOnly: false,
          }),
          portal(),
          usage(),
          webhooks({
            secret: process.env.POLAR_WEBHOOK_SECRET || "",
            onOrderPaid: async (payload: any) => {
              console.log("[POLAR] Order paid:", payload);
              posthog?.capture({
                distinctId:
                  payload.customer?.email || payload.email || "unknown",
                event: "polar_order_paid",
                properties: {
                  orderId: payload.id || payload.order_id,
                  amount: payload.amount_total || payload.amount,
                  currency: payload.currency || "USD",
                  customerId: payload.customer?.id || payload.customer_id,
                },
              });
            },
            onSubscriptionActive: async (payload: any) => {
              console.log("[POLAR] Subscription active:", payload);
            },
            onCustomerStateChanged: async (payload: any) => {
              console.log("[POLAR] Customer state changed:", payload);
            },
          }),
        ],
      })
    );
  } catch (error) {
    console.log("ℹ️  Polar integration disabled (error loading modules)");
  }
} else {
  console.log(
    "ℹ️  Polar payments disabled (set POLAR_ACCESS_TOKEN and POLAR_PRODUCT_ID to enable)"
  );
}

// Always add magic link plugin
plugins.push(
  magicLink({
    sendMagicLink: async ({ email, url }) => {
      console.log(`[MAGIC LINK] Sending to: ${email}`);
      const userId = `user_${email.split("@")[0]}_${Date.now()}`;
      const timestamp = Date.now();

      const trackedUrl = new URL(url);
      trackedUrl.searchParams.append("utm_source", "magic_link_email");
      trackedUrl.searchParams.append("utm_medium", "email");
      trackedUrl.searchParams.append("utm_campaign", "free_course_signup");
      trackedUrl.searchParams.append("ph_email", email);
      trackedUrl.searchParams.append("ph_user_id", userId);
      trackedUrl.searchParams.append("ph_timestamp", timestamp.toString());

      const finalMagicLink = trackedUrl.toString();
      const trackingBaseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      const emailHtml = await getMagicLinkEmailTemplate({
        email,
        magicLinkUrl: finalMagicLink,
        userId,
        trackingUrl: trackingBaseUrl,
      });

      const emailText = getMagicLinkEmailTextVersion({
        magicLinkUrl: finalMagicLink,
      });

      if (!resend) {
        console.log(
          "⚠️  Cannot send magic link email: Resend not configured."
        );
        console.log(`📧 Magic link for ${email}: ${finalMagicLink}`);
        return;
      }

      try {
        await resend.emails.send({
          from: "AI Masterclass <onboarding@resend.dev>", // Change to your verified domain
          to: email,
          subject: "Your AI Masterclass Access Link",
          text: emailText,
          html: emailHtml,
        });

        posthog?.capture({
          distinctId: email,
          event: "magic_link_email_sent",
          properties: {
            email,
            user_id: userId,
            timestamp: new Date().toISOString(),
            course: "free_course",
          },
        });

        console.log(`✅ Magic link sent to ${email}`);
      } catch (error) {
        console.error("❌ Error sending email:", error);
        console.log(`📧 Magic link for ${email}: ${finalMagicLink}`);
        posthog?.capture({
          distinctId: email,
          event: "magic_link_email_failed",
          properties: {
            email,
            error: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString(),
          },
        });
      }
    },
    expiresIn: 60 * 15, // 15 minutes
  })
);

// Better Auth Configuration
export const auth = betterAuth({
  secret:
    process.env.BETTER_AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "change-this-secret-in-production",
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000",
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },
  advanced: {
    database: {
      generateId: () => {
        return `user_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 11)}`;
      },
    },
  },
  plugins,
});

export { posthog };

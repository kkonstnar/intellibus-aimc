// Express Server with Better Auth and PostHog Integration

import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink } from "better-auth/plugins";
import { PostHog } from "posthog-node";
import nodemailer from "nodemailer";
import prisma from "./db";
import {
  getMagicLinkEmailTemplate,
  getMagicLinkEmailTextVersion,
} from "./emailTemplate";
import {
  polar,
  checkout,
  portal,
  usage,
  webhooks,
} from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize PostHog for server-side tracking
const posthog = new PostHog(process.env.POSTHOG_API_KEY!, {
  host: process.env.POSTHOG_HOST || "https://us.i.posthog.com",
  flushAt: 1, // Send events immediately in development
  flushInterval: 0,
});

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Polar SDK Client Setup
const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN || "",
  // Use 'sandbox' if you're using the Polar Sandbox environment
  server: (process.env.POLAR_SERVER as "sandbox" | "production") || "sandbox",
});

// Better Auth Configuration
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",
  trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:3000"],
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },
  advanced: {
    generateId: () => {
      return `user_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 11)}`;
    },
  },
  plugins: [
    // Polar Plugin for Payments
    ...(process.env.POLAR_ACCESS_TOKEN && process.env.POLAR_PRODUCT_ID
      ? [
          polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            getCustomerCreateParams: async ({ user }) => ({
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
                    productId: process.env.POLAR_PRODUCT_ID || "",
                    slug: "ai-masterclass-preorder",
                  },
                ],
                successUrl: `${
                  process.env.FRONTEND_URL || "http://localhost:3000"
                }/success?checkout_id={CHECKOUT_ID}`,
                authenticatedUsersOnly: false, // Allow unauthenticated checkouts
              }),
              portal(),
              usage(),
              webhooks({
                secret: process.env.POLAR_WEBHOOK_SECRET || "",
                onOrderPaid: async (payload) => {
                  console.log("[POLAR] Order paid:", payload);
                  // Track in PostHog
                  posthog.capture({
                    distinctId: payload.customer?.email || "unknown",
                    event: "polar_order_paid",
                    properties: {
                      orderId: payload.id,
                      amount: payload.amount_total,
                      currency: payload.currency,
                      customerId: payload.customer?.id,
                    },
                  });
                },
                onSubscriptionActive: async (payload) => {
                  console.log("[POLAR] Subscription active:", payload);
                },
                onCustomerStateChanged: async (payload) => {
                  console.log("[POLAR] Customer state changed:", payload);
                },
              }),
            ],
          }),
        ]
      : []),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        console.log(`[MAGIC LINK] Sending to: ${email}`);
        console.log(`[MAGIC LINK] URL: ${url}`);
        const userId = `user_${email.split("@")[0]}_${Date.now()}`;
        const timestamp = Date.now();

        // Build fully tracked magic link URL
        const trackedUrl = new URL(url);
        trackedUrl.searchParams.append("utm_source", "magic_link_email");
        trackedUrl.searchParams.append("utm_medium", "email");
        trackedUrl.searchParams.append("utm_campaign", "free_course_signup");
        trackedUrl.searchParams.append("ph_email", email);
        trackedUrl.searchParams.append("ph_user_id", userId);
        trackedUrl.searchParams.append("ph_timestamp", timestamp.toString());

        const finalMagicLink = trackedUrl.toString();
        const trackingBaseUrl =
          process.env.API_URL || `http://localhost:${PORT}`;

        // Generate email HTML with tracking
        const emailHtml = await getMagicLinkEmailTemplate({
          email,
          magicLinkUrl: finalMagicLink,
          userId,
          trackingUrl: trackingBaseUrl,
        });

        const emailText = getMagicLinkEmailTextVersion({
          email,
          magicLinkUrl: finalMagicLink,
        });

        try {
          // Send email
          await transporter.sendMail({
            from: `"AI Masterclass" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your AI Masterclass Access Link",
            text: emailText,
            html: emailHtml,
          });

          // Track in PostHog
          posthog.capture({
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
          console.error("❌ Error sending email (non-blocking):", error);

          // Track error in PostHog
          posthog.capture({
            distinctId: email,
            event: "magic_link_email_failed",
            properties: {
              email,
              error: error instanceof Error ? error.message : "Unknown error",
              timestamp: new Date().toISOString(),
            },
          });

          // Don't throw - let the request succeed even if email fails
          console.log("[MAGIC LINK] Continuing despite email error...");
        }
      },
      expiresIn: 60 * 15, // 15 minutes
    }),
  ],
});

// Log Polar configuration status
if (process.env.POLAR_ACCESS_TOKEN && process.env.POLAR_PRODUCT_ID) {
  console.log("✅ Polar integration enabled");
  console.log(`   Product ID: ${process.env.POLAR_PRODUCT_ID}`);
  console.log(`   Server: ${process.env.POLAR_SERVER || "sandbox"}`);
} else {
  console.log(
    "⚠️  Polar integration disabled (missing POLAR_ACCESS_TOKEN or POLAR_PRODUCT_ID)"
  );
}

// Mount Better Auth routes - handle all auth requests (including Polar)
app.all("/api/auth/*", async (req, res) => {
  console.log(`[AUTH] ${req.method} ${req.url}`);

  try {
    // Build Web API Request
    const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    // Convert Express headers to Web API Headers
    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value) {
        headers.set(key, Array.isArray(value) ? value[0] : value);
      }
    });

    // Build request config
    const requestConfig: RequestInit = {
      method: req.method,
      headers,
    };

    // Add body for non-GET/HEAD requests
    if (req.method !== "GET" && req.method !== "HEAD") {
      requestConfig.body = JSON.stringify(req.body);
    }

    // Use global Request constructor (Web API)
    const webRequest = new globalThis.Request(url, requestConfig);
    const response = await auth.handler(webRequest);

    // Send response back
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    const body = await response.text();
    res.send(body);
  } catch (error) {
    console.error("[AUTH] Error:", error);
    res.status(500).json({
      error: "Authentication error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Mount Polar webhooks endpoint (if Polar is configured)
if (process.env.POLAR_ACCESS_TOKEN) {
  app.all("/polar/*", async (req, res) => {
    console.log(`[POLAR] ${req.method} ${req.url}`);

    try {
      const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
      const headers = new Headers();
      Object.entries(req.headers).forEach(([key, value]) => {
        if (value) {
          headers.set(key, Array.isArray(value) ? value[0] : value);
        }
      });

      const requestConfig: RequestInit = {
        method: req.method,
        headers,
      };

      if (req.method !== "GET" && req.method !== "HEAD") {
        requestConfig.body = JSON.stringify(req.body);
      }

      const webRequest = new globalThis.Request(url, requestConfig);
      const response = await auth.handler(webRequest);

      res.status(response.status);
      response.headers.forEach((value, key) => res.setHeader(key, value));
      const body = await response.text();
      res.send(body);
    } catch (error) {
      console.error("[POLAR] Error:", error);
      res.status(500).json({
        error: "Polar error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
}

// ==========================================
// TRACKING ENDPOINTS
// ==========================================

// Email open tracking pixel
app.get("/track/email-open", async (req: Request, res: Response) => {
  const { user_id, email } = req.query;

  if (user_id && email) {
    posthog.capture({
      distinctId: user_id as string,
      event: "magic_link_email_opened",
      properties: {
        email: email as string,
        opened_at: new Date().toISOString(),
        user_agent: req.headers["user-agent"],
        ip: req.ip,
      },
    });
  }

  // Send transparent 1x1 pixel
  const pixel = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "base64"
  );

  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": pixel.length,
    "Cache-Control": "no-cache, no-store, must-revalidate",
  });
  res.end(pixel);
});

// Magic link click tracking redirect
app.get("/track/click", async (req: Request, res: Response) => {
  const { redirect, user_id } = req.query;

  if (user_id) {
    posthog.capture({
      distinctId: user_id as string,
      event: "magic_link_clicked",
      properties: {
        clicked_at: new Date().toISOString(),
        user_agent: req.headers["user-agent"],
        ip: req.ip,
        redirect_url: redirect as string,
      },
    });
  }

  // Redirect to magic link URL
  if (redirect) {
    res.redirect(redirect as string);
  } else {
    res.status(400).json({ error: "Missing redirect URL" });
  }
});

// ==========================================
// COURSE PROGRESS ENDPOINTS
// ==========================================

// Get user's course progress
app.get("/api/course/progress/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const progress = await prisma.courseProgress.findMany({
      where: { userId },
      orderBy: { startedAt: "asc" },
    });

    res.json(progress);
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

// Update course progress
app.post("/api/course/progress", async (req: Request, res: Response) => {
  try {
    const { userId, moduleId, moduleName, completed, lastPosition } = req.body;

    if (!userId || !moduleId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const progress = await prisma.courseProgress.upsert({
      where: {
        userId_moduleId: { userId, moduleId },
      },
      update: {
        completed: completed ?? undefined,
        lastPosition: lastPosition ?? undefined,
        completedAt: completed ? new Date() : undefined,
      },
      create: {
        userId,
        moduleId,
        moduleName: moduleName || moduleId,
        completed: completed || false,
        lastPosition: lastPosition || 0,
      },
    });

    // Track in PostHog
    posthog.capture({
      distinctId: userId,
      event: completed ? "course_module_completed" : "course_module_progress",
      properties: {
        module_id: moduleId,
        module_name: moduleName,
        last_position: lastPosition,
        completed,
        timestamp: new Date().toISOString(),
      },
    });

    res.json(progress);
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ error: "Failed to update progress" });
  }
});

// Get all modules progress summary for a user
app.get("/api/course/summary/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const allProgress = await prisma.courseProgress.findMany({
      where: { userId },
    });

    const completedCount = allProgress.filter(
      (p: { completed: boolean }) => p.completed
    ).length;
    const totalModules = allProgress.length;
    const completionPercentage =
      totalModules > 0 ? (completedCount / totalModules) * 100 : 0;

    res.json({
      userId,
      totalModules,
      completedModules: completedCount,
      inProgressModules: totalModules - completedCount,
      completionPercentage: Math.round(completionPercentage),
      modules: allProgress,
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "AI Masterclass API",
  });
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
  const serverUrl = process.env.BETTER_AUTH_URL || `http://localhost:${PORT}`;
  const frontendUrl = process.env.FRONTEND_URL || `http://localhost:3000`;

  console.log(`
  🚀 AI Masterclass Server Running!
  
  📍 Server: ${serverUrl}
  🔐 Auth:   ${serverUrl}/api/auth
  📊 Health: ${serverUrl}/health
  🌐 Frontend: ${frontendUrl}
  
  📧 Email tracking ready
  📈 PostHog integration active
  ✅ Better Auth configured
  `);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🛑 Shutting down gracefully...");
  await posthog.shutdown();
  await prisma.$disconnect();
  process.exit(0);
});

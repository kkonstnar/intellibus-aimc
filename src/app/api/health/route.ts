// Health check endpoint

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "AI Masterclass API",
    config: {
      database: !!process.env.DATABASE_URL,
      resend: !!process.env.RESEND_API_KEY,
      auth_secret: !!process.env.BETTER_AUTH_SECRET,
      auth_url: process.env.BETTER_AUTH_URL || "NOT SET",
      app_url: process.env.NEXT_PUBLIC_APP_URL || "NOT SET",
      polar: !!process.env.POLAR_ACCESS_TOKEN,
      admin_emails: process.env.ADMIN_EMAILS || "NOT SET",
    },
  });
}

// Email open tracking pixel

import { posthog } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const user_id = searchParams.get("user_id");
  const email = searchParams.get("email");

  if (user_id && email && posthog) {
    posthog.capture({
      distinctId: user_id,
      event: "magic_link_email_opened",
      properties: {
        email: email,
        opened_at: new Date().toISOString(),
        user_agent: request.headers.get("user-agent") || "",
        ip:
          request.headers.get("x-forwarded-for") ||
          request.headers.get("x-real-ip") ||
          "",
      },
    });
  }

  // Send transparent 1x1 pixel
  const pixel = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "base64"
  );

  return new NextResponse(pixel, {
    headers: {
      "Content-Type": "image/png",
      "Content-Length": pixel.length.toString(),
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}

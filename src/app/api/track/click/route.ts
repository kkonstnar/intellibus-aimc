// Magic link click tracking redirect

import { posthog } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const redirect = searchParams.get("redirect");
  const user_id = searchParams.get("user_id");

  if (user_id) {
    posthog.capture({
      distinctId: user_id,
      event: "magic_link_clicked",
      properties: {
        clicked_at: new Date().toISOString(),
        user_agent: request.headers.get("user-agent") || "",
        ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "",
        redirect_url: redirect || "",
      },
    });
  }

  // Redirect to magic link URL
  if (redirect) {
    return NextResponse.redirect(redirect);
  } else {
    return NextResponse.json(
      { error: "Missing redirect URL" },
      { status: 400 }
    );
  }
}

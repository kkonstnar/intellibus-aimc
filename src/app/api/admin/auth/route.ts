import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";

// List of admin emails (add your email here or use env var)
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim().toLowerCase()) || [];

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ isAdmin: false, error: "Not authenticated" }, { status: 401 });
    }

    const userEmail = session.user.email?.toLowerCase();
    
    // Check if user is admin by role in database
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, email: true },
    });

    // User is admin if:
    // 1. Their role is "admin" in the database, OR
    // 2. Their email is in the ADMIN_EMAILS env var
    const isAdmin = user?.role === "admin" || ADMIN_EMAILS.includes(userEmail || "");

    // If user's email is in ADMIN_EMAILS but role isn't admin, update it
    if (isAdmin && user?.role !== "admin" && ADMIN_EMAILS.includes(userEmail || "")) {
      await db.user.update({
        where: { id: session.user.id },
        data: { role: "admin" },
      });
    }

    return NextResponse.json({
      isAdmin,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
    });
  } catch (error) {
    console.error("[ADMIN AUTH] Error:", error);
    return NextResponse.json({ isAdmin: false, error: "Server error" }, { status: 500 });
  }
}



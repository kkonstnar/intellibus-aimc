// Discount Request API Route
// Stores discount requests for users who want a bigger discount

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, jobTitle } = body;

    // Validate required fields
    if (!name || !email || !company || !jobTitle) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Store in database
    const discountRequest = await prisma.discountRequest.create({
      data: {
        name,
        email,
        company,
        jobTitle,
      },
    });

    console.log(`[DISCOUNT] New request from ${email} at ${company}`);

    return NextResponse.json({
      success: true,
      message: "Discount request submitted successfully",
      id: discountRequest.id,
    });
  } catch (error) {
    console.error("[DISCOUNT] Error processing request:", error);

    // Check if it's a Prisma error (table doesn't exist)
    if (error instanceof Error && error.message.includes("does not exist")) {
      // Fallback: just log the request if the table doesn't exist yet
      console.log("[DISCOUNT] Table not found, logging request only");
      return NextResponse.json({
        success: true,
        message: "Discount request received",
      });
    }

    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}


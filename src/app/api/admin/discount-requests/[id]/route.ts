// Admin Update Discount Request API
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "status is required" },
        { status: 400 }
      );
    }

    const updated = await prisma.discountRequest.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      request: {
        id: updated.id,
        status: updated.status,
      },
    });
  } catch (error) {
    console.error("[ADMIN] Update discount request error:", error);
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }
}


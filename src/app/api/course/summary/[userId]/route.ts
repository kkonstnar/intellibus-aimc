// Get all modules progress summary for a user

import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const allProgress = await prisma.courseProgress.findMany({
      where: { userId },
    });

    const completedCount = allProgress.filter((p) => p.completed).length;
    const totalModules = allProgress.length;
    const completionPercentage =
      totalModules > 0 ? (completedCount / totalModules) * 100 : 0;

    return NextResponse.json({
      userId,
      totalModules,
      completedModules: completedCount,
      inProgressModules: totalModules - completedCount,
      completionPercentage: Math.round(completionPercentage),
      modules: allProgress,
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch summary" },
      { status: 500 }
    );
  }
}

// Course Progress API with automatic milestone emails
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - Fetch user's progress
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const moduleId = searchParams.get("moduleId");

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    // Single module progress
    if (moduleId) {
      const progress = await prisma.courseProgress.findUnique({
        where: {
          userId_moduleId: { userId, moduleId },
        },
      });
      return NextResponse.json({ progress });
    }

    // All progress for user
    const progress = await prisma.courseProgress.findMany({
      where: { userId },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("[PROGRESS] GET error:", error);
    return NextResponse.json({ progress: [] });
  }
}

// POST - Save progress and check milestones
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      moduleId,
      watchedSeconds,
      maxPosition,
      completed,
      completionPct,
    } = body;

    if (!userId || !moduleId) {
      return NextResponse.json(
        { error: "userId and moduleId required" },
        { status: 400 }
      );
    }

    // Upsert progress
    const progress = await prisma.courseProgress.upsert({
      where: {
        userId_moduleId: { userId, moduleId },
      },
      update: {
        watchedSeconds: watchedSeconds || 0,
        maxPosition: maxPosition || 0,
        completed: completed || false,
        completionPct: completionPct || 0,
        lastWatchedAt: new Date(),
        ...(completed && !completionPct ? { completedAt: new Date() } : {}),
      },
      create: {
        userId,
        moduleId,
        watchedSeconds: watchedSeconds || 0,
        maxPosition: maxPosition || 0,
        completed: completed || false,
        completionPct: completionPct || 0,
      },
    });

    // Calculate overall progress
    const totalModules = (await prisma.courseModule.count()) || 6;
    const completedModules = await prisma.courseProgress.count({
      where: { userId, completed: true },
    });
    const overallPercent = Math.round((completedModules / totalModules) * 100);

    // Check milestones (25, 50, 75, 100)
    const milestones = [25, 50, 75, 100];
    const hitMilestone = milestones.find((m) => overallPercent >= m);

    if (hitMilestone) {
      // Trigger milestone check in background (fire and forget)
      fetch(
        `${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/api/course/check-milestones`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, completionPercent: hitMilestone }),
        }
      ).catch(() => {}); // Ignore errors
    }

    return NextResponse.json({
      progress,
      overallPercent,
      completedModules,
      totalModules,
    });
  } catch (error) {
    console.error("[PROGRESS] POST error:", error);
    return NextResponse.json(
      { error: "Failed to save progress" },
      { status: 500 }
    );
  }
}

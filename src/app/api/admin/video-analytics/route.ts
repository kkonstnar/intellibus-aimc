// Admin Video Analytics API
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Get all modules
    const modules = await prisma.courseModule.findMany({
      orderBy: { order: "asc" },
    });

    // Get stats for each module
    const moduleStats = await Promise.all(
      modules.map(async (module) => {
        // Total views (play events)
        const totalViews = await prisma.videoEvent.count({
          where: { moduleId: module.id, eventType: "play" },
        });

        // Unique viewers
        const uniqueViewers = await prisma.videoEvent.groupBy({
          by: ["userId"],
          where: { moduleId: module.id, eventType: "play" },
        });

        // Progress stats
        const progressStats = await prisma.courseProgress.aggregate({
          _avg: { watchedSeconds: true, completionPct: true },
          _count: { id: true },
          where: { moduleId: module.id },
        });

        // Completion count
        const completionCount = await prisma.courseProgress.count({
          where: { moduleId: module.id, completed: true },
        });

        // Get drop-off points (pause events grouped by position buckets)
        const pauseEvents = await prisma.videoEvent.findMany({
          where: { moduleId: module.id, eventType: "pause" },
          select: { position: true },
        });

        // Group pause events into 10-second buckets
        const bucketSize = 10;
        const dropOffBuckets: Record<number, number> = {};
        pauseEvents.forEach((event) => {
          const bucket = Math.floor(event.position / bucketSize) * bucketSize;
          dropOffBuckets[bucket] = (dropOffBuckets[bucket] || 0) + 1;
        });

        // Get top 5 drop-off points
        const dropOffPoints = Object.entries(dropOffBuckets)
          .map(([position, count]) => ({ position: parseInt(position), count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        return {
          id: module.id,
          slug: module.slug,
          title: module.title,
          duration: module.duration,
          tier: module.tier,
          totalViews,
          uniqueViewers: uniqueViewers.length,
          avgWatchTime: progressStats._avg.watchedSeconds || 0,
          avgCompletionPct: progressStats._avg.completionPct || 0,
          completionCount,
          dropOffPoints,
        };
      })
    );

    // Calculate totals
    const totals = {
      totalViews: moduleStats.reduce((sum, m) => sum + m.totalViews, 0),
      uniqueViewers: await prisma.videoEvent.groupBy({
        by: ["userId"],
        where: { eventType: "play" },
      }).then((r) => r.length),
      totalWatchTime: await prisma.courseProgress.aggregate({
        _sum: { watchedSeconds: true },
      }).then((r) => r._sum.watchedSeconds || 0),
      avgCompletionRate: moduleStats.length > 0
        ? Math.round(
            moduleStats.reduce((sum, m) => sum + m.avgCompletionPct, 0) /
              moduleStats.length
          )
        : 0,
    };

    return NextResponse.json({
      modules: moduleStats,
      totals,
    });
  } catch (error) {
    console.error("[ADMIN] Video analytics error:", error);
    return NextResponse.json({
      modules: [],
      totals: {
        totalViews: 0,
        uniqueViewers: 0,
        totalWatchTime: 0,
        avgCompletionRate: 0,
      },
    });
  }
}


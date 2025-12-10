// Admin Dashboard Stats API
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get total users
    const totalUsers = await prisma.user.count();

    // Get users active today
    const activeToday = await prisma.session.count({
      where: {
        updatedAt: { gte: todayStart },
      },
    });

    // Get new users this week
    const newUsersThisWeek = await prisma.user.count({
      where: {
        createdAt: { gte: weekStart },
      },
    });

    // Get video stats
    const videoEvents = await prisma.videoEvent.aggregate({
      _count: { id: true },
      where: { eventType: "play" },
    });

    // Get average watch time
    const watchTimeStats = await prisma.courseProgress.aggregate({
      _avg: { watchedSeconds: true },
    });

    // Get completion rate
    const totalProgress = await prisma.courseProgress.count();
    const completedProgress = await prisma.courseProgress.count({
      where: { completed: true },
    });
    const completionRate = totalProgress > 0 
      ? Math.round((completedProgress / totalProgress) * 100) 
      : 0;

    // Get pending discount requests
    const pendingDiscounts = await prisma.discountRequest.count({
      where: { status: "pending" },
    });

    // Get emails sent this month
    const emailsSent = await prisma.emailNotification.count({
      where: {
        status: "sent",
        sentAt: { gte: monthStart },
      },
    });

    // Get recent users with their progress
    const recentUsersRaw = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        courseProgress: true,
      },
    });

    const totalModules = await prisma.courseModule.count() || 6; // Default to 6 if no modules defined

    const recentUsers = recentUsersRaw.map((user) => {
      const completedModules = user.courseProgress.filter((p) => p.completed).length;
      return {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        progress: Math.round((completedModules / totalModules) * 100),
      };
    });

    // Get top videos by views
    const topVideoEvents = await prisma.videoEvent.groupBy({
      by: ["moduleId"],
      _count: { id: true },
      where: { eventType: "play" },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    });

    const topVideos = await Promise.all(
      topVideoEvents.map(async (event) => {
        const module = await prisma.courseModule.findUnique({
          where: { id: event.moduleId },
        });
        
        const avgCompletion = await prisma.courseProgress.aggregate({
          _avg: { completionPct: true },
          where: { moduleId: event.moduleId },
        });

        return {
          moduleId: event.moduleId,
          title: module?.title || "Unknown Module",
          views: event._count.id,
          avgCompletion: Math.round(avgCompletion._avg.completionPct || 0),
        };
      })
    );

    // Get recent activity
    const recentVideoEvents = await prisma.videoEvent.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      where: {
        eventType: { in: ["play", "ended"] },
      },
    });

    const recentSignups = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      where: {
        createdAt: { gte: weekStart },
      },
    });

    const recentDiscountRequests = await prisma.discountRequest.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      where: {
        createdAt: { gte: weekStart },
      },
    });

    // Combine and sort activity
    const recentActivity: Array<{
      id: string;
      type: string;
      user: string;
      description: string;
      timestamp: string;
    }> = [];

    // Add signups
    recentSignups.forEach((user) => {
      recentActivity.push({
        id: `signup-${user.id}`,
        type: "signup",
        user: user.email.split("@")[0],
        description: "signed up for the course",
        timestamp: user.createdAt.toISOString(),
      });
    });

    // Add video events
    for (const event of recentVideoEvents) {
      const module = await prisma.courseModule.findUnique({
        where: { id: event.moduleId },
      });
      recentActivity.push({
        id: `video-${event.id}`,
        type: event.eventType === "ended" ? "video_complete" : "video_start",
        user: event.userId.split("_")[1] || "User",
        description: event.eventType === "ended" 
          ? `completed "${module?.title || 'a video'}"`
          : `started watching "${module?.title || 'a video'}"`,
        timestamp: event.createdAt.toISOString(),
      });
    }

    // Add discount requests
    recentDiscountRequests.forEach((req) => {
      recentActivity.push({
        id: `discount-${req.id}`,
        type: "discount_request",
        user: req.name,
        description: `requested a discount from ${req.company}`,
        timestamp: req.createdAt.toISOString(),
      });
    });

    // Sort by timestamp descending
    recentActivity.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({
      totalUsers,
      activeToday,
      newUsersThisWeek,
      totalVideoViews: videoEvents._count.id || 0,
      avgWatchTime: Math.round(watchTimeStats._avg.watchedSeconds || 0),
      completionRate,
      pendingDiscounts,
      emailsSent,
      recentUsers,
      topVideos,
      recentActivity: recentActivity.slice(0, 15),
    });
  } catch (error) {
    console.error("[ADMIN] Stats error:", error);
    return NextResponse.json({
      totalUsers: 0,
      activeToday: 0,
      newUsersThisWeek: 0,
      totalVideoViews: 0,
      avgWatchTime: 0,
      completionRate: 0,
      pendingDiscounts: 0,
      emailsSent: 0,
      recentUsers: [],
      topVideos: [],
      recentActivity: [],
    });
  }
}

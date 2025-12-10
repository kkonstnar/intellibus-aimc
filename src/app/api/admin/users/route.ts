// Admin Users API
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "15");
    const search = searchParams.get("search") || "";
    const tier = searchParams.get("tier") || "";

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search } },
        { name: { contains: search } },
        { company: { contains: search } },
      ];
    }

    if (tier && tier !== "all") {
      where.tier = tier;
    }

    // Get total count
    const total = await prisma.user.count({ where });

    // Get users with their progress
    const users = await prisma.user.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        courseProgress: true,
      },
    });

    // Get total modules count
    const totalModules = (await prisma.courseModule.count()) || 6;

    // Get stats
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const freeUsers = await prisma.user.count({ where: { tier: "free" } });
    const paidUsers = await prisma.user.count({ where: { tier: "paid" } });
    const activeToday = await prisma.session.count({
      where: { updatedAt: { gte: todayStart } },
    });

    // Transform users data
    const transformedUsers = users.map((user) => {
      const completedModules = user.courseProgress.filter(
        (p) => p.completed
      ).length;
      const totalWatchTime = user.courseProgress.reduce(
        (sum, p) => sum + p.watchedSeconds,
        0
      );
      const lastProgress = user.courseProgress.sort(
        (a, b) =>
          new Date(b.lastWatchedAt).getTime() -
          new Date(a.lastWatchedAt).getTime()
      )[0];

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        tier: user.tier || "free",
        company: user.company,
        jobTitle: user.jobTitle,
        paidAt: user.paidAt?.toISOString() || null,
        amountPaid: user.amountPaid,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        progress: {
          totalModules,
          completedModules,
          totalWatchTime,
          lastActiveAt: lastProgress?.lastWatchedAt?.toISOString() || null,
        },
      };
    });

    return NextResponse.json({
      users: transformedUsers,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      stats: {
        freeUsers,
        paidUsers,
        activeToday,
      },
    });
  } catch (error) {
    console.error("[ADMIN] Users error:", error);
    return NextResponse.json({
      users: [],
      total: 0,
      page: 1,
      pageSize: 15,
      totalPages: 0,
      stats: { freeUsers: 0, paidUsers: 0, activeToday: 0 },
    });
  }
}

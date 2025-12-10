// Admin Emails API
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const status = searchParams.get("status") || "";
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.email = { contains: search };
    }

    // Get total count
    const total = await prisma.emailNotification.count({ where });

    // Get emails
    const emails = await prisma.emailNotification.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });

    // Get stats
    const statsTotal = await prisma.emailNotification.count();
    const statsSent = await prisma.emailNotification.count({
      where: { status: "sent" },
    });
    const statsOpened = await prisma.emailNotification.count({
      where: { status: "opened" },
    });
    const statsPending = await prisma.emailNotification.count({
      where: { status: "pending" },
    });

    return NextResponse.json({
      emails: emails.map((e) => ({
        id: e.id,
        userId: e.userId,
        email: e.email,
        type: e.type,
        subject: e.subject,
        status: e.status,
        sentAt: e.sentAt?.toISOString() || null,
        openedAt: e.openedAt?.toISOString() || null,
        clickedAt: e.clickedAt?.toISOString() || null,
        createdAt: e.createdAt.toISOString(),
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      stats: {
        total: statsTotal,
        sent: statsSent,
        opened: statsOpened,
        pending: statsPending,
      },
    });
  } catch (error) {
    console.error("[ADMIN] Emails error:", error);
    return NextResponse.json({
      emails: [],
      total: 0,
      page: 1,
      pageSize: 20,
      totalPages: 0,
      stats: { total: 0, sent: 0, opened: 0, pending: 0 },
    });
  }
}


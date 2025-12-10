// Admin Discount Requests API
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { email: { contains: search } },
        { company: { contains: search } },
        { name: { contains: search } },
      ];
    }

    const requests = await prisma.discountRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      requests: requests.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        company: r.company,
        jobTitle: r.jobTitle,
        status: r.status,
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("[ADMIN] Discount requests error:", error);
    return NextResponse.json({ requests: [] });
  }
}


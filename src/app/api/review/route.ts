import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const latestReviews = await prisma.review.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5, 
      select: {
        id: true,
        content: true,
        createdAt: true,
        book: {
          select: {
            externalId: true, 
            title: true,
            author: true,
            coverUrl: true,
          },
        },
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    return NextResponse.json({ reviews: latestReviews });
  } catch (error) {
    console.error("Error fetching latest reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch latest reviews" },
      { status: 500 }
    );
  }
}
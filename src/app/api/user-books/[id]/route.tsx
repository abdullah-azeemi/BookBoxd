import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request, context: unknown) {
  const { params } = context as { params: { id: string } }
  const authObj = auth() as unknown as { userId: string | null }
  const effectiveUserId = process.env.NODE_ENV === "development"
    ? (authObj.userId ?? process.env.DEV_FAKE_USER_ID)
    : (authObj.userId || null)
  if (!effectiveUserId) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const externalId = params.id;

  try {
    const book = await prisma.book.findUnique({
      where: { externalId },
    });

    if (!book) {
      return NextResponse.json({ status: null });
    }

    const userBook = await prisma.userBook.findUnique({
      where: {
        userId_bookId: {
          userId: effectiveUserId,
          bookId: book.id,
        },
      },
    });

    if (!userBook) {
      return NextResponse.json({ status: null });
    }

    return NextResponse.json({ status: userBook.status });
  } catch (error) {
    console.error("Error fetching book status:", error);
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json({ status: null });
    }
    return NextResponse.json({ error: "Failed to fetch book status" }, { status: 500 });
  }
}
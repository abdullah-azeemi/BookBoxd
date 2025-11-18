import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  { params }: { params: { externalId: string } }
) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const { externalId } = params;

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
          userId: userId,
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
    return NextResponse.json({ error: "Failed to fetch book status" }, { status: 500 });
  }
}
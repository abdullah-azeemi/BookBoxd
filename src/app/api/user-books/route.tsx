import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = auth();
  const effectiveUserId = userId ?? process.env.DEV_FAKE_USER_ID;
  if (!effectiveUserId) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  try {
    const userBooks = await prisma.userBook.findMany({
      where: {
        userId: effectiveUserId!,
      },
      include: {
        book: true, 
      },
    });
    return NextResponse.json({ userBooks });
  } catch (error) {
    console.error("Error fetching user books:", error);
    return NextResponse.json({ error: "Failed to fetch user books" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId } = auth();
  const effectiveUserId = userId ?? process.env.DEV_FAKE_USER_ID ;
  if (!effectiveUserId) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { externalBookId, status, title, author, coverUrl } = body;

    if (!externalBookId || !status) {
      return NextResponse.json({ error: "Missing externalBookId or status" }, { status: 400 });
    }

    await prisma.user.upsert({
      where: { clerkId: effectiveUserId },
      update: {},
      create: { id: effectiveUserId, clerkId: effectiveUserId }
    });
    const book = await prisma.book.upsert({
      where: { externalId: externalBookId },
      update: {
        title,
        author,
        coverUrl,
      },
      create: {
        externalId: externalBookId,
        title: title || "Unknown Title",
        author: author || "Unknown Author",
        coverUrl: coverUrl || "/placeholder.svg",
      },
    });

    const userBook = await prisma.userBook.upsert({
      where: {
        userId_bookId: {
          userId: effectiveUserId,
          bookId: book.id,
        },
      },
      update: {
        status: status,
      },
      create: {
        userId: effectiveUserId,
        bookId: book.id,
        status: status,
      },
    });

    return NextResponse.json({ userBook });

  } catch (error) {
    console.error("Error upserting user book:", error);
    return NextResponse.json({ error: "Failed to update book status" }, { status: 500 });
  }
}
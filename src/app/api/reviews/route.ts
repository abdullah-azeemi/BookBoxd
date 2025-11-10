import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { externalId, title, author, userId, content, rating } = await req.json()

    if (!externalId || !title || !author || !userId || !content || !rating) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }
    const book = await prisma.book.upsert({
      where: { externalId },
      update: {}, 
      create: {
        externalId,
        title,
        author,
      },
    })

    const review = await prisma.review.create({
      data: {
        bookId: book.id, 
        userId,
        content,
        rating,
      },
      include: { user: true },
    })

    await prisma.rating.upsert({
      where: { userId_bookId: { userId, bookId: book.id } },
      update: { value: rating },
      create: { bookId: book.id, userId, value: rating },
    })

    

    return NextResponse.json({ review })
  } catch (err) {
    console.error("POST /api/reviews error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const externalId = searchParams.get("bookId") // this is Google Books ID
  if (!externalId) return NextResponse.json({ reviews: [] })

  // Find internal book id
  const book = await prisma.book.findUnique({ where: { externalId } })
  if (!book) return NextResponse.json({ reviews: [] })

  // Fetch reviews using internal id
  const reviews = await prisma.review.findMany({
    where: { bookId: book.id }, // internal Prisma ID
    include: { user: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ reviews })
}

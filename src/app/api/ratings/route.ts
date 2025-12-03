import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const bookId = searchParams.get("bookId")
    if (!bookId) return NextResponse.json({ average: 0, count: 0 })

    const ratings = await prisma.rating.findMany({ where: { bookId } })
    const average = ratings.length
      ? ratings.reduce((sum: number, r: { value: number }) => sum + r.value, 0) / ratings.length
      : 0

    return NextResponse.json({ average, count: ratings.length })
  } catch {
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json({ average: 0, count: 0 })
    }
    return NextResponse.json({ error: "Failed to fetch ratings" }, { status: 500 })
  }
}



export async function POST(req: Request) {
  const { bookId, userId, value } = await req.json()
  if (!bookId || !userId || !value)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })

  const rating = await prisma.rating.upsert({
    where: { userId_bookId: { userId, bookId } },
    update: { value },
    create: { bookId, userId, value },
  })

  return NextResponse.json({ rating })
}

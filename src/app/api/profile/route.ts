import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"

interface Book {
  id: string
  title: string
  author: string
  coverUrl: string
  genre: string
  rating?: number
}

interface ReviewItem {
  id: string
  bookTitle: string
  bookId: string
  content: string
  rating: number
  createdAt: string
}

interface UserProfileData {
  user: {
    username: string
    avatarUrl: string
    joiningDate: string
    tagLine: string
  }
  bookshelf: {
    currentlyReading: Book[]
    wantToRead: Book[]
    read: Book[]
  }
  stats: {
    totalBooksRead: number
    favoriteGenre: string
    averageRating: number
    currentYearGoal: number
    currentYearProgress: number
    genreBreakdown: Array<{ genre: string; count: number }>
  }
  reviews: ReviewItem[]
}

export async function GET() {
  try {
    let effectiveUserId: string | null = null
    if (process.env.NODE_ENV === "development") {
      effectiveUserId = process.env.DEV_FAKE_USER_ID || "clerk1"
    } else {
      const authObj = auth() as unknown as { userId: string | null }
      effectiveUserId = authObj.userId || null
    }

    if (!effectiveUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let user = await prisma.user.upsert({
      where: { clerkId: effectiveUserId },
      update: {},
      create: { id: effectiveUserId, clerkId: effectiveUserId },
    })

    if (!user.username) {
      const cu = await currentUser()
      const preferredName = `${cu?.firstName || ""} ${cu?.lastName || ""}`.trim() || cu?.username || undefined
      if (preferredName) {
        user = await prisma.user.update({
          where: { clerkId: effectiveUserId },
          data: { username: preferredName },
        })
      }
    }

    const userBooks = await prisma.userBook.findMany({
      where: { userId: user.id },
      include: { book: true },
      orderBy: { updatedAt: "desc" },
    })

    const bookIds = userBooks.map((ub) => ub.bookId)
    const ratings = await prisma.rating.findMany({
      where: { userId: user.id, bookId: { in: bookIds } },
    })
    const ratingMap = new Map(ratings.map((r) => [r.bookId, r.value]))

    const byStatus = {
      "reading": [] as Book[],
      "want-to-read": [] as Book[],
      "read": [] as Book[],
    }
    for (const ub of userBooks) {
      const genre = ub.book.genre || "Unknown"
      const b: Book = {
        id: ub.book.externalId || ub.book.id,
        title: ub.book.title,
        author: ub.book.author,
        coverUrl: ub.book.coverUrl || "/placeholder.svg",
        genre,
        rating: ratingMap.get(ub.bookId),
      }
      if (ub.status === "reading") byStatus["reading"].push(b)
      else if (ub.status === "want-to-read") byStatus["want-to-read"].push(b)
      else if (ub.status === "read") byStatus["read"].push(b)
    }

    const totalBooksRead = byStatus["read"].length
    const currentYear = new Date().getFullYear()
    const currentYearProgress = await prisma.userBook.count({
      where: {
        userId: user.id,
        status: "read",
        createdAt: {
          gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
          lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
        },
      },
    })
    const currentYearGoal = 60

    const genreCounts = new Map<string, number>()
    for (const ub of userBooks) {
      const g = ub.book.genre || "Unknown"
      genreCounts.set(g, (genreCounts.get(g) || 0) + 1)
    }
    const genreBreakdown = Array.from(genreCounts.entries())
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count)

    const averageRatingAgg = await prisma.rating.aggregate({
      where: { userId: user.id },
      _avg: { value: true },
    })
    const averageRating = Number(averageRatingAgg._avg.value || 0)

    const reviewsRaw = await prisma.review.findMany({
      where: { userId: user.id },
      include: { book: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    })
    const reviews: ReviewItem[] = reviewsRaw.map((r) => ({
      id: r.id,
      bookTitle: r.book.title,
      bookId: r.book.externalId || r.book.id,
      content: r.content,
      rating: r.rating,
      createdAt: r.createdAt.toISOString(),
    }))

    const data: UserProfileData = {
      user: {
        username: user.username || "Anonymous",
        avatarUrl: "/placeholder.svg",
        joiningDate: user.createdAt.toISOString(),
        tagLine: "Avid reader",
      },
      bookshelf: {
        currentlyReading: byStatus["reading"],
        wantToRead: byStatus["want-to-read"],
        read: byStatus["read"],
      },
      stats: {
        totalBooksRead,
        favoriteGenre: genreBreakdown[0]?.genre || "Unknown",
        averageRating,
        currentYearGoal,
        currentYearProgress,
        genreBreakdown,
      },
      reviews,
    }

    return NextResponse.json(data)
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      const empty: UserProfileData = {
        user: {
          username: "Anonymous",
          avatarUrl: "/placeholder.svg",
          joiningDate: new Date().toISOString(),
          tagLine: "",
        },
        bookshelf: { currentlyReading: [], wantToRead: [], read: [] },
        stats: {
          totalBooksRead: 1,
          favoriteGenre: "Unknown",
          averageRating: 0,
          currentYearGoal: 60,
          currentYearProgress: 0,
          genreBreakdown: [],
        },
        reviews: [],
      }
      console.error("Profile GET error (dev returning empty):", error)
      return NextResponse.json(empty)
    }
    console.error("Profile GET error:", error)
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 })
  }
}

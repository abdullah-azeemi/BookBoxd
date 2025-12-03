import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"

export const runtime = "nodejs"

interface Book {
  id: string
  dbId: string
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

interface QuoteItem {
  id: string
  text: string
  bookTitle: string
  author: string
  createdAt: string
}

interface GenreBreakdown {
  genre: string
  count: number
  percentage: number
}

interface UserProfileData {
  user: {
    username: string
    avatarUrl: string
    joiningDate: string
    bio: string
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
    genreBreakdown: GenreBreakdown[]
  }
  reviews: ReviewItem[]
  quotes: QuoteItem[]
}

export async function GET() {
  try {
    const { userId } = await auth();
    console.log("[Profile API] Auth check:", { userId, nodeEnv: process.env.NODE_ENV });
    if (!userId) {
      console.error("[Profile API] No user ID – unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const effectiveUserId = userId;


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

    const bookIds = userBooks.map((ub: { bookId: string }) => ub.bookId)
    const ratings = await prisma.rating.findMany({
      where: { userId: user.id, bookId: { in: bookIds } },
    })
    const ratingMap = new Map(ratings.map((r: { bookId: string; value: number }) => [r.bookId, r.value]))

    const byStatus = {
      "reading": [] as Book[],
      "want-to-read": [] as Book[],
      "read": [] as Book[],
    }
    for (const ub of userBooks) {
      // Ensure we have a valid externalId for navigation
      const bookId = ub.book.externalId || ub.book.id
      if (!bookId) {
        console.warn(`Book ${ub.book.id} missing externalId, skipping`)
        continue
      }

      const genre = ub.book.genre || "Unknown"
      const b: Book = {
        id: bookId,
        dbId: ub.book.id, // Internal DB ID for relations
        title: ub.book.title || "Untitled",
        author: ub.book.author || "Unknown Author",
        coverUrl: ub.book.coverUrl || "/placeholder.svg",
        genre,
        rating: (ratingMap.get(ub.bookId) as number | undefined),
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

    // Calculate genre breakdown with percentages
    const genreCounts = new Map<string, number>()
    const totalBooks = userBooks.length

    for (const ub of userBooks) {
      const g = ub.book.genre || "Unknown"
      genreCounts.set(g, (genreCounts.get(g) || 0) + 1)
    }

    const genreBreakdown: GenreBreakdown[] = Array.from(genreCounts.entries())
      .map(([genre, count]) => ({
        genre,
        count,
        percentage: totalBooks > 0 ? Math.round((count / totalBooks) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5) // Top 5 genres

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
    const reviews: ReviewItem[] = reviewsRaw.map((r: { id: string; book: { title: string; externalId: string | null; id: string }; content: string; rating: number; createdAt: Date }) => ({
      id: r.id,
      bookTitle: r.book.title,
      bookId: r.book.externalId || r.book.id,
      content: r.content,
      rating: r.rating,
      createdAt: r.createdAt.toISOString(),
    }))

    // Fetch user's quotes
    const quotesRaw = await prisma.quote.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 6, // Show top 6 quotes
    })
    const quotes: QuoteItem[] = quotesRaw.map((q: { id: string; text: string; bookTitle: string; author: string; createdAt: Date }) => ({
      id: q.id,
      text: q.text,
      bookTitle: q.bookTitle,
      author: q.author,
      createdAt: q.createdAt.toISOString(),
    }))

    const data: UserProfileData = {
      user: {
        username: user.username || "Anonymous",
        avatarUrl: user.avatarUrl || "/placeholder.svg",
        joiningDate: user.createdAt.toISOString(),
        bio: user.bio || "Avid reader and book reviewer",
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
      quotes,
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Profile GET error:", error)
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const effectiveUserId = userId;

    const body = await req.json()
    const { username, bio, avatarUrl } = body

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: effectiveUserId },
      select: { username: true }
    })

    console.log("[Profile PATCH] Debug:", {
      incomingUsername: username,
      currentUsername: currentUser?.username,
      isEqual: username === currentUser?.username,
      effectiveUserId
    })

    const updateData: Partial<{ username: string; bio: string; avatarUrl: string }> = {}

    if (username !== undefined && username !== null) {
      const isDifferent = username !== currentUser?.username;
      const isCaseChangeOnly = username.toLowerCase() === currentUser?.username?.toLowerCase();

      if (isDifferent && !isCaseChangeOnly) {
        console.log("[Profile PATCH] Updating username to:", username)
        updateData.username = username
      } else if (isDifferent && isCaseChangeOnly) {
        console.log("[Profile PATCH] Ignoring case-only username change:", username)
      }
    }

    if (bio !== undefined) updateData.bio = bio
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl

    if (Object.keys(updateData).length === 0) {
      console.log("[Profile PATCH] No changes detected")
      return NextResponse.json({
        username: currentUser?.username,
        message: "No changes detected"
      })
    }

    const user = await prisma.user.update({
      where: { clerkId: effectiveUserId },
      data: updateData,
    })

    return NextResponse.json({
      username: user.username,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
    })
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === "P2002") {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 })
    }

    console.error("Profile PATCH error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

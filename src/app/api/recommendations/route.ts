import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { searchBooks } from "@/lib/books"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface RecommendedBook {
    externalId: string
    title: string
    author: string
    coverUrl: string | null
}

export async function GET() {
    try {
        const { userId } = await auth()

        if (!userId) {
            console.log("[Recommendations API] No authenticated user, returning random books")
            return await getRandomRecommendations()
        }
        const user = await prisma.user.upsert({
            where: { clerkId: userId },
            update: {},
            create: { id: userId, clerkId: userId },
        })

        const userBooks = await prisma.userBook.findMany({
            where: {
                userId: user.id,
                status: { in: ["read", "reading"] }
            },
            include: { book: true },
        })

        if (userBooks.length === 0) {
            console.log("[Recommendations API] User has no reading history, returning random books")
            return await getRandomRecommendations()
        }

        const genreCounts = new Map<string, number>()
        for (const ub of userBooks) {
            const genre = ub.book.genre || "Unknown"
            if (genre !== "Unknown") {
                genreCounts.set(genre, (genreCounts.get(genre) || 0) + 1)
            }
        }

        const topGenres = Array.from(genreCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2)
            .map(([genre]) => genre)

        if (topGenres.length === 0) {
            console.log("[Recommendations API] No valid genres found, returning random books")
            return await getRandomRecommendations()
        }

        const readBookExternalIds = userBooks
            .map((ub: { book: { externalId: string | null } }) => ub.book.externalId)
            .filter((id: string | null): id is string => id !== null)

        const allRecommendations: RecommendedBook[] = []

        for (const genre of topGenres) {
            try {
                const books = await searchBooks(genre)

                const filteredBooks = books
                    .filter(book => !readBookExternalIds.includes(book.id))
                    .map(book => ({
                        externalId: book.id,
                        title: book.title,
                        author: book.authors[0] || "Unknown Author",
                        coverUrl: book.coverUrl,
                    }))

                allRecommendations.push(...filteredBooks)
            } catch (error) {
                console.error(`[Recommendations API] Error searching for genre ${genre}:`, error)
            }
        }

        // Shuffle and take 5 unique recommendations
        const shuffled = allRecommendations.sort(() => Math.random() - 0.5)
        const uniqueRecommendations = getUniqueBooks(shuffled).slice(0, 5)

        // If we don't have enough recommendations, fill with random books
        if (uniqueRecommendations.length < 5) {
            console.log(`[Recommendations API] Only found ${uniqueRecommendations.length} recommendations, adding random books`)
            const randomBooks = await getRandomBooksFromAPI(5 - uniqueRecommendations.length)
            uniqueRecommendations.push(...randomBooks)
        }

        console.log(`[Recommendations API] Returning ${uniqueRecommendations.length} personalized recommendations`)
        return NextResponse.json({ recommendations: uniqueRecommendations })

    } catch (error) {
        console.error("[Recommendations API] Error:", error)
        return await getRandomRecommendations()
    }
}

async function getRandomRecommendations() {
    try {
        const randomBooks = await getRandomBooksFromAPI(5)
        return NextResponse.json({ recommendations: randomBooks })
    } catch (error) {
        console.error("[Recommendations API] Error getting random books:", error)
        return NextResponse.json({ recommendations: [] })
    }
}

async function getRandomBooksFromAPI(count: number): Promise<RecommendedBook[]> {
    const topics = ["fiction", "science", "history", "fantasy", "mystery", "thriller", "romance", "adventure"]
    const randomTopic = topics[Math.floor(Math.random() * topics.length)]

    try {
        const books = await searchBooks(randomTopic)
        return books
            .slice(0, count)
            .map(book => ({
                externalId: book.id,
                title: book.title,
                author: book.authors[0] || "Unknown Author",
                coverUrl: book.coverUrl,
            }))
    } catch (error) {
        console.error("[Recommendations API] Error fetching random books:", error)
        return []
    }
}

// Remove duplicate books based on title and author
function getUniqueBooks(books: RecommendedBook[]): RecommendedBook[] {
    const seen = new Set<string>()
    const unique: RecommendedBook[] = []

    for (const book of books) {
        const key = `${book.title.toLowerCase()}-${book.author.toLowerCase()}`
        if (!seen.has(key)) {
            seen.add(key)
            unique.push(book)
        }
    }

    return unique
}

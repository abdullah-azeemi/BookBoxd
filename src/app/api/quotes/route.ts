import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function GET() {
    try {
        const authObj = auth() as unknown as { userId: string | null }
        const effectiveUserId = process.env.NODE_ENV === "development"
            ? (authObj.userId ?? process.env.DEV_FAKE_USER_ID ?? "clerk1")
            : (authObj.userId || null)

        if (!effectiveUserId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Ensure user exists
        await prisma.user.upsert({
            where: { clerkId: effectiveUserId },
            update: {},
            create: { id: effectiveUserId, clerkId: effectiveUserId },
        })

        const quotes = await prisma.quote.findMany({
            where: { userId: effectiveUserId },
            include: { book: true },
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json({ quotes })
    } catch (error) {
        console.error("Error fetching quotes:", error)
        return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const authObj = auth() as unknown as { userId: string | null }
        const effectiveUserId = process.env.NODE_ENV === "development"
            ? (authObj.userId ?? process.env.DEV_FAKE_USER_ID ?? "clerk1")
            : (authObj.userId || null)

        if (!effectiveUserId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { text, bookId, bookTitle, author } = body

        if (!text || !bookId || !bookTitle || !author) {
            return NextResponse.json(
                { error: "Missing required fields: text, bookId, bookTitle, author" },
                { status: 400 }
            )
        }

        // Ensure user exists
        await prisma.user.upsert({
            where: { clerkId: effectiveUserId },
            update: {},
            create: { id: effectiveUserId, clerkId: effectiveUserId },
        })

        const quote = await prisma.quote.create({
            data: {
                text,
                bookTitle,
                author,
                userId: effectiveUserId,
                bookId,
            },
            include: { book: true },
        })

        return NextResponse.json({ quote }, { status: 201 })
    } catch (error) {
        console.error("Error creating quote:", error)
        return NextResponse.json({ error: "Failed to create quote" }, { status: 500 })
    }
}

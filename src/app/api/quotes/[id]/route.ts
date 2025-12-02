import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function DELETE(
    req: Request,
    context: unknown
) {
    const { params } = context as { params: Promise<{ id: string }> }
    const { id } = await params
    try {
        const authObj = auth() as unknown as { userId: string | null }
        let effectiveUserId = authObj.userId

        if (!effectiveUserId && process.env.NODE_ENV === "development") {
            effectiveUserId = process.env.DEV_FAKE_USER_ID || "clerk1"
        }

        if (!effectiveUserId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const quoteId = id

        const quote = await prisma.quote.findUnique({
            where: { id: quoteId },
        })

        if (!quote) {
            return NextResponse.json({ error: "Quote not found" }, { status: 404 })
        }

        if (quote.userId !== effectiveUserId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        await prisma.quote.delete({
            where: { id: quoteId },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting quote:", error)
        return NextResponse.json({ error: "Failed to delete quote" }, { status: 500 })
    }
}

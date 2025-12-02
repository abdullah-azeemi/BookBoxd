import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const authObj = auth() as unknown as { userId: string | null }
        const effectiveUserId = process.env.NODE_ENV === "development"
            ? (authObj.userId ?? process.env.DEV_FAKE_USER_ID ?? "clerk1")
            : (authObj.userId || null)

        if (!effectiveUserId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (!process.env.BLOB_READ_WRITE_TOKEN) {
            console.error("Missing BLOB_READ_WRITE_TOKEN environment variable")
            return NextResponse.json(
                { error: "Server configuration error: Missing BLOB_READ_WRITE_TOKEN" },
                { status: 500 }
            )
        }

        const formData = await req.formData()
        const file = formData.get("file") as File

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 })
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed" },
                { status: 400 }
            )
        }

        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "File too large. Maximum size is 5MB" },
                { status: 400 }
            )
        }

        // Generate unique filename
        const filename = `avatar-${effectiveUserId}-${Date.now()}.${file.name.split('.').pop()}`

        // Upload to Vercel Blob
        let blob;
        try {
            blob = await put(filename, file, {
                access: "public",
                addRandomSuffix: false,
            })
        } catch (uploadError) {
            console.error("Vercel Blob upload failed:", uploadError)
            return NextResponse.json(
                { error: `Upload failed: ${(uploadError as Error).message}` },
                { status: 500 }
            )
        }

        const avatarUrl = blob.url

        // Update user's avatar URL in database
        try {
            await prisma.user.update({
                where: { clerkId: effectiveUserId },
                data: { avatarUrl },
            })
        } catch (dbError) {
            console.error("Database update failed:", dbError)
            return NextResponse.json(
                { error: "Failed to update user profile in database" },
                { status: 500 }
            )
        }

        return NextResponse.json({ avatarUrl })
    } catch (error) {
        console.error("Error uploading avatar:", error)
        return NextResponse.json(
            { error: `Failed to upload avatar: ${(error as Error).message}` },
            { status: 500 }
        )
    }
}

import { clerkMiddleware } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export default clerkMiddleware((auth, req) => {
  const path = req.nextUrl.pathname
  if (path.startsWith("/api/webhooks/clerk")) {
    return NextResponse.next()
  }
  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    // API routes are excluded to prevent Edge runtime errors
  ],
}
import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"


import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import SearchBar from "@/components/ui/SearchBar"
import BottomNav from "@/components/ui/BottomNav"
import MobileNav from "@/components/ui/MobileNavLoader"
import InstallPrompt from "@/components/ui/InstallPrompt"
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration"

import Link from "next/link"
import { BookOpen } from "lucide-react"

import "./globals.css"

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from "@clerk/nextjs"


export const metadata: Metadata = {
  title: "Bookboxd - Your Book Community",
  description: "Log books, write reviews, and discover your next great read with AI-powered recommendations",
  generator: "v0.app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BookBoxd",
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: "#3B82F6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider >
      <html lang="en" className={GeistSans.variable}>
        <body className="font-sans min-h-screen">
          <header className="sticky top-0 z-10 w-full bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
              <Link href="/" className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-blue-500" />
                <span className="text-2xl font-bold text-slate-900 dark:text-white">BookBoxd</span>
              </Link>
              <nav className="hidden items-center gap-8 md:flex">
                <Link
                  href="/home"
                  className="text-sm font-medium text-slate-600 hover:text-blue-500 dark:text-slate-300 dark:hover:text-blue-500"
                >
                  Home
                </Link>
                <Link
                  href="/collections"
                  className="text-sm font-medium text-slate-600 hover:text-blue-500 dark:text-slate-300 dark:hover:text-blue-500"
                >
                  Collections
                </Link>
                <Link
                  href="/profile"
                  className="text-sm font-medium text-slate-600 hover:text-blue-500 dark:text-slate-300 dark:hover:text-blue-500"
                >
                  Profile
                </Link>
                <Link
                  href="/ai-analytics"
                  className="text-sm font-medium text-slate-600 hover:text-blue-500 dark:text-slate-300 dark:hover:text-blue-500"
                >
                  AI Analytics
                </Link>
                <Link
                  href="/ai-recommender"
                  className="text-sm font-medium text-slate-600 hover:text-blue-500 dark:text-slate-300 dark:hover:text-blue-500"
                >
                  AI Book Finder
                </Link>
              </nav>

              {/* Desktop-only elements */}
              <div className="hidden md:flex items-center gap-4">
                <SearchBar />
                <SignedOut>
                  <div className="text-sm font-medium text-slate-600 hover:text-blue-500 dark:text-slate-300 dark:hover:text-blue-500">
                    <SignInButton mode="modal" />
                  </div>
                  <div className="text-sm font-medium text-slate-600 hover:text-blue-500 dark:text-slate-300 dark:hover:text-blue-500">
                    <SignUpButton mode="modal" />
                  </div>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSwitchSessionUrl="/" />
                </SignedIn>
              </div>

              {/* Mobile-only elements */}
              <div className="flex md:hidden items-center gap-2">
                <SignedIn>
                  <UserButton afterSwitchSessionUrl="/" />
                </SignedIn>
                <MobileNav />
              </div>
            </div>
          </header>

          <main className="pb-16 md:pb-0">
            <Suspense fallback={null}>{children}</Suspense>
          </main>

          <BottomNav />
          <InstallPrompt />
          <ServiceWorkerRegistration />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}

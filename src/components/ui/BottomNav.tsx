"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, BookMarked, Search, Sparkles, User } from "lucide-react"

export default function BottomNav() {
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700 safe-area-inset-bottom">
            <div className="flex items-center justify-around px-2 py-2 pb-safe">
                <Link
                    href="/home"
                    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-[64px] ${isActive("/home")
                        ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "text-slate-600 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400"
                        }`}
                >
                    <Home className={`h-5 w-5 ${isActive("/home") ? "fill-current" : ""}`} />
                    <span className="text-xs font-medium">Home</span>
                </Link>

                <Link
                    href="/collections"
                    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-[64px] ${isActive("/collections")
                        ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "text-slate-600 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400"
                        }`}
                >
                    <BookMarked className={`h-5 w-5 ${isActive("/collections") ? "fill-current" : ""}`} />
                    <span className="text-xs font-medium">Collections</span>
                </Link>

                <Link
                    href="/search"
                    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-[64px] ${isActive("/search")
                        ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "text-slate-600 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400"
                        }`}
                >
                    <Search className={`h-5 w-5 ${isActive("/search") ? "fill-current" : ""}`} />
                    <span className="text-xs font-medium">Search</span>
                </Link>

                <Link
                    href="/ai-recommender"
                    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-[64px] ${isActive("/ai-recommender")
                        ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "text-slate-600 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400"
                        }`}
                >
                    <Sparkles className={`h-5 w-5 ${isActive("/ai-recommender") ? "fill-current" : ""}`} />
                    <span className="text-xs font-medium">AI</span>
                </Link>

                <Link
                    href="/profile"
                    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-[64px] ${isActive("/profile")
                        ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "text-slate-600 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400"
                        }`}
                >
                    <User className={`h-5 w-5 ${isActive("/profile") ? "fill-current" : ""}`} />
                    <span className="text-xs font-medium">Profile</span>
                </Link>
            </div>
        </nav>
    )
}

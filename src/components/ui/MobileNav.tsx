"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Home, BookMarked, User, BarChart3, Sparkles } from "lucide-react"
import { SignInButton, SignUpButton, SignedOut } from "@clerk/nextjs"
import { Dialog, DialogContent, DialogClose, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false)

    const closeMenu = () => setIsOpen(false)

    

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button
                    className="md:hidden p-2 text-slate-600 hover:text-blue-500 dark:text-slate-300 dark:hover:text-blue-500"
                    aria-label="Toggle menu"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </DialogTrigger>
            <DialogContent fullScreen showCloseButton={false} className="md:hidden">
                <div className="flex flex-col h-full safe-area-inset-top pb-safe">
                    <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                        <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Menu</DialogTitle>
                        <DialogClose asChild>
                            <button
                                className="p-2 text-slate-600 hover:text-blue-500 dark:text-slate-300 dark:hover:text-blue-500"
                                aria-label="Close menu"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </DialogClose>
                    </div>
                    <DialogDescription className="sr-only">Site navigation menu</DialogDescription>
                    <nav className="flex-1 overflow-y-auto py-6">
                        <Link href="/home" onClick={closeMenu} className="flex items-center gap-3 px-6 py-4 text-slate-700 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-400 transition-colors">
                            <Home className="h-5 w-5" />
                            <span className="text-base font-medium">Home</span>
                        </Link>
                        <Link href="/collections" onClick={closeMenu} className="flex items-center gap-3 px-6 py-4 text-slate-700 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-400 transition-colors">
                            <BookMarked className="h-5 w-5" />
                            <span className="text-base font-medium">Collections</span>
                        </Link>
                        <Link href="/profile" onClick={closeMenu} className="flex items-center gap-3 px-6 py-4 text-slate-700 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-400 transition-colors">
                            <User className="h-5 w-5" />
                            <span className="text-base font-medium">Profile</span>
                        </Link>
                        <Link href="/ai-analytics" onClick={closeMenu} className="flex items-center gap-3 px-6 py-4 text-slate-700 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-400 transition-colors">
                            <BarChart3 className="h-5 w-5" />
                            <span className="text-base font-medium">AI Analytics</span>
                        </Link>
                        <Link href="/ai-recommender" onClick={closeMenu} className="flex items-center gap-3 px-6 py-4 text-slate-700 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-400 transition-colors">
                            <Sparkles className="h-5 w-5" />
                            <span className="text-base font-medium">AI Book Finder</span>
                        </Link>
                    </nav>
                    <SignedOut>
                        <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                            <div className="w-full">
                                <SignInButton mode="modal">
                                    <button className="w-full px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                                        Sign In
                                    </button>
                                </SignInButton>
                            </div>
                            <div className="w-full">
                                <SignUpButton mode="modal">
                                    <button className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg transition-colors">
                                        Sign Up
                                    </button>
                                </SignUpButton>
                            </div>
                        </div>
                    </SignedOut>
                </div>
            </DialogContent>
        </Dialog>
    )
}

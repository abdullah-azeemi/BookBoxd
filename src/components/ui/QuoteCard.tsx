"use client"

import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QuoteCardProps {
    id: string
    text: string
    bookTitle: string
    author: string
    onDelete?: (id: string) => void
    deletable?: boolean
}

export function QuoteCard({
    id,
    text,
    bookTitle,
    author,
    onDelete,
    deletable = false,
}: QuoteCardProps) {
    return (
        <Card className="relative p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            {deletable && onDelete && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 hover:opacity-100 transition-opacity"
                    onClick={() => onDelete(id)}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}

            <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed mb-3">
                "{text}"
            </p>

            <div className="border-t border-slate-200 dark:border-slate-600 pt-2">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {bookTitle}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    by {author}
                </p>
            </div>
        </Card>
    )
}

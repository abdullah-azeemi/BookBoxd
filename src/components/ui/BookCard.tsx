import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookCardProps {
    id: string
    title: string
    author: string
    coverUrl: string
    genre?: string
    rating?: number
    className?: string
    showRating?: boolean
    showGenre?: boolean
}

export function BookCard({
    id,
    title,
    author,
    coverUrl,
    genre,
    rating,
    className,
    showRating = true,
    showGenre = false,
}: BookCardProps) {
    return (
        <Link
            href={`/book/${id}`}
            className={cn(
                "group block transition-transform hover:scale-105",
                className
            )}
        >
            <Card className="overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="aspect-[2/3] relative bg-slate-100 dark:bg-slate-800">
                    <Image
                        src={coverUrl || "/placeholder.svg"}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    />
                    {showGenre && genre && (
                        <div className="absolute top-2 right-2 bg-[#00A8FF]/90 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full font-medium">
                            {genre}
                        </div>
                    )}
                </div>
            </Card>

            <div className="mt-2 space-y-1">
                <h3 className="font-medium text-xs text-slate-900 dark:text-white line-clamp-2 leading-tight">
                    {title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    by {author}
                </p>
                {showRating && rating && (
                    <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                            {rating.toFixed(1)}
                        </span>
                    </div>
                )}
            </div>
        </Link>
    )
}

import { Card } from "@/components/ui/card"

export function BookCardSkeleton() {
    return (
        <div className="animate-pulse">
            <Card className="overflow-hidden border border-slate-100 dark:border-slate-800">
                <div className="aspect-[2/3] bg-slate-200 dark:bg-slate-700" />
            </Card>
            <div className="mt-2 space-y-2">
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
            </div>
        </div>
    )
}

export function BookGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <BookCardSkeleton key={i} />
            ))}
        </div>
    )
}

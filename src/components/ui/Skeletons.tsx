import { Card, CardContent } from "@/components/ui/card"

// Base Skeleton Component
export function Skeleton({ className }: { className?: string }) {
    return (
        <div
            className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className || ""}`}
        />
    )
}

// Book Card Skeleton (matches your recommendation grid)
export function BookCardSkeleton() {
    return (
        <div className="group cursor-pointer">
            <div className="aspect-[3/4] mb-3 overflow-hidden">
                <Skeleton className="w-full h-full rounded-lg" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
    )
}

// Grid of Book Cards Skeleton
export function BookGridSkeleton({ count = 5 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <BookCardSkeleton key={i} />
            ))}
        </div>
    )
}

// Review Card Skeleton (matches your review cards)
export function ReviewCardSkeleton() {
    return (
        <Card className="p-6 flex flex-col md:flex-row gap-6">
            {/* Book Cover */}
            <div className="flex-shrink-0 w-24 h-32 md:w-32 md:h-40">
                <Skeleton className="w-full h-full rounded shadow-md" />
            </div>

            {/* Review Content */}
            <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-2/3" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-4 w-24" />
            </div>
        </Card>
    )
}

// Reviews List Skeleton
export function ReviewsListSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-6">
            {Array.from({ length: count }).map((_, i) => (
                <ReviewCardSkeleton key={i} />
            ))}
        </div>
    )
}

// Profile Header Skeleton
export function ProfileHeaderSkeleton() {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10">
            {/* Avatar */}
            <Skeleton className="h-24 w-24 md:h-28 md:w-28 rounded-full ring-4 ring-slate-100 dark:ring-slate-800" />

            {/* User Info */}
            <div className="flex-grow space-y-3">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-3 w-32" />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-28 rounded-lg" />
                <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
        </div>
    )
}

// Stats Grid Skeleton
export function StatsGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <CardContent className="p-5 space-y-2">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-8 w-16" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

// Quote Card Skeleton
export function QuoteCardSkeleton() {
    return (
        <Card className="p-6 border border-slate-200 dark:border-slate-700">
            <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="pt-2 space-y-2">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>
        </Card>
    )
}

// Quotes Grid Skeleton
export function QuotesGridSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <QuoteCardSkeleton key={i} />
            ))}
        </div>
    )
}

// Genre Chart Skeleton
export function GenreChartSkeleton() {
    return (
        <Card className="p-6 border border-slate-200 dark:border-slate-700">
            <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-12" />
                        </div>
                        <Skeleton className="h-3 w-full rounded-full" />
                    </div>
                ))}
            </div>
        </Card>
    )
}

// Book Details Page Skeleton
export function BookDetailsSkeleton() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Skeleton className="h-4 w-48" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left Column: Cover */}
                    <div className="lg:col-span-4 xl:col-span-3">
                        <div className="sticky top-24 space-y-6">
                            {/* Book Cover */}
                            <div className="aspect-[3/4] max-w-sm mx-auto">
                                <Skeleton className="w-full h-full rounded-lg shadow-2xl" />
                            </div>

                            {/* Title & Author */}
                            <div className="text-center lg:text-left space-y-3">
                                <Skeleton className="h-8 w-3/4 mx-auto lg:mx-0" />
                                <Skeleton className="h-6 w-1/2 mx-auto lg:mx-0" />
                                <Skeleton className="h-4 w-2/3 mx-auto lg:mx-0" />
                            </div>

                            {/* Status Button */}
                            <div className="flex justify-center lg:justify-start">
                                <Skeleton className="h-10 w-40 rounded-lg" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Content */}
                    <div className="lg:col-span-8 xl:col-span-9 space-y-8">
                        {/* AI Summary Card */}
                        <Card className="p-6">
                            <Skeleton className="h-6 w-32 mb-4" />
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </Card>

                        {/* Themes Card */}
                        <Card className="p-6">
                            <Skeleton className="h-6 w-40 mb-4" />
                            <div className="flex flex-wrap gap-2">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton key={i} className="h-8 w-24 rounded-full" />
                                ))}
                            </div>
                        </Card>

                        {/* Reviews Section */}
                        <Card className="p-6">
                            <Skeleton className="h-6 w-48 mb-6" />
                            <div className="space-y-4">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="border-b border-slate-200 dark:border-slate-700 pb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-4 w-20" />
                                        </div>
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-5/6" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}

// Collections Page Skeleton
export function CollectionsPageSkeleton() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Skeleton className="h-10 w-48 mb-8" />

                {/* Read Section */}
                <section className="mb-12">
                    <Skeleton className="h-8 w-32 mb-4" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <BookCardSkeleton key={i} />
                        ))}
                    </div>
                </section>

                {/* Currently Reading Section */}
                <section className="mb-12">
                    <Skeleton className="h-8 w-48 mb-4" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <BookCardSkeleton key={i} />
                        ))}
                    </div>
                </section>

                {/* Want to Read Section */}
                <section className="mb-12">
                    <Skeleton className="h-8 w-40 mb-4" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <BookCardSkeleton key={i} />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    )
}

// Profile Page Skeleton
export function ProfilePageSkeleton() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            <main className="px-4 md:px-8 lg:px-16 xl:px-32 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Profile Header */}
                    <ProfileHeaderSkeleton />

                    {/* Stats Grid */}
                    <StatsGridSkeleton />

                    {/* Genre Chart */}
                    <section className="mb-10">
                        <Skeleton className="h-8 w-48 mb-6" />
                        <GenreChartSkeleton />
                    </section>

                    {/* Quotes Section */}
                    <section className="mb-10">
                        <div className="flex items-center justify-between mb-6">
                            <Skeleton className="h-8 w-64" />
                            <Skeleton className="h-10 w-32 rounded-lg" />
                        </div>
                        <QuotesGridSkeleton count={3} />
                    </section>

                    {/* Reviews Section */}
                    <section>
                        <Skeleton className="h-10 w-full mb-6" />
                        <Skeleton className="h-6 w-32 mb-5" />
                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Card key={i} className="border border-slate-200 dark:border-slate-700">
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-2">
                                                <Skeleton className="h-5 w-48" />
                                                <Skeleton className="h-4 w-24" />
                                            </div>
                                            <Skeleton className="h-4 w-20" />
                                        </div>
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-3/4" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}

// Home Page Skeleton
export function HomePageSkeleton() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-5xl mx-auto">
                    {/* Welcome Message */}
                    <div className="mb-8">
                        <Skeleton className="h-9 w-64" />
                    </div>

                    {/* Recommended for you Section */}
                    <section className="mb-12">
                        <Skeleton className="h-8 w-56 mb-6" />
                        <BookGridSkeleton count={5} />
                    </section>

                    {/* Latest Reviews Section */}
                    <section>
                        <Skeleton className="h-8 w-48 mb-6" />
                        <ReviewsListSkeleton count={3} />
                    </section>
                </div>
            </main>
        </div>
    )
}

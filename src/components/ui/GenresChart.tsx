"use client"

interface Genre {
    genre: string
    count: number
    percentage: number
}

interface GenresChartProps {
    genres: Genre[]
}

const COLORS = [
    "#00A8FF", // Primary blue
    "#61DAFB", // Light blue
    "#4ECDC4", // Teal
    "#A8E6CF", // Mint
    "#FFD3B6", // Peach
]

export function GenresChart({ genres }: GenresChartProps) {
    const totalGenres = genres.length

    return (
        <div className="flex items-center gap-8">
            {/* Circular display */}
            <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-5xl font-bold text-slate-900 dark:text-white">
                        {totalGenres}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Genres
                    </div>
                </div>
            </div>

            {/* Genre list with color indicators */}
            <div className="flex-1 space-y-3">
                {genres.map((item, index) => (
                    <div key={item.genre} className="flex items-center gap-3">
                        <div
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <div className="flex-1">
                            <div className="flex items-baseline justify-between">
                                <span className="font-semibold text-slate-900 dark:text-white text-sm">
                                    {item.genre}
                                </span>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    ({item.percentage}%)
                                </span>
                            </div>
                            {/* Progress bar */}
                            <div className="mt-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                                <div
                                    className="h-1.5 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${item.percentage}%`,
                                        backgroundColor: COLORS[index % COLORS.length],
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

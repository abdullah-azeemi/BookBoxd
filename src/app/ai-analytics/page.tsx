'use client';

import { useState, useEffect, useMemo, useCallback } from "react"
import { useAuth } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"

interface WordCloudTerm {
    word: string
    weight: number
    sentiment: "positive" | "negative"
}

interface SentimentBreakdown {
    positive: number
    neutral: number
    negative: number
}

interface AIAnalyticsResponse {
    sentiment: SentimentBreakdown
    keywords: WordCloudTerm[]
    summary: string
    error?: string
}

interface AggregateStats {
    genreDistribution: { name: string; percent: number }[];
    monthlyReads: number[];
    topAuthors: { name: string; count: number }[];
    mostReviewedBooks: string[];
    readingPaceDays: number;
}

interface DashboardData extends AIAnalyticsResponse, AggregateStats { }

const INITIAL_STATE: DashboardData = {
    sentiment: { positive: 0, neutral: 0, negative: 0 },
    keywords: [],
    summary: "Loading your reading personality report...",
    genreDistribution: [],
    monthlyReads: [],
    topAuthors: [],
    mostReviewedBooks: [],
    readingPaceDays: 0,
};

async function fetchAggregateStats(): Promise<AggregateStats> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
        genreDistribution: [
            { name: "Fiction", percent: 90 },
            { name: "Non-Fic.", percent: 50 },
            { name: "Mystery", percent: 75 },
            { name: "Sci-Fi", percent: 60 },
            { name: "Biography", percent: 30 },
        ],
        monthlyReads: [5, 2, 7, 3, 9, 6, 4],
        topAuthors: [
            { name: "Author A", count: 12 },
            { name: "Author B", count: 9 },
            { name: "Author C", count: 7 },
            { name: "Author D", count: 5 },
            { name: "Author E", count: 4 },
        ],
        mostReviewedBooks: ["The Midnight Library", "Project Hail Mary", "Klara and the Sun"],
        readingPaceDays: 12,
    };
}


export default function AIAnalyticsPage() {
    const [data, setData] = useState<DashboardData>(INITIAL_STATE);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);
    const { isSignedIn, isLoaded } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            if (!isLoaded) return;

            if (!isSignedIn) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const aiRes = await fetch(`/api/ai-analytics`, {
                    cache: 'no-store'
                });
                const aiData: AIAnalyticsResponse = await aiRes.json();
                console.log("AI Data Received:", aiData);

                if (aiRes.status !== 200 || aiData.error) {
                    throw new Error(aiData.error || "Failed to load AI data.");
                }

                const statsData = await fetchAggregateStats();
                console.log("Stats Data Received:", statsData);

                setData({ ...aiData, ...statsData });

            } catch (err) {
                console.error("Dashboard Fetch Error:", err);
                const message = err instanceof Error ? err.message : "Failed to load dashboard data."
                setError(message);
                setData(INITIAL_STATE);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isLoaded, isSignedIn]);

    console.log("Render State:", { loading, error, dataSummary: data?.summary, keywords: data?.keywords?.length });

    const WordCloud = useCallback(({ keywords }: { keywords: WordCloudTerm[] }) => {
        if (keywords.length === 0) {
            return <div className="text-center text-gray-500 italic py-10">Waiting for review data...</div>;
        }

        const sizeMap: Record<number, string> = {
            10: "text-3xl font-bold",
            9: "text-2xl font-bold",
            8: "text-xl font-semibold",
            7: "text-lg font-medium",
            6: "text-base font-medium",
            5: "text-base",
            4: "text-sm",
            3: "text-xs",
            2: "text-xs",
            1: "text-xs",
        };

        const colorMap: Record<"positive" | "negative" | "neutral", string> = {
            positive: "text-green-600",
            negative: "text-red-600",
            neutral: "text-gray-500",
        };

        const shuffledKeywords = keywords.sort(() => 0.5 - Math.random());

        return (
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="text-center space-x-2 space-y-1 max-w-lg">
                    {shuffledKeywords.map((term, index) => (
                        <span
                            key={index}
                            className={`${sizeMap[Math.round(term.weight)] || sizeMap[5]} ${colorMap[term.sentiment] || colorMap.neutral} transition-all duration-300 inline-block`}
                        >
                            {term.word}
                        </span>
                    ))}
                </div>
            </div>
        );
    }, []);

    const SentimentBar = useMemo(() => {
        const { positive, neutral, negative } = data.sentiment;
        const total = positive + neutral + negative;

        if (total === 0) return null;

        return (
            <div className="flex-grow flex items-center justify-center">
                <div className="w-full h-64 flex items-end justify-center">
                    <div className="flex flex-col items-center gap-2 w-1/4">
                        <div className="w-full bg-gray-200 rounded-t-lg h-32 flex flex-col justify-end overflow-hidden">
                            {/* Negative */}
                            <div className="bg-red-500" style={{ height: `${negative}%` }}></div>
                            {/* Neutral */}
                            <div className="bg-yellow-500" style={{ height: `${neutral}%` }}></div>
                            {/* Positive */}
                            <div className="bg-green-500 rounded-t-lg" style={{ height: `${positive}%` }}></div>
                        </div>
                        <span className="text-xs font-medium text-gray-600">Overall</span>
                        <div className="text-center text-xs mt-2">
                            <p className="text-green-600 font-bold">{positive}% Positive</p>
                            <p className="text-red-600">{negative}% Negative</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }, [data.sentiment]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Loader2 className="animate-spin h-10 w-10 text-[#19a1e6] mb-4" />
                <p className="text-gray-600">Analyzing your literary soul...</p>
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-gray-600">Please log in to view your AI analytics.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-xl m-8 max-w-lg mx-auto shadow-lg">
                <h3 className="font-semibold mb-2 text-xl">Error Loading AI Insights</h3>
                <p className="text-sm">{error}</p>
                <p className="mt-4 text-xs">If your review count is low, try adding a few more reviews first.</p>
            </div>
        );
    }



    return (
        <div className="flex flex-col min-h-screen">

            {/* Main Content */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">AI Analytics Dashboard</h2>
                    <p className="mt-2 text-lg text-gray-600">
                        Dive deep into your reading habits and community trends with AI-powered insights.
                    </p>
                </div>

                {/* Personal Reading Insights */}
                <div className="mb-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Personal Reading Insights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

                        {/* Genre Distribution (Dynamic) */}
                        <div className="bg-gray-50 rounded-lg p-6 flex flex-col h-80">
                            <h4 className="font-semibold text-gray-900 mb-4">Genre Distribution</h4>
                            <div className="flex-grow flex items-center justify-center">
                                <div className="w-full h-64 flex items-end justify-center gap-x-6">
                                    {data.genreDistribution.map((genre, index) => (
                                        <div key={index} className="flex flex-col items-center gap-2 w-1/5">
                                            <div
                                                className="w-full bg-[#19a1e6]/20 rounded-t-lg transition-all duration-700"
                                                style={{ height: `${genre.percent}%` }}
                                            ></div>
                                            <span className="text-xs font-medium text-gray-600">{genre.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Reading Timeline (Simplified Mock) */}
                        <div className="bg-gray-50 rounded-lg p-6 flex flex-col h-80">
                            <h4 className="font-semibold text-gray-900 mb-4">Reading Timeline (Books Read)</h4>
                            <div className="flex-grow flex flex-col justify-end">
                                {/* Simplified Line graph representation */}
                                <div className="h-40 w-full relative">
                                    <div className="absolute inset-0 flex items-end">
                                        {data.monthlyReads.map((count, index) => (
                                            <div
                                                key={index}
                                                className="bg-[#19a1e6] mx-1 transition-all duration-700"
                                                style={{
                                                    height: `${(count / Math.max(...data.monthlyReads, 1)) * 100}%`, // Normalize to max height
                                                    width: `${100 / data.monthlyReads.length}%`,
                                                    borderRadius: '4px 4px 0 0'
                                                }}
                                            ></div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-between mt-2 text-xs font-medium text-gray-600 border-t border-gray-300 pt-1">
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].slice(0, data.monthlyReads.length).map((month) => (
                                        <span key={month}>{month}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Top Authors (Dynamic) */}
                        <div className="bg-gray-50 rounded-lg p-6 flex flex-col h-80">
                            <h4 className="font-semibold text-gray-900 mb-4">Top Authors</h4>
                            <div className="flex-grow space-y-4 pt-2">
                                {data.topAuthors.map((author, index) => {
                                    const maxCount = Math.max(...data.topAuthors.map(a => a.count), 1);
                                    const widthPercent = (author.count / maxCount) * 100;
                                    return (
                                        <div key={index} className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3">
                                            <span className="text-sm font-medium text-gray-600">{author.name}</span>
                                            <div className="h-2 bg-[#19a1e6]/20 rounded-full">
                                                <div className="h-2 bg-[#19a1e6] rounded-full transition-all duration-700" style={{ width: `${widthPercent}%` }}></div>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{author.count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Review Sentiment (Dynamic - AI Powered) */}
                        <div className="bg-gray-50 rounded-lg p-6 flex flex-col h-80">
                            <h4 className="font-semibold text-gray-900 mb-4">Review Sentiment (AI Powered)</h4>
                            {SentimentBar}
                        </div>
                    </div>
                </div>

                {/* Book & Review Analytics */}
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Book & Review Analytics</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Most Reviewed Books (Dynamic) */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h4 className="font-semibold text-gray-900 mb-4">Most Reviewed Books (Community)</h4>
                                <div className="space-y-3">
                                    {data.mostReviewedBooks.map((title, index) => (
                                        <p key={index} className="text-sm">
                                            <span className="font-bold text-gray-900 mr-2">{index + 1}.</span> {title}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/* AI Summarized Insights (Dynamic - AI Powered) */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h4 className="font-semibold text-gray-900 mb-4">AI Reading Personality Report</h4>
                                <p className="text-sm text-gray-800 leading-relaxed italic">
                                    {data.summary}
                                </p>
                            </div>

                            {/* Reading Pace (Dynamic) */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h4 className="font-semibold text-gray-900 mb-4">Reading Pace</h4>
                                <p className="text-sm">
                                    On average, you finish a book every <span className="font-bold text-[#19a1e6]">{data.readingPaceDays} days</span>.
                                </p>
                            </div>
                        </div>

                        {/* Review Word Cloud (Dynamic - AI Powered) */}
                        <div className="lg:col-span-2 bg-gray-50 rounded-lg p-6 flex flex-col h-80">
                            <h4 className="font-semibold text-gray-900 mb-4">Review Word Cloud (AI Powered)</h4>
                            <WordCloud keywords={data.keywords} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

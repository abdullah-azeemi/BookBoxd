"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";

interface Book {
  title: string;
  author: string;
  cover?: string;
  description?: string;
}

export default function AIRecommenderPage() {
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isSignedIn, isLoaded } = useAuth();

  async function handleAIRecommend() {
    try {
      if (!isSignedIn) {
        alert("Please log in to use this feature.");
        return;
      }
      setLoading(true);
      setRecommendedBooks([]);

      const res = await fetch("/api/ai-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await res.json();

      if (data.error) {
        alert(`Error from server: ${data.error}`);
        console.error("Server error:", data.details);
        setRecommendedBooks([]);
        return;
      }

      const booksToDisplay: Book[] = data?.booksWithDetails || [];
      setRecommendedBooks(booksToDisplay);

    } catch (err) {
      console.error("AI recommend error:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900">
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Recommended For You
            </h1>

            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Describe the type of book you want..."
              className="mt-4 px-4 py-2 w-full bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700"
            />

            <button
              onClick={handleAIRecommend}
              disabled={loading || !isLoaded}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Loading..." : !isSignedIn ? "Log in to Recommend" : "AI Recommend "}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 xl:gap-x-6">

            {loading && recommendedBooks.length === 0 ? (
              Array(10) // Show 10 placeholders if nothing loaded yet
                .fill(null)
                .map((_, idx) => (
                  <div key={idx} className="group book-card">
                    <div className="w-full overflow-hidden rounded-lg aspect-[2/3] bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    <div className="mt-3">
                      <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                        Loading...
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Loading...
                      </p>
                    </div>
                  </div>
                ))
            ) : recommendedBooks.length > 0 ? (
              recommendedBooks.map((book) => (
                <div key={book.title} className="group book-card">
                  <div className="w-full overflow-hidden rounded-lg aspect-[2/3] bg-slate-200 dark:bg-slate-800">
                    {book.cover && book.cover !== "/placeholder.svg" ? (
                      <Image
                        src={book.cover}
                        alt={`Cover for ${book.title}`}
                        width={240}
                        height={360}
                        className="w-full h-full object-cover group-hover:opacity-75"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-2 text-center">
                        <span className="text-center text-slate-700 dark:text-slate-300 px-2 text-sm">
                          {book.title}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {book.title}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {book.author}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              !loading && <p className="text-slate-500 dark:text-slate-400">No recommendations found. Try a different query!</p>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
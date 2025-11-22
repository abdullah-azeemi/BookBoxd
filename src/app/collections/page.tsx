"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Book } from "@prisma/client"; 
interface UserBookWithBook {
  id: string;
  status: string;
  userId: string;
  bookId: string;
  book: Book;
}

export default function CollectionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  type SearchResult = {
    id: string;
    title: string;
    authors?: string[];
    description?: string;
    publishedDate?: string;
    categories?: string[];
    coverUrl?: string | null;
  };
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [readBooks, setReadBooks] = useState<UserBookWithBook[]>([]);
  const [currentlyReading, setCurrentlyReading] = useState<UserBookWithBook[]>([]);
  const [wantToRead, setWantToRead] = useState<UserBookWithBook[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(true);

  useEffect(() => {
    const fetchLibrary = async () => {
      setLibraryLoading(true);
      try {
        const res = await fetch("/api/user-books");
        const data = await res.json();
        
        if (data.userBooks) {
          setReadBooks(data.userBooks.filter((ub: UserBookWithBook) => ub.status === 'read'));
          setCurrentlyReading(data.userBooks.filter((ub: UserBookWithBook) => ub.status === 'reading'));
          setWantToRead(data.userBooks.filter((ub: UserBookWithBook) => ub.status === 'want-to-read'));
        }
      } catch (error) {
        console.error("Error fetching library:", error);
      } finally {
        setLibraryLoading(false);
      }
    };
    fetchLibrary();
  }, []);

  const fetchBooks = async (query: string) => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/books?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data.books || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleSearch = (e: CustomEvent<string>) => {
      const q = e.detail.trim();
      setSearchQuery(q);
      if (q) fetchBooks(q);
      else setSearchResults([]);
    };

    window.addEventListener("bookSearch", handleSearch as EventListener);
    return () => window.removeEventListener("bookSearch", handleSearch as EventListener);
  }, []);
  
  const renderBookList = (books: UserBookWithBook[]) => (
    <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
      {books.slice(0, 8).map((userBook) => (
        <Link
          key={userBook.id}
          href={`/book/${userBook.book.externalId}`} 
          className="flex-shrink-0 w-40 space-y-2 cursor-pointer hover:scale-105 transition-transform"
        >
          <div>
            <Image
              alt={userBook.book.title}
              src={userBook.book.coverUrl || "/placeholder.svg"}
              width={160}
              height={240}
              className="w-full aspect-[2/3] object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            />
            <h3 className="font-semibold truncate text-sm mt-1">{userBook.book.title}</h3>
            {userBook.book.author && (
              <p className="text-xs text-slate-500">{userBook.book.author}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">My Library</h1>

        {libraryLoading ? (
          <p>Loading your library...</p>
        ) : (
          <>
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Read</h2>
              {readBooks.length > 0 ? renderBookList(readBooks) : <p className="text-slate-500">No books in this list yet.</p>}
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Currently Reading</h2>
              {currentlyReading.length > 0 ? renderBookList(currentlyReading) : <p className="text-slate-500">No books in this list yet.</p>}
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Want to Read</h2>
              {wantToRead.length > 0 ? renderBookList(wantToRead) : <p className="text-slate-500">No books in this list yet.</p>}
            </section>
          </>
        )}

        {searchQuery.trim() && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Search Results</h2>
            {loading ? (
              <p>Loading...</p>
            ) : searchResults.length > 0 ? (
              <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
                {searchResults.slice(0, 8).map((book) => (
                  <Link
                    key={book.id}
                    href={book.id ? `/book/${book.id}` : "#"}
                    className="flex-shrink-0 w-40 space-y-2 cursor-pointer hover:scale-105 transition-transform"
                  >
                    <div>
                      <Image
                        alt={book.title}
                        src={book.coverUrl || "/placeholder.svg"}
                        width={160}
                        height={240}
                        className="w-full aspect-[2/3] object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                      />
                      <h3 className="font-semibold truncate text-sm mt-1">{book.title}</h3>
                      {Array.isArray(book.authors) && book.authors.length > 0 && (
                        <p className="text-xs text-slate-500">{book.authors.join(", ")}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p>No books found</p>
            )}
          </section>
        )}

        <section>
          <h2 className="text-2xl font-bold mb-4">Auto-generated Reading Lists</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-blue-50 dark:bg-blue-950/20 hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 flex items-center space-x-6">
                <div className="flex-grow">
                  <h3 className="font-bold text-lg">Top Picks for You</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Based on your reading history and preferences
                  </p>
                </div>
                <Image
                  alt="Top Picks"
                  src="/top-picks-books-collection.jpg"
                  width={128}
                  height={80}
                  className="w-32 h-20 object-cover rounded-lg"
                />
              </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-950/20 hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 flex items-center space-x-6">
                <div className="flex-grow">
                  <h3 className="font-bold text-lg">New Releases in Your Favorite Genres</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Stay up-to-date with the latest books
                  </p>
                </div>
                <Image
                  alt="New Releases"
                  src="/new-releases-books-collection.jpg"
                  width={128}
                  height={80}
                  className="w-32 h-20 object-cover rounded-lg"
                />
              </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-950/20 hover:shadow-xl transition-shadow duration-300 lg:col-span-2">
              <CardContent className="p-6 flex items-center space-x-6">
                <div className="flex-grow">
                  <h3 className="font-bold text-lg">Hidden Gems</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Discover lesser-known books that match your taste
                  </p>
                </div>
                <Image
                  alt="Hidden Gems"
                  src="/placeholder.svg?height=80&width=128"
                  width={128}
                  height={80}
                  className="w-32 h-20 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
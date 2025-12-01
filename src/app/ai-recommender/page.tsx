"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Send, Loader2, BookOpen, MessageSquare, Grid3x3 } from "lucide-react";

type ViewMode = 'chat' | 'list';

interface Book {
  id: string;
  title: string;
  author: string;
  cover?: string;
  description?: string;
}

interface ChatMessage {
  id: number;
  type: 'user' | 'ai' | 'books';
  text: string;
  books?: Book[];
  isLoading?: boolean;
}


const initialMessages: ChatMessage[] = [
  {
    id: 1,
    type: 'ai',
    text: "Hello! I'm your AI Book Finder. I can help you discover books in two ways:\n\n📚 Ask for specific numbers: \"3 books on ancient Rome\" or \"five classic sci-fi books\"\n✨ Describe what you want: \"cozy mystery books\" or \"books like The Alchemist\"\n\nWhat kind of book are you in the mood for?"
  }
];

const quickSuggestions = [
  "3 books on ancient Rome",
  "cozy mystery books for winter",
  "five classic science fiction books",
  "books similar to Harry Potter"
];


const BookCard = ({ book }: { book: Book }) => (
  <Link
    href={book.id ? `/book/${book.id}` : '#'}
    className="block bg-white dark:bg-slate-700 shadow-xl border border-blue-200 dark:border-blue-900 rounded-xl p-4 transition-all duration-200 hover:shadow-2xl hover:scale-[1.02] cursor-pointer"
  >
    <div className="flex gap-4">
      {/* Book Cover */}
      <div className="flex-shrink-0 w-20 h-30 relative">
        {book.cover ? (
          <Image
            src={book.cover}
            alt={`Cover for ${book.title}`}
            width={80}
            height={120}
            className="object-cover rounded shadow-md border-2 border-slate-200 dark:border-slate-500"
            unoptimized
          />
        ) : (
          <div className="w-20 h-30 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-slate-600 dark:to-slate-700 rounded shadow-md border-2 border-slate-200 dark:border-slate-500 flex items-center justify-center p-2">
            <BookOpen className="h-8 w-8 text-blue-500 dark:text-blue-300" />
          </div>
        )}
      </div>

      {/* Title and Author */}
      <div className="flex-grow min-w-0">
        <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-1 leading-tight line-clamp-2 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
          {book.title}
        </h2>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
          By {book.author}
        </p>

        {/* Description */}
        {book.description && (
          <div className="border-t border-blue-100 dark:border-slate-600 pt-2 mt-2">
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
              {book.description}
            </p>
          </div>
        )}
      </div>
    </div>
  </Link>
);


const GridBookCard = ({ book }: { book: Book }) => (
  <Link
    href={book.id ? `/book/${book.id}` : '#'}
    className="group block"
  >
    <div className="w-full overflow-hidden rounded-lg aspect-[2/3] bg-slate-200 dark:bg-slate-800">
      {book.cover ? (
        <Image
          src={book.cover}
          alt={`Cover for ${book.title}`}
          width={240}
          height={360}
          className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
          unoptimized
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 dark:from-slate-600 dark:to-slate-700">
          <BookOpen className="h-16 w-16 text-blue-500 dark:text-blue-300" />
        </div>
      )}
    </div>
    <div className="mt-3">
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {book.title}
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
        {book.author}
      </p>
    </div>
  </Link>
);

export default function AIBookFinderPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [userInput, setUserInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [listBooks, setListBooks] = useState<Book[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isSignedIn, isLoaded } = useAuth();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current && viewMode === 'chat') {
      const container = chatContainerRef.current;
      const isNearBottom = container.scrollHeight - container.scrollTop < container.clientHeight + 100;
      if (isNearBottom) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages, viewMode]);

  const handleListSearch = async () => {
    if (!searchQuery.trim() || listLoading) return;

    if (!isSignedIn) {
      alert("Please log in to use AI Book Finder.");
      return;
    }

    setListLoading(true);
    setListBooks([]);

    try {
      const res = await fetch("/api/ai-book-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await res.json();

      if (data.error) {
        alert(`Error: ${data.error}`);
        return;
      }

      if (data.books && data.books.length > 0) {
        setListBooks(data.books);
      } else {
        alert("No books found. Try a different search!");
      }
    } catch (err) {
      console.error("List search error:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setListLoading(false);
    }
  };

  const handleSendMessage = useCallback(async (input: string) => {
    const query = input.trim();
    if (!query || isSending) return;

    if (!isSignedIn) {
      alert("Please log in to use AI Book Finder.");
      return;
    }

    const newUserMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      text: query
    };
    const newLoadingMessage: ChatMessage = {
      id: Date.now() + 1,
      type: 'ai',
      text: 'Searching for books...',
      isLoading: true
    };

    setMessages(prev => [...prev, newUserMessage, newLoadingMessage]);
    setUserInput('');
    setIsSending(true);

    try {
      const res = await fetch("/api/ai-book-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === newLoadingMessage.id
              ? {
                id: msg.id,
                type: 'ai' as const,
                text: `Sorry, I encountered an error: ${data.error}`,
                isLoading: false
              }
              : msg
          )
        );
        return;
      }

      if (data.books && data.books.length > 0) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === newLoadingMessage.id
              ? {
                id: msg.id,
                type: 'books' as const,
                text: data.message || 'Here are your book recommendations:',
                books: data.books,
                isLoading: false
              }
              : msg
          )
        );
      } else {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === newLoadingMessage.id
              ? {
                id: msg.id,
                type: 'ai' as const,
                text: data.message || "I couldn't find any books matching your request. Try a different search!",
                isLoading: false
              }
              : msg
          )
        );
      }

    } catch (err) {
      console.error("AI Book Finder error:", err);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newLoadingMessage.id
            ? {
              id: msg.id,
              type: 'ai' as const,
              text: 'An unexpected error occurred. Please try again.',
              isLoading: false
            }
            : msg
        )
      );
    } finally {
      setIsSending(false);
    }
  }, [isSending, isSignedIn]);

  const handleQuickSuggestion = (text: string) => {
    handleSendMessage(text);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
      <main className="flex-grow p-4 sm:p-8">
        <div className="mx-auto max-w-7xl">

          {/* Header with View Mode Toggle */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  AI Book Finder
                </h1>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-full p-1 shadow-lg border-2 border-blue-200 dark:border-blue-700">
                <button
                  onClick={() => setViewMode('chat')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${viewMode === 'chat'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm font-semibold">Chat</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${viewMode === 'list'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                >
                  <Grid3x3 className="h-4 w-4" />
                  <span className="text-sm font-semibold">List</span>
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Powered by OpenLibrary & Gemini AI
            </p>
          </div>

          {/* CHAT MODE */}
          {viewMode === 'chat' && (
            <div className="w-full max-w-4xl mx-auto flex flex-col h-[calc(100vh-200px)] bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl border-2 border-blue-400 dark:border-blue-700 shadow-2xl p-6 sm:p-8">

              {/* Chat Messages Container */}
              <div
                ref={chatContainerRef}
                className="flex-grow overflow-y-auto mb-6 space-y-6 p-2 custom-scrollbar"
              >
                {/* Custom Scrollbar Styling */}
                <style>{`
                  .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                  .custom-scrollbar::-webkit-scrollbar-thumb { 
                    background: linear-gradient(to bottom, #93c5fd, #3b82f6);
                    border-radius: 10px; 
                  }
                  .custom-scrollbar::-webkit-scrollbar-track { 
                    background-color: #f1f5f9; 
                    border-radius: 10px; 
                  }
                  .dark .custom-scrollbar::-webkit-scrollbar-thumb { 
                    background: linear-gradient(to bottom, #3b82f6, #1e40af);
                  }
                  .dark .custom-scrollbar::-webkit-scrollbar-track { 
                    background-color: #1e293b; 
                  }
                `}</style>

                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>

                    {/* Books Display */}
                    {message.type === 'books' && message.books && message.books.length > 0 ? (
                      <div className="w-full flex justify-start">
                        <div className="flex flex-col items-start gap-4 max-w-full">
                          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                            {message.text}
                          </p>
                          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                            {message.books.map((book, index) => (
                              <BookCard key={index} book={book} />
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Standard Text Message */
                      <div className={`flex gap-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                        {/* Avatar */}
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full ${message.type !== 'user'
                          ? 'bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg'
                          : 'bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center shadow-lg'
                          }`}>
                          {message.type !== 'user' && (
                            <Sparkles className="h-5 w-5 text-white" />
                          )}
                        </div>

                        {/* Message Bubble */}
                        <div className={`
                          max-w-full whitespace-pre-wrap
                          ${message.type === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl rounded-tr-md'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-3xl rounded-tl-md'} 
                          px-5 py-3 shadow-lg transition-all duration-200
                        `}>
                          <p className="text-sm flex items-center gap-2">
                            {message.text}
                            {message.isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Quick Suggestions (Only show initially) */}
                {messages.length === 1 && (
                  <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">
                      💡 Try these:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {quickSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickSuggestion(suggestion)}
                          className="text-sm px-4 py-2 rounded-full border-2 border-blue-500 text-blue-600 bg-white hover:bg-blue-50 dark:bg-slate-700 dark:text-blue-400 dark:hover:bg-slate-600 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="relative border-t border-slate-200 dark:border-slate-700 pt-4">
                <input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => !isSending && e.key === 'Enter' && handleSendMessage(userInput)}
                  placeholder={
                    !isLoaded
                      ? "Loading..."
                      : !isSignedIn
                        ? "Please log in to use AI Book Finder"
                        : isSending
                          ? "Searching..."
                          : "Ask for books (e.g., '3 books on history' or 'cozy mysteries')..."
                  }
                  disabled={isSending || !isLoaded || !isSignedIn}
                  className="w-full pr-14 pl-5 py-4 rounded-full border-2 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed text-slate-900 dark:text-white shadow-inner placeholder:text-slate-400"
                />
                <button
                  onClick={() => handleSendMessage(userInput)}
                  disabled={!userInput.trim() || isSending || !isLoaded || !isSignedIn}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 rounded-full transition-all duration-200 disabled:from-slate-300 disabled:to-slate-400 dark:disabled:from-slate-600 dark:disabled:to-slate-700 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          {/* LIST MODE */}
          {viewMode === 'list' && (
            <div className="w-full">
              {/* Search Bar for List Mode */}
              <div className="mb-8 max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => !listLoading && e.key === 'Enter' && handleListSearch()}
                    placeholder={
                      !isLoaded
                        ? "Loading..."
                        : !isSignedIn
                          ? "Please log in to search"
                          : "Describe the type of book you want..."
                    }
                    disabled={listLoading || !isLoaded || !isSignedIn}
                    className="w-full pr-14 pl-5 py-4 rounded-full border-2 border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed text-slate-900 dark:text-white shadow-lg placeholder:text-slate-400"
                  />
                  <button
                    onClick={handleListSearch}
                    disabled={!searchQuery.trim() || listLoading || !isLoaded || !isSignedIn}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 rounded-full transition-all duration-200 disabled:from-slate-300 disabled:to-slate-400 dark:disabled:from-slate-600 dark:disabled:to-slate-700 shadow-lg hover:shadow-xl disabled:cursor-not-allowed font-semibold flex items-center gap-2"
                  >
                    {listLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Searching...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span className="text-sm">Find Books</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Books Grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 xl:gap-x-6">
                {listLoading && listBooks.length === 0 ? (
                  // Loading placeholders
                  Array(12)
                    .fill(null)
                    .map((_, idx) => (
                      <div key={idx} className="animate-pulse">
                        <div className="w-full aspect-[2/3] bg-slate-200 dark:bg-slate-700 rounded-lg" />
                        <div className="mt-3 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
                        <div className="mt-2 h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                      </div>
                    ))
                ) : listBooks.length > 0 ? (
                  listBooks.map((book, index) => (
                    <GridBookCard key={index} book={book} />
                  ))
                ) : (
                  !listLoading && (
                    <div className="col-span-full text-center py-16">
                      <BookOpen className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-500 dark:text-slate-400">
                        {!isSignedIn
                          ? "Please log in to search for books"
                          : "Start searching for books above!"}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
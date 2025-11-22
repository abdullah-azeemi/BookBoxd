'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { BookOpen, Send, Loader2, Search } from 'lucide-react'

interface RecommendationData {
    bookTitle: string;
    author: string;
    details: string; 
    coverUrl: string;
}

interface ChatMessage {
    id: number;
    type: 'user' | 'ai' | 'recommendation';
    text: string;
    data?: RecommendationData[];
    isLoading?: boolean;
}

const initialMessages: ChatMessage[] = [
    {
        id: 1,
        type: 'ai',
        text: "Hello! I'm BookBoxd, your Structured Book Search Assistant. Try asking for a specific number of books, like 'Suggest me 3 books on ancient Rome'."
    }
];

const openLibraryApiUrl = 'https://openlibrary.org/search.json?q=';
const MAX_RECOMMENDATIONS = 5;
const MAX_SYNOPSIS_WORDS = 200; 

const RecommendationCard = ({ data }: { data: RecommendationData }) => (
    <div className="bg-white dark:bg-slate-700 shadow-xl border border-blue-200 dark:border-blue-900 rounded-xl p-4 w-full max-w-md transition-all duration-200 hover:shadow-2xl">
        <div className="flex gap-4">
            {/* Book Cover */}
            <Image
                src={data.coverUrl || 'https://placehold.co/80x120/E0E7FF/000000?text=No+Cover'}
                alt={`Cover for ${data.bookTitle}`}
                width={80}
                height={120}
                className="flex-shrink-0 object-cover rounded shadow-md border-2 border-slate-200 dark:border-slate-500"
                unoptimized
            />
            
            {/* Title and Author */}
            <div className='flex-grow min-w-0'>
                <h2 className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mb-0.5 leading-tight truncate">{data.bookTitle}</h2>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">By {data.author}</p>
            </div>
        </div>

        {/* Synopsis/Details Area */}
        <div className="border-t border-blue-100 dark:border-slate-600 pt-3 mt-3">
            <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase">Synopsis / Details:</h5>
            <p className="text-sm italic text-slate-600 dark:text-slate-300">
                {data.details}
            </p>
        </div>
    </div>
);

// --- Main Chat Component ---

export default function AdvancedSearchPage() {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [userInput, setUserInput] = useState('');
    const [isSending, setIsSending] = useState(false);

    const truncateWords = useCallback((text: string, maxWords: number): string => {
        if (!text) return '';
        const words = text.split(/\s+/).filter(w => w.length > 0); // Split and filter empty strings
        if (words.length <= maxWords) {
            return text;
        }
        return words.slice(0, maxWords).join(' ') + '...';
    }, []);

    const extractRequestedQuantity = useCallback((query: string): number => {
        const numMatch = query.match(/(\d+)\s+books?/i);
        if (numMatch) {
            return Math.min(parseInt(numMatch[1], 10), MAX_RECOMMENDATIONS);
        }
        
        const wordMatch = query.match(/(one|two|three|four|five)\s+books?/i);
        if (wordMatch) {
            const numMap: { [key: string]: number } = { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5 };
            return numMap[wordMatch[1].toLowerCase()] || 1;
        }
        
        return 1; 
    }, []);
    const fetchBookData = useCallback(async (query: string, requestedLimit: number): Promise<Omit<ChatMessage, 'id' | 'isLoading'>> => {
        
        const url = `${openLibraryApiUrl}${encodeURIComponent(query)}&limit=${MAX_RECOMMENDATIONS}&fields=key,title,author_name,first_publish_year,cover_i,first_sentence,subject`;
        
        const MAX_RETRIES = 3;
        let response: Response | null = null;

        for (let i = 0; i < MAX_RETRIES; i++) {
            try {
                response = await fetch(url);
                if (response.ok) break;
                if (i < MAX_RETRIES - 1) {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
                } else {
                    throw new Error(`Failed to fetch book data after ${MAX_RETRIES} retries.`);
                }
            } catch (e) {
                if (i < MAX_RETRIES - 1) {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
                } else {
                    const message = e instanceof Error ? e.message : 'Unknown error'
                    throw new Error(`Network error or data fetch failed: ${message}`);
                }
            }
        }
        
        if (!response || !response.ok) {
             throw new Error(`Failed to fetch book data. Status: ${response ? response.status : 'unknown'}`);
        }
        
        const result = await response.json();
        
        if (result.docs && result.docs.length > 0) {
            
            type OpenLibraryDoc = {
                cover_i?: number;
                author_name?: string[] | string;
                title?: string;
                first_sentence?: string[];
                subject?: string[];
                first_publish_year?: number;
            };
            const rawRecommendations: RecommendationData[] = result.docs
                .map((doc: OpenLibraryDoc): RecommendationData => {
                    const coverId = doc.cover_i;
                    const coverUrl = coverId 
                        ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` 
                        : 'https://placehold.co/80x120/E0E7FF/000000?text=No+Cover';

                    const authors = Array.isArray(doc.author_name) ? doc.author_name.join(', ') : doc.author_name;
                    
                    let details = '';
                    if (doc.first_sentence && doc.first_sentence.length > 0) {
                         details = doc.first_sentence[0]; 
                    } else if (doc.subject && doc.subject.length > 0) {
                         details = `Keywords: ${doc.subject.slice(0, 5).join(', ')}.`;
                    } else {
                         details = doc.first_publish_year 
                            ? `First published in ${doc.first_publish_year}.` 
                            : 'No additional details available from the search result.';
                    }
                    
                    details = truncateWords(details, MAX_SYNOPSIS_WORDS);

                    return {
                        bookTitle: doc.title || 'Unknown Title',
                        author: authors || 'Unknown Author',
                        details: details,
                        coverUrl: coverUrl
                    };
                });
            
            const recommendations = rawRecommendations.slice(0, requestedLimit);
            
            const count = recommendations.length;
            
            let text;
            if (count === requestedLimit) {
                 text = count === 1 
                    ? `Here is the best match for "${query}":`
                    : `Here are the ${count} books you requested for "${query}":`;
            } else if (count > 0 && count < requestedLimit) {
                text = `I could only find ${count} matches for "${query}" (you requested ${requestedLimit}):`;
            } else {
                 text = `I couldn't find any books matching "${query}".`;
            }

            return {
                type: 'recommendation' as const,
                text: text,
                data: recommendations,
            };
        } else {
            return {
                type: 'ai' as const,
                text: `I couldn't find any books matching "${query}". Try searching by a specific title, author, or a different keyword!`,
            };
        }
        
    }, [truncateWords]); 

    const handleSendMessage = async (input: string) => {
        const query = input.trim();
        if (!query || isSending) return;

        const requestedLimit = extractRequestedQuantity(query);
        const newUserMessage: ChatMessage = { id: messages.length + 1, type: 'user', text: query };
        const newLoadingMessageId = messages.length + 2;
        const newLoadingMessage: ChatMessage = { 
            id: newLoadingMessageId, 
            type: 'ai', 
            text: `Searching Open Library for ${requestedLimit} books matching "${query}"...`, 
            isLoading: true 
        };
        
        setMessages(prev => [...prev, newUserMessage, newLoadingMessage]);
        setUserInput('');
        setIsSending(true);

        try {
            const bookResponse = await fetchBookData(query, requestedLimit);
            setMessages(prev => {
                const newMessages = prev.map(msg => 
                    msg.id === newLoadingMessageId 
                        ? { ...bookResponse, id: newLoadingMessageId, isLoading: false } 
                        : msg
                );
                return newMessages;
            });

        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unexpected error occurred.'
            console.error("API Error:", error);
            setMessages(prev => {
                const newMessages = prev.map(msg => 
                    msg.id === newLoadingMessageId 
                        ? {
                            id: newLoadingMessageId,
                            type: 'ai' as const,
                            text: `Search failed: ${message}`,
                            isLoading: false
                        }
                        : msg
                );
                return newMessages;
            });
        } finally {
            setIsSending(false);
        }
    }

    const handleQuickReply = (text: string) => {
        handleSendMessage(text);
    }

    const chatContainerRef = useCallback((node: HTMLDivElement | null) => {
        if (node) {
            const isNearBottom = node.scrollHeight - node.scrollTop < node.clientHeight + 100;
            if (isNearBottom) {
                 node.scrollTop = node.scrollHeight;
            }
        }
    }, []);


    return (
        <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
            <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-3xl flex flex-col h-[calc(100vh-64px)] sm:h-[calc(100vh-120px)] bg-white dark:bg-slate-800 rounded-2xl border-2 border-blue-400 dark:border-blue-700 shadow-2xl p-6 sm:p-8">
                    
                    {/* Header */}
                    <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-700 mb-6">
                        <Search className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">BookBoxd: Structured Book Search</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Powered by the Open Library API.</p>
                    </div>

                    {/* Chat Messages Container */}
                    <div ref={chatContainerRef} className="flex-grow overflow-y-auto mb-6 space-y-6 p-2 custom-scrollbar">
                        {/* Custom Scrollbar Styling */}
                        <style>{`
                            .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                            .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #93c5fd; border-radius: 10px; }
                            .custom-scrollbar::-webkit-scrollbar-track { background-color: #f1f5f9; border-radius: 10px; }
                            .dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #3b82f6; }
                            .dark .custom-scrollbar::-webkit-scrollbar-track { background-color: #1e293b; }
                        `}</style>

                        {messages.map((message) => (
                            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                
                                {/* Structured Recommendation Cards (Handles 1 to 5 cards) */}
                                {message.type === 'recommendation' && message.data && message.data.length > 0 ? (
                                    <div className="w-full flex justify-start">
                                        <div className="flex flex-col items-start gap-4 max-w-full">
                                            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{message.text}</p>
                                            {message.data.map((book, index) => (
                                                <div key={index} className="w-full">
                                                    <RecommendationCard data={book} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    /* Standard Text Message */
                                    <div className={`flex gap-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        
                                        {/* Avatar */}
                                        <div className={`flex-shrink-0 h-8 w-8 rounded-full ${message.type !== 'user' ? 'bg-blue-100 dark:bg-blue-900 flex items-center justify-center shadow-md' : 'bg-slate-300 dark:bg-slate-600'}`}>
                                            {message.type !== 'user' && (
                                                <BookOpen className="h-5 w-5 text-blue-500" />
                                            )}
                                        </div>
                                        
                                        {/* Message Bubble */}
                                        <div className={`
                                            max-w-full 
                                            ${message.type === 'user' 
                                                ? 'bg-blue-600 text-white rounded-3xl rounded-tr-md' 
                                                : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-3xl rounded-tl-md'} 
                                            px-4 py-3 shadow-lg transition-colors duration-200
                                        `}>
                                            <p className="text-sm flex items-center gap-2">
                                                {message.text}
                                                {message.isLoading && <Loader2 className="h-4 w-4 animate-spin text-white dark:text-blue-400" />}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Quick Reply Options (Initial only) */}
                        {messages.length === 1 && (
                            <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">Quick Searches:</p>
                                <div className="space-x-2 space-y-2">
                                    <button
                                        onClick={() => handleQuickReply("Suggest me 3 books on war")}
                                        className="text-sm px-4 py-2 rounded-full border border-blue-500 text-blue-600 bg-white hover:bg-blue-50 dark:bg-slate-700 dark:text-blue-400 dark:hover:bg-slate-600 transition-colors shadow-sm"
                                    >
                                        Suggest 3 books on War
                                    </button>
                                    <button
                                        onClick={() => handleQuickReply("J.K. Rowling")}
                                        className="text-sm px-4 py-2 rounded-full border border-blue-500 text-blue-600 bg-white hover:bg-blue-50 dark:bg-slate-700 dark:text-blue-400 dark:hover:bg-slate-600 transition-colors shadow-sm"
                                    >
                                        J.K. Rowling (Single)
                                    </button>
                                    <button
                                        onClick={() => handleQuickReply("five classic science fiction books")}
                                        className="text-sm px-4 py-2 rounded-full border border-blue-500 text-blue-600 bg-white hover:bg-blue-50 dark:bg-slate-700 dark:text-blue-400 dark:hover:bg-slate-600 transition-colors shadow-sm"
                                    >
                                        5 Classic Sci-Fi
                                    </button>
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
                            placeholder={isSending ? "Searching Open Library..." : "Enter title, author, or keywords (e.g., '2 books on history')..."}
                            disabled={isSending}
                            className="w-full pr-14 pl-4 py-3 rounded-full border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-slate-900 dark:text-white shadow-inner"
                        />
                        <button
                            onClick={() => handleSendMessage(userInput)}
                            disabled={!userInput.trim() || isSending}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-500 text-white hover:bg-blue-600 rounded-full transition-colors disabled:bg-blue-300 dark:disabled:bg-blue-700 shadow-md"
                        >
                            {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
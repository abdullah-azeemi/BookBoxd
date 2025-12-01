import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";


async function getGeminiRecommendations(query: string, geminiApiKey: string): Promise<string[] | null> {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${geminiApiKey}`;
    const systemPrompt = "You are a world-class librarian and book recommender. A user is asking for book recommendations based on a description. You must recommend 10 relevant book titles. Your response MUST be a valid JSON object, and nothing else, following this schema: { \"recommendations\": [\"Book Title 1\", \"Book Title 2\", \"Book Title 3\", \"Book Title 4\", \"Book Title 5\", \"Book Title 6\", \"Book Title 7\", \"Book Title 8\", \"Book Title 9\", \"Book Title 10\"] }";
    const responseSchema = {
        type: "OBJECT",
        properties: {
            "recommendations": {
                "type": "ARRAY",
                "items": { "type": "STRING" }
            }
        }
    };

    const payload = {
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: `Here is the user's request: "${query}"` }] }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            temperature: 0.8,
        }
    };

    try {
        const geminiRes = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!geminiRes.ok) {
            const errText = await geminiRes.text();
            console.error("Gemini request failed:", geminiRes.status, errText);
            return null;
        }

        const result = await geminiRes.json();
        const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!jsonText) {
            console.error("No JSON text found in Gemini response:", JSON.stringify(result));
            return null;
        }

        const parsedJson = JSON.parse(jsonText);
        return parsedJson.recommendations as string[];

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return null;
    }
}


async function getGroqRecommendations(query: string, groqApiKey: string): Promise<string[] | null> {
    const apiUrl = "https://api.groq.com/openai/v1/chat/completions";
    const systemPrompt = "You are a world-class librarian and book recommender. A user is asking for book recommendations. You must recommend exactly 10 relevant book titles. Respond ONLY with a valid JSON object following this schema: { \"recommendations\": [\"Book Title 1\", \"Book Title 2\", \"Book Title 3\", \"Book Title 4\", \"Book Title 5\", \"Book Title 6\", \"Book Title 7\", \"Book Title 8\", \"Book Title 9\", \"Book Title 10\"] }. Do not include any other text.";

    const payload = {
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Here is the user's request: "${query}"` }
        ],
        temperature: 0.8,
        max_tokens: 500,
        response_format: { type: "json_object" }
    };

    try {
        const groqRes = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${groqApiKey}`
            },
            body: JSON.stringify(payload)
        });

        if (!groqRes.ok) {
            const errText = await groqRes.text();
            console.error("Groq request failed:", groqRes.status, errText);
            return null;
        }

        const result = await groqRes.json();
        const content = result.choices?.[0]?.message?.content;

        if (!content) {
            console.error("No content found in Groq response:", JSON.stringify(result));
            return null;
        }

        const parsedJson = JSON.parse(content);
        return parsedJson.recommendations as string[];

    } catch (error) {
        console.error("Error calling Groq API:", error);
        return null;
    }
}


async function getAIRecommendations(query: string, geminiApiKey: string | undefined, groqApiKey: string | undefined): Promise<string[] | null> {
    // Try Gemini first if available
    if (geminiApiKey) {
        console.log("[AI Recommender] Trying Gemini API...");
        const geminiResult = await getGeminiRecommendations(query, geminiApiKey);
        if (geminiResult && geminiResult.length > 0) {
            console.log("[AI Recommender] ✓ Gemini API succeeded");
            return geminiResult;
        }
        console.log("[AI Recommender] ✗ Gemini API failed, falling back to Groq...");
    }

    if (groqApiKey) {
        console.log("[AI Recommender] Trying Groq API...");
        const groqResult = await getGroqRecommendations(query, groqApiKey);
        if (groqResult && groqResult.length > 0) {
            console.log("[AI Recommender] ✓ Groq API succeeded");
            return groqResult;
        }
        console.log("[AI Recommender] ✗ Groq API also failed");
    }

    console.error("[AI Recommender] All AI providers failed");
    return null;
}

// ============================================================
// GOOGLE BOOKS INTEGRATION
// ============================================================

async function getGoogleBookDetails(title: string): Promise<{ id: string; author: string; cover?: string; description?: string }> {
    try {
        const googleRes = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(title)}&maxResults=1`
        );
        const googleData = await googleRes.json();
        const item = googleData?.items?.[0];
        const info = item?.volumeInfo;

        return {
            id: item?.id || '',
            author: info?.authors?.[0] || "Unknown",
            cover: info?.imageLinks?.thumbnail || undefined,
            description: info?.description || undefined,
        };
    } catch (error) {
        console.error(`Error fetching Google Books details for "${title}":`, error);
        return { id: '', author: "Unknown", cover: undefined, description: undefined };
    }
}

interface OpenLibraryDoc {
    cover_i?: number;
    author_name?: string[] | string;
    title?: string;
    first_sentence?: string[];
    subject?: string[];
    first_publish_year?: number;
    key?: string; // Added key to the interface
}

async function getOpenLibraryBooks(query: string, limit: number) {
    const MAX_RETRIES = 3;
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${Math.min(limit + 2, 10)}&fields=key,title,author_name,first_publish_year,cover_i,first_sentence,subject`;

    let response: Response | null = null;

    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            response = await fetch(url);
            if (response.ok) break;
            if (i < MAX_RETRIES - 1) {
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
            }
        } catch {
            if (i < MAX_RETRIES - 1) {
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
            }
        }
    }

    if (!response || !response.ok) {
        throw new Error(`Failed to fetch from OpenLibrary`);
    }

    const result = await response.json();

    if (!result.docs || result.docs.length === 0) {
        return [];
    }

    const books = result.docs.slice(0, limit).map((doc: OpenLibraryDoc) => {
        const coverId = doc.cover_i;
        const coverUrl = coverId
            ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
            : undefined;

        const authors = Array.isArray(doc.author_name) ? doc.author_name.join(', ') : doc.author_name;

        // Extract the work ID from the key (e.g., "/works/OL12345W" -> "OL12345W")
        const bookId = doc.key?.split('/').pop() || '';

        let description = '';
        if (doc.first_sentence && doc.first_sentence.length > 0) {
            description = doc.first_sentence[0];
        } else if (doc.subject && doc.subject.length > 0) {
            description = `Keywords: ${doc.subject.slice(0, 5).join(', ')}.`;
        } else {
            description = doc.first_publish_year
                ? `First published in ${doc.first_publish_year}.`
                : 'No additional details available.';
        }

        // Truncate description to reasonable length
        const words = description.split(/\s+/).filter(w => w.length > 0);
        if (words.length > 100) {
            description = words.slice(0, 100).join(' ') + '...';
        }

        return {
            id: bookId,
            title: doc.title || 'Unknown Title',
            author: authors || 'Unknown Author',
            cover: coverUrl,
            description: description
        };
    });

    return books;
}

function extractStructuredQuery(query: string): { isStructured: boolean; count: number; searchTerm: string } {
    // Pattern 1: "3 books on ancient Rome"
    const pattern1 = /(\d+)\s+books?\s+(?:on|about|regarding)\s+(.+)/i;
    const match1 = query.match(pattern1);
    if (match1) {
        return {
            isStructured: true,
            count: Math.min(parseInt(match1[1], 10), 10),
            searchTerm: match1[2].trim()
        };
    }

    // Pattern 2: "five classic science fiction books"
    const pattern2 = /(one|two|three|four|five|six|seven|eight|nine|ten)\s+(.+?)\s+books?/i;
    const match2 = query.match(pattern2);
    if (match2) {
        const numMap: { [key: string]: number } = {
            'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
            'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
        };
        return {
            isStructured: true,
            count: numMap[match2[1].toLowerCase()] || 5,
            searchTerm: match2[2].trim()
        };
    }

    // Pattern 3: "suggest me N books on/about..."
    const pattern3 = /suggest(?:\s+me)?\s+(\d+|one|two|three|four|five)\s+books?\s+(?:on|about|regarding)\s+(.+)/i;
    const match3 = query.match(pattern3);
    if (match3) {
        const numMap: { [key: string]: number } = {
            'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5
        };
        const count = isNaN(parseInt(match3[1]))
            ? numMap[match3[1].toLowerCase()] || 5
            : Math.min(parseInt(match3[1], 10), 10);

        return {
            isStructured: true,
            count: count,
            searchTerm: match3[2].trim()
        };
    }

    // Not a structured query
    return {
        isStructured: false,
        count: 5,
        searchTerm: query
    };
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json().catch(() => null);
        const query = body?.query;

        if (!query || typeof query !== "string" || !query.trim()) {
            return NextResponse.json({
                error: "Missing or empty query",
                books: []
            }, { status: 400 });
        }

        // Detect query type
        const queryAnalysis = extractStructuredQuery(query.trim());

        if (queryAnalysis.isStructured) {
            // Use OpenLibrary for structured queries
            console.log(`[Structured Query] Count: ${queryAnalysis.count}, Search: ${queryAnalysis.searchTerm}`);

            try {
                const books = await getOpenLibraryBooks(queryAnalysis.searchTerm, queryAnalysis.count);

                return NextResponse.json({
                    queryType: 'structured',
                    books: books,
                    message: books.length > 0
                        ? `Found ${books.length} book${books.length !== 1 ? 's' : ''} matching "${queryAnalysis.searchTerm}"`
                        : `No books found for "${queryAnalysis.searchTerm}". Try a different search term.`
                });
            } catch (error) {
                console.error("OpenLibrary error:", error);
                return NextResponse.json({
                    error: "Failed to search OpenLibrary",
                    books: []
                }, { status: 500 });
            }
        } else {
            console.log(`[Semantic Query] ${query}`);

            const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
            const GROQ_API_KEY = process.env.GROQ_API_KEY;

            if (!GEMINI_API_KEY && !GROQ_API_KEY) {
                console.error("No AI API keys configured");
                return NextResponse.json({
                    error: "AI recommendations unavailable - no API keys configured",
                    books: []
                }, { status: 500 });
            }

            const recommendedTitles = await getAIRecommendations(query, GEMINI_API_KEY, GROQ_API_KEY);

            if (!recommendedTitles || recommendedTitles.length === 0) {
                return NextResponse.json({
                    error: "Could not get AI recommendations from any provider",
                    books: []
                }, { status: 500 });
            }

            const booksWithDetails = await Promise.all(
                recommendedTitles.slice(0, 10).map(async (title) => {
                    const bookDetails = await getGoogleBookDetails(title);
                    return {
                        id: bookDetails.id,
                        title: title,
                        author: bookDetails.author,
                        cover: bookDetails.cover,
                        description: bookDetails.description || 'No description available.'
                    };
                })
            );

            return NextResponse.json({
                queryType: 'semantic',
                books: booksWithDetails,
                message: `Here are AI-recommended books based on your request`
            });
        }

    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown server error";
        console.error("AI Book Finder error:", error);
        return NextResponse.json(
            {
                error: message,
                books: []
            },
            { status: 500 }
        );
    }
}

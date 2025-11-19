import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""; 
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent";
const HARDCODED_USER_ID = "clerk1"; 
const MAX_RECOMMENDATIONS = 5;

const recommendationSchema = {
    type: "ARRAY",
    items: {
        type: "OBJECT",
        properties: {
            title: { type: "STRING", description: "The title of the recommended book." },
            author: { type: "STRING", description: "The primary author of the book." },
            coverQuery: { type: "STRING", description: "A few descriptive keywords for generating an abstract cover image." },
        },
        required: ["title", "author", "coverQuery"],
        propertyOrdering: ["title", "author", "coverQuery"]
    }
};

async function getReadingHistory(userId: string) {
    return {
        lastRead: "The Lord of the Rings: The Fellowship of the Ring (Fantasy)",
        currentlyReading: "Sapiens: A Brief History of Humankind (Non-Fiction, History)",
        wantToRead: "Project Hail Mary (Sci-Fi), Dune (Sci-Fi)",
    };
}

export async function GET() {
    let reviews = [];
    let recommendations = [];
    let errors: string[] = [];
    
    try {
        const latestReviews = await prisma.review.findMany({
            orderBy: { createdAt: "desc" },
            take: 5, 
            select: {
                id: true, content: true, createdAt: true,
                book: { select: { externalId: true, title: true, author: true, coverUrl: true } },
                user: { select: { username: true } },
            },
        });
        reviews = latestReviews;
    } catch (error) {
        console.error("Error fetching latest reviews:", error);
        errors.push("Failed to fetch latest reviews from database.");
    }
    
    if (!GEMINI_API_KEY) {
        errors.push("GEMINI_API_KEY environment variable is not set.");
    } else {
        try {
            const history = await getReadingHistory(HARDCODED_USER_ID);
            
            const systemPrompt = `You are a world-class book recommendation engine. Based on the user's reading history, suggest exactly ${MAX_RECOMMENDATIONS} books that they would enjoy. Do not output any preamble, only the requested JSON array.`;
            
            const userQuery = `The user's reading context is:
            - Last Read: ${history.lastRead}
            - Currently Reading: ${history.currentlyReading}
            - Want to Read: ${history.wantToRead}
            
            Suggest ${MAX_RECOMMENDATIONS} new books they might like. For each, provide the title, author, and 3-4 descriptive keywords for a cover image query.`;
    
            const payload = {
                contents: [{ parts: [{ text: userQuery }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: recommendationSchema,
                }
            };
    
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
            }
    
            const result = await response.json();
            const jsonString = result.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (jsonString) {
                const parsedRecommendations = JSON.parse(jsonString);
                recommendations = Array.isArray(parsedRecommendations) 
                    ? parsedRecommendations.slice(0, MAX_RECOMMENDATIONS)
                    : [];
            }
        } catch (error) {
            console.error("Error fetching AI recommendations:", error);
            errors.push("Failed to fetch personalized recommendations from AI.");
        }
    }

    return NextResponse.json({ 
        reviews, 
        recommendations,
        errors: errors.length > 0 ? errors : undefined 
    });
}
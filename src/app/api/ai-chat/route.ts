import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { message, context } = await req.json();
        const { bookTitle, bookAuthor } = context;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ reply: "I'm sorry, I can't chat right now because my brain (API key) is missing." }, { status: 503 });
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

        const systemPrompt = `You are a helpful and knowledgeable AI Reading Assistant. 
    You are currently discussing the book "${bookTitle}" by ${bookAuthor}.
    Answer the user's questions about this specific book. 
    If they ask about something unrelated, politely steer the conversation back to the book or literature in general.
    Keep your answers concise (under 3-4 sentences) unless asked for a detailed explanation.
    Be enthusiastic and engaging!`;

        const payload = {
            contents: [
                { role: "user", parts: [{ text: systemPrompt }] }, // System instruction as first user message for context
                { role: "model", parts: [{ text: "Understood. I am ready to discuss the book." }] },
                { role: "user", parts: [{ text: message }] }
            ]
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const result = await response.json();
        const reply = result.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure how to answer that.";

        return NextResponse.json({ reply });

    } catch (error) {
        console.error("AI Chat error:", error);
        return NextResponse.json({ reply: "Sorry, something went wrong. Please try again." }, { status: 500 });
    }
}

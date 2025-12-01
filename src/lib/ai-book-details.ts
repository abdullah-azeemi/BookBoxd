export interface AIBookAnalysis {
    summary: string;
    themes: string[];
    sentiment: {
        score: number;
        label: string;
    };
    spoilerAlerts: string[];
}

export async function getAIBookDetails(
    title: string,
    author: string,
    reviews: string[] = []
): Promise<AIBookAnalysis | null> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.warn("GEMINI_API_KEY is not set.");
        return null;
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const reviewsText = reviews.length > 0
        ? `Here are some user reviews for context: ${reviews.slice(0, 20).join(" | ")}`
        : "No user reviews available yet.";

    const systemPrompt = `You are an expert literary critic and librarian. Analyze the book "${title}" by ${author}.
    ${reviewsText}

    Please provide a structured response in JSON format with the following fields:
    1. "summary": A concise, engaging summary of the book (approx. 3-4 sentences).
    2. "themes": An array of 3-5 key themes or tags (e.g., "Suspense", "Plot Twists").
    3. "sentiment": An object with "score" (0-100, where 100 is best) and "label" (e.g., "Overwhelmingly Positive", "Mixed", "Critical"). If reviews are provided, base this on them. If not, estimate based on general critical reception if known, or default to a neutral/positive baseline for a popular book.
    4. "spoilerAlerts": An array of strings warning about potential spoilers found in the reviews, or empty if none.

    Output ONLY valid JSON.`;

    const payload = {
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: {
            responseMimeType: "application/json"
        }
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error("Gemini API error:", response.status, await response.text());
            return null;
        }

        const result = await response.json();
        const candidate = result.candidates?.[0];

        if (candidate && candidate.content?.parts?.[0]?.text) {
            const jsonText = candidate.content.parts[0].text;
            const data = JSON.parse(jsonText);
            return {
                summary: data.summary || "Summary not available.",
                themes: data.themes || [],
                sentiment: data.sentiment || { score: 85, label: "Generally Positive" },
                spoilerAlerts: data.spoilerAlerts || []
            };
        }
        return null;
    } catch (error) {
        console.error("Error generating AI book details:", error);
        return null;
    }
}

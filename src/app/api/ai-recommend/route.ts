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

async function getGoogleBookDetails(title: string): Promise<{ author: string; cover?: string; description?: string }> {
  try {
    const googleRes = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(title)}&maxResults=1`
    );
    const googleData = await googleRes.json();
    const info = googleData?.items?.[0]?.volumeInfo;

    return {
      author: info?.authors?.[0] || "Unknown",
      cover: info?.imageLinks?.thumbnail || undefined,
      description: info?.description || undefined,
    };
  } catch (error) {
    console.error(`Error fetching Google Books details for "${title}":`, error);
    return { author: "Unknown", cover: undefined, description: undefined };
  }
}

// Helper function to generate a Ghibli-style cover using Stability AI
async function generateGhibliCover(title: string, description: string | undefined, stabilityApiKey: string): Promise<string | undefined> {
  const stabilityApiUrl = "https://api.stability.ai/v2beta/stable-image/generate/sd3";
  const prompt = `Ghibli style book cover for a book titled "${title}". ${description ? `The book is about: ${description}.` : ''} Dreamy, whimsical, soft colors, detailed, enchanting, fantasy elements, Studio Ghibli inspired art, magical realism, warm lighting.`;

  try {
    const stabilityRes = await fetch(stabilityApiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stabilityApiKey}`,
        Accept: "image/*",
      },
      body: JSON.stringify({
        prompt: prompt,
        model: "sd3", // Using Stable Diffusion 3
        output_format: "png",

        width: 512,
        height: 768,

      }),
    });

    if (!stabilityRes.ok) {
      const errorResponse = await stabilityRes.text();
      console.error("Stability AI request failed:", stabilityRes.status, errorResponse);
      return undefined;
    }

    // Stability AI returns an image file, not JSON. We'll convert it to a data URL.
    const imageBuffer = await stabilityRes.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    return `data:image/png;base64,${base64Image}`;

  } catch (error) {
    console.error(`Error generating Ghibli cover for "${title}":`, error);
    return undefined;
  }
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
      return NextResponse.json({ recommendations: [], error: "Missing or empty `query` in JSON body" }, { status: 400 });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY not set in .env.local");
      return NextResponse.json({ recommendations: [], error: "Server configuration error: Missing GEMINI_API_KEY" }, { status: 500 });
    }
    if (!STABILITY_API_KEY) {
      console.warn("STABILITY_API_KEY not set. Will not generate custom covers if Google Books fails.");

    }

    const recommendedTitles = await getGeminiRecommendations(query, GEMINI_API_KEY);
    if (!recommendedTitles || recommendedTitles.length === 0) {
      return NextResponse.json({ recommendations: [], error: "Could not get book recommendations from AI." }, { status: 500 });
    }

    const booksWithDetails = await Promise.all(
      recommendedTitles.map(async (title) => {
        const bookDetails = await getGoogleBookDetails(title);

        let coverToUse = bookDetails.cover;

        if (!coverToUse && STABILITY_API_KEY) {
          console.log(`Generating Ghibli cover for "${title}"...`);
          coverToUse = await generateGhibliCover(title, bookDetails.description, STABILITY_API_KEY);
          if (coverToUse) {
            console.log(`Successfully generated cover for "${title}".`);
          } else {
            console.warn(`Failed to generate cover for "${title}". Using placeholder.`);
          }
        }

        return {
          title: title,
          author: bookDetails.author,
          cover: coverToUse || "/placeholder.svg",
        };
      })
    );

    return NextResponse.json({ recommendations: booksWithDetails.map(b => b.title), booksWithDetails });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error"
    console.error("AI Recommend POST error:", error);
    return NextResponse.json(
      { recommendations: [], error: message },
      { status: 500 }
    );
  }
}
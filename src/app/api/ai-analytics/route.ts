import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

const apiKey = process.env.GEMINI_API_KEY || ""
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`

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
}

async function fetchWithBackoff(url: string, options: RequestInit, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options)
      if (response.ok) return response

      throw new Error(`API returned status ${response.status}`)
    } catch (error) {
      if (i === retries - 1) throw error 
      const delay = Math.pow(2, i) * 1000 + Math.random() * 1000 
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

export async function GET() {
  let effectiveUserId: string | null = null
  if (process.env.NODE_ENV === "development") {
    effectiveUserId = process.env.DEV_FAKE_USER_ID || "clerk1"
  } else {
    const { userId } = auth()
    effectiveUserId = userId || null
  }

  if (!effectiveUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({ where: { clerkId: effectiveUserId } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const reviews = await prisma.review.findMany({
      where: { userId: user.id },
      select: { content: true },
    })

    const topGenres = await prisma.userBook.findMany({
      where: { userId: user.id, status: "read" },
      include: { book: { select: { genre: true } } },
      orderBy: { updatedAt: "desc" },
    })
    
    const genreCounts = topGenres.reduce((acc, ub) => {
        const genre = ub.book.genre || "Unknown";
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const sortedGenres = Object.entries(genreCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 3)
        .map(([genre]) => genre);


    const reviewTexts = reviews.map((r) => r.content).join(" | ")

    if (reviewTexts.length < 10) {
        return NextResponse.json({
            sentiment: { positive: 0, neutral: 100, negative: 0 },
            keywords: [{ word: "No reviews yet", weight: 5, sentiment: "neutral" }],
            summary: "Write a few reviews to unlock your AI Reading Personality Report! We need more data to analyze your style."
        }, { status: 200 });
    }

    const systemPrompt = `You are a world-class Literary Analyst. Your task is to analyze the provided set of user reviews (separated by '|' characters) and their reading data.
    1. Determine the overall sentiment breakdown (Positive/Neutral/Negative percentage).
    2. Extract the Top 10 most prominent and meaningful keywords (nouns, adjectives, strong verbs) from the combined review text for a word cloud, assigning a weight (1-10) and sentiment (positive or negative) to each. Do not use common stop words like 'the', 'a', 'is'.
    3. Synthesize the user's reading style into a single, engaging paragraph summary (The "Reading Personality Report"). Use the provided Top Genres as context. Do not mention the word count of the summary.`

    const userQuery = `Analyze the following reviews: ${reviewTexts}. Top Genres for context: ${sortedGenres.join(", ")}.`

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            sentiment: {
              type: "OBJECT",
              description: "The percentage breakdown of overall sentiment, totaling 100.",
              properties: {
                positive: { type: "NUMBER", description: "Positive percentage" },
                neutral: { type: "NUMBER", description: "Neutral percentage" },
                negative: { type: "NUMBER", description: "Negative percentage" },
              },
            },
            keywords: {
              type: "ARRAY",
              description: "A list of the top 10 most prominent keywords with their weight (1-10) and sentiment.",
              items: {
                type: "OBJECT",
                properties: {
                  word: { type: "STRING" },
                  weight: { type: "NUMBER" },
                  sentiment: { type: "STRING", enum: ["positive", "negative"] },
                },
              },
            },
            summary: {
                type: "STRING",
                description: "The Reading Personality Report: a single, engaging paragraph summarizing the user's reading style based on their reviews and top genres."
            }
          },
        },
      },
    }

    const response = await fetchWithBackoff(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    
    const result = await response.json()
    const candidate = result.candidates?.[0]

    if (candidate && candidate.content?.parts?.[0]?.text) {
      const jsonText = candidate.content.parts[0].text
      const parsedData: AIAnalyticsResponse = JSON.parse(jsonText)
      return NextResponse.json(parsedData)
    }

    throw new Error("Failed to get structured response from AI.")
  } catch (err) {
    console.error("AI Analytics Error:", err)
    return NextResponse.json(
      { error: "Failed to generate AI insights." },
      { status: 500 }
    )
  }
}
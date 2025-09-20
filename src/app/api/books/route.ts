import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) return NextResponse.json({ error: "Missing query" }, { status: 400 });

  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        q
      )}&key=${process.env.GOOGLE_BOOKS_KEY}`
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from Google Books API" },
        { status: res.status }
      );
    }

    const data = await res.json();

    type GoogleBookItem = {
      id: string;
      volumeInfo: {
        title: string;
        authors?: string[];
        description?: string;
        publishedDate?: string;
        categories?: string[];
        imageLinks?: {
          thumbnail?: string;
        };
      };
    };

    const books = (data.items ?? []).map((item: GoogleBookItem) => {
      const volume = item.volumeInfo;
      return {
        id: item.id,
        title: volume.title,
        authors: volume.authors || [],
        description: volume.description || "",
        publishedDate: volume.publishedDate || "",
        categories: volume.categories || [],
        coverUrl: volume.imageLinks?.thumbnail || null,
      };
    });

    return NextResponse.json({ books });
  } catch (error) {
    console.error("Books API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

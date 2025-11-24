import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const id = searchParams.get("id");

  // fetch book by id
  if (id) {
    try {
      const key = process.env.GOOGLE_BOOKS_KEY
      const url = key
        ? `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}?key=${key}`
        : `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}`
      const res = await fetch(url);

      if (!res.ok) {
        return NextResponse.json(
          { error: "Failed to fetch book details" },
          { status: res.status }
        );
      }

      const data = await res.json();

      const volume = data.volumeInfo || {};
      const book = {
        id: data.id,
        title: volume.title,
        authors: volume.authors || [],
        description: volume.description || "",
        publishedDate: volume.publishedDate || "",
        categories: volume.categories || [],
        coverUrl: (volume.imageLinks?.thumbnail || null)?.replace(/^http:\/\//i, "https://") || null,
      };

      return NextResponse.json({ book });
    } catch (error) {
      console.error("Book details fetch error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }

  // search books by query
  if (!q)
    return NextResponse.json({ error: "Missing query" }, { status: 400 });

  try {
    const key = process.env.GOOGLE_BOOKS_KEY
    const url = key
      ? `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&key=${key}`
      : `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}`
    const res = await fetch(url);

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
        title?: string;
        authors?: string[];
        description?: string;
        publishedDate?: string;
        categories?: string[];
        imageLinks?: { thumbnail?: string };
      };
    };

    const books = (data.items ?? []).map((item: GoogleBookItem) => {
      const volume = item.volumeInfo || {};
      return {
        id: item.id,
        title: volume.title,
        authors: volume.authors || [],
        description: volume.description || "",
        publishedDate: volume.publishedDate || "",
        categories: volume.categories || [],
        coverUrl: (volume.imageLinks?.thumbnail || null)?.replace(/^http:\/\//i, "https://") || null,
      };
    });

    return NextResponse.json({ books });
  } catch (error) {
    console.error("Books API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

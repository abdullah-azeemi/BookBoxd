import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const id = searchParams.get("id");

  // fetch book by id
  if (id) {
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}?key=${process.env.GOOGLE_BOOKS_KEY}`
      );

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
        coverUrl: volume.imageLinks?.thumbnail || null,
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

    const books = (data.items ?? []).map((item: any) => {
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

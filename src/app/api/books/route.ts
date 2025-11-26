import { NextResponse } from "next/server";
import { getBookById, searchBooks } from "@/lib/books";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const id = searchParams.get("id");

  // fetch book by id
  if (id) {
    try {
      const book = await getBookById(id);

      if (!book) {
        return NextResponse.json(
          { error: "Book not found" },
          { status: 404 }
        );
      }

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
    const books = await searchBooks(q);
    return NextResponse.json({ books });
  } catch (error) {
    console.error("Books API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


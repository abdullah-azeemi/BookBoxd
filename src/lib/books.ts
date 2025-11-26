import { Book } from "@prisma/client";

export interface BookData {
    id: string;
    title: string;
    authors: string[];
    description: string;
    publishedDate: string;
    categories: string[];
    coverUrl: string | null;
}

interface OpenLibraryDoc {
    key: string;
    title: string;
    author_name?: string[];
    first_publish_year?: number;
    subject?: string[];
    cover_i?: number;
}

export async function getBookById(id: string): Promise<BookData | null> {
    try {
        if (id.startsWith("OL") || id.includes("/works/")) {
            const openLibraryId = id.includes("/works/") ? id.split("/works/")[1] : id;
            const res = await fetch(`https://openlibrary.org/works/${openLibraryId}.json`);

            if (!res.ok) return null;

            const data = await res.json();

            let authors: string[] = [];
            if (data.authors && data.authors.length > 0) {
                const authorPromises = data.authors.map(async (a: { author: { key: string } }) => {
                    const authorId = a.author?.key?.split("/").pop();
                    if (authorId) {
                        const authorRes = await fetch(`https://openlibrary.org/authors/${authorId}.json`);
                        if (authorRes.ok) {
                            const authorData = await authorRes.json();
                            return authorData.name;
                        }
                    }
                    return null;
                });
                const authorNames = await Promise.all(authorPromises);
                authors = authorNames.filter((name): name is string => !!name);
            }

            return {
                id: data.key.split("/").pop(),
                title: data.title,
                authors: authors.length > 0 ? authors : ["Unknown Author"],
                description: typeof data.description === 'string' ? data.description : data.description?.value || "",
                publishedDate: data.first_publish_date || "",
                categories: data.subjects || [],
                coverUrl: data.covers && data.covers.length > 0
                    ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`
                    : null,
            };
        }

        const key = process.env.GOOGLE_BOOKS_KEY
        const url = key
            ? `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}?key=${key}`
            : `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}`
        const res = await fetch(url);

        if (!res.ok) return null;

        const data = await res.json();
        const volume = data.volumeInfo || {};

        return {
            id: data.id,
            title: volume.title,
            authors: volume.authors || [],
            description: volume.description || "",
            publishedDate: volume.publishedDate || "",
            categories: volume.categories || [],
            coverUrl: (volume.imageLinks?.thumbnail || null)?.replace(/^http:\/\//i, "https://") || null,
        };
    } catch (error) {
        console.error("Error fetching book:", error);
        return null;
    }
}

export async function searchBooks(q: string): Promise<BookData[]> {
    try {
        const [googleRes, openLibraryRes] = await Promise.allSettled([
            searchGoogleBooks(q),
            searchOpenLibrary(q)
        ]);

        let googleBooks: BookData[] = [];
        let openLibraryBooks: BookData[] = [];

        if (googleRes.status === "fulfilled") {
            googleBooks = googleRes.value;
        }

        if (openLibraryRes.status === "fulfilled") {
            openLibraryBooks = openLibraryRes.value;
        }

        const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");

        const isDuplicate = (book1: BookData, book2: BookData) => {
            const t1 = normalize(book1.title);
            const t2 = normalize(book2.title);

            if (t1 !== t2 && !t1.includes(t2) && !t2.includes(t1)) return false;

            const a1 = book1.authors.map(normalize);
            const a2 = book2.authors.map(normalize);

            if (a1.length === 0 || a2.length === 0) return true;

            return a1.some(author1 => a2.some(author2 => author1.includes(author2) || author2.includes(author1)));
        };

        const uniqueBooks: BookData[] = [];

        for (const book of googleBooks) {
            if (!uniqueBooks.some(b => isDuplicate(b, book))) {
                uniqueBooks.push(book);
            }
        }
        for (const book of openLibraryBooks) {
            if (!uniqueBooks.some(b => isDuplicate(b, book))) {
                uniqueBooks.push(book);
            }
        }

        return uniqueBooks;
    } catch (error) {
        console.error("Error searching books:", error);
        return [];
    }
}

async function searchGoogleBooks(q: string): Promise<BookData[]> {
    const key = process.env.GOOGLE_BOOKS_KEY
    const url = key
        ? `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&key=${key}`
        : `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}`

    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();

    return (data.items ?? []).map((item: { id: string; volumeInfo: { title?: string; authors?: string[]; description?: string; publishedDate?: string; categories?: string[]; imageLinks?: { thumbnail?: string } } }) => {
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
}

async function searchOpenLibrary(q: string): Promise<BookData[]> {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=10`;
    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();

    return (data.docs ?? []).map((item: OpenLibraryDoc) => {
        return {
            id: item.key.split("/").pop() || "", // Key is usually /works/OL...
            title: item.title,
            authors: item.author_name || [],
            description: "", // Search results don't usually have full description
            publishedDate: item.first_publish_year ? String(item.first_publish_year) : "",
            categories: item.subject ? item.subject.slice(0, 5) : [],
            coverUrl: item.cover_i
                ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
                : null,
        };
    });
}

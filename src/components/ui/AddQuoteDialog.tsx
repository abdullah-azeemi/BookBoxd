"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface Book {
    id: string
    title: string
    author: string
}

interface AddQuoteDialogProps {
    open: boolean
    onClose: () => void
    onAdd: (quote: { text: string; bookId: string; bookTitle: string; author: string }) => Promise<void>
    readBooks: Book[]
}

export function AddQuoteDialog({ open, onClose, onAdd, readBooks }: AddQuoteDialogProps) {
    const [selectedBookId, setSelectedBookId] = useState("")
    const [quoteText, setQuoteText] = useState("")
    const [loading, setLoading] = useState(false)

    const selectedBook = readBooks.find((b) => b.id === selectedBookId)
    const charCount = quoteText.length
    const maxChars = 500

    const handleSubmit = async () => {
        if (!selectedBook || !quoteText.trim()) return

        setLoading(true)
        try {
            await onAdd({
                text: quoteText.trim(),
                bookId: selectedBook.id,
                bookTitle: selectedBook.title,
                author: selectedBook.author,
            })
            setQuoteText("")
            setSelectedBookId("")
            onClose()
        } catch (error) {
            console.error("Failed to add quote:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Favorite Quote</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                            Select Book
                        </label>
                        <Select value={selectedBookId} onValueChange={setSelectedBookId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a book from your Read list" />
                            </SelectTrigger>
                            <SelectContent>
                                {readBooks.length === 0 ? (
                                    <div className="p-2 text-sm text-slate-500 text-center">
                                        No books in your Read list yet
                                    </div>
                                ) : (
                                    readBooks.map((book) => (
                                        <SelectItem key={book.id} value={book.id}>
                                            {book.title} <span className="text-slate-500">by {book.author}</span>
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                            Quote
                        </label>
                        <Textarea
                            placeholder="Enter your favorite quote or highlight from this book..."
                            value={quoteText}
                            onChange={(e) => setQuoteText(e.target.value)}
                            maxLength={maxChars}
                            rows={6}
                            className="resize-none"
                        />
                        <div className="text-xs text-slate-500 mt-1 text-right">
                            {charCount}/{maxChars} characters
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedBook || !quoteText.trim() || loading}
                        className="bg-[#00A8FF] hover:bg-[#0090D9]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding...
                            </>
                        ) : (
                            "Add Quote"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

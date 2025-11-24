"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Loader2, ChevronDown } from "lucide-react";

interface BookStatusButtonProps {
  externalBookId: string;
  title: string;
  author: string;
  coverUrl: string;
}

type BookStatus = "read" | "reading" | "want-to-read";

export default function BookStatusButton({
  externalBookId,
  title,
  author,
  coverUrl,
}: BookStatusButtonProps) {
  const [status, setStatus] = useState<BookStatus | null | "loading">("loading");
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        if (!isLoaded || !isSignedIn) {
          setStatus(null);
          return;
        }
        const res = await fetch(`/api/user-books/${externalBookId}`, { credentials: "include" });
        if (res.status === 401) {
          setStatus(null);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setStatus(data.status || null);
        } else {
          setStatus(null);
        }
      } catch (error) {
        console.error("Failed to fetch book status", error);
        setStatus(null);
      }
    };
    fetchStatus();
  }, [externalBookId, isSignedIn, isLoaded]);

  const handleStatusChange = async (newStatus: BookStatus) => {
    const originalStatus = status;
    setStatus("loading");
    try {
      if (!isSignedIn) {
        throw new Error("Not signed in");
      }
      const res = await fetch("/api/user-books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          externalBookId,
          status: newStatus,
          title,
          author,
          coverUrl,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      const data = await res.json();
      setStatus(data.userBook.status as BookStatus);
    } catch (error) {
      console.error(error);
      setStatus(originalStatus);
    }
  };

  const getButtonText = () => {
    if (status === "loading") {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading
        </>
      );
    }
    if (status === "read") {
      return (
        <>
          <Check className="mr-2 h-4 w-4" /> Read
        </>
      );
    }
    if (status === "reading") {
      return (
        <>
          <Check className="mr-2 h-4 w-4" /> Currently Reading
        </>
      );
    }
    if (status === "want-to-read") {
      return (
        <>
          <Check className="mr-2 h-4 w-4" /> Want to Read
        </>
      );
    }
    return "Add to Library";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
          disabled={status === "loading"}
        >
          {getButtonText()}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup
          value={status || ""}
          onValueChange={(value) => handleStatusChange(value as BookStatus)}
        >
          <DropdownMenuRadioItem value="want-to-read">
            Want to Read
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="reading">
            Currently Reading
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="read">Read</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

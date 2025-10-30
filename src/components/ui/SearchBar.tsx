"use client"

import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function SearchBar() {
  const pathname = usePathname()
  const [query, setQuery] = useState("")

  if (pathname !== "/collections") return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    window.dispatchEvent(
      new CustomEvent("bookSearch", { detail: e.target.value })
    )
  }

  return (
    <div className="relative hidden sm:block">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
      <Input
        className="w-full pl-10 pr-4 py-2 rounded-full"
        placeholder="Search books..."
        value={query}
        onChange={handleChange}
      />
    </div>
  )
}

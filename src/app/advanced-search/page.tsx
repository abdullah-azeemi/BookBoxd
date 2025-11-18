import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Bell, BookOpen } from "lucide-react"
import Link from "next/link"

export default function AdvancedSearchPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-screen-xl mx-auto">
          {/* Main Search Bar */}
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-400" />
            </div>
            <Input
              className="w-full text-lg pl-14 pr-4 py-4 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search for books, authors, or genres..."
              type="search"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Advanced Search Sidebar */}
            <aside className="lg:col-span-1 space-y-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Advanced Search</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300" htmlFor="genre">
                    Genre
                  </label>
                  <Select>
                    <SelectTrigger className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <SelectValue placeholder="Select Genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fantasy">Fantasy</SelectItem>
                      <SelectItem value="mystery">Mystery</SelectItem>
                      <SelectItem value="science-fiction">Science Fiction</SelectItem>
                      <SelectItem value="romance">Romance</SelectItem>
                      <SelectItem value="historical-fiction">Historical Fiction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300" htmlFor="author">
                    Author
                  </label>
                  <Select>
                    <SelectTrigger className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <SelectValue placeholder="Select Author" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="author1">Author 1</SelectItem>
                      <SelectItem value="author2">Author 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300" htmlFor="year">
                    Publication Year
                  </label>
                  <Select>
                    <SelectTrigger className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300" htmlFor="rating">
                    Rating Range
                  </label>
                  <div className="relative pt-1">
                    <input
                      className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      max="5"
                      min="1"
                      type="range"
                      defaultValue="3"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300"
                    htmlFor="keywords"
                  >
                    Keywords
                  </label>
                  <Input
                    className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    id="keywords"
                    placeholder="Enter Keywords"
                    type="text"
                  />
                </div>

                <Button className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                  Apply Filters
                </Button>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Popular Genres Section */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Popular Genres</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  <div className="group cursor-pointer">
                    <div className="aspect-[3/4] w-full bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg mb-2 overflow-hidden transform group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Fantasy</span>
                    </div>
                    <h3 className="font-medium text-center text-slate-900 dark:text-white">Fantasy</h3>
                  </div>
                  <div className="group cursor-pointer">
                    <div className="aspect-[3/4] w-full bg-gradient-to-br from-red-400 to-red-600 rounded-lg mb-2 overflow-hidden transform group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Mystery</span>
                    </div>
                    <h3 className="font-medium text-center text-slate-900 dark:text-white">Mystery</h3>
                  </div>
                  <div className="group cursor-pointer">
                    <div className="aspect-[3/4] w-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-2 overflow-hidden transform group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Sci-Fi</span>
                    </div>
                    <h3 className="font-medium text-center text-slate-900 dark:text-white">Science Fiction</h3>
                  </div>
                  <div className="group cursor-pointer">
                    <div className="aspect-[3/4] w-full bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg mb-2 overflow-hidden transform group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Romance</span>
                    </div>
                    <h3 className="font-medium text-center text-slate-900 dark:text-white">Romance</h3>
                  </div>
                  <div className="group cursor-pointer">
                    <div className="aspect-[3/4] w-full bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg mb-2 overflow-hidden transform group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Historical</span>
                    </div>
                    <h3 className="font-medium text-center text-slate-900 dark:text-white">Historical Fiction</h3>
                  </div>
                </div>
              </section>

              {/* Curated Collections Section */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Curated Collections</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  <div className="group cursor-pointer">
                    <div className="aspect-[3/4] w-full bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg mb-2 overflow-hidden transform group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                      <span className="text-white font-bold text-sm text-center">Award Winners</span>
                    </div>
                    <h3 className="font-medium text-center text-slate-900 dark:text-white">Award Winners</h3>
                  </div>
                  <div className="group cursor-pointer">
                    <div className="aspect-[3/4] w-full bg-gradient-to-br from-green-400 to-green-600 rounded-lg mb-2 overflow-hidden transform group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                      <span className="text-white font-bold text-sm text-center">Best Sellers</span>
                    </div>
                    <h3 className="font-medium text-center text-slate-900 dark:text-white">Best Sellers</h3>
                  </div>
                  <div className="group cursor-pointer">
                    <div className="aspect-[3/4] w-full bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg mb-2 overflow-hidden transform group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                      <span className="text-white font-bold text-sm text-center">Critically Acclaimed</span>
                    </div>
                    <h3 className="font-medium text-center text-slate-900 dark:text-white">Critically Acclaimed</h3>
                  </div>
                  <div className="group cursor-pointer">
                    <div className="aspect-[3/4] w-full bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg mb-2 overflow-hidden transform group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                      <span className="text-white font-bold text-sm text-center">Popular Reads</span>
                    </div>
                    <h3 className="font-medium text-center text-slate-900 dark:text-white">Popular Reads</h3>
                  </div>
                  <div className="group cursor-pointer">
                    <div className="aspect-[3/4] w-full bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg mb-2 overflow-hidden transform group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                      <span className="text-white font-bold text-sm text-center">New Releases</span>
                    </div>
                    <h3 className="font-medium text-center text-slate-900 dark:text-white">New Releases</h3>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

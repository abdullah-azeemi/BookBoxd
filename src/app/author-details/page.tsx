import { Button } from "@/components/ui/button"

export default function AuthorDetailsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 px-10 py-4">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3 text-gray-900">
            <svg className="text-[#19a1e6] text-3xl w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
            <h2 className="text-xl font-bold">NovelNest</h2>
          </div>
          <nav className="flex items-center gap-8 text-sm font-medium text-gray-500">
            <a className="hover:text-[#19a1e6] transition-colors" href="/home">
              For You
            </a>
            <a className="text-[#19a1e6] font-semibold" href="/collections">
              Browse
            </a>
            <a className="hover:text-[#19a1e6] transition-colors" href="/book-details">
              Reviews
            </a>
            <a className="hover:text-[#19a1e6] transition-colors" href="/ai-recommender">
              Lists
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <label className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              className="w-64 rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm placeholder:text-gray-400 focus:border-[#19a1e6] focus:ring-1 focus:ring-[#19a1e6] focus:outline-none"
              placeholder="Search authors, books..."
              type="search"
            />
          </label>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
            </svg>
          </button>
          <div
            className="size-10 rounded-full bg-cover bg-center"
            style={{ backgroundImage: 'url("/diverse-user-avatars.png")' }}
          ></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Author Profile */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
              <div
                className="w-40 h-40 rounded-full bg-cover bg-center flex-shrink-0"
                style={{ backgroundImage: 'url("/woman-author-profile-picture.jpg")' }}
              ></div>
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold tracking-tight">Clara Harrison</h1>
                <p className="mt-2 text-lg text-gray-600">Author of Whispers of the Past and Echoes in the Mist</p>
                <p className="mt-1 text-sm text-gray-500">12 books · 1.2M followers</p>
                <p className="mt-4 max-w-xl text-gray-700">
                  Clara Harrison is a celebrated author known for her captivating historical fiction novels. Her works
                  often explore themes of love, loss, and resilience, set against richly detailed historical backdrops.
                </p>
                <Button className="mt-6 bg-[#19a1e6] hover:bg-[#19a1e6]/90">Follow</Button>
              </div>
            </div>

            {/* Books Section */}
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Books by Clara Harrison</h2>
                <a className="text-sm font-semibold text-[#19a1e6] hover:underline" href="#">
                  View all
                </a>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
                <div className="flex flex-col gap-2">
                  <div className="relative group">
                    <div
                      className="w-full aspect-[2/3] bg-cover bg-center rounded-lg shadow-md group-hover:opacity-80 transition-opacity"
                      style={{ backgroundImage: 'url("/whispering-woods-book-cover.jpg")' }}
                    ></div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <button className="bg-[#19a1e6] text-white rounded-full p-3">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-base font-semibold leading-tight mt-2">Whispers of the Past</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="relative group">
                    <div
                      className="w-full aspect-[2/3] bg-cover bg-center rounded-lg shadow-md group-hover:opacity-80 transition-opacity"
                      style={{ backgroundImage: 'url("/shadows-past-book-cover.jpg")' }}
                    ></div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <button className="bg-[#19a1e6] text-white rounded-full p-3">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-base font-semibold leading-tight mt-2">Echoes in the Mist</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="relative group">
                    <div className="w-full aspect-[2/3] bg-gray-300 rounded-lg shadow-md group-hover:opacity-80 transition-opacity"></div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <button className="bg-[#19a1e6] text-white rounded-full p-3">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-base font-semibold leading-tight mt-2">Shadows of Yesterday</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="relative group">
                    <div className="w-full aspect-[2/3] bg-gray-300 rounded-lg shadow-md group-hover:opacity-80 transition-opacity"></div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <button className="bg-[#19a1e6] text-white rounded-full p-3">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-base font-semibold leading-tight mt-2">The Forgotten Garden</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="relative group">
                    <div className="w-full aspect-[2/3] bg-gray-300 rounded-lg shadow-md group-hover:opacity-80 transition-opacity"></div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <button className="bg-[#19a1e6] text-white rounded-full p-3">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-base font-semibold leading-tight mt-2">Secrets of the Manor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

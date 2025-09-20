import Link from "next/link"
export default function AIAnalyticsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="text-[#19a1e6] size-7">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  clipRule="evenodd"
                  d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Novel Insights</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link className="text-sm font-medium hover:text-[#19a1e6] transition-colors" href="/">
              Home
            </Link>
            <Link className="text-sm font-medium hover:text-[#19a1e6] transition-colors" href="/home">
              Explore
            </Link>
            <Link className="text-sm font-medium text-[#19a1e6]" href="/collections">
              My Books
            </Link>
            <Link className="text-sm font-medium hover:text-[#19a1e6] transition-colors" href="/profile">
              Community
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg
                fill="currentColor"
                height="20px"
                viewBox="0 0 256 256"
                width="20px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
              </svg>
            </button>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{ backgroundImage: 'url("/diverse-user-avatars.png")' }}
            ></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">AI Analytics Dashboard</h2>
          <p className="mt-2 text-lg text-gray-600">
            Dive deep into your reading habits and community trends with AI-powered insights.
          </p>
        </div>

        {/* Personal Reading Insights */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Personal Reading Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Genre Distribution */}
            <div className="bg-gray-50 rounded-lg p-6 flex flex-col">
              <h4 className="font-semibold text-gray-900 mb-4">Genre Distribution</h4>
              <div className="flex-grow flex items-center justify-center">
                <div className="w-full h-64 flex items-end justify-center gap-x-6">
                  <div className="flex flex-col items-center gap-2 w-1/5">
                    <div className="w-full bg-[#19a1e6]/20 rounded-t-lg" style={{ height: "90%" }}></div>
                    <span className="text-xs font-medium text-gray-600">Fiction</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 w-1/5">
                    <div className="w-full bg-[#19a1e6]/20 rounded-t-lg" style={{ height: "50%" }}></div>
                    <span className="text-xs font-medium text-gray-600">Non-Fic.</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 w-1/5">
                    <div className="w-full bg-[#19a1e6]/20 rounded-t-lg" style={{ height: "75%" }}></div>
                    <span className="text-xs font-medium text-gray-600">Mystery</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 w-1/5">
                    <div className="w-full bg-[#19a1e6]/20 rounded-t-lg" style={{ height: "60%" }}></div>
                    <span className="text-xs font-medium text-gray-600">Sci-Fi</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 w-1/5">
                    <div className="w-full bg-[#19a1e6]/20 rounded-t-lg" style={{ height: "30%" }}></div>
                    <span className="text-xs font-medium text-gray-600">Biography</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reading Timeline */}
            <div className="bg-gray-50 rounded-lg p-6 flex flex-col">
              <h4 className="font-semibold text-gray-900 mb-4">Reading Timeline</h4>
              <div className="flex-grow flex flex-col justify-end">
                <svg
                  fill="none"
                  height="200"
                  preserveAspectRatio="none"
                  viewBox="0 0 475 150"
                  width="100%"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V150H0V109Z"
                    fill="url(#paint0_linear_1_1)"
                  ></path>
                  <path
                    d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                    stroke="#19a1e6"
                    strokeLinecap="round"
                    strokeWidth="3"
                  ></path>
                  <defs>
                    <linearGradient
                      gradientUnits="userSpaceOnUse"
                      id="paint0_linear_1_1"
                      x1="236"
                      x2="236"
                      y1="1"
                      y2="150"
                    >
                      <stop stopColor="#19a1e6" stopOpacity="0.4"></stop>
                      <stop offset="1" stopColor="#19a1e6" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                </svg>
                <div className="flex justify-between mt-2 text-xs font-medium text-gray-600">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                </div>
              </div>
            </div>

            {/* Top Authors */}
            <div className="bg-gray-50 rounded-lg p-6 flex flex-col">
              <h4 className="font-semibold text-gray-900 mb-4">Top Authors</h4>
              <div className="flex-grow space-y-4">
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3">
                  <span className="text-sm font-medium text-gray-600">Author A</span>
                  <div className="h-2 bg-[#19a1e6]/20 rounded-full">
                    <div className="h-2 bg-[#19a1e6] rounded-full" style={{ width: "80%" }}></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">12</span>
                </div>
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3">
                  <span className="text-sm font-medium text-gray-600">Author B</span>
                  <div className="h-2 bg-[#19a1e6]/20 rounded-full">
                    <div className="h-2 bg-[#19a1e6] rounded-full" style={{ width: "65%" }}></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">9</span>
                </div>
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3">
                  <span className="text-sm font-medium text-gray-600">Author C</span>
                  <div className="h-2 bg-[#19a1e6]/20 rounded-full">
                    <div className="h-2 bg-[#19a1e6] rounded-full" style={{ width: "50%" }}></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">7</span>
                </div>
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3">
                  <span className="text-sm font-medium text-gray-600">Author D</span>
                  <div className="h-2 bg-[#19a1e6]/20 rounded-full">
                    <div className="h-2 bg-[#19a1e6] rounded-full" style={{ width: "40%" }}></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">5</span>
                </div>
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3">
                  <span className="text-sm font-medium text-gray-600">Author E</span>
                  <div className="h-2 bg-[#19a1e6]/20 rounded-full">
                    <div className="h-2 bg-[#19a1e6] rounded-full" style={{ width: "30%" }}></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">4</span>
                </div>
              </div>
            </div>

            {/* Review Sentiment */}
            <div className="bg-gray-50 rounded-lg p-6 flex flex-col">
              <h4 className="font-semibold text-gray-900 mb-4">Review Sentiment</h4>
              <div className="flex-grow flex items-center justify-center">
                <div className="w-full h-64 flex items-end justify-center gap-x-6">
                  <div className="flex flex-col items-center gap-2 w-1/4">
                    <div className="w-full bg-gray-200 rounded-t-lg h-32 flex flex-col justify-end">
                      <div className="bg-green-500 rounded-t-lg" style={{ height: "70%" }}></div>
                      <div className="bg-yellow-500" style={{ height: "20%" }}></div>
                      <div className="bg-red-500" style={{ height: "10%" }}></div>
                    </div>
                    <span className="text-xs font-medium text-gray-600">Overall</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Book & Review Analytics */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Book & Review Analytics</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Most Reviewed Books</h4>
                <div className="space-y-3">
                  <p className="text-sm">1. The Midnight Library</p>
                  <p className="text-sm">2. Project Hail Mary</p>
                  <p className="text-sm">3. Klara and the Sun</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">AI Summarized Insights</h4>
                <p className="text-sm">
                  Community sentiment is overwhelmingly <span className="font-bold text-green-500">Positive</span> 😀
                  for your recent reads.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Reading Pace</h4>
                <p className="text-sm">
                  On average, you finish a book every <span className="font-bold text-[#19a1e6]">12 days</span>.
                </p>
              </div>
            </div>
            <div className="lg:col-span-2 bg-gray-50 rounded-lg p-6 flex flex-col">
              <h4 className="font-semibold text-gray-900 mb-4">Review Word Cloud</h4>
              <div className="flex-grow flex items-center justify-center">
                <div className="text-center text-gray-600 space-x-2 space-y-1">
                  <span className="text-3xl font-bold text-[#19a1e6]">engaging</span>
                  <span className="text-xl">thought-provoking</span>
                  <span className="text-lg">well-written</span>
                  <span className="text-2xl font-semibold">characters</span>
                  <span className="text-3xl">plot</span>
                  <span className="text-lg">twists</span>
                  <span className="text-xl font-medium">emotional</span>
                  <span className="text-2xl text-[#19a1e6]">beautiful</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

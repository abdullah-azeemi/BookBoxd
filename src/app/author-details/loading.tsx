export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 px-10 py-4">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
              <div className="w-40 h-40 rounded-full bg-gray-200 animate-pulse flex-shrink-0"></div>
              <div className="text-center md:text-left">
                <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-6 w-80 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-20 w-full max-w-xl bg-gray-200 rounded animate-pulse mb-6"></div>
                <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="mt-16">
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="w-full aspect-[2/3] bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

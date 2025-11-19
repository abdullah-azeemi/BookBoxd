export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-lg mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1 space-y-6">
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                ))}
              </div>
            </aside>
            <div className="lg:col-span-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

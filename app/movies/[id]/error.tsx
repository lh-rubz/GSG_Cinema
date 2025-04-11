"use client"

import { useRouter } from "next/navigation"

export default function MovieNotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 flex flex-col items-center justify-center p-4">
      {/* Simple film strip effect */}
      <div className="absolute top-0 left-0 w-full h-2 bg-zinc-200 dark:bg-zinc-700 flex">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="h-full w-6 border-r border-zinc-300 dark:border-zinc-600"></div>
        ))}
      </div>

      {/* Main content */}
      <div className="text-center max-w-md">
        {/* Clapper board */}
        <div className="mx-auto mb-8 w-40 h-24 bg-white dark:bg-zinc-800 text-black dark:text-white flex flex-col items-center justify-center border-2 border-red-500 shadow-md">
          <div className="text-3xl font-bold">404</div>
          <div className="text-sm mt-1 dark:text-zinc-300">MOVIE NOT FOUND</div>
        </div>

        <h1 className="text-3xl font-bold mb-4 text-red-600 dark:text-red-500">Film Missing</h1>
        <p className="text-zinc-600 dark:text-zinc-300 mb-8">
          This movie reel can't be located in our archives.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => router.push("/movies")}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white font-medium rounded transition-colors"
          >
            View Movies
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 border border-red-600 dark:border-red-500 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-zinc-800 rounded transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>

      {/* Simple side accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-white/50 to-transparent dark:from-zinc-900/50"></div>
        <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white/50 to-transparent dark:from-zinc-900/50"></div>
      </div>
    </div>
  )
}
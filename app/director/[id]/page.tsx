"use client"

import { useParams } from "next/navigation"
import Image from "next/image"
import { useState, useEffect } from "react"
import { directorsApi } from "@/lib/endpoints/directors"
import type { Director, Movie } from "@/types/types"
import MovieCard from "@/components/movie-card"
import { Film, User, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function DirectorPage() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id
  const [director, setDirector] = useState<(Director & { movies: Movie[] }) | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDirectorData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await directorsApi.getDirector(id!)
        setDirector(response.data!)
      } catch (err) {
        console.error("Failed to fetch director:", err)
        setError("Failed to load director information. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) fetchDirectorData()
  }, [id])

  // Render loading skeletons
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 mt-20">
        {/* Director Skeleton */}
        <div className="p-6 rounded-xl bg-white dark:bg-zinc-800 shadow-lg border border-zinc-100 dark:border-zinc-700 animate-pulse">
          <div className="flex items-center mb-6 pb-2 border-b border-zinc-200 dark:border-zinc-700">
            <div className="h-8 w-32 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-[200px] h-[300px] bg-zinc-200 dark:bg-zinc-700 rounded-lg"></div>
            <div className="flex-1 space-y-4 w-full">
              <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-full"></div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-full"></div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Movies Skeleton */}
        <div className="mt-8">
          <div className="h-8 w-32 bg-zinc-200 dark:bg-zinc-700 rounded mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-zinc-800 rounded-xl shadow-md border border-zinc-100 dark:border-zinc-700 overflow-hidden animate-pulse"
              >
                <div className="h-[350px] bg-zinc-200 dark:bg-zinc-700"></div>
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4"></div>
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="container mx-auto p-4 md:p-6 mt-20">
      {/* Director Section */}
      <div className="p-6 md:p-8 rounded-xl bg-white dark:bg-zinc-800 shadow-lg border border-zinc-100 dark:border-zinc-700 transition-all">
        <div className="flex items-center mb-6 pb-3 border-b border-zinc-200 dark:border-zinc-700">
          <User className="h-6 w-6 text-red-500 dark:text-red-400 mr-3" />
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Director Profile</h2>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-8">
          {director?.image ? (
            <div className="w-full md:w-auto flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-400 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                <Image
                  src={director.image || "/placeholder.svg"}
                  alt={director.name}
                  width={240}
                  height={360}
                  className="relative rounded-lg object-cover shadow-lg border-2 border-zinc-200 dark:border-zinc-700 transition-all group-hover:scale-[1.01]"
                />
              </div>
            </div>
          ) : (
            <div className="w-full md:w-auto flex justify-center">
              <div className="w-[240px] h-[360px] bg-zinc-200 dark:bg-zinc-700 rounded-lg flex items-center justify-center">
                <User className="h-16 w-16 text-zinc-400 dark:text-zinc-500" />
              </div>
            </div>
          )}

          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-zinc-900 dark:text-white">{director?.name}</h1>
              <div className="flex items-center text-zinc-500 dark:text-zinc-400 text-sm">
                <Film className="h-4 w-4 mr-2" />
                <span>{director?.movies?.length || 0} movies directed</span>
              </div>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-700/30 p-5 rounded-lg border border-zinc-100 dark:border-zinc-700">
              <h3 className="text-lg font-semibold mb-3 text-zinc-800 dark:text-zinc-200">Biography</h3>
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {director?.bio || "No biography available for this director."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Movies Section */}
      <div className="mt-10">
        <div className="flex items-center mb-6">
          <Film className="h-6 w-6 text-red-500 dark:text-red-400 mr-3" />
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Filmography</h2>
        </div>

        {director?.movies && director?.movies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {director.movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-md">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Film className="h-8 w-8 text-zinc-400 dark:text-zinc-500" />
            </div>
            <h3 className="text-xl font-medium text-zinc-800 dark:text-zinc-200 mb-2">No Movies Found</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              We couldn't find any movies directed by {director?.name}.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

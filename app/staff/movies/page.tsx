"use client"

import { useState, useEffect } from "react"
import { Film, Star } from "lucide-react"
import type { Movie } from "@/types/types"
import { moviesApi } from "@/lib/endpoints/movies"

export default function StaffMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    try {
      setIsLoading(true)
      const response = await moviesApi.getMovies({ hidden: false })
      
      if (response.error) {
        console.error(`Failed to fetch movies: ${response.error}`)
        return
      }
      
      if (response.data) {
        setMovies(response.data)
      }
    } catch (error) {
      console.error("An error occurred while fetching movies", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.genre.some((g) => g.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || movie.status === statusFilter

    return matchesSearch && matchesStatus && !movie.hidden
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-900 dark:text-white">Loading movies...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-zinc-900 to-red-800 bg-clip-text text-transparent dark:from-white dark:to-red-400">Movies</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="search"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-red-200 dark:border-red-700 bg-white dark:bg-red-900/10 text-red-900 dark:text-white placeholder-red-500 dark:placeholder-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
          />
          <Film className="absolute left-3 top-2.5 h-5 w-5 text-red-500 dark:text-red-400" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-md border border-red-200 dark:border-red-700 bg-white dark:bg-red-900/10 text-red-900 dark:text-white focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
        >
          <option value="all">All Movies</option>
          <option value="now_showing">Now Showing</option>
          <option value="coming_soon">Coming Soon</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMovies.map((movie) => (
          <div key={movie.id} className="border border-red-200 dark:border-red-800 rounded-lg overflow-hidden bg-white dark:bg-red-900/10 hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300">
            <div className="aspect-[2/3] relative">
              {movie.image ? (
                <img src={movie.image || "/placeholder.svg"} alt={movie.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-red-50 dark:bg-red-800/20">
                  <Film className="h-12 w-12 text-red-400 dark:text-red-500" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    movie.status === "now_showing"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500"
                  }`}
                >
                  {movie.status === "now_showing" ? "Now Showing" : "Coming Soon"}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg text-red-900 dark:text-white">{movie.title}</h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-red-600 dark:text-red-400">
                <span>{movie.year}</span>
                <span>•</span>
                <span>{movie.duration}</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <span className="text-red-900 dark:text-white">{movie.rating}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {movie.genre.slice(0, 3).map((genre) => (
                  <span key={genre} className="px-2 py-1 text-xs rounded-full bg-red-100 dark:bg-red-800/30 text-red-700 dark:text-red-300">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMovies.length === 0 && (
        <div className="text-center py-12">
          <Film className="h-12 w-12 mx-auto text-red-400 dark:text-red-500" />
          <h3 className="mt-4 text-lg font-medium text-red-900 dark:text-white">No movies found</h3>
          <p className="mt-2 text-red-600 dark:text-red-400">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  )
}


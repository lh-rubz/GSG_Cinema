"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { moviesApi } from "@/lib/endpoints/movies"
import { showtimesApi } from "@/lib/endpoints/showtimes"
import { Loading } from "@/components/loading-inline"
import { ArrowLeft, Calendar, Clock, Film, Info } from 'lucide-react'
import Link from "next/link"
import { format } from "date-fns"
import { usePreferences } from "@/context/PreferencesContext"
import { formatDuration, formatTime } from "@/utils/formatters"

export default function MovieShowtimesPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [movie, setMovie] = useState<any>(null)
  const [showtimes, setShowtimes] = useState<any[]>([])
 const { preferences } = usePreferences();

  useEffect(() => {
    const fetchData = async () => {
     
      try {
        setIsLoading(true)
        setError(null)

        // Fetch movie details
        const movieResponse = await moviesApi.getMovie(params.id as string)
        if (!movieResponse.data) {
          throw new Error("Movie not found")
        }
        setMovie(movieResponse.data)

        // Fetch showtimes for this movie
        const showtimesResponse = await showtimesApi.getShowtimes({
          movieId: params.id as string
        })
        if (!showtimesResponse.data) {
          throw new Error("Failed to fetch showtimes")
        }
        setShowtimes(showtimesResponse.data)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "Failed to load movie information")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleShowtimeSelect = (showtimeId: string) => {
    router.push(`/booking/${showtimeId}`)
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen pt-[130px] bg-white dark:bg-zinc-900 flex items-center justify-center">
        <Loading text="Loading showtimes..." />
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="w-full h-screen pt-[130px] bg-white dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/30 max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-red-700 dark:text-red-300 text-lg font-medium">{error || "Movie not found"}</p>
          <Link
            href="/movies"
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Movies
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-50 dark:bg-zinc-900 min-h-screen">
      <div className="pt-[130px] pb-16">
        <div className="container mx-auto px-4">
          {/* Movie header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link
                href={`/movies/${movie.id}`}
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors duration-200"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">
                {movie.title}
              </h1>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">{movie.description}</p>
          </div>

          {/* Showtimes */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 text-zinc-900 dark:text-white">Available Showtimes</h2>
            
            {showtimes.length > 0 ? (
              <div className="grid gap-4">
                {showtimes.map((showtime) => (
                  <button
                    key={showtime.id}
                    onClick={() => handleShowtimeSelect(showtime.id)}
                    className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-600 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                        <span className="text-zinc-900 dark:text-white">
                          {format(new Date(showtime.date), "EEEE, MMMM d")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                        <span className="text-zinc-900 dark:text-white">
                         {formatTime(showtime.time, preferences.timeFormat === "TWELVE_HOUR" ? "12-hour" : "24-hour")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                        <span className="text-zinc-900 dark:text-white">
                          {showtime.screen.name}
                        </span>
                      </div>
                    </div>
                    <div className="text-red-600 dark:text-red-400 font-medium">
                      Book Now
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
                No showtimes available for this movie
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 
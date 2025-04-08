"use client"
import { useEffect, useState } from "react"
import ShowTimesContainer from "@/components/showTimesContainer"
import type { Showtime, Movie } from "@/types/types"
import { useRouter, useSearchParams } from "next/navigation"
import { showtimesApi } from "@/lib/endpoints/showtimes"
import { moviesApi } from "@/lib/endpoints/movies"
import { Loading } from "@/components/loading-inline"
import { Calendar, Film } from "lucide-react"

interface EnhancedShowtime extends Showtime {
  movieDetails?: Movie
  showtimes?: string[]
}

const Page = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlDate = searchParams.get("date")

  // Helper to convert dd-mm-yyyy to Date object (handles no leading zero)
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split("-").map(Number)
    return new Date(year, month - 1, day)
  }

  // Helper to format Date object to dd-mm-yyyy (with leading zeros)
  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  // Get today's date and the next 4 days in dd-mm-yyyy format
  const getUpcomingDates = () => {
    const today = new Date()
    const upcomingDates: string[] = []

    for (let i = 0; i < 5; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      upcomingDates.push(formatDate(date))
    }

    return upcomingDates
  }

  const dates = getUpcomingDates()
  const initialDate = urlDate && dates.includes(urlDate) ? urlDate : dates[0]
  const [currentDate, setCurrentDate] = useState<string>(initialDate)
  const [showtimes, setShowtimes] = useState<EnhancedShowtime[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch showtimes and movie details based on selected date
  useEffect(() => {
    const fetchShowtimesAndMovies = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Step 1: Fetch showtimes for the selected date
        const showtimesResponse = await showtimesApi.getShowtimes({ date: currentDate })

        if (!showtimesResponse.data || showtimesResponse.data.length === 0) {
          setShowtimes([])
          setIsLoading(false)
          return
        }

        // Step 2: Group showtimes by movieId
        const showtimesByMovie = showtimesResponse.data.reduce(
          (acc, showtime) => {
            if (!acc[showtime.movieId]) {
              acc[showtime.movieId] = []
            }
            acc[showtime.movieId].push(showtime)
            return acc
          },
          {} as Record<string, Showtime[]>,
        )

        // Step 3: Create enhanced showtimes with movie details
        const enhancedShowtimes: EnhancedShowtime[] = []

        for (const [movieId, movieShowtimes] of Object.entries(showtimesByMovie)) {
          try {
            const movieResponse = await moviesApi.getMovie(movieId)
            const movieDetails = movieResponse.data

            if (movieDetails) {
              // Get unique times for this movie on this date
              const times = movieShowtimes
                .map((s) => s.time)
                .filter((time, index, self) => self.indexOf(time) === index)
                .sort()

              enhancedShowtimes.push({
                ...movieShowtimes[0],
                movieDetails,
                showtimes: times,
              })
            }
          } catch (err) {
            console.error(`Failed to fetch details for movie ${movieId}:`, err)
          }
        }

        // Sort showtimes by movie title
        enhancedShowtimes.sort((a, b) => (a.movieDetails?.title || "").localeCompare(b.movieDetails?.title || ""))

        setShowtimes(enhancedShowtimes)
        router.push(`?date=${currentDate}`)
      } catch (err) {
        console.error("Failed to fetch showtimes:", err)
        setError("Failed to load showtimes. Please try again later.")
        setShowtimes([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchShowtimesAndMovies()
  }, [currentDate, router])

  if (isLoading) {
    return (
      <div className="w-full h-screen pt-[130px] bg-white dark:bg-zinc-900 flex items-center justify-center">
        <Loading text="Loading showtimes..." />
      </div>
    )
  }

  if (error) {
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
          <p className="text-red-700 dark:text-red-300 text-lg font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-50 dark:bg-zinc-900 min-h-screen">
      <div className="pt-[130px] pb-16">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 dark:from-red-900 dark:to-red-700">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="font-bold text-3xl md:text-4xl mb-2 text-white flex items-center">
                  <Film className="mr-3 h-8 w-8 text-white/80" />
                  Showtimes
                </h2>
                <p className="text-white/80">Find and book the latest movies playing in theaters</p>
              </div>
            </div>
          </div>
        </div>

        {/* Date selector */}
        <div className="container mx-auto px-4 -mt-6">
          <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-zinc-100 dark:border-zinc-700 shadow-lg max-w-3xl mx-auto">
            <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400 mb-3 px-2">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Select Date</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {dates.map((date) => {
                const dateObj = parseDate(date)
                const isToday = dateObj.toDateString() === new Date().toDateString()

                return (
                  <button
                    key={date}
                    className={`
                      transition-all duration-200 ease-in-out 
                      py-3 px-2 cursor-pointer rounded-lg
                      font-medium flex flex-col items-center
                      ${
                        currentDate === date
                          ? "text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 shadow-md"
                          : "text-zinc-800 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 dark:text-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-zinc-800"
                      }
                      focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-800
                    `}
                    onClick={() => setCurrentDate(date)}
                  >
                    <span className="text-xs opacity-80">
                      {dateObj.toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                    <span className="text-xl font-bold my-1">{dateObj.getDate()}</span>
                    <span className="text-xs opacity-80">
                      {dateObj.toLocaleDateString("en-US", { month: "short" })}
                    </span>
                    {isToday && (
                      <span
                        className={`text-xs mt-1 px-1.5 py-0.5 rounded-full ${
                          currentDate === date
                            ? "bg-white/20"
                            : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                        }`}
                      >
                        Today
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="container mx-auto px-4 mt-8">
          <div className="max-w-6xl mx-auto">
            {/* Showtimes Display */}
            {showtimes.length > 0 ? (
              <ShowTimesContainer moviesShowTimes={showtimes} />
            ) : (
              <div className="py-16 px-6 text-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 shadow-sm">
                <div className="w-20 h-20 flex items-center justify-center bg-zinc-100 dark:bg-zinc-700 rounded-full mb-4 mx-auto">
                  <Calendar className="w-10 h-10 text-zinc-400 dark:text-zinc-500" />
                </div>
                <h3 className="text-xl font-medium text-zinc-700 dark:text-zinc-300 mb-2">No showtimes available</h3>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                  There are no showtimes scheduled for this date. Please try another date.
                </p>
                <button
                  onClick={() => setCurrentDate(dates[0])}
                  className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                >
                  View Today's Showtimes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page

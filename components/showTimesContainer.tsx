"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Clock, Calendar, Star, ChevronDown, ChevronUp, Ticket, ChevronLeft, ChevronRight } from "lucide-react"
import type { Showtime, Movie } from "@/types/types"
import { formatDuration, formatTime } from "@/utils/formatters"
import { usePreferences } from "@/context/PreferencesContext"

interface EnhancedShowtime extends Showtime {
  movieDetails?: Movie
  showtimes?: string[]
}

interface ShowTimesContainerProps {
  moviesShowTimes: EnhancedShowtime[]
}

const ShowTimesContainer: React.FC<ShowTimesContainerProps> = ({ moviesShowTimes }) => {
  const [expandedMovies, setExpandedMovies] = useState<Record<string, boolean>>({})
  const [showMoreButtons, setShowMoreButtons] = useState<Record<string, boolean>>({})
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({})
  const descriptionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const { preferences } = usePreferences();

  const SHOWTIMES_PER_PAGE = 5

  const toggleMovieExpansion = (movieId: string) => {
    setExpandedMovies((prev) => ({
      ...prev,
      [movieId]: !prev[movieId],
    }))
  }

  // Check if description needs show more/less button
  useEffect(() => {
    const checkDescriptionHeight = () => {
      const newShowMoreButtons: Record<string, boolean> = {}
      Object.entries(descriptionRefs.current).forEach(([movieId, element]) => {
        if (element) {
          newShowMoreButtons[movieId] = element.scrollHeight > 80
        }
      })
      setShowMoreButtons(newShowMoreButtons)
    }

    checkDescriptionHeight()
    window.addEventListener('resize', checkDescriptionHeight)
    return () => window.removeEventListener('resize', checkDescriptionHeight)
  }, [moviesShowTimes])

 

  const getPaginatedShowtimes = (showtimes: string[], movieId: string) => {
    const page = currentPage[movieId] || 0
    const startIndex = page * SHOWTIMES_PER_PAGE
    return showtimes.slice(startIndex, startIndex + SHOWTIMES_PER_PAGE)
  }

  const totalPages = (showtimes: string[]) => Math.ceil(showtimes.length / SHOWTIMES_PER_PAGE)

  const handlePageChange = (movieId: string, direction: 'prev' | 'next') => {
    setCurrentPage(prev => {
      const current = prev[movieId] || 0
      const total = totalPages(moviesShowTimes.find(m => m.id === movieId)?.showtimes || [])
      const newPage = direction === 'next' 
        ? Math.min(current + 1, total - 1)
        : Math.max(current - 1, 0)
      return { ...prev, [movieId]: newPage }
    })
  }

  return (
    <div className="grid gap-8">
      {moviesShowTimes.map((movie) => {
        const movieDetails = movie.movieDetails
        const showtimes = movie.showtimes || []
        const totalShowtimePages = totalPages(showtimes)
        const currentShowtimePage = currentPage[movie.id] || 0
        const paginatedShowtimes = getPaginatedShowtimes(showtimes, movie.id)

        return (
          <div
            key={movie.id}
            className="bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-lg border border-zinc-100 dark:border-zinc-700 transition-all duration-300 hover:shadow-xl"
          >
            <div className="flex flex-col lg:flex-row">
              {/* Movie Poster */}
              <div className="relative w-full lg:w-[300px] h-[300px] lg:h-auto">
                <Image
                  src={movieDetails?.image || "/placeholder.svg?height=450&width=300"}
                  alt={movieDetails?.title || movie.movieId}
                  className="object-cover w-full h-full"
                  fill
                  sizes="(max-width: 1024px) 100vw, 300px"
                  priority
                />
                {movieDetails?.year && (
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-white">{movieDetails.year}</span>
                  </div>
                )}
              </div>

              {/* Movie Details */}
              <div className="flex-1 p-6 lg:p-8 flex flex-col">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">
                    {movieDetails?.title || "Movie Title"}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-700 rounded-full text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center">
                      <Clock className="w-4 h-4 mr-1.5" />
                      {formatDuration(Number(movieDetails?.duration), preferences.durationFormat)}
                       </span>

                    {movieDetails?.rating && (
                      <span className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full text-sm font-medium flex items-center">
                        <Star className="w-4 h-4 mr-1.5 fill-current" />
                        {movieDetails.rating}
                      </span>
                    )}
                  </div>
                </div>

                {/* Genres */}
                {movieDetails?.genre && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {Array.isArray(movieDetails.genre) ? (
                      movieDetails.genre.map((g, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 rounded-full text-xs font-medium text-zinc-700 dark:text-zinc-300"
                        >
                          {g}
                        </span>
                      ))
                    ) : (
                      <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 rounded-full text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        {movieDetails.genre}
                      </span>
                    )}
                  </div>
                )}

                {/* Movie Description - Expandable */}
                <div className="mb-6 flex-grow">
                  <div
                    ref={(el) => {
                      descriptionRefs.current[movie.id] = el
                    }}
                    className={`text-base text-zinc-600 dark:text-zinc-400 overflow-hidden transition-all duration-300 ${
                      expandedMovies[movie.id] ? "max-h-[500px]" : "max-h-[80px]"
                    }`}
                  >
                    <p>{movieDetails?.description || "No description available for this movie."}</p>
                  </div>
                  {showMoreButtons[movie.id] && (
                    <button
                      onClick={() => toggleMovieExpansion(movie.id)}
                      className="mt-2 text-red-600 dark:text-red-400 text-sm font-medium flex items-center hover:underline focus:outline-none"
                    >
                      {expandedMovies[movie.id] ? (
                        <>
                          Show less <ChevronUp className="w-4 h-4 ml-1" />
                        </>
                      ) : (
                        <>
                          Show more <ChevronDown className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Showtimes */}
                <div className="mt-auto">
                  <h4 className="font-semibold text-lg text-zinc-800 dark:text-zinc-200 mb-3 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-red-600 dark:text-red-400" />
                    Available Showtimes
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {showtimes.length > 0 ? (
                      <>
                        {paginatedShowtimes.map((time, index) => (
                          <Link
                            href={`/booking/${movie.id}`}
                            key={index}
                            className="px-5 py-2.5 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-700 dark:hover:bg-zinc-600 
                                      border border-zinc-200 dark:border-zinc-600 rounded-lg text-sm font-medium 
                                      text-zinc-800 dark:text-zinc-200 transition-colors duration-200 
                                      focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-800
                                      flex items-center"
                          >
                            <Ticket className="w-4 h-4 mr-2 text-red-500 dark:text-red-400" />
                            {formatTime(time, preferences.timeFormat === "TWELVE_HOUR" ? "12-hour" : "24-hour")}
                          </Link>
                        ))}
                        {totalShowtimePages > 1 && (
                          <div className="flex items-center gap-2 mt-2 w-full justify-center">
                            <button
                              onClick={() => handlePageChange(movie.id, 'prev')}
                              disabled={currentShowtimePage === 0}
                              className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 
                                        disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-200 dark:hover:bg-zinc-600 
                                        transition-colors duration-200"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">
                              Page {currentShowtimePage + 1} of {totalShowtimePages}
                            </span>
                            <button
                              onClick={() => handlePageChange(movie.id, 'next')}
                              disabled={currentShowtimePage === totalShowtimePages - 1}
                              className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 
                                        disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-200 dark:hover:bg-zinc-600 
                                        transition-colors duration-200"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">No showtimes available</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ShowTimesContainer

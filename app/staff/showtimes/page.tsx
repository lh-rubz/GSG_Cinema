"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Calendar, Clock, Eye, Film, MapPin, Users, RefreshCw, Filter } from "lucide-react"
import { DataTable } from "@/components/data-table"
import type { Showtime, Movie, Screen } from "@/types/types"
import { showtimesApi } from "@/lib/endpoints/showtimes"
import { moviesApi } from "@/lib/endpoints/movies"
import { screensApi } from "@/lib/endpoints/screens"

// Define extended showtime type
interface ExtendedShowtime extends Showtime {
  movie?: Movie;
  screen?: Screen;
}

export default function StaffShowtimesPage() {
  const [showtimes, setShowtimes] = useState<ExtendedShowtime[]>([])
  const [movies, setMovies] = useState<Movie[]>([])
  const [screens, setScreens] = useState<Screen[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState<string>("today")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch all data in parallel
      const [showtimesResponse, moviesResponse, screensResponse] = await Promise.all([
        showtimesApi.getShowtimes(),
        moviesApi.getMovies({ status: "now_showing" }),
        screensApi.getScreens()
      ])
      
      if (showtimesResponse.data) setShowtimes(showtimesResponse.data)
      if (moviesResponse.data) setMovies(moviesResponse.data)
      if (screensResponse.data) setScreens(screensResponse.data)
      
    } catch (error) {
      console.error("An error occurred while fetching data", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Enhanced showtimes with movie and screen details
  const enhancedShowtimes = showtimes.map(showtime => ({
    ...showtime,
    movie: movies.find(m => m.id === showtime.movieId),
    screen: screens.find(s => s.id === showtime.screenId)
  }))

  // Filter showtimes based on search and date
  const filteredShowtimes = enhancedShowtimes.filter((showtime) => {
    const matchesSearch = 
      showtime.movie?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      showtime.screen?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      showtime.format.toLowerCase().includes(searchTerm.toLowerCase())

    // Date filtering
    const today = new Date().toISOString().split('T')[0]
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    let matchesDate = true
    if (dateFilter === "today") {
      matchesDate = showtime.date === today
    } else if (dateFilter === "tomorrow") {
      matchesDate = showtime.date === tomorrow
    } else if (dateFilter === "upcoming") {
      matchesDate = showtime.date >= today
    }

    return matchesSearch && matchesDate
  })

  // Define table columns
  const columns = [
    {
      header: "Movie",
      accessorKey: "movie" as keyof ExtendedShowtime,
      cell: (showtime: ExtendedShowtime) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
            {showtime.movie?.title.slice(0, 2).toUpperCase() || "??"}
          </div>
          <div>
            <div className="font-medium text-zinc-900 dark:text-white">
              {showtime.movie?.title || "Unknown Movie"}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {showtime.movie?.year} • {showtime.movie?.duration}
            </div>
          </div>
        </div>
      )
    },
    {
      header: "Screen",
      accessorKey: "screen" as keyof ExtendedShowtime,
      cell: (showtime: ExtendedShowtime) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-blue-500" />
          <div>
            <div className="font-medium text-zinc-900 dark:text-white">
              {showtime.screen?.name || "Unknown Screen"}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {showtime.screen?.capacity} seats
            </div>
          </div>
        </div>
      )
    },
    {
      header: "Date & Time",
      accessorKey: "datetime" as keyof ExtendedShowtime,
      cell: (showtime: ExtendedShowtime) => {
        const showDate = new Date(showtime.date)
        const today = new Date().toDateString()
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString()
        
        let dateLabel = showDate.toLocaleDateString()
        if (showDate.toDateString() === today) dateLabel = "Today"
        else if (showDate.toDateString() === tomorrow) dateLabel = "Tomorrow"
        
        return (
          <div>
            <div className="font-medium text-zinc-900 dark:text-white">
              {dateLabel}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {showtime.time}
            </div>
          </div>
        )
      }
    },
    {
      header: "Format & Price",
      accessorKey: "format" as keyof ExtendedShowtime,
      cell: (showtime: ExtendedShowtime) => (
        <div>
          <div className="font-medium text-zinc-900 dark:text-white">
            {showtime.format}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
            ${showtime.price}
          </div>
        </div>
      )
    },
    {
      header: "Status",
      accessorKey: "status" as keyof ExtendedShowtime,
      cell: (showtime: ExtendedShowtime) => {
        const now = new Date()
        const showDateTime = new Date(`${showtime.date}T${showtime.time}`)
        const isUpcoming = showDateTime > now
        const isPast = showDateTime < now
        const isNow = Math.abs(showDateTime.getTime() - now.getTime()) < 30 * 60 * 1000 // within 30 mins
        
        if (isNow) {
          return (
            <div className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Now Playing
            </div>
          )
        } else if (isUpcoming) {
          return (
            <div className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
              <Clock className="h-3 w-3" />
              Upcoming
            </div>
          )
        } else {
          return (
            <div className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium bg-zinc-100 dark:bg-zinc-700/30 text-zinc-600 dark:text-zinc-400">
              <div className="w-2 h-2 rounded-full bg-zinc-400"></div>
              Completed
            </div>
          )
        }
      }
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-zinc-600 dark:text-zinc-400">Loading showtimes...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-2xl"></div>
        <div className="relative p-6 rounded-2xl border border-blue-200/20 dark:border-blue-800/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Showtimes Management
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                View and manage cinema showtimes and schedules
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {filteredShowtimes.length}
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  Showtimes
                </div>
              </div>
              <button
                onClick={fetchData}
                className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Film className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="search"
              placeholder="Search showtimes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-10 pr-8 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-zinc-600 dark:text-zinc-400">
                {enhancedShowtimes.filter(s => {
                  const now = new Date()
                  const showDateTime = new Date(`${s.date}T${s.time}`)
                  return Math.abs(showDateTime.getTime() - now.getTime()) < 30 * 60 * 1000
                }).length} Now Playing
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-zinc-600 dark:text-zinc-400">
                {enhancedShowtimes.filter(s => new Date(`${s.date}T${s.time}`) > new Date()).length} Upcoming
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 overflow-hidden">
        <DataTable
          data={filteredShowtimes}
          columns={columns}
          searchPlaceholder="Search showtimes..."
        />
      </div>
    </div>
  )
}

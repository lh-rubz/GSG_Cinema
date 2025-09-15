"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock,
  RefreshCw,
  Download,
  Filter,
  Film,
  MapPin
} from "lucide-react"
import type { Ticket, Movie, Screen, Showtime } from "@/types/types"
import { ticketsApi } from "@/lib/endpoints/tickets"
import { moviesApi } from "@/lib/endpoints/movies"
import { screensApi } from "@/lib/endpoints/screens"
import { showtimesApi } from "@/lib/endpoints/showtimes"

interface ReportData {
  totalRevenue: number
  totalTickets: number
  averageTicketPrice: number
  popularMovies: Array<{
    movie: Movie
    ticketCount: number
    revenue: number
  }>
  screenUtilization: Array<{
    screen: Screen
    utilizationRate: number
    totalShows: number
  }>
  dailyStats: Array<{
    date: string
    revenue: number
    tickets: number
  }>
}

export default function StaffReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [movies, setMovies] = useState<Movie[]>([])
  const [screens, setScreens] = useState<Screen[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [showtimes, setShowtimes] = useState<Showtime[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState<string>("week")

  useEffect(() => {
    fetchData()
  }, [dateRange])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch all data in parallel
      const [ticketsResponse, moviesResponse, screensResponse, showtimesResponse] = await Promise.all([
        ticketsApi.getTickets(),
        moviesApi.getMovies(),
        screensApi.getScreens(),
        showtimesApi.getShowtimes()
      ])
      
      if (ticketsResponse.data) setTickets(ticketsResponse.data)
      if (moviesResponse.data) setMovies(moviesResponse.data)
      if (screensResponse.data) setScreens(screensResponse.data)
      if (showtimesResponse.data) setShowtimes(showtimesResponse.data)
      
    } catch (error) {
      console.error("An error occurred while fetching data", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate report data
  useEffect(() => {
    if (tickets.length > 0 && movies.length > 0 && screens.length > 0 && showtimes.length > 0) {
      calculateReportData()
    }
  }, [tickets, movies, screens, showtimes, dateRange])

  const calculateReportData = () => {
    // Filter tickets based on date range
    const now = new Date()
    const filteredTickets = tickets.filter(ticket => {
      const ticketDate = new Date(ticket.purchaseDate)
      const daysDiff = Math.floor((now.getTime() - ticketDate.getTime()) / (1000 * 60 * 60 * 24))
      
      switch (dateRange) {
        case "today":
          return daysDiff === 0
        case "week":
          return daysDiff <= 7
        case "month":
          return daysDiff <= 30
        case "year":
          return daysDiff <= 365
        default:
          return true
      }
    })

    // Calculate basic stats
    const totalRevenue = filteredTickets.reduce((sum, ticket) => sum + ticket.price, 0)
    const totalTickets = filteredTickets.length
    const averageTicketPrice = totalTickets > 0 ? totalRevenue / totalTickets : 0

    // Calculate popular movies
    const movieStats = new Map<string, { ticketCount: number; revenue: number }>()
    filteredTickets.forEach(ticket => {
      const showtime = showtimes.find(s => s.id === ticket.showtimeId)
      if (showtime) {
        const movieId = showtime.movieId
        const current = movieStats.get(movieId) || { ticketCount: 0, revenue: 0 }
        movieStats.set(movieId, {
          ticketCount: current.ticketCount + 1,
          revenue: current.revenue + ticket.price
        })
      }
    })

    const popularMovies = Array.from(movieStats.entries())
      .map(([movieId, stats]) => ({
        movie: movies.find(m => m.id === movieId)!,
        ...stats
      }))
      .filter(item => item.movie)
      .sort((a, b) => b.ticketCount - a.ticketCount)
      .slice(0, 5)

    // Calculate screen utilization
    const screenStats = new Map<string, { totalShows: number }>()
    showtimes.forEach(showtime => {
      const current = screenStats.get(showtime.screenId) || { totalShows: 0 }
      screenStats.set(showtime.screenId, {
        totalShows: current.totalShows + 1
      })
    })

    const maxShows = Math.max(...Array.from(screenStats.values()).map(s => s.totalShows))
    const screenUtilization = Array.from(screenStats.entries())
      .map(([screenId, stats]) => ({
        screen: screens.find(s => s.id === screenId)!,
        utilizationRate: maxShows > 0 ? (stats.totalShows / maxShows) * 100 : 0,
        totalShows: stats.totalShows
      }))
      .filter(item => item.screen)
      .sort((a, b) => b.utilizationRate - a.utilizationRate)

    // Calculate daily stats for the past week
    const dailyStats = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayTickets = tickets.filter(ticket => {
        if (!ticket.purchaseDate) return false
        const ticketDateStr = typeof ticket.purchaseDate === 'string' 
          ? ticket.purchaseDate.split('T')[0]
          : new Date(ticket.purchaseDate).toISOString().split('T')[0]
        return ticketDateStr === dateStr
      })
      
      dailyStats.push({
        date: dateStr,
        revenue: dayTickets.reduce((sum, ticket) => sum + ticket.price, 0),
        tickets: dayTickets.length
      })
    }

    setReportData({
      totalRevenue,
      totalTickets,
      averageTicketPrice,
      popularMovies,
      screenUtilization,
      dailyStats
    })
  }

  const exportReport = () => {
    if (!reportData) return
    
    const reportContent = `
Cinema Staff Report - ${new Date().toLocaleDateString()}
Date Range: ${dateRange}

SUMMARY:
- Total Revenue: $${reportData.totalRevenue.toFixed(2)}
- Total Tickets Sold: ${reportData.totalTickets}
- Average Ticket Price: $${reportData.averageTicketPrice.toFixed(2)}

POPULAR MOVIES:
${reportData.popularMovies.map((item, index) => 
  `${index + 1}. ${item.movie.title} - ${item.ticketCount} tickets, $${item.revenue.toFixed(2)}`
).join('\n')}

SCREEN UTILIZATION:
${reportData.screenUtilization.map((item, index) => 
  `${index + 1}. ${item.screen.name} - ${item.utilizationRate.toFixed(1)}% (${item.totalShows} shows)`
).join('\n')}
    `.trim()

    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `staff-report-${dateRange}-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-zinc-600 dark:text-zinc-400">Loading reports...</div>
        </div>
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
          <div className="text-lg text-zinc-600 dark:text-zinc-400">No data available</div>
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
                Staff Reports
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                Performance insights and operational analytics
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="pl-10 pr-8 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              <button
                onClick={exportReport}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                ${reportData.totalRevenue.toFixed(2)}
              </div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Total Revenue
              </div>
            </div>
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                {reportData.totalTickets}
              </div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Tickets Sold
              </div>
            </div>
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                ${reportData.averageTicketPrice.toFixed(2)}
              </div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Avg. Ticket Price
              </div>
            </div>
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Movies */}
        <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Film className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Popular Movies
            </h3>
          </div>
          <div className="space-y-4">
            {reportData.popularMovies.map((item, index) => (
              <div key={item.movie.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-zinc-900 dark:text-white">
                      {item.movie.title}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {item.ticketCount} tickets
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600 dark:text-green-400">
                    ${item.revenue.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Screen Utilization */}
        <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 p-6">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Screen Utilization
            </h3>
          </div>
          <div className="space-y-4">
            {reportData.screenUtilization.map((item, index) => (
              <div key={item.screen.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-zinc-900 dark:text-white">
                    {item.screen.name}
                  </div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    {item.utilizationRate.toFixed(1)}%
                  </div>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.utilizationRate}%` }}
                  />
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {item.totalShows} shows scheduled
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Performance */}
      <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Daily Performance (Last 7 Days)
          </h3>
        </div>
        <div className="space-y-4">
          {reportData.dailyStats.map((day, index) => (
            <div key={day.date} className="flex items-center justify-between p-4 rounded-lg bg-zinc-50 dark:bg-zinc-700/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  {new Date(day.date).getDate()}
                </div>
                <div>
                  <div className="font-medium text-zinc-900 dark:text-white">
                    {new Date(day.date).toLocaleDateString('en-us', { weekday: 'long' })}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    {new Date(day.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-600 dark:text-green-400">
                  ${day.revenue.toFixed(2)}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {day.tickets} tickets
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

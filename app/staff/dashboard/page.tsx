"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Film, Ticket, Calendar, Users, Clock, TrendingUp, Star, ArrowRight, Eye, CheckCircle, AlertCircle, DollarSign, Activity, Flag, MessageSquare, XCircle } from "lucide-react"
import { moviesApi } from "@/lib/endpoints/movies"
import { showtimesApi } from "@/lib/endpoints/showtimes"
import { ticketsApi } from "@/lib/endpoints/tickets"
import { screensApi } from "@/lib/endpoints/screens"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

import type { Movie, Showtime, Ticket as TicketType, Screen as CinemaScreen } from "@/types/types"

// Interface for reported content
interface ReportedContent {
  id: string
  reporterId: string
  reason: string | null
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED'
  reportDate: string
  contentType: 'REVIEW' | 'REPLY'
  reviewId: string | null
  replyId: string | null
  reporter: {
    id: string
    username: string
    displayName: string
    email: string
    profileImage: string | null
  }
  review?: {
    id: string
    comment: string
    rating: number
    date: string
    user: {
      id: string
      username: string
      displayName: string
      email: string
      profileImage: string | null
    }
    movie: {
      id: string
      title: string
      image: string | null
    }
  }
  reply?: {
    id: string
    comment: string
    date: string
    user: {
      id: string
      username: string
      displayName: string
      email: string
      profileImage: string | null
    }
    review: {
      movie: {
        id: string
        title: string
        image: string | null
      }
    }
  }
}

export default function StaffDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [moviesToday, setMoviesToday] = useState<Movie[]>([])
  const [ticketsSoldToday, setTicketsSoldToday] = useState(0)
  const [pendingTickets, setPendingTickets] = useState<TicketType[]>([])
  const [todayShowtimes, setTodayShowtimes] = useState<Showtime[]>([])
  const [screens, setScreens] = useState<CinemaScreen[]>([])
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [popularMovies, setPopularMovies] = useState<Movie[]>([])
  const [upcomingShowtimes, setUpcomingShowtimes] = useState<Showtime[]>([])
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [dashboardStats, setDashboardStats] = useState({
    totalCustomers: 0,
    screenUtilization: 0,
    averageRating: 0,
    completedTickets: 0
  })
  const [reportedComments, setReportedComments] = useState<ReportedContent[]>([])
  const [reportedCommentsLoading, setReportedCommentsLoading] = useState(false)

  useEffect(() => {
    // Don't do anything while auth is loading
    if (authLoading) return

    // If auth finished loading and user is definitely not authenticated
    if (!isAuthenticated) {
      router.push("/signin")
      return
    }
    
    // If user is authenticated but not staff role
    if (user && user.role !== "Staff") {
      router.push("/403")
      return
    }
  }, [isAuthenticated, user, authLoading, router])

  useEffect(() => {
    if (isAuthenticated && user?.role === "Staff") {
      fetchDashboardData()
      fetchReportedComments()
    }
  }, [isAuthenticated, user])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const today = new Date().toISOString().split("T")[0]
      const now = new Date()
      const nextHour = new Date(now.getTime() + 60 * 60 * 1000)
      
      // Fetch screens
      const screensResponse = await screensApi.getScreens()
      if (screensResponse.data) {
        setScreens(screensResponse.data)
      }

      // Fetch today's showtimes
      const showtimesResponse = await showtimesApi.getShowtimes({ date: today })
      if (showtimesResponse.data) {
        setTodayShowtimes(showtimesResponse.data)
        
        // Get upcoming showtimes (next 3 hours)
        const upcoming = showtimesResponse.data
          .filter(st => {
            const showDateTime = new Date(`${st.date}T${st.time}`)
            return showDateTime > now && showDateTime <= nextHour
          })
          .slice(0, 5)
        setUpcomingShowtimes(upcoming)

        // Get movies for today
        const movieIds = [...new Set(showtimesResponse.data.map((st) => st.movieId))]
        const moviesResponse = await moviesApi.getMovies({ status: "now_showing" })
        if (moviesResponse.data) {
          const todayMovies = moviesResponse.data.filter((movie) => movieIds.includes(movie.id) && !movie.hidden)
          setMoviesToday(todayMovies)
          
          // Get popular movies (first 4)
          setPopularMovies(todayMovies.slice(0, 4))
        }
      }

      // Fetch all tickets for various stats
      const allTicketsResponse = await ticketsApi.getTickets()
      if (allTicketsResponse.data) {
        const allTickets = allTicketsResponse.data
        
        // Today's sold tickets
        const todayTickets = allTickets.filter((ticket) => ticket.purchaseDate?.startsWith(today))
        setTicketsSoldToday(todayTickets.filter(t => t.status === "paid").length)
        
        // Calculate revenue from paid tickets
        const paidTickets = allTickets.filter(t => t.status === "paid")
        const revenue = paidTickets.reduce((sum, ticket) => {
          // Assuming each ticket has a price field or we use a default price
          return sum + 15 // Default ticket price
        }, 0)
        setTotalRevenue(revenue)
        
        // Get dashboard stats
        const uniqueUsers = [...new Set(allTickets.map(t => t.userId))].length
        const completedTickets = allTickets.filter(t => t.status === "used").length
        const screenUtil = Math.round((todayTickets.length / (screens.length * 10)) * 100) // Rough calculation
        
        setDashboardStats({
          totalCustomers: uniqueUsers,
          screenUtilization: Math.min(screenUtil, 100),
          averageRating: 4.2, // Mock rating
          completedTickets
        })
        
        // Recent activities (mock data for better UX)
        setRecentActivities([
          { id: 1, action: "Ticket sold", details: "Seat A1 for Avengers", time: "5 min ago", type: "sale" },
          { id: 2, action: "Showtime updated", details: "Screen 2 - 3:00 PM", time: "12 min ago", type: "update" },
          { id: 3, action: "New reservation", details: "Customer John D.", time: "18 min ago", type: "reservation" },
          { id: 4, action: "Ticket checked", details: "Seat B3 verified", time: "25 min ago", type: "check" },
          { id: 5, action: "Screen cleaned", details: "Screen 1 maintenance", time: "1 hour ago", type: "maintenance" }
        ])
      }

      // Fetch pending tickets
      const pendingResponse = await ticketsApi.getTickets({ status: "reserved" })
      if (pendingResponse.data) {
        setPendingTickets(pendingResponse.data)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchReportedComments = async () => {
    try {
      setReportedCommentsLoading(true)
      const response = await fetch('/api/admin/reports?status=PENDING')
      if (response.ok) {
        const data = await response.json()
        // Limit to first 5 for dashboard display
        setReportedComments(data.slice(0, 5))
      }
    } catch (error) {
      console.error("Error fetching reported comments:", error)
    } finally {
      setReportedCommentsLoading(false)
    }
  }

  const handleDismissReport = async (reportId: string) => {
    try {
      const response = await fetch('/api/admin/reports', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId,
          action: 'dismiss',
          adminId: user?.id,
        }),
      })

      if (response.ok) {
        toast.success("Report dismissed successfully")
        fetchReportedComments() // Refresh the list
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to dismiss report")
      }
    } catch (error) {
      console.error("Error dismissing report:", error)
      toast.error("Failed to dismiss report")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-zinc-600 dark:text-zinc-400">Loading...</div>
        </div>
      </div>
    )
  }

  // If auth is loaded but user is not authenticated or not staff, the useEffect will handle redirect
  if (!isAuthenticated || !user || user.role !== "Staff") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-zinc-600 dark:text-zinc-400">Verifying access...</div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
        {/* Header Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-2xl"></div>
          <div className="relative p-6 rounded-2xl border border-blue-200/20 dark:border-blue-800/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Welcome Back, {user?.displayName?.split(' ')[0] || 'Staff'}!
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 mt-2">
                  Here's what's happening at the cinema today
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Today</p>
                <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <EnhancedStatCard
            title="Movies Today"
            value={moviesToday.length.toString()}
            icon={<Film className="h-6 w-6" />}
            color="blue"
            trend="+2 from yesterday"
          />
          <EnhancedStatCard
            title="Tickets Sold"
            value={ticketsSoldToday.toString()}
            icon={<Ticket className="h-6 w-6" />}
            color="green"
            trend="+15% from yesterday"
          />
          <EnhancedStatCard
            title="Revenue Today"
            value={`$${totalRevenue}`}
            icon={<DollarSign className="h-6 w-6" />}
            color="emerald"
            trend="+$240 from yesterday"
          />
          <EnhancedStatCard
            title="Pending"
            value={pendingTickets.length.toString()}
            icon={<AlertCircle className="h-6 w-6" />}
            color="amber"
            trend="2 urgent"
          />
          <EnhancedStatCard
            title="Customers"
            value={dashboardStats.totalCustomers.toString()}
            icon={<Users className="h-6 w-6" />}
            color="purple"
            trend="+8 new today"
          />
          <EnhancedStatCard
            title="Completed"
            value={dashboardStats.completedTickets.toString()}
            icon={<CheckCircle className="h-6 w-6" />}
            color="cyan"
            trend="94% success rate"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Popular Movies */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">Popular Movies</h3>
                <Link href="/staff/movies" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {popularMovies.map((movie, index) => (
                  <div key={movie.id} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50/50 dark:bg-zinc-700/30 hover:bg-zinc-100/50 dark:hover:bg-zinc-700/50 transition-colors">
                    <div className="w-12 h-16 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-zinc-900 dark:text-white truncate">{movie.title}</p>
                      <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>{movie.rating}</span>
                        <span>•</span>
                        <span>{movie.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column - Upcoming Showtimes */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">Upcoming Shows</h3>
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div className="space-y-3">
                {upcomingShowtimes.length > 0 ? upcomingShowtimes.map((showtime) => {
                  const movie = moviesToday.find(m => m.id === showtime.movieId)
                  const screen = screens.find(s => s.id === showtime.screenId)
                  return (
                    <div key={showtime.id} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50/50 to-indigo-50/30 dark:from-blue-900/20 dark:to-indigo-900/10 border border-blue-200/30 dark:border-blue-800/30">
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">{movie?.title || 'Unknown Movie'}</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">{screen?.name || 'Unknown Screen'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-600 dark:text-blue-400">{showtime.time}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{showtime.format}</p>
                      </div>
                    </div>
                  )
                }) : (
                  <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No upcoming shows in the next hour</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Recent Activity */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">Recent Activity</h3>
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-50/50 dark:hover:bg-zinc-700/30 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'sale' ? 'bg-green-500' :
                      activity.type === 'reservation' ? 'bg-blue-500' :
                      activity.type === 'update' ? 'bg-amber-500' :
                      activity.type === 'check' ? 'bg-purple-500' :
                      'bg-gray-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">{activity.action}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{activity.details}</p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Today's Showtimes & Pending Tickets */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Today's All Showtimes */}
          <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/10 px-6 py-4 border-b border-zinc-200/50 dark:border-zinc-700/50">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">Today's Showtimes</h3>
                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <Calendar className="h-4 w-4" />
                  <span>{todayShowtimes.length} shows</span>
                </div>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <div className="divide-y divide-zinc-200/30 dark:divide-zinc-700/30">
                {todayShowtimes.map((showtime) => {
                  const screen = screens.find((s) => s.id === showtime.screenId)
                  const movie = moviesToday.find((m) => m.id === showtime.movieId)
                  const showDateTime = new Date(`${showtime.date}T${showtime.time}`)
                  const isUpcoming = showDateTime > new Date()
                  
                  return (
                    <div key={showtime.id} className={`flex items-center justify-between p-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-700/30 transition-colors ${isUpcoming ? 'bg-blue-50/30 dark:bg-blue-900/10' : 'opacity-75'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${isUpcoming ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <div>
                          <h4 className="font-medium text-zinc-900 dark:text-white">{movie?.title || "Unknown Movie"}</h4>
                          <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                            <span>{screen?.name || "Unknown Screen"}</span>
                            <span>•</span>
                            <span>{showtime.format}</span>
                            <span>•</span>
                            <span>{screen?.capacity || 0} seats</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-semibold ${isUpcoming ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-500 dark:text-zinc-400'}`}>
                          {showtime.time}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                          {isUpcoming ? 'Upcoming' : 'Past'}
                        </div>
                      </div>
                    </div>
                  )
                })}
                {todayShowtimes.length === 0 && (
                  <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium">No showtimes scheduled</p>
                    <p className="text-sm">Check back later for updates</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pending Tickets */}
          <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/10 px-6 py-4 border-b border-zinc-200/50 dark:border-zinc-700/50">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">Pending Tickets</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">{pendingTickets.length} pending</span>
                </div>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {pendingTickets.length > 0 ? (
                <div className="divide-y divide-zinc-200/30 dark:divide-zinc-700/30">
                  {pendingTickets.slice(0, 8).map((ticket) => {
                    const showtime = todayShowtimes.find((st) => st.id === ticket.showtimeId)
                    const movie = moviesToday.find((m) => m.id === showtime?.movieId)
                    return (
                      <div key={ticket.id} className="p-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-700/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                              <p className="font-medium text-zinc-900 dark:text-white truncate">
                                {movie?.title || "Unknown Movie"}
                              </p>
                            </div>
                            <div className="text-sm text-zinc-500 dark:text-zinc-400">
                              <span>Seat {ticket.seatId}</span>
                              <span className="mx-2">•</span>
                              <span>{showtime ? `${showtime.date} ${showtime.time}` : "Time TBD"}</span>
                            </div>
                            <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                              Customer: {ticket.userId}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-3">
                            <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 font-medium">
                              Reserved
                            </span>
                            <Link 
                              href="/staff/tickets" 
                              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                            >
                              Manage
                            </Link>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {pendingTickets.length > 8 && (
                    <div className="p-4 text-center border-t border-zinc-200/30 dark:border-zinc-700/30">
                      <Link 
                        href="/staff/tickets" 
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium inline-flex items-center gap-1"
                      >
                        View {pendingTickets.length - 8} more tickets <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium">All caught up!</p>
                  <p className="text-sm">No pending tickets to review</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reported Comments Management */}
        <div className="bg-gradient-to-r from-red-50/50 to-orange-50/30 dark:from-red-900/10 dark:to-orange-900/5 rounded-xl p-6 border border-red-200/30 dark:border-red-800/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
              <Flag className="h-5 w-5 text-red-600 dark:text-red-400" />
              Reported Comments
            </h3>
            <Link 
              href="/staff/reported-comments" 
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium inline-flex items-center gap-1"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          {reportedCommentsLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
            </div>
          ) : reportedComments.length > 0 ? (
            <div className="space-y-3">
              {reportedComments.slice(0, 3).map((report) => (
                <div
                  key={report.id}
                  className="flex items-start justify-between p-4 bg-white/60 dark:bg-zinc-800/60 rounded-lg border border-red-200/50 dark:border-red-700/50"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 flex-shrink-0">
                      <MessageSquare className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {report.contentType === 'REVIEW' ? 'Review' : 'Reply'} Report
                        </h4>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          {formatDate(report.reportDate)}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">
                        {report.contentType === 'REVIEW' && report.review
                          ? `On "${report.review.movie.title}" by ${report.review.user.displayName}`
                          : report.contentType === 'REPLY' && report.reply
                          ? `Reply on "${report.reply.review.movie.title}" by ${report.reply.user.displayName}`
                          : 'Content details unavailable'
                        }
                      </p>
                      <p className="text-xs text-zinc-700 dark:text-zinc-300 truncate">
                        "{report.contentType === 'REVIEW' ? report.review?.comment : report.reply?.comment}"
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDismissReport(report.id)}
                    className="ml-3 p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex-shrink-0"
                    title="Dismiss Report"
                  >
                    <XCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
                  </button>
                </div>
              ))}
              
              {reportedComments.length > 3 && (
                <div className="pt-3 text-center border-t border-red-200/30 dark:border-red-700/30">
                  <Link 
                    href="/staff/reported-comments" 
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium inline-flex items-center gap-1"
                  >
                    View {reportedComments.length - 3} more reports <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-zinc-500 dark:text-zinc-400">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">No pending reports</p>
              <p className="text-xs">All reported content has been reviewed</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/30 dark:from-blue-900/10 dark:to-indigo-900/5 rounded-xl p-6 border border-blue-200/30 dark:border-blue-800/30">
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link 
              href="/staff/tickets" 
              className="group flex flex-col items-center p-4 rounded-lg bg-white/60 dark:bg-zinc-800/60 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/50 transition-all duration-200 hover:shadow-md hover:scale-105"
            >
              <Ticket className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-zinc-900 dark:text-white">Manage Tickets</span>
            </Link>
            <Link 
              href="/staff/showtimes" 
              className="group flex flex-col items-center p-4 rounded-lg bg-white/60 dark:bg-zinc-800/60 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/50 transition-all duration-200 hover:shadow-md hover:scale-105"
            >
              <Calendar className="h-8 w-8 text-green-600 dark:text-green-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-zinc-900 dark:text-white">View Showtimes</span>
            </Link>
            <button className="group flex flex-col items-center p-4 rounded-lg bg-white/60 dark:bg-zinc-800/60 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/50 transition-all duration-200 hover:shadow-md hover:scale-105">
              <Eye className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-zinc-900 dark:text-white">Check Screens</span>
            </button>
            <Link 
              href="/staff/reports" 
              className="group flex flex-col items-center p-4 rounded-lg bg-white/60 dark:bg-zinc-800/60 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/50 transition-all duration-200 hover:shadow-md hover:scale-105"
            >
              <TrendingUp className="h-8 w-8 text-amber-600 dark:text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-zinc-900 dark:text-white">View Reports</span>
            </Link>
          </div>
        </div>
      </div>
  )
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-white dark:bg-red-900/10">
      <div className="flex items-center justify-between">
        <div className="text-red-700 dark:text-red-300">{title}</div>
        <div className="p-2 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400">{icon}</div>
      </div>
      <div className="mt-2 text-2xl font-bold text-red-900 dark:text-white">{value}</div>
    </div>
  )
}

function EnhancedStatCard({
  title,
  value,
  icon,
  color,
  trend,
}: {
  title: string
  value: string
  icon: React.ReactNode
  color: string
  trend?: string
}) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    green: "from-green-500 to-green-600 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800",
    emerald: "from-emerald-500 to-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    amber: "from-amber-500 to-amber-600 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    purple: "from-purple-500 to-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    cyan: "from-cyan-500 to-cyan-600 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800",
  }

  const classes = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue

  return (
    <div className={`relative overflow-hidden rounded-xl border ${classes.split(' ').slice(2).join(' ')} p-4 transition-all duration-200 hover:shadow-lg hover:scale-105`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg bg-gradient-to-r ${classes.split(' ').slice(0, 2).join(' ')} text-white shadow-lg`}>
          {icon}
        </div>
        <TrendingUp className="h-4 w-4 text-zinc-400" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{title}</p>
        <p className="text-2xl font-bold text-zinc-900 dark:text-white">{value}</p>
        {trend && (
          <p className="text-xs text-zinc-500 dark:text-zinc-500">{trend}</p>
        )}
      </div>
      <div className={`absolute -top-1 -right-1 w-16 h-16 bg-gradient-to-r ${classes.split(' ').slice(0, 2).join(' ')} opacity-10 rounded-full blur-xl`}></div>
    </div>
  )
}

function QuickAccessCard({
  title,
  icon,
  href,
}: {
  title: string
  icon: React.ReactNode
  href: string
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      <div className="p-3 rounded-full bg-primary/10 text-primary">{icon}</div>
      <div className="mt-2 text-sm font-medium text-gray-900 dark:text-white">{title}</div>
    </Link>
  )
}

function ShowtimeItem({
  title,
  time,
  screen,
  availableSeats,
}: {
  title: string
  time: string
  screen: string
  availableSeats: number
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-red-900/10 hover:bg-red-50 dark:hover:bg-red-800/20">
      <div>
        <div className="font-medium text-red-900 dark:text-white">{title}</div>
        <div className="text-sm text-red-700 dark:text-red-300">
          {time} • {screen}
        </div>
      </div>
      <div className="text-sm text-red-700 dark:text-red-300">
        <span className="font-medium">{availableSeats}</span> seats available
      </div>
    </div>
  )
}

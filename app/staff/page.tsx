"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Film, Ticket, Calendar } from "lucide-react"
import { moviesApi } from "@/lib/endpoints/movies"
import { showtimesApi } from "@/lib/endpoints/showtimes"
import { ticketsApi } from "@/lib/endpoints/tickets"
import { screensApi } from "@/lib/endpoints/screens"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

import type { Movie, Showtime, Ticket as TicketType, Screen as CinemaScreen } from "@/types/types"
import { DashboardLayout } from "@/components/dashboared-layout"

export default function StaffDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [moviesToday, setMoviesToday] = useState<Movie[]>([])
  const [ticketsSoldToday, setTicketsSoldToday] = useState(0)
  const [pendingTickets, setPendingTickets] = useState<TicketType[]>([])
  const [todayShowtimes, setTodayShowtimes] = useState<Showtime[]>([])
  const [screens, setScreens] = useState<CinemaScreen[]>([])

  useEffect(() => {
    // Redirect if not authenticated or not staff
    if (!authLoading && (!isAuthenticated || user?.role !== "Staff")) {
      router.push("/403")
      return
    }
  }, [isAuthenticated, user, authLoading, router])

  useEffect(() => {
    if (isAuthenticated && user?.role === "Staff") {
      fetchDashboardData()
    }
  }, [isAuthenticated, user])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const today = new Date().toISOString().split("T")[0]
      const screensResponse = await screensApi.getScreens()
      if (screensResponse.data) {
        setScreens(screensResponse.data)
      }

      const showtimesResponse = await showtimesApi.getShowtimes({ date: today })
      if (showtimesResponse.data) {
        const movieIds = [...new Set(showtimesResponse.data.map((st) => st.movieId))]
        const moviesResponse = await moviesApi.getMovies({ status: "now_showing" })
        if (moviesResponse.data) {
          const todayMovies = moviesResponse.data.filter((movie) => movieIds.includes(movie.id) && !movie.hidden)
          setMoviesToday(todayMovies)
        }
        setTodayShowtimes(showtimesResponse.data)
      }

      const ticketsResponse = await ticketsApi.getTickets({ status: "paid" })
      if (ticketsResponse.data) {
        const todayTickets = ticketsResponse.data.filter((ticket) => ticket.purchaseDate?.startsWith(today))
        setTicketsSoldToday(todayTickets.length)
      }

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

  if (authLoading || !isAuthenticated || user?.role !== "Staff") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <DashboardLayout userRole="Staff" userName={user?.displayName || user?.username}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading dashboard data...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="Staff" userName={user?.displayName || user?.username} userImage={user?.profileImage}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Staff Dashboard</h1>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Movies Showing Today"
            value={moviesToday.length.toString()}
            icon={<Film className="h-5 w-5" />}
          />
          <StatCard
            title="Tickets Sold Today"
            value={ticketsSoldToday.toString()}
            icon={<Ticket className="h-5 w-5" />}
          />
          <StatCard
            title="Pending Tickets"
            value={pendingTickets.length.toString()}
            icon={<Calendar className="h-5 w-5" />}
          />
        </div>

        {/* Today's Showtimes */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-800">
          <div className="bg-zinc-50 dark:bg-zinc-800/50 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="font-medium text-zinc-900 dark:text-white">Today's Showtimes</h2>
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {todayShowtimes.map((showtime) => {
              const screen = screens.find((s) => s.id === showtime.screenId)
              const movie = moviesToday.find((m) => m.id === showtime.movieId)
              return (
                <ShowtimeItem
                  key={showtime.id}
                  title={movie?.title || "Unknown Movie"}
                  time={showtime.time}
                  screen={screen?.name || "Unknown Screen"}
                  availableSeats={screen?.capacity || 0}
                />
              )
            })}
            {todayShowtimes.length === 0 && (
              <div className="p-4 text-center text-zinc-600 dark:text-zinc-400">No showtimes scheduled for today</div>
            )}
          </div>
        </div>

        {/* Pending tickets */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-800">
          <div className="bg-zinc-50 dark:bg-zinc-800/50 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="font-medium text-zinc-900 dark:text-white">Pending Tickets</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Ticket ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">Movie</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">Showtime</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">Seat</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingTickets.map((ticket) => {
                  const showtime = todayShowtimes.find((st) => st.id === ticket.showtimeId)
                  const movie = moviesToday.find((m) => m.id === showtime?.movieId)
                  return (
                    <tr key={ticket.id} className="border-b border-zinc-200 dark:border-zinc-800">
                      <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">{ticket.id}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{ticket.userId}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                        {movie?.title || "Unknown Movie"}
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                        {showtime ? `${showtime.date} at ${showtime.time}` : "Unknown Time"}
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{ticket.seatId}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                          Reserved
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Link href="/staff/tickets" className="text-red-600 hover:underline dark:text-red-400">
                          Manage
                        </Link>
                      </td>
                    </tr>
                  )
                })}
                {pendingTickets.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-zinc-600 dark:text-zinc-400">
                      No pending tickets
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
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
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-800">
      <div className="flex items-center justify-between">
        <div className="text-zinc-600 dark:text-zinc-400">{title}</div>
        <div className="p-2 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">{icon}</div>
      </div>
      <div className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">{value}</div>
    </div>
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
    <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/50">
      <div>
        <div className="font-medium text-zinc-900 dark:text-white">{title}</div>
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          {time} • {screen}
        </div>
      </div>
      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        <span className="font-medium">{availableSeats}</span> seats available
      </div>
    </div>
  )
}

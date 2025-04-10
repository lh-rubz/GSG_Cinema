"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Film, Ticket, Calendar } from "lucide-react"
import { moviesApi } from "@/lib/endpoints/movies"
import { showtimesApi } from "@/lib/endpoints/showtimes"
import { ticketsApi } from "@/lib/endpoints/tickets"
import type { Movie, Showtime, Ticket as TicketType, Screen as CinemaScreen } from "@/types/types"
import { screensApi } from "@/lib/endpoints/screens"

export default function StaffDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [moviesToday, setMoviesToday] = useState<Movie[]>([])
  const [ticketsSoldToday, setTicketsSoldToday] = useState(0)
  const [pendingTickets, setPendingTickets] = useState<TicketType[]>([])
  const [todayShowtimes, setTodayShowtimes] = useState<Showtime[]>([])
  const [screens, setScreens] = useState<CinemaScreen[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const today = new Date().toISOString().split('T')[0]
      const screensResponse = await screensApi.getScreens()
      if (screensResponse.data) {
        setScreens(screensResponse.data)
      }

      const showtimesResponse = await showtimesApi.getShowtimes({ date: today })
      if (showtimesResponse.data) {
        const movieIds = [...new Set(showtimesResponse.data.map(st => st.movieId))]
        const moviesResponse = await moviesApi.getMovies({ status: "now_showing" })
        if (moviesResponse.data) {
          const todayMovies = moviesResponse.data.filter(movie => 
            movieIds.includes(movie.id) && !movie.hidden
          )
          setMoviesToday(todayMovies)
        }
        setTodayShowtimes(showtimesResponse.data)
      }

      const ticketsResponse = await ticketsApi.getTickets({ status: "paid" })
      if (ticketsResponse.data) {
        const todayTickets = ticketsResponse.data.filter(ticket => 
          ticket.purchaseDate.startsWith(today)
        )
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Staff Dashboard</h1>
        <div className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Movies Showing Today" value={moviesToday.length.toString()} icon={<Film className="h-5 w-5" />} />
        <StatCard title="Tickets Sold Today" value={ticketsSoldToday.toString()} icon={<Ticket className="h-5 w-5" />} />
        <StatCard title="Pending Tickets" value={pendingTickets.length.toString()} icon={<Calendar className="h-5 w-5" />} />
      </div>

      {/* Quick access */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3 border-b border-border">
            <h2 className="font-medium">Quick Access</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 p-4">
            <QuickAccessCard title="Movies" icon={<Film className="h-6 w-6" />} href="/staff/movies" />
            <QuickAccessCard title="Tickets" icon={<Ticket className="h-6 w-6" />} href="/staff/tickets" />
          </div>
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3 border-b border-border">
            <h2 className="font-medium">Today's Showtimes</h2>
          </div>
          <div className="divide-y divide-border">
            {todayShowtimes.map((showtime) => {
              const screen = screens.find(s => s.id === showtime.screenId);
              return (
                <ShowtimeItem
                  key={showtime.id}
                  title={moviesToday.find(m => m.id === showtime.movieId)?.title || "Unknown Movie"}
                  time={showtime.time}
                  screen={screen?.name || "Unknown Screen"}
                  availableSeats={screen?.capacity || 0}
                />
              );
            })}
            {todayShowtimes.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">
                No showtimes scheduled for today
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pending tickets */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="bg-muted px-4 py-3 border-b border-border">
          <h2 className="font-medium">Pending Tickets</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium">Ticket ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Movie</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Showtime</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Seat</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingTickets.map((ticket) => {
                const showtime = todayShowtimes.find(st => st.id === ticket.showtimeId)
                const movie = moviesToday.find(m => m.id === showtime?.movieId)
                return (
                  <tr key={ticket.id} className="border-b border-border">
                    <td className="px-4 py-3 text-sm">{ticket.id}</td>
                    <td className="px-4 py-3 text-sm">{ticket.userId}</td>
                    <td className="px-4 py-3 text-sm">{movie?.title || "Unknown Movie"}</td>
                    <td className="px-4 py-3 text-sm">{showtime ? `${showtime.date} at ${showtime.time}` : "Unknown Time"}</td>
                    <td className="px-4 py-3 text-sm">{ticket.seatId}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                        Reserved
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Link href="/staff/tickets" className="text-primary hover:underline">
                        Manage
                      </Link>
                    </td>
                  </tr>
                )
              })}
              {pendingTickets.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No pending tickets
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
    <div className="border border-border rounded-lg p-4 bg-card">
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground">{title}</div>
        <div className="p-2 rounded-full bg-primary/10 text-primary">{icon}</div>
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
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
      className="flex flex-col items-center justify-center p-4 border border-border rounded-lg hover:bg-secondary transition-colors"
    >
      <div className="p-3 rounded-full bg-primary/10 text-primary">{icon}</div>
      <div className="mt-2 text-sm font-medium">{title}</div>
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
    <div className="flex items-center justify-between p-4">
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">
          {time} • {screen}
        </div>
      </div>
      <div className="text-sm">
        <span className="font-medium">{availableSeats}</span> seats available
      </div>
    </div>
  )
}


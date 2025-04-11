'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Film, Users, User, Video, Cast, MonitorPlay, Ticket, TrendingUp, AlertCircle, Calendar } from 'lucide-react'
import { moviesApi } from "@/lib/endpoints/movies"
import { statsApi } from "@/lib/endpoints/stats"

import type { Movie, Director } from "@/types/types"
import type { Stats } from "@/lib/endpoints/stats"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import LoadingFull from "@/components/loading-full"

interface MovieWithDirector extends Movie {
  director?: Director;
}

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalMovies: 0,
    activeCustomers: 0,
    ticketsSold: 0,
    revenue: 0,
    ticketsTrend: 0,
    revenueTrend: 0
  })
  const [upcomingMovies, setUpcomingMovies] = useState<MovieWithDirector[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== 'Admin')) {
      router.push('/403')
      return
    }
  }, [isAuthenticated, user, authLoading, router])

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        const statsResponse = await statsApi.getStats()
        if (statsResponse.error) {
          console.error('Error fetching stats:', statsResponse.error)
          setError(statsResponse.error)
        } else {
          setStats(statsResponse.data || {
            totalMovies: 0,
            activeCustomers: 0,
            ticketsSold: 0,
            revenue: 0,
            ticketsTrend: 0,
            revenueTrend: 0
          })
        }
        
        const moviesResponse = await moviesApi.getMovies({ status: 'coming_soon' })
        if (moviesResponse.error) {
          console.error('Error fetching upcoming movies:', moviesResponse.error)
          setError(moviesResponse.error)
        } else {
          setUpcomingMovies(moviesResponse.data || [])
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }
    
    if (isAuthenticated && user?.role === 'Admin') {
      fetchData()
    }
  }, [isAuthenticated, user])

  if (authLoading || (!isAuthenticated || user?.role !== 'Admin')) {
    return (
      <LoadingFull />
    )
  }

  if (loading) {
    return (
      <LoadingFull text="Loading Admin Dashboard" />
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Dashboard</h1>
        <div className="text-sm text-zinc-500 dark:text-zinc-400">Last updated: {new Date().toLocaleDateString()}</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Movies"
          value={stats.totalMovies.toString()}
          icon={<Film className="h-5 w-5" />}
          trend="+12% from last month"
          trendUp={true}
        />
        <StatCard
          title="Active Customers"
          value={stats.activeCustomers.toString()}
          icon={<User className="h-5 w-5" />}
          trend="+8% from last month"
          trendUp={true}
        />
        <StatCard
          title="Tickets Sold"
          value={stats.ticketsSold.toString()}
          icon={<Ticket className="h-5 w-5" />}
          trend={`${stats.ticketsTrend}% from last month`}
          trendUp={stats.ticketsTrend >= 0}
        />
        <StatCard
          title="Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={`${stats.revenueTrend}% from last month`}
          trendUp={stats.revenueTrend >= 0}
        />
      </div>

      {/* Quick access */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-800">
          <div className="bg-zinc-50 dark:bg-zinc-800/50 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="font-medium text-zinc-900 dark:text-white">Quick Access</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
            <QuickAccessCard title="Movies" icon={<Film className="h-6 w-6" />} href="/admin/movies" />
            <QuickAccessCard title="Showtimes" icon={<Calendar className="h-6 w-6" />} href="/admin/showtimes" />
            <QuickAccessCard title="Staff" icon={<Users className="h-6 w-6" />} href="/admin/staff" />
            <QuickAccessCard title="Customers" icon={<User className="h-6 w-6" />} href="/admin/customers" />
            <QuickAccessCard title="Directors" icon={<Video className="h-6 w-6" />} href="/admin/directors" />
            <QuickAccessCard title="Cast" icon={<Cast className="h-6 w-6" />} href="/admin/cast" />
            <QuickAccessCard title="Screens" icon={<MonitorPlay className="h-6 w-6" />} href="/admin/screens" />
            <QuickAccessCard title="Tickets" icon={<Ticket className="h-6 w-6" />} href="/admin/tickets" />
          </div>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-800">
          <div className="bg-zinc-50 dark:bg-zinc-800/50 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="font-medium text-zinc-900 dark:text-white">Recent Activity</h2>
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <ActivityItem
              title="New movie added"
              description="Dune: Part Two was added to the catalog by admin"
              time="2 hours ago"
              icon={<Film className="h-4 w-4" />}
            />
            <ActivityItem
              title="Ticket status updated"
              description="5 tickets were marked as used"
              time="4 hours ago"
              icon={<Ticket className="h-4 w-4" />}
            />
            <ActivityItem
              title="New staff member"
              description="John Doe was added as staff"
              time="Yesterday"
              icon={<Users className="h-4 w-4" />}
            />
            <ActivityItem
              title="Screen maintenance"
              description="IMAX Screen 1 scheduled for maintenance"
              time="2 days ago"
              icon={<AlertCircle className="h-4 w-4" />}
            />
          </div>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-800">
          <div className="bg-zinc-50 dark:bg-zinc-800/50 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="font-medium text-zinc-900 dark:text-white">Upcoming Movie Releases</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">Movie</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">Release Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {upcomingMovies.length > 0 ? (
                  upcomingMovies.slice(0, 5).map((movie: MovieWithDirector) => (
                    <tr key={movie.id} className="border-b border-zinc-200 dark:border-zinc-800">
                      <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">{movie.title}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{movie.releaseDate || 'TBA'}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                          Coming Soon
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-sm text-center text-zinc-600 dark:text-zinc-400">
                      No upcoming movies found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  trend,
  trendUp,
}: {
  title: string
  value: string
  icon: React.ReactNode
  trend: string
  trendUp: boolean
}) {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-800">
      <div className="flex items-center justify-between">
        <div className="text-zinc-600 dark:text-zinc-400">{title}</div>
        <div className="p-2 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">{icon}</div>
      </div>
      <div className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">{value}</div>
      <div className={`mt-2 text-xs flex items-center ${trendUp ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
        {trendUp ? (
          <TrendingUp className="h-3 w-3 mr-1" />
        ) : (
          <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
        )}
        {trend}
      </div>
    </div>
  )
}

function ActivityItem({
  title,
  description,
  time,
  icon,
}: {
  title: string
  description: string
  time: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 p-4 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/50">
      <div className="p-2 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-zinc-900 dark:text-white">{title}</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">{time}</p>
      </div>
    </div>
  )
}

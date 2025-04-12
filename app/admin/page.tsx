"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

import { 
  Film, 
  Users, 
  User, 
  Video, 
  Cast, 
  MonitorPlay, 
  Ticket, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Clock, 
  ChevronRight, 
  AlertCircle, 
  ArrowRight,
  BarChart2,
  Clapperboard,
  User2
} from 'lucide-react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// API imports
import { moviesApi } from "@/lib/endpoints/movies"
import { statsApi } from "@/lib/endpoints/stats"
import { directorsApi } from "@/lib/endpoints/directors"
import { castMembersApi } from "@/lib/endpoints/cast-members"

// Types
import type { Movie, Director, CastMember } from "@/types/types"
import type { Stats } from "@/lib/endpoints/stats"
import { showtimes } from "@/data/showtimes"
import { showtimesApi } from "@/lib/endpoints/showtimes"

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function DashboardContent() {
  const [stats, setStats] = useState<Stats>({
    totalMovies: 0,
    activeCustomers: 0,
    ticketsSold: 0,
    revenue: 0,
    ticketsTrend: 0,
    revenueTrend: 0,
  })
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([])
  const [directors, setDirectors] = useState<Director[]>([])
  const [castMembers, setCastMembers] = useState<CastMember[]>([])
  const [totalShows, setTotalShows] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch stats
        const statsResponse = await statsApi.getStats()
        if (!statsResponse.error) {
          setStats(statsResponse.data || {
            totalMovies: 0,
            activeCustomers: 0,
            ticketsSold: 0,
            revenue: 0,
            ticketsTrend: 0,
            revenueTrend: 0,
          })
        }

        // Fetch upcoming movies
        const moviesResponse = await moviesApi.getMovies({ status: "coming_soon" })
        if (!moviesResponse.error) {
          setUpcomingMovies(moviesResponse.data || [])
        }

        // Fetch all shows and set their count
        const showsResponse = await showtimesApi.getShowtimes()
        if (!showsResponse.error) {
          setTotalShows(showsResponse.data!.length)
        }

        // Fetch directors
        const directorsResponse = await directorsApi.getDirectors()
        if (!directorsResponse.error) {
          setDirectors(directorsResponse.data || [])
        }

        // Fetch cast members
        const castResponse = await castMembersApi.getCastMembers()
        if (!castResponse.error) {
          setCastMembers(castResponse.data || [])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Sample revenue data for the chart
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [12500, 19000, 15000, 22000, 18000, 25000, 30000],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#ef4444',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
        pointHoverBorderWidth: 2
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 12
        },
        padding: 12,
        usePointStyle: true,
        callbacks: {
          label: (context: any) => {
            return ` $${context.parsed.y.toLocaleString()}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280'
        }
      },
      y: {
        grid: {
          color: 'rgba(229, 231, 235, 0.3)'
        },
        ticks: {
          color: '#6b7280',
          callback: (value: any) => `$${value / 1000}k`
        }
      }
    },
    maintainAspectRatio: false
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-zinc-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
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
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Dashboard Overview</h1>
           </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Movies"
          value={stats.totalMovies.toString()}
          icon={<Film className="h-5 w-5" />}
          trend={"+100%"}
          trendUp={true}
        />
        <StatCard
          title="Active Customers"
          value={stats.activeCustomers.toString()}
          icon={<User className="h-5 w-5" />}
          trend={"+100%"}
          trendUp={true}
        />
        <StatCard
          title="Tickets Sold"
          value={stats.ticketsSold.toString()}
          icon={<Ticket className="h-5 w-5" />}
          trend={`${stats.ticketsTrend}%`}
          trendUp={stats.ticketsTrend >= 0}
        />
        <StatCard
          title="Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          trend={`${stats.revenueTrend}%`}
          trendUp={stats.revenueTrend >= 0}
        />
      </div>

      {/* Quick access */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <QuickAccessCard 
          title="Movies" 
          icon={<Clapperboard className="h-6 w-6" />} 
          href="/admin/movies" 
          count={stats.totalMovies} 
        />
        <QuickAccessCard 
          title="Showtimes" 
          icon={<Calendar className="h-6 w-6" />} 
          href="/admin/showtimes" 
          count={totalShows} 
        />
        <QuickAccessCard 
          title="Customers" 
          icon={<User className="h-6 w-6" />} 
          href="/admin/customers" 
          count={stats.activeCustomers} 
        />
        <QuickAccessCard 
          title="Tickets" 
          icon={<Ticket className="h-6 w-6" />} 
          href="/admin/tickets" 
          count={stats.ticketsSold} 
        />
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Movies */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-700 overflow-hidden">
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Upcoming Releases</h2>
            <Link 
              href="/admin/movies?status=coming_soon" 
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-1"
            >
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="p-6 space-y-4">
            {upcomingMovies.length > 0 ? (
              upcomingMovies.slice(0, 4).map((movie) => (
                <Link 
                  key={movie.id} 
                  href={`/admin/movies/${movie.id}`}
                  className="flex items-center gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 p-2 rounded-lg transition-colors"
                >
                  <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-700 shadow-sm">
                    {movie.image && (
                      <Image
                        src={movie.image || "/placeholder.svg"}
                        alt={movie.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-zinc-900 dark:text-white truncate">{movie.title}</h3>
                    
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-4 text-zinc-500 dark:text-zinc-400">
                No upcoming movies scheduled
              </div>
            )}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-700 overflow-hidden lg:col-span-2">
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Revenue Trend (Last Year)</h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="text-zinc-500 dark:text-zinc-400">2024</span>
              </div>
              
            </div>
          </div>
          <div className="p-6 h-64">
            <Line data={revenueData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-700 overflow-hidden">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Quick Navigation</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <QuickLink 
              title="Directors" 
              icon={<Video className="h-5 w-5" />} 
              href="/admin/directors" 
              count={directors.length}
            />
            <QuickLink 
              title="Cast Members" 
              icon={<Cast className="h-5 w-5" />} 
              href="/admin/cast" 
              count={castMembers.length}
            />
            <QuickLink 
              title="Screens" 
              icon={<MonitorPlay className="h-5 w-5" />} 
              href="/admin/screens" 
              count={8}
            />
            <QuickLink 
              title="Staff" 
              icon={<User2 className="h-5 w-5" />} 
              href="/admin/staff" 
            />
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
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-700">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</div>
        <div className="p-2 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
          {icon}
        </div>
      </div>
      <div className="mt-3 text-2xl font-bold text-zinc-900 dark:text-white">{value}</div>
      <div className={`mt-2 text-sm flex items-center ${trendUp ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
        {trendUp ? (
          <TrendingUp className="h-4 w-4 mr-1" />
        ) : (
          <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" />
        )}
        {trend}
        <span className="text-zinc-500 dark:text-zinc-400 ml-1 text-xs">vs last month</span>
      </div>
    </div>
  )
}

function QuickAccessCard({ 
  title, 
  icon, 
  href, 
  count 
}: { 
  title: string
  icon: React.ReactNode
  href: string
  count: number
}) {
  return (
    <Link
      href={href}
      className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-zinc-100 dark:border-zinc-700 flex flex-col hover:border-red-300 dark:hover:border-red-700 transition-all group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
          {icon}
        </div>
        <ArrowRight className="h-5 w-5 text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="mt-auto">
        <div className="text-2xl font-bold text-zinc-900 dark:text-white">{count}</div>
        <div className="text-sm text-zinc-500 dark:text-zinc-400">{title}</div>
      </div>
    </Link>
  )
}

function QuickLink({ 
  title, 
  icon, 
  href, 
  count 
}: { 
  title: string
  icon: React.ReactNode
  href: string
  count?: number
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-700/50 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
    >
      <div className="p-2 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <span className="font-medium text-zinc-900 dark:text-white block truncate">{title}</span>
        {count !== undefined && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">{count} records</span>
        )}
      </div>
      <ChevronRight className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
    </Link>
  )
}
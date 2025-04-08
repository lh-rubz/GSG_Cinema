import type React from "react"
import Link from "next/link"
import { Film, Ticket, Calendar } from "lucide-react"

export default function StaffDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Staff Dashboard</h1>
        <div className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Movies Showing Today" value="8" icon={<Film className="h-5 w-5" />} />
        <StatCard title="Tickets Sold Today" value="124" icon={<Ticket className="h-5 w-5" />} />
        <StatCard title="Pending Tickets" value="18" icon={<Calendar className="h-5 w-5" />} />
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
            <ShowtimeItem title="Dune: Part Two" time="14:30" screen="Screen 1" availableSeats={45} />
            <ShowtimeItem title="Oppenheimer" time="15:45" screen="Screen 2" availableSeats={32} />
            <ShowtimeItem title="Dune: Part Two" time="18:00" screen="Screen 1" availableSeats={28} />
            <ShowtimeItem title="Gladiator II" time="20:15" screen="Screen 3" availableSeats={50} />
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
              <tr className="border-b border-border">
                <td className="px-4 py-3 text-sm">T1001</td>
                <td className="px-4 py-3 text-sm">John Doe</td>
                <td className="px-4 py-3 text-sm">Dune: Part Two</td>
                <td className="px-4 py-3 text-sm">Today, 14:30</td>
                <td className="px-4 py-3 text-sm">A12</td>
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
              <tr className="border-b border-border">
                <td className="px-4 py-3 text-sm">T1002</td>
                <td className="px-4 py-3 text-sm">Jane Smith</td>
                <td className="px-4 py-3 text-sm">Oppenheimer</td>
                <td className="px-4 py-3 text-sm">Today, 15:45</td>
                <td className="px-4 py-3 text-sm">B7</td>
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
              <tr>
                <td className="px-4 py-3 text-sm">T1003</td>
                <td className="px-4 py-3 text-sm">Mike Johnson</td>
                <td className="px-4 py-3 text-sm">Dune: Part Two</td>
                <td className="px-4 py-3 text-sm">Today, 18:00</td>
                <td className="px-4 py-3 text-sm">C5</td>
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


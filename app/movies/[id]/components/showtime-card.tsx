import { getScreenById } from "@/lib/screens-data"
import { Seat, Showtime } from "@/types/types"
import Link from "next/link"
import { useState } from "react"

interface ShowtimeCardProps {
  showtime: any
 
}

export function ShowtimeCard({ showtime }: ShowtimeCardProps) {
  const [use24HourFormat, setUse24HourFormat] = useState(true)
  const [showDollarPrice, setShowDollarPrice] = useState(false)
  const screen = getScreenById(showtime.screenId)
  
  const formatStyles = {
    '2D': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    '3D': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'imax': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    '4dx': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number)
    
    if (use24HourFormat) {
      return timeString
    } else {
      const period = hours >= 12 ? 'PM' : 'AM'
      const displayHours = hours % 12 || 12
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
    }
  }

  const formatPrice = () => {
    if (showDollarPrice) {
      const usdPrice = showtime.price / 3.6
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(usdPrice)
    }
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS'
    }).format(showtime.price)
  }

  return (
    <div className="relative bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden">
      {/* Ticket perforation top */}
      <div className="absolute top-0 left-0 w-full h-3 flex">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="flex-1 h-full">
            <div className="h-3 w-3 rounded-full bg-zinc-100 dark:bg-zinc-900 mx-auto"></div>
          </div>
        ))}
      </div>

      <div className="pt-6 pb-4 px-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <button 
                onClick={() => setUse24HourFormat(!use24HourFormat)}
                className="text-2xl font-bold text-zinc-900 dark:text-white hover:text-red-600 transition-colors"
              >
                {formatTime(showtime.time)}
              </button>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                {screen?.name || "Screen"}
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowDollarPrice(!showDollarPrice)}
            className="text-xl font-bold text-red-600 hover:text-red-700 transition-colors"
          >
            {formatPrice()}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${formatStyles[showtime.format as keyof typeof formatStyles]}`}>
            {showtime.format.toUpperCase()}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            {showtime.screen.seats?.filter((seat: Seat) => seat.available == true).length} seats available
          </div>
          <Link href={`/booking/${showtime.id}`}>
          <button 
           
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors duration-200"
          >
            Book Now
          </button></Link>
        </div>
      </div>

      {/* Ticket perforation bottom */}
      <div className="absolute bottom-0 left-0 w-full h-3 flex">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="flex-1 h-full">
            <div className="h-3 w-3 rounded-full bg-zinc-100 dark:bg-zinc-900 mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
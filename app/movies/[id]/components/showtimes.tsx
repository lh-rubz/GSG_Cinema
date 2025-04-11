import { Showtime } from "@/types/types"
import { useState, useEffect } from "react"
import { ShowtimeCard } from "./showtime-card"
import { Frown } from "lucide-react"

interface ShowtimesTabProps {
  showtimes: Showtime[]
}

export function ShowtimesTab({ showtimes }: ShowtimesTabProps) {
  // Format date as dd-mm-yyyy
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  // Get dates for today + next 4 days in dd-mm-yyyy format
  const getDateRange = () => {
    const dates = []
    const today = new Date()
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(formatDate(date.toISOString()))
    }
    
    return dates
  }

  const dateRange = getDateRange()
  const [selectedDate, setSelectedDate] = useState<string>(dateRange[0])

  // Filter showtimes for selected date
  const filteredShowtimes = showtimes.filter(st => st.date === selectedDate)

  // Auto-select today's date if it has showtimes, otherwise find first date with showtimes
  useEffect(() => {
    if (showtimes.length > 0) {
      const todayShowtimes = showtimes.some(st => st.date === dateRange[0])
      if (todayShowtimes) {
        setSelectedDate(dateRange[0])
      } else {
        const firstAvailableDate = dateRange.find(date => 
          showtimes.some(st => st.date === date)
        )
        if (firstAvailableDate) {
          setSelectedDate(firstAvailableDate)
        }
      }
    }
  }, [showtimes])

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Select Date</h2>
        <div className="flex overflow-x-auto pb-2 gap-2">
          {dateRange.map(date => {
            const hasShowtimes = showtimes.some(st => st.date === date)
            const isToday = date === dateRange[0]
            
            return (
              <DateButton
                key={date}
                date={date}
                selected={date === selectedDate}
                onClick={() => setSelectedDate(date)}
                hasShowtimes={hasShowtimes}
                isToday={isToday}
              />
            )
          })}
        </div>
      </div>

      {filteredShowtimes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredShowtimes.map(showtime => (
            <ShowtimeCard key={showtime.id} showtime={showtime} />
          ))}
        </div>
      ) : (
        <NoShowtimesMessage date={selectedDate} />
      )}
    </div>
  )
}

function DateButton({ 
  date, 
  selected, 
  onClick, 
  hasShowtimes,
  isToday
}: { 
  date: string; 
  selected: boolean; 
  onClick: () => void;
  hasShowtimes: boolean;
  isToday: boolean;
}) {
  // Convert dd-mm-yyyy back to Date object for formatting
  const [day, month, year] = date.split('-')
  const dateObj = new Date(`${year}-${month}-${day}`)

  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })

  return (
    <button
      onClick={onClick}
      
      className={`px-4 py-2 rounded-lg whitespace-nowrap flex flex-col items-center min-w-[100px] transition-colors ${
        selected 
          ? 'bg-red-600 text-white' 
          : hasShowtimes
            ? 'bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-600'
            : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 '
      }`}
    >
      <span>{formattedDate}</span>
      {isToday && <span className="text-xs mt-1">Today</span>}
      {!hasShowtimes && <span className="text-xs mt-1 ">No showtimes</span>}
     </button>
  )
}

function NoShowtimesMessage({ date }: { date: string }) {
  // Convert dd-mm-yyyy back to Date object for formatting
  const [day, month, year] = date.split('-')
  const dateObj = new Date(`${year}-${month}-${day}`)

  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <Frown className="w-12 h-12 text-zinc-400 dark:text-zinc-500" />
      </div>
      <h3 className="text-xl font-medium text-zinc-600 dark:text-zinc-400">
        No showtimes available for {formattedDate}
      </h3>
      <p className="text-zinc-500 dark:text-zinc-500 mt-2">
        Please check other dates or come back later
      </p>
    </div>
  )
}
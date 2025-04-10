import { Calendar, Clock, Film, MapPin, User } from "lucide-react"
import type { Movie, Showtime, Ticket, Screen } from "../../../types/types"

interface TicketProps {
  tickets: Ticket[]
  movie: Movie
  showtime: Showtime
  screen: Screen
  isPast: boolean
}

export default function TicketCard({ tickets, movie, showtime, screen, isPast }: TicketProps) {
  const seatNumbers = tickets.map((t) => t.seatId).join(", ")
  const totalPrice = (tickets[0].price * tickets.length).toFixed(2)
  const ticketNumber = `${tickets[0].id.toUpperCase()}${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")}`

  const hasMultipleTickets = tickets.length > 1

  return (
    <div className={`w-full mb-8 ${isPast ? "opacity-90" : ""}`}>
      {/* Group wrapper for hover effects */}
      <div className="relative group">
        {/* Background layers for stacked effect */}
        {hasMultipleTickets && (
          <>
            {/* Bottom layer (3rd ticket) */}
            <div className={`
              absolute -bottom-2 -right-2 left-2 top-2
              bg-gray-100 dark:bg-gray-700 rounded-xl
              border border-gray-200 dark:border-gray-600
              transform rotate-1
              transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
              group-hover:translate-x-1 group-hover:translate-y-1
              group-hover:opacity-100 opacity-0
              z-0
            `}></div>

            {/* Middle layer (2nd ticket) */}
            <div className={`
              absolute -bottom-1 -right-1 left-1 top-1
              bg-gray-50 dark:bg-gray-800/40 rounded-xl
              border border-gray-150 dark:border-gray-700/40
              transform rotate-0.5
              transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
              group-hover:translate-x-0.5 group-hover:translate-y-0.5
              group-hover:opacity-100 opacity-0
              z-10
            `}></div>
          </>
        )}

        {/* Main ticket (top layer) */}
        <div className={`
          relative z-20
          flex flex-col md:flex-row
          bg-white dark:bg-gray-800 rounded-xl overflow-hidden
          border border-gray-200 dark:border-gray-700
          shadow-sm
          transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          group-hover:shadow-lg
          group-hover:-translate-y-1 group-hover:-translate-x-1
          ${hasMultipleTickets ? 'hover:border-red-200 dark:hover:border-red-900/50' : ''}
        `}>
          {/* Movie image */}
          <div className="md:w-1/4 bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-4">
            <div
              className="w-full h-48 md:h-full bg-cover bg-center rounded-lg overflow-hidden"
              style={{ backgroundImage: `url(${movie.image})` }}
            >
              <div className="w-full h-full bg-black/10 dark:bg-black/30 flex items-center justify-center">
                {!movie.image && <Film className="w-10 h-10 text-red-400 dark:text-red-500" />}
              </div>
            </div>
          </div>

          {/* Ticket details */}
          <div className="flex-1 p-5 border-dashed border-2 dark:border-gray-600">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{movie.title}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{screen.name}</span>
                  <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{showtime.format}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date</p>
                <p className="font-medium dark:text-gray-200 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-red-500 dark:text-red-400" />
                  {showtime.date}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Time</p>
                <p className="font-medium dark:text-gray-200 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-red-500 dark:text-red-400" />
                  {showtime.time}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Seat{hasMultipleTickets ? "s" : ""}</p>
                <p className="font-medium dark:text-gray-200 flex items-center">
                  <User className="w-4 h-4 mr-2 text-red-500 dark:text-red-400" />
                  {seatNumbers}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Screen</p>
                <p className="font-medium dark:text-gray-200 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-red-500 dark:text-red-400" />
                  {screen.type.join(", ")}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ticket ID</p>
                <p className="font-mono text-sm font-medium text-gray-800 dark:text-gray-200">{ticketNumber}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">${totalPrice}</p>
                </div>
                <div>
                  <span
                    className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${
                        isPast
                          ? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                      }
                    `}
                  >
                    {isPast ? "Used" : "Confirmed"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket count indicator for multiple tickets */}
        {hasMultipleTickets && (
          <div className={`
            absolute -top-3 -right-3
            bg-red-600 text-white text-xs font-bold rounded-full
            h-7 w-7 flex items-center justify-center
            border-2 border-white dark:border-gray-800
            shadow-lg z-30
            transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            group-hover:scale-110 group-hover:-translate-y-0.5
          `}>
            x{tickets.length}
          </div>
        )}
      </div>
    </div>
  )
}
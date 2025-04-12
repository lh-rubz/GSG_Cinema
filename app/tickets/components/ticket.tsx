import { useEffect, useState } from "react";
import { Calendar, Clock, Film, MapPin, User } from "lucide-react";
import type { Movie, Showtime, Ticket, Screen } from "../../../types/types";
import { usePreferences } from "@/context/PreferencesContext";
import { useAuth } from "@/hooks/use-auth"; // Import useAuth to get the current user
import { formatCurrency, formatTime } from "@/utils/formatters";
import { seatsApi } from "@/lib/endpoints/seats"
interface TicketProps {
  tickets: Ticket[];
  movie: Movie;
  showtime: Showtime;
  screen: Screen;
  isPast: boolean;
}

export default function TicketCard({ tickets, movie, showtime, screen, isPast }: TicketProps) {
  const { user } = useAuth(); // Get the current user
  const [seatNumbers, setSeatNumbers] = useState<string[]>([]);
  const { preferences } = usePreferences();

  // Filter tickets to show only those belonging to the current user
  const userTickets = tickets.filter((ticket) => ticket.userId === user?.id); // Adjust `userId` based on your data structure

  const totalPrice = userTickets.reduce((sum, ticket) => sum + ticket.price, 0).toFixed(2);
  const hasMultipleTickets = userTickets.length > 1;

  // Extract ticketNumber from the first ticket in the filtered array
  const ticketNumber = userTickets[0]?.ticketNumber || "N/A";

  if (userTickets.length === 0) {
    return null; // If no tickets belong to the user, render nothing
  }
  useEffect(() => {
    const fetchSeatNumbers = async () => {
      const userTickets = tickets.filter((ticket) => ticket.userId === user?.id); // Filter tickets for the current user
      const numbers = await Promise.all(
        userTickets.map(async (ticket) => {
          try {
            const response = await seatsApi.getSeat(ticket.seatId);
            return response.data?.number || ticket.seatId;
          } catch (error) {
            console.error("Error fetching seat:", error);
            return ticket.seatId;
          }
        })
      );
      setSeatNumbers(numbers);
    };

    fetchSeatNumbers();
  }, [tickets, user]);

  return (
    <div className={`w-full mb-8 ${isPast ? "opacity-90" : ""}`}>
      <div className="relative group">
        {hasMultipleTickets && (
          <>
            <div className={`
              absolute -bottom-2 -right-2 left-2 top-2
              bg-zinc-100 dark:bg-zinc-700 rounded-xl
              border border-zinc-200 dark:border-zinc-600
              transform rotate-1
              transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
              group-hover:translate-x-1 group-hover:translate-y-1
              group-hover:opacity-100 opacity-0
              z-0
            `}></div>

            <div className={`
              absolute -bottom-1 -right-1 left-1 top-1
              bg-zinc-50 dark:bg-zinc-800/40 rounded-xl
              border border-zinc-150 dark:border-zinc-700/40
              transform rotate-0.5
              transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
              group-hover:translate-x-0.5 group-hover:translate-y-0.5
              group-hover:opacity-100 opacity-0
              z-10
            `}></div>
          </>
        )}

        <div className={`
          relative z-20
          flex flex-col md:flex-row
          bg-white dark:bg-zinc-800 rounded-xl overflow-hidden
          border border-zinc-200 dark:border-zinc-700
          shadow-sm
          transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          group-hover:shadow-lg
          group-hover:-translate-y-1 group-hover:-translate-x-1
          ${hasMultipleTickets ? 'hover:border-red-200 dark:hover:border-red-900/50' : ''}
        `}>
          {/* Movie image */}
          <div className="md:w-1/4 bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center p-4">
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
          <div className="flex-1 p-5 border-dashed border-2 dark:border-zinc-600">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{movie.title}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">{screen.name}</span>
                  <span className="mx-2 text-zinc-300 dark:text-zinc-600">•</span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">{showtime.format}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Date</p>
                <p className="font-medium dark:text-zinc-200 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-red-500 dark:text-red-400" />
                  {showtime.date}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Time</p>
                <p className="font-medium dark:text-zinc-200 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-red-500 dark:text-red-400" />
                  {formatTime(showtime.time, preferences.timeFormat === "TWELVE_HOUR" ? "12-hour" : "24-hour")}
                </p>
              </div>
              <div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Seat{hasMultipleTickets ? "s" : ""}</p>
                
                <p className="font-light  dark:text-zinc-200 flex items-center">
                  <User className="w-4 h-4 mr-2 text-red-500 dark:text-red-400" />
                  {seatNumbers.join(", ")}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Screen</p>
                <p className="font-semibold dark:text-zinc-200 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-red-500 dark:text-red-400" />
                  {screen.type.join(", ")}
                </p>
              </div>
            </div>

            <div className="flex items-end justify-end mt-4">
  <div className="flex items-center space-x-4">
    <div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Total</p>
      <p className="text-lg font-bold text-zinc-900 dark:text-white">
        {formatCurrency(Number(totalPrice), preferences.currency)}
      </p>
    </div>
    <div>
      <span
        className={`
          px-3 py-1 rounded-full text-xs font-medium
          ${
            isPast
              ? "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"
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
            border-2 border-white dark:border-zinc-800
            shadow-lg z-30
            transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            group-hover:scale-110 group-hover:-translate-y-0.5
          `}>
            x{userTickets.length}
          </div>
        )}
      </div>
    </div>
  );
}
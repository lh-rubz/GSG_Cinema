'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Film, MapPin, Scissors, Ticket as TicketIcon, User } from "lucide-react";
import type { Movie, Showtime, Ticket, Screen } from "../../types/types";
import { ticketsApi } from "@/lib/endpoints/tickets";
import { showtimesApi } from "@/lib/endpoints/showtimes";
import { moviesApi } from "@/lib/endpoints/movies";
import { screensApi } from "@/lib/endpoints/screens";
import TicketCard from "./components/ticket";

const isDateActiveOrFuture = (dateString: string): boolean => {
  const [day, month, year] = dateString.split("-").map(Number)
  const ticketDate = new Date(year, month - 1, day)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return ticketDate >= today
}

const groupTicketsByShowtime = (tickets: Ticket[]): Record<string, Ticket[]> => {
  return tickets.reduce(
    (acc, ticket) => {
      if (!acc[ticket.showtimeId]) {
        acc[ticket.showtimeId] = []
      }
      acc[ticket.showtimeId].push(ticket)
      return acc
    },
    {} as Record<string, Ticket[]>,
  )
}

export default function TicketsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");
  const [activeTickets, setActiveTickets] = useState<Record<string, Ticket[]>>({});
  const [pastTickets, setPastTickets] = useState<Record<string, Ticket[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [movies, setMovies] = useState<Record<string, Movie>>({});
  const [showtimes, setShowtimes] = useState<Record<string, Showtime>>({});
  const [screens, setScreens] = useState<Record<string, Screen>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const ticketsResponse = await ticketsApi.getTickets();
        if (ticketsResponse.error) {
          throw new Error(ticketsResponse.error);
        }

        const allTickets = ticketsResponse.data || [];
        const active: Ticket[] = [];
        const past: Ticket[] = [];

        const showtimeIds = [...new Set(allTickets.map(t => t.showtimeId))];
        const showtimesResponse = await Promise.all(
          showtimeIds.map(id => showtimesApi.getShowtime(id))
        );

        const showtimesData: Record<string, Showtime> = {};
        const movieIds = new Set<string>();
        const screenIds = new Set<string>();

        showtimesResponse.forEach(response => {
          if (response.data) {
            showtimesData[response.data.id] = response.data;
            movieIds.add(response.data.movieId);
            screenIds.add(response.data.screenId);
          }
        });

        setShowtimes(showtimesData);

        const moviesResponse = await Promise.all(
          Array.from(movieIds).map(id => moviesApi.getMovie(id))
        );

        const moviesData: Record<string, Movie> = {};
        moviesResponse.forEach(response => {
          if (response.data) {
            moviesData[response.data.id] = response.data;
          }
        });

        setMovies(moviesData);

        const screensResponse = await Promise.all(
          Array.from(screenIds).map(id => screensApi.getScreen(id))
        );

        const screensData: Record<string, Screen> = {};
        screensResponse.forEach(response => {
          if (response.data) {
            screensData[response.data.id] = response.data;
          }
        });

        setScreens(screensData);

        allTickets.forEach((ticket) => {
          const showtime = showtimesData[ticket.showtimeId];
          if (showtime) {
            if (isDateActiveOrFuture(showtime.date)) {
              active.push(ticket);
            } else {
              past.push(ticket);
            }
          }
        });

        setActiveTickets(groupTicketsByShowtime(active));
        setPastTickets(groupTicketsByShowtime(past));
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to load tickets");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderEmptyState = (type: "active" | "past") => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative w-24 h-24 mb-6">
        <div className={`absolute inset-0 ${
          type === "active" 
            ? "bg-red-100 dark:bg-red-900/20 animate-pulse" 
            : "bg-zinc-100 dark:bg-zinc-700/20"
        } rounded-full`}></div>
        <TicketIcon className={`absolute w-12 h-12 ${
          type === "active" 
            ? "text-red-600 dark:text-red-400" 
            : "text-zinc-400 dark:text-zinc-500"
        } top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`} />
      </div>
      <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
        {type === "active" ? "No upcoming tickets" : "No past tickets"}
      </h3>
      <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-center max-w-md">
        {type === "active" 
          ? "You don't have any active tickets. Browse our showtimes to book your next cinema experience."
          : "Your past movie tickets will appear here once you've attended a screening."}
      </p>
      {type === "active" && (
        <button
          onClick={() => router.push("/showtimes")}
          className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-medium shadow-lg transition-all hover:shadow-xl"
        >
          Browse Movies
        </button>
      )}
    </div>
  );

  const renderTickets = (tickets: Record<string, Ticket[]>, isPast: boolean) => {
    const showtimeIds = Object.keys(tickets);
    
    if (showtimeIds.length === 0) {
      return renderEmptyState(isPast ? "past" : "active");
    }

    return (
      <div className="space-y-6">
        {showtimeIds.map((showtimeId) => {
          const ticketGroup = tickets[showtimeId];
          const showtime = showtimes[showtimeId];
          const movie = showtime ? movies[showtime.movieId] : undefined;
          const screen = showtime ? screens[showtime.screenId] : undefined;

          if (!showtime || !movie || !screen) {
            return null;
          }

          return (
            <TicketCard
              key={showtimeId}
              tickets={ticketGroup}
              movie={movie}
              showtime={showtime}
              screen={screen}
              isPast={isPast}
            />
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-900/30 dark:text-red-500">
          {error}
        </div>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-8 sm:py-12 mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-2">My Tickets</h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">Your cinema bookings and history</p>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 pt-6">
            <div className="flex border-b border-zinc-200 dark:border-zinc-700">
              <button
                onClick={() => setActiveTab("active")}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "active"
                    ? "border-red-600 text-red-600 dark:border-red-500 dark:text-red-400"
                    : "border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                }`}
              >
                Active Tickets
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "past"
                    ? "border-red-600 text-red-600 dark:border-red-500 dark:text-red-400"
                    : "border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                }`}
              >
                Past Tickets
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "active" && renderTickets(activeTickets, false)}
            {activeTab === "past" && renderTickets(pastTickets, true)}
          </div>
        </div>
      </div>
    </main>
  );
}
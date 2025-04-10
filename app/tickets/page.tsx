'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Film, MapPin, Scissors, Ticket as TicketIcon, User } from "lucide-react";
import type { Movie, Showtime, Ticket ,Screen} from "../../types/types";

import TicketCard from "./components/ticket";
// Helper function to check if a date is today or in the future
const isDateActiveOrFuture = (dateString: string): boolean => {
  // Parse the date string (dd-mm-yyyy)
  const [day, month, year] = dateString.split("-").map(Number)
  const ticketDate = new Date(year, month - 1, day) // month is 0-indexed in JS Date

  // Get today's date with time set to beginning of day
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return ticketDate >= today
}

// Function to generate a random ticket number
const generateTicketNumber = (id: string): string => {
  return `${id.toUpperCase()}${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")}`
}

// Group tickets by showtime to identify duplicates
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

const mockTickets: Ticket[] = [
  {
    id: "t1",
    userId: "u1",
    showtimeId: "st1",
    seatId: "A12",
    price: 15.99,
    purchaseDate: "2024-03-15T10:00:00Z",
    status: "paid",
  },{
  id: "t7",
  userId: "u1",
  showtimeId: "st1",
  seatId: "A12",
  price: 15.99,
  purchaseDate: "2024-03-15T10:00:00Z",
  status: "paid",
},
  {
    id: "t2",
    userId: "u1",
    showtimeId: "st1", // Same showtime as t1 (duplicate)
    seatId: "A13",
    price: 15.99,
    purchaseDate: "2024-03-15T10:00:00Z",
    status: "paid",
  },
  {
    id: "t3",
    userId: "u1",
    showtimeId: "st2",
    seatId: "B15",
    price: 12.99,
    purchaseDate: "2024-02-10T15:30:00Z",
    status: "used",
  },
  {
    id: "t4",
    userId: "u1",
    showtimeId: "st3",
    seatId: "C8",
    price: 18.5,
    purchaseDate: "2024-03-20T09:15:00Z",
    status: "paid",
  },
  {
    id: "t5",
    userId: "u1",
    showtimeId: "st4",
    seatId: "D4",
    price: 14.99,
    purchaseDate: "2024-01-05T14:20:00Z",
    status: "used",
  },
]

// Mock related data (would come from your API)
const mockShowtimes: Record<string, Showtime> = {
  st1: {
    id: "st1",
    movieId: "m1",
    screenId: "sc1",
    date: "15-04-2025", // Future date (dd-mm-yyyy)
    time: "19:30",
    format: "TwoD",
    availableSeats: 120,
    price: 15.99,
  },
  st2: {
    id: "st2",
    movieId: "m2",
    screenId: "sc2",
    date: "10-02-2024", // Past date (dd-mm-yyyy)
    time: "20:15",
    format: "ThreeD",
    availableSeats: 80,
    price: 12.99,
  },
  st3: {
    id: "st3",
    movieId: "m3",
    screenId: "sc3",
    date: "25-04-2025", // Future date (dd-mm-yyyy)
    time: "18:00",
    format: "imax",
    availableSeats: 150,
    price: 18.5,
  },
  st4: {
    id: "st4",
    movieId: "m4",
    screenId: "sc1",
    date: "07-01-2024", // Past date (dd-mm-yyyy)
    time: "16:45",
    format: "TwoD",
    availableSeats: 120,
    price: 14.99,
  },
}

const mockMovies: Record<string, Movie> = {
  m1: {
    id: "m1",
    title: "Dune: Part Two",
    year: "2024",
    genre: ["Sci-Fi", "Adventure"],
    rating: "PG-13",
    description:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    image: "https://upload.wikimedia.org/wikipedia/en/5/52/Dune_Part_Two_poster.jpeg",
    directorId: "d1",
    duration: "166 min",
    trailer: "https://youtube.com/watch?v=dune-trailer",
    releaseDate: "01-03-2024",
    castIds: ["c1", "c2"],
    status: "now_showing",
    hidden: false,
  },
  m2: {
    id: "m2",
    title: "The Batman",
    year: "2022",
    genre: ["Action", "Crime", "Drama"],
    rating: "PG-13",
    description:
      "When the Riddler, a sadistic serial killer, begins murdering key political figures in Gotham, Batman is forced to investigate.",
    image: "https://i.redd.it/yl694lw87uy71.jpg",
    directorId: "d2",
    duration: "176 min",
    trailer: "https://youtube.com/watch?v=batman-trailer",
    releaseDate: "04-03-2022",
    castIds: ["c3", "c4"],
    status: "now_showing",
    hidden: false,
  },
  m3: {
    id: "m3",
    title: "Godzilla x Kong",
    year: "2024",
    genre: ["Action", "Sci-Fi", "Thriller"],
    rating: "PG-13",
    description: "The epic clash between Godzilla and Kong continues as a new threat emerges.",
    image: "https://m.media-amazon.com/images/M/MV5BODE2NTdmMmYtY2U1OS00MjExLWIwNjQtYjQ5NTA0ZDZmZjZiXkEyXkFqcGc@._V1_.jpg",
    directorId: "d3",
    duration: "132 min",
    trailer: "https://youtube.com/watch?v=godzilla-kong-trailer",
    releaseDate: "29-03-2024",
    castIds: ["c5", "c6"],
    status: "now_showing",
    hidden: false,
  },
  m4: {
    id: "m4",
    title: "Oppenheimer",
    year: "2023",
    genre: [ "Drama", "Thriller"],
    rating: "R",
    description:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    image: "https://m.media-amazon.com/images/M/MV5BN2JkMDc5MGQtZjg3YS00NmFiLWIyZmQtZTJmNTM5MjVmYTQ4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    directorId: "d4",
    duration: "180 min",
    trailer: "https://youtube.com/watch?v=oppenheimer-trailer",
    releaseDate: "21-07-2023",
    castIds: ["c7", "c8"],
    status: "now_showing",
    hidden: false,
  },
}

const mockScreens: Record<string, Screen> = {
  sc1: {
    id: "sc1",
    name: "Grand Hall",
    type: ["Standard"],
    capacity: 200,
    rows: 20,
    cols: 10,
  },
  sc2: {
    id: "sc2",
    name: "Royal Screen",
    type: ["Premium"],
    capacity: 150,
    rows: 15,
    cols: 10,
  },
  sc3: {
    id: "sc3",
    name: "IMAX Experience",
    type: ["IMAX"],
    capacity: 180,
    rows: 18,
    cols: 10,
  },
}
export default function TicketsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");
  const [activeTickets, setActiveTickets] = useState<Record<string, Ticket[]>>({});
  const [pastTickets, setPastTickets] = useState<Record<string, Ticket[]>>({});

  useEffect(() => {
    const active: Ticket[] = [];
    const past: Ticket[] = [];

    mockTickets.forEach((ticket) => {
      const showtime = mockShowtimes[ticket.showtimeId];
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
  }, []);

  const renderEmptyState = (type: "active" | "past") => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative w-24 h-24 mb-6">
        <div className={`absolute inset-0 ${
          type === "active" 
            ? "bg-red-100 dark:bg-red-900/20 animate-pulse" 
            : "bg-gray-100 dark:bg-gray-700/20"
        } rounded-full`}></div>
        <TicketIcon className={`absolute w-12 h-12 ${
          type === "active" 
            ? "text-red-600 dark:text-red-400" 
            : "text-gray-400 dark:text-gray-500"
        } top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {type === "active" ? "No upcoming tickets" : "No past tickets"}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
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
          const showtime = mockShowtimes[showtimeId];
          const movie = mockMovies[showtime.movieId];
          const screen = mockScreens[showtime.screenId];

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

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-8 sm:py-12 mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">My Tickets</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">Your cinema bookings and history</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 pt-6">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab("active")}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "active"
                    ? "border-red-600 text-red-600 dark:border-red-500 dark:text-red-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Active Tickets
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "past"
                    ? "border-red-600 text-red-600 dark:border-red-500 dark:text-red-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
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
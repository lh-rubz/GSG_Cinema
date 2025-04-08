"use client"

import { useState } from "react"
import { Film, Star } from "lucide-react"
import type { Movie } from "@/types"

// Sample data
const sampleMovies: Movie[] = [
  {
    id: "1",
    title: "Dune: Part Two",
    year: "2024",
    genre: ["Sci-Fi", "Adventure", "Drama"],
    rating: "8.7",
    description:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    image: "/movies/dune.jpg",
    directorId: "1",
    duration: "166 min",
    trailer: "https://www.youtube.com/watch?v=Way9Dexny3w",
    releaseDate: "01-03-2024",
    castIds: ["1", "2", "3"],
    status: "now_showing",
    hidden: false,
  },
  {
    id: "2",
    title: "Oppenheimer",
    year: "2023",
    genre: ["Biography", "Drama", "History"],
    rating: "8.5",
    description:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    image: "/movies/oppenheimer.jpg",
    directorId: "2",
    duration: "180 min",
    trailer: "https://www.youtube.com/watch?v=uYPbbksJxIg",
    releaseDate: "21-07-2023",
    castIds: ["4", "5", "6"],
    status: "now_showing",
    hidden: false,
  },
  {
    id: "3",
    title: "Gladiator II",
    year: "2024",
    genre: ["Action", "Adventure", "Drama"],
    rating: "N/A",
    description: "The sequel to the 2000 film Gladiator, following a new character in ancient Rome.",
    image: "/movies/gladiator2.jpg",
    directorId: "3",
    duration: "150 min",
    trailer: "https://www.youtube.com/watch?v=L2JOgCy4Mkg",
    releaseDate: "22-11-2024",
    castIds: ["7", "8", "9"],
    status: "coming_soon",
    hidden: false,
  },
]

export default function StaffMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>(sampleMovies)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.genre.some((g) => g.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || movie.status === statusFilter

    return matchesSearch && matchesStatus && !movie.hidden
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Movies</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="search"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background"
          />
          <Film className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-md border border-input bg-background"
        >
          <option value="all">All Movies</option>
          <option value="now_showing">Now Showing</option>
          <option value="coming_soon">Coming Soon</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMovies.map((movie) => (
          <div key={movie.id} className="border border-border rounded-lg overflow-hidden bg-card">
            <div className="aspect-[2/3] relative">
              {movie.image ? (
                <img src={movie.image || "/placeholder.svg"} alt={movie.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Film className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    movie.status === "now_showing"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500"
                  }`}
                >
                  {movie.status === "now_showing" ? "Now Showing" : "Coming Soon"}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg">{movie.title}</h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <span>{movie.year}</span>
                <span>•</span>
                <span>{movie.duration}</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <span>{movie.rating}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {movie.genre.slice(0, 3).map((genre) => (
                  <span key={genre} className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMovies.length === 0 && (
        <div className="text-center py-12">
          <Film className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No movies found</h3>
          <p className="mt-2 text-muted-foreground">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  )
}


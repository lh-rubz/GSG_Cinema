import Link from "next/link"
import type { Movie } from "@/types/types"
import { Star, Clock, Tag } from "lucide-react"
import { formatDuration } from "@/utils/formatters"
import { usePreferences } from "@/context/PreferencesContext"

interface MovieCardProps {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  const isComingSoon = movie.status === "coming_soon"
  const { preferences } = usePreferences();
  return (
    <div className="group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out border border-gray-100 dark:border-zinc-800 h-full flex flex-col">
      {/* Image with gradient overlay */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity" />
        <img
          src={
            movie.image ||
            `/placeholder.svg?height=450&width=300&text=${encodeURIComponent(movie.title) || "/placeholder.svg"}`
          }
          alt={movie.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />

        {/* Badge */}
        <div
          className={`absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md ${
            isComingSoon
              ? "bg-red-500/90 text-white ring-2 ring-red-500/20"
              : "bg-white/90 dark:bg-zinc-800/90 text-zinc-900 dark:text-white ring-2 ring-white/20"
          }`}
        >
          {isComingSoon ? (
            "COMING SOON"
          ) : (
            <>
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="tracking-wide">{movie.rating}</span>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
          {movie.title}
        </h3>

        {/* Metadata with icons */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            <Tag className="w-3.5 h-3.5" />
            <div className="flex flex-wrap items-center">
              {movie.genre.map((genre, index) => (
                <span key={genre} className="flex items-center">
                  {genre}
                  {index < movie.genre.length - 1 && <span className="mx-1 text-gray-300 dark:text-gray-600">•</span>}
                </span>
              ))}
            </div>
          </div>

          {movie.duration && (
            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatDuration(Number(movie.duration), preferences.durationFormat)}</span>
            </div>
          )}
        </div>

        {/* Details button - now full width since Book Now is removed */}
        <div className="mt-auto">
          <Link
            href={`/movies/${movie.id}`}
            className="w-full py-3 text-center font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3 bg-gradient-to-r from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 text-zinc-800 dark:text-zinc-200 hover:shadow-md"
          >
            View Details
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

import Link from "next/link"
import type { Movie } from "@/types/types"

interface MovieCardProps {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="group relative bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
      {/* Poster with hover effect */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.image || `/placeholder.svg?height=450&width=300&text=${encodeURIComponent(movie.title)}`}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {/* Rating badge */}
        <div className="absolute top-3 right-3 bg-black/80 text-white px-2 py-1 rounded-full flex items-center text-sm font-medium backdrop-blur-sm">
          <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {movie.rating}
        </div>
      </div>

      {/* Movie info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1 line-clamp-1">{movie.title}</h3>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">{movie.year}</span>
          <span className="text-xs font-medium px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-full">
            {movie.genre.join(" • ")}
          </span>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4 line-clamp-2">
          {movie.description}
        </p>

        <Link 
          href={`/movies/${movie.id}`}
          className="block w-full py-2 text-center bg-gradient-to-r from-red-600 to-red-500 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-md hover:shadow-red-500/30 hover:from-red-700 hover:to-red-600"
        >
          View Details
        </Link>
      </div>

      {/* Hover effect indicator */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-500/30 rounded-xl pointer-events-none transition-all duration-300"></div>
    </div>
  )
}
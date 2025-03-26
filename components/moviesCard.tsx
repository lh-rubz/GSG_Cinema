import Link from "next/link";
import type { Movie } from "@/types/types";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow">
      <div className="relative">
        <img
          src={
            movie.image ||
            `/placeholder.svg?height=450&width=300&text=${encodeURIComponent(
              movie.title
            )}`
          }
          alt={movie.title}
          className="w-full aspect-[3/4] object-cover hover:scale-102 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray transition-transform duration-300">
          PG-13
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {movie.title}
        </h3>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span>{movie.genre}</span>
          <span className="mx-2">•</span>
          <span>{movie.duration || ""} m</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href={`/movies/${movie.id}/book`}
            className="py-3 text-center bg-red-500 text-white font-medium rounded-md"
          >
            Book Now
          </Link>
          <Link
            href={`/movies/${movie.id}`}
            className="py-3 text-center border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-md"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}

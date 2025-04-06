import Link from "next/link";
import type { Movie } from "@/types/types";
import { Star } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const isComingSoon = movie.status === "coming_soon";

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ease-in-out border border-gray-100 dark:border-zinc-700 hover:translate-y-[-4px] h-full flex flex-col">
      <div className="relative aspect-[3/4]">
        <img
          src={
            movie.image ||
            `/placeholder.svg?height=450&width=300&text=${encodeURIComponent(
              movie.title
            )}`
          }
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        
        <div className={`absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
          isComingSoon 
            ? "bg-red-500/90 text-white" 
            : "bg-white/90 dark:bg-gray-700/90 dark:text-white backdrop-blur-sm"
        }`}>
          {isComingSoon ? (
            "COMING SOON"
          ) : (
            <>
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{movie.rating}</span>
            </>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-3">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
            {movie.title}
          </h3>
          
        
          <div className="flex flex-wrap items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
            <div className="flex flex-wrap items-center gap-x-1">
              {movie.genre.map((genre, index) => (
                <span key={genre} className="flex items-center">
                  {genre}
                  {index < movie.genre.length - 1 && (
                    <span className="mx-1 text-gray-300 dark:text-gray-600">/</span>
                  )}
                </span>
              ))}
            </div>
            {movie.duration && (
              <>
                <span className="mx-1 text-gray-300 dark:text-gray-600">•</span>
                <span>{movie.duration} min</span>
              </>
            )}
          </div>
        </div>

        {/* Buttons container with mt-auto to push to bottom */}
        <div className="mt-auto grid grid-cols-2 gap-3">
          {!isComingSoon ? (
            <>
              <Link
                href={`/movies/${movie.id}/book`}
                className="py-2.5 text-center bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
              >
                Book Now
              </Link>
              <Link
                href={`/movies/${movie.id}`}
                className="py-2.5 text-center border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                Details
              </Link>
            </>
          ) : (
            <Link
              href={`/movies/${movie.id}`}
              className="py-2.5 col-span-2 text-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
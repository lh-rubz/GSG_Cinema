import Link from "next/link";

import { Movie } from "@/types/movie";
import MovieCard from "./movie-card";

export function GenreSection({ movies }) {
  const genres = ["Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Romance", "Thriller"];

  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Explore Movies by Genre</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Discover the perfect movie for your mood from our extensive collection
          </p>
        </div>

        <div className="flex justify-center space-x-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {genres.map((genre) => (
            <button
              key={genre}
              className="px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-full font-medium whitespace-nowrap transition-colors"
            >
              {genre}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie:Movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/movies"
            className="inline-block py-3 px-6 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded transition-colors"
          >
            View All Movies
          </Link>
        </div>
      </div>
    </section>
  );
}
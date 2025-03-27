import { Movie } from "@/types/types";
import MoviesCard from "@/components/moviesCard";
interface MovieSectionProps {
  movies: Movie[];
}

export default function MoviesContainer({ movies }: MovieSectionProps) {
  return (
    <section className="py-16 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie: Movie) => (
            <MoviesCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
}

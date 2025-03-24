import Link from "next/link"
import type { Movie } from "@/types/movie"

interface MovieCardProps {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="movie-card">
      <div className="movie-poster-container">
        <img
          src={movie.image || `/placeholder.svg?height=450&width=300&text=${encodeURIComponent(movie.title)}`}
          alt={movie.title}
          className="movie-poster"
        />
        <div className="movie-poster-overlay"></div>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-meta">
          <span>{movie.year}</span>
          <div className="movie-rating">⭐ {movie.rating}</div>
        </div>
        <p className="movie-description">
          {movie.description.length > 100 ? `${movie.description.substring(0, 100)}...` : movie.description}
        </p>
        <div className="movie-card-footer">
          <Link href={`/movies/${movie.id}`} className="btn btn-primary" style={{ width: "100%" }}>
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}


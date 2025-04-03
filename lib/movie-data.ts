import { movies } from "@/data/movies";
import { directors } from "@/data/directors";
import { castMembers } from "@/data/cast";
import { showtimes } from "@/data/showtimes";

import { Movie, Director, CastMember, Showtime, Review } from "@/types/types";
import { reviews } from "@/data/reviews";

export function getAllMovies(): Movie[] {
  return movies;
}

export function getMovieById(id: string): Movie | undefined {
  return movies.find(movie => movie.id === id);
}

export function getDirectorById(id: string): Director | undefined {
  return directors.find(director => director.id === id);
}

export function getCastMembersByIds(ids: string[]): CastMember[] {
  return castMembers.filter(member => ids.includes(member.id));
}

export function getShowtimesByMovieId(movieId: string): Showtime[] {
  return showtimes.filter(showtime => showtime.movieId === movieId);
}

export function getReviewsByMovieId(movieId: string): Review[] {
  return reviews.filter(review => review.movieId === movieId);
}

export async function getFullMovieDetails(id: string): Promise<{
  movie: Movie;
  director: Director | undefined;
  cast: CastMember[];
  showtimes: Showtime[];
  reviews: Review[];
} | null> {
  const movie = getMovieById(id);
  if (!movie) return null;

  return {
    movie,
    director: getDirectorById(movie.directorId),
    cast: getCastMembersByIds(movie.castIds),
    showtimes: getShowtimesByMovieId(id),
    reviews: getReviewsByMovieId(id)
  };
}
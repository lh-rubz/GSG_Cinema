import { movies } from "@/data/movies";
import { directors } from "@/data/directors";
import { castMembers } from "@/data/cast";
import { Movie, Director, CastMember } from "@/types/types";

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

export function getFullMovieDetails(id: string) {
  const movie = getMovieById(id);
  if (!movie) return undefined;

  const director = getDirectorById(movie.directorId);
  const cast = getCastMembersByIds(movie.castIds);

  return {
    ...movie,
    director,
    cast
  };
}
import { apiClient } from '../client';
import type { Movie, Director, CastMember, Review } from '@/types/types';

export const moviesApi = {
  async getMovies(params?: {
    genre?: string;
    status?: string;
    hidden?: boolean;
    year?: string;
    directorId?: string;
  }) {
    return apiClient.get<Movie[]>('/movies', params as Record<string, string>);
  },
  
  async getMovie(id: string) {
    return apiClient.get<Movie & {
      director: Director;
      cast: Array<{
        castMember: CastMember;
        character: string;
      }>;
      reviews: Review[];
    }>(`/movies/${id}`);
  },
  
  async createMovie(movie: {
    title: string;
    description: string;
    image: string;
    genre: string[];
    duration: number;
    releaseDate: string;
    status: string;
    hidden: boolean;
    year: string;
    directorId: string;
    castIds?: string[];
    trailer?: string;
    characters?: Record<string, string>;
  }) {
    return apiClient.post<Movie>('/movies', movie);
  },
  
  async updateMovie(id: string, movie: Partial<Movie> & {
    castIds?: string[];
    characters?: Record<string, string>;
  }) {
    return apiClient.put<Movie>(`/movies/${id}`, movie);
  },
  
  async deleteMovie(id: string) {
    return apiClient.delete<{ message: string }>(`/movies/${id}`);
  }
};
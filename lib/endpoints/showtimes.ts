import { apiClient } from '../client';
import type { Showtime, Movie, Screen, Ticket } from '@/types/types';

export const showtimesApi = {
  async getShowtimes(params?: {
    movieId?: string;
    screenId?: string;
    date?: string;
  }) {
    return apiClient.get<Showtime[]>('/showtimes', params as Record<string, string>);
  },
  
  async getShowtime(id: string) {
    return apiClient.get<Showtime & {
      movie: Movie;
      screen: Screen;
      tickets: Ticket[];
    }>(`/showtimes/${id}`);
  },
  
  async createShowtime(showtime: {
    id?: string;
    movieId: string;
    screenId: string;
    date: string;
    time: string;
    price: number;
    format: string;
  }) {
    return apiClient.post<Showtime>('/showtimes', showtime);
  },
  
  async updateShowtime(id: string, showtime: Partial<Showtime>) {
    return apiClient.put<Showtime>(`/showtimes/${id}`, showtime);
  },
  
  async deleteShowtime(id: string) {
    return apiClient.delete<{ message: string }>(`/showtimes/${id}`);
  }
};
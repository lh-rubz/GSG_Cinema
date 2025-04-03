import { apiClient } from '../client';
import type { Screen, Seat, Showtime } from '@/types/types';

export const screensApi = {
  async getScreens(params?: { 
    type?: string;
    includeSeatMap?: boolean;
  }) {
    return apiClient.get<Screen[]>('/screens', params as Record<string, string>);
  },
  
  async getScreen(id: string) {
    return apiClient.get<Screen & { 
      seats: Seat[];
      seatMap: Seat[][];
      showtimes: Showtime[];
    }>(`/screens/${id}`);
  },
  
  async createScreen(screen: {
    id?: string;
    name: string;
    type: string[];
    capacity: number;
    rows: number;
    cols: number;
    seatMap?: Seat[][];
  }) {
    return apiClient.post<Screen & { seats: Seat[] }>('/screens', screen);
  },
  
  async updateScreen(id: string, screen: Partial<Screen>) {
    return apiClient.put<Screen>(`/screens/${id}`, screen);
  },
  
  async deleteScreen(id: string) {
    return apiClient.delete<{ message: string }>(`/screens/${id}`);
  }
};
import { apiClient } from '../client';
import type { Director, Movie } from '@/types/types';

export const directorsApi = {
  async getDirectors(params?: {
    name?: string;
  }) {
    return apiClient.get<Director[]>('/directors', params as Record<string, string>);
  },
  
  async getDirector(id: string) {
    return apiClient.get<Director & { movies: Movie[] }>(`/directors/${id}`);
  },
  
  async createDirector(director: {
    id?: string;
    name: string;
    bio?: string;
    image?: string;
  }) {
    return apiClient.post<Director>('/directors', director);
  },
  
  async updateDirector(id: string, director: Partial<Director>) {
    return apiClient.put<Director>(`/directors/${id}`, director);
  },
  
  async deleteDirector(id: string) {
    return apiClient.delete<{ message: string }>(`/directors/${id}`);
  }
};
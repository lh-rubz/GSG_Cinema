import { apiClient } from '../client';
import type { CastMember, Movie } from '@/types/types';

export const castMembersApi = {
  async getCastMembers(params?: {
    name?: string;
  }) {
    return apiClient.get<CastMember[]>('/cast-members', params as Record<string, string>);
  },
  
  async getCastMember(id: string) {
    return apiClient.get<CastMember & {
      movies: Array<{
        movieId: string;
        character: string;
        movie: Movie;
      }>;
    }>(`/cast-members/${id}`);
  },
  
  async createCastMember(castMember: {
    id: string;
    name: string;
    character: string;
    image: string;
  }) {
    return apiClient.post<CastMember>('/cast-members', castMember);
  },
  
  async updateCastMember(id: string, castMember: Partial<CastMember>) {
    return apiClient.put<CastMember>(`/cast-members/${id}`, castMember);
  },
  
  async deleteCastMember(id: string) {
    return apiClient.delete<{ message: string }>(`/cast-members/${id}`);
  }
};
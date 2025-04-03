import { apiClient } from '../client';
import type { Seat, Screen } from '@/types/types';

export const seatsApi = {
  async getSeat(id: string) {
    return apiClient.get<Seat & { screen: Screen }>(`/seats/${id}`);
  },
  
  async updateSeat(id: string, seat: Partial<Seat>) {
    return apiClient.put<Seat>(`/seats/${id}`, seat);
  }
  
  // Note: Seat creation is handled through the screens API
};
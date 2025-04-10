import { apiClient } from '../client';

export type Stats = {
  totalMovies: number;
  activeCustomers: number;
  ticketsSold: number;
  revenue: number;
  ticketsTrend: number;
  revenueTrend: number;
};

export const statsApi = {
  async getStats() {
    return apiClient.get<Stats>('/stats');
  }
}; 
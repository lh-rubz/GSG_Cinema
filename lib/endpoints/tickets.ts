import { apiClient } from '../client';
import type { Ticket, User, Showtime, Seat, Receipt } from '@/types/types';

export const ticketsApi = {
  async getTickets(params?: {
    userId?: string;
    showtimeId?: string;
    status?: string;
  }) {
    return apiClient.get<Ticket[]>('/tickets', params as Record<string, string>);
  },
  
  async getTicket(id: string) {
    return apiClient.get<Ticket & {
      user: User;
      showtime: Showtime;
      seat: Seat;
      receipt?: Receipt;
    }>(`/tickets/${id}`);
  },
  
  async createTicket(ticket: {
    id?: string;
    userId: string;
    showtimeId: string;
    seatId: string;
    price: number;
    promotionId?: string;
    discountAmount?: number;
  }) {
    return apiClient.post<Ticket>('/tickets', ticket);
  },
  
  async updateTicket(id: string, ticket: Partial<Ticket>) {
    return apiClient.put<Ticket>(`/tickets/${id}`, ticket);
  },
  
  async deleteTicket(id: string, reason?: string) {
    const endpoint = reason 
      ? `/tickets/${id}?reason=${encodeURIComponent(reason)}`
      : `/tickets/${id}`;
    
    return apiClient.delete<{ message: string }>(endpoint);
  }
};
import { apiClient } from '../client';
import type { Receipt, User, Movie, Ticket } from '@/types/types';

export const receiptsApi = {
  async getReceipts(params?: {
    userId?: string;
    movieId?: string;
  }) {
    return apiClient.get<Receipt[]>('/receipts', params as Record<string, string>);
  },
  
  async getReceipt(id: string) {
    return apiClient.get<Receipt & {
      user: User;
      movie: Movie;
      tickets: Ticket[];
    }>(`/receipts/${id}`);
  },
  
  async createReceipt(receipt: {
    id?: string;
    userId: string;
    movieId: string;
    ticketIds: string[];
    totalPrice: number;
    paymentMethod: string;
    receiptDate: string;
  }) {
    return apiClient.post<Receipt>('/receipts', receipt);
  },
  
  async updateReceipt(id: string, receipt: {
    paymentMethod?: string;
    totalPrice?: number;
  }) {
    return apiClient.put<Receipt>(`/receipts/${id}`, receipt);
  },
  
  async deleteReceipt(id: string) {
    return apiClient.delete<{ message: string }>(`/receipts/${id}`);
  }
};
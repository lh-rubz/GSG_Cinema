import { apiClient } from '../client';
import type { Promotion } from '@/types/types';

export const promotionsApi = {
  async getPromotions(params?: {
    code?: string;
    isActive?: boolean;
  }) {
    return apiClient.get<Promotion[]>('/promotions', params as Record<string, string>);
  },
  
  async getPromotion(id: string) {
    return apiClient.get<Promotion>(`/promotions/${id}`);
  },
  
  async createPromotion(promotion: {
    code: string;
    description: string;
    type: "PERCENTAGE" | "FIXED_AMOUNT" | "BUY_ONE_GET_ONE";
    value: number;
    startDate: string;
    expiryDate: string;
    isActive?: boolean;
  }) {
    return apiClient.post<Promotion>('/promotions', promotion);
  },
  
  async updatePromotion(id: string, promotion: Partial<Promotion>) {
    return apiClient.put<Promotion>(`/promotions/${id}`, promotion);
  },
  
  async deletePromotion(id: string) {
    return apiClient.delete<{ message: string }>(`/promotions/${id}`);
  },

  async validatePromotion(data: {
    code: string;
    showtimeId: string;
    totalPrice: number;
  }) {
    return apiClient.post<{
      valid: boolean;
      promotion: Promotion;
      discountAmount: number;
      finalPrice: number;
    }>('/promotions/validate', data);
  }
}; 
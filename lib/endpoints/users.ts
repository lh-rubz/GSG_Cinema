import { apiClient } from '../client';
import type { User, Review, Ticket, Receipt } from '@/types/types';

export const usersApi = {
  async getUsers(params?: {
    username?: string;
    email?: string;
  }) {
    return apiClient.get<User[]>('/users', params as Record<string, string>);
  },
  
  async getUser(id: string) {
    return apiClient.get<User & {
      reviews: Review[];
      tickets: Ticket[];
      receipts: Receipt[];
    }>(`/users/${id}`);
  },
  
  async createUser(user: {
    id?: string;
    username: string;
    displayName: string;
    bio?:string;
    email:string;
    gender:string;
    profileImage?: string;
    password: string;
  }) {
    console.log(user);
    return apiClient.post<User>('/users', user);
  },
  
  async updateUser(id: string, user: Partial<User>) {
    return apiClient.put<User>(`/users/${id}`, user);
  },
  
  async deleteUser(id: string) {
    return apiClient.delete<{ message: string }>(`/users/${id}`);
  }
};
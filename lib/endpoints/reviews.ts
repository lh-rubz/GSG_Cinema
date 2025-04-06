import { apiClient } from '../client';
import type { Review, User, Movie, Reply, ReplyWithUser } from '@/types/types';

export const reviewsApi = {
  async getReviews(params?: {
    movieId?: string;
    userId?: string;
  }) {
    return apiClient.get<Review[]>('/reviews', params as Record<string, string>);
  },
  
  async getReview(id: string) {
    return apiClient.get<Review & {
      user: User;
      movie: Movie;
      replies: Reply[];
      likedBy: User[];
    }>(`/reviews/${id}`);
  },

  async createReview(review: {
    userId: string;
    movieId: string;
    rating: number;
    comment: string;
  }) {
    return apiClient.post<Review>('/reviews', review);
  },
  
  async updateReview(id: string, review: {
    rating?: number;
    comment?: string;
  }) {
    return apiClient.put<Review>(`/reviews/${id}`, review);
  },
  
  async deleteReview(id: string) {
    return apiClient.delete<{ message: string }>(`/reviews/${id}`);
  },
  
  async likeReview(id: string, userId: string) {
    return apiClient.post<Review>(`/reviews/${id}/like`, { userId });
  },
  
  async unlikeReview(id: string, userId: string) {
    return apiClient.delete<Review>(`/reviews/${id}/like?userId=${userId}`);
  },
  
  async getReplies(reviewId: string) {
    return apiClient.get<Reply[]>(`/reviews/${reviewId}/reply`);
  },
  
  async addReply(reviewId: string, reply: {
    userId: string;
    comment: string;
  }) {
    return apiClient.post<Reply>(`/reviews/${reviewId}/reply`, reply);
  },
  
};
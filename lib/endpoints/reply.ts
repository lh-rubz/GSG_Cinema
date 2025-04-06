import { apiClient } from '../client';
import type { Reply, ReplyWithUser, ReportedReply, User } from '@/types/types';

export const repliesApi = {
    // Get all replies for a review
    async getReplies(reviewId: string) {
      return apiClient.get<ReplyWithUser[]>(`/reviews/${reviewId}/reply`);
    },
    
    // Get a specific reply
    async getReply(id: string) {
      return apiClient.get<ReplyWithUser>(`/replies/${id}`);
    },
    
    // Create a new reply
    async createReply(reviewId: string, reply: {
      id?: string;
      userId: string;
      comment: string;
    }) {
      return apiClient.post<ReplyWithUser>(`/reviews/${reviewId}/reply`, reply);
    },
    
    // Update a reply
    async updateReply(id: string, data: {
      comment: string;
    }) {
      return apiClient.put<ReplyWithUser>(`/replies/${id}`, data);
    },
    
    // Delete a reply
    async deleteReply(id: string) {
      return apiClient.delete<{ message: string }>(`/replies/${id}`);
    },
    
    // Report a reply
    async reportReply(id: string, userId: string) {
      return apiClient.post<{
        success: boolean;
        reportCount: number;
      }>(`/replies/${id}/report`, { userId });
    },
    
    // Unreport a reply (remove your report)
    async unreportReply(id: string, userId: string) {
      return apiClient.post<{
        success: boolean;
        reportCount: number;
      }>(`/replies/${id}/unreport`, { userId });
    },
    
    // Check if a user has reported a reply
    async hasReported(id: string, userId: string) {
      return apiClient.get<{
        hasReported: boolean;
      }>(`/replies/${id}/has-reported`, { userId });
    },
    
    // Admin: Get all reported replies
    async getReportedReplies() {
      return apiClient.get<ReportedReply[]>('/admin/reported-replies');
    },
    
    // Admin: Clear all reports for a reply
    async clearReports(id: string) {
      return apiClient.post<{
        success: boolean;
        message: string;
      }>(`/admin/replies/${id}/clear-reports`, {});
    },
    
    // Get replies by user
    async getUserReplies(userId: string) {
      return apiClient.get<ReplyWithUser[]>(`/users/${userId}/replies`);
    }
  };
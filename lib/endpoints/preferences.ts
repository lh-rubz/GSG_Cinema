
import { apiClient } from '../client';

export type TimeFormat = 'TWELVE_HOUR' | 'TWENTY_FOUR_HOUR';
export type DurationFormat = 'MINUTES_ONLY' | 'HOURS_AND_MINUTES';
export type CurrencyType = 'USD' | 'NIS';

export interface UserPreferences {
  id: string;
  userId: string;
  timeFormat: TimeFormat;
  durationFormat: DurationFormat;
  currency: CurrencyType;
  updatedAt: string;
}

export const preferencesApi = {

  async getUserPreferences(userId: string) {
    return apiClient.get<UserPreferences>(`/users/${userId}/preferences`);
  },
  
  async updateUserPreferences(userId: string, preferences: Partial<{
    timeFormat: TimeFormat;
    durationFormat: DurationFormat;
    currency: CurrencyType;
  }>) {
    return apiClient.put<UserPreferences>(`/users/${userId}/preferences`, preferences);
  }
};
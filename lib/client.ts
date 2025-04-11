const API_BASE_URL = '/api';

interface ApiResponse<T> {
  status: number;
  data?: T;
  error?: string;
}

// Error class for API errors
export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

// Base client with common fetch logic
export const apiClient = {
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    try {
      const url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin);
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, value);
          }
        });
      }
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      return {
        data: response.ok ? data : undefined,
        error: !response.ok ? data.error || 'An error occurred' : undefined,
        status: response.status,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 500,
      };
    }
  },
  
  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        // Check if it's a conflict error
        if (response.status === 400 && responseData.error?.toLowerCase().includes('time conflict')) {
          return {
            status: response.status,
            error: responseData.error,
          };
        }
        
        console.error(`Failed to POST to ${endpoint}`, responseData);
        return {
          status: response.status,
          error: responseData.error || 'An error occurred',
        };
      }
      
      return {
        status: response.status,
        data: responseData,
      };
    } catch (error) {
      console.error(`Error in POST to ${endpoint}:`, error);
      return {
        status: 500,
        error: 'Network error occurred',
      };
    }
  },
  
  
  async put<T, D = any>(endpoint: string, data: D): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const responseData = await response.json();
      
      return {
        data: response.ok ? responseData : undefined,
        error: !response.ok ? responseData.error || 'An error occurred' : undefined,
        status: response.status,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 500,
      };
    }
  },
  
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      return {
        data: response.ok ? data : undefined,
        error: !response.ok ? data.error || 'An error occurred' : undefined,
        status: response.status,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 500,
      };
    }
  },
};
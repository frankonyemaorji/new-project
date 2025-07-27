import React from "react";
import { User } from "../context/AuthContext";

/**
 * User Service
 * 
 * Handles API calls related to user data management.
 * Provides functions to fetch complete user profiles from the backend
 * and update user information.
 * 
 * This service bridges the gap between NextAuth session data (which is minimal)
 * and the complete user profile stored in your MongoDB database.
 */


class UserApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://edu-connect-api.onrender.com';
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  // Get complete user profile by ID
  async getUserProfile(userId: string, accessToken?: string): Promise<User> {
    return this.makeRequest<User>(`/users/${userId}`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
  }

  // Update user profile
  async updateUserProfile(userId: string, userData: Partial<User>, accessToken?: string): Promise<User> {
    return this.makeRequest<User>(`/users/${userId}`, {
      method: 'PUT',
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      body: JSON.stringify(userData),
    });
  }

  // Get user by email (useful for matching session data with database)
  async getUserByEmail(email: string, accessToken?: string): Promise<User> {
    return this.makeRequest<User>(`/users/email/${email}`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
  }
}

// Create singleton instance
export const userService = new UserApiService();

// React hook for fetching complete user data
export function useUserProfile(userId?: string, accessToken?: string) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchUserProfile = React.useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userData = await userService.getUserProfile(userId, accessToken);
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user profile');
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, accessToken]);

  React.useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return { user, loading, error, refetch: fetchUserProfile };
}
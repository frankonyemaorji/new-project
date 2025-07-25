import React from "react";
import { useAuth } from "@/lib/context/AuthContext";

// lib/services/universityService.ts

export interface University {
  uid: string;
  name: string;
  website?: string;
  country: string;
  city: string;
  founded_year?: number;
  university_type: 'private' | 'public' | 'research' | 'technical' | 'medical' | 'agricultural';
  ranking: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'NOT_RANKED';
  description?: string;
  nigerian_students?: number;
  acceptance_rate?: number;
  average_annual_tuition: number;
  contact_email?: string;
  contact_phone?: string;
  languages_of_instruction?: string[];
  offers_scholarships: boolean;
  provides_accommodation: boolean;
  partner_university?: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  academic_programs?: AcademicProgram[];
}

export interface AcademicProgram {
  uid: string;
  name: string;
  degree_type: string;
  faculty: string;
  department: string;
  duration_years: number;
  description?: string;
  entry_requirements?: string;
  tuition_fee: number;
  is_active: boolean;
  university_uid: string;
  created_at: string;
  updated_at: string;
}

export interface UniversityFilters {
  skip?: number;
  limit?: number;
  country?: string;
  city?: string;
  university_type?: string;
  ranking?: string;
  offers_scholarships?: boolean;
  provides_accommodation?: boolean;
  search?: string;
}

class UniversityApiService {
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

  // Get list of universities with filters
  async getUniversities(filters: UniversityFilters = {}): Promise<University[]> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();
    const endpoint = `/universities/${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<University[]>(endpoint);
  }

  // Get single university by ID
  async getUniversity(universityId: string): Promise<University> {
    return this.makeRequest<University>(`/universities/${universityId}`);
  }

  // Get university programs
  async getUniversityPrograms(universityId: string): Promise<AcademicProgram[]> {
    return this.makeRequest<AcademicProgram[]>(`/universities/${universityId}/programs`);
  }

  // Get university types enum
  async getUniversityTypes(): Promise<string[]> {
    return this.makeRequest<string[]>('/universities/enums/types');
  }

  // Get rankings enum
  async getRankings(): Promise<string[]> {
    return this.makeRequest<string[]>('/universities/enums/rankings');
  }

  // Get languages enum
  async getLanguages(): Promise<string[]> {
    return this.makeRequest<string[]>('/universities/enums/languages');
  }

  // Get statistics (admin only)
  async getStatistics(accessToken?: string): Promise<any> {
    return this.makeRequest<any>('/universities/statistics/summary', {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
  }
}

// Create singleton instance
export const universityService = new UniversityApiService();

// React hooks for easy use in components
export function useUniversities(filters: UniversityFilters = {}) {
  const [universities, setUniversities] = React.useState<University[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchUniversities = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await universityService.getUniversities(filters);
      setUniversities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch universities');
      console.error('Error fetching universities:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  React.useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  return { universities, loading, error, refetch: fetchUniversities };
}

export function useUniversity(universityId: string) {
  const [university, setUniversity] = React.useState<University | null>(null);
  const [programs, setPrograms] = React.useState<AcademicProgram[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUniversityData = async () => {
      if (!universityId) return;

      try {
        setLoading(true);
        setError(null);
        
        const [universityData, programsData] = await Promise.all([
          universityService.getUniversity(universityId),
          universityService.getUniversityPrograms(universityId),
        ]);

        setUniversity(universityData);
        setPrograms(programsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch university data');
        console.error('Error fetching university:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversityData();
  }, [universityId]);

  return { university, programs, loading, error };
}


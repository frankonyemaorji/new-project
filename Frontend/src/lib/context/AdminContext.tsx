"use client";
import { createContext, type ReactNode, useContext, useState } from "react";

interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "super_admin" | "admin" | "editor";
  permissions: string[];
  profilePicture?: string;
  lastLogin: string;
  createdAt: string;
}

interface AcademicProgram {
  name: string;
  degree_type: string;
  faculty: string;
  department: string;
  duration_years: number;
  description?: string;
  entry_requirements?: string;
  tuition_fee: number;
  is_active: boolean;
}

interface University {
  uid?: string;
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
  created_at?: string;
  updated_at?: string;
  academic_programs?: AcademicProgram[];
}

interface CreateUniversityPayload extends Omit<University, 'uid' | 'created_at' | 'updated_at'> {}

interface UpdateUniversityPayload extends Omit<University, 'uid' | 'created_at' | 'updated_at' | 'academic_programs'> {}

interface AdminContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  createUniversity: (universityData: CreateUniversityPayload) => Promise<University | null>;
  updateUniversity: (universityId: string, universityData: UpdateUniversityPayload) => Promise<University | null>;
  deleteUniversity: (universityId: string) => Promise<boolean>;
  getUniversities: () => Promise<University[]>;
  getUniversity: (universityId: string) => Promise<University | null>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const getAdminPermissions = (email: string): string[] => {
  if (email === "testadmin@gmail.com") {
    return ["all"];
  }
  if (email === "admin@educonnect.africa") {
    return ["universities.read", "universities.write", "scholarships.read", "scholarships.write", "users.read", "users.write"];
  }
  return [];
};

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://edu-connect-api.onrender.com';

  const makeAuthenticatedRequest = async <T>(
    apiEndpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    // Handle different endpoint patterns:
    // - Auth endpoints use /api/v1/ prefix
    // - University endpoints use no prefix (direct /universities/)
    let endpoint = apiEndpoint;
    if (apiEndpoint.includes('/auth/')) {
      endpoint = apiEndpoint.startsWith('/api/v1/') ? apiEndpoint : `/api/v1${apiEndpoint}`;
    }
    
    const url = `${baseUrl}${endpoint}`;
    
    console.log(`📡 Making API request to: ${url}`);
    
    // Check if we're using mock authentication
    const isMockAuth = adminToken === 'mock_admin_token';
    
    if (isMockAuth) {
      console.log('🎭 Using mock API response for:', endpoint);
      return handleMockResponse<T>(endpoint, options);
    }
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error: ${response.status} - ${errorText}`);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  };

  const handleMockResponse = <T>(endpoint: string, options: RequestInit): T => {
    console.log('🎭 Mock response for:', endpoint, options.method);
    
    if (options.method === 'POST' && endpoint.includes('/universities')) {
      const requestBody = JSON.parse(options.body as string);
      const mockUniversity = {
        uid: `mock-${Date.now()}`,
        ...requestBody,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      console.log('✅ Mock university created:', mockUniversity);
      return mockUniversity as T;
    }
    
    if (options.method === 'GET' && endpoint.includes('/universities')) {
      const mockUniversities = [
        {
          uid: 'mock-1',
          name: 'African Leadership University',
          country: 'Rwanda',
          city: 'Kigali',
          university_type: 'private',
          ranking: 'A',
          is_active: false,
          average_annual_tuition: 3000,
          offers_scholarships: true,
          provides_accommodation: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      return mockUniversities as T;
    }
    
    return {} as T;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Use the correct API endpoint from Swagger: /api/v1/auth/login
      const loginEndpoint = '/api/v1/auth/login';
      
      console.log(`🔐 Attempting login at: ${baseUrl}${loginEndpoint}`);
      
      const response = await fetch(`${baseUrl}${loginEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log(`📡 Response status: ${response.status}`);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Login successful:', result);
        
        // Extract user data from the API response
        const userData = result.user || result.data || result;
        
        const adminData: Admin = {
          id: userData.id || userData.user_id || 'user-1',
          email: email,
          firstName: userData.first_name || userData.firstName || 'Admin',
          lastName: userData.last_name || userData.lastName || 'User',
          role: determineUserRole(email, userData),
          permissions: getAdminPermissions(email),
          profilePicture: userData.profile_picture || userData.avatar,
          lastLogin: new Date().toISOString(),
          createdAt: userData.created_at || new Date().toISOString()
        };

        // Store the access token from the API
        const token = result.access_token || result.token || result.accessToken;
        setAdminToken(token);
        setAdmin(adminData);
        setIsLoading(false);
        
        console.log('✅ Admin login successful with real API');
        return true;
        
      } else {
        const errorText = await response.text();
        console.error(`❌ API login failed: ${response.status} - ${errorText}`);
        
        // Fallback authentication for development/testing ONLY if API fails
        if (email === "testadmin@gmail.com" && password === "Password12") {
          console.log('🎭 Using fallback authentication - API login failed');
          
          const adminData: Admin = {
            id: 'admin-1',
            email: email,
            firstName: 'Test',
            lastName: 'Admin',
            role: "super_admin",
            permissions: getAdminPermissions(email),
            lastLogin: new Date().toISOString(),
            createdAt: new Date().toISOString()
          };

          setAdmin(adminData);
          setAdminToken('mock_admin_token');
          setIsLoading(false);
          
          console.warn('⚠️ Using fallback authentication - API not responding correctly');
          return true;
        }
        
        setIsLoading(false);
        return false;
      }
      
    } catch (error) {
      console.error('❌ Login network error:', error);
      
      // Fallback authentication for development/testing ONLY on network errors
      if (email === "testadmin@gmail.com" && password === "Password12") {
        console.log('🎭 Using fallback authentication - Network error');
        
        const adminData: Admin = {
          id: 'admin-1',
          email: email,
          firstName: 'Test',
          lastName: 'Admin',
          role: "super_admin",
          permissions: getAdminPermissions(email),
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };

        setAdmin(adminData);
        setAdminToken('mock_admin_token');
        setIsLoading(false);
        
        console.warn('⚠️ Using fallback authentication - Network error occurred');
        return true;
      }
      
      setIsLoading(false);
      return false;
    }
  };

  // Helper function to determine user role
  const determineUserRole = (email: string, userData: any): "super_admin" | "admin" | "editor" => {
    // Check if the API response includes role information
    if (userData.role) {
      return userData.role;
    }
    
    // Check if user has admin permissions based on email or other criteria
    if (email === "testadmin@gmail.com" || userData.is_admin || userData.user_type === 'admin') {
      return "super_admin";
    }
    
    // Default role for admin access
    return "admin";
  };

  const logout = async () => {
    // Call logout endpoint if we have a real token
    if (adminToken && adminToken !== 'mock_admin_token') {
      try {
        await fetch(`${baseUrl}/api/v1/auth/logout`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
          },
        });
      } catch (error) {
        console.error('Logout API call failed:', error);
      }
    }
    
    setAdmin(null);
    setAdminToken(null);
  };

  const hasPermission = (permission: string): boolean => {
    if (!admin) return false;
    if (admin.permissions.includes("all")) return true;
    return admin.permissions.includes(permission);
  };

  const createUniversity = async (universityData: CreateUniversityPayload): Promise<University | null> => {
    try {
      if (!hasPermission("universities.write") && !hasPermission("all")) {
        throw new Error("Insufficient permissions to create university");
      }

      console.log('🏛️ Creating university with data:', universityData);

      const university = await makeAuthenticatedRequest<University>('/universities/', {
        method: 'POST',
        body: JSON.stringify(universityData),
      });

      console.log('✅ University created successfully:', university);
      return university;
    } catch (error) {
      console.error('❌ Error creating university:', error);
      
      // If we're in mock mode and the error is token-related, try mock response
      if (adminToken === 'mock_admin_token') {
        console.log('🎭 Creating mock university due to mock auth mode');
        const mockUniversity: University = {
          uid: `mock-${Date.now()}`,
          ...universityData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return mockUniversity;
      }
      
      return null;
    }
  };

  const updateUniversity = async (universityId: string, universityData: UpdateUniversityPayload): Promise<University | null> => {
    try {
      if (!hasPermission("universities.write") && !hasPermission("all")) {
        throw new Error("Insufficient permissions to update university");
      }

      console.log(`🔄 Updating university ${universityId} with data:`, universityData);

      const university = await makeAuthenticatedRequest<University>(`/universities/${universityId}`, {
        method: 'PUT',
        body: JSON.stringify(universityData),
      });

      console.log('✅ University updated successfully:', university);
      return university;
    } catch (error) {
      console.error('❌ Error updating university:', error);
      return null;
    }
  };

  const deleteUniversity = async (universityId: string): Promise<boolean> => {
    try {
      if (!hasPermission("universities.write") && !hasPermission("all")) {
        throw new Error("Insufficient permissions to delete university");
      }

      console.log(`🗑️ Deleting university ${universityId}`);

      await makeAuthenticatedRequest(`/universities/${universityId}`, {
        method: 'DELETE',
      });

      console.log('✅ University deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Error deleting university:', error);
      return false;
    }
  };

  const getUniversities = async (): Promise<University[]> => {
    try {
      if (!hasPermission("universities.read") && !hasPermission("all")) {
        throw new Error("Insufficient permissions to read universities");
      }

      console.log('📚 Fetching universities list');

      const universities = await makeAuthenticatedRequest<University[]>('/universities/');
      
      console.log('✅ Universities fetched successfully:', universities);
      return universities;
    } catch (error) {
      console.error('❌ Error fetching universities:', error);
      return [];
    }
  };

  const getUniversity = async (universityId: string): Promise<University | null> => {
    try {
      if (!hasPermission("universities.read") && !hasPermission("all")) {
        throw new Error("Insufficient permissions to read university");
      }

      console.log(`📖 Fetching university ${universityId}`);

      const university = await makeAuthenticatedRequest<University>(`/universities/${universityId}`);
      
      console.log('✅ University fetched successfully:', university);
      return university;
    } catch (error) {
      console.error('❌ Error fetching university:', error);
      return null;
    }
  };

  const value: AdminContextType = {
    admin,
    isAuthenticated: !!admin,
    isLoading,
    login,
    logout,
    hasPermission,
    createUniversity,
    updateUniversity,
    deleteUniversity,
    getUniversities,
    getUniversity,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}

export type { Admin, University, AcademicProgram, CreateUniversityPayload, UpdateUniversityPayload };
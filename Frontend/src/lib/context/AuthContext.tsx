"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { MockAuthService } from "@/lib/services/mockAuthService";
import type { User } from "@/lib/types/user";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
  isCounselor: boolean;
  isStudent: boolean;
  hasPermission: (permission: string) => boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const authService = MockAuthService.getInstance();
  
  useEffect(() => {
    setIsMounted(true);
    // Check for existing session
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await authService.login(email, password);
      
      if (result.success && result.user) {
        setUser(result.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await authService.register(userData);
      
      if (result.success && result.user) {
        setUser(result.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  // Role-based helpers
  const isAdmin = user?.role === 'Admin';
  const isCounselor = user?.role === 'Counselor';
  const isStudent = user?.role === 'Student';

  // Permission checking (simplified version)
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Admin has all permissions
    if (user.role === 'Admin') return true;
    
    // Define role-based permissions
    const rolePermissions = {
      'Student': ['read_profile', 'update_profile', 'read_universities', 'create_application'],
      'Counselor': ['read_profile', 'update_profile', 'read_universities', 'manage_sessions'],
      'Admin': ['*'] // All permissions
    };
    
    const userPermissions = rolePermissions[user.role] || [];
    return userPermissions.includes(permission) || userPermissions.includes('*');
  };

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <AuthContext.Provider value={{ 
        user: null, 
        login: async () => false, 
        register: async () => false, 
        logout: () => {}, 
        isLoading: true,
        isAdmin: false,
        isCounselor: false,
        isStudent: false,
        hasPermission: () => false
      }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isLoading,
      isAdmin,
      isCounselor,
      isStudent,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

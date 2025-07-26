"use client";
import { signOut, useSession } from "next-auth/react";
import { ReactNode, createContext, useContext } from "react";

// lib/context/AuthContext.tsx


interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  role: string;
  // Add fields expected by ProfileHeader
  firstName: string;
  lastName: string;
  profilePicture?: string;
  verified: boolean;
  createdAt?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  nationality?: string;
  state?: string;
  city?: string;
  gender?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  accessToken?: string;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const hasPermission = (permission: string): boolean => {
    if (!session?.user) return false;
    
    // Implement your permission logic based on role
    const userRole = session.user.role;
    
    // Example permission logic
    switch (userRole) {
      case 'Admin':
        return true; // Admin has all permissions
      case 'Counselor':
        return ['read_universities', 'read_programs', 'manage_students'].includes(permission);
      case 'user':
        return ['read_universities', 'read_programs'].includes(permission);
      default:
        return false;
    }
  };

  const logout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // Transform session user to match expected User interface
  const transformedUser: User | null = session?.user ? {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    username: session.user.username,
    role: session.user.role,
    // Parse name into firstName and lastName
    firstName: session.user.name?.split(' ')[0] || '',
    lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
    profilePicture: session.user.image || undefined,
    verified: false, // You can get this from your backend later
    createdAt: undefined, // You can get this from your backend later
    phoneNumber: undefined,
    dateOfBirth: undefined,
    nationality: undefined,
    state: undefined,
    city: undefined,
    gender: undefined,
  } : null;

  const value: AuthContextType = {
    user: transformedUser,
    isLoading: status === 'loading',
    hasPermission,
    accessToken: session?.accessToken,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
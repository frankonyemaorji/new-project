"use client";
import { signOut, useSession } from "next-auth/react";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

// Import the user types that match your backend model
interface WAECGrade {
  subject: string;
  grade: string;
}

interface JAMBScore {
  score: number;
  year: number;
}

interface PostUTME {
  institution: string;
  score: number;
  year: number;
}

interface AvailableHours {
  day: string;
  startTime: string;
  endTime: string;
}

// Extended User interface that includes both backend model and frontend needs
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'STUDENT' | 'COUNSELOR' | 'ADMIN';
  profilePicture?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  nationality?: string;
  
  // Student specific fields (from backend)
  waecGrades?: WAECGrade[];
  jamb?: JAMBScore;
  postUTME?: PostUTME;
  currentEducationLevel?: string;
  desiredCourse?: string;
  preferredCountries?: string[];
  
  // Counselor specific fields (from backend)
  specialization?: string[];
  experience?: number;
  qualifications?: string[];
  bio?: string;
  availableHours?: AvailableHours[];
  rating?: number;
  totalSessions?: number;
  
  // Common fields (from backend)
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;

  // Additional frontend-specific fields (will be empty arrays/objects by default)
  savedUniversities?: string[]; // Array of university IDs
  applications?: Application[];
  studyPreferences?: StudyPreferences;
  languageProficiencies?: LanguageProficiency[];
  
  // Additional profile fields that components expect
  gender?: 'Male' | 'Female' | 'Prefer not to say' | 'Other';
  state?: string;
  city?: string;
}

// Additional types for frontend components
interface Application {
  id: string;
  universityId: string;
  universityName: string;
  programId: string;
  programName: string;
  status: 'Preparing' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  applicationDate: string;
  lastUpdated: string;
}

interface StudyPreferences {
  fieldsOfInterest?: string[];
  preferredCountries?: string[];
  preferredDegreeTypes?: string[];
  preferredLanguages?: string[];
  budgetRange?: {
    min: number;
    max: number;
  };
  accommodationPreference?: 'Required' | 'Not Required' | 'No Preference';
  startDate?: 'Immediate' | 'Next 3 Months' | 'Next 6 Months' | 'Next Year' | 'Flexible';
  studyMode?: 'Full-time' | 'Part-time' | 'Online' | 'Hybrid' | 'No Preference';
  scholarshipRequired?: boolean;
}

interface LanguageProficiency {
  language: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native' | 'Certified';
  certification?: string;
  score?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  accessToken?: string;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  isProfileLoaded: boolean; // Indicates if backend profile has been loaded
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [backendUser, setBackendUser] = useState<User | null>(null);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  const hasPermission = (permission: string): boolean => {
    if (!session?.user) return false;
    
    const userRole = session.user.role;
    
    switch (userRole) {
      case 'ADMIN':
        return true;
      case 'COUNSELOR':
        return ['read_universities', 'read_programs', 'manage_students'].includes(permission);
      case 'STUDENT':
        return ['read_universities', 'read_programs'].includes(permission);
      default:
        return false;
    }
  };

  const logout = async () => {
    setBackendUser(null);
    setIsProfileLoaded(false);
    await signOut({ callbackUrl: '/' });
  };

  // Fetch complete user profile from backend
  const refreshUserProfile = async () => {
    if (!session?.user?.email) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://edu-connect-api.onrender.com';
      const response = await fetch(`${baseUrl}/users/email/${session.user.email}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(session.accessToken && { Authorization: `Bearer ${session.accessToken}` }),
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setBackendUser(userData);
      } else {
        console.warn('Could not fetch user profile from backend');
      }
    } catch (error) {
      console.warn('Error fetching user profile:', error);
    } finally {
      setIsProfileLoaded(true);
    }
  };

  // Fetch backend user data when session is available
  useEffect(() => {
    if (session?.user && !isProfileLoaded) {
      refreshUserProfile();
    }
  }, [session, isProfileLoaded]);

  // Create minimal user from session data
  const createMinimalUser = (sessionUser: any): User => ({
    _id: sessionUser.id || '',
    email: sessionUser.email || '',
    firstName: sessionUser.name?.split(' ')[0] || '',
    lastName: sessionUser.name?.split(' ').slice(1).join(' ') || '',
    role: (sessionUser.role as 'STUDENT' | 'COUNSELOR' | 'ADMIN') || 'STUDENT',
    profilePicture: sessionUser.image || undefined,
    phoneNumber: undefined,
    dateOfBirth: undefined,
    nationality: undefined,
    
    // Initialize arrays as empty to prevent undefined errors
    waecGrades: [],
    preferredCountries: [],
    specialization: [],
    qualifications: [],
    availableHours: [],
    
    // Frontend-specific fields with default empty values
    savedUniversities: [],
    applications: [],
    studyPreferences: {
      fieldsOfInterest: [],
      preferredCountries: [],
      preferredDegreeTypes: [],
      preferredLanguages: [],
      budgetRange: undefined,
      accommodationPreference: undefined,
      startDate: undefined,
      studyMode: undefined,
      scholarshipRequired: false,
    },
    languageProficiencies: [],
    
    // Additional profile fields
    gender: undefined,
    state: undefined,
    city: undefined,
    
    // Default values
    jamb: undefined,
    postUTME: undefined,
    currentEducationLevel: undefined,
    desiredCourse: undefined,
    experience: undefined,
    bio: undefined,
    rating: 0,
    totalSessions: 0,
    verified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLogin: undefined,
  });

  // Use backend user data if available, otherwise use session data
  const user = backendUser || (session?.user ? createMinimalUser(session.user) : null);

  const value: AuthContextType = {
    user,
    isLoading: status === 'loading',
    hasPermission,
    accessToken: session?.accessToken,
    logout,
    refreshUserProfile,
    isProfileLoaded,
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

// Export the User type for use in other components
export type { User };
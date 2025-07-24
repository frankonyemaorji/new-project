import { mockUsers, mockCredentials } from "@/lib/data/mockUsers";
import type { User } from "@/lib/types/user";

// Mock authentication service to replace backend auth
export class MockAuthService {
  private static instance: MockAuthService;
  private currentUser: User | null = null;
  private sessionKey = "educonnect_mock_session";

  static getInstance(): MockAuthService {
    if (!MockAuthService.instance) {
      MockAuthService.instance = new MockAuthService();
    }
    return MockAuthService.instance;
  }

  constructor() {
    // Check for existing session on initialization
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(this.sessionKey);
      if (saved) {
        try {
          this.currentUser = JSON.parse(saved);
        } catch (e) {
          localStorage.removeItem(this.sessionKey);
        }
      }
    }
  }

  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const validPassword = mockCredentials[email as keyof typeof mockCredentials];
    if (!validPassword || validPassword !== password) {
      return { success: false, error: "Invalid email or password" };
    }

    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    this.currentUser = user;
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.sessionKey, JSON.stringify(user));
    }

    return { success: true, user };
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if user already exists
    if (mockUsers.find(u => u.email === userData.email)) {
      return { success: false, error: "User with this email already exists" };
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      nationality: "Nigeria", // Default nationality for demo
      verified: false,
      role: "Student",
      createdAt: new Date().toISOString(),
      qualifications: [],
      languageProficiencies: [
        {
          language: "English",
          level: "Advanced"
        }
      ],
      studyPreferences: {
        fieldsOfInterest: [],
        preferredCountries: [],
        preferredDegreeTypes: [],
        preferredLanguages: ["English"],
        budgetRange: {
          min: 0,
          max: 20000
        },
        accommodationPreference: "No Preference",
        startDate: "Flexible",
        studyMode: "No Preference",
        scholarshipRequired: false
      },
      savedUniversities: [],
      applications: [],
      counselingSessions: []
    };

    // Add to mock users (in real app, this would persist)
    mockUsers.push(newUser);
    mockCredentials[userData.email as keyof typeof mockCredentials] = userData.password;

    this.currentUser = newUser;
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.sessionKey, JSON.stringify(newUser));
    }

    return { success: true, user: newUser };
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.sessionKey);
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  // Admin specific login
  async adminLogin(email: string, password: string): Promise<{ success: boolean; admin?: any; token?: string; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const adminCredentials = {
      "admin@educonnect.africa": "admin123",
      "superadmin@educonnect.africa": "superadmin123"
    };

    const validPassword = adminCredentials[email as keyof typeof adminCredentials];
    if (!validPassword || validPassword !== password) {
      return { success: false, error: "Invalid admin credentials" };
    }

    const adminUser = mockUsers.find(u => u.email === email && u.role === "Admin");
    if (!adminUser) {
      return { success: false, error: "Admin user not found" };
    }

    const admin = {
      id: adminUser.id,
      email: adminUser.email,
      firstName: adminUser.firstName,
      lastName: adminUser.lastName,
      createdAt: adminUser.createdAt
    };

    const token = `mock_token_${Date.now()}`;

    return { success: true, admin, token };
  }
}
import { sampleUniversities } from "@/lib/data/universities";
import { mockCounselors } from "@/lib/data/mockCounselors";
import { mockScholarships } from "@/lib/data/mockScholarships";
import { mockUsers } from "@/lib/data/mockUsers";
import type { University } from "@/lib/types/university";

// Mock data service to replace all backend API calls
export class MockDataService {
  private static instance: MockDataService;
  
  // In-memory storage for non-persistent data
  private universities = [...sampleUniversities];
  private counselors = [...mockCounselors];
  private scholarships = [...mockScholarships];
  private users = [...mockUsers];

  static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  // Universities
  async getUniversities(filters?: any): Promise<University[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = this.universities;
    
    if (filters?.country) {
      filtered = filtered.filter(u => u.country.toLowerCase().includes(filters.country.toLowerCase()));
    }
    
    if (filters?.search) {
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        u.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    return filtered;
  }

  async getUniversityById(id: string): Promise<University | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.universities.find(u => u.id === id) || null;
  }

  async addUniversity(universityData: Omit<University, 'id'>): Promise<University> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUniversity: University = {
      ...universityData,
      id: `univ-${Date.now()}`
    };
    
    this.universities.push(newUniversity);
    return newUniversity;
  }

  async updateUniversity(id: string, updates: Partial<University>): Promise<University | null> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.universities.findIndex(u => u.id === id);
    if (index === -1) return null;
    
    this.universities[index] = { ...this.universities[index], ...updates };
    return this.universities[index];
  }

  async deleteUniversity(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.universities.findIndex(u => u.id === id);
    if (index === -1) return false;
    
    this.universities.splice(index, 1);
    return true;
  }

  // Counselors
  async getCounselors(): Promise<typeof mockCounselors> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.counselors;
  }

  async getCounselorById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.counselors.find(c => c.id === id) || null;
  }

  async addCounselor(counselorData: Omit<typeof mockCounselors[0], 'id'>): Promise<typeof mockCounselors[0]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newCounselor = {
      ...counselorData,
      id: `counselor-${Date.now()}`
    };
    
    this.counselors.push(newCounselor);
    return newCounselor;
  }

  async updateCounselor(id: string, updates: Partial<typeof mockCounselors[0]>) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.counselors.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    this.counselors[index] = { ...this.counselors[index], ...updates };
    return this.counselors[index];
  }

  async deleteCounselor(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.counselors.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.counselors.splice(index, 1);
    return true;
  }

  // Scholarships
  async getScholarships(filters?: any) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = this.scholarships;
    
    if (filters?.field) {
      filtered = filtered.filter(s => 
        s.eligibleFields.some(field => 
          field.toLowerCase().includes(filters.field.toLowerCase())
        )
      );
    }
    
    if (filters?.country) {
      filtered = filtered.filter(s => 
        s.eligibleCountries.includes('All African Countries') ||
        s.eligibleCountries.some(country => 
          country.toLowerCase().includes(filters.country.toLowerCase())
        )
      );
    }
    
    return filtered;
  }

  async getScholarshipById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.scholarships.find(s => s.id === id) || null;
  }

  async addScholarship(scholarshipData: Omit<typeof mockScholarships[0], 'id'>) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newScholarship = {
      ...scholarshipData,
      id: `scholarship-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.scholarships.push(newScholarship);
    return newScholarship;
  }

  async updateScholarship(id: string, updates: Partial<typeof mockScholarships[0]>) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.scholarships.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    this.scholarships[index] = { 
      ...this.scholarships[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return this.scholarships[index];
  }

  async deleteScholarship(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.scholarships.findIndex(s => s.id === id);
    if (index === -1) return false;
    
    this.scholarships.splice(index, 1);
    return true;
  }

  // Users/Students
  async getUsers(filters?: any) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = this.users.filter(u => u.role === 'Student');
    
    if (filters?.search) {
      filtered = filtered.filter(u => 
        u.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
        u.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
        u.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    return filtered;
  }

  async getUserById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.users.find(u => u.id === id) || null;
  }

  // Admin Dashboard Stats
  async getDashboardStats() {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const stats = {
      universities: {
        total: this.universities.length,
        change: "+12%",
        trend: "up"
      },
      students: {
        total: this.users.filter(u => u.role === 'Student').length,
        change: "+24%", 
        trend: "up"
      },
      counselors: {
        total: this.counselors.filter(c => c.isActive).length,
        change: "+8%",
        trend: "up"
      },
      scholarships: {
        total: this.scholarships.filter(s => s.isActive).length,
        change: "+15%",
        trend: "up"
      },
      applications: {
        total: this.users.reduce((acc, user) => acc + user.applications.length, 0),
        change: "+18%",
        trend: "up"
      },
      revenue: {
        total: 42500,
        change: "+22%",
        trend: "up"
      }
    };

    const recentActivity = [
      {
        id: "1",
        title: "New University Added",
        description: "University of Lagos was added to the platform",
        time: "2 hours ago",
        status: "success"
      },
      {
        id: "2", 
        title: "Student Registration",
        description: "5 new students registered today",
        time: "3 hours ago",
        status: "info"
      },
      {
        id: "3",
        title: "Scholarship Application",
        description: "12 new scholarship applications submitted",
        time: "5 hours ago",
        status: "success"
      },
      {
        id: "4",
        title: "Counselor Session",
        description: "15 counseling sessions completed today",
        time: "6 hours ago", 
        status: "info"
      }
    ];

    return {
      success: true,
      data: {
        stats,
        recentActivity
      }
    };
  }

  // Booking/Session Management
  async bookCounselingSession(sessionData: {
    counselorId: string;
    studentId: string;
    date: string;
    type: string;
    notes?: string;
  }) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const session = {
      id: `session-${Date.now()}`,
      ...sessionData,
      status: "Scheduled",
      createdAt: new Date().toISOString()
    };

    // Add to user's counseling sessions (non-persistent)
    const userIndex = this.users.findIndex(u => u.id === sessionData.studentId);
    if (userIndex !== -1) {
      this.users[userIndex].counselingSessions.push(session);
    }

    return { success: true, session };
  }

  // Reset data (for testing purposes)
  resetData() {
    this.universities = [...sampleUniversities];
    this.counselors = [...mockCounselors];
    this.scholarships = [...mockScholarships];
    this.users = [...mockUsers];
  }
}
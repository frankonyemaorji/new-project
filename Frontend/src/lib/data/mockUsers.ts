import type { User } from "@/lib/types/user";

// Mock users data for testing without backend
export const mockUsers: User[] = [
  {
    id: "user-001",
    email: "student@example.com",
    firstName: "John",
    lastName: "Doe",
    nationality: "Nigeria",
    verified: true,
    role: "Student",
    createdAt: new Date("2024-01-15").toISOString(),
    profilePicture: undefined,
    qualifications: [
      {
        id: "qual-001",
        type: "Secondary Education",
        institution: "Lagos State Model College",
        grade: "A1",
        year: 2023,
        certificate: "WAEC",
        subjects: [
          { name: "English Language", grade: "A1" },
          { name: "Mathematics", grade: "A1" },
          { name: "Physics", grade: "B2" },
          { name: "Chemistry", grade: "A1" },
          { name: "Biology", grade: "B3" }
        ]
      }
    ],
    languageProficiencies: [
      {
        language: "English",
        level: "Native"
      },
      {
        language: "Yoruba", 
        level: "Native"
      }
    ],
    studyPreferences: {
      fieldsOfInterest: ["Computer Science", "Engineering", "Business"],
      preferredCountries: ["Ghana", "South Africa", "Kenya"],
      preferredDegreeTypes: ["Bachelor"],
      preferredLanguages: ["English"],
      budgetRange: {
        min: 2000,
        max: 8000
      },
      accommodationPreference: "On-campus",
      startDate: "Fall 2024",
      studyMode: "Full-time",
      scholarshipRequired: true
    },
    savedUniversities: ["univ-001", "univ-002"],
    applications: [
      {
        id: "app-001",
        universityId: "univ-001",
        programId: "prog-001",
        status: "Under Review",
        submittedAt: new Date("2024-02-01").toISOString(),
        documents: ["transcript", "personal-statement", "recommendation-letters"]
      }
    ],
    counselingSessions: [
      {
        id: "session-001",
        counselorId: "counselor-001",
        date: new Date("2024-03-15").toISOString(),
        status: "Completed",
        type: "University Selection",
        notes: "Discussed options in Ghana and South Africa"
      }
    ]
  },
  {
    id: "user-002", 
    email: "admin@educonnect.africa",
    firstName: "Admin",
    lastName: "User",
    nationality: "Nigeria",
    verified: true,
    role: "Admin",
    createdAt: new Date("2023-01-01").toISOString(),
    qualifications: [],
    languageProficiencies: [
      {
        language: "English",
        level: "Native"
      }
    ],
    studyPreferences: {
      fieldsOfInterest: [],
      preferredCountries: [],
      preferredDegreeTypes: [],
      preferredLanguages: ["English"],
      budgetRange: {
        min: 0,
        max: 0
      },
      accommodationPreference: "No Preference",
      startDate: "Flexible",
      studyMode: "No Preference",
      scholarshipRequired: false
    },
    savedUniversities: [],
    applications: [],
    counselingSessions: []
  },
  {
    id: "user-003",
    email: "counselor@educonnect.africa", 
    firstName: "Sarah",
    lastName: "Johnson",
    nationality: "South Africa",
    verified: true,
    role: "Counselor",
    createdAt: new Date("2023-06-01").toISOString(),
    qualifications: [
      {
        id: "qual-002",
        type: "Masters",
        institution: "University of Cape Town",
        grade: "Distinction",
        year: 2020,
        certificate: "M.Ed in Educational Psychology"
      }
    ],
    languageProficiencies: [
      {
        language: "English",
        level: "Native"
      },
      {
        language: "Afrikaans",
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
        max: 0
      },
      accommodationPreference: "No Preference", 
      startDate: "Flexible",
      studyMode: "No Preference",
      scholarshipRequired: false
    },
    savedUniversities: [],
    applications: [],
    counselingSessions: []
  }
];

// Mock authentication credentials
export const mockCredentials = {
  "student@example.com": "password123",
  "admin@educonnect.africa": "admin123",
  "counselor@educonnect.africa": "counselor123"
};
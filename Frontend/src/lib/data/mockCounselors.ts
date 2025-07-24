export interface Counselor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  bio: string;
  specializations: string[];
  experience: number;
  education: string;
  languages: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  availability: {
    timezone: string;
    slots: Array<{
      day: string;
      startTime: string;
      endTime: string;
    }>;
  };
  isActive: boolean;
  joinedDate: string;
}

export const mockCounselors: Counselor[] = [
  {
    id: "counselor-001",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@educonnect.africa",
    bio: "Experienced educational counselor with 8+ years helping African students find their perfect university match. Specialized in STEM programs and scholarship applications.",
    specializations: ["STEM Programs", "Scholarship Applications", "University Selection", "Career Guidance"],
    experience: 8,
    education: "M.Ed Educational Psychology, University of Cape Town",
    languages: ["English", "Afrikaans", "French"],
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 50,
    availability: {
      timezone: "CAT (GMT+2)",
      slots: [
        { day: "Monday", startTime: "09:00", endTime: "17:00" },
        { day: "Tuesday", startTime: "09:00", endTime: "17:00" },
        { day: "Wednesday", startTime: "09:00", endTime: "17:00" },
        { day: "Thursday", startTime: "09:00", endTime: "17:00" },
        { day: "Friday", startTime: "09:00", endTime: "15:00" }
      ]
    },
    isActive: true,
    joinedDate: "2022-03-15"
  },
  {
    id: "counselor-002", 
    firstName: "Michael",
    lastName: "Okafor",
    email: "michael.okafor@educonnect.africa",
    bio: "Dedicated counselor focusing on business and economics programs across Africa. Helping students navigate admission requirements and application processes.",
    specializations: ["Business Programs", "Economics", "MBA Applications", "Interview Preparation"],
    experience: 6,
    education: "MBA Finance, Lagos Business School",
    languages: ["English", "Igbo", "Hausa"],
    rating: 4.7,
    reviewCount: 89,
    hourlyRate: 45,
    availability: {
      timezone: "WAT (GMT+1)",
      slots: [
        { day: "Monday", startTime: "10:00", endTime: "18:00" },
        { day: "Tuesday", startTime: "10:00", endTime: "18:00" },
        { day: "Wednesday", startTime: "10:00", endTime: "18:00" },
        { day: "Thursday", startTime: "10:00", endTime: "18:00" },
        { day: "Saturday", startTime: "09:00", endTime: "13:00" }
      ]
    },
    isActive: true,
    joinedDate: "2022-08-20"
  },
  {
    id: "counselor-003",
    firstName: "Amina",
    lastName: "Hassan",
    email: "amina.hassan@educonnect.africa", 
    bio: "Medical and health sciences counselor with extensive knowledge of admission requirements for top medical schools across Africa.",
    specializations: ["Medical Programs", "Health Sciences", "Research Opportunities", "Graduate School Applications"],
    experience: 10,
    education: "MD, University of Cairo; MPH, Johns Hopkins University",
    languages: ["English", "Arabic", "French"],
    rating: 4.8,
    reviewCount: 156,
    hourlyRate: 60,
    availability: {
      timezone: "EET (GMT+2)",
      slots: [
        { day: "Sunday", startTime: "14:00", endTime: "20:00" },
        { day: "Monday", startTime: "14:00", endTime: "20:00" },
        { day: "Tuesday", startTime: "14:00", endTime: "20:00" },
        { day: "Wednesday", startTime: "14:00", endTime: "20:00" },
        { day: "Thursday", startTime: "14:00", endTime: "20:00" }
      ]
    },
    isActive: true,
    joinedDate: "2021-11-10"
  },
  {
    id: "counselor-004",
    firstName: "David",
    lastName: "Mensah",
    email: "david.mensah@educonnect.africa",
    bio: "Engineering and technology specialist helping students with technical program selections and industry connections.",  
    specializations: ["Engineering Programs", "Computer Science", "Technology Fields", "Industry Connections"],
    experience: 7,
    education: "Ph.D Computer Engineering, University of Ghana",
    languages: ["English", "Twi", "French"],
    rating: 4.6,
    reviewCount: 73,
    hourlyRate: 55,
    availability: {
      timezone: "GMT",
      slots: [
        { day: "Monday", startTime: "08:00", endTime: "16:00" },
        { day: "Wednesday", startTime: "08:00", endTime: "16:00" },
        { day: "Friday", startTime: "08:00", endTime: "16:00" },
        { day: "Saturday", startTime: "10:00", endTime: "14:00" }
      ]
    },
    isActive: true,
    joinedDate: "2022-01-05"
  },
  {
    id: "counselor-005",
    firstName: "Grace",
    lastName: "Mwangi",
    email: "grace.mwangi@educonnect.africa",
    bio: "Law and social sciences counselor with deep understanding of African legal education systems and career pathways.",
    specializations: ["Law Programs", "Social Sciences", "Legal Career Guidance", "Internship Opportunities"],
    experience: 9,
    education: "LLM International Law, University of Nairobi",
    languages: ["English", "Swahili", "French"],
    rating: 4.7,
    reviewCount: 94,
    hourlyRate: 48,
    availability: {
      timezone: "EAT (GMT+3)",
      slots: [
        { day: "Tuesday", startTime: "09:00", endTime: "17:00" }, 
        { day: "Wednesday", startTime: "09:00", endTime: "17:00" },
        { day: "Thursday", startTime: "09:00", endTime: "17:00" },
        { day: "Friday", startTime: "09:00", endTime: "17:00" },
        { day: "Saturday", startTime: "09:00", endTime: "13:00" }
      ]
    },
    isActive: true,
    joinedDate: "2021-09-12"
  }
];
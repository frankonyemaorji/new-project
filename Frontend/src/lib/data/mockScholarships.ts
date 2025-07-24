export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  description: string;
  amount: number;
  currency: string;
  coverage: "Full" | "Partial" | "Varies";
  coverageDetails: string;
  eligibleCountries: string[];
  eligibleFields: string[];
  degreeTypes: string[];
  eligibilityCriteria: string[];
  applicationDeadline: string;
  applicationUrl: string;
  requirements: string[];
  benefits: string[];
  duration: string;
  renewable: boolean;
  contactEmail: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const mockScholarships: Scholarship[] = [
  {
    id: "scholarship-001",
    name: "African Excellence Scholarship",
    provider: "African Union Commission",
    description: "A comprehensive scholarship program for outstanding African students pursuing undergraduate and graduate studies in priority fields across African universities.",
    amount: 15000,
    currency: "USD", 
    coverage: "Full",
    coverageDetails: "Full tuition, accommodation, meals, books, and monthly stipend",
    eligibleCountries: ["All African Countries"],
    eligibleFields: ["Engineering", "Computer Science", "Medicine", "Agriculture", "Business"],
    degreeTypes: ["Bachelor", "Master", "PhD"],
    eligibilityCriteria: [
      "Must be a citizen of an African country",
      "Minimum GPA of 3.5 or equivalent",
      "Demonstrated leadership potential",
      "Financial need documentation",
      "Age limit: 35 years for graduate programs"
    ],
    applicationDeadline: "March 31, 2024",
    applicationUrl: "https://au.int/en/scholarships",
    requirements: [
      "Completed application form",
      "Academic transcripts",
      "Two recommendation letters",
      "Personal statement (1000 words)",
      "Proof of citizenship",
      "Financial need documentation"
    ],
    benefits: [
      "Full tuition coverage",
      "Monthly living allowance",
      "Accommodation support",
      "Health insurance",
      "Conference and research travel support",
      "Mentorship program"
    ],
    duration: "Full program duration",
    renewable: true,
    contactEmail: "scholarships@africa-union.org",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-02-15T00:00:00Z"
  },
  {
    id: "scholarship-002",
    name: "STEM Innovation Fund",
    provider: "African Development Bank",
    description: "Supporting the next generation of African innovators in Science, Technology, Engineering, and Mathematics fields.",
    amount: 10000,
    currency: "USD",
    coverage: "Partial",
    coverageDetails: "70% tuition coverage plus research allowance",
    eligibleCountries: ["Nigeria", "Ghana", "Kenya", "South Africa", "Egypt", "Morocco"],
    eligibleFields: ["Computer Science", "Engineering", "Mathematics", "Physics", "Data Science"],
    degreeTypes: ["Bachelor", "Master"],
    eligibilityCriteria: [
      "Must be pursuing STEM field",
      "Minimum 85% academic average",
      "Research proposal required for Master's applicants",
      "Commitment to work in Africa for 2 years post-graduation"
    ],
    applicationDeadline: "May 15, 2024",
    applicationUrl: "https://afdb.org/stem-scholarship",
    requirements: [
      "Academic transcripts",
      "Research proposal (for Master's)",
      "CV/Resume",
      "Two academic references",
      "Commitment letter"
    ],
    benefits: [
      "Tuition support (70%)",
      "Research allowance ($2000/year)",
      "Mentorship from industry professionals",
      "Internship opportunities",
      "Alumni network access"
    ],
    duration: "Full program duration",
    renewable: true,
    contactEmail: "stem-scholarship@afdb.org",
    isActive: true,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-02-20T00:00:00Z"
  },
  {
    id: "scholarship-003",
    name: "Women in Leadership Scholarship",
    provider: "UN Women Africa",
    description: "Empowering African women through education in leadership, business, and social sciences.",
    amount: 8000,
    currency: "USD",
    coverage: "Partial",
    coverageDetails: "50% tuition reduction and leadership training",
    eligibleCountries: ["All African Countries"],
    eligibleFields: ["Business Administration", "Public Policy", "Law", "Social Sciences", "International Relations"],
    degreeTypes: ["Bachelor", "Master"],
    eligibilityCriteria: [
      "Must be female",
      "Demonstrated leadership experience",
      "Community service involvement",
      "Minimum GPA of 3.0",
      "Age limit: 30 years"
    ],
    applicationDeadline: "April 30, 2024",
    applicationUrl: "https://unwomen.org/africa-scholarship",
    requirements: [
      "Completed application",
      "Leadership portfolio",
      "Community service documentation",
      "Academic records",
      "Personal essay on leadership goals"
    ],
    benefits: [
      "Tuition support (50%)",
      "Leadership training program",
      "Mentorship with women leaders",
      "Networking opportunities",
      "Career development workshops"
    ],
    duration: "2-4 years depending on program",
    renewable: true,
    contactEmail: "scholarships@unwomen.org",
    isActive: true,
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-02-25T00:00:00Z"
  },
  {
    id: "scholarship-004",
    name: "Medical Excellence Grant",
    provider: "African Medical Research Foundation",
    description: "Supporting future healthcare leaders across Africa with comprehensive medical education funding.",
    amount: 20000,
    currency: "USD",
    coverage: "Full",
    coverageDetails: "Complete medical school funding including clinical rotations",
    eligibleCountries: ["Nigeria", "Ghana", "Kenya", "Tanzania", "Uganda", "Rwanda"],
    eligibleFields: ["Medicine", "Dentistry", "Pharmacy", "Nursing", "Public Health"],
    degreeTypes: ["Bachelor", "Master", "PhD"],
    eligibilityCriteria: [
      "Exceptional academic performance in sciences",
      "Commitment to practice in underserved areas",
      "Medical aptitude test scores",
      "Community health volunteer experience"
    ],
    applicationDeadline: "February 28, 2024",
    applicationUrl: "https://amref.org/scholarships",
    requirements: [
      "Medical aptitude test results",
      "Academic transcripts",
      "Health service commitment letter",
      "Three recommendation letters",
      "Medical volunteer experience proof"
    ],
    benefits: [
      "Full tuition and fees",
      "Living allowance",
      "Medical equipment allowance",
      "Clinical rotation support",
      "Research funding opportunities",
      "Continuing education support"
    ],
    duration: "5-7 years for medical programs",
    renewable: true,
    contactEmail: "medical-scholarships@amref.org",
    isActive: true,
    createdAt: "2023-12-01T00:00:00Z",
    updatedAt: "2024-02-10T00:00:00Z"
  },
  {
    id: "scholarship-005",
    name: "Agricultural Innovation Scholarship",
    provider: "Alliance for a Green Revolution in Africa",
    description: "Transforming African agriculture through education and innovation in agricultural sciences.",
    amount: 6000,
    currency: "USD",
    coverage: "Partial",
    coverageDetails: "60% tuition coverage plus research and field work support",
    eligibleCountries: ["Nigeria", "Kenya", "Ghana", "Ethiopia", "Senegal", "Mali"],
    eligibleFields: ["Agriculture", "Agribusiness", "Food Science", "Agricultural Engineering", "Environmental Science"],
    degreeTypes: ["Bachelor", "Master"],
    eligibilityCriteria: [
      "Rural background preferred",
      "Interest in sustainable agriculture",
      "Community involvement in agricultural projects",
      "Minimum GPA of 3.2"
    ],
    applicationDeadline: "June 30, 2024",
    applicationUrl: "https://agra.org/scholarships",
    requirements: [
      "Project proposal on agricultural innovation",
      "Academic records",
      "Community project documentation",
      "Two professional references",
      "Rural background documentation"
    ],
    benefits: [
      "Tuition support (60%)",
      "Research funding",
      "Field work allowance",
      "Agricultural technology training",
      "Internship placements",
      "Alumni mentorship"
    ],
    duration: "Full program duration",
    renewable: true,
    contactEmail: "scholarships@agra.org",
    isActive: true,
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-02-28T00:00:00Z"
  }
];
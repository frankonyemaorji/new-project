"use client";
import Link from "next/link";
import { AlertCircle, CheckCircle, Clock, Eye, FileText, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/context/AuthContext";

/**
 * ApplicationsTab Component
 * 
 * Displays user's university applications with:
 * - Application summary statistics
 * - Individual application cards with progress tracking
 * - Document status tracking
 * - Deadline reminders
 * - Application tips and recommendations
 * 
 * Handles both real user applications and mock data for demonstration
 * with proper type safety and null checks.
 */



// Application interfaces that match our expected structure
interface ApplicationDocument {
  name: string;
  status: 'Required' | 'Uploaded' | 'Approved' | 'Rejected';
  url?: string;
}

interface MockApplication {
  id: string;
  universityName: string;
  programName: string;
  status: 'Preparing' | 'Submitted' | 'Under Review' | 'Approved' | 'Conditional Approval' | 'Rejected';
  applicationDate: string;
  lastUpdated: string;
  progress: number;
  documents: ApplicationDocument[];
  nextDeadline?: string;
}

export function ApplicationsTab() {
  const { user } = useAuth();

  if (!user) return null;

  // Safely access applications with fallback to empty array
  const userApplications = user.applications || [];

  // Mock applications data for demonstration
  const mockApplications: MockApplication[] = [
    {
      id: "app-001",
      universityName: "University of Ghana",
      programName: "Business Administration",
      status: "Under Review",
      applicationDate: "2024-11-15",
      lastUpdated: "2024-12-01",
      progress: 85,
      documents: [
        { name: "Transcripts", status: "Approved" },
        { name: "Personal Statement", status: "Approved" },
        { name: "Recommendation Letters", status: "Required" },
        { name: "Financial Documents", status: "Uploaded" },
      ],
      nextDeadline: "December 15, 2024",
    },
    {
      id: "app-002",
      universityName: "University of Cape Town",
      programName: "Computer Science",
      status: "Preparing",
      applicationDate: "2024-11-20",
      lastUpdated: "2024-11-25",
      progress: 45,
      documents: [
        { name: "Transcripts", status: "Uploaded" },
        { name: "Personal Statement", status: "Required" },
        { name: "Portfolio", status: "Required" },
      ],
      nextDeadline: "January 31, 2025",
    },
    {
      id: "app-003",
      universityName: "Makerere University",
      programName: "Medicine",
      status: "Submitted",
      applicationDate: "2024-10-20",
      lastUpdated: "2024-11-30",
      progress: 100,
      documents: [
        { name: "Transcripts", status: "Approved" },
        { name: "Personal Statement", status: "Approved" },
        { name: "Medical Certificate", status: "Approved" },
        { name: "Recommendation Letters", status: "Approved" },
      ],
      nextDeadline: "February 15, 2025",
    }
  ];

  // Use real applications if available, otherwise use mock data for demo
  const applications = userApplications.length > 0 ? userApplications : mockApplications;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Under Review":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Submitted":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Conditional Approval":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "Preparing":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
      case "Conditional Approval":
        return <CheckCircle className="h-4 w-4" />;
      case "Under Review":
      case "Submitted":
        return <Clock className="h-4 w-4" />;
      case "Rejected":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-500";
      case "Uploaded":
        return "bg-blue-500";
      case "Required":
        return "bg-red-500";
      case "Rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Calculate statistics safely
  const totalApplications = applications.length;
  const underReview = applications.filter(app => app.status === "Under Review" || app.status === "Submitted").length;
  const approved = applications.filter(app => app.status === "Approved" || app.status === "Conditional Approval").length;
  const inProgress = applications.filter(app => app.status === "Preparing").length;

  return (
    <div className="space-y-6">
      {applications.length > 0 ? (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">My Applications</h2>
              <p className="text-muted-foreground">
                Track your university applications and their progress
              </p>
            </div>
            <Link href="/universities">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Start New Application
              </Button>
            </Link>
          </div>

          {/* Application Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{totalApplications}</div>
                <div className="text-sm text-muted-foreground">Total Applications</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{underReview}</div>
                <div className="text-sm text-muted-foreground">Under Review</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{approved}</div>
                <div className="text-sm text-muted-foreground">Approved</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <AlertCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{inProgress}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </CardContent>
            </Card>
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{application.universityName}</h3>
                      <p className="text-muted-foreground">{application.programName}</p>
                      <p className="text-sm text-muted-foreground">
                        Applied: {new Date(application.applicationDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getStatusColor(application.status)} border`}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1">{application.status}</span>
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        Updated: {new Date(application.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Application Progress</span>
                      <span className="text-sm text-muted-foreground">{application.progress}%</span>
                    </div>
                    <Progress value={application.progress} className="h-2" />
                  </div>

                  {/* Documents Status */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Required Documents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                      {application.documents.map((doc, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-muted/30 rounded-md">
                          <div className={`w-2 h-2 rounded-full ${getDocumentStatusColor(doc.status)}`} />
                          <span className="text-sm flex-1">{doc.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {doc.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next Deadline */}
                  {application.nextDeadline && (
                    <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-orange-600 mr-2" />
                        <span className="text-sm font-medium text-orange-800">
                          Next Deadline: {application.nextDeadline}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 flex-wrap">
                    <Button variant="default">
                      <Eye className="h-4 w-4 mr-2" />
                      View Application
                    </Button>
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Upload Documents
                    </Button>
                    <Button variant="outline">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Contact University
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common actions to help manage your applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <Plus className="h-6 w-6" />
                  <span className="font-medium">Start New Application</span>
                  <span className="text-xs text-muted-foreground text-center">Apply to more universities</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <FileText className="h-6 w-6" />
                  <span className="font-medium">Upload Documents</span>
                  <span className="text-xs text-muted-foreground text-center">Complete your applications</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <Clock className="h-6 w-6" />
                  <span className="font-medium">Check Deadlines</span>
                  <span className="text-xs text-muted-foreground text-center">Stay on track</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Application Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Application Tips</CardTitle>
              <CardDescription>
                Improve your chances of success with these recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Complete all required documents</h4>
                    <p className="text-sm text-muted-foreground">
                      Ensure all documents are uploaded and meet the university's requirements.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Follow up regularly</h4>
                    <p className="text-sm text-muted-foreground">
                      Check your application status regularly and respond promptly to requests.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Prepare for interviews</h4>
                    <p className="text-sm text-muted-foreground">
                      Some programs may require interviews. Be prepared to discuss your goals and qualifications.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Apply early</h4>
                    <p className="text-sm text-muted-foreground">
                      Submit applications well before deadlines to avoid last-minute technical issues.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Applications Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start your journey by applying to universities that match your interests and qualifications.
              Use our university search to find programs that suit your goals.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link href="/universities">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Browse Universities
                </Button>
              </Link>
              <Link href="/universities?personalized=true">
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View My Matches
                </Button>
              </Link>
              <Link href="/questionnaire/flow">
                <Button variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
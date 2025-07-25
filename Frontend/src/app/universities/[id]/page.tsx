"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUniversity } from "@/lib/services/universityService";

import {
  MapPin,
  Globe,
  Calendar,
  Users,
  DollarSign,
  GraduationCap,
  Award,
  ExternalLink,
  Mail,
  Phone,
  BookOpen,
  Building,
  Clock,
  AlertCircle,
  ArrowLeft,
  Star
} from "lucide-react";

export default function UniversityDetailPage() {
  const params = useParams();
  const universityId = params.id as string;
  const { university, programs, loading, error } = useUniversity(universityId);

  const rankingColors = {
    'A+': 'bg-[#21aa47] text-white',
    'A': 'bg-[#2a8d42] text-white',
    'B+': 'bg-[#fdc500] text-black',
    'B': 'bg-[#fddf6d] text-black',
    'C+': 'bg-[#fa9949] text-white',
    'C': 'bg-[#ef4423] text-white',
    'NOT_RANKED': 'bg-gray-400 text-white',
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8 max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading university details...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !university) {
    return (
      <MainLayout>
        <div className="container py-8 max-w-6xl mx-auto">
          <Card>
            <CardContent className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">University Not Found</h3>
              <p className="text-muted-foreground mb-4">
                {error || "The university you're looking for doesn't exist or has been removed."}
              </p>
              <Link href="/universities">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Universities
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8 max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/universities">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Universities
            </Button>
          </Link>
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* University Logo */}
            <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
              <div className="flex h-full w-full items-center justify-center">
                <GraduationCap className="h-16 w-16 text-muted-foreground" />
              </div>
            </div>

            {/* University Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{university.name}</h1>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{university.city}, {university.country}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={`${rankingColors[university.ranking]} border-none font-semibold`}>
                      Ranking: {university.ranking === 'NOT_RANKED' ? 'Not Ranked' : university.ranking}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {university.university_type} University
                    </Badge>
                    {university.founded_year && (
                      <Badge variant="outline">Founded {university.founded_year}</Badge>
                    )}
                    {university.partner_university && (
                      <Badge variant="secondary">
                        <Star className="h-3 w-3 mr-1" />
                        Partner University
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {university.description && (
                <p className="text-muted-foreground mb-4">
                  {university.description}
                </p>
              )}

              <div className="flex gap-3">
                {university.website && (
                  <Link href={university.website} target="_blank">
                    <Button>
                      <Globe className="h-4 w-4 mr-2" />
                      Visit Website
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                )}
                <Button variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{formatCurrency(university.average_annual_tuition)}</div>
              <div className="text-sm text-muted-foreground">Average Tuition</div>
            </CardContent>
          </Card>
          
          {university.nigerian_students !== undefined && university.nigerian_students > 0 && (
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{university.nigerian_students.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Nigerian Students</div>
              </CardContent>
            </Card>
          )}

          {university.acceptance_rate !== undefined && (
            <Card>
              <CardContent className="p-4 text-center">
                <GraduationCap className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{Math.round(university.acceptance_rate * 100)}%</div>
                <div className="text-sm text-muted-foreground">Acceptance Rate</div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-4 text-center">
              <Award className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{programs.length}</div>
              <div className="text-sm text-muted-foreground">Available Programs</div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {university.offers_scholarships && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="font-semibold text-green-900">Scholarships Available</div>
                <div className="text-sm text-green-700">Financial aid opportunities</div>
              </CardContent>
            </Card>
          )}

          {university.provides_accommodation && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <Building className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold text-blue-900">Accommodation Available</div>
                <div className="text-sm text-blue-700">On-campus housing provided</div>
              </CardContent>
            </Card>
          )}

          {university.languages_of_instruction && university.languages_of_instruction.length > 0 && (
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <Globe className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="font-semibold text-purple-900">Languages</div>
                <div className="text-sm text-purple-700">
                  {university.languages_of_instruction.join(", ")}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="programs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="admissions">Admissions</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="programs">
            <Card>
              <CardHeader>
                <CardTitle>Available Programs</CardTitle>
                <CardDescription>
                  Explore the academic programs offered at {university.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {programs.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {programs.map((program) => (
                      <Card key={program.uid} className="border border-border/60">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{program.name}</h3>
                            <Badge variant="outline">{program.degree_type}</Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Duration:</span>
                              <span>{program.duration_years} years</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Annual Tuition:</span>
                              <span className="font-medium">{formatCurrency(program.tuition_fee)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Faculty:</span>
                              <span>{program.faculty}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Department:</span>
                              <span>{program.department}</span>
                            </div>
                          </div>
                          {program.description && (
                            <p className="text-sm text-muted-foreground mt-3">
                              {program.description}
                            </p>
                          )}
                          {program.entry_requirements && (
                            <div className="mt-3 p-3 bg-muted/40 rounded-md">
                              <p className="text-sm">
                                <strong>Entry Requirements:</strong> {program.entry_requirements}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No programs information available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admissions">
            <Card>
              <CardHeader>
                <CardTitle>Admission Information</CardTitle>
                <CardDescription>
                  Important information for prospective students
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">University Type</h3>
                  <p className="text-muted-foreground capitalize">{university.university_type} university</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Tuition Information</h3>
                  <div className="p-4 bg-muted/40 rounded-md">
                    <div className="flex justify-between items-center">
                      <span>Average Annual Tuition:</span>
                      <span className="font-semibold">{formatCurrency(university.average_annual_tuition)}</span>
                    </div>
                  </div>
                </div>

                {university.acceptance_rate !== undefined && (
                  <div>
                    <h3 className="font-semibold mb-3">Acceptance Rate</h3>
                    <div className="p-4 bg-muted/40 rounded-md">
                      <div className="flex justify-between items-center">
                        <span>Acceptance Rate:</span>
                        <span className="font-semibold">{Math.round(university.acceptance_rate * 100)}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {university.languages_of_instruction && university.languages_of_instruction.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Languages of Instruction</h3>
                    <div className="flex flex-wrap gap-2">
                      {university.languages_of_instruction.map((language, index) => (
                        <Badge key={index} variant="outline">{language}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-3">Services Available</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-3 ${university.offers_scholarships ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span>Scholarships {university.offers_scholarships ? 'Available' : 'Not Available'}</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-3 ${university.provides_accommodation ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span>Accommodation {university.provides_accommodation ? 'Provided' : 'Not Provided'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About {university.name}</CardTitle>
                <CardDescription>
                  Learn more about this institution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {university.description ? (
                  <div>
                    <h3 className="font-semibold mb-3">Description</h3>
                    <p className="text-muted-foreground">{university.description}</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No detailed description available</p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-3">University Details</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="capitalize">{university.university_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ranking:</span>
                      <span>{university.ranking === 'NOT_RANKED' ? 'Not Ranked' : university.ranking}</span>
                    </div>
                    {university.founded_year && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Founded:</span>
                        <span>{university.founded_year}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span>{university.is_active ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                </div>

                {university.nigerian_students !== undefined && university.nigerian_students > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Student Community</h3>
                    <div className="p-4 bg-muted/40 rounded-md">
                      <div className="flex justify-between items-center">
                        <span>Nigerian Students:</span>
                        <span className="font-semibold">{university.nigerian_students.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Get in touch with {university.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    {university.contact_email && (
                      <div className="flex items-start">
                        <Mail className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <div className="font-medium">Email</div>
                          <div className="text-muted-foreground">{university.contact_email}</div>
                        </div>
                      </div>
                    )}

                    {university.contact_phone && (
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <div className="font-medium">Phone</div>
                          <div className="text-muted-foreground">{university.contact_phone}</div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <div className="font-medium">Location</div>
                        <div className="text-muted-foreground">
                          {university.city}, {university.country}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {university.website && (
                      <div className="flex items-start">
                        <Globe className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <div>
                          <div className="font-medium">Website</div>
                          <Link
                            href={university.website}
                            target="_blank"
                            className="text-primary hover:underline"
                          >
                            {university.website}
                          </Link>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <div className="font-medium">Established</div>
                        <div className="text-muted-foreground">
                          {new Date(university.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {(!university.contact_email && !university.contact_phone && !university.website) && (
                  <div className="text-center py-8">
                    <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No contact information available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
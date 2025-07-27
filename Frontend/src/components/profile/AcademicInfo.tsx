"use client";
import Link from "next/link";
import { Award, BookOpen, Edit, Globe, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/context/AuthContext";

/**
 * AcademicInfo Component
 * 
 * Displays user's academic information including:
 * - Current education level
 * - Academic qualifications (WAEC grades, etc.)
 * - Language proficiencies
 * - Academic goals and achievements
 * 
 * Handles both backend model fields and frontend-specific properties
 * with proper null checks and type safety.
 */



export function AcademicInfo() {
  const { user } = useAuth();

  if (!user) return null;

  // Safely access arrays with fallbacks
  const qualifications = user.qualifications || [];
  const waecGrades = user.waecGrades || [];
  const languageProficiencies = user.languageProficiencies || [];

  // Helper functions for safe array checking
  const hasQualifications = qualifications.length > 0;
  const hasWaecGrades = waecGrades.length > 0;
  const hasLanguageProficiencies = languageProficiencies.length > 0;

  return (
    <div className="space-y-6">
      {/* Current Education Level */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Current Education Level
              </CardTitle>
              <CardDescription>Your current academic status</CardDescription>
            </div>
            <Link href="/profile/settings">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {user.currentEducationLevel ? (
            <div className="p-4 bg-muted/30 rounded-md">
              <p className="font-medium">{user.currentEducationLevel}</p>
              <p className="text-sm text-muted-foreground">
                Current education level
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No education level specified</h3>
              <p className="text-muted-foreground mb-4">
                Add your current education level to help us provide better recommendations.
              </p>
              <Link href="/profile/settings">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education Level
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* WAEC Grades */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                WAEC Results
              </CardTitle>
              <CardDescription>Your West African Examinations Council results</CardDescription>
            </div>
            <Link href="/profile/settings">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add WAEC Grades
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {hasWaecGrades ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {waecGrades.map((waecSubject, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-md">
                  <span className="text-sm font-medium">{waecSubject.subject}</span>
                  <Badge variant={
                    waecSubject.grade === 'A1' || waecSubject.grade === 'B2' || waecSubject.grade === 'B3' 
                      ? "default" 
                      : waecSubject.grade === 'C4' || waecSubject.grade === 'C5' || waecSubject.grade === 'C6'
                      ? "secondary"
                      : "outline"
                  }>
                    {waecSubject.grade}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No WAEC results added</h3>
              <p className="text-muted-foreground mb-4">
                Add your WAEC examination results to get accurate university recommendations.
              </p>
              <Link href="/profile/settings">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add WAEC Results
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Other Qualifications */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Other Qualifications
              </CardTitle>
              <CardDescription>Additional certificates and qualifications</CardDescription>
            </div>
            <Link href="/profile/settings">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Qualification
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {hasQualifications ? (
            <div className="space-y-3">
              {qualifications.map((qualification, index) => (
                <div key={index} className="p-4 border rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{qualification}</h3>
                      <p className="text-sm text-muted-foreground">
                        Additional qualification
                      </p>
                    </div>
                    <Badge variant="outline">Verified</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No additional qualifications</h3>
              <p className="text-muted-foreground mb-4">
                Add any additional qualifications, certificates, or achievements.
              </p>
              <Link href="/profile/settings">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Qualification
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* JAMB Score */}
      {user.jamb && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              JAMB Score
            </CardTitle>
            <CardDescription>Joint Admissions and Matriculation Board examination result</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted/30 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-primary">{user.jamb.score}</h3>
                  <p className="text-sm text-muted-foreground">JAMB Score ({user.jamb.year})</p>
                </div>
                <Badge variant={
                  user.jamb.score >= 300 ? "default" :
                  user.jamb.score >= 250 ? "secondary" :
                  "outline"
                }>
                  {user.jamb.score >= 300 ? "Excellent" :
                   user.jamb.score >= 250 ? "Good" :
                   user.jamb.score >= 200 ? "Fair" : "Below Average"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Language Proficiencies */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Language Proficiencies
              </CardTitle>
              <CardDescription>Languages you can speak and understand</CardDescription>
            </div>
            <Link href="/profile/settings">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Language
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {hasLanguageProficiencies ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {languageProficiencies.map((language, index) => (
                <div key={index} className="p-4 border rounded-md">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{language.language}</h3>
                    <Badge variant={
                      language.level === "Native" ? "default" :
                      language.level === "Advanced" ? "secondary" :
                      "outline"
                    }>
                      {language.level}
                    </Badge>
                  </div>
                  {language.certification && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Certified: {language.certification}
                    </p>
                  )}
                  {language.score && (
                    <p className="text-sm text-muted-foreground">
                      Score: {language.score}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No languages specified</h3>
              <p className="text-muted-foreground mb-4">
                Add your language proficiencies to find universities that offer programs in languages you understand.
              </p>
              <Link href="/profile/settings">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Language
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Academic Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Goals & Next Steps</CardTitle>
          <CardDescription>Your academic journey and goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {user.desiredCourse && (
              <div className="p-4 bg-muted/30 rounded-md">
                <h4 className="font-medium mb-2">Desired Course</h4>
                <p className="text-sm">{user.desiredCourse}</p>
              </div>
            )}

            <div className="p-4 bg-muted/30 rounded-md">
              <h4 className="font-medium mb-2">Current Goals</h4>
              <ul className="text-sm space-y-1">
                <li className="flex items-center">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mr-2" />
                  Complete university applications by March 2025
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-2" />
                  Secure scholarship funding
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 bg-orange-500 rounded-full mr-2" />
                  Improve academic profile
                </li>
              </ul>
            </div>

            <div className="text-center">
              <Link href="/questionnaire/flow">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Update Academic Goals
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
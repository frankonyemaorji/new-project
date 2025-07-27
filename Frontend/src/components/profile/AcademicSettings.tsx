"use client";
import { Award, BookOpen, Globe, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/context/AuthContext";

/**
 * AcademicSettings Component
 * 
 * Allows users to manage their academic information including:
 * - WAEC/NECO examination results
 * - Other qualifications and certifications
 * - Language proficiencies
 * - Current education level
 * 
 * Handles the backend user model structure with proper type safety
 * and provides a user-friendly interface for updating academic data.
 */



// Types that match your backend model
interface WAECGrade {
  subject: string;
  grade: string;
}

interface LanguageProficiency {
  language: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native' | 'Certified';
  certification?: string;
  score?: string;
}

const commonSubjects = [
  "English Language", "Mathematics", "Physics", "Chemistry", "Biology",
  "Economics", "Government", "Literature", "Geography", "History",
  "Commerce", "Accounting", "Further Mathematics", "Computer Science",
  "Agricultural Science", "Technical Drawing", "Visual Arts", "Music"
];

const waecGrades = ["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"];

const languageLevels: Array<'Beginner' | 'Intermediate' | 'Advanced' | 'Native' | 'Certified'> = 
  ["Beginner", "Intermediate", "Advanced", "Native", "Certified"];

const educationLevels = [
  "Secondary School Graduate",
  "Diploma Student", 
  "Undergraduate Student",
  "Graduate",
  "Postgraduate Student"
];

export function AcademicSettings() {
  const { user, refreshUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // State for WAEC grades (matches backend model)
  const [waecGrades, setWaecGrades] = useState<WAECGrade[]>(user?.waecGrades || []);
  
  // State for other qualifications (strings array as per backend)
  const [qualifications, setQualifications] = useState<string[]>(user?.qualifications || []);
  
  // State for language proficiencies
  const [languageProficiencies, setLanguageProficiencies] = useState<LanguageProficiency[]>(
    user?.languageProficiencies || []
  );

  // State for current education level
  const [currentEducationLevel, setCurrentEducationLevel] = useState<string>(
    user?.currentEducationLevel || ""
  );

  // WAEC grades functions
  const addWaecGrade = () => {
    setWaecGrades([...waecGrades, { subject: "", grade: "" }]);
  };

  const removeWaecGrade = (index: number) => {
    setWaecGrades(waecGrades.filter((_, i) => i !== index));
  };

  const updateWaecGrade = (index: number, field: keyof WAECGrade, value: string) => {
    setWaecGrades(waecGrades.map((grade, i) =>
      i === index ? { ...grade, [field]: value } : grade
    ));
  };

  // Qualifications functions
  const addQualification = () => {
    setQualifications([...qualifications, ""]);
  };

  const removeQualification = (index: number) => {
    setQualifications(qualifications.filter((_, i) => i !== index));
  };

  const updateQualification = (index: number, value: string) => {
    setQualifications(qualifications.map((qual, i) =>
      i === index ? value : qual
    ));
  };

  // Language functions
  const addLanguage = () => {
    setLanguageProficiencies([
      ...languageProficiencies,
      { language: "", level: "Intermediate" }
    ]);
  };

  const removeLanguage = (index: number) => {
    setLanguageProficiencies(languageProficiencies.filter((_, i) => i !== index));
  };

  const updateLanguage = (index: number, field: keyof LanguageProficiency, value: string) => {
    setLanguageProficiencies(languageProficiencies.map((lang, i) =>
      i === index ? { ...lang, [field]: value } : lang
    ));
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      // In a real app, you would make an API call to update user data
      // Example: await userService.updateUserProfile(user._id, updatedData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Here you would normally update the user via API
      // For now, we'll just show success and refresh profile
      await refreshUserProfile();
      
      toast.success("Academic information updated successfully!");
    } catch (error) {
      console.error("Error updating academic information:", error);
      toast.error("Failed to update academic information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Please sign in to access settings.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* WAEC Results */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                WAEC Results
              </CardTitle>
              <CardDescription>
                Add your West African Examinations Council subject grades
              </CardDescription>
            </div>
            <Button onClick={addWaecGrade} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {waecGrades.map((waecGrade, index) => (
            <div key={index} className="flex gap-3 items-end p-4 border rounded-md">
              <div className="flex-1">
                <Label>Subject</Label>
                <Select
                  value={waecGrade.subject}
                  onValueChange={(value) => updateWaecGrade(index, "subject", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonSubjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-32">
                <Label>Grade</Label>
                <Select
                  value={waecGrade.grade}
                  onValueChange={(value) => updateWaecGrade(index, "grade", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {waecGrades.map(grade => (
                      <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {waecGrades.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeWaecGrade(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          {waecGrades.length === 0 && (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No WAEC results added</h3>
              <p className="text-muted-foreground mb-4">
                Add your WAEC subject grades to improve university matching accuracy.
              </p>
              <Button onClick={addWaecGrade}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Subject
              </Button>
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
              <CardDescription>
                Add any additional certificates, diplomas, or qualifications
              </CardDescription>
            </div>
            <Button onClick={addQualification} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Qualification
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {qualifications.map((qualification, index) => (
            <div key={index} className="flex gap-3 items-end p-4 border rounded-md">
              <div className="flex-1">
                <Label>Qualification Name</Label>
                <Input
                  placeholder="e.g., NECO, Diploma in Computer Science, etc."
                  value={qualification}
                  onChange={(e) => updateQualification(index, e.target.value)}
                />
              </div>
              {qualifications.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQualification(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          {qualifications.length === 0 && (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No additional qualifications</h3>
              <p className="text-muted-foreground mb-4">
                Add any additional qualifications, certificates, or achievements.
              </p>
              <Button onClick={addQualification}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Qualification
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Language Proficiencies */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Language Proficiencies
              </CardTitle>
              <CardDescription>
                Specify languages you can speak and your proficiency levels
              </CardDescription>
            </div>
            <Button onClick={addLanguage} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Language
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {languageProficiencies.map((language, index) => (
            <div key={index} className="flex gap-3 items-end p-4 border rounded-md">
              <div className="flex-1">
                <Label>Language</Label>
                <Input
                  placeholder="e.g., English, French, Arabic"
                  value={language.language}
                  onChange={(e) => updateLanguage(index, "language", e.target.value)}
                />
              </div>
              <div className="w-40">
                <Label>Proficiency Level</Label>
                <Select
                  value={language.level}
                  onValueChange={(value) => updateLanguage(index, "level", value as LanguageProficiency['level'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languageLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label>Certification (Optional)</Label>
                <Input
                  placeholder="e.g., IELTS 7.0, TOEFL 100"
                  value={language.certification || ""}
                  onChange={(e) => updateLanguage(index, "certification", e.target.value)}
                />
              </div>
              {languageProficiencies.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLanguage(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          {languageProficiencies.length === 0 && (
            <div className="text-center py-8">
              <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No languages specified</h3>
              <p className="text-muted-foreground mb-4">
                Add your language proficiencies to find universities with suitable instruction languages.
              </p>
              <Button onClick={addLanguage}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Language
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Education Level */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Current Education Level
          </CardTitle>
          <CardDescription>
            Specify your current academic status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Education Level</Label>
              <Select 
                value={currentEducationLevel}
                onValueChange={setCurrentEducationLevel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your current education level" />
                </SelectTrigger>
                <SelectContent>
                  {educationLevels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-muted/30 rounded-md">
              <h4 className="font-medium mb-2">Education Level Guide:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• <strong>Secondary School Graduate:</strong> Completed WAEC/NECO, ready for university</li>
                <li>• <strong>Diploma Student:</strong> Currently pursuing or completed a diploma</li>
                <li>• <strong>Undergraduate Student:</strong> Currently pursuing a bachelor's degree</li>
                <li>• <strong>Graduate:</strong> Completed a bachelor's degree</li>
                <li>• <strong>Postgraduate Student:</strong> Pursuing or completed master's/PhD</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading} size="lg">
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Academic Information
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
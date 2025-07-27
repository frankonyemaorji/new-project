"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAdmin } from "@/lib/context/AdminContext";
import type { AcademicProgram, CreateUniversityPayload } from "@/lib/context/AdminContext";

import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Building2,
  Globe,
  Users,
  DollarSign,
  AlertCircle
} from "lucide-react";

const africanCountries = [
  "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cameroon",
  "Cape Verde", "Central African Republic", "Chad", "Comoros", "Congo", "DR Congo",
  "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia",
  "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya",
  "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania",
  "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda",
  "Sao Tome and Principe", "Senegal", "Seychelles", "Sierra Leone", "Somalia",
  "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda",
  "Zambia", "Zimbabwe"
];

const universityTypes: Array<'private' | 'public' | 'research' | 'technical' | 'medical' | 'agricultural'> = [
  "private", "public", "research", "technical", "medical", "agricultural"
];

const rankings: Array<'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'NOT_RANKED'> = [
  "A+", "A", "B+", "B", "C+", "C", "NOT_RANKED"
];

const languages = ["English", "French", "Arabic", "Portuguese", "Swahili", "Afrikaans"];

export default function NewUniversityPage() {
  const router = useRouter();
  const { createUniversity, hasPermission } = useAdmin();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<CreateUniversityPayload>({
    name: "",
    website: "",
    country: "",
    city: "",
    founded_year: new Date().getFullYear(),
    university_type: "public",
    ranking: "NOT_RANKED",
    description: "",
    nigerian_students: 0,
    acceptance_rate: 0,
    average_annual_tuition: 0,
    contact_email: "",
    contact_phone: "",
    languages_of_instruction: [],
    offers_scholarships: false,
    provides_accommodation: false,
    partner_university: false,
    is_active: true,
    academic_programs: []
  });

  const handleInputChange = (field: keyof CreateUniversityPayload, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLanguageToggle = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages_of_instruction: prev.languages_of_instruction?.includes(language)
        ? prev.languages_of_instruction.filter(l => l !== language)
        : [...(prev.languages_of_instruction || []), language]
    }));
  };

  const addProgram = () => {
    const newProgram: AcademicProgram = {
      uid: `temp-${Date.now()}`, // Temporary ID
      name: "",
      degree_type: "Bachelor",
      faculty: "",
      department: "",
      duration_years: 4,
      description: "",
      entry_requirements: "",
      tuition_fee: 0,
      is_active: true,
      university_uid: "", // Will be set by backend
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setFormData(prev => ({
      ...prev,
      academic_programs: [...(prev.academic_programs || []), newProgram]
    }));
  };

  const updateProgram = (index: number, field: keyof AcademicProgram, value: any) => {
    setFormData(prev => ({
      ...prev,
      academic_programs: prev.academic_programs?.map((prog, i) =>
        i === index ? { ...prog, [field]: value } : prog
      ) || []
    }));
  };

  const removeProgram = (index: number) => {
    setFormData(prev => ({
      ...prev,
      academic_programs: prev.academic_programs?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.country || !formData.city) {
      toast.error("Please fill in all required fields (Name, Country, City)");
      return;
    }

    if (!hasPermission("universities.write") && !hasPermission("all")) {
      toast.error("You don't have permission to create universities");
      return;
    }

    setIsLoading(true);

    try {
      const result = await createUniversity(formData);
      
      if (result) {
        toast.success("University created successfully!");
        router.push("/admin/universities");
      } else {
        toast.error("Failed to create university. Please check the console for details.");
      }
    } catch (error) {
      toast.error("Failed to create university");
      console.error("University creation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasPermission("universities.write") && !hasPermission("all")) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground">You don't have permission to create universities.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/universities">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Universities
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Add New University</h1>
            <p className="text-muted-foreground">
              Create a new university with academic programs
            </p>
          </div>
        </div>
      </div>

      {/* API Format Example */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This form creates universities using your API format. The demo credentials (testadmin@gmail.com / Password12) 
          will work with both real API calls and fallback mode.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Essential details about the university
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">University Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., African Leadership University"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website || ""}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://alueducation.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {africanCountries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="e.g., Kigali"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="founded_year">Founded Year</Label>
                <Input
                  id="founded_year"
                  type="number"
                  min="1800"
                  max={new Date().getFullYear()}
                  value={formData.founded_year || new Date().getFullYear()}
                  onChange={(e) => handleInputChange("founded_year", parseInt(e.target.value) || new Date().getFullYear())}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="university_type">University Type</Label>
                <Select value={formData.university_type} onValueChange={(value) => handleInputChange("university_type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {universityTypes.map(type => (
                      <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ranking">Ranking</Label>
                <Select value={formData.ranking} onValueChange={(value) => handleInputChange("ranking", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ranking" />
                  </SelectTrigger>
                  <SelectContent>
                    {rankings.map(ranking => (
                      <SelectItem key={ranking} value={ranking}>{ranking}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Brief description of the university..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Statistics & Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nigerian_students">Nigerian Students</Label>
                <Input
                  id="nigerian_students"
                  type="number"
                  min="0"
                  value={formData.nigerian_students || 0}
                  onChange={(e) => handleInputChange("nigerian_students", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="acceptance_rate">Acceptance Rate (0-1)</Label>
                <Input
                  id="acceptance_rate"
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={formData.acceptance_rate || 0}
                  onChange={(e) => handleInputChange("acceptance_rate", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="average_annual_tuition">Average Annual Tuition (USD)</Label>
                <Input
                  id="average_annual_tuition"
                  type="number"
                  min="0"
                  value={formData.average_annual_tuition}
                  onChange={(e) => handleInputChange("average_annual_tuition", parseInt(e.target.value) || 0)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Contact & Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email || ""}
                  onChange={(e) => handleInputChange("contact_email", e.target.value)}
                  placeholder="alu@gmail.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  value={formData.contact_phone || ""}
                  onChange={(e) => handleInputChange("contact_phone", e.target.value)}
                  placeholder="250792525545"
                />
              </div>

              <div className="space-y-2">
                <Label>Languages of Instruction</Label>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map(language => (
                    <div key={language} className="flex items-center space-x-2">
                      <Checkbox
                        id={`lang-${language}`}
                        checked={formData.languages_of_instruction?.includes(language) || false}
                        onCheckedChange={() => handleLanguageToggle(language)}
                      />
                      <Label htmlFor={`lang-${language}`} className="text-sm">
                        {language}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="offers_scholarships"
                    checked={formData.offers_scholarships}
                    onCheckedChange={(checked) => handleInputChange("offers_scholarships", checked)}
                  />
                  <Label htmlFor="offers_scholarships">Offers Scholarships</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="provides_accommodation"
                    checked={formData.provides_accommodation}
                    onCheckedChange={(checked) => handleInputChange("provides_accommodation", checked)}
                  />
                  <Label htmlFor="provides_accommodation">Provides Accommodation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="partner_university"
                    checked={formData.partner_university || false}
                    onCheckedChange={(checked) => handleInputChange("partner_university", checked)}
                  />
                  <Label htmlFor="partner_university">Partner University</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                  />
                  <Label htmlFor="is_active">Active University</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Academic Programs Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Academic Programs
                </CardTitle>
                <CardDescription>
                  Add programs offered by the university
                </CardDescription>
              </div>
              <Button type="button" onClick={addProgram} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Program
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {(!formData.academic_programs || formData.academic_programs.length === 0) ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No programs added yet. Click "Add Program" to start.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.academic_programs.map((program, index) => (
                  <Card key={program.uid} className="border border-border/60">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium">Program {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProgram(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Program Name</Label>
                          <Input
                            value={program.name}
                            onChange={(e) => updateProgram(index, "name", e.target.value)}
                            placeholder="e.g., Bachelors In Software Engineering"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Degree Type</Label>
                          <Select
                            value={program.degree_type}
                            onValueChange={(value) => updateProgram(index, "degree_type", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Certificate">Certificate</SelectItem>
                              <SelectItem value="Diploma">Diploma</SelectItem>
                              <SelectItem value="Bachelors">Bachelors</SelectItem>
                              <SelectItem value="Masters">Masters</SelectItem>
                              <SelectItem value="PhD">PhD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Faculty</Label>
                          <Input
                            value={program.faculty}
                            onChange={(e) => updateProgram(index, "faculty", e.target.value)}
                            placeholder="e.g., Engineering"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Department</Label>
                          <Input
                            value={program.department}
                            onChange={(e) => updateProgram(index, "department", e.target.value)}
                            placeholder="e.g., Computer Science"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Duration (years)</Label>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            value={program.duration_years}
                            onChange={(e) => updateProgram(index, "duration_years", parseInt(e.target.value) || 1)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Tuition Fee (USD)</Label>
                          <Input
                            type="number"
                            min="0"
                            value={program.tuition_fee}
                            onChange={(e) => updateProgram(index, "tuition_fee", parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={program.description || ""}
                          onChange={(e) => updateProgram(index, "description", e.target.value)}
                          placeholder="Brief description of the program..."
                          rows={2}
                        />
                      </div>
                      <div className="mt-4 space-y-2">
                        <Label>Entry Requirements</Label>
                        <Textarea
                          value={program.entry_requirements || ""}
                          onChange={(e) => updateProgram(index, "entry_requirements", e.target.value)}
                          placeholder="e.g., At least B grade in Mathematics, physics and computer science"
                          rows={3}
                        />
                      </div>
                      <div className="mt-4 flex items-center space-x-2">
                        <Checkbox
                          checked={program.is_active}
                          onCheckedChange={(checked) => updateProgram(index, "is_active", checked)}
                        />
                        <Label>Program Active</Label>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Link href="/admin/universities">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create University
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
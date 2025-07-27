"use client";
import { Award, BookOpen, Calendar, FileText, Heart, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/context/AuthContext";

/**
 * ProfileStats Component
 * 
 * Displays user profile statistics in a grid layout including:
 * - Saved universities count
 * - Applications count  
 * - Counseling sessions count
 * - Qualifications count
 * - Languages count
 * - Profile completion percentage
 * 
 * Handles different user roles (STUDENT, COUNSELOR, ADMIN) and safely
 * accesses user properties with null checks to prevent runtime errors.
 */



export function ProfileStats() {
  const { user } = useAuth();

  if (!user) return null;

  const stats = [
    {
      title: "Preferred Countries",
      value: user.preferredCountries?.length || 0,
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "WAEC Subjects",
      value: user.waecGrades?.length || 0,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Sessions",
      value: user.totalSessions || 0,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Qualifications",
      value: user.qualifications?.length || 0,
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Specializations",
      value: user.specialization?.length || 0,
      icon: BookOpen,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Profile Completion",
      value: `${calculateProfileCompletion(user)}%`,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function calculateProfileCompletion(user: any): number {
  let completedFields = 0;
  const totalFields = 15;

  // Basic info
  if (user.firstName) completedFields++;
  if (user.lastName) completedFields++;
  if (user.email) completedFields++;
  if (user.dateOfBirth) completedFields++;
  if (user.phoneNumber) completedFields++;
  if (user.nationality) completedFields++;
  if (user.profilePicture) completedFields++;

  // Student specific fields
  if (user.role === 'STUDENT') {
    if (user.waecGrades?.length > 0) completedFields++;
    if (user.jamb?.score) completedFields++;
    if (user.currentEducationLevel) completedFields++;
    if (user.desiredCourse) completedFields++;
    if (user.preferredCountries?.length > 0) completedFields++;
  }

  // Counselor specific fields
  if (user.role === 'COUNSELOR') {
    if (user.specialization?.length > 0) completedFields++;
    if (user.experience) completedFields++;
    if (user.qualifications?.length > 0) completedFields++;
    if (user.bio) completedFields++;
    if (user.availableHours?.length > 0) completedFields++;
  }

  return Math.round((completedFields / totalFields) * 100);
}
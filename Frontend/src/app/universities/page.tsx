"use client";
import Link from "next/link";
import { AlertCircle, Lock, Search, Star } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QuickQuestionnaireDialog } from "@/components/university/QuickQuestionnaireDialog";
import { UniversityCard } from "@/components/university/UniversityCard";
import { UniversityFilters } from "@/components/university/UniversityFilters";
import { useAuth } from "@/lib/context/AuthContext";
import { type UniversityFilters as ApiFilters, useUniversities } from "@/lib/services/universityService";

// Loading component
function UniversityCardSkeleton() {
  return (
    <Card className="h-full">
      <div className="p-4 flex items-center space-x-4 bg-muted/50">
        <div className="h-20 w-20 bg-gray-200 rounded-md animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
          <div className="flex space-x-2">
            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
      </div>
    </Card>
  );
}

// Component that uses useSearchParams - wrapped in Suspense
function UniversitiesContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ApiFilters>({
    limit: 50,
    skip: 0,
  });
  const [showQuickQuestionnaire, setShowQuickQuestionnaire] = useState(false);

  // Combine search term with filters for API call
  const activeFilters = useMemo(() => ({
    ...filters,
    search: searchTerm || undefined,
  }), [filters, searchTerm]);

  const { universities, loading, error } = useUniversities(activeFilters);

  const handleFilterChange = (newFilters: ApiFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      limit: 50,
      skip: 0,
    });
    setSearchTerm("");
  };

  const handleQuickFiltersApply = (quickFilters: any) => {
    if (quickFilters) {
      const newFilters: ApiFilters = {
        ...filters,
        country: quickFilters.countries.length > 0 ? quickFilters.countries[0] : undefined,
        ranking: quickFilters.ranking || undefined,
      };
      setFilters(newFilters);
    }
    setShowQuickQuestionnaire(false);
  };

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Discover Universities</h1>
          <p className="text-muted-foreground">
            Find the perfect university for your academic journey in Africa
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <UniversityFilters
              onFilterChange={handleFilterChange}
              initialFilters={filters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search universities by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {!user && (
                <Button
                  onClick={() => setShowQuickQuestionnaire(true)}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Get Personalized Matches
                </Button>
              )}
            </div>

            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {loading ? 'Loading...' : `${universities.length} Universities Found`}
              </h2>
              
              {Object.keys(filters).length > 2 && ( // More than limit and skip
                <Button onClick={clearFilters} variant="outline" size="sm">
                  Clear All Filters
                </Button>
              )}
            </div>

            {/* Error State */}
            {error && (
              <Card className="mb-6">
                <CardContent className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Error loading universities</h3>
                  <p className="text-sm text-muted-foreground mb-4">{error}</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline"
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Loading State */}
            {loading && (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <UniversityCardSkeleton key={index} />
                ))}
              </div>
            )}

            {/* Universities Grid */}
            {!loading && universities.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {universities.map((university) => (
                  <UniversityCard
                    key={university.uid}
                    university={university}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && universities.length === 0 && !error && (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No universities found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or filters
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Call to Action for non-authenticated users */}
            {!user && universities.length > 0 && (
              <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <CardContent className="text-center py-8">
                  <Lock className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Get Personalized Recommendations</h3>
                  <p className="text-muted-foreground mb-4">
                    Create an account to get AI-powered university matches based on your academic profile, preferences, and goals.
                  </p>
                  <div className="flex justify-center gap-3">
                    <Link href="/auth/signup">
                      <Button className="bg-gradient-to-r from-green-600 to-green-700">
                        Sign Up Free
                      </Button>
                    </Link>
                    <Link href="/auth/signin">
                      <Button variant="outline">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Quick Questionnaire Dialog */}
        <QuickQuestionnaireDialog
          open={showQuickQuestionnaire}
          onOpenChange={setShowQuickQuestionnaire}
          onFiltersApply={handleQuickFiltersApply}
        />
      </div>
    </MainLayout>
  );
}

// Main component with Suspense boundary
export default function UniversitiesPage() {
  return (
    <Suspense fallback={
      <MainLayout>
        <div className="container py-8">
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        </div>
      </MainLayout>
    }>
      <UniversitiesContent />
    </Suspense>
  );
}
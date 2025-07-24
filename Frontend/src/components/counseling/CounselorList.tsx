"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Star, Calendar, Search, Filter, MapPin, GraduationCap, Award } from "lucide-react";
import Link from "next/link";
import { mockCounselors } from "@/lib/data/mockCounselors";

// Convert mock data to expected format
const counselorsData = mockCounselors.map(counselor => ({
  id: counselor.id,
  name: `${counselor.firstName} ${counselor.lastName}`,
  image: counselor.profilePicture || `/images/counselors/default.jpg`,
  title: counselor.bio.split('.')[0], // Use first sentence as title
  rating: counselor.rating,
  reviewCount: counselor.reviewCount,
  experience: `${counselor.experience}+ years`,
  location: "Nigeria", // Default location
  specialties: counselor.specializations,
  countries: ["Nigeria", "Ghana", "South Africa"], // Default countries
  availableToday: counselor.isActive,
  languages: counselor.languages,
  bio: counselor.bio,
  price: {
    video: counselor.hourlyRate * 1000, // Convert to Naira
    chat: counselor.hourlyRate * 600,
    package: counselor.hourlyRate * 3000
  },
  nextAvailable: counselor.isActive ? "Today, 2:00 PM" : "Tomorrow, 10:00 AM",
  verified: true,
  achievements: [`${counselor.experience}+ Years Experience`, "Certified Counselor", "Student Success Expert"]
}));

interface CounselorListProps {
  selectedServiceType?: string | null;
}

export function CounselorList({ selectedServiceType }: CounselorListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  // Get unique specialties and countries for filters
  const allSpecialties = Array.from(new Set(counselorsData.flatMap(c => c.specialties)));
  const allCountries = Array.from(new Set(counselorsData.flatMap(c => c.countries)));

  // Filter counselors based on search and filters
  const filteredCounselors = counselorsData.filter(counselor => {
    const matchesSearch = counselor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         counselor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         counselor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSpecialty = selectedSpecialty === "all" || counselor.specialties.includes(selectedSpecialty);
    const matchesCountry = selectedCountry === "all" || counselor.countries.includes(selectedCountry);
    const matchesAvailability = availabilityFilter === "all" ||
                               (availabilityFilter === "today" && counselor.availableToday);

    return matchesSearch && matchesSpecialty && matchesCountry && matchesAvailability;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {selectedServiceType && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-green-800">
                🎯 Looking for {selectedServiceType.replace('-', ' ')} consultants
              </h3>
              <p className="text-sm text-green-600">
                All counselors below offer this service type. Choose one that matches your needs!
              </p>
            </div>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('clearServiceFilter'))}
              className="text-green-600 hover:text-green-800 font-medium text-sm"
            >
              ✕ Clear
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search counselors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder="All Specialties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {allSpecialties.map(specialty => (
                  <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {allCountries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Counselors</SelectItem>
                <SelectItem value="today">Available Today</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredCounselors.length} of {counselorsData.length} counselors
          </div>
        </CardContent>
      </Card>

      {/* Counselors List */}
      <div className="space-y-6">
        {filteredCounselors.map((counselor) => (
          <Card key={counselor.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-l-4 border-l-transparent hover:border-l-green-500">
            <CardContent className="p-0">
              <div className="md:flex">
                {/* Counselor Info Sidebar */}
                <div className="p-6 md:w-80 border-b md:border-b-0 md:border-r border-border/60 bg-muted/20">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={counselor.image} alt={counselor.name} />
                        <AvatarFallback>
                          {counselor.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      {counselor.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                          <Star className="h-3 w-3 text-white fill-white" />
                        </div>
                      )}
                    </div>

                    <h3 className="font-bold text-lg mb-1">{counselor.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{counselor.title}</p>

                    <div className="flex items-center mb-3">
                      <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                      <span className="text-sm font-medium">
                        {counselor.rating} ({counselor.reviewCount} reviews)
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center justify-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {counselor.location}
                      </div>
                      <div className="flex items-center justify-center">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        {counselor.experience} experience
                      </div>
                    </div>

                    {counselor.availableToday ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        Available Today
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100 text-gray-800">
                        Next: {counselor.nextAvailable}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
                  <div className="space-y-4">
                    {/* Bio */}
                    <p className="text-sm leading-relaxed">{counselor.bio}</p>

                    {/* Achievements */}
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        Key Achievements
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {counselor.achievements.map((achievement) => (
                          <Badge key={achievement} variant="secondary" className="text-xs">
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Specialties */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Specialties</h4>
                      <div className="flex flex-wrap gap-2">
                        {counselor.specialties.map((specialty) => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Countries */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Country Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {counselor.countries.map((country) => (
                          <Badge key={country} variant="secondary" className="text-xs">
                            {country}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Languages */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Languages</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-muted-foreground">
                          {counselor.languages.join(", ")}
                        </span>
                      </div>
                    </div>

                    {/* Pricing and Booking */}
                    <div className="border-t pt-4 mt-4">
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center p-3 bg-muted/30 rounded-lg hover:bg-green-50 transition-colors cursor-pointer group">
                          <div className="text-xs text-muted-foreground group-hover:text-green-600">Video Call</div>
                          <div className="font-semibold text-sm group-hover:text-green-700">{formatPrice(counselor.price.video)}</div>
                          <div className="text-xs text-muted-foreground">45 min</div>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer group">
                          <div className="text-xs text-muted-foreground group-hover:text-blue-600">Chat</div>
                          <div className="font-semibold text-sm group-hover:text-blue-700">{formatPrice(counselor.price.chat)}</div>
                          <div className="text-xs text-muted-foreground">60 min</div>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer group">
                          <div className="text-xs text-muted-foreground group-hover:text-purple-600">Package</div>
                          <div className="font-semibold text-sm group-hover:text-purple-700">{formatPrice(counselor.price.package)}</div>
                          <div className="text-xs text-muted-foreground">Multi-session</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Link href={`/counseling/book/${counselor.id}`} className="w-full block">
                          <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white">
                            <Calendar className="h-4 w-4 mr-2" />
                            Book Session with {counselor.name.split(" ")[0]}
                          </Button>
                        </Link>

                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs hover:bg-blue-50 hover:border-blue-300"
                            onClick={() => {
                              alert(`Quick Chat with ${counselor.name} - This feature will connect you directly for immediate questions! Coming soon.`);
                            }}
                          >
                            💬 Quick Chat
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs hover:bg-purple-50 hover:border-purple-300"
                            onClick={() => {
                              alert(`${counselor.name}'s Full Profile:\n\n${counselor.bio}\n\nExpertise: ${counselor.specialties.join(', ')}\nCountries: ${counselor.countries.join(', ')}\nLanguages: ${counselor.languages.join(', ')}\n\nDetailed profile view coming soon!`);
                            }}
                          >
                            📄 View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredCounselors.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No counselors found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters to find available counselors.
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedSpecialty("all");
                setSelectedCountry("all");
                setAvailabilityFilter("all");
              }}
              variant="outline"
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
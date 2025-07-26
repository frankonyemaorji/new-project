"use client";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, DollarSign, ExternalLink, GraduationCap, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { University } from "@/lib/services/universityService";

interface UniversityCardProps {
  university: University;
  isSaved?: boolean;
  onSave?: (id: string) => void;
  showMatchPercentage?: boolean;
  matchPercentage?: number;
}

export function UniversityCard({
  university,
  isSaved = false,
  onSave,
  showMatchPercentage = false,
  matchPercentage,
}: UniversityCardProps) {
  const {
    uid,
    name,
    country,
    city,
    ranking,
    average_annual_tuition,
    nigerian_students,
    university_type,
    offers_scholarships,
    provides_accommodation,
    website,
  } = university;

  const rankingColors = {
    'A+': 'bg-[#21aa47] text-white',
    'A': 'bg-[#2a8d42] text-white',
    'B+': 'bg-[#fdc500] text-black',
    'B': 'bg-[#fddf6d] text-black',
    'C+': 'bg-[#fa9949] text-white',
    'C': 'bg-[#ef4423] text-white',
    'NOT_RANKED': 'bg-gray-400 text-white',
  };

  const formatTuition = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      {showMatchPercentage && matchPercentage && (
        <div className="bg-primary text-primary-foreground py-1 px-4 font-semibold text-right">
          {matchPercentage}% Match
        </div>
      )}
      <div className="relative p-4 flex items-center space-x-4 bg-muted/50">
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-border">
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <GraduationCap className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{name}</h3>
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span>{city}, {country}</span>
          </div>
          <div className="flex items-center mt-1 space-x-2">
            <Badge
              variant="outline"
              className={`${rankingColors[ranking]} border-none font-semibold`}
            >
              {ranking === 'NOT_RANKED' ? 'Not Ranked' : ranking}
            </Badge>
            <Badge variant="outline" className="text-xs capitalize">
              {university_type}
            </Badge>
          </div>
        </div>
        {onSave && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 absolute top-3 right-3"
            onClick={() => onSave(uid)}
            aria-label={isSaved ? "Remove from saved" : "Save university"}
          >
            <Bookmark
              className={`h-5 w-5 ${isSaved ? "fill-primary text-primary" : "text-muted-foreground"}`}
            />
          </Button>
        )}
      </div>
      <CardContent className="p-4 pt-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="font-medium">{formatTuition(average_annual_tuition)}/year</span>
            </div>
            {nigerian_students !== undefined && nigerian_students > 0 && (
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="font-medium">{nigerian_students} Nigerian students</span>
              </div>
            )}
          </div>

          {/* Additional info badges */}
          <div className="flex flex-wrap gap-1 mt-2">
            {offers_scholarships && (
              <Badge variant="secondary" className="text-xs">
                Scholarships Available
              </Badge>
            )}
            {provides_accommodation && (
              <Badge variant="secondary" className="text-xs">
                Accommodation
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Link href={`/universities/${uid}`} className="flex-1">
          <Button variant="default" className="w-full" size="sm">
            <GraduationCap className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </Link>
        {website && (
          <Link href={website} target="_blank">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
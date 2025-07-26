"use client";
import { Filter } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UniversityFilters } from "@/lib/services/universityService";

const universityTypes = [
  { value: "private", label: "Private" },
  { value: "public", label: "Public" },
  { value: "research", label: "Research" },
  { value: "technical", label: "Technical" },
  { value: "medical", label: "Medical" },
  { value: "agricultural", label: "Agricultural" },
];

const rankings = [
  { value: "A+", label: "A+" },
  { value: "A", label: "A" },
  { value: "B+", label: "B+" },
  { value: "B", label: "B" },
  { value: "C+", label: "C+" },
  { value: "C", label: "C" },
  { value: "NOT_RANKED", label: "Not Ranked" },
];

interface UniversityFiltersProps {
  onFilterChange: (filters: UniversityFilters) => void;
  initialFilters?: UniversityFilters;
  className?: string;
}

export function UniversityFilters({
  onFilterChange,
  initialFilters,
  className,
}: UniversityFiltersProps) {
  const [filters, setFilters] = useState<UniversityFilters>(
    initialFilters || {
      limit: 50,
      skip: 0,
    }
  );

  const [expanded, setExpanded] = useState(false);

  const handleFilterChange = (key: keyof UniversityFilters, value: any) => {
    const newFilters = {
      ...filters,
      [key]: value === 'all' || value === '' ? undefined : value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleBooleanChange = (key: keyof UniversityFilters, checked: boolean) => {
    const newFilters = {
      ...filters,
      [key]: checked ? true : undefined,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const resetFilters = {
      limit: 50,
      skip: 0,
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const countActiveFilters = () => {
    let count = 0;
    if (filters.country) count++;
    if (filters.city) count++;
    if (filters.university_type) count++;
    if (filters.ranking) count++;
    if (filters.offers_scholarships) count++;
    if (filters.provides_accommodation) count++;
    return count;
  };

  return (
    <div className={className}>
      <div className="lg:hidden mb-4">
        <Button
          onClick={() => setExpanded(!expanded)}
          variant="outline"
          className="w-full justify-between"
        >
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {countActiveFilters() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {countActiveFilters()}
              </Badge>
            )}
          </div>
        </Button>
      </div>

      <Card className={`${expanded ? 'block' : 'hidden'} lg:block`}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Filter Universities</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-8 text-muted-foreground hover:text-foreground"
            >
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Country */}
          <div>
            <Label className="font-medium mb-3 block">Country</Label>
            <Input
              placeholder="Enter country name"
              value={filters.country || ''}
              onChange={(e) => handleFilterChange('country', e.target.value)}
            />
          </div>

          {/* City */}
          <div>
            <Label className="font-medium mb-3 block">City</Label>
            <Input
              placeholder="Enter city name"
              value={filters.city || ''}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            />
          </div>

          {/* University Type */}
          <div>
            <Label className="font-medium mb-3 block">University Type</Label>
            <Select
              value={filters.university_type || 'all'}
              onValueChange={(value) => handleFilterChange('university_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {universityTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* University Ranking */}
          <div>
            <Label className="font-medium mb-3 block">University Ranking</Label>
            <Select
              value={filters.ranking || 'all'}
              onValueChange={(value) => handleFilterChange('ranking', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Rankings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rankings</SelectItem>
                {rankings.map((rank) => (
                  <SelectItem key={rank.value} value={rank.value}>
                    {rank.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Boolean Filters */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="scholarships"
                checked={filters.offers_scholarships === true}
                onCheckedChange={(checked) => 
                  handleBooleanChange('offers_scholarships', checked as boolean)
                }
              />
              <Label
                htmlFor="scholarships"
                className="font-normal cursor-pointer"
              >
                Offers Scholarships
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="accommodation"
                checked={filters.provides_accommodation === true}
                onCheckedChange={(checked) => 
                  handleBooleanChange('provides_accommodation', checked as boolean)
                }
              />
              <Label
                htmlFor="accommodation"
                className="font-normal cursor-pointer"
              >
                Provides Accommodation
              </Label>
            </div>
          </div>

          {/* Results Limit */}
          <div>
            <Label className="font-medium mb-3 block">Results per page</Label>
            <Select
              value={String(filters.limit || 50)}
              onValueChange={(value) => handleFilterChange('limit', Number(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/lib/context/AdminContext";
import type { University } from "@/lib/context/AdminContext";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Upload,
  Building2,
  AlertCircle
} from "lucide-react";

// Use the University type from AdminContext

export default function AdminUniversitiesPage() {
  const { getUniversities, deleteUniversity, hasPermission, isLoading: contextLoading } = useAdmin();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");

  // Load universities on component mount
  useEffect(() => {
    loadUniversities();
  }, []);

  const loadUniversities = async () => {
    if (!hasPermission("universities.read") && !hasPermission("all")) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getUniversities();
      setUniversities(data);
    } catch (error) {
      toast.error("Failed to load universities");
      console.error("Error loading universities:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique countries for filter
  const countries = Array.from(new Set(universities.map(uni => uni.country))).sort();

  const filteredUniversities = universities.filter(university => {
    const matchesSearch = university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         university.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         university.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === "all" || university.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRankingColor = (ranking: string) => {
    switch (ranking) {
      case 'A+':
        return 'bg-green-100 text-green-800';
      case 'A':
        return 'bg-green-100 text-green-700';
      case 'B+':
        return 'bg-yellow-100 text-yellow-800';
      case 'B':
        return 'bg-yellow-100 text-yellow-700';
      case 'C+':
        return 'bg-orange-100 text-orange-800';
      case 'C':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteUniversity = async (universityId: string) => {
    if (!hasPermission("universities.write") && !hasPermission("all")) {
      toast.error("You don't have permission to delete universities");
      return;
    }

    if (!confirm("Are you sure you want to delete this university? This action cannot be undone.")) {
      return;
    }

    try {
      const success = await deleteUniversity(universityId);
      if (success) {
        toast.success("University deleted successfully");
        await loadUniversities(); // Reload the list
      } else {
        toast.error("Failed to delete university");
      }
    } catch (error) {
      toast.error("Failed to delete university");
      console.error("Error deleting university:", error);
    }
  };

  if (!hasPermission("universities.read") && !hasPermission("all")) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground">You don't have permission to view universities.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Universities</h1>
          <p className="text-muted-foreground">
            Manage university listings and information
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {(hasPermission("universities.write") || hasPermission("all")) && (
            <Link href="/admin/universities/new">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add University
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{universities.length}</div>
            <p className="text-sm text-muted-foreground">Total Universities</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{countries.length}</div>
            <p className="text-sm text-muted-foreground">Countries</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {universities.filter(u => u.ranking === 'A+' || u.ranking === 'A').length}
            </div>
            <p className="text-sm text-muted-foreground">Top Ranked</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {universities.length > 0 
                ? Math.round(universities.reduce((sum, u) => sum + (u.acceptance_rate || 0), 0) / universities.length * 100)
                : 0}%
            </div>
            <p className="text-sm text-muted-foreground">Avg. Acceptance Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            University Management
          </CardTitle>
          <CardDescription>
            Search, filter, and manage university listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search universities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full h-10 px-3 border border-input bg-background text-sm rounded-md"
              >
                <option value="all">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
              <p>Loading universities...</p>
            </div>
          )}

          {/* Universities Table */}
          {!loading && (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>University</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Ranking</TableHead>
                    <TableHead>Nigerian Students</TableHead>
                    <TableHead>Tuition</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUniversities.map((university) => (
                    <TableRow key={university.uid}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <span className="text-xs font-medium">
                              {university.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{university.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {university.founded_year && `Founded ${university.founded_year}`}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{university.city}</div>
                          <div className="text-sm text-muted-foreground">{university.country}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {university.university_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRankingColor(university.ranking)}>
                          {university.ranking}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {university.nigerian_students?.toLocaleString() || 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatCurrency(university.average_annual_tuition)}
                        </div>
                        <div className="text-sm text-muted-foreground">per year</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={university.is_active ? "default" : "secondary"}>
                          {university.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {(hasPermission("universities.write") || hasPermission("all")) && (
                              <>
                                <Link href={`/admin/universities/${university.uid}/edit`}>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteUniversity(university.uid!)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!loading && filteredUniversities.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No universities found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedCountry !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "No universities have been added yet"
                }
              </p>
              {(hasPermission("universities.write") || hasPermission("all")) && (
                <Link href="/admin/universities/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First University
                  </Button>
                </Link>
              )}
            </div>
          )}

          {/* Pagination placeholder */}
          {!loading && filteredUniversities.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {filteredUniversities.length} of {universities.length} universities
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
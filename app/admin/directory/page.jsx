"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  ExternalLink,
  MapPin,
  Calendar,
  Building2,
  GraduationCap,
  Star,
  Users,
  Award,
  Briefcase,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Eye,
  Edit,
  MoreHorizontal,
  Download,
  Upload,
  RefreshCw,
  Plus,
} from "lucide-react";
import { AddAlumniModal } from "@/components/admin/add-alumni-modal";
import { getToken } from "@/lib/auth";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function AdminDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCompany, setFilterCompany] = useState("all");
  const [filterBatch, setFilterBatch] = useState("all");
  const [filterSkills, setFilterSkills] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showAddAlumniModal, setShowAddAlumniModal] = useState(false);
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAlumni = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/admin/alumni/list`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Failed to load alumni");
      const list = Array.isArray(data?.alumni) ? data.alumni : [];
      const mapped = list.map((a) => ({
        id: a.id || a._id || a.email,
        name: a.full_name || (a.email ? a.email.split("@")[0] : "Unknown"),
        email: a.email,
        phone: a.phone || "",
        company: a.current_company || "",
        position: a.current_position || "",
        batch: a.graduation_year || "",
        graduationYear: a.graduation_year || "",
        skills: Array.isArray(a.skills) ? a.skills : [],
        location: a.location || "",
        linkedin: a.linkedin_profile || "",
        github: a.github || "",
        twitter: a.twitter || "",
        website: a.website || "",
        status: a.is_active ? "verified" : "inactive",
        lastActive: a.updated_at || "",
        achievements: Array.isArray(a.achievements) ? a.achievements : [],
        avatar: "/images/default-avatar.png",
      }));
      setAlumni(mapped);
    } catch (e) {
      setError(e?.message || "Failed to load alumni");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  const companies = useMemo(() => {
    const set = new Set(alumni.map((a) => a.company).filter(Boolean));
    return ["all", ...Array.from(set).sort()];
  }, [alumni]);
  const batches = useMemo(() => {
    const set = new Set(alumni.map((a) => String(a.batch || "")).filter(Boolean));
    return ["all", ...Array.from(set).sort()];
  }, [alumni]);
  const allSkills = useMemo(() => {
    const set = new Set(alumni.flatMap((a) => a.skills || []));
    return ["all", ...Array.from(set).sort()];
  }, [alumni]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredAlumni = alumni.filter((alumnus) => {
    const matchesSearch =
      alumnus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumnus.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumnus.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumnus.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCompany =
      filterCompany === "all" || alumnus.company === filterCompany;
    const matchesBatch = filterBatch === "all" || alumnus.batch === filterBatch;
    const matchesSkills =
      filterSkills === "all" || alumnus.skills.includes(filterSkills);

    return matchesSearch && matchesCompany && matchesBatch && matchesSkills;
  });

  const sortedAlumni = [...filteredAlumni].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "company":
        return a.company.localeCompare(b.company);
      case "batch":
        return b.batch.localeCompare(a.batch);
      case "lastActive":
        return a.lastActive.localeCompare(b.lastActive);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <DashboardLayout userRole="admin" title="Alumni Directory">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Alumni Directory</h1>
              <p className="text-purple-100 text-lg">
                Manage and explore our alumni network
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowAddAlumniModal(true)}
                className="bg-white text-purple-600 hover:bg-purple-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Alumni
              </Button>
              <div className="text-right">
                <div className="text-2xl font-bold">{alumni.length}</div>
                <div className="text-purple-100">Total Alumni</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search alumni by name, company, position, or skills..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={filterCompany} onValueChange={setFilterCompany}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company === "all" ? "All Companies" : company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterBatch} onValueChange={setFilterBatch}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch} value={batch}>
                        {batch === "all" ? "All Batches" : batch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterSkills} onValueChange={setFilterSkills}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Skills" />
                  </SelectTrigger>
                  <SelectContent>
                    {allSkills.map((skill) => (
                      <SelectItem key={skill} value={skill}>
                        {skill === "all" ? "All Skills" : skill}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="batch">Batch</SelectItem>
                    <SelectItem value="lastActive">Last Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Alumni Grid */}
        {error && (
          <Card className="p-4 border-red-200 bg-red-50 text-red-700">{error}</Card>
        )}
        {loading && (
          <Card className="p-4">Loading alumni...</Card>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedAlumni.map((alumnus) => (
            <Card
              key={alumnus.id}
              className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-purple-50/30 hover:from-purple-50/50 hover:to-indigo-50/30">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 ring-2 ring-purple-100">
                      <AvatarImage
                        src={alumnus.avatar || "/placeholder.svg"}
                        alt={alumnus.name}
                      />
                      <AvatarFallback className="text-lg">
                        {alumnus.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg">{alumnus.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {alumnus.position}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-700 border-green-200">
                    <Award className="w-3 h-3 mr-1" />
                    {alumnus.status}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span className="font-medium">{alumnus.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GraduationCap className="w-4 h-4" />
                    <span>Class of {alumnus.batch}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{alumnus.location}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {alumnus.skills.slice(0, 3).map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200">
                        {skill}
                      </Badge>
                    ))}
                    {alumnus.skills.length > 3 && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-gray-100 text-gray-600">
                        +{alumnus.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="h-8 px-3">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 px-3">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                  <div className="flex items-center gap-1">
                    {alumnus.linkedin && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-blue-50">
                        <Linkedin className="w-4 h-4 text-blue-600" />
                      </Button>
                    )}
                    {alumnus.github && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-gray-50">
                        <Github className="w-4 h-4 text-gray-600" />
                      </Button>
                    )}
                    {alumnus.twitter && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-blue-50">
                        <Twitter className="w-4 h-4 text-blue-400" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedAlumni.length === 0 && (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold">No alumni found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          </Card>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{alumni.length}</div>
                <div className="text-sm text-muted-foreground">
                  Total Alumni
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {alumni.filter((a) => a.status === "verified").length}
                </div>
                <div className="text-sm text-muted-foreground">Verified</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {new Set(alumni.map((a) => a.company)).size}
                </div>
                <div className="text-sm text-muted-foreground">Companies</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {new Set(alumni.map((a) => a.batch)).size}
                </div>
                <div className="text-sm text-muted-foreground">Batches</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Alumni Modal */}
      <AddAlumniModal
        open={showAddAlumniModal}
        onOpenChange={setShowAddAlumniModal}
      />
    </DashboardLayout>
  );
}

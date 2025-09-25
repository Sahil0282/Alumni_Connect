"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Briefcase,
  Calendar,
  Send,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function FindAlumniPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [connectionRequests, setConnectionRequests] = useState({});
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [connectionMessage, setConnectionMessage] = useState("");
  const [connectionTopic, setConnectionTopic] = useState("");
  const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/admin/alumni/list`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.detail || "Failed to load alumni");
        const list = Array.isArray(data?.alumni) ? data.alumni : [];
        const mapped = list.map((u) => ({
          id: u.id || u._id || u.email,
          name: u.full_name || u.email?.split("@")[0] || "Alumni",
          company: u.current_company || "",
          role: u.current_position || "",
          batch: String(u.graduation_year || ""),
          location: u.location || "",
          skills: Array.isArray(u.skills) ? u.skills : [],
          experience: u.years_of_experience ? `${u.years_of_experience} years` : "",
          compatibility: 0,
          bio: u.bio || "",
        }));
        setAlumni(mapped);
      } catch (e) {
        setError(e?.message || "Failed to load alumni");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const companies = Array.from(new Set(alumni.map(a => a.company).filter(Boolean)));
  const batches = Array.from(new Set(alumni.map(a => a.batch).filter(Boolean)));

  const sendConnectionRequest = async (alumniId, message, topic) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/connections/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          alumni_id: alumniId,
          message: message,
          topic: topic,
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Failed to send connection request");
      
      // Update connection requests state
      setConnectionRequests(prev => ({
        ...prev,
        [alumniId]: "pending"
      }));
      
      return data;
    } catch (e) {
      throw new Error(e?.message || "Failed to send connection request");
    }
  };

  const handleConnectClick = (alumni) => {
    setSelectedAlumni(alumni);
    setConnectionMessage("");
    setConnectionTopic("");
    setIsConnectionDialogOpen(true);
  };

  const handleSendRequest = async () => {
    if (!selectedAlumni) return;
    
    setSendingRequest(true);
    try {
      await sendConnectionRequest(
        selectedAlumni.id,
        connectionMessage,
        connectionTopic
      );
      setIsConnectionDialogOpen(false);
      setConnectionMessage("");
      setConnectionTopic("");
    } catch (e) {
      setError(e?.message || "Failed to send connection request");
    } finally {
      setSendingRequest(false);
    }
  };

  const getConnectionStatus = (alumniId) => {
    return connectionRequests[alumniId] || "none";
  };

  const filteredAlumni = alumni.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCompany =
      companyFilter === "all" || person.company === companyFilter;
    const matchesBatch = batchFilter === "all" || person.batch === batchFilter;

    return matchesSearch && matchesCompany && matchesBatch;
  });

  return (
    <DashboardLayout userRole="student" title="Find Alumni">
      <div className="space-y-6">
        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Discover Alumni</CardTitle>
            <CardDescription>
              Connect with alumni based on your interests and career goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, company, role, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={batchFilter} onValueChange={setBatchFilter}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {batches.map((batch) => (
                    <SelectItem key={batch} value={batch}>
                      {batch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Loading / Error */}
        {loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">Loading alumni...</div>
            </CardContent>
          </Card>
        )}
        {error && !loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-red-600">{error}</div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAlumni.map((person) => (
              <Card key={person.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="text-lg">
                        {person.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{person.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Briefcase className="w-3 h-3" />
                            {person.role}{person.company ? ` at ${person.company}` : ""}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-medium text-primary">
                          <Star className="w-3 h-3 fill-current" />
                          {person.compatibility}%
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {person.batch && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Batch {person.batch}
                            </div>
                          )}
                          {person.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {person.location}
                            </div>
                          )}
                        </div>

                        {person.bio && (
                          <p className="text-sm text-muted-foreground text-pretty">
                            {person.bio}
                          </p>
                        )}

                        {person.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {person.skills.slice(0, 4).map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {person.skills.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{person.skills.length - 4} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {getConnectionStatus(person.id) === "none" && (
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleConnectClick(person)}
                          >
                            Connect
                          </Button>
                        )}
                        {getConnectionStatus(person.id) === "pending" && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            disabled
                          >
                            <Clock className="w-4 h-4 mr-1" />
                            Pending
                          </Button>
                        )}
                        {getConnectionStatus(person.id) === "accepted" && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            disabled
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Connected
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-transparent">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && !error && filteredAlumni.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No alumni found</h3>
                <p>Try adjusting your search criteria or filters</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Connection Request Dialog */}
        <Dialog open={isConnectionDialogOpen} onOpenChange={setIsConnectionDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Send Connection Request</DialogTitle>
              <DialogDescription>
                Send a connection request to {selectedAlumni?.name} to start a conversation.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="topic" className="text-sm font-medium">
                  Topic (Optional)
                </label>
                <Input
                  id="topic"
                  placeholder="e.g., Career advice, Technical guidance"
                  value={connectionTopic}
                  onChange={(e) => setConnectionTopic(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Introduce yourself and explain why you'd like to connect..."
                  value={connectionMessage}
                  onChange={(e) => setConnectionMessage(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsConnectionDialogOpen(false)}
                disabled={sendingRequest}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendRequest}
                disabled={sendingRequest || !connectionMessage.trim()}
              >
                {sendingRequest ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Request
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

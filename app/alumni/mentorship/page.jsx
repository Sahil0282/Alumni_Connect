"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  MessageSquare,
  User,
  Star,
  Award,
} from "lucide-react";
import { getToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function MentorshipPage() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeMentorships, setActiveMentorships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [completedMentorships, setCompletedMentorships] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = getToken();
        
        // Load pending requests
        const requestsRes = await fetch(`${API_BASE}/api/connections/requests/pending`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const requestsData = await requestsRes.json();
        if (!requestsRes.ok) throw new Error(requestsData?.detail || "Failed to load requests");
        
        setPendingRequests(requestsData || []);
        
        // Load active mentorships (accepted connections)
        const mentorshipsRes = await fetch(`${API_BASE}/api/connections/stats`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const mentorshipsData = await mentorshipsRes.json();
        if (!mentorshipsRes.ok) throw new Error(mentorshipsData?.detail || "Failed to load mentorships");
        
        // For now, we'll use the stats. In a real app, you'd have a separate endpoint for active mentorships
        setActiveMentorships([]);
        
      } catch (e) {
        setError(e?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleRequestAction = async (requestId, action) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/connections/requests/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          status: action === "accept" ? "accepted" : "declined"
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Failed to update request");
      
      // Remove from pending requests
      setPendingRequests(prev => prev.filter(req => req.id !== requestId));
      
      // If accepted, add to active mentorships
      if (action === "accept") {
        const acceptedRequest = pendingRequests.find(req => req.id === requestId);
        if (acceptedRequest) {
          setActiveMentorships(prev => [...prev, acceptedRequest]);
        }
      }
      
    } catch (e) {
      setError(e?.message || "Failed to update request");
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };


  return (
    <DashboardLayout userRole="alumni" title="Mentorship">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-semibold">
                    {loading ? "..." : pendingRequests.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Pending Requests
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="text-2xl font-semibold">
                    {loading ? "..." : activeMentorships.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Active Mentorships
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-semibold">
                    {completedMentorships.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="text-2xl font-semibold">4.9</div>
                  <div className="text-sm text-muted-foreground">
                    Average Rating
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mentorship Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending Requests</TabsTrigger>
            <TabsTrigger value="active">Active Mentorships</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {loading && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-muted-foreground">Loading requests...</div>
                </CardContent>
              </Card>
            )}
            
            {error && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-red-600">{error}</div>
                </CardContent>
              </Card>
            )}
            
            {!loading && !error && pendingRequests.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No pending requests</h3>
                    <p>You don't have any pending connection requests at the moment.</p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {!loading && !error && pendingRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>
                        {request.student_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {request.student_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Student
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(request.created_at)}
                        </div>
                      </div>

                      <div className="mb-3">
                        {request.topic && (
                          <h4 className="font-medium text-primary mb-1">
                            {request.topic}
                          </h4>
                        )}
                        {request.message && (
                          <p className="text-sm text-muted-foreground text-pretty">
                            {request.message}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() =>
                            handleRequestAction(request.id, "accept")
                          }
                          className="flex-1">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accept Request
                        </Button>
                        <Button
                          onClick={() =>
                            handleRequestAction(request.id, "decline")
                          }
                          variant="outline"
                          className="flex-1 bg-transparent">
                          <XCircle className="w-4 h-4 mr-1" />
                          Decline
                        </Button>
                        <Button variant="ghost" size="sm">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {activeMentorships.map((connection) => (
              <Card key={connection.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>
                        {(connection.student_name || "U")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {connection.student_name || "Student"}
                          </h3>
                          {connection.topic && (
                            <p className="text-sm text-primary font-medium">
                              {connection.topic}
                            </p>
                          )}
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </div>

                      <div className="flex gap-3">
                        <Button size="sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          Schedule Session
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-transparent">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                        <Button size="sm" variant="ghost">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedMentorships.map((mentorship) => (
              <Card key={mentorship.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={mentorship.avatar || "/placeholder.svg"}
                        alt={mentorship.student}
                      />
                      <AvatarFallback>
                        {mentorship.student
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {mentorship.student}
                          </h3>
                          <p className="text-sm text-primary font-medium">
                            {mentorship.topic}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(mentorship.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                        <div>
                          <div className="text-muted-foreground">Duration</div>
                          <div className="font-medium">
                            {mentorship.duration}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Outcome</div>
                          <div className="font-medium text-green-600">
                            {mentorship.outcome}
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted/50 p-3 rounded-lg mb-3">
                        <p className="text-sm text-pretty">
                          "{mentorship.feedback}"
                        </p>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-transparent">
                        View Full Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

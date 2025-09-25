"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getToken } from "@/lib/auth"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Plus, Search, Filter, MapPin, Clock, Users, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import { CreateEventDialog } from "@/components/admin/create-event-dialog"

export default function AdminEventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    setLoading(true)
    setError("")
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/api/events/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.detail || "Failed to load events")
      setEvents(data.events || [])
    } catch (e) {
      setError(e?.message || "Failed to load events")
    } finally {
      setLoading(false)
    }
  }

  const hardcodedEvents = [
    {
      id: 1,
      title: "Tech Talk: AI in Healthcare",
      description: "Exploring the latest applications of artificial intelligence in medical diagnosis and treatment.",
      date: "2024-06-15",
      time: "2:00 PM - 4:00 PM",
      location: "Virtual Event",
      organizer: "Dr. Sarah Chen",
      status: "upcoming",
      attendees: 45,
      maxAttendees: 100,
      category: "tech-talk",
      registrationDeadline: "2024-06-14",
    },
    {
      id: 2,
      title: "Career Fair 2024",
      description: "Connect with top tech companies and explore career opportunities.",
      date: "2024-06-20",
      time: "10:00 AM - 6:00 PM",
      location: "University Campus, Main Hall",
      organizer: "Career Services",
      status: "upcoming",
      attendees: 234,
      maxAttendees: 500,
      category: "career",
      registrationDeadline: "2024-06-18",
    },
    {
      id: 3,
      title: "Alumni Networking Mixer",
      description: "Casual networking event for alumni and current students.",
      date: "2024-05-28",
      time: "6:00 PM - 9:00 PM",
      location: "Downtown Conference Center",
      organizer: "Alumni Association",
      status: "completed",
      attendees: 89,
      maxAttendees: 120,
      category: "networking",
      registrationDeadline: "2024-05-26",
    },
    {
      id: 4,
      title: "Startup Pitch Competition",
      description: "Students present their startup ideas to a panel of industry experts.",
      date: "2024-07-10",
      time: "1:00 PM - 5:00 PM",
      location: "Innovation Hub",
      organizer: "Entrepreneurship Club",
      status: "draft",
      attendees: 0,
      maxAttendees: 200,
      category: "competition",
      registrationDeadline: "2024-07-08",
    },
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Upcoming</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      case "draft":
        return <Badge variant="secondary">Draft</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getCategoryBadge = (category) => {
    const categoryMap = {
      "tech-talk": "Tech Talk",
      career: "Career",
      networking: "Networking",
      competition: "Competition",
      workshop: "Workshop",
    }
    return <Badge variant="outline">{categoryMap[category] || category}</Badge>
  }

  const handleDeleteEvent = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) return
    
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/api/events/${eventId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.detail || "Failed to delete event")
      }
      loadEvents() // Reload events
    } catch (e) {
      alert(e?.message || "Failed to delete event")
    }
  }

  const handlePublishEvent = async (eventId) => {
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: "upcoming" }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.detail || "Failed to publish event")
      }
      loadEvents() // Reload events
    } catch (e) {
      alert(e?.message || "Failed to publish event")
    }
  }

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <DashboardLayout userRole="admin" title="Event Management">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Events Dashboard</CardTitle>
                <CardDescription>Manage platform events and activities</CardDescription>
              </div>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Loading and Error States */}
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading events...</p>
              </div>
            )}

            {error && (
              <div className="text-red-600 text-center py-4">
                <p>Error: {error}</p>
                <Button 
                  onClick={loadEvents} 
                  variant="outline" 
                  className="mt-2"
                >
                  Retry
                </Button>
              </div>
            )}

            {!loading && !error && (
              <>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">All Events</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredEvents.map((event) => (
                    <Card key={event.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{event.title}</h3>
                              {getStatusBadge(event.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{event.description}</p>
                            {getCategoryBadge(event.category)}
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{event.location}</span>
                          </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span>
                                {event.current_attendees}/{event.max_attendees} registered
                              </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <p className="text-xs text-muted-foreground">Organized by {event.organizer_name}</p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingEvent(event)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="upcoming" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredEvents
                    .filter((event) => event.status === "upcoming")
                    .map((event) => (
                      <Card key={event.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{event.title}</h3>
                                {getStatusBadge(event.status)}
                              </div>
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{event.description}</p>
                              {getCategoryBadge(event.category)}
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span>
                                {event.current_attendees}/{event.max_attendees} registered
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="draft" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredEvents
                    .filter((event) => event.status === "draft")
                    .map((event) => (
                      <Card key={event.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{event.title}</h3>
                                {getStatusBadge(event.status)}
                              </div>
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{event.description}</p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handlePublishEvent(event.id)}
                            >
                              Publish Event
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 bg-transparent"
                              onClick={() => setEditingEvent(event)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredEvents
                    .filter((event) => event.status === "completed")
                    .map((event) => (
                      <Card key={event.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{event.title}</h3>
                                {getStatusBadge(event.status)}
                              </div>
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{event.description}</p>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span>{event.current_attendees} attended</span>
                            </div>
                          </div>

                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            <Eye className="w-4 h-4 mr-1" />
                            View Report
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
              </>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Event Dialog */}
        <CreateEventDialog
          isOpen={isCreateDialogOpen || !!editingEvent}
          onClose={() => {
            setIsCreateDialogOpen(false)
            setEditingEvent(null)
          }}
          onSuccess={loadEvents}
          editingEvent={editingEvent}
        />
      </div>
    </DashboardLayout>
  )
}

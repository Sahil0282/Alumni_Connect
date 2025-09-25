"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getToken } from "@/lib/auth"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Search,
  Filter,
  Plus,
  Star,
  ExternalLink,
  Bookmark,
  Share2,
  Heart,
  MessageCircle,
} from "lucide-react"

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterLocation, setFilterLocation] = useState("all")
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [userRegistrations, setUserRegistrations] = useState([])

  useEffect(() => {
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
    
    const loadUserRegistrations = async () => {
      try {
        const token = getToken()
        const res = await fetch(`${API_BASE}/api/events/user/registrations`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        const data = await res.json()
        if (res.ok) {
          setUserRegistrations(data || [])
        }
      } catch (e) {
        // Silent fail for registrations
      }
    }
    
    loadEvents()
    loadUserRegistrations()
  }, [])

  const hardcodedEvents = [
    {
      id: 1,
      title: "Tech Talk: AI in Healthcare",
      description:
        "Join us for an insightful discussion on how artificial intelligence is revolutionizing healthcare, from diagnostic tools to personalized treatment plans.",
      date: "2024-06-15",
      time: "2:00 PM - 4:00 PM",
      location: "Virtual Event",
      organizer: {
        name: "Dr. Sarah Chen",
        avatar: "/professional-woman-diverse.png",
        company: "Google Health",
      },
      category: "tech-talk",
      attendees: 45,
      maxAttendees: 100,
      price: "Free",
      status: "upcoming",
      featured: true,
      tags: ["AI", "Healthcare", "Technology"],
      registrationDeadline: "2024-06-14",
      image: "/placeholder-objfm.png",
    },
    {
      id: 2,
      title: "Career Fair 2024",
      description:
        "Connect with top tech companies including Google, Microsoft, Amazon, and many startups. Perfect opportunity for networking and job hunting.",
      date: "2024-06-20",
      time: "10:00 AM - 6:00 PM",
      location: "University Campus, Main Hall",
      organizer: {
        name: "Career Services",
        avatar: "/placeholder-kmh4b.png",
        company: "University",
      },
      category: "career",
      attendees: 234,
      maxAttendees: 500,
      price: "Free",
      status: "upcoming",
      featured: true,
      tags: ["Career", "Networking", "Jobs"],
      registrationDeadline: "2024-06-18",
      image: "/placeholder-z1z4a.png",
    },
    {
      id: 3,
      title: "Alumni Networking Mixer",
      description:
        "Casual networking event for alumni and current students. Great opportunity to build connections and share experiences over drinks and appetizers.",
      date: "2024-06-25",
      time: "6:00 PM - 9:00 PM",
      location: "Downtown Conference Center",
      organizer: {
        name: "Alumni Association",
        avatar: "/placeholder-vryfc.png",
        company: "Alumni Network",
      },
      category: "networking",
      attendees: 89,
      maxAttendees: 120,
      price: "$25",
      status: "upcoming",
      featured: false,
      tags: ["Networking", "Social", "Alumni"],
      registrationDeadline: "2024-06-23",
      image: "/placeholder-sjrqe.png",
    },
    {
      id: 4,
      title: "Startup Pitch Competition",
      description:
        "Watch innovative student startups pitch their ideas to a panel of industry experts and investors. Prizes worth $50,000 in total.",
      date: "2024-07-10",
      time: "1:00 PM - 5:00 PM",
      location: "Innovation Hub",
      organizer: {
        name: "Entrepreneurship Club",
        avatar: "/placeholder-joyl7.png",
        company: "Student Organization",
      },
      category: "competition",
      attendees: 67,
      maxAttendees: 200,
      price: "Free",
      status: "upcoming",
      featured: false,
      tags: ["Startup", "Competition", "Innovation"],
      registrationDeadline: "2024-07-08",
      image: "/startup-pitch-competition-business.jpg",
    },
    {
      id: 5,
      title: "Web Development Workshop",
      description:
        "Hands-on workshop covering modern web development with React, Next.js, and TypeScript. Suitable for beginners to intermediate developers.",
      date: "2024-06-30",
      time: "9:00 AM - 5:00 PM",
      location: "Computer Science Building, Lab 201",
      organizer: {
        name: "Alex Kumar",
        avatar: "/student-alex.png",
        company: "CS Student Association",
      },
      category: "workshop",
      attendees: 28,
      maxAttendees: 40,
      price: "$15",
      status: "upcoming",
      featured: false,
      tags: ["Web Development", "React", "Programming"],
      registrationDeadline: "2024-06-28",
      image: "/placeholder-zzmu1.png",
    },
  ]

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "tech-talk", label: "Tech Talks" },
    { value: "career", label: "Career Events" },
    { value: "networking", label: "Networking" },
    { value: "workshop", label: "Workshops" },
    { value: "competition", label: "Competitions" },
  ]

  const locations = [
    { value: "all", label: "All Locations" },
    { value: "virtual", label: "Virtual Events" },
    { value: "campus", label: "On Campus" },
    { value: "downtown", label: "Downtown" },
    { value: "remote", label: "Remote" },
  ]

  const handleRegister = async (eventId: string) => {
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/api/events/${eventId}/register`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.detail || "Failed to register")
      
      // Reload events and registrations
      const eventsRes = await fetch(`${API_BASE}/api/events/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const eventsData = await eventsRes.json()
      if (eventsRes.ok) setEvents(eventsData.events || [])
      
      const regRes = await fetch(`${API_BASE}/api/events/user/registrations`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const regData = await regRes.json()
      if (regRes.ok) setUserRegistrations(regData || [])
    } catch (e) {
      alert(e?.message || "Failed to register")
    }
  }

  const handleUnregister = async (eventId: string) => {
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/api/events/${eventId}/register`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.detail || "Failed to unregister")
      
      // Reload events and registrations
      const eventsRes = await fetch(`${API_BASE}/api/events/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const eventsData = await eventsRes.json()
      if (eventsRes.ok) setEvents(eventsData.events || [])
      
      const regRes = await fetch(`${API_BASE}/api/events/user/registrations`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const regData = await regRes.json()
      if (regRes.ok) setUserRegistrations(regData || [])
    } catch (e) {
      alert(e?.message || "Failed to unregister")
    }
  }

  const isRegistered = (eventId: string) => {
    return userRegistrations.some(reg => reg.id === eventId)
  }

  const getCategoryBadge = (category: string) => {
    const categoryMap = {
      "tech-talk": { label: "Tech Talk", color: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
      career: { label: "Career", color: "bg-green-100 text-green-800 hover:bg-green-100" },
      networking: { label: "Networking", color: "bg-purple-100 text-purple-800 hover:bg-purple-100" },
      workshop: { label: "Workshop", color: "bg-orange-100 text-orange-800 hover:bg-orange-100" },
      competition: { label: "Competition", color: "bg-red-100 text-red-800 hover:bg-red-100" },
      conference: { label: "Conference", color: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100" },
      social: { label: "Social", color: "bg-pink-100 text-pink-800 hover:bg-pink-100" },
    }
    const cat = categoryMap[category as keyof typeof categoryMap]
    return <Badge className={cat?.color || ""}>{cat?.label || category}</Badge>
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = filterCategory === "all" || event.category === filterCategory
    const matchesLocation =
      filterLocation === "all" ||
      (filterLocation === "virtual" && event.location.toLowerCase().includes("virtual")) ||
      (filterLocation === "campus" && event.location.toLowerCase().includes("campus")) ||
      (filterLocation === "downtown" && event.location.toLowerCase().includes("downtown"))
    return matchesSearch && matchesCategory && matchesLocation
  })

  const featuredEvents = filteredEvents.filter((event) => event.featured)
  const upcomingEvents = filteredEvents.filter((event) => event.status === "upcoming")
  const myEvents = userRegistrations.filter((event) => event.status === "upcoming" || event.status === "ongoing")

  return (
    <DashboardLayout userRole="student" title="Events">
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  Upcoming Events
                </CardTitle>
                <CardDescription>Discover networking events, workshops, and career opportunities</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Loading and Error States */}
        {loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading events...</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card>
            <CardContent className="p-6">
              <div className="text-red-600 text-center">
                <p>Error: {error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline" 
                  className="mt-2"
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="my-events">My Events</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {/* Featured Events */}
            {featuredEvents.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Featured Events
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {featuredEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video relative">
                        <img
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">{getCategoryBadge(event.category)}</div>
                        <div className="absolute top-4 right-4 flex gap-2">
                          <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                            <Bookmark className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>{new Date(event.date).toLocaleDateString()}</span>
                              <Clock className="w-4 h-4 text-muted-foreground ml-2" />
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
                              <Badge variant="outline" className="ml-auto">
                                {event.price}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs">
                                  {event.organizer_name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="text-xs">
                                <p className="font-medium">{event.organizer_name}</p>
                                <p className="text-muted-foreground">{event.organizer_company || "Event Organizer"}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="bg-transparent">
                                <ExternalLink className="w-4 h-4 mr-1" />
                                Details
                              </Button>
                              {isRegistered(event.id) ? (
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleUnregister(event.id)}
                                >
                                  Unregister
                                </Button>
                              ) : (
                                <Button 
                                  size="sm"
                                  onClick={() => handleRegister(event.id)}
                                  disabled={event.current_attendees >= event.max_attendees}
                                >
                                  {event.current_attendees >= event.max_attendees ? "Full" : "Register"}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Events */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">All Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {getCategoryBadge(event.category)}
                            <h3 className="font-semibold text-base mt-2 mb-1">{event.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                          </div>
                          {event.featured && <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
                        </div>

                        <div className="space-y-2">
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
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span>
                              {event.current_attendees}/{event.max_attendees}
                            </span>
                          </div>
                          <Badge variant="outline">{event.price}</Badge>
                        </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                {event.organizer_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-xs">
                              <p className="font-medium">{event.organizer_name}</p>
                            </div>
                          </div>
                          {isRegistered(event.id) ? (
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleUnregister(event.id)}
                            >
                              Unregister
                            </Button>
                          ) : (
                            <Button 
                              size="sm"
                              onClick={() => handleRegister(event.id)}
                              disabled={event.current_attendees >= event.max_attendees}
                            >
                              {event.current_attendees >= event.max_attendees ? "Full" : "Register"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="featured" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">{getCategoryBadge(event.category)}</div>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                          <Clock className="w-4 h-4 text-muted-foreground ml-2" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span>
                              {event.attendees}/{event.maxAttendees} registered
                            </span>
                          </div>
                          <Badge variant="outline">{event.price}</Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage
                              src={event.organizer.avatar || "/placeholder.svg"}
                              alt={event.organizer.name}
                            />
                            <AvatarFallback className="text-xs">
                              {event.organizer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-xs">
                            <p className="font-medium">{event.organizer.name}</p>
                            <p className="text-muted-foreground">{event.organizer.company}</p>
                          </div>
                        </div>
                        <Button size="sm">Register Now</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        {getCategoryBadge(event.category)}
                        <h3 className="font-semibold text-base mt-2 mb-1">{event.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                      </div>

                      <div className="space-y-2">
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
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <Badge variant="outline">{event.price}</Badge>
                        <Button size="sm">Register</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-events" className="space-y-4">
            {myEvents.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No Registered Events</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't registered for any events yet. Browse available events and register to get started.
                  </p>
                  <Button onClick={() => setFilterCategory("all")}>Browse Events</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          {getCategoryBadge(event.category)}
                          <h3 className="font-semibold text-base mt-2 mb-1">{event.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                        </div>

                        <div className="space-y-2">
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
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <Badge variant="outline">{event.price}</Badge>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleUnregister(event.id)}
                          >
                            Unregister
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

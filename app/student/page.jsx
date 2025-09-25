"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, MessageSquare, Calendar, Award, TrendingUp, Star, ArrowRight, Target, Loader2 } from "lucide-react"

export default function StudentDashboard() {
  const [isLoadingAlumni, setIsLoadingAlumni] = useState(true)
  
  const recommendedAlumni = [
    {
      id: 1,
      name: "Sai Sinare",
      company: "Google",
      role: "Software Engineer",
      batch: "2020",
      compatibility: 92,
      skills: ["React", "Python", "Machine Learning"],
    },
    {
      id: 2,
      name: "Sahil Dhawane",
      company: "Microsoft",
      role: "Product Manager",
      batch: "2019",
      compatibility: 88,
      skills: ["Product Strategy", "Data Analysis", "Leadership"],
    },
    {
      id: 3,
      name: "Vedant Chandore",
      company: "Amazon",
      role: "UX Designer",
      batch: "2021",
      compatibility: 85,
      skills: ["UI/UX", "Figma", "User Research"],
    },
  ]

  // Simulate loading for recommended alumni
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingAlumni(false)
    }, 3500) // 3.5 second loading simulation
    
    return () => clearTimeout(timer)
  }, [])

  const recentQuestions = [
    {
      id: 1,
      title: "How to prepare for technical interviews at FAANG companies?",
      author: "Alex Kumar",
      answers: 12,
      upvotes: 45,
      timeAgo: "2 hours ago",
    },
    {
      id: 2,
      title: "Best resources for learning system design?",
      author: "Priya Sharma",
      answers: 8,
      upvotes: 32,
      timeAgo: "5 hours ago",
    },
    {
      id: 3,
      title: "Transitioning from academia to industry - tips needed",
      author: "David Park",
      answers: 15,
      upvotes: 67,
      timeAgo: "1 day ago",
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Career Fair 2024",
      date: "Dec 15, 2024",
      time: "10:00 AM",
      attendees: 150,
      type: "Career",
    },
    {
      id: 2,
      title: "Alumni Networking Session",
      date: "Dec 20, 2024",
      time: "6:00 PM",
      attendees: 75,
      type: "Networking",
    },
  ]

  return (
    <DashboardLayout userRole="student" title="Student Dashboard">
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-teal-500/10 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                  Welcome back, John!
                </CardTitle>
                <CardDescription className="text-lg mt-2 text-muted-foreground">
                  Ready to connect with alumni and advance your career?
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-2">Profile Completion</div>
                <div className="flex items-center gap-3">
                  <Progress value={75} className="w-24 h-2" />
                  <span className="text-lg font-bold text-purple-600">75%</span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-700">24</div>
                  <div className="text-sm text-blue-600/80">Alumni Connections</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 hover:from-purple-100 hover:to-purple-200/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-700">8</div>
                  <div className="text-sm text-purple-600/80">Questions Asked</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-teal-50 to-teal-100/50 hover:from-teal-100 hover:to-teal-200/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-teal-700">3</div>
                  <div className="text-sm text-teal-600/80">Events Attended</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-orange-100/50 hover:from-orange-100 hover:to-orange-200/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-700">2</div>
                  <div className="text-sm text-orange-600/80">Mentorship Sessions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="relative border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30">
            {/* Gradient border effect for recommended alumni card */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 rounded-xl blur-sm -z-10 opacity-30"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 rounded-xl blur-xs -z-10 opacity-40"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-300 via-purple-300 to-teal-300 rounded-xl -z-10 opacity-50"></div>
            <div className="relative bg-white/95 backdrop-blur-sm rounded-xl py-6 px-0 border-2 border-transparent bg-clip-padding" 
                 style={{
                   backgroundImage: 'linear-gradient(white, white), linear-gradient(45deg, #3b82f6, #8b5cf6, #14b8a6)',
                   backgroundOrigin: 'border-box',
                   backgroundClip: 'padding-box, border-box'
                 }}>
            <CardHeader className="pb-4 px-6 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    Recommended Alumni
                  </CardTitle>
                  <CardDescription className="mt-2">Alumni matched based on your interests and goals</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="hover:bg-blue-100 text-blue-600">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 px-6">
              {isLoadingAlumni ? (
                // Loading state with skeleton animation
                <div className="space-y-4">
                  {[1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className="group p-4 rounded-xl border-0 bg-white/80 animate-pulse"
                    >
                      <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse flex items-center justify-center">
                          <div className="w-6 h-6 bg-white/30 rounded-full"></div>
                        </div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
                            <div className="flex gap-2 mt-2">
                              <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
                              <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                          <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-sm text-muted-foreground">Loading recommended alumni...</span>
                  </div>
                </div>
              ) : (
                // Loaded state with actual alumni data
                recommendedAlumni.map((alumni) => (
                  <div
                    key={alumni.id}
                    className="group p-4 rounded-xl border-0 bg-white/80 hover:bg-white hover:shadow-md transition-all duration-300 animate-in slide-in-from-bottom-2 fade-in"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 ring-2 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                            {alumni.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-gray-900">{alumni.name}</div>
                          <div className="text-sm text-gray-600">
                            {alumni.role} at {alumni.company} • {alumni.batch}
                          </div>
                          <div className="flex gap-2 mt-2">
                            {alumni.skills.slice(0, 2).map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm font-semibold text-orange-600 mb-3">
                          <Star className="w-4 h-4 fill-current" />
                          {alumni.compatibility}%
                        </div>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md"
                        >
                          Connect
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
            </div>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50/30">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    Recent Q&A
                  </CardTitle>
                  <CardDescription className="mt-2">Latest questions from the community</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="hover:bg-purple-100 text-purple-600">
                  View Forum
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentQuestions.map((question) => (
                <div
                  key={question.id}
                  className="p-4 rounded-xl border-0 bg-white/80 hover:bg-white hover:shadow-md transition-all duration-300"
                >
                  <h4 className="font-medium text-sm mb-3 text-pretty text-gray-900">{question.title}</h4>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>by {question.author}</span>
                    <span>{question.timeAgo}</span>
                  </div>
                  <div className="flex items-center gap-6 text-xs">
                    <span className="flex items-center gap-1 text-purple-600">
                      <MessageSquare className="w-3 h-3" />
                      {question.answers} answers
                    </span>
                    <span className="flex items-center gap-1 text-teal-600">
                      <TrendingUp className="w-3 h-3" />
                      {question.upvotes} upvotes
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-teal-50/30">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  Upcoming Events
                </CardTitle>
                <CardDescription className="mt-2">Don't miss these networking opportunities</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="hover:bg-teal-100 text-teal-600">
                View All Events
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-5 rounded-xl border-0 bg-white/80 hover:bg-white hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{event.title}</h4>
                      <div className="text-sm text-gray-600 mt-1">
                        {event.date} • {event.time}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs bg-teal-100 text-teal-700 border-teal-200">
                      {event.type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{event.attendees} attending</span>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white shadow-md"
                    >
                      RSVP
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

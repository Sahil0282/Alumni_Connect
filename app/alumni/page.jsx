"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, MessageSquare, Calendar, Award, TrendingUp, ArrowRight, Clock, CheckCircle, Gift } from "lucide-react"

export default function AlumniDashboard() {
  // If first-time login flag present, nudge to profile
  if (typeof window !== "undefined") {
    const uRaw = window.localStorage.getItem("auth_user")
    if (uRaw) {
      try {
        const u = JSON.parse(uRaw)
        const completed = window.localStorage.getItem(`alumni_profile_completed_${u.id}`)
        if (!completed) {
          // lightweight banner could be added; for now, ensure route-guard in layout already enforces auth
        }
      } catch {}
    }
  }
  const mentorshipRequests = [
    {
      id: 1,
      student: "Alex Kumar",
      topic: "Software Engineering Career Path",
      message:
        "Hi! I'm interested in learning about your journey at Google and how to prepare for technical interviews.",
      timeAgo: "2 hours ago",
      avatar: "/student-alex.png",
      year: "2024",
      skills: ["JavaScript", "Python"],
    },
    {
      id: 2,
      student: "Priya Sharma",
      topic: "Product Management Transition",
      message: "I'm looking to transition from engineering to product management. Would love to hear your insights!",
      timeAgo: "5 hours ago",
      avatar: "/student-priya.png",
      year: "2025",
      skills: ["React", "Data Analysis"],
    },
    {
      id: 3,
      student: "David Park",
      topic: "Machine Learning Projects",
      message: "Could you guide me on building a strong ML portfolio for job applications?",
      timeAgo: "1 day ago",
      avatar: "/student-david.png",
      year: "2024",
      skills: ["Python", "TensorFlow"],
    },
  ]

  const recentQuestions = [
    {
      id: 1,
      title: "How to prepare for technical interviews at FAANG companies?",
      author: "Alex Kumar",
      answers: 12,
      upvotes: 45,
      timeAgo: "2 hours ago",
      hasAnswered: false,
    },
    {
      id: 2,
      title: "Best resources for learning system design?",
      author: "Priya Sharma",
      answers: 8,
      upvotes: 32,
      timeAgo: "5 hours ago",
      hasAnswered: true,
    },
    {
      id: 3,
      title: "Transitioning from academia to industry - tips needed",
      author: "David Park",
      answers: 15,
      upvotes: 67,
      timeAgo: "1 day ago",
      hasAnswered: false,
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Alumni Networking Session",
      date: "Dec 20, 2024",
      time: "6:00 PM",
      attendees: 75,
      type: "Networking",
      isHosting: false,
    },
    {
      id: 2,
      title: "Tech Career Panel Discussion",
      date: "Dec 25, 2024",
      time: "2:00 PM",
      attendees: 120,
      type: "Panel",
      isHosting: true,
    },
  ]

  const rewardStats = {
    totalPoints: 1250,
    currentLevel: "Gold Mentor",
    nextLevel: "Platinum Mentor",
    pointsToNext: 250,
    achievements: [
      { name: "First Mentorship", icon: "🎯", earned: true },
      { name: "Question Master", icon: "❓", earned: true },
      { name: "Event Host", icon: "🎤", earned: true },
      { name: "Community Leader", icon: "👑", earned: false },
    ],
  }

  return (
    <DashboardLayout userRole="alumni" title="Alumni Dashboard">
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-purple-500/10 via-teal-500/10 to-blue-500/10 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                  Welcome back, Sarah!
                </CardTitle>
                <CardDescription className="text-lg mt-2 text-muted-foreground">
                  Thank you for giving back to the community
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-2">Reward Points</div>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-purple-600" />
                  <span className="text-2xl font-bold text-purple-600">{rewardStats.totalPoints}</span>
                </div>
                <Badge
                  variant="secondary"
                  className="mt-2 bg-gradient-to-r from-purple-100 to-teal-100 text-purple-700 border-0"
                >
                  {rewardStats.currentLevel}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 hover:from-purple-100 hover:to-purple-200/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-700">12</div>
                  <div className="text-sm text-purple-600/80">Students Mentored</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-teal-50 to-teal-100/50 hover:from-teal-100 hover:to-teal-200/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-teal-700">28</div>
                  <div className="text-sm text-teal-600/80">Questions Answered</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-700">5</div>
                  <div className="text-sm text-blue-600/80">Events Hosted</div>
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
                  <div className="text-2xl font-bold text-orange-700">{rewardStats.totalPoints}</div>
                  <div className="text-sm text-orange-600/80">Reward Points</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50/30">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    Mentorship Requests
                  </CardTitle>
                  <CardDescription className="mt-2">Students seeking your guidance</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="hover:bg-purple-100 text-purple-600">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mentorshipRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-5 rounded-xl border-0 bg-white/80 hover:bg-white hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12 ring-2 ring-purple-100 hover:ring-purple-200 transition-all duration-300">
                      <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.student} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                        {request.student
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{request.student}</h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {request.timeAgo}
                        </div>
                      </div>
                      <p className="text-sm font-medium text-purple-600 mb-2">{request.topic}</p>
                      <p className="text-xs text-gray-600 mb-3 text-pretty">{request.message}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                            Class of {request.year}
                          </Badge>
                          {request.skills.slice(0, 2).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8 text-xs hover:bg-gray-100 bg-transparent">
                            Decline
                          </Button>
                          <Button
                            size="sm"
                            className="h-8 text-xs bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white shadow-md"
                          >
                            Accept
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-teal-50/30">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    Recent Q&A
                  </CardTitle>
                  <CardDescription className="mt-2">Questions from the community</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="hover:bg-teal-100 text-teal-600">
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
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-sm text-pretty flex-1 text-gray-900">{question.title}</h4>
                    {question.hasAnswered && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 ml-2" />}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>by {question.author}</span>
                    <span>{question.timeAgo}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-xs">
                      <span className="flex items-center gap-1 text-teal-600">
                        <MessageSquare className="w-3 h-3" />
                        {question.answers} answers
                      </span>
                      <span className="flex items-center gap-1 text-purple-600">
                        <TrendingUp className="w-3 h-3" />
                        {question.upvotes} upvotes
                      </span>
                    </div>
                    {!question.hasAnswered && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs hover:bg-teal-100 text-teal-600 border-teal-200 bg-transparent"
                      >
                        Answer
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-orange-50/30">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Gift className="w-4 h-4 text-white" />
                </div>
                Rewards & Achievements
              </CardTitle>
              <CardDescription className="mt-2">Track your contribution and earn rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">Progress to {rewardStats.nextLevel}</div>
                    <div className="text-sm text-gray-600">{rewardStats.pointsToNext} points needed</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
                      {rewardStats.totalPoints}
                    </div>
                    <div className="text-sm text-gray-600">Total Points</div>
                  </div>
                </div>
                <Progress
                  value={(rewardStats.totalPoints / (rewardStats.totalPoints + rewardStats.pointsToNext)) * 100}
                  className="h-3 bg-gray-200"
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {rewardStats.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl text-center transition-all duration-300 ${
                        achievement.earned
                          ? "bg-gradient-to-br from-orange-100 to-purple-100 border-0 shadow-md hover:shadow-lg"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      <div className="text-3xl mb-2">{achievement.icon}</div>
                      <div
                        className={`text-xs font-medium ${achievement.earned ? "text-orange-700" : "text-gray-500"}`}
                      >
                        {achievement.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                Upcoming Events
              </CardTitle>
              <CardDescription className="mt-2">Events you're attending or hosting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-xl border-0 bg-white/80 hover:bg-white hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-sm text-pretty text-gray-900">{event.title}</h4>
                    {event.isHosting && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 border-0"
                      >
                        Hosting
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 mb-3">
                    {event.date} • {event.time}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{event.attendees} attending</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs hover:bg-blue-100 text-blue-600 border-blue-200 bg-transparent"
                    >
                      {event.isHosting ? "Manage" : "View"}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  GraduationCap,
  Users,
  Award,
  BarChart3,
  ArrowRight,
  Sparkles,
  Target,
  MessageCircle,
  Calendar,
} from "lucide-react"
import { getUser } from "@/lib/auth"

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState(null)

  const handlePortalClick = useCallback((role) => {
    const user = getUser()
    if (!user) {
      window.location.href = `/login?role=${role}`
      return
    }
    if (user.user_type !== role) {
      // Send user to their dashboard
      window.location.href = `/${user.user_type}`
      return
    }
    window.location.href = `/${role}`
  }, [])

  if (selectedRole) {
    // Redirect to appropriate dashboard
    setTimeout(() => {
      window.location.href = `/${selectedRole}`
    }, 500)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto animate-pulse">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Redirecting to {selectedRole} portal...</h2>
          <p className="text-muted-foreground">Please wait while we prepare your dashboard</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        <div className="relative container mx-auto px-4 py-32">
          <div className="text-center max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <GraduationCap className="w-9 h-9 text-white" />
              </div>
              <div className="text-white/90 text-lg font-medium">AlumniConnect</div>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 text-balance leading-tight">
              Connect. Engage.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Grow</span>{" "}
              with Alumni.
            </h1>

            <p className="text-xl md:text-2xl text-white/80 mb-12 text-pretty max-w-3xl mx-auto leading-relaxed">
              A centralized platform for alumni–student networking, mentorship, and opportunities.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-white/90 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm bg-transparent"
              >
                Learn More
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-white/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-lg">Connect with Alumni</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-lg">Share Experiences</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span className="text-lg">Track Engagement</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-balance">Platform Features</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Discover the powerful tools that make alumni-student connections meaningful and impactful
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group border-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-950/50">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold">Student Mentorship</CardTitle>
            </CardHeader>
            <CardContent className="relative text-center">
              <p className="text-muted-foreground">Connect with experienced alumni for guidance and career advice</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group border-0 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950/50 dark:to-pink-950/50">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold">Alumni Engagement</CardTitle>
            </CardHeader>
            <CardContent className="relative text-center">
              <p className="text-muted-foreground">Share experiences and give back to the student community</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group border-0 bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-950/50 dark:to-cyan-950/50">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold">Admin Tools</CardTitle>
            </CardHeader>
            <CardContent className="relative text-center">
              <p className="text-muted-foreground">Comprehensive management and analytics for platform oversight</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group border-0 bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-950/50 dark:to-red-950/50">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold">Event Management</CardTitle>
            </CardHeader>
            <CardContent className="relative text-center">
              <p className="text-muted-foreground">Organize and participate in networking events and workshops</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-balance">Choose Your Portal</h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Select your role to access the appropriate dashboard and features
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Student Portal */}
            <Card
              className="relative overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer group border-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 hover:-translate-y-2"
              onClick={() => handlePortalClick("student")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">Student Portal</CardTitle>
                <CardDescription className="text-base">
                  Connect with alumni, ask questions, and find mentorship opportunities
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    >
                      Find Alumni
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    >
                      Q&A Forum
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    >
                      1:1 Mentorship
                    </Badge>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Enter Student Portal
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Alumni Portal */}
            <Card
              className="relative overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer group border-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 hover:-translate-y-2"
              onClick={() => handlePortalClick("alumni")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">Alumni Portal</CardTitle>
                <CardDescription className="text-base">
                  Share your experience, mentor students, and engage with the community
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                    >
                      Share Experience
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                    >
                      Mentor Students
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                    >
                      Earn Rewards
                    </Badge>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Enter Alumni Portal
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Admin Portal */}
            <Card
              className="relative overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer group border-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 hover:-translate-y-2"
              onClick={() => handlePortalClick("admin")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
                <CardDescription className="text-base">
                  Manage alumni directory, verify accounts, and track platform analytics
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className="bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300"
                    >
                      Alumni Directory
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className="bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300"
                    >
                      Verification
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className="bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300"
                    >
                      Analytics
                    </Badge>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Enter Admin Portal
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold">AlumniConnect</span>
            </div>
            <div className="flex items-center gap-8">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                About
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Privacy
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AlumniConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, X, Award, Users, MessageSquare, Calendar } from "lucide-react"

export default function AlumniProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  // If opened from first-time login, enable edit mode and show a callout
  const isFirst = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("first") === "1"
  
  if (isFirst && !isEditing) {
    // enable editing by default on first open
    // Note: This runs during render; set state in effect to avoid hydration mismatch
    setTimeout(() => setIsEditing(true), 0)
  }

  const markCompleted = () => {
    try {
      const uRaw = typeof window !== "undefined" ? window.localStorage.getItem("auth_user") : null
      if (uRaw) {
        const u = JSON.parse(uRaw)
        window.localStorage.setItem(`alumni_profile_completed_${u.id}`, "1")
      }
    } catch {}
  }
  const [skills, setSkills] = useState(["React", "Python", "Machine Learning", "System Design", "Leadership"])
  const [expertise, setExpertise] = useState(["Software Engineering", "Technical Interviews", "Career Guidance"])
  const [newSkill, setNewSkill] = useState("")
  const [newExpertise, setNewExpertise] = useState("")
  const [mentorshipAvailable, setMentorshipAvailable] = useState(true)

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim()) && skills.length < 10) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const addExpertise = () => {
    if (newExpertise.trim() && !expertise.includes(newExpertise.trim()) && expertise.length < 8) {
      setExpertise([...expertise, newExpertise.trim()])
      setNewExpertise("")
    }
  }

  const removeExpertise = (expertiseToRemove) => {
    setExpertise(expertise.filter((exp) => exp !== expertiseToRemove))
  }

  return (
    <DashboardLayout userRole="alumni" title="My Profile">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Summary */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src="/professional-woman-diverse.png" alt="Profile" />
                  <AvatarFallback className="text-2xl">SC</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">Sarah Chen</h3>
                <p className="text-sm text-muted-foreground mb-1">Senior Software Engineer</p>
                <p className="text-sm text-muted-foreground mb-3">Google • Class of 2020</p>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <Badge variant="secondary">Gold Mentor</Badge>
                  <Badge variant="outline">Verified</Badge>
                </div>

                {isEditing && (
                  <Button variant="outline" size="sm" className="bg-transparent">
                    Change Photo
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Impact Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    Students Mentored
                  </span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <MessageSquare className="w-4 h-4" />
                    Questions Answered
                  </span>
                  <span className="font-medium">28</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Events Hosted
                  </span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Award className="w-4 h-4" />
                    Reward Points
                  </span>
                  <span className="font-medium">1,250</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Mentorship Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Available for Mentorship</div>
                    <div className="text-xs text-muted-foreground">Students can send you requests</div>
                  </div>
                  <Switch
                    checked={mentorshipAvailable}
                    onCheckedChange={setMentorshipAvailable}
                    disabled={!isEditing}
                  />
                </div>

                {isEditing && (
                  <div className="space-y-2">
                    <Label htmlFor="maxMentees" className="text-sm">
                      Max Active Mentees
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="3" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Professional Information</CardTitle>
                    <CardDescription>Your current role and professional details</CardDescription>
                  </div>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => {
                      if (isEditing) {
                        markCompleted()
                      }
                      setIsEditing(!isEditing)
                    }}
                  >
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isFirst && (
                  <div className="p-3 rounded-md bg-blue-50 text-blue-700 text-sm">
                    Welcome! Please complete your profile so students can find and connect with you.
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      defaultValue="Sarah"
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      defaultValue="Chen"
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="sarah.chen@google.com"
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      defaultValue="Google"
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      defaultValue="Senior Software Engineer"
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Select disabled={!isEditing}>
                      <SelectTrigger className={!isEditing ? "bg-muted" : ""}>
                        <SelectValue placeholder="4 years" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 year</SelectItem>
                        <SelectItem value="2">2 years</SelectItem>
                        <SelectItem value="3">3 years</SelectItem>
                        <SelectItem value="4">4 years</SelectItem>
                        <SelectItem value="5+">5+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      defaultValue="Mountain View, CA"
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn Profile</Label>
                  <Input
                    id="linkedin"
                    defaultValue="https://linkedin.com/in/sarahchen"
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell students about your journey, expertise, and what you can help with..."
                    defaultValue="Senior Software Engineer at Google with 4+ years of experience in building scalable web applications. Passionate about machine learning, system design, and mentoring the next generation of engineers. I love helping students navigate their career paths and prepare for technical interviews."
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Technical Skills</CardTitle>
                <CardDescription>Technologies and tools you work with</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-sm">
                        {skill}
                        {isEditing && (
                          <button onClick={() => removeSkill(skill)} className="ml-2 hover:text-destructive">
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>

                  {isEditing && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a skill..."
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addSkill()}
                      />
                      <Button onClick={addSkill} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Mentorship Expertise */}
            <Card>
              <CardHeader>
                <CardTitle>Mentorship Expertise</CardTitle>
                <CardDescription>Areas where you can provide guidance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {expertise.map((exp) => (
                      <Badge key={exp} variant="outline" className="text-sm">
                        {exp}
                        {isEditing && (
                          <button onClick={() => removeExpertise(exp)} className="ml-2 hover:text-destructive">
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>

                  {isEditing && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add expertise area..."
                        value={newExpertise}
                        onChange={(e) => setNewExpertise(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addExpertise()}
                      />
                      <Button onClick={addExpertise} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

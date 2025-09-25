"use client"

import { useEffect, useState } from "react"
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
import { getToken } from "@/lib/auth"
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"

export default function AlumniProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [profile, setProfile] = useState(null)
  // Track first-time flag after hydration to avoid SSR/CSR mismatch
  const [showFirstCallout, setShowFirstCallout] = useState(false)
  useEffect(() => {
    if (typeof window === "undefined") return
    const isFirst = new URLSearchParams(window.location.search).get("first") === "1"
    setShowFirstCallout(isFirst)
    if (isFirst) setIsEditing(true)
  }, [])

  const markCompleted = () => {
    try {
      const uRaw = typeof window !== "undefined" ? window.localStorage.getItem("auth_user") : null
      if (uRaw) {
        const u = JSON.parse(uRaw)
        window.localStorage.setItem(`alumni_profile_completed_${u.id}`, "1")
      }
    } catch {}
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError("")
      try {
        const token = getToken()
        const res = await fetch(`${API_BASE}/api/auth/profile`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.detail || "Failed to load profile")
        const u = data?.data?.user || {}
        setProfile(u)
        const nm = u.full_name || (u.email ? u.email.split("@")[0] : "")
        setFullName(nm)
        const parts = String(nm).trim().split(" ")
        setFirstName(parts[0] || "")
        setLastName(parts.slice(1).join(" "))
        setEmail(u.email || "")
        setCompany(u.current_company || "")
        setRoleTitle(u.current_position || "")
        setLocation(u.location || "")
        setLinkedin(u.linkedin_profile || "")
        setBio(u.bio || "")
        setCgpa(u.cgpa || "")
        setSkills(Array.isArray(u.skills) ? u.skills : [])
        setExpertise(Array.isArray(u.expertise) ? u.expertise : [])
        setMentorshipAvailable(Boolean(u.mentorship_available ?? true))
      } catch (e) {
        setError(e?.message || "Failed to load profile")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const saveProfile = async () => {
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/api/auth/profile/alumni`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          full_name: (firstName + " " + lastName).trim() || fullName,
          current_company: company,
          current_position: roleTitle,
          linkedin_profile: linkedin,
          cgpa: cgpa,
          department: profile?.department,
          graduation_year: profile?.graduation_year,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.detail || data?.message || "Failed to update")
    } catch (e) {
      setError(e?.message || "Failed to save profile")
      return false
    }
    return true
  }
  const [skills, setSkills] = useState([])
  const [expertise, setExpertise] = useState([])
  const [newSkill, setNewSkill] = useState("")
  const [newExpertise, setNewExpertise] = useState("")
  const [mentorshipAvailable, setMentorshipAvailable] = useState(true)

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [roleTitle, setRoleTitle] = useState("")
  const [location, setLocation] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [bio, setBio] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [cgpa, setCgpa] = useState("")

  useEffect(() => {
    setFullName(firstName + " " + lastName)
  }, [firstName, lastName])

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
                  <AvatarFallback className="text-2xl">
                    {fullName ? fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'A'}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{fullName || "Alumni"}</h3>
                <p className="text-sm text-muted-foreground mb-1">{roleTitle || ""}</p>
                <p className="text-sm text-muted-foreground mb-3">{company || ""}{profile?.graduation_year ? ` • Class of ${profile.graduation_year}` : ""}</p>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <Badge variant="secondary">Gold Mentor</Badge>
                  <Badge variant="outline">Verified</Badge>
                </div>

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
                        saveProfile().then((ok) => {
                          if (ok) markCompleted()
                        })
                      }
                      setIsEditing((v) => !v)
                    }}
                  >
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {showFirstCallout && (
                  <div className="p-3 rounded-md bg-blue-50 text-blue-700 text-sm">
                    Welcome! Please complete your profile so students can find and connect with you.
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={!isEditing} className={!isEditing ? "bg-muted" : ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={!isEditing} className={!isEditing ? "bg-muted" : ""} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isEditing} className={!isEditing ? "bg-muted" : ""} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} disabled={!isEditing} className={!isEditing ? "bg-muted" : ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} disabled={!isEditing} className={!isEditing ? "bg-muted" : ""} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <Label htmlFor="cgpa">CGPA</Label>
                    <Input 
                      id="cgpa" 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      max="10" 
                      placeholder="8.5" 
                      value={cgpa} 
                      onChange={(e) => setCgpa(e.target.value)} 
                      disabled={!isEditing} 
                      className={!isEditing ? "bg-muted" : ""} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} disabled={!isEditing} className={!isEditing ? "bg-muted" : ""} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn Profile</Label>
                  <Input id="linkedin" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} disabled={!isEditing} className={!isEditing ? "bg-muted" : ""} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea id="bio" placeholder="Tell students about your journey, expertise, and what you can help with..." value={bio} onChange={(e) => setBio(e.target.value)} disabled={!isEditing} className={!isEditing ? "bg-muted" : ""} rows={4} />
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

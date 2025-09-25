"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { registerAdmin, registerStudent } from "@/lib/auth"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAdmin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const form = new FormData(e.currentTarget)
    try {
      await registerAdmin({
        email: String(form.get("email")),
        password: String(form.get("password")),
        full_name: String(form.get("full_name")),
        phone: String(form.get("phone") || ""),
        department: String(form.get("department") || ""),
      })
      router.replace("/login")
    } catch (err) {
      setError(err?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const handleStudent = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const form = new FormData(e.currentTarget)
    try {
      await registerStudent({
        email: String(form.get("email")),
        password: String(form.get("password")),
        full_name: String(form.get("full_name")),
        student_id: String(form.get("student_id")),
        phone: String(form.get("phone") || ""),
        department: String(form.get("department") || ""),
        graduation_year: String(form.get("graduation_year") || ""),
        current_semester: Number(form.get("current_semester") || 0),
      })
      router.replace("/login")
    } catch (err) {
      setError(err?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="relative max-w-6xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-10 items-center">
        <div className="text-white/90">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-9 h-9"><path fill="currentColor" d="M12 3L1 9l11 6l9-4.91V17h2V9z"/></svg>
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-4">Create your AlumniConnect account</h1>
          <p className="text-white/80 text-lg max-w-xl">Admins and students can register below. Alumni are created by admins and can log in directly.</p>
        </div>
        <Card className="w-full max-w-2xl ml-auto border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Register</CardTitle>
            <CardDescription>Create an admin or student account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student">
              <TabsList>
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>

              <TabsContent value="student">
                <form onSubmit={handleStudent} className="grid gap-3 mt-4">
                  <Input name="full_name" placeholder="Full name" />
                  <Input name="email" type="email" placeholder="Email" />
                  <Input name="password" type="password" placeholder="Password (min 8 chars)" />
                  <Input name="student_id" placeholder="Student ID" />
                  <Input name="phone" placeholder="Phone (optional)" />
                  <Input name="department" placeholder="Department (optional)" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input name="graduation_year" placeholder="Graduation year" />
                    <Input name="current_semester" type="number" placeholder="Semester" />
                  </div>
                  {error && <div className="text-sm text-red-600">{error}</div>}
                  <Button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                    {loading ? "Creating..." : "Create Student Account"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="admin">
                <form onSubmit={handleAdmin} className="grid gap-3 mt-4">
                  <Input name="full_name" placeholder="Full name" />
                  <Input name="email" type="email" placeholder="Email" />
                  <Input name="password" type="password" placeholder="Password (min 8 chars)" />
                  <Input name="phone" placeholder="Phone (optional)" />
                  <Input name="department" placeholder="Department (optional)" />
                  {error && <div className="text-sm text-red-600">{error}</div>}
                  <Button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                    {loading ? "Creating..." : "Create Admin Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



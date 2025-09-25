"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { login, setAuth, getUser } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("student")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Preselect role from query param if provided
    if (typeof window === "undefined") return
    const url = new URL(window.location.href)
    const qRole = url.searchParams.get("role")
    if (qRole && ["student", "admin", "alumni"].includes(qRole)) {
      setRole(qRole)
    }
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login({ email, password, user_type: role })
      const user = getUser()
      if (!user) throw new Error("No user in response")
      if (user.user_type === "admin") router.replace("/admin")
      else if (user.user_type === "student") router.replace("/student")
      else if (user.user_type === "alumni") {
        const completed = typeof window !== "undefined" && window.localStorage.getItem(`alumni_profile_completed_${user.id}`)
        router.replace(completed ? "/alumni" : "/alumni/profile?first=1")
      }
      else router.replace("/")
    } catch (err) {
      const msg = err?.message || "Login failed"
      setError(msg)
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
          <h1 className="text-5xl font-bold leading-tight mb-4">Welcome back to AlumniConnect</h1>
          <p className="text-white/80 text-lg max-w-xl">Sign in to continue to your dashboard. Connect, mentor, and grow with a community that shares your journey.</p>
        </div>
        <Card className="w-full max-w-md ml-auto border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid gap-4">
              <div>
                <label className="text-sm mb-1 block">Role</label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="alumni">Alumni</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              {error && <div className="text-sm text-red-600">{error}</div>}
              <Button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                {loading ? "Signing in..." : "Sign in"}
              </Button>
              <div className="text-xs text-muted-foreground">
                New admin or student? <a className="underline" href="/register">Create an account</a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



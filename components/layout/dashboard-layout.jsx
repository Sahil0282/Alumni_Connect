"use client"

import React from "react"

import { Sidebar } from "@/components/navigation/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Search, User } from "lucide-react"
import { getUser, logout } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function DashboardLayout({ children, userRole, title }) {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const u = getUser()
    if (!u) {
      router.replace("/login")
      return
    }
    setUser(u)
    if (userRole && u.user_type !== userRole) {
      // Redirect to the correct dashboard if role mismatch
      if (u.user_type === "admin") router.replace("/admin")
      else if (u.user_type === "student") router.replace("/student")
      else if (u.user_type === "alumni") router.replace("/alumni")
    }
  }, [router, userRole])

  const handleLogout = () => {
    logout()
    router.replace("/login")
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={userRole} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <Card className="border-b rounded-none bg-card">
          <div className="flex items-center justify-between p-4">
            <div>{title && <h1 className="text-2xl font-semibold text-balance">{title}</h1>}</div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <Bell className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm">{user?.email}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}

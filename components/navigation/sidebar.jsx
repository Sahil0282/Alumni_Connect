"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  GraduationCap,
  MessageSquare,
  Calendar,
  Settings,
  BarChart3,
  UserCheck,
  Award,
  Menu,
  X,
  Home,
  Search,
  Bell,
  Bot,
  MessageCircle,
  FileText,
  HandCoins,
} from "lucide-react"

const navigationItems = {
  student: [
    { name: "Dashboard", href: "/student", icon: Home },
    { name: "Find Alumni", href: "/student/alumni", icon: Search },
    { name: "Messaging", href: "/student/messaging", icon: MessageCircle },
    { name: "Q&A Forum", href: "/student/forum", icon: MessageSquare },
    { name: "Mentorship", href: "/student/mentorship", icon: Users },
    { name: "Events", href: "/student/events", icon: Calendar },
    { name: "Summarizer", href: "/student/summarizer", icon: FileText },
    { name: "AI Assistant", href: "/student/chatbot", icon: Bot },
    { name: "Profile", href: "/student/profile", icon: Settings },
  ],
  alumni: [
    { name: "Dashboard", href: "/alumni", icon: Home },
    { name: "Messaging", href: "/alumni/messaging", icon: MessageCircle },
    { name: "Mentorship Requests", href: "/alumni/mentorship", icon: Users },
    { name: "Q&A Forum", href: "/alumni/forum", icon: MessageSquare },
    { name: "Share Experience", href: "/alumni/experience", icon: Award },
    { name: "Events", href: "/alumni/events", icon: Calendar },
    { name: "Profile", href: "/alumni/profile", icon: Settings },
  ],
  admin: [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Alumni Directory", href: "/admin/directory", icon: Users },
    { name: "Verification", href: "/admin/verification", icon: UserCheck },
    { name: "Event Management", href: "/admin/events", icon: Calendar },
    { name: "Fundraising", href: "/admin/fundraising", icon: HandCoins },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Announcements", href: "/admin/announcements", icon: Bell },
  ],
}

export function Sidebar({ userRole }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const items = navigationItems[userRole]

  return (
    <Card className={cn("h-screen border-r bg-card transition-all duration-300", isCollapsed ? "w-16" : "w-64")}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-sm">AlumniConnect</h2>
                <Badge variant="secondary" className="text-xs capitalize">
                  {userRole}
                </Badge>
              </div>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8 p-0">
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn("w-full justify-start gap-3 h-10", isCollapsed && "px-2")}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && <span className="text-sm">{item.name}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t">
            <div className="text-xs text-muted-foreground text-center">© 2024 AlumniConnect</div>
          </div>
        )}
      </div>
    </Card>
  )
}

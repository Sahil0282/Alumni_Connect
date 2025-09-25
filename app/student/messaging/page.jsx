"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  MessageSquare, 
  Send, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Paperclip,
  Smile,
  Clock,
  Check,
  CheckCheck
} from "lucide-react"
import { useState, useEffect } from "react"
import { getToken } from "@/lib/auth"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"

export default function StudentMessaging() {
  const [selectedChat, setSelectedChat] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true)
      setError("")
      try {
        const token = getToken()
        const res = await fetch(`${API_BASE}/api/connections/conversations`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.detail || "Failed to load conversations")
        setConversations(data || [])
        if (data && data.length > 0) {
          setSelectedChat(data[0].id)
        }
      } catch (e) {
        setError(e?.message || "Failed to load conversations")
      } finally {
        setLoading(false)
      }
    }
    loadConversations()
  }, [])

  useEffect(() => {
    if (selectedChat) {
      const loadMessages = async () => {
        try {
          const token = getToken()
          const res = await fetch(`${API_BASE}/api/connections/messages/${selectedChat}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data?.detail || "Failed to load messages")
          setMessages(data || [])
        } catch (e) {
          setError(e?.message || "Failed to load messages")
        }
      }
      loadMessages()
    }
  }, [selectedChat])

  const hardcodedConversations = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      lastMessage: "Sure! I'd be happy to help you with your technical interview preparation.",
      time: "2 min ago",
      unread: 2,
      avatar: "/professional-woman-diverse.png",
      online: true,
      messages: [
        {
          id: 1,
          sender: "student",
          content: "Hi Sarah! I saw your profile and I'm really interested in learning about your journey at Google.",
          time: "10:30 AM",
          status: "read"
        },
        {
          id: 2,
          sender: "alumni",
          content: "Hello! I'd be happy to share my experience. What specific aspects are you most curious about?",
          time: "10:32 AM",
          status: "read"
        },
        {
          id: 3,
          sender: "student",
          content: "I'm particularly interested in how you prepared for technical interviews and what skills were most important.",
          time: "10:35 AM",
          status: "read"
        },
        {
          id: 4,
          sender: "alumni",
          content: "Great question! For technical interviews, I focused heavily on data structures and algorithms. LeetCode was my best friend!",
          time: "10:37 AM",
          status: "read"
        },
        {
          id: 5,
          sender: "alumni",
          content: "Sure! I'd be happy to help you with your technical interview preparation.",
          time: "2 min ago",
          status: "delivered"
        }
      ]
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      role: "Product Manager at Microsoft",
      lastMessage: "The key is to understand user needs deeply before jumping into solutions.",
      time: "1 hour ago",
      unread: 0,
      avatar: "/professional-man.png",
      online: false,
      messages: [
        {
          id: 1,
          sender: "student",
          content: "Hi Michael! I'm considering a transition to product management. Any advice?",
          time: "9:15 AM",
          status: "read"
        },
        {
          id: 2,
          sender: "alumni",
          content: "Absolutely! The key is to understand user needs deeply before jumping into solutions.",
          time: "1 hour ago",
          status: "read"
        }
      ]
    },
    {
      id: 3,
      name: "Emily Johnson",
      role: "UX Designer at Amazon",
      lastMessage: "I'll send you some portfolio examples that really stand out.",
      time: "3 hours ago",
      unread: 0,
      avatar: "/professional-woman-designer.png",
      online: true,
      messages: [
        {
          id: 1,
          sender: "student",
          content: "Hi Emily! I'm working on my UX portfolio. Any tips?",
          time: "8:00 AM",
          status: "read"
        },
        {
          id: 2,
          sender: "alumni",
          content: "I'll send you some portfolio examples that really stand out.",
          time: "3 hours ago",
          status: "read"
        }
      ]
    }
  ]

  const selectedConversation = conversations.find(conv => conv.id === selectedChat)

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedChat) {
      try {
        const token = getToken()
        const res = await fetch(`${API_BASE}/api/connections/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            receiver_id: selectedChat,
            content: newMessage,
            message_type: "text"
          }),
        })
        
        const data = await res.json()
        if (!res.ok) throw new Error(data?.detail || "Failed to send message")
        
        // Add message to local state
        setMessages(prev => [...prev, data])
        setNewMessage("")
      } catch (e) {
        setError(e?.message || "Failed to send message")
      }
    }
  }

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return <Check className="w-3 h-3 text-gray-400" />
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-gray-400" />
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-500" />
      default:
        return <Clock className="w-3 h-3 text-gray-400" />
    }
  }

  return (
    <DashboardLayout userRole="student" title="Messaging">
      <div className="flex h-[calc(100vh-4rem)] bg-white rounded-lg border shadow-sm">
        {/* Conversations List */}
        <div className="w-1/3 border-r flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Messages</h2>
              <Button size="sm" variant="outline">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
            <Input placeholder="Search conversations..." className="w-full" />
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {loading && (
                <div className="p-4 text-center text-muted-foreground">
                  Loading conversations...
                </div>
              )}
              
              {error && (
                <div className="p-4 text-center text-red-600">
                  {error}
                </div>
              )}
              
              {!loading && !error && conversations.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No conversations yet</p>
                  <p className="text-sm">Connect with alumni to start messaging</p>
                </div>
              )}
              
              {!loading && !error && conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedChat(conversation.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedChat === conversation.id
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {conversation.last_message?.sender_name?.split(" ").map(n => n[0]).join("") || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm truncate">
                          {conversation.last_message?.sender_name || "Unknown"}
                        </h3>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">
                            {conversation.last_message ? new Date(conversation.last_message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                          </span>
                          {conversation.unread_count > 0 && (
                            <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                              {conversation.unread_count}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 truncate mt-1">Alumni</p>
                      <p className="text-sm text-gray-700 truncate mt-1">
                        {conversation.last_message?.content || "No messages yet"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {selectedConversation?.last_message?.sender_name?.split(" ").map(n => n[0]).join("") || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedConversation?.last_message?.sender_name || "Unknown"}</h3>
                      <p className="text-sm text-gray-600">Alumni</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === selectedChat ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          message.sender_id === selectedChat
                            ? "bg-gray-100 text-gray-900"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-xs opacity-70">
                            {new Date(message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                          {message.sender_id !== selectedChat && getMessageStatusIcon(message.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t bg-white">
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="min-h-[40px] max-h-32 resize-none pr-12"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button size="sm" variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2">
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p className="text-sm">Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

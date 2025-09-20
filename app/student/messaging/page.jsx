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
import { useState } from "react"

export default function StudentMessaging() {
  const [selectedChat, setSelectedChat] = useState(1)
  const [newMessage, setNewMessage] = useState("")

  const conversations = [
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

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend
      console.log("Sending message:", newMessage)
      setNewMessage("")
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
              {conversations.map((conversation) => (
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
                        <AvatarImage src={conversation.avatar} alt={conversation.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {conversation.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm truncate">{conversation.name}</h3>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">{conversation.time}</span>
                          {conversation.unread > 0 && (
                            <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 truncate mt-1">{conversation.role}</p>
                      <p className="text-sm text-gray-700 truncate mt-1">{conversation.lastMessage}</p>
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
                        <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {selectedConversation.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      {selectedConversation.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedConversation.name}</h3>
                      <p className="text-sm text-gray-600">{selectedConversation.role}</p>
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
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "student" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          message.sender === "student"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-xs opacity-70">{message.time}</span>
                          {message.sender === "student" && getMessageStatusIcon(message.status)}
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

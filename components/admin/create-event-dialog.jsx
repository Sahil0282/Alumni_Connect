"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { getToken } from "@/lib/auth"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"

const EVENT_CATEGORIES = [
  { value: "tech-talk", label: "Tech Talk" },
  { value: "career", label: "Career" },
  { value: "networking", label: "Networking" },
  { value: "workshop", label: "Workshop" },
  { value: "competition", label: "Competition" },
  { value: "conference", label: "Conference" },
  { value: "social", label: "Social" },
]

const EVENT_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
]

export function CreateEventDialog({ isOpen, onClose, onSuccess, editingEvent = null }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    end_time: "",
    location: "",
    category: "",
    max_attendees: 100,
    price: "Free",
    registration_deadline: "",
    featured: false,
    tags: "",
    image_url: "",
    organizer_name: "",
    organizer_email: "",
    organizer_company: "",
    requirements: "",
    agenda: "",
    status: "draft"
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title || "",
        description: editingEvent.description || "",
        date: editingEvent.date || "",
        time: editingEvent.time || "",
        end_time: editingEvent.end_time || "",
        location: editingEvent.location || "",
        category: editingEvent.category || "",
        max_attendees: editingEvent.max_attendees || 100,
        price: editingEvent.price || "Free",
        registration_deadline: editingEvent.registration_deadline || "",
        featured: editingEvent.featured || false,
        tags: (editingEvent.tags || []).join(", "),
        image_url: editingEvent.image_url || "",
        organizer_name: editingEvent.organizer_name || "",
        organizer_email: editingEvent.organizer_email || "",
        organizer_company: editingEvent.organizer_company || "",
        requirements: editingEvent.requirements || "",
        agenda: editingEvent.agenda || "",
        status: editingEvent.status || "draft"
      })
    } else {
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        end_time: "",
        location: "",
        category: "",
        max_attendees: 100,
        price: "Free",
        registration_deadline: "",
        featured: false,
        tags: "",
        image_url: "",
        organizer_name: "",
        organizer_email: "",
        organizer_company: "",
        requirements: "",
        agenda: "",
        status: "draft"
      })
    }
  }, [editingEvent, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const token = getToken()
      const payload = {
        ...formData,
        tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag) : [],
        max_attendees: parseInt(formData.max_attendees)
      }

      const url = editingEvent 
        ? `${API_BASE}/api/events/${editingEvent.id}`
        : `${API_BASE}/api/events/`
      
      const method = editingEvent ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.detail || `Failed to ${editingEvent ? 'update' : 'create'} event`)

      onSuccess()
      onClose()
    } catch (e) {
      setError(e?.message || `Failed to ${editingEvent ? 'update' : 'create'} event`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingEvent ? "Edit Event" : "Create New Event"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter event title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter event description"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Start Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => handleChange("end_time", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="Enter event location"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_attendees">Max Attendees *</Label>
              <Input
                id="max_attendees"
                type="number"
                min="1"
                value={formData.max_attendees}
                onChange={(e) => handleChange("max_attendees", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="e.g., Free, $25, $50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="registration_deadline">Registration Deadline</Label>
            <Input
              id="registration_deadline"
              type="date"
              value={formData.registration_deadline}
              onChange={(e) => handleChange("registration_deadline", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
              placeholder="e.g., AI, Healthcare, Technology"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => handleChange("image_url", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Organizer Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organizer_name">Organizer Name *</Label>
                <Input
                  id="organizer_name"
                  value={formData.organizer_name}
                  onChange={(e) => handleChange("organizer_name", e.target.value)}
                  placeholder="Enter organizer name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizer_email">Organizer Email</Label>
                <Input
                  id="organizer_email"
                  type="email"
                  value={formData.organizer_email}
                  onChange={(e) => handleChange("organizer_email", e.target.value)}
                  placeholder="organizer@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizer_company">Organizer Company</Label>
              <Input
                id="organizer_company"
                value={formData.organizer_company}
                onChange={(e) => handleChange("organizer_company", e.target.value)}
                placeholder="Enter company name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => handleChange("requirements", e.target.value)}
              placeholder="Any special requirements or prerequisites"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agenda">Agenda</Label>
            <Textarea
              id="agenda"
              value={formData.agenda}
              onChange={(e) => handleChange("agenda", e.target.value)}
              placeholder="Event agenda or schedule"
              rows={3}
            />
          </div>

          {editingEvent && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => handleChange("featured", checked)}
            />
            <Label htmlFor="featured">Featured Event</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : editingEvent ? "Update Event" : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

class EventStatus(str, Enum):
    DRAFT = "draft"
    UPCOMING = "upcoming"
    ONGOING = "ongoing"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class EventCategory(str, Enum):
    TECH_TALK = "tech-talk"
    CAREER = "career"
    NETWORKING = "networking"
    WORKSHOP = "workshop"
    COMPETITION = "competition"
    CONFERENCE = "conference"
    SOCIAL = "social"

class EventCreate(BaseModel):
    title: str
    description: str
    date: str  # YYYY-MM-DD format
    time: str  # HH:MM AM/PM format
    end_time: Optional[str] = None
    location: str
    category: EventCategory
    max_attendees: int
    price: str = "Free"
    registration_deadline: Optional[str] = None
    featured: bool = False
    tags: List[str] = []
    image_url: Optional[str] = None
    organizer_name: str
    organizer_email: Optional[EmailStr] = None
    organizer_company: Optional[str] = None
    requirements: Optional[str] = None
    agenda: Optional[str] = None

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    end_time: Optional[str] = None
    location: Optional[str] = None
    category: Optional[EventCategory] = None
    max_attendees: Optional[int] = None
    price: Optional[str] = None
    registration_deadline: Optional[str] = None
    featured: Optional[bool] = None
    tags: Optional[List[str]] = None
    image_url: Optional[str] = None
    organizer_name: Optional[str] = None
    organizer_email: Optional[EmailStr] = None
    organizer_company: Optional[str] = None
    requirements: Optional[str] = None
    agenda: Optional[str] = None
    status: Optional[EventStatus] = None

class EventResponse(BaseModel):
    id: str
    title: str
    description: str
    date: str
    time: str
    end_time: Optional[str] = None
    location: str
    category: EventCategory
    max_attendees: int
    current_attendees: int
    price: str
    registration_deadline: Optional[str] = None
    featured: bool
    tags: List[str]
    image_url: Optional[str] = None
    organizer_name: str
    organizer_email: Optional[str] = None
    organizer_company: Optional[str] = None
    requirements: Optional[str] = None
    agenda: Optional[str] = None
    status: EventStatus
    created_at: datetime
    updated_at: datetime
    created_by: str

class EventRegistration(BaseModel):
    event_id: str
    user_id: str
    user_name: str
    user_email: str
    registration_date: Optional[datetime] = None
    status: str = "registered"  # registered, cancelled, attended
    notes: Optional[str] = None

class EventRegistrationResponse(BaseModel):
    id: str
    event_id: str
    user_id: str
    user_name: str
    user_email: str
    registration_date: datetime
    status: str
    notes: Optional[str] = None

class EventStats(BaseModel):
    total_events: int
    upcoming_events: int
    completed_events: int
    total_registrations: int
    total_attendees: int
    events_by_category: dict
    events_by_status: dict

class EventListResponse(BaseModel):
    events: List[EventResponse]
    total: int
    page: int
    limit: int
    has_next: bool
    has_prev: bool

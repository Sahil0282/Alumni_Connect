from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

class ConnectionStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    DECLINED = "declined"
    BLOCKED = "blocked"

class MessageStatus(str, Enum):
    SENT = "sent"
    DELIVERED = "delivered"
    READ = "read"

class ConnectionRequest(BaseModel):
    student_id: str
    alumni_id: str
    message: Optional[str] = None
    topic: Optional[str] = None
    status: ConnectionStatus = ConnectionStatus.PENDING
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class ConnectionRequestCreate(BaseModel):
    alumni_id: str
    message: Optional[str] = None
    topic: Optional[str] = None

class ConnectionRequestResponse(BaseModel):
    id: str
    student_id: str
    alumni_id: str
    student_name: str
    alumni_name: str
    message: Optional[str] = None
    topic: Optional[str] = None
    status: ConnectionStatus
    created_at: datetime
    updated_at: datetime

class ConnectionRequestUpdate(BaseModel):
    status: ConnectionStatus

class Message(BaseModel):
    sender_id: str
    receiver_id: str
    content: str
    message_type: str = "text"  # text, image, file
    status: MessageStatus = MessageStatus.SENT
    created_at: Optional[datetime] = None
    read_at: Optional[datetime] = None

class MessageCreate(BaseModel):
    receiver_id: str
    content: str
    message_type: str = "text"

class MessageResponse(BaseModel):
    id: str
    sender_id: str
    receiver_id: str
    sender_name: str
    content: str
    message_type: str
    status: MessageStatus
    created_at: datetime
    read_at: Optional[datetime] = None

class Conversation(BaseModel):
    id: str
    participants: List[str]
    last_message: Optional[MessageResponse] = None
    unread_count: int = 0
    updated_at: datetime

class ConnectionStats(BaseModel):
    total_connections: int
    pending_requests: int
    active_mentorships: int
    messages_sent: int

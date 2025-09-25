from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Dict, Any
from datetime import datetime
from bson import ObjectId

from app.models.connection_models import (
    ConnectionRequestCreate,
    ConnectionRequestResponse,
    ConnectionRequestUpdate,
    MessageCreate,
    MessageResponse,
    Conversation,
    ConnectionStats,
    ConnectionStatus,
    MessageStatus
)
from app.core.database import get_database
from app.core.auth_service import get_current_user

router = APIRouter(prefix="/api/connections", tags=["Connections & Messaging"])

def get_connection_collection():
    db = get_database()
    return db["connections"]

def get_messages_collection():
    db = get_database()
    return db["messages"]

@router.post("/request", response_model=ConnectionRequestResponse)
async def send_connection_request(
    request: ConnectionRequestCreate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Send a connection request from student to alumni"""
    try:
        if current_user["user_type"] != "student":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only students can send connection requests"
            )
        
        db = get_database()
        connections = get_connection_collection()
        
        # Check if request already exists
        existing = connections.find_one({
            "student_id": current_user["user_id"],
            "alumni_id": request.alumni_id
        })
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Connection request already exists"
            )
        
        # Get student and alumni names
        students_collection = db["students"]
        alumni_collection = db["alumni"]
        
        student = students_collection.find_one({"_id": ObjectId(current_user["user_id"])})
        alumni = alumni_collection.find_one({"_id": ObjectId(request.alumni_id)})
        
        if not student or not alumni:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student or alumni not found"
            )
        
        # Create connection request
        connection_data = {
            "student_id": current_user["user_id"],
            "alumni_id": request.alumni_id,
            "message": request.message,
            "topic": request.topic,
            "status": ConnectionStatus.PENDING,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = connections.insert_one(connection_data)
        connection_data["_id"] = result.inserted_id
        
        return ConnectionRequestResponse(
            id=str(result.inserted_id),
            student_id=connection_data["student_id"],
            alumni_id=connection_data["alumni_id"],
            student_name=student.get("full_name", "Student"),
            alumni_name=alumni.get("full_name", "Alumni"),
            message=connection_data["message"],
            topic=connection_data["topic"],
            status=connection_data["status"],
            created_at=connection_data["created_at"],
            updated_at=connection_data["updated_at"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send connection request: {str(e)}"
        )

@router.get("/requests/pending", response_model=List[ConnectionRequestResponse])
async def get_pending_requests(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get pending connection requests for alumni"""
    try:
        if current_user["user_type"] != "alumni":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only alumni can view pending requests"
            )
        
        db = get_database()
        connections = get_connection_collection()
        students_collection = db["students"]
        
        # Get pending requests for this alumni
        requests = list(connections.find({
            "alumni_id": current_user["user_id"],
            "status": ConnectionStatus.PENDING
        }).sort("created_at", -1))
        
        # Enrich with student names
        result = []
        for req in requests:
            student = students_collection.find_one({"_id": ObjectId(req["student_id"])})
            result.append(ConnectionRequestResponse(
                id=str(req["_id"]),
                student_id=req["student_id"],
                alumni_id=req["alumni_id"],
                student_name=student.get("full_name", "Student") if student else "Unknown",
                alumni_name=current_user.get("full_name", "Alumni"),
                message=req.get("message"),
                topic=req.get("topic"),
                status=req["status"],
                created_at=req["created_at"],
                updated_at=req["updated_at"]
            ))
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get pending requests: {str(e)}"
        )

@router.put("/requests/{request_id}", response_model=ConnectionRequestResponse)
async def update_connection_request(
    request_id: str,
    update: ConnectionRequestUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Accept or decline a connection request"""
    try:
        if current_user["user_type"] != "alumni":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only alumni can respond to connection requests"
            )
        
        connections = get_connection_collection()
        
        # Find the request
        request_obj = connections.find_one({
            "_id": ObjectId(request_id),
            "alumni_id": current_user["user_id"]
        })
        
        if not request_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Connection request not found"
            )
        
        # Update the request
        connections.update_one(
            {"_id": ObjectId(request_id)},
            {
                "$set": {
                    "status": update.status,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        # Get updated request with names
        db = get_database()
        students_collection = db["students"]
        alumni_collection = db["alumni"]
        
        updated_request = connections.find_one({"_id": ObjectId(request_id)})
        student = students_collection.find_one({"_id": ObjectId(updated_request["student_id"])})
        alumni = alumni_collection.find_one({"_id": ObjectId(updated_request["alumni_id"])})
        
        return ConnectionRequestResponse(
            id=str(updated_request["_id"]),
            student_id=updated_request["student_id"],
            alumni_id=updated_request["alumni_id"],
            student_name=student.get("full_name", "Student") if student else "Unknown",
            alumni_name=alumni.get("full_name", "Alumni") if alumni else "Unknown",
            message=updated_request.get("message"),
            topic=updated_request.get("topic"),
            status=updated_request["status"],
            created_at=updated_request["created_at"],
            updated_at=updated_request["updated_at"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update connection request: {str(e)}"
        )

@router.get("/conversations", response_model=List[Conversation])
async def get_conversations(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get conversations for current user"""
    try:
        db = get_database()
        messages = get_messages_collection()
        users_collection = db["users"]
        
        # Get all conversations where user is a participant
        conversations = list(messages.aggregate([
            {
                "$match": {
                    "$or": [
                        {"sender_id": current_user["user_id"]},
                        {"receiver_id": current_user["user_id"]}
                    ]
                }
            },
            {
                "$sort": {"created_at": -1}
            },
            {
                "$group": {
                    "_id": {
                        "$cond": [
                            {"$eq": ["$sender_id", current_user["user_id"]]},
                            "$receiver_id",
                            "$sender_id"
                        ]
                    },
                    "last_message": {"$first": "$$ROOT"},
                    "unread_count": {
                        "$sum": {
                            "$cond": [
                                {
                                    "$and": [
                                        {"$ne": ["$receiver_id", current_user["user_id"]]},
                                        {"$ne": ["$status", "read"]}
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]))
        
        result = []
        for conv in conversations:
            other_user_id = conv["_id"]
            other_user = users_collection.find_one({"_id": ObjectId(other_user_id)})
            
            last_msg = conv["last_message"]
            result.append(Conversation(
                id=str(conv["_id"]),
                participants=[current_user["user_id"], other_user_id],
                last_message=MessageResponse(
                    id=str(last_msg["_id"]),
                    sender_id=last_msg["sender_id"],
                    receiver_id=last_msg["receiver_id"],
                    sender_name=other_user.get("full_name", "User") if other_user else "Unknown",
                    content=last_msg["content"],
                    message_type=last_msg.get("message_type", "text"),
                    status=last_msg["status"],
                    created_at=last_msg["created_at"],
                    read_at=last_msg.get("read_at")
                ) if last_msg else None,
                unread_count=conv["unread_count"],
                updated_at=last_msg["created_at"] if last_msg else datetime.utcnow()
            ))
        
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get conversations: {str(e)}"
        )

@router.post("/messages", response_model=MessageResponse)
async def send_message(
    message: MessageCreate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Send a message to another user"""
    try:
        db = get_database()
        users_collection = db["users"]
        messages = get_messages_collection()
        
        # Verify receiver exists
        receiver = users_collection.find_one({"_id": ObjectId(message.receiver_id)})
        if not receiver:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Receiver not found"
            )
        
        # Check if users are connected
        connections = get_connection_collection()
        connection = connections.find_one({
            "$or": [
                {
                    "student_id": current_user["user_id"],
                    "alumni_id": message.receiver_id,
                    "status": ConnectionStatus.ACCEPTED
                },
                {
                    "student_id": message.receiver_id,
                    "alumni_id": current_user["user_id"],
                    "status": ConnectionStatus.ACCEPTED
                }
            ]
        })
        
        if not connection:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Users must be connected to send messages"
            )
        
        # Create message
        message_data = {
            "sender_id": current_user["user_id"],
            "receiver_id": message.receiver_id,
            "content": message.content,
            "message_type": message.message_type,
            "status": MessageStatus.SENT,
            "created_at": datetime.utcnow(),
            "read_at": None
        }
        
        result = messages.insert_one(message_data)
        message_data["_id"] = result.inserted_id
        
        return MessageResponse(
            id=str(result.inserted_id),
            sender_id=message_data["sender_id"],
            receiver_id=message_data["receiver_id"],
            sender_name=current_user.get("full_name", "User"),
            content=message_data["content"],
            message_type=message_data["message_type"],
            status=message_data["status"],
            created_at=message_data["created_at"],
            read_at=message_data["read_at"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send message: {str(e)}"
        )

@router.get("/messages/{conversation_id}", response_model=List[MessageResponse])
async def get_messages(
    conversation_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get messages in a conversation"""
    try:
        messages = get_messages_collection()
        db = get_database()
        users_collection = db["users"]
        
        # Get messages between current user and conversation partner
        message_list = list(messages.find({
            "$or": [
                {
                    "sender_id": current_user["user_id"],
                    "receiver_id": conversation_id
                },
                {
                    "sender_id": conversation_id,
                    "receiver_id": current_user["user_id"]
                }
            ]
        }).sort("created_at", 1))
        
        # Mark messages as read
        messages.update_many(
            {
                "receiver_id": current_user["user_id"],
                "sender_id": conversation_id,
                "status": {"$ne": MessageStatus.READ}
            },
            {
                "$set": {
                    "status": MessageStatus.READ,
                    "read_at": datetime.utcnow()
                }
            }
        )
        
        # Enrich with sender names
        result = []
        for msg in message_list:
            sender = users_collection.find_one({"_id": ObjectId(msg["sender_id"])})
            result.append(MessageResponse(
                id=str(msg["_id"]),
                sender_id=msg["sender_id"],
                receiver_id=msg["receiver_id"],
                sender_name=sender.get("full_name", "User") if sender else "Unknown",
                content=msg["content"],
                message_type=msg.get("message_type", "text"),
                status=msg["status"],
                created_at=msg["created_at"],
                read_at=msg.get("read_at")
            ))
        
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get messages: {str(e)}"
        )

@router.get("/stats", response_model=ConnectionStats)
async def get_connection_stats(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get connection statistics for current user"""
    try:
        connections = get_connection_collection()
        messages = get_messages_collection()
        
        user_id = current_user["user_id"]
        
        # Count connections
        total_connections = connections.count_documents({
            "$or": [
                {"student_id": user_id, "status": ConnectionStatus.ACCEPTED},
                {"alumni_id": user_id, "status": ConnectionStatus.ACCEPTED}
            ]
        })
        
        # Count pending requests (only for alumni)
        pending_requests = 0
        if current_user["user_type"] == "alumni":
            pending_requests = connections.count_documents({
                "alumni_id": user_id,
                "status": ConnectionStatus.PENDING
            })
        
        # Count active mentorships (same as total connections for now)
        active_mentorships = total_connections
        
        # Count messages sent
        messages_sent = messages.count_documents({
            "sender_id": user_id
        })
        
        return ConnectionStats(
            total_connections=total_connections,
            pending_requests=pending_requests,
            active_mentorships=active_mentorships,
            messages_sent=messages_sent
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get connection stats: {str(e)}"
        )

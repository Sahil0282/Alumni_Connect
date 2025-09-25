from fastapi import APIRouter, HTTPException, Depends, status, Query
from typing import List, Dict, Any, Optional
from datetime import datetime, date
from bson import ObjectId

from app.models.event_models import (
    EventCreate,
    EventUpdate,
    EventResponse,
    EventRegistration,
    EventRegistrationResponse,
    EventStats,
    EventListResponse,
    EventStatus,
    EventCategory
)
from app.core.database import get_database
from app.core.auth_service import get_current_user

router = APIRouter(prefix="/api/events", tags=["Events Management"])

def get_events_collection():
    db = get_database()
    return db["events"]

def get_registrations_collection():
    db = get_database()
    return db["event_registrations"]

@router.post("/", response_model=EventResponse)
async def create_event(
    event: EventCreate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Create a new event (admin only)"""
    try:
        if current_user["user_type"] != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admins can create events"
            )
        
        events = get_events_collection()
        
        # Create event document
        event_data = {
            "title": event.title,
            "description": event.description,
            "date": event.date,
            "time": event.time,
            "end_time": event.end_time,
            "location": event.location,
            "category": event.category,
            "max_attendees": event.max_attendees,
            "current_attendees": 0,
            "price": event.price,
            "registration_deadline": event.registration_deadline,
            "featured": event.featured,
            "tags": event.tags,
            "image_url": event.image_url,
            "organizer_name": event.organizer_name,
            "organizer_email": event.organizer_email,
            "organizer_company": event.organizer_company,
            "requirements": event.requirements,
            "agenda": event.agenda,
            "status": EventStatus.DRAFT,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "created_by": current_user["user_id"]
        }
        
        result = events.insert_one(event_data)
        event_data["_id"] = result.inserted_id
        
        return EventResponse(
            id=str(result.inserted_id),
            title=event_data["title"],
            description=event_data["description"],
            date=event_data["date"],
            time=event_data["time"],
            end_time=event_data["end_time"],
            location=event_data["location"],
            category=event_data["category"],
            max_attendees=event_data["max_attendees"],
            current_attendees=event_data["current_attendees"],
            price=event_data["price"],
            registration_deadline=event_data["registration_deadline"],
            featured=event_data["featured"],
            tags=event_data["tags"],
            image_url=event_data["image_url"],
            organizer_name=event_data["organizer_name"],
            organizer_email=event_data["organizer_email"],
            organizer_company=event_data["organizer_company"],
            requirements=event_data["requirements"],
            agenda=event_data["agenda"],
            status=event_data["status"],
            created_at=event_data["created_at"],
            updated_at=event_data["updated_at"],
            created_by=event_data["created_by"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create event: {str(e)}"
        )

@router.get("/", response_model=EventListResponse)
async def get_events(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[EventCategory] = None,
    status: Optional[EventStatus] = None,
    featured: Optional[bool] = None,
    search: Optional[str] = None
):
    """Get events with filtering and pagination"""
    try:
        events = get_events_collection()
        
        # Build filter
        filter_query = {}
        if category:
            filter_query["category"] = category
        if status:
            filter_query["status"] = status
        if featured is not None:
            filter_query["featured"] = featured
        if search:
            filter_query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}},
                {"organizer_name": {"$regex": search, "$options": "i"}},
                {"tags": {"$in": [{"$regex": search, "$options": "i"}]}}
            ]
        
        # Get total count
        total = events.count_documents(filter_query)
        
        # Get events with pagination
        skip = (page - 1) * limit
        events_cursor = events.find(filter_query).sort("created_at", -1).skip(skip).limit(limit)
        events_list = list(events_cursor)
        
        # Convert to response format
        event_responses = []
        for event in events_list:
            event_responses.append(EventResponse(
                id=str(event["_id"]),
                title=event["title"],
                description=event["description"],
                date=event["date"],
                time=event["time"],
                end_time=event.get("end_time"),
                location=event["location"],
                category=event["category"],
                max_attendees=event["max_attendees"],
                current_attendees=event["current_attendees"],
                price=event["price"],
                registration_deadline=event.get("registration_deadline"),
                featured=event["featured"],
                tags=event["tags"],
                image_url=event.get("image_url"),
                organizer_name=event["organizer_name"],
                organizer_email=event.get("organizer_email"),
                organizer_company=event.get("organizer_company"),
                requirements=event.get("requirements"),
                agenda=event.get("agenda"),
                status=event["status"],
                created_at=event["created_at"],
                updated_at=event["updated_at"],
                created_by=event["created_by"]
            ))
        
        return EventListResponse(
            events=event_responses,
            total=total,
            page=page,
            limit=limit,
            has_next=skip + limit < total,
            has_prev=page > 1
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get events: {str(e)}"
        )

@router.get("/{event_id}", response_model=EventResponse)
async def get_event(event_id: str):
    """Get a specific event by ID"""
    try:
        events = get_events_collection()
        
        event = events.find_one({"_id": ObjectId(event_id)})
        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
        
        return EventResponse(
            id=str(event["_id"]),
            title=event["title"],
            description=event["description"],
            date=event["date"],
            time=event["time"],
            end_time=event.get("end_time"),
            location=event["location"],
            category=event["category"],
            max_attendees=event["max_attendees"],
            current_attendees=event["current_attendees"],
            price=event["price"],
            registration_deadline=event.get("registration_deadline"),
            featured=event["featured"],
            tags=event["tags"],
            image_url=event.get("image_url"),
            organizer_name=event["organizer_name"],
            organizer_email=event.get("organizer_email"),
            organizer_company=event.get("organizer_company"),
            requirements=event.get("requirements"),
            agenda=event.get("agenda"),
            status=event["status"],
            created_at=event["created_at"],
            updated_at=event["updated_at"],
            created_by=event["created_by"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get event: {str(e)}"
        )

@router.put("/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: str,
    event_update: EventUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Update an event (admin only)"""
    try:
        if current_user["user_type"] != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admins can update events"
            )
        
        events = get_events_collection()
        
        # Check if event exists
        existing_event = events.find_one({"_id": ObjectId(event_id)})
        if not existing_event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
        
        # Prepare update data
        update_data = {}
        for field, value in event_update.dict(exclude_unset=True).items():
            if value is not None:
                update_data[field] = value
        
        if update_data:
            update_data["updated_at"] = datetime.utcnow()
            events.update_one(
                {"_id": ObjectId(event_id)},
                {"$set": update_data}
            )
        
        # Get updated event
        updated_event = events.find_one({"_id": ObjectId(event_id)})
        
        return EventResponse(
            id=str(updated_event["_id"]),
            title=updated_event["title"],
            description=updated_event["description"],
            date=updated_event["date"],
            time=updated_event["time"],
            end_time=updated_event.get("end_time"),
            location=updated_event["location"],
            category=updated_event["category"],
            max_attendees=updated_event["max_attendees"],
            current_attendees=updated_event["current_attendees"],
            price=updated_event["price"],
            registration_deadline=updated_event.get("registration_deadline"),
            featured=updated_event["featured"],
            tags=updated_event["tags"],
            image_url=updated_event.get("image_url"),
            organizer_name=updated_event["organizer_name"],
            organizer_email=updated_event.get("organizer_email"),
            organizer_company=updated_event.get("organizer_company"),
            requirements=updated_event.get("requirements"),
            agenda=updated_event.get("agenda"),
            status=updated_event["status"],
            created_at=updated_event["created_at"],
            updated_at=updated_event["updated_at"],
            created_by=updated_event["created_by"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update event: {str(e)}"
        )

@router.delete("/{event_id}")
async def delete_event(
    event_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Delete an event (admin only)"""
    try:
        if current_user["user_type"] != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admins can delete events"
            )
        
        events = get_events_collection()
        registrations = get_registrations_collection()
        
        # Check if event exists
        event = events.find_one({"_id": ObjectId(event_id)})
        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
        
        # Delete event and all registrations
        events.delete_one({"_id": ObjectId(event_id)})
        registrations.delete_many({"event_id": event_id})
        
        return {"message": "Event deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete event: {str(e)}"
        )

@router.post("/{event_id}/register", response_model=EventRegistrationResponse)
async def register_for_event(
    event_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Register for an event"""
    try:
        events = get_events_collection()
        registrations = get_registrations_collection()
        
        # Check if event exists and is available for registration
        event = events.find_one({"_id": ObjectId(event_id)})
        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
        
        if event["status"] not in [EventStatus.UPCOMING, EventStatus.ONGOING]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Event is not available for registration"
            )
        
        # Check if user is already registered
        existing_registration = registrations.find_one({
            "event_id": event_id,
            "user_id": current_user["user_id"]
        })
        if existing_registration:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is already registered for this event"
            )
        
        # Check if event is full
        if event["current_attendees"] >= event["max_attendees"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Event is full"
            )
        
        # Create registration
        registration_data = {
            "event_id": event_id,
            "user_id": current_user["user_id"],
            "user_name": current_user.get("full_name", "User"),
            "user_email": current_user.get("email", ""),
            "registration_date": datetime.utcnow(),
            "status": "registered",
            "notes": None
        }
        
        result = registrations.insert_one(registration_data)
        registration_data["_id"] = result.inserted_id
        
        # Update event attendee count
        events.update_one(
            {"_id": ObjectId(event_id)},
            {"$inc": {"current_attendees": 1}}
        )
        
        return EventRegistrationResponse(
            id=str(result.inserted_id),
            event_id=registration_data["event_id"],
            user_id=registration_data["user_id"],
            user_name=registration_data["user_name"],
            user_email=registration_data["user_email"],
            registration_date=registration_data["registration_date"],
            status=registration_data["status"],
            notes=registration_data["notes"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to register for event: {str(e)}"
        )

@router.delete("/{event_id}/register")
async def unregister_from_event(
    event_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Unregister from an event"""
    try:
        events = get_events_collection()
        registrations = get_registrations_collection()
        
        # Check if registration exists
        registration = registrations.find_one({
            "event_id": event_id,
            "user_id": current_user["user_id"]
        })
        if not registration:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Registration not found"
            )
        
        # Delete registration
        registrations.delete_one({"_id": registration["_id"]})
        
        # Update event attendee count
        events.update_one(
            {"_id": ObjectId(event_id)},
            {"$inc": {"current_attendees": -1}}
        )
        
        return {"message": "Successfully unregistered from event"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to unregister from event: {str(e)}"
        )

@router.get("/{event_id}/registrations", response_model=List[EventRegistrationResponse])
async def get_event_registrations(
    event_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get event registrations (admin only)"""
    try:
        if current_user["user_type"] != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admins can view event registrations"
            )
        
        registrations = get_registrations_collection()
        
        # Get all registrations for the event
        registrations_cursor = registrations.find({"event_id": event_id}).sort("registration_date", -1)
        registrations_list = list(registrations_cursor)
        
        # Convert to response format
        registration_responses = []
        for reg in registrations_list:
            registration_responses.append(EventRegistrationResponse(
                id=str(reg["_id"]),
                event_id=reg["event_id"],
                user_id=reg["user_id"],
                user_name=reg["user_name"],
                user_email=reg["user_email"],
                registration_date=reg["registration_date"],
                status=reg["status"],
                notes=reg.get("notes")
            ))
        
        return registration_responses
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get event registrations: {str(e)}"
        )

@router.get("/user/registrations", response_model=List[EventResponse])
async def get_user_registrations(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get user's event registrations"""
    try:
        events = get_events_collection()
        registrations = get_registrations_collection()
        
        # Get user's registrations
        user_registrations = list(registrations.find({
            "user_id": current_user["user_id"]
        }))
        
        if not user_registrations:
            return []
        
        # Get event IDs
        event_ids = [reg["event_id"] for reg in user_registrations]
        
        # Get events
        events_cursor = events.find({"_id": {"$in": [ObjectId(eid) for eid in event_ids]}})
        events_list = list(events_cursor)
        
        # Convert to response format
        event_responses = []
        for event in events_list:
            event_responses.append(EventResponse(
                id=str(event["_id"]),
                title=event["title"],
                description=event["description"],
                date=event["date"],
                time=event["time"],
                end_time=event.get("end_time"),
                location=event["location"],
                category=event["category"],
                max_attendees=event["max_attendees"],
                current_attendees=event["current_attendees"],
                price=event["price"],
                registration_deadline=event.get("registration_deadline"),
                featured=event["featured"],
                tags=event["tags"],
                image_url=event.get("image_url"),
                organizer_name=event["organizer_name"],
                organizer_email=event.get("organizer_email"),
                organizer_company=event.get("organizer_company"),
                requirements=event.get("requirements"),
                agenda=event.get("agenda"),
                status=event["status"],
                created_at=event["created_at"],
                updated_at=event["updated_at"],
                created_by=event["created_by"]
            ))
        
        return event_responses
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user registrations: {str(e)}"
        )

@router.get("/stats/overview", response_model=EventStats)
async def get_event_stats(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get event statistics (admin only)"""
    try:
        if current_user["user_type"] != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admins can view event statistics"
            )
        
        events = get_events_collection()
        registrations = get_registrations_collection()
        
        # Basic counts
        total_events = events.count_documents({})
        upcoming_events = events.count_documents({"status": EventStatus.UPCOMING})
        completed_events = events.count_documents({"status": EventStatus.COMPLETED})
        
        # Registration counts
        total_registrations = registrations.count_documents({})
        total_attendees = registrations.count_documents({"status": "attended"})
        
        # Events by category
        category_pipeline = [
            {"$group": {"_id": "$category", "count": {"$sum": 1}}}
        ]
        events_by_category = {}
        for result in events.aggregate(category_pipeline):
            events_by_category[result["_id"]] = result["count"]
        
        # Events by status
        status_pipeline = [
            {"$group": {"_id": "$status", "count": {"$sum": 1}}}
        ]
        events_by_status = {}
        for result in events.aggregate(status_pipeline):
            events_by_status[result["_id"]] = result["count"]
        
        return EventStats(
            total_events=total_events,
            upcoming_events=upcoming_events,
            completed_events=completed_events,
            total_registrations=total_registrations,
            total_attendees=total_attendees,
            events_by_category=events_by_category,
            events_by_status=events_by_status
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get event statistics: {str(e)}"
        )

import pymongo
from typing import Dict, Any, Optional
from datetime import datetime
from pymongo.errors import DuplicateKeyError
from app.core.database import get_database
from app.core.auth_service import auth_service

class AuthDatabase:
    def __init__(self):
        self.db = get_database()
        self.users_collection = self.db["users"]
        self.students_collection = self.db["students"]
        self.admins_collection = self.db["admins"]
        self.alumni_collection = self.db["alumni"]  # Use existing alumni collection
        
        # Create indexes
        self._create_indexes()
    
    def _create_indexes(self):
        """Create necessary database indexes"""
        try:
            # Users collection indexes
            self.users_collection.create_index("email", unique=True)
            self.users_collection.create_index([("email", 1), ("user_type", 1)])
            
            # Students collection indexes
            self.students_collection.create_index("email", unique=True)
            self.students_collection.create_index("student_id", unique=True)
            
            # Admins collection indexes
            self.admins_collection.create_index("email", unique=True)
            
            # Alumni collection already has email index from existing code
            
        except Exception as e:
            print(f"Index creation warning: {e}")
    
    def create_admin(self, admin_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create new admin user"""
        try:
            # Hash password
            hashed_password = auth_service.hash_password(admin_data["password"])
            
            # Prepare user document
            user_doc = {
                "email": admin_data["email"],
                "hashed_password": hashed_password,
                "full_name": admin_data["full_name"],
                "user_type": "admin",
                "is_active": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "phone": admin_data.get("phone"),
                "department": admin_data.get("department"),
                "permissions": ["admin_access", "user_management", "alumni_management"]
            }
            
            # Insert into users collection
            result = self.users_collection.insert_one(user_doc)
            user_doc["_id"] = result.inserted_id
            
            # Also insert into admins collection for admin-specific data
            admin_doc = {
                "user_id": result.inserted_id,
                "email": admin_data["email"],
                "full_name": admin_data["full_name"],
                "phone": admin_data.get("phone"),
                "department": admin_data.get("department"),
                "permissions": ["admin_access", "user_management", "alumni_management"],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            self.admins_collection.insert_one(admin_doc)
            
            return user_doc
            
        except DuplicateKeyError:
            raise ValueError("Email already exists")
        except Exception as e:
            raise Exception(f"Error creating admin: {str(e)}")
    
    def create_student(self, student_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create new student user"""
        try:
            # Hash password
            hashed_password = auth_service.hash_password(student_data["password"])
            
            # Prepare user document
            user_doc = {
                "email": student_data["email"],
                "hashed_password": hashed_password,
                "full_name": student_data["full_name"],
                "user_type": "student",
                "is_active": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            # Insert into users collection
            result = self.users_collection.insert_one(user_doc)
            user_doc["_id"] = result.inserted_id
            
            # Insert into students collection for student-specific data
            student_doc = {
                "user_id": result.inserted_id,
                "email": student_data["email"],
                "full_name": student_data["full_name"],
                "student_id": student_data["student_id"],
                "phone": student_data.get("phone"),
                "department": student_data.get("department"),
                "graduation_year": student_data.get("graduation_year"),
                "current_semester": student_data.get("current_semester"),
                "profile_completed": False,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            self.students_collection.insert_one(student_doc)
            
            return user_doc
            
        except DuplicateKeyError:
            raise ValueError("Email or Student ID already exists")
        except Exception as e:
            raise Exception(f"Error creating student: {str(e)}")
    
    def authenticate_user(self, email: str, password: str, user_type: str):
        """Authenticate user by email, password and user type.
        Returns a tuple: (user_dict_or_None, error_code_or_None)
        error_code values: 'not_found' | 'wrong_password' | 'inactive' | 'server_error'
        """
        try:
            # Case-insensitive email match for users collection (admins and students)
            import re
            user = self.users_collection.find_one({
                "email": {"$regex": f"^{re.escape(email)}$", "$options": "i"},
                "user_type": user_type,
                "is_active": True
            })
            
            # Special handling for alumni who are created via CSV and stored in alumni collection
            if not user and user_type == "alumni":
                alumni = self.alumni_collection.find_one({
                    "email": {"$regex": f"^{re.escape(email)}$", "$options": "i"},
                    "$or": [{"is_active": True}, {"is_active": {"$exists": False}}]
                })
                if not alumni:
                    return None, "not_found"
                # Verify password against alumni hashed_password
                if not auth_service.verify_password(password, alumni.get("hashed_password", "")):
                    return None, "wrong_password"
                # Build a compatible user payload
                user = {
                    "_id": alumni["_id"],
                    "email": alumni["email"],
                    "full_name": alumni.get("full_name") or alumni["email"].split("@")[0],
                    "user_type": "alumni",
                    "is_active": alumni.get("is_active", True)
                }
            elif not user:
                # No user for admin/student
                return None, "not_found"
            else:
                # Verify password for admin/student
                if not auth_service.verify_password(password, user.get("hashed_password", "")):
                    return None, "wrong_password"
            
            # Remove password from response
            if "hashed_password" in user:
                del user["hashed_password"]
            
            # Get additional profile data based on user type
            if user_type == "admin":
                admin_data = self.admins_collection.find_one({"user_id": user["_id"]})
                if admin_data:
                    user.update({
                        "permissions": admin_data.get("permissions", []),
                        "phone": admin_data.get("phone"),
                        "department": admin_data.get("department")
                    })
            
            elif user_type == "student":
                student_data = self.students_collection.find_one({"user_id": user["_id"]})
                if student_data:
                    user.update({
                        "student_id": student_data.get("student_id"),
                        "phone": student_data.get("phone"),
                        "department": student_data.get("department"),
                        "graduation_year": student_data.get("graduation_year"),
                        "current_semester": student_data.get("current_semester"),
                        "profile_completed": student_data.get("profile_completed", False)
                    })
            
            elif user_type == "alumni":
                # Alumni data is in the existing alumni collection
                alumni_data = self.alumni_collection.find_one({"email": email})
                if alumni_data:
                    user.update({
                        "graduation_year": alumni_data.get("graduation_year"),
                        "department": alumni_data.get("department"),
                        "current_company": alumni_data.get("current_company"),
                        "current_position": alumni_data.get("current_position"),
                        "phone": alumni_data.get("phone"),
                        "linkedin_profile": alumni_data.get("linkedin_profile")
                    })
            
            return user, None
            
        except Exception as e:
            print(f"Authentication error: {e}")
            return None, "server_error"
    
    def get_user_by_email(self, email: str, user_type: str) -> Optional[Dict[str, Any]]:
        """Get user by email and user type"""
        try:
            user = self.users_collection.find_one({
                "email": email,
                "user_type": user_type
            })
            
            if user:
                # Remove password from response
                if "hashed_password" in user:
                    del user["hashed_password"]
            
            return user
            
        except Exception as e:
            print(f"Error getting user: {e}")
            return None
    
    def get_user_by_id(self, user_id: str, user_type: str) -> Optional[Dict[str, Any]]:
        """Get user by ID and user type"""
        try:
            from bson import ObjectId
            if user_type == "alumni":
                alumni = self.alumni_collection.find_one({"_id": ObjectId(user_id)})
                if alumni:
                    # Normalize fields to match user profile shape
                    normalized = {
                        "_id": alumni["_id"],
                        "email": alumni.get("email"),
                        "full_name": alumni.get("full_name"),
                        "user_type": "alumni",
                        "is_active": alumni.get("is_active", True),
                        "created_at": alumni.get("created_at"),
                        "updated_at": alumni.get("updated_at"),
                    }
                    return normalized
                return None
            else:
                user = self.users_collection.find_one({
                    "_id": ObjectId(user_id),
                    "user_type": user_type
                })
                if user and "hashed_password" in user:
                    del user["hashed_password"]
                return user
            
        except Exception as e:
            print(f"Error getting user by ID: {e}")
            return None
    
    def update_user_profile(self, user_id: str, user_type: str, update_data: Dict[str, Any]) -> bool:
        """Update user profile"""
        try:
            from bson import ObjectId
            
            # Update users collection
            update_data["updated_at"] = datetime.utcnow()
            
            result = self.users_collection.update_one(
                {"_id": ObjectId(user_id), "user_type": user_type},
                {"$set": update_data}
            )
            
            # Update type-specific collection
            if user_type == "admin":
                self.admins_collection.update_one(
                    {"user_id": ObjectId(user_id)},
                    {"$set": update_data}
                )
            elif user_type == "student":
                self.students_collection.update_one(
                    {"user_id": ObjectId(user_id)},
                    {"$set": update_data}
                )
            elif user_type == "alumni":
                # Update existing alumni collection
                user = self.users_collection.find_one({"_id": ObjectId(user_id)})
                if user:
                    self.alumni_collection.update_one(
                        {"email": user["email"]},
                        {"$set": update_data}
                    )
            
            return result.modified_count > 0
            
        except Exception as e:
            print(f"Error updating user profile: {e}")
            return False
    
    def change_password(self, user_id: str, user_type: str, new_password: str) -> bool:
        """Change user password"""
        try:
            from bson import ObjectId
            
            hashed_password = auth_service.hash_password(new_password)
            
            result = self.users_collection.update_one(
                {"_id": ObjectId(user_id), "user_type": user_type},
                {"$set": {
                    "hashed_password": hashed_password,
                    "updated_at": datetime.utcnow()
                }}
            )
            
            return result.modified_count > 0
            
        except Exception as e:
            print(f"Error changing password: {e}")
            return False
    
    def deactivate_user(self, user_id: str, user_type: str) -> bool:
        """Deactivate user account"""
        try:
            from bson import ObjectId
            
            result = self.users_collection.update_one(
                {"_id": ObjectId(user_id), "user_type": user_type},
                {"$set": {
                    "is_active": False,
                    "updated_at": datetime.utcnow()
                }}
            )
            
            return result.modified_count > 0
            
        except Exception as e:
            print(f"Error deactivating user: {e}")
            return False

# Create global auth database instance
auth_db = AuthDatabase()

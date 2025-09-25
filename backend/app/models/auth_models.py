from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal
from datetime import datetime

# User Registration Models
class AdminRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")
    full_name: str
    phone: Optional[str] = None
    department: Optional[str] = None

class StudentRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")
    full_name: str
    student_id: str
    phone: Optional[str] = None
    department: Optional[str] = None
    graduation_year: Optional[str] = None
    current_semester: Optional[int] = None

# Login Models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    user_type: Literal["admin", "student", "alumni"] = Field(..., description="Type of user logging in")

class LoginResponse(BaseModel):
    success: bool
    message: str
    access_token: Optional[str] = None
    token_type: str = "bearer"
    user_data: Optional[dict] = None
    expires_in: Optional[int] = None

# Token Models
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

class TokenData(BaseModel):
    email: Optional[str] = None
    user_type: Optional[str] = None
    user_id: Optional[str] = None

# User Profile Models
class UserProfile(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    user_type: Literal["admin", "student", "alumni"]
    is_active: bool
    created_at: datetime
    updated_at: datetime

class AdminProfile(UserProfile):
    phone: Optional[str] = None
    department: Optional[str] = None
    permissions: list = []

class StudentProfile(UserProfile):
    student_id: str
    phone: Optional[str] = None
    department: Optional[str] = None
    graduation_year: Optional[str] = None
    current_semester: Optional[int] = None
    profile_completed: bool = False

class AlumniProfile(UserProfile):
    graduation_year: Optional[str] = None
    department: Optional[str] = None
    current_company: Optional[str] = None
    current_position: Optional[str] = None
    phone: Optional[str] = None
    linkedin_profile: Optional[str] = None

# Response Models
class AuthResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None

class RegisterResponse(BaseModel):
    success: bool
    message: str
    user_id: Optional[str] = None
    email: Optional[str] = None
    user_type: Optional[str] = None

# Password Reset Models
class PasswordResetRequest(BaseModel):
    email: EmailStr
    user_type: Literal["admin", "student", "alumni"]

class PasswordResetConfirm(BaseModel):
    email: EmailStr
    reset_token: str
    new_password: str = Field(..., min_length=8)

# Profile Update Models
class UpdateProfileRequest(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None

class UpdateStudentProfileRequest(UpdateProfileRequest):
    graduation_year: Optional[str] = None
    current_semester: Optional[int] = None

class UpdateAlumniProfileRequest(UpdateProfileRequest):
    graduation_year: Optional[str] = None
    current_company: Optional[str] = None
    current_position: Optional[str] = None
    linkedin_profile: Optional[str] = None

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)

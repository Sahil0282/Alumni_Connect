from fastapi import APIRouter, HTTPException, status, Depends
from typing import Dict, Any

from app.models.auth_models import (
    AdminRegisterRequest,
    StudentRegisterRequest,
    LoginRequest,
    LoginResponse,
    RegisterResponse,
    AuthResponse,
    UpdateProfileRequest,
    UpdateStudentProfileRequest,
    ChangePasswordRequest
)
from app.core.auth_database import auth_db
from app.core.auth_service import (
    auth_service,
    get_current_user,
    get_current_admin,
    get_current_student,
    get_current_alumni
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register/admin", response_model=RegisterResponse)
async def register_admin(request: AdminRegisterRequest):
    """Register new admin user"""
    try:
        # Create admin user
        user_data = auth_db.create_admin({
            "email": request.email,
            "password": request.password,
            "full_name": request.full_name,
            "phone": request.phone,
            "department": request.department
        })
        
        return RegisterResponse(
            success=True,
            message="Admin registered successfully",
            user_id=str(user_data["_id"]),
            email=user_data["email"],
            user_type="admin"
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/register/student", response_model=RegisterResponse)
async def register_student(request: StudentRegisterRequest):
    """Register new student user"""
    try:
        # Create student user
        user_data = auth_db.create_student({
            "email": request.email,
            "password": request.password,
            "full_name": request.full_name,
            "student_id": request.student_id,
            "phone": request.phone,
            "department": request.department,
            "graduation_year": request.graduation_year,
            "current_semester": request.current_semester
        })
        
        return RegisterResponse(
            success=True,
            message="Student registered successfully",
            user_id=str(user_data["_id"]),
            email=user_data["email"],
            user_type="student"
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Login user (admin, student, or alumni)"""
    try:
        # Authenticate user
        user, err = auth_db.authenticate_user(
            email=request.email,
            password=request.password,
            user_type=request.user_type
        )
        
        if not user:
            if err == "not_found":
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found for the specified role"
                )
            if err == "wrong_password":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect password"
                )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Authentication server error"
            )
        
        # Create token response
        token_response = auth_service.create_token_response(user)
        
        return LoginResponse(
            success=True,
            message=f"{request.user_type.title()} login successful",
            access_token=token_response["access_token"],
            token_type=token_response["token_type"],
            user_data=token_response["user_data"],
            expires_in=token_response["expires_in"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.get("/profile", response_model=AuthResponse)
async def get_profile(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Get current user profile"""
    try:
        # Get complete user data
        user_data = auth_db.get_user_by_id(
            user_id=current_user["user_id"],
            user_type=current_user["user_type"]
        )
        
        if not user_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return AuthResponse(
            success=True,
            message="Profile retrieved successfully",
            data={
                "user": {
                    "id": str(user_data["_id"]),
                    "email": user_data["email"],
                    "full_name": user_data["full_name"],
                    "user_type": user_data["user_type"],
                    "is_active": user_data["is_active"],
                    "created_at": user_data["created_at"].isoformat(),
                    "updated_at": user_data["updated_at"].isoformat(),
                    **{k: v for k, v in user_data.items() if k not in [
                        "_id", "email", "full_name", "user_type", "is_active", 
                        "created_at", "updated_at", "hashed_password"
                    ]}
                }
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get profile: {str(e)}"
        )

@router.put("/profile", response_model=AuthResponse)
async def update_profile(
    request: UpdateProfileRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Update current user profile"""
    try:
        # Prepare update data
        update_data = {}
        if request.full_name is not None:
            update_data["full_name"] = request.full_name
        if request.phone is not None:
            update_data["phone"] = request.phone
        if request.department is not None:
            update_data["department"] = request.department
        
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No data provided for update"
            )
        
        # Update user profile
        success = auth_db.update_user_profile(
            user_id=current_user["user_id"],
            user_type=current_user["user_type"],
            update_data=update_data
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to update profile"
            )
        
        return AuthResponse(
            success=True,
            message="Profile updated successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}"
        )

@router.put("/profile/student", response_model=AuthResponse)
async def update_student_profile(
    request: UpdateStudentProfileRequest,
    current_user: Dict[str, Any] = Depends(get_current_student)
):
    """Update student-specific profile data"""
    try:
        # Prepare update data
        update_data = {}
        if request.full_name is not None:
            update_data["full_name"] = request.full_name
        if request.phone is not None:
            update_data["phone"] = request.phone
        if request.department is not None:
            update_data["department"] = request.department
        if request.graduation_year is not None:
            update_data["graduation_year"] = request.graduation_year
        if request.current_semester is not None:
            update_data["current_semester"] = request.current_semester
        
        # Mark profile as completed if key fields are provided
        if request.department and request.graduation_year:
            update_data["profile_completed"] = True
        
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No data provided for update"
            )
        
        # Update student profile
        success = auth_db.update_user_profile(
            user_id=current_user["user_id"],
            user_type="student",
            update_data=update_data
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to update student profile"
            )
        
        return AuthResponse(
            success=True,
            message="Student profile updated successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update student profile: {str(e)}"
        )

@router.put("/change-password", response_model=AuthResponse)
async def change_password(
    request: ChangePasswordRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Change user password"""
    try:
        # Get current user data to verify current password
        user_data = auth_db.get_user_by_id(
            user_id=current_user["user_id"],
            user_type=current_user["user_type"]
        )
        
        if not user_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Get user with password for verification
        from app.core.database import get_database
        db = get_database()
        from bson import ObjectId
        user_with_password = db["users"].find_one({"_id": ObjectId(current_user["user_id"])})
        
        # Verify current password
        if not auth_service.verify_password(request.current_password, user_with_password["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect"
            )
        
        # Change password
        success = auth_db.change_password(
            user_id=current_user["user_id"],
            user_type=current_user["user_type"],
            new_password=request.new_password
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to change password"
            )
        
        return AuthResponse(
            success=True,
            message="Password changed successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to change password: {str(e)}"
        )

@router.post("/logout", response_model=AuthResponse)
async def logout(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Logout user (client-side token removal)"""
    return AuthResponse(
        success=True,
        message="Logged out successfully. Please remove the token from client storage."
    )

@router.get("/verify-token", response_model=AuthResponse)
async def verify_token(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Verify if current token is valid"""
    return AuthResponse(
        success=True,
        message="Token is valid",
        data={
            "user": {
                "email": current_user["email"],
                "user_type": current_user["user_type"],
                "user_id": current_user["user_id"]
            }
        }
    )

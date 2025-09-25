from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.admin.email_routes import router as admin_email_router
from app.api.admin.alumni_routes import router as admin_alumni_router
from app.api.student.chatbot_routes import router as student_chatbot_router
from app.api.auth.auth_routes import router as auth_router
from app.api.connection_routes import router as connection_router
from app.api.event_routes import router as event_router

# Create FastAPI app
app = FastAPI(
    title="VIT Portal API",
    description="API for VIT Student, Alumni and Admin Portal with Authentication",
    version="2.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://127.0.0.1:3001", "*"],  # Configure as needed for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(admin_email_router)
app.include_router(admin_alumni_router)
app.include_router(student_chatbot_router)
app.include_router(connection_router)
app.include_router(event_router)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "VIT Portal API",
        "version": "2.0.0",
        "modules": ["authentication", "student", "alumni", "admin"],
        "auth_endpoints": {
            "register_admin": "/api/auth/register/admin",
            "register_student": "/api/auth/register/student",
            "login": "/api/auth/login",
            "profile": "/api/auth/profile",
            "update_profile": "/api/auth/profile",
            "update_student_profile": "/api/auth/profile/student",
            "change_password": "/api/auth/change-password",
            "logout": "/api/auth/logout",
            "verify_token": "/api/auth/verify-token"
        },
        "admin_endpoints": {
            "send_single_email": "/api/admin/send-email",
            "send_bulk_emails": "/api/admin/send-bulk-emails", 
            "upload_csv_and_send": "/api/admin/upload-csv-and-send",
            "validate_csv": "/api/admin/validate-csv",
            "upload_alumni_csv": "/api/admin/alumni/upload-csv",
            "get_alumni_list": "/api/admin/alumni/list",
            "get_alumni_stats": "/api/admin/alumni/stats"
        },
        "student_endpoints": {
            "chatbot_chat": "/api/student/chatbot/chat",
            "chatbot_suggestions": "/api/student/chatbot/suggestions",
            "chatbot_categories": "/api/student/chatbot/categories",
            "chatbot_sessions": "/api/student/chatbot/sessions/{session_id}"
        },
        "docs": "/docs",
        "features": {
            "authentication": "JWT-based authentication for all user types",
            "user_management": "Registration and profile management",
            "role_based_access": "Admin, Student, and Alumni role separation",
            "alumni_management": "CSV import and email automation",
            "ai_chatbot": "Placement preparation AI assistant",
            "email_service": "Automated email notifications"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "VIT Portal API", "version": "2.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

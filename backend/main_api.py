from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.admin.email_routes import router as admin_email_router
from app.api.admin.alumni_routes import router as admin_alumni_router
from app.api.student.chatbot_routes import router as student_chatbot_router

# Create FastAPI app
app = FastAPI(
    title="VIT Portal API",
    description="API for VIT Student, Alumni and Admin Portal",
    version="1.0.0"
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
app.include_router(admin_email_router)
app.include_router(admin_alumni_router)
app.include_router(student_chatbot_router)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "VIT Portal API",
        "version": "1.0.0",
        "modules": ["student", "alumni", "admin"],
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
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "VIT Portal API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class AlumniCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: Optional[str] = None
    graduation_year: Optional[str] = None
    department: Optional[str] = None
    current_company: Optional[str] = None
    current_position: Optional[str] = None
    phone: Optional[str] = None
    linkedin_profile: Optional[str] = None

class CSVUploadResponse(BaseModel):
    message: str
    total_records: int
    successful_imports: int
    failed_imports: int
    failed_records: List[dict] = []
    emails_sent: int = 0
    emails_failed: int = 0
    email_errors: List[dict] = []

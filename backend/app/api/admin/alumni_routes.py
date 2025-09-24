import csv
import io
import logging
from fastapi import APIRouter, HTTPException, File, UploadFile
from pymongo.errors import DuplicateKeyError
from typing import Dict, Any, List

from app.models.alumni_models import CSVUploadResponse
from app.core.database import create_alumni_record, get_database

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/admin/alumni", tags=["Admin - Alumni Management"])

def parse_csv_content(csv_content: str) -> List[Dict[str, Any]]:
    """Parse CSV content and return list of alumni data"""
    alumni_data = []
    csv_file = io.StringIO(csv_content)
    csv_reader = csv.DictReader(csv_file)
    
    for row in csv_reader:
        # Clean and validate row data
        cleaned_row = {k.strip().lower(): v.strip() for k, v in row.items() if v.strip()}
        
        # Skip rows without email
        if 'email' not in cleaned_row or not cleaned_row['email']:
            continue
            
        # Create alumni record
        alumni_record = {
            'email': cleaned_row['email'],
            'username': cleaned_row['email'],  # Use email as username
            'password': f"{cleaned_row['email']}@123"  # Default password format
        }
        
        # Map other fields (flexible column names)
        field_mapping = {
            'full_name': ['full_name', 'name', 'fullname', 'full name'],
            'graduation_year': ['graduation_year', 'grad_year', 'year', 'graduation year', 'batch', 'batch_year'],
            'department': ['department', 'dept', 'branch', 'course'],
            'current_company': ['current_company', 'company', 'current company', 'organization'],
            'current_position': ['current_position', 'position', 'job_title', 'designation', 'role'],
            'phone': ['phone', 'phone_number', 'mobile', 'contact', 'phone number'],
            'linkedin_profile': ['linkedin_profile', 'linkedin', 'linkedin_url', 'linkedin url']
        }
        
        for field, possible_keys in field_mapping.items():
            for key in possible_keys:
                if key in cleaned_row and cleaned_row[key]:
                    alumni_record[field] = cleaned_row[key]
                    break
        
        alumni_data.append(alumni_record)
    
    return alumni_data

@router.post("/upload-csv", response_model=CSVUploadResponse)
async def upload_alumni_csv(
    file: UploadFile = File(..., description="CSV file containing alumni data")
):
    """
    Upload CSV file and create alumni records in MongoDB.
    
    Expected CSV columns (case-insensitive, flexible names):
    - email (required) - Will be used as username
    - name/full_name (optional)
    - graduation_year/year/batch (optional)
    - department/dept/branch (optional)
    - company/current_company (optional)
    - position/current_position/job_title (optional)
    - phone/mobile/contact (optional)
    - linkedin/linkedin_profile (optional)
    
    Password will be automatically set as: {email}@123
    """
    try:
        # Validate file type
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="File must be a CSV file")
        
        # Read and parse CSV content
        content = await file.read()
        csv_content = content.decode('utf-8')
        
        # Parse CSV data
        alumni_data = parse_csv_content(csv_content)
        
        if not alumni_data:
            return CSVUploadResponse(
                message="No valid records found in CSV",
                total_records=0,
                successful_imports=0,
                failed_imports=0
            )
        
        # Create unique index on email field
        db = get_database()
        collection = db["alumni"]
        try:
            collection.create_index("email", unique=True)
        except Exception:
            pass  # Index might already exist
        
        successful_imports = 0
        failed_imports = 0
        failed_records = []
        emails_sent = 0
        emails_failed = 0
        email_errors = []
        
        # Process each alumni record
        for record in alumni_data:
            try:
                result = create_alumni_record(record, send_email=True)
                successful_imports += 1
                
                # Track email sending
                if result.get('email_sent', False):
                    emails_sent += 1
                    logger.info(f"Successfully created alumni and sent email: {record['email']}")
                else:
                    emails_failed += 1
                    email_errors.append({
                        "email": record['email'],
                        "error": result.get('email_error', 'Unknown email error')
                    })
                    logger.warning(f"Alumni created but email failed: {record['email']}")
                
            except DuplicateKeyError:
                failed_imports += 1
                failed_records.append({
                    "email": record.get('email', 'Unknown'),
                    "error": "Email already exists"
                })
                logger.warning(f"Duplicate email found: {record.get('email')}")
                
            except Exception as e:
                failed_imports += 1
                failed_records.append({
                    "email": record.get('email', 'Unknown'),
                    "error": str(e)
                })
                logger.error(f"Error creating alumni {record.get('email')}: {e}")
        
        # Create comprehensive message
        message_parts = [
            f"Processed {len(alumni_data)} records",
            f"{successful_imports} successful imports",
            f"{failed_imports} failed imports"
        ]
        
        if successful_imports > 0:
            message_parts.append(f"{emails_sent} credential emails sent")
            if emails_failed > 0:
                message_parts.append(f"{emails_failed} emails failed")
        
        return CSVUploadResponse(
            message=". ".join(message_parts) + ".",
            total_records=len(alumni_data),
            successful_imports=successful_imports,
            failed_imports=failed_imports,
            failed_records=failed_records,
            emails_sent=emails_sent,
            emails_failed=emails_failed,
            email_errors=email_errors
        )
        
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="Invalid CSV file encoding. Please use UTF-8 encoding.")
    except Exception as e:
        logger.error(f"Error processing CSV upload: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/list")
async def get_alumni_list():
    """Get list of all alumni"""
    try:
        db = get_database()
        collection = db["alumni"]
        
        # Get all alumni (limit to 100 for performance)
        alumni_cursor = collection.find({}, {"hashed_password": 0}).limit(100)
        alumni_list = list(alumni_cursor)
        
        # Convert ObjectId to string for JSON serialization
        for alumni in alumni_list:
            alumni['id'] = str(alumni['_id'])
            del alumni['_id']
        
        return {
            "total_returned": len(alumni_list),
            "alumni": alumni_list
        }
        
    except Exception as e:
        logger.error(f"Error fetching alumni list: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/stats")
async def get_alumni_stats():
    """Get alumni statistics"""
    try:
        db = get_database()
        collection = db["alumni"]
        
        total_alumni = collection.count_documents({})
        active_alumni = collection.count_documents({"is_active": True})
        
        return {
            "total_alumni": total_alumni,
            "active_alumni": active_alumni,
            "inactive_alumni": total_alumni - active_alumni
        }
        
    except Exception as e:
        logger.error(f"Error fetching alumni stats: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

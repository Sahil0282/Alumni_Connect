import pymongo
import bcrypt
from typing import Dict, Any
from app.core.email_service import EmailService

# MongoDB connection string
MONGODB_URL = "mongodb+srv://saisinare19_db_user:1lhoKH7PK6Sicyuk@cluster0.pj6a7ai.mongodb.net/"
DATABASE_NAME = "alumni_platform"
COLLECTION_NAME = "alumni"

def get_database():
    """Get MongoDB database connection"""
    client = pymongo.MongoClient(MONGODB_URL)
    return client[DATABASE_NAME]

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def create_alumni_record(alumni_data: Dict[str, Any], send_email: bool = True) -> Dict[str, Any]:
    """Create alumni record in MongoDB and optionally send credentials email"""
    db = get_database()
    collection = db[COLLECTION_NAME]
    
    # Store original password for email
    original_password = alumni_data['password']
    username = alumni_data['username']
    email = alumni_data['email']
    full_name = alumni_data.get('full_name', email.split('@')[0])
    
    # Hash the password
    alumni_data['hashed_password'] = hash_password(alumni_data['password'])
    del alumni_data['password']  # Remove plain password
    
    # Add timestamps
    from datetime import datetime
    alumni_data['created_at'] = datetime.utcnow()
    alumni_data['updated_at'] = datetime.utcnow()
    alumni_data['is_active'] = True
    
    # Insert into database
    result = collection.insert_one(alumni_data)
    alumni_data['_id'] = result.inserted_id
    
    # Send credentials email if requested
    if send_email:
        try:
            email_service = EmailService()
            email_sent = email_service.send_alumni_credentials_email(
                recipient_email=email,
                user_name=full_name,
                username=username,
                password=original_password,
                login_url="http://localhost:3001/login"  # Update with your actual login URL
            )
            alumni_data['email_sent'] = email_sent
        except Exception as e:
            print(f"Failed to send email to {email}: {str(e)}")
            alumni_data['email_sent'] = False
            alumni_data['email_error'] = str(e)
    
    return alumni_data

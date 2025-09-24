import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import csv
import io
import time
from datetime import datetime
from typing import List, Dict, Any

class EmailService:
    def __init__(self):
        """Initialize Gmail SMTP Email Service"""
        self.smtp_server = "smtp.gmail.com"
        self.port = 587
        self.sender_email = "saisinare19@gmail.com"
        self.sender_password = "osav uoas bbgr xupg"  # App password
    
    def send_email(self, recipient_email: str, subject: str, text_content: str = None, html_content: str = None) -> bool:
        """
        Send email using Gmail SMTP
        
        Args:
            recipient_email (str): Recipient email address
            subject (str): Email subject
            text_content (str): Plain text content
            html_content (str): HTML content
        
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = self.sender_email
            message["To"] = recipient_email
            
            # Add text and HTML parts
            if text_content:
                text_part = MIMEText(text_content, "plain")
                message.attach(text_part)
            
            if html_content:
                html_part = MIMEText(html_content, "html")
                message.attach(html_part)
            
            # Create secure connection and send email
            context = ssl.create_default_context()
            with smtplib.SMTP(self.smtp_server, self.port) as server:
                server.starttls(context=context)
                server.login(self.sender_email, self.sender_password)
                server.sendmail(self.sender_email, recipient_email, message.as_string())
            
            return True
            
        except Exception as e:
            print(f"Error sending email to {recipient_email}: {str(e)}")
            return False
    
    def send_alumni_welcome_email(self, recipient_email: str, user_name: str, profile_url: str = "https://alumni.vit.edu/profile") -> bool:
        """
        Send alumni welcome email
        
        Args:
            recipient_email (str): Recipient email address
            user_name (str): Name of the user
            profile_url (str): URL to the user's profile
        
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        subject = "🎉 Welcome to VIT Alumni Portal - Account Created Successfully!"
        
        # Plain text version
        text_content = f"""
Dear {user_name},

Congratulations! Your account has been successfully created on the VIT Alumni Portal.

We are thrilled to welcome you to our vibrant alumni community! Your journey with VIT continues, and we're excited to have you as part of our growing network of accomplished graduates.

What's Next?
• Complete your profile to connect with fellow alumni
• Explore networking opportunities
• Stay updated with VIT news and events
• Access exclusive alumni resources

Please visit your profile to get started: {profile_url}

If you have any questions or need assistance, please don't hesitate to reach out to our support team.

Welcome aboard!

Best regards,
VIT Alumni Relations Team
Vellore Institute of Technology

---
This email was sent from the VIT Alumni Portal system.
Time: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
        """
        
        # Professional HTML version
        html_content = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to VIT Alumni Portal</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 1px;">
                        🎓 VIT Alumni Portal
                    </h1>
                    <p style="color: #e8f4fd; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
                        Vellore Institute of Technology
                    </p>
                </div>
                
                <!-- Main Content -->
                <div style="padding: 40px 30px;">
                    
                    <!-- Welcome Message -->
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="font-size: 60px; margin-bottom: 20px;">🎉</div>
                        <h2 style="color: #2c3e50; margin: 0; font-size: 24px; font-weight: 600;">
                            Congratulations, {user_name}!
                        </h2>
                        <p style="color: #7f8c8d; margin: 10px 0 0 0; font-size: 18px;">
                            Your account has been successfully created
                        </p>
                    </div>
                    
                    <!-- Welcome Text -->
                    <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; border-left: 4px solid #667eea; margin: 30px 0;">
                        <p style="color: #2c3e50; margin: 0; font-size: 16px; line-height: 1.6;">
                            We are <strong>thrilled</strong> to welcome you to our vibrant alumni community! Your journey with VIT continues, and we're excited to have you as part of our growing network of accomplished graduates.
                        </p>
                    </div>
                    
                    <!-- What's Next Section -->
                    <div style="margin: 30px 0;">
                        <h3 style="color: #2c3e50; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">
                            🚀 What's Next?
                        </h3>
                        <div style="background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 8px; overflow: hidden;">
                            <div style="padding: 15px 20px; border-bottom: 1px solid #e9ecef;">
                                <span style="color: #667eea; font-weight: 600;">✨</span>
                                <span style="color: #2c3e50; margin-left: 10px;">Complete your profile to connect with fellow alumni</span>
                            </div>
                            <div style="padding: 15px 20px; border-bottom: 1px solid #e9ecef;">
                                <span style="color: #667eea; font-weight: 600;">🤝</span>
                                <span style="color: #2c3e50; margin-left: 10px;">Explore networking opportunities</span>
                            </div>
                            <div style="padding: 15px 20px; border-bottom: 1px solid #e9ecef;">
                                <span style="color: #667eea; font-weight: 600;">📰</span>
                                <span style="color: #2c3e50; margin-left: 10px;">Stay updated with VIT news and events</span>
                            </div>
                            <div style="padding: 15px 20px;">
                                <span style="color: #667eea; font-weight: 600;">🎯</span>
                                <span style="color: #2c3e50; margin-left: 10px;">Access exclusive alumni resources</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 40px 0;">
                        <a href="{profile_url}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                            🔗 Visit Your Profile
                        </a>
                    </div>
                    
                    <!-- Support Section -->
                    <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 30px 0;">
                        <p style="color: #856404; margin: 0; font-size: 14px; text-align: center;">
                            <strong>Need Help?</strong> If you have any questions or need assistance, please don't hesitate to reach out to our support team.
                        </p>
                    </div>
                    
                </div>
                
                <!-- Footer -->
                <div style="background-color: #2c3e50; padding: 30px; text-align: center;">
                    <p style="color: #ecf0f1; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
                        Welcome aboard! 🚢
                    </p>
                    <p style="color: #bdc3c7; margin: 0 0 15px 0; font-size: 14px;">
                        Best regards,<br>
                        <strong>VIT Alumni Relations Team</strong><br>
                        Vellore Institute of Technology
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #34495e; margin: 20px 0;">
                    <p style="color: #95a5a6; margin: 0; font-size: 12px;">
                        This email was sent from the VIT Alumni Portal system.<br>
                        🕒 {datetime.now().strftime("%B %d, %Y at %I:%M %p")}
                    </p>
                </div>
                
            </div>
        </body>
        </html>
        """
        
        return self.send_email(recipient_email, subject, text_content, html_content)
    
    def send_alumni_credentials_email(self, recipient_email: str, user_name: str, username: str, password: str, login_url: str = "https://alumni.vit.edu/login") -> bool:
        """
        Send alumni account credentials email
        
        Args:
            recipient_email (str): Recipient email address
            user_name (str): Name of the user
            username (str): Login username
            password (str): Login password
            login_url (str): URL to login page
        
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        subject = "🔐 Your VIT Alumni Portal Account Credentials"
        
        # Plain text version
        text_content = f"""
Dear {user_name},

Welcome to the VIT Alumni Portal! Your account has been successfully created.

Your Login Credentials:
• Username: {username}
• Password: {password}
• Login URL: {login_url}

IMPORTANT SECURITY NOTICE:
For your security, please change your password after your first login.

Getting Started:
1. Visit the login page: {login_url}
2. Enter your username and password
3. Complete your profile information
4. Change your password in account settings

If you have any questions or need assistance, please contact our support team.

Best regards,
VIT Alumni Relations Team
Vellore Institute of Technology

---
This email contains sensitive information. Please keep it secure.
Time: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
        """
        
        # Professional HTML version
        html_content = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your VIT Alumni Portal Credentials</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 1px;">
                        🔐 VIT Alumni Portal
                    </h1>
                    <p style="color: #e8f4fd; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
                        Your Account Credentials
                    </p>
                </div>
                
                <!-- Main Content -->
                <div style="padding: 40px 30px;">
                    
                    <!-- Welcome Message -->
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="font-size: 60px; margin-bottom: 20px;">🎓</div>
                        <h2 style="color: #2c3e50; margin: 0; font-size: 24px; font-weight: 600;">
                            Welcome, {user_name}!
                        </h2>
                        <p style="color: #7f8c8d; margin: 10px 0 0 0; font-size: 18px;">
                            Your account has been successfully created
                        </p>
                    </div>
                    
                    <!-- Credentials Box -->
                    <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-radius: 10px; border: 2px solid #667eea; margin: 30px 0;">
                        <h3 style="color: #2c3e50; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; text-align: center;">
                            🔑 Your Login Credentials
                        </h3>
                        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <div style="margin-bottom: 15px;">
                                <strong style="color: #495057; display: inline-block; width: 100px;">Username:</strong>
                                <span style="color: #2c3e50; font-family: 'Courier New', monospace; background-color: #f8f9fa; padding: 4px 8px; border-radius: 4px;">{username}</span>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <strong style="color: #495057; display: inline-block; width: 100px;">Password:</strong>
                                <span style="color: #2c3e50; font-family: 'Courier New', monospace; background-color: #f8f9fa; padding: 4px 8px; border-radius: 4px;">{password}</span>
                            </div>
                            <div style="margin-bottom: 0;">
                                <strong style="color: #495057; display: inline-block; width: 100px;">Login URL:</strong>
                                <a href="{login_url}" style="color: #667eea; text-decoration: none;">{login_url}</a>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Security Notice -->
                    <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <div style="display: flex; align-items: center; margin-bottom: 10px;">
                            <span style="font-size: 24px; margin-right: 10px;">⚠️</span>
                            <h4 style="color: #856404; margin: 0; font-size: 16px; font-weight: 600;">
                                Important Security Notice
                            </h4>
                        </div>
                        <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.5;">
                            For your security, please <strong>change your password</strong> after your first login. Keep your credentials secure and do not share them with anyone.
                        </p>
                    </div>
                    
                    <!-- Getting Started -->
                    <div style="margin: 30px 0;">
                        <h3 style="color: #2c3e50; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">
                            🚀 Getting Started
                        </h3>
                        <div style="background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 8px; overflow: hidden;">
                            <div style="padding: 15px 20px; border-bottom: 1px solid #e9ecef;">
                                <span style="color: #667eea; font-weight: 600;">1️⃣</span>
                                <span style="color: #2c3e50; margin-left: 10px;">Visit the login page and enter your credentials</span>
                            </div>
                            <div style="padding: 15px 20px; border-bottom: 1px solid #e9ecef;">
                                <span style="color: #667eea; font-weight: 600;">2️⃣</span>
                                <span style="color: #2c3e50; margin-left: 10px;">Complete your profile information</span>
                            </div>
                            <div style="padding: 15px 20px; border-bottom: 1px solid #e9ecef;">
                                <span style="color: #667eea; font-weight: 600;">3️⃣</span>
                                <span style="color: #2c3e50; margin-left: 10px;">Change your password in account settings</span>
                            </div>
                            <div style="padding: 15px 20px;">
                                <span style="color: #667eea; font-weight: 600;">4️⃣</span>
                                <span style="color: #2c3e50; margin-left: 10px;">Start connecting with fellow alumni</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Login Button -->
                    <div style="text-align: center; margin: 40px 0;">
                        <a href="{login_url}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                            🚀 Login to Your Account
                        </a>
                    </div>
                    
                    <!-- Support -->
                    <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px; margin: 30px 0;">
                        <p style="color: #6c757d; margin: 0; font-size: 14px;">
                            Need help? Contact our support team at 
                            <a href="mailto:alumni@vit.edu" style="color: #667eea; text-decoration: none;">alumni@vit.edu</a>
                        </p>
                    </div>
                    
                </div>
                
                <!-- Footer -->
                <div style="background-color: #2c3e50; padding: 20px 30px; text-align: center;">
                    <p style="color: #bdc3c7; margin: 0; font-size: 12px;">
                        This email contains sensitive information. Please keep it secure.<br>
                        © 2024 Vellore Institute of Technology. All rights reserved.<br>
                        Time: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
                    </p>
                </div>
                
            </div>
        </body>
        </html>
        """
        
        return self.send_email(recipient_email, subject, text_content, html_content)
    
    def parse_csv_content(self, csv_content: str) -> List[Dict[str, str]]:
        """
        Parse CSV content and extract recipients
        
        Args:
            csv_content (str): CSV file content as string
        
        Returns:
            List[Dict[str, str]]: List of recipients with name and email
        """
        recipients = []
        
        try:
            csv_reader = csv.reader(io.StringIO(csv_content))
            
            # Check if first row is header
            first_row = next(csv_reader)
            if first_row[0].lower() == 'name' and first_row[1].lower() == 'email':
                # Skip header
                pass
            else:
                # First row is data, process it
                if len(first_row) >= 2:
                    recipients.append({
                        "name": first_row[0].strip(),
                        "email": first_row[1].strip()
                    })
            
            # Process remaining rows
            for row in csv_reader:
                if len(row) >= 2:
                    name = row[0].strip()
                    email = row[1].strip()
                    
                    # Basic email validation
                    if '@' in email and '.' in email:
                        recipients.append({
                            "name": name,
                            "email": email
                        })
                elif len(row) == 1:
                    # If only email is provided, use email as name
                    email = row[0].strip()
                    if '@' in email and '.' in email:
                        recipients.append({
                            "name": email.split('@')[0],  # Use part before @ as name
                            "email": email
                        })
            
            return recipients
            
        except Exception as e:
            print(f"Error parsing CSV: {str(e)}")
            return []
    
    def send_bulk_emails(self, recipients: List[Dict[str, str]], delay_seconds: int = 2) -> Dict[str, Any]:
        """
        Send bulk emails to multiple recipients
        
        Args:
            recipients (List[Dict[str, str]]): List of recipients with name and email
            delay_seconds (int): Delay between emails
        
        Returns:
            Dict[str, Any]: Results with success and failed counts
        """
        results = {
            "success": [],
            "failed": [],
            "total": len(recipients)
        }
        
        for i, recipient in enumerate(recipients):
            name = recipient['name']
            email = recipient['email']
            
            try:
                success = self.send_alumni_welcome_email(
                    recipient_email=email,
                    user_name=name,
                    profile_url=f"https://alumni.vit.edu/profile/{name.lower().replace(' ', '-')}"
                )
                
                if success:
                    results["success"].append({"name": name, "email": email})
                else:
                    results["failed"].append({"name": name, "email": email, "error": "Send failed"})
                
            except Exception as e:
                results["failed"].append({"name": name, "email": email, "error": str(e)})
            
            # Add delay between emails
            if i < len(recipients) - 1:
                time.sleep(delay_seconds)
        
        return results

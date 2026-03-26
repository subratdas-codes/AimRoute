from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
import os

conf = ConnectionConfig(
    MAIL_USERNAME="aimroute.noreply@gmail.com",
    MAIL_PASSWORD="dojxtanxhjeofita",
    MAIL_FROM="aimroute.noreply@gmail.com",
    MAIL_FROM_NAME="AimRoute",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)

async def send_reset_email(email: str, reset_link: str):
    message = MessageSchema(
        subject="AimRoute — Reset Your Password",
        recipients=[email],
        body=f"""
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
            <h2 style="color: #7c3aed;">Reset Your AimRoute Password</h2>
            <p>You requested a password reset. Click the button below to reset your password.</p>
            <a href="{reset_link}" 
               style="display:inline-block; background: linear-gradient(to right, #ec4899, #7c3aed);
                      color: white; padding: 12px 30px; border-radius: 8px; 
                      text-decoration: none; font-weight: bold; margin: 20px 0;">
                Reset Password
            </a>
            <p style="color: #999; font-size: 12px;">
                This link expires in 30 minutes. If you didn't request this, ignore this email.
            </p>
        </div>
        """,
        subtype="html"
    )
    fm = FastMail(conf)
    await fm.send_message(message)
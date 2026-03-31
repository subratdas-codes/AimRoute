# backend/app/utils/email_handler.py

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr

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


async def send_result_email(email: str, name: str, top_career: str, level: str, dashboard_url: str):
    level_labels = {
        "10th": "10th Grade",
        "12th": "12th Grade",
        "grad": "Graduation",
        "pg":   "Post Graduation",
    }
    level_display = level_labels.get(level, level.upper())

    message = MessageSchema(
        subject="🎉 Your AimRoute Career Result is Saved!",
        recipients=[email],
        body=f"""
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto;
                    background: #f9f5ff; border-radius: 16px; overflow: hidden;">

            <!-- Header -->
            <div style="background: linear-gradient(135deg, #7c3aed, #6366f1);
                        padding: 40px 32px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: -0.5px;">
                    🎉 Congratulations, {name}!
                </h1>
                <p style="color: rgba(255,255,255,0.85); margin: 10px 0 0; font-size: 15px;">
                    Your career result has been saved successfully.
                </p>
            </div>

            <!-- Body -->
            <div style="padding: 32px; background: white;">
                <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
                    Based on your <strong>{level_display}</strong> quiz, our AI has identified your
                    top career match:
                </p>

                <!-- Career highlight box -->
                <div style="background: linear-gradient(135deg, #ede9fe, #e0e7ff);
                            border-radius: 12px; padding: 20px 24px; margin: 20px 0;
                            border-left: 4px solid #7c3aed;">
                    <p style="margin: 0; color: #5b21b6; font-size: 13px; font-weight: 600;
                               text-transform: uppercase; letter-spacing: 0.5px;">
                        Your Best Career Match
                    </p>
                    <p style="margin: 8px 0 0; color: #1e1b4b; font-size: 22px; font-weight: 800;">
                        {top_career}
                    </p>
                </div>

                <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                    Visit your <strong>Dashboard</strong> to see your full career breakdown,
                    salary ranges, college suggestions, and your personalised roadmap.
                </p>

                <!-- Dashboard button -->
                <div style="text-align: center; margin: 32px 0;">
                    <a href="{dashboard_url}"
                       style="display: inline-block;
                              background: linear-gradient(135deg, #7c3aed, #6366f1);
                              color: white; padding: 14px 40px; border-radius: 50px;
                              text-decoration: none; font-weight: 700; font-size: 15px;
                              box-shadow: 0 4px 14px rgba(124,58,237,0.4);">
                        🚀 Go to My Dashboard
                    </a>
                </div>

                <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                    If the button doesn't work, copy this link into your browser:<br/>
                    <a href="{dashboard_url}" style="color: #7c3aed;">{dashboard_url}</a>
                </p>
            </div>

            <!-- Footer -->
            <div style="padding: 20px 32px; text-align: center; background: #f3f4f6;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    You're receiving this because you saved a quiz result on AimRoute.<br/>
                    © 2025 AimRoute · AI Career Guidance
                </p>
            </div>
        </div>
        """,
        subtype="html"
    )
    fm = FastMail(conf)
    await fm.send_message(message)
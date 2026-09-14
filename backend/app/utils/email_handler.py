import os
import socket
import smtplib
import threading
import traceback
from email.message import EmailMessage

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
MAIL_USERNAME = "aimroute.noreply@gmail.com"
MAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "")


def _build_mime(to: str, subject: str, html: str):
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = f"AimRoute <{MAIL_USERNAME}>"
    msg["To"] = to
    msg["Reply-To"] = MAIL_USERNAME
    msg.set_content("Please view this email in an HTML-capable client.")
    msg.add_alternative(html, subtype="html")
    return msg


def _smtp_send(to: str, subject: str, html: str, seconds: float = 30):
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=seconds) as server:
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        server.send_message(_build_mime(to, subject, html), from_addr=MAIL_USERNAME, to_addr=[to])


# ── Reset password email ───────────────────────────────────
def send_reset_email(email: str, reset_link: str):
    html = f"""
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
    """
    _smtp_send(email, "AimRoute - Reset Your Password", html)


def send_reset_email_background(email: str, reset_link: str):
    """Fire-and-forget the reset email on a daemon thread so the API responds instantly."""
    def _run():
        try:
            send_reset_email(email, reset_link)
            print(f"[Email] reset email SENT to {email}")
        except Exception as e:
            print(f"[Email] background reset-email send failed for {email}: {type(e).__name__}: {e}")
            print(traceback.format_exc())
    threading.Thread(target=_run, daemon=True).start()


# ── Result email ───────────────────────────────────────────
def send_result_email(email: str, name: str, top_career: str, level: str, dashboard_url: str):
    level_labels = {
        "10th": "10th Grade",
        "12th": "12th Grade",
        "grad": "Graduation",
        "pg":   "Post Graduation",
    }
    level_display = level_labels.get(level, level.upper())

    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto;
                background: #f9f5ff; border-radius: 16px; overflow: hidden;">

        <!-- Header -->
        <div style="background: linear-gradient(135deg, #7c3aed, #6366f1);
                    padding: 40px 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: -0.5px;">
                Congratulations, {name}!
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
                    Go to My Dashboard
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
                &copy; 2025 AimRoute &#183; AI Career Guidance
            </p>
        </div>
    </div>
    """
    _smtp_send(email, "Your AimRoute Career Result is Saved!", html)


def send_result_email_background(email: str, name: str, top_career: str, level: str, dashboard_url: str):
    """Fire-and-forget the result email on a daemon thread."""
    def _run():
        try:
            send_result_email(email, name, top_career, level, dashboard_url)
            print(f"[Email] result email SENT to {email}")
        except Exception as e:
            print(f"[Email] result email send failed for {email}: {type(e).__name__}: {e}")
            print(traceback.format_exc())
    threading.Thread(target=_run, daemon=True).start()


# ── Step-by-step diagnostic (for debugging SMTP issues) ────
def diagnose_email(to: str = None):
    results = {}

    try:
        infos = socket.getaddrinfo(SMTP_HOST, SMTP_PORT, socket.AF_INET, socket.SOCK_STREAM)
        results["dns"] = f"OK -> {infos[0][4][0]}"
    except Exception as e:
        results["dns"] = f"FAIL: {type(e).__name__}: {e}"
        return results

    server = None
    try:
        server = smtplib.SMTP(timeout=20)
        server.connect(SMTP_HOST, SMTP_PORT)
        results["connect"] = "OK"
    except Exception as e:
        results["connect"] = f"FAIL: {type(e).__name__}: {e}"
        return results

    try:
        code, _ = server.ehlo()
        results["ehlo"] = f"OK ({code})"
    except Exception as e:
        results["ehlo"] = f"FAIL: {type(e).__name__}: {e}"
        return results

    try:
        code, _ = server.starttls()
        results["starttls"] = f"OK ({code})"
        server.ehlo()
    except Exception as e:
        results["starttls"] = f"FAIL: {type(e).__name__}: {e}"
        return results

    try:
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        results["login"] = "OK"
    except Exception as e:
        results["login"] = f"FAIL: {type(e).__name__}: {e}"
        results["login_hint"] = "Check EMAIL_PASSWORD env var (16-char App Password, no spaces) and that 2-Step Verification is ON for the gmail account."
        try:
            server.quit()
        except Exception:
            pass
        return results

    if to:
        try:
            server.send_message(_build_mime(to, "AimRoute email diagnostic", "<p>AimRoute diagnostic test email.</p>"), from_addr=MAIL_USERNAME, to_addr=[to])
            results["send_to"] = f"OK -> {to}"
        except Exception as e:
            results["send_to"] = f"FAIL: {type(e).__name__}: {e}"

    try:
        server.quit()
    except Exception:
        pass
    return results
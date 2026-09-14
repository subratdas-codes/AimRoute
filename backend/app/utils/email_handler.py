import os
import json
import base64
import socket
import smtplib
import threading
import traceback
import urllib.request as urlrequest
import urllib.error as urlerror
import urllib.parse as urlparse
from email.message import EmailMessage

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
MAIL_USERNAME = os.getenv("MAIL_USERNAME") or "aimroute.noreply@gmail.com"
MAIL_PASSWORD = os.getenv("EMAIL_PASSWORD") or os.getenv("MAIL_PASSWORD") or ""
MAIL_FROM = os.getenv("MAIL_FROM") or MAIL_USERNAME
EMAIL_PROVIDER = os.getenv("EMAIL_PROVIDER", "").strip().lower()


def _provider_send(to: str, subject: str, html: str, seconds: float = 30):
    """Send via an HTTPS email API (port 443). Returns True on success."""
    if EMAIL_PROVIDER == "sendgrid":
        api_key = os.getenv("SENDGRID_API_KEY", "")
        payload = {
            "personalizations": [{"to": [{"email": to}]}],
            "from": {"email": MAIL_FROM, "name": "AimRoute"},
            "subject": subject,
            "content": [{"type": "text/html", "value": html}],
        }
        req = urlrequest.Request(
            "https://api.sendgrid.com/v3/mail/send",
            data=json.dumps(payload).encode(),
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            method="POST",
        )
    elif EMAIL_PROVIDER == "brevo":
        api_key = os.getenv("BREVO_API_KEY", "")
        payload = {
            "sender": {"email": MAIL_FROM, "name": "AimRoute"},
            "to": [{"email": to}],
            "subject": subject,
            "htmlContent": html,
        }
        req = urlrequest.Request(
            "https://api.brevo.com/v3/smtp/email",
            data=json.dumps(payload).encode(),
            headers={"api-key": api_key, "Content-Type": "application/json"},
            method="POST",
        )
    elif EMAIL_PROVIDER == "resend":
        api_key = os.getenv("RESEND_API_KEY", "")
        payload = {
            "from": f"AimRoute <{MAIL_FROM}>",
            "to": [to],
            "subject": subject,
            "html": html,
        }
        req = urlrequest.Request(
            "https://api.resend.com/emails",
            data=json.dumps(payload).encode(),
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            method="POST",
        )
    else:
        raise RuntimeError(f"Unknown EMAIL_PROVIDER: {EMAIL_PROVIDER!r}")

    try:
        with urlrequest.urlopen(req, timeout=seconds) as resp:
            return resp.status < 300
    except urlerror.HTTPError as e:
        detail = ""
        try:
            detail = e.read().decode("utf-8", "replace")[:500]
        except Exception:
            pass
        raise RuntimeError(f"{EMAIL_PROVIDER} API {e.code}: {detail}") from e


def _build_mime(to: str, subject: str, html: str):
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = f"AimRoute <{MAIL_FROM}>"
    msg["To"] = to
    msg["Reply-To"] = MAIL_USERNAME
    msg["Content-Type"] = "text/html"
    msg.set_content("Please view this email in an HTML-capable client.")
    msg.add_alternative(html, subtype="html")
    return msg


# ── Gmail API over HTTPS (works on Render's free tier) ─────
def _gmail_access_token(seconds: float = 30):
    data = urlparse.urlencode({
        "grant_type": "refresh_token",
        "client_id": os.getenv("GOOGLE_CLIENT_ID", ""),
        "client_secret": os.getenv("GOOGLE_CLIENT_SECRET", ""),
        "refresh_token": os.getenv("GOOGLE_REFRESH_TOKEN", ""),
    }).encode("ascii")
    req = urlrequest.Request("https://oauth2.googleapis.com/token", data=data,
                             headers={"Content-Type": "application/x-www-form-urlencoded"})
    try:
        with urlrequest.urlopen(req, timeout=seconds) as resp:
            body = json.loads(resp.read().decode("utf-8"))
    except urlerror.HTTPError as e:
        detail = ""
        try:
            detail = e.read().decode("utf-8", "replace")[:500]
        except Exception:
            pass
        raise RuntimeError(f"gmail token endpoint {e.code}: {detail}") from e
    if "access_token" not in body:
        raise RuntimeError(f"gmail token endpoint: {body}")
    return body["access_token"]


def _gmail_api_send(to: str, subject: str, html: str, seconds: float = 60):
    msg = _build_mime(to, subject, html)
    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode("ascii")
    token = _gmail_access_token(seconds)
    req = urlrequest.Request(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
        data=json.dumps({"raw": raw}).encode("utf-8"),
        headers={"Authorization": f"Bearer {token}",
                 "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urlrequest.urlopen(req, timeout=seconds) as resp:
            return resp.status < 300
    except urlerror.HTTPError as e:
        detail = ""
        try:
            detail = e.read().decode("utf-8", "replace")[:500]
        except Exception:
            pass
        raise RuntimeError(f"gmail API {e.code}: {detail}") from e


def _send_email(to: str, subject: str, html: str, seconds: float = 30):
    """Send over HTTPS if a provider is configured, else fall back to SMTP."""
    if EMAIL_PROVIDER == "gmail":
        _gmail_api_send(to, subject, html, seconds)
        return
    if EMAIL_PROVIDER:
        _provider_send(to, subject, html, seconds)
        return
    _smtp_send(to, subject, html, seconds)


def _smtp_send(to: str, subject: str, html: str, seconds: float = 30):
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=seconds) as server:
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        server.send_message(_build_mime(to, subject, html), from_addr=MAIL_FROM, to_addr=[to])


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
    _send_email(email, "AimRoute - Reset Your Password", html)


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
    _send_email(email, "Your AimRoute Career Result is Saved!", html)


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
def _probe(host, smtp_port, use_ssl, timeout=15):
    import ssl
    results = {}
    try:
        infos = socket.getaddrinfo(host, smtp_port, socket.AF_INET, socket.SOCK_STREAM)
        results["dns"] = f"OK -> {infos[0][4][0]}"
    except Exception as e:
        results["dns"] = f"FAIL: {type(e).__name__}: {e}"
        return results
    server = None
    try:
        if use_ssl:
            server = smtplib.SMTP_SSL(host, smtp_port, timeout=timeout, context=ssl.create_default_context())
            code, _ = server.ehlo()
            results["connect"] = f"OK (SSL, ehlo {code})"
        else:
            server = smtplib.SMTP(timeout=timeout)
            server.connect(host, smtp_port)
            results["connect"] = "OK"
            code, _ = server.ehlo()
            results["ehlo"] = f"OK ({code})"
            code, _ = server.starttls()
            results["starttls"] = f"OK ({code})"
            server.ehlo()
    except Exception as e:
        results["connect"] = f"FAIL: {type(e).__name__}: {e}"
        return results
    try:
        server.quit()
    except Exception:
        pass
    return results


def diagnose_email(to: str = None):
    pw = MAIL_PASSWORD
    client_id = os.getenv("GOOGLE_CLIENT_ID", "")
    refresh = os.getenv("GOOGLE_REFRESH_TOKEN", "")
    results = {
        "mail_config": {
            "provider": EMAIL_PROVIDER or "smtp(gmail)",
            "username": MAIL_USERNAME,
            "password_set": bool(pw),
            "password_length": len(pw),
            "password_has_spaces": " " in pw,
            "password_last4": pw[-4:] if pw else "(empty)",
            "from": MAIL_FROM,
            "gmail_api_client_id_set": bool(client_id),
            "gmail_api_client_id_len": len(client_id),
            "gmail_api_refresh_token_set": bool(refresh),
            "gmail_api_refresh_token_len": len(refresh),
        },
        "targets_tested_from_render": [
            "smtp.gmail.com:587 (STARTTLS)",
            "smtp.gmail.com:465 (SSL)",
            "smtp-relay.brevo.com:587",
            "smtp.sendgrid.net:587",
            "smtp.mailgun.org:587",
        ]
    }
    results["smtp.gmail.com:587"] = _probe("smtp.gmail.com", 587, use_ssl=False)
    results["smtp.gmail.com:465"] = _probe("smtp.gmail.com", 465, use_ssl=True)
    results["smtp-relay.brevo.com:587"] = _probe("smtp-relay.brevo.com", 587, use_ssl=False)
    results["smtp.sendgrid.net:587"] = _probe("smtp.sendgrid.net", 587, use_ssl=False)
    results["smtp.mailgun.org:587"] = _probe("smtp.mailgun.org", 587, use_ssl=False)

    google = results["smtp.gmail.com:465"].get("connect", "")
    if "FAIL" in google and "Network is unreachable" in google:
        results["verdict"] = ("Render's free tier blocks outbound SMTP to Gmail at the network layer. "
                              "No SMTP config (Gmail or any relay) will work from Render's free tier. "
                              "Fix: use an HTTPS email API (port 443) OR upgrade Render to a paid instance.")

    if EMAIL_PROVIDER == "gmail" and to:
        results["gmail_api_test"] = "attempted"
        try:
            _gmail_api_send(to, "AimRoute email diagnostic via Gmail API", "<p>This is a diagnostic test sent through the Gmail API (HTTPS).</p>")
            results["gmail_api_test"] = f"OK -> {to}"
        except Exception as e:
            results["gmail_api_test"] = f"FAIL: {type(e).__name__}: {e}"
    return results
"""
One-time Google/Gmail OAuth setup for AimRoute.

Generates the long-lived refresh token so the backend can send email via the
Gmail API over HTTPS (port 443) on Render's free tier.

Steps before running (Google Cloud Console):
  1. Create a project
  2. Enable "Gmail API"
  3. OAuth consent screen -> External -> fill app name + support emails,
     add scope https://www.googleapis.com/auth/gmail.send, add your Gmail
     address as a Test user
  4. Credentials -> Create credentials -> OAuth client ID -> "Desktop app"
     -> Download JSON. Copy client_id / client_secret into the prompts below.

Usage:
    python get_gmail_token.py

It prints the refresh token at the end. Put it on Render as GOOGLE_REFRESH_TOKEN
together with GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, and set EMAIL_PROVIDER=gmail.

NOTE: Refresh tokens from an app in "Testing" mode expire after 7 days.
      Re-run this script to get a fresh token. In Production mode they last
      indefinitely, but Google requires app verification for gmail.send.
"""

import json
import http.server
import threading
import urllib.parse
import urllib.request
import webbrowser
import sys

CLIENT_ID = input("client_id: ").strip()
CLIENT_SECRET = input("client_secret: ").strip()
SCOPE = "https://www.googleapis.com/auth/gmail.send"

received = {}
server = None


class Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        q = urllib.parse.urlparse(self.path)
        if q.path == "/callback":
            params = urllib.parse.parse_qs(q.query)
            received.update(params)
            body = b"<html><body><h3>Authorization complete! Close this tab.</h3></body></html>"
            self.send_response(200)
            self.send_header("Content-Type", "text/html")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, *args):
        pass


def main():
    global server
    httpd = http.server.HTTPServer(("127.0.0.1", 0), Handler)
    port = httpd.server_address[1]
    redirect_uri = f"http://127.0.0.1:{port}/callback"

    auth = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        "?client_id=" + urllib.parse.quote(CLIENT_ID) +
        "&redirect_uri=" + urllib.parse.quote(redirect_uri) +
        "&response_type=code"
        "&scope=" + urllib.parse.quote(SCOPE) +
        "&access_type=offline"
        "&prompt=consent"
    )
    print("\nOpening browser... sign in as aimroute.noreply@gmail.com and click Allow.\n")
    webbrowser.open(auth)

    threading.Thread(target=httpd.serve_forever, daemon=True).start()

    deadline = 300  # 5 minutes
    while "code" not in received and "error" not in received and deadline > 0:
        import time
        deadline -= 1
        time.sleep(1)

    if "error" in received:
        print("ERROR from Google:", received.get("error"))
        sys.exit(1)
    if "code" not in received:
        print("Timed out waiting for authorization.")
        sys.exit(1)

    code = received["code"][0]
    data = urllib.parse.urlencode({
        "code": code,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code",
    }).encode("ascii")

    req = urllib.request.Request("https://oauth2.googleapis.com/token", data=data,
                                 headers={"Content-Type": "application/x-www-form-urlencoded"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        token = json.loads(resp.read().decode("utf-8"))

    if "refresh_token" not in token:
        print("No refresh_token returned:", token)
        sys.exit(1)

    print("\n================= REFRESH TOKEN (copy whole line) =================")
    print(token["refresh_token"])
    print("===================================================================\n")
    print("Add to Render env: EMAIL_PROVIDER=gmail, GOOGLE_CLIENT_ID,")
    print("GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN=<above>")


if __name__ == "__main__":
    main()
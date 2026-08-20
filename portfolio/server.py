"""
portfolio_server.py
-------------------
A lightweight HTTP server for the OAM portfolio with:
  - Basic-Auth access control (only approved users can view the site)
  - Served from the same directory as this script
  - Python 3 standard library only — no pip installs needed

Usage:
    python server.py

Then open: http://localhost:8080
"""

import http.server
import base64
import os
import mimetypes
from functools import partial

# ─────────────────────────────────────────────
#  AUTHORISED USERS  (username : password)
#  Share one set of credentials per person.
# ─────────────────────────────────────────────
USERS = {
    "user1": "access2030",   # Person 1
    "user2": "access2030",   # Person 2
    "user3": "access2030",   # Person 3
}

PORT      = 8080
REALM     = "OAM Portfolio — Authorised Access Only"
SERVE_DIR = os.path.dirname(os.path.abspath(__file__))


def _encode(username: str, password: str) -> str:
    token = f"{username}:{password}"
    return base64.b64encode(token.encode()).decode()


# Pre-compute valid tokens for fast lookup
VALID_TOKENS = {_encode(u, p) for u, p in USERS.items()}


class AuthHandler(http.server.SimpleHTTPRequestHandler):

    def __init__(self, *args, directory=None, **kwargs):
        super().__init__(*args, directory=SERVE_DIR, **kwargs)

    # ── authentication check ──────────────────
    def _is_authorised(self) -> bool:
        auth_header = self.headers.get("Authorization", "")
        if not auth_header.startswith("Basic "):
            return False
        token = auth_header[len("Basic "):]
        return token in VALID_TOKENS

    def _request_auth(self):
        self.send_response(401)
        self.send_header("WWW-Authenticate", f'Basic realm="{REALM}"')
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        body = """
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8"/>
          <title>401 — Access Denied</title>
          <style>
            body { background:#020209; color:#00f5ff;
                   font-family:'Courier New',monospace;
                   display:flex; flex-direction:column;
                   align-items:center; justify-content:center;
                   height:100vh; margin:0; }
            h1 { font-size:3rem; margin-bottom:12px; }
            p  { color:#7e8ab8; }
          </style>
        </head>
        <body>
          <h1>[ 401 ]</h1>
          <p>Authorised access only. Please enter your credentials.</p>
        </body>
        </html>
        """.encode()
        self.wfile.write(body)

    # ── override GET / HEAD ───────────────────
    def do_GET(self):
        if not self._is_authorised():
            self._request_auth()
            return
        super().do_GET()

    def do_HEAD(self):
        if not self._is_authorised():
            self._request_auth()
            return
        super().do_HEAD()

    # ── clean log output ──────────────────────
    def log_message(self, fmt, *args):
        user = "unknown"
        auth = self.headers.get("Authorization", "")
        if auth.startswith("Basic "):
            try:
                decoded = base64.b64decode(auth[6:]).decode()
                user    = decoded.split(":")[0]
            except Exception:
                pass
        print(f"  [{self.log_date_time_string()}]  {user}  {fmt % args}")


if __name__ == "__main__":
    mimetypes.add_type("text/css",        ".css")
    mimetypes.add_type("application/javascript", ".js")

    handler = partial(AuthHandler, directory=SERVE_DIR)

    with http.server.ThreadingHTTPServer(("", PORT), handler) as httpd:
        print()
        print("  ╔══════════════════════════════════════════════╗")
        print("  ║   OAM PORTFOLIO SERVER  //  2030 CYBER       ║")
        print("  ╠══════════════════════════════════════════════╣")
        print(f"  ║   Local  :  http://localhost:{PORT}            ║")
        print(f"  ║   Serving:  {SERVE_DIR[:34]}  ║")
        print("  ║   Users  :  3 authorised accounts active     ║")
        print("  ╚══════════════════════════════════════════════╝")
        print()
        print("  Press Ctrl+C to stop the server.\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n  Server stopped.")

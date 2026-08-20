╔══════════════════════════════════════════════════════════════════╗
║        OAM PORTFOLIO  //  DEPLOYMENT GUIDE                       ║
║        Oluwatuyi Akinyemi Martins  —  2030 CYBER THEME           ║
╚══════════════════════════════════════════════════════════════════╝

PROJECT STRUCTURE
─────────────────
  portfolio/
  ├── index.html          ← Main portfolio page
  ├── style.css           ← 2030 cyber theme styles
  ├── script.js           ← Animations, interactions, canvas
  ├── server.py           ← Python HTTP server (Basic-Auth protected)
  ├── launch.bat          ← One-click launcher (double-click to start)
  ├── ngrok.yml           ← ngrok tunnel configuration
  ├── ACCESS_CODES.txt    ← Credentials to share with your 3 users
  └── README.txt          ← This file


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  QUICK START  (local preview — no internet required)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. Double-click  launch.bat
  2. Choose option [1] — Local only
  3. Browser opens at http://localhost:8080
  4. Login:  username = user1   password = access2030


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  SHARE WITH 3 PEOPLE  (public URL via ngrok)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  STEP 1 — Install ngrok (one-time)
  ───────────────────────────────────
    a. Go to https://ngrok.com and create a FREE account
    b. Download ngrok for Windows from:
       https://ngrok.com/download
    c. Extract ngrok.exe and place it in one of these locations:
         • C:\Windows\System32\          (works everywhere)
         • OR the portfolio\ folder      (works locally)

  STEP 2 — Add your ngrok authtoken (one-time)
  ─────────────────────────────────────────────
    a. Log in to https://dashboard.ngrok.com/auth
    b. Copy your Authtoken
    c. Open  ngrok.yml  in Notepad
    d. Replace  YOUR_NGROK_AUTHTOKEN  with your real token
       Example:
         authtoken: 2abc123XYZ_someRealTokenHere

  STEP 3 — Launch the tunnel
  ───────────────────────────
    a. Double-click  launch.bat
    b. Choose option [2] — Public URL
    c. The ngrok dashboard opens at http://127.0.0.1:4040
    d. Copy the HTTPS URL shown (looks like):
         https://a1b2c3d4.ngrok-free.app

  STEP 4 — Share with your 3 users
  ──────────────────────────────────
    Send each person ONLY their row from ACCESS_CODES.txt:

       URL:       https://xxxx.ngrok-free.app
       Username:  user1          (change per person)
       Password:  access2030

    They open the URL in any browser, enter credentials, done.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CUSTOMISING ACCESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Change usernames / passwords
  ─────────────────────────────
    Edit the USERS dict in  server.py :

      USERS = {
          "alice":   "mypassword1",
          "bob":     "mypassword2",
          "charlie": "mypassword3",
      }

    Then mirror the same changes in  ngrok.yml  under basic_auth:

      basic_auth:
        - "alice:mypassword1"
        - "bob:mypassword2"
        - "charlie:mypassword3"

    Restart launch.bat for changes to take effect.

  Change the port
  ────────────────
    Edit PORT = 8080  in server.py
    Edit addr: 8080   in ngrok.yml
    Both must match.

  Revoke access for one person
  ─────────────────────────────
    Remove their entry from USERS in server.py AND
    from basic_auth in ngrok.yml, then restart.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  IMPORTANT NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  • FREE ngrok plan  — The public URL CHANGES every time you restart
    the tunnel. You must re-send the new URL to your 3 users each
    session. Paid ngrok plans offer a fixed custom domain.

  • Your PC must stay ON and the server must keep running for the
    site to be accessible. Closing the terminal stops the server.

  • Two layers of auth are active simultaneously:
      Layer 1 — ngrok Basic Auth  (blocks at the tunnel entry)
      Layer 2 — server.py Auth    (blocks at the Python server)
    Both must pass. This means even if someone guesses the tunnel
    URL, they still cannot access the site without credentials.

  • Access log — Every request is printed in the server terminal
    window, including which username made the request.

  • The portfolio works fully offline (all assets are local).
    Only the Google Fonts and Font Awesome CDN links require
    an internet connection for full styling.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TROUBLESHOOTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Problem                         Solution
  ──────────────────────────────  ─────────────────────────────────
  "Python not found"              Install from https://python.org
                                  Tick "Add to PATH" during install

  "ngrok not found"               Place ngrok.exe in System32 or
                                  the portfolio folder

  Port 8080 already in use        Edit PORT in server.py to 8081
                                  and addr in ngrok.yml to 8081

  "Invalid authtoken"             Re-copy token from ngrok dashboard
                                  and update ngrok.yml

  Browser shows blank page        Make sure server.py is still
                                  running in its terminal window

  URL stopped working             Free ngrok URLs expire when the
                                  tunnel is closed. Relaunch and
                                  share the new URL.

══════════════════════════════════════════════════════════════════
  Built by Oluwatuyi Akinyemi Martins  //  2026
══════════════════════════════════════════════════════════════════

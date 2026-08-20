@echo off
title OAM Portfolio Server — 2030 CYBER
color 0B

echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║        OAM PORTFOLIO  //  DEPLOYMENT LAUNCHER        ║
echo  ╚══════════════════════════════════════════════════════╝
echo.

:: ── Check Python ─────────────────────────────────────────
python --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo  [ERROR] Python not found. Install from https://python.org
    pause
    exit /b 1
)

echo  [OK] Python detected.

:: ── Check ngrok ──────────────────────────────────────────
ngrok version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [WARN] ngrok not found in PATH.
    echo         Only local access will be available.
    echo         Download ngrok: https://ngrok.com/download
    echo.
    set NGROK_AVAILABLE=0
) else (
    echo  [OK] ngrok detected.
    set NGROK_AVAILABLE=1
)

echo.
echo  ┌──────────────────────────────────────────────────────┐
echo  │  Select launch mode:                                 │
echo  │                                                      │
echo  │   [1]  Local only   (http://localhost:8080)          │
echo  │   [2]  Public URL   (via ngrok — 3-person access)    │
echo  │   [3]  Exit                                          │
echo  └──────────────────────────────────────────────────────┘
echo.
set /p CHOICE="  Your choice: "

if "%CHOICE%"=="1" goto LOCAL
if "%CHOICE%"=="2" goto NGROK
if "%CHOICE%"=="3" goto END
echo  [ERROR] Invalid choice.
goto END

:: ──────────────────────────────────────────────────────────
:LOCAL
echo.
echo  [>>] Starting local server on http://localhost:8080
echo  [>>] Press Ctrl+C in the server window to stop.
echo.
start "OAM Portfolio — Local" python "%~dp0server.py"
timeout /t 2 >nul
start http://localhost:8080
goto END

:: ──────────────────────────────────────────────────────────
:NGROK
if "%NGROK_AVAILABLE%"=="0" (
    color 0C
    echo  [ERROR] ngrok is not installed. Cannot create public tunnel.
    echo         Download from: https://ngrok.com/download
    pause
    goto END
)
echo.
echo  [>>] Starting portfolio server in background...
start "OAM Portfolio — Server" python "%~dp0server.py"
timeout /t 2 >nul

echo  [>>] Starting ngrok tunnel with Basic Auth...
echo  [>>] Credentials: see ngrok.yml for usernames/passwords
echo.
:: Load ngrok config and start tunnel
start "OAM Portfolio — ngrok" ngrok start oam-portfolio --config "%~dp0ngrok.yml"
timeout /t 3 >nul

echo  [>>] Opening ngrok dashboard to copy your public URL...
start http://127.0.0.1:4040
echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║  Share the HTTPS URL from the ngrok dashboard        ║
echo  ║  along with the credentials in ACCESS_CODES.txt      ║
echo  ║  with your 3 authorised users.                       ║
echo  ╚══════════════════════════════════════════════════════╝
goto END

:: ──────────────────────────────────────────────────────────
:END
echo.
pause

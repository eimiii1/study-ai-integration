@echo off

setlocal
cd /d "%~dp0"
set "ROOT=%~dp0"

echo.
echo Installing dependencies for server and client
echo.

where python >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Python isn't on PATH. Install Python 3.12+ and re-run this.
    pause
    exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
    echo [ERROR] npm isn't on PATH. Install Node.js and re-run this.
    pause
    exit /b 1
)

if exist "server\.env" goto backend

echo [WARNING] server\.env is missing, so the backend will fail to start.
echo           Create it first - see docs\setup.md, "Backend" step 5,
echo           for the DATABASE_URL / SECRET_KEY / JWT_SECRET_KEY / GROQ_API_KEY
echo           values it needs.
echo.
set /p CONTINUE="Continue anyway and just start the frontend? [y/N] "
if /i "%CONTINUE%"=="y" goto frontend
exit /b 1

:backend
echo [1/4] Setting up the backend...
cd /d "%ROOT%server"

if exist "venv" goto venv_ready
echo       Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo [ERROR] Failed to create the virtual environment.
    pause
    exit /b 1
)

:venv_ready
call venv\Scripts\activate.bat

echo       Installing Python dependencies...
pip install -r requirements.txt -q
if errorlevel 1 (
    echo [ERROR] pip install failed - see the output above.
    pause
    exit /b 1
)

echo       Seeding the furniture catalog...
python seed_furniture.py

start "BuildScape - backend (Flask)" cmd /k "cd /d "%ROOT%server" && call venv\Scripts\activate.bat && python app.py"

cd /d "%ROOT%"

:frontend
echo [2/4] Setting up the frontend...
cd /d "%ROOT%client"

echo       Installing npm dependencies (this can take a minute the first time)...
call npm install
if errorlevel 1 (
    echo [ERROR] npm install failed - see the output above.
    pause
    exit /b 1
)

echo       Starting the Vite dev server...
start "BuildScape - frontend (Vite)" cmd /k "cd /d "%ROOT%client" && npm run dev"

cd /d "%ROOT%"

echo.
echo [3/4] Backend and frontend are starting in their own windows.
echo [4/4] Vite will print the local URL to open (usually http://localhost:5173).
echo.
echo You can close THIS window - it isn't running anything itself.
pause
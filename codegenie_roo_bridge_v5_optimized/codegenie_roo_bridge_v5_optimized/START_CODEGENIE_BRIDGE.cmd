@echo off
setlocal
cd /d "%~dp0"

call "%~dp0BRIDGE_CREDENTIALS.cmd"

if "%CODEGENIE_ADID%"=="" goto :badcreds
if "%CODEGENIE_APIKEY%"=="" goto :badcreds
if /I "%CODEGENIE_ADID%"=="YOUR_ADID" goto :badcreds
if /I "%CODEGENIE_APIKEY%"=="YOUR_CODEGENIE_API_KEY" goto :badcreds

if "%PY%"=="" set "PY=C:\CompanyGenAIBridge\.venv\Scripts\python.exe"

if not exist "%PY%" (
  echo.
  echo ERROR: Python was not found:
  echo %PY%
  echo Edit PY in BRIDGE_CREDENTIALS.cmd if required.
  echo.
  pause
  exit /b 1
)

"%PY%" "%~dp0launcher.py"

if errorlevel 1 (
  echo.
  echo The bridge exited with an error.
  pause
)
exit /b

:badcreds
echo.
echo FIRST-TIME SETUP
echo ----------------
echo Open BRIDGE_CREDENTIALS.cmd and enter your own ADID and CodeGenie API key.
echo Save the file, then double-click START_CODEGENIE_BRIDGE.cmd again.
echo.
pause

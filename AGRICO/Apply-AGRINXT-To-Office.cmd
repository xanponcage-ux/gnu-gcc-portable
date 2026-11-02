@echo off
setlocal
node "%~dp0transfer\apply-office.cjs" %*
exit /b %errorlevel%

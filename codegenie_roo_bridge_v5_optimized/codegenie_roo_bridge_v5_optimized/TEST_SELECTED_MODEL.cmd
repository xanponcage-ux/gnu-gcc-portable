@echo off
echo ===== HEALTH =====
curl.exe -sS "http://127.0.0.1:8765/health"
echo.
echo.
echo ===== CHAT =====
curl.exe -sS -X POST "http://127.0.0.1:8765/v1/chat/completions" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer dummy" ^
  -d "{\"model\":\"ignored-by-launcher\",\"messages\":[{\"role\":\"user\",\"content\":\"Reply exactly BRIDGE_V5_OK\"}]}"
echo.
pause

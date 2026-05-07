@echo off
echo Starting DevForge OS...
docker compose up --build -d
echo.
echo DevForge OS is starting!
echo --------------------------------------------------
echo Frontend:     http://localhost:5173
echo Backend API:  http://localhost:8000/docs
echo Microservice: http://localhost:5001/health
echo --------------------------------------------------
pause

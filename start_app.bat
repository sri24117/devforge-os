@echo off
echo 🚀 Starting DevForge OS in Detached Mode...
docker-compose up -d
echo.
echo ✅ App is running in the background!
echo 🌐 Frontend: http://localhost:5173
echo 📂 API Docs: http://localhost:8000/docs
echo.
echo 💡 To stop the app later, run: docker-compose down
pause

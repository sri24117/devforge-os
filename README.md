# 🛠️ DevForge OS — Professional AI-Powered Interview Prep

**DevForge OS** is a high-performance, full-stack platform designed to simulate FAANG-level interview experiences. It features a polyglot microservice architecture with FastAPI, Flask, PostgreSQL, and Redis, all orchestrated via Docker.

---

## 📐 Architecture

- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS
- **Primary Backend**: FastAPI (Python 3.12) - Handles core logic and persistence.
- **Microservice**: Flask (Python) - Acts as a proxy for AI (Gemini) and scrapers.
- **Database**: PostgreSQL 16
- **Cache**: Redis 7 (Caching & Rate Limiting)
- **Deployment**: Docker Compose

---

## 🧰 Prerequisites

Before setting up on a new machine, ensure you have the following installed:

1.  **Git**: [Download Git](https://git-scm.com/)
2.  **Docker Desktop**: [Download Docker](https://www.docker.com/products/docker-desktop/)

---

## 🚀 Quick Start (Installation & Setup)

Follow these steps to get the app running on a new laptop:

### 1. Clone the Repository
```bash
git clone https://github.com/sri24117/devforge-os.git
cd devforge-os
```

### 2. Configure Environment Variables
Copy the template and add your API key:
```bash
cp .env.example .env
```
Open the `.env` file and find the line:
`GEMINI_API_KEY=your_gemini_api_key_here`

Replace `your_gemini_api_key_here` with your real Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 3. Build and Start the App
Ensure Docker Desktop is running, then execute:
```bash
docker-compose up --build
```
*Note: The first build might take a few minutes as it downloads dependencies.*

### 4. Verify the Services
Once the build is complete, the following services will be available:
- **Frontend (Web App)**: [http://localhost:5173](http://localhost:5173)
- **FastAPI Docs (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Microservice (Flask)**: [http://localhost:5001/health](http://localhost:5001/health)

---

## 🔑 Default Login Credentials
The system is pre-seeded with a default developer account:

- **Email**: `dev@devforge.local`
- **Password**: `devforge123`

---

## 🛠️ Common Commands

| Task | Command |
| :--- | :--- |
| **Start App** | `docker-compose up` |
| **Stop App** | `docker-compose down` |
| **Full Reset (Wipe DB)** | `docker-compose down -v` |
| **View Backend Logs** | `docker-compose logs -f backend` |
| **Access Database** | `docker exec -it devforge_postgres psql -U devforge` |

---

## 🐞 Troubleshooting

- **Database Connection Error**: If the backend starts faster than Postgres, just wait a moment or restart with `docker-compose restart backend`.
- **Port Conflict**: Ensure ports 5173, 8000, 5001, 5432, and 6379 are not being used by other applications.
- **AI Not Responding**: Double-check your `GEMINI_API_KEY` in the `.env` file.

---

*Built with ❤️ for High-Performance Interview Prep.*

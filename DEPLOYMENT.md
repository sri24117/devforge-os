# 🚀 Production Deployment Guide (Linux VPS / Hostinger)

This guide explains how to deploy **DevForge OS** to a standard Linux VPS (Ubuntu 22.04/24.04 recommended) using Docker Compose and Nginx.

---

## 1. 🖥️ Server Preparation

Log in to your VPS via SSH and run these commands to install Docker and Nginx:

```bash
# Update System
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Nginx & Certbot (for SSL)
sudo apt install -y nginx certbot python3-certbot-nginx
```

---

## 2. 📂 Project Setup

```bash
# Clone the repository
git clone https://github.com/sri24117/devforge-os.git
cd devforge-os

# Create Production Environment File
cp .env.example .env

# Edit .env with production values
nano .env
```

**Production `.env` Checklist:**
- [ ] `GEMINI_API_KEY`: Your real API Key.
- [ ] `SECRET_KEY`: Generate a long random string (`openssl rand -hex 32`).
- [ ] `ALLOWED_ORIGINS`: Set to `https://your-frontend-domain.com`.
- [ ] `VITE_API_URL`: Set to `https://api.your-domain.com`.

---

## 3. 🐳 Launch the Stack

Run the containers in detached (background) mode:

```bash
docker-compose up --build -d
```

---

## 4. 🌐 Nginx Reverse Proxy Setup

Nginx will act as the gatekeeper, routing traffic from the internet to your Docker containers.

Create a new config file:
`sudo nano /etc/nginx/sites-available/devforge`

Paste this configuration (Replace `yourdomain.com` with your actual domain):

```nginx
server {
    server_name yourdomain.com; # Frontend Domain

    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    server_name api.yourdomain.com; # Backend Domain

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable the config and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/devforge /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 5. 🔒 SSL Encryption (HTTPS)

Secure your domains with free SSL certificates from Let's Encrypt:

```bash
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

---

## 📈 Maintenance & Monitoring

- **View Logs**: `docker-compose logs -f --tail=100`
- **Update App**:
  ```bash
  git pull origin main
  docker-compose up --build -d
  ```
- **Backup Database**:
  ```bash
  docker exec devforge_postgres pg_dump -U devforge devforge > backup.sql
  ```

---

*Deploying to a VPS gives you full control and zero limits. Good luck!*

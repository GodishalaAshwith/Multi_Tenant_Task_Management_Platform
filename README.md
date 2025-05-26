# Multi-Tenant Task Management Platform

A full-stack task management platform with multi-tenant support, built with React, Node.js, and MongoDB.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Server Setup](#server-setup)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Database Migration](#database-migration)
- [CI/CD Pipeline](#cicd-pipeline)

## Prerequisites

### Development Environment

- Node.js 20.x or later
- MongoDB 6.0 or later
- Docker and Docker Compose
- Git

### Production Environment

- Ubuntu 22.04 LTS or later
- Docker Engine 24.x or later
- Docker Compose 2.x or later
- Nginx (for reverse proxy)
- SSL Certificate (for HTTPS)

### Target Computer Setup (Docker)

#### Windows Setup

1. Install Docker Desktop for Windows from [Docker Hub](https://www.docker.com/products/docker-desktop)
2. Extract the project archive (project*export*\*.zip)
3. Open PowerShell and navigate to the project directory
4. Set up the environment:

   ```powershell
   # Copy environment example file
   Copy-Item .env.example .env

   # Edit the environment file with your values
   notepad .env
   ```

5. Import and use the management module:

   ```powershell
   # Import management module
   Import-Module .\docker-utils.psm1

   # Start all services
   Start-Services

   # Check services status
   Get-ServicesStatus

   # View service logs
   Get-ServiceLogs -Service frontend
   Get-ServiceLogs -Service backend
   ```

#### Linux Setup

1. Install Docker and Docker Compose:

   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh

   # Add your user to docker group
   sudo usermod -aG docker $USER

   # Log out and log back in for changes to take effect
   ```

2. Extract the project archive and set up:

   ```bash
   # Extract archive
   unzip project_export_*.zip -d task-platform
   cd task-platform

   # Set up environment
   cp .env.example .env
   nano .env
   ```

3. Start the services:
   ```bash
   # Start application and monitoring
   docker compose up -d
   docker compose -f docker-compose.monitoring.yml up -d
   ```

#### Accessing the Application

After successful setup, access the following URLs:

- Frontend Application: http://localhost
- Backend API: http://localhost:5000
- Grafana Dashboard: http://localhost:3000 (default login: admin/admin)
- Prometheus Metrics: http://localhost:9090

#### Troubleshooting Docker Setup

1. If containers fail to start:

   ```powershell
   # Check container logs
   Get-ServiceLogs -Service backend
   Get-ServiceLogs -Service mongodb

   # Restart services
   Stop-Services
   Start-Services
   ```

2. If ports are already in use:

   - Edit docker-compose.yml to change the port mappings
   - Restart the services

3. Common issues:
   - Ensure Docker Desktop is running (Windows)
   - Check if required ports (80, 5000, 3000, 9090) are available
   - Verify environment variables in .env file
   - Ensure sufficient disk space for containers and volumes

## Server Setup

### 1. Base Server Configuration

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y docker.io docker-compose nginx certbot python3-certbot-nginx

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group
sudo usermod -aG docker $USER
```

### 2. Clone Repository

```bash
# Clone the repository
git clone <repository-url>
cd multi-tenant-task-platform

# Copy environment files
cp .env.production .env
```

### 3. SSL Certificate Setup

```bash
# Install SSL certificate using Let's Encrypt
sudo certbot --nginx -d yourdomain.com
```

### 4. Nginx Configuration

Create `/etc/nginx/sites-available/task-platform`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables

### Backend Environment Variables

| Variable       | Description                     | Example                                 |
| -------------- | ------------------------------- | --------------------------------------- |
| MONGO_URI      | MongoDB connection string       | mongodb://mongodb:27017/multi_tenant_db |
| JWT_SECRET     | Secret key for JWT tokens       | your-secret-key                         |
| EMAIL_USER     | Email for sending notifications | app@yourdomain.com                      |
| EMAIL_PASSWORD | Email app password              | your-app-password                       |
| NODE_ENV       | Node environment                | production                              |
| PORT           | Server port                     | 5000                                    |
| FRONTEND_URL   | Frontend application URL        | https://yourdomain.com                  |

### Frontend Environment Variables

| Variable     | Description     | Example                    |
| ------------ | --------------- | -------------------------- |
| VITE_API_URL | Backend API URL | https://yourdomain.com/api |

## Deployment

### Using Docker Compose

1. Build and start containers:

```bash
docker-compose -f docker-compose.yml up -d --build
```

2. Monitor logs:

```bash
docker-compose logs -f
```

3. Scale services (if needed):

```bash
docker-compose up -d --scale backend=3
```

### Manual Deployment

1. Backend:

```bash
cd backend
npm install
npm run build
npm start
```

2. Frontend:

```bash
cd frontend
npm install
npm run build
```

## Database Migration

### Initial Setup

```bash
# Create migration directory
mkdir -p backend/migrations

# Install migration tool
npm install -g migrate-mongo
```

### Creating Migrations

```bash
# Generate new migration
migrate-mongo create add-user-roles

# Apply migrations
migrate-mongo up

# Rollback migrations
migrate-mongo down
```

Example migration script (backend/migrations/YYYYMMDDHHMMSS-add-user-roles.js):

```javascript
module.exports = {
  async up(db) {
    await db
      .collection("users")
      .updateMany({ role: { $exists: false } }, { $set: { role: "member" } });
  },

  async down(db) {
    await db
      .collection("users")
      .updateMany({ role: "member" }, { $unset: { role: "" } });
  },
};
```

## CI/CD Pipeline

### GitHub Actions Configuration

Create `.github/workflows/main.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "20"

      # Backend tests
      - name: Backend Tests
        run: |
          cd backend
          npm ci
          npm test

      # Frontend tests
      - name: Frontend Tests
        run: |
          cd frontend
          npm ci
          npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Deploy to production
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/task-platform
            git pull
            docker-compose -f docker-compose.yml up -d --build
```

### Monitoring and Maintenance

1. Set up monitoring:

```bash
# Install monitoring stack
docker-compose -f docker-compose.monitoring.yml up -d
```

2. Regular maintenance:

```bash
# Backup database
docker exec mongodb mongodump --out /backup/$(date +%Y%m%d)

# Update containers
docker-compose pull
docker-compose up -d

# Cleanup
docker system prune -af
```

## Security Best Practices

1. Keep all packages updated
2. Regularly rotate JWT secrets
3. Use strong passwords and secure them properly
4. Enable rate limiting
5. Implement request validation
6. Use HTTPS everywhere
7. Regular security audits
8. Monitor for suspicious activities

## Backup and Recovery

1. Database backups:

```bash
# Automated daily backups
0 0 * * * docker exec mongodb mongodump --out /backup/$(date +%Y%m%d)

# Restore from backup
docker exec mongodb mongorestore --drop /backup/YYYYMMDD
```

2. Container data:

```bash
# Backup volumes
docker run --rm -v task-platform_mongodb_data:/data -v /backup:/backup alpine tar czf /backup/mongodb-data.tar.gz /data
```

## Troubleshooting

Common issues and solutions:

1. Container fails to start:

```bash
# Check container logs
docker-compose logs [service_name]

# Verify environment variables
docker-compose config
```

2. Database connection issues:

```bash
# Check MongoDB status
docker exec mongodb mongosh --eval "db.adminCommand('ping')"
```

3. Frontend not loading:

```bash
# Verify nginx configuration
docker exec frontend nginx -t

# Check nginx logs
docker exec frontend tail -f /var/log/nginx/error.log
```

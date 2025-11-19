# Cloud Deployment Guide

This guide provides instructions for deploying the Health & Fitness Planner using Docker to common cloud providers.

## Prerequisites

- Docker installed locally
- Git installed
- Accounts on the respective cloud platforms (Render, AWS, etc.)

## Option 1: Deploying to Render (Easiest)

Render provides excellent support for Dockerized applications.

### 1. Database (PostgreSQL)
1. Create a new **PostgreSQL** database on Render.
2. Copy the `Internal Database URL` (for internal networking) or `External Database URL`.

### 2. Backend Service
1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. Select the `backend` directory as the **Root Directory**.
4. Choose **Docker** as the Runtime.
5. Add the following **Environment Variables**:
   - `DATABASE_URL`: The URL from step 1.
   - `SECRET_KEY`: Your secure secret key.
   - `CORS_ORIGINS`: `https://your-frontend-url.onrender.com` (you'll get this after deploying frontend)
   - `FIRST_SUPERUSER`: `admin@example.com`
   - `FIRST_SUPERUSER_PASSWORD`: `securepassword`
6. Deploy the service.

### 3. Frontend Service
1. Create a new **Web Service** (or Static Site if you prefer building locally, but Docker is recommended for consistency).
2. Connect your GitHub repository.
3. Select the `frontend` directory as the **Root Directory**.
4. Choose **Docker** as the Runtime.
5. Deploy the service.

**Note:** You may need to update the `nginx.conf` or the frontend's API URL configuration to point to your deployed backend URL (`https://your-backend-service.onrender.com`).

## Option 2: Deploying to AWS EC2 (Manual Docker Compose)

### 1. Launch Instance
1. Launch an **Ubuntu 22.04** EC2 instance (t2.micro is fine for testing, t3.small recommended for prod).
2. Allow traffic on ports `80` (HTTP), `443` (HTTPS), and `22` (SSH) in the Security Group.

### 2. Install Docker & Compose
SSH into your instance and run:
```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose
sudo usermod -aG docker $USER
# Log out and log back in for group changes to take effect
```

### 3. Deploy
1. Clone your repository:
   ```bash
   git clone https://github.com/yourusername/health-and-fitness-planner.git
   cd health-and-fitness-planner
   ```
2. Create a `.env` file with your production secrets:
   ```bash
   nano .env
   # Paste your variables: SECRET_KEY, POSTGRES_PASSWORD, etc.
   ```
3. Build and run:
   ```bash
   docker-compose up -d --build
   ```

### 4. Access
Your app should now be accessible at your EC2 instance's public IP or DNS name.

## CI/CD Integration
The included `.github/workflows/main.yml` will automatically run tests on every push. To enable auto-deployment, you can add a step to the workflow to push your Docker images to Docker Hub or ECR, and then trigger a webhook on Render or SSH into your EC2 instance to pull the new images.

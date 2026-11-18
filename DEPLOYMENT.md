# CampusFlow: Production Cloud Deployment Guide

This guide provides instructions to deploy **CampusFlow** to live production environments at zero cost using **Vercel** (for the React 18 SPA frontend) and **Render** or **Railway** (for the Spring Boot backend, Node.js/TypeScript outbound service, and MySQL database).

---

## 1. Architecture in Production

```
Users / Hiring Manager
       │
       ▼
[ Vercel CDN ] ──► Serves React 18 SPA (HTTPS: https://campusflow.vercel.app)
       │ (REST APIs)
       ├─────────────────────────────────┐
       ▼                                 ▼
[ Render Web Service ]          [ Render Web Service ]
CampusFlow Core Engine          Outbound Campaign Engine
(Java 21 / Spring Boot 3)       (Node.js / TypeScript 5)
       │                                 │
       └────────────────┬────────────────┘
                        ▼
               [ Cloud MySQL 8 ]
            (Aiven / Railway / TiDB)
```

---

## 2. Step 1: Provision a Free Cloud MySQL Database

CampusFlow requires a standard MySQL 8.0 instance with InnoDB support. You can provision a free cloud database in under 2 minutes:

### Option A: Aiven for MySQL (Recommended - 100% Free Tier)
1. Go to [https://aiven.io/](https://aiven.io/) and create a free account.
2. Click **Create Service** -> Select **MySQL**.
3. Choose the **Free Plan** and select your preferred region (e.g., AWS / Google Cloud).
4. Once provisioned, copy the connection details:
   - **Host** (e.g., `mysql-xxxx.aivencloud.com`)
   - **Port** (e.g., `12345`)
   - **Database Name** (`defaultdb` or create `campusflow_db`)
   - **Username** (`avnadmin`)
   - **Password** (`<generated-password>`)

---

## 3. Step 2: Deploy Frontend to Vercel (2 Minutes)

Vercel provides instant global CDN deployment for Vite React applications with automatic SSL:

1. Push your latest code to your GitHub repository:
   ```bash
   git push origin main
   ```
2. Navigate to [https://vercel.com/](https://vercel.com/) and sign in with GitHub.
3. Click **Add New...** -> **Project**.
4. Select the `CampusFlow` repository and click **Import**.
5. Configure the project settings:
   - **Root Directory**: Click *Edit* and select **`frontend`**.
   - **Framework Preset**: Vite (detected automatically).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variable:
   - `VITE_API_TARGET`: Set this to your live backend URL (or leave blank initially, then update once backend is live).
7. Click **Deploy**.
8. Within 45 seconds, your frontend is live with an official URL like:
   `https://campusflow.vercel.app` (or `https://campusflow-premgouda.vercel.app`).

> **Note on Client-Side Routing:** CampusFlow includes a pre-configured `frontend/vercel.json` file that rewrites all paths (`/*`) to `/index.html`, ensuring that direct navigation or refreshing pages like `/student/dashboard` never produces 404 errors.

---

## 4. Step 3: Deploy Backend Services to Render

CampusFlow includes a multi-service `render.yaml` Blueprint file for automatic configuration.

### Option A: Using the Render Blueprint (One-Click)
1. Go to [https://render.com/](https://render.com/) and connect your GitHub account.
2. Click **New +** -> **Blueprint**.
3. Connect your `premgouda1916/CampusFlow` repository.
4. Render will parse `render.yaml` and configure:
   - `campusflow-backend` (Docker web service for Java 21)
   - `campusflow-outbound` (Docker web service for Node.js/TypeScript)
5. Fill in the database environment variables (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`) with your cloud MySQL credentials.
6. Click **Apply**.

### Option B: Manual Web Service Setup on Render
If you prefer configuring services manually on Render:
1. **New Web Service** -> Connect repo.
2. Set **Root Directory** to `backend`.
3. Set **Runtime** to **Docker**.
4. Set Environment Variables:
   - `SPRING_PROFILES_ACTIVE`: `prod`
   - `SERVER_PORT`: `8081`
   - `DB_HOST`: `<your-cloud-mysql-host>`
   - `DB_PORT`: `<your-cloud-mysql-port>`
   - `DB_NAME`: `campusflow_db`
   - `DB_USERNAME`: `<your-mysql-user>`
   - `DB_PASSWORD`: `<your-mysql-password>`
   - `JWT_SECRET`: `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970`
   - `JWT_EXPIRATION_MS`: `86400000`
5. Click **Create Web Service**.

---

## 5. Live Portfolio Links Template for Job Application

Once deployed, copy your live URLs into your application submission:

```text
Project: CampusFlow (Smart Campus Placement & Recruitment Management Platform)
Live Frontend: https://campusflow-premgouda.vercel.app
Live Backend API: https://campusflow-backend.onrender.com
Live Outbound Service API: https://campusflow-outbound.onrender.com
GitHub Repository: https://github.com/premgouda1916/CampusFlow
Demo Credentials:
  - Student: arjun.sharma@campusflow.com / password123
  - Recruiter: recruiter.google@campusflow.com / password123
  - Placement Officer: officer@campusflow.com / password123
```

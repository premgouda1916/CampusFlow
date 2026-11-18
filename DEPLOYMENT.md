# CampusFlow: 100% Free Production Deployment Guide
## (Verified Zero-Cost Stack: No Credit Card Required)

This guide documents the verified **100% free hosting stack** for CampusFlow. Many platforms (like Railway, Heroku, PlanetScale, and Aiven) have discontinued or limited their free tiers. The stack below is tested, requires **zero dollars**, and **no credit card** to set up.

---

## The Verified Zero-Cost Production Stack

| Component | Platform | Free Tier Quota | Credit Card Required? |
|---|---|---|---|
| **Frontend** (React 18 SPA) | **Vercel** (Hobby Plan) | 100 GB Bandwidth/mo, unlimited deployments, automatic SSL | **NO** |
| **Database** (MySQL 8.0) | **TiDB Cloud Serverless** | 5 GiB Storage, 50 Million Request Units (RUs)/mo, 5 free clusters | **NO** |
| **Backend Core** (Java 21 / Spring Boot) | **Render** (Free Web Service) | 750 Free Compute Hours/mo, 512 MB RAM, automatic HTTPS | **NO** |
| **Outbound Engine** (Node.js / TS) | **Koyeb** (Eco Free) or **Render** | 512 MB RAM, 2 free web services, automatic HTTPS | **NO** |

---

## Step 1: Provision a 100% Free Cloud MySQL Database (TiDB Cloud)
*Time required: 2 minutes*

**TiDB Cloud Serverless** is 100% wire-compatible with MySQL 8.0 (works out-of-the-box with Spring Data JPA and Node.js `mysql2`).

1. Go to [https://tidbcloud.com/](https://tidbcloud.com/) and click **Sign Up** (Sign in with GitHub).
2. Choose **Serverless (Free Tier)**:
   - Cluster Name: `campusflow-db`
   - Cloud Provider & Region: Select AWS / Oregon or Singapore (choose region closest to you).
   - Root Password: Generate and save your password securely.
3. Click **Create**.
4. In the cluster overview, click **Connect**:
   - Connection Type: Choose **General** or **Java / Spring Boot**.
   - Note down:
     - **Host**: e.g., `gateway01.ap-southeast-1.prod.aws.tidbcloud.com`
     - **Port**: `4000` (standard TiDB/MySQL port)
     - **Database**: `test` (or create `campusflow_db`)
     - **Username**: e.g., `2XXXXX.root`
     - **Password**: `<your-saved-password>`
     - **SSL**: Enabled by default (`useSSL=true`).

---

## Step 2: Deploy Frontend on Vercel (100% Free Forever)
*Time required: 2 minutes*

Vercel provides free global CDN hosting for Vite React applications:

1. Push your latest code to your GitHub repository:
   ```bash
   git push origin main
   ```
2. Go to [https://vercel.com/](https://vercel.com/) and sign in with GitHub.
3. Click **Add New...** -> **Project** -> Select `CampusFlow`.
4. Configure the project:
   - **Root Directory**: Click *Edit* and select **`frontend`**.
   - **Framework Preset**: Vite (detected automatically).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**.
6. Within 45 seconds, your frontend is live at a URL like:
   `https://campusflow-premgouda.vercel.app`

> **SPA Client-Side Routing:** CampusFlow includes [`frontend/vercel.json`](frontend/vercel.json) pre-configured with rewrites (`/* -> /index.html`). You can refresh routes like `/student/dashboard` or `/recruiter/jobs` without encountering 404 errors.

---

## Step 3: Deploy Java 21 / Spring Boot Backend on Render (100% Free)
*Time required: 3 minutes*

Render provides 750 free compute hours each month (enough to run 1 service 24/7 all month without paying):

1. Go to [https://render.com/](https://render.com/) and sign up with GitHub.
2. Click **New +** -> **Web Service**.
3. Select your GitHub repository: `premgouda1916/CampusFlow`.
4. Configure the service:
   - **Name**: `campusflow-backend`
   - **Root Directory**: `backend`
   - **Runtime**: **Docker** (Render will automatically detect [`backend/Dockerfile`](backend/Dockerfile))
   - **Instance Type**: **Free** (512 MB RAM / 0.1 CPU)
5. Add the following **Environment Variables**:
   - `SPRING_PROFILES_ACTIVE`: `prod`
   - `SERVER_PORT`: `8081`
   - `DB_HOST`: `<your-tidb-host>` (from Step 1)
   - `DB_PORT`: `4000` (or your TiDB port)
   - `DB_NAME`: `test` (or `campusflow_db`)
   - `DB_USERNAME`: `<your-tidb-username>`
   - `DB_PASSWORD`: `<your-tidb-password>`
   - `JWT_SECRET`: `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970`
   - `JWT_EXPIRATION_MS`: `86400000`
6. Click **Create Web Service**.
7. Render will build the Docker container and deploy it to a live HTTPS URL:
   `https://campusflow-backend.onrender.com`

---

## Step 4: Connect Frontend to Backend

1. In your **Vercel** dashboard, go to your `CampusFlow` project -> **Settings** -> **Environment Variables**.
2. Add:
   - `VITE_API_TARGET`: `https://campusflow-backend.onrender.com`
3. Click **Save** and trigger a quick redeploy (Deployments -> Redeploy).
4. Now your live Vercel frontend talks directly to your live Render backend!

---

## Crucial Free Tier Behaviors to Know (No Surprises!)

1. **Idle Spin-Down on Render Free Tier:**
   - Free services on Render automatically spin down (sleep) after **15 minutes of inactivity**.
   - When a user (or recruiter) visits your live site after it has been asleep, the first request takes about **40–50 seconds** to wake up the Java Spring Boot container. Once awake, all subsequent requests are instant.
   - *Tip:* Before an interview or demo, open the backend URL in your browser 1 minute early to warm up the container!
2. **JVM Memory Optimization:**
   - We pre-configured [`backend/Dockerfile`](backend/Dockerfile) with:
     ```dockerfile
     ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=60.0 -XX:+UseSerialGC -Xss512k -XX:CICompilerCount=2"
     ```
     This ensures Spring Boot operates safely within the **512 MB RAM** free limit without being killed by the container orchestrator.
3. **Monthly Free Hours Limit (Render):**
   - Render gives **750 free instance hours per month**. Since a 31-day month has 744 hours, running your 1 backend service is 100% covered. If the limit is reached, Render temporarily suspends the service until the 1st of the next month—**it will never bill your card unexpectedly**.

# CampusFlow: Smart Campus Placement & Recruitment Management Platform

[![Java 21](https://img.shields.io/badge/Java-21_LTS-ED8B00?style=flat-square&logo=openjdk&logoColor=white)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot 3.3](https://img.shields.io/badge/Spring_Boot-3.3.4-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Node.js](https://img.shields.io/badge/Node.js-20_LTS-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MySQL 8](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Redis](https://img.shields.io/badge/Redis-7.0-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker Compose](https://img.shields.io/badge/Docker_Compose-Supported-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

**CampusFlow** is an enterprise-grade full-stack platform designed to modernize the campus placement and recruitment ecosystem. It replaces fragmented spreadsheets, manual notice boards, and unverified candidate lists with an automated, role-governed state machine connecting **Students**, **Corporate Recruiters**, **Placement Officers**, and **Administrators**.

The platform is architected as a polyglot system combining:
1. **Core Placement Engine** (`backend`): Enterprise Java 21 / Spring Boot 3 service handling transactional workflows, Spring Security JWT authentication, and a dynamic student eligibility evaluation engine.
2. **Outbound Campaign & Notification Engine** (`services/outbound-service`): High-throughput Node.js & TypeScript microservice with MySQL connection pooling, managing automated outbound candidate marketing, batch announcements, and communication delivery analytics.
3. **Responsive Web Frontend** (`frontend`): React 18 SPA built with Vite and Tailwind CSS, featuring route-level code splitting (reducing initial bundle payload by 90%), dark spatial UI design, and interactive Recharts analytics.

---

## Architecture Overview

```
                                 +--------------------------------+
                                 |          React 18 SPA          |
                                 |   (Vite, Tailwind CSS, Dark    |
                                 |    Spatial UI, Code Splitting) |
                                 +---------------+----------------+
                                                 |
                       +-------------------------+-------------------------+
                       | HTTPS / REST                                      | HTTPS / REST
                       v                                                   v
        +------------------------------+                    +------------------------------+
        |   CampusFlow Core Service    |                    |   Outbound Campaign Engine   |
        |   (Java 21 / Spring Boot 3)  |                    |   (Node.js / TypeScript 5)   |
        +--------------+---------------+                    +--------------+---------------+
                       |                                                   |
       +---------------+---------------+                                   |
       |               |               |                                   |
       v               v               v                                   v
+--------------+ +-----------+ +---------------+                   +---------------+
|   Spring     | |   Redis   | |  Spring Data  |                   |  MySQL Pool   |
|   Security   | |   Cache   | |      JPA      |                   | (mysql2 /     |
| (JWT / RBAC) | | (Aside)   | | (Hibernate 6) |                   |  Promise)     |
+--------------+ +-----+-----+ +-------+-------+                   +-------+-------+
                       |               |                                   |
                       +---------------+-----------------+-----------------+
                                                         |
                                                         v
                                              +---------------------+
                                              |       MySQL 8       |
                                              | Relational Database |
                                              +---------------------+
```

---

## Key Modules & Engineering Features

### 1. Dynamic Eligibility Evaluation Engine (`backend`)
Unlike standard boolean status checks, CampusFlow features a decoupled, rules-driven `EligibilityEngine` service:
- Evaluates four independent predicates: CGPA cutoff, active backlog threshold, target discipline set containment, and graduation batch year.
- Computes aggregate candidate match percentages and individual criteria pass/fail states.
- Returns comprehensive feedback enabling students to see precisely which criteria they meet or miss before applying.

### 2. Outbound Marketing & Campaign Service (`services/outbound-service`)
A dedicated Node.js + TypeScript service that drives targeted student recruitment campaigns:
- **Audience Segmentation**: Queries candidate pools dynamically from MySQL matching specific department, CGPA, or manual applicant cohorts.
- **Template Parser**: Mustache-style variable interpolation (`{{studentName}}`, `{{companyName}}`, `{{packageLpa}}`) with input sanitization.
- **Throttled Batch Dispatcher**: Processes notifications in chunked batches with configurable latency controls to prevent downstream gateway throttling.
- **Campaign Analytics**: Tracks real-time delivery percentages, sent counts, and failure reasons.

### 3. Concurrency & Data Integrity
- **Duplicate Application Prevention**: Multi-layered defense using service-layer validation and a composite database constraint (`UNIQUE KEY uk_student_job (student_id, job_id)`).
- **Recruitment State Machine**: Strictly validates candidate status progression:
  ```
  APPLIED -> SHORTLISTED -> INTERVIEW_SCHEDULED -> OFFERED -> ACCEPTED / DECLINED
          \-> REJECTED / WITHDRAWN
  ```
- **Redis Cache-Aside**: Read-heavy job listings and analytics endpoints are cached with a 15-minute TTL; mutating operations trigger selective or full eviction via `@CacheEvict`.

### 4. Web Performance & Optimization (`frontend`)
- **Route-Based Lazy Loading**: All 23 view routes are dynamically imported via `React.lazy()` and `<Suspense>`, reducing initial JavaScript payload from **806 KB to 85 KB (30 KB gzipped)**.
- **Vendor Chunking**: Configured Rollup manual chunking isolating React core, Recharts visualization, and Lucide icons into separate cacheable vendor bundles.
- **Axios HTTP Interceptor**: Centralized request interceptor attaching JWT bearer tokens and response interceptor gracefully handling 401 token expirations.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS, Lucide React, Recharts, Axios, React Router 6 |
| **Backend Core** | Java 21, Spring Boot 3.3.4, Spring Data JPA, Hibernate 6, Spring Security 6, JWT, BCrypt, Maven |
| **Outbound Engine** | Node.js 20, TypeScript 5.7, Express 4, Zod, mysql2, Winston, Vitest, Supertest |
| **Database** | MySQL 8.0 (InnoDB, ACID transactions, Foreign Keys, B-Tree Indexes) |
| **Caching** | Redis 7.0 (In-Memory Key-Value Cache, TTL-based eviction) |
| **DevOps & Cloud** | Docker, Docker Compose, Multi-stage builds, Nginx, Render Blueprint, Vercel |

---

## Database Architecture

The schema contains 15 relational tables with strict foreign key constraints and secondary indexing:

- `users`: Core identity, password hash, role (`STUDENT`, `RECRUITER`, `PLACEMENT_OFFICER`, `ADMIN`), active status.
- `students`: USN, department, verified CGPA, backlog count, graduation year, resume URL.
- `companies` & `recruiters`: Corporate profiles, industry, verification status, contact details.
- `jobs` & `job_criteria`: Job designations, salary packages, deadline, eligibility rules.
- `applications`: Student job submissions with recruitment status enum and submission timestamps.
- `interviews`: Scheduled rounds (Aptitude, Technical, HR), meeting URLs, feedback.
- `placement_offers`: Formal compensation offers, joining dates, acceptance status.
- `audit_logs`: Transactional audit stream logging user operations with IP tracking.
- `outbound_campaigns`, `outbound_templates`, `outbound_campaign_recipients`: Outbound marketing lifecycle tables.

---

## Getting Started

### Option A: Run with Docker Compose (Recommended)

Start the complete full-stack environment with a single command:

```bash
docker-compose up --build -d
```

This starts:
- MySQL 8.0 on `localhost:3306`
- Redis 7.0 on `localhost:6379`
- Spring Boot Backend on `http://localhost:8081`
- Outbound Campaign Service on `http://localhost:4000`
- React Frontend (Nginx) on `http://localhost:80` (or `http://localhost:3000`)

---

### Option B: Local Bare-Metal Setup

#### 1. Prerequisites
- Java 21 JDK
- Node.js 20+ & npm
- MySQL 8.0 & Redis installed and running locally

#### 2. Database Initialization
Create the database and user in MySQL:
```sql
CREATE DATABASE campusflow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'campusflow_user'@'localhost' IDENTIFIED BY 'campusflow_secret';
GRANT ALL PRIVILEGES ON campusflow_db.* TO 'campusflow_user'@'localhost';
FLUSH PRIVILEGES;
```

#### 3. Start Core Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
*Runs on `http://localhost:8081`.*

#### 4. Start Outbound Campaign Service (Node.js + TypeScript)
```bash
cd services/outbound-service
npm install
npm run dev
```
*Runs on `http://localhost:4000`.*

#### 5. Start Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
*Runs on `http://localhost:5173`.*

---

## Seed Credentials for Testing

| Role | Email | Password | Access Scope |
|---|---|---|---|
| **Student** | `arjun.sharma@campusflow.com` | `password123` | Profile, Jobs Explorer, Eligibility Check, Applications, Offers |
| **Recruiter** | `recruiter.google@campusflow.com` | `password123` | Company Profile, Job Postings, Candidate Shortlisting, Interviews |
| **Placement Officer** | `officer@campusflow.com` | `password123` | Institutional Analytics, Recruiter Approvals, Drives, CSV Export |
| **Administrator** | `admin@campusflow.com` | `password123` | Global User Management, Master Department Data, Audit Trail |

---

## Automated Testing

### Backend Unit & Integration Tests (JUnit 5, Mockito, MockMvc)
```bash
cd backend
mvn test
```
*Result: 22 tests run, 0 failures, 0 errors.*

### Outbound Service Unit & Integration Tests (Vitest, Supertest)
```bash
cd services/outbound-service
npm test
```
*Result: 6 tests run, 6 passed.*

### Frontend Production Build Verification
```bash
cd frontend
npm run build
```
*Result: 23 lazy-loaded chunks compiled with 0 warnings.*

---

## Production Deployment Guide

Detailed step-by-step instructions for hosting CampusFlow live at zero cost (Frontend on **Vercel**, Backend & Outbound Engine on **Render**, Database on **Aiven/Railway**) can be found in [DEPLOYMENT.md](DEPLOYMENT.md).

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

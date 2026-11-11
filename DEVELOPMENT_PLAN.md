# CampusFlow - Development Plan & Execution Tracker

## Project Overview
**CampusFlow** is an enterprise-grade Smart Campus Placement & Recruitment Management Platform connecting Students, Recruiters, Placement Officers, and Administrators.

---

## Phased Development Strategy

### Phase 1: Planning, Architecture & Project Scaffolding
- [x] Initial workspace analysis and environment verification
- [x] Create comprehensive `DEVELOPMENT_PLAN.md`
- [x] Create system architecture documentation `ARCHITECTURE.md`
- [x] Design relational database schema and entity relationship documentation (`docs/database-design.md`)
- [x] Create `.gitignore` and `.env.example`
- [ ] Initialize Spring Boot 3.x project with Java 21, Maven, Lombok, JPA, Security, Actuator, Flyway, Redis, OpenAPI

### Phase 2: Database Schema & Core Entities
- [ ] Write Flyway database migration `V1__init_schema.sql` (MySQL 8 compatible)
- [ ] Create JPA Entities:
  - `User`, `Department`, `Student`, `Company`, `Recruiter`, `PlacementDrive`
  - `Job`, `Application`, `ApplicationStatusHistory`, `Interview`, `Offer`
  - `Notification`, `AuditLog`
- [ ] Implement JPA Repositories with custom queries and indexing
- [ ] Implement database seed data `V2__seed_data.sql` with realistic initial records for all 4 roles

### Phase 3: Authentication, Security & RBAC
- [ ] Spring Security 6.x configuration with stateless JWT authentication filter
- [ ] Password encoder (`BCryptPasswordEncoder`)
- [ ] JWT Utility (token generation, claims, signing, expiration, validation)
- [ ] Custom `UserDetailsService` and `SecurityUserPrincipal`
- [ ] Auth DTOs (`LoginRequest`, `RegisterStudentRequest`, `RegisterRecruiterRequest`, `AuthResponse`, `PasswordResetRequest`)
- [ ] Global Exception Handler with `@RestControllerAdvice` and standard `ApiResponse<T>` / `ErrorResponse`
- [ ] Implement Auth Controller (`/api/v1/auth/*`)
- [ ] Role-based authorization verification (`STUDENT`, `RECRUITER`, `PLACEMENT_OFFICER`, `ADMIN`)

### Phase 4: Core Domain Services & APIs
- [ ] **Student Service & Controller**:
  - Profile retrieval & update
  - Academic details & skills management
  - Resume upload handling (validated file size/type, stored securely)
  - Student dashboard statistics
- [ ] **Company & Recruiter Service & Controller**:
  - Company profile management & multi-recruiter support
  - Recruiter registration & approval status checks
  - Placement Officer / Admin verification workflow
- [ ] **Job Posting & Placement Drive Service & Controller**:
  - Job CRUD (Draft, Published, Closed, Cancelled)
  - Ownership validation (Recruiter can only manage own company jobs)
  - Pagination, sorting, and multi-criteria filtering
- [ ] **Dynamic Eligibility Engine**:
  - Reusable rule-based engine: `CgpaRule`, `BacklogRule`, `DepartmentRule`, `GraduationYearRule`, `SkillMatchRule`, `DeadlineRule`
  - Detailed evaluation result with pass/fail breakdown, missing skills, and detailed feedback
  - `/api/v1/jobs/{id}/eligibility` & batch candidate pre-screening

### Phase 5: Recruitment Workflows (Applications, Interviews, Offers)
- [ ] **Application Management**:
  - Application submission with atomic eligibility validation
  - Duplicate application prevention (DB constraint + lock)
  - Application status tracking & status history logging
  - Shortlisting & rejection by recruiters
- [ ] **Interview Management**:
  - Interview scheduling (rounds: Aptitude, Tech 1, Tech 2, HR, Final)
  - Mode (Online / In-Person), venue/link, instructions
  - Interview status and candidate feedback recording
- [ ] **Offer Management**:
  - Offer generation with package, designation, joining date, expiry
  - Student acceptance / rejection actions
  - Offer letter tracking
- [ ] **Notification System**:
  - In-app notification creation on critical lifecycle events
  - Read/unread tracking, mark-all-read endpoint
- [ ] **Audit Logging System**:
  - Automatic audit interceptor for audit events (`LOGIN`, `JOB_CREATE`, `STATUS_CHANGE`, `OFFER_ISSUE`)

### Phase 6: Advanced Backend (Caching, Analytics & Actuator)
- [ ] Redis caching for frequently accessed jobs and dashboard metrics
- [ ] Cache invalidation on job/application mutations
- [ ] Real database calculation for role-specific dashboards:
  - Student analytics (applied, shortlisted, upcoming interviews, offers)
  - Recruiter analytics (jobs, applicants, interview stats, offers)
  - Placement Officer analytics (placement %, avg package, dept-wise stats, company stats)
  - Admin analytics (users, recruiters, drives, system activity)
- [ ] CSV Export for placement reports
- [ ] OpenAPI / Swagger documentation (`/swagger-ui.html`)

### Phase 7: Modern React Frontend (Vite + Tailwind / Clean SaaS UI)
- [ ] Initialize Vite React application with Router, Lucide icons, Recharts, Axios
- [ ] Design System & Layouts:
  - Clean Linear/Stripe aesthetic: sidebar, top navbar, responsive mobile drawer
  - Card components, badges, modal dialogs, empty states, loading skeletons
  - Global Notification / Toast system
- [ ] Auth & Context:
  - `AuthContext` (JWT storage, login, logout, role checks)
  - Role-protected routes (`ProtectedRoute`, `RoleRoute`)
- [ ] Public Pages:
  - Landing Page, About Page, Login, Student Register, Recruiter Register, Forgot Password
- [ ] Student Portal:
  - Student Dashboard, Profile & Academic Details, Resume Upload, Job Explorer, Eligibility Modal/Report, My Applications, Interviews, Offers, Notifications
- [ ] Recruiter Portal:
  - Recruiter Dashboard, Company Profile, Job Management (Create/Edit/Publish), Applicant Review & Shortlisting, Interview Scheduling, Offer Issuing, Analytics
- [ ] Placement Officer & Admin Portals:
  - Placement Analytics Dashboard with Recharts (Dept-wise, Company-wise, Placement Rate)
  - Recruiter & Company Approvals
  - Student Directory
  - Placement Drive Management
  - CSV Report Export
  - Admin User & Role Management, Audit Log Viewer

### Phase 8: Testing, Verification & Hardening
- [ ] Backend Unit & Integration Tests (JUnit 5, Mockito, Spring Boot Test, MockMvc)
  - Auth, Eligibility Engine, Application workflow, Job management
- [ ] Frontend Build & Test Verification
- [ ] End-to-End Workflow Testing:
  - Student complete journey
  - Recruiter posting to offer journey
  - Placement Officer verification & drive management
- [ ] Verification of all role restrictions and edge cases

### Phase 9: Docker, DevOps & Portfolio Packaging
- [ ] Backend Dockerfile (Multi-stage build)
- [ ] Frontend Dockerfile (Vite build + Nginx)
- [ ] Docker Compose orchestration (`campusflow-backend`, `campusflow-frontend`, `campusflow-mysql`, `campusflow-redis`)
- [ ] Comprehensive `README.md` with architectural diagrams, screenshots, API reference, run instructions
- [ ] Final verification and handoff report


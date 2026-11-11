# CampusFlow - System Architecture Documentation

## 1. Architectural Philosophy & Overview
CampusFlow is engineered as a high-performance, modular monolithic enterprise application. It adheres to Domain-Driven Design (DDD) principles and Clean Architecture, separating web concerns, business logic, persistence, and external system integrations.

```
+-------------------------------------------------------------------+
|                        React Frontend (Vite)                      |
| (Student Portal | Recruiter Portal | Officer Portal | Admin Dash) |
+---------------------------------+---------------------------------+
                                  | HTTPS / JSON (REST)
                                  v
+-------------------------------------------------------------------+
|                   Spring Boot 3 REST API Gateway                  |
|                 (Security Filter Chain, JWT Auth)                 |
+---------------------------------+---------------------------------+
                                  |
    +-----------------------------+-----------------------------+
    |                             |                             |
    v                             v                             v
+------------------+     +------------------+     +------------------+
|   Auth & User    |     |  Student Domain  |     | Recruiter/Company|
|     Module       |     |      Module      |     |      Module      |
+------------------+     +------------------+     +------------------+
    |                             |                             |
    +-----------------------------+-----------------------------+
    |                             |                             |
    v                             v                             v
+------------------+     +------------------+     +------------------+
|  Job & Drives    |     |Dynamic Eligibility|    |   Application    |
|      Module      |     |      Engine      |     |  Workflow Module |
+------------------+     +------------------+     +------------------+
    |                             |                             |
    +-----------------------------+-----------------------------+
    |                             |                             |
    v                             v                             v
+------------------+     +------------------+     +------------------+
|    Interview     |     |      Offer       |     |  Analytics &     |
|   Coordination   |     |    Management    |     |  Audit Logging   |
+------------------+     +------------------+     +------------------+
                                  |
            +---------------------+---------------------+
            |                                           |
            v                                           v
+-----------------------+                   +-----------------------+
|  MySQL 8 (Hibernate)  |                   |   Redis 7 (Caching)   |
| (Relational Storage)  |                   |  (Jobs & Aggregates)  |
+-----------------------+                   +-----------------------+
```

---

## 2. Layered Backend Architecture

### 2.1 Controller Layer (`com.campusflow.controller`)
- Exposes versioned RESTful APIs under `/api/v1/*`.
- Responsible solely for request deserialization, JSR-380 (`jakarta.validation`) validation, role checking via `@PreAuthorize`, and dispatching to services.
- Never directly accesses JPA Entities or Repositories; always consumes and returns DTOs wrapped in standard `ApiResponse<T>`.

### 2.2 Service Layer (`com.campusflow.service`)
- Enforces core business invariants, permissions, and complex workflows.
- Implements declarative transaction demarcation using `@Transactional(readOnly = true/false)`.
- Dispatches notifications and records audit logs upon state transitions.

### 2.3 Dynamic Eligibility Engine (`com.campusflow.service.eligibility`)
- Modular rule-based evaluator implementing `EligibilityRule` interfaces.
- Evaluates Student vs Job across:
  - CGPA requirement
  - Allowed active backlogs
  - Eligible departments
  - Graduation batch year
  - Required skills overlap
  - Application deadline adherence
  - Prior submission status
- Produces a comprehensive `EligibilityEvaluationResult` specifying passed/failed rules, missing skill tokens, and human-readable rejection reasons.

### 2.4 Data Access Layer (`com.campusflow.repository`)
- Spring Data JPA repositories with optimized JPQL, native queries, and custom specifications for multi-column filtering.
- Index-optimized queries for high-volume recruitment search and analytics.

### 2.5 Security & JWT Filter Chain (`com.campusflow.security`)
- Stateless authentication using HMAC-SHA256 signed JWT tokens.
- `JwtAuthenticationFilter` intercepts requests, extracts the bearer token, parses claims, and populates the `SecurityContextHolder`.
- Granular RBAC supporting roles:
  - `ROLE_STUDENT`
  - `ROLE_RECRUITER`
  - `ROLE_PLACEMENT_OFFICER`
  - `ROLE_ADMIN`

### 2.6 Centralized Exception Handling (`com.campusflow.exception`)
- `@RestControllerAdvice` catching `ResourceNotFoundException`, `BadRequestException`, `ForbiddenException`, `DuplicateResourceException`, `MethodArgumentNotValidException`, and `OptimisticLockingFailureException`.
- Uniform error JSON payload:
  ```json
  {
    "success": false,
    "status": 400,
    "error": "BAD_REQUEST",
    "message": "Student does not meet minimum CGPA requirements (7.50 required, 6.80 actual)",
    "timestamp": "2026-11-11T10:30:00Z",
    "validationErrors": []
  }
  ```

---

## 3. Caching Strategy with Redis
- Frequently accessed public/published jobs (`/api/v1/jobs`) and dashboard aggregate statistics are cached in Redis.
- Cache keys use namespaced patterns (e.g. `jobs::list`, `analytics::placement`).
- Explicit cache eviction via `@CacheEvict` when jobs are published, updated, or when placement outcomes are confirmed.

---

## 4. Frontend Architecture
- **Framework**: React 18+ bootstrapped with Vite.
- **Routing**: React Router v6 with declarative nested routes and Role Route guards.
- **State Management**: React Context (`AuthContext`, `NotificationContext`) + custom hooks (`useAuth`, `useApi`, `useToast`).
- **Styling**: Tailwind CSS / modern CSS tokens following a refined slate & indigo aesthetic inspired by Linear and Stripe.
- **Visualizations**: Recharts for dynamic charts (bar charts for department placements, area charts for application trends, pie charts for status breakdown).


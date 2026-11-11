# CampusFlow – REST API Specification

This document provides complete documentation for the REST API of the **CampusFlow** Smart Campus Placement & Recruitment Management Platform.

- **Base URL**: `http://localhost:8081/api/v1`
- **Interactive Swagger UI**: `http://localhost:8081/swagger-ui.html`
- **OpenAPI 3.0 JSON Spec**: `http://localhost:8081/v3/api-docs`

---

## 1. Authentication & Security Model

CampusFlow utilizes stateless JWT (JSON Web Token) authentication with HMAC-SHA256 signatures.

### HTTP Header Requirements
For all protected endpoints, the client must include the following Authorization header:
```http
Authorization: Bearer <jwt-access-token>
Content-Type: application/json
```

### Standard Response Envelope
All API endpoints return responses encapsulated in a unified envelope:
```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": { ... },
  "timestamp": "2026-11-11T12:00:00"
}
```

### Standard Error Envelope
On failure (e.g. 400, 401, 403, 404, 409, 422, 500):
```json
{
  "success": false,
  "message": "Detailed description of the validation or business rule violation.",
  "data": null,
  "timestamp": "2026-11-11T12:00:00"
}
```

---

## 2. API Endpoints by Module

### A. Authentication & User Profile (`/api/v1/auth`)

#### 1. Student Registration
- **Route**: `POST /api/v1/auth/student/register`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "student.new@campusflow.edu",
  "password": "password123",
  "fullName": "Kavya Ramesh",
  "usn": "1MS21CS099",
  "phone": "+91 98765 43210",
  "departmentId": 1,
  "collegeName": "Ramaiah Institute of Technology",
  "graduationYear": 2026,
  "cgpa": 8.75,
  "backlogs": 0,
  "skills": "Java, Spring Boot, React, MySQL"
}
```
- **Response**: `201 Created`
```json
{
  "success": true,
  "message": "Student registered successfully.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "type": "Bearer",
    "userId": 9,
    "email": "student.new@campusflow.edu",
    "fullName": "Kavya Ramesh",
    "role": "STUDENT"
  }
}
```

#### 2. Recruiter Registration
- **Route**: `POST /api/v1/auth/recruiter/register`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "recruiter@innovatech.com",
  "password": "password123",
  "fullName": "Sunita Verma",
  "phone": "+91 91234 56789",
  "companyId": 1,
  "designation": "Lead Technical Recruiter"
}
```
- **Response**: `201 Created` (Note: Account has `approvedByOfficer = false` until verified).

#### 3. Secure Login
- **Route**: `POST /api/v1/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "arjun.sharma@campusflow.edu",
  "password": "password123"
}
```
- **Response**: `200 OK` (Returns JWT access token with role and identity).

#### 4. Forgot Password & Password Reset
- **Route**: `POST /api/v1/auth/forgot-password?email=user@campusflow.edu`
  - Generates a cryptographically secure 6-character reset token.
- **Route**: `POST /api/v1/auth/reset-password`
  - **Body**: `{ "email": "...", "token": "...", "newPassword": "..." }`

#### 5. Authenticated Principal Info
- **Route**: `GET /api/v1/auth/me`
- **Access**: Any Authenticated User

---

### B. Departments (`/api/v1/departments`)

| Method | Endpoint | Allowed Roles | Description |
|---|---|---|---|
| `GET` | `/api/v1/departments` | Authenticated | List all active academic departments |
| `POST` | `/api/v1/departments` | `ADMIN` | Create a new academic department |
| `PUT` | `/api/v1/departments/{id}` | `ADMIN` | Update department name or code |

---

### C. Student Management (`/api/v1/students`)

#### 1. Current Student Profile
- **Route**: `GET /api/v1/students/me`
- **Access**: `STUDENT`
- **Returns**: Full student profile, academic metrics, verified flag, resume URL.

#### 2. Update Student Profile
- **Route**: `PUT /api/v1/students/me`
- **Access**: `STUDENT`
- **Request Body**:
```json
{
  "fullName": "Arjun Sharma",
  "phone": "+91 98765 43210",
  "collegeName": "R.V. College of Engineering",
  "graduationYear": 2026,
  "cgpa": 8.85,
  "backlogs": 0,
  "skills": "Java, Spring Boot, React, Docker, MySQL, Redis"
}
```

#### 3. Upload Student Resume
- **Route**: `POST /api/v1/students/me/resume`
- **Access**: `STUDENT`
- **Content-Type**: `multipart/form-data`
- **Form Field**: `file` (Supports PDF, DOC, DOCX up to 5 MB)
- **Response**: `200 OK` (Updates `resumeUrl` on student profile).

#### 4. Student Dashboard Aggregates
- **Route**: `GET /api/v1/students/me/dashboard`
- **Access**: `STUDENT`
- **Returns**: Real-time aggregated statistics:
  - `profileCompletionPercentage` (0-100%)
  - `cgpa`
  - `totalAvailableJobs`
  - `eligibleJobsCount`
  - `applicationsSubmitted`
  - `shortlistedCount`
  - `upcomingInterviews`
  - `offersReceived`

#### 5. Placement Officer & Admin Student Directory
- **Route**: `GET /api/v1/students`
- **Access**: `PLACEMENT_OFFICER`, `ADMIN`
- **Query Params**: `departmentId`, `minCgpa`, `hasBacklogs`, `search`, `page`, `size`

#### 6. Academic Verification
- **Route**: `PUT /api/v1/students/{id}/academic-verification?isVerified=true`
- **Access**: `PLACEMENT_OFFICER`, `ADMIN`
- **Description**: Placement officers review marksheets and lock academic verification status.

---

### D. Company & Recruiter Management (`/api/v1/companies`, `/api/v1/recruiters`)

#### 1. List Companies
- **Route**: `GET /api/v1/companies`
- **Access**: Authenticated

#### 2. Register Company Profile
- **Route**: `POST /api/v1/companies`
- **Access**: `RECRUITER`, `ADMIN`, `PLACEMENT_OFFICER`
- **Body**:
```json
{
  "name": "CloudNova Systems",
  "website": "https://cloudnova.io",
  "industry": "Cloud Infrastructure & SaaS",
  "description": "Enterprise cloud security and orchestration solutions.",
  "location": "Bengaluru, India"
}
```

#### 3. Verify Company
- **Route**: `PUT /api/v1/companies/{id}/verify?isVerified=true`
- **Access**: `ADMIN`, `PLACEMENT_OFFICER`

#### 4. Recruiter Approval Workflow
- **Route**: `GET /api/v1/recruiters/pending`
- **Access**: `ADMIN`, `PLACEMENT_OFFICER`
- **Route**: `PUT /api/v1/recruiters/{id}/approve`
- **Access**: `ADMIN`, `PLACEMENT_OFFICER`
- **Description**: Grants a registered recruiter verified authority to post jobs and review applicants.

---

### E. Job Management & Eligibility Evaluation (`/api/v1/jobs`)

#### 1. List & Search Jobs
- **Route**: `GET /api/v1/jobs`
- **Access**: Authenticated
- **Query Parameters**:
  - `search`: Keyword search in title, company name, skills
  - `departmentId`: Filter by target department
  - `minCgpa`: Filter by maximum CGPA threshold
  - `jobType`: `FULL_TIME`, `INTERNSHIP`, `INTERN_TO_FTE`
  - `status`: `DRAFT`, `PUBLISHED`, `CLOSED`, `CANCELLED`
  - `page`: Page index (default: 0)
  - `size`: Page size (default: 10)

#### 2. Create Job Posting
- **Route**: `POST /api/v1/jobs`
- **Access**: `RECRUITER`
- **Request Body**:
```json
{
  "driveId": 1,
  "title": "Full Stack Cloud Engineer",
  "description": "Designing high-scale distributed Spring Boot and React applications.",
  "jobType": "FULL_TIME",
  "location": "Bengaluru, India",
  "salaryPackage": 18.5,
  "minimumCgpa": 7.5,
  "maxBacklogs": 0,
  "graduationYear": 2026,
  "requiredSkills": "Java, Spring Boot, React, SQL, Docker",
  "applicationDeadline": "2026-12-15T23:59:59",
  "departmentIds": [1, 2, 4]
}
```

#### 3. Publish / Close / Delete Job
- `PUT /api/v1/jobs/{id}/publish` (Changes status to `PUBLISHED`)
- `PUT /api/v1/jobs/{id}/close` (Closes job to new applicants)
- `DELETE /api/v1/jobs/{id}` (Deletes draft jobs)

#### 4. Dynamic Eligibility Check
- **Route**: `GET /api/v1/jobs/{id}/check-eligibility`
- **Access**: `STUDENT`
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Eligibility evaluated.",
  "data": {
    "eligible": true,
    "matchScorePercentage": 92.5,
    "criteriaBreakdown": [
      { "criterion": "Minimum CGPA", "passed": true, "requirement": ">= 7.5", "studentValue": "8.85" },
      { "criterion": "Active Backlogs", "passed": true, "requirement": "<= 0", "studentValue": "0" },
      { "criterion": "Department", "passed": true, "requirement": "CSE, ISE, AIML", "studentValue": "Computer Science and Engineering" },
      { "criterion": "Graduation Year", "passed": true, "requirement": "2026", "studentValue": "2026" },
      { "criterion": "Application Deadline", "passed": true, "requirement": "Before 2026-12-15T23:59:59", "studentValue": "Current Date Valid" },
      { "criterion": "Application History", "passed": true, "requirement": "Single Application Invariant", "studentValue": "Not yet applied" }
    ],
    "rejectionReasons": [],
    "matchedSkills": ["Java", "Spring Boot", "React", "SQL"],
    "missingSkills": ["Docker"]
  }
}
```

---

### F. Application Lifecycle (`/api/v1/applications`)

#### 1. Apply for Job
- **Route**: `POST /api/v1/applications/jobs/{jobId}/apply`
- **Access**: `STUDENT`
- **Business Rule**: Executes the `EligibilityEngine`. If the student fails any criterion, throws `422 Unprocessable Entity` (`IneligibleApplicationException`).
- **Response**: `201 Created`

#### 2. Student Application History
- **Route**: `GET /api/v1/applications/my-applications`
- **Access**: `STUDENT`

#### 3. Recruiter Applicants Review
- **Route**: `GET /api/v1/applications/jobs/{jobId}`
- **Access**: `RECRUITER`, `PLACEMENT_OFFICER`, `ADMIN`
- **Query Params**: `status` (`APPLIED`, `SHORTLISTED`, `INTERVIEW_SCHEDULED`, `OFFERED`, `REJECTED`, `WITHDRAWN`)

#### 4. Update Application Status
- **Route**: `PUT /api/v1/applications/{id}/status`
- **Access**: `RECRUITER`, `PLACEMENT_OFFICER`
- **Request Body**:
```json
{
  "status": "SHORTLISTED",
  "remarks": "Profile shortlisted based on exceptional algorithmic problem solving."
}
```
- **Auditing**: Creates an immutable record in `application_status_history` and sends an automated notification to the student.

#### 5. Audit History Timeline
- **Route**: `GET /api/v1/applications/{id}/history`
- **Access**: Authenticated

---

### G. Interviews & Offers (`/api/v1/interviews`, `/api/v1/offers`)

#### 1. Schedule Interview Round
- **Route**: `POST /api/v1/interviews`
- **Access**: `RECRUITER`, `PLACEMENT_OFFICER`
- **Request Body**:
```json
{
  "applicationId": 1,
  "roundNumber": 2,
  "roundName": "System Design & Architecture Round",
  "roundType": "TECHNICAL",
  "mode": "ONLINE",
  "meetingLink": "https://meet.google.com/xyz-abcd-efg",
  "scheduledTime": "2026-11-20T14:00:00",
  "durationMinutes": 60,
  "instructions": "Be prepared with code sandbox and camera on."
}
```

#### 2. Extend Job Offer
- **Route**: `POST /api/v1/offers`
- **Access**: `RECRUITER`
- **Request Body**:
```json
{
  "applicationId": 1,
  "packageAmount": 18.5,
  "joiningDate": "2027-07-01",
  "offerLetterUrl": "https://campusflow.storage/offers/OFFER-2026-001.pdf",
  "validUntil": "2026-12-01T18:00:00",
  "notes": "Congratulations! We are thrilled to welcome you to the team."
}
```

#### 3. Accept or Reject Offer
- **Route**: `PUT /api/v1/offers/{id}/respond?status=ACCEPTED`
- **Access**: `STUDENT`

---

### H. Analytics, Export & Audit Logs (`/api/v1/analytics`)

#### 1. Placement Administration Dashboard
- **Route**: `GET /api/v1/analytics/dashboard`
- **Access**: `PLACEMENT_OFFICER`, `ADMIN`
- **Returns**:
```json
{
  "totalStudents": 450,
  "totalVerifiedStudents": 420,
  "totalCompanies": 35,
  "totalJobsPosted": 48,
  "totalApplications": 1280,
  "totalOffersExtended": 195,
  "overallPlacementRate": 85.2,
  "averagePackageLpa": 12.4,
  "highestPackageLpa": 42.0,
  "departmentWisePlacements": [
    { "departmentCode": "CSE", "placedStudents": 110, "totalStudents": 120, "placementPercentage": 91.6 },
    { "departmentCode": "ISE", "placedStudents": 55, "totalStudents": 60, "placementPercentage": 91.6 }
  ],
  "topRecruitingCompanies": [
    { "companyName": "Google", "offersCount": 18 },
    { "companyName": "Microsoft", "offersCount": 14 }
  ]
}
```

#### 2. CSV Report Generation
- **Route**: `GET /api/v1/analytics/export/csv`
- **Access**: `PLACEMENT_OFFICER`, `ADMIN`
- **Header**: `Content-Disposition: attachment; filename=campusflow-placement-report.csv`
- **Content-Type**: `text/csv`

#### 3. Immutable Security Audit Trail
- **Route**: `GET /api/v1/analytics/audit-logs`
- **Access**: `ADMIN`
- **Query Params**: `page`, `size`
- **Returns**: Chronological immutable log of actions, IP addresses, actors, and metadata.


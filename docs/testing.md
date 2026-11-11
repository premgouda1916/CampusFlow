# CampusFlow – Testing Guide & Verification Suite

This document outlines the testing architecture, automated test suites, execution commands, and end-to-end verification walkthroughs for **CampusFlow – Smart Campus Placement & Recruitment Management Platform**.

---

## 1. Test Architecture Overview

CampusFlow implements a multi-tiered testing strategy:

```
+-------------------------------------------------------------+
|                     Manual E2E Walkthroughs                 |
|  (Student Journey, Recruiter Pipeline, Officer Analytics)   |
+-------------------------------------------------------------+
                              |
+-------------------------------------------------------------+
|              Frontend Production Build Verification         |
|         (Vite, React 18, Tailwind CSS, Tree-shaking)        |
+-------------------------------------------------------------+
                              |
+-------------------------------------------------------------+
|              Backend MockMvc Integration Tests              |
|        (Flyway Migrations, Security Filters, JWT, DTOs)     |
+-------------------------------------------------------------+
                              |
+-------------------------------------------------------------+
|                     Backend Unit Tests                      |
| (Dynamic Eligibility Engine, BCrypt, Auth, App Services)    |
+-------------------------------------------------------------+
```

---

## 2. Automated Test Execution

### A. Backend Unit & Integration Tests (JUnit 5 + Mockito)

CampusFlow backend tests are written with JUnit 5, Mockito, and Spring Boot Test. They run against an in-memory H2 database configured in MySQL syntax compatibility mode, allowing Flyway V1 (schema) and V2 (seed data) migrations to run dynamically without requiring an external MySQL daemon.

#### Prerequisites
- JDK 21 LTS (`C:\Program Files\Java\jdk-21.0.10` or configured `JAVA_HOME`)
- Apache Maven 3.9+

#### Run All Tests
```powershell
# Set JAVA_HOME to Java 21 LTS if multiple JDKs are present
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21.0.10"

# Navigate to backend directory and run Maven test lifecycle
cd d:\CampusFlow\backend
mvn test
```

#### Test Execution Summary
- **Total Tests Run**: 19
- **Failures**: 0
- **Errors**: 0
- **Skipped**: 0

#### Test Suite Breakdown

| Test Class | Focus Area | Key Scenarios Verified |
|---|---|---|
| `EligibilityEngineTest` | Dynamic Eligibility Engine | • Passing candidate meets all criteria<br>• CGPA below minimum triggers rejection<br>• Backlogs exceeding limit triggers rejection<br>• Ineligible department rejection<br>• Mismatched graduation year rejection<br>• Post-deadline application rejection<br>• Skill matching & calculation of profile match score |
| `AuthServiceTest` | Authentication & Security | • Successful student registration with password hashing<br>• Duplicate email collision prevention (`DuplicateResourceException`)<br>• Successful user login & JWT generation<br>• Bad credential detection (`BadCredentialsException`) |
| `ApplicationServiceTest` | Application Pipeline | • Ineligible candidate blocked with `IneligibleApplicationException`<br>• Duplicate application blocked with `DuplicateResourceException`<br>• Successful application submission & state tracking<br>• Recruiter status updates with audit history trail |
| `AuthControllerIntegrationTest` | End-to-End API Security | • Flyway V1 and V2 migrations execute without errors<br>• `/api/v1/auth/login` returns valid JWT token and 200 OK<br>• Bad credentials return 401 Unauthorized<br>• Public student registration creates new student record |
| `BCryptTest` | Password Hashing | • Verifies BCrypt hash generation matches `password123` across all seed accounts |

---

### B. Frontend Production Build & Bundle Verification

The frontend is built using Vite 5 and React 18, styled with Tailwind CSS, and uses Lucide React icons and Recharts.

#### Run Frontend Build
```powershell
cd d:\CampusFlow\frontend
npm run build
```

#### Verification Criteria
- All 2,200+ modules transform cleanly.
- Zero TypeScript/JSX syntax errors.
- Emits optimized production bundle in `dist/` directory.

---

## 3. End-to-End Manual Testing Walkthrough

Use the table below for pre-seeded user accounts to test every workflow immediately:

### Pre-Seeded Demo Credentials

| Role | Email | Password | Full Name / Title | Description |
|---|---|---|---|---|
| **Student** | `arjun.sharma@campusflow.com` | `password123` | Arjun Sharma | High CGPA (8.85), 0 Backlogs, CSE Department, Has Resumes |
| **Student** | `priya.nair@campusflow.com` | `password123` | Priya Nair | CGPA 7.40, 1 Backlog, ISE Department, Tests partial eligibility |
| **Student** | `rohit.verma@campusflow.com` | `password123` | Rohit Verma | CGPA 6.80, 2 Backlogs, MECH Department, Tests ineligible edge cases |
| **Recruiter** | `recruiter.google@campusflow.com` | `password123` | Ananya Deshmukh | Approved Google Recruiter (SWE, SRE roles) |
| **Recruiter** | `recruiter.msft@campusflow.com` | `password123` | Vikramaditya Sen | Approved Microsoft Recruiter (Cloud Engineer roles) |
| **Recruiter** | `recruiter.pending@campusflow.com` | `password123` | Rohit Khandelwal | Pending Approval Recruiter (Tests officer approval flow) |
| **Placement Officer**| `officer@campusflow.com`| `password123` | Dr. Rajesh Rao | Placement Head with verification & report powers |
| **Admin** | `admin@campusflow.com` | `password123` | System Administrator | Full platform access, audit logs, department management |

> **Pro-Tip**: The login page (`/login`) includes 1-click **Demo Account Switcher** buttons. Clicking any role instantly pre-populates the credentials and logs in.

---

### Workflow 1: Student Placement Lifecycle

1. **Sign In**:
   - Navigate to `http://localhost:5173/login`.
   - Click the **"Demo Student"** button. Click **Sign In**.
2. **Review Dashboard**:
   - Verify profile completion card (e.g. 95%), current CGPA card (8.85), total available jobs, and active applications.
3. **Explore Job Opportunities**:
   - Click **"Explore Jobs"** in the sidebar.
   - Use search and filter bars (filter by minimum CGPA or department).
   - Find the job *"Software Development Engineer - I"* by Google.
4. **Evaluate Dynamic Eligibility**:
   - Click the **"Check Eligibility"** button on the job card.
   - The **Eligibility Modal** opens and displays:
     - Profile Match Score (e.g. 92%).
     - Institutional Criteria breakdown: CGPA check (Passed), Backlogs check (Passed), Department check (Passed), Graduation Year check (Passed), Deadline check (Passed).
     - Matched skills badges (Green) vs. Missing skills badges (Amber).
5. **Submit Application**:
   - Click **"Confirm & Apply"** inside the modal.
   - A success notification appears: *"Application submitted successfully!"*
   - Re-opening the job shows the badge has shifted to **"Applied"**.
6. **Track Application Progress**:
   - Click **"My Applications"** in the sidebar.
   - View the active application card with its status (`APPLIED`) and review the timeline history.
7. **View Interviews & Respond to Offers**:
   - Click **"My Interviews"** to view scheduled technical and HR interview rounds with meeting links.
   - Click **"Offers"** to view extended offers and click **"Accept Offer"**.

---

### Workflow 2: Recruiter Talent Acquisition Pipeline

1. **Sign In**:
   - Sign in using `vikram.aditya@google.com` / `password123`.
2. **Review Recruiter Dashboard**:
   - Check total active jobs posted, applicant pool size, scheduled interviews, and extended offers.
3. **Post a New Placement Drive Opportunity**:
   - Click **"Post New Job"** in the sidebar.
   - Fill in Job Title, Employment Type, Location, Salary Package (LPA), Application Deadline.
   - Define institutional eligibility rules: Minimum CGPA (e.g. 7.5), Maximum Allowed Backlogs (0), Target Departments (CSE, ISE), Required Skills (`Java, Spring Boot, React, SQL`).
   - Click **"Save Job"**. The job is saved as `DRAFT`.
   - Click **"Publish Job"** to open it to students.
4. **Screen & Shortlist Applicants**:
   - Click **"Applicants"** in the sidebar or click into a specific job posting.
   - Review applicant cards displaying student USN, department, CGPA, and resume preview.
   - Click **"Shortlist Candidate"**. The applicant status updates immediately, and an audit history entry is recorded.
5. **Schedule Technical Interview**:
   - Click **"Interviews"** -> **"Schedule New Round"**.
   - Select candidate, round type (`TECHNICAL`), date/time, and add Google Meet link.
   - Click **"Schedule"**. The student immediately receives an in-app notification.
6. **Extend Formal Offer**:
   - Click **"Offers"** -> **"Extend Offer"**.
   - Specify salary package (e.g. 24.0 LPA), joining date, and offer validity date.
   - Submit offer. The student's dashboard displays the pending offer.

---

### Workflow 3: Placement Officer & Admin Governance

1. **Sign In**:
   - Sign in using `officer.placement@campusflow.edu` / `password123`.
2. **Executive Placement Dashboard**:
   - View key university placement metrics: Total Placements, Average Package, Highest Package, Overall Placement Percentage.
   - Review interactive **Recharts Department Placement Bar Chart** and **Top Recruiting Partners** breakdown.
3. **Recruiter & Company Approvals**:
   - Click **"Recruiter Approvals"** in the sidebar.
   - Review pending recruiter accounts (e.g. `rahul.mehta@startup.io`).
   - Click **"Approve Recruiter"** to grant job posting permissions.
4. **Student Academic Verification**:
   - Click **"Student Directory"**.
   - Search by USN or name.
   - Review academic transcript details and toggle **"Verify Academic Record"** to lock verified credentials.
5. **Generate & Export Institutional Reports**:
   - Click **"Placement Reports"**.
   - Click **"Export CSV Report"**.
   - Confirm that `campusflow-placement-report.csv` downloads cleanly with student records, placement companies, packages, and statuses.
6. **Security Audit Trail (Admin)**:
   - Sign in as `admin@campusflow.edu` / `password123`.
   - Click **"Audit Logs"** in the navigation.
   - Review real-time immutable security logs: timestamps, actors, actions (`LOGIN_SUCCESS`, `APPLICATION_SUBMITTED`, `STATUS_CHANGED`), and IP addresses.


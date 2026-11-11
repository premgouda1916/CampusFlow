-- CampusFlow Relational Database Schema
-- Compatible with MySQL 8.0+ and H2 MySQL Mode

-- 1. Departments Table
CREATE TABLE departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 2. Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(30) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- 3. Students Table
CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    usn VARCHAR(50) NOT NULL UNIQUE,
    department_id BIGINT NOT NULL,
    college_name VARCHAR(150) NOT NULL,
    graduation_year INT NOT NULL,
    current_cgpa DECIMAL(4,2) NOT NULL DEFAULT 0.00,
    backlog_count INT NOT NULL DEFAULT 0,
    skills TEXT,
    resume_url VARCHAR(255),
    profile_photo_url VARCHAR(255),
    is_placed BOOLEAN NOT NULL DEFAULT FALSE,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_students_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_students_department FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE INDEX idx_students_dept ON students(department_id);
CREATE INDEX idx_students_grad_year ON students(graduation_year);
CREATE INDEX idx_students_cgpa ON students(current_cgpa);

-- 4. Companies Table
CREATE TABLE companies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    website VARCHAR(255),
    industry VARCHAR(100),
    location VARCHAR(150),
    description TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Recruiters Table
CREATE TABLE recruiters (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    company_id BIGINT NOT NULL,
    designation VARCHAR(100),
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_recruiters_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_recruiters_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE INDEX idx_recruiters_company ON recruiters(company_id);

-- 6. Placement Drives Table
CREATE TABLE placement_drives (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'UPCOMING',
    description TEXT
);

-- 7. Jobs Table
CREATE TABLE jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    placement_drive_id BIGINT,
    created_by_recruiter_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    job_type VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    salary_package VARCHAR(50) NOT NULL,
    min_cgpa DECIMAL(4,2) NOT NULL DEFAULT 0.00,
    max_backlogs INT NOT NULL DEFAULT 0,
    eligible_departments VARCHAR(255) NOT NULL,
    graduation_year INT NOT NULL,
    required_skills TEXT,
    application_deadline TIMESTAMP NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_jobs_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    CONSTRAINT fk_jobs_drive FOREIGN KEY (placement_drive_id) REFERENCES placement_drives(id) ON DELETE SET NULL,
    CONSTRAINT fk_jobs_recruiter FOREIGN KEY (created_by_recruiter_id) REFERENCES recruiters(id)
);

CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_company ON jobs(company_id);
CREATE INDEX idx_jobs_deadline ON jobs(application_deadline);

-- 8. Applications Table
CREATE TABLE applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'APPLIED',
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    notes TEXT,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uq_job_student UNIQUE (job_id, student_id),
    CONSTRAINT fk_applications_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    CONSTRAINT fk_applications_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE INDEX idx_app_status ON applications(status);
CREATE INDEX idx_app_job ON applications(job_id);
CREATE INDEX idx_app_student ON applications(student_id);

-- 9. Application Status History Table
CREATE TABLE application_status_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    from_status VARCHAR(30),
    to_status VARCHAR(30) NOT NULL,
    changed_by_user_id BIGINT NOT NULL,
    comment TEXT,
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ash_app FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    CONSTRAINT fk_ash_user FOREIGN KEY (changed_by_user_id) REFERENCES users(id)
);

CREATE INDEX idx_ash_app ON application_status_history(application_id);

-- 10. Interviews Table
CREATE TABLE interviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    conducted_by_recruiter_id BIGINT NOT NULL,
    round_name VARCHAR(50) NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    mode VARCHAR(20) NOT NULL DEFAULT 'ONLINE',
    location_or_link VARCHAR(255) NOT NULL,
    instructions TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED',
    feedback TEXT,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_interviews_application FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    CONSTRAINT fk_interviews_recruiter FOREIGN KEY (conducted_by_recruiter_id) REFERENCES recruiters(id)
);

CREATE INDEX idx_interviews_app ON interviews(application_id);
CREATE INDEX idx_interviews_recruiter ON interviews(conducted_by_recruiter_id);

-- 11. Offers Table
CREATE TABLE offers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL UNIQUE,
    job_designation VARCHAR(150) NOT NULL,
    salary_package VARCHAR(100) NOT NULL,
    joining_date DATE NOT NULL,
    offer_expiration_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'OFFERED',
    offer_letter_url VARCHAR(255),
    issued_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP NULL,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_offers_application FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

CREATE INDEX idx_offers_status ON offers(status);

-- 12. Notifications Table
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipient_user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    reference_id BIGINT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_user FOREIGN KEY (recipient_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- 13. Audit Logs Table
CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    user_email VARCHAR(150),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50),
    description TEXT NOT NULL,
    ip_address VARCHAR(50),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);


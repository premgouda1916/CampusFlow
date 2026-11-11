-- CampusFlow Seed Data
-- Default password for all seed accounts is: password123
-- BCrypt hash: $2a$10$HMc/Ti0avWaoATvBCrwUFOeso5SWDyx/KClqMlbD8KgCQAWfwURQa

-- 1. Seed Departments
INSERT INTO departments (id, code, name, is_active) VALUES
(1, 'CSE', 'Computer Science and Engineering', TRUE),
(2, 'ISE', 'Information Science and Engineering', TRUE),
(3, 'ECE', 'Electronics and Communication Engineering', TRUE),
(4, 'AIML', 'Artificial Intelligence and Machine Learning', TRUE),
(5, 'MECH', 'Mechanical Engineering', TRUE);

-- 2. Seed Users
INSERT INTO users (id, email, password, full_name, phone, role, is_active, is_verified, version, created_at, updated_at) VALUES
-- Admin
(1, 'admin@campusflow.com', '$2a$10$HMc/Ti0avWaoATvBCrwUFOeso5SWDyx/KClqMlbD8KgCQAWfwURQa', 'System Administrator', '+91 9876543210', 'ADMIN', TRUE, TRUE, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Placement Officer
(2, 'officer@campusflow.com', '$2a$10$HMc/Ti0avWaoATvBCrwUFOeso5SWDyx/KClqMlbD8KgCQAWfwURQa', 'Dr. Rajesh Rao', '+91 9876543211', 'PLACEMENT_OFFICER', TRUE, TRUE, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Recruiters
(3, 'recruiter.google@campusflow.com', '$2a$10$HMc/Ti0avWaoATvBCrwUFOeso5SWDyx/KClqMlbD8KgCQAWfwURQa', 'Ananya Deshmukh', '+91 9876543212', 'RECRUITER', TRUE, TRUE, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'recruiter.msft@campusflow.com', '$2a$10$HMc/Ti0avWaoATvBCrwUFOeso5SWDyx/KClqMlbD8KgCQAWfwURQa', 'Vikramaditya Sen', '+91 9876543213', 'RECRUITER', TRUE, TRUE, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'recruiter.pending@campusflow.com', '$2a$10$HMc/Ti0avWaoATvBCrwUFOeso5SWDyx/KClqMlbD8KgCQAWfwURQa', 'Rohit Khandelwal', '+91 9876543214', 'RECRUITER', TRUE, FALSE, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Students
(6, 'arjun.sharma@campusflow.com', '$2a$10$HMc/Ti0avWaoATvBCrwUFOeso5SWDyx/KClqMlbD8KgCQAWfwURQa', 'Arjun Sharma', '+91 9876543215', 'STUDENT', TRUE, TRUE, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'priya.nair@campusflow.com', '$2a$10$HMc/Ti0avWaoATvBCrwUFOeso5SWDyx/KClqMlbD8KgCQAWfwURQa', 'Priya Nair', '+91 9876543216', 'STUDENT', TRUE, TRUE, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 'rohit.verma@campusflow.com', '$2a$10$HMc/Ti0avWaoATvBCrwUFOeso5SWDyx/KClqMlbD8KgCQAWfwURQa', 'Rohit Verma', '+91 9876543217', 'STUDENT', TRUE, TRUE, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 3. Seed Companies
INSERT INTO companies (id, name, website, industry, location, description, is_verified, created_at, updated_at) VALUES
(1, 'Google', 'https://about.google', 'Technology & Cloud', 'Bangalore, India', 'Google LLC is an American multinational corporation specializing in internet-related services, cloud computing, and AI.', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Microsoft', 'https://www.microsoft.com', 'Enterprise Software', 'Hyderabad, India', 'Microsoft Corporation is an American multinational technology corporation producing computer software, consumer electronics, and personal computers.', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Amazon Web Services', 'https://aws.amazon.com', 'Cloud Infrastructure', 'Bangalore, India', 'Amazon Web Services (AWS) is the world’s most comprehensive and broadly adopted cloud platform.', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Unverified Tech StartUp', 'https://startup.io', 'FinTech', 'Remote', 'Emerging startup awaiting verification by the placement cell.', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 4. Seed Recruiters
INSERT INTO recruiters (id, user_id, company_id, designation, is_approved, version) VALUES
(1, 3, 1, 'Senior Technical Recruiter', TRUE, 0),
(2, 4, 2, 'University Talent Lead', TRUE, 0),
(3, 5, 4, 'Hiring Manager', FALSE, 0);

-- 5. Seed Students
INSERT INTO students (id, user_id, usn, department_id, college_name, graduation_year, current_cgpa, backlog_count, skills, resume_url, profile_photo_url, is_placed, version) VALUES
(1, 6, '1MS21CS001', 1, 'M.S. Ramaiah Institute of Technology', 2027, 8.95, 0, 'Java, Spring Boot, MySQL, React, Docker, Git', 'https://storage.campusflow.io/resumes/arjun_sharma.pdf', NULL, FALSE, 0),
(2, 7, '1MS21IS042', 2, 'M.S. Ramaiah Institute of Technology', 2027, 9.15, 0, 'Python, Java, Machine Learning, React, SQL, TypeScript', 'https://storage.campusflow.io/resumes/priya_nair.pdf', NULL, TRUE, 0),
(3, 8, '1MS21EC088', 3, 'M.S. Ramaiah Institute of Technology', 2027, 7.20, 1, 'C++, Embedded Systems, IoT, Python, Linux', 'https://storage.campusflow.io/resumes/rohit_verma.pdf', NULL, FALSE, 0);

-- 6. Seed Placement Drives
INSERT INTO placement_drives (id, title, academic_year, start_date, end_date, status, description) VALUES
(1, 'Campus Placement Drive 2026-27', '2026-2027', '2026-08-01', '2027-04-30', 'ONGOING', 'Annual flagship placement season for graduating engineering batch of 2027.');

-- 7. Seed Jobs
INSERT INTO jobs (id, company_id, placement_drive_id, created_by_recruiter_id, title, description, job_type, location, salary_package, min_cgpa, max_backlogs, eligible_departments, graduation_year, required_skills, application_deadline, status, version, created_at, updated_at) VALUES
(1, 1, 1, 1, 'Software Development Engineer (Backend)', 'Design and build scalable distributed systems and backend cloud APIs using Java, Spring Boot and modern microservice paradigms.', 'Full-time', 'Bangalore', '24 LPA', 8.00, 0, 'CSE,ISE,AIML', 2027, 'Java, Spring Boot, SQL, Docker', '2026-12-31 23:59:59', 'PUBLISHED', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 2, 1, 2, 'Full Stack Software Engineer', 'Join Microsoft Core Services Engineering to build high-performance web applications and services using modern React, Java, and Azure cloud tools.', 'Full-time', 'Hyderabad', '18 LPA', 7.50, 0, 'CSE,ISE,ECE,AIML', 2027, 'React, Java, TypeScript, Cloud', '2026-12-31 23:59:59', 'PUBLISHED', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 3, 1, 1, 'Cloud Support Associate', 'Provide enterprise-grade infrastructure technical support, operational automation, and incident mitigation for AWS cloud compute workloads.', 'Full-time', 'Bangalore', '12 LPA', 6.50, 1, 'CSE,ISE,ECE,MECH,AIML', 2027, 'Linux, Networking, Python', '2026-12-31 23:59:59', 'PUBLISHED', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 8. Seed Applications
INSERT INTO applications (id, job_id, student_id, status, applied_at, reviewed_at, notes, version) VALUES
(1, 1, 1, 'SHORTLISTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Strong background in Java and backend architecture.', 0),
(2, 2, 1, 'APPLIED', CURRENT_TIMESTAMP, NULL, NULL, 0),
(3, 1, 2, 'INTERVIEW_SCHEDULED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Excellent academic record and top tier algorithmic score.', 0),
(4, 2, 2, 'SELECTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Cleared all technical rounds and HR assessment with flying colors.', 0);

-- 9. Seed Application Status History
INSERT INTO application_status_history (id, application_id, from_status, to_status, changed_by_user_id, comment, changed_at) VALUES
(1, 1, 'APPLIED', 'SHORTLISTED', 3, 'Shortlisted profile for round 1 aptitude screening.', CURRENT_TIMESTAMP),
(2, 3, 'APPLIED', 'SHORTLISTED', 3, 'Shortlisted based on 9.15 CGPA.', CURRENT_TIMESTAMP),
(3, 3, 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 3, 'Scheduled Technical Round 1 interview.', CURRENT_TIMESTAMP),
(4, 4, 'APPLIED', 'SHORTLISTED', 4, 'Shortlisted for Full Stack role.', CURRENT_TIMESTAMP),
(5, 4, 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 4, 'Technical rounds completed successfully.', CURRENT_TIMESTAMP),
(6, 4, 'INTERVIEW_SCHEDULED', 'SELECTED', 4, 'Final selection approved by Engineering Director.', CURRENT_TIMESTAMP);

-- 10. Seed Interviews
INSERT INTO interviews (id, application_id, conducted_by_recruiter_id, round_name, scheduled_at, mode, location_or_link, instructions, status, feedback, version) VALUES
(1, 3, 1, 'TECHNICAL_ROUND_1', '2026-11-20 14:00:00', 'ONLINE', 'https://meet.google.com/cfg-plac-mnt', 'Prepare with camera enabled and code editor ready for live coding on Data Structures.', 'SCHEDULED', NULL, 0);

-- 11. Seed Offers
INSERT INTO offers (id, application_id, job_designation, salary_package, joining_date, offer_expiration_date, status, offer_letter_url, issued_at, responded_at, version) VALUES
(1, 4, 'Software Engineer', '18 LPA', '2027-07-15', '2026-12-15', 'OFFERED', 'https://storage.campusflow.io/offers/msft_priya_nair.pdf', CURRENT_TIMESTAMP, NULL, 0);

-- 12. Seed Notifications
INSERT INTO notifications (id, recipient_user_id, title, message, type, reference_id, is_read, created_at) VALUES
(1, 6, 'Application Shortlisted', 'Congratulations! Your application for Software Development Engineer (Backend) at Google has been shortlisted.', 'APPLICATION_STATUS', 1, FALSE, CURRENT_TIMESTAMP),
(2, 7, 'Interview Scheduled', 'Your Technical Round 1 interview with Google is scheduled for 20 Nov 2026, 2:00 PM.', 'INTERVIEW_SCHEDULED', 1, FALSE, CURRENT_TIMESTAMP),
(3, 7, 'Offer Letter Received!', 'Congratulations! Microsoft Corporation has extended an employment offer for the Software Engineer role (18 LPA).', 'OFFER_ISSUED', 1, FALSE, CURRENT_TIMESTAMP);

-- 13. Seed Audit Logs
INSERT INTO audit_logs (id, user_id, user_email, action, entity_type, entity_id, description, ip_address, timestamp) VALUES
(1, 1, 'admin@campusflow.com', 'SYSTEM_INITIALIZATION', 'SYSTEM', '1', 'Initial platform installation and department configuration verified.', '127.0.0.1', CURRENT_TIMESTAMP),
(2, 2, 'officer@campusflow.com', 'COMPANY_VERIFIED', 'COMPANY', '1', 'Placement Cell approved Google registration.', '127.0.0.1', CURRENT_TIMESTAMP),
(3, 3, 'recruiter.google@campusflow.com', 'JOB_PUBLISHED', 'JOB', '1', 'Published opening for Software Development Engineer (Backend).', '127.0.0.1', CURRENT_TIMESTAMP);


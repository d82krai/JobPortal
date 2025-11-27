## 1. Overview

This document defines the functional and non‑functional requirements for a multi‑tenant Job Aggregator & Applicant Tracking System (ATS) that connects:

- **Your recruiting/outsourcing company** (internal recruiters).
- **Client / third‑party companies** (employers).
- **Candidates** (job seekers).

The platform is an **agglomeration point between companies and candidates**, with:

- Rich **candidate profiles & resume parsing**.
- Full **ATS with job & application lifecycle**.
- **Online assessment** module (with proctoring, tab‑switch prevention, and video recording).
- **Real‑time communication** (chat, voice, video) with **contact details masked**.
- **Subscription models** for companies and candidates.
- **LLM assistants** for both employers and candidates.
- **Multi‑tenant** and auditable data model.

> All database tables (except `Tenants`) must include: `TenantId`, `CreatedOn`, `CreatedBy`, `ModifiedOn`, `ModifiedBy`, `IsActive`.

---

## 2. Actors & Roles

- **System Tenant**
  - Represents a logical customer or business unit using the platform.

- **User (generic)**
  - Has login credentials and belongs to a tenant.
  - Can be associated with one or more roles.

- **Roles**
  - **Candidate**
  - **Employer Admin** (for a client company)
  - **Employer Recruiter / Hiring Manager**
  - **Internal Recruiter** (your company)
  - **Assessment Author / Test Designer**
  - **System Admin / Tenant Admin**

---

## 3. High‑Level Business Requirements

- **R1. Aggregator Platform**
  - R1.1 The system shall allow multiple companies to post jobs and manage applicants in a shared multi‑tenant environment.
  - R1.2 The system shall allow candidates to create rich profiles, upload resumes, and manage their job search status.
  - R1.3 The system shall allow partner / client companies to **search and access candidate profiles** without revealing direct contact information.

- **R2. Contact Masking & Privacy**
  - R2.1 Employers and candidates shall be able to communicate via platform chat/voice/video **without seeing each other’s phone/email**.
  - R2.2 The system shall **detect phone numbers and email addresses** in messages (via AI or pattern detection) and **mask them** before storage/rendering.
  - R2.3 The system shall log attempted PII sharing events for compliance/audit.

- **R3. Presence & Activity**
  - R3.1 The system shall maintain **Last Active DateTime** for each candidate.
  - R3.2 Employers shall see candidate last active status on profile and search results.
  - R3.3 Candidates shall set **Job Search Mode** (e.g., `Aggressive`, `Active`, `Moderate`, `Passive`, `NotLooking`).
  - R3.4 The platform shall display **presence indicator** (e.g., `Online/Green`, `Away`, `Offline`) when user is logged in, based on real‑time activity and inactivity timeout.

- **R4. Communication (Chat/Call/Video)**
  - R4.1 Employers and candidates shall be able to:
    - Initiate **1:1 chat**.
    - Initiate **voice calls** via VoIP integration.
    - Initiate **video calls** via WebRTC or third‑party provider.
  - R4.2 All communication events shall be recorded as interaction logs.
  - R4.3 Calls/video calls shall be mediated by the platform without exposing direct contact details.

- **R5. ATS & Job Posting Lifecycle**
  - R5.1 The system shall support **job posting lifecycle**:
    - Draft → Pending Approval (optional) → Published → On Hold → Closed → Archived.
  - R5.2 The system shall allow publishing jobs to:
    - Internal job board.
    - External job platforms (e.g., LinkedIn, Indeed, etc.) via integrations.
  - R5.3 The system shall support **candidate application lifecycle**:
    - New → Screening → Online Test → Interview → Offer → Hired → Rejected → Withdrawn.
  - R5.4 The system shall support **ATS rating**:
    - Automated match score between job and candidate (skills/experience).
  - R5.5 The system shall support **candidate rating** by employers (per application).
  - R5.6 The system shall support **employer/company rating** by candidates.

- **R6. Resume Management & Parsing**
  - R6.1 Candidates can upload resumes (multiple formats: PDF, DOCX, etc.).
  - R6.2 The system shall extract resume text (via resume parser) and **auto‑fill profile fields** (skills, experience, education, etc.).
  - R6.3 Candidates can review and edit the parsed data before saving.

- **R7. Online Test / Assessment Module**
  - R7.1 The system shall include a full **online test application** as a separate module.
  - R7.2 Specific roles (**Assessment Author**, **Recruiter**, or **Employer Admin**) can:
    - Create tests.
    - Design structure (sections, time limits).
    - Author questions (MCQ, coding, descriptive, etc.).
  - R7.3 The system shall support:
    - Randomization (question order, question selection).
    - Time limits per test and per section.
    - Negative marking (optional).
  - R7.4 The system shall **prevent tab switching / window switching**:
    - Detect focus loss and record an event.
    - Show warning to candidate.
    - After **3 warnings**, force logout / auto‑submit the test.
  - R7.5 The system shall **record candidate video** during the test (online proctoring):
    - Ask for camera permissions.
    - Capture video stream or snapshots and store secure references.
  - R7.6 On test completion:
    - Calculate scores.
    - Store answer details and timestamps.
    - Link video recording(s) to the test attempt.
    - Share results with authorized employer/recruiter (marks, Q&A, video).

- **R8. Automated Candidate Engagement & Screening**
  - R8.1 When a job is posted (or updated), the system shall automatically:
    - Identify matching candidates (based on skills, location, preferences, ATS rating).
    - Notify candidates via **email**, **in‑app notifications**, and **chat**.
  - R8.2 The system shall initiate an **AI‑driven basic screening**:
    - Ask a set of configured or AI‑generated basic questions (e.g., availability, expected salary, relevant experience).
    - Capture candidate answers.
  - R8.3 After basic screening, the system shall:
    - Automatically send an **online test URL** to shortlisted candidates.
    - Create and track corresponding test sessions.

- **R9. Subscriptions & Monetization**
  - R9.1 **Employer/Company subscriptions**:
    - Different plans with feature limits (job posting count, CV views, external postings, number of users, communication minutes, etc.).
    - Ability to post jobs in other job platforms with **one click**, subject to plan.
  - R9.2 **Candidate subscriptions**:
    - Add‑on services: resume highlight, resume optimization, profile optimization, priority visibility, etc.
  - R9.3 The system shall integrate with payment gateways for recurring billing.

- **R10. LLM Assistant**
  - R10.1 **Employer LLM chat assistant**:
    - Natural language search for candidates (e.g., “Senior Java developer with Spring, 5+ years, in Bangalore”).
    - Suggestions for job descriptions, screening questions, tests, etc.
  - R10.2 **Candidate LLM chat assistant**:
    - Guidance on resume improvement, profile optimization.
    - Suggest jobs based on profile and preferences.
  - R10.3 LLM assistant shall respect data access policies (tenant isolation, role‑based visibility).

- **R11. Notifications**
  - R11.1 The system shall support:
    - Email notifications.
    - In‑app notifications.
    - Push notifications (optional, for mobile/web).
  - R11.2 Configurable templates and preferences for:
    - Job matches.
    - Application status changes.
    - Interview schedules.
    - Test invitations and reminders.

---

## 4. Detailed Functional Requirements by Module

### 4.1 User & Authentication Module

- Support:
  - Email/password login.
  - SSO/OAuth (optional, future).
  - Password reset, verification emails.
- Maintain user profile (name, email, phone [masked from others], locale, time zone).
- Support multi‑tenant context derived from login or sub‑domain.

### 4.2 Candidate Module

- Candidate registration and profile management:
  - Personal details (name, location, contact info – hidden from employers).
  - Experience, education, skills, certifications.
  - Preferred roles, locations, salary range.
  - **Job Search Mode** (enum).
  - Resume upload and version history.
  - Visibility and privacy settings.
- Activity & presence:
  - Track `LastActiveAt`.
  - Compute presence (online/away/offline) from WebSocket/heartbeat.
- Subscriptions:
  - Purchase and manage candidate‑facing services (resume highlight, optimization).

### 4.3 Employer / Company Module

- Company account & profile:
  - Company name, logo, description, industry, locations.
  - Billing and subscription details.
- Employer users:
  - Invite team members.
  - Assign roles (admin, recruiter, hiring manager).
- Access to candidate search and profiles with contact masking.
- Ratings & feedback:
  - View aggregated employer rating from candidates.

### 4.4 Job & ATS Module

- Job postings:
  - Create/Edit jobs (title, description, location, salary, skills, employment type, etc.).
  - Manage job lifecycle (draft → closed).
  - Publish to:
    - Internal board.
    - External integrated platforms.
- Application management:
  - Candidate can apply to jobs.
  - Internal recruiters can submit candidates to client jobs.
  - Track application status transitions (with history).
- Screening & scoring:
  - ATS match score for each job‑candidate pair based on configurable rules.
  - Store employer ratings, notes, tags.

### 4.5 Communication Module

- Chat:
  - Real‑time messaging between employer and candidate.
  - Conversation history, unread counts.
  - PII detection & masking (phone/email).
- Voice & video calls:
  - Initiate via chat or profile view.
  - Call session logs with duration, participants, and (optionally) recording links.

### 4.6 Online Test / Assessment Module

- Test & question bank management.
- Candidate test sessions with:
  - Unique test URLs (tokens).
  - Time limits, start/end timestamps.
- Proctoring:
  - Focus/blur events for tab switching.
  - Warnings & forced logout after 3 violations.
  - Video recording metadata (storage location, timestamps).
- Result reporting:
  - Scores, section scores.
  - Detailed question/answer breakdown.
  - Proctoring summary (violations, anomalies).

### 4.7 Subscription & Billing Module

- Plan catalog:
  - Employer plans (limits, features).
  - Candidate plans/add‑ons.
- Subscription lifecycle:
  - Trial, active, suspended, cancelled, expired.
- Billing:
  - Integrate with payment gateway (Stripe, Razorpay, etc.).
  - Invoices, payment history.

### 4.8 LLM Assistant Module

- Employer assistant:
  - Candidate search and recommendations.
  - Job description and assessment suggestions.
- Candidate assistant:
  - CV/profile suggestions.
  - Job recommendations.
- Conversation logging, with role‑based access and data minimization.

### 4.9 Notification Module

- Event triggers:
  - Job posted/updated.
  - New application.
  - Status changes.
  - Test invitation and completion.
- Template management and localization.

---

## 5. Non‑Functional Requirements

- **Performance**
  - Search should return results within 2–3 seconds for typical use cases.
  - Realtime features (chat, presence) latency < 500 ms in normal conditions.

- **Scalability**
  - Support thousands of concurrent users, scalable horizontally.

- **Security & Compliance**
  - Role‑based access control with least privilege.
  - Data encryption in transit (TLS) and at rest.
  - Strong PII masking and logging of violations.
  - GDPR‑style data subject rights (export/delete) as future enhancement.

- **Auditability**
  - All entities (except `Tenants`) must include audit fields.
  - Log critical actions (login, role change, subscription change, PII masking).

- **Availability**
  - Target 99.5% uptime or better.

- **Extensibility**
  - Modular service design (Auth, ATS, Communication, Assessment, LLM, Billing).

---

## 6. Success Criteria (High‑Level)

- Reduced time‑to‑hire for client companies.
- Increased candidate engagement (measured by last active recency, response rates).
- High adoption of subscription features (employer and candidate).
- High accuracy and usefulness of AI‑driven screening and LLM assistants (feedback scores).


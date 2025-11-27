## 1. API Overview

This document provides a **human‑readable API overview**, grouped by major modules. Each module also has (or will have) its own **OpenAPI spec** file (YAML) for detailed schema and machine‑readable definitions.

Planned OpenAPI files:

- `core-api.yaml` – Auth, users, companies, candidates, ratings.
- `ats-api.yaml` – Jobs, applications, screenings, resume parsing.
- `comms-api.yaml` – Chat, calls, masking, presence.
- `monetization-llm-api.yaml` – Subscriptions, payments, LLM assistants, notifications.

All APIs are assumed to be **RESTful JSON over HTTPS**, versioned under `/api/v1/...` and secured with **JWT bearer tokens** (unless otherwise noted).

---

## 2. Core API (Auth, Users, Companies, Candidates)

### 2.1 Authentication

- **POST** `/api/v1/auth/register`
  - Register a new user (candidate or employer).
  - Body: `{ email, password, firstName, lastName, role, tenantCode? }`
  - Response: `201 Created` with `{ userId, token }`.

- **POST** `/api/v1/auth/login`
  - Authenticate and receive JWT.
  - Body: `{ email, password }`
  - Response: `{ accessToken, refreshToken, expiresIn, user }`.

- **POST** `/api/v1/auth/refresh-token`
  - Refresh JWT using refresh token.

- **POST** `/api/v1/auth/logout`
  - Invalidate refresh token.

### 2.2 Users & Presence

- **GET** `/api/v1/users/me`
  - Get current user profile and roles.

- **PATCH** `/api/v1/users/me`
  - Update user profile (name, locale, time zone).

- **GET** `/api/v1/users/{id}/presence`
  - Get presence info (`Online`, `Away`, `Offline`) and `lastActiveAt`.

- **POST** `/api/v1/users/me/heartbeat`
  - Update presence/lastActiveAt (used by client heartbeat).

### 2.3 Companies & Employer Users

- **POST** `/api/v1/companies`
  - Create a company (by internal admin or self‑service).

- **GET** `/api/v1/companies/{id}`
  - Get company profile, including average rating.

- **PATCH** `/api/v1/companies/{id}`
  - Update basic profile details.

- **POST** `/api/v1/companies/{id}/users`
  - Invite/add user to company (employer admin only).

- **GET** `/api/v1/companies/{id}/users`
  - List company users.

### 2.4 Candidate Profile & Resume

- **GET** `/api/v1/candidates/me`
  - Get authenticated candidate profile.

- **PATCH** `/api/v1/candidates/me`
  - Update profile (headline, summary, preferences, jobSearchMode, etc.).

- **POST** `/api/v1/candidates/me/resumes`
  - Upload resume file (multipart).
  - Triggers resume parsing in background.

- **GET** `/api/v1/candidates/me/resumes`
  - List uploaded resumes.

- **GET** `/api/v1/candidates/me/resumes/{id}`
  - Get resume metadata and parsed data.

### 2.5 Candidate Search (for Employers & Recruiters)

- **GET** `/api/v1/candidates/search`
  - Query candidates with filters:
    - `q` (free text), `skills`, `location`, `experienceMin`, `experienceMax`, `jobSearchMode`, etc.
  - Response: paged list with key fields and masked contact info.

---

## 3. ATS API (Jobs, Applications, Screenings, Resume Parsing)

### 3.1 Job Postings

- **POST** `/api/v1/jobs`
  - Create job posting.
  - Body: job details, channels to publish.

- **GET** `/api/v1/jobs/{id}`
  - Get job details with status and posting channels.

- **PATCH** `/api/v1/jobs/{id}`
  - Update job (title, description, status).

- **GET** `/api/v1/jobs`
  - List jobs with filters (status, company, createdBy, etc.).

- **POST** `/api/v1/jobs/{id}/publish`
  - Publish job internally and optionally to external channels (one‑click).

### 3.2 Applications & Lifecycle

- **POST** `/api/v1/jobs/{id}/apply`
  - Candidate applies to job.
  - Body: optional cover letter, resume selection.

- **GET** `/api/v1/applications/{id}`
  - Get application details, status, ATS score, ratings, notes.

- **GET** `/api/v1/jobs/{id}/applications`
  - List applications for job (employer/recruiter only).

- **PATCH** `/api/v1/applications/{id}/status`
  - Change application status (with reason and optional comment).

- **GET** `/api/v1/applications/{id}/history`
  - Status history timeline.

### 3.3 ATS Rating & Matching

- **POST** `/api/v1/applications/{id}/rate`
  - Employer rates candidate for that application.

- **GET** `/api/v1/applications/{id}/ats-score`
  - Get ATS match score (and explanation, optional).

### 3.4 Automated Engagement & AI Screening

- **POST** `/api/v1/jobs/{id}/trigger-engagement`
  - (Usually automatic) Trigger matching candidates and send notifications.

- **GET** `/api/v1/applications/{id}/screenings`
  - List AI/basic screening sessions for application.

- **POST** `/api/v1/applications/{id}/screenings`
  - Initiate AI screening (questions generation + invitation to candidate).

- **GET** `/api/v1/screenings/{id}`
  - Get screening details (questions, answers, AI summary, score).

---

## 4. Online Assessments API

### 4.1 Test Authoring

- **POST** `/api/v1/assessments/tests`
  - Create a test (name, duration, description).

- **GET** `/api/v1/assessments/tests/{id}`
  - Get test with sections and questions.

- **PATCH** `/api/v1/assessments/tests/{id}`
  - Update test metadata.

- **POST** `/api/v1/assessments/tests/{id}/sections`
  - Add section to test.

- **POST** `/api/v1/assessments/sections/{id}/questions`
  - Add question to section.

- **PATCH** `/api/v1/assessments/questions/{id}`
  - Update question and options.

### 4.2 Assigning Tests

- **POST** `/api/v1/applications/{id}/assessments`
  - Assign an existing test to an application.

- **GET** `/api/v1/applications/{id}/assessments`
  - List tests assigned to application.

### 4.3 Candidate Test Sessions

- **GET** `/api/v1/assessments/sessions/{token}`
  - (Public with token) Load test session for candidate (once authenticated/verified).

- **POST** `/api/v1/assessments/sessions/{token}/start`
  - Start/activate session, record start time.

- **POST** `/api/v1/assessments/sessions/{token}/answers`
  - Submit or autosave answers (per question or per page).

- **POST** `/api/v1/assessments/sessions/{token}/complete`
  - Complete test; triggers scoring and proctoring analysis.

### 4.4 Proctoring & Anti‑Cheating

- **POST** `/api/v1/assessments/sessions/{token}/proctoring/events`
  - Record proctoring events (tab blur/focus, warnings shown, forced logout).

- **POST** `/api/v1/assessments/sessions/{token}/proctoring/video`
  - Upload or register video recording segment.

- **GET** `/api/v1/assessments/sessions/{id}/report`
  - For recruiters/employers: get scores, answers, proctoring summary, video links.

---

## 5. Communication API (Chat, Calls, Masking, Presence)

### 5.1 Chat Threads & Messages

- **POST** `/api/v1/chat/threads`
  - Create/open chat thread related to:
    - Application, job, or direct contact request.

- **GET** `/api/v1/chat/threads`
  - List chat threads for current user.

- **GET** `/api/v1/chat/threads/{id}`
  - Get thread details and participants (without exposing PII).

- **POST** `/api/v1/chat/threads/{id}/messages`
  - Send message.
  - The backend must:
    - Detect phone numbers/emails using AI/API.
    - Mask PII before storing/sending: e.g., `+91-XXXXXX1234`, `xxx@masked.com`.

- **GET** `/api/v1/chat/threads/{id}/messages`
  - Paginated list of messages.

### 5.2 Calls & Video

- **POST** `/api/v1/chat/threads/{id}/calls`
  - Initiate voice/video call (platform‑mediated).

- **GET** `/api/v1/calls/{id}`
  - Get call session details, recording URL (if available).

### 5.3 Presence

- **GET** `/api/v1/presence/users`
  - Bulk presence for a list of user IDs (e.g., on a candidate search page).

---

## 6. Subscriptions, Billing, and Integrations

### 6.1 Subscription Plans

- **GET** `/api/v1/subscriptions/plans`
  - List available plans (employer & candidate).

- **GET** `/api/v1/subscriptions/plans/{id}`
  - Get plan details.

### 6.2 Employer / Company Subscriptions

- **POST** `/api/v1/companies/{id}/subscriptions`
  - Create or upgrade subscription for employer.

- **GET** `/api/v1/companies/{id}/subscriptions/current`
  - Get current subscription status and limits.

### 6.3 Candidate Subscriptions

- **POST** `/api/v1/candidates/me/subscriptions`
  - Purchase candidate services (resume highlight, optimization, etc.).

- **GET** `/api/v1/candidates/me/subscriptions`
  - List candidate subscriptions.

### 6.4 Payments

- **POST** `/api/v1/payments/checkout-session`
  - Create a payment/checkout session with external payment provider.

- **POST** `/api/v1/payments/webhook`
  - Webhook endpoint for payment provider events.

### 6.5 External Job Platform Posting

- **POST** `/api/v1/jobs/{id}/external-post`
  - Post job to configured external platforms (based on subscription).

- **GET** `/api/v1/jobs/{id}/external-post-status`
  - Get status for each external channel (posted/failed).

---

## 7. LLM Assistant API

### 7.1 Employer Assistant

- **POST** `/api/v1/llm/employer/sessions`
  - Start a new employer assistant session.

- **POST** `/api/v1/llm/employer/sessions/{id}/messages`
  - Send user message and get assistant response.
  - Use cases:
    - Natural language candidate search.
    - Generate job description, screening questions, test suggestions.

### 7.2 Candidate Assistant

- **POST** `/api/v1/llm/candidate/sessions`
  - Start a new candidate assistant session.

- **POST** `/api/v1/llm/candidate/sessions/{id}/messages`
  - Candidate sends instructions/questions; assistant replies.
  - Use cases:
    - Resume/profile optimization.
    - Job discovery guidance.

---

## 8. Notifications API

- **GET** `/api/v1/notifications`
  - List notifications for current user.

- **PATCH** `/api/v1/notifications/{id}/read`
  - Mark notification as read.

- **POST** `/api/v1/notifications/test`
  - (Admin) trigger a test notification.

---

## 9. Admin / Configuration API (Optional, High‑Level)

- **GET** `/api/v1/admin/tenants`
  - List tenants (system admin only).

- **POST** `/api/v1/admin/tenants`
  - Create tenant.

- **GET** `/api/v1/admin/screening-templates`
  - Manage AI/basic screening templates.

- **POST** `/api/v1/admin/job-channels`
  - Configure external job posting channels and API credentials.



## 1. Conventions

- All tables are **multi‑tenant** except `Tenants`.
- Every table (except `Tenants`) must include these audit fields:
  - `TenantId` (FK → `Tenants.TenantId`)
  - `CreatedOn` (datetime)
  - `CreatedBy` (FK → `Users.UserId` or system)
  - `ModifiedOn` (datetime, nullable)
  - `ModifiedBy` (FK → `Users.UserId`, nullable)
  - `IsActive` (boolean)

For brevity, these fields are omitted from the per‑table field lists but are implied.

---

## 2. Core & Security Entities

### 2.1 Tenants

- `Tenants`
  - `TenantId` (PK, GUID)
  - `Name`
  - `Code` (unique per tenant)
  - `Domain` (optional, for sub‑domains)
  - `IsActive`

### 2.2 Users & Roles

- `Users`
  - `UserId` (PK, GUID)
  - `Email` (unique per tenant)
  - `PasswordHash`
  - `FirstName`
  - `LastName`
  - `Phone` (masked for other parties)
  - `LastLoginAt` (datetime, nullable)
  - `LastActiveAt` (datetime, nullable)
  - `PresenceStatus` (enum: `Online`, `Away`, `Offline`)

- `Roles`
  - `RoleId` (PK, GUID)
  - `Name` (e.g., `Candidate`, `EmployerAdmin`, `EmployerRecruiter`, `InternalRecruiter`, `AssessmentAuthor`, `TenantAdmin`, `SysAdmin`)

- `UserRoles`
  - `UserRoleId` (PK, GUID)
  - `UserId` (FK → `Users`)
  - `RoleId` (FK → `Roles`)

---

## 3. Company / Employer / Recruiter

- `Companies`
  - `CompanyId` (PK, GUID)
  - `Name`
  - `LogoUrl`
  - `Industry`
  - `Website`
  - `Description`
  - `IsInternalRecruitmentCompany` (bool) // your own company vs client
  - `AverageRating` (decimal, computed/denormalized)

- `CompanyUsers`
  - `CompanyUserId` (PK, GUID)
  - `CompanyId` (FK → `Companies`)
  - `UserId` (FK → `Users`)
  - `Title` (e.g., Recruiter, HR Manager)

- `EmployerRatings`
  - `EmployerRatingId` (PK, GUID)
  - `CompanyId` (FK → `Companies`)
  - `CandidateUserId` (FK → `Users` with candidate role)
  - `Rating` (1–5)
  - `Comment`

---

## 4. Candidate Profile & Resume

- `CandidateProfiles`
  - `CandidateProfileId` (PK, GUID)
  - `UserId` (FK → `Users`)
  - `CurrentTitle`
  - `CurrentCompany`
  - `TotalExperienceYears` (decimal)
  - `LocationCity`
  - `LocationCountry`
  - `PreferredLocations` (text/JSON)
  - `PreferredJobTypes` (enum set: FullTime, Contract, Remote, Hybrid, etc.)
  - `ExpectedSalaryMin`
  - `ExpectedSalaryMax`
  - `JobSearchMode` (enum: `Aggressive`, `Active`, `Moderate`, `Passive`, `NotLooking`)
  - `Headline`
  - `Summary` (text)
  - `VisibilityStatus` (enum: `Public`, `Masked`, `Hidden`)

- `CandidateExperiences`
  - `CandidateExperienceId` (PK, GUID)
  - `CandidateProfileId` (FK → `CandidateProfiles`)
  - `CompanyName`
  - `JobTitle`
  - `StartDate`
  - `EndDate` (nullable)
  - `Description` (text)

- `CandidateEducations`
  - `CandidateEducationId` (PK, GUID)
  - `CandidateProfileId` (FK → `CandidateProfiles`)
  - `Institution`
  - `Degree`
  - `FieldOfStudy`
  - `StartDate`
  - `EndDate` (nullable)

- `CandidateSkills`
  - `CandidateSkillId` (PK, GUID)
  - `CandidateProfileId` (FK → `CandidateProfiles`)
  - `SkillName`
  - `ProficiencyLevel` (enum: Beginner, Intermediate, Advanced, Expert)
  - `YearsOfExperience` (decimal, nullable)

- `CandidateResumes`
  - `CandidateResumeId` (PK, GUID)
  - `CandidateProfileId` (FK → `CandidateProfiles`)
  - `FileUrl`
  - `OriginalFileName`
  - `MimeType`
  - `ParsedAt` (datetime, nullable)

- `ParsedResumes`
  - `ParsedResumeId` (PK, GUID)
  - `CandidateResumeId` (FK → `CandidateResumes`)
  - `RawText` (text)
  - `ParsedJson` (JSON) // structured fields from extractor

---

## 5. Jobs & ATS

- `JobPostings`
  - `JobPostingId` (PK, GUID)
  - `CompanyId` (FK → `Companies`)
  - `PostedByUserId` (FK → `Users`)
  - `Title`
  - `Description` (text)
  - `LocationCity`
  - `LocationCountry`
  - `EmploymentType` (enum)
  - `MinExperienceYears` (decimal, nullable)
  - `MaxExperienceYears` (decimal, nullable)
  - `SalaryRangeMin` (nullable)
  - `SalaryRangeMax` (nullable)
  - `SkillsRequired` (text/JSON)
  - `Status` (enum: `Draft`, `PendingApproval`, `Published`, `OnHold`, `Closed`, `Archived`)
  - `PublishedAt` (datetime, nullable)
  - `ExternalReferenceId` (nullable, for client ATSes)

- `JobPostingChannels`
  - `JobPostingChannelId` (PK, GUID)
  - `Name` (e.g., InternalBoard, LinkedIn, Indeed, Naukri)
  - `ApiConfigJson` (JSON, integration details)

- `JobPostingChannelMappings`
  - `JobPostingChannelMappingId` (PK, GUID)
  - `JobPostingId` (FK → `JobPostings`)
  - `JobPostingChannelId` (FK → `JobPostingChannels`)
  - `ExternalJobId` (nullable)
  - `Status` (enum: `Pending`, `Posted`, `Failed`, `Removed`)
  - `LastSyncAt` (datetime, nullable)

- `Applications`
  - `ApplicationId` (PK, GUID)
  - `JobPostingId` (FK → `JobPostings`)
  - `CandidateProfileId` (FK → `CandidateProfiles`)
  - `Source` (enum: DirectApply, InternalSubmission, ExternalImport)
  - `CurrentStatus` (enum: `New`, `Screening`, `OnlineTest`, `Interview`, `Offer`, `Hired`, `Rejected`, `Withdrawn`)
  - `AtsMatchScore` (decimal, nullable)
  - `CandidateRatingByEmployer` (decimal, nullable)
  - `EmployerNotes` (text, nullable)

- `ApplicationStatusHistory`
  - `ApplicationStatusHistoryId` (PK, GUID)
  - `ApplicationId` (FK → `Applications`)
  - `FromStatus` (enum, nullable)
  - `ToStatus` (enum)
  - `ChangedByUserId` (FK → `Users`)
  - `ChangedOn` (datetime)
  - `Comment` (text, nullable)

---

## 6. Screening & AI‑Driven Workflows

- `ScreeningTemplates`
  - `ScreeningTemplateId` (PK, GUID)
  - `Name`
  - `Description`
  - `ConfigJson` (JSON for AI prompts / fixed questions)

- `ApplicationScreenings`
  - `ApplicationScreeningId` (PK, GUID)
  - `ApplicationId` (FK → `Applications`)
  - `ScreeningTemplateId` (FK → `ScreeningTemplates`, nullable)
  - `StartedAt`
  - `CompletedAt` (nullable)
  - `AiSummary` (text, nullable)
  - `AiScore` (decimal, nullable)

- `ApplicationScreeningQuestions`
  - `ApplicationScreeningQuestionId` (PK, GUID)
  - `ApplicationScreeningId` (FK → `ApplicationScreenings`)
  - `QuestionText`
  - `OrderIndex` (int)

- `ApplicationScreeningAnswers`
  - `ApplicationScreeningAnswerId` (PK, GUID)
  - `ApplicationScreeningQuestionId` (FK → `ApplicationScreeningQuestions`)
  - `AnswerText`
  - `AnswerScore` (decimal, nullable)

---

## 7. Online Tests / Assessments

- `AssessmentTests`
  - `AssessmentTestId` (PK, GUID)
  - `Name`
  - `Description`
  - `TotalDurationMinutes`
  - `MaxScore`
  - `CreatedByUserId` (FK → `Users`)

- `AssessmentSections`
  - `AssessmentSectionId` (PK, GUID)
  - `AssessmentTestId` (FK → `AssessmentTests`)
  - `Name`
  - `Description`
  - `OrderIndex` (int)
  - `DurationMinutes` (nullable)

- `AssessmentQuestions`
  - `AssessmentQuestionId` (PK, GUID)
  - `AssessmentSectionId` (FK → `AssessmentSections`)
  - `QuestionType` (enum: MCQ, MultipleSelect, Descriptive, Coding)
  - `QuestionText`
  - `MaxScore`
  - `NegativeScore` (decimal, nullable)
  - `MetadataJson` (JSON – coding language, constraints, etc.)

- `AssessmentOptions`
  - `AssessmentOptionId` (PK, GUID)
  - `AssessmentQuestionId` (FK → `AssessmentQuestions`)
  - `OptionText`
  - `IsCorrect` (bool)
  - `OrderIndex` (int)

- `ApplicationAssessments`
  - `ApplicationAssessmentId` (PK, GUID)
  - `ApplicationId` (FK → `Applications`)
  - `AssessmentTestId` (FK → `AssessmentTests`)
  - `AssignedByUserId` (FK → `Users`)
  - `AssignedAt`

- `AssessmentSessions`
  - `AssessmentSessionId` (PK, GUID)
  - `ApplicationAssessmentId` (FK → `ApplicationAssessments`)
  - `CandidateProfileId` (FK → `CandidateProfiles`)
  - `SessionToken` (unique, for URL)
  - `StartedAt` (nullable)
  - `CompletedAt` (nullable)
  - `TotalScore` (decimal, nullable)
  - `Status` (enum: `Pending`, `InProgress`, `Completed`, `Expired`, `TerminatedForViolations`)

- `AssessmentAnswers`
  - `AssessmentAnswerId` (PK, GUID)
  - `AssessmentSessionId` (FK → `AssessmentSessions`)
  - `AssessmentQuestionId` (FK → `AssessmentQuestions`)
  - `SelectedOptionIds` (JSON, for MCQ/MultiSelect)
  - `DescriptiveAnswerText` (text, nullable)
  - `CodeAnswerText` (text, nullable)
  - `Score` (decimal, nullable)
  - `AnsweredAt` (datetime)

- `ProctoringEvents`
  - `ProctoringEventId` (PK, GUID)
  - `AssessmentSessionId` (FK → `AssessmentSessions`)
  - `EventType` (enum: `TabBlur`, `TabFocus`, `WarningShown`, `ForcedLogout`, `CameraError`)
  - `OccurredAt` (datetime)
  - `DetailsJson` (JSON – browser data, etc.)

- `AssessmentSessionVideos`
  - `AssessmentSessionVideoId` (PK, GUID)
  - `AssessmentSessionId` (FK → `AssessmentSessions`)
  - `VideoUrl`
  - `StartedAt`
  - `EndedAt`

---

## 8. Communication (Chat, Voice, Video)

- `ChatThreads`
  - `ChatThreadId` (PK, GUID)
  - `ContextType` (enum: `Application`, `Job`, `Direct`)
  - `ContextId` (FK depending on type)

- `ChatParticipants`
  - `ChatParticipantId` (PK, GUID)
  - `ChatThreadId` (FK → `ChatThreads`)
  - `UserId` (FK → `Users`)

- `ChatMessages`
  - `ChatMessageId` (PK, GUID)
  - `ChatThreadId` (FK → `ChatThreads`)
  - `SenderUserId` (FK → `Users`)
  - `MessageText` (text) // after masking PII
  - `OriginalMessageText` (text, nullable, encrypted) // optional for audit
  - `HasMaskedPii` (bool)
  - `SentAt` (datetime)

- `CallSessions`
  - `CallSessionId` (PK, GUID)
  - `ChatThreadId` (FK → `ChatThreads`, nullable)
  - `InitiatorUserId` (FK → `Users`)
  - `CallType` (enum: `Voice`, `Video`)
  - `StartedAt`
  - `EndedAt` (nullable)
  - `RecordingUrl` (nullable)

---

## 9. Subscriptions & Billing

- `SubscriptionPlans`
  - `SubscriptionPlanId` (PK, GUID)
  - `PlanType` (enum: `Employer`, `Candidate`)
  - `Name`
  - `Description`
  - `PricePerMonth`
  - `PricePerYear` (nullable)
  - `FeaturesJson` (JSON – limits, capabilities)

- `Subscriptions`
  - `SubscriptionId` (PK, GUID)
  - `SubscriptionPlanId` (FK → `SubscriptionPlans`)
  - `CompanyId` (FK → `Companies`, nullable for candidate plans)
  - `UserId` (FK → `Users`, nullable for candidate plans)
  - `Status` (enum: `Trial`, `Active`, `Suspended`, `Cancelled`, `Expired`)
  - `StartDate`
  - `EndDate` (nullable)
  - `ExternalCustomerId` (payment provider)

- `Payments`
  - `PaymentId` (PK, GUID)
  - `SubscriptionId` (FK → `Subscriptions`)
  - `Amount`
  - `Currency`
  - `PaidAt`
  - `ExternalPaymentId`
  - `Status` (enum: `Pending`, `Paid`, `Failed`, `Refunded`)

---

## 10. LLM Assistants

- `ChatAssistSessions`
  - `ChatAssistSessionId` (PK, GUID)
  - `Type` (enum: `EmployerAssistant`, `CandidateAssistant`)
  - `StartedByUserId` (FK → `Users`)
  - `StartedAt`
  - `EndedAt` (nullable)

- `ChatAssistMessages`
  - `ChatAssistMessageId` (PK, GUID)
  - `ChatAssistSessionId` (FK → `ChatAssistSessions`)
  - `SenderType` (enum: `User`, `Assistant`)
  - `MessageText` (text)
  - `SentAt` (datetime)

---

## 11. Notifications & Events

- `NotificationTemplates`
  - `NotificationTemplateId` (PK, GUID)
  - `Name`
  - `Channel` (enum: `Email`, `InApp`, `Push`)
  - `SubjectTemplate`
  - `BodyTemplate`
  - `Locale`

- `Notifications`
  - `NotificationId` (PK, GUID)
  - `UserId` (FK → `Users`)
  - `Channel` (enum)
  - `Title`
  - `Body`
  - `IsRead` (bool)
  - `SentAt` (datetime, nullable)

- `DomainEvents`
  - `DomainEventId` (PK, GUID)
  - `EventType` (string – e.g., `JobPosted`, `ApplicationCreated`, `AssessmentCompleted`)
  - `PayloadJson` (JSON)
  - `OccurredAt`
  - `ProcessedAt` (datetime, nullable)

---

## 12. High‑Level ER Relationships (Textual)

- `Tenants` 1‑* `Users`
- `Users` *‑* `Roles` via `UserRoles`
- `Tenants` 1‑* `Companies`
- `Companies` 1‑* `CompanyUsers` *‑1 `Users`
- `Users` 1‑1 `CandidateProfiles`
- `CandidateProfiles` 1‑* `CandidateExperiences` / `CandidateEducations` / `CandidateSkills` / `CandidateResumes`
- `CandidateResumes` 1‑1 `ParsedResumes`
- `Companies` 1‑* `JobPostings`
- `JobPostings` 1‑* `Applications` *‑1 `CandidateProfiles`
- `Applications` 1‑* `ApplicationStatusHistory`
- `Applications` 1‑* `ApplicationScreenings` 1‑* `ApplicationScreeningQuestions` 1‑1 `ApplicationScreeningAnswers`
- `JobPostings` 1‑* `JobPostingChannelMappings` *‑1 `JobPostingChannels`
- `Applications` 1‑* `ApplicationAssessments` 1‑* `AssessmentSessions` 1‑* `AssessmentAnswers`
- `AssessmentTests` 1‑* `AssessmentSections` 1‑* `AssessmentQuestions` 1‑* `AssessmentOptions`
- `AssessmentSessions` 1‑* `ProctoringEvents` and 1‑* `AssessmentSessionVideos`
- `ChatThreads` 1‑* `ChatParticipants` *‑1 `Users`
- `ChatThreads` 1‑* `ChatMessages`
- `ChatThreads` 0..1‑* `CallSessions`
- `Companies` 1‑* `Subscriptions` or `Users` 1‑* `Subscriptions`
- `SubscriptionPlans` 1‑* `Subscriptions` 1‑* `Payments`
- `Users` 1‑* `ChatAssistSessions` 1‑* `ChatAssistMessages`
- `Users` 1‑* `Notifications`



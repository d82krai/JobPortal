export type UserRole =
  | 'Candidate'
  | 'EmployerAdmin'
  | 'EmployerRecruiter'
  | 'InternalRecruiter'
  | 'AssessmentAuthor'
  | 'TenantAdmin';

export type PresenceStatus = 'Online' | 'Away' | 'Offline';

export type JobSearchMode = 'Aggressive' | 'Active' | 'Moderate' | 'Passive' | 'NotLooking';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  presence: PresenceStatus;
  lastActiveAt?: string;
}

export interface CandidateProfileSummary {
  id: string;
  name: string;
  currentTitle: string;
  location: string;
  totalExperienceYears: number;
  jobSearchMode: JobSearchMode;
  presence: PresenceStatus;
  lastActiveAt: string;
  maskedEmail: string;
  maskedPhone: string;
  skills: string[];
  atsScore?: number;
}

export interface JobSummary {
  id: string;
  title: string;
  companyName: string;
  location: string;
  employmentType: string;
  status: string;
  postedAt: string;
  applicationsCount: number;
}




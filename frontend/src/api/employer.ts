import type { CandidateProfileSummary, JobSummary } from '../types';
import type { ApplicationStatus, CandidateApplicationSummary } from './candidate';

export interface EmployerDashboardStats {
  openRoles: number;
  newApplicationsToday: number;
  testsScheduled: number;
  timeToHireDays: number;
}

export interface EmployerSubscriptionSummary {
  planName: string;
  externalPostingsRemaining: number;
}

export interface EmployerJob extends JobSummary {
  description: string;
  skillsRequired: string[];
}

export interface EmployerApplication extends CandidateApplicationSummary {
  candidateId: string;
}

// Mocked data fetchers – replace with real HTTP calls:
// - GET /jobs?companyId=...
// - GET /jobs/{id}
// - GET /jobs/{id}/applications
// - Any dashboard/summary endpoints.

export const fetchEmployerDashboardStats = async (): Promise<EmployerDashboardStats> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    openRoles: 5,
    newApplicationsToday: 18,
    testsScheduled: 6,
    timeToHireDays: 21
  };
};

export const fetchEmployerSubscriptionSummary = async (): Promise<EmployerSubscriptionSummary> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    planName: 'Pro',
    externalPostingsRemaining: 30
  };
};

export const fetchEmployerJobs = async (): Promise<EmployerJob[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const nowIso = new Date().toISOString();
  return [
    {
      id: 'j1',
      title: 'Senior React Engineer',
      companyName: 'QuikSync Consulting',
      location: 'Remote • India',
      employmentType: 'Full-time',
      status: 'Published',
      postedAt: nowIso,
      applicationsCount: 24,
      description: 'Own the front-end of complex SaaS products using React and TypeScript.',
      skillsRequired: ['React', 'TypeScript', 'Node.js']
    },
    {
      id: 'j2',
      title: 'DevOps Engineer',
      companyName: 'ClientCorp Ltd.',
      location: 'Bangalore, India',
      employmentType: 'Full-time',
      status: 'Published',
      postedAt: nowIso,
      applicationsCount: 11,
      description: 'Manage CI/CD and cloud infra for high-availability systems.',
      skillsRequired: ['Kubernetes', 'AWS', 'CI/CD']
    }
  ];
};

export const fetchEmployerJobById = async (id: string): Promise<EmployerJob | null> => {
  const all = await fetchEmployerJobs();
  return all.find((j) => j.id === id) ?? null;
};

export const fetchApplicationsForJobMock = async (
  jobId: string
): Promise<EmployerApplication[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const now = Date.now();
  const base: EmployerApplication[] = [
    {
      id: 'a1',
      jobId,
      jobTitle: 'Senior React Engineer',
      companyName: 'QuikSync Consulting',
      location: 'Remote • India',
      status: 'OnlineTest' as ApplicationStatus,
      appliedAt: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
      atsScore: 92,
      candidateId: 'c1'
    },
    {
      id: 'a2',
      jobId,
      jobTitle: 'Senior React Engineer',
      companyName: 'QuikSync Consulting',
      location: 'Remote • India',
      status: 'Screening' as ApplicationStatus,
      appliedAt: new Date(now - 1000 * 60 * 60 * 24 * 1).toISOString(),
      atsScore: 85,
      candidateId: 'c2'
    }
  ];
  return base;
};

export const fetchApplicationByIdMock = async (
  applicationId: string
): Promise<EmployerApplication | null> => {
  // For now, reuse mocked jobId "j1" and return a single record.
  const apps = await fetchApplicationsForJobMock('j1');
  return apps.find((a) => a.id === applicationId) ?? null;
};

export const updateApplicationStatusMock = async (
  applicationId: string,
  status: ApplicationStatus
): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 250));
  console.info('Updating application status (mock):', applicationId, status);
};

export const rateApplicationMock = async (
  applicationId: string,
  rating: number,
  comment?: string
): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 250));
  console.info('Rating application (mock):', applicationId, rating, comment);
};

export const fetchSuggestedCandidatesMock = async (): Promise<CandidateProfileSummary[]> => {
  await new Promise((resolve) => setTimeout(resolve, 250));
  const nowIso = new Date().toISOString();
  return [
    {
      id: 'c1',
      name: 'Akash Verma',
      currentTitle: 'Senior Java Developer',
      location: 'Bangalore',
      totalExperienceYears: 7,
      jobSearchMode: 'Aggressive',
      presence: 'Online',
      lastActiveAt: nowIso,
      maskedEmail: 'aka***@masked.com',
      maskedPhone: '+91-XXXXXX1234',
      skills: ['Java', 'Spring Boot', 'Microservices'],
      atsScore: 94
    },
    {
      id: 'c2',
      name: 'Sara Lee',
      currentTitle: 'React Developer',
      location: 'Remote',
      totalExperienceYears: 4,
      jobSearchMode: 'Active',
      presence: 'Away',
      lastActiveAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      maskedEmail: 'sar***@masked.com',
      maskedPhone: '+1-XXX-XXX-9876',
      skills: ['React', 'TypeScript', 'Node.js'],
      atsScore: 88
    }
  ];
};

export const saveEmployerJobMock = async (job: Partial<EmployerJob>): Promise<EmployerJob> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const nowIso = new Date().toISOString();
  return {
    id: job.id ?? `j-${Date.now()}`,
    title: job.title ?? 'Untitled role',
    companyName: 'QuikSync Consulting',
    location: job.location ?? 'Remote',
    employmentType: job.employmentType ?? 'Full-time',
    status: job.status ?? 'Draft',
    postedAt: nowIso,
    applicationsCount: job.applicationsCount ?? 0,
    description: job.description ?? '',
    skillsRequired: job.skillsRequired ?? []
  };
};

export const publishJobMock = async (jobId: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  console.info('Publishing job (mock):', jobId);
};



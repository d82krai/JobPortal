import type { JobSummary } from '../types';

export interface CandidateDashboardStats {
  activeApplications: number;
  upcomingTests: number;
  unreadMessages: number;
  profileStrength: number;
}

export type ApplicationStatus =
  | 'New'
  | 'Screening'
  | 'OnlineTest'
  | 'Interview'
  | 'Offer'
  | 'Hired'
  | 'Rejected'
  | 'Withdrawn';

export interface CandidateApplicationSummary {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  location: string;
  status: ApplicationStatus;
  appliedAt: string;
  atsScore?: number;
}

// NOTE: these functions currently return mocked data.
// Later, they should be replaced with real HTTP calls to:
// - GET /jobs
// - GET /applications (for current candidate)
// - Any dashboard summary endpoints you introduce.

export const fetchCandidateDashboardStats = async (): Promise<CandidateDashboardStats> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    activeApplications: 7,
    upcomingTests: 2,
    unreadMessages: 4,
    profileStrength: 92
  };
};

export const fetchCandidateJobs = async (): Promise<JobSummary[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const nowIso = new Date().toISOString();
  return [
    {
      id: 'j1',
      title: 'Full‑stack Engineer (Node + React)',
      companyName: 'QuikSync Consulting',
      location: 'Remote • India',
      employmentType: 'Full-time',
      status: 'Published',
      postedAt: nowIso,
      applicationsCount: 18
    },
    {
      id: 'j2',
      title: 'Senior DevOps Engineer',
      companyName: 'ClientCorp Ltd.',
      location: 'Chennai, India',
      employmentType: 'Full-time',
      status: 'Published',
      postedAt: nowIso,
      applicationsCount: 9
    }
  ];
};

export const fetchCandidateApplications = async (): Promise<CandidateApplicationSummary[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const now = Date.now();
  return [
    {
      id: 'a1',
      jobId: 'j1',
      jobTitle: 'Full‑stack Engineer (Node + React)',
      companyName: 'QuikSync Consulting',
      location: 'Remote • India',
      status: 'OnlineTest',
      appliedAt: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
      atsScore: 91
    },
    {
      id: 'a2',
      jobId: 'j2',
      jobTitle: 'Senior DevOps Engineer',
      companyName: 'ClientCorp Ltd.',
      location: 'Chennai, India',
      status: 'Screening',
      appliedAt: new Date(now - 1000 * 60 * 60 * 24 * 1).toISOString(),
      atsScore: 84
    }
  ];
};

export const applyToJobMock = async (jobId: string): Promise<{ applicationId: string }> => {
  console.info('Applying to job (mock):', jobId);
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { applicationId: `a-${jobId}-${Date.now()}` };
};



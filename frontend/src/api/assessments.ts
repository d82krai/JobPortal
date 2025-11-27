export interface ScreeningQuestion {
  id: string;
  text: string;
  answer?: string;
  score?: number;
}

export interface ScreeningSession {
  id: string;
  applicationId: string;
  startedAt: string;
  completedAt?: string;
  aiSummary?: string;
  aiScore?: number;
  questions: ScreeningQuestion[];
}

export interface AssessmentTestSummary {
  id: string;
  name: string;
  description: string;
  totalDurationMinutes: number;
  questionsCount: number;
}

export interface AssessmentTestDetail extends AssessmentTestSummary {
  sections: {
    id: string;
    name: string;
    durationMinutes?: number;
  }[];
}

export interface AssessmentSession {
  id: string;
  token: string;
  testName: string;
  candidateName: string;
  durationMinutes: number;
  questions: {
    id: string;
    text: string;
    options: string[];
  }[];
}

export interface AssessmentReport {
  id: string;
  candidateName: string;
  testName: string;
  score: number;
  maxScore: number;
  violations: number;
  videoUrl?: string;
  questions: {
    id: string;
    text: string;
    selectedOptions: string[];
    correctOptions: string[];
  }[];
}

// Mocked implementations – wire these to real backend endpoints in future:
// - POST /applications/{id}/screenings
// - GET /screenings/{id}
// - GET /assessments/tests
// - GET /assessments/tests/{id}
// - GET /assessments/sessions/{token}
// - POST /assessments/sessions/{token}/proctoring/events
// - POST /assessments/sessions/{token}/proctoring/video
// - GET /assessments/sessions/{id}/report

export const startScreeningMock = async (applicationId: string): Promise<ScreeningSession> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const now = new Date().toISOString();
  return {
    id: `scr-${applicationId}`,
    applicationId,
    startedAt: now,
    completedAt: now,
    aiSummary:
      'Candidate has 5+ years of relevant experience and matches the key technology stack and location preference.',
    aiScore: 88,
    questions: [
      {
        id: 'q1',
        text: 'How many years of hands-on experience do you have with React or a similar framework?',
        answer: '5+ years',
        score: 5
      },
      {
        id: 'q2',
        text: 'What is your current notice period?',
        answer: '30 days',
        score: 4
      }
    ]
  };
};

export const fetchScreeningMock = async (screeningId: string): Promise<ScreeningSession> => {
  // For now just delegate to startScreeningMock with screeningId as applicationId
  return startScreeningMock(screeningId);
};

export const fetchAssessmentTestsMock = async (): Promise<AssessmentTestSummary[]> => {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return [
    {
      id: 't1',
      name: 'Full‑stack Engineer Screening',
      description: '45 mins • 20 questions • Used 34 times',
      totalDurationMinutes: 45,
      questionsCount: 20
    },
    {
      id: 't2',
      name: 'Senior Java Backend',
      description: '60 mins • 25 questions • Used 12 times',
      totalDurationMinutes: 60,
      questionsCount: 25
    }
  ];
};

export const fetchAssessmentTestDetailMock = async (
  id: string
): Promise<AssessmentTestDetail | null> => {
  const list = await fetchAssessmentTestsMock();
  const base = list.find((t) => t.id === id);
  if (!base) return null;
  return {
    ...base,
    sections: [
      { id: 's1', name: 'Core concepts', durationMinutes: 20 },
      { id: 's2', name: 'Applied scenarios', durationMinutes: 25 }
    ]
  };
};

export const fetchAssessmentSessionMock = async (
  token: string
): Promise<AssessmentSession> => {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return {
    id: `sess-${token}`,
    token,
    testName: 'Full‑stack Engineer Screening',
    candidateName: 'Jane Doe',
    durationMinutes: 45,
    questions: [
      {
        id: 'q1',
        text: 'What is the time complexity of binary search on a sorted array?',
        options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)']
      },
      {
        id: 'q2',
        text: 'Which HTTP status code represents “Created”?',
        options: ['200', '201', '204', '400']
      }
    ]
  };
};

export const sendProctoringEventMock = async (
  token: string,
  eventType: string
): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.info('Proctoring event (mock):', token, eventType);
};

export const fetchAssessmentReportMock = async (
  sessionId: string
): Promise<AssessmentReport> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    id: sessionId,
    candidateName: 'Jane Doe',
    testName: 'Full‑stack Engineer Screening',
    score: 38,
    maxScore: 45,
    violations: 1,
    videoUrl: 'https://example.com/proctoring/demo-video',
    questions: [
      {
        id: 'q1',
        text: 'What is the time complexity of binary search on a sorted array?',
        selectedOptions: ['O(log n)'],
        correctOptions: ['O(log n)']
      },
      {
        id: 'q2',
        text: 'Which HTTP status code represents “Created”?',
        selectedOptions: ['201'],
        correctOptions: ['201']
      }
    ]
  };
};



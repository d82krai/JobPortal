import React, { useEffect, useState } from 'react';
import { Box, Button, LinearProgress, Stack, Typography, Alert } from '@mui/material';
import {
  fetchAssessmentSessionMock,
  sendProctoringEventMock,
  type AssessmentSession
} from '../../api/assessments';

interface Props {
  sessionToken?: string;
}

export const TestPlayer: React.FC<Props> = ({ sessionToken = 'demo-token' }) => {
  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [warnings, setWarnings] = useState(0);
  const [terminated, setTerminated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchAssessmentSessionMock(sessionToken)
      .then((s) => {
        if (!isMounted) return;
        setSession(s);
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    const handleBlur = () => {
      setWarnings((prev) => {
        const next = prev + 1;
        if (next >= 3) {
          setTerminated(true);
        }
        return next;
      });
      void sendProctoringEventMock(sessionToken, 'TabBlur');
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('blur', handleBlur);
      window.clearInterval(intervalId);
    };
  }, [sessionToken]);

  if (loading || !session) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Loading test session…
        </Typography>
      </Box>
    );
  }

  const total = session.questions.length;
  const progress = ((currentIndex + 1) / total) * 100;

  const q = session.questions[currentIndex];

  return (
    <Box
      sx={{
        borderRadius: 3,
        border: '1px solid rgba(148,163,184,0.35)',
        bgcolor: 'background.paper',
        p: 2
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" fontWeight={600}>
            Online Proctored Test
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Tab switches remaining before auto‑logout: {Math.max(0, 3 - warnings)}
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 6, borderRadius: 999 }}
        />

        {warnings > 0 && !terminated && (
          <Alert severity="warning" variant="outlined">
            We detected that you switched tabs or windows. After 3 warnings this session will
            be terminated and your attempt will be auto‑submitted.
          </Alert>
        )}

        {terminated ? (
          <Alert severity="error" variant="filled">
            You exceeded the maximum tab switch limit. Your test has been terminated and your
            answers will be submitted for review.
          </Alert>
        ) : (
          <>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Question {currentIndex + 1} of {total}
              </Typography>
              <Typography variant="body1">{q.text}</Typography>
            </Box>

            <Stack spacing={1}>
              {q.options.map((opt) => (
                <Button
                  key={opt}
                  variant="outlined"
                  sx={{ justifyContent: 'flex-start', borderRadius: 2 }}
                >
                  {opt}
                </Button>
              ))}
            </Stack>

            <Stack direction="row" justifyContent="space-between" mt={1}>
              <Button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              >
                Previous
              </Button>
              <Stack direction="row" spacing={1}>
                {currentIndex < total - 1 && (
                  <Button
                    variant="contained"
                    onClick={() =>
                      setCurrentIndex((i) => Math.min(total - 1, i + 1))
                    }
                  >
                    Next
                  </Button>
                )}
                {currentIndex === total - 1 && (
                  <Button variant="contained" color="secondary">
                    Submit Test
                  </Button>
                )}
              </Stack>
            </Stack>
          </>
        )}
      </Stack>
    </Box>
  );
};



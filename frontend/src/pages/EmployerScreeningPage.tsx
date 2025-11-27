import React, { useEffect, useState } from 'react';
import { Alert, Button, Paper, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import {
  fetchScreeningMock,
  startScreeningMock,
  type ScreeningSession
} from '../api/assessments';

export const EmployerScreeningPage: React.FC = () => {
  const { applicationId } = useParams();
  const [screening, setScreening] = useState<ScreeningSession | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!applicationId) return;
    setLoading(true);
    const session = await startScreeningMock(applicationId);
    setScreening(session);
    setLoading(false);
  };

  useEffect(() => {
    if (!applicationId) return;
    let isMounted = true;
    fetchScreeningMock(applicationId)
      .then((s) => {
        if (!isMounted) return;
        setScreening(s);
      })
      .catch(() => undefined);
    return () => {
      isMounted = false;
    };
  }, [applicationId]);

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h5">AI / basic screening</Typography>
        <Typography variant="body2" color="text.secondary">
          Start AI‑driven screening for this application and review the Q&A plus AI summary and
          score.
        </Typography>
      </Stack>

      {!screening && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" mb={1}>
            No screening has been run for this application yet.
          </Typography>
          <Button variant="contained" size="small" onClick={handleStart} disabled={loading}>
            {loading ? 'Starting…' : 'Start screening'}
          </Button>
        </Paper>
      )}

      {screening && (
        <Paper sx={{ p: 2 }}>
          {typeof screening.aiScore === 'number' && (
            <Alert severity="info" sx={{ mb: 2 }}>
              AI score: <strong>{screening.aiScore}</strong>/100
            </Alert>
          )}
          {screening.aiSummary && (
            <Typography variant="body2" mb={2}>
              {screening.aiSummary}
            </Typography>
          )}
          <Typography variant="subtitle2" gutterBottom>
            Screening questions & answers
          </Typography>
          <Stack spacing={1}>
            {screening.questions.map((q) => (
              <Stack key={q.id} spacing={0.5}>
                <Typography variant="body2" fontWeight={600}>
                  {q.text}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {q.answer}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Paper>
      )}
    </Stack>
  );
};



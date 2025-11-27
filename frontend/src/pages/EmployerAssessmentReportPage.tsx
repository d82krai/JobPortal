import React, { useEffect, useState } from 'react';
import { Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { fetchAssessmentReportMock, type AssessmentReport } from '../api/assessments';

export const EmployerAssessmentReportPage: React.FC = () => {
  const { sessionId } = useParams();
  const [report, setReport] = useState<AssessmentReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;
    let isMounted = true;
    fetchAssessmentReportMock(sessionId)
      .then((data) => {
        if (!isMounted) return;
        setReport(data);
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h5">Assessment report</Typography>
        <Typography variant="body2" color="text.secondary">
          Review candidate score, detailed question breakdown, violations, and proctoring video
          link.
        </Typography>
      </Stack>

      {loading && (
        <Typography variant="body2" color="text.secondary">
          Loading assessment report…
        </Typography>
      )}

      {!loading && report && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Summary
              </Typography>
              <Typography variant="body2" gutterBottom>
                {report.candidateName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {report.testName}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                <Chip
                  label={`Score: ${report.score}/${report.maxScore}`}
                  color="success"
                  size="small"
                />
                <Chip
                  label={`${report.violations} proctoring violations`}
                  color={report.violations > 0 ? 'warning' : 'default'}
                  size="small"
                />
              </Stack>
              {report.videoUrl && (
                <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                  Proctoring video:{' '}
                  <a href={report.videoUrl} target="_blank" rel="noreferrer">
                    Open recording
                  </a>
                </Typography>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Questions & answers
              </Typography>
              <Stack spacing={1.5}>
                {report.questions.map((q) => (
                  <Stack key={q.id} spacing={0.5}>
                    <Typography variant="body2" fontWeight={600}>
                      {q.text}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Selected: {q.selectedOptions.join(', ') || '—'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Correct: {q.correctOptions.join(', ')}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Stack>
  );
};



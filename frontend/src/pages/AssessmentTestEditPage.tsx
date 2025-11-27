import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useParams } from 'react-router-dom';
import {
  fetchAssessmentTestDetailMock,
  type AssessmentTestDetail
} from '../api/assessments';

export const AssessmentTestEditPage: React.FC = () => {
  const { testId } = useParams();
  const isNew = !testId;
  const [test, setTest] = useState<AssessmentTestDetail | null>(null);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (!testId) return;
    let isMounted = true;
    fetchAssessmentTestDetailMock(testId)
      .then((data) => {
        if (!isMounted) return;
        setTest(
          data ?? {
            id: testId,
            name: '',
            description: '',
            totalDurationMinutes: 0,
            questionsCount: 0,
            sections: []
          }
        );
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [testId]);

  const handleChange = (field: keyof AssessmentTestDetail, value: unknown) => {
    setTest((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = () => {
    // In a real implementation, call POST/PUT /assessments/tests
    // For now we simply keep local state.
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h5">
          {isNew ? 'Create assessment test' : `Edit test: ${test?.name ?? ''}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Define the structure and metadata of the assessment test. Question authoring will be
          wired in future iterations.
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            {loading ? (
              <Typography variant="body2" color="text.secondary">
                Loading test details…
              </Typography>
            ) : (
              <Stack spacing={2}>
                <TextField
                  label="Test name"
                  size="small"
                  fullWidth
                  value={test?.name ?? ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
                <TextField
                  label="Description"
                  size="small"
                  multiline
                  minRows={3}
                  fullWidth
                  value={test?.description ?? ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
                <TextField
                  label="Total duration (minutes)"
                  size="small"
                  type="number"
                  fullWidth
                  value={test?.totalDurationMinutes ?? 0}
                  onChange={(e) =>
                    handleChange('totalDurationMinutes', Number(e.target.value) || 0)
                  }
                />
              </Stack>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Sections (read‑only preview)
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Once connected to section management APIs, this panel will let you add and arrange
              sections, set durations, and assign questions.
            </Typography>
            <Box mt={1}>
              {(test?.sections ?? []).map((s) => (
                <Typography key={s.id} variant="caption" display="block">
                  • {s.name} ({s.durationMinutes ?? 0} mins)
                </Typography>
              ))}
            </Box>
            <Box mt={2}>
              <Button size="small" variant="contained" onClick={handleSave}>
                Save
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
};



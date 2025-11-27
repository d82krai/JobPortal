import React, { useEffect, useState } from 'react';
import {
  Grid,
  Stack,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TestPlayer } from '../components/assessments/TestPlayer';
import {
  fetchAssessmentTestsMock,
  type AssessmentTestSummary
} from '../api/assessments';

export const AssessmentsPage: React.FC = () => {
  const [tests, setTests] = useState<AssessmentTestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    fetchAssessmentTestsMock()
      .then((data) => {
        if (!isMounted) return;
        setTests(data);
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h5">Assessments</Typography>
        <Typography variant="body2" color="text.secondary">
          Create and manage online tests, then review candidate scores and proctoring results.
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Live test session (demo)
            </Typography>
            <TestPlayer sessionToken="demo-token" />
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                Test templates
              </Typography>
              <Button
                size="small"
                variant="contained"
                onClick={() => navigate('/app/assessments/tests/new')}
              >
                New test
              </Button>
            </Stack>
            <List dense>
              {loading && (
                <ListItem>
                  <ListItemText
                    primary="Loading tests…"
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                  />
                </ListItem>
              )}
              {!loading &&
                tests.map((t) => (
                  <ListItem
                    key={t.id}
                    button
                    onClick={() => navigate(`/app/assessments/tests/${t.id}`)}
                  >
                    <ListItemText
                      primary={t.name}
                      secondary={t.description}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                    />
                  </ListItem>
                ))}
            </List>
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Proctoring policy
            </Typography>
            <Typography variant="caption" color="text.secondary">
              If the candidate switches tabs or leaves the test window more than 3 times, the
              session is automatically terminated and the recording is attached for recruiter
              review.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
};




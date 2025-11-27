import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
  Skeleton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { JobCard } from '../components/jobs/JobCard';
import type { EmployerJob } from '../api/employer';
import { fetchEmployerJobs } from '../api/employer';

export const EmployerJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<EmployerJob[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    fetchEmployerJobs()
      .then((data) => {
        if (!isMounted) return;
        setJobs(data);
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
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack spacing={0.5}>
          <Typography variant="h5">Job postings</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage job lifecycles, publish to external boards, and track application volumes.
          </Typography>
        </Stack>
        <Button
          variant="contained"
          size="small"
          onClick={() => navigate('/app/employer/jobs/new')}
        >
          Post new job
        </Button>
      </Stack>

      <Grid container spacing={2}>
        {loading &&
          [1, 2, 3].map((i) => (
            <Grid item xs={12} md={6} key={i}>
              <Skeleton variant="rounded" height={130} />
            </Grid>
          ))}
        {!loading && jobs.length === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                You haven&apos;t posted any jobs yet. Start by creating a new role.
              </Typography>
            </Paper>
          </Grid>
        )}
        {!loading &&
          jobs.map((job) => (
            <Grid item xs={12} md={6} key={job.id}>
              <Paper sx={{ p: 2 }}>
                <JobCard job={job} />
                <Box mt={1.5} display="flex" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={job.status}
                      size="small"
                      color={job.status === 'Published' ? 'success' : 'default'}
                    />
                    <Chip
                      label={`${job.skillsRequired.length} skills`}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/app/employer/jobs/${job.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/app/employer/jobs/${job.id}/applications`)}
                    >
                      Applications
                    </Button>
                  </Stack>
                </Box>
              </Paper>
            </Grid>
          ))}
      </Grid>
    </Stack>
  );
};



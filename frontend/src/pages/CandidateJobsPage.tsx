import React, { useEffect, useState } from 'react';
import {
  Grid,
  Stack,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { JobCard } from '../components/jobs/JobCard';
import type { JobSummary } from '../types';
import { applyToJobMock, fetchCandidateJobs } from '../api/candidate';

export const CandidateJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [filtered, setFiltered] = useState<JobSummary[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchCandidateJobs()
      .then((data) => {
        if (isMounted) {
          setJobs(data);
          setFiltered(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    setFiltered(
      jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(term) ||
          j.companyName.toLowerCase().includes(term) ||
          j.location.toLowerCase().includes(term)
      )
    );
  }, [jobs, search]);

  const handleApply = async (jobId: string) => {
    try {
      await applyToJobMock(jobId);
      setSnackbar('Application submitted (mock). In production this will call POST /jobs/{id}/apply.');
    } catch {
      setSnackbar('Failed to apply (mock).');
    }
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h5">Browse jobs</Typography>
        <Typography variant="body2" color="text.secondary">
          Search jobs that match your skills and preferences. ATS will match you to the most relevant roles.
        </Typography>
      </Stack>

      <Paper sx={{ p: 2, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by title, company, or location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            )
          }}
        />
      </Paper>

      <Grid container spacing={2}>
        {loading && (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              Loading jobs…
            </Typography>
          </Grid>
        )}
        {!loading &&
          filtered.map((job) => (
            <Grid item xs={12} md={6} key={job.id}>
              <Stack spacing={1.5}>
                <JobCard job={job} />
                <Button variant="contained" size="small" onClick={() => handleApply(job.id)}>
                  Apply
                </Button>
              </Stack>
            </Grid>
          ))}
        {!loading && filtered.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              No jobs match your search criteria yet.
            </Typography>
          </Grid>
        )}
      </Grid>

      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={4000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setSnackbar(null)} sx={{ width: '100%' }}>
          {snackbar}
        </Alert>
      </Snackbar>
    </Stack>
  );
};



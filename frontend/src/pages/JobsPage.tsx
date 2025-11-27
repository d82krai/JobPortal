import React from 'react';
import { Grid, Stack, Typography, TextField, InputAdornment, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { JobCard } from '../components/jobs/JobCard';
import type { JobSummary } from '../types';

const jobs: JobSummary[] = [
  {
    id: 'j1',
    title: 'Full‑stack Engineer (Node + React)',
    companyName: 'QuikSync Consulting',
    location: 'Remote • India',
    employmentType: 'Full-time',
    status: 'Published',
    postedAt: new Date().toISOString(),
    applicationsCount: 18
  },
  {
    id: 'j2',
    title: 'Senior DevOps Engineer',
    companyName: 'ClientCorp Ltd.',
    location: 'Chennai, India',
    employmentType: 'Full-time',
    status: 'Published',
    postedAt: new Date().toISOString(),
    applicationsCount: 9
  }
];

export const JobsPage: React.FC = () => (
  <Stack spacing={3}>
    <Stack spacing={0.5}>
      <Typography variant="h5">Jobs & Applications</Typography>
      <Typography variant="body2" color="text.secondary">
        Browse open roles, your applications, and ATS match scores.
      </Typography>
    </Stack>

    <Paper sx={{ p: 2, display: 'flex', gap: 2 }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Search by title, skill, location…"
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
      {jobs.map((job) => (
        <Grid item xs={12} md={6} key={job.id}>
          <JobCard job={job} />
        </Grid>
      ))}
    </Grid>
  </Stack>
);



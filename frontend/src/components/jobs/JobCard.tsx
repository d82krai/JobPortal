import React from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';
import WorkIcon from '@mui/icons-material/WorkOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import type { JobSummary } from '../../types';

interface Props {
  job: JobSummary;
}

export const JobCard: React.FC<Props> = ({ job }) => (
  <Box
    sx={{
      p: 2,
      borderRadius: 3,
      bgcolor: 'background.paper',
      border: '1px solid rgba(148,163,184,0.35)',
      display: 'flex',
      flexDirection: 'column',
      gap: 1
    }}
  >
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
      <Box>
        <Typography variant="subtitle1" fontWeight={600}>
          {job.title}
        </Typography>
        <Stack direction="row" spacing={1} mt={0.5} alignItems="center">
          <WorkIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            {job.companyName}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} mt={0.5} alignItems="center">
          <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            {job.location}
          </Typography>
        </Stack>
      </Box>
      <Chip label={job.status} size="small" color={job.status === 'Published' ? 'success' : 'default'} />
    </Stack>
    <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1}>
      <Typography variant="caption" color="text.secondary">
        Posted {new Date(job.postedAt).toLocaleDateString()}
      </Typography>
      <Chip
        label={`${job.applicationsCount} applications`}
        size="small"
        variant="outlined"
        sx={{ borderRadius: 999 }}
      />
    </Stack>
  </Box>
);



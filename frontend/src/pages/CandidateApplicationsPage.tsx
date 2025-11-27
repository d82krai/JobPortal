import React, { useEffect, useState } from 'react';
import {
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import {
  fetchCandidateApplications,
  type CandidateApplicationSummary,
  type ApplicationStatus
} from '../api/candidate';

const statusColor = (status: ApplicationStatus): 'default' | 'info' | 'warning' | 'success' | 'error' => {
  switch (status) {
    case 'New':
      return 'info';
    case 'Screening':
    case 'OnlineTest':
      return 'warning';
    case 'Interview':
    case 'Offer':
      return 'success';
    case 'Hired':
      return 'success';
    case 'Rejected':
    case 'Withdrawn':
      return 'error';
    default:
      return 'default';
  }
};

export const CandidateApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<CandidateApplicationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchCandidateApplications()
      .then((data) => {
        if (isMounted) {
          setApplications(data);
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

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h5">My applications</Typography>
        <Typography variant="body2" color="text.secondary">
          Track your applications across all employers, including screening, test, and interview status.
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            {loading && (
              <Typography variant="body2" color="text.secondary">
                Loading applications…
              </Typography>
            )}
            {!loading && applications.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                You haven&apos;t applied to any jobs yet.
              </Typography>
            )}
            {!loading && applications.length > 0 && (
              <List dense>
                {applications.map((app) => (
                  <ListItem
                    key={app.id}
                    sx={{
                      mb: 1,
                      borderRadius: 2,
                      border: '1px solid rgba(148,163,184,0.35)'
                    }}
                  >
                    <ListItemText
                      primary={
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Stack spacing={0.2}>
                            <Typography variant="body2" fontWeight={600}>
                              {app.jobTitle}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {app.companyName} • {app.location}
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={1} alignItems="center">
                            {typeof app.atsScore === 'number' && (
                              <Chip
                                label={`ATS: ${app.atsScore}%`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                            <Chip
                              label={app.status}
                              size="small"
                              color={statusColor(app.status)}
                            />
                          </Stack>
                        </Stack>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          Applied on {new Date(app.appliedAt).toLocaleDateString()}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
};



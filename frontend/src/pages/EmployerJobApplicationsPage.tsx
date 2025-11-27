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
import { useNavigate, useParams } from 'react-router-dom';
import { fetchApplicationsForJobMock, type EmployerApplication } from '../api/employer';
import type { ApplicationStatus } from '../api/candidate';

const statusColor = (status: ApplicationStatus): 'default' | 'info' | 'warning' | 'success' | 'error' => {
  switch (status) {
    case 'New':
      return 'info';
    case 'Screening':
    case 'OnlineTest':
      return 'warning';
    case 'Interview':
    case 'Offer':
    case 'Hired':
      return 'success';
    case 'Rejected':
    case 'Withdrawn':
      return 'error';
    default:
      return 'default';
  }
};

export const EmployerJobApplicationsPage: React.FC = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<EmployerApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobId) return;
    let isMounted = true;
    fetchApplicationsForJobMock(jobId)
      .then((data) => {
        if (!isMounted) return;
        setApplications(data);
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [jobId]);

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h5">Applications for job</Typography>
        <Typography variant="body2" color="text.secondary">
          Review candidates, check ATS scores, and drill into screening and assessment results.
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
                No applications received for this job yet.
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
                    secondaryAction={
                      <Chip
                        label={app.status}
                        size="small"
                        color={statusColor(app.status)}
                      />
                    }
                    onClick={() => navigate(`/app/employer/applications/${app.id}`)}
                    button
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={600}>
                          {app.jobTitle} • {app.companyName}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          Applied on {new Date(app.appliedAt).toLocaleDateString()} • ATS:{' '}
                          {app.atsScore ?? 'N/A'}%
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



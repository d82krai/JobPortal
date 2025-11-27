import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  MenuItem,
  Paper,
  Rating,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useParams } from 'react-router-dom';
import {
  fetchApplicationByIdMock,
  rateApplicationMock,
  updateApplicationStatusMock,
  type EmployerApplication
} from '../api/employer';
import type { ApplicationStatus } from '../api/candidate';

const statuses: ApplicationStatus[] = [
  'New',
  'Screening',
  'OnlineTest',
  'Interview',
  'Offer',
  'Hired',
  'Rejected',
  'Withdrawn'
];

export const EmployerApplicationDetailPage: React.FC = () => {
  const { applicationId } = useParams();
  const [application, setApplication] = useState<EmployerApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<ApplicationStatus>('New');
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (!applicationId) return;
    let isMounted = true;
    fetchApplicationByIdMock(applicationId)
      .then((data) => {
        if (!isMounted) return;
        setApplication(data);
        if (data) {
          setStatus(data.status);
        }
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [applicationId]);

  const handleUpdateStatus = async () => {
    if (!application) return;
    await updateApplicationStatusMock(application.id, status);
    setInfo(
      'Status updated (mock). In production this should call PATCH /applications/{id}/status.'
    );
  };

  const handleRate = async () => {
    if (!application || rating == null) return;
    await rateApplicationMock(application.id, rating, comment);
    setInfo(
      'Rating saved (mock). In production this should call POST /applications/{id}/rate and store candidate rating by employer.'
    );
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h5">Application details</Typography>
        <Typography variant="body2" color="text.secondary">
          View ATS match, update the application stage, and record your evaluation of the
          candidate.
        </Typography>
      </Stack>

      {info && (
        <Alert severity="info" onClose={() => setInfo(null)}>
          {info}
        </Alert>
      )}

      {loading && (
        <Typography variant="body2" color="text.secondary">
          Loading application…
        </Typography>
      )}

      {!loading && !application && (
        <Typography variant="body2" color="text.secondary">
          Application not found.
        </Typography>
      )}

      {!loading && application && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Stack spacing={1}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {application.jobTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {application.companyName} • {application.location}
                </Typography>
                <Box>
                  <Chip
                    label={`Current status: ${application.status}`}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  {typeof application.atsScore === 'number' && (
                    <Chip label={`ATS: ${application.atsScore}%`} size="small" />
                  )}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Applied on {new Date(application.appliedAt).toLocaleString()}
                </Typography>
              </Stack>
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Screening & assessments
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Once connected to backend APIs, this section will show AI screening summary, online
                test scores, candidate answers, and a link to their proctoring video.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Update application status
              </Typography>
              <TextField
                label="Status"
                select
                size="small"
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                fullWidth
                sx={{ mb: 1.5 }}
              >
                {statuses.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
              <Button size="small" variant="contained" onClick={handleUpdateStatus}>
                Save status
              </Button>
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Rate candidate
              </Typography>
              <Box mb={1}>
                <Rating
                  name="candidate-rating"
                  value={rating}
                  onChange={(_, newValue) => setRating(newValue)}
                />
              </Box>
              <TextField
                label="Notes"
                multiline
                minRows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                fullWidth
              />
              <Box mt={1.5}>
                <Button
                  size="small"
                  variant="outlined"
                  color="secondary"
                  onClick={handleRate}
                  disabled={rating == null}
                >
                  Save rating
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Stack>
  );
};



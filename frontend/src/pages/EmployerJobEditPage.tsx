import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import type { EmployerJob } from '../api/employer';
import { fetchEmployerJobById, publishJobMock, saveEmployerJobMock } from '../api/employer';

export const EmployerJobEditPage: React.FC = () => {
  const { jobId } = useParams();
  const isNew = !jobId;
  const navigate = useNavigate();

  const [job, setJob] = useState<Partial<EmployerJob>>({
    title: '',
    location: '',
    employmentType: 'Full-time',
    description: '',
    skillsRequired: []
  });
  const [skillDraft, setSkillDraft] = useState('');
  const [loading, setLoading] = useState(!isNew);
  const [snackbar, setSnackbar] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;
    let isMounted = true;
    fetchEmployerJobById(jobId)
      .then((data) => {
        if (!isMounted) return;
        if (data) {
          setJob(data);
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
  }, [jobId]);

  const handleSave = async () => {
    const saved = await saveEmployerJobMock(job);
    setJob(saved);
    setSnackbar('Job saved (mock). Wire this to POST/PATCH /jobs in your backend.');
    if (isNew) {
      navigate(`/app/employer/jobs/${saved.id}`, { replace: true });
    }
  };

  const handlePublish = async () => {
    if (!job.id) {
      await handleSave();
    }
    if (job.id) {
      await publishJobMock(job.id);
      setSnackbar(
        'Publish triggered (mock). In production this should call POST /jobs/{id}/publish.'
      );
    }
  };

  const handleAddSkill = () => {
    const trimmed = skillDraft.trim();
    if (!trimmed) return;
    setJob((prev) => ({
      ...prev,
      skillsRequired: [...(prev.skillsRequired ?? []), trimmed]
    }));
    setSkillDraft('');
  };

  const handleRemoveSkill = (skill: string) => {
    setJob((prev) => ({
      ...prev,
      skillsRequired: (prev.skillsRequired ?? []).filter((s) => s !== skill)
    }));
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack spacing={0.5}>
          <Typography variant="h5">
            {isNew ? 'Create job posting' : `Edit job: ${job.title || ''}`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Define the role, required skills, and location. You can publish to external job boards
            in one click based on your subscription.
          </Typography>
        </Stack>
        {job.status && (
          <Chip
            label={job.status}
            color={job.status === 'Published' ? 'success' : 'default'}
            size="small"
          />
        )}
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            {loading ? (
              <Typography variant="body2" color="text.secondary">
                Loading job details…
              </Typography>
            ) : (
              <Stack spacing={2}>
                <TextField
                  label="Title"
                  size="small"
                  value={job.title ?? ''}
                  onChange={(e) => setJob((prev) => ({ ...prev, title: e.target.value }))}
                  fullWidth
                />
                <TextField
                  label="Location"
                  size="small"
                  value={job.location ?? ''}
                  onChange={(e) => setJob((prev) => ({ ...prev, location: e.target.value }))}
                  fullWidth
                />
                <TextField
                  label="Employment type"
                  size="small"
                  value={job.employmentType ?? ''}
                  onChange={(e) =>
                    setJob((prev) => ({ ...prev, employmentType: e.target.value }))
                  }
                  fullWidth
                />
                <TextField
                  label="Description"
                  multiline
                  minRows={5}
                  value={job.description ?? ''}
                  onChange={(e) => setJob((prev) => ({ ...prev, description: e.target.value }))}
                  fullWidth
                />
              </Stack>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Required skills
            </Typography>
            <Box mb={1}>
              {(job.skillsRequired ?? []).map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  onDelete={() => handleRemoveSkill(skill)}
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
              ))}
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <TextField
                label="Add skill"
                size="small"
                value={skillDraft}
                onChange={(e) => setSkillDraft(e.target.value)}
                fullWidth
              />
              <Button variant="outlined" size="small" onClick={handleAddSkill}>
                Add
              </Button>
            </Stack>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Status & publishing
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={1}>
              After saving, you can publish this job internally and to external platforms in one
              click.
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="contained" onClick={handleSave}>
                Save
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                onClick={handlePublish}
              >
                Publish
              </Button>
            </Stack>
          </Paper>
        </Grid>
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



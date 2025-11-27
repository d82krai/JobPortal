import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import EditIcon from '@mui/icons-material/Edit';
import type { JobSearchMode } from '../types';

const jobSearchModes: JobSearchMode[] = ['Aggressive', 'Active', 'Moderate', 'Passive', 'NotLooking'];

export const CandidateProfilePage: React.FC = () => {
  const [headline, setHeadline] = useState('Senior React Engineer looking for SaaS roles');
  const [summary, setSummary] = useState(
    'Full‑stack engineer with 7+ years of experience building scalable web applications using React, Node.js, and cloud‑native architectures.'
  );
  const [location, setLocation] = useState('Bangalore, India');
  const [currentTitle, setCurrentTitle] = useState('Senior React Engineer');
  const [jobSearchMode, setJobSearchMode] = useState<JobSearchMode>('Aggressive');
  const [skills, setSkills] = useState<string[]>(['React', 'TypeScript', 'Node.js', 'Microservices']);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    setSkills((prev) => [...prev, trimmed]);
    setNewSkill('');
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleSave = () => {
    // TODO: replace with real API call to PATCH /candidates/me and show notification on success.
    // For now we just keep state in the UI.
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // TODO: call POST /candidates/me/resumes with multipart/form-data and refresh parsed profile.
    // For now we simply ignore the file and rely on backend integration later.
    console.info('Selected resume file:', file.name);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack spacing={0.5}>
          <Typography variant="h5">Profile & Resume</Typography>
          <Typography variant="body2" color="text.secondary">
            Keep your profile and resume up to date so employers can discover you with accurate ATS
            matching.
          </Typography>
        </Stack>
        <Chip label={`Job search mode: ${jobSearchMode}`} color="success" />
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1" fontWeight={600}>
                Profile summary
              </Typography>
              <IconButton size="small">
                <EditIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Stack spacing={2}>
              <TextField
                label="Headline"
                size="small"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                fullWidth
              />
              <TextField
                label="Current title"
                size="small"
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                fullWidth
              />
              <TextField
                label="Location"
                size="small"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                fullWidth
              />
              <TextField
                label="Job search mode"
                select
                size="small"
                value={jobSearchMode}
                onChange={(e) => setJobSearchMode(e.target.value as JobSearchMode)}
                fullWidth
              >
                {jobSearchModes.map((mode) => (
                  <MenuItem key={mode} value={mode}>
                    {mode}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Professional summary"
                multiline
                minRows={4}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                fullWidth
              />
            </Stack>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Key skills
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
              {skills.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  onDelete={() => handleRemoveSkill(skill)}
                  sx={{ mb: 0.5 }}
                />
              ))}
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} mt={1}>
              <TextField
                label="Add skill"
                size="small"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                fullWidth
              />
              <Button variant="outlined" onClick={handleAddSkill}>
                Add
              </Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Resume
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Upload your latest resume. The system will extract text and auto‑fill your profile to
              improve ATS matching.
            </Typography>
            <Button
              component="label"
              variant="outlined"
              fullWidth
              startIcon={<UploadFileIcon />}
              sx={{ mt: 1 }}
            >
              Upload resume
              <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
            </Button>
            <Typography variant="caption" color="text.secondary" display="block" mt={1}>
              Supported formats: PDF, DOC, DOCX.
            </Typography>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Parsed profile preview
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Once connected to the backend, this card will show how the resume parser interpreted
              your experience, education, and skills before saving changes.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box>
        <Button variant="contained" onClick={handleSave}>
          Save changes
        </Button>
      </Box>
    </Stack>
  );
};



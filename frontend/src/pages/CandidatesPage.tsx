import React, { useEffect, useState } from 'react';
import {
  Grid,
  Stack,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { CandidateProfileSummary } from '../types';
import { PresenceDot } from '../components/shared/PresenceDot';

import { fetchSuggestedCandidatesMock } from '../api/employer';

export const CandidatesPage: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateProfileSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchSuggestedCandidatesMock()
      .then((data) => {
        if (!isMounted) return;
        setCandidates(data);
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
      <Typography variant="h5">Talent Pool</Typography>
      <Typography variant="body2" color="text.secondary">
        Search candidates across tenants with masked contact details and real‑time activity.
      </Typography>
    </Stack>

    <Paper sx={{ p: 2, display: 'flex', gap: 2 }}>
      <TextField
        fullWidth
        size="small"
        placeholder='Ask: "Senior Java developers in Bangalore with microservices"'
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          )
        }}
      />
      <Chip label="Filter: Aggressive" color="success" variant="outlined" />
      <Chip label="Filter: Online" color="primary" variant="outlined" />
    </Paper>

    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2 }}>
          {loading && (
            <Typography variant="body2" color="text.secondary">
              Loading candidates…
            </Typography>
          )}
          {!loading && candidates.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No candidates match your filters yet.
            </Typography>
          )}
          {!loading && candidates.length > 0 && (
            <List dense>
              {candidates.map((c) => (
                <ListItem
                  key={c.id}
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    border: '1px solid rgba(148,163,184,0.35)'
                  }}
                  secondaryAction={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip label={`${c.atsScore ?? 0}% match`} size="small" color="success" />
                    </Stack>
                  }
                >
                  <Stack direction="row" spacing={1.2} alignItems="flex-start">
                    <PresenceDot status={c.presence} />
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={600}>
                          {c.name} • {c.currentTitle}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {c.location} • {c.totalExperienceYears} yrs • Mode: {c.jobSearchMode}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Skills: {c.skills.join(', ')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Last active: {new Date(c.lastActiveAt).toLocaleString()}
                          </Typography>
                        </>
                      }
                    />
                  </Stack>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="subtitle2" gutterBottom>
            Candidate profile preview
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Select a candidate to see full parsed resume, application history, test scores,
            and video recordings.
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  </Stack>
);};




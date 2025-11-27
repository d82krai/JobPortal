import React, { useEffect, useState } from 'react';
import {
  Grid,
  Stack,
  Typography,
  Paper,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  Skeleton
} from '@mui/material';
import { StatCard } from '../components/shared/StatCard';
import { JobCard } from '../components/jobs/JobCard';
import { ChatWindow } from '../components/chat/ChatWindow';
import { LlmChat } from '../components/llm/LlmChat';
import type { JobSummary, CandidateProfileSummary } from '../types';
import { PresenceDot } from '../components/shared/PresenceDot';
import {
  fetchEmployerDashboardStats,
  fetchEmployerJobs,
  fetchEmployerSubscriptionSummary,
  fetchSuggestedCandidatesMock,
  type EmployerDashboardStats
} from '../api/employer';
import { useNavigate } from 'react-router-dom';

export const EmployerDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<EmployerDashboardStats | null>(null);
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [candidates, setCandidates] = useState<CandidateProfileSummary[]>([]);
  const [subscriptionLabel, setSubscriptionLabel] = useState<string>('Loading…');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetchEmployerDashboardStats(),
      fetchEmployerJobs(),
      fetchEmployerSubscriptionSummary(),
      fetchSuggestedCandidatesMock()
    ])
      .then(([statsData, jobsData, subSummary, suggested]) => {
        if (!isMounted) return;
        setStats(statsData);
        setJobs(jobsData);
        setCandidates(suggested);
        setSubscriptionLabel(
          `${subSummary.planName} (${subSummary.externalPostingsRemaining} external postings)`
        );
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
          <Typography variant="h5">Employer Overview</Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor your pipeline, recent applications, and talent pool at a glance.
          </Typography>
        </Stack>
        <Chip label={`Subscription: ${subscriptionLabel}`} color="primary" />
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          {loading || !stats ? (
            <Skeleton variant="rounded" height={80} />
          ) : (
            <StatCard label="Open roles" value={stats.openRoles} trend="+1 this week" />
          )}
        </Grid>
        <Grid item xs={12} md={3}>
          {loading || !stats ? (
            <Skeleton variant="rounded" height={80} />
          ) : (
            <StatCard label="New applications today" value={stats.newApplicationsToday} />
          )}
        </Grid>
        <Grid item xs={12} md={3}>
          {loading || !stats ? (
            <Skeleton variant="rounded" height={80} />
          ) : (
            <StatCard label="Tests scheduled" value={stats.testsScheduled} />
          )}
        </Grid>
        <Grid item xs={12} md={3}>
          {loading || !stats ? (
            <Skeleton variant="rounded" height={80} />
          ) : (
            <StatCard
              label="Time to hire"
              value={`${stats.timeToHireDays} days`}
              trend="-3 days vs last month"
            />
          )}
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                Active job postings
              </Typography>
              <Button
                size="small"
                variant="contained"
                onClick={() => navigate('/app/employer/jobs/new')}
              >
                Post new job
              </Button>
            </Stack>
            <Grid container spacing={2}>
              {loading &&
                [1, 2].map((i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Skeleton variant="rounded" height={120} />
                  </Grid>
                ))}
              {!loading &&
                jobs.map((job) => (
                  <Grid item xs={12} sm={6} key={job.id}>
                    <JobCard job={job} />
                  </Grid>
                ))}
            </Grid>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                Suggested candidates (AI ranked)
              </Typography>
              <Button size="small" variant="outlined">
                View all
              </Button>
            </Stack>
            <List dense>
              {loading &&
                [1, 2].map((i) => (
                  <ListItem key={i}>
                    <Skeleton variant="rounded" height={48} width="100%" />
                  </ListItem>
                ))}
              {!loading &&
                candidates.map((c) => (
                  <ListItem
                    key={c.id}
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      border: '1px solid rgba(148,163,184,0.35)'
                    }}
                    secondaryAction={
                      <Chip
                        label={`${c.atsScore ?? 0}% match`}
                        size="small"
                        color={c.atsScore && c.atsScore > 85 ? 'success' : 'default'}
                      />
                    }
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <PresenceDot status={c.presence} />
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            {c.name} • {c.currentTitle}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {c.location} • {c.totalExperienceYears} yrs • Mode:{' '}
                            {c.jobSearchMode}
                          </Typography>
                        }
                      />
                    </Stack>
                  </ListItem>
                ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <ChatWindow />
          <LlmChat />
        </Grid>
      </Grid>
    </Stack>
  );
};



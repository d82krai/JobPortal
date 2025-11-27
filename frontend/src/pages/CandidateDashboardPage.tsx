import React, { useEffect, useState } from 'react';
import { Grid, Paper, Stack, Typography, Chip, Button, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../components/shared/StatCard';
import { ChatWindow } from '../components/chat/ChatWindow';
import { TestPlayer } from '../components/assessments/TestPlayer';
import { LlmChat } from '../components/llm/LlmChat';
import { fetchCandidateDashboardStats, type CandidateDashboardStats } from '../api/candidate';

export const CandidateDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<CandidateDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    fetchCandidateDashboardStats()
      .then((data) => {
        if (isMounted) {
          setStats(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack spacing={0.5}>
          <Typography variant="h5">Candidate Overview</Typography>
          <Typography variant="body2" color="text.secondary">
            Track your applications, tests, and conversations in one place.
          </Typography>
        </Stack>
        <Chip label="Job search mode: Aggressive" color="success" />
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          {loading || !stats ? (
            <Skeleton variant="rounded" height={80} />
          ) : (
            <StatCard label="Active applications" value={stats.activeApplications} trend="+2 this week" />
          )}
        </Grid>
        <Grid item xs={12} md={3}>
          {loading || !stats ? (
            <Skeleton variant="rounded" height={80} />
          ) : (
            <StatCard label="Upcoming tests" value={stats.upcomingTests} />
          )}
        </Grid>
        <Grid item xs={12} md={3}>
          {loading || !stats ? (
            <Skeleton variant="rounded" height={80} />
          ) : (
            <StatCard label="Unread messages" value={stats.unreadMessages} />
          )}
        </Grid>
        <Grid item xs={12} md={3}>
          {loading || !stats ? (
            <Skeleton variant="rounded" height={80} />
          ) : (
            <StatCard label="Profile strength" value={`${stats.profileStrength}%`} trend="Great" />
          )}
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Next online test
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Full‑stack Engineer Screening • 45 minutes • Proctored
            </Typography>
            <TestPlayer />
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <ChatWindow />
          <Button
            sx={{ mt: 2 }}
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/app/candidate/applications')}
          >
            View all applications
          </Button>
        </Grid>
      </Grid>

      <LlmChat />
    </Stack>
  );
};



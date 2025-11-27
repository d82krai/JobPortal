import React from 'react';
import { Box, Button, Stack, Typography, Chip } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'radial-gradient(circle at top, #1B5DE0 0, #020617 40%, #020617 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2
      }}
    >
      <Stack spacing={4} maxWidth="lg" width="100%" direction={{ xs: 'column', md: 'row' }}>
        <Stack spacing={2} flex={1}>
          <Chip
            icon={<AutoAwesomeIcon />}
            label="AI‑powered job aggregator & ATS"
            sx={{ alignSelf: 'flex-start', bgcolor: 'rgba(15,23,42,0.85)', color: 'white' }}
          />
          <Typography variant="h3" fontWeight={700} lineHeight={1.1}>
            Hire faster. Apply smarter.
          </Typography>
          <Typography variant="h6" color="rgba(226,232,240,0.95)" fontWeight={400}>
            One platform for sourcing, screening, testing, and talking to talent — without
            ever exposing contact details.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={1}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => {
                if (user) {
                  navigate('/app/employer');
                } else {
                  navigate('/login?role=employer');
                }
              }}
            >
              I am an employer
            </Button>
            <Button
              variant="outlined"
              size="large"
              color="inherit"
              onClick={() => {
                if (user) {
                  navigate('/app/candidate');
                } else {
                  navigate('/login?role=candidate');
                }
              }}
            >
              I am a candidate
            </Button>
          </Stack>
          <Typography variant="caption" color="rgba(148,163,184,0.9)">
            QuikSync Talent connects your jobs to the right candidates, triggers AI screening,
            and runs proctored tests automatically.
          </Typography>
        </Stack>
        <Box
          flex={1}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 420,
              p: 2.5,
              borderRadius: 4,
              bgcolor: 'rgba(15,23,42,0.9)',
              border: '1px solid rgba(148,163,184,0.4)',
              boxShadow: '0 24px 80px rgba(15,23,42,0.8)'
            }}
          >
            <Typography variant="subtitle2" gutterBottom color="rgba(148,163,184,1)">
              Live snapshot
            </Typography>
            <Typography variant="body2" gutterBottom>
              24 candidates actively looking • 9 tests in progress • 4 calls happening now.
            </Typography>
            <Typography variant="caption" color="rgba(148,163,184,0.9)">
              Presence status, ATS scores, and test recordings are available instantly to your
              hiring team.
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};



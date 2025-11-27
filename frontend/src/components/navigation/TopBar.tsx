import React from 'react';
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../../hooks/useAuth';
import { PresenceDot } from '../shared/PresenceDot';
import { useNavigate } from 'react-router-dom';

export const TopBar: React.FC = () => {
  const { user, loginAsMock, logout } = useAuth();
  const navigate = useNavigate();
  // For now we mock a fixed unread count; later this should come from notifications API.
  const unreadCount = 1;

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ borderBottom: '1px solid rgba(148,163,184,0.35)' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h6" sx={{ display: { xs: 'none', md: 'block' } }}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Intelligent matching, seamless hiring.
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center">
          {!user && (
            <Stack direction="row" spacing={1}>
              <Tooltip title="Login as Candidate (mock)">
                <IconButton color="primary" onClick={() => loginAsMock('Candidate')}>
                  <LoginIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Login as Employer Recruiter (mock)">
                <IconButton color="secondary" onClick={() => loginAsMock('EmployerRecruiter')}>
                  <LoginIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          )}

          {user && (
            <>
              <Box textAlign="right" sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2">{user.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.roles.join(', ')}
                </Typography>
              </Box>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <PresenceDot status={user.presence} />
                <Avatar sx={{ width: 32, height: 32 }}>
                  {user.name
                    .split(' ')
                    .map((x) => x[0])
                    .join('')
                    .toUpperCase()}
                </Avatar>
              </Stack>
              <Tooltip title="Notifications">
                <IconButton color="inherit" onClick={() => navigate('/app/notifications')}>
                  <NotificationsIcon fontSize="small" />
                  {unreadCount > 0 && (
                    <Box
                      component="span"
                      sx={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'secondary.main'
                      }}
                    />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title="Sign out">
                <IconButton color="inherit" onClick={logout}>
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}

          <Tooltip title="Dark mode (placeholder)">
            <IconButton color="inherit">
              <Brightness4Icon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};



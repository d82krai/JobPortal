import React from 'react';
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/SpaceDashboard';
import WorkIcon from '@mui/icons-material/WorkOutline';
import PeopleIcon from '@mui/icons-material/PeopleOutline';
import ChatIcon from '@mui/icons-material/ChatBubbleOutline';
import SchoolIcon from '@mui/icons-material/School';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const SideNav: React.FC = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const isCandidate = user?.roles.includes('Candidate');
  const isEmployer =
    user?.roles.includes('EmployerAdmin') ||
    user?.roles.includes('EmployerRecruiter') ||
    user?.roles.includes('InternalRecruiter');

  const navItems =
    isCandidate
      ? [
          { to: '/app/candidate', label: 'Candidate Dashboard', icon: <DashboardIcon /> },
          { to: '/app/candidate/jobs', label: 'Browse Jobs', icon: <WorkIcon /> },
          { to: '/app/candidate/applications', label: 'My Applications', icon: <WorkIcon /> },
          { to: '/app/chat', label: 'Conversations', icon: <ChatIcon /> },
          { to: '/app/assessments', label: 'Assessments', icon: <SchoolIcon /> },
          { to: '/app/llm', label: 'AI Copilot', icon: <PsychologyIcon /> }
        ]
      : isEmployer
        ? [
            { to: '/app/employer', label: 'Employer Dashboard', icon: <DashboardIcon /> },
            { to: '/app/employer/jobs', label: 'Job Postings', icon: <WorkIcon /> },
            { to: '/app/candidates', label: 'Talent Pool', icon: <PeopleIcon /> },
            { to: '/app/chat', label: 'Conversations', icon: <ChatIcon /> },
            { to: '/app/assessments', label: 'Assessments', icon: <SchoolIcon /> },
            { to: '/app/llm', label: 'AI Copilot', icon: <PsychologyIcon /> }
          ]
        : [];

  return (
    <Box
      sx={{
        width: 260,
        borderRight: '1px solid rgba(148,163,184,0.35)',
        bgcolor: 'background.paper',
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        p: 2
      }}
    >
      <Box sx={{ px: 1, pb: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          QuikSync Talent
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Job Aggregator & ATS
        </Typography>
      </Box>
      <Divider sx={{ mb: 1 }} />
      <List sx={{ flex: 1 }}>
        {navItems.map((item) => {
          const active = pathname.startsWith(item.to);
          return (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                color: active ? 'primary.main' : 'text.secondary',
                bgcolor: active ? 'rgba(59,130,246,0.1)' : 'transparent'
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 600 : 500 }}
              />
            </ListItemButton>
          );
        })}
      </List>
      {user && (
        <Box
          sx={{
            mt: 1,
            p: 1.5,
            borderRadius: 2,
            bgcolor: 'rgba(15,23,42,0.9)',
            border: '1px solid rgba(148,163,184,0.45)'
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Signed in as
          </Typography>
          <Typography variant="subtitle2">{user.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {user.roles.join(', ')}
          </Typography>
        </Box>
      )}
    </Box>
  );
};



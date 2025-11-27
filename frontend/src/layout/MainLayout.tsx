import React from 'react';
import { Box, Container, Stack } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { SideNav } from '../components/navigation/SideNav';
import { TopBar } from '../components/navigation/TopBar';
import { usePresenceHeartbeat } from '../hooks/usePresenceHeartbeat';

export const MainLayout: React.FC = () => {
  usePresenceHeartbeat();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'background.default' }}>
      <SideNav />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar />
        <Container
          maxWidth="xl"
          sx={{
            flex: 1,
            py: 3,
            pb: 5
          }}
        >
          <Stack spacing={3}>
            <Outlet />
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};





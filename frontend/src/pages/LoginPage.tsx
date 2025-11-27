import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useNavigate, Link as RouterLink, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsMock } = useAuth();
  const [searchParams] = useSearchParams();
  const initialRoleParam = searchParams.get('role');
  const initialRole: UserRole =
    initialRoleParam === 'employer' ? 'EmployerRecruiter' : 'Candidate';
  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsMock(role);
    navigate(role === 'Candidate' ? '/app/candidate' : '/app/employer', { replace: true });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2
      }}
    >
      <Card sx={{ maxWidth: 420, width: '100%' }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5" fontWeight={600}>
              Sign in
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This form currently uses a mocked login for development. Replace with real API calls
              to <code>/auth/login</code> and <code>/users/me</code> later.
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Email"
                  type="email"
                  size="small"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                />
                <FormControl size="small" fullWidth>
                  <FormLabel sx={{ fontSize: 12, mb: 0.5 }}>Sign in as</FormLabel>
                  <TextField
                    select
                    size="small"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                  >
                    <MenuItem value="Candidate">Candidate</MenuItem>
                    <MenuItem value="EmployerRecruiter">Employer / Recruiter</MenuItem>
                  </TextField>
                </FormControl>
                <Button type="submit" variant="contained" fullWidth>
                  Continue
                </Button>
                <Typography variant="caption" color="text.secondary">
                  Don&apos;t have an account?{' '}
                  <RouterLink to="/register">Create one</RouterLink>
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};



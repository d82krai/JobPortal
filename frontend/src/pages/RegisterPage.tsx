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
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsMock } = useAuth();
  const [role, setRole] = useState<UserRole>('Candidate');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, call POST /auth/register and then /auth/login or /users/me
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
      <Card sx={{ maxWidth: 460, width: '100%' }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5" fontWeight={600}>
              Create your account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This form currently simulates registration. Later, connect it to{' '}
              <code>/auth/register</code> and your tenant onboarding logic.
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Full name"
                  size="small"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Email"
                  type="email"
                  size="small"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                />
                <FormControl size="small" fullWidth>
                  <FormLabel sx={{ fontSize: 12, mb: 0.5 }}>Register as</FormLabel>
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
                  Create account
                </Button>
                <Typography variant="caption" color="text.secondary">
                  Already have an account? <RouterLink to="/login">Sign in</RouterLink>
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};



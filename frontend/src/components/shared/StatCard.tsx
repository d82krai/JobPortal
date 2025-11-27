import React from 'react';
import { Box, Stack, Typography } from '@mui/material';

interface Props {
  label: string;
  value: string | number;
  trend?: string;
}

export const StatCard: React.FC<Props> = ({ label, value, trend }) => {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: 'background.paper',
        border: '1px solid rgba(148,163,184,0.3)'
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Stack direction="row" alignItems="baseline" spacing={1} mt={0.5}>
        <Typography variant="h5" fontWeight={600}>
          {value}
        </Typography>
        {trend && (
          <Typography variant="caption" color="success.main">
            {trend}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};



import React from 'react';
import { Box, Tooltip } from '@mui/material';
import type { PresenceStatus } from '../../types';

interface Props {
  status: PresenceStatus;
}

const colorMap: Record<PresenceStatus, string> = {
  Online: '#22c55e',
  Away: '#facc15',
  Offline: '#6b7280'
};

export const PresenceDot: React.FC<Props> = ({ status }) => (
  <Tooltip title={status}>
    <Box
      sx={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        bgcolor: colorMap[status],
        boxShadow: `0 0 0 4px ${colorMap[status]}20`
      }}
    />
  </Tooltip>
);



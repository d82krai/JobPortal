import React from 'react';
import { Stack, Typography, Paper } from '@mui/material';
import { LlmChat } from '../components/llm/LlmChat';

export const LlmPage: React.FC = () => (
  <Stack spacing={3}>
    <Stack spacing={0.5}>
      <Typography variant="h5">AI Copilot</Typography>
      <Typography variant="body2" color="text.secondary">
        Use natural language to search candidates, refine job descriptions, and optimize profiles.
      </Typography>
    </Stack>

    <Paper sx={{ p: 2 }}>
      <LlmChat />
    </Paper>
  </Stack>
);



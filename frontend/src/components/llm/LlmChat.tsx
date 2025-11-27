import React, { useState } from 'react';
import {
  Box,
  Chip,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from '../../hooks/useAuth';
import {
  startEmployerLlmSessionMock,
  startCandidateLlmSessionMock,
  sendLlmMessageMock
} from '../../api/llm';
import type { LlmMessage, LlmSession } from '../../api/types-llm';

export const LlmChat: React.FC = () => {
  const { user } = useAuth();
  const [session, setSession] = useState<LlmSession | null>(null);
  const [messages, setMessages] = useState<LlmMessage[]>([]);
  const [draft, setDraft] = useState('');

  const handleSend = () => {
    if (!draft.trim()) return;
    const run = async () => {
      let current = session;
      if (!current) {
        current = user?.roles.includes('Candidate')
          ? await startCandidateLlmSessionMock()
          : await startEmployerLlmSessionMock();
        setSession(current);
      }
      const { messages: newMessages, session: updatedSession } = await sendLlmMessageMock(
        current,
        draft.trim()
      );
      setSession(updatedSession);
      setMessages((prev) => [...prev, ...newMessages]);
      setDraft('');
    };
    void run();
  };

  const roleChip =
    user?.roles.includes('Candidate') ?? false ? 'Candidate Assistant' : 'Employer Assistant';

  return (
    <Box
      sx={{
        borderRadius: 3,
        border: '1px solid rgba(148,163,184,0.35)',
        bgcolor: 'background.paper',
        p: 2,
        height: 420,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Stack direction="row" spacing={1} alignItems="center">
          <AutoAwesomeIcon sx={{ color: 'secondary.main' }} />
          <Typography variant="subtitle1" fontWeight={600}>
            AI Copilot
          </Typography>
        </Stack>
        <Chip label={roleChip} size="small" />
      </Stack>

      <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
        {messages.length === 0 && (
          <Box
            sx={{
              mb: 1.2,
              display: 'flex',
              justifyContent: 'flex-start'
            }}
          >
            <Box
              sx={{
                maxWidth: '78%',
                p: 1.2,
                borderRadius: 2,
                bgcolor: 'rgba(15,23,42,0.9)'
              }}
            >
              <Typography variant="body2" color="text.primary">
                Hi! I am your AI copilot. Ask me to find candidates, refine job descriptions, or
                optimize your profile. In production, I will call tenant‑aware LLM endpoints.
              </Typography>
            </Box>
          </Box>
        )}
        {messages.map((m) => (
          <Box
            key={m.id}
            sx={{
              mb: 1.2,
              display: 'flex',
              justifyContent: m.senderType === 'User' ? 'flex-end' : 'flex-start'
            }}
          >
            <Box
              sx={{
                maxWidth: '78%',
                p: 1.2,
                borderRadius: 2,
                bgcolor: m.senderType === 'User' ? 'primary.main' : 'rgba(15,23,42,0.9)'
              }}
            >
              <Typography
                variant="body2"
                color={m.senderType === 'User' ? 'white' : 'text.primary'}
              >
                {m.text}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <TextField
        size="small"
        fullWidth
        placeholder="Ask anything: “Find senior Java developers in Bangalore”, “Improve my resume headline”…"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AutoAwesomeIcon fontSize="small" color="secondary" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton color="primary" onClick={handleSend}>
                <SendIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    </Box>
  );
};



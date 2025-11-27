import React, { useEffect, useState } from 'react';
import {
  Box,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PhoneIcon from '@mui/icons-material/Phone';
import VideocamIcon from '@mui/icons-material/Videocam';
import ShieldIcon from '@mui/icons-material/Shield';
import type { ChatMessage } from '../../api/comms';
import { fetchChatMessagesMock, sendChatMessageMock } from '../../api/comms';

const maskPii = (text: string): string => {
  // Simple masking; backend will do real AI masking.
  const phoneRegex = /\+?\d[\d\s\-]{7,}\d/g;
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
  return text
    .replace(phoneRegex, '[masked-phone]')
    .replace(emailRegex, '[masked-email]');
};

export const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const threadId = 't1'; // In a full implementation this will come from selected thread context.

  useEffect(() => {
    let isMounted = true;
    fetchChatMessagesMock(threadId)
      .then((data) => {
        if (!isMounted) return;
        setMessages(data);
      })
      .catch(() => undefined);
    return () => {
      isMounted = false;
    };
  }, [threadId]);

  const handleSend = () => {
    if (!draft.trim()) return;
    const safeText = maskPii(draft);
    sendChatMessageMock(threadId, safeText)
      .then((msg) => {
        setMessages((prev) => [...prev, msg]);
        setDraft('');
      })
      .catch(() => undefined);
  };

  return (
    <Box
      sx={{
        borderRadius: 3,
        border: '1px solid rgba(148,163,184,0.35)',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        height: 420
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(148,163,184,0.25)' }}
      >
        <Box>
          <Typography variant="subtitle2">Recruiter chat</Typography>
          <Typography variant="caption" color="text.secondary">
            Phone and email are automatically masked
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <IconButton size="small" color="primary">
            <PhoneIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="primary">
            <VideocamIcon fontSize="small" />
          </IconButton>
          <ShieldIcon sx={{ fontSize: 18, color: 'success.main' }} />
        </Stack>
      </Stack>

      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 1.5 }}>
        <List dense>
          {messages.map((m) => (
            <ListItem
              key={m.id}
              sx={{
                justifyContent: m.fromMe ? 'flex-end' : 'flex-start'
              }}
            >
              <Box
                sx={{
                  maxWidth: '75%',
                  p: 1.2,
                  borderRadius: 2,
                  bgcolor: m.fromMe ? 'primary.main' : 'rgba(15,23,42,0.9)'
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      color={m.fromMe ? 'white' : 'text.primary'}
                    >
                      {m.text}
                    </Typography>
                  }
                />
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ px: 2, py: 1.5, borderTop: '1px solid rgba(148,163,184,0.25)' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type a message (phone & email will be masked)…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          InputProps={{
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
    </Box>
  );
};



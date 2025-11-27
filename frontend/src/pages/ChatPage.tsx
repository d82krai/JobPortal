import React, { useEffect, useState } from 'react';
import { Grid, List, ListItemButton, ListItemText, Paper, Stack, Typography } from '@mui/material';
import { ChatWindow } from '../components/chat/ChatWindow';
import type { ChatThread } from '../api/comms';
import { fetchChatThreadsMock } from '../api/comms';

export const ChatPage: React.FC = () => {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchChatThreadsMock()
      .then((data) => {
        if (!isMounted) return;
        setThreads(data);
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h5">Conversations</Typography>
        <Typography variant="body2" color="text.secondary">
          Chat, voice, and video with candidates and employers without exposing contact details.
        </Typography>
      </Stack>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 1.5 }}>
            <Typography variant="subtitle2" gutterBottom>
              Threads
            </Typography>
            {loading && (
              <Typography variant="caption" color="text.secondary">
                Loading…
              </Typography>
            )}
            {!loading && (
              <List dense>
                {threads.map((t) => (
                  <ListItemButton key={t.id} selected={t.id === 't1'}>
                    <ListItemText
                      primary={
                        <Typography variant="body2" noWrap>
                          {t.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {t.lastMessageSnippet}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={9}>
          <ChatWindow />
        </Grid>
      </Grid>
    </Stack>
  );
};




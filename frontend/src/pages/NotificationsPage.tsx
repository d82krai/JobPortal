import React, { useEffect, useState } from 'react';
import {
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import {
  fetchNotificationsMock,
  markNotificationReadMock,
  type NotificationItem
} from '../api/notifications';

export const NotificationsPage: React.FC = () => {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchNotificationsMock()
      .then((data) => {
        if (!isMounted) return;
        setItems(data);
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

  const handleMarkRead = async (id: string) => {
    await markNotificationReadMock(id);
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h5">Notifications</Typography>
        <Typography variant="body2" color="text.secondary">
          All important events related to your jobs, applications, tests, and messages.
        </Typography>
      </Stack>

      <Paper sx={{ p: 2 }}>
        {loading && (
          <Typography variant="body2" color="text.secondary">
            Loading notifications…
          </Typography>
        )}
        {!loading && items.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            You&apos;re all caught up. No notifications to show.
          </Typography>
        )}
        {!loading && items.length > 0 && (
          <List dense>
            {items.map((n) => (
              <ListItem
                key={n.id}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  border: '1px solid rgba(148,163,184,0.35)',
                  opacity: n.isRead ? 0.7 : 1
                }}
                secondaryAction={
                  !n.isRead && (
                    <Tooltip title="Mark as read">
                      <IconButton size="small" onClick={() => handleMarkRead(n.id)}>
                        <DoneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )
                }
              >
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" fontWeight={600}>
                        {n.title}
                      </Typography>
                      <Chip label={n.channel} size="small" variant="outlined" />
                    </Stack>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {n.body}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Stack>
  );
};



import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';

// This hook keeps track of local user activity and maps it to presence states.
// Later it should also call the backend endpoint /users/me/heartbeat on each tick.

const ONLINE_MS = 2 * 60 * 1000; // 2 minutes
const AWAY_MS = 10 * 60 * 1000; // 10 minutes

export const usePresenceHeartbeat = (): void => {
  const { user, updatePresence } = useAuth();
  const lastInteractionRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!user) return;

    const handleActivity = () => {
      lastInteractionRef.current = Date.now();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    const intervalId = window.setInterval(() => {
      const now = Date.now();
      const delta = now - lastInteractionRef.current;

      let status: 'Online' | 'Away' | 'Offline';
      if (delta <= ONLINE_MS) {
        status = 'Online';
      } else if (delta <= AWAY_MS) {
        status = 'Away';
      } else {
        status = 'Offline';
      }

      const lastActiveAtIso = new Date(lastInteractionRef.current).toISOString();
      updatePresence(status, lastActiveAtIso);

      // TODO: call backend /users/me/heartbeat with status & timestamp.
    }, 30_000);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.clearInterval(intervalId);
    };
  }, [updatePresence, user]);
};



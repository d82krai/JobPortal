import React, { createContext, useContext, useMemo, useState } from 'react';
import type { AuthUser, UserRole, PresenceStatus } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  loginAsMock: (role: UserRole) => void;
  logout: () => void;
  updatePresence: (presence: PresenceStatus, lastActiveAt: string) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const mockUserByRole = (role: UserRole): AuthUser => ({
  id: 'u-' + role,
  name: role === 'Candidate' ? 'Jane Doe' : 'John Recruiter',
  email: role === 'Candidate' ? 'candidate@example.com' : 'recruiter@example.com',
  roles: [role],
  presence: 'Online',
  lastActiveAt: new Date().toISOString()
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loginAsMock: (role) => setUser(mockUserByRole(role)),
      logout: () => setUser(null),
      updatePresence: (presence, lastActiveAt) =>
        setUser((prev) => (prev ? { ...prev, presence, lastActiveAt } : prev))
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};



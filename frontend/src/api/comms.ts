import type { PresenceStatus } from '../types';

export interface ChatThread {
  id: string;
  title: string;
  lastMessageSnippet: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  fromMe: boolean;
  text: string;
  timestamp: string;
}

export interface PresenceInfo {
  userId: string;
  presenceStatus: PresenceStatus;
  lastActiveAt: string;
}

// These functions are mocked; wire them to:
// - GET /chat/threads
// - GET /chat/threads/{id}/messages
// - POST /chat/threads/{id}/messages
// - GET /presence/users

export const fetchChatThreadsMock = async (): Promise<ChatThread[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const now = new Date().toISOString();
  return [
    {
      id: 't1',
      title: 'Senior React Engineer – Akash Verma',
      lastMessageSnippet: 'Hi Akash, thanks for applying. When are you available for a quick call?',
      updatedAt: now
    },
    {
      id: 't2',
      title: 'DevOps Engineer – Sara Lee',
      lastMessageSnippet: 'I have completed the online test. Looking forward to your feedback.',
      updatedAt: now
    }
  ];
};

export const fetchChatMessagesMock = async (threadId: string): Promise<ChatMessage[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const now = new Date().toISOString();
  return [
    {
      id: `${threadId}-1`,
      threadId,
      fromMe: false,
      text: 'Hi, thank you for considering my profile.',
      timestamp: now
    },
    {
      id: `${threadId}-2`,
      threadId,
      fromMe: true,
      text: 'We have reviewed your application and would like to schedule a quick chat.',
      timestamp: now
    }
  ];
};

export const sendChatMessageMock = async (
  threadId: string,
  rawText: string
): Promise<ChatMessage> => {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const timestamp = new Date().toISOString();
  // Real backend will mask PII (phone/email) and return safe text.
  return {
    id: `${threadId}-${timestamp}`,
    threadId,
    fromMe: true,
    text: rawText,
    timestamp
  };
};



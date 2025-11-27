export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  channel: 'Email' | 'InApp' | 'Push';
  isRead: boolean;
  sentAt: string;
}

export const fetchNotificationsMock = async (): Promise<NotificationItem[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const now = new Date().toISOString();
  return [
    {
      id: 'n1',
      title: 'New job match: Senior React Engineer',
      body: 'We found a new role that closely matches your profile.',
      channel: 'InApp',
      isRead: false,
      sentAt: now
    },
    {
      id: 'n2',
      title: 'Test invitation: Full‑stack Engineer Screening',
      body: 'You have been invited to complete an online test. Please complete it within 48 hours.',
      channel: 'Email',
      isRead: true,
      sentAt: now
    }
  ];
};

export const markNotificationReadMock = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 120));
  console.info('Mark notification as read (mock):', id);
};



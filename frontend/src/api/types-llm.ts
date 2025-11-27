export interface LlmSession {
  id: string;
  type: 'EmployerAssistant' | 'CandidateAssistant';
  startedAt: string;
  endedAt?: string;
}

export interface LlmMessage {
  id: string;
  senderType: 'User' | 'Assistant';
  text: string;
  sentAt: string;
}



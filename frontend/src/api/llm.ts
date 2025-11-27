import { LlmSession, LlmMessage } from './types-llm';

// These types mirror the OpenAPI monetization-llm-api.yaml but simplified for frontend use.

export const startEmployerLlmSessionMock = async (): Promise<LlmSession> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    id: `sess-employer-${Date.now()}`,
    type: 'EmployerAssistant',
    startedAt: new Date().toISOString(),
    endedAt: undefined
  };
};

export const startCandidateLlmSessionMock = async (): Promise<LlmSession> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    id: `sess-candidate-${Date.now()}`,
    type: 'CandidateAssistant',
    startedAt: new Date().toISOString(),
    endedAt: undefined
  };
};

export const sendLlmMessageMock = async (
  session: LlmSession,
  text: string
): Promise<{ session: LlmSession; messages: LlmMessage[] }> => {
  await new Promise((resolve) => setTimeout(resolve, 350));
  const now = new Date().toISOString();
  const userMessage: LlmMessage = {
    id: `${session.id}-u-${now}`,
    senderType: 'User',
    text,
    sentAt: now
  };
  const assistantText =
    session.type === 'EmployerAssistant'
      ? 'Mocked employer assistant: this is where candidate search and JD suggestions will appear.'
      : 'Mocked candidate assistant: this is where resume/profile optimization suggestions will appear.';
  const assistantMessage: LlmMessage = {
    id: `${session.id}-a-${now}`,
    senderType: 'Assistant',
    text: assistantText,
    sentAt: now
  };
  return { session, messages: [userMessage, assistantMessage] };
};



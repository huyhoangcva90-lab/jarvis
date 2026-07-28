/**
 * Jarvis Infinity System — Hermes Engine
 * Chat engine extracted from HermesChat logic
 */

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
};

export type HermesState = {
  messages: ChatMessage[];
  isTyping: boolean;
  isRecording: boolean;
};

// Simulated AI responses
export const AI_RESPONSES: string[] = [
  'I understand. Let me check the relevant systems.',
  'Analyzing your request across the Infinity Stones...',
  'Processing. I will route this through the appropriate domain.',
  'Noted. I have created a mission for this task.',
  'All systems nominal. What would you like to focus on?',
  'Understood. Delegating to the appropriate Stone module.',
  'Running diagnostics across all connected nodes...',
  'I have reviewed the current mission parameters. Here is my assessment.',
];

// Voice commands
export const VOICE_COMMANDS: string[] = [
  "Check Space Stone latency status.",
  "Deploy a new workforce mission.",
  "Check mood and energy indexes.",
  "System diagnostics run please."
];

export function createMessage(role: ChatMessage['role'], content: string): ChatMessage {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    role,
    content,
    timestamp: new Date().toISOString(),
  };
}

export function simulateReply(userMessage: string): string {
  // Currently ignores user message and returns a random response
  return AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
}

export function getRandomVoiceCommand(): string {
  return VOICE_COMMANDS[Math.floor(Math.random() * VOICE_COMMANDS.length)];
}

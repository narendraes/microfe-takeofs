export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface JiraConfig {
  apiUrl: string;
  token: string;
  isAuthenticated: boolean;
}

export interface OllamaConfig {
  apiUrl: string;
  model: string;
}

export interface AllowListRule {
  intent: string;
  allowedActions: string[];
  jiraObjects: string[];
  permissionsRequired: string[];
}

export type IntentCategory = 'reporting' | 'data_retrieval' | 'analysis' | 'connection_check' | 'undefined';

export interface QueryIntent {
  category: IntentCategory;
  jiraObjects: string[];
  actions: string[];
} 
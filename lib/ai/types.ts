export type ModelProvider = 'gemini' | 'ollama';

export interface ModelConfig {
  temperature?: number;
  topP?: number;
  maxOutputTokens?: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIServiceResponse {
  content: string;
  provider: ModelProvider;
  processingTime: number;
}

export interface AIService {
  generate(prompt: string, config?: ModelConfig): Promise<AIServiceResponse>;
  generateStream(prompt: string, config?: ModelConfig): AsyncGenerator<string, void, unknown>;
} 
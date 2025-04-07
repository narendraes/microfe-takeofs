import { AIService, AIServiceResponse, ModelConfig } from './types';

export class OllamaService implements AIService {
  private baseUrl: string;
  private model: string = 'llama3.2';

  constructor() {
    this.baseUrl = process.env.OLLAMA_HOST || 'http://localhost:11434';
  }

  async generate(prompt: string, config?: ModelConfig): Promise<AIServiceResponse> {
    const startTime = performance.now();
    
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          options: {
            temperature: config?.temperature ?? 0.7,
            top_p: config?.topP ?? 0.9,
            num_predict: config?.maxOutputTokens ?? 1500,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        content: data.response,
        provider: 'ollama',
        processingTime: performance.now() - startTime,
      };
    } catch (error) {
      console.error('[OllamaService] Error:', error);
      throw error;
    }
  }

  async *generateStream(prompt: string, config?: ModelConfig): AsyncGenerator<string, void, unknown> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          options: {
            temperature: config?.temperature ?? 0.7,
            top_p: config?.topP ?? 0.9,
            num_predict: config?.maxOutputTokens ?? 1500,
          },
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is null');
      }

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(Boolean);
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.response) {
              yield data.response;
            }
          } catch (e) {
            console.error('[OllamaService] Error parsing stream chunk:', e);
          }
        }
      }
    } catch (error) {
      console.error('[OllamaService] Stream Error:', error);
      throw error;
    }
  }
} 
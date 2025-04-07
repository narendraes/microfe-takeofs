import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIService, AIServiceResponse, ModelConfig } from './types';

export class GeminiService implements AIService {
  private genAI: GoogleGenerativeAI;
  private model: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    this.model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generate(prompt: string, config?: ModelConfig): Promise<AIServiceResponse> {
    const startTime = performance.now();
    
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: this.model,
        generationConfig: {
          temperature: config?.temperature ?? 0.7,
          topP: config?.topP ?? 0.9,
          maxOutputTokens: config?.maxOutputTokens ?? 1500,
        },
      });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      if (result.response.promptFeedback?.blockReason) {
        throw new Error(`Content blocked: ${result.response.promptFeedback.blockReason}`);
      }

      const response = await result.response;
      
      return {
        content: response.text(),
        provider: 'gemini',
        processingTime: performance.now() - startTime,
      };
    } catch (error) {
      console.error('[GeminiService] Error:', error);
      if (error instanceof Error) {
        // Return a user-friendly error message
        return {
          content: `I apologize, but I encountered an error: ${error.message}. Please try rephrasing your question.`,
          provider: 'gemini',
          processingTime: performance.now() - startTime,
        };
      }
      throw error;
    }
  }

  async *generateStream(prompt: string, config?: ModelConfig): AsyncGenerator<string, void, unknown> {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: this.model,
        generationConfig: {
          temperature: config?.temperature ?? 0.7,
          topP: config?.topP ?? 0.9,
          maxOutputTokens: config?.maxOutputTokens ?? 1500,
        },
      });

      const result = await model.generateContentStream({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          yield text;
        }
      }
    } catch (error) {
      console.error('[GeminiService] Stream Error:', error);
      yield `I apologize, but I encountered an error. Please try rephrasing your question.`;
    }
  }
} 
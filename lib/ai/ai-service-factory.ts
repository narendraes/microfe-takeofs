import { AIService, ModelProvider } from './types';
import { GeminiService } from './gemini-service';
import { OllamaService } from './ollama-service';

export class AIServiceFactory {
  private static instance: AIServiceFactory;
  private services: Map<ModelProvider, AIService>;

  private constructor() {
    this.services = new Map();
  }

  static getInstance(): AIServiceFactory {
    if (!AIServiceFactory.instance) {
      AIServiceFactory.instance = new AIServiceFactory();
    }
    return AIServiceFactory.instance;
  }

  getService(provider: ModelProvider): AIService {
    if (!this.services.has(provider)) {
      switch (provider) {
        case 'gemini':
          this.services.set(provider, new GeminiService());
          break;
        case 'ollama':
          this.services.set(provider, new OllamaService());
          break;
        default:
          throw new Error(`Unsupported AI provider: ${provider}`);
      }
    }
    return this.services.get(provider)!;
  }

  getDefaultService(): AIService {
    const defaultProvider = (process.env.DEFAULT_MODEL as ModelProvider) || 'gemini';
    return this.getService(defaultProvider);
  }
} 
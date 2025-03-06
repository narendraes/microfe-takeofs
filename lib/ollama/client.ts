import { OllamaConfig } from '../types';

const DEFAULT_CONFIG: OllamaConfig = {
  apiUrl: 'http://localhost:11434',
  model: 'llama3.2',
};

export interface OllamaRequestOptions {
  prompt: string;
  model?: string;
  stream?: boolean;
  options?: Record<string, any>;
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

export class OllamaClient {
  private config: OllamaConfig;

  constructor(config: Partial<OllamaConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    console.log('[OllamaClient] Initialized with config:', this.config);
  }

  async generateCompletion(options: OllamaRequestOptions): Promise<string> {
    const { prompt, model = this.config.model, stream = false, options: additionalOptions = {} } = options;
    
    console.log(`[OllamaClient] Sending request to ${this.config.apiUrl}/api/generate with model: ${model}`);
    console.log('[OllamaClient] Prompt:', prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''));
    
    try {
      console.log('[OllamaClient] Making API request...');
      const response = await fetch(`${this.config.apiUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt,
          stream,
          options: additionalOptions,
        }),
      });

      console.log(`[OllamaClient] Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[OllamaClient] API error: ${response.status} - ${errorText}`);
        throw new Error(`Ollama API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json() as OllamaResponse;
      console.log('[OllamaClient] Response received:', {
        model: data.model,
        responseLength: data.response.length,
        firstFewChars: data.response.substring(0, 50) + '...'
      });
      
      return data.response;
    } catch (error) {
      console.error('[OllamaClient] Error calling Ollama API:', error);
      throw error;
    }
  }

  async analyzeIntent(query: string): Promise<any> {
    console.log('[OllamaClient] Analyzing intent for query:', query);
    
    // This is a placeholder for the intent analysis functionality
    // In a real implementation, we would send the query to the LLM with a specific prompt
    // to analyze the intent and extract Jira-related entities
    const prompt = `
      Analyze the following query and determine the intent, Jira objects, and actions:
      
      Query: "${query}"
      
      Respond in JSON format with the following structure:
      {
        "category": "reporting" or "data_retrieval" or "analysis" or "undefined" if unclear,
        "jiraObjects": ["issue", "sprint", "project", etc.],
        "actions": ["read", "aggregate", "format", etc.]
      }
      
      Important: Use only one value for category, not multiple values with | operators.
      Return valid JSON that can be parsed with JSON.parse().
    `;

    try {
      console.log('[OllamaClient] Sending intent analysis prompt to LLM');
      const response = await this.generateCompletion({ prompt });
      console.log('[OllamaClient] Raw intent analysis response:', response);
      
      // Extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const jsonStr = jsonMatch[0];
          // Clean up common JSON issues
          const cleanedJson = jsonStr
            .replace(/(\w+)(\s*\|\s*\w+)+/g, '$1') // Replace "value1 | value2" with just "value1"
            .replace(/'/g, '"'); // Replace single quotes with double quotes
          
          console.log('[OllamaClient] Cleaned JSON:', cleanedJson);
          const parsedIntent = JSON.parse(cleanedJson);
          console.log('[OllamaClient] Parsed intent:', parsedIntent);
          return parsedIntent;
        } catch (parseError) {
          console.error('[OllamaClient] JSON parse error:', parseError);
          // Fallback to a default structure if parsing fails
          return {
            category: "undefined",
            jiraObjects: [],
            actions: []
          };
        }
      }
      
      console.error('[OllamaClient] Could not parse intent analysis response');
      throw new Error('Could not parse intent analysis response');
    } catch (error) {
      console.error('[OllamaClient] Error parsing intent analysis:', error);
      throw error;
    }
  }
} 
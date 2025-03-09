import { OllamaConfig } from '../types';

// Debug mode toggle - set to false to reduce console output
const DEBUG_MODE = false;

// Simple in-memory cache for intent analysis
const intentCache = new Map<string, {
  intent: any;
  timestamp: number;
}>();

// Cache for general knowledge responses
const knowledgeCache = new Map<string, {
  response: string;
  timestamp: number;
}>();

// Cache expiration time (10 minutes)
const CACHE_EXPIRATION_MS = 10 * 60 * 1000;

const DEFAULT_CONFIG: OllamaConfig = {
  apiUrl: 'http://localhost:11434',
  model: 'llama3.2',
};

// Request timeout in milliseconds (30 seconds for general knowledge, 15 seconds for intent analysis)
const INTENT_TIMEOUT_MS = 15000;
const KNOWLEDGE_TIMEOUT_MS = 30000;

// Custom logger that respects debug mode
const logger = {
  log: (message: string, ...args: any[]) => {
    console.log(message, ...args);
  },
  debug: (message: string, ...args: any[]) => {
    if (DEBUG_MODE) {
      console.log(message, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(message, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(message, ...args);
  }
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
    
    console.log(`[OllamaClient] Sending request to /api/ollama/generate with model: ${model}`);
    console.log('[OllamaClient] Prompt:', prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''));
    
    const startTime = performance.now();
    
    try {
      console.log('[OllamaClient] Making API request...');
      
      // Create a promise that rejects after timeout
      const timeoutPromise = new Promise<Response>((_, reject) => {
        // Use different timeout values based on the request type
        const timeoutMs = prompt.includes('general knowledge') ? KNOWLEDGE_TIMEOUT_MS : INTENT_TIMEOUT_MS;
        setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
      });
      
      // Create the actual fetch promise
      const fetchPromise = fetch(`/api/ollama/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt,
          stream,
          options: {
            num_predict: 1024,  // Limit token generation for faster responses
            ...additionalOptions,
          },
        }),
      });
      
      // Race the fetch against the timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

      console.log(`[OllamaClient] Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[OllamaClient] API error: ${response.status} - ${errorText}`);
        throw new Error(`Ollama API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json() as OllamaResponse;
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      console.log(`[OllamaClient] Response received in ${responseTime.toFixed(2)}ms:`, {
        model: data.model,
        responseLength: data.response.length,
        firstFewChars: data.response.substring(0, 50) + '...'
      });
      
      return data.response;
    } catch (error) {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      console.error(`[OllamaClient] Error calling Ollama API after ${responseTime.toFixed(2)}ms:`, error);
      throw error;
    }
  }

  async analyzeIntent(query: string): Promise<any> {
    console.log('[OllamaClient] Analyzing intent for query:', query);
    
    // Check cache first
    const cacheKey = query.trim().toLowerCase();
    const cachedResult = intentCache.get(cacheKey);
    
    if (cachedResult && (Date.now() - cachedResult.timestamp) < CACHE_EXPIRATION_MS) {
      console.log('[OllamaClient] Using cached intent analysis result');
      return cachedResult.intent;
    }
    
    const startTime = performance.now();
    
    // Check for general knowledge keywords
    const lowerQuery = query.toLowerCase();
    const isGeneralKnowledgeQuery = 
      lowerQuery.includes('what is') || 
      lowerQuery.includes('explain') || 
      lowerQuery.includes('describe') || 
      lowerQuery.includes('how does') || 
      lowerQuery.includes('tell me about');
    
    // Check for app configuration keywords
    const isAppConfigQuery =
      lowerQuery.includes('how to') ||
      lowerQuery.includes('how do i') ||
      lowerQuery.includes('can i') ||
      lowerQuery.includes('is it possible') ||
      lowerQuery.includes('setup') ||
      lowerQuery.includes('configure') ||
      lowerQuery.includes('settings') ||
      lowerQuery.includes('options') ||
      lowerQuery.includes('this app') ||
      lowerQuery.includes('the app') ||
      lowerQuery.includes('promptdojo') ||
      lowerQuery.includes('application') ||
      lowerQuery.includes('feature') ||
      lowerQuery.includes('usage');
    
    // Check for app-related terms
    const hasAppTerms =
      lowerQuery.includes('app') ||
      lowerQuery.includes('application') ||
      lowerQuery.includes('promptdojo') ||
      lowerQuery.includes('tool') ||
      lowerQuery.includes('interface') ||
      lowerQuery.includes('feature') ||
      lowerQuery.includes('configuration') ||
      lowerQuery.includes('setup') ||
      lowerQuery.includes('settings') ||
      lowerQuery.includes('using') ||
      lowerQuery.includes('work');
    
    // Direct detection of Jira-related terms for fallback
    const hasJiraTerms = 
      lowerQuery.includes('jira') || 
      lowerQuery.includes('jql') || 
      lowerQuery.includes('agile') || 
      lowerQuery.includes('scrum') || 
      lowerQuery.includes('kanban') || 
      lowerQuery.includes('workflow') || 
      lowerQuery.includes('sprint') || 
      lowerQuery.includes('backlog') || 
      lowerQuery.includes('issue') || 
      lowerQuery.includes('ticket') || 
      lowerQuery.includes('board') || 
      lowerQuery.includes('project');
    
    // If it's clearly an app configuration query, use a direct fallback
    if (isAppConfigQuery && hasAppTerms) {
      console.log('[OllamaClient] Direct fallback for obvious app configuration query');
      
      // Create a fallback intent
      const fallbackIntent = {
        category: 'app_configuration',
        actions: ['explain'],
        jiraObjects: ['app']
      };
      
      // Determine the most likely app object based on keywords
      if (lowerQuery.includes('setup') || lowerQuery.includes('configure') || lowerQuery.includes('configuration')) {
        fallbackIntent.jiraObjects = ['configuration'];
      } else if (lowerQuery.includes('settings') || lowerQuery.includes('options') || lowerQuery.includes('preferences')) {
        fallbackIntent.jiraObjects = ['settings'];
      } else if (lowerQuery.includes('feature') || lowerQuery.includes('functionality')) {
        fallbackIntent.jiraObjects = ['features'];
      } else if (lowerQuery.includes('usage') || lowerQuery.includes('using') || lowerQuery.includes('how to')) {
        fallbackIntent.jiraObjects = ['usage'];
      } else if (lowerQuery.includes('promptdojo')) {
        fallbackIntent.jiraObjects = ['promptdojo'];
      }
      
      // Cache the fallback intent
      intentCache.set(cacheKey, {
        intent: fallbackIntent,
        timestamp: Date.now()
      });
      
      console.log('[OllamaClient] Using direct fallback intent:', fallbackIntent);
      return fallbackIntent;
    }
    
    // If it's clearly a general knowledge query about Jira, use a direct fallback
    if (isGeneralKnowledgeQuery && hasJiraTerms) {
      console.log('[OllamaClient] Direct fallback for obvious general knowledge query');
      
      // Create a fallback intent
      const fallbackIntent = {
        category: 'general_knowledge',
        actions: ['explain'],
        jiraObjects: ['jira']
      };
      
      // Determine the most likely Jira object based on keywords
      if (lowerQuery.includes('jql')) {
        fallbackIntent.jiraObjects = ['jql'];
      } else if (lowerQuery.includes('workflow')) {
        fallbackIntent.jiraObjects = ['workflow'];
      } else if (lowerQuery.includes('agile')) {
        fallbackIntent.jiraObjects = ['agile'];
      } else if (lowerQuery.includes('scrum')) {
        fallbackIntent.jiraObjects = ['scrum'];
      } else if (lowerQuery.includes('kanban')) {
        fallbackIntent.jiraObjects = ['kanban'];
      } else if (lowerQuery.includes('product discovery')) {
        fallbackIntent.jiraObjects = ['product_discovery'];
      } else if (lowerQuery.includes('sprint')) {
        fallbackIntent.jiraObjects = ['sprint'];
      } else if (lowerQuery.includes('issue') || lowerQuery.includes('ticket')) {
        fallbackIntent.jiraObjects = ['issue'];
      } else if (lowerQuery.includes('board')) {
        fallbackIntent.jiraObjects = ['board'];
      } else if (lowerQuery.includes('project')) {
        fallbackIntent.jiraObjects = ['project'];
      }
      
      // Cache the fallback intent
      intentCache.set(cacheKey, {
        intent: fallbackIntent,
        timestamp: Date.now()
      });
      
      console.log('[OllamaClient] Using direct fallback intent:', fallbackIntent);
      return fallbackIntent;
    }
    
    // Optimized prompt for faster responses - even more concise
    const prompt = `
      Analyze this Jira query and return ONLY valid JSON:
      "${query}"
      
      Format: {"category":"reporting|data_retrieval|analysis|connection_check|general_knowledge|undefined","jiraObjects":["issue","sprint","project"],"actions":["read","aggregate","format"]}
      
      If this is a general knowledge question about Jira (like "What is JQL?" or "Explain Jira workflows"), set category to "general_knowledge", jiraObjects to relevant Jira concepts, and actions to ["explain"].
      
      Return ONLY JSON. No explanations.
    `;

    try {
      console.log('[OllamaClient] Sending intent analysis prompt to LLM');
      const response = await this.generateCompletion({ 
        prompt,
        options: {
          temperature: 0.1,    // Lower temperature for more deterministic responses
          top_p: 0.9,          // Limit token selection for faster generation
          num_predict: 200,    // Limit token generation for intent analysis
          stop: ["}"],         // Stop after JSON is complete
        }
      });
      
      const endTime = performance.now();
      const analysisTime = endTime - startTime;
      console.log(`[OllamaClient] Intent analysis completed in ${analysisTime.toFixed(2)}ms`);
      
      console.log('[OllamaClient] Raw intent analysis response:', response);
      
      // Extract JSON from the response - improved extraction
      let parsedIntent;
      
      // Try multiple approaches to extract JSON
      
      // Approach 1: Standard JSON regex
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const jsonStr = jsonMatch[0];
          // Clean up common JSON issues
          const cleanedJson = jsonStr
            .replace(/(\w+)(\s*\|\s*\w+)+/g, '$1') // Replace "value1 | value2" with just "value1"
            .replace(/'/g, '"')                    // Replace single quotes with double quotes
            .replace(/,\s*}/g, '}')                // Remove trailing commas
            .replace(/,\s*,/g, ',')                // Remove duplicate commas
            .replace(/\s*:\s*/g, ':')              // Normalize spacing around colons
            .replace(/"\s*,\s*"/g, '","')          // Fix spacing in arrays
            .replace(/"\s*\]\s*}/g, '"]}')         // Fix spacing at end of arrays
            .replace(/"\s*\[\s*"/g, '["')          // Fix spacing at start of arrays
            .replace(/\n/g, '')                    // Remove newlines
            .replace(/\r/g, '');                   // Remove carriage returns
          
          logger.debug('[OllamaClient] Cleaned JSON:', cleanedJson);
          
          // Try to parse the cleaned JSON
          try {
            parsedIntent = JSON.parse(cleanedJson);
            logger.log('[OllamaClient] Parsed intent:', parsedIntent);
          } catch (parseError) {
            logger.debug('[OllamaClient] JSON parse error after cleaning:', parseError);
            
            // Try to fix common JSON structure issues
            try {
              // Ensure the JSON has the required structure
              if (!cleanedJson.includes('"category"')) {
                throw new Error('Missing category field');
              }
              
              // Try to extract individual fields and reconstruct the JSON
              const categoryMatch = cleanedJson.match(/"category"\s*:\s*"([^"]+)"/);
              const jiraObjectsMatch = cleanedJson.match(/"jiraObjects"\s*:\s*\[(.*?)\]/);
              const actionsMatch = cleanedJson.match(/"actions"\s*:\s*\[(.*?)\]/);
              
              if (categoryMatch) {
                const category = categoryMatch[1];
                const jiraObjects = jiraObjectsMatch ? 
                  jiraObjectsMatch[1].split(',').map(s => s.trim().replace(/"/g, '').trim()) : 
                  ['jira'];
                const actions = actionsMatch ? 
                  actionsMatch[1].split(',').map(s => s.trim().replace(/"/g, '').trim()) : 
                  ['read'];
                
                parsedIntent = {
                  category,
                  jiraObjects: jiraObjects.filter(o => o.length > 0),
                  actions: actions.filter(a => a.length > 0)
                };
                
                logger.log('[OllamaClient] Reconstructed intent:', parsedIntent);
              } else {
                throw new Error('Could not extract category');
              }
            } catch (reconstructError) {
              logger.debug('[OllamaClient] JSON reconstruction error:', reconstructError);
              // Fall back to default structure
              throw new Error('Could not parse or reconstruct JSON');
            }
          }
        } catch (error) {
          logger.debug('[OllamaClient] JSON extraction error:', error);
          throw error;
        }
      } else {
        // Approach 2: Try to find any JSON-like structure with curly braces
        logger.debug('[OllamaClient] No standard JSON found, trying alternative extraction methods');
        logger.debug('[OllamaClient] Full response for debugging:', response);
        
        // Look for anything that might be JSON
        const curlyBraceMatch = response.match(/\{[^{]*?\}/);
        if (curlyBraceMatch) {
          logger.debug('[OllamaClient] Found potential JSON fragment:', curlyBraceMatch[0]);
          try {
            // Try to parse it directly
            parsedIntent = JSON.parse(curlyBraceMatch[0]);
            logger.log('[OllamaClient] Successfully parsed JSON fragment:', parsedIntent);
          } catch (fragmentError) {
            logger.debug('[OllamaClient] Failed to parse JSON fragment:', fragmentError);
            
            // Approach 3: Look for key fields directly in the response
            logger.debug('[OllamaClient] Trying to extract fields directly from response');
            
            const categoryMatch = response.match(/category["\s:]+([a-z_]+)/i);
            const category = categoryMatch ? categoryMatch[1].replace(/[^a-z_]/gi, '') : 'undefined';
            
            // Create a basic intent
            parsedIntent = {
              category,
              jiraObjects: ['jira'],
              actions: ['read']
            };
            
            logger.log('[OllamaClient] Created basic intent from text:', parsedIntent);
          }
        } else {
          logger.log('[OllamaClient] No JSON-like structure found in response - using fallback detection');
          
          // Create a fallback intent based on the query
          if (isGeneralKnowledgeQuery && hasJiraTerms) {
            parsedIntent = {
              category: 'general_knowledge',
              actions: ['explain'],
              jiraObjects: ['jira']
            };
            
            // Determine the most likely Jira object based on keywords
            if (lowerQuery.includes('jql')) {
              parsedIntent.jiraObjects = ['jql'];
            } else if (lowerQuery.includes('workflow')) {
              parsedIntent.jiraObjects = ['workflow'];
            } else if (lowerQuery.includes('agile')) {
              parsedIntent.jiraObjects = ['agile'];
            } else if (lowerQuery.includes('scrum')) {
              parsedIntent.jiraObjects = ['scrum'];
            } else if (lowerQuery.includes('kanban')) {
              parsedIntent.jiraObjects = ['kanban'];
            } else if (lowerQuery.includes('product discovery')) {
              parsedIntent.jiraObjects = ['product_discovery'];
            }
            
            console.log('[OllamaClient] Created fallback intent for general knowledge query:', parsedIntent);
          } else {
            parsedIntent = {
              category: 'undefined',
              jiraObjects: [],
              actions: []
            };
            console.log('[OllamaClient] Created default fallback intent');
          }
        }
      }
      
      // If we couldn't parse the intent, create a fallback based on keywords
      if (!parsedIntent) {
        console.log('[OllamaClient] Using fallback intent detection based on keywords');
        
        if (isGeneralKnowledgeQuery && hasJiraTerms) {
          parsedIntent = {
            category: 'general_knowledge',
            actions: ['explain'],
            jiraObjects: ['jira']
          };
          
          // Determine the most likely Jira object based on keywords
          if (lowerQuery.includes('jql')) {
            parsedIntent.jiraObjects = ['jql'];
          } else if (lowerQuery.includes('workflow')) {
            parsedIntent.jiraObjects = ['workflow'];
          } else if (lowerQuery.includes('agile')) {
            parsedIntent.jiraObjects = ['agile'];
          } else if (lowerQuery.includes('scrum')) {
            parsedIntent.jiraObjects = ['scrum'];
          } else if (lowerQuery.includes('kanban')) {
            parsedIntent.jiraObjects = ['kanban'];
          } else if (lowerQuery.includes('product discovery')) {
            parsedIntent.jiraObjects = ['product_discovery'];
          } else if (lowerQuery.includes('sprint')) {
            parsedIntent.jiraObjects = ['sprint'];
          } else if (lowerQuery.includes('issue') || lowerQuery.includes('ticket')) {
            parsedIntent.jiraObjects = ['issue'];
          } else if (lowerQuery.includes('board')) {
            parsedIntent.jiraObjects = ['board'];
          } else if (lowerQuery.includes('project')) {
            parsedIntent.jiraObjects = ['project'];
          }
        } else {
          // Default to undefined if we can't determine the intent
          parsedIntent = {
            category: "undefined",
            jiraObjects: [],
            actions: []
          };
        }
        
        console.log('[OllamaClient] Fallback intent:', parsedIntent);
      }
      
      // If it's a general knowledge query but not detected as such, override the category
      if (isGeneralKnowledgeQuery && 
          (parsedIntent.category === 'undefined' || !parsedIntent.category) && 
          hasJiraTerms) {
        console.log('[OllamaClient] Overriding category to general_knowledge based on keywords');
        parsedIntent.category = 'general_knowledge';
        parsedIntent.actions = ['explain'];
        
        // Add relevant Jira objects based on the query
        if (lowerQuery.includes('jql')) {
          parsedIntent.jiraObjects = ['jql'];
        } else if (lowerQuery.includes('workflow')) {
          parsedIntent.jiraObjects = ['workflow'];
        } else if (lowerQuery.includes('agile')) {
          parsedIntent.jiraObjects = ['agile'];
        } else if (lowerQuery.includes('scrum')) {
          parsedIntent.jiraObjects = ['scrum'];
        } else if (lowerQuery.includes('kanban')) {
          parsedIntent.jiraObjects = ['kanban'];
        } else if (lowerQuery.includes('product discovery')) {
          parsedIntent.jiraObjects = ['product_discovery'];
        } else {
          parsedIntent.jiraObjects = ['jira'];
        }
      }
      
      // Ensure the intent has all required fields
      parsedIntent.category = parsedIntent.category || 'undefined';
      parsedIntent.jiraObjects = parsedIntent.jiraObjects || [];
      parsedIntent.actions = parsedIntent.actions || [];
      
      // Cache the result
      intentCache.set(cacheKey, {
        intent: parsedIntent,
        timestamp: Date.now()
      });
      
      return parsedIntent;
    } catch (error) {
      const endTime = performance.now();
      const analysisTime = endTime - startTime;
      console.log(`[OllamaClient] Intent analysis fallback triggered after ${analysisTime.toFixed(2)}ms: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Create a fallback intent based on keywords if there's an error
      console.log('[OllamaClient] Creating fallback intent based on keywords');
      
      let fallbackIntent;
      
      if (isAppConfigQuery && hasAppTerms) {
        fallbackIntent = {
          category: 'app_configuration',
          actions: ['explain'],
          jiraObjects: ['app']
        };
        
        // Determine the most likely app object based on keywords
        if (lowerQuery.includes('setup') || lowerQuery.includes('configure') || lowerQuery.includes('configuration')) {
          fallbackIntent.jiraObjects = ['configuration'];
        } else if (lowerQuery.includes('settings') || lowerQuery.includes('options') || lowerQuery.includes('preferences')) {
          fallbackIntent.jiraObjects = ['settings'];
        } else if (lowerQuery.includes('feature') || lowerQuery.includes('functionality')) {
          fallbackIntent.jiraObjects = ['features'];
        } else if (lowerQuery.includes('usage') || lowerQuery.includes('using') || lowerQuery.includes('how to')) {
          fallbackIntent.jiraObjects = ['usage'];
        } else if (lowerQuery.includes('promptdojo')) {
          fallbackIntent.jiraObjects = ['promptdojo'];
        }
      } else if (isGeneralKnowledgeQuery && hasJiraTerms) {
        fallbackIntent = {
          category: 'general_knowledge',
          actions: ['explain'],
          jiraObjects: ['jira']
        };
        
        // Determine the most likely Jira object based on keywords
        if (lowerQuery.includes('jql')) {
          fallbackIntent.jiraObjects = ['jql'];
        } else if (lowerQuery.includes('workflow')) {
          fallbackIntent.jiraObjects = ['workflow'];
        } else if (lowerQuery.includes('agile')) {
          fallbackIntent.jiraObjects = ['agile'];
        } else if (lowerQuery.includes('scrum')) {
          fallbackIntent.jiraObjects = ['scrum'];
        } else if (lowerQuery.includes('kanban')) {
          fallbackIntent.jiraObjects = ['kanban'];
        } else if (lowerQuery.includes('product discovery')) {
          fallbackIntent.jiraObjects = ['product_discovery'];
        }
      } else {
        fallbackIntent = {
          category: "undefined",
          jiraObjects: [],
          actions: []
        };
      }
      
      console.log('[OllamaClient] Using fallback intent:', fallbackIntent);
      
      // Cache the fallback intent
      intentCache.set(cacheKey, {
        intent: fallbackIntent,
        timestamp: Date.now()
      });
      
      return fallbackIntent;
    }
  }
  
  async getGeneralKnowledgeResponse(query: string, jiraObjects: string[]): Promise<string> {
    console.log('[OllamaClient] Generating general knowledge response for:', query);
    
    // Check cache first
    const cacheKey = query.trim().toLowerCase();
    const cachedResponse = knowledgeCache.get(cacheKey);
    
    if (cachedResponse && (Date.now() - cachedResponse.timestamp) < CACHE_EXPIRATION_MS) {
      console.log('[OllamaClient] Using cached general knowledge response');
      return cachedResponse.response;
    }
    
    const startTime = performance.now();
    
    // Ensure jiraObjects is valid
    if (!jiraObjects || !Array.isArray(jiraObjects) || jiraObjects.length === 0) {
      console.log('[OllamaClient] No Jira objects provided, using default');
      jiraObjects = ['jira'];
    }
    
    // Create a more concise prompt for general knowledge response with explicit markdown instructions
    const topics = jiraObjects.join(', ');
    const prompt = `
      You are a Jira expert assistant. Provide a helpful, accurate, and concise response about ${topics}:
      
      "${query}"
      
      Format your response using proper markdown:
      - Use ## for section headings
      - Use **bold** for important terms
      - Use bullet points (- item) for lists
      - Use numbered lists (1. step) for steps or sequences
      - Use \`code\` for JQL examples or commands
      
      Focus only on Jira-related information. Be concise but informative.
      Keep your response under 1500 characters if possible.
    `;
    
    try {
      console.log('[OllamaClient] Sending general knowledge prompt to LLM');
      const response = await this.generateCompletion({
        prompt,
        options: {
          temperature: 0.7,    // Slightly higher temperature for more natural responses
          top_p: 0.9,          // Limit token selection for faster generation
          num_predict: 1500,   // Limit token generation for faster responses
        }
      });
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      console.log(`[OllamaClient] General knowledge response generated in ${responseTime.toFixed(2)}ms`);
      
      // Validate the response
      if (!response || typeof response !== 'string' || response.trim().length === 0) {
        console.error('[OllamaClient] Empty or invalid response from LLM');
        throw new Error('Empty or invalid response from LLM');
      }
      
      // Ensure the response has proper markdown formatting
      let formattedResponse = response;
      
      // If the response doesn't have any markdown headings, add one
      if (!formattedResponse.includes('#')) {
        const title = jiraObjects.map(obj => obj.charAt(0).toUpperCase() + obj.slice(1)).join(' and ');
        formattedResponse = `## ${title}\n\n${formattedResponse}`;
      }
      
      // Ensure important Jira terms are bold
      const jiraTerms = ['Jira', 'JQL', 'Agile', 'Scrum', 'Kanban', 'Workflow', 'Sprint', 'Backlog', 'Board', 'Project'];
      jiraTerms.forEach(term => {
        // Only replace if not already part of a markdown formatting
        const regex = new RegExp(`(?<![*\\w])${term}(?![*\\w])`, 'g');
        formattedResponse = formattedResponse.replace(regex, `**${term}**`);
      });
      
      // Cache the response
      knowledgeCache.set(cacheKey, {
        response: formattedResponse,
        timestamp: Date.now()
      });
      
      return formattedResponse;
    } catch (error) {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      console.error(`[OllamaClient] Error generating general knowledge response after ${responseTime.toFixed(2)}ms:`, error);
      
      // Provide a fallback response based on the query
      let fallbackResponse = '';
      
      // Generate a basic response based on the Jira object
      if (jiraObjects.includes('jql')) {
        fallbackResponse = `## JQL (Jira Query Language)

**JQL** is a specialized query language used in Jira to search and filter issues. It's similar to SQL but designed specifically for Jira. JQL allows you to create complex queries to find issues based on various criteria like status, assignee, priority, and custom fields.

### Example JQL Queries:
- \`project = "Marketing" AND status = "In Progress"\`
- \`assignee = currentUser() AND resolution = Unresolved\`
- \`created >= -7d AND project = DEV\`

JQL is used in many places in Jira, including:
- Creating filters
- Setting up dashboards
- Configuring automation rules
- Building reports`;
      } else if (jiraObjects.includes('workflow')) {
        fallbackResponse = `## Jira Workflows

**Jira Workflows** define the sequence of steps (statuses) that an issue goes through during its lifecycle. Workflows can be customized to match your team's process, with transitions controlling how issues move from one status to another.

### Key Components:
- **Statuses**: Represent the state of an issue (e.g., To Do, In Progress, Done)
- **Transitions**: Define how issues move between statuses
- **Conditions**: Control when transitions can be executed
- **Validators**: Ensure required information is provided before a transition
- **Post Functions**: Trigger actions after a transition

Workflows help ensure that issues follow the correct process and can include automation rules to reduce manual work.`;
      } else if (jiraObjects.includes('agile')) {
        fallbackResponse = `## Agile in Jira

**Agile** in Jira refers to the tools and features that support Agile methodologies like Scrum and Kanban. Jira provides boards, sprints, backlogs, and reports designed specifically for Agile teams.

### Key Agile Features in Jira:
- **Scrum Boards**: For teams using timeboxed sprints
- **Kanban Boards**: For teams using continuous flow
- **Backlog Management**: For organizing and prioritizing work
- **Sprint Planning**: For planning iterations
- **Agile Reports**: Burndown charts, velocity charts, etc.

These features help teams plan, track, and manage their work in an iterative and incremental way, promoting flexibility and continuous improvement.`;
      } else if (jiraObjects.includes('scrum')) {
        fallbackResponse = `## Scrum in Jira

**Scrum** in Jira is supported through dedicated features designed for the Scrum framework:

### Key Scrum Features:
- **Sprint Creation**: Define timeboxed iterations
- **Sprint Planning**: Select and estimate backlog items
- **Sprint Backlog**: Track work for the current sprint
- **Daily Scrum**: Update progress on the board
- **Burndown Charts**: Visualize remaining work
- **Sprint Reports**: Review completed work
- **Velocity Charts**: Track team capacity

Jira helps Scrum teams organize their backlog, plan sprints, track daily progress, and conduct retrospectives to continuously improve their process.`;
      } else if (jiraObjects.includes('kanban')) {
        fallbackResponse = `## Kanban in Jira

**Kanban** in Jira is implemented through Kanban boards that visualize work flowing through different stages:

### Key Kanban Features:
- **Kanban Boards**: Visualize workflow with columns
- **WIP Limits**: Limit work in progress to prevent bottlenecks
- **Swimlanes**: Group related issues together
- **Cumulative Flow Diagrams**: Track work distribution
- **Cycle Time Reports**: Measure time to completion
- **Control Charts**: Analyze consistency and predictability

Jira's Kanban boards show work items (issues) moving across columns representing different statuses, helping teams manage their workflow, limit work in progress, and identify bottlenecks.`;
      } else if (jiraObjects.includes('product_discovery')) {
        fallbackResponse = `## Jira Product Discovery

**Jira Product Discovery** is a tool that helps teams identify and prioritize the right problems to solve and features to build.

### Key Features:
- **Idea Collection**: Capture ideas from various sources
- **Research Management**: Organize user research and insights
- **Opportunity Canvas**: Define problems worth solving
- **Feature Prioritization**: Evaluate and rank potential features
- **Roadmap Planning**: Visualize and plan feature development
- **Integration with Jira Software**: Connect discovery to delivery

It allows teams to capture ideas, conduct research, define requirements, and prioritize work before it enters the development backlog in Jira Software.`;
      } else {
        fallbackResponse = `## Jira Overview

**Jira** is a project management and issue tracking tool developed by Atlassian. It's widely used for agile software development, bug tracking, and general project management.

### Key Features:
- **Issue Tracking**: Create, assign, and track tasks, bugs, and features
- **Project Management**: Organize work into projects with customizable workflows
- **Agile Tools**: Support for Scrum and Kanban methodologies
- **Reporting**: Track progress with built-in reports and dashboards
- **Customization**: Adapt Jira to fit your team's processes
- **Integration**: Connect with other tools in your development ecosystem

Jira allows teams to plan, track, and manage their work through customizable workflows, boards, and reports, making it suitable for teams of all sizes and industries.`;
      }
      
      console.log('[OllamaClient] Using fallback response for general knowledge query');
      
      // Cache the fallback response
      knowledgeCache.set(cacheKey, {
        response: fallbackResponse,
        timestamp: Date.now()
      });
      
      return fallbackResponse;
    }
  }

  async getAppConfigurationResponse(query: string, appObjects: string[]): Promise<string> {
    console.log('[OllamaClient] Generating app configuration response for:', query);
    
    // Check cache first
    const cacheKey = query.trim().toLowerCase();
    const cachedResponse = knowledgeCache.get(cacheKey);
    
    if (cachedResponse && (Date.now() - cachedResponse.timestamp) < CACHE_EXPIRATION_MS) {
      console.log('[OllamaClient] Using cached app configuration response');
      return cachedResponse.response;
    }
    
    const startTime = performance.now();
    
    // Ensure appObjects is valid
    if (!appObjects || !Array.isArray(appObjects) || appObjects.length === 0) {
      console.log('[OllamaClient] No app objects provided, using default');
      appObjects = ['app'];
    }
    
    // Provide hardcoded responses for common app configuration questions
    let fallbackResponse = '';
    
    // Generate a response based on the app object
    if (appObjects.includes('configuration')) {
      fallbackResponse = `## PromptDojo Configuration

**PromptDojo** is configured to connect to your Jira instance and provide AI-powered insights through natural language queries.

### Configuration Options:

1. **Jira Connection**:
   - The app connects to Jira using API tokens stored securely in GitHub secrets
   - No direct exposure of credentials in the UI or code
   - Supports different authentication methods (API tokens, OAuth)

2. **LLM Integration**:
   - Currently using Ollama with the llama3.2 model
   - Can be configured to use other models by changing the DEFAULT_CONFIG in the OllamaClient
   - Supports local deployment or cloud-based LLMs

3. **Allow-List System**:
   - Restricts queries to Jira-related operations only
   - Validates intent and objects before processing
   - Prevents unauthorized actions

To modify the configuration, you would need to update the relevant files in the codebase:
- \`lib/ollama/client.ts\` for LLM settings
- \`lib/allow-list.ts\` for query permissions
- Environment variables for API connections`;
    } else if (appObjects.includes('settings')) {
      fallbackResponse = `## PromptDojo Settings

**PromptDojo** has several settings that can be adjusted:

### User Interface Settings:
- **Debug Mode**: Toggle with the "Show Debug Info" button in the top-right corner
- **Dark/Light Mode**: Uses your system theme by default (via next-themes)

### Performance Settings:
- **Caching**: Responses are cached for 10 minutes to improve performance
- **Timeout**: API requests timeout after 45 seconds
- **Retry**: Failed requests are automatically retried once

### LLM Settings:
- **Model**: Currently using llama3.2
- **Temperature**: 0.1 for intent analysis, 0.7 for knowledge responses
- **Token Limits**: Configurable to balance response quality and speed

These settings are currently managed through code and not exposed in the UI. Future versions will include a settings panel for easier configuration.`;
    } else if (appObjects.includes('features')) {
      fallbackResponse = `## PromptDojo Features

**PromptDojo** offers several key features:

### Current Features:
1. **Natural Language Queries**: Ask questions about Jira in plain English
2. **General Knowledge**: Get information about Jira concepts without querying your instance
3. **Markdown Rendering**: Responses are formatted with proper markdown for readability
4. **Error Handling**: Robust fallback mechanisms when the LLM has issues
5. **Performance Optimization**: Caching and timeout handling for better performance

### Upcoming Features:
1. **Jira API Integration**: Connect to your Jira instance for real-time data
2. **Query Suggestions**: Recommended queries based on your Jira setup
3. **Data Visualization**: Charts and graphs for metrics and reports
4. **Custom Reporting**: Save and schedule your favorite queries
5. **Export Functionality**: Download reports in various formats

The application is currently in MVP phase, with more features being added according to the implementation plan.`;
    } else if (appObjects.includes('usage')) {
      fallbackResponse = `## How to Use PromptDojo

**PromptDojo** is designed to be intuitive and easy to use:

### Basic Usage:
1. Navigate to the PromptDojo tab in the application
2. Type your Jira-related question in the chat input field
3. Press Enter or click Send
4. View the formatted response in the chat window

### Example Queries:
- "What is JQL?" (General knowledge)
- "Explain Jira workflows" (General knowledge)
- "Show me all open bugs in the current sprint" (Jira data - coming soon)
- "What's the average resolution time for critical issues?" (Jira data - coming soon)

### Tips for Best Results:
- Be specific in your questions
- Mention relevant Jira objects (issues, sprints, projects, etc.)
- For complex queries, break them down into smaller questions
- Toggle "Show Debug Info" to see performance metrics and error details

Currently, the app can answer general knowledge questions about Jira. Direct Jira data queries will be supported in future updates.`;
    } else if (appObjects.includes('promptdojo')) {
      fallbackResponse = `## About PromptDojo

**PromptDojo** is an AI-powered chat interface for Jira data retrieval and analysis.

### Overview:
PromptDojo allows you to interact with Jira using natural language queries instead of navigating through Jira's complex interface. It's designed to simplify access to Jira data and provide actionable insights about team performance and project status.

### Current Status:
The application is currently in MVP (Minimum Viable Product) phase. It can:
- Answer general knowledge questions about Jira
- Process natural language queries
- Render responses with proper markdown formatting

### Implementation Plan:
1. **Phase 1 - MVP** (Current)
   - Basic chat interface
   - LLM integration with allow-list
   - General knowledge responses

2. **Phase 2 - Enhanced Features** (Coming Soon)
   - Connection to Jira API
   - Query suggestions
   - Better formatting and visualizations

3. **Phase 3 - Advanced Features** (Future)
   - Persistent storage for chat history
   - Custom reporting templates
   - Export functionality

The application is being developed according to the PRD (Product Requirements Document) with an iterative approach.`;
    } else {
      fallbackResponse = `## PromptDojo Application

**PromptDojo** is an AI-powered chat interface for Jira data retrieval and analysis, positioned as a tab next to the Home tab in the application.

### Technical Details:
- Built with Next.js 15.2.1
- Uses React for the frontend
- Tailwind CSS for styling
- Integrates with Ollama for LLM capabilities
- Markdown rendering with react-markdown

### Architecture:
- **Frontend**: React components for the chat interface
- **Backend**: Next.js API routes for handling requests
- **LLM Integration**: OllamaClient for processing natural language
- **Security**: Allow-list system to restrict queries

### Current Limitations:
- No actual Jira API integration yet (coming soon)
- Limited to general knowledge queries about Jira
- No persistent storage for chat history
- No user settings panel

The application is designed to be extensible, with a modular architecture that allows for easy addition of new features and integrations.`;
    }
    
    try {
      // If we have a fallback response, use it directly
      if (fallbackResponse) {
        console.log('[OllamaClient] Using fallback response for app configuration query');
        
        // Cache the fallback response
        knowledgeCache.set(cacheKey, {
          response: fallbackResponse,
          timestamp: Date.now()
        });
        
        return fallbackResponse;
      }
      
      // Otherwise, try to generate a response using the LLM
      console.log('[OllamaClient] Sending app configuration prompt to LLM');
      
      // Create a prompt for app configuration response
      const topics = appObjects.join(', ');
      const prompt = `
        You are a helpful assistant for the PromptDojo application. Provide information about the app's ${topics}:
        
        "${query}"
        
        Format your response using proper markdown:
        - Use ## for section headings
        - Use **bold** for important terms
        - Use bullet points (- item) for lists
        - Use numbered lists (1. step) for steps or sequences
        
        Focus only on the PromptDojo application, which is an AI-powered chat interface for Jira data retrieval and analysis.
        The app is currently in MVP phase and can answer general knowledge questions about Jira.
        Future versions will connect to Jira API for real data queries.
        
        Keep your response under 1500 characters if possible.
      `;
      
      const response = await this.generateCompletion({
        prompt,
        options: {
          temperature: 0.7,    // Slightly higher temperature for more natural responses
          top_p: 0.9,          // Limit token selection for faster generation
          num_predict: 1500,   // Limit token generation for faster responses
        }
      });
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      console.log(`[OllamaClient] App configuration response generated in ${responseTime.toFixed(2)}ms`);
      
      // Validate the response
      if (!response || typeof response !== 'string' || response.trim().length === 0) {
        console.error('[OllamaClient] Empty or invalid response from LLM');
        throw new Error('Empty or invalid response from LLM');
      }
      
      // Ensure the response has proper markdown formatting
      let formattedResponse = response;
      
      // If the response doesn't have any markdown headings, add one
      if (!formattedResponse.includes('#')) {
        const title = appObjects.map(obj => obj.charAt(0).toUpperCase() + obj.slice(1)).join(' and ');
        formattedResponse = `## PromptDojo ${title}\n\n${formattedResponse}`;
      }
      
      // Cache the response
      knowledgeCache.set(cacheKey, {
        response: formattedResponse,
        timestamp: Date.now()
      });
      
      return formattedResponse;
    } catch (error) {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      console.error(`[OllamaClient] Error generating app configuration response after ${responseTime.toFixed(2)}ms:`, error);
      
      // If we don't have a fallback response yet, create a generic one
      if (!fallbackResponse) {
        fallbackResponse = `## PromptDojo Application

**PromptDojo** is an AI-powered chat interface for Jira data retrieval and analysis. It allows you to interact with Jira using natural language queries.

### Current Features:
- Chat interface for natural language queries
- General knowledge about Jira concepts
- Markdown rendering for formatted responses

### Usage:
1. Type your Jira-related question in the chat input
2. Press Enter or click Send
3. View the formatted response

The application is currently in MVP phase, with more features coming soon including direct Jira API integration for real-time data queries.`;
      }
      
      console.log('[OllamaClient] Using generic fallback response for app configuration query');
      
      // Cache the fallback response
      knowledgeCache.set(cacheKey, {
        response: fallbackResponse,
        timestamp: Date.now()
      });
      
      return fallbackResponse;
    }
  }
} 
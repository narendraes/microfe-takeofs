import { NextRequest } from 'next/server';
import { AIServiceFactory } from '@/lib/ai/ai-service-factory';
import { JiraService } from '@/lib/jira/jira-service';

const log = console.log;
const error = console.error;

export async function POST(request: NextRequest) {
  log('[API] AI generate request received');

  try {
    const body = await request.json();
    const { prompt, provider, config } = body;
    
    log('[API] Request body:', {
      provider,
      promptLength: prompt.length,
      config,
    });

    // Initialize Jira service
    const jiraService = new JiraService();

    // Check if this is a Jira-related query
    const isJiraQuery = prompt.toLowerCase().includes('jira') || 
                       prompt.toLowerCase().includes('project') ||
                       prompt.toLowerCase().includes('sprint');

    if (isJiraQuery) {
      try {
        const isConnected = await jiraService.validateConnection();
        if (isConnected) {
          // Handle sprint-related queries
          if (prompt.toLowerCase().includes('sprint')) {
            const projectKeyMatch = prompt.match(/project\s+(\w+)/i);
            if (projectKeyMatch) {
              const projectKey = projectKeyMatch[1];
              const sprintData = await jiraService.getActiveSprint(projectKey);
              
              if (sprintData) {
                const { sprint, issues } = sprintData;
                const response = {
                  content: `Active Sprint for Project ${projectKey}:\n\n` +
                          `Sprint Name: ${sprint.name}\n` +
                          `Start Date: ${sprint.startDate}\n` +
                          `End Date: ${sprint.endDate}\n\n` +
                          `Issues in Sprint:\n` +
                          issues.map((issue: any) => 
                            `- ${issue.key}: ${issue.fields.summary} (${issue.fields.status.name})`
                          ).join('\n'),
                  provider: 'jira',
                  processingTime: '100.00ms',
                };
                return new Response(JSON.stringify(response));
              }
            }
          }
          
          // Handle project-related queries
          if (prompt.toLowerCase().includes('project')) {
            const projects = await jiraService.getProjects();
            const response = {
              content: `Projects in Jira:\n\n${projects.map(p => 
                `${p.name} (${p.key})`).join('\n')}`,
              provider: 'jira',
              processingTime: '100.00ms',
            };
            return new Response(JSON.stringify(response));
          }
        }
      } catch (error) {
        console.error('[API] Jira API error:', error);
      }
    }

    // Fallback to AI response
    const aiFactory = AIServiceFactory.getInstance();
    const aiService = provider ? aiFactory.getService(provider) : aiFactory.getDefaultService();
    const aiResponse = await aiService.generate(prompt, config);

    log('[API] Response data:', {
      provider: aiResponse.provider,
      processingTime: `${aiResponse.processingTime.toFixed(2)}ms`,
      responseLength: aiResponse.content.length,
    });

    return new Response(JSON.stringify(aiResponse));
  } catch (error) {
    console.error('[API] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate response',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500 }
    );
  }
} 
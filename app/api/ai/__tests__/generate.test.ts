import { NextRequest } from 'next/server';
import { POST } from '../generate/route';
import { JiraService } from '@/lib/jira/jira-service';

// Mock the Response class
global.Response = class Response {
  constructor(body?: BodyInit | null, init?: ResponseInit) {
    return {
      status: init?.status || 200,
      json: async () => JSON.parse(body as string),
    } as Response;
  }
} as any;

// Mock the JiraService
jest.mock('@/lib/jira/jira-service');

// Mock the AIServiceFactory
jest.mock('@/lib/ai/ai-service-factory', () => ({
  AIServiceFactory: {
    getInstance: jest.fn().mockReturnValue({
      getService: jest.fn().mockReturnValue({
        generate: jest.fn().mockResolvedValue({
          content: 'AI response',
          provider: 'gemini',
          processingTime: 100,
        }),
      }),
      getDefaultService: jest.fn().mockReturnValue({
        generate: jest.fn().mockResolvedValue({
          content: 'AI response',
          provider: 'gemini',
          processingTime: 100,
        }),
      }),
    }),
  },
}));

// Mock NextRequest
const createMockRequest = (body: any) => ({
  json: () => Promise.resolve(body),
});

describe('AI Generate API with Jira Integration', () => {
  const mockProjects = [
    { name: 'Project A', key: 'PROJ-A' },
    { name: 'Project B', key: 'PROJ-B' },
  ];

  const mockSprint = {
    id: 1,
    name: 'Sprint 1',
    startDate: '2024-03-01',
    endDate: '2024-03-15',
  };

  const mockIssues = [
    { 
      key: 'PROJ-1',
      fields: {
        summary: 'Implement feature X',
        status: { name: 'In Progress' }
      }
    },
    {
      key: 'PROJ-2',
      fields: {
        summary: 'Fix bug Y',
        status: { name: 'To Do' }
      }
    }
  ];

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should return project list when Jira is connected', async () => {
    // Mock Jira service methods
    (JiraService.prototype.validateConnection as jest.Mock).mockResolvedValue(true);
    (JiraService.prototype.getProjects as jest.Mock).mockResolvedValue(mockProjects);

    const request = createMockRequest({
      prompt: 'what are the projects in the instance',
      provider: 'gemini',
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.provider).toBe('jira');
    expect(data.content).toContain('Project A (PROJ-A)');
    expect(data.content).toContain('Project B (PROJ-B)');
  });

  it('should fall back to AI when Jira is not connected', async () => {
    // Mock Jira service to be disconnected
    (JiraService.prototype.validateConnection as jest.Mock).mockResolvedValue(false);

    const request = createMockRequest({
      prompt: 'what are the projects in the instance',
      provider: 'gemini',
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.provider).toBe('gemini');
    expect(data.content).toBe('AI response');
  });

  it('should handle Jira API errors gracefully', async () => {
    // Mock Jira service to be connected but throw error on getProjects
    (JiraService.prototype.validateConnection as jest.Mock).mockResolvedValue(true);
    (JiraService.prototype.getProjects as jest.Mock).mockRejectedValue(new Error('Jira API error'));

    const request = createMockRequest({
      prompt: 'what are the projects in the instance',
      provider: 'gemini',
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.provider).toBe('gemini');
    expect(data.content).toBe('AI response');
  });

  it('should use AI for non-Jira queries', async () => {
    // Mock Jira service to be connected
    (JiraService.prototype.validateConnection as jest.Mock).mockResolvedValue(true);

    const request = createMockRequest({
      prompt: 'what is the weather today',
      provider: 'gemini',
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.provider).toBe('gemini');
    expect(data.content).toBe('AI response');
    expect(JiraService.prototype.getProjects).not.toHaveBeenCalled();
  });

  it('should handle invalid request body', async () => {
    const request = {
      json: () => Promise.reject(new Error('Invalid JSON')),
    };

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to generate response');
  });

  it('should return active sprint info when Jira is connected', async () => {
    // Mock Jira service methods
    (JiraService.prototype.validateConnection as jest.Mock).mockResolvedValue(true);
    (JiraService.prototype.getActiveSprint as jest.Mock).mockResolvedValue({
      sprint: mockSprint,
      issues: mockIssues,
    });

    const request = createMockRequest({
      prompt: 'what is the active sprint on project PROJ-A',
      provider: 'gemini',
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.provider).toBe('jira');
    expect(data.content).toContain('Sprint 1');
    expect(data.content).toContain('2024-03-01');
    expect(data.content).toContain('2024-03-15');
    expect(data.content).toContain('PROJ-1');
    expect(data.content).toContain('PROJ-2');
  });

  it('should handle missing sprint data gracefully', async () => {
    // Mock Jira service methods
    (JiraService.prototype.validateConnection as jest.Mock).mockResolvedValue(true);
    (JiraService.prototype.getActiveSprint as jest.Mock).mockResolvedValue(null);

    const request = createMockRequest({
      prompt: 'what is the active sprint on project PROJ-A',
      provider: 'gemini',
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.provider).toBe('gemini');
    expect(data.content).toBe('AI response');
  });
}); 
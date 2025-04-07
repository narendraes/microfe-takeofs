import { JiraConfig, JiraIssue, JiraSearchResult, JiraSprint, JiraProject } from './types';

export class JiraService {
  private host: string;
  private email: string;
  private apiToken: string;
  private baseUrl: string;

  constructor() {
    this.host = process.env.JIRA_HOST || '';
    this.email = process.env.JIRA_EMAIL || '';
    this.apiToken = process.env.JIRA_API_TOKEN || '';
    this.baseUrl = `${this.host}/rest/api/3`;
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const headers = {
      'Authorization': `Basic ${Buffer.from(`${this.email}:${this.apiToken}`).toString('base64')}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Jira API error: ${response.statusText}`);
    }

    return response.json();
  }

  async validateConnection(): Promise<boolean> {
    try {
      await this.fetch('/myself');
      return true;
    } catch (error) {
      console.error('Failed to validate Jira connection:', error);
      return false;
    }
  }

  async getProjects(): Promise<any[]> {
    const response = await this.fetch('/project');
    return response;
  }

  async getActiveSprint(projectKey: string): Promise<any> {
    try {
      // First, get the board ID for the project
      const boardsResponse = await this.fetch(`/board?projectKeyOrId=${projectKey}`);
      const board = boardsResponse.values[0]; // Assuming the first board is the main one
      
      if (!board) {
        throw new Error(`No board found for project ${projectKey}`);
      }

      // Then, get the active sprint for this board
      const sprintsResponse = await this.fetch(`/board/${board.id}/sprint?state=active`);
      const activeSprint = sprintsResponse.values[0];

      if (!activeSprint) {
        return null; // No active sprint
      }

      // Get sprint details including issues
      const sprintDetails = await this.fetch(`/sprint/${activeSprint.id}/issue`);
      return {
        sprint: activeSprint,
        issues: sprintDetails.issues,
      };
    } catch (error) {
      console.error('Failed to get active sprint:', error);
      throw error;
    }
  }

  async searchIssues(jql: string, fields: string[] = ['summary', 'status', 'assignee']): Promise<JiraSearchResult> {
    return this.fetch('/search', {
      method: 'POST',
      body: JSON.stringify({
        jql,
        fields,
        maxResults: 50,
      }),
    });
  }

  async getIssue(issueKey: string): Promise<JiraIssue> {
    return this.fetch(`/issue/${issueKey}`);
  }

  async getProject(projectKey: string): Promise<JiraProject> {
    return this.fetch(`/project/${projectKey}`);
  }

  async getSprints(boardId: number): Promise<JiraSprint[]> {
    return this.fetch(`/board/${boardId}/sprint`)
      .then(response => response.values);
  }

  async getCurrentSprint(boardId: number): Promise<JiraSprint | null> {
    const sprints = await this.getSprints(boardId);
    return sprints.find(sprint => sprint.state === 'active') || null;
  }
} 
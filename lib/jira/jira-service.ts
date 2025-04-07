import { JiraConfig, JiraIssue, JiraSearchResult, JiraSprint, JiraProject } from './types';

export class JiraService {
  private baseUrl: string;
  private auth: string;
  private headers: Headers;

  constructor(config: JiraConfig) {
    this.baseUrl = config.host.endsWith('/') ? config.host.slice(0, -1) : config.host;
    this.auth = Buffer.from(`${config.email}:${config.apiToken}`).toString('base64');
    this.headers = new Headers({
      'Authorization': `Basic ${this.auth}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Jira API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async searchIssues(jql: string, fields: string[] = ['summary', 'status', 'assignee']): Promise<JiraSearchResult> {
    return this.request<JiraSearchResult>('/rest/api/2/search', {
      method: 'POST',
      body: JSON.stringify({
        jql,
        fields,
        maxResults: 50,
      }),
    });
  }

  async getIssue(issueKey: string): Promise<JiraIssue> {
    return this.request<JiraIssue>(`/rest/api/2/issue/${issueKey}`);
  }

  async getProject(projectKey: string): Promise<JiraProject> {
    return this.request<JiraProject>(`/rest/api/2/project/${projectKey}`);
  }

  async getProjects(): Promise<JiraProject[]> {
    return this.request<JiraProject[]>('/rest/api/2/project');
  }

  async getSprints(boardId: number): Promise<JiraSprint[]> {
    return this.request<{ values: JiraSprint[] }>(`/rest/agile/1.0/board/${boardId}/sprint`)
      .then(response => response.values);
  }

  async getCurrentSprint(boardId: number): Promise<JiraSprint | null> {
    const sprints = await this.getSprints(boardId);
    return sprints.find(sprint => sprint.state === 'active') || null;
  }

  // Helper method to validate connection
  async validateConnection(): Promise<boolean> {
    try {
      await this.request<{ self: string }>('/rest/api/2/myself');
      return true;
    } catch (error) {
      console.error('Jira connection validation failed:', error);
      return false;
    }
  }
} 
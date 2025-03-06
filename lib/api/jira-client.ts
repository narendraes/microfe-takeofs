import { JiraConfig } from '../types';

const DEFAULT_CONFIG: JiraConfig = {
  apiUrl: '',
  token: '',
  isAuthenticated: false,
};

export class JiraClient {
  private config: JiraConfig;

  constructor(config: Partial<JiraConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  isAuthenticated(): boolean {
    return this.config.isAuthenticated && !!this.config.token && !!this.config.apiUrl;
  }

  async authenticate(apiUrl: string, token: string): Promise<boolean> {
    // In a real implementation, we would validate the token against the Jira API
    // For now, we'll just store the values and assume they're valid
    this.config.apiUrl = apiUrl;
    this.config.token = token;
    this.config.isAuthenticated = true;
    
    return true;
  }

  async searchIssues(jql: string): Promise<any[]> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated. Please set up Jira API credentials first.');
    }

    try {
      const response = await fetch(`${this.config.apiUrl}/rest/api/2/search?jql=${encodeURIComponent(jql)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Jira API error: ${response.status}`);
      }

      const data = await response.json();
      return data.issues || [];
    } catch (error) {
      console.error('Error searching Jira issues:', error);
      throw error;
    }
  }

  async getIssuesByFixVersion(fixVersion: string): Promise<any[]> {
    const jql = `fixVersion = "${fixVersion}" ORDER BY issuetype ASC`;
    return this.searchIssues(jql);
  }

  async getIssuesByProject(projectKey: string): Promise<any[]> {
    const jql = `project = "${projectKey}" ORDER BY created DESC`;
    return this.searchIssues(jql);
  }

  async getIssuesByAssignee(assignee: string): Promise<any[]> {
    const jql = `assignee = "${assignee}" ORDER BY updated DESC`;
    return this.searchIssues(jql);
  }

  async getSprintIssues(sprintId: string): Promise<any[]> {
    const jql = `sprint = ${sprintId} ORDER BY status ASC, priority DESC`;
    return this.searchIssues(jql);
  }
} 
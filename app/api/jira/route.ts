import { NextRequest, NextResponse } from 'next/server';
import { JiraService } from '@/lib/jira/jira-service';

// Initialize Jira service with environment variables
const jiraService = new JiraService({
  host: process.env.JIRA_HOST || '',
  email: process.env.JIRA_EMAIL || '',
  apiToken: process.env.JIRA_API_TOKEN || '',
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (!action) {
      return NextResponse.json({ error: 'Action parameter is required' }, { status: 400 });
    }

    switch (action) {
      case 'validate':
        const isValid = await jiraService.validateConnection();
        return NextResponse.json({ valid: isValid });

      case 'projects':
        const projects = await jiraService.getProjects();
        return NextResponse.json({ projects });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Jira API error:', error);
    return NextResponse.json(
      { error: 'Failed to process Jira request' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action parameter is required' }, { status: 400 });
    }

    switch (action) {
      case 'search':
        const { jql, fields } = params;
        if (!jql) {
          return NextResponse.json({ error: 'JQL query is required' }, { status: 400 });
        }
        const searchResults = await jiraService.searchIssues(jql, fields);
        return NextResponse.json(searchResults);

      case 'issue':
        const { issueKey } = params;
        if (!issueKey) {
          return NextResponse.json({ error: 'Issue key is required' }, { status: 400 });
        }
        const issue = await jiraService.getIssue(issueKey);
        return NextResponse.json(issue);

      case 'sprint':
        const { boardId } = params;
        if (!boardId) {
          return NextResponse.json({ error: 'Board ID is required' }, { status: 400 });
        }
        const sprint = await jiraService.getCurrentSprint(Number(boardId));
        return NextResponse.json({ sprint });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Jira API error:', error);
    return NextResponse.json(
      { error: 'Failed to process Jira request' },
      { status: 500 }
    );
  }
} 
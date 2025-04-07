import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { JiraConnectionStatus } from '../connection-status';
import { useJiraConfig } from '@/lib/hooks/useJiraConfig';

// Mock the useJiraConfig hook
jest.mock('@/lib/hooks/useJiraConfig');

describe('JiraConnectionStatus', () => {
  const mockRetryConnection = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show configuration error when not configured', () => {
    (useJiraConfig as jest.Mock).mockReturnValue({
      isConfigured: false,
      isConnected: false,
      error: null,
      retryConnection: mockRetryConnection,
    });

    render(<JiraConnectionStatus />);

    expect(screen.getByText('Configuration Error')).toBeInTheDocument();
    expect(screen.getByText('Jira is not configured. Please check your environment variables.')).toBeInTheDocument();
  });

  it('should show connection error with retry button', () => {
    (useJiraConfig as jest.Mock).mockReturnValue({
      isConfigured: true,
      isConnected: false,
      error: 'Failed to connect to Jira',
      retryConnection: mockRetryConnection,
    });

    render(<JiraConnectionStatus />);

    expect(screen.getByText('Connection Error')).toBeInTheDocument();
    expect(screen.getByText('Failed to connect to Jira')).toBeInTheDocument();

    const retryButton = screen.getByText('Retry Connection');
    fireEvent.click(retryButton);

    expect(mockRetryConnection).toHaveBeenCalledTimes(1);
  });

  it('should show success message when connected', () => {
    const mockHost = 'https://jira.example.com';
    (useJiraConfig as jest.Mock).mockReturnValue({
      isConfigured: true,
      isConnected: true,
      error: null,
      host: mockHost,
      retryConnection: mockRetryConnection,
    });

    render(<JiraConnectionStatus />);

    expect(screen.getByText('Connected to Jira')).toBeInTheDocument();
    expect(screen.getByText(`Successfully connected to ${mockHost}`)).toBeInTheDocument();
  });

  it('should render nothing when in intermediate state', () => {
    (useJiraConfig as jest.Mock).mockReturnValue({
      isConfigured: true,
      isConnected: false,
      error: null,
      retryConnection: mockRetryConnection,
    });

    const { container } = render(<JiraConnectionStatus />);
    expect(container.firstChild).toBeNull();
  });
}); 
import { useState, useEffect } from 'react';

interface JiraConfigState {
  isConfigured: boolean;
  isConnected: boolean;
  error: string | null;
  host?: string;
}

export function useJiraConfig() {
  const [config, setConfig] = useState<JiraConfigState>({
    isConfigured: false,
    isConnected: false,
    error: null,
  });

  const validateJiraConnection = async () => {
    try {
      // Check if Jira host is configured
      const response = await fetch('/api/jira?action=validate');
      const data = await response.json();

      if (!response.ok) {
        setConfig({
          isConfigured: false,
          isConnected: false,
          error: data.error || 'Failed to validate Jira connection',
        });
        return;
      }

      setConfig({
        isConfigured: true,
        isConnected: data.valid,
        error: null,
        host: data.host,
      });
    } catch (error) {
      setConfig({
        isConfigured: false,
        isConnected: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

  useEffect(() => {
    validateJiraConnection();
  }, []);

  const retryConnection = async () => {
    setConfig(prev => ({ ...prev, error: null }));
    await validateJiraConnection();
  };

  return {
    ...config,
    retryConnection,
  };
} 
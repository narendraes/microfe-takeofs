import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useJiraConfig } from "@/lib/hooks/useJiraConfig";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

export function JiraConnectionStatus() {
  const { isConfigured, isConnected, error, host, retryConnection } = useJiraConfig();

  if (!isConfigured) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Configuration Error</AlertTitle>
        <AlertDescription>
          Jira is not configured. Please check your environment variables.
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Connection Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <p>{error}</p>
          <Button variant="outline" size="sm" onClick={retryConnection}>
            Retry Connection
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (isConnected) {
    return (
      <Alert variant="default" className="bg-green-50">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Connected to Jira</AlertTitle>
        <AlertDescription className="text-green-700">
          Successfully connected to {host}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
} 
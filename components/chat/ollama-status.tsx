'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export function OllamaStatus() {
  const [status, setStatus] = useState<'checking' | 'running' | 'not-running'>('checking');
  const [error, setError] = useState<string | null>(null);
  const [models, setModels] = useState<string[]>([]);

  const checkOllamaStatus = async () => {
    setStatus('checking');
    setError(null);
    
    try {
      console.log('[OllamaStatus] Checking Ollama server status...');
      const response = await fetch('http://localhost:11434/api/tags', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to connect to Ollama: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[OllamaStatus] Ollama server response:', data);
      
      if (data.models && Array.isArray(data.models)) {
        setModels(data.models.map((model: any) => model.name));
      }
      
      setStatus('running');
    } catch (error) {
      console.error('[OllamaStatus] Error checking Ollama status:', error);
      setStatus('not-running');
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  useEffect(() => {
    checkOllamaStatus();
  }, []);

  return (
    <div className="mb-4 p-3 border rounded-md bg-gray-50">
      <h3 className="text-sm font-medium mb-2">Ollama Server Status</h3>
      
      <div className="flex items-center gap-2 mb-2">
        <div 
          className={`w-3 h-3 rounded-full ${
            status === 'checking' ? 'bg-yellow-500' : 
            status === 'running' ? 'bg-green-500' : 'bg-red-500'
          }`} 
        />
        <span className="text-sm">
          {status === 'checking' ? 'Checking...' : 
           status === 'running' ? 'Running' : 'Not Running'}
        </span>
      </div>
      
      {error && (
        <div className="text-xs text-red-500 mb-2">
          Error: {error}
        </div>
      )}
      
      {status === 'running' && models.length > 0 && (
        <div className="text-xs mb-2">
          Available models: {models.join(', ')}
        </div>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={checkOllamaStatus}
        className="text-xs"
      >
        Refresh Status
      </Button>
    </div>
  );
} 
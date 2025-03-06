'use client';

import { useEffect, useRef, useState } from 'react';
// Replace uuid import with a simple ID generation function
import { Message as MessageType, ChatState } from '@/lib/types';
import { Message } from './message';
import { ChatInput } from './chat-input';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { OllamaClient } from '@/lib/ollama/client';
import { validateQueryIntent } from '@/lib/allow-list';
import { OllamaStatus } from './ollama-status';

// Simple ID generation function to replace uuid
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const initialState: ChatState = {
  messages: [
    {
      id: generateId(),
      role: 'assistant',
      content: 'Hello! I can help you with Jira-related queries. What would you like to know?',
      timestamp: Date.now(),
    },
  ],
  isLoading: false,
  error: null,
};

export function ChatContainer() {
  const [chatState, setChatState] = useState<ChatState>(initialState);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ollamaClient = useRef(new OllamaClient());
  const [showDebug, setShowDebug] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  const handleSendMessage = async (content: string) => {
    console.log('[ChatContainer] Handling new message:', content);
    
    // Add user message to chat
    const userMessage: MessageType = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    console.log('[ChatContainer] Adding user message to chat state');
    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      // Analyze intent using Ollama
      console.log('[ChatContainer] Calling Ollama to analyze intent');
      const intent = await ollamaClient.current.analyzeIntent(content);
      console.log('[ChatContainer] Intent analysis result:', intent);
      
      // Validate intent against allow-list
      console.log('[ChatContainer] Validating intent against allow-list');
      const validation = validateQueryIntent(intent);
      console.log('[ChatContainer] Validation result:', validation);
      
      let responseContent: string;
      
      if (!validation.isAllowed) {
        console.log('[ChatContainer] Query not allowed:', validation.reason);
        responseContent = `I'm sorry, but I can't process that query. ${validation.reason} I can only answer Jira-related questions.`;
      } else {
        console.log('[ChatContainer] Query allowed, generating response');
        // For now, we'll just echo back a placeholder response
        // In a real implementation, we would process the query and fetch data from Jira
        responseContent = `I understood your query about ${intent.jiraObjects.join(', ')}. This is a placeholder response as we're still in MVP phase. In the future, I'll provide real Jira data here.`;
      }

      // Add assistant response to chat
      console.log('[ChatContainer] Adding assistant response to chat state');
      const assistantMessage: MessageType = {
        id: generateId(),
        role: 'assistant',
        content: responseContent,
        timestamp: Date.now(),
      };

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      console.error('[ChatContainer] Error processing message:', error);
      
      // Log detailed error information
      if (error instanceof Error) {
        console.error('[ChatContainer] Error name:', error.name);
        console.error('[ChatContainer] Error message:', error.message);
        console.error('[ChatContainer] Error stack:', error.stack);
      } else {
        console.error('[ChatContainer] Unknown error type:', typeof error);
        console.error('[ChatContainer] Error value:', error);
      }
      
      // Add error message to chat
      console.log('[ChatContainer] Adding error message to chat state');
      const errorMessage: MessageType = {
        id: generateId(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again later.',
        timestamp: Date.now(),
      };

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  };

  return (
    <Card className="flex flex-col h-full dark:border-gray-800">
      <div className="flex-1 overflow-y-auto p-4">
        {/* Debug toggle button */}
        <div className="flex justify-end mb-2">
          <button 
            onClick={() => setShowDebug(!showDebug)} 
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
          </button>
        </div>
        
        {/* Ollama status component (only shown when debug is enabled) */}
        {showDebug && <OllamaStatus />}
        
        {/* Chat messages */}
        {chatState.messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        
        {/* Error display (only shown when debug is enabled) */}
        {showDebug && chatState.error && (
          <div className="mt-4 p-3 border border-red-300 rounded-md bg-red-50 text-red-800 text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            <strong>Error:</strong> {chatState.error}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <Separator />
      
      <div className="p-4">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={chatState.isLoading} 
        />
      </div>
    </Card>
  );
} 
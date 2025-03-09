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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Clock } from 'lucide-react';

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
  processingTime: null,
};

// Retry configuration
const MAX_RETRIES = 1;
const RETRY_DELAY_MS = 1000;

export function ChatContainer() {
  const [chatState, setChatState] = useState<ChatState>(initialState);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ollamaClient = useRef(new OllamaClient());
  const [showDebug, setShowDebug] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  // Function to update the typing indicator with progress messages
  const updateTypingIndicator = (progressMessage: string) => {
    setChatState((prev) => {
      // Only update if we're still loading and have a typing indicator
      if (prev.isLoading && prev.messages.some(m => m.id === 'typing-indicator')) {
        const updatedMessages = prev.messages.map(m => 
          m.id === 'typing-indicator' 
            ? { ...m, content: progressMessage }
            : m
        );
        return {
          ...prev,
          messages: updatedMessages,
        };
      }
      return prev;
    });
  };

  const handleSendMessage = async (content: string) => {
    const startTime = performance.now();
    console.log('[ChatContainer] Handling new message:', content);
    
    // Reset retry count for new messages
    setRetryCount(0);
    
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
      processingTime: null,
    }));

    try {
      // Add a typing indicator immediately
      const typingMessage: MessageType = {
        id: 'typing-indicator',
        role: 'assistant',
        content: 'Analyzing your question...',
        timestamp: Date.now(),
        isTyping: true,
      };
      
      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, typingMessage],
      }));

      // Analyze intent using Ollama
      console.log('[ChatContainer] Calling Ollama to analyze intent');
      updateTypingIndicator('Analyzing your question...');
      
      const intentStartTime = performance.now();
      const intent = await ollamaClient.current.analyzeIntent(content);
      const intentEndTime = performance.now();
      console.log(`[ChatContainer] Intent analysis completed in ${(intentEndTime - intentStartTime).toFixed(2)}ms`);
      console.log('[ChatContainer] Intent analysis result:', intent);
      
      // Validate intent against allow-list
      console.log('[ChatContainer] Validating intent against allow-list');
      updateTypingIndicator('Processing your question...');
      
      const validation = validateQueryIntent(intent);
      console.log('[ChatContainer] Validation result:', validation);
      
      let responseContent: string;
      
      if (!validation.isAllowed) {
        console.log('[ChatContainer] Query not allowed:', validation.reason);
        responseContent = `I'm sorry, but I can't process that query. ${validation.reason} I can only answer Jira-related questions or questions about this application.`;
      } else if (validation.isGeneralKnowledge) {
        // Handle general knowledge queries directly with the LLM
        console.log('[ChatContainer] Handling general knowledge query');
        updateTypingIndicator('Retrieving Jira information...');
        responseContent = await ollamaClient.current.getGeneralKnowledgeResponse(content, intent.jiraObjects);
      } else if (validation.isAppConfiguration) {
        // Handle app configuration queries
        console.log('[ChatContainer] Handling app configuration query');
        updateTypingIndicator('Retrieving application information...');
        responseContent = await ollamaClient.current.getAppConfigurationResponse(content, intent.jiraObjects);
      } else {
        console.log('[ChatContainer] Query allowed, generating response');
        updateTypingIndicator('Preparing response...');
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

      const endTime = performance.now();
      const processingTime = endTime - startTime;
      console.log(`[ChatContainer] Total processing time: ${processingTime.toFixed(2)}ms`);

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages.filter(m => !m.isTyping), assistantMessage],
        isLoading: false,
        processingTime,
      }));
    } catch (error) {
      const endTime = performance.now();
      const processingTime = endTime - startTime;
      console.error(`[ChatContainer] Error processing message after ${processingTime.toFixed(2)}ms:`, error);
      
      // Log detailed error information
      if (error instanceof Error) {
        console.error('[ChatContainer] Error name:', error.name);
        console.error('[ChatContainer] Error message:', error.message);
        console.error('[ChatContainer] Error stack:', error.stack);
      } else {
        console.error('[ChatContainer] Unknown error type:', typeof error);
        console.error('[ChatContainer] Error value:', error);
      }
      
      // Determine if it's a timeout error
      const isTimeout = error instanceof Error && 
        (error.message.includes('timeout') || error.message.includes('abort'));
      
      // If it's a timeout and we haven't exceeded max retries, try again
      if (isTimeout && retryCount < MAX_RETRIES) {
        console.log(`[ChatContainer] Timeout detected, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
        
        // Update typing indicator to show retry
        updateTypingIndicator(`The AI is taking longer than expected. Retrying (${retryCount + 1}/${MAX_RETRIES})...`);
        
        // Increment retry count
        setRetryCount(prev => prev + 1);
        
        // Retry after a delay
        setTimeout(() => {
          handleSendMessage(content);
        }, RETRY_DELAY_MS);
        
        return;
      }
      
      // Add error message to chat
      console.log('[ChatContainer] Adding error message to chat state');
      const errorMessage: MessageType = {
        id: generateId(),
        role: 'assistant',
        content: isTimeout 
          ? 'Sorry, the request timed out. The AI model might be busy or still loading. Please try again in a moment with a simpler question or try again later.'
          : 'Sorry, I encountered an error processing your request. Please try again later.',
        timestamp: Date.now(),
      };

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages.filter(m => !m.isTyping), errorMessage],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime,
      }));
      
      // Reset retry count after error
      setRetryCount(0);
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
        
        {/* Processing time indicator (only shown when debug is enabled) */}
        {showDebug && chatState.processingTime && (
          <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3 w-3 mr-1" />
            <span>Response time: {chatState.processingTime.toFixed(2)}ms</span>
          </div>
        )}
        
        {/* Error display (only shown when debug is enabled) */}
        {showDebug && chatState.error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Error:</strong> {chatState.error}
            </AlertDescription>
          </Alert>
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
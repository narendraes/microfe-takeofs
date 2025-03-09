'use client';

import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Message as MessageType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageProps {
  message: MessageType;
}

// Define the type for code component props
interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';
  const [formattedTime, setFormattedTime] = useState<string>('');
  const [typingDots, setTypingDots] = useState('.');
  
  // Use useEffect to handle time formatting on the client side only
  useEffect(() => {
    setFormattedTime(new Date(message.timestamp).toLocaleTimeString());
  }, [message.timestamp]);
  
  // Animate typing indicator dots
  useEffect(() => {
    if (!message.isTyping) return;
    
    const interval = setInterval(() => {
      setTypingDots(prev => {
        if (prev === '.') return '..';
        if (prev === '..') return '...';
        return '.';
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, [message.isTyping]);
  
  return (
    <div className={cn(
      'flex w-full mb-4',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      <div className={cn(
        'flex gap-3 max-w-[80%]',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}>
        <Avatar className={cn(
          'h-8 w-8',
          isUser ? 'bg-blue-500' : 'bg-neutral-500'
        )}>
          <span className="text-xs font-medium text-white">
            {isUser ? 'U' : 'AI'}
          </span>
        </Avatar>
        
        <Card className={cn(
          'p-3 text-sm',
          isUser ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-white dark:bg-gray-800',
          message.isTyping && 'animate-pulse'
        )}>
          {message.isTyping ? (
            <div className="whitespace-pre-wrap dark:text-gray-200">
              {`${message.content}${typingDots}`}
            </div>
          ) : (
            <div className="markdown-content dark:text-gray-200">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  // Style headings
                  h1: ({node, ...props}) => <h1 className="text-xl font-bold my-2" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-lg font-bold my-2" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-md font-bold my-1" {...props} />,
                  // Style lists
                  ul: ({node, ...props}) => <ul className="list-disc pl-5 my-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-2" {...props} />,
                  // Style links
                  a: ({node, ...props}) => <a className="text-blue-500 hover:underline" {...props} />,
                  // Style code blocks and inline code
                  code: ({node, inline, className, children, ...props}: CodeProps) => 
                    inline 
                      ? <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>{children}</code>
                      : <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm my-2 overflow-x-auto" {...props}>{children}</code>,
                  // Style blockquotes
                  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2" {...props} />,
                  // Style tables
                  table: ({node, ...props}) => <table className="border-collapse border border-gray-300 my-2 w-full" {...props} />,
                  th: ({node, ...props}) => <th className="border border-gray-300 px-4 py-2 bg-gray-100 dark:bg-gray-700" {...props} />,
                  td: ({node, ...props}) => <td className="border border-gray-300 px-4 py-2" {...props} />,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
          <div className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 text-right">
            {formattedTime}
          </div>
        </Card>
      </div>
    </div>
  );
} 
'use client';

import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Message as MessageType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';
  const [formattedTime, setFormattedTime] = useState<string>('');
  
  // Use useEffect to handle time formatting on the client side only
  useEffect(() => {
    setFormattedTime(new Date(message.timestamp).toLocaleTimeString());
  }, [message.timestamp]);
  
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
          isUser ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-white dark:bg-gray-800'
        )}>
          <div className="whitespace-pre-wrap dark:text-gray-200">
            {message.content}
          </div>
          <div className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 text-right">
            {formattedTime}
          </div>
        </Card>
      </div>
    </div>
  );
} 
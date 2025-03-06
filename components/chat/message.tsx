'use client';

import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Message as MessageType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';
  
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
          isUser ? 'bg-blue-50' : 'bg-white'
        )}>
          <div className="whitespace-pre-wrap">
            {message.content}
          </div>
          <div className="text-xs text-neutral-400 mt-1 text-right">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </Card>
      </div>
    </div>
  );
} 
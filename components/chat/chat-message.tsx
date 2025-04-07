import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from 'react-markdown';
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
  };
  isLoading?: boolean;
}

export function ChatMessage({ message, isLoading }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn(
      "flex gap-3 p-4",
      isUser ? "bg-background" : "bg-muted/50"
    )}>
      <Avatar className="h-8 w-8">
        <AvatarFallback>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="prose dark:prose-invert max-w-none">
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          )}
        </div>
        {isLoading && (
          <div className="flex gap-1">
            <div className="animate-bounce h-2 w-2 bg-foreground/50 rounded-full" />
            <div className="animate-bounce h-2 w-2 bg-foreground/50 rounded-full delay-100" />
            <div className="animate-bounce h-2 w-2 bg-foreground/50 rounded-full delay-200" />
          </div>
        )}
      </div>
    </div>
  );
} 
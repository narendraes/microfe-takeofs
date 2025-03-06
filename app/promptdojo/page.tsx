import { ChatContainer } from '@/components/chat/chat-container';

export const metadata = {
  title: 'PromptDojo - Jira Integration',
  description: 'AI-powered chat interface for Jira data retrieval and analysis',
};

export default function PromptDojoPage() {
  return (
    <div className="container mx-auto py-6 h-[calc(100vh-4rem)]">
      <h1 className="text-2xl font-bold mb-6">PromptDojo</h1>
      <div className="h-[calc(100%-4rem)]">
        <ChatContainer />
      </div>
    </div>
  );
} 
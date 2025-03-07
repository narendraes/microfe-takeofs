import { ChatContainer } from '@/components/chat/chat-container';
import { TabsContent } from '@/components/ui/tabs';

export const metadata = {
  title: 'PromptDojo - Jira Integration',
  description: 'AI-powered chat interface for Jira data retrieval and analysis',
};

export default function PromptDojoPage() {
  return (
    <TabsContent value="promptdojo" className="space-y-4">
      <div className="container mx-auto py-6 h-[calc(100vh-4rem)]">
        <h1 className="text-2xl font-bold mb-6">PromptDojo</h1>
        <div className="h-[calc(100%-4rem)]">
          <ChatContainer />
        </div>
      </div>
    </TabsContent>
  );
} 
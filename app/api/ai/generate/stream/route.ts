import { NextRequest } from 'next/server';
import { AIServiceFactory } from '@/lib/ai/ai-service-factory';
import { ModelProvider } from '@/lib/ai/types';

export async function POST(request: NextRequest) {
  console.log('[API] AI stream request received');

  try {
    const body = await request.json();
    const { prompt, provider, config } = body;

    console.log('[API] Stream request body:', {
      provider: provider || 'default',
      promptLength: prompt.length,
      config,
    });

    const aiFactory = AIServiceFactory.getInstance();
    const service = provider ? 
      aiFactory.getService(provider as ModelProvider) : 
      aiFactory.getDefaultService();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const encoder = new TextEncoder();
          for await (const chunk of service.generateStream(prompt, config)) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        } catch (error) {
          console.error('[API] Stream Error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('[API] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate response',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
} 
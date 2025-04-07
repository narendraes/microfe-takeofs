import { NextRequest } from 'next/server';
import { AIServiceFactory } from '@/lib/ai/ai-service-factory';
import { ModelProvider } from '@/lib/ai/types';

export async function POST(request: NextRequest) {
  console.log('[API] AI generate request received');
  const startTime = performance.now();

  try {
    const body = await request.json();
    const { prompt, provider, config } = body;

    console.log('[API] Request body:', {
      provider: provider || 'default',
      promptLength: prompt.length,
      config,
    });

    const aiFactory = AIServiceFactory.getInstance();
    const service = provider ? 
      aiFactory.getService(provider as ModelProvider) : 
      aiFactory.getDefaultService();

    const response = await service.generate(prompt, config);

    console.log('[API] Response data:', {
      provider: response.provider,
      processingTime: response.processingTime.toFixed(2) + 'ms',
      responseLength: response.content.length,
    });

    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' },
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
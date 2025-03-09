import { NextRequest, NextResponse } from 'next/server';

// Timeout for Ollama API requests (45 seconds)
const OLLAMA_TIMEOUT_MS = 45000;

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  console.log('[API] Ollama generate request received');
  
  try {
    const body = await request.json();
    console.log('[API] Request body:', {
      model: body.model,
      promptLength: body.prompt?.length || 0,
      stream: body.stream,
      options: body.options ? JSON.stringify(body.options) : '{}'
    });
    
    // Create a controller for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);
    
    console.log('[API] Sending request to Ollama server');
    const fetchStartTime = performance.now();
    
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      
      const fetchEndTime = performance.now();
      const fetchTime = fetchEndTime - fetchStartTime;
      console.log(`[API] Ollama server responded in ${fetchTime.toFixed(2)}ms`);
      
      // Clear the timeout since we got a response
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`[API] Ollama server error: ${response.status} ${response.statusText}`);
        return NextResponse.json(
          { error: `Failed to connect to Ollama: ${response.status} ${response.statusText}` },
          { status: response.status }
        );
      }

      const data = await response.json();
      
      // Validate the response structure
      if (!data || typeof data.response !== 'string') {
        console.error('[API] Invalid response from Ollama server:', data);
        return NextResponse.json(
          { 
            error: 'Invalid response from Ollama server',
            // Provide a fallback response to prevent client-side errors
            response: 'Sorry, I received an invalid response. Please try again.',
            model: body.model,
            created_at: new Date().toISOString(),
            done: true
          },
          { status: 200 } // Return 200 with fallback to prevent client errors
        );
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      console.log(`[API] Total request processed in ${totalTime.toFixed(2)}ms`);
      console.log('[API] Response data:', {
        model: data.model,
        responseLength: data.response?.length || 0,
      });
      
      return NextResponse.json(data);
    } catch (fetchError) {
      // Clear the timeout
      clearTimeout(timeoutId);
      
      console.error('[API] Error fetching from Ollama server:', fetchError);
      
      // Check if Ollama is running
      try {
        const healthCheck = await fetch('http://localhost:11434/api/tags', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(2000), // Quick timeout for health check
        });
        
        if (healthCheck.ok) {
          console.log('[API] Ollama server is running but request failed');
          return NextResponse.json(
            { 
              error: 'Request to Ollama failed, but server is running',
              // Provide a fallback response
              response: 'Sorry, there was an error processing your request, but the Ollama server is running. Please try again with a simpler query.',
              model: body.model,
              created_at: new Date().toISOString(),
              done: true
            },
            { status: 200 } // Return 200 with fallback
          );
        } else {
          console.error('[API] Ollama server health check failed');
          throw new Error('Ollama server is not responding properly');
        }
      } catch (healthError) {
        console.error('[API] Ollama server health check error:', healthError);
        throw new Error('Ollama server may not be running');
      }
    }
  } catch (error) {
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    // Check if it's an abort error (timeout)
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error(`[API] Request to Ollama timed out after ${totalTime.toFixed(2)}ms`);
      return NextResponse.json(
        { 
          error: 'Request to Ollama timed out. The server might be overloaded or the model is too slow.',
          // Provide a fallback response
          response: 'Sorry, the request timed out. Please try again with a simpler query or check if the Ollama server is running properly.',
          model: 'llama3.2',
          created_at: new Date().toISOString(),
          done: true
        },
        { status: 200 } // Return 200 with fallback
      );
    }
    
    console.error(`[API] Error generating Ollama completion after ${totalTime.toFixed(2)}ms:`, error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        // Provide a fallback response
        response: 'Sorry, there was an error processing your request. Please try again later or check if the Ollama server is running properly.',
        model: 'llama3.2',
        created_at: new Date().toISOString(),
        done: true
      },
      { status: 200 } // Return 200 with fallback
    );
  }
} 
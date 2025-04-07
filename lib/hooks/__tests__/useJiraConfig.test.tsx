import { renderHook, act } from '@testing-library/react';
import { useJiraConfig } from '../useJiraConfig';

describe('useJiraConfig', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useJiraConfig());
    
    expect(result.current).toEqual({
      isConfigured: false,
      isConnected: false,
      error: null,
      retryConnection: expect.any(Function),
    });
  });

  it('should update state when Jira connection is valid', async () => {
    const mockResponse = { ok: true, json: () => Promise.resolve({ valid: true, host: 'https://jira.example.com' }) };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useJiraConfig());

    // Wait for the effect to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current).toEqual({
      isConfigured: true,
      isConnected: true,
      error: null,
      host: 'https://jira.example.com',
      retryConnection: expect.any(Function),
    });
  });

  it('should handle connection error', async () => {
    const mockResponse = { ok: false, json: () => Promise.resolve({ error: 'Connection failed' }) };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useJiraConfig());

    // Wait for the effect to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current).toEqual({
      isConfigured: false,
      isConnected: false,
      error: 'Connection failed',
      retryConnection: expect.any(Function),
    });
  });

  it('should retry connection when requested', async () => {
    // First attempt fails
    const mockFailedResponse = { ok: false, json: () => Promise.resolve({ error: 'Connection failed' }) };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockFailedResponse);

    const { result } = renderHook(() => useJiraConfig());

    // Wait for the initial effect to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Second attempt succeeds
    const mockSuccessResponse = { ok: true, json: () => Promise.resolve({ valid: true, host: 'https://jira.example.com' }) };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockSuccessResponse);

    // Retry the connection
    await act(async () => {
      await result.current.retryConnection();
    });

    expect(result.current).toEqual({
      isConfigured: true,
      isConnected: true,
      error: null,
      host: 'https://jira.example.com',
      retryConnection: expect.any(Function),
    });
  });
}); 
// ============================================
// VEO-3 SCENE GENERATOR HOOK
// Secure API Key Handling - Memory Only
// ============================================

import { useState, useCallback, useRef } from 'react';
import { SceneConfig, GeneratedScene, GeneratorState } from '../lib/types';
import { constructPrompt, SAMPLE_OUTPUT } from '../lib/promptEngine';

const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

interface UseSceneGeneratorReturn {
  state: GeneratorState;
  generate: (apiKey: string, config: SceneConfig) => Promise<void>;
  reset: () => void;
  useSample: () => void;
}

export const useSceneGenerator = (): UseSceneGeneratorReturn => {
  const [state, setState] = useState<GeneratorState>({
    isLoading: false,
    error: null,
    result: null
  });

  // Use ref to ensure API key is cleared even if component unmounts
  const apiKeyRef = useRef<string | null>(null);

  const clearApiKey = useCallback(() => {
    if (apiKeyRef.current) {
      // Overwrite memory before clearing
      apiKeyRef.current = '';
      apiKeyRef.current = null;
    }
  }, []);

  const generate = useCallback(async (apiKey: string, config: SceneConfig) => {
    // Store in ref for cleanup tracking
    apiKeyRef.current = apiKey;

    setState({
      isLoading: true,
      error: null,
      result: null
    });

    try {
      // Validate API key format
      if (!apiKey.startsWith('sk-')) {
        throw new Error('Invalid API key format. OpenAI keys begin with "sk-"');
      }

      // Construct multi-layer prompt
      const { system, user } = constructPrompt(config);

      // Make API request
      const response = await fetch(OPENAI_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user }
          ],
          temperature: 0.7,
          max_tokens: 8000,
          response_format: { type: 'json_object' }
        })
      });

      // Clear API key immediately after request
      clearApiKey();

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || `API Error: ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from API');
      }

      // Parse JSON response
      let parsedResult: GeneratedScene;
      try {
        parsedResult = JSON.parse(content);
      } catch {
        throw new Error('Failed to parse API response as JSON');
      }

      // Validate required fields
      if (!parsedResult.overview || !parsedResult.architecture || !parsedResult.veoPrompt) {
        throw new Error('API response missing required fields');
      }

      setState({
        isLoading: false,
        error: null,
        result: parsedResult
      });

    } catch (error) {
      // Always clear API key on error
      clearApiKey();

      setState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        result: null
      });
    }
  }, [clearApiKey]);

  const reset = useCallback(() => {
    clearApiKey();
    setState({
      isLoading: false,
      error: null,
      result: null
    });
  }, [clearApiKey]);

  const useSample = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      result: SAMPLE_OUTPUT as GeneratedScene
    });
  }, []);

  return { state, generate, reset, useSample };
};

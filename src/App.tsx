// ============================================
// VEO-3 SCENE GENERATOR - MAIN APPLICATION
// ============================================

import { useState, useCallback, useMemo } from 'react';
import { Clapperboard, AlertCircle, Sparkles } from 'lucide-react';
import {
  APIKeyInput,
  SceneConfigForm,
  ConsentCheckbox,
  GenerateButton,
  OutputViewer
} from './components';
import { useSceneGenerator } from './hooks/useSceneGenerator';
import { SceneConfig, SceneDuration, SceneType } from './lib/types';

const DEFAULT_CONFIG: SceneConfig = {
  duration: 5 as SceneDuration,
  sceneType: 'luxury-commercial' as SceneType,
  visualMood: '',
  location: '',
  brandReferences: ''
};

function App() {
  // State
  const [apiKey, setApiKey] = useState('');
  const [config, setConfig] = useState<SceneConfig>(DEFAULT_CONFIG);
  const [hasConsent, setHasConsent] = useState(false);

  // Generator hook
  const { state, generate, reset, useSample } = useSceneGenerator();

  // Validation
  const isFormValid = useMemo(() => {
    return (
      apiKey.trim().length > 0 &&
      config.visualMood.trim().length > 0 &&
      config.location.trim().length > 0 &&
      hasConsent
    );
  }, [apiKey, config.visualMood, config.location, hasConsent]);

  // Handlers
  const handleGenerate = useCallback(() => {
    if (isFormValid) {
      generate(apiKey, config);
      // Clear API key from state immediately after passing to generator
      setApiKey('');
    }
  }, [apiKey, config, isFormValid, generate]);

  const handleReset = useCallback(() => {
    reset();
    setApiKey('');
    setConfig(DEFAULT_CONFIG);
    setHasConsent(false);
  }, [reset]);

  const handleUseSample = useCallback(() => {
    useSample();
  }, [useSample]);

  // Render result view
  if (state.result) {
    return (
      <div className="min-h-screen bg-luxury-black">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <OutputViewer result={state.result} onReset={handleReset} />
        </div>
      </div>
    );
  }

  // Render form view
  return (
    <div className="min-h-screen bg-luxury-black">
      {/* Header */}
      <header className="border-b border-luxury-slate/50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-luxury-accent/10 rounded-lg">
              <Clapperboard className="w-6 h-6 text-luxury-accent" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-luxury-text">
                Veo-3 Scene Generator
              </h1>
              <p className="text-sm text-luxury-textMuted">
                Professional cinematic prompt engineering
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - API Key & Config */}
          <div className="space-y-8">
            {/* API Key Section */}
            <section className="bg-luxury-charcoal rounded-xl border border-luxury-slate p-6">
              <h2 className="text-lg font-medium text-luxury-text mb-4">
                Authentication
              </h2>
              <APIKeyInput
                value={apiKey}
                onChange={setApiKey}
                disabled={state.isLoading}
              />
            </section>

            {/* Scene Configuration */}
            <section className="bg-luxury-charcoal rounded-xl border border-luxury-slate p-6">
              <h2 className="text-lg font-medium text-luxury-text mb-4">
                Scene Configuration
              </h2>
              <SceneConfigForm
                config={config}
                onChange={setConfig}
                disabled={state.isLoading}
              />
            </section>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* What You Get */}
            <section className="bg-luxury-charcoal rounded-xl border border-luxury-slate p-6">
              <h2 className="text-lg font-medium text-luxury-text mb-4">
                Generated Package Includes
              </h2>
              <ul className="space-y-3 text-sm text-luxury-textMuted">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-luxury-accent rounded-full mt-2 flex-shrink-0" />
                  Scene overview with logline and specifications
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-luxury-accent rounded-full mt-2 flex-shrink-0" />
                  Complete act structure with emotional arcs
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-luxury-accent rounded-full mt-2 flex-shrink-0" />
                  Shot-by-shot breakdown with timing, camera, lens, lighting
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-luxury-accent rounded-full mt-2 flex-shrink-0" />
                  Precise timing map with tolerance verification
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-luxury-accent rounded-full mt-2 flex-shrink-0" />
                  Copy-ready Veo-3 master prompt
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-luxury-accent rounded-full mt-2 flex-shrink-0" />
                  Full JSON export for integration
                </li>
              </ul>
            </section>

            {/* Consent & Generate */}
            <section className="bg-luxury-charcoal rounded-xl border border-luxury-slate p-6 space-y-6">
              <ConsentCheckbox
                checked={hasConsent}
                onChange={setHasConsent}
                disabled={state.isLoading}
              />

              {/* Error Display */}
              {state.error && (
                <div className="flex items-start gap-3 p-4 bg-red-950/30 border border-red-900/50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-300 font-medium">
                      Generation Failed
                    </p>
                    <p className="text-xs text-red-400/80 mt-1">
                      {state.error}
                    </p>
                  </div>
                </div>
              )}

              <GenerateButton
                onClick={handleGenerate}
                disabled={!isFormValid}
                isLoading={state.isLoading}
              />

              {/* Sample Button */}
              <button
                onClick={handleUseSample}
                disabled={state.isLoading}
                className="
                  w-full flex items-center justify-center gap-2
                  px-4 py-3 rounded-lg
                  text-sm text-luxury-textMuted
                  border border-luxury-slate
                  hover:border-luxury-accent/50 hover:text-luxury-text
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                <Sparkles className="w-4 h-4" />
                View Sample Output (No API Key Required)
              </button>
            </section>

            {/* Architecture Note */}
            <div className="text-xs text-luxury-textMuted text-center space-y-1">
              <p>
                Powered by GPT-4o with multi-layer cinematic prompt engineering.
              </p>
              <p>
                API calls are made directly from your browser. No backend storage.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-luxury-slate/30 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-xs text-luxury-textMuted text-center">
            Veo-3 Scene Generator. Professional AI-powered cinematic prompt engineering.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

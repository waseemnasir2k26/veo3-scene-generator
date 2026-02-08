// ============================================
// API KEY INPUT COMPONENT
// Secure password input with visibility toggle
// ============================================

import React, { useState, useCallback } from 'react';
import { Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react';

interface APIKeyInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const APIKeyInput: React.FC<APIKeyInputProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const [showKey, setShowKey] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const toggleVisibility = useCallback(() => {
    setShowKey(prev => !prev);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-luxury-text font-medium text-sm tracking-wide">
          OpenAI API Key
        </span>
      </label>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Shield className="w-5 h-5 text-luxury-accent" />
        </div>

        <input
          type={showKey ? 'text' : 'password'}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder="sk-..."
          autoComplete="off"
          spellCheck={false}
          className={`
            w-full bg-luxury-graphite border rounded-lg
            pl-12 pr-12 py-3.5
            text-luxury-text font-mono text-sm
            placeholder:text-luxury-textMuted
            focus:outline-none focus:ring-2 focus:ring-luxury-accent/50
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            ${isFocused ? 'border-luxury-accent' : 'border-luxury-slate'}
          `}
        />

        <button
          type="button"
          onClick={toggleVisibility}
          disabled={disabled}
          className="
            absolute right-4 top-1/2 -translate-y-1/2
            text-luxury-textMuted hover:text-luxury-text
            transition-colors duration-200
            disabled:opacity-50
          "
          aria-label={showKey ? 'Hide API key' : 'Show API key'}
        >
          {showKey ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Security Notice */}
      <div className="flex items-start gap-2 p-3 bg-luxury-charcoal rounded-lg border border-luxury-slate/50">
        <Shield className="w-4 h-4 text-luxury-accent mt-0.5 flex-shrink-0" />
        <p className="text-xs text-luxury-textMuted leading-relaxed">
          Your API key is used only for this request and is never stored.
          It remains in memory only during generation and is cleared immediately after.
        </p>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-2 p-3 bg-amber-950/30 rounded-lg border border-amber-900/50">
        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-200/80 leading-relaxed">
          Do not reuse personal or permanent API keys if you are unsure.
          Consider using a dedicated key with spending limits for this tool.
        </p>
      </div>
    </div>
  );
};

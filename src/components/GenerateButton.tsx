// ============================================
// GENERATE BUTTON COMPONENT
// ============================================

import React from 'react';
import { Clapperboard, Loader2 } from 'lucide-react';

interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  onClick,
  disabled,
  isLoading
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        w-full relative overflow-hidden
        flex items-center justify-center gap-3
        px-6 py-4 rounded-lg
        font-medium text-base tracking-wide
        transition-all duration-300
        ${disabled || isLoading
          ? 'bg-luxury-slate text-luxury-textMuted cursor-not-allowed'
          : 'bg-gradient-to-r from-luxury-accent to-luxury-accentDark text-luxury-black hover:shadow-lg hover:shadow-luxury-accent/25 hover:scale-[1.02] active:scale-[0.98]'
        }
      `}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Generating Scene Package...</span>
        </>
      ) : (
        <>
          <Clapperboard className="w-5 h-5" />
          <span>Generate Veo-3 Scene</span>
        </>
      )}

      {/* Shimmer effect when loading */}
      {isLoading && (
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      )}
    </button>
  );
};

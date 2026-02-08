// ============================================
// CONSENT CHECKBOX COMPONENT
// ============================================

import React from 'react';
import { Check } from 'lucide-react';

interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const ConsentCheckbox: React.FC<ConsentCheckboxProps> = ({
  checked,
  onChange,
  disabled = false
}) => {
  return (
    <label className={`
      flex items-start gap-3 cursor-pointer group
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}>
      <div className="relative mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div className={`
          w-5 h-5 rounded border-2 flex items-center justify-center
          transition-all duration-200
          ${checked
            ? 'bg-luxury-accent border-luxury-accent'
            : 'bg-transparent border-luxury-slate group-hover:border-luxury-accent/50'
          }
        `}>
          {checked && <Check className="w-3.5 h-3.5 text-luxury-black" strokeWidth={3} />}
        </div>
      </div>
      <div className="flex-1">
        <span className="text-sm text-luxury-text leading-relaxed">
          I understand that my API key will be used only for this request and will not be stored,
          logged, or persisted in any form. I consent to the one-time use of my key for scene generation.
        </span>
      </div>
    </label>
  );
};

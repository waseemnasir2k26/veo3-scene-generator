// ============================================
// SCENE CONFIGURATION FORM COMPONENT
// ============================================

import React, { useCallback } from 'react';
import { Film, Palette, MapPin, Tag, Clock, ChevronDown } from 'lucide-react';
import {
  SceneConfig,
  SceneDuration,
  SceneType,
  SCENE_TYPE_LABELS,
  DURATION_OPTIONS
} from '../lib/types';

interface SceneConfigFormProps {
  config: SceneConfig;
  onChange: (config: SceneConfig) => void;
  disabled?: boolean;
}

export const SceneConfigForm: React.FC<SceneConfigFormProps> = ({
  config,
  onChange,
  disabled = false
}) => {
  const updateField = useCallback(<K extends keyof SceneConfig>(
    field: K,
    value: SceneConfig[K]
  ) => {
    onChange({ ...config, [field]: value });
  }, [config, onChange]);

  return (
    <div className="space-y-6">
      {/* Duration Select */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-luxury-text font-medium text-sm tracking-wide">
          <Clock className="w-4 h-4 text-luxury-accent" />
          Scene Duration
        </label>
        <div className="relative">
          <select
            value={config.duration}
            onChange={(e) => updateField('duration', Number(e.target.value) as SceneDuration)}
            disabled={disabled}
            className="
              w-full appearance-none bg-luxury-graphite border border-luxury-slate rounded-lg
              px-4 py-3.5 pr-10
              text-luxury-text text-sm
              focus:outline-none focus:ring-2 focus:ring-luxury-accent/50 focus:border-luxury-accent
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              cursor-pointer
            "
          >
            {DURATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-textMuted pointer-events-none" />
        </div>
      </div>

      {/* Scene Type Select */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-luxury-text font-medium text-sm tracking-wide">
          <Film className="w-4 h-4 text-luxury-accent" />
          Scene Type
        </label>
        <div className="relative">
          <select
            value={config.sceneType}
            onChange={(e) => updateField('sceneType', e.target.value as SceneType)}
            disabled={disabled}
            className="
              w-full appearance-none bg-luxury-graphite border border-luxury-slate rounded-lg
              px-4 py-3.5 pr-10
              text-luxury-text text-sm
              focus:outline-none focus:ring-2 focus:ring-luxury-accent/50 focus:border-luxury-accent
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              cursor-pointer
            "
          >
            {Object.entries(SCENE_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-textMuted pointer-events-none" />
        </div>
      </div>

      {/* Visual Mood Input */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-luxury-text font-medium text-sm tracking-wide">
          <Palette className="w-4 h-4 text-luxury-accent" />
          Visual Mood
        </label>
        <input
          type="text"
          value={config.visualMood}
          onChange={(e) => updateField('visualMood', e.target.value)}
          disabled={disabled}
          placeholder="e.g., Warm intimacy meeting cold precision"
          className="
            w-full bg-luxury-graphite border border-luxury-slate rounded-lg
            px-4 py-3.5
            text-luxury-text text-sm
            placeholder:text-luxury-textMuted
            focus:outline-none focus:ring-2 focus:ring-luxury-accent/50 focus:border-luxury-accent
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
          "
        />
      </div>

      {/* Location Input */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-luxury-text font-medium text-sm tracking-wide">
          <MapPin className="w-4 h-4 text-luxury-accent" />
          Location / Environment
        </label>
        <input
          type="text"
          value={config.location}
          onChange={(e) => updateField('location', e.target.value)}
          disabled={disabled}
          placeholder="e.g., Swiss watchmaking atelier at dawn"
          className="
            w-full bg-luxury-graphite border border-luxury-slate rounded-lg
            px-4 py-3.5
            text-luxury-text text-sm
            placeholder:text-luxury-textMuted
            focus:outline-none focus:ring-2 focus:ring-luxury-accent/50 focus:border-luxury-accent
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
          "
        />
      </div>

      {/* Brand References Input (Optional) */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-luxury-text font-medium text-sm tracking-wide">
          <Tag className="w-4 h-4 text-luxury-accent" />
          Brand References
          <span className="text-luxury-textMuted font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={config.brandReferences || ''}
          onChange={(e) => updateField('brandReferences', e.target.value)}
          disabled={disabled}
          placeholder="e.g., Patek Philippe, Rolex heritage films"
          className="
            w-full bg-luxury-graphite border border-luxury-slate rounded-lg
            px-4 py-3.5
            text-luxury-text text-sm
            placeholder:text-luxury-textMuted
            focus:outline-none focus:ring-2 focus:ring-luxury-accent/50 focus:border-luxury-accent
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
          "
        />
      </div>
    </div>
  );
};

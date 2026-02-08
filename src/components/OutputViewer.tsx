// ============================================
// OUTPUT VIEWER COMPONENT
// Tabs: Storyboard | Veo Prompt | JSON
// ============================================

import React, { useState, useCallback } from 'react';
import {
  Copy,
  Check,
  Film,
  FileCode,
  FileJson,
  Clock,
  Camera,
  Lightbulb,
  Music,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { GeneratedScene, OutputTab, Act, Shot } from '../lib/types';

interface OutputViewerProps {
  result: GeneratedScene;
  onReset: () => void;
}

export const OutputViewer: React.FC<OutputViewerProps> = ({ result, onReset }) => {
  const [activeTab, setActiveTab] = useState<OutputTab>('storyboard');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [expandedActs, setExpandedActs] = useState<Set<number>>(new Set([1]));

  const copyToClipboard = useCallback(async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  const toggleAct = useCallback((actNumber: number) => {
    setExpandedActs(prev => {
      const next = new Set(prev);
      if (next.has(actNumber)) {
        next.delete(actNumber);
      } else {
        next.add(actNumber);
      }
      return next;
    });
  }, []);

  const tabs: { id: OutputTab; label: string; icon: React.ReactNode }[] = [
    { id: 'storyboard', label: 'Storyboard', icon: <Film className="w-4 h-4" /> },
    { id: 'veo-prompt', label: 'Veo Prompt', icon: <FileCode className="w-4 h-4" /> },
    { id: 'json', label: 'JSON', icon: <FileJson className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-luxury-text">
          Generated Scene Package
        </h2>
        <button
          onClick={onReset}
          className="text-sm text-luxury-textMuted hover:text-luxury-accent transition-colors"
        >
          Generate Another
        </button>
      </div>

      {/* Overview Card */}
      <div className="bg-luxury-graphite rounded-lg border border-luxury-slate p-6">
        <h3 className="text-lg font-medium text-luxury-accent mb-4">
          {result.overview.title}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <span className="text-xs text-luxury-textMuted uppercase tracking-wider">Duration</span>
            <p className="text-sm text-luxury-text mt-1">{result.overview.duration}</p>
          </div>
          <div>
            <span className="text-xs text-luxury-textMuted uppercase tracking-wider">Type</span>
            <p className="text-sm text-luxury-text mt-1">{result.overview.type}</p>
          </div>
          <div>
            <span className="text-xs text-luxury-textMuted uppercase tracking-wider">Location</span>
            <p className="text-sm text-luxury-text mt-1">{result.overview.location}</p>
          </div>
          <div>
            <span className="text-xs text-luxury-textMuted uppercase tracking-wider">Shots</span>
            <p className="text-sm text-luxury-text mt-1">{result.architecture.totalShots}</p>
          </div>
        </div>
        <p className="text-sm text-luxury-textMuted italic">
          {result.overview.logline}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-luxury-slate">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-3 text-sm font-medium
              border-b-2 -mb-px transition-all duration-200
              ${activeTab === tab.id
                ? 'border-luxury-accent text-luxury-accent'
                : 'border-transparent text-luxury-textMuted hover:text-luxury-text'
              }
            `}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'storyboard' && (
          <StoryboardView
            architecture={result.architecture}
            timingMap={result.timingMap}
            qualityChecklist={result.qualityChecklist}
            expandedActs={expandedActs}
            toggleAct={toggleAct}
          />
        )}

        {activeTab === 'veo-prompt' && (
          <VeoPromptView
            prompt={result.veoPrompt}
            copied={copiedSection === 'veo'}
            onCopy={() => copyToClipboard(result.veoPrompt, 'veo')}
          />
        )}

        {activeTab === 'json' && (
          <JsonView
            data={result}
            copied={copiedSection === 'json'}
            onCopy={() => copyToClipboard(JSON.stringify(result, null, 2), 'json')}
          />
        )}
      </div>
    </div>
  );
};

// ----------------------------------------
// STORYBOARD VIEW
// ----------------------------------------
interface StoryboardViewProps {
  architecture: GeneratedScene['architecture'];
  timingMap: GeneratedScene['timingMap'];
  qualityChecklist: string[];
  expandedActs: Set<number>;
  toggleAct: (actNumber: number) => void;
}

const StoryboardView: React.FC<StoryboardViewProps> = ({
  architecture,
  timingMap,
  qualityChecklist,
  expandedActs,
  toggleAct
}) => {
  return (
    <div className="space-y-6">
      {/* Timing Map */}
      <div className="bg-luxury-charcoal rounded-lg border border-luxury-slate p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-luxury-accent" />
          <span className="text-sm font-medium text-luxury-text">Timing Map</span>
          <span className="text-xs text-luxury-textMuted ml-auto">
            {timingMap.totalRuntime} total ({timingMap.tolerance})
          </span>
        </div>
        <div className="flex gap-1">
          {timingMap.breakdown.map((segment, i) => (
            <div
              key={i}
              className="flex-1 bg-luxury-graphite rounded p-2 text-center"
            >
              <div className="text-xs text-luxury-accent">Act {segment.act}</div>
              <div className="text-xs text-luxury-textMuted mt-1">
                {segment.start} - {segment.end}
              </div>
              <div className="text-xs text-luxury-textMuted">
                {segment.shots} shots
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Acts */}
      {architecture.acts.map((act) => (
        <ActCard
          key={act.actNumber}
          act={act}
          isExpanded={expandedActs.has(act.actNumber)}
          onToggle={() => toggleAct(act.actNumber)}
        />
      ))}

      {/* Quality Checklist */}
      <div className="bg-luxury-charcoal rounded-lg border border-luxury-slate p-4">
        <span className="text-sm font-medium text-luxury-text block mb-3">
          Quality Verification
        </span>
        <ul className="space-y-2">
          {qualityChecklist.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-luxury-textMuted">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// ----------------------------------------
// ACT CARD
// ----------------------------------------
interface ActCardProps {
  act: Act;
  isExpanded: boolean;
  onToggle: () => void;
}

const ActCard: React.FC<ActCardProps> = ({ act, isExpanded, onToggle }) => {
  return (
    <div className="bg-luxury-charcoal rounded-lg border border-luxury-slate overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-luxury-graphite transition-colors"
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-luxury-accent" />
          ) : (
            <ChevronRight className="w-4 h-4 text-luxury-accent" />
          )}
          <div className="text-left">
            <span className="text-sm font-medium text-luxury-text">
              Act {act.actNumber}: {act.title}
            </span>
            <span className="text-xs text-luxury-textMuted block mt-0.5">
              {act.startTime} - {act.endTime} | {act.shots.length} shots
            </span>
          </div>
        </div>
        <span className="text-xs text-luxury-textMuted max-w-[200px] text-right hidden md:block">
          {act.emotionalArc}
        </span>
      </button>

      {isExpanded && (
        <div className="border-t border-luxury-slate divide-y divide-luxury-slate/50">
          {act.shots.map((shot) => (
            <ShotRow key={shot.shotNumber} shot={shot} />
          ))}
        </div>
      )}
    </div>
  );
};

// ----------------------------------------
// SHOT ROW
// ----------------------------------------
interface ShotRowProps {
  shot: Shot;
}

const ShotRow: React.FC<ShotRowProps> = ({ shot }) => {
  return (
    <div className="p-4 hover:bg-luxury-graphite/50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-luxury-accent text-luxury-black px-2 py-0.5 rounded">
            #{shot.shotNumber}
          </span>
          <span className="text-xs text-luxury-textMuted">
            {shot.startTime} - {shot.endTime}
          </span>
          <span className="text-xs text-luxury-textMuted">
            ({shot.durationSeconds}s)
          </span>
        </div>
      </div>

      <p className="text-sm text-luxury-text mb-3">
        {shot.description}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-luxury-accent" />
          <span className="text-luxury-textMuted">
            {shot.cameraType}, {shot.lens}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Film className="w-3.5 h-3.5 text-luxury-accent" />
          <span className="text-luxury-textMuted">
            {shot.movement}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-luxury-accent" />
          <span className="text-luxury-textMuted">
            {shot.lighting}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Music className="w-3.5 h-3.5 text-luxury-accent" />
          <span className="text-luxury-textMuted">
            {shot.soundCue}
          </span>
        </div>
      </div>

      <div className="mt-2 text-xs text-luxury-accent/80 italic">
        Intent: {shot.emotionalIntent}
      </div>
    </div>
  );
};

// ----------------------------------------
// VEO PROMPT VIEW
// ----------------------------------------
interface VeoPromptViewProps {
  prompt: string;
  copied: boolean;
  onCopy: () => void;
}

const VeoPromptView: React.FC<VeoPromptViewProps> = ({ prompt, copied, onCopy }) => {
  return (
    <div className="relative">
      <div className="absolute top-3 right-3">
        <button
          onClick={onCopy}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded text-sm
            transition-all duration-200
            ${copied
              ? 'bg-green-500/20 text-green-400'
              : 'bg-luxury-slate hover:bg-luxury-accent hover:text-luxury-black text-luxury-textMuted'
            }
          `}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Prompt
            </>
          )}
        </button>
      </div>

      <div className="bg-luxury-charcoal rounded-lg border border-luxury-slate p-6 pt-14">
        <pre className="text-sm text-luxury-text whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
          {prompt}
        </pre>
      </div>

      <p className="mt-3 text-xs text-luxury-textMuted text-center">
        This prompt is optimized for Veo-3. Copy and paste directly into your generation interface.
      </p>
    </div>
  );
};

// ----------------------------------------
// JSON VIEW
// ----------------------------------------
interface JsonViewProps {
  data: GeneratedScene;
  copied: boolean;
  onCopy: () => void;
}

const JsonView: React.FC<JsonViewProps> = ({ data, copied, onCopy }) => {
  return (
    <div className="relative">
      <div className="absolute top-3 right-3">
        <button
          onClick={onCopy}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded text-sm
            transition-all duration-200
            ${copied
              ? 'bg-green-500/20 text-green-400'
              : 'bg-luxury-slate hover:bg-luxury-accent hover:text-luxury-black text-luxury-textMuted'
            }
          `}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy JSON
            </>
          )}
        </button>
      </div>

      <div className="bg-luxury-charcoal rounded-lg border border-luxury-slate p-6 pt-14 max-h-[600px] overflow-auto">
        <pre className="text-xs text-luxury-text font-mono">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};

// ============================================
// VEO-3 PROMPT ENGINE - MULTI-LAYER SYSTEM
// ============================================

import { SceneConfig, SceneDuration, SceneType, SCENE_TYPE_LABELS } from './types';

// ----------------------------------------
// LAYER 1: SYSTEM ROLE DEFINITION
// ----------------------------------------
const SYSTEM_ROLE = `You are an elite cinematic prompt engineer specialized in Veo-3 scene generation. You think in acts, timing, shots, lenses, lighting, pacing, and emotional rhythm.

Your expertise includes:
- Professional film direction and cinematography
- Precise timing and scene architecture
- Camera grammar and movement vocabulary
- Lighting design and emotional atmosphere
- Sound design integration
- Veo-3 prompt optimization

You produce outputs that look like they were created by a professional film director with decades of experience. No chatbot-style responses. No vague language. Pure cinematic precision.`;

// ----------------------------------------
// LAYER 2: VEO-3 RESEARCH & BEST PRACTICES
// ----------------------------------------
const VEO3_KNOWLEDGE = `
VEO-3 BEST PRACTICES:
- Each shot must have clear start/end boundaries
- Camera movements should be specified with direction and speed
- Lighting conditions must be explicit (not just "good lighting")
- Emotional beats must align with visual transitions
- Sound/music cues enhance temporal anchoring
- Avoid abstract descriptions; use concrete visual language
- Lens choice affects perspective and intimacy
- Pacing rhythm: establish -> develop -> resolve per act

LONG-FORM SCENE PACING RULES:
- 3-min scenes: 2-3 acts, 8-12 shots, tight emotional arc
- 5-min scenes: 3 acts, 15-20 shots, standard three-act structure
- 10-min scenes: 3-4 acts, 25-35 shots, extended development
- 20-min scenes: 4-5 acts, 45-60 shots, episodic mini-chapters

SHOT DURATION DISCIPLINE:
- Establishing shots: 4-8 seconds
- Detail shots: 2-4 seconds
- Character moments: 5-10 seconds
- Transition shots: 2-3 seconds
- Climactic shots: 6-12 seconds

CINEMATIC CAMERA GRAMMAR:
- Wide/Master: Context and geography
- Medium: Character interaction
- Close-up: Emotion and detail
- Extreme close-up: Critical narrative beats
- POV: Subjective immersion
- Tracking: Movement and energy
- Static: Contemplation and weight
- Crane/Jib: Scale and revelation
- Handheld: Urgency and authenticity
- Dolly: Intimacy progression`;

// ----------------------------------------
// LAYER 3: SCENE ARCHITECTURE CALCULATOR
// ----------------------------------------
interface ArchitectureSpec {
  acts: number;
  shotsPerAct: number[];
  avgShotDuration: number;
}

const ARCHITECTURE_SPECS: Record<SceneDuration, ArchitectureSpec> = {
  3: { acts: 2, shotsPerAct: [5, 6], avgShotDuration: 16 },
  5: { acts: 3, shotsPerAct: [5, 8, 5], avgShotDuration: 17 },
  10: { acts: 4, shotsPerAct: [6, 10, 10, 6], avgShotDuration: 19 },
  20: { acts: 5, shotsPerAct: [8, 12, 14, 12, 8], avgShotDuration: 22 }
};

const getArchitectureInstructions = (duration: SceneDuration): string => {
  const spec = ARCHITECTURE_SPECS[duration];
  const totalShots = spec.shotsPerAct.reduce((a, b) => a + b, 0);
  const totalSeconds = duration * 60;

  return `
SCENE ARCHITECTURE REQUIREMENTS:
- Total Duration: ${duration} minutes (${totalSeconds} seconds)
- Act Count: ${spec.acts}
- Total Shots: ${totalShots}
- Shot Distribution per Act: ${spec.shotsPerAct.join(', ')}
- Average Shot Duration: ~${spec.avgShotDuration} seconds
- CRITICAL: Total runtime must be ${totalSeconds} seconds ±2 seconds

ACT STRUCTURE:
${spec.shotsPerAct.map((shots, i) => `Act ${i + 1}: ${shots} shots`).join('\n')}`;
};

// ----------------------------------------
// LAYER 4: SCENE TYPE SPECIFICATIONS
// ----------------------------------------
const SCENE_TYPE_SPECS: Record<SceneType, string> = {
  'cinematic-brand': `
CINEMATIC BRAND FILM CHARACTERISTICS:
- Emphasis on emotional storytelling over product
- Hero moments intercut with lifestyle context
- Aspirational but authentic tone
- Premium production value indicators
- Brand integration subtle but present
- Music-driven pacing with lyrical movements
- Color grading: rich, controlled, signature palette`,

  'luxury-commercial': `
LUXURY COMMERCIAL CHARACTERISTICS:
- Slow, deliberate pacing
- Extreme attention to material texture
- Shallow depth of field for product isolation
- Gold-hour or controlled studio lighting
- Minimal cuts, extended takes
- Whisper-quiet sound design punctuated by crisp details
- Color grading: warm highlights, deep shadows, jewel tones`,

  'documentary': `
DOCUMENTARY STYLE CHARACTERISTICS:
- Observational camera approach
- Natural lighting with minimal intervention
- Longer takes allowing moments to breathe
- Handheld elements for authenticity
- Interview-style framing considerations
- Ambient sound priority
- Color grading: naturalistic, slight desaturation`,

  'hyper-real-performance': `
HYPER-REAL PERFORMANCE CHARACTERISTICS:
- High frame rate capture suggestions
- Extreme slow-motion potential
- Dynamic camera movement
- Bold lighting contrasts
- Kinetic energy throughout
- Beat-synchronized cutting
- Color grading: high contrast, vivid saturation, stylized`
};

// ----------------------------------------
// LAYER 5: OUTPUT FORMAT SPECIFICATION
// ----------------------------------------
const OUTPUT_FORMAT = `
OUTPUT REQUIREMENTS:
Return a JSON object with this exact structure:

{
  "overview": {
    "title": "Scene title",
    "duration": "X minutes",
    "type": "Scene type",
    "mood": "Visual mood description",
    "location": "Location/environment",
    "logline": "One-sentence scene summary"
  },
  "architecture": {
    "totalDuration": <seconds as number>,
    "totalShots": <number>,
    "actCount": <number>,
    "acts": [
      {
        "actNumber": 1,
        "title": "Act title",
        "startTime": "00:00",
        "endTime": "01:30",
        "durationSeconds": 90,
        "emotionalArc": "Description of emotional progression",
        "shots": [
          {
            "shotNumber": 1,
            "startTime": "00:00",
            "endTime": "00:06",
            "durationSeconds": 6,
            "cameraType": "Wide establishing",
            "lens": "24mm",
            "movement": "Static with subtle drift",
            "lighting": "Golden hour backlight",
            "emotionalIntent": "Establish grandeur and aspiration",
            "soundCue": "Ambient city hum, distant music swell",
            "description": "Concrete shot description"
          }
        ]
      }
    ]
  },
  "timingMap": {
    "totalRuntime": "05:00",
    "tolerance": "±2 seconds",
    "breakdown": [
      { "act": 1, "start": "00:00", "end": "01:30", "shots": 5 }
    ]
  },
  "veoPrompt": "Complete Veo-3 ready prompt text...",
  "qualityChecklist": [
    "Timing verified within tolerance",
    "All shots have specific lens/camera/movement",
    "Emotional arc clearly defined per act"
  ]
}

CRITICAL OUTPUT RULES:
- Return ONLY valid JSON, no markdown, no explanation
- All times in MM:SS format
- Every shot must have ALL fields populated
- veoPrompt must be a single, copy-paste ready block
- No emojis, no casual language`;

// ----------------------------------------
// MASTER PROMPT CONSTRUCTOR
// ----------------------------------------
export const constructPrompt = (config: SceneConfig): { system: string; user: string } => {
  const system = `${SYSTEM_ROLE}

${VEO3_KNOWLEDGE}

${SCENE_TYPE_SPECS[config.sceneType]}

${OUTPUT_FORMAT}`;

  const user = `Generate a complete Veo-3 scene package with the following specifications:

SCENE PARAMETERS:
- Duration: ${config.duration} minutes
- Scene Type: ${SCENE_TYPE_LABELS[config.sceneType]}
- Visual Mood: ${config.visualMood}
- Location/Environment: ${config.location}
${config.brandReferences ? `- Brand References: ${config.brandReferences}` : ''}

${getArchitectureInstructions(config.duration)}

Generate the complete scene architecture, shot-by-shot breakdown, timing map, and Veo-3 master prompt. Ensure total duration is exactly ${config.duration * 60} seconds ±2 seconds.`;

  return { system, user };
};

// ----------------------------------------
// SAMPLE OUTPUT (5-MIN LUXURY SCENE)
// ----------------------------------------
export const SAMPLE_OUTPUT = {
  overview: {
    title: "The Artisan's Dawn",
    duration: "5 minutes",
    type: "Luxury Commercial",
    mood: "Warm intimacy meeting cold precision",
    location: "Swiss watchmaking atelier",
    logline: "A master horologist begins his day, where centuries of tradition meet singular dedication."
  },
  architecture: {
    totalDuration: 300,
    totalShots: 18,
    actCount: 3,
    acts: [
      {
        actNumber: 1,
        title: "The Awakening",
        startTime: "00:00",
        endTime: "01:30",
        durationSeconds: 90,
        emotionalArc: "Quiet anticipation building to purposeful clarity",
        shots: [
          {
            shotNumber: 1,
            startTime: "00:00",
            endTime: "00:08",
            durationSeconds: 8,
            cameraType: "Wide establishing",
            lens: "35mm anamorphic",
            movement: "Static, locked-off",
            lighting: "Pre-dawn blue hour, exterior light through frosted windows",
            emotionalIntent: "Establish sacred workspace before human presence",
            soundCue: "Silence. Single clock tick at 00:06",
            description: "The atelier in pre-dawn darkness. Workbenches lined with brass instruments. Frost on window panes. A single antique clock visible in deep background."
          },
          {
            shotNumber: 2,
            startTime: "00:08",
            endTime: "00:14",
            durationSeconds: 6,
            cameraType: "Extreme close-up",
            lens: "100mm macro",
            movement: "Imperceptible drift left",
            lighting: "Practical lamp edge-light, warm tungsten",
            emotionalIntent: "Reverence for tools of craft",
            soundCue: "Subtle room tone, distant footsteps approach",
            description: "Loupe resting on velvet cloth. Dust particles suspended in single beam of early light."
          },
          {
            shotNumber: 3,
            startTime: "00:14",
            endTime: "00:22",
            durationSeconds: 8,
            cameraType: "Medium wide",
            lens: "50mm",
            movement: "Slow dolly forward",
            lighting: "Side-light through door, silhouette",
            emotionalIntent: "Human arrival as ritual beginning",
            soundCue: "Door mechanism, soft footfall on wood",
            description: "Door opens. Silhouette of artisan enters frame. Pauses at threshold."
          },
          {
            shotNumber: 4,
            startTime: "00:22",
            endTime: "00:30",
            durationSeconds: 8,
            cameraType: "Close-up",
            lens: "85mm",
            movement: "Static",
            lighting: "Rembrandt lighting, key from window",
            emotionalIntent: "First glimpse of the craftsman's focused presence",
            soundCue: "Breath. Fabric movement.",
            description: "Artisan's face in profile. Eyes surveying workspace. Weathered features suggesting decades of dedication."
          },
          {
            shotNumber: 5,
            startTime: "00:30",
            endTime: "00:38",
            durationSeconds: 8,
            cameraType: "Insert detail",
            lens: "90mm tilt-shift",
            movement: "Static with focus pull",
            lighting: "Soft natural plus practical",
            emotionalIntent: "Hands as instruments of precision",
            soundCue: "Lamp switch click",
            description: "Aged hands reach for work lamp switch. Wedding band catches light. Lamp illuminates."
          },
          {
            shotNumber: 6,
            startTime: "00:38",
            endTime: "00:48",
            durationSeconds: 10,
            cameraType: "Wide profile",
            lens: "40mm",
            movement: "Subtle crane down",
            lighting: "Mixed: cold window ambient, warm practical pools",
            emotionalIntent: "Man assumes position within his domain",
            soundCue: "Chair settle, drawer slide, tools arranged",
            description: "Artisan settles at workbench. Methodical arrangement of day's tools. Each movement deliberate."
          },
          {
            shotNumber: 7,
            startTime: "00:48",
            endTime: "01:00",
            durationSeconds: 12,
            cameraType: "Extreme close-up",
            lens: "100mm macro",
            movement: "Locked",
            lighting: "Ring light through loupe",
            emotionalIntent: "Threshold moment—day's work begins",
            soundCue: "Music begins: solo cello, pianissimo",
            description: "Eye behind loupe. Iris adjusts. Reflection of watch movement visible in curved glass."
          },
          {
            shotNumber: 8,
            startTime: "01:00",
            endTime: "01:10",
            durationSeconds: 10,
            cameraType: "Over-shoulder macro",
            lens: "65mm macro",
            movement: "Static with micro-vibration dampening",
            lighting: "Direct task lighting, jeweler's lamp",
            emotionalIntent: "Immersion into microscopic world",
            soundCue: "Cello continues, room tone filtered out",
            description: "POV through loupe. Watch movement fills frame. Gears frozen in perfect arrangement."
          },
          {
            shotNumber: 9,
            startTime: "01:10",
            endTime: "01:20",
            durationSeconds: 10,
            cameraType: "Medium",
            lens: "50mm",
            movement: "Slow push",
            lighting: "Pools of warm light, darkness around edges",
            emotionalIntent: "Complete absorption in craft",
            soundCue: "Cello swells subtly, single metallic ping",
            description: "Artisan's full concentration. World outside ceases to exist. Breath held."
          },
          {
            shotNumber: 10,
            startTime: "01:20",
            endTime: "01:30",
            durationSeconds: 10,
            cameraType: "Insert",
            lens: "100mm macro",
            movement: "Imperceptible track right",
            lighting: "Edge-lit, dramatic falloff",
            emotionalIntent: "Tool as extension of will",
            soundCue: "Music sustains, tool-to-metal whisper",
            description: "Tweezers lift hairspring. Metal catches light. Precision measured in microns."
          }
        ]
      },
      {
        actNumber: 2,
        title: "The Labor",
        startTime: "01:30",
        endTime: "03:30",
        durationSeconds: 120,
        emotionalArc: "Deep focus through challenge to breakthrough",
        shots: [
          {
            shotNumber: 11,
            startTime: "01:30",
            endTime: "01:45",
            durationSeconds: 15,
            cameraType: "Wide",
            lens: "32mm",
            movement: "Slow arc right",
            lighting: "Window light grown stronger, blue hour ending",
            emotionalIntent: "Time passing within timelessness",
            soundCue: "Cello joined by viola, texture builds",
            description: "Full workshop visible. Artisan island of focus. Light shifts warmer through windows."
          },
          {
            shotNumber: 12,
            startTime: "01:45",
            endTime: "02:00",
            durationSeconds: 15,
            cameraType: "Close-up hands",
            lens: "85mm macro",
            movement: "Handheld subtle",
            lighting: "Task lamp, high key on workspace",
            emotionalIntent: "Tension of delicate operation",
            soundCue: "Music drops to single sustained note",
            description: "Both hands working in concert. Right steadies, left adjusts. Sweat bead at temple visible in edge of frame."
          },
          {
            shotNumber: 13,
            startTime: "02:00",
            endTime: "02:18",
            durationSeconds: 18,
            cameraType: "Extreme close-up",
            lens: "105mm macro with diopter",
            movement: "Locked, focus breathing",
            lighting: "Fiber optic spot lighting",
            emotionalIntent: "Critical moment of assembly",
            soundCue: "Silence except breathing",
            description: "Escape wheel placement. Tool tip guides component. Tolerance is unforgiving."
          },
          {
            shotNumber: 14,
            startTime: "02:18",
            endTime: "02:32",
            durationSeconds: 14,
            cameraType: "Reaction close-up",
            lens: "85mm",
            movement: "Static",
            lighting: "Natural with practical fill",
            emotionalIntent: "Human cost of precision",
            soundCue: "Exhale. Clock ticks resume distant.",
            description: "Face shows strain. Breath released. Micro-expression of uncertainty."
          },
          {
            shotNumber: 15,
            startTime: "02:32",
            endTime: "02:52",
            durationSeconds: 20,
            cameraType: "Insert sequence",
            lens: "100mm macro",
            movement: "Static, quick cuts within shot",
            lighting: "Consistent task lighting",
            emotionalIntent: "Momentum of expertise overcoming doubt",
            soundCue: "Music returns, building momentum",
            description: "Rapid succession: screw turns, jewel seats, spring tensions. Mastery in motion."
          },
          {
            shotNumber: 16,
            startTime: "02:52",
            endTime: "03:08",
            durationSeconds: 16,
            cameraType: "Medium profile",
            lens: "50mm",
            movement: "Imperceptible dolly back",
            lighting: "Morning light now golden through windows",
            emotionalIntent: "Satisfaction approaching",
            soundCue: "Music reaches first crescendo",
            description: "Artisan sits back slightly. Assessment. Something has been achieved."
          },
          {
            shotNumber: 17,
            startTime: "03:08",
            endTime: "03:20",
            durationSeconds: 12,
            cameraType: "Macro insert",
            lens: "100mm macro",
            movement: "Slow push",
            lighting: "Dramatic side-light",
            emotionalIntent: "Verification of success",
            soundCue: "Music sustains, anticipatory",
            description: "Completed movement in case. All components aligned. Waiting for the test."
          },
          {
            shotNumber: 18,
            startTime: "03:20",
            endTime: "03:30",
            durationSeconds: 10,
            cameraType: "Extreme close-up",
            lens: "105mm macro",
            movement: "Locked",
            lighting: "Spot on balance wheel",
            emotionalIntent: "The moment of truth",
            soundCue: "Music drops to nothing. Tick. Tick. Tick.",
            description: "Balance wheel receives impulse. Begins oscillation. Perfect rhythm established."
          }
        ]
      },
      {
        actNumber: 3,
        title: "The Completion",
        startTime: "03:30",
        endTime: "05:00",
        durationSeconds: 90,
        emotionalArc: "Quiet triumph resolving to humble continuity",
        shots: [
          {
            shotNumber: 19,
            startTime: "03:30",
            endTime: "03:45",
            durationSeconds: 15,
            cameraType: "Close-up reaction",
            lens: "85mm",
            movement: "Static with breath movement",
            lighting: "Beautiful golden hour wrap-around",
            emotionalIntent: "Private moment of achievement",
            soundCue: "Tick continues. Music: gentle resolution begins.",
            description: "Artisan's face. Hint of smile. Eyes still on movement. Pride without arrogance."
          },
          {
            shotNumber: 20,
            startTime: "03:45",
            endTime: "04:00",
            durationSeconds: 15,
            cameraType: "Wide with tilt",
            lens: "35mm",
            movement: "Crane up and back",
            lighting: "Full morning light floods space",
            emotionalIntent: "Return to world outside the work",
            soundCue: "Room tone returns. Distant street sounds. Music continues.",
            description: "Workshop transformed by full morning light. Windows blazing. Artisan small within larger context."
          },
          {
            shotNumber: 21,
            startTime: "04:00",
            endTime: "04:18",
            durationSeconds: 18,
            cameraType: "Insert beauty shot",
            lens: "90mm tilt-shift",
            movement: "Subtle rotation",
            lighting: "Glamour lighting, controlled reflections",
            emotionalIntent: "Object elevated to art",
            soundCue: "Music: solo piano enters",
            description: "Completed watch on velvet. Dial catches light. Hands precisely set. Perfect object."
          },
          {
            shotNumber: 22,
            startTime: "04:18",
            endTime: "04:35",
            durationSeconds: 17,
            cameraType: "Medium",
            lens: "50mm",
            movement: "Static",
            lighting: "Natural, unmanipulated",
            emotionalIntent: "Human behind the object",
            soundCue: "Music gentle, contemplative",
            description: "Artisan removes loupe. Rubs eyes. Human fatigue. Stands slowly."
          },
          {
            shotNumber: 23,
            startTime: "04:35",
            endTime: "04:48",
            durationSeconds: 13,
            cameraType: "Following medium",
            lens: "35mm",
            movement: "Tracking shot, smooth",
            lighting: "Window backlight, silhouette edges",
            emotionalIntent: "Ritual of closing mirrors opening",
            soundCue: "Footsteps on wood. Music resolving.",
            description: "Artisan walks to window. Looks out at day now fully begun. Stretches."
          },
          {
            shotNumber: 24,
            startTime: "04:48",
            endTime: "04:55",
            durationSeconds: 7,
            cameraType: "Close-up hands",
            lens: "85mm",
            movement: "Static",
            lighting: "Window light on hands",
            emotionalIntent: "Tools of creation at rest",
            soundCue: "Music: final phrase",
            description: "Hands rest on windowsill. Wear and skill visible. Wedding band. Light between fingers."
          },
          {
            shotNumber: 25,
            startTime: "04:55",
            endTime: "05:00",
            durationSeconds: 5,
            cameraType: "Wide final",
            lens: "24mm",
            movement: "Static",
            lighting: "Full daylight, workshop glowing",
            emotionalIntent: "Tomorrow there will be another watch",
            soundCue: "Music ends. Clock ticks remain. Fade.",
            description: "Workshop from entrance. Artisan silhouette at window. Empty workbench awaits. Tools rest. Until tomorrow."
          }
        ]
      }
    ]
  },
  timingMap: {
    totalRuntime: "05:00",
    tolerance: "±2 seconds",
    breakdown: [
      { act: 1, start: "00:00", end: "01:30", shots: 10 },
      { act: 2, start: "01:30", end: "03:30", shots: 8 },
      { act: 3, start: "03:30", end: "05:00", shots: 7 }
    ]
  },
  veoPrompt: `SCENE: THE ARTISAN'S DAWN
Duration: 5 minutes | Style: Luxury Commercial | Location: Swiss Watchmaking Atelier

VISUAL APPROACH: Warm intimacy meeting cold precision. Dawn-to-morning light progression. Macro detail work intercut with human moments. Reverent, unhurried pacing. Anamorphic characteristics where possible.

COLOR PALETTE: Pre-dawn blues transitioning through golden hour warmth. Rich wood tones. Brass and steel metallic accents. Deep shadows preserved.

---

ACT 1: THE AWAKENING [00:00-01:30]
Emotional arc: Quiet anticipation building to purposeful clarity

SHOT 1 [00:00-00:08] Wide establishing, 35mm anamorphic, locked-off. Pre-dawn atelier, workbenches with brass instruments, frost on windows, antique clock in background. Blue hour light through frosted glass. Sound: Silence, single clock tick at 00:06.

SHOT 2 [00:08-00:14] Extreme close-up, 100mm macro, imperceptible drift left. Loupe on velvet cloth, dust particles in light beam. Warm tungsten edge-light. Sound: Room tone, approaching footsteps.

SHOT 3 [00:14-00:22] Medium wide, 50mm, slow dolly forward. Door opens, artisan silhouette enters, pauses at threshold. Side-light through door. Sound: Door mechanism, soft footfall.

SHOT 4 [00:22-00:30] Close-up, 85mm, static. Artisan face in profile, surveying workspace. Rembrandt lighting from window. Weathered features. Sound: Breath, fabric movement.

SHOT 5 [00:30-00:38] Insert, 90mm tilt-shift, focus pull. Aged hands reach for lamp switch, wedding band catches light, lamp illuminates. Sound: Lamp click.

SHOT 6 [00:38-00:48] Wide profile, 40mm, subtle crane down. Artisan settles at bench, arranges tools methodically. Mixed cold window and warm practical light. Sound: Chair, drawer, tools.

SHOT 7 [00:48-01:00] Extreme close-up, 100mm macro, locked. Eye behind loupe, iris adjusts, watch movement reflected. Ring light through loupe. Sound: Solo cello begins, pianissimo.

SHOT 8 [01:00-01:10] Over-shoulder macro, 65mm, static. POV through loupe, watch movement fills frame, gears frozen in arrangement. Task lighting. Sound: Cello continues.

SHOT 9 [01:10-01:20] Medium, 50mm, slow push. Full concentration, absorption in craft. Warm light pools, darkness at edges. Sound: Cello swells, metallic ping.

SHOT 10 [01:20-01:30] Insert, 100mm macro, imperceptible track right. Tweezers lift hairspring, metal catches light. Edge-lit, dramatic falloff. Sound: Music sustains, tool whisper.

---

ACT 2: THE LABOR [01:30-03:30]
Emotional arc: Deep focus through challenge to breakthrough

SHOT 11 [01:30-01:45] Wide, 32mm, slow arc right. Full workshop, artisan as focus island, light shifting warmer. Blue hour ending. Sound: Viola joins cello.

SHOT 12 [01:45-02:00] Close-up hands, 85mm macro, subtle handheld. Both hands in concert, sweat bead at temple edge. Task lamp high key. Sound: Single sustained note.

SHOT 13 [02:00-02:18] Extreme close-up, 105mm macro with diopter, locked with focus breathing. Escape wheel placement, tool guides component. Fiber optic spot. Sound: Silence, breathing only.

SHOT 14 [02:18-02:32] Reaction close-up, 85mm, static. Face shows strain, breath released, micro-expression of uncertainty. Natural with fill. Sound: Exhale, distant clock.

SHOT 15 [02:32-02:52] Insert sequence, 100mm macro, static with quick cuts. Screw turns, jewel seats, spring tensions. Mastery in motion. Sound: Music builds momentum.

SHOT 16 [02:52-03:08] Medium profile, 50mm, imperceptible dolly back. Artisan sits back, assessment moment. Golden morning light. Sound: First crescendo.

SHOT 17 [03:08-03:20] Macro insert, 100mm, slow push. Completed movement in case, components aligned. Dramatic side-light. Sound: Music sustains.

SHOT 18 [03:20-03:30] Extreme close-up, 105mm macro, locked. Balance wheel receives impulse, begins oscillation. Spot on wheel. Sound: Music drops. Tick. Tick. Tick.

---

ACT 3: THE COMPLETION [03:30-05:00]
Emotional arc: Quiet triumph resolving to humble continuity

SHOT 19 [03:30-03:45] Close-up reaction, 85mm, static with breath. Hint of smile, eyes on movement, pride without arrogance. Golden wrap-around. Sound: Ticking, gentle resolution begins.

SHOT 20 [03:45-04:00] Wide with tilt, 35mm, crane up and back. Workshop flooded with morning light, artisan small in context. Sound: Room tone returns, street sounds.

SHOT 21 [04:00-04:18] Insert beauty shot, 90mm tilt-shift, subtle rotation. Completed watch on velvet, dial catching light, hands precise. Glamour lighting. Sound: Solo piano enters.

SHOT 22 [04:18-04:35] Medium, 50mm, static. Artisan removes loupe, rubs eyes, stands slowly. Human fatigue. Natural light. Sound: Contemplative music.

SHOT 23 [04:35-04:48] Following medium, 35mm, smooth tracking. Artisan walks to window, looks out, stretches. Window backlight. Sound: Footsteps, music resolving.

SHOT 24 [04:48-04:55] Close-up hands, 85mm, static. Hands on windowsill, wedding band, light between fingers. Window light. Sound: Final musical phrase.

SHOT 25 [04:55-05:00] Wide final, 24mm, static. Workshop from entrance, artisan silhouette at window, empty workbench awaits. Full daylight. Sound: Music ends, clock ticks, fade.

---

TECHNICAL NOTES:
- Shoot 4K minimum, 6K preferred for macro detail
- Frame rate: 24fps primary, 48fps for select slow-motion options
- Audio: Production sound for ambience, foley for tool details
- Color: Log capture, DaVinci grade targeting warm highlights, preserved blacks`,
  qualityChecklist: [
    "Total runtime verified at 300 seconds within ±2 second tolerance",
    "All 25 shots include specific lens, camera type, movement, and lighting specifications",
    "Three-act emotional arc clearly defined with distinct progression per act"
  ]
};
